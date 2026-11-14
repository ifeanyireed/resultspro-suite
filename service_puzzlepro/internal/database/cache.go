package database

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

// MemoryEntry represents an in-memory cache entry with TTL
type MemoryEntry struct {
	Value     string
	ExpiresAt time.Time
}

// ZMember represents a member with score in a sorted set
type ZMember struct {
	Member string  `json:"member"`
	Score  float64 `json:"score"`
}

// Cache provides a hybrid cache client supporting TCP go-redis, Upstash REST, and in-memory sync.Map fallback
type Cache struct {
	Client     *redis.Client
	restURL    string
	restToken  string
	env        string
	httpClient *http.Client
	memorySync sync.Map
	zsetMu     sync.RWMutex
	zsets      map[string]map[string]float64
}

var (
	GlobalCache *Cache
	cacheOnce   sync.Once
)

// ConnectRedis initializes the Redis cache service checking REDIS_URL, UPSTASH_REDIS_REST_URL/TOKEN, and REDIS_ENV
func ConnectRedis(redisURL string) *Cache {
	restURL := strings.TrimSpace(os.Getenv("UPSTASH_REDIS_REST_URL"))
	restToken := strings.TrimSpace(os.Getenv("UPSTASH_REDIS_REST_TOKEN"))
	if redisURL == "" {
		redisURL = strings.TrimSpace(os.Getenv("REDIS_URL"))
	}
	env := strings.TrimSpace(os.Getenv("REDIS_ENV"))
	if env == "" {
		env = strings.TrimSpace(os.Getenv("ENV"))
	}
	if env == "" {
		env = "production"
	}

	c := &Cache{
		restURL:    restURL,
		restToken:  restToken,
		env:        env,
		httpClient: &http.Client{Timeout: 3 * time.Second},
		zsets:      make(map[string]map[string]float64),
	}

	// 1. Try standard Redis TCP protocol if REDIS_URL is provided
	if redisURL != "" {
		opt, err := redis.ParseURL(redisURL)
		if err != nil {
			log.Printf("⚠️ Warning: Invalid REDIS_URL (%v). Evaluating Upstash REST / in-memory fallback.", err)
		} else {
			client := redis.NewClient(opt)
			ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
			if err := client.Ping(ctx).Err(); err != nil {
				log.Printf("⚠️ Warning: Could not ping Redis TCP (%v). Evaluating Upstash REST / in-memory fallback.", err)
				_ = client.Close()
			} else {
				c.Client = client
				log.Printf("⚡ [service_puzzlepro] Connected to Redis cache service via TCP protocol (env: %s).", env)
			}
			cancel()
		}
	}

	// 2. Upstash REST fallback/configuration
	if c.Client == nil && restURL != "" && restToken != "" {
		log.Printf("⚡ [service_puzzlepro] Connected to Upstash Redis cache via REST API (env: %s).", env)
	} else if c.Client == nil {
		log.Println("ℹ️ [service_puzzlepro] No external Redis connection established. Operating with in-memory sync.Map fallback.")
	}

	GlobalCache = c
	return c
}

// BuildKey constructs standardized cache keys following:
// resultspro:{env}:puzzle:{tenant_scope}:{resource}:{identifier}
func (c *Cache) BuildKey(service, tenantScope, resource, identifier string) string {
	currentEnv := "production"
	if c != nil && c.env != "" {
		currentEnv = c.env
	}
	cleanScope := strings.ToLower(strings.TrimSpace(tenantScope))
	if cleanScope == "" {
		cleanScope = "global"
	}
	cleanService := strings.ToLower(strings.TrimSpace(service))
	if cleanService == "" || cleanService == "puzzlepro" {
		cleanService = "puzzle"
	}
	cleanResource := strings.ToLower(strings.TrimSpace(resource))
	cleanId := strings.ToLower(strings.TrimSpace(identifier))
	return fmt.Sprintf("resultspro:%s:%s:%s:%s:%s", currentEnv, cleanService, cleanScope, cleanResource, cleanId)
}

// Status returns current Redis connection state: ok, degraded, or down
func (c *Cache) Status(ctx context.Context) string {
	if c == nil {
		return "down"
	}
	if c.Client != nil {
		pingCtx, cancel := context.WithTimeout(ctx, 1*time.Second)
		defer cancel()
		if err := c.Client.Ping(pingCtx).Err(); err == nil {
			return "ok"
		}
	}
	if c.restURL != "" && c.restToken != "" {
		pingCtx, cancel := context.WithTimeout(ctx, 1*time.Second)
		defer cancel()
		if _, err := c.execCommand(pingCtx, []interface{}{"PING"}); err == nil {
			return "ok"
		}
	}
	return "degraded" // in-memory fallback operational
}

// Get retrieves a cached string by key (Redis TCP -> Upstash REST -> Memory Fallback)
func (c *Cache) Get(ctx context.Context, key string) (string, bool) {
	if c == nil {
		return "", false
	}

	// 1. Try Redis TCP
	if c.Client != nil {
		val, err := c.Client.Get(ctx, key).Result()
		if err == nil && val != "" {
			return val, true
		}
	}

	// 2. Try Upstash REST
	if c.restURL != "" && c.restToken != "" {
		cmd := []interface{}{"GET", key}
		val, err := c.execCommand(ctx, cmd)
		if err == nil && val != nil {
			if strVal, ok := val.(string); ok && strVal != "" {
				return strVal, true
			}
		}
	}

	// 3. Memory Fallback
	if raw, ok := c.memorySync.Load(key); ok {
		entry := raw.(MemoryEntry)
		if time.Now().Before(entry.ExpiresAt) {
			return entry.Value, true
		}
		c.memorySync.Delete(key)
	}

	return "", false
}

// Set stores a string in Redis with a specified expiration duration
func (c *Cache) Set(ctx context.Context, key string, value string, expiration time.Duration) {
	if c == nil {
		return
	}

	ttlSeconds := int(expiration.Seconds())
	if ttlSeconds <= 0 {
		ttlSeconds = 3600
	}

	// 1. Redis TCP
	if c.Client != nil {
		_ = c.Client.Set(ctx, key, value, expiration).Err()
	}

	// 2. Upstash REST
	if c.restURL != "" && c.restToken != "" {
		cmd := []interface{}{"SET", key, value, "EX", ttlSeconds}
		_, _ = c.execCommand(ctx, cmd)
	}

	// 3. Memory Fallback
	c.memorySync.Store(key, MemoryEntry{
		Value:     value,
		ExpiresAt: time.Now().Add(expiration),
	})
}

// Del removes one or more keys from cache
func (c *Cache) Del(ctx context.Context, keys ...string) {
	if c == nil || len(keys) == 0 {
		return
	}

	for _, k := range keys {
		c.memorySync.Delete(k)
	}

	if c.Client != nil {
		_ = c.Client.Del(ctx, keys...).Err()
	}

	if c.restURL != "" && c.restToken != "" {
		for _, k := range keys {
			_, _ = c.execCommand(ctx, []interface{}{"DEL", k})
		}
	}
}

// Delete is an alias for Del
func (c *Cache) Delete(ctx context.Context, key string) error {
	c.Del(ctx, key)
	return nil
}

// RateLimit checks and increments an atomic sliding-window counter
func (c *Cache) RateLimit(ctx context.Context, key string, limit int, windowSeconds int) (bool, int, error) {
	if c == nil {
		return true, limit, nil
	}

	// 1. Redis TCP Pipeline
	if c.Client != nil {
		pipe := c.Client.Pipeline()
		incrCmd := pipe.Incr(ctx, key)
		pipe.Expire(ctx, key, time.Duration(windowSeconds)*time.Second)
		_, err := pipe.Exec(ctx)
		if err == nil {
			current := int(incrCmd.Val())
			remaining := limit - current
			if remaining < 0 {
				remaining = 0
			}
			return current <= limit, remaining, nil
		}
	}

	// 2. Upstash REST Pipeline
	if c.restURL != "" && c.restToken != "" {
		pipelineURL := fmt.Sprintf("%s/pipeline", strings.TrimRight(c.restURL, "/"))
		commands := [][]interface{}{
			{"INCR", key},
			{"EXPIRE", key, windowSeconds},
		}
		payload, err := json.Marshal(commands)
		if err == nil {
			req, err := http.NewRequestWithContext(ctx, "POST", pipelineURL, bytes.NewReader(payload))
			if err == nil {
				req.Header.Set("Authorization", "Bearer "+c.restToken)
				req.Header.Set("Content-Type", "application/json")
				resp, err := c.httpClient.Do(req)
				if err == nil {
					defer resp.Body.Close()
					var results []struct {
						Result int `json:"result"`
					}
					if json.NewDecoder(resp.Body).Decode(&results) == nil && len(results) > 0 {
						current := results[0].Result
						remaining := limit - current
						if remaining < 0 {
							remaining = 0
						}
						return current <= limit, remaining, nil
					}
				}
			}
		}
	}

	// 3. Memory Fallback
	now := time.Now()
	raw, ok := c.memorySync.Load(key)
	currentCount := 1
	if ok {
		entry := raw.(MemoryEntry)
		if now.Before(entry.ExpiresAt) {
			var count int
			fmt.Sscanf(entry.Value, "%d", &count)
			currentCount = count + 1
		}
	}
	c.memorySync.Store(key, MemoryEntry{
		Value:     fmt.Sprintf("%d", currentCount),
		ExpiresAt: now.Add(time.Duration(windowSeconds) * time.Second),
	})

	remaining := limit - currentCount
	if remaining < 0 {
		remaining = 0
	}
	return currentCount <= limit, remaining, nil
}

// ============================================================================
// XP LEADERBOARD HELPERS (Sorted Set: ZADD, ZREVRANGE, ZREVRANK)
// ============================================================================

// ZAdd adds or updates a member score in a Redis Sorted Set
func (c *Cache) ZAdd(ctx context.Context, key string, score float64, member string) error {
	if c == nil || key == "" || member == "" {
		return nil
	}

	// 1. In-memory sorted set storage
	c.zsetMu.Lock()
	if c.zsets == nil {
		c.zsets = make(map[string]map[string]float64)
	}
	if _, exists := c.zsets[key]; !exists {
		c.zsets[key] = make(map[string]float64)
	}
	c.zsets[key][member] = score
	c.zsetMu.Unlock()

	// 2. Redis TCP
	if c.Client != nil {
		_ = c.Client.ZAdd(ctx, key, redis.Z{Score: score, Member: member}).Err()
	}

	// 3. Upstash REST
	if c.restURL != "" && c.restToken != "" {
		_, _ = c.execCommand(ctx, []interface{}{"ZADD", key, score, member})
	}

	return nil
}

// ZIncrBy increments a member score in a Redis Sorted Set
func (c *Cache) ZIncrBy(ctx context.Context, key string, increment float64, member string) (float64, error) {
	if c == nil || key == "" || member == "" {
		return increment, nil
	}

	c.zsetMu.Lock()
	if c.zsets == nil {
		c.zsets = make(map[string]map[string]float64)
	}
	if _, exists := c.zsets[key]; !exists {
		c.zsets[key] = make(map[string]float64)
	}
	newScore := c.zsets[key][member] + increment
	c.zsets[key][member] = newScore
	c.zsetMu.Unlock()

	if c.Client != nil {
		res, err := c.Client.ZIncrBy(ctx, key, increment, member).Result()
		if err == nil {
			return res, nil
		}
	}

	if c.restURL != "" && c.restToken != "" {
		val, err := c.execCommand(ctx, []interface{}{"ZINCRBY", key, increment, member})
		if err == nil && val != nil {
			if s, err := strconv.ParseFloat(fmt.Sprintf("%v", val), 64); err == nil {
				return s, nil
			}
		}
	}

	return newScore, nil
}

// ZRevRange returns members ordered from highest to lowest score
func (c *Cache) ZRevRange(ctx context.Context, key string, start, stop int64) ([]string, error) {
	membersWithScores, err := c.ZRevRangeWithScores(ctx, key, start, stop)
	if err != nil {
		return nil, err
	}
	result := make([]string, len(membersWithScores))
	for i, m := range membersWithScores {
		result[i] = m.Member
	}
	return result, nil
}

// ZRevRangeWithScores returns members with scores ordered by score descending
func (c *Cache) ZRevRangeWithScores(ctx context.Context, key string, start, stop int64) ([]ZMember, error) {
	if c == nil || key == "" {
		return []ZMember{}, nil
	}

	// 1. Redis TCP
	if c.Client != nil {
		res, err := c.Client.ZRevRangeWithScores(ctx, key, start, stop).Result()
		if err == nil && len(res) > 0 {
			members := make([]ZMember, len(res))
			for i, z := range res {
				members[i] = ZMember{
					Member: fmt.Sprintf("%v", z.Member),
					Score:  z.Score,
				}
			}
			return members, nil
		}
	}

	// 2. Upstash REST
	if c.restURL != "" && c.restToken != "" {
		val, err := c.execCommand(ctx, []interface{}{"ZREVRANGE", key, start, stop, "WITHSCORES"})
		if err == nil && val != nil {
			if rawArr, ok := val.([]interface{}); ok && len(rawArr) > 0 {
				var members []ZMember
				for i := 0; i+1 < len(rawArr); i += 2 {
					mStr := fmt.Sprintf("%v", rawArr[i])
					scoreStr := fmt.Sprintf("%v", rawArr[i+1])
					scoreVal, _ := strconv.ParseFloat(scoreStr, 64)
					members = append(members, ZMember{Member: mStr, Score: scoreVal})
				}
				return members, nil
			}
		}
	}

	// 3. Memory Fallback
	c.zsetMu.RLock()
	defer c.zsetMu.RUnlock()

	itemMap, exists := c.zsets[key]
	if !exists || len(itemMap) == 0 {
		return []ZMember{}, nil
	}

	type memberScore struct {
		member string
		score  float64
	}
	var pairs []memberScore
	for m, s := range itemMap {
		pairs = append(pairs, memberScore{member: m, score: s})
	}

	sort.Slice(pairs, func(i, j int) bool {
		if pairs[i].score == pairs[j].score {
			return pairs[i].member < pairs[j].member
		}
		return pairs[i].score > pairs[j].score
	})

	total := int64(len(pairs))
	if start < 0 {
		start = total + start
	}
	if start < 0 {
		start = 0
	}
	if stop < 0 {
		stop = total + stop
	}
	if stop >= total {
		stop = total - 1
	}
	if start > stop || start >= total {
		return []ZMember{}, nil
	}

	var results []ZMember
	for i := start; i <= stop; i++ {
		results = append(results, ZMember{
			Member: pairs[i].member,
			Score:  pairs[i].score,
		})
	}

	return results, nil
}

// ZRevRank returns 0-based rank of member ordered by score descending (0 = highest score)
func (c *Cache) ZRevRank(ctx context.Context, key string, member string) (int64, bool, error) {
	if c == nil || key == "" || member == "" {
		return 0, false, nil
	}

	// 1. Redis TCP
	if c.Client != nil {
		rank, err := c.Client.ZRevRank(ctx, key, member).Result()
		if err == nil {
			return rank, true, nil
		}
		if err == redis.Nil {
			return 0, false, nil
		}
	}

	// 2. Upstash REST
	if c.restURL != "" && c.restToken != "" {
		val, err := c.execCommand(ctx, []interface{}{"ZREVRANK", key, member})
		if err == nil && val != nil {
			switch v := val.(type) {
			case float64:
				return int64(v), true, nil
			case int64:
				return v, true, nil
			case int:
				return int64(v), true, nil
			}
		}
	}

	// 3. Memory Fallback
	c.zsetMu.RLock()
	defer c.zsetMu.RUnlock()

	itemMap, exists := c.zsets[key]
	if !exists {
		return 0, false, nil
	}

	type memberScore struct {
		member string
		score  float64
	}
	var pairs []memberScore
	for m, s := range itemMap {
		pairs = append(pairs, memberScore{member: m, score: s})
	}

	sort.Slice(pairs, func(i, j int) bool {
		if pairs[i].score == pairs[j].score {
			return pairs[i].member < pairs[j].member
		}
		return pairs[i].score > pairs[j].score
	})

	for idx, p := range pairs {
		if p.member == member {
			return int64(idx), true, nil
		}
	}

	return 0, false, nil
}

// ============================================================================
// DAILY CODING STREAK TRACKER
// ============================================================================

// IncrStreak registers student coding activity and increments or maintains daily streak count
func (c *Cache) IncrStreak(ctx context.Context, tenantScope, studentID string) (int, error) {
	if c == nil || studentID == "" {
		return 1, nil
	}

	keyStreak := c.BuildKey("puzzle", tenantScope, "streak", studentID)
	keyLastDate := c.BuildKey("puzzle", tenantScope, "streak_last_date", studentID)

	today := time.Now().UTC().Format("2006-01-02")
	yesterday := time.Now().UTC().AddDate(0, 0, -1).Format("2006-01-02")

	lastDate, hasDate := c.Get(ctx, keyLastDate)
	streakStr, hasStreak := c.Get(ctx, keyStreak)

	currentStreak := 0
	if hasStreak {
		currentStreak, _ = strconv.Atoi(streakStr)
	}

	// Case 1: Already active today -> keep existing streak
	if hasDate && lastDate == today {
		if currentStreak <= 0 {
			currentStreak = 1
			c.Set(ctx, keyStreak, "1", 30*24*time.Hour)
		}
		return currentStreak, nil
	}

	// Case 2: Active yesterday -> consecutive streak increment
	if hasDate && lastDate == yesterday {
		newStreak := currentStreak + 1
		c.Set(ctx, keyStreak, strconv.Itoa(newStreak), 30*24*time.Hour)
		c.Set(ctx, keyLastDate, today, 30*24*time.Hour)
		return newStreak, nil
	}

	// Case 3: First day or streak reset (> 1 day inactivity)
	newStreak := 1
	c.Set(ctx, keyStreak, "1", 30*24*time.Hour)
	c.Set(ctx, keyLastDate, today, 30*24*time.Hour)
	return newStreak, nil
}

// GetStreak returns active daily streak for a student (returns 0 if expired past yesterday)
func (c *Cache) GetStreak(ctx context.Context, tenantScope, studentID string) int {
	if c == nil || studentID == "" {
		return 0
	}

	keyStreak := c.BuildKey("puzzle", tenantScope, "streak", studentID)
	keyLastDate := c.BuildKey("puzzle", tenantScope, "streak_last_date", studentID)

	today := time.Now().UTC().Format("2006-01-02")
	yesterday := time.Now().UTC().AddDate(0, 0, -1).Format("2006-01-02")

	lastDate, hasDate := c.Get(ctx, keyLastDate)
	if !hasDate {
		return 0
	}

	// Broken streak if last active before yesterday
	if lastDate != today && lastDate != yesterday {
		return 0
	}

	streakStr, hasStreak := c.Get(ctx, keyStreak)
	if !hasStreak {
		return 1
	}
	s, _ := strconv.Atoi(streakStr)
	if s <= 0 {
		return 1
	}
	return s
}

// ============================================================================
// INTERNAL UPSTASH REST HELPER
// ============================================================================

func (c *Cache) execCommand(ctx context.Context, cmd []interface{}) (interface{}, error) {
	if c.restURL == "" || c.restToken == "" {
		return nil, fmt.Errorf("upstash rest not configured")
	}

	payload, err := json.Marshal(cmd)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", c.restURL, bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.restToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var res struct {
		Result interface{} `json:"result"`
		Error  string      `json:"error"`
	}
	if err := json.Unmarshal(body, &res); err != nil {
		return nil, err
	}
	if res.Error != "" {
		return nil, fmt.Errorf("upstash redis error: %s", res.Error)
	}
	return res.Result, nil
}

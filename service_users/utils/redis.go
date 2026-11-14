package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// RedisClient provides a high-performance Upstash REST and in-memory fallback cache client
type RedisClient struct {
	restURL    string
	restToken  string
	env        string
	httpClient *http.Client
	memorySync sync.Map
}

type memoryEntry struct {
	value     string
	expiresAt time.Time
}

var (
	GlobalRedis *RedisClient
	redisOnce   sync.Once
)

// InitRedis initializes the global Redis client
func InitRedis() {
	redisOnce.Do(func() {
		restURL := strings.TrimSpace(os.Getenv("UPSTASH_REDIS_REST_URL"))
		if restURL == "" {
			restURL = strings.TrimSpace(os.Getenv("KV_REST_API_URL"))
		}
		restToken := strings.TrimSpace(os.Getenv("UPSTASH_REDIS_REST_TOKEN"))
		if restToken == "" {
			restToken = strings.TrimSpace(os.Getenv("KV_REST_API_TOKEN"))
		}
		env := strings.TrimSpace(os.Getenv("REDIS_ENV"))
		if env == "" {
			env = strings.TrimSpace(os.Getenv("ENV"))
		}
		if env == "" {
			env = "production"
		}

		GlobalRedis = &RedisClient{
			restURL:   restURL,
			restToken: restToken,
			env:       env,
			httpClient: &http.Client{
				Timeout: 3 * time.Second,
			},
		}

		if restURL != "" && restToken != "" {
			log.Printf("⚡ [service_users] Upstash Redis client initialized for environment: %s", env)
		} else {
			log.Printf("ℹ️ [service_users] UPSTASH_REDIS_REST_URL not configured. Operating in local in-memory fallback mode.")
		}
	})
}

// BuildRedisKey formats keys according to the standardized naming convention:
// resultspro:{env}:{service}:{tenant_scope}:{resource}:{identifier}
func (c *RedisClient) BuildKey(service, tenantScope, resource, identifier string) string {
	cleanScope := strings.ToLower(strings.TrimSpace(tenantScope))
	if cleanScope == "" {
		cleanScope = "global"
	}
	cleanService := strings.ToLower(strings.TrimSpace(service))
	cleanResource := strings.ToLower(strings.TrimSpace(resource))
	cleanId := strings.ToLower(strings.TrimSpace(identifier))
	return fmt.Sprintf("resultspro:%s:%s:%s:%s:%s", c.env, cleanService, cleanScope, cleanResource, cleanId)
}

// Get retrieves a cached string by key (Upstash -> Memory Fallback)
func (c *RedisClient) Get(ctx context.Context, key string) (string, bool) {
	if c == nil {
		return "", false
	}

	// 1. Upstash REST
	if c.restURL != "" && c.restToken != "" {
		cmd := []interface{}{"GET", key}
		val, err := c.execCommand(ctx, cmd)
		if err == nil && val != nil {
			if strVal, ok := val.(string); ok && strVal != "" {
				return strVal, true
			}
		}
	}

	// 2. Memory Fallback
	if raw, ok := c.memorySync.Load(key); ok {
		entry := raw.(memoryEntry)
		if time.Now().Before(entry.expiresAt) {
			return entry.value, true
		}
		c.memorySync.Delete(key)
	}

	return "", false
}

// Set stores a string in Redis with a TTL in seconds
func (c *RedisClient) Set(ctx context.Context, key string, value string, ttlSeconds int) error {
	if c == nil {
		return nil
	}

	// 1. Upstash REST
	if c.restURL != "" && c.restToken != "" {
		cmd := []interface{}{"SET", key, value, "EX", ttlSeconds}
		_, _ = c.execCommand(ctx, cmd)
	}

	// 2. In-memory fast tier
	c.memorySync.Store(key, memoryEntry{
		value:     value,
		expiresAt: time.Now().Add(time.Duration(ttlSeconds) * time.Second),
	})

	return nil
}

// Delete removes a key from cache
func (c *RedisClient) Delete(ctx context.Context, key string) error {
	if c == nil {
		return nil
	}
	c.memorySync.Delete(key)

	if c.restURL != "" && c.restToken != "" {
		cmd := []interface{}{"DEL", key}
		_, _ = c.execCommand(ctx, cmd)
	}
	return nil
}

// RateLimit checks and increments an atomic sliding-window counter
func (c *RedisClient) RateLimit(ctx context.Context, key string, limit int, windowSeconds int) (bool, int, error) {
	if c == nil {
		return true, limit, nil
	}

	// 1. Upstash Pipeline REST
	if c.restURL != "" && c.restToken != "" {
		pipelineURL := fmt.Sprintf("%s/pipeline", c.restURL)
		commands := [][]interface{}{
			{"INCR", key},
			{"EXPIRE", key, windowSeconds},
		}
		payload, _ := json.Marshal(commands)
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

	// 2. Memory Fallback
	now := time.Now()
	raw, ok := c.memorySync.Load(key)
	currentCount := 1
	if ok {
		entry := raw.(memoryEntry)
		if now.Before(entry.expiresAt) {
			var count int
			fmt.Sscanf(entry.value, "%d", &count)
			currentCount = count + 1
		}
	}
	c.memorySync.Store(key, memoryEntry{
		value:     fmt.Sprintf("%d", currentCount),
		expiresAt: now.Add(time.Duration(windowSeconds) * time.Second),
	})

	remaining := limit - currentCount
	if remaining < 0 {
		remaining = 0
	}
	return currentCount <= limit, remaining, nil
}

func (c *RedisClient) execCommand(ctx context.Context, cmd []interface{}) (interface{}, error) {
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
		return nil, fmt.Errorf("redis error: %s", res.Error)
	}
	return res.Result, nil
}

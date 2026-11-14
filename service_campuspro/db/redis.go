package db

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

// RedisClient provides high-performance Upstash REST and in-memory fallback cache client
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
			log.Printf("⚡ [service_campuspro] Upstash Redis client initialized for environment: %s", env)
		} else {
			log.Printf("ℹ️ [service_campuspro] UPSTASH_REDIS_REST_URL not configured. Operating in local in-memory fallback mode.")
		}
	})
}

// BuildKey formats keys according to the standardized naming convention:
// resultspro:{env}:campus:{tenant_scope}:{resource}:{identifier}
func (c *RedisClient) BuildKey(tenantScope, resource, identifier string) string {
	cleanScope := strings.ToLower(strings.TrimSpace(tenantScope))
	if cleanScope == "" {
		cleanScope = "global"
	}
	cleanResource := strings.ToLower(strings.TrimSpace(resource))
	cleanId := strings.ToLower(strings.TrimSpace(identifier))
	return fmt.Sprintf("resultspro:%s:campus:%s:%s:%s", c.env, cleanScope, cleanResource, cleanId)
}

// Get retrieves a cached string by key (Upstash -> Memory Fallback)
func (c *RedisClient) Get(ctx context.Context, key string) (string, bool) {
	if c == nil {
		return "", false
	}

	if c.restURL != "" && c.restToken != "" {
		cmd := []interface{}{"GET", key}
		val, err := c.execCommand(ctx, cmd)
		if err == nil && val != nil {
			if strVal, ok := val.(string); ok && strVal != "" {
				return strVal, true
			}
		}
	}

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

	if c.restURL != "" && c.restToken != "" {
		cmd := []interface{}{"SET", key, value, "EX", ttlSeconds}
		_, _ = c.execCommand(ctx, cmd)
	}

	c.memorySync.Store(key, memoryEntry{
		value:     value,
		expiresAt: time.Now().Add(time.Duration(ttlSeconds) * time.Second),
	})

	return nil
}

// GetJSON retrieves a value from cache and unmarshals it into dest
func (c *RedisClient) GetJSON(ctx context.Context, key string, dest interface{}) bool {
	raw, ok := c.Get(ctx, key)
	if !ok || raw == "" {
		return false
	}
	if err := json.Unmarshal([]byte(raw), dest); err != nil {
		return false
	}
	return true
}

// SetJSON serializes a value to JSON and stores it in cache
func (c *RedisClient) SetJSON(ctx context.Context, key string, value interface{}, ttlSeconds int) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return c.Set(ctx, key, string(data), ttlSeconds)
}

// Delete removes a key
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

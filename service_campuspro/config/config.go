package config

import (
	"os"
	"strings"
)

var (
	Port                string
	DatabaseURL         string
	JWTSecret           string
	UpstashRedisRestURL string
	UpstashRedisToken   string
	RedisEnv            string
)

func InitConfig() {
	Port = os.Getenv("PORT")
	if Port == "" {
		Port = "7008"
	}

	DatabaseURL = os.Getenv("DATABASE_URL")
	if DatabaseURL == "" {
		DatabaseURL = "postgres://postgres:postgres@localhost:5432/resultspro?sslmode=disable"
	}

	JWTSecret = os.Getenv("JWT_SECRET")
	if JWTSecret == "" {
		JWTSecret = "resultspro-central-secret-key-change-in-production"
	}

	UpstashRedisRestURL = strings.TrimSpace(os.Getenv("UPSTASH_REDIS_REST_URL"))
	UpstashRedisToken = strings.TrimSpace(os.Getenv("UPSTASH_REDIS_REST_TOKEN"))
	RedisEnv = strings.TrimSpace(os.Getenv("REDIS_ENV"))
	if RedisEnv == "" {
		RedisEnv = strings.TrimSpace(os.Getenv("ENV"))
	}
	if RedisEnv == "" {
		RedisEnv = "production"
	}
}

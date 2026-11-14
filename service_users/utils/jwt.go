package utils

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"service_users.resultspro.ng/config"
)

var ErrTokenBlacklisted = errors.New("token has been revoked")

func GenerateAccessToken(userID string, roles []string, customClaims map[string]interface{}) (string, error) {
	claims := jwt.MapClaims{
		"jti":   uuid.New().String(),
		"sub":   userID,
		"roles": roles,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // 24 hours access token
		"iat":   time.Now().Unix(),
		"iss":   "service_users.resultspro.ng",
	}
	for k, v := range customClaims {
		claims[k] = v
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.JWTSecret))
}

func GenerateRefreshToken() (string, error) {
	return GenerateRandomString(48)
}

// IsTokenBlacklisted checks whether a JWT ID (jti) is in the Redis revocation blacklist
func IsTokenBlacklisted(ctx context.Context, jti string) bool {
	if jti == "" {
		return false
	}
	if GlobalRedis == nil {
		InitRedis()
	}
	if GlobalRedis == nil {
		return false
	}
	key := GlobalRedis.BuildKey("users", "global", "token_blacklist", jti)
	val, ok := GlobalRedis.Get(ctx, key)
	return ok && val != ""
}

// BlacklistToken adds a JWT ID (jti) to the Redis revocation blacklist with a given TTL in seconds
func BlacklistToken(ctx context.Context, jti string, ttlSeconds int) error {
	if jti == "" {
		return nil
	}
	if GlobalRedis == nil {
		InitRedis()
	}
	if GlobalRedis == nil {
		return nil
	}
	if ttlSeconds <= 0 {
		ttlSeconds = 86400 // Default 24 hours
	}
	key := GlobalRedis.BuildKey("users", "global", "token_blacklist", jti)
	return GlobalRedis.Set(ctx, key, "revoked", ttlSeconds)
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JWTSecret), nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}

	// Check token blacklist in Redis for revoked JWT IDs (jti)
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if jti, ok := claims["jti"].(string); ok && jti != "" {
			if IsTokenBlacklisted(context.Background(), jti) {
				return nil, ErrTokenBlacklisted
			}
		}
	}

	return token, nil
}


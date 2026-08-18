package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"service_users.resultspro.ng/config"
)

func GenerateAccessToken(userID string, roles []string) (string, error) {
	claims := jwt.MapClaims{
		"sub":   userID,
		"roles": roles,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // 24 hours access token
		"iat":   time.Now().Unix(),
		"iss":   "service_users.resultspro.ng",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.JWTSecret))
}

func GenerateRefreshToken() (string, error) {
	return GenerateRandomString(48)
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JWTSecret), nil
	})
}

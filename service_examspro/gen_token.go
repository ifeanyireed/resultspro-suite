package main

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
)

func main() {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "test-user-id",
		"coin_balance": 100,
	})
	tokenString, _ := token.SignedString([]byte("super-secret-key-123"))
	fmt.Println(tokenString)
}

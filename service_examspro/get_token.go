package main

import (
	"fmt"
	"time"
	"github.com/golang-jwt/jwt/v5"
)

func main() {
	secret := "resultspro-central-secret-key-change-in-production"
	claims := jwt.MapClaims{
		"sub":      "bfb51c68-ccb0-401f-b58f-27fd41c6a856",
		"email":    "superadmin@resultspro.ng",
		"role":     "SUPER_ADMIN", // Wait, is it ADMIN or SUPER_ADMIN?
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte(secret))
	fmt.Println(tokenString)
}

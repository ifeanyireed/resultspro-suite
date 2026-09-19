package main

import (
	"fmt"
	"time"
	"github.com/golang-jwt/jwt/v5"
)

func main() {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":           "8d3a7776-5d21-4f1e-9a6d-e4c1d63e9f02",
		"email":         "tenant-admin@example.edu",
		"tenant_domain": "skillupacademy.resultspro.ng",
		"exp":           time.Now().Add(time.Hour * 24).Unix(),
		"roles":         []string{"tenant-admin"},
	})
	tokenString, _ := token.SignedString([]byte("resultspro-central-secret-key-change-in-production"))
	fmt.Println(tokenString)
}

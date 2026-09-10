package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	hash := "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i"
	passwords := []string{"password", "password123", "admin", "admin123", "123456", "secret", "resultspro", "12345678"}

	for _, p := range passwords {
		err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(p))
		if err == nil {
			fmt.Println("Found password:", p)
			return
		}
	}
	fmt.Println("Not found in common list.")
}

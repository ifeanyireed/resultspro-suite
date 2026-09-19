package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	hash := "$2a$10$w09uM0oR1Fh0y8t7/8xOouZ0tL0M7R.W1GzC3A.Xn7P3.hD9R/EWe"
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte("Password123!"))
	if err != nil {
		fmt.Println("No match:", err)
	} else {
		fmt.Println("Match!")
	}
}

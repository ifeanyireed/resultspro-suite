package main

import (
	"log"
	"golang.org/x/crypto/bcrypt"
	"service_users.resultspro.ng/db"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	db.Connect()
	
	bytes, _ := bcrypt.GenerateFromPassword([]byte("Password123!"), bcrypt.DefaultCost)
	
	_, err := db.DB.Exec("UPDATE users SET password_hash = ? WHERE email = 'resultsprong@gmail.com'", string(bytes))
	if err != nil {
		log.Fatalf("Update failed: %v", err)
	}
	log.Println("Password reset to Password123!")
}

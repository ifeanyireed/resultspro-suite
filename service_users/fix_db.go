package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("DB error: %v", err)
	}
	defer db.Close()
	
	bytes, _ := bcrypt.GenerateFromPassword([]byte("Password123!"), 10)
	hash := string(bytes)
	
	updates := map[string]string{
		"bfb51c68-ccb0-401f-b58f-27fd41c6a856": "superadmin@resultspro.ng",
		"8d3a7776-5d21-4f1e-9a6d-e4c1d63e9f02": "admin@resultspro.ng",
		"2db093ed-bdc9-47c4-b71c-66869f0f1ea7": "teacher@resultspro.ng",
		"111efa7d-e12d-4ed1-9902-d341c6826b50": "student@resultspro.ng",
		"dac38ffd-866f-47ab-8ac4-ecf6ea520ba8": "parent@resultspro.ng",
		"999efa7d-e12d-4ed1-9902-d341c6826b99": "agent@resultspro.ng",
	}
	
	for id, email := range updates {
		_, err := db.Exec("UPDATE users SET email = $1, password_hash = $2 WHERE id = $3", email, hash, id)
		if err != nil {
			log.Fatalf("Failed to update %s: %v", id, err)
		}
	}
	
	// Also update the tutors
	_, err = db.Exec("UPDATE users SET password_hash = $1 WHERE email IN ('tutor1@example.com', 'tutor2@example.com', 'tutor3@example.com', 'tutor4@example.com')", hash)
	
	fmt.Println("Emails and Passwords forced updated successfully!")
}

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
	
	_, err = db.Exec("UPDATE users SET password_hash = $1 WHERE email IN ('superadmin@resultspro.ng', 'admin@resultspro.ng', 'teacher@resultspro.ng', 'student@resultspro.ng', 'parent@resultspro.ng', 'agent@resultspro.ng', 'tutor1@example.com', 'tutor2@example.com', 'tutor3@example.com', 'tutor4@example.com')", hash)
	if err != nil {
		log.Fatalf("Update error: %v", err)
	}
	fmt.Println("Passwords updated successfully to Password123!")
}

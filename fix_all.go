package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	godotenv.Load(".env", "../.env")
	dbURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	password := "Password123!"
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), 10)

	_, err = db.Exec("UPDATE users SET password_hash = $1 WHERE email IN ('superadmin@resultspro.ng', 'platform-admin@resultspro.ng', 'tenant-admin@example.edu', 'agent@resultspro.ng')", string(hashed))
	if err != nil {
		log.Fatalf("Update user error: %v", err)
	}

	fmt.Println("All admin/agent users fixed successfully!")
}

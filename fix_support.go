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
		log.Fatalf("DB error: %v", err)
	}
	defer db.Close()

	password := "Password123!"
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), 10)

	_, err = db.Exec("UPDATE users SET password_hash = $1 WHERE email = 'support-staff@resultspro.ng'", string(hashed))
	if err != nil {
		log.Fatalf("Update user error: %v", err)
	}

	userID := "8d3a7776-5d21-4f1e-9a6d-e4c1d63e9f03" // known from seed
	tenantID := "tenant-1"
	
	_, err = db.Exec("INSERT INTO user_tenant_roles (id, user_id, tenant_id, role, status) VALUES ('role-support-1', $1, $2, 'support', 'active') ON CONFLICT DO NOTHING", userID, tenantID)
	if err != nil {
		log.Fatalf("Insert role error: %v", err)
	}

	fmt.Println("Support user fixed successfully!")
}

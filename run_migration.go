package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load(".env", "../.env")
	dbURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	queries := []string{
		`CREATE TABLE IF NOT EXISTS support_tickets (
			id VARCHAR(191) PRIMARY KEY,
			user_id VARCHAR(191) NOT NULL,
			assigned_to VARCHAR(191),
			subject VARCHAR(255) NOT NULL,
			category VARCHAR(191) NOT NULL,
			message TEXT NOT NULL,
			status VARCHAR(50) DEFAULT 'open',
			priority VARCHAR(50) DEFAULT 'low',
			app_module VARCHAR(191),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS support_ticket_messages (
			id VARCHAR(191) PRIMARY KEY,
			ticket_id VARCHAR(191) NOT NULL,
			sender_id VARCHAR(191) NOT NULL,
			sender_type VARCHAR(50) NOT NULL,
			message TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS support_staff_status (
			user_id VARCHAR(191) PRIMARY KEY,
			is_active BOOLEAN DEFAULT false,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
	}

	for _, q := range queries {
		_, err := db.Exec(q)
		if err != nil {
			log.Printf("Failed to execute query: %v", err)
		}
	}

	fmt.Println("Support tables created successfully!")
}

package main

import (
	"log"
	"os"
	"github.com/joho/godotenv"
	"service_users.resultspro.ng/db"
)

func main() {
	godotenv.Load()
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	db.InitDB(dbURL)
	err := db.GormDB.Exec("ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS app_module VARCHAR(191) DEFAULT 'Unknown'").Error
	if err != nil {
		log.Printf("Failed to alter table (maybe already altered?): %v", err)
	} else {
		log.Println("Added app_module column to support_tickets.")
	}
}

package main

import (
	"log"

	"github.com/joho/godotenv"
	"service_campuspro.resultspro.ng/config"
	"service_campuspro.resultspro.ng/db"
	"service_campuspro.resultspro.ng/handlers"
)

func main() {
	_ = godotenv.Load("../.env")
	_ = godotenv.Load(".env")

	config.InitConfig()
	log.Println("Initializing database connection for Greenwood High Academy CampusPRO seed...")
	db.InitDB(config.DatabaseURL)
	db.InitCampusSchema()

	if err := handlers.SeedGreenwoodHighAllModules("tenant-greenwoodhigh"); err != nil {
		log.Fatalf("Failed to seed Greenwood High Academy: %v", err)
	}
	log.Println("Successfully seeded Greenwood High Academy (greenwoodhigh) across all CampusPRO tables!")
}

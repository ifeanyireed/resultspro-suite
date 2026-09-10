package main

import (
	"log"
	"service_users.resultspro.ng/config"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
)

func main() {
	config.InitConfig()
	db.InitDB(config.DatabaseURL)

	var posts []models.BlogPost
	db.GormDB.Find(&posts)
	log.Printf("Found %d posts in the database", len(posts))
	for _, p := range posts {
		log.Printf("- ID: %s, Title: %s, Status: %s, CategoryID: %v, AuthorID: %s", p.ID, p.Title, p.Status, p.CategoryID, p.AuthorID)
	}
}

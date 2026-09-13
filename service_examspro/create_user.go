package main

import (
	"log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"exams-resultspro-backend/internal/models"
)

func main() {
	dsn := "postgresql://neondb_owner:npg_PlmqORh64gNG@ep-steep-bar-ayq6g77r-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	user := models.User{
		ID: "test-user-id",
		CoinBalance: 100,
	}
	db.Create(&user)
	log.Println("Created test user")
}

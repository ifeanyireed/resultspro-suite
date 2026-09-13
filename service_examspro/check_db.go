package main

import (
	"log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "postgresql://neondb_owner:npg_PlmqORh64gNG@ep-steep-bar-ayq6g77r-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	var tables []string
	db.Raw("SELECT tablename FROM pg_tables WHERE schemaname = 'public'").Scan(&tables)
	log.Println("Tables:", tables)
}

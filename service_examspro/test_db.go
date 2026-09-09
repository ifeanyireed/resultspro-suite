package main

import (
	"fmt"
	"os"
	"exams-resultspro-backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	dsn := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("DB error:", err)
		os.Exit(1)
	}

	var users []models.User
	db.Find(&users)
	for _, u := range users {
		name := "<nil>"
		if u.Name != nil {
			name = *u.Name
		}
		fmt.Printf("Email: %s | Name: %s\n", u.Email, name)
	}
}

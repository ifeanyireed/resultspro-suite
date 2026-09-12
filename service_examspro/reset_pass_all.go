package main

import (
	"fmt"
	"os"
	"golang.org/x/crypto/bcrypt"
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

	newPassword := "Admin@123"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), 14)
	if err != nil {
		fmt.Println("Bcrypt error:", err)
		os.Exit(1)
	}

	emails := []string{"ifeanyireed@gmail.com", "ifeanyifelix@gmail.com", "platform-admin@resultspro.ng"}
	for _, email := range emails {
		result := db.Table("users").Where("email = ?", email).Update("password_hash", string(hashedPassword))
		fmt.Printf("Reset %s to %s (Rows affected: %d)\n", email, newPassword, result.RowsAffected)
	}
}

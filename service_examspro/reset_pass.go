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

	result := db.Table("users").Where("email = ?", "superadmin@resultspro.ng").Update("password_hash", string(hashedPassword))
	if result.Error != nil {
		fmt.Println("Update error:", result.Error)
		os.Exit(1)
	}

	fmt.Printf("Successfully reset password for superadmin@resultspro.ng to %s (Rows affected: %d)\n", newPassword, result.RowsAffected)
}

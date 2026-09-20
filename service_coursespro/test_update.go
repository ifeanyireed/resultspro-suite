package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/joho/godotenv"
)

type MentorProfile struct {
	UserID         string `gorm:"primaryKey;size:64" json:"user_id"`
	TenantID       string `gorm:"size:191;index;not null" json:"tenant_id"`
	FullName       string `gorm:"size:255" json:"full_name"`
	Specialization string
}
func (MentorProfile) TableName() string { return "crs_mentor_profiles" }

func main() {
	godotenv.Load()
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	var p MentorProfile
	db.First(&p)
	fmt.Printf("Before update: %+v\n", p)

	res := db.Model(&MentorProfile{}).Where("user_id = ?", p.UserID).Updates(map[string]interface{}{
		"full_name": p.FullName + " Updated",
	})
	if res.Error != nil {
		log.Fatal(res.Error)
	}

	fmt.Printf("Rows affected: %d\n", res.RowsAffected)

	var p2 MentorProfile
	db.Where("user_id = ?", p.UserID).First(&p2)
	fmt.Printf("After update: %+v\n", p2)
}

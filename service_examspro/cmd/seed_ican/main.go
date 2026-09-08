package main

import (
	"log"

	"exams-resultspro-backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	dsn := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	packs := []models.CoinPack{
		{
			ID:          "ican_single",
			Name:        "Single Paper",
			Type:        "ICAN",
			Coins:       0,
			Price:       3000,
			Description: strPtr("Access to one ICAN paper past questions & AI tutor"),
			Color:       "gray",
			Popular:     false,
			Bonus:       nil,
			IsActive:    true,
		},
		{
			ID:          "ican_level",
			Name:        "Complete Level",
			Type:        "ICAN",
			Coins:       0,
			Price:       7000,
			Description: strPtr("Access to all papers in a single ICAN level"),
			Color:       "blue",
			Popular:     true,
			Discount:    strPtr("Save 22%"),
			Bonus:       nil,
			IsActive:    true,
		},
		{
			ID:          "ican_diet",
			Name:        "Full Diet Access",
			Type:        "ICAN",
			Coins:       0,
			Price:       10000,
			Description: strPtr("Complete unlimited access to all ICAN levels & papers"),
			Color:       "amber",
			Popular:     false,
			Discount:    strPtr("Best Value"),
			Bonus:       nil,
			IsActive:    true,
		},
	}

	for _, p := range packs {
		var existing models.CoinPack
		if err := db.Where("id = ?", p.ID).First(&existing).Error; err != nil {
			db.Create(&p)
			log.Printf("Created pack: %s", p.Name)
		} else {
			db.Model(&existing).Updates(p)
			log.Printf("Updated pack: %s", p.Name)
		}
	}
}

func strPtr(s string) *string {
	return &s
}

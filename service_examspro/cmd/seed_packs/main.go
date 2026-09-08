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
			ID:          "pack_basic",
			Name:        "Starter Pack",
			Type:        "COIN",
			Coins:       1000,
			Price:       1000,
			Description: strPtr("Good for occasional deep dives"),
			Color:       "gray",
			Popular:     false,
			Bonus:       nil,
			IsActive:    true,
		},
		{
			ID:          "pack_popular",
			Name:        "Pro Pack",
			Type:        "COIN",
			Coins:       5000,
			Price:       4500,
			Description: strPtr("Perfect for active battlers"),
			Color:       "blue",
			Popular:     true,
			Discount:    strPtr("10% OFF"),
			Bonus:       strPtr("+500 Bonus Coins"),
			IsActive:    true,
		},
		{
			ID:          "pack_premium",
			Name:        "Elite Pack",
			Type:        "COIN",
			Coins:       12000,
			Price:       10000,
			Description: strPtr("Maximum value for serious learners"),
			Color:       "amber",
			Popular:     false,
			Discount:    strPtr("20% OFF"),
			Bonus:       strPtr("+2000 Bonus Coins"),
			IsActive:    true,
		},
		{
			ID:          "sub_premium",
			Name:        "Pro Monthly",
			Type:        "PREMIUM",
			Coins:       500,
			Price:       5000,
			Description: strPtr("Unlimited explanations and more"),
			Color:       "purple",
			Popular:     false,
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

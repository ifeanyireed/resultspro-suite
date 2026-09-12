package main

import (
	"fmt"
	"os"
	"time"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"github.com/google/uuid"
)

type CoinPack struct {
	TenantID    string         `gorm:"size:64;index" json:"tenant_id"`
	ID          string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	Name        string         `json:"name"`
	Type        string         `gorm:"default:'COIN'" json:"type"`
	Coins       int            `gorm:"default:0" json:"coins"`
	Price       int            `json:"price"`
	Description *string        `json:"description"`
	Color       string         `gorm:"default:'blue'" json:"color"`
	Popular     bool           `gorm:"default:false" json:"popular"`
	Discount    *string        `json:"discount"`
	Bonus       *string        `json:"bonus"`
	IsActive    bool           `gorm:"default:true" json:"isActive"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (CoinPack) TableName() string { return "coin_packs" }

func strPtr(s string) *string { return &s }

func main() {
	dsn := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil { fmt.Println("DB error:", err); os.Exit(1) }

	packs := []CoinPack{
		{
			TenantID: "tenant-1",
			ID: uuid.New().String(), Name: "Starter Pack", Coins: 500, Price: 500, 
			Description: strPtr("Perfect for getting started with a few mock exams."), 
			Color: "blue", Popular: false,
		},
		{
			TenantID: "tenant-1",
			ID: uuid.New().String(), Name: "Scholar Pack", Coins: 1500, Price: 1200, 
			Description: strPtr("Most popular! Great for consistent daily practice."), 
			Color: "purple", Popular: true, Bonus: strPtr("+200 Bonus Coins"), Discount: strPtr("20% OFF"),
		},
		{
			TenantID: "tenant-1",
			ID: uuid.New().String(), Name: "Master Pack", Coins: 3500, Price: 2500, 
			Description: strPtr("For dedicated students preparing for major exams."), 
			Color: "amber", Popular: false, Bonus: strPtr("+500 Bonus Coins"), Discount: strPtr("28% OFF"),
		},
		{
			TenantID: "tenant-1",
			ID: uuid.New().String(), Name: "Champion Pack", Coins: 8000, Price: 5000, 
			Description: strPtr("Ultimate value! Never run out of coins during the season."), 
			Color: "emerald", Popular: false, Bonus: strPtr("+1500 Bonus Coins"), Discount: strPtr("37% OFF"),
		},
	}

	for _, p := range packs {
		p.CreatedAt = time.Now()
		p.UpdatedAt = time.Now()
		if err := db.Create(&p).Error; err != nil {
			fmt.Printf("Error seeding pack %s: %v\n", p.Name, err)
		} else {
			fmt.Printf("Successfully seeded %s\n", p.Name)
		}
	}
}

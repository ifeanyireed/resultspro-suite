package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	
	"service_users.resultspro.ng/models"
)

type SeedPlan struct {
	Name        string
	AppModule   string
	Category    string
	Price       float64
	Period      string
	Features    []string
	CtaText     string
	Highlight   bool
	AccessLevel string
}

func main() {
	godotenv.Load("../.env")
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "root:root@tcp(127.0.0.1:8889)/resultspro_users?charset=utf8mb4&parseTime=True&loc=Local"
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// This will safely create all missing columns
	err = db.AutoMigrate(&models.Plan{})
	if err != nil {
		log.Fatalf("AutoMigrate failed: %v", err)
	}

	// Clear existing plans
	db.Exec("TRUNCATE TABLE plans")

	plans := []SeedPlan{
		{"FREE", "SchoolHub", "School", 0, "forever", []string{"Up to 100 Students & 15 Teachers", "SchoolHub Mobile Apps", "ResultsPRO (Basic)", "ExamsPRO (Free)", "2GB Storage"}, "Get Started Free", false, "PREMIUM"},
		{"STARTER", "SchoolHub", "School", 15000, "per month", []string{"Up to 500 Students & 50 Teachers", "SchoolHub Mobile Apps", "ResultsPRO (Full)", "ExamsPRO (Standard CBT)", "ClassroomPRO", "15GB Storage"}, "Start with Starter", false, "PREMIUM"},
		{"PRO", "SchoolHub", "School", 35000, "per month", []string{"Up to 2,000 Students & 300 Teachers", "SchoolHub Mobile Apps", "ResultsPRO & ExamsPRO", "ClassroomPRO", "PuzzlePRO", "50GB Storage"}, "Upgrade to Pro", true, "PREMIUM"},
		{"ENTERPRISE", "SchoolHub", "School", 80000, "per month", []string{"Unlimited Students & Teachers", "SchoolHub Mobile Apps", "ResultsPRO & ExamsPRO", "ClassroomPRO", "Access to All Suite Products", "Custom Domain & White-labeling", "500GB Storage"}, "Contact Sales", false, "PREMIUM"},

		{"FREE", "FamilyHub", "Family", 0, "forever", []string{"1 Student Profile", "ResultsPRO Parent Portal", "Community Access", "Mobile App"}, "Join Free", false, "PREMIUM"},
		{"BASIC", "FamilyHub", "Family", 5000, "per month", []string{"1 Student Tracking", "Access to 4 Core Sub-apps", "Detailed Progress Reports", "Standard Support"}, "Choose Basic", false, "PREMIUM"},
		{"PRO", "FamilyHub", "Family", 12000, "per month", []string{"Up to 3 Students", "Full Ecosystem Access", "Detailed AI Insights", "Priority Support"}, "Go Pro", true, "PREMIUM"},
		{"PREMIUM", "FamilyHub", "Family", 20000, "per month", []string{"Up to 5 Students", "Full Ecosystem Access", "Weekly Expert Consult", "Priority Support"}, "Get Premium", false, "PREMIUM"},

		{"BASIC", "AgentNetwork", "Agent", 10000, "per month", []string{"Manage up to 5 Schools", "Basic Commission Tracking", "Marketing Materials", "Email Support"}, "Become an Agent", false, "PREMIUM"},
		{"PRO", "AgentNetwork", "Agent", 30000, "per month", []string{"Manage up to 20 Schools", "Advanced Analytics", "Training Workshops", "Priority Support"}, "Growth Plan", true, "PREMIUM"},
		{"PREMIUM", "AgentNetwork", "Agent", 100000, "per month", []string{"Unlimited Schools", "Master Agent Status", "Team Management", "Direct Executive Support"}, "Master Plan", false, "PREMIUM"},
		
		{"ICAN SINGLE", "ExamsPRO", "ICAN", 3500, "per month", []string{"Access to 1 ICAN Subject", "Past Questions", "Mock Exams", "Performance Analytics"}, "Subscribe", false, "ICAN_SINGLE"},
		{"ICAN FULL", "ExamsPRO", "ICAN", 15000, "per month", []string{"Access to All ICAN Subjects", "Unlimited Past Questions", "Live Classes", "Premium Analytics", "Tutor Support"}, "Get Full Access", true, "ICAN_FULL"},
	}

	for _, p := range plans {
		featJSON, _ := json.Marshal(p.Features)
		
		plan := models.Plan{
			ID:          uuid.New().String(),
			Name:        p.Name,
			AppModule:   p.AppModule,
			Category:    p.Category,
			MonthlyPrice: p.Price,
			Period:      p.Period,
			Features:    string(featJSON),
			CtaText:     p.CtaText,
			Highlight:   p.Highlight,
			AccessLevel: p.AccessLevel,
			IsActive:    true,
		}
		
		if err := db.Create(&plan).Error; err != nil {
			log.Printf("Failed to insert %s: %v", p.Name, err)
		}
	}
	fmt.Println("Plans seeded successfully!")
}

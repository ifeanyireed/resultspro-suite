package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
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

func main_seed_plans() {
	godotenv.Load("../.env")
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "root:root@tcp(127.0.0.1:8889)/resultspro_users?charset=utf8mb4&parseTime=True&loc=Local"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
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
		// -------------------------
		// PricingSection.tsx
		// -------------------------
		// School
		{"FREE", "SchoolHub", "School", 0, "forever", []string{"Up to 100 Students & 15 Teachers", "SchoolHub Mobile Apps", "ResultsPRO (Basic)", "ExamsPRO (Free)", "2GB Storage"}, "Get Started Free", false, "PREMIUM"},
		{"STARTER", "SchoolHub", "School", 15000, "per month", []string{"Up to 500 Students & 50 Teachers", "SchoolHub Mobile Apps", "ResultsPRO (Full)", "ExamsPRO (Standard CBT)", "ClassroomPRO", "15GB Storage"}, "Start with Starter", false, "PREMIUM"},
		{"PRO", "SchoolHub", "School", 35000, "per month", []string{"Up to 2,000 Students & 300 Teachers", "SchoolHub Mobile Apps", "ResultsPRO & ExamsPRO", "ClassroomPRO", "PuzzlePRO", "50GB Storage"}, "Upgrade to Pro", true, "PREMIUM"},
		{"ENTERPRISE", "SchoolHub", "School", 80000, "per month", []string{"Unlimited Students & Teachers", "SchoolHub Mobile Apps", "ResultsPRO & ExamsPRO", "ClassroomPRO", "Access to All Suite Products", "Custom Domain & White-labeling", "500GB Storage"}, "Contact Sales", false, "PREMIUM"},

		// Family
		{"FREE", "FamilyHub", "Family", 0, "forever", []string{"1 Student Profile", "ResultsPRO Parent Portal", "Community Access", "Mobile App"}, "Join Free", false, "PREMIUM"},
		{"BASIC", "FamilyHub", "Family", 5000, "per month", []string{"1 Student Tracking", "Access to 4 Core Sub-apps", "Detailed Progress Reports", "Standard Support"}, "Choose Basic", false, "PREMIUM"},
		{"PRO", "FamilyHub", "Family", 12000, "per month", []string{"Up to 3 Students", "Full Ecosystem Access", "Detailed AI Insights", "Priority Support"}, "Go Pro", true, "PREMIUM"},
		{"PREMIUM", "FamilyHub", "Family", 20000, "per month", []string{"Up to 5 Students", "Full Ecosystem Access", "Weekly Expert Consult", "Priority Support"}, "Get Premium", false, "PREMIUM"},

		// Agent
		{"BASIC", "AgentNetwork", "Agent", 10000, "per month", []string{"Manage up to 5 Schools", "Basic Commission Tracking", "Marketing Materials", "Email Support"}, "Become an Agent", false, "PREMIUM"},
		{"PRO", "AgentNetwork", "Agent", 30000, "per month", []string{"Manage up to 20 Schools", "Advanced Analytics", "Training Workshops", "Priority Support"}, "Growth Plan", true, "PREMIUM"},
		{"PREMIUM", "AgentNetwork", "Agent", 100000, "per month", []string{"Unlimited Schools", "Master Agent Status", "Team Management", "Direct Executive Support"}, "Master Plan", false, "PREMIUM"},

		// -------------------------
		// ProductPricingSection.tsx
		// -------------------------
		// ICAN (ExamsPRO)
		{"SINGLE PAPER", "ExamsPRO", "ICAN", 3000, "per month", []string{"Access to 1 ICAN Paper", "Past Questions Access", "AI Tutor Guidance", "Email Support"}, "Buy Single Paper", false, "ICAN_SINGLE"},
		{"COMPLETE LEVEL", "ExamsPRO", "ICAN", 7000, "per month", []string{"Access to 1 Complete Level", "All Papers in Level", "AI Tutor Guidance", "Priority Support"}, "Buy Complete Level", true, "ICAN_GROUP"},
		{"FULL DIET ACCESS", "ExamsPRO", "ICAN", 10000, "per month", []string{"Unlimited ICAN Levels", "Unlimited Papers", "Advanced AI Insights", "Priority Support"}, "Get Full Access", false, "ICAN_FULL"},

		// ClassroomPRO
		{"SOLO", "ClassroomPRO", "ClassroomPRO", 2000, "per month", []string{"1 Teacher", "Up to 50 Students", "Virtual Classrooms", "Basic Assignment Tracking", "Email Support"}, "Start Solo", false, "PREMIUM"},
		{"FAMILY", "ClassroomPRO", "ClassroomPRO", 5000, "per month", []string{"Up to 5 Teachers", "Up to 200 Students", "Interactive Whiteboard", "Live Lesson Recording", "Priority Support"}, "Get Family Plan", true, "PREMIUM"},
		{"SCHOOL STARTER", "ClassroomPRO", "ClassroomPRO", 15000, "per month", []string{"Up to 20 Teachers", "Up to 500 Students", "Basic School Analytics", "Standard Branding", "Email Support"}, "Start with Starter", false, "PREMIUM"},
		{"SCHOOL PRO", "ClassroomPRO", "ClassroomPRO", 35000, "per month", []string{"Unlimited Teachers & Students", "School-wide Analytics", "Custom Branding", "Dedicated Support"}, "Contact Sales", false, "PREMIUM"},

		// PuzzlePRO
		{"SOLO", "PuzzlePRO", "PuzzlePRO", 1000, "per month", []string{"1 Student", "Standard Educational Games", "Basic Progress Tracking", "Email Support"}, "Start Solo", false, "PREMIUM"},
		{"FAMILY", "PuzzlePRO", "PuzzlePRO", 3000, "per month", []string{"Up to 5 Students", "All Premium Games", "Detailed Cognitive Reports", "Priority Support"}, "Get Family Plan", true, "PREMIUM"},
		{"SCHOOL STARTER", "PuzzlePRO", "PuzzlePRO", 10000, "per month", []string{"Up to 500 Students", "Basic Leaderboards", "Standard Games", "Email Support"}, "Start with Starter", false, "PREMIUM"},
		{"SCHOOL PRO", "PuzzlePRO", "PuzzlePRO", 25000, "per month", []string{"Unlimited Students", "School-wide Leaderboards", "Curriculum Integration", "Dedicated Support"}, "Contact Sales", false, "PREMIUM"},

		// CoursesPRO
		{"STARTER", "CoursesPRO", "CoursesPRO", 15000, "per month", []string{"Up to 100 Students", "Up to 5 Courses", "Course Creator Tool", "Standard Video Hosting", "Basic Certificates", "Email Support"}, "Start with Starter", false, "PREMIUM"},
		{"PRO", "CoursesPRO", "CoursesPRO", 35000, "per month", []string{"Up to 1,000 Students", "Up to 25 Courses", "Advanced Course Builder", "Certificate Generation", "Custom Domain", "Priority Support"}, "Upgrade to Pro", true, "PREMIUM"},
		{"ENTERPRISE", "CoursesPRO", "CoursesPRO", 80000, "per month", []string{"Unlimited Students", "Unlimited Courses", "White-label Certificates", "Dedicated Account Manager", "24/7 Support"}, "Contact Sales", false, "PREMIUM"},

		// TutorsPRO (Note: Price is in USD, converted integer part)
		{"SOLO", "TutorsPRO", "TutorsPRO", 15, "per hour", []string{"Billed in blocks of 5 hours", "1 Subject Focus", "Flexible Scheduling", "Basic Progress Tracking"}, "Start Solo", false, "PREMIUM"},
		{"FAMILY", "TutorsPRO", "TutorsPRO", 12, "per hour", []string{"Billed in blocks of 20 hours", "Up to 3 Subjects", "Multi-student Support", "Detailed Parent Analytics"}, "Get Family Plan", true, "PREMIUM"},
		{"SCHOOL STARTER", "TutorsPRO", "TutorsPRO", 10, "per hour", []string{"Billed in blocks of 100 hours", "Unlimited Subjects", "Small Group Classes", "Basic School Analytics"}, "Start with Starter", false, "PREMIUM"},
		{"SCHOOL PRO", "TutorsPRO", "TutorsPRO", 8, "per hour", []string{"Billed in blocks of 500 hours", "Unlimited Subjects", "Unlimited Multi-students", "Advanced School Analytics"}, "Contact Sales", false, "PREMIUM"},
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

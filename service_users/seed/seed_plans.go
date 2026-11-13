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

func main() {
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
		// PricingSection.tsx (ScholarsNG Suite Bundles)
		// -------------------------
		// School (ScholarsNG)
		{"SANDBOX PILOT", "scholars_ng", "School", 0, "first term", []string{"Up to 50 Active Students", "ResultsPRO Automated CA1/CA2 & Broadsheets", "CampusPRO Lite (Student & Class Directory)", "50 Encrypted Result Scratch Card PINs", "Instant Subdomain (school.scholars.ng)", "PuzzlePRO Coding Preview (First 20 Quests)"}, "Start 1-Term Free Pilot", false, "PREMIUM"},
		{"GROWTH ACADEMY", "scholars_ng", "School", 65000, "per term", []string{"Up to 250 Active Students (~₦260/student/term)", "ResultsPRO + ClassroomPRO + PuzzlePRO Starter", "CampusPRO Core (Admissions, Attendance & Website CMS)", "250 Encrypted Scratch Card PINs per Term", "Custom School Crest, Theme & Principal Signature", "Parent SMS/WhatsApp Alerts & Paystack Fee Collection"}, "Deploy Growth Academy", false, "PREMIUM"},
		{"DIGITAL CAMPUS PRO", "scholars_ng", "School", 135000, "per term", []string{"Up to 750 Active Students (~₦180/student/term)", "All 5 Specialist Apps Unlocked (ResultsPRO, ClassroomPRO, TutorsPRO, PuzzlePRO & CampusPRO)", "Full CampusPRO ERP (Bursary, HR/Payroll, Timetable, Library, Inventory & Transport)", "Custom Institutional Domain (portal.school.edu.ng)", "Unlimited Encrypted Scratch Card PIN Batches", "Dedicated 24/7 WhatsApp & Phone Priority SLA"}, "Deploy Pro Campus", true, "PREMIUM"},
		{"INSTITUTIONAL", "scholars_ng", "School", 350000, "per term", []string{"Unlimited Students & Multi-Campus Groups", "Multi-Campus CampusPRO Command & Cross-Branch Analytics", "All 5 Specialist Apps with Unlimited Student Seats", "White-Label iOS & Android Mobile Apps under School Brand", "Biometric Attendance & SUBEB/Ministry Compliance Exports", "White-Glove Historical Migration & Dedicated Account Manager"}, "Book Institutional Briefing", false, "PREMIUM"},

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
		// ProductPricingSection.tsx (Standalone Apps)
		// -------------------------
		// ResultsPRO
		{"PILOT", "ResultsPRO", "ResultsPRO", 0, "first term", []string{"Up to 50 Active Students", "Automated CA1/CA2 & Terminal Exam Math", "50 Encrypted Scratch Card PINs", "Standard PDF Report Card Templates", "Email Support"}, "Start ResultsPRO Free", false, "PREMIUM"},
		{"SCHOOL STARTER", "ResultsPRO", "ResultsPRO", 35000, "per term", []string{"Up to 250 Active Students (~₦140/student/term)", "Full CA/Exam Weighting & Position Ranking", "250 Encrypted Scratch Card PINs / Term", "Custom School Crest & Principal Signature", "Parent SMS/WhatsApp Result Notifications"}, "Deploy ResultsPRO Starter", true, "PREMIUM"},
		{"SCHOOL PRO", "ResultsPRO", "ResultsPRO", 65000, "per term", []string{"Up to 1,000 Active Students (~₦65/student/term)", "Unlimited Scratch Card PIN Batch Generation", "AI Subject Mastery & Teacher Analytics", "WAEC, NECO, IGCSE & Custom Grading Scales", "Priority WhatsApp & Phone Support"}, "Deploy ResultsPRO Pro", false, "PREMIUM"},

		// CampusPRO
		{"CAMPUS CORE", "CampusPRO", "CampusPRO", 40000, "per term", []string{"Up to 250 Active Students", "Digital Admissions Funnel & Enrollment CRM", "Public School Website CMS (Notices, News & Events)", "Student & Staff Attendance Tracking", "Parent Circular & SMS/WhatsApp Broadcast Hub"}, "Deploy CampusPRO Core", false, "PREMIUM"},
		{"FULL CAMPUS ERP", "CampusPRO", "CampusPRO", 75000, "per term", []string{"Up to 750 Active Students", "Bursary Invoicing, Paystack Reconciliation & Debtors", "Staff HR Records, Allowances & Automated Payroll", "Clash-Free Master Timetable & Room Allocation", "Library Catalog, Store Inventory & Transport Fleet"}, "Deploy Full CampusPRO", true, "PREMIUM"},
		{"MULTI-CAMPUS GROUP", "CampusPRO", "CampusPRO", 180000, "per term", []string{"Unlimited Students & Multi-Branch Campuses", "Consolidated Multi-Branch Revenue & Expense Telemetry", "Biometric Staff & Student Clock-In Integration", "Custom Approval Workflows & Audit Trails", "Dedicated Technical Account Manager"}, "Contact Institutional Sales", false, "PREMIUM"},

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

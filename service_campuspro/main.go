package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"service_campuspro.resultspro.ng/config"
	"service_campuspro.resultspro.ng/db"
	"service_campuspro.resultspro.ng/handlers"
	"service_campuspro.resultspro.ng/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Note: .env file not found, loading environment from system")
	}

	config.InitConfig()

	log.Printf("Connecting to Postgres database for CampusPRO...")
	db.InitDB(config.DatabaseURL)
	db.InitCampusSchema()
	db.InitRedis()

	mux := http.NewServeMux()

	// --- Health Check ---
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		handlers.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"status":  "healthy",
			"service": "service_campuspro (Campus Operations & Institutional ERP Engine)",
			"version": "1.0.0",
			"port":    config.Port,
		})
	})

	// --- Campus Operations Endpoints ---
	routes := map[string]http.HandlerFunc{
		// Website CMS
		"/api/public/campus/website-config": handlers.HandleCampusWebsiteConfig,
		"/api/v1/campus/website-config":     handlers.HandleCampusWebsiteConfig,
		"/api/campus/website-config":        handlers.HandleCampusWebsiteConfig,

		// Executive Dashboard Summary
		"/api/v1/campus/summary": handlers.HandleCampusSummary,
		"/api/campus/summary":    handlers.HandleCampusSummary,

		// Timetable & Periods Bell Schedule
		"/api/v1/campus/timetable": handlers.HandleCampusTimetable,
		"/api/campus/timetable":    handlers.HandleCampusTimetable,

		// Admissions & Applications
		"/api/public/campus/admissions/apply": handlers.HandleCampusAdmissions,
		"/api/v1/campus/admissions":           handlers.HandleCampusAdmissions,
		"/api/campus/admissions":              handlers.HandleCampusAdmissions,

		// Tuition Fees & Billing Invoices
		"/api/v1/campus/fees": handlers.HandleCampusFees,
		"/api/campus/fees":    handlers.HandleCampusFees,

		// Library Catalog & Book Loans
		"/api/v1/campus/library": handlers.HandleCampusLibrary,
		"/api/campus/library":    handlers.HandleCampusLibrary,

		// Procurement & Asset Inventory
		"/api/v1/campus/procurement": handlers.HandleCampusProcurement,
		"/api/campus/procurement":    handlers.HandleCampusProcurement,

		// Transport Corridors & Fleet Routes
		"/api/v1/campus/transport": handlers.HandleCampusTransport,
		"/api/campus/transport":    handlers.HandleCampusTransport,

		// Hostel Halls & Bed Allocations
		"/api/v1/campus/hostel": handlers.HandleCampusHostel,
		"/api/campus/hostel":    handlers.HandleCampusHostel,

		// School Circulars, Notices & Events
		"/api/v1/campus/notices": handlers.HandleCampusNotices,
		"/api/campus/notices":    handlers.HandleCampusNotices,

		// Parent & Staff Portal Messages
		"/api/v1/campus/messages": handlers.HandleCampusMessages,
		"/api/campus/messages":    handlers.HandleCampusMessages,

		// Mobile App Device Accounts
		"/api/v1/campus/mobile-accounts": handlers.HandleCampusMobileAccounts,
		"/api/campus/mobile-accounts":    handlers.HandleCampusMobileAccounts,

		// Homework & Assignments
		"/api/v1/campus/homework": handlers.HandleCampusHomework,
		"/api/campus/homework":    handlers.HandleCampusHomework,

		// Academic Classes, Arms & Rosters
		"/api/v1/campus/classes":               handlers.HandleCampusClasses,
		"/api/campus/classes":                  handlers.HandleCampusClasses,
		"/api/v1/campus/classes/arms":          handlers.HandleCampusArms,
		"/api/campus/classes/arms":             handlers.HandleCampusArms,
		"/api/v1/campus/classes/arms/students": handlers.HandleCampusArmStudents,
		"/api/campus/classes/arms/students":    handlers.HandleCampusArmStudents,

		// Academic Sessions & Term Calendar
		"/api/v1/campus/academic-sessions": handlers.HandleCampusAcademicSessions,
		"/api/campus/academic-sessions":    handlers.HandleCampusAcademicSessions,
		"/api/v1/campus/academic-terms":    handlers.HandleCampusAcademicTerms,
		"/api/campus/academic-terms":       handlers.HandleCampusAcademicTerms,
		"/api/v1/campus/academic-events":   handlers.HandleCampusAcademicEvents,
		"/api/campus/academic-events":      handlers.HandleCampusAcademicEvents,
	}

	for path, handler := range routes {
		mux.HandleFunc(path, middleware.RequireTenantScope(handler))
	}

	corsHandler := middleware.EnableCORS(mux)

	log.Printf("⚡ CampusPRO Engine started on port :%s", config.Port)
	if err := http.ListenAndServe(":"+config.Port, corsHandler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

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
		// Website CMS & Public Webinar Registration
		"/api/public/campus/website-config":         handlers.HandleCampusWebsiteConfig,
		"/api/v1/campus/website-config":             handlers.HandleCampusWebsiteConfig,
		"/api/campus/website-config":                handlers.HandleCampusWebsiteConfig,
		"/api/public/campus/webinar/register":          handlers.HandlePublicWebinarRegister,
		"/api/v1/campus/webinar/register":              handlers.HandlePublicWebinarRegister,
		"/api/v1/campus/webinar/registrations":         handlers.HandleCampusWebinarRegistrations,
		"/api/v1/campus/webinar/dispatch-certificate":  handlers.HandleCampusWebinarDispatchCertificate,

		// Executive Dashboard Summary
		"/api/v1/campus/summary": handlers.HandleCampusSummary,
		"/api/campus/summary":    handlers.HandleCampusSummary,

		// Student Command Dashboard & Self-Service Operations
		"/api/v1/campus/student/dashboard":          handlers.HandleStudentDashboard,
		"/api/campus/student/dashboard":             handlers.HandleStudentDashboard,
		"/api/student/dashboard":                    handlers.HandleStudentDashboard,
		"/api/v1/campus/student/exeat":              handlers.HandleStudentExeat,
		"/api/campus/student/exeat":                 handlers.HandleStudentExeat,
		"/api/v1/campus/student/facility-report":    handlers.HandleStudentFacilityReport,
		"/api/campus/student/facility-report":       handlers.HandleStudentFacilityReport,
		"/api/v1/campus/student/clinic-appointment": handlers.HandleStudentClinicAppointment,
		"/api/campus/student/clinic-appointment":    handlers.HandleStudentClinicAppointment,
		"/api/v1/campus/student/library-reserve":    handlers.HandleStudentLibraryReserve,
		"/api/campus/student/library-reserve":       handlers.HandleStudentLibraryReserve,

		// Parent Command Dashboard
		"/api/v1/campus/parent/dashboard": handlers.HandleParentDashboard,
		"/api/campus/parent/dashboard":    handlers.HandleParentDashboard,
		"/api/parent/dashboard":           handlers.HandleParentDashboard,

		// Teacher Command Dashboard & Class Operations
		"/api/v1/campus/teacher/dashboard":   handlers.HandleTeacherDashboard,
		"/api/campus/teacher/dashboard":      handlers.HandleTeacherDashboard,
		"/api/teacher/dashboard":             handlers.HandleTeacherDashboard,
		"/api/v1/campus/attendance/rollcall": handlers.HandleCampusAttendanceRollCall,
		"/api/campus/attendance/rollcall":    handlers.HandleCampusAttendanceRollCall,

		// Multi-Campus Sites & Branch Locations
		"/api/v1/campus/branches": handlers.HandleCampusBranches,
		"/api/campus/branches":    handlers.HandleCampusBranches,

		// Timetable & Periods Bell Schedule
		"/api/v1/campus/timetable":               handlers.HandleCampusTimetable,
		"/api/campus/timetable":                  handlers.HandleCampusTimetable,
		"/api/v1/campus/timetable/generate":      handlers.HandleCampusTimetableGenerate,
		"/api/campus/timetable/generate":         handlers.HandleCampusTimetableGenerate,
		"/api/v1/campus/timetable/bell-schedule": handlers.HandleCampusBellSchedule,
		"/api/campus/timetable/bell-schedule":    handlers.HandleCampusBellSchedule,

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
		"/api/v1/campus/inventory":   handlers.HandleCampusProcurement,
		"/api/campus/inventory":      handlers.HandleCampusProcurement,

		// Transport Corridors & Fleet Routes
		"/api/v1/campus/transport":        handlers.HandleCampusTransport,
		"/api/campus/transport":           handlers.HandleCampusTransport,
		"/api/v1/campus/transport/riders": handlers.HandleCampusTransportRiders,
		"/api/campus/transport/riders":    handlers.HandleCampusTransportRiders,

		// Biometric Attendance & Punctuality Engine
		"/api/v1/campus/attendance/summary":  handlers.HandleCampusAttendanceSummary,
		"/api/campus/attendance/summary":     handlers.HandleCampusAttendanceSummary,
		"/api/v1/campus/attendance/logs":     handlers.HandleCampusAttendanceLogs,
		"/api/campus/attendance/logs":        handlers.HandleCampusAttendanceLogs,
		"/api/v1/campus/attendance/clock":    handlers.HandleCampusAttendanceClock,
		"/api/campus/attendance/clock":       handlers.HandleCampusAttendanceClock,
		"/api/v1/campus/attendance/profiles": handlers.HandleCampusAttendanceProfiles,
		"/api/campus/attendance/profiles":    handlers.HandleCampusAttendanceProfiles,
		"/api/v1/campus/attendance/policies": handlers.HandleCampusAttendancePolicies,
		"/api/campus/attendance/policies":    handlers.HandleCampusAttendancePolicies,

		// Hostel Halls & Bed Allocations
		"/api/v1/campus/hostel": handlers.HandleCampusHostel,
		"/api/campus/hostel":    handlers.HandleCampusHostel,

		// Clinic & Infirmary Management
		"/api/v1/campus/clinic": handlers.HandleCampusClinic,
		"/api/campus/clinic":    handlers.HandleCampusClinic,

		// Campus Security, Visitors & Child Safeguarding
		"/api/v1/campus/security": handlers.HandleCampusSecurity,
		"/api/campus/security":    handlers.HandleCampusSecurity,

		// Pastoral Care & Behavioral Discipline
		"/api/v1/campus/discipline": handlers.HandleCampusDiscipline,
		"/api/campus/discipline":    handlers.HandleCampusDiscipline,

		// Cafeteria, Dining Hall & Cashless Tuck Shop
		"/api/v1/campus/cafeteria": handlers.HandleCampusCafeteria,
		"/api/campus/cafeteria":    handlers.HandleCampusCafeteria,

		// Co-Curricular, Clubs & Houses
		"/api/v1/campus/co-curricular": handlers.HandleCampusCoCurricular,
		"/api/campus/co-curricular":    handlers.HandleCampusCoCurricular,

		// Campus Facilities & Resource Reservation
		"/api/v1/campus/facilities": handlers.HandleCampusFacilities,
		"/api/campus/facilities":    handlers.HandleCampusFacilities,

		// Alumni Relations & Registry Credential Verification
		"/api/v1/campus/alumni": handlers.HandleCampusAlumni,
		"/api/campus/alumni":    handlers.HandleCampusAlumni,

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
		"/api/v1/campus/students":              handlers.HandleCampusArmStudents,
		"/api/campus/students":                 handlers.HandleCampusArmStudents,

		// Academic Sessions & Term Calendar
		"/api/v1/campus/academic-sessions": handlers.HandleCampusAcademicSessions,
		"/api/campus/academic-sessions":    handlers.HandleCampusAcademicSessions,
		"/api/v1/campus/academic-terms":    handlers.HandleCampusAcademicTerms,
		"/api/campus/academic-terms":       handlers.HandleCampusAcademicTerms,
		"/api/v1/campus/academic-events":   handlers.HandleCampusAcademicEvents,
		"/api/campus/academic-events":      handlers.HandleCampusAcademicEvents,

		// Academic Curriculum Subjects & Allocations
		"/api/v1/campus/subjects":             handlers.HandleCampusSubjects,
		"/api/campus/subjects":                handlers.HandleCampusSubjects,
		"/api/v1/campus/subjects/allocations": handlers.HandleCampusSubjectAllocations,
		"/api/campus/subjects/allocations":    handlers.HandleCampusSubjectAllocations,

		// Staff & Faculty HR Management
		"/api/v1/campus/staff":  handlers.HandleCampusStaff,
		"/api/campus/staff":     handlers.HandleCampusStaff,
		"/api/v1/campus/tutors": handlers.HandleCampusTutors,
		"/api/campus/tutors":    handlers.HandleCampusTutors,

		// Parent & Guardian CRM Directory
		"/api/v1/campus/parents":       handlers.HandleCampusParents,
		"/api/campus/parents":          handlers.HandleCampusParents,
		"/api/v1/campus/parents/wards": handlers.HandleCampusParentWards,
		"/api/campus/parents/wards":    handlers.HandleCampusParentWards,
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

package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"service_users.resultspro.ng/config"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/handlers"
	"service_users.resultspro.ng/middleware"
	"service_users.resultspro.ng/utils"
)

func main() {
	// 1. Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Note: .env file not found, loading environment from system")
	}

	config.InitConfig()

	// 2. Initialize database
	if config.DatabaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}
	log.Printf("Connecting to database...")
	db.InitDB(config.DatabaseURL)

	mux := http.NewServeMux()

	// --- Health Check ---
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"status":  "healthy",
			"service": "service_users (Identity, Academics & Subscriptions Engine)",
			"version": "2.0.0",
		})
	})
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"status":  "healthy",
			"service": "service_users",
		})
	})

	// --- 1. Identity & Central Authentication ---
	mux.HandleFunc("/auth/signup", handlers.HandleSignup)
	mux.HandleFunc("/api/v1/auth/signup", handlers.HandleSignup)

	mux.HandleFunc("/auth/login", handlers.HandleLogin)
	mux.HandleFunc("/api/v1/auth/login", handlers.HandleLogin)

	mux.HandleFunc("/auth/google", handlers.HandleGoogleLogin)
	mux.HandleFunc("/callback", handlers.HandleGoogleCallback)
	mux.HandleFunc("/api/v1/auth/google", handlers.HandleGoogleLogin)
	mux.HandleFunc("/api/v1/auth/callback/google", handlers.HandleGoogleCallback)

	mux.HandleFunc("/auth/microsoft", handlers.HandleMicrosoftLogin)
	mux.HandleFunc("/callback/microsoft", handlers.HandleMicrosoftCallback)
	mux.HandleFunc("/api/v1/auth/microsoft", handlers.HandleMicrosoftLogin)
	mux.HandleFunc("/api/v1/auth/callback/microsoft", handlers.HandleMicrosoftCallback)

	mux.HandleFunc("/auth/refresh", handlers.HandleTokenRefresh)
	mux.HandleFunc("/api/v1/auth/refresh", handlers.HandleTokenRefresh)

	mux.HandleFunc("/auth/logout", handlers.HandleLogout)
	mux.HandleFunc("/api/v1/auth/logout", handlers.HandleLogout)

	mux.HandleFunc("/auth/logout-all", handlers.HandleLogoutAll)
	mux.HandleFunc("/api/v1/auth/logout-all", handlers.HandleLogoutAll)

	mux.HandleFunc("/auth/introspect", handlers.HandleIntrospect)
	mux.HandleFunc("/api/v1/auth/introspect", handlers.HandleIntrospect)

	// Account Management
	mux.HandleFunc("/auth/verify-email", handlers.HandleVerifyEmail)
	mux.HandleFunc("/api/v1/auth/verify-email", handlers.HandleVerifyEmail)

	mux.HandleFunc("/auth/forgot-password", handlers.HandleForgotPassword)
	mux.HandleFunc("/api/v1/auth/forgot-password", handlers.HandleForgotPassword)

	mux.HandleFunc("/auth/reset-password", handlers.HandleResetPassword)
	mux.HandleFunc("/api/v1/auth/reset-password", handlers.HandleResetPassword)

	mux.HandleFunc("/auth/update-profile", handlers.HandleUpdateProfile)
	mux.HandleFunc("/api/v1/auth/update-profile", handlers.HandleUpdateProfile)

	mux.HandleFunc("/auth/change-password", handlers.HandleChangePassword)
	mux.HandleFunc("/api/v1/auth/change-password", handlers.HandleChangePassword)

	mux.HandleFunc("/auth/change-email", handlers.HandleChangeEmail)
	mux.HandleFunc("/api/v1/auth/change-email", handlers.HandleChangeEmail)

	// MFA Management
	mux.HandleFunc("/auth/mfa/setup", handlers.HandleMFASetup)
	mux.HandleFunc("/api/v1/auth/mfa/setup", handlers.HandleMFASetup)

	mux.HandleFunc("/auth/mfa/verify", handlers.HandleMFAVerify)
	mux.HandleFunc("/api/v1/auth/mfa/verify", handlers.HandleMFAVerify)

	mux.HandleFunc("/auth/mfa/disable", handlers.HandleMFADisable)
	mux.HandleFunc("/api/v1/auth/mfa/disable", handlers.HandleMFADisable)

	mux.HandleFunc("/auth/mfa/challenge", handlers.HandleMFAChallenge)
	mux.HandleFunc("/api/v1/auth/mfa/challenge", handlers.HandleMFAChallenge)

	// --- 2. Universal Handshake, Discovery & Profiles ---
	mux.HandleFunc("/intelligence/profile/", handlers.HandleGetProfile)
	mux.HandleFunc("/user/profiles", handlers.HandleGetBulkProfiles)
	mux.HandleFunc("/api/v1/users", handlers.HandleListAllUsers)
	mux.HandleFunc("/api/v1/users/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/profile") {
			handlers.HandleGetProfile(w, r)
		} else if strings.HasSuffix(r.URL.Path, "/status") {
			handlers.HandleUpdateUserStatus(w, r)
		} else {
			handlers.HandleGetUserDetail(w, r)
		}
	})

	mux.HandleFunc("/intelligence/profiles/bulk", handlers.HandleGetBulkProfiles)
	mux.HandleFunc("/api/v1/users/profiles/bulk", handlers.HandleGetBulkProfiles)

	// --- 3. Institutional Relationships & Tenants ---
	mux.HandleFunc("/intelligence/tenant/", func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) < 4 {
			utils.JSONError(w, http.StatusNotFound, "Resource not found")
			return
		}

		if parts[3] == "create" {
			handlers.HandleCreateTenant(w, r)
			return
		}

		if len(parts) == 4 {
			// e.g. /intelligence/tenant/{id}
			handlers.HandleGetTenant(w, r)
			return
		}

		subAction := parts[4]
		switch subAction {
		case "verify":
			handlers.HandleVerifyTenant(w, r)
		case "hierarchy":
			handlers.HandleGetTenantHierarchy(w, r)
		case "branding":
			if r.Method == http.MethodGet {
				handlers.HandleGetTenantBranding(w, r)
			} else {
				handlers.HandleUpdateTenantBranding(w, r)
			}
		default:
			utils.JSONError(w, http.StatusNotFound, "Action not found")
		}
	})

	// Direct REST Tenant endpoints
	mux.HandleFunc("/api/public/tenant/resolve", handlers.HandleResolveTenant)

	// Admin Global Telemetry
	mux.HandleFunc("/api/v1/admin/stats", handlers.HandleGetSuiteStats)
	mux.HandleFunc("/api/v1/admin/payouts", handlers.HandleGetAdminPayouts)
	mux.HandleFunc("/api/v1/admin/plans", handlers.HandleListPlans)
	mux.HandleFunc("/api/v1/admin/invoices", handlers.HandleListInvoices)

	mux.HandleFunc("/api/v1/tenants", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleCreateTenant(w, r)
		} else {
			handlers.HandleListTenants(w, r)
		}
	})
	mux.HandleFunc("/api/v1/tenants/", func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) >= 5 {
			action := parts[4]
			switch action {
			case "hierarchy":
				handlers.HandleGetTenantHierarchy(w, r)
			case "branding":
				if r.Method == http.MethodGet {
					handlers.HandleGetTenantBranding(w, r)
				} else {
					handlers.HandleUpdateTenantBranding(w, r)
				}
			case "verify":
				handlers.HandleVerifyTenant(w, r)
			case "roles":
				if r.Method == http.MethodPost {
					handlers.HandleAssignTenantRole(w, r)
				} else {
					handlers.HandleGetTenantRoles(w, r)
				}
			case "sessions":
				if r.Method == http.MethodPost {
					handlers.HandleCreateSession(w, r)
				} else {
					handlers.HandleGetSessions(w, r)
				}
			case "classes":
				if r.Method == http.MethodPost {
					handlers.HandleCreateClass(w, r)
				} else {
					handlers.HandleGetClasses(w, r)
				}
			case "subjects":
				if r.Method == http.MethodPost {
					handlers.HandleCreateSubject(w, r)
				} else {
					handlers.HandleGetSubjects(w, r)
				}
			default:
				utils.JSONError(w, http.StatusNotFound, "Tenant endpoint not found")
			}
			return
		}
		handlers.HandleGetTenant(w, r)
	})

	// --- 4. Family Relationships & Relation Verification ---
	mux.HandleFunc("/intelligence/verify-relation", handlers.HandleVerifyRelation)
	mux.HandleFunc("/api/v1/family/verify-relation", handlers.HandleVerifyRelation)
	mux.HandleFunc("/api/v1/family/relationships", handlers.HandleCreateFamilyRelationship)
	mux.HandleFunc("/api/v1/family/parents/", handlers.HandleGetParentChildren)
	mux.HandleFunc("/intelligence/class/parents", handlers.HandleGetClassParents)
	mux.HandleFunc("/api/v1/classes/parents", handlers.HandleGetClassParents)

	// --- 5. Academics Graph Engine ---
	// Sessions & Terms
	mux.HandleFunc("/api/v1/sessions", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleCreateSession(w, r)
		} else {
			handlers.HandleGetSessions(w, r)
		}
	})
	mux.HandleFunc("/api/v1/terms", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleCreateTerm(w, r)
		} else {
			handlers.HandleGetTerms(w, r)
		}
	})

	// Classes & Sections
	mux.HandleFunc("/api/v1/classes", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleCreateClass(w, r)
		} else {
			handlers.HandleGetClasses(w, r)
		}
	})
	mux.HandleFunc("/api/v1/sections", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleCreateSection(w, r)
		} else {
			handlers.HandleGetSections(w, r)
		}
	})
	mux.HandleFunc("/api/v1/sections/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/students") {
			handlers.HandleGetSectionEnrollments(w, r)
		} else {
			handlers.HandleGetSections(w, r)
		}
	})

	// Subjects & Students
	mux.HandleFunc("/intelligence/student/", handlers.HandleGetStudentSubjects)
	mux.HandleFunc("/api/v1/students/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/subjects") {
			handlers.HandleGetStudentSubjects(w, r)
		} else if strings.HasSuffix(r.URL.Path, "/progress") {
			handlers.HandleGetProgress(w, r)
		} else {
			utils.JSONError(w, http.StatusNotFound, "Endpoint not found")
		}
	})
	mux.HandleFunc("/api/v1/subjects", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleCreateSubject(w, r)
		} else {
			handlers.HandleGetSubjects(w, r)
		}
	})

	// Curriculums & Syllabus
	mux.HandleFunc("/intelligence/curriculum", handlers.HandleGetCurriculums)
	mux.HandleFunc("/api/v1/curriculums", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleCreateCurriculum(w, r)
		} else {
			handlers.HandleGetCurriculums(w, r)
		}
	})
	mux.HandleFunc("/intelligence/syllabus/tenant/", handlers.HandleGetTenantSyllabus)
	mux.HandleFunc("/api/v1/syllabus/tenant/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleAddSyllabusWeek(w, r)
		} else {
			handlers.HandleGetTenantSyllabus(w, r)
		}
	})
	mux.HandleFunc("/intelligence/syllabus/exam/", handlers.HandleGetExamSyllabus)
	mux.HandleFunc("/api/v1/syllabus/exam/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.HandleSaveExamSyllabus(w, r)
		} else {
			handlers.HandleGetExamSyllabus(w, r)
		}
	})
	mux.HandleFunc("/api/v1/exam-bodies", handlers.HandleGetExamBodies)
	mux.HandleFunc("/api/v1/national-exams", handlers.HandleGetNationalExams)

	// Enrollments & Assignments
	mux.HandleFunc("/api/v1/enrollments", handlers.HandleEnrollStudent)
	mux.HandleFunc("/api/v1/assignments", handlers.HandleAssignTeacher)
	mux.HandleFunc("/api/v1/teachers/", handlers.HandleGetTeacherAssignments)

	// Progress & Resources
	mux.HandleFunc("/api/v1/progress/student", handlers.HandleUpdateProgress)
	mux.HandleFunc("/api/v1/resources/link", handlers.HandleLinkResource)
	mux.HandleFunc("/api/v1/resources/topic/", handlers.HandleGetTopicResources)

	// --- 6. Subscriptions & Billing Management ---
	mux.HandleFunc("/intelligence/subscription", handlers.HandleUpdateSubscription)
	mux.HandleFunc("/api/v1/subscriptions", handlers.HandleUpdateSubscription)
	mux.HandleFunc("/api/v1/subscriptions/tenant/", handlers.HandleGetTenantSubscription)
	mux.HandleFunc("/api/v1/subscriptions/user/", handlers.HandleGetUserSubscription)
	mux.HandleFunc("/api/v1/subscriptions/limits", handlers.HandleCheckSubscriptionLimits)
	mux.HandleFunc("/api/v1/billing/plans", handlers.HandleGetPlans)
	mux.HandleFunc("/api/v1/billing/invoices/tenant/", handlers.HandleGetTenantInvoices)
	mux.HandleFunc("/api/v1/billing/webhook", handlers.HandleProcessWebhook)

	// --- 7. Agents & Commissions ---
	mux.HandleFunc("/intelligence/agent/", handlers.HandleGetAgentPortfolio)
	mux.HandleFunc("/api/v1/agents/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/portfolio") {
			handlers.HandleGetAgentPortfolio(w, r)
		} else if strings.HasSuffix(r.URL.Path, "/commissions") {
			handlers.HandleGetAgentCommissions(w, r)
		} else if strings.HasSuffix(r.URL.Path, "/payout") {
			handlers.HandleRequestPayout(w, r)
		} else {
			utils.JSONError(w, http.StatusNotFound, "Agent endpoint not found")
		}
	})

	// Wrap entire handler tree with CORS middleware
	handler := middleware.EnableCORS(mux)

	port := config.Port
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	log.Printf("=========================================================")
	log.Printf("🚀 service_users (Identity, Academics & Subscriptions) starting on port %s...", port)
	log.Printf("🔒 Central Auth Routes active on /auth/* & /api/v1/auth/*")
	log.Printf("🧠 Academic Intelligence & Profiles active on /intelligence/* & /api/v1/*")
	log.Printf("💳 Central Subscription & Tier Enforcement active")
	log.Printf("=========================================================")

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}

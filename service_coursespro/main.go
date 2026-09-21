package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"service_coursespro/db"
	"service_coursespro/handlers"
	"service_coursespro/middleware"
	"service_coursespro/ws"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Note: .env file not found, using system environment variables")
	}

	db.InitDB()

	h := handlers.NewHandler()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-App-ID", "X-App-Secret", "X-Tenant-Domain"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "service_coursespro"})
	})

	// Public Routes
	public := r.Group("/api/public")
	{
		public.GET("/cohorts", h.GetPublicCohorts)
		public.GET("/cohorts/:id", h.GetCohortDetail)
		public.GET("/portfolio/:username", h.GetPublicPortfolio)

		// Store
		public.GET("/store", h.PublicGetStoreProducts)
		public.GET("/store/:id", h.PublicGetStoreProduct)

	}

	// Protected Routes (Introspection Verified)
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// Journeys & Modules
		protected.GET("/cohorts/:id/journey", h.GetCohortJourney)
		protected.POST("/modules/:id/progress", h.UpdateModuleProgress)
		protected.POST("/payments/intent", h.CreatePaymentIntent)

		// Projects & Submissions
		protected.POST("/projects/submit", h.SubmitProject)
		protected.GET("/projects/my-submissions", h.GetMySubmissions)
		protected.POST("/submissions/blocks", h.SubmitBlock)
		protected.GET("/submissions/blocks", h.GetMyBlockSubmissions)

		// Mentor Console
		protected.GET("/mentor/profile", h.GetMentorProfile)
		protected.GET("/mentor/sessions", h.GetMentorSessions)
		protected.GET("/mentor/submissions", h.GetPendingSubmissions)
		protected.POST("/mentor/submissions/:id/review", h.ReviewSubmission)
		protected.GET("/mentor/submissions/blocks", h.GetPendingBlockSubmissions)
		protected.POST("/mentor/submissions/blocks/:id/review", h.ReviewBlockSubmission)

		// Classroom & Peers
		protected.GET("/classroom/presence", h.GetPresence)
		protected.POST("/classroom/heartbeat", h.PresenceHeartbeat)
		protected.GET("/classroom/ws", ws.HandleWS)
		protected.GET("/peers/roster", h.GetPeers)

		// Admin Endpoints
		protected.GET("/admin/programs", h.AdminGetPrograms)
		protected.GET("/admin/quizzes", h.AdminGetQuizzes)
		protected.GET("/admin/quizzes/:id", h.AdminGetQuiz)
		protected.POST("/admin/quizzes", h.AdminCreateQuiz)

		protected.GET("/admin/programs/:id/stages", h.AdminGetProgramStages)
		protected.POST("/admin/programs", h.AdminCreateProgram)
		protected.PUT("/admin/programs/:id", h.AdminUpdateProgram)
		protected.DELETE("/admin/programs/:id", h.AdminDeleteProgram)

		protected.GET("/admin/cohorts/stats", h.AdminGetCohortStats)
		protected.GET("/admin/cohorts", h.AdminGetCohorts)
		protected.POST("/admin/cohorts", h.AdminCreateCohort)
		protected.PUT("/admin/cohorts/:id", h.AdminUpdateCohort)

		protected.POST("/admin/stages", h.AdminCreateStage)
		protected.PUT("/admin/stages/:id", h.AdminUpdateStage)
		protected.DELETE("/admin/stages/:id", h.AdminDeleteStage)

		protected.POST("/admin/modules", h.AdminCreateModule)
		protected.PUT("/admin/modules/:id", h.AdminUpdateModule)
		protected.DELETE("/admin/modules/:id", h.AdminDeleteModule)

		protected.GET("/admin/enrollments", h.AdminGetEnrollments)

		// Admin Mentors
		protected.GET("/admin/mentors/stats", h.AdminGetMentorsStats)
		protected.GET("/admin/mentors", h.AdminGetMentors)
		protected.GET("/admin/mentors/activity-report", h.AdminGetMentorsActivity)
		protected.POST("/admin/mentors/sync", h.SyncMentorProfile)
		protected.DELETE("/admin/mentors/:id", h.AdminDeleteMentor)
		protected.PUT("/admin/mentors/:id", h.AdminUpdateMentor)
		protected.POST("/admin/mentors/invite", h.AdminInviteMentor)

		// Admin Settings (Courses Specific)
		protected.GET("/admin/settings", h.AdminGetSettings)
		protected.PUT("/admin/settings", h.AdminUpdateSettings)

		// Store
		protected.GET("/admin/store", h.AdminGetStoreProducts)
		protected.POST("/admin/store", h.AdminCreateStoreProduct)
		protected.PUT("/admin/store/:id", h.AdminUpdateStoreProduct)
		protected.DELETE("/admin/store/:id", h.AdminDeleteStoreProduct)

		// AI Features
		protected.POST("/ai/modules/:moduleId/generate-quiz", h.GenerateQuiz)
		protected.POST("/admin/ai/generate-quiz-preview", h.GenerateQuizPreview)

		// Student Dashboard
		protected.GET("/student/dashboard/summary", h.GetStudentDashboardSummary)

		// Admin Payments logic has been moved to service_users for centralization
	}

	// Webhooks
	// Paystack webhook moved to service_users
	r.POST("/api/internal/enrollments/payment-callback", h.InternalPaymentCallback)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("CoursesPRO service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

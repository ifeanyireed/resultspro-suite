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
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-App-ID", "X-App-Secret"},
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
	}

	// Protected Routes (Introspection Verified)
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// Journeys & Modules
		protected.GET("/cohorts/:id/journey", h.GetCohortJourney)
		protected.POST("/modules/:id/progress", h.UpdateModuleProgress)

		// Projects & Submissions
		protected.POST("/projects/submit", h.SubmitProject)
		protected.GET("/projects/my-submissions", h.GetMySubmissions)

		// Mentor Console
		protected.GET("/mentor/submissions", h.GetPendingSubmissions)
		protected.POST("/mentor/submissions/:id/review", h.ReviewSubmission)

		// Classroom & Presence
		protected.GET("/classroom/presence", h.GetPresence)
		protected.POST("/classroom/heartbeat", h.PresenceHeartbeat)

		// Peers
		protected.GET("/peers/roster", h.GetPeers)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("CoursesPRO service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

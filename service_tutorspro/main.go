package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"service_tutorspro/db"
	"service_tutorspro/handlers"
	"service_tutorspro/middleware"
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
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "service_tutorspro"})
	})

	// Public Routes
	r.GET("/api/public/tutors", h.GetPublicTutors)

	// Protected Routes
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// Tutor Onboarding & Profile
		protected.POST("/tutor/onboarding", h.TutorOnboarding)

		// Bookings
		protected.POST("/bookings", h.CreateBooking)
		protected.GET("/bookings", h.GetBookings)

		// Reviews
		protected.POST("/reviews", h.CreateReview)

		// Payouts
		protected.POST("/tutor/payouts", h.RequestPayout)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("TutorsPRO service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

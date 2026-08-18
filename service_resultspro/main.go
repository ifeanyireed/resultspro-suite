package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"service_resultspro.resultspro.ng/config"
	"service_resultspro.resultspro.ng/db"
	"service_resultspro.resultspro.ng/handlers"
	"service_resultspro.resultspro.ng/middleware"
)

func main() {
	config.InitConfig()
	db.InitDB()

	r := gin.Default()

	// Universal CORS
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-App-ID", "X-App-Secret"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "service_resultspro",
			"version": "1.0.0",
		})
	})

	// Public Scratch Card Verification (Used by Parents & Students)
	r.POST("/api/v1/cards/verify", handlers.VerifyScratchCard)

	// Protected Endpoints
	api := r.Group("/api/v1")
	api.Use(middleware.AuthMiddleware())
	{
		// Results Instances
		api.POST("/results/instances", handlers.CreateResultInstance)
		api.GET("/results/instances", handlers.GetResultInstances)
		api.PATCH("/results/instances/:instanceId/publish", handlers.PublishResults)

		// Marks & Scores Entry
		api.POST("/results/scores", handlers.EnterStudentMarks)
		api.GET("/results/instances/:instanceId/students/:studentId", handlers.GetStudentResult)

		// Analytics
		api.GET("/results/instances/:instanceId/analytics", handlers.GetInstanceAnalytics)

		// Scratch Card Batch Management (School Admins)
		api.POST("/cards/generate", handlers.GenerateScratchCards)
	}

	log.Printf("ResultsPRO Service starting on port %s...", config.AppConfig.Port)
	if err := r.Run(":" + config.AppConfig.Port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

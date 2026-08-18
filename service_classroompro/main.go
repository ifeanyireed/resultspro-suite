package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"service_classroompro/db"
	"service_classroompro/handlers"
	"service_classroompro/middleware"
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
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "service_classroompro"})
	})

	api := r.Group("/api")
	{
		// Proxied auth endpoints to central service_users
		api.Any("/auth/*any", h.ProxyAuth)

		// Public Content (with optional auth)
		content := api.Group("")
		content.Use(middleware.OptionalAuthMiddleware())
		{
			content.GET("/notes", h.GetNotes)
			content.GET("/notes/:id", h.GetNoteByID)
			content.GET("/quizzes", h.GetQuizzes)
			content.GET("/quizzes/:id", h.GetQuizByID)
			content.GET("/flashcards", h.GetFlashcards)
		}

		// Protected Student & Teacher Actions
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/teacher/notes", h.CreateNote)
			protected.POST("/teacher/quizzes", h.CreateQuiz)
			protected.POST("/teacher/flashcards", h.CreateFlashcard)

			protected.POST("/flashcards/review", h.ReviewFlashcard)
			protected.POST("/gamification/session", h.LogStudySession)
			protected.GET("/gamification/profile", h.GetGamificationProfile)

			protected.POST("/bookmarks/toggle", h.ToggleBookmark)
			protected.GET("/bookmarks", h.GetBookmarks)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("ClassroomPRO service starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

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
	db.InitRedis()

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

		// Public Content (with optional auth)
		content := api.Group("")
		content.Use(middleware.OptionalAuthMiddleware())
		{
			content.GET("/notes", h.GetNotes)
			content.GET("/notes/:id", h.GetNoteByID)
			content.GET("/videos", h.GetVideos)
			content.GET("/videos/:id", h.GetVideoByID)
			content.GET("/quizzes", h.GetQuizzes)
			content.GET("/quizzes/:id", h.GetQuizByID)
			content.GET("/flashcards", h.GetFlashcards)
			content.GET("/subjects", h.GetSubjects)
			content.GET("/dashboard/subjects", h.GetDashboardSubjects)
			content.GET("/dashboard/syllabus", h.GetDashboardSyllabus)
			content.GET("/dashboard/progress", h.GetDashboardProgress)
			content.GET("/progress/overview", h.GetDashboardProgress)
			content.GET("/gamification/leaderboard", h.GetLeaderboard)
			content.GET("/exams", h.GetExams)

			// Portable NERDC Markdown Content Repository, Versioning & Offline Sync Endpoints
			content.GET("/content/manifests", h.GetContentManifests)
			content.GET("/content/packages/:packageId", h.GetContentPackage)
			content.GET("/content/versions/:contentId", h.GetLessonVersions)
			content.POST("/content/publish", h.PublishLessonContent)
			content.POST("/sync/push", h.PushOfflineSync)
			content.GET("/sync/status", h.GetOfflineSyncStatus)

			// Study Packs Catalog, Scheme-of-Work Player, Creator Studio, Ward Purchase & Refund Purge Endpoints
			content.GET("/packs/catalog", h.GetStudyPacksCatalog)
			content.GET("/packs/me", h.GetMyStudyPacks)
			content.GET("/packs/:slug", h.GetStudyPackBySlugOrID)
			content.POST("/teacher/packs", h.CreateOrUpdateStudyPack)
			content.POST("/admin/packs/:packId/moderate", h.ModerateStudyPack)
			content.POST("/admin/packs/entitlements/:id/revoke", h.RevokePackEntitlement)
			content.POST("/packs/:packId/claim", h.ClaimFreeStudyPack)
			content.POST("/packs/:packId/checkout", h.CheckoutStudyPack)
			content.POST("/packs/:packId/download-token", h.IssuePackDownloadToken)
			content.POST("/packs/:packId/purge-ack", h.ConfirmOfflinePackPurge)
			content.POST("/webhooks/paystack", h.HandlePaystackPackWebhook)
		}

		// Protected Student & Teacher Actions
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/teacher/notes", h.CreateNote)
			protected.POST("/teacher/videos", h.CreateVideo)
			protected.POST("/teacher/quizzes", h.CreateQuiz)
			protected.POST("/teacher/flashcards", h.CreateFlashcard)
			protected.POST("/teacher/packs", h.CreateOrUpdateStudyPack)
			protected.POST("/admin/packs/:packId/moderate", h.ModerateStudyPack)
			protected.POST("/admin/packs/entitlements/:id/revoke", h.RevokePackEntitlement)

			protected.POST("/flashcards/review", h.ReviewFlashcard)
			protected.POST("/gamification/session", h.LogStudySession)
			protected.GET("/gamification/profile", h.GetGamificationProfile)

			protected.POST("/bookmarks/toggle", h.ToggleBookmark)
			protected.GET("/bookmarks", h.GetBookmarks)

			// Connected Trio: Teacher Score Approval Sync to CampusPRO & Topic Learning-Gap Telemetry
			protected.POST("/teacher/assessments/:id/approve-and-sync", h.ApproveAndSyncAssessment)
			protected.GET("/learning-gaps/student/:studentId", h.GetStudentLearningGaps)
		}
		content.GET("/learning-gaps/student/:studentId", h.GetStudentLearningGaps)
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

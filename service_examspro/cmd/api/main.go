package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"exams-resultspro-backend/internal/api/handlers"
	"exams-resultspro-backend/internal/api/middleware"
	"exams-resultspro-backend/internal/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load() 
	_ = godotenv.Load("backend/.env")
	_ = godotenv.Load("../.env")

	database.ConnectDB()

	// Initialize Handlers
	authHandler := &handlers.AuthHandler{}
	userHandler := &handlers.UserHandler{}
	examHandler := &handlers.ExamHandler{}
	quizHandler := &handlers.QuizHandler{}
	battleHandler := handlers.NewBattleHandler()
	liveHandler := &handlers.LiveGameHandler{}
	adminHandler := &handlers.AdminHandler{}
	paymentHandler := &handlers.PaymentHandler{}
	metricsHandler := &handlers.MetricsHandler{}
	modHandler := &handlers.ModerationHandler{}
	studyHandler := &handlers.StudyAssistantHandler{}
	notificationHandler := &handlers.NotificationHandler{}
	blogHandler := &handlers.BlogHandler{}

	battleHandler.StartBattleCleanupTask()
	InitWS := handlers.InitWS()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Accept", "Cache-Control", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	r.Static("/uploads", "./uploads")

	r.GET("/ws", func(c *gin.Context) {
		InitWS.Melody.HandleRequest(c.Writer, c.Request)
	})

	// --- ROOT LEVEL API DIAGNOSTICS & NOTIFS ---
	r.GET("/api/diagnostic", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "API diagnostic reachable via root router"})
	})
	r.GET("/api/notifs/unread", middleware.Authenticate(), notificationHandler.GetUnreadCount)
	r.GET("/api/notifs/popups", middleware.Authenticate(), notificationHandler.GetActivePopups)

	// --- ALL API ROUTES UNDER /api ---
	api := r.Group("/api")
	{
		// PUBLIC (NO AUTH)
		api.GET("/public/settings", adminHandler.GetPublicSettings)
		api.GET("/public/routes", handlers.GetPublicRoutes)
		api.GET("/public/metrics", metricsHandler.GetPublicMetrics)
		api.GET("/test-connectivity", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok", "message": "API connectivity is working for new routes"})
		})
		api.GET("/payment/packs", paymentHandler.GetCoinPacks)
		api.GET("/user/leaderboard", userHandler.GetLeaderboard)
		
		// Public Battle & Live Lists
		api.GET("/battles/active", battleHandler.GetActiveBattles)
		api.GET("/battles/:id", battleHandler.GetBattleById) 
		api.GET("/live/active", liveHandler.GetActiveRooms)
		api.GET("/live/rooms/:roomId", liveHandler.GetRoomById)

		// Public Exam Lists
		api.GET("/exams", examHandler.GetExams)
		api.GET("/exams/:examId/subjects", examHandler.GetSubjectsByExam)
		api.GET("/exams/:examId/syllabus", examHandler.GetFullSyllabus)

		// Public Blog
		api.GET("/blog", blogHandler.GetPosts)
		api.GET("/blog/categories", blogHandler.GetCategories)
		api.GET("/blog/:slug", blogHandler.GetPostBySlug)
		api.GET("/blog/posts/:postId/comments", blogHandler.GetComments)
		api.POST("/blog/comments", blogHandler.CreateComment)

		// Auth Endpoints
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authHandler.Signup)
			auth.POST("/login", authHandler.Login)
			auth.POST("/google", authHandler.GoogleLogin)
			auth.POST("/request-otp", authHandler.RequestOTP)
			auth.POST("/verify-otp", authHandler.VerifyOTP)
			auth.POST("/forgot-password", authHandler.ForgotPassword)
			auth.POST("/reset-password", authHandler.ResetPassword)
		}

		// --- AUTHENTICATED ROUTES ---
		authenticated := api.Group("")
		authenticated.Use(middleware.Authenticate())
		{
			// User
			userGroup := authenticated.Group("/user")
			{
				userGroup.GET("/profile", userHandler.GetProfile)
				userGroup.PUT("/profile", userHandler.UpdateProfile)
				userGroup.GET("/coin-history", userHandler.GetCoinHistory)
				userGroup.GET("/referrals", userHandler.GetReferrals)
				userGroup.GET("/rank", userHandler.GetRank)
				userGroup.GET("/dashboard", userHandler.GetDashboard)
				userGroup.GET("/analytics", userHandler.GetAnalytics)
			}

			// Exams
			examGroup := authenticated.Group("/exams")
			{
				examGroup.GET("/subjects/:subjectId", examHandler.GetSubjectById)
				examGroup.GET("/subjects/:subjectId/years", examHandler.GetYearsBySubject)
				examGroup.GET("/subjects/:subjectId/topics", examHandler.GetTopicsBySubject)
				examGroup.GET("/subjects/:subjectId/questions", examHandler.GetQuestionsBySubject)
			}

			// Quiz
			quizGroup := authenticated.Group("/quiz")
			{
				quizGroup.GET("/available-types", quizHandler.GetAvailableQuestionTypes)
				quizGroup.POST("/submit", quizHandler.SubmitAnswer)
				quizGroup.POST("/hint", quizHandler.GetHint)
			}
			authenticated.GET("/quiz/topics/:topicId/questions", quizHandler.GetQuestionsByTopic)

			// Battles
			battleGroup := authenticated.Group("/battles")
			{
				battleGroup.POST("/create", battleHandler.CreateBattle)
				battleGroup.POST("/create-bot", battleHandler.CreateBotBattle)
				battleGroup.GET("/history", battleHandler.GetBattleHistory)
				battleGroup.POST("/queue", battleHandler.JoinQueue)
				battleGroup.POST("/join/:battleId", battleHandler.JoinBattle)
				battleGroup.POST("/:id/start", battleHandler.StartBattle)
				battleGroup.POST("/:id/leave", battleHandler.LeaveBattle)
				battleGroup.POST("/submit-score", battleHandler.SubmitScore)
				battleGroup.POST("/tournament/register/:id", battleHandler.RegisterForTournament)
			}

			// Tournaments
			authenticated.GET("/tournaments/current", battleHandler.GetCurrentTournament)
			authenticated.GET("/tournaments/:id/rankings", battleHandler.GetTournamentRankings)

			// Study Assistant
			studyGroup := authenticated.Group("/study-assistant")
			{
				studyGroup.GET("/dashboard", studyHandler.GetDashboard)
				studyGroup.POST("/chat", studyHandler.Chat)
				studyGroup.GET("/sessions/:sessionId/messages", studyHandler.GetSessionMessages)
				studyGroup.GET("/topic/:topicId", studyHandler.GetTopicStudyAssistant)
				studyGroup.GET("/topic/:topicId/status", studyHandler.GetTopicStudyStatus)
				studyGroup.POST("/topic/:topicId/ask", studyHandler.AskTopicQuestion)
			}

			// Additional Notifications
			authenticated.GET("/notifications", notificationHandler.GetNotifications)
			authenticated.PATCH("/notifications/:id/read", notificationHandler.MarkRead)
			authenticated.POST("/notifications/read-all", notificationHandler.MarkAllRead)

			// Live Rooms
			liveGroup := authenticated.Group("/live")
			{
				liveGroup.POST("/create", liveHandler.CreateRoom)
				liveGroup.POST("/join/:roomId", liveHandler.JoinRoom)
				liveGroup.POST("/rooms/:roomId/end", middleware.IsModerator(), liveHandler.EndMatch)
				liveGroup.POST("/rooms/:roomId/terminate", middleware.IsModerator(), liveHandler.TerminateRoom)
			}

			// Payments & Moderation
			authenticated.POST("/payment/initialize", paymentHandler.InitializePayment)
			authenticated.GET("/payment/verify", paymentHandler.VerifyPayment)
			authenticated.POST("/moderation/report", modHandler.SubmitReport)

			// --- ADMIN ---
			admin := authenticated.Group("/admin")
			{
				// Admin Only
				admin.GET("/user-details/:userId", middleware.IsAdmin(), adminHandler.GetUserDetail)
				admin.GET("/users", middleware.IsAdmin(), adminHandler.GetUsers)
				admin.POST("/users", middleware.IsAdmin(), adminHandler.CreateUser)
				admin.POST("/users/import", middleware.IsAdmin(), adminHandler.ImportUsers)
				admin.PUT("/users/:userId", middleware.IsAdmin(), adminHandler.UpdateUser)
				admin.POST("/users/:userId/suspend", middleware.IsAdmin(), adminHandler.SuspendUser)
				admin.POST("/users/:userId/unsuspend", middleware.IsAdmin(), adminHandler.UnsuspendUser)
				admin.GET("/settings", middleware.IsAdmin(), adminHandler.GetSettings)
				admin.PUT("/settings/:id", middleware.IsAdmin(), adminHandler.UpdateSetting)
				admin.GET("/coin-packs", middleware.IsAdmin(), adminHandler.GetCoinPacks)
				admin.POST("/coin-packs", middleware.IsAdmin(), adminHandler.CreateCoinPack)
				admin.PUT("/coin-packs/:id", middleware.IsAdmin(), adminHandler.UpdateCoinPack)
				admin.DELETE("/coin-packs/:id", middleware.IsAdmin(), adminHandler.DeleteCoinPack)
				admin.GET("/tournaments", middleware.IsAdmin(), battleHandler.GetAllTournaments)
				admin.POST("/tournaments", middleware.IsAdmin(), battleHandler.CreateTournament)
				admin.PUT("/tournaments/:id", middleware.IsAdmin(), battleHandler.UpdateTournament)
				admin.DELETE("/tournaments/:id", middleware.IsAdmin(), battleHandler.DeleteTournament)
				
				// Admin/Mod Stats & Content
				admin.GET("/exams", middleware.IsModerator(), adminHandler.GetExams)
				admin.POST("/exams", middleware.IsModerator(), adminHandler.CreateExam)
				admin.PUT("/exams/:id", middleware.IsModerator(), adminHandler.UpdateExam)
				admin.DELETE("/exams/:id", middleware.IsModerator(), adminHandler.DeleteExam)
				admin.POST("/subjects", middleware.IsModerator(), adminHandler.CreateSubject)
				admin.PUT("/subjects/:id", middleware.IsModerator(), adminHandler.UpdateSubject)
				admin.DELETE("/subjects/:id", middleware.IsModerator(), adminHandler.DeleteSubject)
				admin.POST("/topics", middleware.IsModerator(), adminHandler.CreateTopic)
				admin.PUT("/topics/:id", middleware.IsModerator(), adminHandler.UpdateTopic)
				admin.DELETE("/topics/:id", middleware.IsModerator(), adminHandler.DeleteTopic)
				admin.GET("/questions/:id", middleware.IsModerator(), adminHandler.GetQuestion)
				admin.GET("/questions", middleware.IsModerator(), adminHandler.GetQuestions)
				admin.POST("/questions", middleware.IsModerator(), adminHandler.CreateQuestion)
				admin.PUT("/questions/:id", middleware.IsModerator(), adminHandler.UpdateQuestion)
				admin.DELETE("/questions/:id", middleware.IsModerator(), adminHandler.DeleteQuestion)
				admin.POST("/questions/bulk-delete", middleware.IsModerator(), adminHandler.BulkDeleteQuestions)
				admin.POST("/questions/:questionId/generate-ai-explanation", middleware.IsModerator(), adminHandler.GenerateAIExplanation)
				admin.POST("/questions/assist-create", middleware.IsModerator(), adminHandler.AssistCreateQuestion)
				admin.POST("/questions/bulk-upload", middleware.IsModerator(), adminHandler.BulkUploadQuestions)
				admin.POST("/subjects/upload-textbook", middleware.IsModerator(), adminHandler.UploadTextbook)
				admin.POST("/upload-image", middleware.IsModerator(), adminHandler.UploadImage)
				
				admin.GET("/referrals/stats", middleware.IsAdmin(), adminHandler.GetReferralStats)
				admin.GET("/battles/monitor-stats", middleware.IsAdmin(), adminHandler.GetBattleMonitorStats)
				admin.GET("/finances/stats", middleware.IsAdmin(), adminHandler.GetFinancialStats)
				admin.GET("/analytics/stats", middleware.IsAdmin(), adminHandler.GetAnalyticsStats)
				admin.GET("/overview", middleware.IsAdmin(), adminHandler.GetOverview)
				admin.GET("/notifications/logs", middleware.IsAdmin(), adminHandler.GetNotificationLogs)
				admin.GET("/notifications/campaigns", middleware.IsAdmin(), adminHandler.GetNotificationCampaigns)
				admin.POST("/notifications/campaigns", middleware.IsAdmin(), adminHandler.CreateCampaign)
				admin.GET("/notifications/popups", middleware.IsAdmin(), adminHandler.GetPopups)
				admin.POST("/notifications/popups", middleware.IsAdmin(), adminHandler.CreatePopup)
				admin.PUT("/notifications/popups/:id", middleware.IsAdmin(), adminHandler.UpdatePopup)
				admin.DELETE("/notifications/popups/:id", middleware.IsAdmin(), adminHandler.DeletePopup)
				admin.GET("/syllabus/template", middleware.IsModerator(), examHandler.DownloadSyllabusTemplate)
				admin.POST("/syllabus/bulk-import", middleware.IsModerator(), examHandler.ImportSyllabus)
				admin.GET("/reports", middleware.IsModerator(), modHandler.GetReports)
				admin.PATCH("/reports/:id/status", middleware.IsModerator(), modHandler.UpdateReportStatus)
				admin.POST("/moderation/users/:userId/ban", middleware.IsModerator(), modHandler.BanUser)
				admin.POST("/moderation/users/:userId/unban", middleware.IsModerator(), modHandler.UnbanUser)
				admin.PATCH("/moderation/questions/:id/status", middleware.IsModerator(), modHandler.UpdateQuestionStatus)

				// Blog Admin
				admin.GET("/blog/posts", middleware.IsModerator(), blogHandler.AdminGetPosts)
				admin.POST("/blog/posts", middleware.IsModerator(), blogHandler.CreatePost)
				admin.PUT("/blog/posts/:id", middleware.IsModerator(), blogHandler.UpdatePost)
				admin.DELETE("/blog/posts/:id", middleware.IsModerator(), blogHandler.DeletePost)
				admin.POST("/blog/categories", middleware.IsModerator(), blogHandler.CreateCategory)
				admin.GET("/blog/comments", middleware.IsModerator(), blogHandler.AdminGetComments)
				admin.PATCH("/blog/comments/:id", middleware.IsModerator(), blogHandler.UpdateCommentStatus)
				admin.DELETE("/blog/comments/:id", middleware.IsModerator(), blogHandler.DeleteComment)
			}
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)
	fmt.Printf("Starting server on :%s...\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

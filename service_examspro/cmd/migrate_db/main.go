package main

import (
	"log"

	"exams-resultspro-backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	// Connect to SQLite
	log.Println("Connecting to SQLite (dev.db)...")
	sqliteDB, err := gorm.Open(sqlite.Open("../../dev.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})
	if err != nil {
		log.Fatalf("Failed to connect to SQLite: %v", err)
	}

	// Connect to MySQL
	log.Println("Connecting to MySQL...")
	dsn := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	mysqlDB, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})
	if err != nil {
		log.Fatalf("Failed to connect to MySQL: %v", err)
	}

	// Migrate Schema
	log.Println("Auto-migrating MySQL Schema...")
	err = mysqlDB.AutoMigrate(
		&models.User{},
		&models.CoinTransaction{},
		&models.Referral{},
		&models.Exam{},
		&models.Subject{},
		&models.Topic{},
		&models.Question{},
		&models.QuestionOption{},
		&models.UserAnswer{},
		&models.Battle{},
		&models.BattleParticipant{},
		&models.BattleQuestion{},
		&models.StudySession{},
		&models.ChatMessage{},
		&models.Report{},
		&models.CoinPack{},
		&models.Purchase{},
		&models.Withdrawal{},
		&models.LiveGameRoom{},
		&models.LiveGameParticipant{},
		&models.LiveRoomChatMessage{},
		&models.SystemSetting{},
		&models.Tournament{},
		&models.TournamentParticipant{},
		&models.Notification{},
		&models.NotificationLog{},
		&models.NotificationCampaign{},
		&models.PopupNotification{},
		&models.BlogPost{},
		&models.BlogCategory{},
		&models.BlogComment{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate MySQL: %v", err)
	}

	// Helper function to copy data
	copyData := func(model interface{}, name string) {
		log.Printf("Copying %s...", name)
		var items []map[string]interface{}
		
		// Fetch all rows as maps to avoid issues with missing fields or associations
		if err := sqliteDB.Model(model).Find(&items).Error; err != nil {
			log.Printf("Error fetching %s: %v", name, err)
			return
		}

		if len(items) == 0 {
			log.Printf("No %s to copy.", name)
			return
		}

		log.Printf("Found %d %s. Inserting...", len(items), name)
		
		// Since items is map, we need to create it carefully, or just use the model structs.
		// Wait, using the model struct directly is safer if there are nested relations, but let's just use Create on the model structs.
		// Wait! Go reflection for slices is tricky, so let's just use the concrete types.
	}

	// Let's copy using concrete slices
	log.Println("Starting data transfer...")

	var users []models.User
	sqliteDB.Find(&users)
	if len(users) > 0 { mysqlDB.CreateInBatches(users, 100); log.Printf("Copied %d Users", len(users)) }

	var coinTransactions []models.CoinTransaction
	sqliteDB.Find(&coinTransactions)
	if len(coinTransactions) > 0 { mysqlDB.CreateInBatches(coinTransactions, 100); log.Printf("Copied %d CoinTransactions", len(coinTransactions)) }

	var referrals []models.Referral
	sqliteDB.Find(&referrals)
	if len(referrals) > 0 { mysqlDB.CreateInBatches(referrals, 100); log.Printf("Copied %d Referrals", len(referrals)) }

	var exams []models.Exam
	sqliteDB.Find(&exams)
	if len(exams) > 0 { mysqlDB.CreateInBatches(exams, 100); log.Printf("Copied %d Exams", len(exams)) }

	var subjects []models.Subject
	sqliteDB.Find(&subjects)
	if len(subjects) > 0 { mysqlDB.CreateInBatches(subjects, 100); log.Printf("Copied %d Subjects", len(subjects)) }

	var topics []models.Topic
	sqliteDB.Find(&topics)
	if len(topics) > 0 { mysqlDB.CreateInBatches(topics, 100); log.Printf("Copied %d Topics", len(topics)) }

	var questions []models.Question
	sqliteDB.Find(&questions)
	if len(questions) > 0 { mysqlDB.CreateInBatches(questions, 100); log.Printf("Copied %d Questions", len(questions)) }

	var questionOptions []models.QuestionOption
	sqliteDB.Find(&questionOptions)
	if len(questionOptions) > 0 { mysqlDB.CreateInBatches(questionOptions, 100); log.Printf("Copied %d QuestionOptions", len(questionOptions)) }

	var userAnswers []models.UserAnswer
	sqliteDB.Find(&userAnswers)
	if len(userAnswers) > 0 { mysqlDB.CreateInBatches(userAnswers, 100); log.Printf("Copied %d UserAnswers", len(userAnswers)) }

	var battles []models.Battle
	sqliteDB.Find(&battles)
	if len(battles) > 0 { mysqlDB.CreateInBatches(battles, 100); log.Printf("Copied %d Battles", len(battles)) }

	var battleParticipants []models.BattleParticipant
	sqliteDB.Find(&battleParticipants)
	if len(battleParticipants) > 0 { mysqlDB.CreateInBatches(battleParticipants, 100); log.Printf("Copied %d BattleParticipants", len(battleParticipants)) }

	var battleQuestions []models.BattleQuestion
	sqliteDB.Find(&battleQuestions)
	if len(battleQuestions) > 0 { mysqlDB.CreateInBatches(battleQuestions, 100); log.Printf("Copied %d BattleQuestions", len(battleQuestions)) }

	var studySessions []models.StudySession
	sqliteDB.Find(&studySessions)
	if len(studySessions) > 0 { mysqlDB.CreateInBatches(studySessions, 100); log.Printf("Copied %d StudySessions", len(studySessions)) }

	var chatMessages []models.ChatMessage
	sqliteDB.Find(&chatMessages)
	if len(chatMessages) > 0 { mysqlDB.CreateInBatches(chatMessages, 100); log.Printf("Copied %d ChatMessages", len(chatMessages)) }

	var reports []models.Report
	sqliteDB.Find(&reports)
	if len(reports) > 0 { mysqlDB.CreateInBatches(reports, 100); log.Printf("Copied %d Reports", len(reports)) }

	var coinPacks []models.CoinPack
	sqliteDB.Find(&coinPacks)
	if len(coinPacks) > 0 { mysqlDB.CreateInBatches(coinPacks, 100); log.Printf("Copied %d CoinPacks", len(coinPacks)) }

	var purchases []models.Purchase
	sqliteDB.Find(&purchases)
	if len(purchases) > 0 { mysqlDB.CreateInBatches(purchases, 100); log.Printf("Copied %d Purchases", len(purchases)) }

	var withdrawals []models.Withdrawal
	sqliteDB.Find(&withdrawals)
	if len(withdrawals) > 0 { mysqlDB.CreateInBatches(withdrawals, 100); log.Printf("Copied %d Withdrawals", len(withdrawals)) }

	var liveGameRooms []models.LiveGameRoom
	sqliteDB.Find(&liveGameRooms)
	if len(liveGameRooms) > 0 { mysqlDB.CreateInBatches(liveGameRooms, 100); log.Printf("Copied %d LiveGameRooms", len(liveGameRooms)) }

	var liveGameParticipants []models.LiveGameParticipant
	sqliteDB.Find(&liveGameParticipants)
	if len(liveGameParticipants) > 0 { mysqlDB.CreateInBatches(liveGameParticipants, 100); log.Printf("Copied %d LiveGameParticipants", len(liveGameParticipants)) }

	var liveRoomChatMessages []models.LiveRoomChatMessage
	sqliteDB.Find(&liveRoomChatMessages)
	if len(liveRoomChatMessages) > 0 { mysqlDB.CreateInBatches(liveRoomChatMessages, 100); log.Printf("Copied %d LiveRoomChatMessages", len(liveRoomChatMessages)) }

	var systemSettings []models.SystemSetting
	sqliteDB.Find(&systemSettings)
	if len(systemSettings) > 0 { mysqlDB.CreateInBatches(systemSettings, 100); log.Printf("Copied %d SystemSettings", len(systemSettings)) }

	var tournaments []models.Tournament
	sqliteDB.Find(&tournaments)
	if len(tournaments) > 0 { mysqlDB.CreateInBatches(tournaments, 100); log.Printf("Copied %d Tournaments", len(tournaments)) }

	var tournamentParticipants []models.TournamentParticipant
	sqliteDB.Find(&tournamentParticipants)
	if len(tournamentParticipants) > 0 { mysqlDB.CreateInBatches(tournamentParticipants, 100); log.Printf("Copied %d TournamentParticipants", len(tournamentParticipants)) }

	var notifications []models.Notification
	sqliteDB.Find(&notifications)
	if len(notifications) > 0 { mysqlDB.CreateInBatches(notifications, 100); log.Printf("Copied %d Notifications", len(notifications)) }

	var notificationLogs []models.NotificationLog
	sqliteDB.Find(&notificationLogs)
	if len(notificationLogs) > 0 { mysqlDB.CreateInBatches(notificationLogs, 100); log.Printf("Copied %d NotificationLogs", len(notificationLogs)) }

	var notificationCampaigns []models.NotificationCampaign
	sqliteDB.Find(&notificationCampaigns)
	if len(notificationCampaigns) > 0 { mysqlDB.CreateInBatches(notificationCampaigns, 100); log.Printf("Copied %d NotificationCampaigns", len(notificationCampaigns)) }

	var popupNotifications []models.PopupNotification
	sqliteDB.Find(&popupNotifications)
	if len(popupNotifications) > 0 { mysqlDB.CreateInBatches(popupNotifications, 100); log.Printf("Copied %d PopupNotifications", len(popupNotifications)) }

	var blogPosts []models.BlogPost
	sqliteDB.Find(&blogPosts)
	if len(blogPosts) > 0 { mysqlDB.CreateInBatches(blogPosts, 100); log.Printf("Copied %d BlogPosts", len(blogPosts)) }

	var blogCategories []models.BlogCategory
	sqliteDB.Find(&blogCategories)
	if len(blogCategories) > 0 { mysqlDB.CreateInBatches(blogCategories, 100); log.Printf("Copied %d BlogCategories", len(blogCategories)) }

	var blogComments []models.BlogComment
	sqliteDB.Find(&blogComments)
	if len(blogComments) > 0 { mysqlDB.CreateInBatches(blogComments, 100); log.Printf("Copied %d BlogComments", len(blogComments)) }

	_ = copyData // Unused function wrapper

	log.Println("Database migration completed!")
}

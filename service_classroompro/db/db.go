package db

import (
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"service_classroompro/models"
)

var DB *gorm.DB

func InitDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	}

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Printf("GORM open warning: %v", err)
		return
	}

	// Auto-migrate ClassroomPRO tables
	_ = DB.AutoMigrate(
		&models.Note{},
		&models.Quiz{},
		&models.QuizAttempt{},
		&models.Flashcard{},
		&models.FlashcardProgress{},
		&models.Bookmark{},
		&models.GamificationProfile{},
		&models.StudySession{},
	)

	log.Println("ClassroomPRO connected to MySQL with GORM successfully")
}

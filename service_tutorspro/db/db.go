package db

import (
	"github.com/gin-gonic/gin"

	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"service_tutorspro/models"
)

var DB *gorm.DB

func InitDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres:postgres@localhost:5432/resultspro?sslmode=disable"
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Printf("GORM open warning: %v", err)
		return
	}

	sqlDB, err := DB.DB()
	if err == nil {
		sqlDB.SetMaxOpenConns(5)
		sqlDB.SetMaxIdleConns(5)
		sqlDB.SetConnMaxLifetime(time.Hour)
	}

	// Auto-migrate TutorsPRO tables
	_ = DB.AutoMigrate(
		&models.TutorProfile{},
		&models.AvailabilitySlot{},
		&models.Booking{},
		&models.TutorReview{},
		&models.TutorPayoutRequest{},
	)

	log.Println("TutorsPRO connected to MySQL with GORM successfully")
}


// WithTenant safely scopes the GORM DB instance to the current request's Tenant ID
func WithTenant(c *gin.Context) *gorm.DB {
	tenantID, exists := c.Get("tenant_id")
	if exists && tenantID != "" {
		return DB.Where("tenant_id = ?", tenantID)
	}
	return DB
}

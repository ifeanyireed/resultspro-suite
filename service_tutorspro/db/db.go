package db

import (
	"github.com/gin-gonic/gin"

	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"service_tutorspro/models"
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

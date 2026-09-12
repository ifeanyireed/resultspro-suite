package db

import (
	"github.com/gin-gonic/gin"

	"database/sql"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"service_resultspro.resultspro.ng/config"
)

var (
	DB     *sql.DB
	GormDB *gorm.DB
)

func InitDB() {
	var err error

	DB, err = sql.Open("mysql", config.AppConfig.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to MySQL database: %v", err)
	}

	DB.SetMaxOpenConns(5)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(time.Hour)

	if err = DB.Ping(); err != nil {
		log.Printf("Note: MySQL ping timeout: %v", err)
	} else {
		log.Println("Connected to ResultsPRO database with GORM successfully")
	}

	GormDB, err = gorm.Open(mysql.New(mysql.Config{
		Conn: DB,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Printf("GORM open warning: %v", err)
	}
}


// WithTenant safely scopes the GORM GormDB instance to the current request's Tenant ID
func WithTenant(c *gin.Context) *gorm.DB {
	tenantID, exists := c.Get("tenant_id")
	if exists && tenantID != "" {
		return GormDB.Where("tenant_id = ?", tenantID)
	}
	return GormDB
}

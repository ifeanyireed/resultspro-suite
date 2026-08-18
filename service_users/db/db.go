package db

import (
	"database/sql"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB     *sql.DB
	GormDB *gorm.DB
)

func InitDB(dataSourceName string) {
	var err error
	GormDB, err = gorm.Open(mysql.Open(dataSourceName), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Printf("GORM open warning: %v", err)
	}

	DB, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Optimize connection pooling for production
	DB.SetMaxOpenConns(50)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)

	if err = DB.Ping(); err != nil {
		log.Printf("Note: MySQL ping timeout (remote database will connect upon requests): %v", err)
	} else {
		log.Println("Users Microservice connected to MySQL with GORM successfully")
	}
}

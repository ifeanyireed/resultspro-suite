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

	DB, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Optimize connection pooling for shared hosting limits
	// Hostinger max_connections_per_hour is very strict (e.g., 500)
	DB.SetMaxOpenConns(5)
	DB.SetMaxIdleConns(2)
	DB.SetConnMaxLifetime(30 * time.Minute)

	if err = DB.Ping(); err != nil {
		log.Printf("Note: MySQL ping timeout: %v", err)
	} else {
		log.Println("Microservice connected to MySQL successfully")
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
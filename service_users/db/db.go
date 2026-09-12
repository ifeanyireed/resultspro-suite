package db

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB     *sql.DB
	GormDB *gorm.DB
)

func InitDB(dataSourceName string) {
	var err error

	DB, err = sql.Open("postgres", dataSourceName)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Optimize connection pooling for shared hosting limits
	// Hostinger max_connections_per_hour is very strict (e.g., 500)
	DB.SetMaxOpenConns(5)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(time.Hour)

	if err = DB.Ping(); err != nil {
		log.Printf("Note: Postgres ping timeout: %v", err)
	} else {
		log.Println("Microservice connected to Postgres successfully")
	}

	GormDB, err = gorm.Open(postgres.New(postgres.Config{
		Conn: DB,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Printf("GORM open warning: %v", err)
	}
}
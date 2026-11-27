package db

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"service_resultspro.resultspro.ng/config"
)

type DBWrapper struct {
	*sql.DB
}

// Rebind translates ? placeholders to $1, $2 etc. for PostgreSQL
func Rebind(query string) string {
	qb := []byte(query)
	var out []byte
	j := 1
	for _, b := range qb {
		if b == '?' {
			out = append(out, []byte(fmt.Sprintf("$%d", j))...)
			j++
		} else {
			out = append(out, b)
		}
	}
	return string(out)
}

func (w *DBWrapper) QueryRow(query string, args ...interface{}) *sql.Row {
	return w.DB.QueryRow(Rebind(query), args...)
}

func (w *DBWrapper) Query(query string, args ...interface{}) (*sql.Rows, error) {
	return w.DB.Query(Rebind(query), args...)
}

func (w *DBWrapper) Exec(query string, args ...interface{}) (sql.Result, error) {
	return w.DB.Exec(Rebind(query), args...)
}

var (
	DB     *DBWrapper
	GormDB *gorm.DB
)

func InitDB() {
	rawDB, err := sql.Open("postgres", config.AppConfig.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to Postgres database: %v", err)
	}

	rawDB.SetMaxOpenConns(5)
	rawDB.SetMaxIdleConns(5)
	rawDB.SetConnMaxLifetime(time.Hour)

	if err = rawDB.Ping(); err != nil {
		log.Printf("Note: Postgres ping timeout: %v", err)
	} else {
		log.Println("Connected to ResultsPRO database with GORM successfully")
	}

	DB = &DBWrapper{DB: rawDB}

	GormDB, err = gorm.Open(postgres.New(postgres.Config{
		Conn:                 rawDB,
		PreferSimpleProtocol: true,
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

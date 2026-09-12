package db

import (
	"database/sql"
	"log"
	"time"
	"fmt"

	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DBWrapper struct {
	*sql.DB
}

// Rebind translates ? to $1, $2 etc for postgres
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

func InitDB(dataSourceName string) {
	var err error

	rawDB, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	rawDB.SetMaxOpenConns(5)
	rawDB.SetMaxIdleConns(5)
	rawDB.SetConnMaxLifetime(time.Hour)

	if err = rawDB.Ping(); err != nil {
		log.Printf("Note: Postgres ping timeout: %v", err)
	} else {
		log.Println("Microservice connected to Postgres successfully")
	}

	DB = &DBWrapper{DB: rawDB}

	GormDB, err = gorm.Open(postgres.New(postgres.Config{
		Conn: rawDB,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Printf("GORM open warning: %v", err)
	}
}
package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
	DriverName string
}

// Rebind translates ? parameter markers to $1, $2, ... for PostgreSQL
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

func (db *DB) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row {
	if db.DriverName == "postgres" {
		query = Rebind(query)
	}
	return db.DB.QueryRowContext(ctx, query, args...)
}

func (db *DB) QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	if db.DriverName == "postgres" {
		query = Rebind(query)
	}
	return db.DB.QueryContext(ctx, query, args...)
}

func (db *DB) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	if db.DriverName == "postgres" {
		query = Rebind(query)
	}
	return db.DB.ExecContext(ctx, query, args...)
}

func (db *DB) QueryRow(query string, args ...interface{}) *sql.Row {
	if db.DriverName == "postgres" {
		query = Rebind(query)
	}
	return db.DB.QueryRow(query, args...)
}

func (db *DB) Query(query string, args ...interface{}) (*sql.Rows, error) {
	if db.DriverName == "postgres" {
		query = Rebind(query)
	}
	return db.DB.Query(query, args...)
}

func (db *DB) Exec(query string, args ...interface{}) (sql.Result, error) {
	if db.DriverName == "postgres" {
		query = Rebind(query)
	}
	return db.DB.Exec(query, args...)
}

func Connect(dsn string) (*DB, error) {
	driver := "postgres"
	cleanDSN := strings.TrimSpace(dsn)

	if strings.HasPrefix(cleanDSN, "mysql://") || strings.Contains(cleanDSN, "@tcp(") {
		driver = "mysql"
	} else if strings.HasPrefix(cleanDSN, "postgres://") || strings.HasPrefix(cleanDSN, "postgresql://") {
		driver = "postgres"
	}

	rawDB, err := sql.Open(driver, cleanDSN)
	if err != nil {
		return nil, fmt.Errorf("error opening database (%s): %w", driver, err)
	}

	rawDB.SetMaxOpenConns(25)
	rawDB.SetMaxIdleConns(5)
	rawDB.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := rawDB.PingContext(ctx); err != nil {
		_ = rawDB.Close()
		return nil, fmt.Errorf("error connecting to database (%s): %w", driver, err)
	}

	dbInstance := &DB{
		DB:         rawDB,
		DriverName: driver,
	}

	if driver == "postgres" {
		// Set up isolated puzzlepro schema in Postgres to avoid colliding with central platform tables
		initSchemaCtx, initCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer initCancel()
		_, _ = rawDB.ExecContext(initSchemaCtx, "CREATE SCHEMA IF NOT EXISTS puzzlepro; SET search_path TO puzzlepro, public;")
		log.Println("✅ [service_puzzlepro] Connected to PostgreSQL / Neon database successfully (schema: puzzlepro)!")
	} else {
		log.Println("✅ [service_puzzlepro] Connected to MySQL database successfully!")
	}

	return dbInstance, nil
}

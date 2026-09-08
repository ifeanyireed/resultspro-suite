package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-jwt/jwt/v5"
)

func main() {
	dbUrl := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dbUrl)
	if err != nil { log.Fatal(err) }

    var userID string
    err = db.QueryRow("SELECT id FROM users WHERE email = 'superadmin@resultspro.ng'").Scan(&userID)
	if err != nil {
		log.Fatal("Error fetching user:", err)
	}
	db.Close()

	secret := "resultspro_secret_key_2026" // wait, what is the JWT secret?
	// let me check service_users JWT secret. 
	// But let me try with "super-secret-key-123" first. Wait, let me look at service_users/.env
}

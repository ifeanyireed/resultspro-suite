package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-jwt/jwt/v5"
)

func main() {
	dbUrl := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dbUrl)
	if err != nil { panic(err) }

    var userID string
    err = db.QueryRow("SELECT id FROM users WHERE email = 'superadmin@resultspro.ng'").Scan(&userID)
	if err != nil { panic(err) }
	db.Close()

	// Use the central secret that we know works
	secret := "resultspro-central-secret-key-change-in-production"

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   userID,
		"roles": []string{"ADMIN"},
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, _ := token.SignedString([]byte(secret))

	req, _ := http.NewRequest("GET", "https://resultspro-service-examspro.onrender.com/api/admin/questions?page=1&limit=20", nil)
	req.Header.Add("Authorization", "Bearer "+tokenString)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("Request failed:", err)
		return
	}
	body, _ := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	fmt.Printf("Status: %d\nBody: %s\n", resp.StatusCode, string(body))
}

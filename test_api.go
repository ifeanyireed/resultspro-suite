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

	// Let's test the 3 possible secrets
	secrets := []string{
		"resultspro-central-secret-key-change-in-production",
		"super-secret-key-123",
		"your-super-secret-jwt-key-change-in-production-min-32-chars",
	}

	for _, secret := range secrets {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub":   userID,
			"roles": []string{"ADMIN"},
			"exp":   time.Now().Add(time.Hour * 24).Unix(),
		})
		tokenString, _ := token.SignedString([]byte(secret))

		req, _ := http.NewRequest("GET", "https://resultspro-service-examspro.onrender.com/api/admin/exams", nil)
		req.Header.Add("Authorization", "Bearer "+tokenString)
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			fmt.Println("Request failed:", err)
			continue
		}
		body, _ := ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		fmt.Printf("Secret: %s\nStatus: %d\nBody: %s\n\n", secret, resp.StatusCode, string(body))
	}
}

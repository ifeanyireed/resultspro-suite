package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port              string
	DatabaseURL       string
	UsersServiceURL   string
	AppID             string
	AppSecret         string
}

var AppConfig Config

func InitConfig() {
	if err := godotenv.Load(".env", "../.env"); err != nil {
		log.Println("Note: .env file not found, using system environment variables")
	}

	AppConfig = Config{
		Port:            getEnv("PORT", "5000"),
		DatabaseURL:     getEnv("DATABASE_URL", "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"),
		UsersServiceURL: getEnv("USERS_SERVICE_URL", "http://localhost:7000"),
		AppID:           getEnv("APP_ID", "resultspro-app-id"),
		AppSecret:       getEnv("APP_SECRET", "resultspro_secret_456"),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

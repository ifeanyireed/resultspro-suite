package config

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/microsoft"
)

var (
	Port                 string
	DatabaseURL          string
	JWTSecret            string
	GoogleOAuthConfig    *oauth2.Config
	MicrosoftOAuthConfig *oauth2.Config
	AWSRegion            string
	SMTPFrom             string
)

func InitConfig() {
	Port = os.Getenv("PORT")
	if Port == "" {
		Port = "7000"
	}

	DatabaseURL = os.Getenv("DATABASE_URL")
	if DatabaseURL == "" {
		DatabaseURL = "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	}

	JWTSecret = os.Getenv("JWT_SECRET")
	if JWTSecret == "" {
		JWTSecret = "resultspro-central-secret-key-change-in-production"
	}

	AWSRegion = os.Getenv("AWS_REGION")
	if AWSRegion == "" {
		AWSRegion = "us-east-1"
	}

	SMTPFrom = os.Getenv("SMTP_FROM")
	if SMTPFrom == "" {
		SMTPFrom = "noreply@resultspro.ng"
	}

	GoogleOAuthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}

	MicrosoftOAuthConfig = &oauth2.Config{
		ClientID:     os.Getenv("MICROSOFT_CLIENT_ID"),
		ClientSecret: os.Getenv("MICROSOFT_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("MICROSOFT_REDIRECT_URL"),
		Scopes:       []string{"User.Read"},
		Endpoint:     microsoft.AzureADEndpoint("common"),
	}
}

package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type EmailPayload struct {
	To       string `json:"to"`
	From     string `json:"from"`
	FromName string `json:"from_name"`
	Subject  string `json:"subject"`
	HTML     string `json:"html"`
	Text     string `json:"text"`
}

func SendEmail(to string, subject string, htmlBody string) error {
	payload := EmailPayload{
		To:       to,
		From:     "hello@resultspro.ng",
		FromName: "ExamsPRO Guide",
		Subject:  subject,
		HTML:     htmlBody,
		Text:     "Please view this email in an HTML compatible client.",
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal email payload: %v", err)
	}

	proxyURL := "https://mail.resultspro.ng/email_proxy/api/send-email.php"
	req, err := http.NewRequest("POST", proxyURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create email request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	apiKey := os.Getenv("EMAIL_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("EMAIL_API_KEY environment variable is missing")
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Email proxy failed to %s: %v", to, err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("email proxy returned status %d", resp.StatusCode)
	}
	
	return nil
}

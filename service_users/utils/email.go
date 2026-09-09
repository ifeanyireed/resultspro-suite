package utils

import (
	"os"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
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

func SendEmail(to string, subject string, htmlBody string, textBody string) error {
	payload := EmailPayload{
		To:       to,
		From:     "hello@resultspro.ng",
		FromName: "ResultsPRO",
		Subject:  subject,
		HTML:     htmlBody,
		Text:     textBody,
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
	// Use the API key extracted from the PHP config
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

func SendVerificationEmail(to string, otp string) error {
	subject := otp + " is your ResultsPRO verification code"
	textBody := fmt.Sprintf("Your ResultsPRO verification code is: %s. This code will expire in 24 hours.", otp)
	htmlBody := fmt.Sprintf(`
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 40px; margin: 0; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 580px;">
  <div style="margin-bottom: 24px; display: flex; align-items: center;">
    <div style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">Results<span style="color: #2563eb;">PRO</span></div>
  </div>
  <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Verify your email address</h2>
  <p style="font-size: 14px; line-height: 22px; color: #475569; margin-bottom: 24px;">
    Welcome to the ResultsPRO Suite. Use the 6-digit code below to complete your registration:
  </p>
  <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
    <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #2563eb; font-family: monospace;">%s</span>
  </div>
  <p style="font-size: 13px; line-height: 20px; color: #64748b; margin-bottom: 24px;">
    This code is valid for 24 hours. If you did not request this, please disregard this email.
  </p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
  <p style="font-size: 11px; color: #94a3b8; line-height: 16px;">
    ResultsPRO Suite &bull; Centralized Identity &amp; Academics Platform
  </p>
</div>`, otp)
	return SendEmail(to, subject, htmlBody, textBody)
}

func SendPasswordResetEmail(to string, token string, resetURL string) error {
	if resetURL == "" {
		resetURL = "https://auth.resultspro.ng/reset-password"
	}

	link := fmt.Sprintf("%s?token=%s", resetURL, token)
	if strings.Contains(resetURL, "?") {
		link = fmt.Sprintf("%s&token=%s", resetURL, token)
	}

	subject := "Reset your ResultsPRO password"
	textBody := fmt.Sprintf("Reset your password by visiting: %s", link)
	htmlBody := fmt.Sprintf(`
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 40px; margin: 0; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 580px;">
  <div style="margin-bottom: 24px; display: flex; align-items: center;">
    <div style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">Results<span style="color: #2563eb;">PRO</span></div>
  </div>
  <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h2>
  <p style="font-size: 14px; line-height: 22px; color: #475569; margin-bottom: 24px;">
    We received a request to reset your password. Click the button below to choose a new password:
  </p>
  <div style="text-align: center; margin-bottom: 24px;">
    <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">Reset Password</a>
  </div>
  <p style="font-size: 13px; line-height: 20px; color: #64748b; margin-bottom: 24px;">
    This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
  </p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
  <p style="font-size: 11px; color: #94a3b8; line-height: 16px;">
    ResultsPRO Suite &bull; Centralized Identity &amp; Academics Platform
  </p>
</div>`, link)
	return SendEmail(to, subject, htmlBody, textBody)
}

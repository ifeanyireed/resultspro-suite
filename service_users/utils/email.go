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

func SendEmail(to string, subject string, htmlBody string, textBody string, fromName string) error {
	if fromName == "" {
		fromName = "ResultsPRO"
	}
	payload := EmailPayload{
		To:       to,
		From:     "hello@resultspro.ng",
		FromName: fromName,
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

func SendVerificationEmail(to string, otp string, tenantName string, tenantLogo string) error {
	brandName := "ResultsPRO"
	brandLogo := "https://resultspro.ng/logo.png"

	if tenantName != "" {
		brandName = tenantName
	}
	if tenantLogo != "" {
		brandLogo = tenantLogo
	}

	subject := otp + " is your " + brandName + " verification code"
	textBody := fmt.Sprintf("Your %s verification code is: %s. This code will expire in 24 hours.", brandName, otp)
	htmlBody := fmt.Sprintf(`
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 40px; margin: 0; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 580px;">
  <div style="margin-bottom: 24px; display: flex; align-items: center;">
    <img src="%s" alt="%s" style="height: 40px; width: auto; object-fit: contain;" />
  </div>
  <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Verify your email address</h2>
  <p style="font-size: 14px; line-height: 22px; color: #475569; margin-bottom: 24px;">
    Welcome to %s. Use the 6-digit code below to complete your registration:
  </p>
  <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
    <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #2563eb; font-family: monospace;">%s</span>
  </div>
  <p style="font-size: 13px; line-height: 20px; color: #64748b; margin-bottom: 24px;">
    This code is valid for 24 hours. If you did not request this, please disregard this email.
  </p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
  <p style="font-size: 11px; color: #94a3b8; line-height: 16px;">
    %s &bull; Centralized Identity &amp; Academics Platform
  </p>
</div>`, brandLogo, brandName, brandName, otp, brandName)
	return SendEmail(to, subject, htmlBody, textBody, brandName)
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
    <img src="https://resultspro.ng/logo.png" alt="ResultsPRO" style="height: 40px; width: auto; object-fit: contain;" />
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
	return SendEmail(to, subject, htmlBody, textBody, "ResultsPRO")
}

func SendPaymentReceiptEmail(to string, reference string, amount string, date string, cardSuffix string, tenantName string, tenantEmail string) error {
	if tenantName == "" {
		tenantName = "ResultsPRO"
	}
	if tenantEmail == "" {
		tenantEmail = "hello@resultspro.ng"
	}

	subject := "Payment Receipt from " + tenantName
	textBody := fmt.Sprintf("You have made a payment of NGN %s to %s.\nReference: %s\nDate: %s\nCard: Ending with %s\n\nIf you have any issues, contact %s", amount, tenantName, reference, date, cardSuffix, tenantEmail)
	htmlBody := fmt.Sprintf(`
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 0; margin: 0; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
  <div style="text-align: center; padding: 20px;">
    <p style="font-size: 14px; color: #475569; margin: 0;">If you have any issues with payment, kindly reply to this email or send an email to <a href="mailto:%[6]s" style="color: #2563eb; text-decoration: underline;">%[6]s</a></p>
  </div>
  <div style="background-color: #0f172a; padding: 40px 20px; text-align: center; color: #ffffff;">
    <p style="font-size: 16px; margin: 0 0 10px 0;">%[1]s<br/>received your payment of</p>
    <h1 style="font-size: 36px; font-weight: 700; margin: 0;">NGN %[2]s</h1>
  </div>
  <div style="padding: 40px;">
    <h3 style="text-align: center; font-size: 18px; margin-top: 0; margin-bottom: 30px; color: #333333;">Transaction Details</h3>
    
    <table style="width: 100%%; border-collapse: collapse;">
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">Reference</td>
        <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #333333;">%[3]s</td>
      </tr>
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">Date</td>
        <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #333333;">%[4]s</td>
      </tr>
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">Card</td>
        <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #333333;">Ending with %[5]s</td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 16px; margin: 0 0 5px 0;">%[1]s</p>
      <a href="mailto:%[6]s" style="color: #2563eb; text-decoration: underline; font-size: 14px;">%[6]s</a>
    </div>
  </div>
</div>`, tenantName, amount, reference, date, cardSuffix, tenantEmail)

	return SendEmail(to, subject, htmlBody, textBody, tenantName)
}

package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type PuzzleMailer struct {
	ProxyURL string
	APIKey   string
	From     string
	FromName string
	Client   *http.Client
}

var DefaultPuzzleMailer = NewPuzzleMailer()

func NewPuzzleMailer() *PuzzleMailer {
	proxyURL := os.Getenv("EMAIL_PROXY_URL")
	if proxyURL == "" {
		proxyURL = "https://resultspro.ng/email_proxy/api/send-email.php"
	}
	apiKey := os.Getenv("EMAIL_API_KEY")
	if apiKey == "" {
		apiKey = "YOUR_EMAIL_PROXY_API_KEY"
	}
	from := os.Getenv("EMAIL_FROM")
	if from == "" {
		from = "hello@resultspro.ng"
	}
	fromName := os.Getenv("EMAIL_FROM_NAME")
	if fromName == "" {
		fromName = "ResultsPro Edu Suite"
	}

	return &PuzzleMailer{
		ProxyURL: proxyURL,
		APIKey:   apiKey,
		From:     from,
		FromName: fromName,
		Client: &http.Client{
			Timeout: 12 * time.Second,
		},
	}
}

type puzzleSendEmailPayload struct {
	To       string `json:"to"`
	Subject  string `json:"subject"`
	HTML     string `json:"html"`
	Text     string `json:"text,omitempty"`
	From     string `json:"from"`
	FromName string `json:"from_name"`
}

type puzzleSendEmailResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

func (m *PuzzleMailer) SendEmail(to, subject, htmlContent, textContent string) error {
	if to == "" {
		return fmt.Errorf("recipient email address is empty")
	}

	payload := puzzleSendEmailPayload{
		To:       to,
		Subject:  subject,
		HTML:     htmlContent,
		Text:     textContent,
		From:     m.From,
		FromName: m.FromName,
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal email payload: %w", err)
	}

	req, err := http.NewRequest("POST", m.ProxyURL, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return fmt.Errorf("failed to create email request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", m.APIKey))
	req.Header.Set("X-API-Key", m.APIKey)

	resp, err := m.Client.Do(req)
	if err != nil {
		return fmt.Errorf("email HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	var res puzzleSendEmailResponse
	if err := json.Unmarshal(respBody, &res); err != nil {
		if resp.StatusCode >= 400 {
			return fmt.Errorf("email proxy returned HTTP %d: %s", resp.StatusCode, string(respBody))
		}
	}

	if !res.Success && res.Error != "" {
		return fmt.Errorf("email proxy error: %s", res.Error)
	}

	log.Printf("📧 [PuzzlePro] Email successfully dispatched to %s (Subject: '%s')", to, subject)
	return nil
}

func (m *PuzzleMailer) SendWelcomeEmail(toEmail, orgName, orgType, defaultPassword, embedToken string) {
	if toEmail == "" {
		return
	}
	subject := fmt.Sprintf("Welcome to PuzzlePro - %s Account Initialized", orgName)
	html := fmt.Sprintf(`
		<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
			<div style="text-align: center; margin-bottom: 24px;">
				<h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">PuzzlePro Learning 🎉</h1>
				<p style="color: #64748b; font-size: 13px; margin-top: 4px;">Gamified Coding Platform for Schools & Families</p>
			</div>

			<p style="color: #334155; font-size: 14px; line-height: 1.6;">Hello <strong>%s</strong>,</p>
			<p style="color: #334155; font-size: 14px; line-height: 1.6;">Your <strong>%s</strong> account is now live and ready to onboard students and explore gamified learning worlds!</p>
			
			<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
				<h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 14px;">Your Account Portal Credentials:</h4>
				<p style="margin: 6px 0; font-size: 13px; color: #475569;"><strong>Email:</strong> %s</p>
				<p style="margin: 6px 0; font-size: 13px; color: #475569;"><strong>Default Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">%s</code></p>
				<p style="margin: 6px 0; font-size: 13px; color: #475569;"><strong>Signed iFrame Token:</strong> <br/><span style="font-family: monospace; font-size: 11px; word-break: break-all; color: #0284c7;">%s</span></p>
			</div>

			<p style="color: #334155; font-size: 14px; line-height: 1.6;">You can log into your portal at any time to customize branding, set up campus locations, and view real-time student XP leaderboards.</p>
			
			<div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
				PuzzlePro Coding Engine • ResultsPro Edu Suite
			</div>
		</div>
	`, orgName, orgType, toEmail, defaultPassword, embedToken)

	text := fmt.Sprintf("Welcome to PuzzlePro! Your account has been initialized.\nEmail: %s\nDefault Password: %s\nSigned Embed Token: %s", toEmail, defaultPassword, embedToken)

	go func() {
		if err := m.SendEmail(toEmail, subject, html, text); err != nil {
			log.Printf("⚠️ Warning: Failed sending welcome email to %s: %v", toEmail, err)
		}
	}()
}

func (m *PuzzleMailer) SendVerificationCodeEmail(toEmail, code string) {
	if toEmail == "" {
		return
	}
	subject := "Verify Your Email - PuzzlePro Learning"
	html := fmt.Sprintf(`
		<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
			<div style="text-align: center; margin-bottom: 24px;">
				<h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">Verify Your Email ✉️</h1>
				<p style="color: #64748b; font-size: 13px; margin-top: 4px;">PuzzlePro Account Setup</p>
			</div>

			<p style="color: #334155; font-size: 14px;">Thank you for registering. Please enter the following 6-digit verification code to confirm your email address:</p>
			
			<div style="background-color: #f1f5f9; padding: 20px; border-radius: 16px; border: 2px dashed #0284c7; text-align: center; margin: 20px 0;">
				<span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0284c7; font-family: monospace;">%s</span>
			</div>

			<p style="color: #64748b; font-size: 13px;">This code will expire in 15 minutes. If you did not request this verification, please ignore this email.</p>
			
			<div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
				PuzzlePro Security Team • ResultsPro Edu Suite
			</div>
		</div>
	`, code)

	text := fmt.Sprintf("Your PuzzlePro email verification OTP is: %s. Valid for 15 minutes.", code)

	go func() {
		if err := m.SendEmail(toEmail, subject, html, text); err != nil {
			log.Printf("⚠️ Warning: Failed sending verification email to %s: %v", toEmail, err)
		}
	}()
}

func (m *PuzzleMailer) SendPasswordResetEmail(toEmail, code string) {
	if toEmail == "" {
		return
	}
	subject := "Reset Your Password - PuzzlePro"
	html := fmt.Sprintf(`
		<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
			<div style="text-align: center; margin-bottom: 24px;">
				<h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">Password Reset Request 🔐</h1>
				<p style="color: #64748b; font-size: 13px; margin-top: 4px;">PuzzlePro Account Security</p>
			</div>

			<p style="color: #334155; font-size: 14px;">You requested to reset your password. Use the following 6-digit verification code to reset your account password:</p>
			
			<div style="background-color: #fef2f2; padding: 20px; border-radius: 16px; border: 2px dashed #ef4444; text-align: center; margin: 20px 0;">
				<span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #b91c1c; font-family: monospace;">%s</span>
			</div>

			<p style="color: #64748b; font-size: 13px;">This reset code will expire in 15 minutes. If you did not request a password reset, please secure your account immediately.</p>
			
			<div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
				PuzzlePro Security Team • ResultsPro Edu Suite
			</div>
		</div>
	`, code)

	text := fmt.Sprintf("Your PuzzlePro password reset code is: %s. Valid for 15 minutes.", code)

	go func() {
		if err := m.SendEmail(toEmail, subject, html, text); err != nil {
			log.Printf("⚠️ Warning: Failed sending password reset email to %s: %v", toEmail, err)
		}
	}()
}

func (m *PuzzleMailer) SendContactMessageEmail(name, senderEmail, phone, category, message string) error {
	to := "hello@resultspro.ng"
	subject := fmt.Sprintf("[PuzzlePro Contact] %s - %s", category, name)

	if phone == "" {
		phone = "Not provided"
	}
	if category == "" {
		category = "General Inquiry"
	}

	html := fmt.Sprintf(`
		<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
			<div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
				<h1 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800;">New Contact Form Message 📩</h1>
				<p style="color: #64748b; font-size: 13px; margin-top: 4px;">PuzzlePro Website Inquiry</p>
			</div>

			<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
				<p style="margin: 6px 0; font-size: 13px; color: #334155;"><strong>Sender Name:</strong> %s</p>
				<p style="margin: 6px 0; font-size: 13px; color: #334155;"><strong>Sender Email:</strong> <a href="mailto:%s" style="color: #0284c7; text-decoration: none;">%s</a></p>
				<p style="margin: 6px 0; font-size: 13px; color: #334155;"><strong>Phone:</strong> %s</p>
				<p style="margin: 6px 0; font-size: 13px; color: #334155;"><strong>Inquiry Category:</strong> %s</p>
			</div>

			<div style="background-color: #ffffff; padding: 18px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
				<h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 13px; text-transform: uppercase;">Message Content:</h4>
				<p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">%s</p>
			</div>

			<div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
				PuzzlePro Contact System • ResultsPro Support (hello@resultspro.ng)
			</div>
		</div>
	`, name, senderEmail, senderEmail, phone, category, message)

	text := fmt.Sprintf("New contact message from %s (%s, Phone: %s, Category: %s):\n\n%s", name, senderEmail, phone, category, message)

	return m.SendEmail(to, subject, html, text)
}

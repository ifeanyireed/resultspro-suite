package utils

import (
	"bytes"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"net/smtp"
	"os"
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

func toBase64(s string) string {
	return base64.StdEncoding.EncodeToString([]byte(s))
}

func sendViaProxy(to, subject, htmlBody, textBody, fromName string) error {
	from := os.Getenv("SMTP_FROM")
	if from == "" {
		from = "hello@resultspro.ng"
	}

	payload := EmailPayload{
		To:       to,
		From:     from,
		FromName: fromName,
		Subject:  subject,
		HTML:     htmlBody,
		Text:     textBody,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal email payload: %w", err)
	}

	proxyURL := os.Getenv("EMAIL_PROXY_URL")
	if proxyURL == "" {
		proxyURL = "https://mail.resultspro.ng/email_proxy/api/send-email.php"
	}

	req, err := http.NewRequest("POST", proxyURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create email request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	apiKey := os.Getenv("EMAIL_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("EMAIL_API_KEY environment variable is missing")
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("X-API-KEY", apiKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("proxy network request failed: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("proxy returned status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	return nil
}

func sendSMTPOnPort(smtpHost, smtpPort, smtpUser, smtpPass, from, fromName, to, subject, htmlBody, textBody string) error {
	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)

	boundary := fmt.Sprintf("bnd_%d", time.Now().UnixNano())
	var msg bytes.Buffer
	msg.WriteString(fmt.Sprintf("From: =?UTF-8?B?%s?= <%s>\r\n", toBase64(fromName), from))
	msg.WriteString(fmt.Sprintf("Reply-To: %s\r\n", from))
	msg.WriteString(fmt.Sprintf("To: %s\r\n", to))
	msg.WriteString(fmt.Sprintf("Subject: =?UTF-8?B?%s?=\r\n", toBase64(subject)))
	msg.WriteString("MIME-Version: 1.0\r\n")
	msg.WriteString(fmt.Sprintf("Content-Type: multipart/alternative; boundary=\"%s\"\r\n\r\n", boundary))

	if textBody != "" {
		msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
		msg.WriteString("Content-Type: text/plain; charset=\"UTF-8\"\r\n")
		msg.WriteString("Content-Transfer-Encoding: base64\r\n\r\n")
		msg.WriteString(toBase64(textBody) + "\r\n\r\n")
	}

	if htmlBody != "" {
		msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
		msg.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
		msg.WriteString("Content-Transfer-Encoding: base64\r\n\r\n")
		msg.WriteString(toBase64(htmlBody) + "\r\n\r\n")
	}
	msg.WriteString(fmt.Sprintf("--%s--\r\n", boundary))

	if smtpPort == "465" {
		dialer := &net.Dialer{Timeout: 10 * time.Second}
		conn, err := tls.DialWithDialer(dialer, "tcp", addr, &tls.Config{
			ServerName: smtpHost,
		})
		if err != nil {
			return fmt.Errorf("failed to dial SMTP TLS at %s: %w", addr, err)
		}
		defer conn.Close()

		c, err := smtp.NewClient(conn, smtpHost)
		if err != nil {
			return fmt.Errorf("failed to create SMTP client: %w", err)
		}
		defer c.Close()

		auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
		if err = c.Auth(auth); err != nil {
			return fmt.Errorf("SMTP auth failed: %w", err)
		}

		if err = c.Mail(from); err != nil {
			return fmt.Errorf("SMTP MAIL command failed: %w", err)
		}
		if err = c.Rcpt(to); err != nil {
			return fmt.Errorf("SMTP RCPT command failed: %w", err)
		}

		w, err := c.Data()
		if err != nil {
			return fmt.Errorf("SMTP DATA command failed: %w", err)
		}
		if _, err = w.Write(msg.Bytes()); err != nil {
			return fmt.Errorf("SMTP write failed: %w", err)
		}
		if err = w.Close(); err != nil {
			return fmt.Errorf("SMTP close data failed: %w", err)
		}
		return c.Quit()
	}

	// Port 587 or 2525 standard SMTP with STARTTLS support
	conn, err := net.DialTimeout("tcp", addr, 10*time.Second)
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP at %s: %w", addr, err)
	}
	defer conn.Close()

	c, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}
	defer c.Close()

	if ok, _ := c.Extension("STARTTLS"); ok {
		tlsConfig := &tls.Config{ServerName: smtpHost}
		if err = c.StartTLS(tlsConfig); err != nil {
			return fmt.Errorf("SMTP STARTTLS failed: %w", err)
		}
	}

	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
	if err = c.Auth(auth); err != nil {
		return fmt.Errorf("SMTP auth failed: %w", err)
	}

	if err = c.Mail(from); err != nil {
		return fmt.Errorf("SMTP MAIL command failed: %w", err)
	}
	if err = c.Rcpt(to); err != nil {
		return fmt.Errorf("SMTP RCPT command failed: %w", err)
	}

	w, err := c.Data()
	if err != nil {
		return fmt.Errorf("SMTP DATA command failed: %w", err)
	}
	if _, err = w.Write(msg.Bytes()); err != nil {
		return fmt.Errorf("SMTP write failed: %w", err)
	}
	if err = w.Close(); err != nil {
		return fmt.Errorf("SMTP close data failed: %w", err)
	}
	return c.Quit()
}

func sendDirectSMTP(to, subject, htmlBody, textBody, fromName string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")

	if smtpPass == "" {
		return fmt.Errorf("SMTP_PASS environment variable is missing")
	}
	if smtpUser == "" {
		return fmt.Errorf("SMTP_USER environment variable is missing")
	}
	if smtpHost == "" {
		smtpHost = "smtp-relay.brevo.com"
	}
	if smtpPort == "" {
		smtpPort = "465"
	}

	from := os.Getenv("SMTP_FROM")
	if from == "" {
		if strings.Contains(smtpUser, "@smtp-brevo.com") {
			from = "hello@resultspro.ng"
		} else {
			from = smtpUser
		}
	}

	// Try configured port first, then robust fallback ports (465, 2525, 587)
	portsToTry := []string{smtpPort}
	for _, fallback := range []string{"465", "2525", "587"} {
		if fallback != smtpPort {
			portsToTry = append(portsToTry, fallback)
		}
	}

	var lastErr error
	for _, p := range portsToTry {
		err := sendSMTPOnPort(smtpHost, p, smtpUser, smtpPass, from, fromName, to, subject, htmlBody, textBody)
		if err == nil {
			if p != smtpPort {
				log.Printf("[Email] Successfully sent email on fallback port %s (configured was %s)", p, smtpPort)
			}
			return nil
		}
		lastErr = err
		log.Printf("[Email] SMTP delivery failed on port %s: %v. Retrying next port if available...", p, err)
	}

	return lastErr
}

func SendEmail(to string, subject string, htmlBody string, textBody string, fromName string) error {
	if fromName == "" {
		fromName = "ResultsPRO"
	}

	// 1. Primary: Direct SMTP (Brevo)
	smtpErr := sendDirectSMTP(to, subject, htmlBody, textBody, fromName)
	if smtpErr == nil {
		log.Printf("[Email] Successfully sent email to %s via SMTP", to)
		return nil
	}
	log.Printf("[Email] Primary SMTP failed to %s: %v. Attempting proxy fallback...", to, smtpErr)

	// 2. Secondary fallback: PHP HTTP mail proxy
	proxyErr := sendViaProxy(to, subject, htmlBody, textBody, fromName)
	if proxyErr == nil {
		log.Printf("[Email] Successfully sent email to %s via proxy fallback", to)
		return nil
	}
	log.Printf("[Email] Proxy delivery also failed to %s: %v", to, proxyErr)

	return fmt.Errorf("all email delivery methods failed: smtp: %v, proxy: %v", smtpErr, proxyErr)
}

func SendVerificationEmail(to string, otp string, tenantName string, tenantLogo string) error {
	brandName := "ResultsPRO"
	if tenantName != "" {
		brandName = tenantName
	}

	brandLogo := strings.TrimSpace(tenantLogo)
	// Convert Cloudinary .avif or .webp formats to .png for 100% email client compatibility
	if strings.Contains(brandLogo, "res.cloudinary.com") {
		if strings.HasSuffix(brandLogo, ".avif") {
			brandLogo = strings.TrimSuffix(brandLogo, ".avif") + ".png"
		} else if strings.HasSuffix(brandLogo, ".webp") {
			brandLogo = strings.TrimSuffix(brandLogo, ".webp") + ".png"
		}
	}

	// Only fallback to ResultsPRO default logo if this is truly generic ResultsPRO platform email.
	// For dedicated tenants without an uploaded image, display an elegant stylized typography header
	// instead of showing the wrong company's logo.
	hasImageLogo := brandLogo != ""
	if !hasImageLogo && (tenantName == "" || tenantName == "ResultsPRO") {
		brandLogo = "https://resultspro.ng/logo.png"
		hasImageLogo = true
	}

	subject := otp + " is your " + brandName + " verification code"
	textBody := fmt.Sprintf("Your %s verification code is: %s. This code will expire in 24 hours.", brandName, otp)

	var logoHeaderHTML string
	if hasImageLogo {
		logoHeaderHTML = fmt.Sprintf(`
		<div style="margin-bottom: 24px;">
			<img src="%s" alt="%s" height="42" style="height: 42px; max-height: 48px; max-width: 220px; width: auto; object-fit: contain; display: block; border: 0;" />
		</div>`, brandLogo, brandName)
	} else {
		logoHeaderHTML = fmt.Sprintf(`
		<div style="margin-bottom: 24px;">
			<h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; letter-spacing: -0.5px;">%s</h1>
		</div>`, brandName)
	}

	footerText := fmt.Sprintf("%s &bull; Learning Platform", brandName)
	if brandName == "ResultsPRO" {
		footerText = "ResultsPRO &bull; Centralized Identity &amp; Academics Platform"
	}

	htmlBody := fmt.Sprintf(`
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 40px; margin: 0; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 580px;">
  %s
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
    %s
  </p>
</div>`, logoHeaderHTML, brandName, otp, footerText)
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

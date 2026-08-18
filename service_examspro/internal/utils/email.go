package utils

import (
	"crypto/tls"
	"fmt"
	"net/smtp"
	"os"
)

func SendEmail(to, subject, html string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")

	if smtpHost == "" || smtpPort == "" || smtpUser == "" || smtpPass == "" {
		return fmt.Errorf("missing SMTP configuration")
	}

	header := make(map[string]string)
	header["From"] = "\"ResultPRO Exam Guide\" <" + smtpUser + ">"
	header["To"] = to
	header["Subject"] = subject
	header["MIME-Version"] = "1.0"
	header["Content-Type"] = "text/html; charset=\"utf-8\""

	message := ""
	for k, v := range header {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + html

	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)

	if smtpPort == "465" {
		// SSL/TLS
		tlsconfig := &tls.Config{
			InsecureSkipVerify: false,
			ServerName:         smtpHost,
		}

		conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsconfig)
		if err != nil {
			return err
		}

		client, err := smtp.NewClient(conn, smtpHost)
		if err != nil {
			return err
		}

		if err = client.Auth(auth); err != nil {
			return err
		}

		if err = client.Mail(smtpUser); err != nil {
			return err
		}

		if err = client.Rcpt(to); err != nil {
			return err
		}

		w, err := client.Data()
		if err != nil {
			return err
		}

		_, err = w.Write([]byte(message))
		if err != nil {
			return err
		}

		err = w.Close()
		if err != nil {
			return err
		}

		client.Quit()
		return nil
	} else {
		// Standard STARTTLS (usually port 587)
		return smtp.SendMail(smtpHost+":"+smtpPort, auth, smtpUser, []string{to}, []byte(message))
	}
}

package utils

import (
	"context"
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
	"service_users.resultspro.ng/config"
)

type SESClientAPI interface {
	SendEmail(ctx context.Context, params *sesv2.SendEmailInput, optFns ...func(*sesv2.Options)) (*sesv2.SendEmailOutput, error)
}

var (
	sesClient SESClientAPI
	sesOnce   sync.Once
)

func SetSESClient(client SESClientAPI) {
	sesClient = client
}

func getSESClient() (SESClientAPI, error) {
	var err error
	sesOnce.Do(func() {
		if sesClient != nil {
			return
		}
		region := config.AWSRegion
		if region == "" {
			region = "us-east-1"
		}
		cfg, err2 := awsconfig.LoadDefaultConfig(context.TODO(), awsconfig.WithRegion(region))
		if err2 != nil {
			err = fmt.Errorf("unable to load AWS SDK config: %v", err2)
			return
		}
		sesClient = sesv2.NewFromConfig(cfg)
	})
	if err != nil {
		return nil, err
	}
	return sesClient, nil
}

func SendEmail(to string, subject string, htmlBody string, textBody string) error {
	client, err := getSESClient()
	if err != nil {
		log.Printf("Email Warning: SES client initialization skipped or failed: %v", err)
		return nil // Non-fatal in local/dev environments
	}

	from := config.SMTPFrom
	if from == "" {
		from = "noreply@resultspro.ng"
	}

	input := &sesv2.SendEmailInput{
		FromEmailAddress: aws.String(from),
		Destination: &types.Destination{
			ToAddresses: []string{to},
		},
		Content: &types.EmailContent{
			Simple: &types.Message{
				Subject: &types.Content{
					Data: aws.String(subject),
				},
				Body: &types.Body{
					Html: &types.Content{
						Data: aws.String(htmlBody),
					},
					Text: &types.Content{
						Data: aws.String(textBody),
					},
				},
			},
		},
	}

	_, err = client.SendEmail(context.TODO(), input)
	if err != nil {
		log.Printf("Email sending failed to %s: %v", to, err)
		return err
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

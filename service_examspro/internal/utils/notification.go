package utils

import (
	"fmt"
	"log"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/google/uuid"
)

func SendNotification(userID string, title, message string, nType models.NotificationType, route models.NotificationRoute) error {
	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		return fmt.Errorf("user not found: %v", err)
	}

	// 1. Create In-App Notification if requested
	if route == models.NotificationRouteInApp || route == models.NotificationRouteBoth {
		notification := models.Notification{
			ID:        uuid.New().String(),
			UserID:    userID,
			Title:     title,
			Message:   message,
			Type:      nType,
			IsRead:    false,
			CreatedAt: time.Now(),
		}
		if err := database.DB.Create(&notification).Error; err != nil {
			log.Printf("Failed to create in-app notification: %v", err)
		}
	}

	// 2. Send Email if requested and user has email notifications enabled
	if (route == models.NotificationRouteEmail || route == models.NotificationRouteBoth) && user.EmailNotifications {
		userName := user.Email
		if user.Name != nil {
			userName = *user.Name
		}

		// Basic HTML Template
		body := fmt.Sprintf(`
			<div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px;">
				<h2 style="color: #00C853;">%s</h2>
				<p>Hello %s,</p>
				<p>%s</p>
				<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
					You are receiving this because you enabled email notifications on ResultsPRO.
				</div>
			</div>
		`, title, userName, message)

		go func() {
			err := SendEmail(user.Email, title, body)
			status := "sent"
			var errMsg *string
			if err != nil {
				log.Printf("Failed to send notification email: %v", err)
				status = "failed"
				msg := err.Error()
				errMsg = &msg
			}

			// Log the email attempt
			logEntry := models.NotificationLog{
				ID:        uuid.New().String(),
				UserID:    &userID,
				Title:     title,
				Message:   message,
				Type:      nType,
				Route:     models.NotificationRouteEmail,
				Status:    status,
				Error:     errMsg,
				CreatedAt: time.Now(),
			}
			database.DB.Create(&logEntry)
		}()
	}

	// Log in-app creation as well for the audit log
	if route == models.NotificationRouteInApp || route == models.NotificationRouteBoth {
		logEntry := models.NotificationLog{
			ID:        uuid.New().String(),
			UserID:    &userID,
			Title:     title,
			Message:   message,
			Type:      nType,
			Route:     models.NotificationRouteInApp,
			Status:    "sent",
			CreatedAt: time.Now(),
		}
		database.DB.Create(&logEntry)
	}

	return nil
}

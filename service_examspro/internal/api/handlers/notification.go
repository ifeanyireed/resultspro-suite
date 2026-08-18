package handlers

import (
	"net/http"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
)

type NotificationHandler struct{}

func (h *NotificationHandler) GetNotifications(c *gin.Context) {
	userID := c.GetString("userId")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	notifications := []models.Notification{}
	if err := database.DB.Where("user_id = ?", userID).Order("created_at desc").Limit(50).Find(&notifications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notifications"})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

func (h *NotificationHandler) MarkRead(c *gin.Context) {
	userID := c.GetString("userId")
	notificationID := c.Param("id")

	if err := database.DB.Model(&models.Notification{}).
		Where("id = ? AND user_id = ?", notificationID, userID).
		Update("is_read", true).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark notification as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification marked as read"})
}

func (h *NotificationHandler) MarkAllRead(c *gin.Context) {
	userID := c.GetString("userId")

	if err := database.DB.Model(&models.Notification{}).
		Where("user_id = ?", userID).
		Update("is_read", true).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark all as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "All notifications marked as read"})
}

func (h *NotificationHandler) GetUnreadCount(c *gin.Context) {
	userID := c.GetString("userId")

	var count int64
	if err := database.DB.Model(&models.Notification{}).Where("user_id = ? AND is_read = ?", userID, false).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch unread count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}

func (h *NotificationHandler) GetActivePopups(c *gin.Context) {
	userID := c.GetString("userId")
	now := time.Now()

	// 1. Fetch all active popups
	var popups []models.PopupNotification
	database.DB.Where("is_active = ? AND (start_time IS NULL OR start_time <= ?) AND (end_time IS NULL OR end_time >= ?)", true, now, now).Find(&popups)

	// 2. Filter by user's exam interests if popup has TargetExamID
	filteredPopups := []models.PopupNotification{}
	
	// Pre-fetch user's exams to optimize
	var userExamIDs []int
	database.DB.Table("user_answers").
		Joins("JOIN questions ON user_answers.question_id = questions.id").
		Joins("JOIN topics ON questions.topic_id = topics.id").
		Joins("JOIN subjects ON topics.subject_id = subjects.id").
		Where("user_answers.user_id = ?", userID).
		Distinct("subjects.exam_id").
		Pluck("exam_id", &userExamIDs)

	for _, p := range popups {
		if p.TargetExamID == nil {
			filteredPopups = append(filteredPopups, p)
			continue
		}

		// Check if user is interested in this exam
		isInterested := false
		for _, examID := range userExamIDs {
			if examID == *p.TargetExamID {
				isInterested = true
				break
			}
		}

		if isInterested {
			filteredPopups = append(filteredPopups, p)
		}
	}

	c.JSON(http.StatusOK, filteredPopups)
}

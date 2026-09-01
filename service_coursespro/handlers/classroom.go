package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetPresence(c *gin.Context) {
	var sessions []models.PresenceSession
	threshold := time.Now().Add(-5 * time.Minute)
	db.WithTenant(c).Where("is_active = ? AND last_heartbeat > ?", true, threshold).Find(&sessions)
	c.JSON(http.StatusOK, gin.H{"sessions": sessions, "active_count": len(sessions)})
}

func (h *Handler) PresenceHeartbeat(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		RoomName string `json:"room_name"`
		Activity string `json:"activity"`
	}
	_ = c.ShouldBindJSON(&input)

	if input.RoomName == "" {
		input.RoomName = "Sprint Room Alpha"
	}
	if input.Activity == "" {
		input.Activity = "Coding"
	}

	var session models.PresenceSession
	err := db.WithTenant(c).Where("user_id = ?", userID.(string)).First(&session).Error

	now := time.Now()
	if err != nil {
		tenantID, _ := c.Get("tenant_id")
		session = models.PresenceSession{
			TenantID:      tenantID.(string),
			ID:            uuid.New().String(),
			UserID:        userID.(string),
			RoomName:      input.RoomName,
			Activity:      input.Activity,
			IsActive:      true,
			LastHeartbeat: now,
		}
		db.WithTenant(c).Create(&session)
	} else {
		session.RoomName = input.RoomName
		session.Activity = input.Activity
		session.IsActive = true
		session.LastHeartbeat = now
		db.WithTenant(c).Save(&session)
	}

	c.JSON(http.StatusOK, gin.H{"session": session})
}

func (h *Handler) GetPeers(c *gin.Context) {
	cohortID := c.Query("cohort_id")
	var enrollments []models.Enrollment
	query := db.WithTenant(c).Where("status = ?", "ACTIVE")
	if cohortID != "" {
		query = query.Where("cohort_id = ?", cohortID)
	}
	query.Order("current_xp DESC").Find(&enrollments)

	c.JSON(http.StatusOK, gin.H{"peers": enrollments})
}

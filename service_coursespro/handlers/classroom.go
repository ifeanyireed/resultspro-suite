package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
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
	tenantID, _ := c.Get("tenant_id")

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
		session = models.PresenceSession{
			TenantID:      tenantID.(string),
			ID:            uuid.New().String(),
			UserID:        userID.(string),
			RoomName:      input.RoomName,
			Activity:      input.Activity,
			IsActive:      true,
			LastHeartbeat: &now,
		}
		db.WithTenant(c).Create(&session)
	} else {
		session.RoomName = input.RoomName
		session.Activity = input.Activity
		session.IsActive = true
		session.LastHeartbeat = &now
		db.WithTenant(c).Save(&session)
	}

	c.JSON(http.StatusOK, gin.H{"session": session})
}

func (h *Handler) GetPeers(c *gin.Context) {
	userID, _ := c.Get("user_id")

	cohortID := c.Query("cohort_id")
	var userCohortIDs []string

	if cohortID != "" {
		userCohortIDs = append(userCohortIDs, cohortID)
	} else {
		var myEnrollments []models.Enrollment
		db.WithTenant(c).Where("user_id = ? AND status = ?", userID, "ACTIVE").Find(&myEnrollments)
		for _, e := range myEnrollments {
			userCohortIDs = append(userCohortIDs, e.CohortID)
		}
	}

	if len(userCohortIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{"peers": []interface{}{}})
		return
	}

	var peerEnrollments []models.Enrollment
	db.WithTenant(c).Where("status = ? AND cohort_id IN ? AND user_id != ?", "ACTIVE", userCohortIDs, userID).
		Order("current_xp DESC").Find(&peerEnrollments)

	var peerUserIDs []string
	for _, e := range peerEnrollments {
		peerUserIDs = append(peerUserIDs, e.UserID)
	}

	var sessions []models.PresenceSession
	if len(peerUserIDs) > 0 {
		threshold := time.Now().Add(-5 * time.Minute)
		db.WithTenant(c).Where("user_id IN ? AND is_active = ? AND last_heartbeat > ?", peerUserIDs, true, threshold).Find(&sessions)
	}

	presenceMap := make(map[string]models.PresenceSession)
	for _, s := range sessions {
		presenceMap[s.UserID] = s
	}

	var result []map[string]interface{}
	for _, e := range peerEnrollments {
		status := "Offline"
		if session, ok := presenceMap[e.UserID]; ok {
			if session.RoomName != "" && session.RoomName != "Sprint Room Alpha" {
				status = "In Session"
			} else {
				status = "Online"
			}
		}

		result = append(result, map[string]interface{}{
			"user_id":    e.UserID,
			"cohort_id":  e.CohortID,
			"current_xp": e.CurrentXP,
			"status":     status,
		})
	}

	c.JSON(http.StatusOK, gin.H{"peers": result})
}

// DailyRoomResponse struct for Daily API
type DailyRoomResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

// DailyTokenResponse struct
type DailyTokenResponse struct {
	Token string `json:"token"`
}

func (h *Handler) GetClassroomSession(c *gin.Context) {
	userID, _ := c.Get("user_id")
	tenantID, _ := c.Get("tenant_id")

	// Get student's enrollment
	var enrollment models.Enrollment
	if err := db.DB.Where("tenant_id = ? AND user_id = ?", tenantID, userID).First(&enrollment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Enrollment not found"})
		return
	}

	if enrollment.CohortID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not assigned to a cohort"})
		return
	}

	var cohort models.Cohort
	db.DB.Where("tenant_id = ? AND id = ?", tenantID, enrollment.CohortID).First(&cohort)

	// Fetch student profile for token
	userName := "Student"

	dailyApiKey := os.Getenv("DAILY_API_KEY")
	if dailyApiKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DAILY_API_KEY not configured"})
		return
	}

	roomName := fmt.Sprintf("cohort-%s", cohort.ID)

	// 1. Create or get room
	roomReqBody, _ := json.Marshal(map[string]interface{}{
		"name": roomName,
		"properties": map[string]interface{}{
			"exp": time.Now().Add(24 * time.Hour).Unix(),
		},
	})

	req, _ := http.NewRequest("POST", "https://api.daily.co/v1/rooms", bytes.NewBuffer(roomReqBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+dailyApiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to Daily API"})
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	var roomRes DailyRoomResponse
	json.Unmarshal(bodyBytes, &roomRes)

	// If room already exists, Daily returns 400. Fetch the room details.
	if resp.StatusCode == 400 {
		req, _ = http.NewRequest("GET", "https://api.daily.co/v1/rooms/"+roomName, nil)
		req.Header.Set("Authorization", "Bearer "+dailyApiKey)
		resp, err = client.Do(req)
		if err == nil {
			bodyBytes, _ = io.ReadAll(resp.Body)
			json.Unmarshal(bodyBytes, &roomRes)
			resp.Body.Close()
		}
	}

	if roomRes.URL == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get classroom URL", "details": string(bodyBytes)})
		return
	}

	// 2. Generate Meeting Token for the student
	tokenReqBody, _ := json.Marshal(map[string]interface{}{
		"properties": map[string]interface{}{
			"room_name": roomName,
			"user_name": userName,
			"user_id":   userID,
			"exp":       time.Now().Add(2 * time.Hour).Unix(), // Token expires in 2 hours
		},
	})

	req, _ = http.NewRequest("POST", "https://api.daily.co/v1/meeting-tokens", bytes.NewBuffer(tokenReqBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+dailyApiKey)
	
	resp, err = client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create access token"})
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ = io.ReadAll(resp.Body)
	var tokenRes DailyTokenResponse
	json.Unmarshal(bodyBytes, &tokenRes)

	c.JSON(http.StatusOK, gin.H{
		"room_url": roomRes.URL,
		"token":    tokenRes.Token,
	})
}

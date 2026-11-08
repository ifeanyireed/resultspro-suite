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
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)

	cohortID := c.Query("cohort_id")
	var userCohortIDs []string

	if cohortID != "" {
		userCohortIDs = append(userCohortIDs, cohortID)
	} else {
		var myEnrollments []models.Enrollment
		db.WithTenant(c).Where("user_id = ? AND status = ?", uid, "ACTIVE").Find(&myEnrollments)
		if len(myEnrollments) == 0 {
			db.WithTenant(c).Where("user_id = ?", uid).Find(&myEnrollments)
		}
		for _, e := range myEnrollments {
			userCohortIDs = append(userCohortIDs, e.CohortID)
		}
	}

	if len(userCohortIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"peers":   []interface{}{},
			"partner": nil,
			"cohorts": []interface{}{},
		})
		return
	}

	// Fetch cohorts for quick name resolution
	var cohorts []models.Cohort
	db.WithTenant(c).Where("id IN ?", userCohortIDs).Find(&cohorts)
	cohortMap := make(map[string]string)
	var cohortSummaries []gin.H
	for _, ch := range cohorts {
		cohortMap[ch.ID] = ch.Title
		cohortSummaries = append(cohortSummaries, gin.H{
			"id":    ch.ID,
			"title": ch.Title,
			"slug":  ch.Slug,
		})
	}

	// Fetch peer enrollments excluding the requesting student
	var peerEnrollments []models.Enrollment
	db.WithTenant(c).Where("cohort_id IN ? AND user_id != ?", userCohortIDs, uid).
		Order("current_xp DESC").Find(&peerEnrollments)

	var peerUserIDs []string
	for _, e := range peerEnrollments {
		peerUserIDs = append(peerUserIDs, e.UserID)
	}

	// Fetch recent presence sessions
	var sessions []models.PresenceSession
	if len(peerUserIDs) > 0 {
		threshold := time.Now().Add(-5 * time.Minute)
		db.WithTenant(c).Where("user_id IN ? AND is_active = ? AND last_heartbeat > ?", peerUserIDs, true, threshold).Find(&sessions)
	}
	presenceMap := make(map[string]models.PresenceSession)
	for _, s := range sessions {
		presenceMap[s.UserID] = s
	}

	// Fetch shared user details
	type SharedUser struct {
		ID        string `gorm:"column:id"`
		FullName  string `gorm:"column:full_name"`
		AvatarURL string `gorm:"column:avatar_url"`
		Email     string `gorm:"column:email"`
	}
	var users []SharedUser
	if len(peerUserIDs) > 0 {
		db.DB.Table("users").Where("id IN ?", peerUserIDs).Find(&users)
	}
	userMap := make(map[string]SharedUser)
	for _, u := range users {
		userMap[u.ID] = u
	}

	// Fetch public portfolios
	var portfolios []models.PublicPortfolio
	if len(peerUserIDs) > 0 {
		db.DB.Where("user_id IN ?", peerUserIDs).Find(&portfolios)
	}
	portfolioMap := make(map[string]models.PublicPortfolio)
	for _, p := range portfolios {
		portfolioMap[p.UserID] = p
	}

	// Fetch active peer pairing for this student
	var pairing models.PeerPairing
	db.WithTenant(c).Where("(student_a_id = ? OR student_b_id = ?) AND status = ?", uid, uid, "ACTIVE").
		Order("created_at DESC").First(&pairing)

	partnerID := ""
	if pairing.ID != "" {
		if pairing.StudentA_ID == uid {
			partnerID = pairing.StudentB_ID
		} else {
			partnerID = pairing.StudentA_ID
		}
	}

	var result []map[string]interface{}
	var partnerData interface{} = nil

	for _, e := range peerEnrollments {
		status := "Offline"
		activity := "Studying"
		if session, ok := presenceMap[e.UserID]; ok {
			activity = session.Activity
			if session.RoomName != "" && session.RoomName != "Sprint Room Alpha" {
				status = "In Session"
			} else {
				status = "Online"
			}
		}

		u := userMap[e.UserID]
		port := portfolioMap[e.UserID]

		name := u.FullName
		if name == "" {
			name = "Cohort Peer"
		}
		avatar := u.AvatarURL
		if avatar == "" {
			avatar = port.AvatarURL
		}
		role := port.Headline
		if role == "" {
			role = "Full-Stack Builder"
		}

		isPartner := e.UserID == partnerID

		peerObj := map[string]interface{}{
			"user_id":      e.UserID,
			"cohort_id":    e.CohortID,
			"cohort_title": cohortMap[e.CohortID],
			"name":         name,
			"avatar":       avatar,
			"role":         role,
			"username":     port.Username,
			"current_xp":   e.CurrentXP,
			"streak_days":  e.StreakDays,
			"status":       status,
			"activity":     activity,
			"is_partner":   isPartner,
		}

		if isPartner {
			partnerData = map[string]interface{}{
				"peer":          peerObj,
				"sprint_number": pairing.SprintNumber,
				"shared_notes":  pairing.SharedNotes,
				"pairing_id":    pairing.ID,
			}
		}

		result = append(result, peerObj)
	}

	c.JSON(http.StatusOK, gin.H{
		"peers":   result,
		"partner": partnerData,
		"cohorts": cohortSummaries,
	})
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

	if userID == nil || tenantID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	cohortID := c.Query("cohort_id")

	// 1. Get student's enrollment
	var enrollment models.Enrollment
	if cohortID != "" {
		if err := db.WithTenant(c).Where("user_id = ? AND cohort_id = ?", userID, cohortID).First(&enrollment).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Enrollment not found for specified cohort"})
			return
		}
	} else {
		if err := db.WithTenant(c).Where("user_id = ? AND status = ?", userID, "ACTIVE").Order("enrolled_at DESC").First(&enrollment).Error; err != nil {
			// Fallback to any enrollment for this student
			if err2 := db.WithTenant(c).Where("user_id = ?", userID).Order("enrolled_at DESC").First(&enrollment).Error; err2 != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "No active cohort enrollment found. Enroll in a cohort to access the live classroom."})
				return
			}
		}
	}

	if enrollment.CohortID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not assigned to a valid cohort"})
		return
	}

	var cohort models.Cohort
	if err := db.DB.Where("tenant_id = ? AND id = ?", tenantID, enrollment.CohortID).First(&cohort).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort details not found"})
		return
	}

	// 2. Fetch student profile name for Daily participant token
	userName := "Student"
	type SharedUser struct {
		FullName string `gorm:"column:full_name"`
	}
	var u SharedUser
	if err := db.DB.Table("users").Select("full_name").Where("id = ?", userID).First(&u).Error; err == nil && u.FullName != "" {
		userName = u.FullName
	}

	dailyApiKey := os.Getenv("DAILY_API_KEY")
	if dailyApiKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DAILY_API_KEY not configured on server"})
		return
	}

	roomName := fmt.Sprintf("cohort-%s", cohort.ID)

	// 3. Create or get room
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

	// 4. Generate Meeting Token for the student
	tokenReqBody, _ := json.Marshal(map[string]interface{}{
		"properties": map[string]interface{}{
			"room_name": roomName,
			"user_name": userName,
			"user_id":   userID,
			"exp":       time.Now().Add(4 * time.Hour).Unix(), // Token valid for 4 hours
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

	// 5. Ensure a COHORT conversation exists for chat persistence
	convID := cohort.ID
	var conv models.Conversation
	if err := db.DB.Where("id = ?", convID).First(&conv).Error; err != nil {
		conv = models.Conversation{
			ID:       convID,
			TenantID: tenantID.(string),
			Type:     "COHORT",
		}
		db.DB.Create(&conv)
	}

	var participant models.ConversationParticipant
	if err := db.DB.Where("conversation_id = ? AND user_id = ?", convID, userID).First(&participant).Error; err != nil {
		db.DB.Create(&models.ConversationParticipant{
			ConversationID: convID,
			UserID:         userID.(string),
		})
	}

	scheduleStr := ""
	if cohort.MeetingDays != "" && cohort.MeetingTime != "" {
		scheduleStr = fmt.Sprintf("%s @ %s", cohort.MeetingDays, cohort.MeetingTime)
	}

	c.JSON(http.StatusOK, gin.H{
		"room_url":        roomRes.URL,
		"token":           tokenRes.Token,
		"conversation_id": convID,
		"cohort_id":       cohort.ID,
		"cohort_title":    cohort.Title,
		"schedule":        scheduleStr,
		"user_name":       userName,
	})
}

func (h *Handler) GetLeaderboard(c *gin.Context) {
	userID, _ := c.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)

	cohortID := c.Query("cohort_id")

	// 1. Fetch all tenant cohorts so the user can filter across all cohorts in the campus
	var allTenantCohorts []models.Cohort
	db.WithTenant(c).Order("created_at DESC").Find(&allTenantCohorts)

	// 2. Identify student's enrolled cohort IDs
	var myEnrollments []models.Enrollment
	db.WithTenant(c).Where("user_id = ?", uid).Find(&myEnrollments)
	myEnrolledCohortMap := make(map[string]bool)
	var myCohortIDs []string
	for _, e := range myEnrollments {
		myEnrolledCohortMap[e.CohortID] = true
		myCohortIDs = append(myCohortIDs, e.CohortID)
	}

	cohortMap := make(map[string]string)
	var cohortSummaries []gin.H
	for _, ch := range allTenantCohorts {
		cohortMap[ch.ID] = ch.Title
		cohortSummaries = append(cohortSummaries, gin.H{
			"id":          ch.ID,
			"title":       ch.Title,
			"slug":        ch.Slug,
			"is_enrolled": myEnrolledCohortMap[ch.ID],
		})
	}

	// 3. Resolve target cohort IDs for the leaderboard query
	var targetCohortIDs []string
	if cohortID != "" && cohortID != "all" {
		targetCohortIDs = append(targetCohortIDs, cohortID)
	} else {
		for _, ch := range allTenantCohorts {
			targetCohortIDs = append(targetCohortIDs, ch.ID)
		}
	}

	if len(targetCohortIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"leaders":   []interface{}{},
			"cohorts":   []interface{}{},
			"my_streak": 0,
			"my_rank":   0,
			"my_xp":     0,
		})
		return
	}

	var enrollments []models.Enrollment
	db.WithTenant(c).Where("cohort_id IN ?", targetCohortIDs).
		Order("current_xp DESC").Find(&enrollments)

	var allUserIDs []string
	for _, e := range enrollments {
		allUserIDs = append(allUserIDs, e.UserID)
	}

	// Preload shared users and portfolios
	type SharedUser struct {
		ID        string `gorm:"column:id"`
		FullName  string `gorm:"column:full_name"`
		AvatarURL string `gorm:"column:avatar_url"`
		Role      string `gorm:"column:role"`
	}
	var users []SharedUser
	if len(allUserIDs) > 0 {
		db.DB.Table("users").Where("id IN ?", allUserIDs).Find(&users)
	}
	userMap := make(map[string]SharedUser)
	for _, u := range users {
		userMap[u.ID] = u
	}

	var portfolios []models.PublicPortfolio
	if len(allUserIDs) > 0 {
		db.DB.Where("user_id IN ?", allUserIDs).Find(&portfolios)
	}
	portMap := make(map[string]models.PublicPortfolio)
	for _, p := range portfolios {
		portMap[p.UserID] = p
	}

	var result []map[string]interface{}
	myStreak := 0
	myRank := 0
	myXP := 0

	for i, e := range enrollments {
		u := userMap[e.UserID]
		port := portMap[e.UserID]

		name := u.FullName
		if name == "" {
			name = port.FullName
		}
		if name == "" {
			name = "Builder"
		}

		avatar := u.AvatarURL
		if avatar == "" {
			avatar = port.AvatarURL
		}
		if avatar == "" {
			avatar = fmt.Sprintf("https://ui-avatars.com/api/?name=%s&background=146ef5&color=fff", name)
		}

		isMe := e.UserID == uid
		if isMe {
			myStreak = e.StreakDays
			myRank = i + 1
			myXP = e.CurrentXP
		}

		level := "Novice"
		if e.CurrentXP >= 5000 {
			level = "Grandmaster"
		} else if e.CurrentXP >= 2500 {
			level = "Architect"
		} else if e.CurrentXP >= 1000 {
			level = "Builder"
		}

		result = append(result, map[string]interface{}{
			"rank":         i + 1,
			"user_id":      e.UserID,
			"name":         name,
			"avatar":       avatar,
			"username":     port.Username,
			"headline":     port.Headline,
			"cohort_id":    e.CohortID,
			"cohort_title": cohortMap[e.CohortID],
			"current_xp":   e.CurrentXP,
			"streak_days":  e.StreakDays,
			"level":        level,
			"is_me":        isMe,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"leaders":   result,
		"cohorts":   cohortSummaries,
		"my_streak": myStreak,
		"my_rank":   myRank,
		"my_xp":     myXP,
	})
}

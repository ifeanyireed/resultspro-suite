package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

// Response structure for conversations list
type ConversationResponse struct {
	ID          string          `json:"id"`
	Type        string          `json:"type"`
	OtherUser   map[string]any  `json:"other_user"`
	LastMessage *models.Message `json:"last_message"`
	UnreadCount int             `json:"unread_count"`
	UpdatedAt   time.Time       `json:"updated_at"`
}

type EnrichedMessage struct {
	models.Message
	SenderName   string `json:"sender_name"`
	SenderAvatar string `json:"sender_avatar"`
}

func (h *Handler) GetConversations(c *gin.Context) {
	userID, _ := c.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)

	var participants []models.ConversationParticipant
	if err := db.WithTenant(c).Where("user_id = ?", uid).Find(&participants).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch conversations"})
		return
	}

	var convIDs []string
	for _, p := range participants {
		convIDs = append(convIDs, p.ConversationID)
	}

	if len(convIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{"conversations": []interface{}{}})
		return
	}

	var convs []models.Conversation
	db.WithTenant(c).Where("id IN ?", convIDs).Find(&convs)
	convMap := make(map[string]models.Conversation)
	for _, cv := range convs {
		convMap[cv.ID] = cv
	}

	// Fetch other participants for all direct conversations
	var allOtherParts []models.ConversationParticipant
	db.WithTenant(c).Where("conversation_id IN ? AND user_id != ?", convIDs, uid).Find(&allOtherParts)
	otherPartMap := make(map[string]models.ConversationParticipant)
	var otherUserIDs []string
	for _, op := range allOtherParts {
		otherPartMap[op.ConversationID] = op
		otherUserIDs = append(otherUserIDs, op.UserID)
	}

	// Fetch shared user details
	type SharedUser struct {
		ID        string `gorm:"column:id"`
		FullName  string `gorm:"column:full_name"`
		AvatarURL string `gorm:"column:avatar_url"`
	}
	var users []SharedUser
	if len(otherUserIDs) > 0 {
		db.DB.Table("users").Where("id IN ?", otherUserIDs).Find(&users)
	}
	userMap := make(map[string]SharedUser)
	for _, u := range users {
		userMap[u.ID] = u
	}

	// Fetch public portfolios for headlines and handles
	var portfolios []models.PublicPortfolio
	if len(otherUserIDs) > 0 {
		db.DB.Where("user_id IN ?", otherUserIDs).Find(&portfolios)
	}
	portfolioMap := make(map[string]models.PublicPortfolio)
	for _, port := range portfolios {
		portfolioMap[port.UserID] = port
	}

	// Fetch cohorts for COHORT type conversations
	var cohorts []models.Cohort
	db.DB.Find(&cohorts)
	cohortMap := make(map[string]models.Cohort)
	for _, ch := range cohorts {
		cohortMap[ch.ID] = ch
	}

	var responses []ConversationResponse

	for _, p := range participants {
		conv, exists := convMap[p.ConversationID]
		if !exists {
			continue
		}

		var lastMsg models.Message
		db.WithTenant(c).Where("conversation_id = ?", p.ConversationID).Order("created_at desc").First(&lastMsg)

		var unread int64
		q := db.WithTenant(c).Model(&models.Message{}).Where("conversation_id = ? AND sender_id != ?", p.ConversationID, uid)
		if p.LastReadAt != nil {
			q = q.Where("created_at > ?", p.LastReadAt)
		}
		q.Count(&unread)

		otherUserData := make(map[string]any)

		if conv.Type == "COHORT" {
			chTitle := "Cohort Channel"
			chImage := ""
			if ch, ok := cohortMap[conv.ID]; ok {
				chTitle = ch.Title + " Channel"
				chImage = ch.ImageURL
			}
			otherUserData = map[string]any{
				"id":       conv.ID,
				"name":     chTitle,
				"avatar":   chImage,
				"role":     "Cohort Discussion",
				"is_group": true,
			}
		} else {
			// Direct message
			otherPart := otherPartMap[p.ConversationID]
			targetUID := otherPart.UserID
			u := userMap[targetUID]
			port := portfolioMap[targetUID]

			name := u.FullName
			if name == "" {
				if len(targetUID) >= 6 {
					name = "Peer " + targetUID[:6]
				} else {
					name = "Peer"
				}
			}

			avatar := u.AvatarURL
			if avatar == "" {
				avatar = port.AvatarURL
			}

			role := port.Headline
			if role == "" {
				role = "Student Builder"
			}

			otherUserData = map[string]any{
				"id":       targetUID,
				"name":     name,
				"avatar":   avatar,
				"role":     role,
				"username": port.Username,
				"is_group": false,
			}
		}

		resp := ConversationResponse{
			ID:          conv.ID,
			Type:        conv.Type,
			UpdatedAt:   conv.UpdatedAt,
			UnreadCount: int(unread),
			OtherUser:   otherUserData,
		}

		if lastMsg.ID != "" {
			resp.LastMessage = &lastMsg
			resp.UpdatedAt = lastMsg.CreatedAt
		}
		responses = append(responses, resp)
	}

	c.JSON(http.StatusOK, gin.H{"conversations": responses})
}

func (h *Handler) GetMessages(c *gin.Context) {
	userID, _ := c.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)
	convID := c.Param("id")

	// Verify participant
	var p models.ConversationParticipant
	if err := db.WithTenant(c).Where("conversation_id = ? AND user_id = ?", convID, uid).First(&p).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant in this conversation"})
		return
	}

	// Update last read timestamp
	now := time.Now()
	db.WithTenant(c).Model(&p).Update("last_read_at", now)

	var messages []models.Message
	db.WithTenant(c).Where("conversation_id = ?", convID).Order("created_at asc").Find(&messages)

	// Collect sender IDs to enrich with real names and avatars
	var senderIDs []string
	for _, m := range messages {
		senderIDs = append(senderIDs, m.SenderID)
	}

	type SharedUser struct {
		ID        string `gorm:"column:id"`
		FullName  string `gorm:"column:full_name"`
		AvatarURL string `gorm:"column:avatar_url"`
	}
	var users []SharedUser
	if len(senderIDs) > 0 {
		db.DB.Table("users").Where("id IN ?", senderIDs).Find(&users)
	}
	userMap := make(map[string]SharedUser)
	for _, u := range users {
		userMap[u.ID] = u
	}

	var enriched []EnrichedMessage
	for _, m := range messages {
		sName := userMap[m.SenderID].FullName
		if sName == "" {
			if m.SenderID == uid {
				sName = "Me"
			} else if len(m.SenderID) >= 6 {
				sName = "User " + m.SenderID[:6]
			} else {
				sName = "User"
			}
		}
		enriched = append(enriched, EnrichedMessage{
			Message:      m,
			SenderName:   sName,
			SenderAvatar: userMap[m.SenderID].AvatarURL,
		})
	}

	c.JSON(http.StatusOK, gin.H{"messages": enriched})
}

func (h *Handler) SendMessage(c *gin.Context) {
	userID, _ := c.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)
	convID := c.Param("id")

	var req struct {
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify participant
	var p models.ConversationParticipant
	if err := db.WithTenant(c).Where("conversation_id = ? AND user_id = ?", convID, uid).First(&p).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant"})
		return
	}

	msg := models.Message{
		ID:             "msg_" + uuid.New().String(),
		ConversationID: convID,
		SenderID:       uid,
		Content:        req.Content,
		CreatedAt:      time.Now(),
	}

	if err := db.WithTenant(c).Create(&msg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	// Update conversation updated_at
	db.WithTenant(c).Model(&models.Conversation{}).Where("id = ?", convID).Update("updated_at", time.Now())

	c.JSON(http.StatusOK, gin.H{"message": msg})
}

func (h *Handler) StartDirectMessage(c *gin.Context) {
	userID, _ := c.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)
	tenantID, _ := c.Get("tenant_id")
	tid := tenantID.(string)

	targetID := c.Param("targetUserId")
	if targetID == "" || targetID == uid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid target user ID"})
		return
	}

	// Check if direct conversation already exists between these two users
	var existingParts []models.ConversationParticipant
	db.WithTenant(c).Raw(`
		SELECT cp1.conversation_id 
		FROM crs_conversation_participants cp1
		JOIN crs_conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
		JOIN crs_conversations cv ON cv.id = cp1.conversation_id
		WHERE cp1.user_id = ? AND cp2.user_id = ? AND cv.type = 'DIRECT'
		LIMIT 1
	`, uid, targetID).Scan(&existingParts)

	if len(existingParts) > 0 {
		c.JSON(http.StatusOK, gin.H{"conversation_id": existingParts[0].ConversationID})
		return
	}

	// Create new direct conversation
	conv := models.Conversation{
		ID:        "conv_" + uuid.New().String(),
		TenantID:  tid,
		Type:      "DIRECT",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	db.WithTenant(c).Create(&conv)

	now := time.Now()
	db.WithTenant(c).Create(&models.ConversationParticipant{ConversationID: conv.ID, UserID: uid, LastReadAt: &now, CreatedAt: now})
	db.WithTenant(c).Create(&models.ConversationParticipant{ConversationID: conv.ID, UserID: targetID, CreatedAt: now})

	c.JSON(http.StatusOK, gin.H{"conversation_id": conv.ID})
}

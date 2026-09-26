package handlers

import (
	"net/http"
	"github.com/google/uuid"
	"time"

	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

// Response structure for conversations list
type ConversationResponse struct {
	ID            string         `json:"id"`
	Type          string         `json:"type"`
	OtherUser     map[string]any `json:"other_user"`
	LastMessage   *models.Message `json:"last_message"`
	UnreadCount   int            `json:"unread_count"`
	UpdatedAt     time.Time      `json:"updated_at"`
}

func (h *Handler) GetConversations(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(string)

	var participants []models.ConversationParticipant
	if err := db.WithTenant(c).Where("user_id = ?", uid).Find(&participants).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch conversations"})
		return
	}

	var responses []ConversationResponse

	for _, p := range participants {
		var conv models.Conversation
		db.WithTenant(c).First(&conv, "id = ?", p.ConversationID)

		var otherPart models.ConversationParticipant
		db.WithTenant(c).Where("conversation_id = ? AND user_id != ?", p.ConversationID, uid).First(&otherPart)

		var lastMsg models.Message
		db.WithTenant(c).Where("conversation_id = ?", p.ConversationID).Order("created_at desc").First(&lastMsg)

		var unread int64
		q := db.WithTenant(c).Model(&models.Message{}).Where("conversation_id = ? AND sender_id != ?", p.ConversationID, uid)
		if p.LastReadAt != nil {
			q = q.Where("created_at > ?", p.LastReadAt)
		}
		q.Count(&unread)

		resp := ConversationResponse{
			ID:          conv.ID,
			Type:        conv.Type,
			UpdatedAt:   conv.UpdatedAt,
			UnreadCount: int(unread),
			OtherUser:   map[string]any{"id": otherPart.UserID, "name": "User " + otherPart.UserID[:5]}, // Ideally fetched from users service or cache
		}

		if lastMsg.ID != "" {
			resp.LastMessage = &lastMsg
			resp.UpdatedAt = lastMsg.CreatedAt // update sort order
		}
		responses = append(responses, resp)
	}

	c.JSON(http.StatusOK, gin.H{"conversations": responses})
}

func (h *Handler) GetMessages(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(string)
	convID := c.Param("id")

	// Verify participant
	var p models.ConversationParticipant
	if err := db.WithTenant(c).Where("conversation_id = ? AND user_id = ?", convID, uid).First(&p).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant"})
		return
	}

	// Update last read
	now := time.Now()
	db.WithTenant(c).Model(&p).Update("last_read_at", now)

	var messages []models.Message
	db.WithTenant(c).Where("conversation_id = ?", convID).Order("created_at asc").Find(&messages)

	c.JSON(http.StatusOK, gin.H{"messages": messages})
}

func (h *Handler) SendMessage(c *gin.Context) {
	userID, _ := c.Get("user_id")
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
	}

	if err := db.WithTenant(c).Create(&msg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	// Update conv timestamp
	db.WithTenant(c).Model(&models.Conversation{}).Where("id = ?", convID).Update("updated_at", time.Now())
	
	c.JSON(http.StatusOK, gin.H{"message": msg})
}

func (h *Handler) StartDirectMessage(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(string)
	tenantID, _ := c.Get("tenant_id")
	tid := tenantID.(string)

	targetID := c.Param("targetUserId")

	// Check if direct conversation already exists between these two
	var existingParts []models.ConversationParticipant
	// A bit complex query to find exact match of 2 participants in a DIRECT conv, but we can simplify:
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

	// Create new
	conv := models.Conversation{
		ID:       "conv_" + uuid.New().String(),
		TenantID: tid,
		Type:     "DIRECT",
	}
	db.WithTenant(c).Create(&conv)

	db.WithTenant(c).Create(&models.ConversationParticipant{ConversationID: conv.ID, UserID: uid})
	db.WithTenant(c).Create(&models.ConversationParticipant{ConversationID: conv.ID, UserID: targetID})

	c.JSON(http.StatusOK, gin.H{"conversation_id": conv.ID})
}

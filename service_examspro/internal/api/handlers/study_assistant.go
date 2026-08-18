package handlers

import (
	"context"
	"net/http"
	"strconv"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"exams-resultspro-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StudyAssistantHandler struct{}

type WeakTopic struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Accuracy float64 `json:"accuracy"`
}

func (h *StudyAssistantHandler) getWeakTopics(userID string) ([]WeakTopic, error) {
	var answers []models.UserAnswer
	if err := database.DB.Preload("Question.Topic").Where("user_id = ?", userID).Find(&answers).Error; err != nil {
		return nil, err
	}

	if len(answers) == 0 {
		return []WeakTopic{}, nil
	}

	stats := make(map[int]struct {
		name    string
		correct int
		total   int
	})

	for _, a := range answers {
		if a.Question == nil || a.Question.Topic == nil {
			continue
		}
		tid := a.Question.TopicID
		s := stats[tid]
		s.name = a.Question.Topic.Name
		s.total++
		if a.IsCorrect {
			s.correct++
		}
		stats[tid] = s
	}

	var weakTopics []WeakTopic
	for id, s := range stats {
		accuracy := (float64(s.correct) / float64(s.total)) * 100
		if accuracy < 70 && s.total > 3 {
			weakTopics = append(weakTopics, WeakTopic{
				ID:       id,
				Name:     s.name,
				Accuracy: accuracy,
			})
		}
	}

	// Sort by accuracy (asc)
	for i := 0; i < len(weakTopics); i++ {
		for j := i + 1; j < len(weakTopics); j++ {
			if weakTopics[j].Accuracy < weakTopics[i].Accuracy {
				weakTopics[i], weakTopics[j] = weakTopics[j], weakTopics[i]
			}
		}
	}

	if len(weakTopics) > 3 {
		weakTopics = weakTopics[:3]
	}

	return weakTopics, nil
}

func (h *StudyAssistantHandler) GetDashboard(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	weakTopics, err := h.getWeakTopics(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	var recentSessions []models.StudySession
	if err := database.DB.Preload("Topic").Where("user_id = ?", userID).Order("updated_at desc").Limit(5).Find(&recentSessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"weakTopics":     weakTopics,
		"recentSessions": recentSessions,
	})
}

func (h *StudyAssistantHandler) Chat(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	var input struct {
		Message   string  `json:"message" binding:"required"`
		SessionID *string `json:"sessionId"`
		TopicID   *string `json:"topicId"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var session models.StudySession
	if input.SessionID != nil && *input.SessionID != "" {
		if err := database.DB.Preload("Messages", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at asc").Limit(10)
		}).Where("id = ? AND user_id = ?", *input.SessionID, userID).First(&session).Error; err != nil {
			// fallback create session
		}
	}

	if session.ID == "" {
		var topicIDInt *int
		if input.TopicID != nil {
			if id, err := strconv.Atoi(*input.TopicID); err == nil {
				topicIDInt = &id
			}
		}
		title := input.Message
		if len(title) > 30 {
			title = title[:30] + "..."
		}
		session = models.StudySession{
			ID:      uuid.New().String(),
			UserID:  userID,
			TopicID: topicIDInt,
			Title:   &title,
		}
		database.DB.Create(&session)
	}

	// Save user message
	userMsg := models.ChatMessage{
		ID:        uuid.New().String(),
		SessionID: session.ID,
		Role:      "user",
		Content:   input.Message,
	}
	database.DB.Create(&userMsg)

	// Context
	weakTopicsData, _ := h.getWeakTopics(userID)
	var weakTopicNames []string
	for _, t := range weakTopicsData {
		weakTopicNames = append(weakTopicNames, t.Name)
	}

	syllabusContext := ""
	if session.TopicID != nil {
		var topic models.Topic
		database.DB.Where("id = ?", *session.TopicID).First(&topic)
		if topic.SyllabusContent != nil {
			syllabusContext = *topic.SyllabusContent
		}
	}

	// AI Response
	var history []map[string]string
	for _, m := range session.Messages {
		history = append(history, map[string]string{
			"role":    m.Role,
			"content": m.Content,
		})
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.CoinBalance < 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient coins. Each AI question costs 2 coins."})
		return
	}

	aiResponse, err := utils.GenerateTutorResponse(context.Background(), input.Message, history, weakTopicNames, syllabusContext)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get AI response"})
		return
	}

	botMsg := models.ChatMessage{
		ID:        uuid.New().String(),
		SessionID: session.ID,
		Role:      "assistant",
		Content:   aiResponse,
	}
	database.DB.Create(&botMsg)

	// Deduct 2 coins within a transaction
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.User{}).Where("id = ?", userID).Update("coin_balance", gorm.Expr("coin_balance - ?", 2)).Error; err != nil {
			return err
		}
		// Record transaction
		return tx.Create(&models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      userID,
			Amount:      -2,
			Type:        "AI_CHAT",
			Description: utils.StringPtr("Asked AI Tutor a question"),
		}).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deduct coins: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sessionId": session.ID,
		"message":   botMsg,
	})
}

func (h *StudyAssistantHandler) GetSessionMessages(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)
	sessionID := c.Param("sessionId")

	var messages []models.ChatMessage
	if err := database.DB.Joins("JOIN study_sessions ON study_sessions.id = chat_messages.session_id").
		Where("chat_messages.session_id = ? AND study_sessions.user_id = ?", sessionID, userID).
		Order("chat_messages.created_at asc").Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

func (h *StudyAssistantHandler) GetTopicStudyAssistant(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)
	topicIdStr := c.Param("topicId")

	var topic models.Topic
	if err := database.DB.Where("id = ?", topicIdStr).First(&topic).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	// Check if user has already unlocked this topic (session exists)
	var existingSession models.StudySession
	err := database.DB.Where("user_id = ? AND topic_id = ?", userID, topic.ID).First(&existingSession).Error

	isAlreadyUnlocked := err == nil

	if !isAlreadyUnlocked {
		var user models.User
		if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		if user.CoinBalance < 5 {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient coins. You need 5 coins to open this Study Assistant."})
			return
		}

		// Deduct 5 coins
		if err := database.DB.Model(&models.User{}).Where("id = ?", userID).Update("coin_balance", gorm.Expr("coin_balance - ?", 5)).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deduct coins"})
			return
		}

		// Record transaction
		database.DB.Create(&models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      userID,
			Amount:      -5,
			Type:        "STUDY_ASSISTANT",
			Description: utils.StringPtr("Started Study Session for " + topic.Name),
		})

		// Create the initial session to mark as unlocked
		newSession := models.StudySession{
			ID:      uuid.New().String(),
			UserID:  userID,
			TopicID: &topic.ID,
		}
		database.DB.Create(&newSession)
	}

	// Check if AI notes already exist
	if topic.AiLessonNotes == nil || *topic.AiLessonNotes == "" {
		// Generate using Gemini
		lessonNote, err := utils.GenerateTopicLessonNote(context.Background(), topic.Name, topic.SyllabusContent)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "AI generation failed: " + err.Error()})
			return
		}

		topic.AiLessonNotes = &lessonNote
		database.DB.Model(&models.Topic{}).Where("id = ?", topic.ID).Update("ai_lesson_notes", lessonNote)
	}

	c.JSON(http.StatusOK, gin.H{
		"topic":             topic,
		"alreadyUnlocked":   isAlreadyUnlocked,
	})
}

func (h *StudyAssistantHandler) AskTopicQuestion(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)
	topicIdStr := c.Param("topicId")

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.CoinBalance < 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient coins. Each question costs 2 coins."})
		return
	}

	var input struct {
		Message string `json:"message" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var topic models.Topic
	if err := database.DB.Where("id = ?", topicIdStr).First(&topic).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	// Use existing GenerateTutorResponse logic but focused on this topic
	syllabusContext := "TOPIC: " + topic.Name
	if topic.SyllabusContent != nil {
		syllabusContext += "\nSYLLABUS: " + *topic.SyllabusContent
	}
	if topic.AiLessonNotes != nil {
		syllabusContext += "\nLESSON NOTES: " + *topic.AiLessonNotes
	}

	aiResponse, err := utils.GenerateTutorResponse(context.Background(), input.Message, nil, nil, syllabusContext)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI response failed"})
		return
	}

	// Deduct 2 coins within a transaction
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.User{}).Where("id = ?", userID).Update("coin_balance", gorm.Expr("coin_balance - ?", 2)).Error; err != nil {
			return err
		}
		// Record transaction
		return tx.Create(&models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      userID,
			Amount:      -2,
			Type:        "AI_QUERY",
			Description: utils.StringPtr("Asked AI Tutor about " + topic.Name),
		}).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deduct coins: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"response": aiResponse,
	})
}


func (h *StudyAssistantHandler) GetTopicStudyStatus(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID, ok := userIDVal.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	topicIdStr := c.Param("topicId")

	var topic models.Topic
	if err := database.DB.Where("id = ?", topicIdStr).First(&topic).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	// Check if user has already unlocked this topic (session exists)
	var existingSession models.StudySession
	err := database.DB.Where("user_id = ? AND topic_id = ?", userID, topic.ID).First(&existingSession).Error

	isAlreadyUnlocked := err == nil

	c.JSON(http.StatusOK, gin.H{
		"alreadyUnlocked":   isAlreadyUnlocked,
		"hasLessonNotes":    topic.AiLessonNotes != nil && *topic.AiLessonNotes != "",
		"topicName":         topic.Name,
	})
}

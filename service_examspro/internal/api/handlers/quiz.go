package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"exams-resultspro-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type QuizHandler struct{}

func (h *QuizHandler) GetQuestionsByTopic(c *gin.Context) {
	topicIdStr := c.Param("topicId")
	if topicIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Topic ID is required"})
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	var limit int
	if limitStr == "all" {
		limit = 1000 // effectively all for most topics
	} else {
		limit, _ = strconv.Atoi(limitStr)
		if limit <= 0 {
			limit = 10
		}
	}

	topicId, err := strconv.Atoi(topicIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Topic ID"})
		return
	}

	qType := c.Query("type") // mcq or theory

	var questions []models.Question
	query := database.DB.Debug().Preload("Options", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "question_id", "option_text", "order_index") // Hide IsCorrect
	}).Preload("Topic").Preload("Topic.Subject").Preload("Topic.Subject.Exam").Where("topic_id = ? AND status = ?", topicId, "published")

	if qType != "" {
		query = query.Where("type = ?", qType)
	}

	if err := query.Order("RANDOM()").Limit(limit).Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions"})
		return
	}

	log.Printf("GetQuestionsByTopic: topicId=%d, type=%s, limit=%d, found=%d", topicId, qType, limit, len(questions))

	c.JSON(http.StatusOK, questions)
}

func (h *QuizHandler) GetAvailableQuestionTypes(c *gin.Context) {
	topicId := c.Query("topicId")
	subjectId := c.Query("subjectId")
	year := c.Query("year")

	var counts []struct {
		Type  string
		Count int
	}

	query := database.DB.Model(&models.Question{}).Select("type, count(*) as count").Where("status = ?", "published")

	if topicId != "" {
		query = query.Where("topic_id = ?", topicId)
	} else if subjectId != "" {
		query = query.Where("subject_id = ?", subjectId)
		if year != "" {
			query = query.Where("year = ?", year)
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "topicId or subjectId is required"})
		return
	}

	query.Group("type").Scan(&counts)

	result := gin.H{
		"mcq":    false,
		"theory": false,
	}

	for _, c := range counts {
		if c.Count > 0 {
			result[c.Type] = true
		}
	}

	c.JSON(http.StatusOK, result)
}

func (h *QuizHandler) SubmitAnswer(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	var input struct {
		QuestionID       string `json:"questionId" binding:"required"`
		SelectedOptionID string `json:"selectedOptionId"` // for MCQ
		TextAnswer       string `json:"textAnswer"`       // for Theory
		TimeTakenMs      int    `json:"timeTakenMs"`
		SessionID        string `json:"sessionId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var question models.Question
	if err := database.DB.Preload("Options").Where("id = ?", input.QuestionID).First(&question).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		return
	}

	var isCorrect bool
	var feedback string
	var correctOptionId *string

	if question.Type == "theory" {
		var err error
		isCorrect, feedback, err = utils.ValidateTheoryAnswer(c.Request.Context(), question.BodyText, question.ExplanationStandard, input.TextAnswer)
		if err != nil {
			log.Printf("AI Validation Error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "AI Validation failed: " + err.Error()})
			return
		}
	} else {
		var correctOption *models.QuestionOption
		for i, opt := range question.Options {
			if opt.IsCorrect {
				correctOption = &question.Options[i]
				break
			}
		}
		isCorrect = correctOption != nil && correctOption.ID == input.SelectedOptionID
		if correctOption != nil {
			correctOptionId = &correctOption.ID
		}
		if question.ExplanationStandard != nil {
			feedback = *question.ExplanationStandard
		}
	}

	coinsEarned := 0
	streakBonus := 0
	isNewStreakDay := false

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var user models.User
		if err := tx.Where("id = ?", userID).First(&user).Error; err != nil {
			return err
		}

		now := time.Now()
		today := now.Truncate(24 * time.Hour)
		
		// 1. Calculate Streak
		if user.LastActiveAt == nil {
			user.StreakCurrent = 1
			isNewStreakDay = true
		} else {
			lastActive := user.LastActiveAt.Truncate(24 * time.Hour)
			if lastActive.Equal(today.AddDate(0, 0, -1)) {
				user.StreakCurrent++
				isNewStreakDay = true
			} else if lastActive.Before(today.AddDate(0, 0, -1)) {
				user.StreakCurrent = 1
				isNewStreakDay = true
			}
			// If already active today, streak doesn't change
		}

		// 2. Grant Streak Bonus (15 coins every 7 days)
		if isNewStreakDay && user.StreakCurrent > 0 && user.StreakCurrent % 7 == 0 {
			streakBonus = 15
			utils.SendNotification(user.ID, "7-Day Streak!", fmt.Sprintf("You earned 15 bonus coins for maintaining a %d-day study streak. Keep it up!", user.StreakCurrent), models.NotificationTypeReward, models.NotificationRouteBoth)
		}

		// 3. Calculate Reward for this Answer
		if isCorrect {
			if question.Type == "theory" {
				coinsEarned = 3
			} else {
				// Default MCQ reward
				coinsEarned = question.CoinReward
				if coinsEarned == 0 { coinsEarned = 1 }
			}
		}

		totalToCredit := coinsEarned + streakBonus
		
		// Update User
		updateData := map[string]interface{}{
			"last_active_at": &now,
			"streak_current": user.StreakCurrent,
		}
		if totalToCredit > 0 {
			updateData["coin_balance"] = gorm.Expr("coin_balance + ?", totalToCredit)
		}
		if err := tx.Model(&user).Updates(updateData).Error; err != nil {
			return err
		}

		// 4. Record Transaction Logs
		if coinsEarned > 0 {
			tx.Create(&models.CoinTransaction{
				ID:          uuid.New().String(),
				UserID:      userID,
				Amount:      coinsEarned,
				Type:        "STUDY_REWARD",
				Description: utils.StringPtr(fmt.Sprintf("Reward for correct %s answer", question.Type)),
				ReferenceID: &question.ID,
			})
		}
		if streakBonus > 0 {
			tx.Create(&models.CoinTransaction{
				ID:          uuid.New().String(),
				UserID:      userID,
				Amount:      streakBonus,
				Type:        "STREAK_BONUS",
				Description: utils.StringPtr(fmt.Sprintf("%d-day study streak reached!", user.StreakCurrent)),
			})
		}

		// Save UserAnswer log
		var selOpt *string
		if input.SelectedOptionID != "" {
			selOpt = &input.SelectedOptionID
		}
		var txtAns *string
		if input.TextAnswer != "" {
			txtAns = &input.TextAnswer
		}

		userAnswer := models.UserAnswer{
			ID:               uuid.New().String(),
			UserID:           userID,
			QuestionID:       input.QuestionID,
			SelectedOptionID: selOpt,
			TextAnswer:       txtAns,
			IsCorrect:        isCorrect,
			CoinsEarned:      coinsEarned,
			TimeTakenMs:      input.TimeTakenMs,
			SessionID:        input.SessionID,
			AnsweredAt:       now,
		}
		return tx.Create(&userAnswer).Error
	})

	if err != nil {
		log.Printf("SubmitAnswer Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"isCorrect":       isCorrect,
		"correctOptionId": correctOptionId,
		"explanation":     feedback,
		"coinsEarned":     coinsEarned,
		"streakBonus":     streakBonus,
		"totalStreak":     streakBonus > 0, // Signal to UI for confetti/alert
	})
}

func (h *QuizHandler) GetHint(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	var input struct {
		QuestionID    string   `json:"questionId" binding:"required"`
		ExcludedIDs   []string `json:"excludedIds"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	hintCost := 3
	if user.CoinBalance < hintCost {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient coins. AI Deep Dive costs 3 coins."})
		return
	}

	var question models.Question
	if err := database.DB.Preload("Options").Where("id = ?", input.QuestionID).First(&question).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		return
	}

	// Find a wrong option that isn't already hidden
	var wrongOptionID string
	excludedMap := make(map[string]bool)
	for _, id := range input.ExcludedIDs {
		excludedMap[id] = true
	}

	for _, opt := range question.Options {
		if !opt.IsCorrect && !excludedMap[opt.ID] {
			wrongOptionID = opt.ID
			break // Just pick the first one matching
		}
	}

	if wrongOptionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No more wrong options to hide"})
		return
	}

	// Process transaction
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// Deduct coins
		if err := tx.Model(&models.User{}).Where("id = ?", userID).
			Update("coin_balance", gorm.Expr("coin_balance - ?", hintCost)).Error; err != nil {
			return err
		}

		// Record transaction
		transaction := models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      userID,
			Amount:      -hintCost,
			Type:        "spent",
			Description: stringPtr("Used hint for question " + question.ID),
			ReferenceID: &question.ID,
		}
		if err := tx.Create(&transaction).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process hint deduction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"wrongOptionId": wrongOptionID,
		"newBalance":    user.CoinBalance - hintCost,
	})
}

func stringPtr(s string) *string {
	return &s
}

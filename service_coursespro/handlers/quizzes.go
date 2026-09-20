package handlers

import (
	"net/http"
	"time"

	"service_coursespro/db"
	"service_coursespro/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *Handler) AdminGetQuizzes(c *gin.Context) {
	var quizzes []models.Quiz
	db.WithTenant(c).Order("created_at DESC").Find(&quizzes)
	c.JSON(http.StatusOK, gin.H{"quizzes": quizzes})
}

func (h *Handler) AdminGetQuiz(c *gin.Context) {
	id := c.Param("id")
	var quiz models.Quiz
	if err := db.WithTenant(c).First(&quiz, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Quiz not found"})
		return
	}

	var questions []models.QuizQuestion
	db.WithTenant(c).Where("quiz_id = ?", id).Order("order_index ASC").Find(&questions)
	
	c.JSON(http.StatusOK, gin.H{"quiz": quiz, "questions": questions})
}

type CreateQuizInput struct {
	Title         string `json:"title" binding:"required"`
	ModuleID      string `json:"module_id"`
	GeneratedByAI bool   `json:"generated_by_ai"`
	Questions     []struct {
		Question     string `json:"question"`
		QuestionType string `json:"question_type"`
		OptionsJSON  string `json:"options_json"`
		CorrectIndex int    `json:"correct_index"`
		Explanation  string `json:"explanation"`
		BloomLevel   string `json:"bloom_level"`
	} `json:"questions"`
}

func (h *Handler) AdminCreateQuiz(c *gin.Context) {
	tenantVal, _ := c.Get("tenant_id")
	tenantID := ""
	if tenantVal != nil {
		tenantID = tenantVal.(string)
	}

	var input CreateQuizInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	quiz := models.Quiz{
		TenantID:      tenantID,
		ID:            uuid.New().String(),
		ModuleID:      input.ModuleID, // Optional
		Title:         input.Title,
		GeneratedByAI: input.GeneratedByAI,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := db.WithTenant(c).Create(&quiz).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create quiz"})
		return
	}

	for i, q := range input.Questions {
		question := models.QuizQuestion{
			TenantID:     tenantID,
			ID:           uuid.New().String(),
			QuizID:       quiz.ID,
			Question:     q.Question,
			QuestionType: q.QuestionType,
			OptionsJSON:  q.OptionsJSON,
			CorrectIndex: q.CorrectIndex,
			Explanation:  q.Explanation,
			BloomLevel:   q.BloomLevel,
			OrderIndex:   i,
			CreatedAt:    time.Now(),
		}
		db.WithTenant(c).Create(&question)
	}

	c.JSON(http.StatusCreated, gin.H{"quiz": quiz})
}

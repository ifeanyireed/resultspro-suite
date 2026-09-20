package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

// SubmitBlock receives a student's block submission (Assignment, Compiler, or Quiz)
func (h *Handler) SubmitBlock(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req struct {
		ModuleID       string `json:"module_id" binding:"required"`
		BlockID        string `json:"block_id" binding:"required"`
		BlockType      string `json:"block_type" binding:"required"`
		SubmissionType string `json:"submission_type"`
		Content        string `json:"content" binding:"required"`
		Score          int    `json:"score"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sub := models.BlockSubmission{
		ID:             uuid.New().String(),
		TenantID:       c.GetString("tenant_id"),
		UserID:         userID.(string),
		ModuleID:       req.ModuleID,
		BlockID:        req.BlockID,
		BlockType:      req.BlockType,
		SubmissionType: req.SubmissionType,
		Content:        req.Content,
		Score:          req.Score,
		Status:         "PENDING",
		SubmittedAt:    time.Now(),
	}

	if err := db.WithTenant(c).Create(&sub).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save submission"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"submission": sub})
}

// GetMyBlockSubmissions retrieves all block submissions for the current student
func (h *Handler) GetMyBlockSubmissions(c *gin.Context) {
	userID, _ := c.Get("user_id")
	moduleID := c.Query("module_id")

	var submissions []models.BlockSubmission
	query := db.WithTenant(c).Where("user_id = ?", userID.(string))
	
	if moduleID != "" {
		query = query.Where("module_id = ?", moduleID)
	}

	query.Order("submitted_at DESC").Find(&submissions)
	c.JSON(http.StatusOK, gin.H{"submissions": submissions})
}

// GetPendingBlockSubmissions retrieves all pending block submissions for mentors
func (h *Handler) GetPendingBlockSubmissions(c *gin.Context) {
	var submissions []models.BlockSubmission
	db.WithTenant(c).Where("status = ?", "PENDING").Order("submitted_at ASC").Find(&submissions)
	c.JSON(http.StatusOK, gin.H{"submissions": submissions})
}

// ReviewBlockSubmission allows a mentor to review and grade a block submission
func (h *Handler) ReviewBlockSubmission(c *gin.Context) {
	subID := c.Param("id")
	mentorID, _ := c.Get("user_id")

	var req struct {
		Feedback string `json:"mentor_feedback" binding:"required"`
		Score    *int   `json:"score"`
		Status   string `json:"status"` // e.g. "REVIEWED"
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	status := "REVIEWED"
	if req.Status != "" {
		status = req.Status
	}

	now := time.Now()
	updates := map[string]interface{}{
		"status":          status,
		"mentor_id":       mentorID.(string),
		"mentor_feedback": req.Feedback,
		"reviewed_at":     now,
	}

	if req.Score != nil {
		updates["score"] = *req.Score
	}

	err := db.WithTenant(c).Model(&models.BlockSubmission{}).Where("id = ?", subID).Updates(updates).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to review submission"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Block submission review recorded successfully"})
}

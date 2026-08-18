package handlers

import (
	"net/http"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ModerationHandler struct{}

func (h *ModerationHandler) GetReports(c *gin.Context) {
	reportType := c.Query("type")
	status := c.Query("status")

	query := database.DB.Preload("Reporter").Preload("ResolvedBy")

	if reportType != "" {
		query = query.Where("type = ?", reportType)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	var reports []models.Report
	if err := query.Order("created_at desc").Find(&reports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, reports)
}

func (h *ModerationHandler) UpdateReportStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status     string `json:"status" binding:"required"`
		AdminNotes string `json:"adminNotes"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminIDVal, _ := c.Get("userId")
	adminID := adminIDVal.(string)

	var report models.Report
	if err := database.DB.Where("id = ?", id).First(&report).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
		return
	}

	report.Status = input.Status
	report.AdminNotes = &input.AdminNotes
	if input.Status == "resolved" || input.Status == "dismissed" {
		report.ResolvedByID = &adminID
	}

	database.DB.Save(&report)
	c.JSON(http.StatusOK, report)
}

func (h *ModerationHandler) BanUser(c *gin.Context) {
	userID := c.Param("userId")
	var input struct {
		Reason    string     `json:"reason"`
		ExpiresAt *time.Time `json:"expiresAt"`
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

	user.IsBanned = true
	user.BanReason = &input.Reason
	user.BanExpiresAt = input.ExpiresAt

	database.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User banned successfully", "user": user})
}

func (h *ModerationHandler) UnbanUser(c *gin.Context) {
	userID := c.Param("userId")

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.IsBanned = false
	user.BanReason = nil
	user.BanExpiresAt = nil

	database.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User unbanned successfully", "user": user})
}

func (h *ModerationHandler) UpdateQuestionStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Model(&models.Question{}).Where("id = ?", id).Update("status", input.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question status updated"})
}
func (h *ModerationHandler) SubmitReport(c *gin.Context) {
	var input struct {
		Type     string  `json:"type" binding:"required"` // 'question', 'user', 'comment', 'other'
		TargetID string  `json:"targetId" binding:"required"`
		Reason   string  `json:"reason" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	report := models.Report{
		ID:         uuid.New().String(),
		ReporterID: userID,
		Type:       input.Type,
		TargetID:   input.TargetID,
		Reason:     input.Reason,
		Status:     "pending",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := database.DB.Create(&report).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit report"})
		return
	}

	c.JSON(http.StatusCreated, report)
}

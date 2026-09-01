package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) SubmitProject(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		CohortID     string `json:"cohort_id" binding:"required"`
		StageNumber  int    `json:"stage_number" binding:"required"`
		ProjectTitle string `json:"project_title" binding:"required"`
		RepoURL      string `json:"repo_url"`
		FigmaURL     string `json:"figma_url"`
		LiveDemoURL  string `json:"live_demo_url"`
		Notes        string `json:"notes"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tenantID, _ := c.Get("tenant_id")
	sub := models.ProjectSubmission{
		TenantID:     tenantID.(string),
		ID:           uuid.New().String(),
		CohortID:     input.CohortID,
		StageNumber:  input.StageNumber,
		UserID:       userID.(string),
		ProjectTitle: input.ProjectTitle,
		RepoURL:      input.RepoURL,
		FigmaURL:     input.FigmaURL,
		LiveDemoURL:  input.LiveDemoURL,
		Notes:        input.Notes,
		Status:       "MENTOR_REVIEW",
		SubmittedAt:  time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := db.WithTenant(c).Create(&sub).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit project"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"submission": sub})
}

func (h *Handler) GetMySubmissions(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var submissions []models.ProjectSubmission
	db.WithTenant(c).Where("user_id = ?", userID.(string)).Order("submitted_at DESC").Find(&submissions)
	c.JSON(http.StatusOK, gin.H{"submissions": submissions})
}

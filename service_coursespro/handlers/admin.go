package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) AdminGetCohorts(c *gin.Context) {
	var cohorts []models.Cohort
	db.WithTenant(c).Order("created_at DESC").Find(&cohorts)
	c.JSON(http.StatusOK, gin.H{"cohorts": cohorts})
}

func (h *Handler) AdminGetEnrollments(c *gin.Context) {
	var enrollments []models.Enrollment
	db.WithTenant(c).Order("created_at DESC").Find(&enrollments)
	c.JSON(http.StatusOK, gin.H{"enrollments": enrollments})
}

func (h *Handler) AdminCreateCohort(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		Slug          string    `json:"slug" binding:"required"`
		Title         string    `json:"title" binding:"required"`
		Subtitle      string    `json:"subtitle"`
		Description   string    `json:"description"`
		DurationWeeks int       `json:"duration_weeks"`
		StartDate     time.Time `json:"start_date"`
		EndDate       time.Time `json:"end_date"`
		Capacity      int       `json:"capacity"`
		Price         float64   `json:"price"`
		Currency      string    `json:"currency"`
		LeadMentorID  string    `json:"lead_mentor_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cohort := models.Cohort{
		TenantID:      tenantID.(string),
		ID:            uuid.New().String(),
		Slug:          input.Slug,
		Title:         input.Title,
		Subtitle:      input.Subtitle,
		Description:   input.Description,
		DurationWeeks: input.DurationWeeks,
		StartDate:     input.StartDate,
		EndDate:       input.EndDate,
		Capacity:      input.Capacity,
		Price:         input.Price,
		Currency:      input.Currency,
		LeadMentorID:  input.LeadMentorID,
		Status:        "DRAFT",
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := db.WithTenant(c).Create(&cohort).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cohort"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"cohort": cohort})
}

func (h *Handler) AdminCreateStage(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		CohortID    string `json:"cohort_id" binding:"required"`
		StageNumber int    `json:"stage_number" binding:"required"`
		Title       string `json:"title" binding:"required"`
		Subtitle    string `json:"subtitle"`
		Description string `json:"description"`
		OrderIndex  int    `json:"order_index"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	stage := models.JourneyStage{
		TenantID:    tenantID.(string),
		ID:          uuid.New().String(),
		CohortID:    input.CohortID,
		StageNumber: input.StageNumber,
		Title:       input.Title,
		Subtitle:    input.Subtitle,
		Description: input.Description,
		OrderIndex:  input.OrderIndex,
		CreatedAt:   time.Now(),
	}

	if err := db.WithTenant(c).Create(&stage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create stage"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"stage": stage})
}

func (h *Handler) AdminCreateModule(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		StageID         string `json:"stage_id" binding:"required"`
		Title           string `json:"title" binding:"required"`
		DurationText    string `json:"duration_text"`
		Description     string `json:"description"`
		VideoURL        string `json:"video_url"`
		ContentMarkdown string `json:"content_markdown"`
		OrderIndex      int    `json:"order_index"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	module := models.JourneyModule{
		TenantID:        tenantID.(string),
		ID:              uuid.New().String(),
		StageID:         input.StageID,
		Title:           input.Title,
		DurationText:    input.DurationText,
		Description:     input.Description,
		VideoURL:        input.VideoURL,
		ContentMarkdown: input.ContentMarkdown,
		OrderIndex:      input.OrderIndex,
		CreatedAt:       time.Now(),
	}

	if err := db.WithTenant(c).Create(&module).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create module"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"module": module})
}

package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

// ApplyForMentor is the public endpoint for users submitting an application
func (h *Handler) ApplyForMentor(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")

	var input struct {
		FirstName   string `json:"first_name" binding:"required"`
		LastName    string `json:"last_name" binding:"required"`
		Email       string `json:"email" binding:"required,email"`
		Expertise   string `json:"expertise" binding:"required"`
		LinkedInURL string `json:"linkedin_url" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	app := models.MentorApplication{
		ID:          "mapp_" + uuid.New().String(),
		TenantID:    tenantID.(string),
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		Email:       input.Email,
		Expertise:   input.Expertise,
		LinkedInURL: input.LinkedInURL,
		Status:      "PENDING",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := db.WithTenant(c).Create(&app).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit application"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Application submitted successfully"})
}

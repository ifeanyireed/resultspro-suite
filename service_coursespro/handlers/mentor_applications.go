package handlers

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

// ApplyForMentor is the public endpoint for users submitting an application
func (h *Handler) ApplyForMentor(c *gin.Context) {
	tenantIDStr := ""
	if tid, exists := c.Get("tenant_id"); exists && tid != nil {
		if s, ok := tid.(string); ok {
			tenantIDStr = s
		}
	}
	if tenantIDStr == "" {
		tenantIDStr = c.GetHeader("x-tenant")
	}
	if tenantIDStr == "" {
		tenantIDStr = c.GetHeader("X-Tenant")
	}
	if tenantIDStr == "" {
		tenantIDStr = c.GetHeader("X-Tenant-ID")
	}
	if tenantIDStr == "" {
		tenantIDStr = c.GetHeader("X-Tenant-Domain")
	}
	if tenantIDStr == "" {
		tenantIDStr = c.Query("tenant_id")
	}
	if tenantIDStr == "" {
		tenantIDStr = c.Query("tenant")
	}

	if tenantIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing tenant identification (X-Tenant header required)"})
		return
	}

	var input struct {
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		Email       string `json:"email"`
		Expertise   string `json:"expertise"`
		LinkedInURL string `json:"linkedin_url"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid application details provided."})
		return
	}

	input.FirstName = strings.TrimSpace(input.FirstName)
	input.LastName = strings.TrimSpace(input.LastName)
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))
	input.Expertise = strings.TrimSpace(input.Expertise)
	input.LinkedInURL = strings.TrimSpace(input.LinkedInURL)

	if input.FirstName == "" || input.LastName == "" || input.Email == "" || !strings.Contains(input.Email, "@") || input.Expertise == "" || input.LinkedInURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please fill in your full name, valid email address, area of expertise, and LinkedIn URL."})
		return
	}

	// Check for existing pending application for this email in this tenant
	var existing models.MentorApplication
	if err := db.DB.Where("tenant_id = ? AND email = ? AND status = ?", tenantIDStr, input.Email, "PENDING").First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You already have a pending application with this email address."})
		return
	}

	app := models.MentorApplication{
		ID:          "mapp_" + uuid.New().String(),
		TenantID:    tenantIDStr,
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		Email:       input.Email,
		Expertise:   input.Expertise,
		LinkedInURL: input.LinkedInURL,
		Status:      "PENDING",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := db.DB.Create(&app).Error; err != nil {
		log.Printf("[MentorApplication] Failed to insert application for %s: %v", input.Email, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit application", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Application submitted successfully"})
}

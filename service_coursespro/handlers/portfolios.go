package handlers

import (
	"net/http"
	"github.com/google/uuid"

	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetPublicPortfolio(c *gin.Context) {
	username := c.Param("username")
	var portfolio models.PublicPortfolio
	if err := db.WithTenant(c).First(&portfolio, "username = ? AND is_published = ?", username, true).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Portfolio not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"portfolio": portfolio})
}

func (h *Handler) GetMyPortfolio(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(string)

	var portfolio models.PublicPortfolio
	if err := db.WithTenant(c).Where("user_id = ?", uid).First(&portfolio).Error; err != nil {
		// If not found, it's fine, return null portfolio
	}

	var approvedProjects []models.ProjectSubmission
	// Fetch user's approved projects (assuming status is 'APPROVED' or 'PASSED' or 'REVIEWED')
	db.WithTenant(c).Where("user_id = ? AND status IN ?", uid, []string{"APPROVED", "REVIEWED", "PASSED"}).Find(&approvedProjects)

	c.JSON(http.StatusOK, gin.H{
		"portfolio":         portfolio,
		"approved_projects": approvedProjects,
	})
}

func (h *Handler) UpsertPortfolio(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(string)
	tenantID, _ := c.Get("tenant_id")
	tid := tenantID.(string)

	var req struct {
		Username           string `json:"username" binding:"required"`
		Headline           string `json:"headline"`
		Bio                string `json:"bio"`
		IsAvailableForHire bool   `json:"is_available_for_hire"`
		IsPublished        bool   `json:"is_published"`
		CaseStudiesJSON    string `json:"case_studies_json"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var portfolio models.PublicPortfolio
	err := db.WithTenant(c).Where("user_id = ?", uid).First(&portfolio).Error
	if err != nil {
		// Create new
		portfolio = models.PublicPortfolio{
			ID:                 "ptf_" + uuid.New().String(),
			TenantID:           tid,
			UserID:             uid,
			Username:           req.Username,
			Headline:           req.Headline,
			Bio:                req.Bio,
			IsAvailableForHire: req.IsAvailableForHire,
			IsPublished:        req.IsPublished,
			CaseStudiesJSON:    req.CaseStudiesJSON,
		}
		if err := db.WithTenant(c).Create(&portfolio).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create portfolio (username might be taken)"})
			return
		}
	} else {
		// Update existing
		portfolio.Username = req.Username
		portfolio.Headline = req.Headline
		portfolio.Bio = req.Bio
		portfolio.IsAvailableForHire = req.IsAvailableForHire
		portfolio.IsPublished = req.IsPublished
		portfolio.CaseStudiesJSON = req.CaseStudiesJSON
		if err := db.WithTenant(c).Save(&portfolio).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update portfolio"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"portfolio": portfolio, "message": "Portfolio updated successfully"})
}

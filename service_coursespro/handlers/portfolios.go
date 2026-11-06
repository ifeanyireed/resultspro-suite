package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetPublicPortfolio(c *gin.Context) {
	username := strings.ToLower(strings.TrimSpace(c.Param("username")))
	var portfolio models.PublicPortfolio

	query := db.DB.Where("LOWER(username) = ? AND is_published = ?", username, true)

	tenantDomain := c.GetHeader("X-Tenant-Domain")
	tenantID := c.Query("tenant_id")
	if tenantID == "" {
		tenantID = c.GetHeader("X-Tenant-ID")
	}

	if tenantID != "" {
		query = query.Where("tenant_id = ?", tenantID)
	}

	if err := query.First(&portfolio).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Portfolio not found or private"})
		return
	}

	// Fetch student user info if not cached on portfolio
	type UserInfo struct {
		FullName  string `json:"full_name"`
		AvatarURL string `json:"avatar_url"`
		Email     string `json:"email"`
	}
	var userInfo UserInfo
	_ = db.DB.Table("users").Select("full_name, avatar_url, email").Where("id = ?", portfolio.UserID).Scan(&userInfo)

	if portfolio.FullName == "" && userInfo.FullName != "" {
		portfolio.FullName = userInfo.FullName
	}
	if portfolio.AvatarURL == "" && userInfo.AvatarURL != "" {
		portfolio.AvatarURL = userInfo.AvatarURL
	}

	// Fetch earned achievements
	var achievements []models.Achievement
	db.DB.Table("crs_achievements").
		Joins("JOIN crs_user_achievements ON crs_user_achievements.achievement_id = crs_achievements.id").
		Where("crs_user_achievements.user_id = ?", portfolio.UserID).
		Select("crs_achievements.*").
		Scan(&achievements)

	c.JSON(http.StatusOK, gin.H{
		"portfolio":     portfolio,
		"user":          userInfo,
		"achievements":  achievements,
		"tenant_domain": tenantDomain,
	})
}

func (h *Handler) GetMyPortfolio(c *gin.Context) {
	userID, _ := c.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)

	var portfolio models.PublicPortfolio
	_ = db.WithTenant(c).Where("user_id = ?", uid).First(&portfolio)

	var approvedProjects []models.ProjectSubmission
	// Fetch user's approved projects (assuming status is 'APPROVED' or 'PASSED' or 'REVIEWED')
	db.WithTenant(c).Where("user_id = ? AND status IN ?", uid, []string{"APPROVED", "REVIEWED", "PASSED"}).
		Order("submitted_at DESC").
		Find(&approvedProjects)

	type UserInfo struct {
		FullName  string `json:"full_name"`
		AvatarURL string `json:"avatar_url"`
		Email     string `json:"email"`
	}
	var userInfo UserInfo
	_ = db.DB.Table("users").Select("full_name, avatar_url, email").Where("id = ?", uid).Scan(&userInfo)

	c.JSON(http.StatusOK, gin.H{
		"portfolio":         portfolio,
		"approved_projects": approvedProjects,
		"user":              userInfo,
	})
}

func (h *Handler) UpsertPortfolio(c *gin.Context) {
	userID, _ := c.Get("user_id")
	tenantID, _ := c.Get("tenant_id")

	if userID == nil || tenantID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	uid := userID.(string)
	tid := tenantID.(string)

	var req struct {
		Username           string `json:"username" binding:"required"`
		FullName           string `json:"full_name"`
		AvatarURL          string `json:"avatar_url"`
		Headline           string `json:"headline"`
		Bio                string `json:"bio"`
		SkillsJSON         string `json:"skills_json"`
		SocialsJSON        string `json:"socials_json"`
		CaseStudiesJSON    string `json:"case_studies_json"`
		MentorEndorsement  string `json:"mentor_endorsement"`
		IsAvailableForHire bool   `json:"is_available_for_hire"`
		IsPublished        bool   `json:"is_published"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate username format (alphanumeric, dashes, underscores)
	cleanedUsername := strings.ToLower(strings.TrimSpace(req.Username))
	if cleanedUsername == "" {
		cleanedUsername = "student-" + uid[:8]
	}

	// Check if username is taken by another user
	var existingWithUsername models.PublicPortfolio
	if err := db.DB.Where("LOWER(username) = ? AND user_id != ?", cleanedUsername, uid).First(&existingWithUsername).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "This public username is already taken. Please choose another."})
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
			Username:           cleanedUsername,
			FullName:           req.FullName,
			AvatarURL:          req.AvatarURL,
			Headline:           req.Headline,
			Bio:                req.Bio,
			SkillsJSON:         req.SkillsJSON,
			SocialsJSON:        req.SocialsJSON,
			CaseStudiesJSON:    req.CaseStudiesJSON,
			MentorEndorsement:  req.MentorEndorsement,
			IsAvailableForHire: req.IsAvailableForHire,
			IsPublished:        req.IsPublished,
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		}
		if err := db.WithTenant(c).Create(&portfolio).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create portfolio", "details": err.Error()})
			return
		}
	} else {
		// Update existing
		portfolio.Username = cleanedUsername
		if req.FullName != "" {
			portfolio.FullName = req.FullName
		}
		if req.AvatarURL != "" {
			portfolio.AvatarURL = req.AvatarURL
		}
		portfolio.Headline = req.Headline
		portfolio.Bio = req.Bio
		if req.SkillsJSON != "" {
			portfolio.SkillsJSON = req.SkillsJSON
		}
		if req.SocialsJSON != "" {
			portfolio.SocialsJSON = req.SocialsJSON
		}
		portfolio.CaseStudiesJSON = req.CaseStudiesJSON
		if req.MentorEndorsement != "" {
			portfolio.MentorEndorsement = req.MentorEndorsement
		}
		portfolio.IsAvailableForHire = req.IsAvailableForHire
		portfolio.IsPublished = req.IsPublished
		portfolio.UpdatedAt = time.Now()

		if err := db.WithTenant(c).Save(&portfolio).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update portfolio", "details": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"portfolio": portfolio, "message": "Portfolio saved successfully"})
}

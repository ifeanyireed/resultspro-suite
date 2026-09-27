package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

// AchievementResponse aggregates an achievement and its earned status for the user
type AchievementResponse struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Type        string     `json:"type"`
	IconURL     string     `json:"icon_url"`
	Earned      bool       `json:"earned"`
	EarnedAt    *time.Time `json:"earned_at"`
}

func (h *Handler) GetMyAchievements(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(string)

	// Fetch all active achievements for this tenant
	var allAchievements []models.Achievement
	if err := db.WithTenant(c).Where("is_active = ?", true).Find(&allAchievements).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch achievements"})
		return
	}

	// Fetch user's earned achievements
	var userAchievements []models.UserAchievement
	db.WithTenant(c).Where("user_id = ?", uid).Find(&userAchievements)

	// Map earned achievements by achievement ID for quick lookup
	earnedMap := make(map[string]models.UserAchievement)
	for _, ua := range userAchievements {
		earnedMap[ua.AchievementID] = ua
	}

	// Build the response
	var responses []AchievementResponse
	for _, a := range allAchievements {
		resp := AchievementResponse{
			ID:          a.ID,
			Title:       a.Title,
			Description: a.Description,
			Type:        a.Type,
			IconURL:     a.IconURL,
			Earned:      false,
		}

		if ua, ok := earnedMap[a.ID]; ok {
			resp.Earned = true
			resp.EarnedAt = &ua.EarnedAt
		}

		responses = append(responses, resp)
	}

	c.JSON(http.StatusOK, gin.H{"achievements": responses})
}

package handlers

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) AdminUpdateProgram(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Title         string  `json:"title"`
		Description   string  `json:"description"`
		DurationWeeks int     `json:"duration_weeks"`
		BasePrice     float64 `json:"base_price"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"title":          input.Title,
		"description":    input.Description,
		"duration_weeks": input.DurationWeeks,
		"base_price":     input.BasePrice,
		"updated_at":     time.Now(),
	}

	if err := db.WithTenant(c).Model(&models.Program{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update program"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminDeleteProgram(c *gin.Context) {
	id := c.Param("id")
	if err := db.WithTenant(c).Where("id = ?", id).Delete(&models.Program{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete program"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminUpdateStage(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Title       string `json:"title"`
		Subtitle    string `json:"subtitle"`
		Description string `json:"description"`
		OrderIndex  int    `json:"order_index"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"title":       input.Title,
		"subtitle":    input.Subtitle,
		"description": input.Description,
		"order_index": input.OrderIndex,
	}

	if err := db.WithTenant(c).Model(&models.JourneyStage{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stage"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminDeleteStage(c *gin.Context) {
	id := c.Param("id")
	if err := db.WithTenant(c).Where("id = ?", id).Delete(&models.JourneyStage{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete stage"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminUpdateModule(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Title           string `json:"title"`
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

	updates := map[string]interface{}{
		"title":            input.Title,
		"duration_text":    input.DurationText,
		"description":      input.Description,
		"video_url":        input.VideoURL,
		"content_markdown": input.ContentMarkdown,
		"order_index":      input.OrderIndex,
	}

	if err := db.WithTenant(c).Model(&models.JourneyModule{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update module"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminDeleteModule(c *gin.Context) {
	id := c.Param("id")
	if err := db.WithTenant(c).Where("id = ?", id).Delete(&models.JourneyModule{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete module"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

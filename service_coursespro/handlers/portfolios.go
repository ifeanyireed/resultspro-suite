package handlers

import (
	"net/http"

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

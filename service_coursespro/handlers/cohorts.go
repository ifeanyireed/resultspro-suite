package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetPublicCohorts(c *gin.Context) {
	var cohorts []models.Cohort
	db.WithTenant(c).Where("status != ?", "DRAFT").Order("start_date ASC").Find(&cohorts)
	c.JSON(http.StatusOK, gin.H{"cohorts": cohorts})
}

func (h *Handler) GetCohortDetail(c *gin.Context) {
	id := c.Param("id")
	var cohort models.Cohort
	if err := db.WithTenant(c).First(&cohort, "id = ? OR slug = ?", id, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"cohort": cohort})
}

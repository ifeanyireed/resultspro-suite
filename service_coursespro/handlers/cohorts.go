package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetPublicCohorts(c *gin.Context) {
	tenantID := c.Query("tenant_id")
	if tenantID == "" {
		tenantID = c.GetHeader("X-Tenant-ID")
	}
	if tenantID == "" {
		tenantID = c.GetHeader("X-Tenant-Domain")
	}

	if tenantID == "" {
		c.JSON(http.StatusOK, gin.H{"cohorts": []models.Cohort{}})
		return
	}

	var cohorts []models.Cohort
	db.DB.Where("tenant_id = ?", tenantID).
		Select("crs_cohorts.*, (SELECT COUNT(id) FROM crs_enrollments WHERE crs_enrollments.cohort_id = crs_cohorts.id) as enrolled_count").
		Preload("Program").Preload("CohortMentors").
		Where("status != ?", "DRAFT").Order("start_date ASC").Find(&cohorts)
	c.JSON(http.StatusOK, gin.H{"cohorts": cohorts})
}

func (h *Handler) GetCohortDetail(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.Query("tenant_id")
	if tenantID == "" {
		tenantID = c.GetHeader("X-Tenant-ID")
	}
	if tenantID == "" {
		tenantID = c.GetHeader("X-Tenant-Domain")
	}

	if tenantID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort not found"})
		return
	}

	var cohort models.Cohort
	if err := db.DB.Where("tenant_id = ?", tenantID).
		Select("crs_cohorts.*, (SELECT COUNT(id) FROM crs_enrollments WHERE crs_enrollments.cohort_id = crs_cohorts.id) as enrolled_count").
		Preload("Program").Preload("CohortMentors").
		First(&cohort, "(id = ? OR slug = ?)", id, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort not found"})
		return
	}

	var settings models.TenantSettings
	upfrontDiscount := 15000.0
	enableUpfrontDiscount := true
	enableInstallments := true
	if tenantID != "" {
		if err := db.DB.Where("tenant_id = ?", tenantID).First(&settings).Error; err == nil {
			upfrontDiscount = settings.UpfrontDiscountAmount
			enableUpfrontDiscount = settings.EnableUpfrontDiscount
			enableInstallments = settings.EnableInstallments
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"cohort": cohort,
		"upfront_discount_amount": upfrontDiscount,
		"enable_upfront_discount": enableUpfrontDiscount,
		"enable_installments": enableInstallments,
	})
}

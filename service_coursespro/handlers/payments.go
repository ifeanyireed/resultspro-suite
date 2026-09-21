package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

// InternalPaymentCallback handles the internal webhook from service_users
func (h *Handler) InternalPaymentCallback(c *gin.Context) {
	secret := c.GetHeader("X-Internal-Secret")
	if secret != "super_secret_internal_key_42" && os.Getenv("NODE_ENV") != "development" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized internal access"})
		return
	}

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot read body"})
		return
	}

	var payload struct {
		UserID   string `json:"user_id"`
		CohortID string `json:"cohort_id"`
		Status   string `json:"status"` // SUCCESS or FAILED
	}

	if err := json.Unmarshal(body, &payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	if payload.CohortID != "" && payload.UserID != "" {
		if payload.Status == "SUCCESS" {
			db.DB.Model(&models.Enrollment{}).
				Where("user_id = ? AND cohort_id = ?", payload.UserID, payload.CohortID).
				Updates(map[string]interface{}{
					"payment_status":      "PAID",
					"last_payment_failed": false,
				})
		} else if payload.Status == "FAILED" {
			db.DB.Model(&models.Enrollment{}).
				Where("user_id = ? AND cohort_id = ?", payload.UserID, payload.CohortID).
				Update("last_payment_failed", true)
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

// CreatePaymentIntent handles generating a payment session
func (h *Handler) CreatePaymentIntent(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "tenant required"})
		return
	}

	userID := c.GetString("user_id")

	var req struct {
		CohortID string `json:"cohort_id" binding:"required"`
		PlanType string `json:"plan_type" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cohort models.Cohort
	if err := db.DB.First(&cohort, "id = ? AND tenant_id = ?", req.CohortID, tenantID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort not found"})
		return
	}

	// Calculate final amount
	var amount float64
	if req.PlanType == "installment" {
		amount = cohort.Price * 1.15
	} else {
		amount = cohort.Price
	}

	// In a real app, you'd call Paystack API here and get an auth_url.
	// For this mock, we'll return a success immediately and simulate a webhook.

	// Create an enrollment record as PENDING
	enrollment := models.Enrollment{
		ID:            uuid.New().String(),
		CohortID:      cohort.ID,
		UserID:        userID,
		PlanType:      req.PlanType,
		PaymentStatus: "PENDING",
	}
	db.DB.Create(&enrollment)

	c.JSON(http.StatusOK, gin.H{
		"amount":            amount,
		"authorization_url": "/api/mock/payment/callback?status=success", // We'll intercept this on the frontend
		"reference":         uuid.New().String(),
	})
}

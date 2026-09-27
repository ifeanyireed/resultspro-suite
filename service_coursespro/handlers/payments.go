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
			var cohort models.Cohort
			if err := db.DB.Where("id = ?", payload.CohortID).First(&cohort).Error; err == nil {
				var enrollment models.Enrollment
				err := db.DB.Where("user_id = ? AND cohort_id = ?", payload.UserID, payload.CohortID).First(&enrollment).Error
				if err != nil {
					// Create enrollment
					enrollment = models.Enrollment{
						ID:            uuid.New().String(),
						TenantID:      cohort.TenantID,
						CohortID:      payload.CohortID,
						UserID:        payload.UserID,
						PaymentStatus: "PAID",
						PlanType:      "STANDARD",
					}
					db.DB.Create(&enrollment)
				} else {
					// Update existing enrollment
					db.DB.Model(&enrollment).Updates(map[string]interface{}{
						"payment_status":      "PAID",
						"last_payment_failed": false,
					})
				}
			}
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

func (h *Handler) GetBillingSubscriptions(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")

	var enrollments []models.Enrollment
	db.DB.Where("tenant_id = ? AND user_id = ? AND billing_cycle != ?", tenantID, userID, "one-time").Find(&enrollments)

	var response []map[string]interface{}
	for _, e := range enrollments {
		var cohort models.Cohort
		db.DB.Where("id = ?", e.CohortID).Preload("Program").First(&cohort)
		
		planName := "Subscription"
		if cohort.Program != nil {
			planName = cohort.Program.Title
		}

		response = append(response, map[string]interface{}{
			"id": e.ID,
			"planName": planName,
			"status": "active", // simplified for now
			"amount": cohort.Price,
			"interval": e.BillingCycle,
			"nextBillingDate": e.NextBillingDate,
		})
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handler) CancelBillingSubscription(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")
	subID := c.Param("id")

	var enrollment models.Enrollment
	if err := db.DB.Where("tenant_id = ? AND user_id = ? AND id = ?", tenantID, userID, subID).First(&enrollment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Subscription not found"})
		return
	}

	enrollment.Status = "CANCELED"
	enrollment.BillingCycle = "one-time"
	db.DB.Save(&enrollment)

	c.JSON(http.StatusOK, gin.H{"message": "Subscription canceled"})
}

func (h *Handler) GetBillingHistory(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")

	var transactions []models.Transaction
	db.DB.Where("tenant_id = ? AND user_id = ?", tenantID, userID).Order("created_at DESC").Find(&transactions)

	var response []map[string]interface{}
	for _, t := range transactions {
		response = append(response, map[string]interface{}{
			"id": t.Reference,
			"description": "Payment for " + t.Gateway,
			"date": t.CreatedAt.Format("Jan 02, 2006"),
			"amount": t.Amount,
			"status": t.Status,
		})
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handler) GetPaymentMethods(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")

	var methods []models.PaymentMethod
	db.DB.Where("tenant_id = ? AND user_id = ?", tenantID, userID).Order("created_at DESC").Find(&methods)

	c.JSON(http.StatusOK, methods)
}

func (h *Handler) DeletePaymentMethod(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")
	pmID := c.Param("id")

	if err := db.DB.Where("tenant_id = ? AND user_id = ? AND id = ?", tenantID, userID, pmID).Delete(&models.PaymentMethod{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete payment method"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment method deleted"})
}

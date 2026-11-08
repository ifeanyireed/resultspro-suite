package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

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
		UserID            string `json:"user_id"`
		CohortID          string `json:"cohort_id"`
		Status            string `json:"status"` // SUCCESS or FAILED
		AuthorizationCode string `json:"authorization_code"`
		PlanType          string `json:"plan_type"`
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
					billingCycle := "once"
					var nextBillingDate time.Time
					if payload.PlanType == "monthly" {
						billingCycle = "monthly"
						nextBillingDate = time.Now().UTC().AddDate(0, 1, 0)
					}
					
					var subID *string
					if payload.AuthorizationCode != "" {
						subID = &payload.AuthorizationCode
					}
					
					enrollment = models.Enrollment{
						ID:            uuid.New().String(),
						TenantID:      cohort.TenantID,
						CohortID:      payload.CohortID,
						UserID:        payload.UserID,
						PaymentStatus: "PAID",
						PlanType:      payload.PlanType,
						EnrolledAt:    time.Now().UTC(),
						BillingCycle:  billingCycle,
						SubscriptionID: subID,
					}
					if nextBillingDate.IsZero() == false {
						enrollment.NextBillingDate = &nextBillingDate
					}
					if err := db.DB.Create(&enrollment).Error; err != nil {
						log.Printf("[Webhook Error] Failed to create enrollment for %s: %v", payload.UserID, err)
					}
				} else {
					// Update existing enrollment
					updates := map[string]interface{}{
						"payment_status":      "PAID",
						"last_payment_failed": false,
					}
					if payload.AuthorizationCode != "" {
						updates["subscription_id"] = payload.AuthorizationCode
					}
					if payload.PlanType == "monthly" {
						updates["plan_type"] = "monthly"
						updates["billing_cycle"] = "monthly"
						nextBill := time.Now().UTC().AddDate(0, 1, 0)
						updates["next_billing_date"] = &nextBill
					} else {
						updates["plan_type"] = payload.PlanType
					}
					
					db.DB.Model(&enrollment).Updates(updates)
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

	// Calculate final amount (frontend handles upfront discounts)
	amount := cohort.Price

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

	if tenantID == nil || userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var enrollments []models.Enrollment
	db.WithTenant(c).Where("user_id = ?", userID).Find(&enrollments)

	var response []map[string]interface{}
	for _, e := range enrollments {
		var cohort models.Cohort
		db.DB.Where("id = ?", e.CohortID).Preload("Program").First(&cohort)

		planName := "Curriculum Access"
		if cohort.Program != nil && cohort.Program.Title != "" {
			planName = cohort.Program.Title
		} else if cohort.Title != "" {
			planName = cohort.Title
		}

		interval := e.BillingCycle
		if interval == "" || interval == "one-time" || interval == "once" {
			interval = "Full Tuition"
		} else if interval == "monthly" {
			interval = "Monthly Installment"
		}

		status := "active"
		if e.Status == "CANCELED" {
			status = "canceled"
		} else if e.LastPaymentFailed {
			status = "past_due"
		} else if e.PaymentStatus == "PENDING" {
			status = "pending"
		}

		price := cohort.Price
		if price <= 0 && cohort.Program != nil {
			price = cohort.Program.BasePrice
		}

		currency := cohort.Currency
		if currency == "" {
			currency = "NGN"
		}

		isRecurring := e.BillingCycle == "monthly" || e.BillingCycle == "installments"

		response = append(response, map[string]interface{}{
			"id":              e.ID,
			"planName":        planName,
			"cohortTitle":     cohort.Title,
			"status":          status,
			"amount":          price,
			"currency":        currency,
			"interval":        interval,
			"is_recurring":    isRecurring,
			"nextBillingDate": e.NextBillingDate,
			"enrolledAt":      e.EnrolledAt,
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

	c.JSON(http.StatusOK, gin.H{"message": "Subscription canceled successfully"})
}

func (h *Handler) GetBillingHistory(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")

	var transactions []models.Transaction
	db.DB.Where("tenant_id = ? AND user_id = ?", tenantID, userID).Order("created_at DESC").Find(&transactions)

	var response []map[string]interface{}
	for _, t := range transactions {
		response = append(response, map[string]interface{}{
			"id":          t.Reference,
			"description": "Tuition Payment (" + strings.ToUpper(t.Gateway) + ")",
			"date":        t.CreatedAt.Format("Jan 02, 2006"),
			"amount":      t.Amount,
			"currency":    t.Currency,
			"status":      t.Status,
		})
	}

	// If no transactions recorded directly in crs_transactions, synthesize from active enrollments
	if len(response) == 0 {
		var enrollments []models.Enrollment
		db.WithTenant(c).Where("user_id = ? AND payment_status = ?", userID, "PAID").Find(&enrollments)
		for _, e := range enrollments {
			var cohort models.Cohort
			db.DB.Where("id = ?", e.CohortID).First(&cohort)
			desc := "Tuition Enrollment"
			if cohort.Title != "" {
				desc = "Tuition Enrollment - " + cohort.Title
			}
			dateStr := e.EnrolledAt.Format("Jan 02, 2006")
			if e.EnrolledAt.IsZero() {
				dateStr = time.Now().Format("Jan 02, 2006")
			}
			response = append(response, map[string]interface{}{
				"id":          "REC-" + e.ID[:8],
				"description": desc,
				"date":        dateStr,
				"amount":      cohort.Price,
				"currency":    cohort.Currency,
				"status":      "PAID",
			})
		}
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

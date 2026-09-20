package handlers

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"service_coursespro/db"
	"service_coursespro/models"
)

// GetPaymentSummary returns MRR, Active Subs, and Dunning Risk
func (h *Handler) GetPaymentSummary(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists || tenantID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Tenant not identified"})
		return
	}

	var mrr float64
	var activeSubs int64
	var dunningRisk int64

	// Get Active Subs
	db.DB.Model(&models.Enrollment{}).
		Where("tenant_id = ? AND status = ? AND payment_status = ?", tenantID, "ACTIVE", "PAID").
		Count(&activeSubs)

	// Since we don't have a strict MRR calculation yet (depends on plan amounts),
	// we'll approximate it or assume a standard fee, or calculate from past 30 days transactions
	// Better yet, just sum the amounts from successful transactions in the last 30 days
	type sqlResult struct {
		Total float64
	}
	var revenue sqlResult
	db.DB.Model(&models.Transaction{}).
		Select("COALESCE(SUM(amount), 0) as total").
		Where("tenant_id = ? AND status = ? AND created_at >= ?", tenantID, "SUCCESS", time.Now().AddDate(0, -1, 0)).
		Scan(&revenue)
	mrr = revenue.Total

	// Dunning Risk
	db.DB.Model(&models.Enrollment{}).
		Where("tenant_id = ? AND status = ? AND (last_payment_failed = ? OR next_billing_date <= ?)", tenantID, "ACTIVE", true, time.Now().AddDate(0, 0, 3)).
		Count(&dunningRisk)

	c.JSON(http.StatusOK, gin.H{
		"mrr":          mrr,
		"active_subs":  activeSubs,
		"dunning_risk": dunningRisk,
	})
}

// GetTransactions returns recent transactions
func (h *Handler) GetTransactions(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists || tenantID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Tenant not identified"})
		return
	}

	var transactions []models.Transaction
	db.DB.Where("tenant_id = ?", tenantID).
		Order("created_at desc").
		Limit(50).
		Find(&transactions)

	// In a microservice environment, you'd typically join with a users table or fetch from the users service.
	// For now, we return the raw transactions; the frontend can hydrate user details if needed,
	// or we can just send the raw array.
	c.JSON(http.StatusOK, transactions)
}

// PaystackWebhook handles incoming webhooks
func (h *Handler) PaystackWebhook(c *gin.Context) {
	secretKey := os.Getenv("PAYSTACK_SECRET_KEY")
	signature := c.GetHeader("x-paystack-signature")

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot read body"})
		return
	}

	// Verify signature
	mac := hmac.New(sha512.New, []byte(secretKey))
	mac.Write(body)
	expectedSignature := hex.EncodeToString(mac.Sum(nil))

	if signature != expectedSignature && os.Getenv("NODE_ENV") != "development" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid signature"})
		return
	}

	var payload struct {
		Event string `json:"event"`
		Data  struct {
			Reference string  `json:"reference"`
			Status    string  `json:"status"`
			Amount    float64 `json:"amount"` // in kobo
			Customer  struct {
				Email string `json:"email"`
			} `json:"customer"`
			Metadata struct {
				UserID   string `json:"user_id"`
				TenantID string `json:"tenant_id"`
				CohortID string `json:"cohort_id"`
			} `json:"metadata"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	if payload.Event == "charge.success" {
		// Divide amount by 100 to get Naira
		actualAmount := payload.Data.Amount / 100

		// Wrap in transaction
		err = db.DB.Transaction(func(tx *gorm.DB) error {
			// Update or Create Transaction
			var trans models.Transaction
			res := tx.Where("reference = ?", payload.Data.Reference).First(&trans)

			if res.Error == gorm.ErrRecordNotFound {
				trans = models.Transaction{
					ID:        uuid.New().String(),
					TenantID:  payload.Data.Metadata.TenantID,
					UserID:    payload.Data.Metadata.UserID,
					Amount:    actualAmount,
					Gateway:   "paystack",
					Reference: payload.Data.Reference,
					Status:    "SUCCESS",
				}
				if payload.Data.Metadata.CohortID != "" {
					trans.CohortID = &payload.Data.Metadata.CohortID
				}
				if err := tx.Create(&trans).Error; err != nil {
					return err
				}
			} else {
				trans.Status = "SUCCESS"
				trans.Amount = actualAmount
				if err := tx.Save(&trans).Error; err != nil {
					return err
				}
			}

			// Update Enrollment
			if payload.Data.Metadata.CohortID != "" {
				var enroll models.Enrollment
				if err := tx.Where("user_id = ? AND cohort_id = ?", payload.Data.Metadata.UserID, payload.Data.Metadata.CohortID).First(&enroll).Error; err == nil {
					enroll.PaymentStatus = "PAID"
					enroll.LastPaymentFailed = false
					tx.Save(&enroll)
				}
			}
			return nil
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else if payload.Event == "invoice.payment_failed" || payload.Event == "charge.failed" {
		// Just a basic fallback to mark as failed
		db.DB.Model(&models.Transaction{}).Where("reference = ?", payload.Data.Reference).Update("status", "FAILED")

		if payload.Data.Metadata.CohortID != "" {
			db.DB.Model(&models.Enrollment{}).
				Where("user_id = ? AND cohort_id = ?", payload.Data.Metadata.UserID, payload.Data.Metadata.CohortID).
				Update("last_payment_failed", true)
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "received"})
}

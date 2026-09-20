package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
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

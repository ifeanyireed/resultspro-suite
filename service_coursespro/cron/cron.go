package cron

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"service_coursespro/db"
	"service_coursespro/models"
)

// StartCronJobs starts all background jobs for the coursespro service
func StartCronJobs() {
	go runSubscriptionBilling()
}

func runSubscriptionBilling() {
	log.Println("[Cron] Starting subscription auto-charging loop...")
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	// Run immediately on start, then wait for ticker
	processBilling()

	for {
		<-ticker.C
		processBilling()
	}
}

func processBilling() {
	log.Println("[Cron] Checking for subscriptions due for billing...")
	now := time.Now().UTC()

	var dueEnrollments []models.Enrollment

	if err := db.DB.Where("billing_cycle = ? AND subscription_id != ? AND subscription_id != ? AND next_billing_date <= ?", "monthly", "", "null", now).Find(&dueEnrollments).Error; err != nil {
		log.Printf("[Cron Error] Failed to fetch due enrollments: %v", err)
		return
	}

	if len(dueEnrollments) == 0 {
		return
	}

	log.Printf("[Cron] Found %d enrollments due for billing", len(dueEnrollments))

	usersServiceURL := os.Getenv("USERS_SERVICE_URL")
	if usersServiceURL == "" {
		usersServiceURL = "https://resultspro-service-users.onrender.com"
	}
	if os.Getenv("NODE_ENV") == "development" {
		usersServiceURL = "http://localhost:8080" // or whatever users service is on
	}

	for _, enrollment := range dueEnrollments {
		var cohort models.Cohort
		if err := db.DB.Where("id = ?", enrollment.CohortID).First(&cohort).Error; err != nil {
			continue // defensive check
		}

		var settings models.TenantSettings
		markup := 15000.0
		if err := db.DB.Where("tenant_id = ?", enrollment.TenantID).First(&settings).Error; err == nil {
			if settings.EnableUpfrontDiscount {
				markup = settings.UpfrontDiscountAmount
			} else {
				markup = 0
			}
		}

		officialPrice := cohort.Price + markup
		divisor := 5.0
		monthlyCost := officialPrice / divisor

		// Send charge request to service_users
		payload := map[string]interface{}{
			"tenant_id":          enrollment.TenantID,
			"user_id":            enrollment.UserID,
			"module":             "coursespro",
			"module_ref":         enrollment.CohortID,
			"amount":             monthlyCost,
			"authorization_code": enrollment.SubscriptionID,
			"email":              "", // Optional: service_users will fetch user email
		}

		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", usersServiceURL+"/api/internal/payments/charge-authorization", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-Internal-Secret", "super_secret_internal_key_42")

		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(req)

		if err != nil {
			log.Printf("[Cron Error] Failed to request charge for user %s: %v", enrollment.UserID, err)
			continue
		}

		resp.Body.Close()

		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			log.Printf("[Cron] Successfully initiated charge for user %s cohort %s", enrollment.UserID, enrollment.CohortID)

			// Update next_billing_date so we don't charge them again today, even if it fails
			// The webhook will handle SUCCESS/FAILED and last_payment_failed flag
			nextBill := now.AddDate(0, 1, 0)
			db.DB.Model(&enrollment).Update("next_billing_date", &nextBill)
		} else {
			log.Printf("[Cron Error] service_users returned status %d for user %s", resp.StatusCode, enrollment.UserID)
		}
	}
}

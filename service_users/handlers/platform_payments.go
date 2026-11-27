package handlers

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// resolveTenantID resolves the tenant ID from X-Tenant-Domain header
func resolveTenantID(r *http.Request) string {
	domain := r.Header.Get("X-Tenant-Domain")
	if domain == "" {
		return ""
	}
	var tenantID string
	err := db.DB.QueryRow("SELECT id FROM tenants WHERE slug = ? OR default_subdomain = ? OR custom_domain = ?", domain, domain, domain).Scan(&tenantID)
	if err != nil {
		return ""
	}
	return tenantID
}

// PlatformPaymentSummary returns MRR, Active Subs, etc.
func HandlePlatformPaymentSummary(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveTenantID(r)
	if tenantID == "" {
		http.Error(w, `{"error":"Tenant not identified"}`, http.StatusUnauthorized)
		return
	}

	var mrr float64
	type sqlResult struct {
		Total float64
	}
	var revenue sqlResult
	if db.GormDB != nil {
		db.GormDB.Model(&models.UserTransaction{}).
			Select("COALESCE(SUM(amount), 0) as total").
			Where("tenant_id = ? AND status = ? AND created_at >= ?", tenantID, "SUCCESS", time.Now().AddDate(0, -1, 0)).
			Scan(&revenue)
	}
	mrr = revenue.Total

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"mrr":          mrr,
		"active_subs":  0,
		"dunning_risk": 0,
	})
}

// PlatformTransactions returns recent B2C transactions
func HandlePlatformTransactions(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveTenantID(r)
	if tenantID == "" {
		http.Error(w, `{"error":"Tenant not identified"}`, http.StatusUnauthorized)
		return
	}

	var transactions []models.UserTransaction
	if db.GormDB != nil {
		db.GormDB.Where("tenant_id = ?", tenantID).
			Order("created_at desc").
			Limit(50).
			Find(&transactions)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(transactions)
}

// PlatformPaystackWebhook handles incoming webhooks centrally
func HandlePlatformPaystackWebhook(w http.ResponseWriter, r *http.Request) {
	secretKey := os.Getenv("PAYSTACK_SECRET_KEY")
	signature := r.Header.Get("x-paystack-signature")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, `{"error":"Cannot read body"}`, http.StatusBadRequest)
		return
	}

	// Verify signature
	if secretKey != "" {
		mac := hmac.New(sha512.New, []byte(secretKey))
		mac.Write(body)
		expectedSignature := hex.EncodeToString(mac.Sum(nil))

		if signature != expectedSignature && os.Getenv("NODE_ENV") != "development" {
			http.Error(w, `{"error":"Invalid signature"}`, http.StatusUnauthorized)
			return
		}
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
			Authorization struct {
				AuthorizationCode string `json:"authorization_code"`
				Last4 string `json:"last4"`
				Brand string `json:"brand"`
			} `json:"authorization"`
			Metadata struct {
				UserID   string `json:"user_id"`
				TenantID string `json:"tenant_id"`
				Module   string `json:"module"`
				ModuleRef string `json:"module_ref"`
				CohortID string `json:"cohort_id"` // Fallback for old webhooks
				PlanType string `json:"plan_type"`
			} `json:"metadata"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	if db.GormDB == nil {
		http.Error(w, `{"error":"DB not initialized"}`, http.StatusInternalServerError)
		return
	}

	// Fallback to PlatformPayment if metadata is missing
	if payload.Data.Metadata.UserID == "" {
		var pp models.PlatformPayment
		if err := db.GormDB.Where("reference = ?", payload.Data.Reference).First(&pp).Error; err == nil {
			payload.Data.Metadata.UserID = pp.StudentID
			payload.Data.Metadata.TenantID = pp.TenantID
			payload.Data.Metadata.Module = "coursespro"
			payload.Data.Metadata.ModuleRef = pp.EnrollmentID
		}
	}

	module := payload.Data.Metadata.Module
	if module == "" {
		module = "coursespro"
	}
	moduleRef := payload.Data.Metadata.ModuleRef
	if moduleRef == "" {
		moduleRef = payload.Data.Metadata.CohortID
	}

	if payload.Event == "charge.success" {
		actualAmount := payload.Data.Amount / 100

		// Update PlatformPayment status if it exists
		db.GormDB.Model(&models.PlatformPayment{}).Where("reference = ?", payload.Data.Reference).Update("status", "paid")

		err = db.GormDB.Transaction(func(tx *gorm.DB) error {
			var trans models.UserTransaction
			res := tx.Where("reference = ?", payload.Data.Reference).First(&trans)

			if res.Error == gorm.ErrRecordNotFound {
				trans = models.UserTransaction{
					ID:        uuid.New().String(),
					TenantID:  payload.Data.Metadata.TenantID,
					UserID:    payload.Data.Metadata.UserID,
					Module:    module,
					ModuleRef: moduleRef,
					Amount:    actualAmount,
					Gateway:   "paystack",
					Reference: payload.Data.Reference,
					Status:    "SUCCESS",
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
			return nil
		})
		if err != nil {
			http.Error(w, `{"error":"DB Error"}`, http.StatusInternalServerError)
			return
		}

		// Send Custom Receipt Email
		go func() {
			var tenant models.Tenant
			if db.GormDB.Where("id = ?", payload.Data.Metadata.TenantID).First(&tenant).Error == nil {
				formattedAmount := fmt.Sprintf("%.2f", actualAmount)
				dateStr := time.Now().Format("2nd Jan, 2006")
				cardSuffix := payload.Data.Authorization.Last4
				if cardSuffix == "" {
					cardSuffix = "N/A"
				}
				utils.SendPaymentReceiptEmail(payload.Data.Customer.Email, payload.Data.Reference, formattedAmount, dateStr, cardSuffix, tenant.Name, tenant.ContactEmail)
			}
		}()

		// Dispatch to the specific module
		if module == "coursespro" {
			syncCoursesProEnrollment(payload.Data.Metadata.UserID, moduleRef, "SUCCESS", payload.Data.Authorization.AuthorizationCode, payload.Data.Metadata.PlanType)
			go dispatchToCoursesPro(payload.Data.Metadata.UserID, moduleRef, "SUCCESS", payload.Data.Authorization.AuthorizationCode, payload.Data.Metadata.PlanType)
		}

	} else if payload.Event == "invoice.payment_failed" || payload.Event == "charge.failed" {
		db.GormDB.Model(&models.UserTransaction{}).Where("reference = ?", payload.Data.Reference).Update("status", "FAILED")
		if module == "coursespro" {
			syncCoursesProEnrollment(payload.Data.Metadata.UserID, moduleRef, "FAILED", payload.Data.Authorization.AuthorizationCode, payload.Data.Metadata.PlanType)
			go dispatchToCoursesPro(payload.Data.Metadata.UserID, moduleRef, "FAILED", payload.Data.Authorization.AuthorizationCode, payload.Data.Metadata.PlanType)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"received"}`))
}

func syncCoursesProEnrollment(userID, cohortID, status, authCode, planType string) {
	if userID == "" || cohortID == "" || db.DB == nil {
		return
	}
	if status == "SUCCESS" {
		var tenantID string
		err := db.DB.QueryRow("SELECT tenant_id FROM crs_cohorts WHERE id = $1", cohortID).Scan(&tenantID)
		if err != nil || tenantID == "" {
			return
		}

		if planType == "" {
			planType = "upfront"
		}
		billingCycle := "once"
		var nextBilling interface{} = nil
		if strings.ToLower(planType) == "monthly" {
			billingCycle = "monthly"
			nextBilling = time.Now().UTC().AddDate(0, 1, 0)
		}
		var subID interface{} = nil
		if authCode != "" {
			subID = authCode
		}

		var existingID string
		err = db.DB.QueryRow("SELECT id FROM crs_enrollments WHERE user_id = $1 AND cohort_id = $2", userID, cohortID).Scan(&existingID)
		now := time.Now().UTC()
		if err != nil || existingID == "" {
			newID := uuid.New().String()
			_, insertErr := db.DB.Exec(`
				INSERT INTO crs_enrollments (id, tenant_id, cohort_id, user_id, plan_type, payment_status, subscription_id, billing_cycle, next_billing_date, last_payment_failed, current_stage_number, current_xp, streak_days, status, enrolled_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, 'PAID', $6, $7, $8, false, 1, 0, 0, 'ACTIVE', $9, $9)
			`, newID, tenantID, cohortID, userID, planType, subID, billingCycle, nextBilling, now)
			if insertErr != nil {
				log.Printf("[syncCoursesProEnrollment] Failed to insert enrollment for user=%s cohort=%s: %v", userID, cohortID, insertErr)
			}
		} else {
			_, _ = db.DB.Exec(`
				UPDATE crs_enrollments
				SET payment_status = 'PAID', last_payment_failed = false, status = 'ACTIVE', updated_at = $1
				WHERE id = $2
			`, now, existingID)
		}
	} else if status == "FAILED" {
		_, _ = db.DB.Exec("UPDATE crs_enrollments SET last_payment_failed = true, updated_at = $1 WHERE user_id = $2 AND cohort_id = $3", time.Now().UTC(), userID, cohortID)
	}
}

func dispatchToCoursesPro(userID, cohortID, status, authCode, planType string) error {
	coursesURL := strings.TrimRight(os.Getenv("COURSES_SERVICE_URL"), "/")
	if coursesURL == "" {
		log.Printf("⚠️ COURSES_SERVICE_URL not configured. Skipping dispatchToCoursesPro for user %s", userID)
		return nil
	}

	payload, _ := json.Marshal(map[string]string{
		"user_id":            userID,
		"cohort_id":          cohortID,
		"status":             status,
		"authorization_code": authCode,
		"plan_type":          planType,
	})

	client := &http.Client{Timeout: 35 * time.Second}

	var lastErr error
	for attempt := 1; attempt <= 3; attempt++ {
		req, err := http.NewRequest("POST", coursesURL+"/api/internal/enrollments/payment-callback", bytes.NewBuffer(payload))
		if err != nil {
			return err
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-Internal-Secret", "super_secret_internal_key_42")

		resp, err := client.Do(req)
		if err != nil {
			lastErr = err
			log.Printf("[Webhook Attempt %d Error] Failed to dispatch to courses service (%s): %v", attempt, coursesURL, err)
			time.Sleep(1 * time.Second)
			continue
		}

		if resp.StatusCode >= 400 {
			bodyBytes, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			lastErr = fmt.Errorf("status %d: %s", resp.StatusCode, string(bodyBytes))
			log.Printf("[Webhook Attempt %d Error] Courses service returned status %d: %s", attempt, resp.StatusCode, string(bodyBytes))
			time.Sleep(1 * time.Second)
			continue
		}
		resp.Body.Close()

		log.Printf("[Webhook Success] Dispatched payment success to courses service for User %s, Cohort %s", userID, cohortID)
		return nil
	}

	return lastErr
}

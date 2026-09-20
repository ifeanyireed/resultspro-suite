package handlers

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
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
			Metadata struct {
				UserID   string `json:"user_id"`
				TenantID string `json:"tenant_id"`
				Module   string `json:"module"`
				ModuleRef string `json:"module_ref"`
				CohortID string `json:"cohort_id"` // Fallback for old webhooks
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

		// Dispatch to the specific module
		if module == "coursespro" {
			go dispatchToCoursesPro(payload.Data.Metadata.UserID, moduleRef, "SUCCESS")
		}

	} else if payload.Event == "invoice.payment_failed" || payload.Event == "charge.failed" {
		db.GormDB.Model(&models.UserTransaction{}).Where("reference = ?", payload.Data.Reference).Update("status", "FAILED")
		if module == "coursespro" {
			go dispatchToCoursesPro(payload.Data.Metadata.UserID, moduleRef, "FAILED")
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"received"}`))
}

func dispatchToCoursesPro(userID, cohortID, status string) {
	coursesURL := os.Getenv("COURSES_SERVICE_URL")
	if coursesURL == "" {
		coursesURL = "https://resultspro-service-coursespro.onrender.com"
	}
	if os.Getenv("NODE_ENV") == "development" {
		coursesURL = "http://localhost:8081"
	}

	payload, _ := json.Marshal(map[string]string{
		"user_id":   userID,
		"cohort_id": cohortID,
		"status":    status,
	})

	req, _ := http.NewRequest("POST", coursesURL+"/api/internal/enrollments/payment-callback", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Secret", "super_secret_internal_key_42")

	client := &http.Client{Timeout: 10 * time.Second}
	client.Do(req)
}

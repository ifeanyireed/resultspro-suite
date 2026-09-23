package handlers

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// HandlePaystackWebhook processes incoming webhooks from Paystack
func HandlePaystackWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	signature := r.Header.Get("x-paystack-signature")
	if signature == "" {
		http.Error(w, "Missing signature", http.StatusBadRequest)
		return
	}

	var payload struct {
		Event string `json:"event"`
		Data  struct {
			Reference string `json:"reference"`
			Status    string `json:"status"`
			Amount    int    `json:"amount"` // in kobo
		} `json:"data"`
	}

	if err := json.Unmarshal(bodyBytes, &payload); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	ref := payload.Data.Reference
	if ref == "" {
		// Ignore events without a reference
		w.WriteHeader(http.StatusOK)
		return
	}

	// 1. Determine which Tenant this belongs to by looking up the payment reference
	var secretKey string
	var payment models.PlatformPayment
	var payout models.InstructorPayoutRequest
	
	// Assume platform secret by default
	platformSecret := os.Getenv("PAYSTACK_SECRET_KEY")
	secretKey = platformSecret

	isPayment := false
	isPayout := false

	if err := db.GormDB.Where("reference = ?", ref).First(&payment).Error; err == nil {
		isPayment = true
		var tenant models.Tenant
		if err := db.GormDB.Where("id = ?", payment.TenantID).First(&tenant).Error; err == nil {
			if tenant.PaymentMode == "byo_paystack" && tenant.PaystackSecretKey != "" {
				secretKey = tenant.PaystackSecretKey
			}
		}
	} else if err := db.GormDB.Where("payment_reference = ?", ref).First(&payout).Error; err == nil {
		isPayout = true
		var tenant models.Tenant
		if err := db.GormDB.Where("id = ?", payout.TenantID).First(&tenant).Error; err == nil {
			if tenant.PaymentMode == "byo_paystack" && tenant.PaystackSecretKey != "" {
				secretKey = tenant.PaystackSecretKey
			}
		}
	}

	// 2. Verify Signature
	mac := hmac.New(sha512.New, []byte(secretKey))
	mac.Write(bodyBytes)
	expectedMAC := hex.EncodeToString(mac.Sum(nil))

	if expectedMAC != signature {
		// If it failed and we assumed BYO, try platform key just in case (e.g. they switched modes but a webhook from an old tx arrived)
		if secretKey != platformSecret {
			mac = hmac.New(sha512.New, []byte(platformSecret))
			mac.Write(bodyBytes)
			expectedMAC = hex.EncodeToString(mac.Sum(nil))
			if expectedMAC != signature {
				http.Error(w, "Invalid signature", http.StatusUnauthorized)
				return
			}
		} else {
			http.Error(w, "Invalid signature", http.StatusUnauthorized)
			return
		}
	}

	// 3. Process the Event
	switch payload.Event {
	case "charge.success":
		if isPayment {
			if payment.Status != "paid" {
				payment.Status = "paid"
				if err := db.GormDB.Save(&payment).Error; err != nil {
					log.Printf("Failed to update payment status: %v", err)
				} else {
					log.Printf("Payment %s successfully marked as paid.", ref)
					// Here you could also trigger enrollment logic for the user/cohort
					// e.g. GrantAccessToCohort(payment.StudentID, payment.EnrollmentID)
				}
			}
		}

	case "transfer.success":
		if isPayout {
			if payout.Status != "paid" {
				payout.Status = "paid"
				db.GormDB.Save(&payout)
				log.Printf("Payout %s successfully marked as paid.", ref)
			}
		}

	case "transfer.failed", "transfer.reversed":
		if isPayout {
			payout.Status = "failed"
			db.GormDB.Save(&payout)
			log.Printf("Payout %s failed.", ref)
		}
	}

	// Paystack expects a 200 OK to acknowledge receipt
	utils.JSONResponse(w, http.StatusOK, map[string]string{"status": "success"})
}

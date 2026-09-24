package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"time"
	"net/http"
	"os"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/services"
	"service_users.resultspro.ng/utils"
)

type InitPaymentRequest struct {
	Amount        float64 `json:"amount"` // in main currency (e.g., Naira)
	Purpose       string  `json:"purpose"` // e.g. "cohort_enrollment", "subscription"
	ReferenceID   string  `json:"reference_id"` // e.g. cohort_id or plan_id
	CallbackURL   string  `json:"callback_url"`
}

// HandleTenantPaymentInitialize initializes a payment transaction using the tenant's payment configuration
func HandleTenantPaymentInitialize(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || len(authHeader) < 8 {
		utils.JSONError(w, http.StatusUnauthorized, "Missing Authorization header")
		return
	}
	tokenString := authHeader[7:]
	token, err := utils.VerifyToken(tokenString)
	if err != nil || !token.Valid {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid token")
		return
	}
	
	claims, _ := token.Claims.(jwt.MapClaims)
	userID, _ := claims["sub"].(string)
	
	var user models.User
	if err := db.GormDB.Where("id = ?", userID).First(&user).Error; err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "User not found")
		return
	}

	tenantSlug := r.Header.Get("X-Tenant-Domain")
	if tenantSlug == "" {
		utils.JSONError(w, http.StatusBadRequest, "X-Tenant-Domain header required")
		return
	}

	var req InitPaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// 1. Fetch Tenant
	var tenant models.Tenant
	if err := db.GormDB.Where("slug = ?", tenantSlug).First(&tenant).Error; err != nil {
		utils.JSONError(w, http.StatusNotFound, "Tenant not found")
		return
	}

	// 2. Select Secret Key & Prepare Subaccount
	var secretKey string
	var subaccountCode string

	if tenant.PaymentMode == "byo_paystack" {
		if tenant.PaystackSecretKey == "" {
			utils.JSONError(w, http.StatusBadRequest, "Tenant payment gateway not fully configured.")
			return
		}
		secretKey = tenant.PaystackSecretKey
		// In BYO, we don't pass subaccount because it settles directly into their master account
	} else {
		// Managed mode
		secretKey = os.Getenv("PAYSTACK_SECRET_KEY")
		if secretKey == "" {
			utils.JSONError(w, http.StatusInternalServerError, "Platform payment gateway not configured.")
			return
		}
		if tenant.PaystackSubaccountCode == "" {
			utils.JSONError(w, http.StatusBadRequest, "Tenant payment subaccount not provisioned. Contact support.")
			return
		}
		subaccountCode = tenant.PaystackSubaccountCode
	}

	// 3. Initialize Paystack Client
	paystack := services.NewPaystackClient(secretKey)

	// Amount is usually required in kobo for Paystack
	amountInKobo := int(req.Amount * 100)
	paymentRef := fmt.Sprintf("txn_%d", time.Now().UnixNano())

	// 4. Initialize Transaction
	authURL, accessCode, transactionRef, err := paystack.InitializeTransaction(
		amountInKobo,
		user.Email,
		paymentRef,
		subaccountCode,
		req.CallbackURL,
	)
	if err != nil {
		log.Printf("Paystack initialization failed: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to initialize payment gateway")
		return
	}

	// 5. Create Payment Record (Pending)
	payment := models.PlatformPayment{
		ID:            paymentRef,
		TenantID:      tenant.ID,
		StudentID:     user.ID,
		EnrollmentID:  req.ReferenceID,
		Amount:        req.Amount,
		Status:        "pending",
		Reference:     transactionRef, // usually same as paymentRef unless returned differently by paystack
		PaymentMethod: "paystack",
	}

	if tenant.PaymentMode == "managed" {
		// Example simplistic fee calc:
		platformFee := req.Amount * (tenant.PlatformFeePercent / 100)
		payment.PlatformFee = platformFee
		payment.TenantAmount = req.Amount - platformFee
	} else {
		payment.PlatformFee = 0
		payment.TenantAmount = req.Amount
	}

	if err := db.GormDB.Create(&payment).Error; err != nil {
		log.Printf("Failed to create payment record: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create payment record")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"authorization_url": authURL,
		"access_code":       accessCode,
		"reference":         transactionRef,
	})
}

// HandleTenantPaymentVerify verifies the callback from Paystack
func HandleTenantPaymentVerify(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	tenantSlug := r.Header.Get("X-Tenant-Domain")
	if tenantSlug == "" {
		utils.JSONError(w, http.StatusBadRequest, "X-Tenant-Domain header required")
		return
	}

	var req struct {
		Reference string `json:"reference"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request")
		return
	}

	var tenant models.Tenant
	if err := db.GormDB.Where("slug = ?", tenantSlug).First(&tenant).Error; err != nil {
		utils.JSONError(w, http.StatusNotFound, "Tenant not found")
		return
	}

	var secretKey string
	if tenant.PaymentMode == "byo_paystack" {
		secretKey = tenant.PaystackSecretKey
	} else {
		secretKey = os.Getenv("PAYSTACK_SECRET_KEY")
	}

	paystack := services.NewPaystackClient(secretKey)
	verifyData, err := paystack.VerifyTransaction(req.Reference)
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Verification failed: "+err.Error())
		return
	}

	status, _ := verifyData["status"].(string)
	
	// Mark our local record
	var payment models.PlatformPayment
	if err := db.GormDB.Where("reference = ?", req.Reference).First(&payment).Error; err == nil {
		if status == "success" {
			payment.Status = "paid"
			// Dispatch to courses service to finalize enrollment
			go dispatchToCoursesPro(payment.StudentID, payment.EnrollmentID, "SUCCESS")
		} else {
			payment.Status = "failed"
		}
		db.GormDB.Save(&payment)
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"status": status,
		"data":   verifyData,
	})
}

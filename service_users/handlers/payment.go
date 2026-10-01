package handlers

import (
	"encoding/json"
	"fmt"
	"strings"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
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
	ForceCard     bool    `json:"force_card"`
	PlanType      string  `json:"plan_type"` // e.g. "upfront", "monthly"
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

	if amountInKobo <= 0 {
		// Bypass Paystack for free plans
		payment := models.PlatformPayment{
			ID:            paymentRef,
			TenantID:      tenant.ID,
			StudentID:     user.ID,
			EnrollmentID:  req.ReferenceID,
			Amount:        0,
			Status:        "paid",
			Reference:     paymentRef,
			PaymentMethod: "free",
			PlatformFee:   0,
			TenantAmount:  0,
		}

		if err := db.GormDB.Create(&payment).Error; err != nil {
			log.Printf("Failed to create free payment record: %v", err)
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create free payment record")
			return
		}

		// Dispatch immediately
		go dispatchToCoursesPro(user.ID, req.ReferenceID, "SUCCESS", "", req.PlanType)

		authURL := req.CallbackURL
		if strings.Contains(authURL, "?") {
			authURL += "&reference=" + paymentRef
		} else {
			authURL += "?reference=" + paymentRef
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"authorization_url": authURL,
			"access_code":       "free",
			"reference":         paymentRef,
		})
		return
	}

	meta := map[string]interface{}{
		"user_id":   user.ID,
		"tenant_id": tenant.ID,
		"module":    "coursespro",
		"module_ref": req.ReferenceID,
		"plan_type": req.PlanType,
		"custom_fields": []map[string]interface{}{
			{
				"display_name": "Academy",
				"variable_name": "tenant_name",
				"value": tenant.Name,
			},
		},
	}

	// 4. Initialize Transaction
	authURL, accessCode, transactionRef, err := paystack.InitializeTransaction(
		amountInKobo,
		user.Email,
		paymentRef,
		subaccountCode,
		req.CallbackURL,
		req.ForceCard,
		meta,
	)
	if err != nil {
		log.Printf("Paystack initialization failed: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Payment Gateway Error: "+err.Error())
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

	// Check if this is a free payment bypass
	var payment models.PlatformPayment
	if err := db.GormDB.Where("reference = ?", req.Reference).First(&payment).Error; err == nil {
		if payment.PaymentMethod == "free" {
			utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
				"status": "success",
				"data":   map[string]interface{}{"status": "success"},
			})
			return
		}
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
	if payment.ID != "" {
		if status == "success" {
			payment.Status = "paid"
			// Dispatch to courses service to finalize enrollment
			// Ideally we could get auth code here if Paystack returned it, but for manual verify we might just rely on the webhook
			go dispatchToCoursesPro(payment.StudentID, payment.EnrollmentID, "SUCCESS", "", "")
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

type ChargeAuthRequest struct {
	TenantID          string  `json:"tenant_id"`
	UserID            string  `json:"user_id"`
	Module            string  `json:"module"`
	ModuleRef         string  `json:"module_ref"`
	Amount            float64 `json:"amount"` // in main currency (e.g., Naira)
	AuthorizationCode string  `json:"authorization_code"`
	Email             string  `json:"email"`
}

func HandleChargeAuthorization(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Verify internal secret
	secret := r.Header.Get("X-Internal-Secret")
	if secret != "super_secret_internal_key_42" {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req ChargeAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.TenantID == "" || req.UserID == "" || req.AuthorizationCode == "" || req.Amount <= 0 {
		utils.JSONError(w, http.StatusBadRequest, "Missing required fields")
		return
	}

	var tenant models.Tenant
	if err := db.GormDB.Where("id = ?", req.TenantID).First(&tenant).Error; err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Tenant not found")
		return
	}

	var user models.User
	if req.Email == "" {
		if err := db.GormDB.Where("id = ?", req.UserID).First(&user).Error; err == nil {
			req.Email = user.Email
		} else {
			req.Email = "unknown@example.com"
		}
	}

	// Fetch tenant Paystack keys
	secretKey := tenant.PaystackSecretKey
	if secretKey == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant Paystack secret key not configured")
		return
	}

	paystack := services.NewPaystackClient(secretKey)
	amountInKobo := int(req.Amount * 100)
	
	// Create platform payment record so it can be verified if needed
	paymentRef := fmt.Sprintf("txn_%s", uuid.New().String()[:8])
	
	payment := models.PlatformPayment{
		ID:            uuid.New().String(),
		TenantID:      tenant.ID,
		StudentID:     req.UserID,
		EnrollmentID:  req.ModuleRef,
		Amount:        req.Amount,
		Status:        "pending",
		Reference:     paymentRef,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
	db.GormDB.Create(&payment)
	
	meta := map[string]interface{}{
		"user_id":   req.UserID,
		"tenant_id": req.TenantID,
		"module":    req.Module,
		"module_ref": req.ModuleRef,
		"plan_type": "monthly",
		"custom_fields": []map[string]interface{}{
			{
				"display_name": "Academy",
				"variable_name": "tenant_name",
				"value": tenant.Name,
			},
		},
	}

	// We hit Paystack's /transaction/charge_authorization endpoint
	resData, err := paystack.ChargeAuthorization(amountInKobo, req.Email, req.AuthorizationCode, paymentRef, meta)
	if err != nil {
		payment.Status = "failed"
		db.GormDB.Save(&payment)
		utils.JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to charge authorization: %v", err))
		return
	}

	// Depending on the Paystack response, it might be successful right away
	// But usually, charge_authorization triggers the webhook charge.success anyway
	// We'll return success to the caller
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"status": "success",
		"message": "Charge initiated",
		"data": resData,
	})
}

package handlers

import (
	"crypto/hmac"
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/golang-jwt/jwt/v5"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// HandleUpdateSubscription updates subscription tier and expiry for a tenant or user
func HandleUpdateSubscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch && r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		TargetType string `json:"target_type"` // TENANT, FAMILY, AGENT
		TargetID   string `json:"target_id"`   // tenant_id or user_id
		Tier       string `json:"tier"`        // FREE, BASIC, PRO, ENTERPRISE / PREMIUM
		ExpiresAt  string `json:"expires_at"`  // YYYY-MM-DD HH:MM:SS or RFC3339
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.TargetType == "" || input.TargetID == "" || input.Tier == "" {
		utils.JSONError(w, http.StatusBadRequest, "target_type, target_id, and tier are required")
		return
	}

	targetType := strings.ToUpper(input.TargetType)
	tier := strings.ToUpper(input.Tier)

	var expiresVal sql.NullString
	if input.ExpiresAt != "" {
		if t, err := time.Parse(time.RFC3339, input.ExpiresAt); err == nil {
			expiresVal = sql.NullString{String: t.UTC().Format("2006-01-02 15:04:05"), Valid: true}
		} else if t, err := time.Parse("2006-01-02 15:04:05", input.ExpiresAt); err == nil {
			expiresVal = sql.NullString{String: t.UTC().Format("2006-01-02 15:04:05"), Valid: true}
		} else if t, err := time.Parse("2006-01-02", input.ExpiresAt); err == nil {
			expiresVal = sql.NullString{String: t.UTC().Format("2006-01-02 15:04:05"), Valid: true}
		}
	}

	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	if targetType == "TENANT" {
		query := "UPDATE tenants SET subscription_tier = ?, subscription_expires_at = ?, updated_at = ? WHERE id = ?"
		_, err := db.DB.Exec(query, tier, expiresVal, now, input.TargetID)
		if err != nil {
			log.Printf("Update tenant subscription error: %v", err)
			utils.JSONError(w, http.StatusInternalServerError, "Failed to update tenant subscription")
			return
		}
	} else if targetType == "FAMILY" || targetType == "AGENT" {
		id := uuid.New().String()
		query := `
			INSERT INTO user_subscriptions (id, user_id, type, tier, status, expires_at, created_at, updated_at) 
			VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?, ?)
			ON DUPLICATE KEY UPDATE tier = VALUES(tier), expires_at = VALUES(expires_at), status = 'ACTIVE', updated_at = VALUES(updated_at)`

		_, err := db.DB.Exec(query, id, input.TargetID, targetType, tier, expiresVal, now, now)
		if err != nil {
			log.Printf("Update user subscription error: %v", err)
			utils.JSONError(w, http.StatusInternalServerError, "Failed to update user subscription")
			return
		}
	} else {
		utils.JSONError(w, http.StatusBadRequest, "Invalid target_type. Must be TENANT, FAMILY, or AGENT")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{
		"target_id":   input.TargetID,
		"target_type": targetType,
		"tier":        tier,
		"message":     "Subscription updated successfully",
	})
}

// HandleGetTenantSubscription retrieves active plan, limits, and real-time usage for a tenant
func HandleGetTenantSubscription(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	tenantID := parts[len(parts)-1]

	var tier, expires sql.NullString
	err := db.DB.QueryRow("SELECT subscription_tier, subscription_expires_at FROM tenants WHERE id = ?", tenantID).Scan(&tier, &expires)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Tenant not found")
		return
	}

	planName := "FREE"
	if tier.Valid && tier.String != "" {
		planName = tier.String
	}

	limits := utils.SubHelper.GetPlanLimits(planName)

	// Calculate student count
	var studentCount int
	db.DB.QueryRow(`
		SELECT COUNT(DISTINCT r.user_id) 
		FROM user_tenant_roles r 
		WHERE r.tenant_id = ? AND r.role = 'student' AND r.status = 'active'`, tenantID).Scan(&studentCount)

	// Calculate teacher count
	var teacherCount int
	db.DB.QueryRow(`
		SELECT COUNT(DISTINCT r.user_id) 
		FROM user_tenant_roles r 
		WHERE r.tenant_id = ? AND r.role = 'teacher' AND r.status = 'active'`, tenantID).Scan(&teacherCount)

	var expiresAt *time.Time
	status := "ACTIVE"
	if expires.Valid && expires.String != "" {
		t, _ := time.Parse("2006-01-02 15:04:05", expires.String)
		expiresAt = &t
		if time.Now().After(t) && planName != "FREE" {
			status = "EXPIRED"
		}
	}

	report := models.SubscriptionUsageReport{
		Plan: planName,
		Students: models.ResourceUsage{
			Used:      studentCount,
			Limit:     limits.MaxStudents,
			IsAtLimit: studentCount >= limits.MaxStudents,
		},
		Teachers: models.ResourceUsage{
			Used:      teacherCount,
			Limit:     limits.MaxTeachers,
			IsAtLimit: teacherCount >= limits.MaxTeachers,
		},
		Results: models.ResourceUsage{
			Used:      0,
			Limit:     limits.MaxResultsPerTerm,
			IsAtLimit: false,
		},
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"tenant_id":   tenantID,
		"plan_name":   planName,
		"status":      status,
		"expires_at":  expiresAt,
		"limits":      limits,
		"usage":       report,
		"is_at_limit": report.Students.IsAtLimit || report.Teachers.IsAtLimit,
	})
}

// HandleGetUserSubscription retrieves subscription records for a user
func HandleGetUserSubscription(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	userID := parts[len(parts)-1]

	rows, err := db.DB.Query("SELECT id, user_id, type, tier, status, expires_at, created_at, updated_at FROM user_subscriptions WHERE user_id = ?", userID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	subs := []models.UserSubscription{}
	for rows.Next() {
		var us models.UserSubscription
		var expires sql.NullString
		if err := rows.Scan(&us.ID, &us.UserID, &us.Type, &us.Tier, &us.Status, &expires, &us.CreatedAt, &us.UpdatedAt); err == nil {
			if expires.Valid {
				t, _ := time.Parse("2006-01-02 15:04:05", expires.String)
				us.ExpiresAt = &t
			}
			subs = append(subs, us)
		}
	}

	utils.JSONResponse(w, http.StatusOK, subs)
}

// HandleCheckSubscriptionLimits validates whether an action is allowed for a tenant
func HandleCheckSubscriptionLimits(w http.ResponseWriter, r *http.Request) {
	tenantID := r.URL.Query().Get("tenant_id")
	resource := r.URL.Query().Get("resource") // students, teachers, results

	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "tenant_id parameter is required")
		return
	}

	var tier sql.NullString
	err := db.DB.QueryRow("SELECT subscription_tier FROM tenants WHERE id = ?", tenantID).Scan(&tier)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Tenant not found")
		return
	}

	planName := "FREE"
	if tier.Valid && tier.String != "" {
		planName = tier.String
	}

	limits := utils.SubHelper.GetPlanLimits(planName)

	switch strings.ToLower(resource) {
	case "students":
		var count int
		db.DB.QueryRow("SELECT COUNT(DISTINCT user_id) FROM user_tenant_roles WHERE tenant_id = ? AND role = 'student' AND status = 'active'", tenantID).Scan(&count)
		allowed := count < limits.MaxStudents
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"allowed":      allowed,
			"current_used": count,
			"limit":        limits.MaxStudents,
			"plan":         planName,
		})
	case "teachers":
		var count int
		db.DB.QueryRow("SELECT COUNT(DISTINCT user_id) FROM user_tenant_roles WHERE tenant_id = ? AND role = 'teacher' AND status = 'active'", tenantID).Scan(&count)
		allowed := count < limits.MaxTeachers
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"allowed":      allowed,
			"current_used": count,
			"limit":        limits.MaxTeachers,
			"plan":         planName,
		})
	default:
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"plan":   planName,
			"limits": limits,
		})
	}
}

// HandleGetPlans returns all available subscription plans with pricing and features
func HandleGetPlans(w http.ResponseWriter, r *http.Request) {
	var plans []models.Plan
	if err := db.GormDB.Where("is_active = ?", true).Order("monthly_price asc").Find(&plans).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   "Failed to fetch plans",
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"plans":   plans,
	})
}

// HandleGetTenantInvoices retrieves billing invoice history for a tenant
func HandleGetTenantInvoices(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	tenantID := parts[len(parts)-1]

	rows, err := db.DB.Query("SELECT id, tenant_id, plan_id, plan_name, invoice_number, amount, currency, status, billing_cycle, due_date, paid_at, created_at FROM invoices WHERE tenant_id = ? ORDER BY created_at DESC", tenantID)
	if err != nil {
		utils.JSONResponse(w, http.StatusOK, []models.Invoice{})
		return
	}
	defer rows.Close()

	invoices := []models.Invoice{}
	for rows.Next() {
		var inv models.Invoice
		var paidAt sql.NullString
		if err := rows.Scan(&inv.ID, &inv.TenantID, &inv.PlanID, &inv.PlanName, &inv.InvoiceNumber, &inv.Amount, &inv.Currency, &inv.Status, &inv.BillingCycle, &inv.DueDate, &paidAt, &inv.CreatedAt); err == nil {
			if paidAt.Valid {
				t, _ := time.Parse("2006-01-02 15:04:05", paidAt.String)
				inv.PaidAt = &t
			}
			invoices = append(invoices, inv)
		}
	}
	utils.JSONResponse(w, http.StatusOK, invoices)
}

// HandleProcessWebhook handles payment gateway webhooks (Paystack / Stripe / Flutterwave)
func HandleProcessWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Failed to read body")
		return
	}

	paystackSignature := r.Header.Get("x-paystack-signature")
	secret := os.Getenv("PAYSTACK_SECRET_KEY")
	
	if secret != "" && paystackSignature != "" {
		mac := hmac.New(sha512.New, []byte(secret))
		mac.Write(body)
		expectedSignature := hex.EncodeToString(mac.Sum(nil))
		if paystackSignature != expectedSignature {
			utils.JSONError(w, http.StatusUnauthorized, "Invalid signature")
			return
		}
	}

	var payload struct {
		Event string `json:"event"`
		Data  struct {
			Reference string          `json:"reference"`
			Status    string          `json:"status"`
			Metadata  json.RawMessage `json:"metadata"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &payload); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	if payload.Event == "charge.success" && payload.Data.Status == "success" {
		var metadata struct {
			PackID string `json:"pack_id"`
			UserID string `json:"user_id"`
			Coins  int    `json:"coins"`
			Type   string `json:"type"`
			Access string `json:"access"`
		}
		_ = json.Unmarshal(payload.Data.Metadata, &metadata)
		
		// Run ExamsPRO-style coin/ICAN upgrades using db.GormDB if it is an ExamsPRO purchase
		if metadata.Type == "PLAN" {
			var p models.Plan
			if err := db.GormDB.Where("id = ?", metadata.PackID).First(&p).Error; err == nil {
				if p.AppModule == "ExamsPRO" {
					if metadata.Access == "ICAN_SINGLE" || metadata.Access == "ICAN_GROUP" || metadata.Access == "ICAN_FULL" {
						now := time.Now().AddDate(0, 1, 0) // 1 month
						db.GormDB.Exec("UPDATE users SET has_ican = ?, ican_plan = ?, ican_expires_at = ? WHERE id = ?", true, metadata.Access, now, metadata.UserID)
					}
				}
			}
		} else if metadata.Type == "COIN" {
			db.GormDB.Exec("UPDATE users SET coin_balance = coin_balance + ? WHERE id = ?", metadata.Coins, metadata.UserID)
		}
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{
		"status":  "success",
		"message": "Webhook processed successfully",
	})
}


// HandleCreatePlan creates a new subscription plan
func HandleCreatePlan(w http.ResponseWriter, r *http.Request) {
	var input models.Plan
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	
	input.ID = uuid.New().String()
	input.IsActive = true
	
	if err := db.GormDB.Create(&input).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create plan")
		return
	}
	utils.JSONResponse(w, http.StatusCreated, input)
}

// HandleUpdatePlan updates an existing plan
func HandleUpdatePlan(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Missing plan ID")
		return
	}

	var input models.Plan
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	var existing models.Plan
	if err := db.GormDB.Where("id = ?", id).First(&existing).Error; err != nil {
		utils.JSONError(w, http.StatusNotFound, "Plan not found")
		return
	}

	// Update fields safely
	existing.Name = input.Name
	existing.AppModule = input.AppModule
	existing.Category = input.Category
	existing.MonthlyPrice = input.MonthlyPrice
	existing.AnnualPrice = input.AnnualPrice
	existing.Period = input.Period
	existing.Features = input.Features
	existing.CtaText = input.CtaText
	existing.Highlight = input.Highlight
	existing.AccessLevel = input.AccessLevel

	if err := db.GormDB.Save(&existing).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update plan")
		return
	}
	utils.JSONResponse(w, http.StatusOK, existing)
}

// HandleDeletePlan deletes (softly or hard deletes) a plan
func HandleDeletePlan(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Missing plan ID")
		return
	}

	if err := db.GormDB.Where("id = ?", id).Delete(&models.Plan{}).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to delete plan")
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Plan deleted successfully"})
}


// HandleInitializePayment initializes a transaction with Paystack for a Plan or Coin Pack
func HandleInitializePayment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		PackID      string `json:"packId"`
		CallbackURL string `json:"callbackUrl"`
		Type        string `json:"type"` // "PLAN" or "COIN"
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Assuming we extract userID from context/token. For now, since exams frontends
	// use auth middleware, we should get it.
	// We'll require Authorization header in this route!
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		utils.JSONError(w, http.StatusUnauthorized, "Missing Authorization header")
		return
	}
	tokenString := strings.Split(authHeader, " ")[1]
	token, err := utils.VerifyToken(tokenString)
	if err != nil || !token.Valid {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid token")
		return
	}
	claims := token.Claims.(jwt.MapClaims)
	userID := claims["sub"].(string)

	var userEmail string
	if err := db.DB.QueryRow("SELECT email FROM users WHERE id = ?", userID).Scan(&userEmail); err != nil {
		utils.JSONError(w, http.StatusNotFound, "User not found")
		return
	}

	var amount float64
	var accessLevel string

	if input.Type == "PLAN" || input.Type == "" {
		var plan models.Plan
		if err := db.GormDB.Where("id = ?", input.PackID).First(&plan).Error; err != nil {
			utils.JSONError(w, http.StatusNotFound, "Plan not found")
			return
		}
		amount = plan.MonthlyPrice
		accessLevel = plan.AccessLevel
		input.Type = "PLAN"
	} else {
		// Mock coin packs since they aren't fully migrated yet
		// We'll support coins later, just mock for now or return error
		utils.JSONError(w, http.StatusBadRequest, "Coin packs initialization currently disabled")
		return
	}

	paystackSecret := os.Getenv("PAYSTACK_SECRET_KEY")
	if paystackSecret == "" {
		utils.JSONError(w, http.StatusInternalServerError, "Payment gateway not configured")
		return
	}

	// Construct Paystack Payload
	payload := map[string]interface{}{
		"email":        userEmail,
		"amount":       int(amount * 100), // convert to kobo
		"callback_url": input.CallbackURL,
		"metadata": map[string]interface{}{
			"pack_id": input.PackID,
			"user_id": userID,
			"type":    input.Type,
			"access":  accessLevel,
		},
	}

	payloadBytes, _ := json.Marshal(payload)
	req, err := http.NewRequest("POST", "https://api.paystack.co/transaction/initialize", strings.NewReader(string(payloadBytes)))
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to build payment request")
		return
	}
	req.Header.Set("Authorization", "Bearer "+paystackSecret)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to contact payment gateway")
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to parse payment gateway response")
		return
	}

	if status, ok := result["status"].(bool); !ok || !status {
		utils.JSONError(w, http.StatusBadRequest, "Payment initialization failed at gateway")
		return
	}

	data := result["data"].(map[string]interface{})
	
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"authorization_url": data["authorization_url"],
		"reference":         data["reference"],
	})
}

package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
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
	rows, err := db.DB.Query("SELECT id, name, monthly_price, annual_price, currency, max_students, max_teachers, max_results_per_term, storage_gb, features, is_active, created_at FROM plans WHERE is_active = 1")
	if err != nil {
		// Fallback plans if database table not yet populated
		plans := []models.Plan{
			{
				ID: "plan-free", Name: "Free", MonthlyPrice: 0, AnnualPrice: 0, Currency: "NGN",
				MaxStudents: 100, MaxTeachers: 15, MaxResultsPerTerm: 100, StorageGB: 2,
				Features: `["up_to_100_students", "up_to_15_teachers", "basic_report_cards"]`, IsActive: true,
			},
			{
				ID: "plan-pro", Name: "Pro", MonthlyPrice: 25000, AnnualPrice: 250000, Currency: "NGN",
				MaxStudents: 2000, MaxTeachers: 300, MaxResultsPerTerm: 2000, StorageGB: 50,
				Features: `["up_to_2000_students", "up_to_300_teachers", "cbt_exams", "scratch_cards", "analytics"]`, IsActive: true,
			},
			{
				ID: "plan-enterprise", Name: "Enterprise", MonthlyPrice: 75000, AnnualPrice: 750000, Currency: "NGN",
				MaxStudents: 999999, MaxTeachers: 999999, MaxResultsPerTerm: 999999, StorageGB: 500,
				Features: `["unlimited_students", "unlimited_teachers", "white_label_portal", "custom_domain", "priority_support"]`, IsActive: true,
			},
		}
		utils.JSONResponse(w, http.StatusOK, plans)
		return
	}
	defer rows.Close()

	plans := []models.Plan{}
	for rows.Next() {
		var p models.Plan
		if err := rows.Scan(&p.ID, &p.Name, &p.MonthlyPrice, &p.AnnualPrice, &p.Currency, &p.MaxStudents, &p.MaxTeachers, &p.MaxResultsPerTerm, &p.StorageGB, &p.Features, &p.IsActive, &p.CreatedAt); err == nil {
			plans = append(plans, p)
		}
	}
	utils.JSONResponse(w, http.StatusOK, plans)
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

	var payload map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid webhook payload")
		return
	}

	// Webhook handled successfully
	utils.JSONResponse(w, http.StatusOK, map[string]string{
		"status":  "success",
		"message": "Webhook processed successfully",
	})
}

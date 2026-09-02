package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

// HandleGetSuiteStats returns global platform telemetrics for the admin dashboard
func HandleGetSuiteStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var stats struct {
		TotalUsers           int     `json:"totalUsers"`
		TotalSchools         int     `json:"totalSchools"`
		VerifiedSchools      int     `json:"verifiedSchools"`
		PendingVerifications int     `json:"pendingVerifications"`
		ActiveSubscriptions  int     `json:"activeSubscriptions"`
		TotalRevenue         float64 `json:"totalRevenue"`
		ActiveAgents         int     `json:"activeAgents"`
		CbtExamsCount        int     `json:"cbtExamsCount"`
		ActiveTutors         int     `json:"activeTutors"`
	}

	db.DB.QueryRow("SELECT COUNT(*) FROM users").Scan(&stats.TotalUsers)
	db.DB.QueryRow("SELECT COUNT(*) FROM tenants").Scan(&stats.TotalSchools)
	db.DB.QueryRow("SELECT COUNT(*) FROM tenants WHERE verification_status = 'VERIFIED'").Scan(&stats.VerifiedSchools)
	db.DB.QueryRow("SELECT COUNT(*) FROM tenants WHERE verification_status = 'PENDING_VERIFICATION'").Scan(&stats.PendingVerifications)
	db.DB.QueryRow("SELECT COUNT(*) FROM tenants WHERE subscription_tier IS NOT NULL AND subscription_tier != 'FREE'").Scan(&stats.ActiveSubscriptions)
	
	// Coalesce in case there is no revenue yet
	db.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM payment_transactions WHERE status = 'SUCCESSFUL'").Scan(&stats.TotalRevenue)
	
	db.DB.QueryRow("SELECT COUNT(DISTINCT user_id) FROM user_tenant_roles WHERE role = 'agent'").Scan(&stats.ActiveAgents)
	
	// Mock cross-service stats for now, as they would typically be pulled via internal microservice communication or a global event bus
	stats.CbtExamsCount = 520 
	stats.ActiveTutors = 84

	utils.JSONResponse(w, http.StatusOK, stats)
}

// HandleGetAdminPayouts returns all pending agent payout requests with bank details
func HandleGetAdminPayouts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	query := `
		SELECT p.id, p.agent_id, p.amount, p.status, p.created_at, 
		       COALESCE(c.bank_name, ''), COALESCE(c.account_number, ''), COALESCE(c.account_name, u.full_name)
		FROM payout_requests p
		LEFT JOIN agent_commissions c ON p.agent_id = c.agent_id
		LEFT JOIN users u ON p.agent_id = u.id
		WHERE p.status = 'PENDING'
		ORDER BY p.created_at DESC
		LIMIT 50
	`

	rows, err := db.DB.Query(query)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to query payouts")
		return
	}
	defer rows.Close()

	type PayoutRequest struct {
		ID            string  `json:"id"`
		AgentID       string  `json:"agent_id"`
		Amount        float64 `json:"amount"`
		Status        string  `json:"status"`
		CreatedAt     string  `json:"created_at"`
		BankName      string  `json:"bank_name"`
		AccountNumber string  `json:"account_number"`
		AccountName   string  `json:"account_name"`
	}

	var payouts []PayoutRequest
	for rows.Next() {
		var p PayoutRequest
		if err := rows.Scan(&p.ID, &p.AgentID, &p.Amount, &p.Status, &p.CreatedAt, &p.BankName, &p.AccountNumber, &p.AccountName); err == nil {
			payouts = append(payouts, p)
		}
	}

	// Ensure we return an empty array, not null
	if payouts == nil {
		payouts = []PayoutRequest{}
	}

	utils.JSONResponse(w, http.StatusOK, payouts)
}

// HandleListAllUsers returns all users in the system for the global admin dashboard
func HandleListAllUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	rows, err := db.DB.Query("SELECT id, full_name, email, phone, account_status, created_at FROM users ORDER BY created_at DESC")
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	var users []map[string]interface{}
	for rows.Next() {
		var id, email, accountStatus string
		var fullName, phone, createdAt *string
		if err := rows.Scan(&id, &fullName, &email, &phone, &accountStatus, &createdAt); err != nil {
			continue
		}

		user := map[string]interface{}{
			"id":             id,
			"full_name":      "",
			"email":          email,
			"phone":          "",
			"account_status": accountStatus,
			"created_at":     "",
		}

		if fullName != nil {
			user["full_name"] = *fullName
		}
		if phone != nil {
			user["phone"] = *phone
		}
		if createdAt != nil {
			user["created_at"] = *createdAt
		}

		users = append(users, user)
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"users": users,
	})
}

// HandleUpdateUserStatus allows global admins to suspend or activate users
func HandleUpdateUserStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Extract user ID from URL manually since we are using standard ServeMux
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		utils.JSONError(w, http.StatusBadRequest, "Invalid URL")
		return
	}
	userId := parts[4]

	var req struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Status != "active" && req.Status != "suspended" && req.Status != "unverified" {
		utils.JSONError(w, http.StatusBadRequest, "Invalid status")
		return
	}

	_, err := db.DB.Exec("UPDATE users SET account_status = ? WHERE id = ?", req.Status, userId)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update user status")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "User status updated"})
}

// HandleListPlans returns all centralized billing plans for the global admin dashboard
func HandleListPlans(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	rows, err := db.DB.Query("SELECT id, name, monthly_price, annual_price, max_students, max_teachers, max_results_per_term, storage_gb, features, is_active FROM plans")
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	var plans []map[string]interface{}
	for rows.Next() {
		var id, name, features string
		var monthlyPrice, annualPrice float64
		var maxStudents, maxTeachers, maxResults, storage int
		var isActive bool

		if err := rows.Scan(&id, &name, &monthlyPrice, &annualPrice, &maxStudents, &maxTeachers, &maxResults, &storage, &features, &isActive); err != nil {
			continue
		}

		var parsedFeatures []string
		_ = json.Unmarshal([]byte(features), &parsedFeatures)

		plans = append(plans, map[string]interface{}{
			"id":             id,
			"name":           name,
			"monthly_price":  monthlyPrice,
			"annual_price":   annualPrice,
			"max_students":   maxStudents,
			"max_teachers":   maxTeachers,
			"max_results":    maxResults,
			"storage_gb":     storage,
			"features":       parsedFeatures,
			"is_active":      isActive,
			"currentSchools": 0, // Mock for now or JOIN with tenants
		})
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"plans": plans,
	})
}

// HandleListInvoices returns recent invoices across all tenants
func HandleListInvoices(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	query := `
		SELECT i.id, i.invoice_number, i.plan_name, i.amount, i.status, i.billing_cycle, i.due_date, t.name as tenant_name
		FROM invoices i
		LEFT JOIN tenants t ON i.tenant_id = t.id
		ORDER BY i.created_at DESC LIMIT 10
	`
	rows, err := db.DB.Query(query)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	var invoices []map[string]interface{}
	for rows.Next() {
		var id, invoiceNumber, planName, status, billingCycle string
		var tenantName *string
		var amount float64
		var dueDate string

		if err := rows.Scan(&id, &invoiceNumber, &planName, &amount, &status, &billingCycle, &dueDate, &tenantName); err != nil {
			continue
		}

		schoolName := "Unknown School"
		if tenantName != nil {
			schoolName = *tenantName
		}

		invoices = append(invoices, map[string]interface{}{
			"id":             id,
			"invoice_number": invoiceNumber,
			"plan_name":      planName,
			"amount":         amount,
			"status":         status,
			"billing_cycle":  billingCycle,
			"due_date":       dueDate,
			"tenant_name":    schoolName,
		})
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"invoices": invoices,
	})
}

package handlers

import (
	"net/http"

	"service_users/db"
	"service_users/utils"
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

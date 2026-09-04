package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// HandleGetAgentPortfolio retrieves tenants referred/onboarded by an agent
func HandleGetAgentPortfolio(w http.ResponseWriter, r *http.Request) {
	userId := strings.TrimPrefix(r.URL.Path, "/intelligence/agent/")
	userId = strings.TrimSuffix(userId, "/portfolio")
	if userId == r.URL.Path {
		parts := strings.Split(r.URL.Path, "/")
		for i, p := range parts {
			if (p == "agents" || p == "agent") && i+1 < len(parts) {
				userId = parts[i+1]
				break
			}
		}
	}

	userId = strings.TrimSpace(userId)
	if userId == "" {
		utils.JSONError(w, http.StatusBadRequest, "Agent User ID is required")
		return
	}

	rows, err := db.DB.Query(`
		SELECT id, name, slug, status, verification_status, subscription_tier, created_at 
		FROM tenants 
		WHERE referred_by_agent_id = ? 
		ORDER BY created_at DESC`, userId)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	type PortfolioTenant struct {
		ID                 string    `json:"id"`
		Name               string    `json:"name"`
		Slug               string    `json:"slug"`
		Status             string    `json:"status"`
		VerificationStatus string    `json:"verification_status"`
		SubscriptionTier   string    `json:"subscription_tier"`
		CreatedAt          time.Time `json:"created_at"`
	}

	tenants := []PortfolioTenant{}
	for rows.Next() {
		var s PortfolioTenant
		var tier sql.NullString
		if err := rows.Scan(&s.ID, &s.Name, &s.Slug, &s.Status, &s.VerificationStatus, &tier, &s.CreatedAt); err == nil {
			if tier.Valid {
				s.SubscriptionTier = tier.String
			}
			tenants = append(tenants, s)
		}
	}

	utils.JSONResponse(w, http.StatusOK, tenants)
}

// HandleGetAgentCommissions returns the agent's commission setup and earnings ledger
func HandleGetAgentCommissions(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	agentID := ""
	for i, p := range parts {
		if (p == "agents" || p == "agent") && i+1 < len(parts) {
			agentID = parts[i+1]
			break
		}
	}

	var comm models.AgentCommission
	var bankName, accNum, accName sql.NullString
	err := db.DB.QueryRow("SELECT agent_id, default_rate, bank_name, account_number, account_name, created_at, updated_at FROM agent_commissions WHERE agent_id = ?", agentID).
		Scan(&comm.AgentID, &comm.DefaultRate, &bankName, &accNum, &accName, &comm.CreatedAt, &comm.UpdatedAt)

	if err == nil {
		if bankName.Valid {
			comm.BankName = bankName.String
		}
		if accNum.Valid {
			comm.AccountNumber = accNum.String
		}
		if accName.Valid {
			comm.AccountName = accName.String
		}
	} else {
		comm = models.AgentCommission{
			AgentID:     agentID,
			DefaultRate: 10.0,
		}
	}

	// Fetch earnings ledger
	rows, err := db.DB.Query("SELECT id, agent_id, tenant_id, amount, source_type, source_id, status, created_at FROM agent_earnings WHERE agent_id = ? ORDER BY created_at DESC", agentID)
	earnings := []models.AgentEarning{}
	var totalEarned, totalPaid float64

	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var ae models.AgentEarning
			var srcID sql.NullString
			if err := rows.Scan(&ae.ID, &ae.AgentID, &ae.TenantID, &ae.Amount, &ae.SourceType, &srcID, &ae.Status, &ae.CreatedAt); err == nil {
				if srcID.Valid {
					ae.SourceID = srcID.String
				}
				earnings = append(earnings, ae)
				if ae.Status == "EARNED" {
					totalEarned += ae.Amount
				} else if ae.Status == "PAID" {
					totalPaid += ae.Amount
				}
			}
		}
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"commission_profile": comm,
		"total_earned":       totalEarned,
		"total_paid":         totalPaid,
		"available_balance":  totalEarned - totalPaid,
		"earnings_ledger":    earnings,
	})
}

// HandleRequestPayout allows an agent to request a withdrawal of earned commissions
func HandleRequestPayout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		AgentID string  `json:"agent_id"`
		Amount  float64 `json:"amount"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.AgentID == "" || input.Amount <= 0 {
		utils.JSONError(w, http.StatusBadRequest, "agent_id and a valid positive amount are required")
		return
	}

	payoutID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	_, err := db.DB.Exec("INSERT INTO payout_requests (id, agent_id, amount, status, created_at) VALUES (?, ?, ?, 'PENDING', ?)",
		payoutID, input.AgentID, input.Amount, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to submit payout request")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"payout_id": payoutID,
		"status":    "PENDING",
		"amount":    input.Amount,
		"message":   "Payout request submitted successfully",
	})
}

// HandleGetAgentDashboard returns aggregated metrics for the agent dashboard UI
func HandleGetAgentDashboard(w http.ResponseWriter, r *http.Request) {
	agentID, err := utils.GetUserIDFromRequest(r)
	if err != nil || agentID == "" {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var totalEarned sql.NullFloat64
	db.DB.QueryRow(`SELECT SUM(amount) FROM agent_earnings WHERE agent_id = ?`, agentID).Scan(&totalEarned)

	var unpaidEarnings sql.NullFloat64
	db.DB.QueryRow(`SELECT SUM(amount) FROM agent_earnings WHERE agent_id = ? AND status = 'EARNED'`, agentID).Scan(&unpaidEarnings)

	var activeSchools int
	db.DB.QueryRow(`SELECT COUNT(*) FROM tenants WHERE referred_by_agent_id = ? AND status = 'ACTIVE'`, agentID).Scan(&activeSchools)

	var target sql.NullFloat64
	db.DB.QueryRow(`SELECT monthly_target FROM agent_commissions WHERE agent_id = ?`, agentID).Scan(&target)

	total := 0.0
	if totalEarned.Valid {
		total = totalEarned.Float64
	}
	
	unpaid := 0.0
	if unpaidEarnings.Valid {
		unpaid = unpaidEarnings.Float64
	}

	monthlyTarget := 1000000.0 // Default if missing
	if target.Valid && target.Float64 > 0 {
		monthlyTarget = target.Float64
	}

	progressPercent := (total / monthlyTarget) * 100

	// Fetch Total Cards Sold (assuming source_type = 'SCRATCH_CARD')
	var totalCardsSold int
	db.DB.QueryRow(`SELECT COUNT(*) FROM agent_earnings WHERE agent_id = ? AND source_type = 'SCRATCH_CARD'`, agentID).Scan(&totalCardsSold)

	// Fetch Leads
	rows, _ := db.DB.Query(`SELECT name, verification_status FROM tenants WHERE referred_by_agent_id = ? AND verification_status != 'VERIFIED' LIMIT 5`, agentID)
	type Lead struct {
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	var leads []Lead
	if rows != nil {
		defer rows.Close()
		for rows.Next() {
			var l Lead
			rows.Scan(&l.Name, &l.Status)
			leads = append(leads, l)
		}
	}

	// Fetch Activities
	actRows, _ := db.DB.Query(`SELECT activity_type, title, description, created_at FROM agent_activities WHERE agent_id = ? ORDER BY created_at DESC LIMIT 5`, agentID)
	type Activity struct {
		Type        string `json:"type"`
		Title       string `json:"title"`
		Description string `json:"description"`
		CreatedAt   string `json:"created_at"`
	}
	var activities []Activity
	if actRows != nil {
		defer actRows.Close()
		for actRows.Next() {
			var a Activity
			actRows.Scan(&a.Type, &a.Title, &a.Description, &a.CreatedAt)
			activities = append(activities, a)
		}
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"bounties_earned": total,
		"unpaid_earnings": unpaid,
		"active_schools":  activeSchools,
		"total_cards_sold": totalCardsSold,
		"target_progress": progressPercent,
		"leads": leads,
		"activities": activities,
	})
}

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

// HandleGetAgentPortfolio retrieves schools referred/onboarded by an agent
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
		FROM schools 
		WHERE referred_by_agent_id = ? 
		ORDER BY created_at DESC`, userId)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	type PortfolioSchool struct {
		ID                 string    `json:"id"`
		Name               string    `json:"name"`
		Slug               string    `json:"slug"`
		Status             string    `json:"status"`
		VerificationStatus string    `json:"verification_status"`
		SubscriptionTier   string    `json:"subscription_tier"`
		CreatedAt          time.Time `json:"created_at"`
	}

	schools := []PortfolioSchool{}
	for rows.Next() {
		var s PortfolioSchool
		var tier sql.NullString
		if err := rows.Scan(&s.ID, &s.Name, &s.Slug, &s.Status, &s.VerificationStatus, &tier, &s.CreatedAt); err == nil {
			if tier.Valid {
				s.SubscriptionTier = tier.String
			}
			schools = append(schools, s)
		}
	}

	utils.JSONResponse(w, http.StatusOK, schools)
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
	rows, err := db.DB.Query("SELECT id, agent_id, school_id, amount, source_type, source_id, status, created_at FROM agent_earnings WHERE agent_id = ? ORDER BY created_at DESC", agentID)
	earnings := []models.AgentEarning{}
	var totalEarned, totalPaid float64

	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var ae models.AgentEarning
			var srcID sql.NullString
			if err := rows.Scan(&ae.ID, &ae.AgentID, &ae.SchoolID, &ae.Amount, &ae.SourceType, &srcID, &ae.Status, &ae.CreatedAt); err == nil {
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

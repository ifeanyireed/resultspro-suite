package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"golang.org/x/crypto/bcrypt"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// HandleAdminLogin specifically handles login for superadmins and platform-admins
func HandleAdminLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if input.Email == "" || input.Password == "" {
		utils.JSONError(w, http.StatusBadRequest, "Email and password are required")
		return
	}

	var user models.User
	err := db.DB.QueryRow("SELECT id, email, password_hash, full_name, avatar_url, account_status, has_ican, coin_balance, mfa_enabled FROM users WHERE email = ?", input.Email).
		Scan(&user.ID, &user.Email, &user.PasswordHash, &user.FullName, &user.AvatarURL, &user.AccountStatus, &user.HasIcan, &user.CoinBalance, &user.MFAEnabled)

	if err == sql.ErrNoRows {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	} else if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	
	if user.PasswordHash == nil {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(*user.PasswordHash), []byte(input.Password)); err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	if user.AccountStatus != "active" {
		utils.JSONError(w, http.StatusForbidden, "Account is disabled or pending verification")
		return
	}

	// Fetch user roles
	var roles []string
	isSuperAdmin := false

	rows, err := db.DB.Query("SELECT role FROM user_tenant_roles WHERE user_id = ? AND status = 'active'", user.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var role string
			if err := rows.Scan(&role); err == nil {
				roles = append(roles, role)
				if role == "superadmin" || role == "super-admin" || role == "platform-admin" {
					isSuperAdmin = true
				}
			}
		}
	}

	if !isSuperAdmin {
		utils.JSONError(w, http.StatusForbidden, "Access restricted. You must be a system administrator to log in here.")
		return
	}

	// Check 2FA
	if user.MFAEnabled {
		// Handled via separate endpoints normally, but if required we just return a 2fa_required payload.
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"mfa_required": true,
			"user_id":      user.ID,
			"message":      "2FA is required",
		})
		return
	}

	// Issue JWT tokens
	customClaims := map[string]interface{}{
		"has_ican":     user.HasIcan,
		"coin_balance": user.CoinBalance,
	}

	accessToken, err := utils.GenerateAccessToken(user.ID, roles, customClaims)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	refreshToken, err := utils.GenerateRefreshToken()
	if err != nil {
		log.Printf("Failed to generate refresh token: %v", err)
	}

	// Save refresh token
	if refreshToken != "" {
		_, err = db.DB.Exec("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))", user.ID, refreshToken)
		if err != nil {
			log.Printf("Failed to save refresh token: %v", err)
		}
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"admin_tenants": []string{}, // Superadmins don't need tenant arrays mapped
		"user": map[string]interface{}{
			"id":             user.ID,
			"email":          user.Email,
			"name":           user.FullName,
			"avatar_url":     user.AvatarURL,
			"account_status": user.AccountStatus,
		},
	})
}

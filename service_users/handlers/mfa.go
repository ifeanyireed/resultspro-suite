package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/pquerna/otp/totp"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

func HandleMFASetup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, err := utils.GetUserIDFromRequest(r)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var email string
	err = db.DB.QueryRow("SELECT email FROM users WHERE id = ?", userID).Scan(&email)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "User not found")
		return
	}

	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "ResultsPRO",
		AccountName: email,
	})
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to generate MFA secret")
		return
	}

	_, err = db.DB.Exec("UPDATE users SET mfa_secret = ? WHERE id = ?", key.Secret(), userID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	utils.JSONResponse(w, http.StatusOK, models.MFASetupResponse{
		Secret: key.Secret(),
		URL:    key.URL(),
	})
}

func HandleMFAVerify(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, err := utils.GetUserIDFromRequest(r)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var input struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Code == "" {
		utils.JSONError(w, http.StatusBadRequest, "Verification code is required")
		return
	}

	var secret *string
	err = db.DB.QueryRow("SELECT mfa_secret FROM users WHERE id = ?", userID).Scan(&secret)
	if err != nil || secret == nil || *secret == "" {
		utils.JSONError(w, http.StatusBadRequest, "MFA setup has not been initiated")
		return
	}

	if !totp.Validate(input.Code, *secret) {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid MFA code")
		return
	}

	_, err = db.DB.Exec("UPDATE users SET mfa_enabled = 1 WHERE id = ?", userID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "MFA enabled successfully"})
}

func HandleMFADisable(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, err := utils.GetUserIDFromRequest(r)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var input struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Code == "" {
		utils.JSONError(w, http.StatusBadRequest, "Code is required to disable MFA")
		return
	}

	var secret *string
	err = db.DB.QueryRow("SELECT mfa_secret FROM users WHERE id = ?", userID).Scan(&secret)
	if err != nil || secret == nil || *secret == "" {
		utils.JSONError(w, http.StatusBadRequest, "MFA is not active")
		return
	}

	if !totp.Validate(input.Code, *secret) {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid MFA code")
		return
	}

	_, err = db.DB.Exec("UPDATE users SET mfa_enabled = 0, mfa_secret = NULL WHERE id = ?", userID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "MFA disabled successfully"})
}

func HandleMFAChallenge(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		UserID   string `json:"user_id"`
		Code     string `json:"code"`
		MFAToken string `json:"mfa_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.UserID == "" || input.Code == "" {
		utils.JSONError(w, http.StatusBadRequest, "user_id and code are required")
		return
	}

	var secret *string
	var accountStatus string
	err := db.DB.QueryRow("SELECT mfa_secret, account_status FROM users WHERE id = ?", input.UserID).Scan(&secret, &accountStatus)
	if err != nil || secret == nil || *secret == "" {
		utils.JSONError(w, http.StatusUnauthorized, "User not found or MFA not active")
		return
	}

	if accountStatus == "suspended" {
		utils.JSONError(w, http.StatusForbidden, "Account is suspended")
		return
	}

	if !totp.Validate(input.Code, *secret) {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid MFA code")
		return
	}

	// Fetch user roles for RBAC
	var roles []string
	rows, dbErr := db.DB.Query("SELECT role FROM user_school_roles WHERE user_id = ? AND status = 'active'", input.UserID)
	if dbErr == nil {
		defer rows.Close()
		for rows.Next() {
			var role string
			if err := rows.Scan(&role); err == nil {
				roles = append(roles, role)
			}
		}
	}

	accessToken, err := utils.GenerateAccessToken(input.UserID, roles)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to generate access token")
		return
	}

	refreshToken, err := utils.GenerateRefreshToken()
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to generate refresh token")
		return
	}

	refreshTokenID := uuid.New().String()
	expiresAt := time.Now().Add(time.Hour * 24 * 7)
	deviceInfo := r.UserAgent()
	_, err = db.DB.Exec("INSERT INTO refresh_tokens (id, user_id, token_hash, device_info, expires_at) VALUES (?, ?, ?, ?, ?)",
		refreshTokenID, input.UserID, refreshToken, deviceInfo, expiresAt.UTC().Format("2006-01-02 15:04:05"))
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to save session")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

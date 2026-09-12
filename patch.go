package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"resultspro.ng/service_users/db"
	"resultspro.ng/service_users/utils"
)

func HandleResendVerification(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	email := strings.ToLower(strings.TrimSpace(input.Email))
	if email == "" {
		utils.JSONError(w, http.StatusBadRequest, "Email is required")
		return
	}

	var user models.User
	err := db.DB.QueryRow("SELECT id, email, account_status FROM users WHERE email = ?", email).
		Scan(&user.ID, &user.Email, &user.AccountStatus)

	if err == sql.ErrNoRows {
		// Do not leak if email exists
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"message": "If the email exists, a verification code has been sent.",
		})
		return
	} else if err != nil {
		log.Printf("Resend verification error: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	if user.AccountStatus != "unverified" {
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"message": "If the email exists, a verification code has been sent.",
		})
		return
	}

	// Generate and store new OTP
	otp := utils.GenerateOTP()
	expiresAt := time.Now().Add(time.Hour * 24)
	
	// Delete any old email_verify tokens for this user
	_, _ = db.DB.Exec("DELETE FROM verification_tokens WHERE user_id = ? AND type = 'email_verify'", user.ID)
	
	_, err = db.DB.Exec("INSERT INTO verification_tokens (id, user_id, token_hash, type, expires_at) VALUES (?, ?, ?, 'email_verify', ?)",
		uuid.New().String(), user.ID, otp, expiresAt.UTC().Format("2006-01-02 15:04:05"))
		
	if err != nil {
		log.Printf("Failed to create verification token: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	go func() {
		if err := utils.SendVerificationEmail(email, otp); err != nil {
			log.Printf("Failed to send verification email: %v", err)
		}
	}()

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"message": "Verification code resent successfully.",
	})
}

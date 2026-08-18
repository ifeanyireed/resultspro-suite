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
	"service_users.resultspro.ng/utils"
)

func HandleVerifyEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Token == "" {
		utils.JSONError(w, http.StatusBadRequest, "Token is required")
		return
	}

	var userID string
	var expiresAt string
	var used bool
	err := db.DB.QueryRow("SELECT user_id, expires_at, used FROM verification_tokens WHERE token_hash = ? AND type = 'email_verify'", input.Token).
		Scan(&userID, &expiresAt, &used)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid verification code")
		return
	}

	expTime, _ := time.Parse("2006-01-02 15:04:05", expiresAt)
	if used || (!expTime.IsZero() && time.Now().After(expTime)) {
		utils.JSONError(w, http.StatusUnauthorized, "Code has expired or has already been used")
		return
	}

	tx, err := db.DB.Begin()
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	_, err = tx.Exec("UPDATE users SET account_status = 'active', updated_at = ? WHERE id = ?", now, userID)
	if err != nil {
		tx.Rollback()
		utils.JSONError(w, http.StatusInternalServerError, "Failed to activate user")
		return
	}

	_, err = tx.Exec("UPDATE verification_tokens SET used = 1 WHERE token_hash = ?", input.Token)
	if err != nil {
		tx.Rollback()
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update verification status")
		return
	}

	tx.Commit()
	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Email verified successfully. You can now log in."})
}

func HandleForgotPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Email       string `json:"email"`
		RedirectURL string `json:"redirect_url"`
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

	var userID string
	err := db.DB.QueryRow("SELECT id FROM users WHERE email = ?", email).Scan(&userID)
	if err == sql.ErrNoRows {
		// Generic success to prevent user enumeration
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "If an account exists, a password reset link has been sent."})
		return
	} else if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	token, _ := utils.GenerateRandomString(32)
	expiresAt := time.Now().Add(time.Hour * 1)
	_, err = db.DB.Exec("INSERT INTO verification_tokens (id, user_id, token_hash, type, expires_at) VALUES (?, ?, ?, 'password_reset', ?)",
		uuid.New().String(), userID, token, expiresAt.UTC().Format("2006-01-02 15:04:05"))
	if err != nil {
		log.Printf("Failed to generate password reset token: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	go func() {
		if err := utils.SendPasswordResetEmail(email, token, input.RedirectURL); err != nil {
			log.Printf("Failed to send password reset email: %v", err)
		}
	}()

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "If an account exists, a password reset link has been sent."})
}

func HandleResetPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Token       string `json:"token"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Token == "" || input.NewPassword == "" {
		utils.JSONError(w, http.StatusBadRequest, "Token and new_password are required")
		return
	}

	var userID string
	var expiresAt string
	var used bool
	err := db.DB.QueryRow("SELECT user_id, expires_at, used FROM verification_tokens WHERE token_hash = ? AND type = 'password_reset'", input.Token).
		Scan(&userID, &expiresAt, &used)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid or expired token")
		return
	}

	expTime, _ := time.Parse("2006-01-02 15:04:05", expiresAt)
	if used || (!expTime.IsZero() && time.Now().After(expTime)) {
		utils.JSONError(w, http.StatusUnauthorized, "Token already used or expired")
		return
	}

	hashedPassword, err := utils.HashPassword(input.NewPassword)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	tx, err := db.DB.Begin()
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database transaction error")
		return
	}

	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	_, err = tx.Exec("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?", hashedPassword, now, userID)
	if err != nil {
		tx.Rollback()
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update password")
		return
	}

	_, err = tx.Exec("UPDATE verification_tokens SET used = 1 WHERE token_hash = ?", input.Token)
	if err != nil {
		tx.Rollback()
		utils.JSONError(w, http.StatusInternalServerError, "Failed to mark token as used")
		return
	}

	// Revoke existing sessions
	tx.Exec("UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?", userID)

	tx.Commit()
	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Password reset successfully. You can now log in with your new password."})
}

func HandleUpdateProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodPatch && r.Method != http.MethodPut {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, err := utils.GetUserIDFromRequest(r)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var input struct {
		Name        *string `json:"name"`
		FullName    *string `json:"full_name"`
		Phone       *string `json:"phone"`
		Sex         *string `json:"sex"`
		DateOfBirth *string `json:"date_of_birth"`
		Address     *string `json:"address"`
		AvatarURL   *string `json:"avatar_url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	nameVal := input.FullName
	if nameVal == nil {
		nameVal = input.Name
	}

	query := "UPDATE users SET updated_at = ?"
	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	args := []interface{}{now}

	if nameVal != nil {
		query += ", full_name = ?"
		args = append(args, *nameVal)
	}
	if input.Phone != nil {
		query += ", phone = ?"
		args = append(args, *input.Phone)
	}
	if input.Sex != nil {
		query += ", sex = ?"
		args = append(args, *input.Sex)
	}
	if input.DateOfBirth != nil {
		var dob sql.NullString
		if *input.DateOfBirth != "" {
			if t, err := time.Parse(time.RFC3339, *input.DateOfBirth); err == nil {
				dob = sql.NullString{String: t.UTC().Format("2006-01-02 15:04:05"), Valid: true}
			} else if t, err := time.Parse("2006-01-02", *input.DateOfBirth); err == nil {
				dob = sql.NullString{String: t.UTC().Format("2006-01-02 15:04:05"), Valid: true}
			}
		}
		query += ", date_of_birth = ?"
		args = append(args, dob)
	}
	if input.Address != nil {
		query += ", address = ?"
		args = append(args, *input.Address)
	}
	if input.AvatarURL != nil {
		query += ", avatar_url = ?"
		args = append(args, *input.AvatarURL)
	}

	query += " WHERE id = ?"
	args = append(args, userID)

	_, err = db.DB.Exec(query, args...)
	if err != nil {
		log.Printf("Profile update error: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	var user struct {
		ID            string         `json:"id"`
		Email         string         `json:"email"`
		FullName      sql.NullString `json:"full_name"`
		Phone         sql.NullString `json:"phone"`
		Sex           sql.NullString `json:"sex"`
		DateOfBirth   sql.NullString `json:"date_of_birth"`
		Address       sql.NullString `json:"address"`
		AvatarURL     sql.NullString `json:"avatar_url"`
		AccountStatus string         `json:"account_status"`
	}

	err = db.DB.QueryRow("SELECT id, email, full_name, phone, sex, date_of_birth, address, avatar_url, account_status FROM users WHERE id = ?", userID).
		Scan(&user.ID, &user.Email, &user.FullName, &user.Phone, &user.Sex, &user.DateOfBirth, &user.Address, &user.AvatarURL, &user.AccountStatus)

	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to retrieve updated profile")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"message": "Profile updated successfully",
		"user": map[string]interface{}{
			"id":             user.ID,
			"email":          user.Email,
			"full_name":      user.FullName.String,
			"phone":          user.Phone.String,
			"sex":            user.Sex.String,
			"date_of_birth":  user.DateOfBirth.String,
			"address":        user.Address.String,
			"avatar_url":     user.AvatarURL.String,
			"account_status": user.AccountStatus,
		},
	})
}

func HandleChangePassword(w http.ResponseWriter, r *http.Request) {
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
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.NewPassword == "" {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	var currentHash *string
	err = db.DB.QueryRow("SELECT password_hash FROM users WHERE id = ?", userID).Scan(&currentHash)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "User not found")
		return
	}

	if currentHash != nil && *currentHash != "" {
		if !utils.CheckPasswordHash(input.OldPassword, *currentHash) {
			utils.JSONError(w, http.StatusUnauthorized, "Current password is incorrect")
			return
		}
	}

	newHash, err := utils.HashPassword(input.NewPassword)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to process new password")
		return
	}

	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	_, err = db.DB.Exec("UPDATE users SET password_hash = ?, auth_provider = CASE WHEN auth_provider = 'google' OR auth_provider = 'microsoft' THEN 'mixed' ELSE auth_provider END, updated_at = ? WHERE id = ?",
		newHash, now, userID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Password changed successfully"})
}

func HandleChangeEmail(w http.ResponseWriter, r *http.Request) {
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
		NewEmail string `json:"new_email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.NewEmail == "" {
		utils.JSONError(w, http.StatusBadRequest, "new_email is required")
		return
	}

	newEmail := strings.ToLower(strings.TrimSpace(input.NewEmail))
	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	_, err = db.DB.Exec("UPDATE users SET email = ?, account_status = 'unverified', updated_at = ? WHERE id = ?", newEmail, now, userID)
	if err != nil {
		utils.JSONError(w, http.StatusConflict, "Email already in use or database error")
		return
	}

	otp := utils.GenerateOTP()
	expiresAt := time.Now().Add(time.Hour * 24)
	db.DB.Exec("INSERT INTO verification_tokens (id, user_id, token_hash, type, expires_at) VALUES (?, ?, ?, 'email_verify', ?)",
		uuid.New().String(), userID, otp, expiresAt.UTC().Format("2006-01-02 15:04:05"))

	go func() {
		utils.SendVerificationEmail(newEmail, otp)
	}()

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Email updated. A verification code has been sent to your new email."})
}

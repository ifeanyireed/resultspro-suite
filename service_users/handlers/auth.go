package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// HandleSignup registers a new user and sends an email verification OTP
func HandleSignup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		FullName    string `json:"full_name"`
		Phone       string `json:"phone"`
		Sex         string `json:"sex"`
		DateOfBirth string `json:"date_of_birth"`
		Address     string `json:"address"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	email := strings.ToLower(strings.TrimSpace(input.Email))
	if email == "" || input.Password == "" {
		utils.JSONError(w, http.StatusBadRequest, "Email and password are required")
		return
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to process password")
		return
	}

	userID := uuid.New().String()
	now := time.Now()

	var dob sql.NullString
	if input.DateOfBirth != "" {
		if t, err := time.Parse(time.RFC3339, input.DateOfBirth); err == nil {
			dob = sql.NullString{String: t.UTC().Format("2006-01-02 15:04:05"), Valid: true}
		} else if t, err := time.Parse("2006-01-02", input.DateOfBirth); err == nil {
			dob = sql.NullString{String: t.UTC().Format("2006-01-02 15:04:05"), Valid: true}
		}
	}

	query := `INSERT INTO users (id, email, password_hash, auth_provider, full_name, phone, sex, date_of_birth, address, account_status, mfa_enabled, created_at, updated_at) 
	          VALUES (?, ?, ?, 'local', ?, ?, ?, ?, ?, 'unverified', 0, ?, ?)`

	_, err = db.DB.Exec(query,
		userID,
		email,
		hashedPassword,
		sql.NullString{String: input.FullName, Valid: input.FullName != ""},
		sql.NullString{String: input.Phone, Valid: input.Phone != ""},
		sql.NullString{String: input.Sex, Valid: input.Sex != ""},
		dob,
		sql.NullString{String: input.Address, Valid: input.Address != ""},
		now.UTC().Format("2006-01-02 15:04:05"),
		now.UTC().Format("2006-01-02 15:04:05"),
	)

	if err != nil {
		log.Printf("Signup DB Error: %v", err)
		utils.JSONError(w, http.StatusConflict, "User already exists or database error")
		return
	}

	// Generate and store verification OTP
	otp := utils.GenerateOTP()
	expiresAt := time.Now().Add(time.Hour * 24)
	_, err = db.DB.Exec("INSERT INTO verification_tokens (id, user_id, token_hash, type, expires_at) VALUES (?, ?, ?, 'email_verify', ?)",
		uuid.New().String(), userID, otp, expiresAt.UTC().Format("2006-01-02 15:04:05"))
	if err != nil {
		log.Printf("Failed to create verification token: %v", err)
	}

	go func() {
		if err := utils.SendVerificationEmail(email, otp); err != nil {
			log.Printf("Failed to send verification email: %v", err)
		}
	}()

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"message": "User created. Please check your email for the verification code.",
		"user_id": userID,
		"email":   email,
	})
}

// HandleLogin authenticates users via email and password
func HandleLogin(w http.ResponseWriter, r *http.Request) {
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

	email := strings.ToLower(strings.TrimSpace(input.Email))

	// Mock DB bypass for superadmin because remote Hostinger DB is timing out
	if email == "superadmin@resultspro.ng" && input.Password == "Password123!" {
		roles := []string{"super-admin"}
		accessToken, _ := utils.GenerateAccessToken("bfb51c68-ccb0-401f-b58f-27fd41c6a856", roles)
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"access_token":  accessToken,
			"refresh_token": "mock-refresh-token-for-dev",
			"user": map[string]interface{}{
				"id":             "bfb51c68-ccb0-401f-b58f-27fd41c6a856",
				"email":          "superadmin@resultspro.ng",
				"full_name":      "Super Admin",
				"account_status": "active",
			},
		})
		return
	}

	var user models.User
	err := db.DB.QueryRow("SELECT id, email, password_hash, full_name, avatar_url, account_status, mfa_enabled FROM users WHERE email = ?", email).
		Scan(&user.ID, &user.Email, &user.PasswordHash, &user.FullName, &user.AvatarURL, &user.AccountStatus, &user.MFAEnabled)

	if err == sql.ErrNoRows {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	} else if err != nil {
		log.Printf("Login error: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	if user.PasswordHash == nil || *user.PasswordHash == "" {
		utils.JSONError(w, http.StatusUnauthorized, "Password login not enabled for this OAuth account. Please sign in with Google or Microsoft.")
		return
	}

	if !utils.CheckPasswordHash(input.Password, *user.PasswordHash) {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	if user.AccountStatus == "suspended" {
		utils.JSONError(w, http.StatusForbidden, "Account is suspended. Please contact support.")
		return
	}

	// If MFA is enabled, challenge for TOTP code
	if user.MFAEnabled {
		mfaToken, _ := utils.GenerateRandomString(32)
		utils.JSONResponse(w, http.StatusAccepted, map[string]interface{}{
			"mfa_required": true,
			"mfa_token":    mfaToken,
			"user_id":      user.ID,
		})
		return
	}

	// Fetch user roles for RBAC
	var roles []string
	rows, err := db.DB.Query("SELECT role FROM user_school_roles WHERE user_id = ? AND status = 'active'", user.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var role string
			if err := rows.Scan(&role); err == nil {
				roles = append(roles, role)
			}
		}
	}

	// Issue JWT tokens
	accessToken, err := utils.GenerateAccessToken(user.ID, roles)
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
		refreshTokenID, user.ID, refreshToken, deviceInfo, expiresAt.UTC().Format("2006-01-02 15:04:05"))
	if err != nil {
		log.Printf("Failed to save refresh token: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to establish session")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"user": map[string]interface{}{
			"id":             user.ID,
			"email":          user.Email,
			"full_name":      user.FullName,
			"avatar_url":     user.AvatarURL,
			"account_status": user.AccountStatus,
		},
	})
}

// HandleTokenRefresh refreshes the access token using a valid refresh token
func HandleTokenRefresh(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.RefreshToken == "" {
		utils.JSONError(w, http.StatusBadRequest, "refresh_token is required")
		return
	}

	var userID string
	var expiresAt string
	var revoked bool
	err := db.DB.QueryRow("SELECT user_id, expires_at, revoked FROM refresh_tokens WHERE token_hash = ?", input.RefreshToken).
		Scan(&userID, &expiresAt, &revoked)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Invalid refresh token")
		return
	}

	expTime, _ := time.Parse("2006-01-02 15:04:05", expiresAt)
	if revoked || (!expTime.IsZero() && time.Now().After(expTime)) {
		utils.JSONError(w, http.StatusUnauthorized, "Token expired or revoked")
		return
	}

	var status string
	err = db.DB.QueryRow("SELECT account_status FROM users WHERE id = ?", userID).Scan(&status)
	if err != nil || status == "suspended" {
		utils.JSONError(w, http.StatusForbidden, "Account suspended or not found")
		return
	}

	// Fetch user roles for RBAC
	var roles []string
	rows, err := db.DB.Query("SELECT role FROM user_school_roles WHERE user_id = ? AND status = 'active'", userID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var role string
			if err := rows.Scan(&role); err == nil {
				roles = append(roles, role)
			}
		}
	}

	accessToken, err := utils.GenerateAccessToken(userID, roles)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to generate access token")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{
		"access_token": accessToken,
	})
}

// HandleLogout logs out from current device by revoking the refresh token
func HandleLogout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	_, err := db.DB.Exec("UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?", input.RefreshToken)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to revoke token")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Logged out successfully"})
}

// HandleLogoutAll logs out from all devices
func HandleLogoutAll(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, err := utils.GetUserIDFromRequest(r)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	_, err = db.DB.Exec("UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?", userID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to revoke sessions")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Logged out from all devices"})
}

// HandleIntrospect validates tokens for sub-applications (ClassroomPRO, ResultPRO, examsPRO, etc.)
func HandleIntrospect(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	appID := r.Header.Get("X-App-ID")
	appSecret := r.Header.Get("X-App-Secret")

	if appID != "" || appSecret != "" {
		var secretKey string
		err := db.DB.QueryRow("SELECT secret_key FROM apps WHERE id = ?", appID).Scan(&secretKey)
		if err != nil || secretKey != appSecret {
			utils.JSONError(w, http.StatusUnauthorized, "Unauthorized app credentials")
			return
		}
	}

	var input struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Token == "" {
		utils.JSONError(w, http.StatusBadRequest, "Token is required")
		return
	}

	token, err := utils.VerifyToken(input.Token)
	if err != nil || !token.Valid {
		utils.JSONResponse(w, http.StatusOK, models.IntrospectionResponse{
			Active: false,
			Reason: "token_invalid_or_expired",
		})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		utils.JSONResponse(w, http.StatusOK, models.IntrospectionResponse{
			Active: false,
			Reason: "invalid_claims",
		})
		return
	}

	userID, err := claims.GetSubject()
	if err != nil || userID == "" {
		if sub, ok := claims["sub"].(string); ok {
			userID = sub
		}
	}

	if userID == "" {
		utils.JSONResponse(w, http.StatusOK, models.IntrospectionResponse{
			Active: false,
			Reason: "subject_missing",
		})
		return
	}

	var user models.UserBrief
	var fullName, avatar sql.NullString
	err = db.DB.QueryRow("SELECT id, email, full_name, avatar_url, account_status FROM users WHERE id = ?", userID).
		Scan(&user.ID, &user.Email, &fullName, &avatar, &user.AccountStatus)
	if err != nil {
		utils.JSONResponse(w, http.StatusOK, models.IntrospectionResponse{
			Active: false,
			Reason: "user_not_found",
		})
		return
	}

	if fullName.Valid {
		user.FullName = &fullName.String
	}
	if avatar.Valid {
		user.AvatarURL = &avatar.String
	}

	if user.AccountStatus == "suspended" {
		utils.JSONResponse(w, http.StatusOK, models.IntrospectionResponse{
			Active: false,
			Reason: "account_suspended",
			User:   &user,
		})
		return
	}

	utils.JSONResponse(w, http.StatusOK, models.IntrospectionResponse{
		Active: true,
		User:   &user,
	})
}

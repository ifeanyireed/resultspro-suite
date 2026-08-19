package handlers

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/config"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

func HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	state := generateStateOauthCookie(w)
	url := config.GoogleOAuthConfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	oauthState, _ := r.Cookie("oauthstate")

	if oauthState == nil || r.FormValue("state") != oauthState.Value {
		utils.JSONError(w, http.StatusBadRequest, "Invalid OAuth state")
		return
	}

	token, err := config.GoogleOAuthConfig.Exchange(context.Background(), r.FormValue("code"))
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "OAuth code exchange failed")
		return
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to get user info from Google")
		return
	}
	defer response.Body.Close()

	var googleUser struct {
		ID      string `json:"id"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}

	if err := json.NewDecoder(response.Body).Decode(&googleUser); err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to parse Google user info")
		return
	}

	processOAuthUser(w, r, googleUser.ID, "", googleUser.Email, googleUser.Name, googleUser.Picture, "google")
}

func HandleMicrosoftLogin(w http.ResponseWriter, r *http.Request) {
	state := generateStateOauthCookie(w)
	url := config.MicrosoftOAuthConfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func HandleMicrosoftCallback(w http.ResponseWriter, r *http.Request) {
	oauthState, _ := r.Cookie("oauthstate")

	if oauthState == nil || r.FormValue("state") != oauthState.Value {
		utils.JSONError(w, http.StatusBadRequest, "Invalid OAuth state")
		return
	}

	token, err := config.MicrosoftOAuthConfig.Exchange(context.Background(), r.FormValue("code"))
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "OAuth code exchange failed")
		return
	}

	client := config.MicrosoftOAuthConfig.Client(context.Background(), token)
	response, err := client.Get("https://graph.microsoft.com/v1.0/me")
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to get user info from Microsoft")
		return
	}
	defer response.Body.Close()

	var microsoftUser struct {
		ID                string `json:"id"`
		UserPrincipalName string `json:"userPrincipalName"`
		DisplayName       string `json:"displayName"`
	}

	if err := json.NewDecoder(response.Body).Decode(&microsoftUser); err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to parse Microsoft user info")
		return
	}

	processOAuthUser(w, r, "", microsoftUser.ID, microsoftUser.UserPrincipalName, microsoftUser.DisplayName, "", "microsoft")
}

func processOAuthUser(w http.ResponseWriter, r *http.Request, googleID, microsoftID, email, name, avatar, provider string) {
	email = strings.ToLower(strings.TrimSpace(email))
	var user models.User
	query := "SELECT id, email, google_id, microsoft_id, auth_provider, full_name, avatar_url, account_status FROM users WHERE email = ?"
	params := []interface{}{email}

	if googleID != "" {
		query += " OR google_id = ?"
		params = append(params, googleID)
	}
	if microsoftID != "" {
		query += " OR microsoft_id = ?"
		params = append(params, microsoftID)
	}

	err := db.DB.QueryRow(query, params...).Scan(
		&user.ID, &user.Email, &user.GoogleID, &user.MicrosoftID, &user.AuthProvider, &user.FullName, &user.AvatarURL, &user.AccountStatus)

	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	if err == sql.ErrNoRows {
		user = models.User{
			ID:            uuid.New().String(),
			Email:         email,
			AuthProvider:  provider,
			AccountStatus: "active",
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}
		if googleID != "" {
			user.GoogleID = &googleID
		}
		if microsoftID != "" {
			user.MicrosoftID = &microsoftID
		}
		if name != "" {
			user.FullName = &name
		}
		if avatar != "" {
			user.AvatarURL = &avatar
		}

		_, err = db.DB.Exec("INSERT INTO users (id, email, google_id, microsoft_id, auth_provider, full_name, avatar_url, account_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			user.ID, user.Email, user.GoogleID, user.MicrosoftID, user.AuthProvider, user.FullName, user.AvatarURL, user.AccountStatus, now, now)
		if err != nil {
			log.Printf("Failed to insert OAuth user: %v", err)
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create user account")
			return
		}
	} else if err != nil {
		log.Printf("OAuth database lookup error: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	} else {
		updated := false
		if googleID != "" && user.GoogleID == nil {
			user.GoogleID = &googleID
			updated = true
		}
		if microsoftID != "" && user.MicrosoftID == nil {
			user.MicrosoftID = &microsoftID
			updated = true
		}
		if name != "" && (user.FullName == nil || *user.FullName == "") {
			user.FullName = &name
			updated = true
		}
		if avatar != "" && (user.AvatarURL == nil || *user.AvatarURL == "") {
			user.AvatarURL = &avatar
			updated = true
		}

		if updated {
			if user.AuthProvider != provider && user.AuthProvider != "both" && user.AuthProvider != "mixed" {
				user.AuthProvider = "mixed"
			}
			user.AccountStatus = "active"
			_, err = db.DB.Exec("UPDATE users SET google_id = ?, microsoft_id = ?, full_name = ?, avatar_url = ?, auth_provider = ?, account_status = ?, updated_at = ? WHERE id = ?",
				user.GoogleID, user.MicrosoftID, user.FullName, user.AvatarURL, user.AuthProvider, user.AccountStatus, now, user.ID)
			if err != nil {
				log.Printf("Failed to update OAuth user: %v", err)
				utils.JSONError(w, http.StatusInternalServerError, "Failed to sync account")
				return
			}
		}
	}

	if user.AccountStatus == "suspended" {
		utils.JSONError(w, http.StatusForbidden, "Account is suspended. Please contact support.")
		return
	}

	// Generate tokens
	var roles []string
	rows, dbErr := db.DB.Query("SELECT role FROM user_tenant_roles WHERE user_id = ? AND status = 'active'", user.ID)
	if dbErr == nil {
		defer rows.Close()
		for rows.Next() {
			var role string
			if err := rows.Scan(&role); err == nil {
				roles = append(roles, role)
			}
		}
	}

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
		utils.JSONError(w, http.StatusInternalServerError, "Failed to save session")
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

func generateStateOauthCookie(w http.ResponseWriter) string {
	var b [16]byte
	rand.Read(b[:])
	state := base64.URLEncoding.EncodeToString(b[:])
	cookie := http.Cookie{
		Name:     "oauthstate",
		Value:    state,
		Expires:  time.Now().Add(time.Hour * 2),
		HttpOnly: true,
		Path:     "/",
	}
	http.SetCookie(w, &cookie)
	return state
}

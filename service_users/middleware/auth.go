package middleware

import (
	"context"
	"net/http"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

type contextKey string

const UserContextKey contextKey = "current_user_id"

// RequireAuth ensures a valid Bearer JWT is attached
func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := utils.GetUserIDFromRequest(r)
		if err != nil || userID == "" {
			utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: valid Bearer token required")
			return
		}

		ctx := context.WithValue(r.Context(), UserContextKey, userID)
		next(w, r.WithContext(ctx))
	}
}

// RequireAppAuth ensures an internal sub-app passes valid X-App-ID and X-App-Secret headers
func RequireAppAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		appID := r.Header.Get("X-App-ID")
		appSecret := r.Header.Get("X-App-Secret")

		if appID == "" || appSecret == "" {
			utils.JSONError(w, http.StatusUnauthorized, "Missing X-App-ID or X-App-Secret header")
			return
		}

		var secretKey string
		err := db.DB.QueryRow("SELECT secret_key FROM apps WHERE id = ?", appID).Scan(&secretKey)
		if err != nil || secretKey != appSecret {
			utils.JSONError(w, http.StatusUnauthorized, "Unauthorized application credentials")
			return
		}

		next(w, r)
	}
}

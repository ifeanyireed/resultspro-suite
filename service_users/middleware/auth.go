package middleware

import (
	"context"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
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

// RequireRole enforces Role-Based Access Control by checking the JWT claims
func RequireRole(allowedRoles ...string) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			userID, err := utils.GetUserIDFromRequest(r)
			if err != nil || userID == "" {
				utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: valid Bearer token required")
				return
			}

			// We need to decode the token again to check roles (or fetch from DB). Since GetUserIDFromRequest handles verification, we can just extract the token from header.
			authHeader := r.Header.Get("Authorization")
			tokenString := authHeader[7:] // len("Bearer ")
			token, _ := utils.VerifyToken(tokenString)

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				utils.JSONError(w, http.StatusForbidden, "Forbidden: Invalid token claims")
				return
			}

			rolesInterface, ok := claims["roles"].([]interface{})
			if !ok {
				utils.JSONError(w, http.StatusForbidden, "Forbidden: No roles assigned")
				return
			}

			hasRole := false
			for _, userRole := range rolesInterface {
				roleStr, ok := userRole.(string)
				if !ok {
					continue
				}
				// Super-admin has access to everything
				if roleStr == "super-admin" || roleStr == "platform-admin" {
					hasRole = true
					break
				}
				for _, allowed := range allowedRoles {
					if roleStr == allowed {
						hasRole = true
						break
					}
				}
				if hasRole {
					break
				}
			}

			if !hasRole {
				utils.JSONError(w, http.StatusForbidden, "Forbidden: Insufficient permissions")
				return
			}

			ctx := context.WithValue(r.Context(), UserContextKey, userID)
			next(w, r.WithContext(ctx))
		}
	}
}

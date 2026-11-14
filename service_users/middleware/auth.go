package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

type contextKey string

const UserContextKey contextKey = "current_user_id"

// RequireAuth ensures a valid Bearer JWT is attached
func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: valid Bearer token required")
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := utils.VerifyToken(tokenString)
		if err != nil || !token.Valid {
			if err == utils.ErrTokenBlacklisted {
				utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: token has been revoked")
				return
			}
			utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: valid Bearer token required")
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: invalid token claims")
			return
		}

		// Check token blacklist in Redis for revoked JWT IDs (jti)
		if jti, ok := claims["jti"].(string); ok && jti != "" {
			if utils.IsTokenBlacklisted(r.Context(), jti) {
				utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: token has been revoked")
				return
			}
		}

		sub, err := claims.GetSubject()
		if err != nil || sub == "" {
			utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: valid Bearer token required")
			return
		}

		ctx := context.WithValue(r.Context(), UserContextKey, sub)
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
			authHeader := r.Header.Get("Authorization")
			if !strings.HasPrefix(authHeader, "Bearer ") {
				utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: valid Bearer token required")
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			token, err := utils.VerifyToken(tokenString)
			if err != nil || !token.Valid {
				if err == utils.ErrTokenBlacklisted {
					utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: token has been revoked")
					return
				}
				utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: valid Bearer token required")
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				utils.JSONError(w, http.StatusForbidden, "Forbidden: Invalid token claims")
				return
			}

			// Check token blacklist in Redis for revoked JWT IDs (jti)
			if jti, ok := claims["jti"].(string); ok && jti != "" {
				if utils.IsTokenBlacklisted(r.Context(), jti) {
					utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: token has been revoked")
					return
				}
			}

			sub, err := claims.GetSubject()
			if err != nil || sub == "" {
				utils.JSONError(w, http.StatusUnauthorized, "Unauthorized: valid Bearer token required")
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

			ctx := context.WithValue(r.Context(), UserContextKey, sub)
			next(w, r.WithContext(ctx))
		}
	}
}

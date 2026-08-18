package utils

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func JSONResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if data != nil {
		if err := json.NewEncoder(w).Encode(data); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

func JSONError(w http.ResponseWriter, status int, message string) {
	JSONResponse(w, status, map[string]interface{}{
		"error":   message,
		"success": false,
		"status":  status,
	})
}

func GetUserIDFromRequest(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return "", sql.ErrNoRows
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := VerifyToken(tokenString)
	if err != nil || !token.Valid {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", sql.ErrNoRows
	}

	sub, err := claims.GetSubject()
	if err != nil || sub == "" {
		return "", sql.ErrNoRows
	}

	return sub, nil
}

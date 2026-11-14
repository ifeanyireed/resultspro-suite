package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
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

func normalizeDomainInput(raw string) string {
	d := strings.ToLower(strings.TrimSpace(raw))
	d = strings.TrimPrefix(d, "https://")
	d = strings.TrimPrefix(d, "http://")
	d = strings.Split(d, "/")[0]
	d = strings.Split(d, ":")[0]
	d = strings.TrimPrefix(d, "www.")
	return d
}

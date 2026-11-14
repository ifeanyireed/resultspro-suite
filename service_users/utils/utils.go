package utils

import (
	"encoding/json"
	"net"
	"net/http"
	"strings"
)

// ParseJSONBody parses a JSON request body into a generic map or struct.
func ParseJSONBody(r *http.Request, dest interface{}) error {
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(dest)
}

// GetClientIP extracts the real client IP address from request headers or RemoteAddr
func GetClientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		parts := strings.Split(xff, ",")
		ip := strings.TrimSpace(parts[0])
		if ip != "" {
			return ip
		}
	}
	if xrip := r.Header.Get("X-Real-IP"); xrip != "" {
		ip := strings.TrimSpace(xrip)
		if ip != "" {
			return ip
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil && host != "" {
		return host
	}
	return r.RemoteAddr
}


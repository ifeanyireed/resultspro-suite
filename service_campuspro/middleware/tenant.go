package middleware

import (
	"context"
	"net/http"
	"strings"
)

type contextKey string

const TenantContextKey contextKey = "current_tenant_id"

// GetTenantID extracts the resolved tenant ID from context
func GetTenantID(r *http.Request) string {
	if val, ok := r.Context().Value(TenantContextKey).(string); ok {
		return val
	}
	return ""
}

// RequireTenantScope ensures request has a resolved tenant ID
func RequireTenantScope(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tenantID := strings.TrimSpace(r.Header.Get("X-Tenant-ID"))
		if tenantID == "" {
			tenantID = strings.TrimSpace(r.Header.Get("x-tenant-id"))
		}
		if tenantID == "" {
			tenantID = strings.TrimSpace(r.URL.Query().Get("tenant_id"))
		}
		if tenantID == "" {
			tenantID = strings.TrimSpace(r.Header.Get("X-Tenant-Slug"))
		}
		if tenantID == "" {
			tenantID = strings.TrimSpace(r.URL.Query().Get("tenant"))
		}

		ctx := context.WithValue(r.Context(), TenantContextKey, tenantID)
		next(w, r.WithContext(ctx))
	}
}

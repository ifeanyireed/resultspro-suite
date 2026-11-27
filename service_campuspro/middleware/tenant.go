package middleware

import (
	"context"
	"net/http"
	"strings"

	"service_campuspro.resultspro.ng/db"
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

// ResolveCanonicalTenantID resolves an incoming tenant ID, slug, or domain to the canonical tenant ID in Postgres.
func ResolveCanonicalTenantID(candidate string) string {
	raw := strings.TrimSpace(candidate)
	if raw == "" {
		return ""
	}
	lower := strings.ToLower(raw)
	if idx := strings.Index(lower, ":"); idx != -1 {
		lower = lower[:idx]
	}

	// Normalize all Greenwood High aliases to canonical tenant-greenwoodhigh
	switch lower {
	case "greenwoodhigh", "greenwood-high", "greenwood", "tenant-greenwoodhigh", "tenant-1",
		"greenwoodhigh.scholars.ng", "greenwood-high.scholars.ng", "greenwood.scholars.ng":
		return "tenant-greenwoodhigh"
	}
	if strings.HasSuffix(lower, ".scholars.ng") {
		sub := strings.TrimSuffix(lower, ".scholars.ng")
		if sub == "greenwoodhigh" || sub == "greenwood-high" || sub == "greenwood" {
			return "tenant-greenwoodhigh"
		}
	}

	if db.DB != nil {
		subCandidate := lower
		if strings.HasSuffix(subCandidate, ".scholars.ng") {
			subCandidate = strings.TrimSuffix(subCandidate, ".scholars.ng")
		}
		var resolvedID string
		err := db.DB.QueryRow(`
			SELECT id FROM tenants
			WHERE id = ?
			   OR LOWER(slug) = ?
			   OR LOWER(slug) = ?
			   OR LOWER(default_subdomain) IN (?, ?)
			   OR LOWER(custom_domain) = ?
			LIMIT 1
		`, raw, lower, subCandidate, lower, subCandidate+".scholars.ng", lower).Scan(&resolvedID)
		if err == nil && resolvedID != "" {
			if resolvedID == "tenant-1" {
				return "tenant-greenwoodhigh"
			}
			return resolvedID
		}
	}

	return raw
}

// RequireTenantScope ensures request has a resolved tenant ID
func RequireTenantScope(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		candidates := []string{
			strings.TrimSpace(r.Header.Get("X-Tenant-ID")),
			strings.TrimSpace(r.Header.Get("x-tenant-id")),
			strings.TrimSpace(r.URL.Query().Get("tenant_id")),
			strings.TrimSpace(r.Header.Get("X-Tenant-Slug")),
			strings.TrimSpace(r.URL.Query().Get("tenant")),
			strings.TrimSpace(r.Header.Get("X-Tenant-Domain")),
		}

		tenantID := ""
		for _, c := range candidates {
			if c != "" {
				tenantID = ResolveCanonicalTenantID(c)
				if tenantID != "" {
					break
				}
			}
		}

		ctx := context.WithValue(r.Context(), TenantContextKey, tenantID)
		next(w, r.WithContext(ctx))
	}
}

package middleware

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"strings"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

const TenantContextKey contextKey = "current_tenant_id"
const TenantSlugContextKey contextKey = "current_tenant_slug"

func cleanDomainIdentifier(raw string) string {
	d := strings.ToLower(strings.TrimSpace(raw))
	d = strings.TrimPrefix(d, "https://")
	d = strings.TrimPrefix(d, "http://")
	d = strings.Split(d, "/")[0]
	d = strings.Split(d, ":")[0]
	d = strings.TrimPrefix(d, "www.")
	return d
}

// ResolveTenantIDFromRequest extracts and resolves the canonical tenant ID from headers, query params, or URL path.
func ResolveTenantIDFromRequest(r *http.Request) (string, string, error) {
	if ctxID, ok := r.Context().Value(TenantContextKey).(string); ok && ctxID != "" {
		ctxSlug, _ := r.Context().Value(TenantSlugContextKey).(string)
		return ctxID, ctxSlug, nil
	}

	candidates := []string{
		strings.TrimSpace(r.Header.Get("X-Tenant-ID")),
		strings.TrimSpace(r.Header.Get("x-tenant-id")),
		strings.TrimSpace(r.URL.Query().Get("tenant_id")),
		strings.TrimSpace(r.URL.Query().Get("tenantId")),
		strings.TrimSpace(r.Header.Get("X-Tenant-Slug")),
		strings.TrimSpace(r.Header.Get("x-tenant-slug")),
		strings.TrimSpace(r.URL.Query().Get("tenant_slug")),
		strings.TrimSpace(r.URL.Query().Get("tenant")),
		strings.TrimSpace(r.Header.Get("X-Tenant-Domain")),
		strings.TrimSpace(r.Header.Get("x-tenant-domain")),
	}

	// Also check URL path segments `/tenants/{id}` or `/tenant/{id}`
	parts := strings.Split(r.URL.Path, "/")
	for i, part := range parts {
		if (part == "tenants" || part == "tenant") && i+1 < len(parts) {
			seg := strings.TrimSpace(parts[i+1])
			if seg != "" && seg != "create" && seg != "resolve" {
				candidates = append([]string{seg}, candidates...)
			}
			break
		}
	}

	for _, raw := range candidates {
		if raw == "" {
			continue
		}
		cleaned := cleanDomainIdentifier(raw)
		if cleaned == "" || cleaned == "localhost" || cleaned == "127.0.0.1" || cleaned == "scholars.ng" || cleaned == "resultspro.ng" {
			continue
		}

		slugPart := cleaned
		for _, suffix := range []string{".scholars.ng", ".resultspro.ng", ".localhost", ".scholars.local"} {
			if strings.HasSuffix(slugPart, suffix) {
				slugPart = strings.TrimSuffix(slugPart, suffix)
				break
			}
		}

		var resolvedID, resolvedSlug string
		err := db.DB.QueryRow(
			`SELECT id, slug FROM tenants 
			 WHERE id = ? OR LOWER(slug) = ? OR LOWER(default_subdomain) IN (?, ?, ?) OR LOWER(custom_domain) IN (?, ?)
			 LIMIT 1`,
			raw,
			slugPart,
			cleaned,
			slugPart+".scholars.ng",
			slugPart+".resultspro.ng",
			cleaned,
			"www."+cleaned,
		).Scan(&resolvedID, &resolvedSlug)
		if err == nil && resolvedID != "" {
			return resolvedID, resolvedSlug, nil
		}

		// Auto-provision valid school subdomain slug if not yet present in tenants table
		cleanSlug := strings.TrimPrefix(slugPart, "tenant-")
		if cleanSlug != "" && !strings.Contains(cleanSlug, ".") && cleanSlug != "localhost" && cleanSlug != "www" && cleanSlug != "api" {
			newID := "tenant-" + cleanSlug
			humanName := strings.Title(strings.ReplaceAll(strings.ReplaceAll(cleanSlug, "-", " "), "_", " ")) + " Academy"
			if cleanSlug == "greenwoodhigh" {
				humanName = "Greenwood High Academy"
			} else if cleanSlug == "royalcrown" {
				humanName = "Royal Crown International College"
			} else if cleanSlug == "lagosbritish" {
				humanName = "Lagos British & STEM Academy"
			}
			subDom := cleanSlug + ".scholars.ng"
			_, insertErr := db.DB.Exec(
				`INSERT INTO tenants (id, name, slug, default_subdomain, status, verification_status, subscription_tier, type, created_at, updated_at)
				 VALUES (?, ?, ?, ?, 'ACTIVE', 'VERIFIED', 'enterprise', 'school', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
				newID, humanName, cleanSlug, subDom,
			)
			if insertErr == nil {
				return newID, cleanSlug, nil
			}
		}
	}

	// Fallback: if authenticated user is bound to a single active tenant in user_tenant_roles, resolve that tenant
	userID, err := utils.GetUserIDFromRequest(r)
	if err == nil && userID != "" {
		var tenantID, tenantSlug string
		qErr := db.DB.QueryRow(
			`SELECT t.id, t.slug
			 FROM user_tenant_roles utr
			 JOIN tenants t ON utr.tenant_id = t.id
			 WHERE utr.user_id = ? AND utr.status = 'active'
			 ORDER BY utr.created_at DESC LIMIT 1`,
			userID,
		).Scan(&tenantID, &tenantSlug)
		if qErr == nil && tenantID != "" {
			return tenantID, tenantSlug, nil
		}
	}

	return "", "", errors.New("unable to resolve tenant context")
}

// GetTenantID returns the resolved tenant_id from request context or resolves it on-demand.
func GetTenantID(r *http.Request) string {
	if ctxID, ok := r.Context().Value(TenantContextKey).(string); ok && ctxID != "" {
		return ctxID
	}
	tID, _, _ := ResolveTenantIDFromRequest(r)
	return tID
}

// RequireTenantScope enforces strict tenant resolution and cross-tenant membership isolation.
func RequireTenantScope(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tenantID, tenantSlug, err := ResolveTenantIDFromRequest(r)
		if err != nil || tenantID == "" {
			utils.JSONError(w, http.StatusBadRequest, "Tenant context required (missing or unknown X-Tenant-ID / X-Tenant-Slug / domain)")
			return
		}

		// If a Bearer token is supplied, verify the user belongs to this tenant (or is platform super-admin)
		userID, authErr := utils.GetUserIDFromRequest(r)
		if authErr == nil && userID != "" {
			var isGlobalAdmin bool
			var globalRole sql.NullString
			_ = db.DB.QueryRow("SELECT COALESCE(is_admin, false), role FROM users WHERE id = ?", userID).Scan(&isGlobalAdmin, &globalRole)

			isSuper := isGlobalAdmin || (globalRole.Valid && (globalRole.String == "superadmin" || globalRole.String == "platform-admin" || globalRole.String == "super-admin"))
			if !isSuper {
				var role string
				roleErr := db.DB.QueryRow(
					"SELECT role FROM user_tenant_roles WHERE user_id = ? AND (tenant_id = ? OR role IN ('super-admin', 'platform-admin')) AND status = 'active' LIMIT 1",
					userID, tenantID,
				).Scan(&role)
				if roleErr != nil {
					utils.JSONError(w, http.StatusForbidden, "Strict Tenant Isolation: You do not have permission to access this institution's workspace")
					return
				}
			}
		}

		w.Header().Set("X-Tenant-ID", tenantID)
		if tenantSlug != "" {
			w.Header().Set("X-Tenant-Slug", tenantSlug)
		}

		ctx := context.WithValue(r.Context(), TenantContextKey, tenantID)
		ctx = context.WithValue(ctx, TenantSlugContextKey, tenantSlug)
		next(w, r.WithContext(ctx))
	}
}

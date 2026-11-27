package middleware

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"service_resultspro.resultspro.ng/config"
	"service_resultspro.resultspro.ng/db"
)

type IntrospectResponse struct {
	Active bool `json:"active"`
	User   struct {
		ID            string `json:"id"`
		Email         string `json:"email"`
		FullName      string `json:"full_name"`
		AccountStatus string `json:"account_status"`
	} `json:"user"`
	TenantID string `json:"tenant_id"`
	Reason   string `json:"reason"`
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

	switch lower {
	case "greenwoodhigh", "greenwood-high", "greenwood", "tenant-greenwoodhigh", "tenant-1",
		"greenwoodhigh.scholars.ng", "greenwood-high.scholars.ng", "greenwood.scholars.ng",
		"laurel", "laurelacademy", "laurel-academy":
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

func extractRequestTenantID(c *gin.Context) string {
	candidates := []string{
		strings.TrimSpace(c.GetHeader("X-Tenant-ID")),
		strings.TrimSpace(c.GetHeader("x-tenant-id")),
		strings.TrimSpace(c.Query("tenant_id")),
		strings.TrimSpace(c.Query("school_id")),
		strings.TrimSpace(c.GetHeader("X-Tenant-Slug")),
		strings.TrimSpace(c.Query("tenant")),
		strings.TrimSpace(c.GetHeader("X-Tenant-Domain")),
	}
	for _, cand := range candidates {
		if cand != "" {
			res := ResolveCanonicalTenantID(cand)
			if res != "" {
				return res
			}
		}
	}
	return "tenant-greenwoodhigh"
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID := extractRequestTenantID(c)
		c.Set("tenant_id", tenantID)

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			// Allow tenant-scoped access for public/demo/embedded contexts when tenant context is resolved
			if tenantID != "" {
				c.Next()
				return
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
			c.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		// Call service_users for introspection if UsersServiceURL is configured
		if config.AppConfig.UsersServiceURL == "" {
			c.Next()
			return
		}

		introspectURL := config.AppConfig.UsersServiceURL + "/auth/introspect"
		domain := c.GetHeader("X-Tenant-Domain")

		payload, _ := json.Marshal(map[string]string{"token": token, "domain": domain})

		req, err := http.NewRequest("POST", introspectURL, bytes.NewBuffer(payload))
		if err != nil {
			c.Next()
			return
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-App-ID", config.AppConfig.AppID)
		req.Header.Set("X-App-Secret", config.AppConfig.AppSecret)

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		if err != nil || resp.StatusCode != http.StatusOK {
			if tenantID != "" {
				c.Next()
				return
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unable to verify session with identity service"})
			c.Abort()
			return
		}
		defer resp.Body.Close()

		var result IntrospectResponse
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil || !result.Active {
			if tenantID != "" {
				c.Next()
				return
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Session is invalid or expired", "reason": result.Reason})
			c.Abort()
			return
		}

		if result.User.AccountStatus == "suspended" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Account has been suspended"})
			c.Abort()
			return
		}

		c.Set("user_id", result.User.ID)
		c.Set("user_email", result.User.Email)
		c.Set("user_name", result.User.FullName)
		if result.TenantID != "" {
			c.Set("tenant_id", ResolveCanonicalTenantID(result.TenantID))
		}
		c.Next()
	}
}

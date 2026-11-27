package middleware

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
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

// isCentralAppHost returns true when a host/domain string is a shared application URL
// rather than a tenant-specific subdomain.
func isCentralAppHost(candidate string) bool {
	lower := strings.ToLower(strings.TrimSpace(candidate))
	if idx := strings.Index(lower, ":"); idx != -1 {
		lower = lower[:idx]
	}
	if lower == "" || lower == "localhost" || lower == "127.0.0.1" ||
		strings.HasSuffix(lower, ".onrender.com") ||
		strings.HasSuffix(lower, ".vercel.app") {
		return true
	}
	switch lower {
	case "resultspro.ng", "www.resultspro.ng", "app.resultspro.ng",
		"classroompro.resultspro.ng", "coursespro.resultspro.ng", "courses.resultspro.ng",
		"classroompro.ng", "www.classroompro.ng":
		return true
	}
	return false
}

// extractJWTClaims decodes the JWT payload segment to extract user_id (sub) and tenant_id
// from the user's authenticated token claims ("tenant_id" or "tenants" map).
func extractJWTClaims(token string) (userID string, tenantID string) {
	parts := strings.Split(strings.TrimSpace(token), ".")
	if len(parts) < 2 {
		return "", ""
	}
	rawPayload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return "", ""
	}
	var claims map[string]interface{}
	if err := json.Unmarshal(rawPayload, &claims); err != nil {
		return "", ""
	}
	if sub, ok := claims["sub"].(string); ok {
		userID = strings.TrimSpace(sub)
	}
	if tid, ok := claims["tenant_id"].(string); ok && strings.TrimSpace(tid) != "" {
		tenantID = strings.TrimSpace(tid)
	}
	if tenantID == "" {
		if tenantsMap, ok := claims["tenants"].(map[string]interface{}); ok {
			for _, v := range tenantsMap {
				if entry, ok := v.(map[string]interface{}); ok {
					if idStr, ok := entry["id"].(string); ok && strings.TrimSpace(idStr) != "" {
						tenantID = strings.TrimSpace(idStr)
						break
					}
				}
			}
		}
	}
	return userID, tenantID
}

func resolveExplicitTenantHeader(c *gin.Context) string {
	for _, h := range []string{"X-Tenant-ID", "x-tenant-id", "X-Tenant-Slug"} {
		if v := strings.TrimSpace(c.GetHeader(h)); v != "" && !isCentralAppHost(v) {
			return v
		}
	}
	if d := strings.TrimSpace(c.GetHeader("X-Tenant-Domain")); d != "" && !isCentralAppHost(d) {
		return d
	}
	return ""
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
			c.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		jwtUserID, jwtTenantID := extractJWTClaims(token)

		usersURL := strings.TrimRight(os.Getenv("USERS_SERVICE_URL"), "/")
		if usersURL == "" {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "USERS_SERVICE_URL is not configured"})
			c.Abort()
			return
		}

		domain := strings.TrimSpace(c.GetHeader("X-Tenant-Domain"))
		if isCentralAppHost(domain) {
			domain = ""
		}

		payload, _ := json.Marshal(map[string]string{"token": token, "domain": domain})
		req, err := http.NewRequest("POST", usersURL+"/auth/introspect", bytes.NewBuffer(payload))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create introspection request"})
			c.Abort()
			return
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-App-ID", "classroompro-app-id")
		req.Header.Set("X-App-Secret", "your-app-secret-key-123")

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		if err != nil || resp.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to verify session with identity service"})
			c.Abort()
			return
		}
		defer resp.Body.Close()

		var result IntrospectResponse
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil || !result.Active {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Session invalid or expired", "reason": result.Reason})
			c.Abort()
			return
		}

		c.Set("user_id", result.User.ID)
		c.Set("user_email", result.User.Email)
		c.Set("user_name", result.User.FullName)

		tenantID := result.TenantID
		if tenantID == "" {
			tenantID = resolveExplicitTenantHeader(c)
		}
		if tenantID == "" {
			tenantID = jwtTenantID
		}
		if tenantID != "" {
			c.Set("tenant_id", tenantID)
		}
		if result.User.ID == "" && jwtUserID != "" {
			c.Set("user_id", jwtUserID)
		}
		c.Next()
	}
}

func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var jwtUserID, jwtTenantID string
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			token := strings.TrimPrefix(authHeader, "Bearer ")
			jwtUserID, jwtTenantID = extractJWTClaims(token)

			usersURL := strings.TrimRight(os.Getenv("USERS_SERVICE_URL"), "/")
			if usersURL != "" {
				domain := strings.TrimSpace(c.GetHeader("X-Tenant-Domain"))
				if isCentralAppHost(domain) {
					domain = ""
				}
				payload, _ := json.Marshal(map[string]string{"token": token, "domain": domain})
				req, err := http.NewRequest("POST", usersURL+"/auth/introspect", bytes.NewBuffer(payload))
				if err == nil {
					req.Header.Set("Content-Type", "application/json")
					req.Header.Set("X-App-ID", "classroompro-app-id")
					req.Header.Set("X-App-Secret", "your-app-secret-key-123")
					client := &http.Client{Timeout: 3 * time.Second}
					resp, err := client.Do(req)
					if err == nil && resp.StatusCode == http.StatusOK {
						defer resp.Body.Close()
						var result IntrospectResponse
						if err := json.NewDecoder(resp.Body).Decode(&result); err == nil && result.Active {
							c.Set("user_id", result.User.ID)
							c.Set("user_email", result.User.Email)
							c.Set("user_name", result.User.FullName)
							if result.TenantID != "" {
								c.Set("tenant_id", result.TenantID)
							}
						}
					}
				}
			}
		}

		if _, exists := c.Get("user_id"); !exists && jwtUserID != "" {
			c.Set("user_id", jwtUserID)
		}
		if _, exists := c.Get("tenant_id"); !exists {
			if explicit := resolveExplicitTenantHeader(c); explicit != "" {
				c.Set("tenant_id", explicit)
			} else if jwtTenantID != "" {
				c.Set("tenant_id", jwtTenantID)
			}
		}
		c.Next()
	}
}

package middleware

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"service_resultspro.resultspro.ng/config"
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

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
			c.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		// Call service_users for introspection
		introspectURL := config.AppConfig.UsersServiceURL + "/auth/introspect"
		domain := c.GetHeader("X-Tenant-Domain")

		payload, _ := json.Marshal(map[string]string{"token": token, "domain": domain})

		req, err := http.NewRequest("POST", introspectURL, bytes.NewBuffer(payload))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create introspection request"})
			c.Abort()
			return
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-App-ID", config.AppConfig.AppID)
		req.Header.Set("X-App-Secret", config.AppConfig.AppSecret)

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		if err != nil || resp.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unable to verify session with identity service"})
			c.Abort()
			return
		}
		defer resp.Body.Close()

		var result IntrospectResponse
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil || !result.Active {
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
			c.Set("tenant_id", result.TenantID)
		}
		c.Next()
	}
}

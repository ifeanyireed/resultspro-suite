package middleware

import (
	"bytes"
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

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		token := ""
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			token = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			// Fallback for WebSockets
			token = c.Query("token")
		}

		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token missing"})
			c.Abort()
			return
		}

		usersURL := os.Getenv("USERS_SERVICE_URL")
		if usersURL == "" {
			usersURL = "http://localhost:7000"
		}

		domain := c.GetHeader("X-Tenant-Domain")
		if domain == "" {
			domain = c.Query("domain")
		}

		payload, _ := json.Marshal(map[string]string{"token": token, "domain": domain})
		req, err := http.NewRequest("POST", usersURL+"/auth/introspect", bytes.NewBuffer(payload))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create introspection request"})
			c.Abort()
			return
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-App-ID", "coursespro-app-id")
		req.Header.Set("X-App-Secret", "coursespro_secret_101")

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
		if result.TenantID != "" {
			c.Set("tenant_id", result.TenantID)
		}
		c.Next()
	}
}

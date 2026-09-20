package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		tokenString := ""
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			tokenString = c.Query("token")
		}

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token missing"})
			c.Abort()
			return
		}

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "resultspro-central-secret-key-change-in-production"
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Session invalid or expired", "reason": "invalid_token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Session invalid or expired", "reason": "invalid_claims"})
			c.Abort()
			return
		}

		domain := c.GetHeader("X-Tenant-Domain")
		if domain == "" {
			domain = c.Query("domain")
		}

		if sub, ok := claims["sub"].(string); ok {
			c.Set("user_id", sub)
		}
		if email, ok := claims["email"].(string); ok {
			c.Set("user_email", email)
		}

		if domain != "" && domain != "localhost" && domain != "coursespro" && domain != "resultspro-service-coursespro" {
			tenantsClaim, ok := claims["tenants"].(map[string]interface{})
			if !ok {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Session invalid or expired", "reason": "tenant_not_found"})
				c.Abort()
				return
			}

			tenantData, exists := tenantsClaim[domain].(map[string]interface{})
			
			// If the exact requested domain isn't in their JWT (e.g. testing on a generic Render URL),
			// gracefully fallback to the very first tenant they DO have access to.
			if !exists {
				for _, v := range tenantsClaim {
					if tData, ok := v.(map[string]interface{}); ok {
						tenantData = tData
						exists = true
						break
					}
				}
			}

			// If they literally have zero tenants in their JWT, reject them
			if !exists {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Session invalid or expired", "reason": "user_not_in_tenant"})
				c.Abort()
				return
			}

			// Assign the resolved tenant context
			if role, ok := tenantData["role"].(string); ok {
				c.Set("tenant_role", role)
			}
			if tenantID, ok := tenantData["id"].(string); ok {
				c.Set("tenant_id", tenantID)
			}
		}

		c.Next()
	}
}

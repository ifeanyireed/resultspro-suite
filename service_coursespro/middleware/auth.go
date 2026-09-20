package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	
	"service_coursespro/db"
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
			if !exists {
				// 1. Check if they are a global admin
				roles, _ := claims["roles"].([]interface{})
				isGlobalAdmin := false
				for _, r := range roles {
					if rStr, ok := r.(string); ok && (rStr == "platform-admin" || rStr == "superadmin") {
						isGlobalAdmin = true
						break
					}
				}
				
				// 2. If not a global admin, maybe the domain is just a generic preview URL (like Vercel or Render).
				// Let's fallback to the first tenant they actually have access to in their JWT.
				if !isGlobalAdmin {
					fallbackFound := false
					for _, v := range tenantsClaim {
						if tData, ok := v.(map[string]interface{}); ok {
							tenantData = tData
							exists = true
							fallbackFound = true
							break
						}
					}

					if !fallbackFound {
						c.JSON(http.StatusUnauthorized, gin.H{"error": "Session invalid or expired", "reason": "user_not_in_tenant"})
						c.Abort()
						return
					}
					
					// We found a fallback tenant, set it and skip the global admin DB check
					if role, ok := tenantData["role"].(string); ok {
						c.Set("tenant_role", role)
					}
					if tenantID, ok := tenantData["id"].(string); ok {
						c.Set("tenant_id", tenantID)
					}
				} else {
					// Global admins need their tenant resolved manually since it's not in the token
					type Tenant struct { ID string }
					var t Tenant
					if err := db.DB.Table("tenants").Select("id").Where("slug = ?", domain).First(&t).Error; err == nil {
						c.Set("tenant_id", t.ID)
						c.Set("tenant_role", "platform-admin")
					} else {
						c.JSON(http.StatusUnauthorized, gin.H{"error": "Tenant not found in database", "reason": "tenant_not_found"})
						c.Abort()
						return
					}
				}
			} else {
				if role, ok := tenantData["role"].(string); ok {
					c.Set("tenant_role", role)
				}
				if tenantID, ok := tenantData["id"].(string); ok {
					c.Set("tenant_id", tenantID)
				}
			}
		}

		c.Next()
	}
}

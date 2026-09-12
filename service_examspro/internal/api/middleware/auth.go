package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	
		"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: No token provided"})
			c.Abort()
			return
		}

		tokenString := strings.Split(authHeader, " ")[1]

		// Try multiple possible secrets from the ecosystem
		secretsToTry := []string{
			os.Getenv("JWT_SECRET"),
			"super-secret-key-123",
			"your-super-secret-jwt-key-change-in-production-min-32-chars",
			"resultspro-central-secret-key-change-in-production",
		}

		var token *jwt.Token
		var err error

		for _, secret := range secretsToTry {
			if secret == "" {
				continue
			}
			token, err = jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
				}
				return []byte(secret), nil
			})
			if err == nil && token.Valid {
				break
			}
		}

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid token claims"})
			c.Abort()
			return
		}

		var userID string
		if sub, ok := claims["sub"].(string); ok {
			userID = sub
		} else if uid, ok := claims["userId"].(string); ok {
			userID = uid
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid token claims, missing subject"})
			c.Abort()
			return
		}

		// Build the user object directly from JWT claims instead of querying the DB
		var user models.User
		user.ID = userID

		if hasIcan, ok := claims["has_ican"].(bool); ok {
			user.HasIcan = hasIcan
		}
		if coinBalance, ok := claims["coin_balance"].(float64); ok {
			user.CoinBalance = int(coinBalance)
		}
		if icanPlan, ok := claims["ican_plan"].(string); ok {
			user.IcanPlan = &icanPlan
		}
		if icanTarget, ok := claims["ican_target"].(string); ok {
			user.IcanTargets = &icanTarget
		}
		
		// Map roles (if present)
		if rolesInterface, ok := claims["roles"].([]interface{}); ok {
			for _, r := range rolesInterface {
				if rStr, ok := r.(string); ok && (rStr == "ADMIN" || rStr == "super-admin" || rStr == "tenant-admin") {
					user.IsAdmin = true
					user.Role = models.RoleAdmin
				}
			}
		}

		c.Set("userId", userID)
		c.Set("user", user)
		c.Next()
	}
}

func CheckRole(roles ...models.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		val, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		user := val.(models.User)
		authorized := false
		for _, role := range roles {
			if user.Role == role {
				authorized = true
				break
			}
		}

		if !authorized {
			c.JSON(http.StatusForbidden, gin.H{"error": fmt.Sprintf("Forbidden: Requires one of these roles: %v", roles)})
			c.Abort()
			return
		}

		c.Next()
	}
}

func IsAdmin() gin.HandlerFunc {
	return CheckRole(models.RoleAdmin)
}

func IsModerator() gin.HandlerFunc {
	return CheckRole(models.RoleAdmin, models.RoleModerator)
}

func IsStudent() gin.HandlerFunc {
	return CheckRole(models.RoleAdmin, models.RoleModerator, models.RoleStudent)
}

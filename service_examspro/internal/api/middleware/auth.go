package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"exams-resultspro-backend/internal/database"
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
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "super-secret-key-123"
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		})

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

		userID := claims["userId"].(string)

		var user models.User
		if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		// Check if user is banned
		if user.IsBanned {
			if user.BanExpiresAt != nil && time.Now().After(*user.BanExpiresAt) {
				// Ban expired, unban automatically
				user.IsBanned = false
				user.BanReason = nil
				user.BanExpiresAt = nil
				database.DB.Save(&user)
			} else {
				c.JSON(http.StatusForbidden, gin.H{
					"error":     "User is banned",
					"reason":    user.BanReason,
					"expiresAt": user.BanExpiresAt,
				})
				c.Abort()
				return
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

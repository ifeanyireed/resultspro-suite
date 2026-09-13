package handlers

import (
	"log"
	"net/http"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/olahol/melody"
)

type MetricsHandler struct{}

func (h *MetricsHandler) GetPublicMetrics(c *gin.Context) {
	var totalUsers int64
	database.DB.Model(&models.User{}).Count(&totalUsers)

	var activeBattles int64
	database.DB.Model(&models.Battle{}).Where("status = ?", "active").Count(&activeBattles)

	onlineCount := 0
	battleModeCount := 0
	if GlobalWS != nil {
		sessions, _ := GlobalWS.Melody.Sessions()
		onlineCount = len(sessions)

		battleModeCount = GlobalWS.GetGlobalCount(func(s *melody.Session) bool {
			ctx, exists := s.Get("context")
			if !exists {
				return false
			}
			ctxStr, ok := ctx.(string)
			return ok && (ctxStr == "battle-lobby" || ctxStr == "battle-match")
		})
		log.Printf("[Metrics] Online: %d, BattleMode: %d", onlineCount, battleModeCount)
	}

	c.JSON(http.StatusOK, gin.H{
		"onlineCount":     onlineCount,
		"battleModeCount": battleModeCount,
		"totalUsers":      totalUsers,
		"activeBattles":   activeBattles,
	})
}

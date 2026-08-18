package handlers

import (
	"crypto/rand"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"strconv"
	"sync"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BattleHandler struct {
	matchmakingQueue map[string][]string // queueKey -> userIds
	mu               sync.Mutex
}

func NewBattleHandler() *BattleHandler {
	return &BattleHandler{
		matchmakingQueue: make(map[string][]string),
	}
}

func GenerateRoomCode() string {
	const charset = "0123456789"
	code := make([]byte, 6)
	for i := range code {
		num, _ := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		code[i] = charset[num.Int64()]
	}
	return string(code)
}

func (h *BattleHandler) StartBattleCleanupTask() {
	ticker := time.NewTicker(10 * time.Second)
	go func() {
		for range ticker.C {
			// 1. Cleanup WAITING rooms
			var timeoutMins int = 10 // Default fallback
			var settings []models.SystemSetting
			if err := database.DB.Where("id = ?", "battle_cleanup_timeout").Limit(1).Find(&settings).Error; err == nil && len(settings) > 0 {
				if val, err := strconv.Atoi(settings[0].Value); err == nil {
					timeoutMins = val
				}
			}

			expiryTime := time.Now().Add(-time.Duration(timeoutMins) * time.Minute)

			var expiredBattles []models.Battle
			database.DB.Preload("Participants").
				Where("status = ? AND created_at < ?", "waiting", expiryTime).
				Find(&expiredBattles)

			for _, battle := range expiredBattles {
				if len(battle.Participants) > 1 {
					continue
				}
				
				log.Printf("Cleaning up unused battle room: %s", battle.ID)
				database.DB.Transaction(func(tx *gorm.DB) error {
					for _, p := range battle.Participants {
						tx.Model(&models.User{}).Where("id = ?", p.UserID).Update("coin_balance", gorm.Expr("coin_balance + ?", battle.StakePerPlayer))
					}
					return tx.Unscoped().Delete(&battle).Error
				})
			}

			// 2. Auto-finalize ACTIVE rooms (Time-up)
			var activeBattles []models.Battle
			database.DB.Preload("Participants").Where("status = ?", "active").Find(&activeBattles)
			
			for _, battle := range activeBattles {
				if battle.StartedAt == nil {
					continue
				}
				
				duration := time.Duration(battle.Duration) * time.Second
				if duration == 0 { duration = 60 * time.Second }

				// Add a 5 second grace period to ensure frontend has time to submit its own results
				if time.Since(*battle.StartedAt) > (duration + 5*time.Second) {
					log.Printf("Auto-finalizing timed out battle: %s", battle.ID)
					h.finalizeBattle(battle.ID, battle.Participants)
				}
			}
		}
	}()
}

func (h *BattleHandler) JoinQueue(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	var input struct {
		SubjectID int `json:"subjectId" binding:"required"`
		Stake     int `json:"stake" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check balance before joining queue
	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	if user.CoinBalance < input.Stake {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient coins for this stake"})
		return
	}

	queueKey := fmt.Sprintf("%d_%d", input.SubjectID, input.Stake)

	h.mu.Lock()
	defer h.mu.Unlock()

	// Check if already in queue
	for _, id := range h.matchmakingQueue[queueKey] {
		if id == userID {
			c.JSON(http.StatusOK, gin.H{"status": "waiting"})
			return
		}
	}

	h.matchmakingQueue[queueKey] = append(h.matchmakingQueue[queueKey], userID)

	if len(h.matchmakingQueue[queueKey]) >= 2 {
		p1 := h.matchmakingQueue[queueKey][0]
		p2 := h.matchmakingQueue[queueKey][1]
		h.matchmakingQueue[queueKey] = h.matchmakingQueue[queueKey][2:]

		battle, err := h.initiateBattle(p1, p2, input.SubjectID, input.Stake)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initiate battle"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "found", "battleId": battle.ID})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "waiting"})
}

func (h *BattleHandler) CreateBotBattle(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	var input struct {
		SubjectID int `json:"subjectId" binding:"required"`
		Stake     int `json:"stake"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if input.Stake > 0 && user.CoinBalance < input.Stake {
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient coins"})
		return
	}

	var battle *models.Battle
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// Deduct stake if any
		if input.Stake > 0 {
			if err := tx.Model(&models.User{}).Where("id = ?", userID).Update("coin_balance", gorm.Expr("coin_balance - ?", input.Stake)).Error; err != nil {
				return err
			}
			tx.Create(&models.CoinTransaction{
				ID:          uuid.New().String(),
				UserID:      userID,
				Amount:      -input.Stake,
				Type:        "battle_stake",
				Description: stringPtr("Stake for bot battle"),
			})
		}

		// Fetch questions
		var questions []models.Question
		if err := tx.Where("topic_id IN (SELECT id FROM topics WHERE subject_id = ?) AND type = 'mcq'", input.SubjectID).
			Order("RANDOM()").Limit(10).Preload("Options").Preload("Topic").Preload("Topic.Subject").Preload("Topic.Subject.Exam").Find(&questions).Error; err != nil {
			return err
		}

		now := time.Now()
		battle = &models.Battle{
			ID:              uuid.New().String(),
			RoomCode:        GenerateRoomCode(),
			SubjectID:       input.SubjectID,
			QuestionCount:   10,
			Duration:        60,
			RandomizeOrder:  true,
			SoundActivated:  true,
			StakePerPlayer:  input.Stake,
			MaxParticipants: 1,
			Status:          "active",
			IsBot:           true,
			CreatorID:       &userID,
			StartedAt:       &now,
			Questions:       questions,
		}
		if err := tx.Create(battle).Error; err != nil {
			return err
		}

		// Create participant
		participant := models.BattleParticipant{
			ID:       uuid.New().String(),
			BattleID: battle.ID,
			UserID:   userID,
			Status:   "joined",
			JoinedAt: now,
		}
		return tx.Create(&participant).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create bot battle"})
		return
	}

	c.JSON(http.StatusOK, battle)
}

func (h *BattleHandler) initiateBattle(p1, p2 string, subjectID, stake int) (*models.Battle, error) {
	var battle *models.Battle
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// Deduct stakes
		for _, pID := range []string{p1, p2} {
			if err := tx.Model(&models.User{}).Where("id = ?", pID).Update("coin_balance", gorm.Expr("coin_balance - ?", stake)).Error; err != nil {
				return err
			}
			transaction := models.CoinTransaction{
				ID:          uuid.New().String(),
				UserID:      pID,
				Amount:      -stake,
				Type:        "battle_stake",
				Description: stringPtr("Stake for battle"),
			}
			if err := tx.Create(&transaction).Error; err != nil {
				return err
			}
		}

		// Fetch questions
		var questions []models.Question
		if err := tx.Where("topic_id IN (SELECT id FROM topics WHERE subject_id = ?) AND type = 'mcq'", subjectID).
			Order("RANDOM()").Limit(10).Preload("Options").Preload("Topic").Preload("Topic.Subject").Preload("Topic.Subject.Exam").Find(&questions).Error; err != nil {
			return err
		}

		// Create battle
		now := time.Now()
		battle = &models.Battle{
			ID:                uuid.New().String(),
			RoomCode:          GenerateRoomCode(),
			SubjectID:         subjectID,
			QuestionCount:     10, // Default for matchmaking
			Duration:          60, // Default for matchmaking
			RandomizeOrder:    true,
			SoundActivated:    true,
			StakePerPlayer:    stake,
			MaxParticipants:   2,
			Status:            "active",
			StartedAt:         &now,
			Questions:         questions, // GORM will handle the many-to-many link
		}
		if err := tx.Create(battle).Error; err != nil {
			return err
		}

		// Create participants
		for _, pID := range []string{p1, p2} {
			participant := models.BattleParticipant{
				ID:       uuid.New().String(),
				BattleID: battle.ID,
				UserID:   pID,
				Status:   "joined",
				JoinedAt: now,
			}
			if err := tx.Create(&participant).Error; err != nil {
				return err
			}
		}

		// Notify via WS
		go func() {
			var fullBattle models.Battle
			database.DB.Preload("Participants.User").Where("id = ?", battle.ID).First(&fullBattle)

			for _, p := range fullBattle.Participants {
				var opponent *models.User
				for _, op := range fullBattle.Participants {
					if op.UserID != p.UserID {
						opponent = op.User
						break
					}
				}
				
				// Emit event to player
				GlobalWS.JoinRoom(p.UserID, battle.ID) // Both join battle room
				GlobalWS.EmitToUser(p.UserID, "battle:found", gin.H{
					"battleId":  battle.ID,
					"opponent":  opponent,
					"questions": questions,
				})
			}
		}()

		return nil
	})

	return battle, err
}

func (h *BattleHandler) CreateBattle(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	var input struct {
		SubjectID         int  `json:"subjectId" binding:"required"`
		Stake             int  `json:"stake" binding:"required"`
		MaxParticipants   int  `json:"maxParticipants"`
		IsPublic          bool `json:"isPublic"`
		QuestionCount     int  `json:"questionCount"`
		Duration          int  `json:"duration"`
		RandomizeOrder    bool `json:"randomizeOrder"`
		SoundActivated    bool `json:"soundActivated"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.MaxParticipants == 0 {
		input.MaxParticipants = 2
	}
	if input.QuestionCount == 0 {
		input.QuestionCount = 10
	}
	if input.Duration == 0 {
		input.Duration = 60
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.CoinBalance < input.Stake {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient coins"})
		return
	}

	var battle *models.Battle
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&user).Update("coin_balance", gorm.Expr("coin_balance - ?", input.Stake)).Error; err != nil {
			return err
		}

		tx.Create(&models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      userID,
			Amount:      -input.Stake,
			Type:        "battle_stake",
			Description: stringPtr(fmt.Sprintf("Stake for %d-player battle", input.MaxParticipants)),
		})

		battle = &models.Battle{
			ID:                uuid.New().String(),
			RoomCode:          GenerateRoomCode(),
			SubjectID:         input.SubjectID,
			QuestionCount:     input.QuestionCount,
			Duration:          input.Duration,
			RandomizeOrder:    input.RandomizeOrder,
			SoundActivated:    input.SoundActivated,
			StakePerPlayer:    input.Stake,
			MaxParticipants:   input.MaxParticipants,
			IsPublic:          input.IsPublic,
			CreatorID:         &userID,
			Status:            "waiting",
		}

		if err := tx.Create(battle).Error; err != nil {
			return err
		}

		tx.Create(&models.BattleParticipant{
			ID:       uuid.New().String(),
			BattleID: battle.ID,
			UserID:   userID,
			Status:   "joined",
			JoinedAt: time.Now(),
		})

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create battle"})
		return
	}

	database.DB.Preload("Participants.User").Preload("Subject").Where("id = ?", battle.ID).First(battle)
	c.JSON(http.StatusCreated, battle)
}

func (h *BattleHandler) JoinBattle(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)
	battleIDOrCode := c.Param("battleId")

	var battle models.Battle
	// Try numeric 6-digit code first, then fallback to UUID prefix or full UUID
	query := database.DB.Preload("Participants")
	if len(battleIDOrCode) == 6 {
		query = query.Where("room_code = ?", battleIDOrCode)
	} else if len(battleIDOrCode) == 8 {
		query = query.Where("id LIKE ?", battleIDOrCode+"%")
	} else {
		query = query.Where("id = ?", battleIDOrCode)
	}

	if err := query.First(&battle).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Battle not found"})
		return
	}

	if battle.Status != "waiting" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Battle not available"})
		return
	}

	if len(battle.Participants) >= battle.MaxParticipants {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Battle is full"})
		return
	}

	for _, p := range battle.Participants {
		if p.UserID == userID {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Already in battle"})
			return
		}
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.CoinBalance < battle.StakePerPlayer {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient coins"})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&user).Update("coin_balance", gorm.Expr("coin_balance - ?", battle.StakePerPlayer)).Error; err != nil {
			return err
		}

		tx.Create(&models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      userID,
			Amount:      -battle.StakePerPlayer,
			Type:        "battle_stake",
			Description: stringPtr(fmt.Sprintf("Stake for battle %s", battle.ID)),
		})

		participant := models.BattleParticipant{
			ID:       uuid.New().String(),
			BattleID: battle.ID,
			UserID:   userID,
			Status:   "joined",
			JoinedAt: time.Now(),
		}

		if err := tx.Create(&participant).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join battle"})
		return
	}

	// Notify room
	var p models.BattleParticipant
	database.DB.Preload("User").Where("user_id = ? AND battle_id = ?", userID, battle.ID).First(&p)
	GlobalWS.JoinRoom(userID, battle.ID)
	GlobalWS.EmitToRoom(battle.ID, "battle:player_joined", gin.H{"participant": p})

	c.JSON(http.StatusOK, p)
}

func (h *BattleHandler) StartBattle(c *gin.Context) {
	battleID := c.Param("id")
	log.Printf("StartBattle called for room: %s", battleID)
	
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	var battle models.Battle
	if err := database.DB.Preload("Participants").Where("id = ?", battleID).First(&battle).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Battle not found"})
		return
	}

	if battle.CreatorID == nil || *battle.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the host can start the battle"})
		return
	}

	if battle.Status != "waiting" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Battle is already started or finished"})
		return
	}

	minPlayers := 2 // Allow starting with at least 2 players for all custom rooms

	if len(battle.Participants) < minPlayers {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Need at least %d players to start", minPlayers)})
		return
	}

	// Fetch questions only if they don't exist yet
	var questions []models.Question
	database.DB.Model(&battle).Association("Questions").Find(&questions)

	if len(questions) == 0 {
		limit := battle.QuestionCount
		if limit == 0 { limit = 10 }
		
		query := database.DB.Where("topic_id IN (SELECT id FROM topics WHERE subject_id = ?) AND type = 'mcq'", battle.SubjectID).
			Preload("Options").Preload("Topic").Preload("Topic.Subject").Preload("Topic.Subject.Exam").Limit(limit)

		if battle.RandomizeOrder {
			query = query.Order("RANDOM()")
		} else {
			query = query.Order("id ASC")
		}
		
		if err := query.Find(&questions).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions"})
			return
		}

		err := database.DB.Transaction(func(tx *gorm.DB) error {
			// Persist questions
			return tx.Model(&battle).Association("Questions").Replace(questions)
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save questions"})
			return
		}
	}

	now := time.Now()
	if err := database.DB.Model(&battle).Updates(map[string]interface{}{"status": "active", "startedAt": &now}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start battle"})
		return
	}

	// Broadcast start
	GlobalWS.EmitToRoom(battle.ID, "battle:started", gin.H{
		"battleId":     battle.ID,
		"questions":    questions,
		"participants": battle.Participants,
	})

	c.JSON(http.StatusOK, gin.H{"message": "Battle started"})
}

func (h *BattleHandler) SubmitScore(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)

	var input struct {
		BattleID string `json:"battleId" binding:"required"`
		Score    int    `json:"score"`
		BotScore int    `json:"botScore"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var participant models.BattleParticipant
	if err := database.DB.Where("user_id = ? AND battle_id = ?", userID, input.BattleID).First(&participant).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Participant not found"})
		return
	}

	now := time.Now()
	participant.Score = input.Score
	participant.Status = "completed"
	participant.FinishedAt = &now
	database.DB.Save(&participant)

	// Fetch battle to check if it's a bot battle
	var battle models.Battle
	database.DB.Where("id = ?", input.BattleID).First(&battle)

	if battle.IsBot {
		now := time.Now()
		battle.Status = "completed"
		battle.EndedAt = &now
		battle.BotScore = input.BotScore
		database.DB.Save(&battle)

		// Reward logic for bot battles
		userWon := input.Score > input.BotScore
		if userWon {
			// Double the stake as reward (since it was deducted on start)
			reward := battle.StakePerPlayer * 2
			if reward > 0 {
				database.DB.Model(&models.User{}).Where("id = ?", userID).Update("coin_balance", gorm.Expr("coin_balance + ?", reward))
				database.DB.Create(&models.CoinTransaction{
					ID:          uuid.New().String(),
					UserID:      userID,
					Amount:      reward,
					Type:        "battle_win",
					Description: stringPtr(fmt.Sprintf("Won against Computer in %s", battle.RoomCode)),
					ReferenceID: &battle.ID,
				})
			}
			// ELO Boost
			database.DB.Model(&models.User{}).Where("id = ?", userID).Update("elo_rating", gorm.Expr("elo_rating + ?", 12)) // Half reward for bot
		} else if input.Score < input.BotScore {
			// ELO Penalty
			database.DB.Model(&models.User{}).Where("id = ? AND elo_rating >= ?", userID, 8).Update("elo_rating", gorm.Expr("elo_rating - ?", 8))
		}
		
		// Emit results via WebSocket so frontend redirects to result page
		GlobalWS.EmitToRoom(input.BattleID, "battle:finished", gin.H{
			"battleId": input.BattleID,
			"userScore": input.Score,
			"botScore": input.BotScore,
			"isBot": true,
			"stakePerPlayer": battle.StakePerPlayer,
		})
		
		c.JSON(http.StatusOK, participant)
		return
	}

	var allParticipants []models.BattleParticipant
	database.DB.Preload("User").Where("battle_id = ?", input.BattleID).Find(&allParticipants)

	allFinished := true
	for _, p := range allParticipants {
		if p.Status != "completed" {
			allFinished = false
			break
		}
	}

	if allFinished {
		go h.finalizeBattle(input.BattleID, allParticipants)
	} else {
		GlobalWS.EmitToRoom(input.BattleID, "battle:player_finished", gin.H{"userId": userID, "score": input.Score})
	}

	c.JSON(http.StatusOK, participant)
}

func (h *BattleHandler) finalizeBattle(battleID string, participants []models.BattleParticipant) {
	var battle models.Battle
	if err := database.DB.Where("id = ?", battleID).First(&battle).Error; err != nil {
		return
	}

	if battle.Status == "completed" && !battle.IsBot {
		GlobalWS.EmitToRoom(battleID, "battle:finished", gin.H{"battleId": battleID})
		return // Already finalized
	}

	// Bot Battle Finalization
	if battle.IsBot {
		if len(participants) == 0 {
			return
		}
		
		// In SubmitScore for bots, we don't have a real second participant.
		// We'll fetch the botScore we just saved or emitted.
		// Actually, let's keep it simple: the winner is determined in SubmitScore and emitted.
		// But we still need to handle ELO and Coins here for database persistence.
		
		// For bot battles, we might have stored the bot score in a temporary way or we calculate it here.
		// Let's assume we want to reward the user if they won.
		
		return 
	}

	// Sort by score
	for i := 0; i < len(participants); i++ {
		for j := i + 1; j < len(participants); j++ {
			if participants[j].Score > participants[i].Score {
				participants[i], participants[j] = participants[j], participants[i]
			}
		}
	}

	highScore := participants[0].Score
	var winners []models.BattleParticipant
	for _, p := range participants {
		if p.Score == highScore {
			winners = append(winners, p)
		}
	}

	totalPot := battle.StakePerPlayer * len(participants)
	sharePerWinner := totalPot / len(winners)

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Handle Winners
		for _, winner := range winners {
			// Credit coins
			if err := tx.Model(&models.User{}).Where("id = ?", winner.UserID).Update("coin_balance", gorm.Expr("coin_balance + ?", sharePerWinner)).Error; err != nil {
				return err
			}

			// Update ELO (+24 for win)
			if err := tx.Model(&models.User{}).Where("id = ?", winner.UserID).Update("elo_rating", gorm.Expr("elo_rating + ?", 24)).Error; err != nil {
				return err
			}

			tx.Create(&models.CoinTransaction{
				ID:          uuid.New().String(),
				UserID:      winner.UserID,
				Amount:      sharePerWinner,
				Type:        "battle_win",
				Description: stringPtr(fmt.Sprintf("Won battle %s", battle.RoomCode)),
				ReferenceID: &battleID,
			})
		}

		// 2. Handle Losers (if any)
		isDraw := len(winners) == len(participants)
		if !isDraw {
			winnerMap := make(map[string]bool)
			for _, w := range winners {
				winnerMap[w.UserID] = true
			}

			for _, p := range participants {
				if !winnerMap[p.UserID] {
					// Update ELO (-18 for loss, floor at 0)
					if err := tx.Model(&models.User{}).Where("id = ? AND elo_rating >= ?", p.UserID, 18).
						Update("elo_rating", gorm.Expr("elo_rating - ?", 18)).Error; err != nil {
						return err
					}
				}
			}
		}

		now := time.Now()
		return tx.Model(&battle).Updates(map[string]interface{}{"status": "completed", "endedAt": &now}).Error
	})

	if err == nil {
		GlobalWS.EmitToRoom(battleID, "battle:completed", gin.H{
			"winnerId":     winners[0].UserID, // Primary winner for UI
			"winners":      winners,
			"participants": participants,
		})
	}
}

func (h *BattleHandler) LeaveBattle(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)
	battleID := c.Param("id")

	var battle models.Battle
	if err := database.DB.Preload("Participants").Where("id = ?", battleID).First(&battle).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Battle not found"})
		return
	}

	var participant models.BattleParticipant
	if err := database.DB.Where("battle_id = ? AND user_id = ?", battleID, userID).First(&participant).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You are not a participant in this battle"})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// If battle is still waiting, refund the stake
		if battle.Status == "waiting" {
			if err := tx.Model(&models.User{}).Where("id = ?", userID).
				Update("coin_balance", gorm.Expr("coin_balance + ?", battle.StakePerPlayer)).Error; err != nil {
				return err
			}
			// Record refund
			tx.Create(&models.CoinTransaction{
				ID:          uuid.New().String(),
				UserID:      userID,
				Amount:      battle.StakePerPlayer,
				Type:        "refund",
				Description: stringPtr(fmt.Sprintf("Refund for leaving battle room %s", battle.ID)),
			})
		}

		// Remove participant
		if err := tx.Unscoped().Delete(&participant).Error; err != nil {
			return err
		}

		// If no more participants, mark battle as cancelled or delete it
		var count int64
		tx.Model(&models.BattleParticipant{}).Where("battle_id = ?", battleID).Count(&count)
		if count == 0 {
			tx.Unscoped().Delete(&battle)
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to leave battle"})
		return
	}

	GlobalWS.EmitToRoom(battleID, "battle:player_left", gin.H{"userId": userID})
	c.JSON(http.StatusOK, gin.H{"message": "Successfully left the battle"})
}

func (h *BattleHandler) GetActiveBattles(c *gin.Context) {
	var battles []models.Battle
	// Include both waiting and active public battles so they remain visible in lobby
	// Filter out computer/bot matches (is_bot = false)
	if err := database.DB.Preload("Subject").Preload("Participants.User").
		Where("status IN (?, ?) AND is_public = ? AND is_bot = ?", "waiting", "active", true, false).
		Order("created_at desc").Find(&battles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, battles)
}

func (h *BattleHandler) GetBattleHistory(c *gin.Context) {
	userID := c.MustGet("userId").(string)

	var history []models.BattleParticipant
	if err := database.DB.Preload("Battle.Subject").
		Preload("Battle.Participants.User").
		Where("user_id = ?", userID).
		Order("joined_at desc").
		Limit(20).
		Find(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch history"})
		return
	}

	c.JSON(http.StatusOK, history)
}

func (h *BattleHandler) GetBattleById(c *gin.Context) {
	idOrCode := c.Param("id")
	var battle models.Battle
	
	query := database.DB.Preload("Subject").Preload("Participants.User").Preload("Questions.Options")
	
	// Try numeric 6-digit code first, then fallback to UUID prefix or full UUID
	if len(idOrCode) == 6 {
		query = query.Where("room_code = ?", idOrCode)
	} else if len(idOrCode) == 8 {
		query = query.Where("id LIKE ?", idOrCode+"%")
	} else {
		query = query.Where("id = ?", idOrCode)
	}

	if err := query.First(&battle).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Battle not found"})
		return
	}
	c.JSON(http.StatusOK, battle)
}

// Tournaments
func (h *BattleHandler) GetCurrentTournament(c *gin.Context) {
	var tournament models.Tournament
	if err := database.DB.Where("status IN ?", []string{"upcoming", "active"}).Order("start_time asc").First(&tournament).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No active tournaments"})
		return
	}

	userId, exists := c.Get("userId")
	isRegistered := false
	if exists {
		var count int64
		database.DB.Model(&models.TournamentParticipant{}).Where("tournament_id = ? AND user_id = ?", tournament.ID, userId).Count(&count)
		isRegistered = count > 0
	}

	c.JSON(http.StatusOK, gin.H{
		"tournament":   tournament,
		"isRegistered": isRegistered,
	})
}

func (h *BattleHandler) RegisterForTournament(c *gin.Context) {
	userId := c.MustGet("userId").(string)
	tournamentId := c.Param("id")

	var tournament models.Tournament
	if err := database.DB.Where("id = ?", tournamentId).First(&tournament).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tournament not found"})
		return
	}

	if tournament.Status != "upcoming" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Registration is closed"})
		return
	}

	var user models.User
	database.DB.Where("id = ?", userId).First(&user)

	// Check if already registered
	var existing models.TournamentParticipant
	if err := database.DB.Where("tournament_id = ? AND user_id = ?", tournamentId, userId).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Already registered for this tournament"})
		return
	}

	if user.CoinBalance < tournament.RegistrationFee {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient coins"})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&user).Update("coin_balance", gorm.Expr("coin_balance - ?", tournament.RegistrationFee)).Error; err != nil {
			return err
		}
		
		if err := tx.Create(&models.CoinTransaction{
			ID:          uuid.New().String(),
			UserID:      userId,
			Amount:      -tournament.RegistrationFee,
			Type:        "tournament_fee",
			Description: stringPtr(fmt.Sprintf("Registration for %s", tournament.Title)),
		}).Error; err != nil {
			return err
		}

		if err := tx.Create(&models.TournamentParticipant{
			ID:           uuid.New().String(),
			TournamentID: tournament.ID,
			UserID:       userId,
			JoindAt:      time.Now(),
		}).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully registered"})
}

func (h *BattleHandler) GetTournamentRankings(c *gin.Context) {
	tournamentId := c.Param("id")

	var rankings []models.TournamentParticipant
	if err := database.DB.Preload("User").Where("tournament_id = ?", tournamentId).Order("total_score desc").Limit(100).Find(&rankings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rankings"})
		return
	}

	c.JSON(http.StatusOK, rankings)
}

// Admin handlers
func (h *BattleHandler) GetAllTournaments(c *gin.Context) {
	var tournaments []models.Tournament
	if err := database.DB.Order("start_time desc").Find(&tournaments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tournaments"})
		return
	}
	c.JSON(http.StatusOK, tournaments)
}

func (h *BattleHandler) CreateTournament(c *gin.Context) {
	var tournament models.Tournament
	if err := c.ShouldBindJSON(&tournament); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	tournament.ID = uuid.New().String()
	if tournament.Status == "" {
		tournament.Status = "upcoming"
	}
	if err := database.DB.Create(&tournament).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tournament"})
		return
	}
	c.JSON(http.StatusCreated, tournament)
}

func (h *BattleHandler) UpdateTournament(c *gin.Context) {
	id := c.Param("id")
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Model(&models.Tournament{}).Where("id = ?", id).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tournament"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Tournament updated"})
}

func (h *BattleHandler) DeleteTournament(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.Tournament{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tournament"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Tournament deleted"})
}

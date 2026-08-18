package handlers

import (
	"fmt"
	"net/http"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LiveGameHandler struct{}

func (h *LiveGameHandler) GetActiveRooms(c *gin.Context) {
	var rooms []models.LiveGameRoom
	if err := database.DB.Preload("Subject").Preload("Participants").Where("status != ?", "finished").Find(&rooms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rooms"})
		return
	}

	type RoomResponse struct {
		models.LiveGameRoom
		Count struct {
			Players int `json:"players"`
		} `json:"_count"`
	}

	response := make([]RoomResponse, len(rooms))
	for i, room := range rooms {
		response[i].LiveGameRoom = room
		response[i].Count.Players = len(room.Participants)
	}

	c.JSON(http.StatusOK, response)
}

func (h *LiveGameHandler) GetRoomById(c *gin.Context) {
	id := c.Param("roomId")
	var room models.LiveGameRoom
	if err := database.DB.Preload("Subject").
		Preload("Participants", func(db *gorm.DB) *gorm.DB {
			return db.Order("score DESC")
		}).
		Preload("Participants.User").
		Preload("CurrentQuestion.Options").
		Preload("ChatMessages.User").
		Where("id = ?", id).First(&room).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	c.JSON(http.StatusOK, room)
}

func (h *LiveGameHandler) CreateRoom(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	adminID := userIDVal.(string)

	var input struct {
		Title      string `json:"title"`
		SubjectID  int    `json:"subjectId" binding:"required"`
		EntryFee   int    `json:"entryFee"`
		MaxPlayers int    `json:"maxPlayers"`
		Type       string `json:"type"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	room := models.LiveGameRoom{
		ID:         uuid.New().String(),
		AdminID:    adminID,
		Title:      &input.Title,
		SubjectID:  input.SubjectID,
		EntryFee:   input.EntryFee,
		MaxPlayers: input.MaxPlayers,
		Type:       input.Type,
		Status:     "pending",
	}

	if err := database.DB.Create(&room).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create room"})
		return
	}

	database.DB.Preload("Subject").First(&room, "id = ?", room.ID)
	c.JSON(http.StatusCreated, room)
}

func (h *LiveGameHandler) JoinRoom(c *gin.Context) {
	userIDVal, _ := c.Get("userId")
	userID := userIDVal.(string)
	roomID := c.Param("roomId")

	var room models.LiveGameRoom
	if err := database.DB.Preload("Participants").Where("id = ?", roomID).First(&room).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	if room.Status == "finished" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room is already finished"})
		return
	}

	if len(room.Participants) >= room.MaxPlayers {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room is full"})
		return
	}

	// Check if already in room
	for _, p := range room.Participants {
		if p.UserID == userID {
			c.JSON(http.StatusOK, p)
			return
		}
	}

	// Deduct entry fee
	if room.EntryFee > 0 {
		var user models.User
		database.DB.Where("id = ?", userID).First(&user)
		if user.CoinBalance < room.EntryFee {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient coins"})
			return
		}

		err := database.DB.Transaction(func(tx *gorm.DB) error {
			if err := tx.Model(&models.User{}).Where("id = ?", userID).Update("coin_balance", gorm.Expr("coin_balance - ?", room.EntryFee)).Error; err != nil {
				return err
			}
			tx.Create(&models.CoinTransaction{
				ID:          uuid.New().String(),
				UserID:      userID,
				Amount:      -room.EntryFee,
				Type:        "spent",
				Description: stringLivePtr(fmt.Sprintf("Entry fee for live room %s", room.ID)),
			})
			return nil
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process entry fee"})
			return
		}
	}

	participant := models.LiveGameParticipant{
		ID:       uuid.New().String(),
		RoomID:   roomID,
		UserID:   userID,
		JoinedAt: time.Now(),
	}

	if err := database.DB.Create(&participant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join room"})
		return
	}

	GlobalWS.JoinRoom(userID, roomID)
	GlobalWS.EmitToRoom(roomID, "live:player_joined", gin.H{"userId": userID})

	c.JSON(http.StatusOK, participant)
}

func (h *LiveGameHandler) EndMatch(c *gin.Context) {
	roomID := c.Param("roomId")
	var room models.LiveGameRoom
	if err := database.DB.Preload("Participants.User").Where("id = ?", roomID).First(&room).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	if room.Status == "finished" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room already finished"})
		return
	}

	// Distribute prizes
	participants := room.Participants
	if len(participants) == 0 {
		room.Status = "finished"
		database.DB.Save(&room)
		c.JSON(http.StatusOK, gin.H{"message": "Room closed with no participants"})
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

	totalPot := room.EntryFee * len(participants)
	
	// Prize distribution: 1st: 60%, 2nd: 30%, 3rd: 10% (if applicable)
	winners := []gin.H{}
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		for i, p := range participants {
			if i >= 3 { break }
			
			// For simplicity, let's do winner takes all if entry fee > 0
			if i == 0 && totalPot > 0 {
				if err := tx.Model(&models.User{}).Where("id = ?", p.UserID).Update("coin_balance", gorm.Expr("coin_balance + ?", totalPot)).Error; err != nil {
					return err
				}
				tx.Create(&models.CoinTransaction{
					ID:          uuid.New().String(),
					UserID:      p.UserID,
					Amount:      totalPot,
					Type:        "live_win",
					Description: stringLivePtr(fmt.Sprintf("Won live room %s", room.ID)),
				})
				winners = append(winners, gin.H{"userId": p.UserID, "reward": totalPot, "rank": 1})
			}
		}

		if err := tx.Model(&models.LiveGameRoom{}).Where("id = ?", roomID).Update("status", "finished").Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to finalize room"})
		return
	}

	GlobalWS.EmitToRoom(roomID, "game:finished", gin.H{"winners": winners})
	c.JSON(http.StatusOK, gin.H{"message": "Match ended and prizes distributed", "winners": winners})
}

func (h *LiveGameHandler) TerminateRoom(c *gin.Context) {
	roomID := c.Param("roomId")
	var room models.LiveGameRoom
	if err := database.DB.Preload("Participants").Where("id = ?", roomID).First(&room).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	// Refund entry fees
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if room.EntryFee > 0 {
			for _, p := range room.Participants {
				if err := tx.Model(&models.User{}).Where("id = ?", p.UserID).Update("coin_balance", gorm.Expr("coin_balance + ?", room.EntryFee)).Error; err != nil {
					return err
				}
				tx.Create(&models.CoinTransaction{
					ID:          uuid.New().String(),
					UserID:      p.UserID,
					Amount:      room.EntryFee,
					Type:        "refund",
					Description: stringLivePtr(fmt.Sprintf("Refund for terminated live room %s", room.ID)),
				})
			}
		}

		// Delete room or mark as finished
		if err := tx.Delete(&room).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to terminate room"})
		return
	}

	GlobalWS.EmitToRoom(roomID, "room:terminated", gin.H{"roomId": roomID})
	c.JSON(http.StatusOK, gin.H{"message": "Room terminated and refunds processed"})
}

func stringLivePtr(s string) *string {
	return &s
}

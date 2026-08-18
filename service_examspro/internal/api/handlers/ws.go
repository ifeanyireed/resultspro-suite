package handlers

import (
	"encoding/json"
	"log"
	"strings"
	"sync"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/olahol/melody"
	"gorm.io/gorm"
)

type SocketManager struct {
	Melody      *melody.Melody
	UserSockets map[string]*melody.Session // userId -> session
	mu          sync.RWMutex
}

var GlobalWS *SocketManager

func InitWS() *SocketManager {
	m := melody.New()
	
	// Increase limits for large payloads (questions/leaderboards)
	m.Config.MaxMessageSize = 1024 * 1024 // 1MB
	m.Config.WriteWait = 10 * time.Second
	m.Config.PongWait = 60 * time.Second
	m.Config.PingPeriod = (m.Config.PongWait * 9) / 10

	manager := &SocketManager{
		Melody:      m,
		UserSockets: make(map[string]*melody.Session),
	}

	m.HandleConnect(func(s *melody.Session) {
		log.Printf(">>> NEW WS CONNECTION: %s | Origin: %s", s.Request.URL.String(), s.Request.Header.Get("Origin"))
		userID := s.Request.URL.Query().Get("userId")
		guestID := s.Request.URL.Query().Get("guestId")
		roomID := s.Request.URL.Query().Get("roomId")
		context := s.Request.URL.Query().Get("context")
		isAdmin := s.Request.URL.Query().Get("isAdmin") == "true"

		if userID != "" {
			manager.mu.Lock()
			manager.UserSockets[userID] = s
			manager.mu.Unlock()
			s.Set("userId", userID)
			if context != "" {
				s.Set("context", context)
			}
			if isAdmin {
				s.Set("isAdmin", true)
				log.Printf("[WS] Admin %s connected to room %s", userID, roomID)
			} else {
				log.Printf("[WS] Player %s connected to room %s", userID, roomID)
			}
		} else if guestID != "" {
			s.Set("guestId", guestID)
			log.Printf("[WS] Spectator %s connected to room %s", guestID, roomID)
		}

		if roomID != "" {
			s.Set("room", roomID)
			// Immediate sync
			manager.SyncRoomCount(roomID)
			// Safety re-sync
			time.AfterFunc(1 * time.Second, func() {
				manager.SyncRoomCount(roomID)
			})
		}
	})

	m.HandleDisconnect(func(s *melody.Session) {
		val, _ := s.Get("userId")
		roomVal, _ := s.Get("room")
		log.Printf("<<< WS DISCONNECTED: user=%v, room=%v", val, roomVal)
		
		if userID, ok := val.(string); ok {
			manager.mu.Lock()
			delete(manager.UserSockets, userID)
			manager.mu.Unlock()
		}

		if roomID, ok := roomVal.(string); ok {
			log.Printf("[WS] Session disconnected from room %s", roomID)
			manager.SyncRoomCount(roomID)
		}
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		var payload struct {
			Event string      `json:"event"`
			Data  interface{} `json:"data"`
		}
		if err := json.Unmarshal(msg, &payload); err != nil {
			log.Printf("WS JSON error: %v", err)
			return
		}

		switch payload.Event {
		case "join_room":
			data, ok := payload.Data.(map[string]interface{})
			if !ok { return }
			roomID, _ := data["roomId"].(string)
			userID, _ := s.Get("userId")
			if uID, ok := userID.(string); ok {
				manager.JoinRoom(uID, roomID)
			}
			s.Set("room", roomID) 
			manager.SyncRoomCount(roomID)
		case "admin:start_match":
			data, _ := payload.Data.(map[string]interface{})
			roomID, _ := data["roomId"].(string)
			
			now := time.Now()
			database.DB.Model(&models.LiveGameRoom{}).Where("id = ?", roomID).Updates(map[string]interface{}{
				"status": "active",
				"startedAt": &now,
			})
			
			manager.EmitToRoom(roomID, "game:started", nil)
		case "admin:push_question":
			data, _ := payload.Data.(map[string]interface{})
			roomID, _ := data["roomId"].(string)
			
			updates := map[string]interface{}{}
			if idx, ok := data["questionIndex"].(float64); ok {
				updates["current_question_index"] = int(idx)
			}
			
			if q, ok := data["question"].(map[string]interface{}); ok {
				if id, ok := q["id"].(string); ok {
					updates["current_question_id"] = id
				}
			}

			if len(updates) > 0 {
				database.DB.Model(&models.LiveGameRoom{}).Where("id = ?", roomID).Updates(updates)
			}
			
			manager.EmitToRoom(roomID, "game:question_reveal", data)
		case "admin:end_match":
			data, _ := payload.Data.(map[string]interface{})
			roomID, _ := data["roomId"].(string)
			manager.EmitToRoom(roomID, "game:finished", gin.H{"winners": []interface{}{}})
		case "game:submit_answer":
			data, _ := payload.Data.(map[string]interface{})
			roomID, _ := data["roomId"].(string)
			userID, _ := data["userId"].(string)
			isCorrect, _ := data["isCorrect"].(bool)
			timeLeft, _ := data["timeLeftSec"].(float64)

			if isCorrect {
				points := int(timeLeft * 10)
				if points <= 0 { points = 10 }
				
				log.Printf("[WS] Correct answer from %s in room %s. Points: %d (timeLeft: %v)", userID, roomID, points, timeLeft)
				
				// Verify participant exists before update
				var check models.LiveGameParticipant
				if err := database.DB.Where("room_id = ? AND user_id = ?", roomID, userID).First(&check).Error; err != nil {
					log.Printf("[WS] ERROR: Could not find participant record for user %s in room %s: %v", userID, roomID, err)
				}

				result := database.DB.Model(&models.LiveGameParticipant{}).
					Where("room_id = ? AND user_id = ?", roomID, userID).
					Update("score", gorm.Expr("score + ?", points))
				
				if result.Error != nil {
					log.Printf("[WS] Error updating score: %v", result.Error)
				}
				if result.RowsAffected == 0 {
					log.Printf("[WS] WARNING: No participant rows affected for score update. User %s, Room %s", userID, roomID)
				}
			} else {
				log.Printf("[WS] Incorrect answer from %s in room %s", userID, roomID)
			}

			// Small delay to ensure DB write is finalized before re-fetching
			time.Sleep(50 * time.Millisecond)

			// Fetch fresh leaderboard
			var participants []models.LiveGameParticipant
			if err := database.DB.Preload("User").
				Where("room_id = ?", roomID).
				Order("score DESC, joined_at ASC").
				Find(&participants).Error; err != nil {
				log.Printf("[WS] Error fetching leaderboard: %v", err)
			}
			
			for i, p := range participants {
				log.Printf("[WS] Leaderboard[%d]: User %s, Score %d", i, p.UserID, p.Score)
			}
			
			manager.EmitToRoom(roomID, "game:leaderboard_update", participants)
		case "chat:message":
			data, ok := payload.Data.(map[string]interface{})
			if !ok { return }
			roomID, _ := data["roomId"].(string)
			text, _ := data["text"].(string)
			
			userID, _ := s.Get("userId")
			guestID, _ := s.Get("guestId")
			
			var senderName string
			var senderID string

			if uID, ok := userID.(string); ok {
				senderID = uID
				var user models.User
				database.DB.Where("id = ?", uID).First(&user)
				if user.Name != nil {
					senderName = *user.Name
				} else {
					senderName = user.Email
				}

				msg := models.LiveRoomChatMessage{
					ID:        uuid.New().String(),
					RoomID:    roomID,
					UserID:    uID,
					Content:   text,
					CreatedAt: time.Now(),
				}
				database.DB.Create(&msg)
			} else if gID, ok := guestID.(string); ok {
				senderID = gID
				senderName = "Spectator " + gID[len(gID)-4:]
			}

			if senderID != "" {
				broadcastData := gin.H{
					"roomId":   roomID,
					"text":     text,
					"userId":   senderID,
					"userName": senderName,
					"time":     time.Now().Format("15:04"),
				}
				manager.EmitToRoom(roomID, "chat:message", broadcastData)
			}
		case "admin:room_broadcast":
			data, ok := payload.Data.(map[string]interface{})
			if !ok { return }
			roomID, _ := data["roomId"].(string)
			text, _ := data["text"].(string)
			
			manager.EmitToRoom(roomID, "chat:message", gin.H{
				"userId":   "system-admin",
				"userName": "ROOM ADMIN",
				"text":     text,
				"time":     time.Now().Format("15:04"),
				"system":   true,
			})
		case "battle:update_progress":
			data, ok := payload.Data.(map[string]interface{})
			if !ok { return }
			roomID, _ := data["battleId"].(string)
			userID, _ := data["userId"].(string)
			progress, _ := data["progress"].(float64)
			score, _ := data["score"].(float64)

			// Update in DB for persistence and admin monitor
			database.DB.Model(&models.BattleParticipant{}).
				Where("battle_id = ? AND user_id = ?", roomID, userID).
				Updates(map[string]interface{}{
					"progress": int(progress),
					"score":    int(score),
				})

			manager.EmitToRoom(roomID, "battle:progress", data)
		}
	})

	GlobalWS = manager
	return manager
}

func (m *SocketManager) SyncRoomCount(roomID string) {
	count := 0
	sessions, _ := m.Melody.Sessions()
	
	for _, s := range sessions {
		room, exists := s.Get("room")
		if exists {
			if rID, ok := room.(string); ok && strings.EqualFold(strings.TrimSpace(rID), strings.TrimSpace(roomID)) {
				// EXCLUDE ADMINS FROM PLAYER COUNT
				if isAdmin, ok := s.Get("isAdmin"); ok && isAdmin.(bool) {
					continue
				}
				count++
			}
		}
	}
	m.EmitToRoom(roomID, "live:room_sync", gin.H{"count": count})
}

func (m *SocketManager) GetGlobalCount(filter func(*melody.Session) bool) int {
	count := 0
	sessions, _ := m.Melody.Sessions()
	for _, s := range sessions {
		if filter(s) {
			count++
		}
	}
	return count
}

func (m *SocketManager) EmitToUser(userID string, event string, data interface{}) {
	m.mu.RLock()
	session, ok := m.UserSockets[userID]
	m.mu.RUnlock()

	if ok {
		msg := map[string]interface{}{
			"event": event,
			"data":  data,
		}
		bytes, _ := json.Marshal(msg)
		session.Write(bytes)
	}
}

func (m *SocketManager) EmitToRoom(roomID string, event string, data interface{}) {
	msg := map[string]interface{}{
		"event": event,
		"data":  data,
	}
	bytes, _ := json.Marshal(msg)
	
	m.Melody.BroadcastFilter(bytes, func(q *melody.Session) bool {
		roomVal, exists := q.Get("room")
		if !exists { return false }
		rID, ok := roomVal.(string)
		if !ok { return false }
		return strings.EqualFold(strings.TrimSpace(rID), strings.TrimSpace(roomID))
	})
}

func (m *SocketManager) JoinRoom(userID string, roomID string) {
    m.mu.RLock()
    session, ok := m.UserSockets[userID]
    m.mu.RUnlock()

    if ok {
        session.Set("room", roomID)
    } else {
		sessions, _ := m.Melody.Sessions()
		for _, s := range sessions {
			val, exists := s.Get("userId")
			if exists && val.(string) == userID {
				s.Set("room", roomID)
			}
		}
	}
}

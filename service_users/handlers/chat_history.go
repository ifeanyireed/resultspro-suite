package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"service_users.resultspro.ng/db"
)

type ChatHistoryRecord struct {
	ID        string    `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	SessionID string    `json:"session_id"`
	Sender    string    `json:"sender"`
	Message   string    `json:"text" gorm:"column:message"`
	CreatedAt time.Time `json:"timestamp"`
}

func (ChatHistoryRecord) TableName() string {
	return "support_live_chats"
}

func GetChatHistory(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("session_id")
	if sessionID == "" {
		http.Error(w, "session_id is required", http.StatusBadRequest)
		return
	}

	var history []ChatHistoryRecord
	db.GormDB.Where("session_id = ?", sessionID).Order("created_at ASC").Find(&history)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(history)
}

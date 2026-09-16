package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"service_users.resultspro.ng/db"
)

type ChatSessionPreview struct {
	SessionID string    `json:"session_id"`
	Sender    string    `json:"sender"`
	Message   string    `json:"text"`
	Timestamp time.Time `json:"timestamp"`
}

func GetChatSessions(w http.ResponseWriter, r *http.Request) {
	var previews []ChatSessionPreview
	// Query to get the latest message for each session ID
	query := `
		SELECT DISTINCT ON (session_id) 
			session_id, sender, message, created_at as timestamp 
		FROM support_live_chats 
		ORDER BY session_id, created_at DESC
	`
	db.GormDB.Raw(query).Scan(&previews)

	// Sort previews in Go to have the most recent sessions first
	// (Since we used DISTINCT ON session_id, we can't easily order by created_at DESC overall without a subquery)
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(previews)
}

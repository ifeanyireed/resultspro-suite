package ws

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for now
	},
}

// Client represents a connected WebSocket user
type Client struct {
	ID       string
	TenantID string
	UserID   string
	Room     string
	Conn     *websocket.Conn
}

// Hub manages active clients and broadcasts
type Hub struct {
	sync.RWMutex
	Clients map[*Client]bool
}

var GlobalHub = &Hub{
	Clients: make(map[*Client]bool),
}

// HandleWS upgrades the HTTP connection and registers the client
func HandleWS(c *gin.Context) {
	// Require authentication
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	tenantID, _ := c.Get("tenant_id")
	room := c.Query("room")

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WS Upgrade Error:", err)
		return
	}

	client := &Client{
		ID:       time.Now().String(),
		TenantID: tenantID.(string),
		UserID:   userID.(string),
		Room:     room,
		Conn:     conn,
	}

	GlobalHub.Lock()
	GlobalHub.Clients[client] = true
	GlobalHub.Unlock()

	// Broadcast that a user joined
	GlobalHub.BroadcastPresence(tenantID.(string))

	// Keep alive loop
	defer func() {
		GlobalHub.Lock()
		delete(GlobalHub.Clients, client)
		GlobalHub.Unlock()
		client.Conn.Close()
		// Broadcast that a user left
		GlobalHub.BroadcastPresence(tenantID.(string))
	}()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

// BroadcastPresence sends the list of active users to all clients in a tenant
func (h *Hub) BroadcastPresence(tenantID string) {
	h.RLock()
	defer h.RUnlock()

	// Aggregate active users for this tenant
	activeUsers := make(map[string]bool)
	for client := range h.Clients {
		if client.TenantID == tenantID {
			activeUsers[client.UserID] = true
		}
	}

	var usersList []string
	for uid := range activeUsers {
		usersList = append(usersList, uid)
	}

	message, _ := json.Marshal(map[string]interface{}{
		"type":    "PRESENCE_UPDATE",
		"active_users": usersList,
	})

	// Send to all clients in the tenant
	for client := range h.Clients {
		if client.TenantID == tenantID {
			_ = client.Conn.WriteMessage(websocket.TextMessage, message)
		}
	}
}

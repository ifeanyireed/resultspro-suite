package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for this demo
	},
}

type Client struct {
	ID        string
	SessionID string // The guest's unique ID
	Role      string // "guest" or "staff"
	Conn      *websocket.Conn
	Send      chan []byte
}

type ChatHub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mutex      sync.Mutex
}

var Hub = ChatHub{
	broadcast:  make(chan []byte),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
}

func init() {
	go Hub.Run()
}

func (h *ChatHub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			h.mutex.Unlock()
		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
			}
			h.mutex.Unlock()
		case message := <-h.broadcast:
			var chatMsg ChatMessage
			if err := json.Unmarshal(message, &chatMsg); err != nil {
				continue // Skip invalid messages
			}

			h.mutex.Lock()
			for client := range h.clients {
				// Routing logic
				shouldSend := false
				if client.Role == "staff" {
					// Staff see everything
					shouldSend = true
				} else if client.SessionID == chatMsg.SessionID {
					// Guests only see messages for their session
					shouldSend = true
				}

				if shouldSend {
					select {
					case client.Send <- message:
					default:
						close(client.Send)
						delete(h.clients, client)
					}
				}
			}
			h.mutex.Unlock()
		}
	}
}

type ChatMessage struct {
	ID        string    `json:"id"`
	SessionID string    `json:"session_id"` // Used to route replies
	Sender    string    `json:"sender"`     // e.g. "Guest" or "Support"
	Text      string    `json:"text"`
	Timestamp time.Time `json:"timestamp"`
}

func HandleChatWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WS Upgrade Error:", err)
		return
	}

	role := r.URL.Query().Get("role")
	sessionID := r.URL.Query().Get("session_id")

	if role == "" {
		role = "guest"
	}
	if sessionID == "" && role == "guest" {
		sessionID = uuid.New().String()
	}

	client := &Client{
		ID:        uuid.New().String(),
		SessionID: sessionID,
		Role:      role,
		Conn:      conn,
		Send:      make(chan []byte, 256),
	}

	Hub.register <- client

	go writePump(client)
	go readPump(client)
}

func readPump(client *Client) {
	defer func() {
		Hub.unregister <- client
		client.Conn.Close()
	}()

	for {
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		var chatMsg ChatMessage
		if err := json.Unmarshal(message, &chatMsg); err != nil {
			chatMsg = ChatMessage{
				ID:        uuid.New().String(),
				SessionID: client.SessionID,
				Sender:    "Unknown",
				Text:      string(message),
				Timestamp: time.Now(),
			}
		} else {
			if chatMsg.ID == "" {
				chatMsg.ID = uuid.New().String()
			}
			chatMsg.Timestamp = time.Now()
			// Enforce session ID if guest (prevent spoofing)
			if client.Role == "guest" {
				chatMsg.SessionID = client.SessionID
				chatMsg.Sender = "Guest"
			}
		}

		payload, _ := json.Marshal(chatMsg)
		Hub.broadcast <- payload
	}
}

func writePump(client *Client) {
	defer func() {
		client.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-client.Send:
			if !ok {
				client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := client.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(client.Send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-client.Send)
			}

			if err := w.Close(); err != nil {
				return
			}
		}
	}
}

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
	staffCount int
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

type SystemMessage struct {
	Type        string `json:"type"`         // "status" or "message"
	StaffOnline bool   `json:"staff_online"` // true if staff > 0
}

func (h *ChatHub) broadcastStaffStatus(online bool) {
	msg := SystemMessage{
		Type:        "status",
		StaffOnline: online,
	}
	payload, _ := json.Marshal(msg)
	for client := range h.clients {
		if client.Role == "guest" {
			select {
			case client.Send <- payload:
			default:
				close(client.Send)
				delete(h.clients, client)
			}
		}
	}
}

func (h *ChatHub) sendStaffStatusTo(client *Client, online bool) {
	msg := SystemMessage{
		Type:        "status",
		StaffOnline: online,
	}
	payload, _ := json.Marshal(msg)
	select {
	case client.Send <- payload:
	default:
	}
}

func (h *ChatHub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			if client.Role == "staff" {
				h.staffCount++
				if h.staffCount == 1 {
					h.broadcastStaffStatus(true)
				}
			} else {
				h.sendStaffStatusTo(client, h.staffCount > 0)
			}
			h.mutex.Unlock()
		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
				if client.Role == "staff" {
					h.staffCount--
					if h.staffCount == 0 {
						h.broadcastStaffStatus(false)
					}
				}
			}
			h.mutex.Unlock()
		case message := <-h.broadcast:
			// Just pass through to correct clients
			var chatMsg ChatMessage
			if err := json.Unmarshal(message, &chatMsg); err != nil {
				continue
			}

			h.mutex.Lock()
			for client := range h.clients {
				shouldSend := false
				if client.Role == "staff" {
					shouldSend = true
				} else if client.SessionID == chatMsg.SessionID {
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
	Type      string    `json:"type"` // "message"
	ID        string    `json:"id"`
	SessionID string    `json:"session_id"`
	Sender    string    `json:"sender"`
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
			break
		}

		var chatMsg ChatMessage
		if err := json.Unmarshal(message, &chatMsg); err != nil {
			chatMsg = ChatMessage{
				Type:      "message",
				ID:        uuid.New().String(),
				SessionID: client.SessionID,
				Sender:    "Unknown",
				Text:      string(message),
				Timestamp: time.Now(),
			}
		} else {
			chatMsg.Type = "message"
			if chatMsg.ID == "" {
				chatMsg.ID = uuid.New().String()
			}
			chatMsg.Timestamp = time.Now()
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

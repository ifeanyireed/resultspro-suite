package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/middleware"
	"service_users.resultspro.ng/utils"
)

func HandleCreateTicket(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userIDVal := r.Context().Value(middleware.UserContextKey)
	if userIDVal == nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	userID := userIDVal.(string)

	var input struct {
		Subject   string `json:"subject"`
		Category  string `json:"category"`
		Message   string `json:"message"`
		Priority  string `json:"priority"`
		AppModule string `json:"app_module"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	if input.Priority == "" {
		input.Priority = "normal"
	}

	// Auto-assign
	var assignedTo sql.NullString
	var staffID string
	err := db.GormDB.Raw("SELECT user_id FROM support_staff_status WHERE is_active = true ORDER BY RANDOM() LIMIT 1").Row().Scan(&staffID)
	if err == nil && staffID != "" {
		assignedTo = sql.NullString{String: staffID, Valid: true}
	}

	ticketID := uuid.New().String()
	now := time.Now().UTC()

	err = db.GormDB.Exec("INSERT INTO support_tickets (id, user_id, assigned_to, subject, category, message, status, priority, app_module, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?)",
		ticketID, userID, assignedTo, input.Subject, input.Category, input.Message, input.Priority, input.AppModule, now, now).Error

	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create ticket")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"message": "Ticket created successfully",
		"ticket_id": ticketID,
		"assigned_to": assignedTo.String,
	})
}

func HandleGetUserTickets(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userIDVal := r.Context().Value(middleware.UserContextKey)
	if userIDVal == nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	userID := userIDVal.(string)

	type Ticket struct {
		ID         string    `json:"id"`
		Subject    string    `json:"subject"`
		Category   string    `json:"category"`
		Message    string    `json:"message"`
		Status     string    `json:"status"`
		Priority   string    `json:"priority"`
		AppModule  string    `json:"app_module"`
		CreatedAt  time.Time `json:"created_at"`
	}

	var tickets []Ticket
	db.GormDB.Raw("SELECT id, subject, category, message, status, priority, app_module, created_at FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC", userID).Scan(&tickets)

	utils.JSONResponse(w, http.StatusOK, tickets)
}

func HandleGetAdminTickets(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	type Ticket struct {
		ID           string    `json:"id"`
		UserID       string    `json:"user_id"`
		UserFullName string    `json:"user_full_name"`
		AssignedTo   string    `json:"assigned_to"`
		Subject      string    `json:"subject"`
		Category     string    `json:"category"`
		Message      string    `json:"message"`
		Status       string    `json:"status"`
		Priority     string    `json:"priority"`
		AppModule    string    `json:"app_module"`
		CreatedAt    time.Time `json:"created_at"`
	}

	var tickets []Ticket
	db.GormDB.Raw(`
		SELECT t.id, t.user_id, u.full_name as user_full_name, t.assigned_to, t.subject, t.category, t.message, t.status, t.priority, t.app_module, t.created_at 
		FROM support_tickets t 
		LEFT JOIN users u ON t.user_id = u.id 
		ORDER BY t.created_at DESC
	`).Scan(&tickets)

	utils.JSONResponse(w, http.StatusOK, tickets)
}

func HandleUpdateTicketStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	ticketID := strings.TrimPrefix(r.URL.Path, "/api/v1/support/tickets/")
	ticketID = strings.TrimSuffix(ticketID, "/status")

	var input struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := db.GormDB.Exec("UPDATE support_tickets SET status = ?, updated_at = ? WHERE id = ?", input.Status, time.Now().UTC(), ticketID).Error
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update ticket")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"message": "Ticket updated"})
}

func HandleSetStaffStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userIDVal := r.Context().Value(middleware.UserContextKey)
	if userIDVal == nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	userID := userIDVal.(string)

	var input struct {
		IsActive bool `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	var existsInDB bool
	db.GormDB.Raw("SELECT EXISTS(SELECT 1 FROM support_staff_status WHERE user_id = ?)", userID).Scan(&existsInDB)

	if existsInDB {
		db.GormDB.Exec("UPDATE support_staff_status SET is_active = ?, updated_at = ? WHERE user_id = ?", input.IsActive, time.Now().UTC(), userID)
	} else {
		db.GormDB.Exec("INSERT INTO support_staff_status (user_id, is_active, updated_at) VALUES (?, ?, ?)", userID, input.IsActive, time.Now().UTC())
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"message": "Status updated"})
}

func HandleGetStaffStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userIDVal := r.Context().Value(middleware.UserContextKey)
	if userIDVal == nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	userID := userIDVal.(string)

	var isActive bool
	err := db.GormDB.Raw("SELECT is_active FROM support_staff_status WHERE user_id = ?", userID).Row().Scan(&isActive)
	if err != nil {
		isActive = false
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"is_active": isActive})
}

func HandleTicketMessages(w http.ResponseWriter, r *http.Request) {
	// Extract ticket ID from /api/v1/support/tickets/{id}/messages
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 6 {
		utils.JSONError(w, http.StatusBadRequest, "Invalid URL")
		return
	}
	ticketID := parts[5]

	userIDVal := r.Context().Value(middleware.UserContextKey)
	if userIDVal == nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	userID := userIDVal.(string)

	if r.Method == http.MethodGet {
		type Message struct {
			ID         string    `json:"id"`
			TicketID   string    `json:"ticket_id"`
			SenderID   string    `json:"sender_id"`
			SenderName string    `json:"sender_name"`
			SenderType string    `json:"sender_type"`
			Message    string    `json:"message"`
			CreatedAt  time.Time `json:"created_at"`
		}

		var messages []Message
		db.GormDB.Raw(`
			SELECT m.id, m.ticket_id, m.sender_id, COALESCE(u.full_name, 'Staff') as sender_name, m.sender_type, m.message, m.created_at
			FROM support_ticket_messages m
			LEFT JOIN users u ON m.sender_id = u.id
			WHERE m.ticket_id = ?
			ORDER BY m.created_at ASC
		`, ticketID).Scan(&messages)

		utils.JSONResponse(w, http.StatusOK, messages)
		return
	}

	if r.Method == http.MethodPost {
		var input struct {
			Message    string `json:"message"`
			SenderType string `json:"sender_type"` // 'user' or 'staff'
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, err.Error())
			return
		}

		if input.SenderType == "" {
			input.SenderType = "user"
		}

		msgID := uuid.New().String()
		now := time.Now().UTC()

		err := db.GormDB.Exec("INSERT INTO support_ticket_messages (id, ticket_id, sender_id, sender_type, message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
			msgID, ticketID, userID, input.SenderType, input.Message, now).Error

		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to add message")
			return
		}
		
		// Update ticket's updated_at timestamp
		db.GormDB.Exec("UPDATE support_tickets SET updated_at = ? WHERE id = ?", now, ticketID)

		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"message": "Reply added successfully",
			"id": msgID,
		})
		return
	}

	utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
}

func HandleTicketSubroutes(w http.ResponseWriter, r *http.Request) {
	// URLs like:
	// /api/v1/support/tickets/{id}/status
	// /api/v1/support/tickets/{id}/messages
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) >= 7 {
		action := parts[6]
		if action == "status" {
			HandleUpdateTicketStatus(w, r)
			return
		}
		if action == "messages" {
			HandleTicketMessages(w, r)
			return
		}
	}
	utils.JSONError(w, http.StatusNotFound, "Not found")
}

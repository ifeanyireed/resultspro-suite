package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"exams-resultspro-backend/internal/database"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SupportHandler struct{}

func NewSupportHandler() *SupportHandler {
	return &SupportHandler{}
}

func (h *SupportHandler) CreateTicket(c *gin.Context) {
	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDVal.(string)

	var input struct {
		Subject  string `json:"subject"`
		Category string `json:"category"`
		Message  string `json:"message"`
		Priority string `json:"priority"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Priority == "" {
		input.Priority = "normal"
	}

	// Auto-assign to an active staff member (round robin or random)
	var assignedTo sql.NullString
	var staffID string
	err := database.DB.Raw("SELECT user_id FROM support_staff_status WHERE is_active = true ORDER BY RANDOM() LIMIT 1").Row().Scan(&staffID)
	if err == nil && staffID != "" {
		assignedTo = sql.NullString{String: staffID, Valid: true}
	}

	ticketID := uuid.New().String()
	now := time.Now().UTC()

	err = database.DB.Exec("INSERT INTO support_tickets (id, user_id, assigned_to, subject, category, message, status, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)",
		ticketID, userID, assignedTo, input.Subject, input.Category, input.Message, input.Priority, now, now).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ticket"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Ticket created successfully", "ticket_id": ticketID, "assigned_to": assignedTo.String})
}

func (h *SupportHandler) GetUserTickets(c *gin.Context) {
	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
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
		CreatedAt  time.Time `json:"created_at"`
	}

	var tickets []Ticket
	database.DB.Raw("SELECT id, subject, category, message, status, priority, created_at FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC", userID).Scan(&tickets)

	c.JSON(http.StatusOK, tickets)
}

func (h *SupportHandler) GetAdminTickets(c *gin.Context) {
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
		CreatedAt    time.Time `json:"created_at"`
	}

	var tickets []Ticket
	database.DB.Raw(`
		SELECT t.id, t.user_id, u.full_name as user_full_name, t.assigned_to, t.subject, t.category, t.message, t.status, t.priority, t.created_at 
		FROM support_tickets t 
		LEFT JOIN users u ON t.user_id = u.id 
		ORDER BY t.created_at DESC
	`).Scan(&tickets)

	c.JSON(http.StatusOK, tickets)
}

func (h *SupportHandler) UpdateTicketStatus(c *gin.Context) {
	ticketID := c.Param("ticketId")
	var input struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.Exec("UPDATE support_tickets SET status = ?, updated_at = ? WHERE id = ?", input.Status, time.Now().UTC(), ticketID).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ticket"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket updated"})
}

func (h *SupportHandler) SetStaffStatus(c *gin.Context) {
	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDVal.(string)

	var input struct {
		IsActive bool `json:"is_active"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existsInDB bool
	database.DB.Raw("SELECT EXISTS(SELECT 1 FROM support_staff_status WHERE user_id = ?)", userID).Scan(&existsInDB)

	if existsInDB {
		database.DB.Exec("UPDATE support_staff_status SET is_active = ?, updated_at = ? WHERE user_id = ?", input.IsActive, time.Now().UTC(), userID)
	} else {
		database.DB.Exec("INSERT INTO support_staff_status (user_id, is_active, updated_at) VALUES (?, ?, ?)", userID, input.IsActive, time.Now().UTC())
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}

func (h *SupportHandler) GetStaffStatus(c *gin.Context) {
	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDVal.(string)

	var isActive bool
	err := database.DB.Raw("SELECT is_active FROM support_staff_status WHERE user_id = ?", userID).Row().Scan(&isActive)
	if err != nil {
		isActive = false
	}

	c.JSON(http.StatusOK, gin.H{"is_active": isActive})
}

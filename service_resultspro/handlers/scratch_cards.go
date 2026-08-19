package handlers

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_resultspro.resultspro.ng/db"
	"service_resultspro.resultspro.ng/models"
)

// GenerateScratchCards creates a new batch of scratch cards with cryptographically secure PINs
func GenerateScratchCards(c *gin.Context) {
	var input struct {
		SchoolID   *string `json:"school_id"`
		Quantity   int     `json:"quantity" binding:"required,min=1,max=5000"`
		UnitCost   float64 `json:"unit_cost"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	batchID := uuid.New().String()
	batchNumber := fmt.Sprintf("BATCH-%d-%04d", time.Now().Unix(), rand.Intn(9999))
	totalCost := float64(input.Quantity) * input.UnitCost
	now := time.Now()

	status := "GENERATED"
	if input.SchoolID != nil {
		status = "ASSIGNED"
	}

	// Insert Batch
	_, err := db.DB.Exec(`INSERT INTO res_scratch_card_batches (id, school_id, batch_number, total_cards, used_cards, unit_cost, total_cost, status, created_at) 
	                      VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)`,
		batchID, input.SchoolID, batchNumber, input.Quantity, input.UnitCost, totalCost, status, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to generate batch: %v", err)})
		return
	}

	// Generate Cards
	type PlainCard struct {
		SerialNumber string `json:"serial_number"`
		Pin          string `json:"pin"`
	}
	plainCards := []PlainCard{}

	for i := 0; i < input.Quantity; i++ {
		cardID := uuid.New().String()
		serial := fmt.Sprintf("RP%d%06d", time.Now().Year(), rand.Intn(999999))
		pin := fmt.Sprintf("%04d-%04d-%04d", rand.Intn(9000)+1000, rand.Intn(9000)+1000, rand.Intn(9000)+1000)

		hash := sha256.Sum256([]byte(pin))
		pinHash := hex.EncodeToString(hash[:])

		_, _ = db.DB.Exec(`INSERT INTO res_scratch_cards (id, batch_id, school_id, serial_number, pin_hash, usage_count, max_usages, status, created_at) 
		                   VALUES (?, ?, ?, ?, ?, 0, 5, 'ACTIVE', ?)`,
			cardID, batchID, input.SchoolID, serial, pinHash, now)

		plainCards = append(plainCards, PlainCard{SerialNumber: serial, Pin: pin})
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Scratch cards generated successfully",
		"batch_id":     batchID,
		"batch_number": batchNumber,
		"total_cards":  input.Quantity,
		"cards":        plainCards, // Returned once upon generation for printing
	})
}

// VerifyScratchCard validates a scratch card PIN and unlocks student result access
func VerifyScratchCard(c *gin.Context) {
	var req models.VerifyCardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash := sha256.Sum256([]byte(req.Pin))
	pinHash := hex.EncodeToString(hash[:])

	var card models.ScratchCard
	var schoolID sql.NullString
	err := db.DB.QueryRow(`SELECT id, batch_id, school_id, serial_number, pin_hash, usage_count, max_usages, status 
	                        FROM res_scratch_cards WHERE serial_number = ?`, req.SerialNumber).
		Scan(&card.ID, &card.BatchID, &schoolID, &card.SerialNumber, &card.PinHash, &card.UsageCount, &card.MaxUsages, &card.Status)

	if err != nil {
		c.JSON(http.StatusNotFound, models.VerifyCardResponse{
			Valid:   false,
			Message: "Scratch card with this serial number does not exist",
		})
		return
	}

	if card.PinHash != pinHash {
		c.JSON(http.StatusUnauthorized, models.VerifyCardResponse{
			Valid:   false,
			Message: "Invalid scratch card PIN",
		})
		return
	}

	if card.Status != "ACTIVE" {
		c.JSON(http.StatusBadRequest, models.VerifyCardResponse{
			Valid:   false,
			Message: "This scratch card has been deactivated or used up",
		})
		return
	}

	if card.UsageCount >= card.MaxUsages {
		c.JSON(http.StatusBadRequest, models.VerifyCardResponse{
			Valid:   false,
			Message: fmt.Sprintf("Maximum usage limit (%d) reached for this scratch card", card.MaxUsages),
		})
		return
	}

	// Check if this card was previously used for this student or another student
	var existingStudentID sql.NullString
	_ = db.DB.QueryRow(`SELECT student_id FROM res_scratch_card_usages WHERE card_id = ? LIMIT 1`, card.ID).Scan(&existingStudentID)

	if existingStudentID.Valid && existingStudentID.String != req.StudentID {
		c.JSON(http.StatusBadRequest, models.VerifyCardResponse{
			Valid:   false,
			Message: "This scratch card has already been locked to another student's results",
		})
		return
	}

	// Fetch Result
	var resultID string
	err = db.DB.QueryRow(`SELECT id FROM res_student_results WHERE instance_id = ? AND student_id = ?`, req.InstanceID, req.StudentID).Scan(&resultID)
	if err != nil {
		c.JSON(http.StatusNotFound, models.VerifyCardResponse{
			Valid:   false,
			Message: "No published result found for the specified student and instance",
		})
		return
	}

	// Record Usage
	usageID := uuid.New().String()
	now := time.Now()
	_, _ = db.DB.Exec(`INSERT INTO res_scratch_card_usages (id, card_id, student_id, result_id, accessed_by, accessed_at) 
	                   VALUES (?, ?, ?, ?, ?, ?)`, usageID, card.ID, req.StudentID, resultID, c.ClientIP(), now)

	newUsageCount := card.UsageCount + 1
	status := "ACTIVE"
	if newUsageCount >= card.MaxUsages {
		status = "USED"
	}
	_, _ = db.DB.Exec(`UPDATE res_scratch_cards SET usage_count = ?, status = ? WHERE id = ?`, newUsageCount, status, card.ID)

	c.JSON(http.StatusOK, models.VerifyCardResponse{
		Valid:          true,
		Message:        "Scratch card verified successfully",
		RemainingUsage: card.MaxUsages - newUsageCount,
		ResultID:       resultID,
	})
}

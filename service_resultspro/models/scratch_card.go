package models

import "time"

type ScratchCardBatch struct {
	ID          string    `json:"id"`
	SchoolID    *string   `json:"school_id,omitempty"`
	BatchNumber string    `json:"batch_number"`
	TotalCards  int       `json:"total_cards"`
	UsedCards   int       `json:"used_cards"`
	UnitCost    float64   `json:"unit_cost"`
	TotalCost   float64   `json:"total_cost"`
	Status      string    `json:"status"` // GENERATED, ASSIGNED, COMPLETED
	CreatedAt   time.Time `json:"created_at"`
}

type ScratchCard struct {
	ID           string     `json:"id"`
	BatchID      string     `json:"batch_id"`
	SchoolID     *string    `json:"school_id,omitempty"`
	SerialNumber string     `json:"serial_number"`
	PinHash      string     `json:"-"` // Never expose PIN hash
	UsageCount   int        `json:"usage_count"`
	MaxUsages    int        `json:"max_usages"` // Default 5 accesses
	Status       string     `json:"status"` // ACTIVE, USED, REVOKED
	ExpiresAt    *time.Time `json:"expires_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}

type ScratchCardUsage struct {
	ID            string    `json:"id"`
	CardID        string    `json:"card_id"`
	StudentID     string    `json:"student_id"`
	ResultID      string    `json:"result_id"`
	AccessedBy    string    `json:"accessed_by"` // user_id or IP
	AccessedAt    time.Time `json:"accessed_at"`
}

type VerifyCardRequest struct {
	SerialNumber string `json:"serial_number" binding:"required"`
	Pin          string `json:"pin" binding:"required"`
	StudentID    string `json:"student_id" binding:"required"`
	InstanceID   string `json:"instance_id" binding:"required"`
}

type VerifyCardResponse struct {
	Valid          bool   `json:"valid"`
	Message        string `json:"message"`
	RemainingUsage int    `json:"remaining_usage"`
	ResultID       string `json:"result_id,omitempty"`
}

func (ScratchCardBatch) TableName() string {
	return "res_scratch_card_batches"
}

func (ScratchCard) TableName() string {
	return "res_scratch_cards"
}

func (ScratchCardUsage) TableName() string {
	return "res_scratch_card_usages"
}

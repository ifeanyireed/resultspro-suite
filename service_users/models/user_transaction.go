package models

import "time"

// UserTransaction represents a B2C payment made by an end-user across the platform (e.g. for a course).
type UserTransaction struct {
	ID        string    `gorm:"primaryKey;size:64" json:"id"`
	TenantID  string    `gorm:"size:191;index;not null" json:"tenant_id"`
	UserID    string    `gorm:"size:64;index;not null" json:"user_id"`
	Module    string    `gorm:"size:64;not null" json:"module"` // e.g., "coursespro"
	ModuleRef string    `gorm:"size:128" json:"module_ref"`     // e.g., cohort_id
	Amount    float64   `gorm:"type:decimal(10,2);not null" json:"amount"`
	Currency  string    `gorm:"size:10;default:'NGN'" json:"currency"`
	Gateway   string    `gorm:"size:32;default:'paystack'" json:"gateway"`
	Reference string    `gorm:"unique;size:128;not null" json:"reference"`
	Status    string    `gorm:"size:32;default:'PENDING'" json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (UserTransaction) TableName() string { return "user_transactions" }

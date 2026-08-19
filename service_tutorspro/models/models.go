package models

import (
	"time"
)

type TutorProfile struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID             string    `gorm:"primaryKey" json:"id"`
	UserID         string    `gorm:"uniqueIndex" json:"user_id"`
	Headline       string    `json:"headline"`
	Bio            string    `gorm:"type:text" json:"bio"`
	Subjects       string    `gorm:"type:text" json:"subjects"` // JSON array of subjects
	HourlyRate     float64   `json:"hourly_rate"`
	Currency       string    `gorm:"default:'NGN'" json:"currency"`
	Rating         float64   `gorm:"default:5.0" json:"rating"`
	TotalReviews   int       `gorm:"default:0" json:"total_reviews"`
	TotalLessons   int       `gorm:"default:0" json:"total_lessons"`
	IsVerified     bool      `gorm:"default:false" json:"is_verified"`
	IsAvailable    bool      `gorm:"default:true" json:"is_available"`
	VideoIntroURL  string    `json:"video_intro_url"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type AvailabilitySlot struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID        string    `gorm:"primaryKey" json:"id"`
	TutorID   string    `gorm:"index" json:"tutor_id"`
	DayOfWeek int       `json:"day_of_week"` // 0=Sunday, 6=Saturday
	StartTime string    `json:"start_time"`  // "09:00"
	EndTime   string    `json:"end_time"`    // "10:00"
	IsActive  bool      `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

type Booking struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID            string    `gorm:"primaryKey" json:"id"`
	TutorID       string    `gorm:"index" json:"tutor_id"`
	StudentID     string    `gorm:"index" json:"student_id"`
	ParentID      *string   `gorm:"index" json:"parent_id,omitempty"`
	Subject       string    `json:"subject"`
	ScheduledDate time.Time `json:"scheduled_date"`
	StartTime     string    `json:"start_time"`
	EndTime       string    `json:"end_time"`
	HourlyRate    float64   `json:"hourly_rate"`
	TotalAmount   float64   `json:"total_amount"`
	Currency      string    `gorm:"default:'NGN'" json:"currency"`
	Status        string    `gorm:"default:'PENDING'" json:"status"` // PENDING, CONFIRMED, COMPLETED, CANCELLED
	MeetingURL    string    `json:"meeting_url"`
	Notes         string    `gorm:"type:text" json:"notes"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type TutorReview struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID        string    `gorm:"primaryKey" json:"id"`
	TutorID   string    `gorm:"index" json:"tutor_id"`
	StudentID string    `json:"student_id"`
	ParentID  *string   `json:"parent_id,omitempty"`
	Rating    int       `json:"rating"` // 1-5
	Comment   string    `gorm:"type:text" json:"comment"`
	CreatedAt time.Time `json:"created_at"`
}

type TutorPayoutRequest struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID          string     `gorm:"primaryKey" json:"id"`
	TutorID     string     `gorm:"index" json:"tutor_id"`
	Amount      float64    `json:"amount"`
	Currency    string     `gorm:"default:'NGN'" json:"currency"`
	BankName    string     `json:"bank_name"`
	AccountNum  string     `json:"account_number"`
	AccountName string     `json:"account_name"`
	Status      string     `gorm:"default:'PENDING'" json:"status"` // PENDING, APPROVED, PAID, REJECTED
	ProcessedAt *time.Time `json:"processed_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

func (TutorProfile) TableName() string { return "tut_profiles" }
func (AvailabilitySlot) TableName() string { return "tut_availability_slots" }
func (Booking) TableName() string { return "tut_bookings" }
func (TutorReview) TableName() string { return "tut_reviews" }
func (TutorPayoutRequest) TableName() string { return "tut_payout_requests" }

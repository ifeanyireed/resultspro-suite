package models

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleStudent   Role = "STUDENT"
	RoleModerator Role = "MODERATOR"
	RoleAdmin     Role = "ADMIN"
)

type User struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID                 string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	Email              string         `gorm:"uniqueIndex;not null" json:"email"`
	Phone              *string        `gorm:"uniqueIndex" json:"phone"`
	Name               *string        `json:"name"`
	Password           string         `json:"-"`
	GoogleID           *string        `gorm:"uniqueIndex" json:"googleId"`
	MicrosoftID        *string        `gorm:"uniqueIndex" json:"microsoftId"`
	CoinBalance        int            `gorm:"default:0" json:"coinBalance"`
	ReferralCode       string         `gorm:"uniqueIndex" json:"referralCode"`
	ReferredBy         *string        `json:"referredBy"`
	EloRating          int            `gorm:"default:1000" json:"eloRating"`
	StreakCurrent      int            `gorm:"default:0" json:"streakCurrent"`
	LastActiveAt       *time.Time     `json:"lastActiveAt"`
	IsPremium          bool           `gorm:"default:false" json:"isPremium"`
	PremiumExpiresAt   *time.Time     `json:"premiumExpiresAt"`
	Role               Role           `gorm:"default:'STUDENT'" json:"role"`
	IsAdmin            bool           `gorm:"default:false" json:"isAdmin"`
	OTPCode            *string        `json:"otpCode"`
	OTPExpiresAt       *time.Time     `json:"otpExpiresAt"`
	IsBanned           bool           `gorm:"default:false" json:"isBanned"`
	BanReason          *string        `json:"banReason"`
	BanExpiresAt       *time.Time     `json:"banExpiresAt"`
	EmailNotifications bool           `gorm:"default:true" json:"emailNotifications"`
	PushNotifications  bool           `gorm:"default:true" json:"pushNotifications"`
	TargetExams        string         `gorm:"default:''" json:"targetExams"` // Comma separated list of exam IDs or names
	IsPublic           bool           `gorm:"default:true" json:"isPublic"`
	TwoFactorEnabled   bool           `gorm:"default:false" json:"twoFactorEnabled"`
	CreatedAt          time.Time      `json:"createdAt"`
	UpdatedAt          time.Time      `json:"updatedAt"`
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"-"`
}

type CoinTransaction struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID          string    `gorm:"primaryKey;type:varchar(191)" json:"id"`
	UserID      string    `gorm:"index" json:"userId"`
	Amount      int       `json:"amount"`
	Type        string    `json:"type"`
	ReferenceID *string   `json:"referenceId"`
	Description *string   `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Referral struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID           string    `gorm:"primaryKey;type:varchar(191)" json:"id"`
	ReferrerID   string    `gorm:"index" json:"referrerId"`
	RefereeID    string    `gorm:"index" json:"refereeId"`
	Status       string    `gorm:"default:'pending'" json:"status"`
	CoinsAwarded int       `gorm:"default:0" json:"coinsAwarded"`
	CreatedAt    time.Time `json:"createdAt"`
	Referee      User      `gorm:"foreignKey:RefereeID" json:"referee,omitempty"`
}

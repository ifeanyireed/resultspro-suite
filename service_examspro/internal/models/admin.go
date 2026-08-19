package models

import (
	"time"

	"gorm.io/gorm"
)

type SystemSetting struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID           string         `gorm:"primaryKey" json:"id"`
	Value        string         `json:"value"`
	Type         string         `json:"type"` // 'number', 'string', 'boolean'
	SettingGroup string         `gorm:"column:setting_group" json:"group"`
	Label        string         `json:"label"`
	Desc         string         `json:"desc"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

type Report struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID           string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	ReporterID   string         `gorm:"index" json:"reporterId"`
	Reporter     *User          `gorm:"foreignKey:ReporterID" json:"reporter,omitempty"`
	Type         string         `json:"type"`     // 'question', 'user', 'comment', 'other'
	TargetID     string         `json:"targetId"` // ID of the question, user, or comment being reported
	Reason       string         `json:"reason"`
	Status       string         `gorm:"default:'pending'" json:"status"` // 'pending', 'under_review', 'resolved', 'dismissed'
	AdminNotes   *string        `json:"adminNotes"`
	ResolvedByID *string        `gorm:"index" json:"resolvedById"`
	ResolvedBy   *User          `gorm:"foreignKey:ResolvedByID" json:"resolvedBy,omitempty"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

type CoinPack struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID          string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	Name        string         `json:"name"`
	Type        string         `gorm:"default:'COIN'" json:"type"` // 'COIN' or 'PREMIUM'
	Coins       int            `gorm:"default:0" json:"coins"`
	Price       int            `json:"price"` // Base price in NGN
	Description *string        `json:"description"`
	Color       string         `gorm:"default:'blue'" json:"color"`
	Popular     bool           `gorm:"default:false" json:"popular"`
	Discount    *string        `json:"discount"`
	Bonus       *string        `json:"bonus"`
	IsActive    bool           `gorm:"default:true" json:"isActive"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type Purchase struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID               string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	UserID           string         `gorm:"index" json:"userId"`
	User             *User          `json:"user,omitempty"`
	PackName         string         `json:"packName"`
	CoinsGranted     int            `json:"coinsGranted"`
	AmountNgn        int            `json:"amountNgn"`
	PaymentReference *string        `json:"paymentReference"`
	Status           string         `gorm:"default:'pending'" json:"status"` // 'pending','success','failed','refunded'
	CreatedAt        time.Time      `json:"createdAt"`
	UpdatedAt        time.Time      `json:"updatedAt"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}

type Withdrawal struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID            string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	UserID        string         `gorm:"index" json:"userId"`
	User          *User          `json:"user,omitempty"`
	CoinAmount    int            `json:"coinAmount"`
	AmountNgn     int            `json:"amountNgn"`
	BankName      string         `json:"bankName"`
	AccountNumber string         `json:"accountNumber"`
	AccountName   string         `json:"accountName"`
	Status        string         `gorm:"default:'pending'" json:"status"` // 'pending','approved','completed','rejected'
	ProcessedAt   *time.Time     `json:"processedAt"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

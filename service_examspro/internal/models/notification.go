package models

import (
	"time"

	"gorm.io/gorm"
)

type NotificationType string

const (
	NotificationTypeInfo        NotificationType = "info"
	NotificationTypeSuccess     NotificationType = "success"
	NotificationTypeWarning     NotificationType = "warning"
	NotificationTypeError       NotificationType = "error"
	NotificationTypeBattle      NotificationType = "battle"
	NotificationTypeReward      NotificationType = "reward"
	NotificationTypeAchievement NotificationType = "achievement"
	NotificationTypeSystem      NotificationType = "system"
)

type NotificationRoute string

const (
	NotificationRouteInApp NotificationRoute = "in-app"
	NotificationRouteEmail NotificationRoute = "email"
	NotificationRouteBoth  NotificationRoute = "both"
)

type Notification struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID        string           `gorm:"primaryKey;type:varchar(191)" json:"id"`
	UserID    string           `gorm:"index" json:"userId"`
	Title     string           `json:"title"`
	Message   string           `json:"message"`
	Type      NotificationType `gorm:"default:'info'" json:"type"`
	IsRead    bool             `gorm:"default:false" json:"isRead"`
	Metadata  *string          `json:"metadata"` // JSON string for extra data
	CreatedAt time.Time        `json:"createdAt"`
	UpdatedAt time.Time        `json:"updatedAt"`
	DeletedAt gorm.DeletedAt   `gorm:"index" json:"-"`
}

type NotificationLog struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID          string            `gorm:"primaryKey;type:varchar(191)" json:"id"`
	UserID      *string           `gorm:"index" json:"userId"` // Null if broadcast
	Title       string            `json:"title"`
	Message     string            `json:"message"`
	Type        NotificationType  `json:"type"`
	Route       NotificationRoute `json:"route"`
	Status      string            `json:"status"` // sent, failed, pending
	Error       *string           `json:"error,omitempty"`
	ScheduledAt *time.Time        `json:"scheduledAt"`
	CreatedAt   time.Time         `json:"createdAt"`
}

type NotificationCampaign struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID           string            `gorm:"primaryKey;type:varchar(191)" json:"id"`
	Title        string            `json:"title"`
	Message      string            `json:"message"`
	Type         NotificationType  `json:"type"`
	Route        NotificationRoute `json:"route"`
	Target       string            `json:"target"` // all, pro, free, individual, exam
	TargetValue  *string           `json:"targetValue"` // userId if target is individual
	TargetExamID *int              `json:"targetExamId"` // examId if target is exam
	IsPopup      bool              `gorm:"default:false" json:"isPopup"`
	DisplayPages *string           `json:"displayPages"` // comma separated routes or '*'
	Status       string            `gorm:"default:'pending'" json:"status"` // pending, processing, completed, failed
	ScheduledAt  *time.Time         `json:"scheduledAt"`
	CreatedAt    time.Time         `json:"createdAt"`
	UpdatedAt    time.Time         `json:"updatedAt"`
}

type PopupNotification struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID           string           `gorm:"primaryKey;type:varchar(191)" json:"id"`
	Title        string           `json:"title"`
	Message      string           `json:"message"`
	Type         NotificationType `json:"type"`
	DisplayPages string           `json:"displayPages"` // e.g., "/dashboard,/study-assistant" or "*"
	TargetExamID *int             `json:"targetExamId"` // Optional filter
	IsActive     bool             `gorm:"default:true" json:"isActive"`
	StartTime    *time.Time       `json:"startTime"`
	EndTime      *time.Time       `json:"endTime"`
	CreatedAt    time.Time        `json:"createdAt"`
	UpdatedAt    time.Time        `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt   `gorm:"index" json:"-"`
}

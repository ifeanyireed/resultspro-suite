package models

import (
	"time"

	"gorm.io/gorm"
)

type LiveGameRoom struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID                   string                `gorm:"primaryKey;type:varchar(191)" json:"id"`
	AdminID              string                `gorm:"index" json:"adminId"`
	Title                *string               `json:"title"`
	SubjectID            int                   `gorm:"index" json:"subjectId"`
	Subject              *Subject              `json:"subject,omitempty"`
	EntryFee             int                   `json:"entryFee"`
	MaxPlayers           int                   `json:"maxPlayers"`
	Type                 string                `gorm:"default:'Public'" json:"type"` // 'Public', 'High Stakes', 'Private'
	Status               string                `gorm:"default:'pending'" json:"status"` // 'pending', 'active', 'finished'
	CurrentQuestionIndex int                   `gorm:"default:0" json:"currentQuestionIndex"`
	CurrentQuestionID    *string               `gorm:"type:varchar(191)" json:"currentQuestionId"`
	CurrentQuestion      *Question             `gorm:"foreignKey:CurrentQuestionID" json:"currentQuestion,omitempty"`
	SpectatorCount       int                   `gorm:"default:0" json:"spectatorCount"`
	StartTime            *time.Time            `json:"startTime"`
	StartedAt            *time.Time            `json:"startedAt"`
	CreatedAt            time.Time             `json:"createdAt"`
	UpdatedAt            time.Time             `json:"updatedAt"`
	DeletedAt            gorm.DeletedAt        `gorm:"index" json:"-"`
	Participants         []LiveGameParticipant `gorm:"foreignKey:RoomID" json:"participants,omitempty"`
	ChatMessages         []LiveRoomChatMessage `gorm:"foreignKey:RoomID" json:"chatMessages,omitempty"`
}

type LiveGameParticipant struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID        string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	RoomID    string         `gorm:"index" json:"roomId"`
	Room      *LiveGameRoom  `json:"room,omitempty"`
	UserID    string         `gorm:"index" json:"userId"`
	User      *User          `json:"user,omitempty"`
	Score     int            `gorm:"default:0" json:"score"`
	JoinedAt  time.Time      `json:"joinedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type LiveRoomChatMessage struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID        string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	RoomID    string         `gorm:"index" json:"roomId"`
	Room      *LiveGameRoom  `json:"room,omitempty"`
	UserID    string         `gorm:"index" json:"userId"`
	User      *User          `json:"user,omitempty"`
	Content   string         `json:"content"`
	CreatedAt time.Time      `json:"createdAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

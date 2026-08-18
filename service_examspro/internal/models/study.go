package models

import (
	"time"

	"gorm.io/gorm"
)

type StudySession struct {
	ID        string         `gorm:"primaryKey;type:uuid" json:"id"`
	UserID    string         `gorm:"index" json:"userId"`
	User      *User          `json:"user,omitempty"`
	TopicID   *int           `gorm:"index" json:"topicId"`
	Topic     *Topic         `json:"topic,omitempty"`
	Title     *string        `json:"title"`
	Messages  []ChatMessage  `gorm:"foreignKey:SessionID" json:"messages,omitempty"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type ChatMessage struct {
	ID        string         `gorm:"primaryKey;type:uuid" json:"id"`
	SessionID string         `gorm:"index" json:"sessionId"`
	Session   *StudySession  `json:"session,omitempty"`
	Role      string         `json:"role"` // 'user' or 'assistant'
	Content   string         `json:"content"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

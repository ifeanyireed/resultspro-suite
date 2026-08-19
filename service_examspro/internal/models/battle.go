package models

import (
	"time"

	"gorm.io/gorm"
)

type Battle struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID              string              `gorm:"primaryKey;type:varchar(191)" json:"id"`
	RoomCode        string              `gorm:"uniqueIndex;size:6" json:"roomCode"`
	SubjectID       int                 `gorm:"index" json:"subjectId"`
	Subject         *Subject            `json:"subject,omitempty"`
	QuestionCount     int                 `gorm:"default:10" json:"questionCount"`
	Duration          int                 `gorm:"default:60" json:"duration"`          // in seconds
	RandomizeOrder    bool                `gorm:"default:true" json:"randomizeOrder"`
	SoundActivated    bool                `gorm:"default:true" json:"soundActivated"`
	StakePerPlayer    int                 `json:"stakePerPlayer"`
	MaxParticipants int                 `gorm:"default:2" json:"maxParticipants"`
	IsPublic        bool                `gorm:"default:true" json:"isPublic"`
	IsBot           bool                `gorm:"default:false" json:"isBot"`
	BotScore        int                 `gorm:"default:0" json:"botScore"`
	CreatorID       *string             `gorm:"index" json:"creatorId,omitempty"`
	Status          string              `gorm:"default:'waiting'" json:"status"` // 'waiting','active','completed','cancelled'
	StartedAt       *time.Time          `json:"startedAt"`
	EndedAt         *time.Time          `json:"endedAt"`
	CreatedAt       time.Time           `json:"createdAt"`
	UpdatedAt       time.Time           `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt      `gorm:"index" json:"-"`
	Participants    []BattleParticipant `json:"participants,omitempty"`
	Questions       []Question          `gorm:"many2many:battle_questions;" json:"questions,omitempty"`
}

type BattleQuestion struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	BattleID   string `gorm:"primaryKey"`
	QuestionID int    `gorm:"primaryKey"`
}

type BattleParticipant struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID         string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	BattleID   string         `gorm:"index" json:"battleId"`
	Battle     *Battle        `json:"battle,omitempty"`
	UserID     string         `gorm:"index" json:"userId"`
	User       *User          `json:"user,omitempty"`
	Score      int            `gorm:"default:0" json:"score"`
	Status     string         `gorm:"default:'joined'" json:"status"` // 'joined', 'ready', 'completed'
	Progress   int            `gorm:"default:0" json:"progress"`
	FinishedAt *time.Time     `json:"finishedAt"`
	JoinedAt   time.Time      `json:"joinedAt"`
	UpdatedAt  time.Time      `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

type Tournament struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID              string                   `gorm:"primaryKey;type:varchar(191)" json:"id"`
	Title           string                   `json:"title"`
	Description     string                   `json:"description"`
	StartTime       time.Time                `json:"startTime"`
	EndTime         time.Time                `json:"endTime"`
	RegistrationFee int                      `json:"registrationFee"`
	PrizePool       int                      `json:"prizePool"`
	Duration        int                      `gorm:"default:60" json:"duration"`      // Match duration in seconds
	QuestionCount   int                      `gorm:"default:10" json:"questionCount"` // Number of questions per match
	Status          string                   `gorm:"default:'upcoming'" json:"status"` // 'upcoming', 'active', 'completed'
	CreatedAt       time.Time                `json:"createdAt"`
	UpdatedAt       time.Time                `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt           `gorm:"index" json:"-"`
	Participants    []TournamentParticipant `json:"participants,omitempty"`
}

type TournamentParticipant struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID           string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	TournamentID string         `gorm:"index" json:"tournamentId"`
	UserID       string         `gorm:"index" json:"userId"`
	User         *User          `json:"user,omitempty"`
	Rank         int            `gorm:"default:0" json:"rank"`
	TotalScore   int            `gorm:"default:0" json:"totalScore"`
	JoindAt      time.Time      `json:"joinedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

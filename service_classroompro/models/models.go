package models

import (
	"time"
)

type Note struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	SchoolID  *string   `json:"school_id,omitempty"`
	SubjectID string    `json:"subject_id"`
	TopicID   *string   `json:"topic_id,omitempty"`
	TeacherID string    `json:"teacher_id"`
	Title     string    `json:"title"`
	Content   string    `gorm:"type:text" json:"content"`
	IsPublic  bool      `json:"is_public"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Quiz struct {
	ID          string    `gorm:"primaryKey" json:"id"`
	SchoolID    *string   `json:"school_id,omitempty"`
	SubjectID   string    `json:"subject_id"`
	TopicID     *string   `json:"topic_id,omitempty"`
	TeacherID   string    `json:"teacher_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Questions   string    `gorm:"type:text" json:"questions"` // JSON array of questions
	DurationMin int       `json:"duration_min"`
	CreatedAt   time.Time `json:"created_at"`
}

type QuizAttempt struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	QuizID    string    `json:"quiz_id"`
	StudentID string    `json:"student_id"`
	Score     float64   `json:"score"`
	MaxScore  float64   `json:"max_score"`
	Answers   string    `gorm:"type:text" json:"answers"`
	CreatedAt time.Time `json:"created_at"`
}

type Flashcard struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	SubjectID string    `json:"subject_id"`
	TopicID   *string   `json:"topic_id,omitempty"`
	Front     string    `gorm:"type:text" json:"front"`
	Back      string    `gorm:"type:text" json:"back"`
	Hint      string    `json:"hint"`
	CreatedAt time.Time `json:"created_at"`
}

type FlashcardProgress struct {
	ID          string    `gorm:"primaryKey" json:"id"`
	StudentID   string    `gorm:"uniqueIndex:idx_student_card" json:"student_id"`
	CardID      string    `gorm:"uniqueIndex:idx_student_card" json:"card_id"`
	Box         int       `json:"box"` // Leitner box 1-5
	NextReview  time.Time `json:"next_review"`
	EaseFactor  float64   `json:"ease_factor"`
	Repetitions int       `json:"repetitions"`
	Interval    int       `json:"interval"` // in days
	UpdatedAt   time.Time `json:"updated_at"`
}

type Bookmark struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	UserID    string    `gorm:"index" json:"user_id"`
	ItemType  string    `json:"item_type"` // NOTE, QUIZ, FLASHCARD
	ItemID    string    `json:"item_id"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"created_at"`
}

type GamificationProfile struct {
	UserID       string    `gorm:"primaryKey" json:"user_id"`
	Points       int       `json:"points"`
	Level        int       `json:"level"`
	StreakDays   int       `json:"streak_days"`
	LastActiveAt time.Time `json:"last_active_at"`
	Badges       string    `gorm:"type:text" json:"badges"` // JSON array
}

type StudySession struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	UserID    string    `gorm:"index" json:"user_id"`
	SubjectID string    `json:"subject_id"`
	Duration  int       `json:"duration_seconds"`
	Activity  string    `json:"activity"` // FLASHCARDS, NOTES, QUIZ
	CreatedAt time.Time `json:"created_at"`
}

func (Note) TableName() string { return "cls_notes" }
func (Quiz) TableName() string { return "cls_quizzes" }
func (QuizAttempt) TableName() string { return "cls_quiz_attempts" }
func (Flashcard) TableName() string { return "cls_flashcards" }
func (FlashcardProgress) TableName() string { return "cls_flashcard_progress" }
func (Bookmark) TableName() string { return "cls_bookmarks" }
func (GamificationProfile) TableName() string { return "cls_gamification_profiles" }
func (StudySession) TableName() string { return "cls_study_sessions" }

package models

import (
	"time"
)

type Note struct {
	TenantID  string    `gorm:"size:64;index" json:"tenant_id"`
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

// VideoLesson stores linked YouTube instructional videos only (zero raw video file uploads)
type VideoLesson struct {
	TenantID   string    `gorm:"size:64;index" json:"tenant_id"`
	ID         string    `gorm:"primaryKey" json:"id"`
	SchoolID   *string   `json:"school_id,omitempty"`
	SubjectID  string    `gorm:"index" json:"subject_id"`
	TopicID    *string   `json:"topic_id,omitempty"`
	TeacherID  string    `json:"teacher_id"`
	Title      string    `json:"title"`
	YoutubeID  string    `json:"youtube_id"`
	YoutubeURL string    `json:"youtube_url"`
	Duration   string    `json:"duration"`
	Summary    string    `gorm:"type:text" json:"summary"`
	CreatedAt  time.Time `json:"created_at"`
}

type Quiz struct {
	TenantID    string    `gorm:"size:64;index" json:"tenant_id"`
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
	TenantID  string    `gorm:"size:64;index" json:"tenant_id"`
	ID        string    `gorm:"primaryKey" json:"id"`
	QuizID    string    `json:"quiz_id"`
	StudentID string    `json:"student_id"`
	Score     float64   `json:"score"`
	MaxScore  float64   `json:"max_score"`
	Answers   string    `gorm:"type:text" json:"answers"`
	CreatedAt time.Time `json:"created_at"`
}

type Flashcard struct {
	TenantID  string    `gorm:"size:64;index" json:"tenant_id"`
	ID        string    `gorm:"primaryKey" json:"id"`
	SubjectID string    `json:"subject_id"`
	TopicID   *string   `json:"topic_id,omitempty"`
	Front     string    `gorm:"type:text" json:"front"`
	Back      string    `gorm:"type:text" json:"back"`
	Hint      string    `json:"hint"`
	CreatedAt time.Time `json:"created_at"`
}

type FlashcardProgress struct {
	TenantID    string    `gorm:"size:64;index" json:"tenant_id"`
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
	TenantID  string    `gorm:"size:64;index" json:"tenant_id"`
	ID        string    `gorm:"primaryKey" json:"id"`
	UserID    string    `gorm:"index" json:"user_id"`
	ItemType  string    `json:"item_type"` // NOTE, QUIZ, FLASHCARD, VIDEO
	ItemID    string    `json:"item_id"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"created_at"`
}

type GamificationProfile struct {
	TenantID     string    `gorm:"size:64;index" json:"tenant_id"`
	UserID       string    `gorm:"primaryKey" json:"user_id"`
	Points       int       `json:"points"`
	Level        int       `json:"level"`
	StreakDays   int       `json:"streak_days"`
	LastActiveAt time.Time `json:"last_active_at"`
	Badges       string    `gorm:"type:text" json:"badges"` // JSON array
}

type StudySession struct {
	TenantID  string    `gorm:"size:64;index" json:"tenant_id"`
	ID        string    `gorm:"primaryKey" json:"id"`
	UserID    string    `gorm:"index" json:"user_id"`
	SubjectID string    `json:"subject_id"`
	Duration  int       `json:"duration_seconds"`
	Activity  string    `json:"activity"` // FLASHCARDS, NOTES, QUIZ, VIDEO
	CreatedAt time.Time `json:"created_at"`
}

// CurriculumTopic maps the NERDC curriculum hierarchy (Education Level -> Class -> Subject -> Term -> Week -> Topic)
type CurriculumTopic struct {
	TenantID       string    `gorm:"size:64;index" json:"tenant_id"`
	ID             string    `gorm:"primaryKey" json:"id"`
	Curriculum     string    `gorm:"size:64;index" json:"curriculum"`      // e.g. "NERDC"
	EducationLevel string    `gorm:"size:64;index" json:"education_level"` // primary, junior-secondary, senior-secondary
	ClassCode      string    `gorm:"size:64;index" json:"class_code"`      // primary-4, jss-2, sss-2
	SubjectID      string    `gorm:"size:64;index" json:"subject_id"`
	SubjectName    string    `json:"subject_name"`
	Term           string    `gorm:"size:64;index" json:"term"` // first-term, second-term, third-term
	Week           int       `json:"week"`
	Topic          string    `json:"topic"`
	Subtopic       string    `json:"subtopic"`
	ContentID      string    `gorm:"size:128;index" json:"content_id"`
	ActiveVersion  int       `json:"active_version"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// LessonVersion tracks published portable Markdown lessons, asset references, and version history
type LessonVersion struct {
	ID             string    `gorm:"primaryKey" json:"id"`
	ContentID      string    `gorm:"size:128;index" json:"content_id"`
	Curriculum     string    `gorm:"size:64" json:"curriculum"`
	ClassCode      string    `gorm:"size:64;index" json:"class_code"`
	SubjectID      string    `gorm:"size:64;index" json:"subject_id"`
	Term           string    `gorm:"size:64;index" json:"term"`
	Week           int       `json:"week"`
	Topic          string    `json:"topic"`
	Subtopic       string    `json:"subtopic"`
	Version        int       `json:"version"`
	Status         string    `gorm:"size:32" json:"status"` // draft, published, archived
	MarkdownPath   string    `json:"markdown_path"`
	MarkdownBody   string    `gorm:"type:text" json:"markdown_body,omitempty"`
	ChecksumSHA256 string    `gorm:"size:128" json:"checksum_sha256"`
	AssetsJSON     string    `gorm:"type:text" json:"assets_json"` // JSON array of asset:// references
	YoutubeID      string    `gorm:"size:64" json:"youtube_id"`
	PublishedBy    string    `json:"published_by"`
	PublishedAt    time.Time `json:"published_at"`
}

// PackageManifest tracks downloadable offline curriculum bundles by Class/Subject/Term
type PackageManifest struct {
	PackageID      string    `gorm:"primaryKey" json:"package_id"`
	Curriculum     string    `gorm:"size:64" json:"curriculum"`
	EducationLevel string    `gorm:"size:64" json:"education_level"`
	ClassCode      string    `gorm:"size:64;index" json:"class_code"`
	ClassLabel     string    `json:"class_label"`
	SubjectID      string    `gorm:"size:64;index" json:"subject_id"`
	SubjectName    string    `json:"subject_name"`
	Term           string    `gorm:"size:64;index" json:"term"`
	TermLabel      string    `json:"term_label"`
	PackageVersion int       `json:"package_version"`
	SizeBytes      int64     `json:"size_bytes"`
	ChecksumSHA256 string    `gorm:"size:128" json:"checksum_sha256"`
	ManifestJSON   string    `gorm:"type:text" json:"manifest_json"`
	PublishedAt    time.Time `json:"published_at"`
}

// OfflineSyncOperation provides idempotent server-side tracking of client offline sync operations
type OfflineSyncOperation struct {
	OperationID     string    `gorm:"primaryKey;size:128" json:"operation_id"`
	TenantID        string    `gorm:"size:64;index" json:"tenant_id"`
	StudentID       string    `gorm:"size:128;index" json:"student_id"`
	OperationType   string    `gorm:"size:64;index" json:"operation_type"` // QUIZ_ATTEMPT, LESSON_PROGRESS, BOOKMARK
	EntityID        string    `gorm:"size:128;index" json:"entity_id"`
	PayloadJSON     string    `gorm:"type:text" json:"payload_json"`
	ClientTimestamp int64     `json:"client_timestamp"`
	Status          string    `gorm:"size:32" json:"status"` // SYNCHRONIZED, CONFLICT_IGNORED
	SyncedAt        time.Time `json:"synced_at"`
}

// StudentLessonProgress tracks the latest synchronized mastery/completion state per student & lesson
type StudentLessonProgress struct {
	ID              string    `gorm:"primaryKey" json:"id"`
	TenantID        string    `gorm:"size:64;index" json:"tenant_id"`
	StudentID       string    `gorm:"size:128;uniqueIndex:idx_student_lesson" json:"student_id"`
	ContentID       string    `gorm:"size:128;uniqueIndex:idx_student_lesson" json:"content_id"`
	CompletionPct   int       `json:"completion_pct"`
	Completed       bool      `json:"completed"`
	LastScrollPos   int       `json:"last_scroll_pos"`
	ClientTimestamp int64     `json:"client_timestamp"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func (Note) TableName() string                  { return "cls_notes" }
func (VideoLesson) TableName() string           { return "cls_video_lessons" }
func (Quiz) TableName() string                  { return "cls_quizzes" }
func (QuizAttempt) TableName() string           { return "cls_quiz_attempts" }
func (Flashcard) TableName() string             { return "cls_flashcards" }
func (FlashcardProgress) TableName() string     { return "cls_flashcard_progress" }
func (Bookmark) TableName() string              { return "cls_bookmarks" }
func (GamificationProfile) TableName() string   { return "cls_gamification_profiles" }
func (StudySession) TableName() string          { return "cls_study_sessions" }
func (CurriculumTopic) TableName() string       { return "cls_curriculum_topics" }
func (LessonVersion) TableName() string         { return "cls_lesson_versions" }
func (PackageManifest) TableName() string       { return "cls_package_manifests" }
func (OfflineSyncOperation) TableName() string  { return "cls_offline_sync_ops" }
func (StudentLessonProgress) TableName() string { return "cls_student_lesson_progress" }

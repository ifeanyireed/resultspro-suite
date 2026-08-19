package models

import (
	"time"
)

// Course / Cohort Program
type Cohort struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID            string    `gorm:"primaryKey;size:64" json:"id"`
	Slug          string    `gorm:"uniqueIndex;size:128" json:"slug"`
	Title         string    `gorm:"size:255;not null" json:"title"`
	Subtitle      string    `gorm:"size:255" json:"subtitle"`
	Description   string    `gorm:"type:text" json:"description"`
	DurationWeeks int       `gorm:"default:12" json:"duration_weeks"`
	StartDate     time.Time `json:"start_date"`
	EndDate       time.Time `json:"end_date"`
	Capacity      int       `gorm:"default:50" json:"capacity"`
	EnrolledCount int       `gorm:"default:0" json:"enrolled_count"`
	Price         float64   `gorm:"default:0" json:"price"`
	Currency      string    `gorm:"size:10;default:'NGN'" json:"currency"`
	LeadMentorID  string    `gorm:"size:64;index" json:"lead_mentor_id"`
	Status        string    `gorm:"size:32;default:'ENROLLING'" json:"status"` // DRAFT, ENROLLING, ACTIVE, COMPLETED
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Student Cohort Enrollment
type Enrollment struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID                 string    `gorm:"primaryKey;size:64" json:"id"`
	CohortID           string    `gorm:"size:64;index;not null" json:"cohort_id"`
	UserID             string    `gorm:"size:64;index;not null" json:"user_id"`
	PlanType           string    `gorm:"size:32;default:'STANDARD'" json:"plan_type"`
	PaymentStatus      string    `gorm:"size:32;default:'PAID'" json:"payment_status"`
	CurrentStageNumber int       `gorm:"default:1" json:"current_stage_number"`
	CurrentXP          int       `gorm:"default:0" json:"current_xp"`
	StreakDays         int       `gorm:"default:0" json:"streak_days"`
	LastActiveDate     time.Time `json:"last_active_date"`
	Status             string    `gorm:"size:32;default:'ACTIVE'" json:"status"` // ACTIVE, SUSPENDED, GRADUATED
	EnrolledAt         time.Time `json:"enrolled_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// 7-Stage Learning Journey Stage
type JourneyStage struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID          string    `gorm:"primaryKey;size:64" json:"id"`
	CohortID    string    `gorm:"size:64;index" json:"cohort_id"`
	StageNumber int       `gorm:"not null" json:"stage_number"` // 1 to 7
	Title       string    `gorm:"size:255;not null" json:"title"`
	Subtitle    string    `gorm:"size:255" json:"subtitle"`
	Description string    `gorm:"type:text" json:"description"`
	OrderIndex  int       `gorm:"default:0" json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
}

// Journey Lesson Module
type JourneyModule struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID                  string    `gorm:"primaryKey;size:64" json:"id"`
	StageID             string    `gorm:"size:64;index;not null" json:"stage_id"`
	Title               string    `gorm:"size:255;not null" json:"title"`
	DurationText        string    `gorm:"size:64;default:'45 mins'" json:"duration_text"`
	Description         string    `gorm:"type:text" json:"description"`
	ReadingsCount       int       `gorm:"default:3" json:"readings_count"`
	HasQuiz             bool      `gorm:"default:true" json:"has_quiz"`
	HasChallenge        bool      `gorm:"default:true" json:"has_challenge"`
	VideoURL            string    `gorm:"size:512" json:"video_url"`
	ContentMarkdown     string    `gorm:"type:longtext" json:"content_markdown"`
	AISummary           string    `gorm:"type:text" json:"ai_summary"`
	ReflectionPrompts   string    `gorm:"type:text" json:"reflection_prompts"` // JSON array
	OrderIndex          int       `gorm:"default:0" json:"order_index"`
	CreatedAt           time.Time `json:"created_at"`
}

// Module Progress Tracking per Student
type ModuleProgress struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID               string    `gorm:"primaryKey;size:64" json:"id"`
	UserID           string    `gorm:"size:64;index;not null" json:"user_id"`
	ModuleID         string    `gorm:"size:64;index;not null" json:"module_id"`
	Completed        bool      `gorm:"default:false" json:"completed"`
	ReflectionAnswer string    `gorm:"type:text" json:"reflection_answer"`
	QuizScore        int       `gorm:"default:0" json:"quiz_score"`
	QuizPassed       bool      `gorm:"default:false" json:"quiz_passed"`
	CompletedAt      *time.Time `json:"completed_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// Project Submission
type ProjectSubmission struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID                  string     `gorm:"primaryKey;size:64" json:"id"`
	CohortID            string     `gorm:"size:64;index;not null" json:"cohort_id"`
	StageNumber         int        `gorm:"not null" json:"stage_number"`
	UserID              string     `gorm:"size:64;index;not null" json:"user_id"`
	ProjectTitle        string     `gorm:"size:255;not null" json:"project_title"`
	RepoURL             string     `gorm:"size:512" json:"repo_url"`
	FigmaURL            string     `gorm:"size:512" json:"figma_url"`
	LiveDemoURL         string     `gorm:"size:512" json:"live_demo_url"`
	Notes               string     `gorm:"type:text" json:"notes"`
	Status              string     `gorm:"size:32;default:'MENTOR_REVIEW'" json:"status"` // BACKLOG, IN_PROGRESS, PEER_REVIEW, MENTOR_REVIEW, REVISION_REQUESTED, APPROVED
	MentorID            *string    `gorm:"size:64;index" json:"mentor_id"`
	MentorRating        float64    `gorm:"default:0" json:"mentor_rating"`
	MentorFeedback      string     `gorm:"type:text" json:"mentor_feedback"`
	VideoReviewURL      string     `gorm:"size:512" json:"video_review_url"`
	SubmittedAt         time.Time  `json:"submitted_at"`
	ReviewedAt          *time.Time `json:"reviewed_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}

// Peer Pairing for Joint Collaboration
type PeerPairing struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID           string    `gorm:"primaryKey;size:64" json:"id"`
	CohortID     string    `gorm:"size:64;index;not null" json:"cohort_id"`
	StudentA_ID  string    `gorm:"size:64;index;not null" json:"student_a_id"`
	StudentB_ID  string    `gorm:"size:64;index;not null" json:"student_b_id"`
	SprintNumber int       `gorm:"default:1" json:"sprint_number"`
	Status       string    `gorm:"size:32;default:'ACTIVE'" json:"status"` // ACTIVE, COMPLETED
	SharedNotes  string    `gorm:"type:text" json:"shared_notes"`
	CreatedAt    time.Time `json:"created_at"`
}

// Real-Time Classroom Presence Session
type PresenceSession struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID            string    `gorm:"primaryKey;size:64" json:"id"`
	UserID        string    `gorm:"size:64;index;not null" json:"user_id"`
	RoomName      string    `gorm:"size:128;default:'Sprint Room Alpha'" json:"room_name"`
	Activity      string    `gorm:"size:64;default:'Coding'" json:"activity"` // Designing, Coding, Reviewing, Studying, In Mentor 1:1
	IsActive      bool      `gorm:"default:true" json:"is_active"`
	LastHeartbeat time.Time `json:"last_heartbeat"`
}

// Public Employer Portfolio Case Study
type PublicPortfolio struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID                 string    `gorm:"primaryKey;size:64" json:"id"`
	UserID             string    `gorm:"size:64;uniqueIndex;not null" json:"user_id"`
	Username           string    `gorm:"size:64;uniqueIndex;not null" json:"username"`
	Headline           string    `gorm:"size:255" json:"headline"`
	Bio                string    `gorm:"type:text" json:"bio"`
	CaseStudiesJSON    string    `gorm:"type:longtext" json:"case_studies_json"`
	MentorEndorsement  string    `gorm:"type:text" json:"mentor_endorsement"`
	IsAvailableForHire bool      `gorm:"default:true" json:"is_available_for_hire"`
	IsPublished        bool      `gorm:"default:true" json:"is_published"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

func (Cohort) TableName() string { return "crs_cohorts" }
func (Enrollment) TableName() string { return "crs_enrollments" }
func (JourneyStage) TableName() string { return "crs_journey_stages" }
func (JourneyModule) TableName() string { return "crs_journey_modules" }
func (ModuleProgress) TableName() string { return "crs_module_progress" }
func (ProjectSubmission) TableName() string { return "crs_project_submissions" }
func (PeerPairing) TableName() string { return "crs_peer_pairings" }
func (PresenceSession) TableName() string { return "crs_presence_sessions" }
func (PublicPortfolio) TableName() string { return "crs_public_portfolios" }

package models

import (
	"time"
)

// Program (Curriculum Template)
type Program struct {
	ID            string    `gorm:"primaryKey;size:64" json:"id"`
	TenantID      string    `gorm:"size:191;index;not null" json:"tenant_id"`
	Title         string    `gorm:"size:255;not null" json:"title"`
	Description   string    `gorm:"type:text" json:"description"`
	Status        string    `gorm:"size:32;default:'draft'" json:"status"` // draft, published
	DurationWeeks int       `gorm:"default:12" json:"duration_weeks"`
	BasePrice     float64   `gorm:"type:decimal(10,2);default:0" json:"base_price"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Cohort (Instance of a Program)
type Cohort struct {
	ID                  string    `gorm:"primaryKey;size:64" json:"id"`
	TenantID            string    `gorm:"size:191;index;not null" json:"tenant_id"`
	ProgramID           *string   `gorm:"size:64;index" json:"program_id"`
	Slug                string    `gorm:"unique;size:128;not null" json:"slug"`
	Title               string    `gorm:"size:255;not null" json:"title"`
	Subtitle            string    `gorm:"size:255" json:"subtitle"`
	Description         string    `gorm:"type:text" json:"description"`
	DurationWeeks       int       `gorm:"default:12" json:"duration_weeks"`
	StartDate           time.Time `json:"start_date"`
	EndDate             time.Time `json:"end_date"`
	Capacity            int       `gorm:"default:50" json:"capacity"`
	EnrolledCount       int       `gorm:"default:0" json:"enrolled_count"`
	Price               float64   `gorm:"type:decimal(10,2);default:0" json:"price"`
	Currency            string    `gorm:"size:10;default:'NGN'" json:"currency"`
	LeadMentorID        *string   `gorm:"size:64;index" json:"lead_mentor_id"`
	Status              string    `gorm:"size:32;default:'ENROLLING'" json:"status"`
	ModuleSchedulesJSON string    `gorm:"type:text" json:"module_schedules_json"`
	ImageURL            string    `gorm:"size:512" json:"image_url"`
	MeetingDays         string    `gorm:"size:255" json:"meeting_days"`
	MeetingTime         string    `gorm:"size:64" json:"meeting_time"`
	LocationType        string    `gorm:"size:64" json:"location_type"`
	DifficultyLevel     string    `gorm:"size:64" json:"difficulty_level"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`

	Program       *Program       `gorm:"foreignKey:ProgramID" json:"program,omitempty"`
	CohortMentors []CohortMentor `gorm:"foreignKey:CohortID" json:"cohort_mentors,omitempty"`
}

// CohortMentor
type CohortMentor struct {
	TenantID  string    `gorm:"size:191;index;not null" json:"tenant_id"`
	CohortID  string    `gorm:"primaryKey;size:64;not null" json:"cohort_id"`
	UserID    string    `gorm:"primaryKey;size:64;not null" json:"user_id"`
	Role      string    `gorm:"size:32;default:'MENTOR'" json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

// Enrollment
type Enrollment struct {
	TenantID           string     `gorm:"size:191;index;not null" json:"tenant_id"`
	ID                 string     `gorm:"primaryKey;size:64" json:"id"`
	CohortID           string     `gorm:"size:64;index;not null" json:"cohort_id"`
	UserID             string     `gorm:"size:64;index;not null" json:"user_id"`
	PlanType           string     `gorm:"size:32;default:'STANDARD'" json:"plan_type"`
	PaymentStatus      string     `gorm:"size:32;default:'PAID'" json:"payment_status"`
	SubscriptionID     *string    `gorm:"size:128" json:"subscription_id"`
	BillingCycle       string     `gorm:"size:32;default:'one-time'" json:"billing_cycle"`
	NextBillingDate    *time.Time `json:"next_billing_date"`
	LastPaymentFailed  bool       `gorm:"default:false" json:"last_payment_failed"`
	CurrentStageNumber int        `gorm:"default:1" json:"current_stage_number"`
	CurrentXP          int        `gorm:"default:0" json:"current_xp"`
	StreakDays         int        `gorm:"default:0" json:"streak_days"`
	LastActiveDate     *time.Time `json:"last_active_date"`
	Status             string     `gorm:"size:32;default:'ACTIVE'" json:"status"`
	EnrolledAt         time.Time  `json:"enrolled_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

// Transaction
type Transaction struct {
	ID        string    `gorm:"primaryKey;size:64" json:"id"`
	TenantID  string    `gorm:"size:191;index;not null" json:"tenant_id"`
	UserID    string    `gorm:"size:64;index;not null" json:"user_id"`
	CohortID  *string   `gorm:"size:64;index" json:"cohort_id"`
	Amount    float64   `gorm:"type:decimal(10,2);not null" json:"amount"`
	Currency  string    `gorm:"size:10;default:'NGN'" json:"currency"`
	Gateway   string    `gorm:"size:32;default:'paystack'" json:"gateway"`
	Reference string    `gorm:"unique;size:128;not null" json:"reference"`
	Status    string    `gorm:"size:32;default:'PENDING'" json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Journey Stage (Linked to Program)
type JourneyStage struct {
	TenantID        string    `gorm:"size:191;index;not null" json:"tenant_id"`
	ID              string    `gorm:"primaryKey;size:64" json:"id"`
	ProgramID       string    `gorm:"size:64;index;not null" json:"program_id"`
	StageNumber     int       `gorm:"not null" json:"stage_number"`
	Title           string    `gorm:"size:255;not null" json:"title"`
	Subtitle        string    `gorm:"size:255" json:"subtitle"`
	Description     string    `gorm:"type:text" json:"description"`
	VideoURL        string    `gorm:"size:512" json:"video_url"`
	ContentMarkdown string    `gorm:"type:text" json:"content_markdown"`
	ContentsJSON    string    `gorm:"type:text" json:"contents_json"`
	OrderIndex      int       `gorm:"default:0" json:"order_index"`
	CreatedAt       time.Time `json:"created_at"`
}

// Journey Module
type JourneyModule struct {
	TenantID          string    `gorm:"size:191;index;not null" json:"tenant_id"`
	ID                string    `gorm:"primaryKey;size:64" json:"id"`
	StageID           string    `gorm:"size:64;index;not null" json:"stage_id"`
	Title             string    `gorm:"size:255;not null" json:"title"`
	DurationText      string    `gorm:"size:64;default:'45 mins'" json:"duration_text"`
	Description       string    `gorm:"type:text" json:"description"`
	ReadingsCount     int       `gorm:"default:3" json:"readings_count"`
	HasQuiz           bool      `gorm:"default:true" json:"has_quiz"`
	HasChallenge      bool      `gorm:"default:true" json:"has_challenge"`
	TimeLimitMinutes  int       `gorm:"default:0" json:"time_limit_minutes"`
	ExpiryDays        int       `gorm:"default:0" json:"expiry_days"`
	VideoURL          string    `gorm:"size:512" json:"video_url"`
	ContentMarkdown   string    `gorm:"type:text" json:"content_markdown"`
	ContentsJSON      string    `gorm:"type:text" json:"contents_json"`
	AISummary         string    `gorm:"type:text" json:"ai_summary"`
	ReflectionPrompts string    `gorm:"type:text" json:"reflection_prompts"`
	OrderIndex        int       `gorm:"default:0" json:"order_index"`
	CreatedAt         time.Time `json:"created_at"`
}

// Module Progress
type ModuleProgress struct {
	TenantID         string     `gorm:"size:191;index;not null" json:"tenant_id"`
	ID               string     `gorm:"primaryKey;size:64" json:"id"`
	UserID           string     `gorm:"size:64;index;not null" json:"user_id"`
	ModuleID         string     `gorm:"size:64;index;not null" json:"module_id"`
	Completed        bool       `gorm:"default:false" json:"completed"`
	LastActiveIndex  int        `gorm:"default:0" json:"last_active_index"`
	CompletedItems   string     `gorm:"type:text" json:"completed_items"` // JSON array of completed indices
	ReflectionAnswer string     `gorm:"type:text" json:"reflection_answer"`
	QuizScore        int        `gorm:"default:0" json:"quiz_score"`
	QuizPassed       bool       `gorm:"default:false" json:"quiz_passed"`
	CompletedAt      *time.Time `json:"completed_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
}

// Project Submission
type ProjectSubmission struct {
	TenantID       string     `gorm:"size:191;index;not null" json:"tenant_id"`
	ID             string     `gorm:"primaryKey;size:64" json:"id"`
	CohortID       string     `gorm:"size:64;index;not null" json:"cohort_id"`
	StageNumber    int        `gorm:"not null" json:"stage_number"`
	UserID         string     `gorm:"size:64;index;not null" json:"user_id"`
	ProjectTitle   string     `gorm:"size:255;not null" json:"project_title"`
	RepoURL        string     `gorm:"size:512" json:"repo_url"`
	FigmaURL       string     `gorm:"size:512" json:"figma_url"`
	LiveDemoURL    string     `gorm:"size:512" json:"live_demo_url"`
	Notes          string     `gorm:"type:text" json:"notes"`
	Status         string     `gorm:"size:32;default:'MENTOR_REVIEW'" json:"status"`
	MentorID       *string    `gorm:"size:64;index" json:"mentor_id"`
	MentorRating   float64    `gorm:"default:0" json:"mentor_rating"`
	MentorFeedback string     `gorm:"type:text" json:"mentor_feedback"`
	VideoReviewURL string     `gorm:"size:512" json:"video_review_url"`
	SubmittedAt    time.Time  `json:"submitted_at"`
	ReviewedAt     *time.Time `json:"reviewed_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

// Block Submission
type BlockSubmission struct {
	ID             string     `gorm:"primaryKey;size:64" json:"id"`
	TenantID       string     `gorm:"size:191;index;not null" json:"tenant_id"`
	UserID         string     `gorm:"size:64;index;not null" json:"user_id"`
	ModuleID       string     `gorm:"size:64;index;not null" json:"module_id"`
	BlockID        string     `gorm:"size:64;index;not null" json:"block_id"`
	BlockType      string     `gorm:"size:64;not null" json:"block_type"`      // ASSIGNMENT, COMPILER, QUIZ
	SubmissionType string     `gorm:"size:64" json:"submission_type"`          // TEXT, LINK, FILE, CODE
	GroupID        *string    `gorm:"size:64;index" json:"group_id"`           // If this is a group assignment
	Content        string     `gorm:"type:text" json:"content"`                // The actual text, link, file URL, or code
	Score          int        `gorm:"default:0" json:"score"`                  // For quizzes
	Status         string     `gorm:"size:32;default:'PENDING'" json:"status"` // PENDING, REVIEWED
	MentorID       *string    `gorm:"size:64;index" json:"mentor_id"`
	MentorFeedback string     `gorm:"type:text" json:"mentor_feedback"`
	SubmittedAt    time.Time  `json:"submitted_at"`
	ReviewedAt     *time.Time `json:"reviewed_at"`
}

func (BlockSubmission) TableName() string { return "crs_block_submissions" }

// Peer Pairing
type PeerPairing struct {
	TenantID     string    `gorm:"size:191;index;not null" json:"tenant_id"`
	ID           string    `gorm:"primaryKey;size:64" json:"id"`
	CohortID     string    `gorm:"size:64;index;not null" json:"cohort_id"`
	StudentA_ID  string    `gorm:"size:64;index;not null" json:"student_a_id"`
	StudentB_ID  string    `gorm:"size:64;index;not null" json:"student_b_id"`
	SprintNumber int       `gorm:"default:1" json:"sprint_number"`
	Status       string    `gorm:"size:32;default:'ACTIVE'" json:"status"`
	SharedNotes  string    `gorm:"type:text" json:"shared_notes"`
	CreatedAt    time.Time `json:"created_at"`
}

// Presence Session
type PresenceSession struct {
	TenantID      string     `gorm:"size:191;index;not null" json:"tenant_id"`
	ID            string     `gorm:"primaryKey;size:64" json:"id"`
	UserID        string     `gorm:"size:64;index;not null" json:"user_id"`
	RoomName      string     `gorm:"size:128;default:'Sprint Room Alpha'" json:"room_name"`
	Activity      string     `gorm:"size:64;default:'Coding'" json:"activity"`
	IsActive      bool       `gorm:"default:true" json:"is_active"`
	LastHeartbeat *time.Time `json:"last_heartbeat"`
}

// Public Portfolio
type PublicPortfolio struct {
	ID                 string    `gorm:"primaryKey;size:64" json:"id"`
	TenantID           string    `gorm:"size:191;index;not null" json:"tenant_id"`
	UserID             string    `gorm:"size:64;unique;not null" json:"user_id"`
	Username           string    `gorm:"size:64;unique;not null" json:"username"`
	Headline           string    `gorm:"size:255" json:"headline"`
	Bio                string    `gorm:"type:text" json:"bio"`
	CaseStudiesJSON    string    `gorm:"type:text" json:"case_studies_json"`
	MentorEndorsement  string    `gorm:"type:text" json:"mentor_endorsement"`
	IsAvailableForHire bool      `gorm:"default:true" json:"is_available_for_hire"`
	IsPublished        bool      `gorm:"default:true" json:"is_published"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// Quiz
type Quiz struct {
	TenantID      string    `gorm:"size:191;index;not null" json:"tenant_id"`
	ID            string    `gorm:"primaryKey;size:64" json:"id"`
	ModuleID      string    `gorm:"size:64;index;not null" json:"module_id"`
	Title         string    `gorm:"size:255" json:"title"`
	GeneratedByAI bool      `gorm:"default:false" json:"generated_by_ai"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Quiz Question
type QuizQuestion struct {
	TenantID     string    `gorm:"size:191;index;not null" json:"tenant_id"`
	ID           string    `gorm:"primaryKey;size:64" json:"id"`
	QuizID       string    `gorm:"size:64;index;not null" json:"quiz_id"`
	Question     string    `gorm:"type:text;not null" json:"question"`
	QuestionType string    `gorm:"size:64;default:'MCQ'" json:"question_type"`
	OptionsJSON  string    `gorm:"type:jsonb;not null" json:"options_json"`
	CorrectIndex int       `gorm:"not null" json:"correct_index"`
	Explanation  string    `gorm:"type:text" json:"explanation"`
	BloomLevel   string    `gorm:"size:64" json:"bloom_level"`
	OrderIndex   int       `gorm:"default:0" json:"order_index"`
	CreatedAt    time.Time `json:"created_at"`
}

// AI Job
type AIJob struct {
	ID         string    `gorm:"primaryKey;size:64" json:"id"`
	TenantID   string    `gorm:"size:191;index;not null" json:"tenant_id"`
	JobType    string    `gorm:"size:64;not null" json:"job_type"`
	InputRef   string    `gorm:"size:255" json:"input_ref"`
	OutputRef  string    `gorm:"size:255" json:"output_ref"`
	Status     string    `gorm:"size:32;default:'PENDING'" json:"status"`
	ResultJSON string    `gorm:"type:jsonb" json:"result_json"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func (Program) TableName() string           { return "crs_programs" }
func (Cohort) TableName() string            { return "crs_cohorts" }
func (Enrollment) TableName() string        { return "crs_enrollments" }
func (Transaction) TableName() string       { return "crs_transactions" }
func (JourneyStage) TableName() string      { return "crs_journey_stages" }
func (JourneyModule) TableName() string     { return "crs_journey_modules" }
func (ModuleProgress) TableName() string    { return "crs_module_progress" }
func (ProjectSubmission) TableName() string { return "crs_project_submissions" }
func (PeerPairing) TableName() string       { return "crs_peer_pairings" }
func (PresenceSession) TableName() string   { return "crs_presence_sessions" }
func (PublicPortfolio) TableName() string   { return "crs_public_portfolios" }
func (Quiz) TableName() string              { return "crs_quizzes" }
func (QuizQuestion) TableName() string      { return "crs_quiz_questions" }
func (AIJob) TableName() string             { return "crs_ai_jobs" }
func (CohortMentor) TableName() string      { return "crs_cohort_mentors" }

// MentorProfile
type MentorProfile struct {
	UserID         string    `gorm:"primaryKey;size:64" json:"user_id"`
	TenantID       string    `gorm:"size:191;index;not null" json:"tenant_id"`
	FullName       string    `gorm:"size:255" json:"full_name"`
	AvatarURL      string    `gorm:"size:512" json:"avatar_url"`
	Specialization string    `gorm:"size:255" json:"specialization"`
	TotalReviews   int       `gorm:"default:0" json:"total_reviews"`
	PendingReviews int       `gorm:"default:0" json:"pending_reviews"`
	AvgRating      float64   `gorm:"default:0.0" json:"avg_rating"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

func (MentorProfile) TableName() string { return "crs_mentor_profiles" }

type StoreProduct struct {
	ID          string    `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	TenantID    string    `gorm:"type:uuid;not null;index" json:"tenant_id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	ProductType string    `gorm:"type:varchar(50);not null" json:"product_type"` // e.g., BOOK, DOWNLOADABLE_COURSE
	Price       float64   `gorm:"type:decimal(10,2);not null;default:0" json:"price"`
	CoverImage  string    `gorm:"type:text" json:"cover_image"`
	FileUrl     string    `gorm:"type:text" json:"file_url"`
	IsPublished bool      `gorm:"default:false" json:"is_published"`
	CreatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

// TableName overrides the table name for StoreProduct
func (StoreProduct) TableName() string {
	return "crs_store_products"
}

// TenantSettings stores tenant-wide configurations
type TenantSettings struct {
	TenantID            string    `gorm:"primaryKey;size:191" json:"tenant_id"`
	EnableMentorPayouts bool      `gorm:"default:true" json:"enable_mentor_payouts"`
	PayoutModel         string    `gorm:"size:50;default:'BASE_PLUS_SLA'" json:"payout_model"` // "PAY_PER_ACTION", "BASE_PLUS_SLA", "REVENUE_SHARE"
	PayoutConfigJSON    string    `gorm:"type:text;default:'{}'" json:"payout_config_json"`
	UpdatedAt           time.Time `json:"updated_at"`
}

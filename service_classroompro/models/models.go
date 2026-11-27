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

// StudyPack represents a curriculum, class, subject & scheme-of-work specific study pack
type StudyPack struct {
	PackID             string    `gorm:"primaryKey;size:191" json:"pack_id"`
	Slug               string    `gorm:"uniqueIndex;size:191" json:"slug"`
	TenantID           string    `gorm:"size:64;index" json:"tenant_id"`
	CreatorID          string    `gorm:"size:191;index" json:"creator_id"`
	CreatorRole        string    `gorm:"size:32" json:"creator_role"` // TEACHER, SCHOOL_ADMIN, PLATFORM_ADMIN
	CreatorName        string    `gorm:"size:191" json:"creator_name"`
	Title              string    `gorm:"size:255" json:"title"`
	Subtitle           string    `gorm:"size:500" json:"subtitle"`
	Description        string    `gorm:"type:text" json:"description"`
	PackScope          string    `gorm:"size:32" json:"pack_scope"` // FULL_TERM_SCHEME, MULTI_WEEK_UNIT, SINGLE_WEEK_TOPIC, EXAM_PREP, REMEDIAL
	Curriculum         string    `gorm:"size:64;index" json:"curriculum"`
	EducationLevel     string    `gorm:"size:64;index" json:"education_level"`
	ClassCode          string    `gorm:"size:64;index" json:"class_code"`
	ClassLabel         string    `gorm:"size:128" json:"class_label"`
	SubjectID          string    `gorm:"size:64;index" json:"subject_id"`
	SubjectName        string    `gorm:"size:191" json:"subject_name"`
	Term               string    `gorm:"size:64;index" json:"term"`
	TermLabel          string    `gorm:"size:128" json:"term_label"`
	SchemeStartWeek    int       `json:"scheme_start_week"`
	SchemeEndWeek      int       `json:"scheme_end_week"`
	SchemeOverviewJSON string    `gorm:"type:text" json:"scheme_overview_json"`
	PricingType        string    `gorm:"size:16;index" json:"pricing_type"` // FREE, PAID
	PriceKobo          int64     `json:"price_kobo"`
	Currency           string    `gorm:"size:8" json:"currency"`
	Visibility         string    `gorm:"size:32" json:"visibility"`        // PUBLIC, SCHOOL_ONLY, ASSIGNED_ONLY
	ModerationStatus   string    `gorm:"size:32;index" json:"moderation_status"` // DRAFT, PENDING_APPROVAL, PUBLISHED, ARCHIVED
	ActiveVersion      int       `json:"active_version"`
	CoverAssetID       string    `gorm:"size:255" json:"cover_asset_id"`
	PreviewWeek        int       `json:"preview_week"`
	TotalXPReward      int       `json:"total_xp_reward"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// PackExam represents a timed Mid-Term, Terminal, or WAEC/JAMB/BECE CBT mock exam bundled in a Study Pack
type PackExam struct {
	ID                       string    `gorm:"primaryKey;size:191" json:"id"`
	TenantID                 string    `gorm:"size:64;index" json:"tenant_id"`
	PackID                   string    `gorm:"size:191;index" json:"pack_id"`
	Curriculum               string    `gorm:"size:64" json:"curriculum"`
	ClassCode                string    `gorm:"size:64;index" json:"class_code"`
	SubjectID                string    `gorm:"size:64;index" json:"subject_id"`
	Term                     string    `gorm:"size:64" json:"term"`
	WeekNumber               int       `json:"week_number"`
	ExamType                 string    `gorm:"size:32" json:"exam_type"` // MID_TERM_CBT, TERMINAL_MOCK, WAEC_MOCK, JAMB_CBT
	Title                    string    `gorm:"size:255" json:"title"`
	Instructions             string    `gorm:"type:text" json:"instructions"`
	DurationMin              int       `json:"duration_min"`
	PassScorePct             int       `json:"pass_score_pct"`
	QuestionsJSON            string    `gorm:"type:text" json:"questions_json"`
	SyncToCampusproComponent string    `gorm:"size:32" json:"sync_to_campuspro_component"`
	CreatedBy                string    `gorm:"size:191" json:"created_by"`
	CreatedAt                time.Time `json:"created_at"`
}

// PackBadge represents a Bronze, Silver, or Gold achievement badge earned by mastering a Study Pack
type PackBadge struct {
	BadgeID        string    `gorm:"primaryKey;size:191" json:"badge_id"`
	PackID         string    `gorm:"size:191;index" json:"pack_id"`
	Code           string    `gorm:"uniqueIndex;size:128" json:"code"`
	Name           string    `gorm:"size:191" json:"name"`
	Description    string    `gorm:"size:500" json:"description"`
	IconSvgOrAsset string    `gorm:"size:255" json:"icon_svg_or_asset"`
	Tier           string    `gorm:"size:32" json:"tier"` // BRONZE, SILVER, GOLD
	XPBonus        int       `json:"xp_bonus"`
	UnlockRuleJSON string    `gorm:"type:text" json:"unlock_rule_json"`
	CreatedAt      time.Time `json:"created_at"`
}

// StudentPackBadge tracks earned study pack badges per student
type StudentPackBadge struct {
	ID            string    `gorm:"primaryKey;size:191" json:"id"`
	StudentID     string    `gorm:"size:191;uniqueIndex:idx_student_pack_badge" json:"student_id"`
	PackID        string    `gorm:"size:191;index" json:"pack_id"`
	BadgeID       string    `gorm:"size:191;uniqueIndex:idx_student_pack_badge" json:"badge_id"`
	XPAwarded     int       `json:"xp_awarded"`
	EarnedOffline bool      `json:"earned_offline"`
	AwardedAt     time.Time `json:"awarded_at"`
}

// StudyPackItem links an individual modality (NOTE, FLASHCARD_DECK, VIDEO, QUIZ, EXAM, BADGE) to a scheme-of-work week
type StudyPackItem struct {
	ID               string `gorm:"primaryKey;size:191" json:"id"`
	PackID           string `gorm:"size:191;index" json:"pack_id"`
	Version          int    `json:"version"`
	WeekNumber       int    `json:"week_number"`
	TopicID          string `gorm:"size:191" json:"topic_id"`
	TopicTitle       string `gorm:"size:255" json:"topic_title"`
	Position         int    `json:"position"`
	ItemType         string `gorm:"size:32" json:"item_type"` // NOTE, FLASHCARD_DECK, VIDEO, QUIZ, EXAM, BADGE
	ContentID        string `gorm:"size:191" json:"content_id"`
	ContentVersion   int    `json:"content_version"`
	RequiredForBadge bool   `json:"required_for_badge"`
	IsFreePreview    bool   `json:"is_free_preview"`
}

// StudyPackVersion tracks immutable compiled bundles stored in Neon Object Storage
type StudyPackVersion struct {
	ID              string    `gorm:"primaryKey;size:191" json:"id"`
	PackID          string    `gorm:"size:191;uniqueIndex:idx_pack_ver" json:"pack_id"`
	Version         int       `gorm:"uniqueIndex:idx_pack_ver" json:"version"`
	PackageID       string    `gorm:"size:191" json:"package_id"`
	NeonStorageKey  string    `gorm:"size:512" json:"neon_storage_key"`
	SizeBytes       int64     `json:"size_bytes"`
	ChecksumSHA256  string    `gorm:"size:128" json:"checksum_sha256"`
	WeeksCount      int       `json:"weeks_count"`
	NotesCount      int       `json:"notes_count"`
	FlashcardsCount int       `json:"flashcards_count"`
	VideosCount     int       `json:"videos_count"`
	QuizzesCount    int       `json:"quizzes_count"`
	ExamsCount      int       `json:"exams_count"`
	BadgesCount     int       `json:"badges_count"`
	Changelog       string    `gorm:"type:text" json:"changelog"`
	PublishedBy     string    `gorm:"size:191" json:"published_by"`
	PublishedAt     time.Time `json:"published_at"`
}

// PackOrder tracks parent or school purchases of paid study packs via Paystack
type PackOrder struct {
	OrderID                   string     `gorm:"primaryKey;size:191" json:"order_id"`
	TenantID                  string     `gorm:"size:64;index" json:"tenant_id"`
	BuyerUserID               string     `gorm:"size:191;index" json:"buyer_user_id"`
	BuyerRole                 string     `gorm:"size:32" json:"buyer_role"` // PARENT, STUDENT, SCHOOL_ADMIN
	BuyerEmail                string     `gorm:"size:191" json:"buyer_email"`
	PackID                    string     `gorm:"size:191;index" json:"pack_id"`
	BeneficiaryStudentIDsJSON string     `gorm:"type:text" json:"beneficiary_student_ids_json"`
	UnitPriceKobo             int64      `json:"unit_price_kobo"`
	SeatsCount                int        `json:"seats_count"`
	TotalAmountKobo           int64      `json:"total_amount_kobo"`
	Currency                  string     `gorm:"size:8" json:"currency"`
	PaystackReference         string     `gorm:"uniqueIndex;size:191" json:"paystack_reference"`
	PaystackAccessCode        string     `gorm:"size:191" json:"paystack_access_code"`
	Status                    string     `gorm:"size:32;index" json:"status"` // PENDING, PAID, FAILED, REFUNDED
	PaidAt                    *time.Time `json:"paid_at,omitempty"`
	RefundedAt                *time.Time `json:"refunded_at,omitempty"`
	RefundReason              string     `gorm:"type:text" json:"refund_reason,omitempty"`
	CreatedAt                 time.Time  `json:"created_at"`
}

// PackEntitlement grants perpetual access to a linked child/student and supports revocation on refund
type PackEntitlement struct {
	EntitlementID        string     `gorm:"primaryKey;size:191" json:"entitlement_id"`
	PackID               string     `gorm:"size:191;uniqueIndex:idx_pack_beneficiary" json:"pack_id"`
	BeneficiaryStudentID string     `gorm:"size:191;uniqueIndex:idx_pack_beneficiary;index" json:"beneficiary_student_id"`
	PurchasedByUserID    string     `gorm:"size:191;index" json:"purchased_by_user_id"`
	TenantID             string     `gorm:"size:64;index" json:"tenant_id"`
	GrantSource          string     `gorm:"size:32" json:"grant_source"` // PARENT_PURCHASE, FREE_CLAIM, TEACHER_ASSIGN, REMEDIAL_LOOP, SCHOOL_BULK
	OrderID              string     `gorm:"size:191" json:"order_id,omitempty"`
	LicenseType          string     `gorm:"size:32" json:"license_type"` // PERPETUAL
	Status               string     `gorm:"size:32;index" json:"status"` // ACTIVE, REVOKED
	GrantedAt            time.Time  `json:"granted_at"`
	RevokedAt            *time.Time `json:"revoked_at,omitempty"`
	RevokeReason         string     `gorm:"size:255" json:"revoke_reason,omitempty"`
}

// PackDownload logs device downloads and tracks offline IndexedDB purges when an entitlement is revoked
type PackDownload struct {
	DownloadID        string     `gorm:"primaryKey;size:191" json:"download_id"`
	EntitlementID     string     `gorm:"size:191;index" json:"entitlement_id"`
	PackID            string     `gorm:"size:191;index" json:"pack_id"`
	PackVersion       int        `json:"pack_version"`
	StudentID         string     `gorm:"size:191;index" json:"student_id"`
	DeviceFingerprint string     `gorm:"size:191" json:"device_fingerprint"`
	Status            string     `gorm:"size:32" json:"status"` // DOWNLOADED, PURGED_ON_REVOKE, REMOVED_BY_USER
	DownloadedAt      time.Time  `json:"downloaded_at"`
	PurgedAt          *time.Time `json:"purged_at,omitempty"`
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
func (StudyPack) TableName() string             { return "cls_study_packs" }
func (PackExam) TableName() string              { return "cls_pack_exams" }
func (PackBadge) TableName() string             { return "cls_pack_badges" }
func (StudentPackBadge) TableName() string      { return "cls_student_pack_badges" }
func (StudyPackItem) TableName() string         { return "cls_study_pack_items" }
func (StudyPackVersion) TableName() string      { return "cls_study_pack_versions" }
func (PackOrder) TableName() string             { return "cls_pack_orders" }
func (PackEntitlement) TableName() string       { return "cls_pack_entitlements" }
func (PackDownload) TableName() string          { return "cls_pack_downloads" }

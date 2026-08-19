package models

import "time"

type Curriculum struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Country   string    `json:"country"`
	CreatedAt time.Time `json:"created_at"`
}

type AcademicSession struct {
	ID        string    `json:"id"`
	TenantID  string    `json:"tenant_id"`
	Name      string    `json:"name"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	IsCurrent bool      `json:"is_current"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Term struct {
	ID        string    `json:"id"`
	SessionID string    `json:"session_id"`
	Name      string    `json:"name"`
	IsCurrent bool      `json:"is_current"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Class struct {
	ID           string    `json:"id"`
	TenantID     string    `json:"tenant_id"`
	CurriculumID string    `json:"curriculum_id,omitempty"`
	Name         string    `json:"name"`
	Level        int       `json:"level"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Section struct {
	ID         string    `json:"id"`
	ClassID    string    `json:"class_id"`
	Name       string    `json:"name"`
	RoomNumber string    `json:"room_number"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Subject struct {
	ID        string    `json:"id"`
	TenantID  string    `json:"tenant_id"`
	Name      string    `json:"name"`
	Code      string    `json:"code"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type SyllabusWeek struct {
	ID         string    `json:"id"`
	SubjectID  string    `json:"subject_id"`
	WeekNumber int       `json:"week_number"`
	Term       int       `json:"term"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Topic struct {
	ID             string    `json:"id"`
	SyllabusWeekID string    `json:"syllabus_week_id"`
	Name           string    `json:"name"`
	Description    string    `json:"description"`
	Order          int       `json:"order"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type ExamBody struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type NationalExam struct {
	ID         string `json:"id"`
	ExamBodyID string `json:"exam_body_id"`
	Name       string `json:"name"`
}

type AreaOfConcentration struct {
	ID             string    `json:"id"`
	NationalExamID string    `json:"national_exam_id"`
	SubjectName    string    `json:"subject_name"`
	SyllabusData   string    `json:"syllabus_data"` // JSON array of topics / focus areas
	CreatedAt      time.Time `json:"created_at"`
}

type Assignment struct {
	ID        string    `json:"id"`
	SectionID string    `json:"section_id"`
	SubjectID string    `json:"subject_id"`
	TeacherID string    `json:"teacher_id"`
	TermID    string    `json:"term_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Enrollment struct {
	ID        string    `json:"id"`
	StudentID string    `json:"student_id"`
	SectionID string    `json:"section_id"`
	SessionID string    `json:"session_id"`
	Status    string    `json:"status"` // active, transferred, graduated, suspended
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ResourceLink struct {
	ID           string    `json:"id"`
	TopicID      string    `json:"topic_id"`
	AppID        string    `json:"app_id"`
	ResourceType string    `json:"resource_type"`
	ExternalID   string    `json:"external_id"`
	Title        string    `json:"title"`
	URL          string    `json:"url"`
	CreatedAt    time.Time `json:"created_at"`
}

type StudentProgress struct {
	ID          string     `json:"id"`
	StudentID   string     `json:"student_id"`
	TopicID     string     `json:"topic_id"`
	Status      string     `json:"status"` // NOT_STARTED, IN_PROGRESS, COMPLETED
	Score       float64    `json:"score"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type EngagementMetric struct {
	ID        string    `json:"id"`
	StudentID string    `json:"student_id"`
	TenantID  string    `json:"tenant_id"`
	Type      string    `json:"type"`
	Value     float64   `json:"value"`
	Metadata  string    `json:"metadata"`
	Date      time.Time `json:"date"`
}

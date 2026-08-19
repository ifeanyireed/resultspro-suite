package models

import "time"

type ResultsInstance struct {
	ID                 string    `json:"id"`
	SchoolID           string    `json:"school_id"`
	SessionID          string    `json:"session_id"`
	SessionName        string    `json:"session_name"`
	TermID             string    `json:"term_id"`
	TermName           string    `json:"term_name"`
	Status             string    `json:"status"` // DRAFT, PUBLISHED, ARCHIVED
	ExamConfig         string    `json:"exam_config"` // JSON components: [{"name": "CAT 1", "max": 20}, {"name": "CAT 2", "max": 20}, {"name": "Exam", "max": 60}]
	TotalPossibleScore float64   `json:"total_possible_score"`
	PublishedAt        *time.Time `json:"published_at,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type SubjectScore struct {
	SubjectID   string  `json:"subject_id"`
	SubjectName string  `json:"subject_name"`
	CAT1        float64 `json:"cat1"`
	CAT2        float64 `json:"cat2"`
	Exam        float64 `json:"exam"`
	Total       float64 `json:"total"`
	Grade       string  `json:"grade"` // A, B, C, D, E, F
	Remark      string  `json:"remark"` // Excellent, Very Good, Good, Pass, Fail
}

type StudentResult struct {
	ID                string         `json:"id"`
	InstanceID        string         `json:"instance_id"`
	StudentID         string         `json:"student_id"`
	StudentName       string         `json:"student_name"`
	SectionID         string         `json:"section_id"`
	SectionName       string         `json:"section_name"`
	Scores            []SubjectScore `json:"scores"`
	TotalScore        float64        `json:"total_score"`
	AverageScore      float64        `json:"average_score"`
	GPA               float64        `json:"gpa"`
	Position          int            `json:"position"`
	TotalInClass      int            `json:"total_in_class"`
	PrincipalComment  string         `json:"principal_comment"`
	TeacherComment    string         `json:"teacher_comment"`
	AffectiveDomain   string         `json:"affective_domain"` // JSON ratings (Punctuality, Neatness, etc.)
	PsychomotorDomain string         `json:"psychomotor_domain"` // JSON ratings (Handwriting, Sports, etc.)
	AttendanceDays    int            `json:"attendance_days"`
	TotalDays         int            `json:"total_days"`
	Status            string         `json:"status"` // PENDING, APPROVED, PUBLISHED
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
}

type GradingRule struct {
	Grade      string  `json:"grade"`
	MinScore   float64 `json:"min_score"`
	MaxScore   float64 `json:"max_score"`
	GradePoint float64 `json:"grade_point"`
	Remark     string  `json:"remark"`
}

type GradingSystem struct {
	ID       string        `json:"id"`
	SchoolID string        `json:"school_id"`
	Name     string        `json:"name"`
	Rules    []GradingRule `json:"rules"`
	IsDefault bool         `json:"is_default"`
}

func (ResultsInstance) TableName() string {
	return "res_instances"
}

func (StudentResult) TableName() string {
	return "res_student_results"
}

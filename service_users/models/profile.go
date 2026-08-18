package models

import "time"

// AcademicProfile represents the comprehensive universal handshake response
type AcademicProfile struct {
	UserID        string             `json:"user_id"`
	Email         string             `json:"email,omitempty"`
	FullName      string             `json:"full_name,omitempty"`
	AvatarURL     string             `json:"avatar_url,omitempty"`
	Phone         string             `json:"phone,omitempty"`
	AccountStatus string             `json:"account_status,omitempty"`
	Roles         []RoleDetail       `json:"roles"`
	Subscriptions []UserSubscription `json:"subscriptions,omitempty"`
	Dependents    []DependentDetail  `json:"dependents,omitempty"`
	Enrollment    []EnrollmentDetail `json:"enrollment,omitempty"`
	Teaching      []TeachingDetail   `json:"teaching,omitempty"`
}

type RoleDetail struct {
	SchoolID              string     `json:"school_id"`
	SchoolName            string     `json:"school_name"`
	SchoolSlug            string     `json:"school_slug"`
	SubscriptionTier      string     `json:"subscription_tier,omitempty"`
	SubscriptionExpiresAt *time.Time `json:"subscription_expires_at,omitempty"`
	Role                  string     `json:"role"` // student, teacher, parent, school-admin, super-admin, agent
	Status                string     `json:"status"`
}

type DependentDetail struct {
	UserID       string `json:"user_id"`
	FullName     string `json:"full_name,omitempty"`
	Relationship string `json:"relationship"`
	SchoolID     string `json:"school_id,omitempty"`
	ClassName    string `json:"class_name,omitempty"`
}

type EnrollmentDetail struct {
	SchoolID    string `json:"school_id"`
	SchoolName  string `json:"school_name,omitempty"`
	ClassID     string `json:"class_id,omitempty"`
	ClassName   string `json:"class_name"`
	SectionID   string `json:"section_id,omitempty"`
	SectionName string `json:"section_name"`
	SessionID   string `json:"session_id,omitempty"`
	SessionName string `json:"session_name"`
}

type TeachingDetail struct {
	SchoolID    string `json:"school_id"`
	SchoolName  string `json:"school_name,omitempty"`
	ClassID     string `json:"class_id,omitempty"`
	ClassName   string `json:"class_name"`
	SectionID   string `json:"section_id,omitempty"`
	SectionName string `json:"section_name"`
	SubjectID   string `json:"subject_id,omitempty"`
	SubjectName string `json:"subject_name"`
	TermID      string `json:"term_id,omitempty"`
	TermName    string `json:"term_name"`
}

// BulkProfileContext represents a lightweight academic context for a user in lists/leaderboards
type BulkProfileContext struct {
	UserID     string `json:"user_id"`
	FullName   string `json:"full_name,omitempty"`
	Email      string `json:"email,omitempty"`
	SchoolName string `json:"school_name"`
	ClassName  string `json:"class_name,omitempty"`
	Role       string `json:"role"`
}

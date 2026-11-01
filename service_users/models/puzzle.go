package models

import "time"

type PuzzleOrganisation struct {
	ID               string         `json:"id"`
	Name             string         `json:"name"`
	Domain           string         `json:"domain"`
	ContactEmail     string         `json:"contact_email"`
	ContactPhone     string         `json:"contact_phone"`
	Password         string         `json:"password,omitempty"`
	LogoURL          string         `json:"logo_url,omitempty"`
	Token            string         `json:"token"`
	GoogleAdsEnabled bool           `json:"google_ads_enabled"`
	Type             string         `json:"type"` // "school" | "family" | "enterprise"
	EmailVerified    bool           `json:"email_verified"`
	ActiveStudents   int            `json:"active_students,omitempty"`
	Groups           []string       `json:"groups,omitempty"`
	Centres          []PuzzleCentre `json:"centres,omitempty"`
	CreatedAt        time.Time      `json:"created_at,omitempty"`
}

type PuzzleCentre struct {
	ID             int       `json:"id"`
	OrganisationID string    `json:"organisation_id,omitempty"`
	Name           string    `json:"name"`
	Location       string    `json:"location,omitempty"`
	Code           string    `json:"code,omitempty"`
	CreatedAt      time.Time `json:"created_at,omitempty"`
}

type PuzzleGroup struct {
	ID              int       `json:"id"`
	OrganisationID  string    `json:"organisation_id,omitempty"`
	CentreID        *int      `json:"centre_id,omitempty"`
	CentreName      string    `json:"centre_name,omitempty"`
	Name            string    `json:"name"`
	Code            string    `json:"code"`
	AssignedWorldID int       `json:"assigned_world_id,omitempty"`
	CreatedAt       time.Time `json:"created_at,omitempty"`
}

type PuzzleUser struct {
	ID               int       `json:"id"`
	Username         string    `json:"username"`
	AccessCode       string    `json:"access_code,omitempty"`
	Role             string    `json:"role"`
	OrganisationID   string    `json:"organisation_id,omitempty"`
	OrganisationName string    `json:"organisation_name,omitempty"`
	GroupID          *int      `json:"group_id,omitempty"`
	GroupName        string    `json:"group_name,omitempty"`
	Avatar           string    `json:"avatar"`
	AssignedWorldID  int       `json:"assigned_world_id,omitempty"`
	TotalXP          int       `json:"total_xp"`
	TotalStars       int       `json:"total_stars"`
	CreatedAt        time.Time `json:"created_at,omitempty"`
}

type PuzzleSubscription struct {
	ID               string    `json:"id"`
	OrganisationID   string    `json:"organisation_id,omitempty"`
	OrganisationName string    `json:"organisation_name"`
	UserEmail        string    `json:"user_email"`
	PlanName         string    `json:"plan_name"`
	Status           string    `json:"status"`
	Seats            int       `json:"seats"`
	Price            string    `json:"price"`
	RenewalDate      string    `json:"renewal_date"`
	CreatedAt        time.Time `json:"created_at,omitempty"`
}

type PuzzleVerificationCode struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Code      string    `json:"code"`
	Type      string    `json:"type"`
	ExpiresAt time.Time `json:"expires_at"`
	Used      bool      `json:"used"`
	CreatedAt time.Time `json:"created_at"`
}

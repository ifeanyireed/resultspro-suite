package models

import "time"

type Tenant struct {
	ID                    string     `json:"id"`
	Type                  string     `json:"type"` // SCHOOL, FAMILY, CORPORATE
	Name                  string     `json:"name"`
	Slug                  string     `json:"slug"`
	DefaultSubdomain      string     `json:"default_subdomain"` // e.g., oxford.resultspro.ng
	CustomDomain          string     `json:"custom_domain,omitempty"`
	TenantCode            string     `json:"tenant_code,omitempty"`
	ShortName             string     `json:"short_name,omitempty"`
	Motto                 string     `json:"motto,omitempty"`
	LogoURL               string     `json:"logo_url,omitempty"`
	LogoEmoji             string     `json:"logo_emoji,omitempty"`
	PrimaryColor          string     `json:"primary_color,omitempty"`
	SecondaryColor        string     `json:"secondary_color,omitempty"`
	AccentColor           string     `json:"accent_color,omitempty"`
	ContactEmail          string     `json:"contact_email,omitempty"`
	ContactPhone          string     `json:"contact_phone,omitempty"`
	ContactPersonName     string     `json:"contact_person_name,omitempty"`
	FullAddress           string     `json:"full_address,omitempty"`
	State                 string     `json:"state,omitempty"`
	LGA                   string     `json:"lga,omitempty"`
	Status                string     `json:"status"`              // ACTIVE, INACTIVE, SUSPENDED
	VerificationStatus    string     `json:"verification_status"` // PENDING_VERIFICATION, VERIFIED, REJECTED
	ReferredByAgentID     string     `json:"referred_by_agent_id,omitempty"`
	SubscriptionTier      string     `json:"subscription_tier,omitempty"` // FREE, BASIC, PRO, ENTERPRISE
	SubscriptionExpiresAt *time.Time `json:"subscription_expires_at,omitempty"`
	EnabledModules        string     `json:"enabled_modules,omitempty"` // JSON array e.g., ["resultspro", "examspro"]
	Settings              string     `json:"settings,omitempty"` // JSON payload (theme, features, etc.)
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
}

type UserTenantRole struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	TenantID  string    `json:"tenant_id"`
	Role      string    `json:"role"` // student, teacher, parent, tenant-admin, super-admin, agent, platform-admin
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type FamilyRelationship struct {
	ID                 string    `json:"id"`
	ParentUserID       string    `json:"parent_user_id"`
	ChildUserID        string    `json:"child_user_id"`
	RelationshipType   string    `json:"relationship_type"` // father, mother, guardian, sponsor
	IsEmergencyContact bool      `json:"is_emergency_contact"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type AgentCommission struct {
	AgentID       string    `json:"agent_id"`
	DefaultRate   float64   `json:"default_rate"`
	BankName      string    `json:"bank_name,omitempty"`
	AccountNumber string    `json:"account_number,omitempty"`
	AccountName   string    `json:"account_name,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type AgentEarning struct {
	ID         string    `json:"id"`
	AgentID    string    `json:"agent_id"`
	TenantID   string    `json:"tenant_id"`
	Amount     float64   `json:"amount"`
	SourceType string    `json:"source_type"` // SCRATCH_CARD, TUITION, SUBSCRIPTION
	SourceID   string    `json:"source_id,omitempty"`
	Status     string    `json:"status"` // EARNED, PAID
	CreatedAt  time.Time `json:"created_at"`
}

type PayoutRequest struct {
	ID          string     `json:"id"`
	AgentID     string     `json:"agent_id"`
	Amount      float64    `json:"amount"`
	Status      string     `json:"status"` // PENDING, APPROVED, PAID, REJECTED
	ProcessedAt *time.Time `json:"processed_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

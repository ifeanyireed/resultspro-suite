package models

import "time"

type UserSubscription struct {
	ID        string     `json:"id"`
	UserID    string     `json:"user_id"`
	Type      string     `json:"type"` // FAMILY, AGENT
	Tier      string     `json:"tier"` // BASIC, PRO, PREMIUM
	Status    string     `json:"status"` // ACTIVE, EXPIRED, CANCELLED
	ExpiresAt *time.Time `json:"expires_at"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

type TenantSubscriptionInfo struct {
	TenantID    string     `json:"tenant_id"`
	PlanName    string     `json:"plan_name"`
	Status      string     `json:"status"` // ACTIVE, EXPIRED, TRIAL
	ExpiresAt   *time.Time `json:"expires_at,omitempty"`
	MaxStudents int        `json:"max_students"`
	MaxTeachers int        `json:"max_teachers"`
	MaxResults  int        `json:"max_results_per_term"`
	Features    []string   `json:"features"`
}

type PlanLimits struct {
	MaxStudents       int      `json:"max_students"`
	MaxTeachers       int      `json:"max_teachers"`
	MaxResultsPerTerm int      `json:"max_results_per_term"`
	Features          []string `json:"features"`
}

type ResourceUsage struct {
	Used      int  `json:"used"`
	Limit     int  `json:"limit"`
	IsAtLimit bool `json:"is_at_limit"`
}

type SubscriptionUsageReport struct {
	Plan     string        `json:"plan"`
	Students ResourceUsage `json:"students"`
	Teachers ResourceUsage `json:"teachers"`
	Results  ResourceUsage `json:"results"`
}

type SubscriptionCheckResponse struct {
	Success bool                     `json:"success"`
	Message string                   `json:"message,omitempty"`
	Usage   *SubscriptionUsageReport `json:"usage,omitempty"`
}

type Plan struct {
	ID                string    `json:"id"`
	Name              string    `json:"name"` // Free, Pro, Enterprise
	MonthlyPrice      float64   `json:"monthly_price"`
	AnnualPrice       float64   `json:"annual_price"`
	Currency          string    `json:"currency"` // NGN, USD
	MaxStudents       int       `json:"max_students"`
	MaxTeachers       int       `json:"max_teachers"`
	MaxResultsPerTerm int       `json:"max_results_per_term"`
	StorageGB         int       `json:"storage_gb"`
	Features          string    `json:"features"` // JSON array of features
	IsActive          bool      `json:"is_active"`
	CreatedAt         time.Time `json:"created_at"`
}

type Invoice struct {
	ID            string     `json:"id"`
	TenantID      string     `json:"tenant_id"`
	PlanID        string     `json:"plan_id"`
	PlanName      string     `json:"plan_name"`
	InvoiceNumber string     `json:"invoice_number"`
	Amount        float64    `json:"amount"`
	Currency      string     `json:"currency"`
	Status        string     `json:"status"` // PENDING, PAID, FAILED, CANCELLED
	BillingCycle  string     `json:"billing_cycle"` // MONTHLY, ANNUAL, TERMLY
	DueDate       time.Time  `json:"due_date"`
	PaidAt        *time.Time `json:"paid_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
}

type PaymentTransaction struct {
	ID            string     `json:"id"`
	InvoiceID     string     `json:"invoice_id"`
	TenantID      string     `json:"tenant_id"`
	Amount        float64    `json:"amount"`
	Currency      string     `json:"currency"`
	PaymentMethod string     `json:"payment_method"` // PAYSTACK, STRIPE, FLUTTERWAVE, BANK_TRANSFER
	Reference     string     `json:"reference"`
	Status        string     `json:"status"` // PENDING, SUCCESSFUL, FAILED
	PaidAt        *time.Time `json:"paid_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
}

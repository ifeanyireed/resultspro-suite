package models

import "time"

type DemoBooking struct {
	ID                string    `json:"id" gorm:"primaryKey;type:varchar(191)"`
	ReferenceCode     string    `json:"reference_code" gorm:"column:reference_code;type:varchar(64);uniqueIndex"`
	OrganizationType  string    `json:"organization_type" gorm:"column:organization_type;type:varchar(191)"`
	PainPoints        string    `json:"pain_points" gorm:"column:pain_points;type:text"`
	StudentCount      string    `json:"student_count" gorm:"column:student_count;type:varchar(100)"`
	CampusCount       string    `json:"campus_count" gorm:"column:campus_count;type:varchar(100)"`
	Infrastructure    string    `json:"infrastructure" gorm:"column:infrastructure;type:varchar(191)"`
	MigrationNeed     string    `json:"migration_need" gorm:"column:migration_need;type:varchar(191)"`
	Timeline          string    `json:"timeline" gorm:"column:timeline;type:varchar(100)"`
	SelectedSolutions string    `json:"selected_solutions" gorm:"column:selected_solutions;type:text"`
	DemoFormat        string    `json:"demo_format" gorm:"column:demo_format;type:varchar(100)"`
	PreferredDate     string    `json:"preferred_date" gorm:"column:preferred_date;type:varchar(50)"`
	PreferredTime     string    `json:"preferred_time" gorm:"column:preferred_time;type:varchar(50)"`
	FullName          string    `json:"full_name" gorm:"column:full_name;type:varchar(191)"`
	Email             string    `json:"email" gorm:"column:email;type:varchar(191);index"`
	Phone             string    `json:"phone" gorm:"column:phone;type:varchar(64)"`
	InstitutionName   string    `json:"institution_name" gorm:"column:institution_name;type:varchar(255)"`
	Role              string    `json:"role" gorm:"column:role;type:varchar(191)"`
	Notes             string    `json:"notes" gorm:"column:notes;type:text"`
	Status            string    `json:"status" gorm:"column:status;type:varchar(50);default:'NEW'"` // NEW, CONTACTED, SCHEDULED, COMPLETED, CANCELLED
	AdminNotes        string    `json:"admin_notes" gorm:"column:admin_notes;type:text"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

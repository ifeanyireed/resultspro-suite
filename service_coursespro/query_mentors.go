package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/joho/godotenv"
)

type MentorProfile struct {
	UserID         string `gorm:"primaryKey;size:64" json:"user_id"`
	TenantID       string `gorm:"size:191;index;not null" json:"tenant_id"`
	FullName       string `gorm:"size:255" json:"full_name"`
	Specialization string
}
func (MentorProfile) TableName() string { return "crs_mentor_profiles" }

type CohortMentor struct {
	CohortID string
	UserID   string
}
func (CohortMentor) TableName() string { return "crs_cohort_mentors" }

func main() {
	godotenv.Load()
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	var mentors []MentorProfile
	db.Find(&mentors)
	for _, m := range mentors {
		fmt.Printf("Mentor: %s, Spec: %s\n", m.FullName, m.Specialization)
		var cohorts []CohortMentor
		db.Where("user_id = ?", m.UserID).Find(&cohorts)
		for _, c := range cohorts {
			fmt.Printf("  -> Cohort: %s\n", c.CohortID)
		}
	}
}

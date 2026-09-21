package main

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Cohort struct {
	ID                  string
	Title               string
	ModuleSchedulesJSON string
}

type Stage struct {
	ID           string
	Title        string
	ContentsJSON string
}

func main() {
	dsn := "postgresql://neondb_owner:npg_PlmqORh64gNG@ep-steep-bar-ayq6g77r-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("DB error", err)
		return
	}
	
	var cohorts []Cohort
	db.Table("crs_cohorts").Where("module_schedules_json IS NOT NULL AND module_schedules_json != ''").Find(&cohorts)
	
	fmt.Printf("Found %d cohorts with schedules\n", len(cohorts))
	for _, c := range cohorts {
		fmt.Printf("Cohort: %s\n", c.Title)
		fmt.Printf("Schedules: %s\n", c.ModuleSchedulesJSON)
	}

	var stages []Stage
	db.Table("crs_journey_stages").Find(&stages)
	fmt.Printf("Found %d stages\n", len(stages))
	for _, s := range stages {
		if s.ContentsJSON != "" {
			fmt.Printf("Stage %s: %s\n", s.Title, s.ContentsJSON)
		}
	}
}

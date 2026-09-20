package main

import (
	"encoding/json"
	"fmt"
	"service_coursespro/models"
)

type MentorResponse struct {
	models.MentorProfile
	CohortAssignments []string `json:"cohort_assignments"`
	CohortIDs         []string `json:"cohort_ids"`
}

func main() {
	m := MentorResponse{
		MentorProfile: models.MentorProfile{
			UserID: "123",
		},
	}
	b, _ := json.Marshal(m)
	fmt.Println(string(b))
}

package main

import (
	"encoding/json"
	"fmt"
	"exams-resultspro-backend/internal/models"
)

func main() {
	var user models.User
	plan := "ICAN_FULL"
	user.IcanPlan = &plan
	user.HasIcan = true

	b, _ := json.Marshal(user)
	fmt.Println(string(b))
}

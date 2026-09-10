package utils

import (
	"strings"
	"fmt"
	"exams-resultspro-backend/internal/models"
)

func CheckIcanAccess(user *models.User, examName string, subjectID string) error {
	if strings.ToLower(examName) != "ican" {
		return nil
	}
	if !user.HasIcan {
		return fmt.Errorf("You do not have an active ICAN plan.")
	}
	if user.IcanPlan == nil {
		return nil
	}
	plan := *user.IcanPlan
	// Normalizing just in case legacy string formats exist
	if plan == "Single Paper" || plan == "Complete Level" || plan == "ICAN_SINGLE" || plan == "ICAN_GROUP" {
		if user.IcanTargets == nil || *user.IcanTargets == "" {
			return fmt.Errorf("Your %s plan does not have any assigned papers. Please contact support.", plan)
		}
		targets := strings.Split(*user.IcanTargets, ",")
		allowed := false
		for _, t := range targets {
			if strings.TrimSpace(t) == subjectID {
				allowed = true
				break
			}
		}
		if !allowed {
			return fmt.Errorf("Your ICAN plan (%s) does not grant access to this specific paper. Upgrade your plan for access.", plan)
		}
	}
	return nil
}

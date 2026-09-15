package utils

import (
	"strings"
	"fmt"
	"exams-resultspro-backend/internal/models"
	"exams-resultspro-backend/internal/database"
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

	// ICAN_FULL gets unlimited access
	if plan == "ICAN_FULL" {
		return nil
	}

	if plan == "Single Paper" || plan == "Complete Level" || plan == "ICAN_SINGLE" || plan == "ICAN_GROUP" {
		maxPapers := 1
		if plan == "Complete Level" || plan == "ICAN_GROUP" {
			maxPapers = 5
		}

		var targets []string
		if user.IcanTargets != nil && *user.IcanTargets != "" {
			for _, t := range strings.Split(*user.IcanTargets, ",") {
				if trimmed := strings.TrimSpace(t); trimmed != "" {
					targets = append(targets, trimmed)
				}
			}
		}

		// Check if they already have access to this paper
		for _, t := range targets {
			if t == subjectID {
				return nil
			}
		}

		// They don't have access yet. Can they claim it?
		if len(targets) < maxPapers {
			targets = append(targets, subjectID)
			newTargets := strings.Join(targets, ",")
			user.IcanTargets = &newTargets

			// Update in the database
			database.DB.Model(user).Update("ican_targets", newTargets)
			
			return nil
		}

		return fmt.Errorf("Your ICAN plan (%s) is already linked to its maximum of %d paper(s). Upgrade your plan for access to more papers.", plan, maxPapers)
	}
	return nil
}

package utils

import (
	"strings"
	"fmt"
	"exams-resultspro-backend/internal/models"
	"exams-resultspro-backend/internal/database"
)

func GetIcanTrialQuizzesCount(userID string) int64 {
	var count int64
	err := database.DB.Table("nat_exams_user_answers").
		Joins("JOIN nat_exams_questions ON nat_exams_questions.id = nat_exams_user_answers.question_id").
		Joins("JOIN nat_exams_topics ON nat_exams_topics.id = nat_exams_questions.topic_id").
		Joins("JOIN nat_exams_subjects ON nat_exams_subjects.id = nat_exams_topics.subject_id").
		Joins("JOIN nat_exams_exams ON nat_exams_exams.id = nat_exams_subjects.exam_id").
		Where("nat_exams_user_answers.user_id = ? AND LOWER(nat_exams_exams.name) = ?", userID, "ican").
		Select("COUNT(DISTINCT nat_exams_user_answers.session_id)").
		Scan(&count).Error
	if err != nil {
		return 5 // If error occurs, fail closed to prevent unlimited free access
	}
	return count
}

func CheckIcanAccess(user *models.User, examName string, subjectID string) error {
	if strings.ToLower(examName) != "ican" {
		return nil
	}
	
	if !user.HasIcan && (user.IcanPlan == nil || *user.IcanPlan == "") {
		trialQuizzesTaken := GetIcanTrialQuizzesCount(user.ID)
		if trialQuizzesTaken >= 5 {
			return fmt.Errorf("Your free ICAN Trial has ended. Please upgrade to a Study Pack to continue crushing your exams.")
		}
		// Allow access as part of the implicit trial
		return nil
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

func IsSubjectLocked(user *models.User, examName string, subjectID string) bool {
	if strings.ToLower(examName) != "ican" {
		return false
	}
	
	if !user.HasIcan && (user.IcanPlan == nil || *user.IcanPlan == "") {
		trialQuizzesTaken := GetIcanTrialQuizzesCount(user.ID)
		if trialQuizzesTaken >= 5 {
			return true // Trial exhausted, locked
		}
		return false // Trial active, unlocked
	}
	
	if user.IcanPlan == nil {
		return false
	}
	plan := *user.IcanPlan

	if plan == "ICAN_FULL" {
		return false
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
				return false
			}
		}

		// They don't have access. Are they maxed out?
		if len(targets) >= maxPapers {
			return true // Maxed out, so it's locked
		}
		
		return false // Not maxed out, so it's technically unlocked (can be claimed)
	}

	return false
}

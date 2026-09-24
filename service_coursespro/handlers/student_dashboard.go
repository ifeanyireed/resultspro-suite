package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetStudentDashboardSummary(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")

	if tenantID == nil || userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// 1. Get Enrollment
	var enrollment models.Enrollment
	if err := db.DB.Where("tenant_id = ? AND user_id = ?", tenantID, userID).First(&enrollment).Error; err == nil {
		now := time.Now()
		updated := false

		if enrollment.LastActiveDate == nil {
			enrollment.StreakDays = 1
			enrollment.LastActiveDate = &now
			updated = true
		} else {
			y1, m1, d1 := enrollment.LastActiveDate.Date()
			y2, m2, d2 := now.Date()

			if y1 != y2 || m1 != m2 || d1 != d2 {
				t1 := time.Date(y1, m1, d1, 0, 0, 0, 0, time.UTC)
				t2 := time.Date(y2, m2, d2, 0, 0, 0, 0, time.UTC)
				daysDiff := int(t2.Sub(t1).Hours() / 24)

				if daysDiff == 1 {
					enrollment.StreakDays++
				} else if daysDiff > 1 {
					enrollment.StreakDays = 1
				}

				enrollment.LastActiveDate = &now
				updated = true
			}
		}

		if updated {
			db.DB.Model(&enrollment).Updates(map[string]interface{}{
				"streak_days":      enrollment.StreakDays,
				"last_active_date": enrollment.LastActiveDate,
			})
		}
	}

	// 2. Get Cohort (if they have one)
	var cohort models.Cohort
	if enrollment.CohortID != "" {
		db.DB.Where("id = ?", enrollment.CohortID).First(&cohort)
	}

	// 3. Get Current Stage & Module
	type ModuleData struct {
		Title       string   `json:"title"`
		Description string   `json:"description"`
		Duration    string   `json:"duration"`
		AiSummary   []string `json:"ai_summary"`
	}

	var stage models.JourneyStage
	if enrollment.CurrentStageNumber > 0 && cohort.ProgramID != nil {
		db.DB.Where("program_id = ? AND stage_number = ?", *cohort.ProgramID, enrollment.CurrentStageNumber).First(&stage)
	}

	var module models.JourneyModule
	var currentModule *ModuleData
	if stage.ID != "" {
		db.DB.Table("crs_journey_modules").
			Select("crs_journey_modules.*").
			Joins("LEFT JOIN crs_module_progress mp ON mp.module_id = crs_journey_modules.id AND mp.user_id = ?", userID).
			Where("crs_journey_modules.stage_id = ? AND (mp.completed IS NULL OR mp.completed = false)", stage.ID).
			Order("crs_journey_modules.order_index ASC").
			First(&module)
		if module.ID != "" {
			var summaryPoints []string
			if module.AISummary != "" {
				// simple split by newline
				summaryPoints = strings.Split(strings.ReplaceAll(module.AISummary, "\r\n", "\n"), "\n")
			} else {
				summaryPoints = []string{
					"Hooks must start with 'use' to leverage React's linter.",
					"They allow you to reuse stateful logic without changing your component hierarchy.",
				}
			}

			currentModule = &ModuleData{
				Title:       module.Title,
				Description: module.Description,
				Duration:    module.DurationText,
				AiSummary:   summaryPoints,
			}
			if currentModule.Duration == "" {
				currentModule.Duration = "45 mins" // Fallback UI text
			}
		} else {
			currentModule = &ModuleData{
				Title:       "Stage " + fmt.Sprintf("%d", enrollment.CurrentStageNumber) + " Completed",
				Description: "You have completed all modules for this stage. Please complete your project or wait for your mentor's review to proceed to the next stage.",
				Duration:    "Pending",
				AiSummary:   []string{"Great job completing all modules in this stage!", "Next step: Project submission or review."},
			}
		}
	}

	// 4. Get Recent Feedback
	var submission models.ProjectSubmission
	db.DB.Where("tenant_id = ? AND user_id = ? AND status IN ('APPROVED', 'REVISION_REQUESTED') AND mentor_feedback != ''", tenantID, userID).
		Order("reviewed_at DESC").First(&submission)

	var feedback interface{} = nil
	if submission.ID != "" {
		// Try to fetch mentor details
		mentorName := "Mentor"
		if submission.MentorID != nil {
			// normally join or fetch user
			mentorName = "Your Mentor"
		}

		feedback = gin.H{
			"status":       submission.Status,
			"project_name": submission.ProjectTitle,
			"mentor_name":  mentorName,
			"content":      submission.MentorFeedback,
		}
	}

	// 5. Total XP calculation for progress
	level := "Architect"
	if enrollment.CurrentXP < 1000 {
		level = "Novice"
	} else if enrollment.CurrentXP < 2000 {
		level = "Builder"
	}

	totalStages := int64(0)
	var stagesForCount []models.JourneyStage
	if cohort.ProgramID != nil {
		db.WithTenant(c).Where("program_id = ?", *cohort.ProgramID).Find(&stagesForCount)
		for _, s := range stagesForCount {
			if s.ContentsJSON != "" && s.ContentsJSON != "[]" {
				var blocks []interface{}
				if err := json.Unmarshal([]byte(s.ContentsJSON), &blocks); err == nil {
					totalStages += int64(len(blocks))
				}
			}
		}
	}
	if totalStages == 0 {
		totalStages = 12 // Prevent division by zero for UI
	}

	progress := float64(0)
	if enrollment.CurrentStageNumber > 0 {
		progress = float64(enrollment.CurrentStageNumber) / float64(totalStages) * 100
	}

	// Define a lightweight struct to fetch user details from the shared DB
	type SharedUser struct {
		ID        string `gorm:"column:id"`
		FirstName string `gorm:"column:first_name"`
		LastName  string `gorm:"column:last_name"`
		AvatarURL string `gorm:"column:avatar_url"`
	}

	var leaderboard []gin.H
	var classroom []gin.H

	if enrollment.CohortID != "" {
		// Fetch Top Builders (Leaderboard)
		var topEnrollments []models.Enrollment
		db.DB.Where("tenant_id = ? AND cohort_id = ?", tenantID, enrollment.CohortID).
			Order("current_xp DESC").
			Limit(5).
			Find(&topEnrollments)

		for i, e := range topEnrollments {
			var u SharedUser
			if err := db.DB.Table("users").Where("id = ?", e.UserID).First(&u).Error; err == nil {
				name := u.FirstName
				if u.LastName != "" {
					name += " " + u.LastName
				}
				if name == "" {
					name = "Student"
				}
				leaderboard = append(leaderboard, gin.H{
					"rank":   i + 1,
					"name":   name,
					"avatar": u.AvatarURL,
					"xp":     e.CurrentXP,
					"is_me":  e.UserID == userID,
				})
			}
		}

		// Fetch Classroom Peers (Recently Active)
		var peerEnrollments []models.Enrollment
		db.DB.Where("tenant_id = ? AND cohort_id = ? AND user_id != ?", tenantID, enrollment.CohortID, userID).
			Order("last_active_date DESC NULLS LAST").
			Limit(4).
			Find(&peerEnrollments)

		for _, e := range peerEnrollments {
			var u SharedUser
			if err := db.DB.Table("users").Where("id = ?", e.UserID).First(&u).Error; err == nil {
				name := u.FirstName
				if name == "" {
					name = "Student"
				}
				classroom = append(classroom, gin.H{
					"name":   name,
					"avatar": u.AvatarURL,
					"status": "Online",
					"action": "In Coworking Room",
				})
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"has_enrollment": enrollment.ID != "",
		"enrollment": gin.H{
			"streak_days":   enrollment.StreakDays,
			"current_xp":    enrollment.CurrentXP,
			"level":         level,
			"progress":      progress,
			"current_stage": enrollment.CurrentStageNumber,
			"total_stages":  totalStages,
		},
		"cohort_name":        cohort.Title,
		"current_module":     currentModule,
		"recent_feedback":    feedback,
		"upcoming_milestone": nil,
		"leaderboard":        leaderboard,
		"classroom":          classroom,
	})
}

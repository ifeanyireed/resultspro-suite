package handlers

import (
	"net/http"

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
	db.DB.Where("tenant_id = ? AND user_id = ?", tenantID, userID).First(&enrollment)

	// 2. Get Cohort (if they have one)
	var cohort models.Cohort
	if enrollment.CohortID != "" {
		db.DB.Where("id = ?", enrollment.CohortID).First(&cohort)
	}

	// 3. Get Current Stage & Module
	type ModuleData struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Duration    string `json:"duration"`
	}

	var stage models.JourneyStage
	if enrollment.CurrentStageNumber > 0 {
		db.DB.Where("tenant_id = ? AND stage_number = ?", tenantID, enrollment.CurrentStageNumber).First(&stage)
	}

	var module models.JourneyModule
	var currentModule *ModuleData
	if stage.ID != "" {
		db.DB.Where("stage_id = ?", stage.ID).Order("order_index ASC").First(&module)
		if module.ID != "" {
			currentModule = &ModuleData{
				Title:       module.Title,
				Description: module.Description,
				Duration:    module.DurationText,
			}
			if currentModule.Duration == "" {
				currentModule.Duration = "45 mins" // Fallback UI text
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

	totalStages := int64(12)
	db.DB.Model(&models.JourneyStage{}).Where("tenant_id = ?", tenantID).Count(&totalStages)
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

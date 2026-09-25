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

	var currentModule *ModuleData
	if stage.ID != "" {
		// Fetch progress for this stage (which is treated as "module" in frontend)
		var progress models.ModuleProgress
		db.DB.Where("user_id = ? AND module_id = ?", userID, stage.ID).First(&progress)

		// Parse the stage contents JSON
		var items []map[string]interface{}
		if stage.ContentsJSON != "" {
			json.Unmarshal([]byte(stage.ContentsJSON), &items)
		}

		if len(items) > 0 {
			if progress.Completed {
				currentModule = &ModuleData{
					Title:       "Stage " + fmt.Sprintf("%d", enrollment.CurrentStageNumber) + " Completed",
					Description: "You have completed all modules for this stage. Please complete your project or wait for your mentor's review to proceed to the next stage.",
					Duration:    "Pending",
					AiSummary:   []string{"Great job completing all modules in this stage!", "Next step: Project submission or review."},
				}
			} else {
				activeIndex := progress.LastActiveIndex
				if activeIndex >= len(items) {
					activeIndex = len(items) - 1
				}
				if activeIndex < 0 {
					activeIndex = 0
				}
				
				item := items[activeIndex]
				title := "Content Item"
				if t, ok := item["title"].(string); ok && t != "" {
					title = t
				} else if typ, ok := item["type"].(string); ok && typ != "" {
					title = typ
				}

				desc := "Continue your learning journey."
				if d, ok := item["description"].(string); ok && d != "" {
					desc = d
				} else if c, ok := item["content"].(string); ok && c != "" {
					if len(c) > 100 {
						desc = c[:97] + "..."
					} else {
						desc = c
					}
				}
				
				summaryPoints := []string{
					"Resume from where you left off.",
					fmt.Sprintf("You are on content block %d of %d.", activeIndex+1, len(items)),
				}

				currentModule = &ModuleData{
					Title:       title,
					Description: desc,
					Duration:    "15 mins", // Fallback text
					AiSummary:   summaryPoints,
				}
			}
		} else {
			currentModule = &ModuleData{
				Title:       "Stage " + fmt.Sprintf("%d", enrollment.CurrentStageNumber) + " (Coming Soon)",
				Description: "Your instructor is still preparing the content for this stage. Check back soon!",
				Duration:    "Pending",
				AiSummary:   []string{"This stage is currently empty.", "Wait for your instructor to publish modules here."},
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

	var totalStages int64
	var completedStages int64

	if cohort.ProgramID != nil {
		var programStages []models.JourneyStage
		db.WithTenant(c).Where("program_id = ?", *cohort.ProgramID).Order("stage_number ASC").Find(&programStages)
		
		for _, s := range programStages {
			var blocksInStage int64 = 0
			if s.ContentsJSON != "" && s.ContentsJSON != "[]" {
				var blocks []interface{}
				if err := json.Unmarshal([]byte(s.ContentsJSON), &blocks); err == nil {
					blocksInStage = int64(len(blocks))
				}
			}
			
			totalStages += blocksInStage
			
			// If they have fully completed this top-level module, add its blocks to completed count
			if s.StageNumber < enrollment.CurrentStageNumber {
				completedStages += blocksInStage
			} else if s.StageNumber == enrollment.CurrentStageNumber {
				var progress models.ModuleProgress
				db.DB.Where("user_id = ? AND module_id = ?", userID, s.ID).First(&progress)
				if progress.CompletedItems != "" && progress.CompletedItems != "[]" {
					var comp []int
					if err := json.Unmarshal([]byte(progress.CompletedItems), &comp); err == nil {
						completedStages += int64(len(comp))
					}
				}
			}
		}
	}

	if totalStages == 0 {
		totalStages = 13 // Prevent division by zero for UI fallback
	}

	progress := float64(0)
	if totalStages > 0 {
		progress = float64(completedStages) / float64(totalStages) * 100
	}

	// Define a lightweight struct to fetch user details from the shared DB
	type SharedUser struct {
		ID        string `gorm:"column:id"`
		FullName  string `gorm:"column:full_name"`
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
				name := u.FullName
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
				name := u.FullName
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

	var upcomingMilestone interface{} = nil
	isStageEnd := false
	if currentModule != nil && strings.Contains(currentModule.Title, "Completed") {
		isStageEnd = true
	}

	if isStageEnd {
		upcomingMilestone = map[string]interface{}{
			"title":       "Stage " + fmt.Sprintf("%d", enrollment.CurrentStageNumber) + " Project",
			"description": "Submit your capstone project for mentor review to unlock the next stage.",
			"time":        "Pending Submission",
		}
	} else if cohort.MeetingDays != "" && cohort.MeetingTime != "" {
		upcomingMilestone = map[string]interface{}{
			"title":       "Live Class",
			"description": "Join your cohort and mentor for the weekly live coworking and Q&A session.",
			"time":        cohort.MeetingDays + " @ " + cohort.MeetingTime,
		}
	} else if !cohort.EndDate.IsZero() && cohort.EndDate.After(time.Now()) {
		upcomingMilestone = map[string]interface{}{
			"title":       "Graduation",
			"description": "The official end date of this cohort. Make sure all projects are submitted!",
			"time":        cohort.EndDate.Format("Jan 02, 2006"),
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"has_enrollment": enrollment.ID != "",
		"enrollment": gin.H{
			"streak_days":      enrollment.StreakDays,
			"current_xp":       enrollment.CurrentXP,
			"level":            level,
			"progress":         progress,
			"current_stage":    enrollment.CurrentStageNumber,
			"completed_stages": completedStages,
			"total_stages":     totalStages,
		},
		"cohort_id":          cohort.ID,
		"cohort_name":        cohort.Title,
		"current_module":     currentModule,
		"recent_feedback":    feedback,
		"upcoming_milestone": upcomingMilestone,
		"leaderboard":        leaderboard,
		"classroom":          classroom,
	})
}

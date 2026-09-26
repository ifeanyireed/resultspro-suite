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
		ID           string   `json:"id"`
		Title        string   `json:"title"`
		ContentTitle string   `json:"content_title"`
		Description  string   `json:"description"`
		Duration     string   `json:"duration"`
		AiSummary    []string `json:"ai_summary"`
	}

	var stage models.JourneyStage
	if enrollment.CurrentStageNumber > 0 && cohort.ProgramID != nil {
		db.DB.Where("program_id = ? AND stage_number = ?", *cohort.ProgramID, enrollment.CurrentStageNumber).First(&stage)
	}

	var nextMilestoneItem map[string]interface{}
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
			var comp []int
			if progress.CompletedItems != "" {
				json.Unmarshal([]byte(progress.CompletedItems), &comp)
			}
			isGenuinelyCompleted := progress.Completed && len(comp) >= len(items)

			if isGenuinelyCompleted {
				currentModule = &ModuleData{
					ID:           stage.ID,
					Title:        "Stage " + fmt.Sprintf("%d", enrollment.CurrentStageNumber) + " Completed",
					ContentTitle: "Project Time",
					Description:  "You have completed all modules for this stage. Please complete your project or wait for your mentor's review to proceed to the next stage.",
					Duration:     "",
					AiSummary:    nil,
				}
			} else {
				activeIndex := progress.LastActiveIndex
				if activeIndex >= len(items) {
					activeIndex = len(items) - 1
				}
				if activeIndex < 0 {
					activeIndex = 0
				}
				
				for i := activeIndex; i < len(items); i++ {
					if t, ok := items[i]["type"].(string); ok {
						t = strings.ToUpper(t)
						if t == "ASSIGNMENT" || t == "QUIZ" || t == "LIVE_CLASS" || t == "PROJECT" || t == "COMPILER" {
							nextMilestoneItem = items[i]
							break
						}
					}
				}

				item := items[activeIndex]
				contentTitle := "Content Item"
				if t, ok := item["title"].(string); ok && t != "" {
					contentTitle = t
				} else if typ, ok := item["type"].(string); ok && typ != "" {
					contentTitle = typ
				}

				contentDesc := "Continue your learning journey."
				if d, ok := item["description"].(string); ok && d != "" {
					contentDesc = d
				} else if c, ok := item["content"].(string); ok && c != "" {
					if len(c) > 100 {
						contentDesc = c[:97] + "..."
					} else {
						contentDesc = c
					}
				}
				
				duration := ""
				if dur, ok := item["duration"].(string); ok && dur != "" {
					duration = dur
				} else if durNum, ok := item["duration"].(float64); ok {
					duration = fmt.Sprintf("%.0f mins", durNum)
				}

				currentModule = &ModuleData{
					ID:           stage.ID,
					Title:        stage.Title,
					ContentTitle: contentTitle,
					Description:  fmt.Sprintf("%s\n\n%s", contentTitle, contentDesc),
					Duration:     duration,
					AiSummary:    nil,
				}
			}
		} else {
			currentModule = &ModuleData{
				ID:           stage.ID,
				Title:        "Stage " + fmt.Sprintf("%d", enrollment.CurrentStageNumber) + " (Coming Soon)",
				ContentTitle: "Coming Soon",
				Description:  "Your instructor is still preparing the content for this stage. Check back soon!",
				Duration:     "",
				AiSummary:    nil,
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

	if nextMilestoneItem != nil {
		mTitle := "Milestone"
		if t, ok := nextMilestoneItem["title"].(string); ok && t != "" {
			mTitle = t
		} else if typ, ok := nextMilestoneItem["type"].(string); ok && typ != "" {
			mTitle = typ
		}
		
		mDesc := "Complete this milestone to progress."
		if d, ok := nextMilestoneItem["description"].(string); ok && d != "" {
			mDesc = d
		} else if c, ok := nextMilestoneItem["content"].(string); ok && c != "" {
			if len(c) > 60 {
				mDesc = c[:57] + "..."
			} else {
				mDesc = c
			}
		}

		mTime := "Pending"
		if dur, ok := nextMilestoneItem["duration"].(string); ok && dur != "" {
			mTime = dur
		} else if durNum, ok := nextMilestoneItem["duration"].(float64); ok {
			mTime = fmt.Sprintf("%.0f mins", durNum)
		}

		upcomingMilestone = map[string]interface{}{
			"title":       mTitle,
			"description": mDesc,
			"time":        mTime,
		}
	} else if isStageEnd {
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

func (h *Handler) GetStudentProjects(c *gin.Context) {
	userID, _ := c.Get("user_id")
	tenantID, _ := c.Get("tenant_id")

	var enrollment models.Enrollment
	if err := db.DB.Where("tenant_id = ? AND user_id = ?", tenantID, userID).First(&enrollment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Enrollment not found"})
		return
	}

	if enrollment.CohortID == "" {
		c.JSON(http.StatusOK, gin.H{"projects": []interface{}{}})
		return
	}

	var cohort models.Cohort
	if err := db.DB.Where("tenant_id = ? AND id = ?", tenantID, enrollment.CohortID).First(&cohort).Error; err != nil || cohort.ProgramID == nil {
		c.JSON(http.StatusOK, gin.H{"projects": []interface{}{}})
		return
	}

	var stages []models.JourneyStage
	db.DB.Where("tenant_id = ? AND program_id = ?", tenantID, *cohort.ProgramID).Order("stage_number ASC").Find(&stages)

	var submissions []models.ProjectSubmission
	db.DB.Where("tenant_id = ? AND user_id = ? AND cohort_id = ?", tenantID, userID, enrollment.CohortID).Find(&submissions)

	subMap := make(map[string]models.ProjectSubmission)
	for _, sub := range submissions {
		// Key by stage number and project title to handle multiple assignments per stage
		key := fmt.Sprintf("%d-%s", sub.StageNumber, sub.ProjectTitle)
		subMap[key] = sub
	}

	var schedules map[string]map[string]interface{}
	if cohort.ModuleSchedulesJSON != "" {
		json.Unmarshal([]byte(cohort.ModuleSchedulesJSON), &schedules)
	}

	type ProjectOutput struct {
		ID       string `json:"id"`
		Title    string `json:"title"`
		Desc     string `json:"desc"`
		Status   string `json:"status"`
		Due      string `json:"due"`
		StageID  string `json:"stage_id"`
		ModuleID string `json:"module_id"` // Same as stage_id for frontend journey link
	}

	var output []ProjectOutput

	for _, stage := range stages {
		var items []map[string]interface{}
		if stage.ContentsJSON != "" {
			json.Unmarshal([]byte(stage.ContentsJSON), &items)
		}

		dueDate := ""
		if schedules != nil {
			if sched, ok := schedules[stage.ID]; ok {
				if end, ok := sched["end"].(string); ok {
					if t, err := time.Parse(time.RFC3339, end); err == nil {
						dueDate = t.Format("Jan 02")
					}
				}
			}
		}
		if dueDate == "" && !cohort.EndDate.IsZero() {
			dueDate = cohort.EndDate.Format("Jan 02")
		}

		for _, item := range items {
			itemType, _ := item["type"].(string)
			if itemType == "ASSIGNMENT" || itemType == "PROJECT" {
				title, _ := item["title"].(string)
				desc, _ := item["description"].(string)

				if title == "" {
					title = "Assignment"
				}

				key := fmt.Sprintf("%d-%s", stage.StageNumber, title)
				status := "In Progress"
				
				// Optional logic: if the stage is ahead of current stage, mark as Locked
				if stage.StageNumber > enrollment.CurrentStageNumber {
					status = "Locked"
				}

				if sub, exists := subMap[key]; exists {
					if sub.Status == "PENDING" || sub.Status == "MENTOR_REVIEW" {
						status = "Submitted"
					} else if sub.Status == "APPROVED" {
						status = "Approved"
					} else if sub.Status == "REVISION_REQUESTED" {
						status = "Needs Revision"
					} else {
						status = sub.Status
					}
				}

				output = append(output, ProjectOutput{
					ID:       fmt.Sprintf("%s-%s", stage.ID, title),
					Title:    title,
					Desc:     desc,
					Status:   status,
					Due:      dueDate,
					StageID:  stage.ID,
					ModuleID: stage.ID,
				})
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"projects": output})
}

func (h *Handler) GetStudentResources(c *gin.Context) {
	userID, _ := c.Get("user_id")
	tenantID, _ := c.Get("tenant_id")

	var enrollment models.Enrollment
	if err := db.DB.Where("tenant_id = ? AND user_id = ?", tenantID, userID).First(&enrollment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Enrollment not found"})
		return
	}

	var resources []models.CohortResource
	db.DB.Where("tenant_id = ? AND cohort_id = ? AND is_published = ?", tenantID, enrollment.CohortID, true).Order("created_at DESC").Find(&resources)

	c.JSON(http.StatusOK, resources)
}

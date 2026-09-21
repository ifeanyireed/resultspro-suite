package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetPendingSubmissions(c *gin.Context) {
	var submissions []models.ProjectSubmission
	db.WithTenant(c).Where("status = ?", "MENTOR_REVIEW").Order("submitted_at ASC").Find(&submissions)
	c.JSON(http.StatusOK, gin.H{"submissions": submissions})
}

func (h *Handler) ReviewSubmission(c *gin.Context) {
	subID := c.Param("id")
	mentorID, _ := c.Get("user_id")

	var input struct {
		Status         string  `json:"status" binding:"required"` // APPROVED, REVISION_REQUESTED
		MentorRating   float64 `json:"mentor_rating"`
		MentorFeedback string  `json:"mentor_feedback"`
		VideoReviewURL string  `json:"video_review_url"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now()
	mID := mentorID.(string)

	err := db.WithTenant(c).Model(&models.ProjectSubmission{}).Where("id = ?", subID).Updates(map[string]interface{}{
		"status":           input.Status,
		"mentor_id":        &mID,
		"mentor_rating":    input.MentorRating,
		"mentor_feedback":  input.MentorFeedback,
		"video_review_url": input.VideoReviewURL,
		"reviewed_at":      &now,
		"updated_at":       now,
	}).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to review submission"})
		return
	}

	if input.Status == "APPROVED" {
		var sub models.ProjectSubmission
		db.WithTenant(c).First(&sub, "id = ?", subID)

		db.WithTenant(c).Model(&models.Enrollment{}).
			Where("user_id = ? AND cohort_id = ?", sub.UserID, sub.CohortID).
			Updates(map[string]interface{}{
				"current_stage_number": gorm.Expr("current_stage_number + 1"),
				"current_xp":           gorm.Expr("current_xp + 500"),
			})
	}
	
	// Update mentor stats
	db.WithTenant(c).Model(&models.MentorProfile{}).Where("user_id = ?", mID).Updates(map[string]interface{}{
		"total_reviews":   gorm.Expr("total_reviews + 1"),
		"pending_reviews": gorm.Expr("GREATEST(pending_reviews - 1, 0)"),
	})

	// Recalculate avg_rating (assuming mentor_rating is stored in ProjectSubmissions)
	var avg float64
	db.WithTenant(c).Model(&models.ProjectSubmission{}).Where("mentor_id = ?", mID).Select("COALESCE(AVG(mentor_rating), 0)").Row().Scan(&avg)
	db.WithTenant(c).Model(&models.MentorProfile{}).Where("user_id = ?", mID).Update("avg_rating", avg)

	c.JSON(http.StatusOK, gin.H{"message": "Submission review recorded successfully"})
}

func (h *Handler) GetMentorProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var profile models.MentorProfile
	if err := db.WithTenant(c).Where("user_id = ?", userID).First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mentor profile not found"})
		return
	}

	var assignments []string
	var cids []string

	type Result struct {
		ProgramTitle string
		CohortTitle  string
		CohortID     string
	}
	var results []Result

	tenantID, _ := c.Get("tenant_id")

	db.DB.Table("crs_cohort_mentors").
		Select("p.title as program_title, c.title as cohort_title, c.id as cohort_id").
		Joins("JOIN crs_cohorts c ON c.id = crs_cohort_mentors.cohort_id").
		Joins("JOIN crs_programs p ON p.id = c.program_id").
		Where("crs_cohort_mentors.tenant_id = ? AND crs_cohort_mentors.user_id = ?", tenantID, userID).
		Scan(&results)

	for _, r := range results {
		assignments = append(assignments, r.ProgramTitle+" • "+r.CohortTitle)
		cids = append(cids, r.CohortID)
	}

	c.JSON(http.StatusOK, gin.H{
		"profile":            profile,
		"cohort_assignments": assignments,
		"cohort_ids":         cids,
	})
}

type MentorSessionResponse struct {
	CohortName  string `json:"cohort_name"`
	ModuleTitle string `json:"module_title"`
	LiveDate    string `json:"live_date"`
	MeetingURL  string `json:"meeting_url"`
}

func (h *Handler) GetMentorSessions(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var cohortIds []string
	db.DB.Table("crs_cohort_mentors").
		Select("cohort_id").
		Where("user_id = ?", userID).
		Pluck("cohort_id", &cohortIds)

	if len(cohortIds) == 0 {
		c.JSON(http.StatusOK, gin.H{"sessions": []interface{}{}})
		return
	}

	type CohortData struct {
		ID                  string
		Title               string
		ModuleSchedulesJSON string
	}
	var cohorts []CohortData
	db.DB.Table("crs_cohorts").
		Select("id, title, module_schedules_json").
		Where("id IN ?", cohortIds).
		Find(&cohorts)

	var allSessions []MentorSessionResponse

	for _, ch := range cohorts {
		if ch.ModuleSchedulesJSON == "" || ch.ModuleSchedulesJSON == "{}" {
			continue
		}
		
		var schedules map[string]map[string]string
		if err := json.Unmarshal([]byte(ch.ModuleSchedulesJSON), &schedules); err != nil {
			// fallback for legacy single string format (just in case)
			var oldSchedules map[string]string
			if err2 := json.Unmarshal([]byte(ch.ModuleSchedulesJSON), &oldSchedules); err2 == nil {
				schedules = make(map[string]map[string]string)
				for k, v := range oldSchedules {
					schedules[k] = map[string]string{"live": v}
				}
			} else {
				continue
			}
		}

		for moduleID, scheduleData := range schedules {
			// Get module details
			var stage models.JourneyStage
			if err := db.DB.Where("id = ?", moduleID).First(&stage).Error; err != nil {
				continue
			}

			var meetingURL string
			var contents []map[string]interface{}
			var hasLiveClass bool

			if stage.ContentsJSON != "" {
				json.Unmarshal([]byte(stage.ContentsJSON), &contents)
				for _, item := range contents {
					if item["type"] == "LIVE_CLASS" {
						hasLiveClass = true
						if url, ok := item["url"].(string); ok && url != "" {
							meetingURL = url
						}
					}
				}
			}

			// Filter out modules that don't have a LIVE_CLASS content block
			if !hasLiveClass {
				continue
			}

			liveDate := scheduleData["live"]
			if liveDate == "" {
				// Fallback to the module start date if a specific live date wasn't set
				liveDate = scheduleData["start"]
			}
			
			if liveDate == "" {
				continue
			}

			allSessions = append(allSessions, MentorSessionResponse{
				CohortName:  ch.Title,
				ModuleTitle: stage.Title,
				LiveDate:    liveDate,
				MeetingURL:  meetingURL,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"sessions": allSessions})
}

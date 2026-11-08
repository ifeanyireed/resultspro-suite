package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

// AchievementResponse aggregates an achievement and its earned status for the user
type AchievementResponse struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Type        string     `json:"type"`
	IconURL     string     `json:"icon_url"`
	Earned      bool       `json:"earned"`
	EarnedAt    *time.Time `json:"earned_at"`
}

func (h *Handler) GetMyAchievements(c *gin.Context) {
	userID, _ := c.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)

	// Fetch student enrollment & progress details for dynamic milestone qualification
	var enrollment models.Enrollment
	hasEnrollment := db.WithTenant(c).Where("user_id = ?", uid).First(&enrollment).Error == nil

	var submissionCount int64
	db.WithTenant(c).Model(&models.ProjectSubmission{}).Where("user_id = ?", uid).Count(&submissionCount)

	var approvedCount int64
	db.WithTenant(c).Model(&models.ProjectSubmission{}).Where("user_id = ? AND status = ?", uid, "APPROVED").Count(&approvedCount)

	// Fetch all active achievements for this tenant
	var allAchievements []models.Achievement
	_ = db.WithTenant(c).Where("is_active = ?", true).Find(&allAchievements).Error

	// Fetch user's earned achievements
	var userAchievements []models.UserAchievement
	db.WithTenant(c).Where("user_id = ?", uid).Find(&userAchievements)

	earnedMap := make(map[string]models.UserAchievement)
	for _, ua := range userAchievements {
		earnedMap[ua.AchievementID] = ua
	}

	var responses []AchievementResponse
	now := time.Now()

	if len(allAchievements) > 0 {
		for _, a := range allAchievements {
			resp := AchievementResponse{
				ID:          a.ID,
				Title:       a.Title,
				Description: a.Description,
				Type:        a.Type,
				IconURL:     a.IconURL,
				Earned:      false,
			}

			if ua, ok := earnedMap[a.ID]; ok {
				resp.Earned = true
				resp.EarnedAt = &ua.EarnedAt
			}
			responses = append(responses, resp)
		}
	} else {
		// Provide foundational sprint milestone badges
		defaultBadges := []struct {
			id          string
			title       string
			description string
			badgeType   string
			earned      bool
		}{
			{
				id:          "badge-starter",
				title:       "Sprint Starter",
				description: "Enrolled in your first cohort and activated your engineering workspace.",
				badgeType:   "BADGE",
				earned:      hasEnrollment,
			},
			{
				id:          "badge-deploy",
				title:       "First Deploy",
				description: "Submitted your first assignment or sprint project for mentor review.",
				badgeType:   "BADGE",
				earned:      submissionCount > 0,
			},
			{
				id:          "badge-streak",
				title:       "Streak Master",
				description: "Maintained a 7-day uninterrupted active coding and study streak.",
				badgeType:   "BADGE",
				earned:      enrollment.StreakDays >= 7,
			},
			{
				id:          "badge-approval",
				title:       "Code Excellence",
				description: "Received formal mentor signoff and approval on a capstone sprint submission.",
				badgeType:   "BADGE",
				earned:      approvedCount > 0,
			},
			{
				id:          "badge-pioneer",
				title:       "Classroom Pioneer",
				description: "Participated in live cohort classroom coworking and studio sessions.",
				badgeType:   "BADGE",
				earned:      hasEnrollment,
			},
			{
				id:          "badge-architect",
				title:       "Grand Architect",
				description: "Fulfilled all program curriculum stages and graduation requirements.",
				badgeType:   "CERTIFICATE",
				earned:      enrollment.Status == "COMPLETED" || enrollment.Status == "GRADUATED",
			},
		}

		for _, b := range defaultBadges {
			var earnedAt *time.Time
			if b.earned {
				t := enrollment.EnrolledAt
				if t.IsZero() {
					t = now
				}
				earnedAt = &t
			}
			responses = append(responses, AchievementResponse{
				ID:          b.id,
				Title:       b.title,
				Description: b.description,
				Type:        b.badgeType,
				IconURL:     "",
				Earned:      b.earned,
				EarnedAt:    earnedAt,
			})
		}
	}

	earnedCount := 0
	for _, r := range responses {
		if r.Earned {
			earnedCount++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"achievements": responses,
		"stats": gin.H{
			"total":       len(responses),
			"earned":      earnedCount,
			"locked":      len(responses) - earnedCount,
			"streak_days": enrollment.StreakDays,
			"current_xp":  enrollment.CurrentXP,
		},
	})
}

// GetStudentCertificates returns earned credentials and in-progress certifications
func (h *Handler) GetStudentCertificates(c *gin.Context) {
	userID, _ := c.Get("user_id")
	tenantID, _ := c.Get("tenant_id")
	if userID == nil || tenantID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)

	// Fetch student profile name
	userName := "Certified Student"
	type SharedUser struct {
		FullName string `gorm:"column:full_name"`
	}
	var u SharedUser
	if err := db.DB.Table("users").Select("full_name").Where("id = ?", uid).First(&u).Error; err == nil && u.FullName != "" {
		userName = u.FullName
	}

	// 1. Check user enrollments
	var enrollments []models.Enrollment
	db.WithTenant(c).Where("user_id = ?", uid).Find(&enrollments)

	var earned []map[string]interface{}
	var upcoming []map[string]interface{}

	for _, e := range enrollments {
		var cohort models.Cohort
		if err := db.DB.Where("id = ?", e.CohortID).Preload("Program").First(&cohort).Error; err != nil {
			continue
		}

		title := cohort.Title
		if cohort.Program != nil && cohort.Program.Title != "" {
			title = cohort.Program.Title
		}

		totalStages := 10
		if cohort.Program != nil && cohort.Program.DurationWeeks > 0 {
			totalStages = cohort.Program.DurationWeeks
		}

		progressPercent := 0
		if totalStages > 0 {
			progressPercent = int((float64(e.CurrentStageNumber) / float64(totalStages)) * 100)
			if progressPercent > 100 {
				progressPercent = 100
			}
		}

		isCompleted := e.Status == "COMPLETED" || e.Status == "GRADUATED" || progressPercent >= 100

		if isCompleted {
			issuedDate := e.UpdatedAt.Format("Jan 02, 2006")
			if e.UpdatedAt.IsZero() {
				issuedDate = time.Now().Format("Jan 02, 2006")
			}
			credID := "CP-CERT-"
			if len(e.ID) >= 8 {
				credID += e.ID[:8]
			} else {
				credID += e.ID
			}

			earned = append(earned, map[string]interface{}{
				"id":               "cohort-" + e.ID,
				"title":            title + " Professional Certification",
				"credential_id":    credID,
				"recipient_name":   userName,
				"issued_by":        "CoursesPRO Accredited Campus",
				"issue_date":       issuedDate,
				"cohort_title":     cohort.Title,
				"badge_level":      "Professional",
				"verification_url": "/portfolio/" + uid,
				"type":             "DIPLOMA",
			})
		} else {
			upcoming = append(upcoming, map[string]interface{}{
				"id":           "upcoming-" + e.ID,
				"title":        title + " Certification",
				"cohort_title": cohort.Title,
				"progress":     progressPercent,
				"criteria":     "Complete all curriculum sprint stages and pass the capstone mentor review.",
				"lock_reason":  "Sprint Stage in progress",
			})
		}
	}

	// 2. Check achievements with type 'CERTIFICATE'
	var certAchievements []models.Achievement
	db.WithTenant(c).Where("type = ? AND is_active = ?", "CERTIFICATE", true).Find(&certAchievements)

	var userAchievements []models.UserAchievement
	db.WithTenant(c).Where("user_id = ?", uid).Find(&userAchievements)
	userEarnedMap := make(map[string]models.UserAchievement)
	for _, ua := range userAchievements {
		userEarnedMap[ua.AchievementID] = ua
	}

	for _, a := range certAchievements {
		if ua, ok := userEarnedMap[a.ID]; ok {
			credID := "CP-ACH-"
			if len(a.ID) >= 8 {
				credID += a.ID[:8]
			} else {
				credID += a.ID
			}
			earned = append(earned, map[string]interface{}{
				"id":               "ach-" + a.ID,
				"title":            a.Title,
				"credential_id":    credID,
				"recipient_name":   userName,
				"issued_by":        "Curriculum Board",
				"issue_date":       ua.EarnedAt.Format("Jan 02, 2006"),
				"cohort_title":     a.Description,
				"badge_level":      "Specialization",
				"verification_url": "/portfolio/" + uid,
				"type":             "SPECIALIZATION",
			})
		} else {
			upcoming = append(upcoming, map[string]interface{}{
				"id":           "upcoming-ach-" + a.ID,
				"title":        a.Title,
				"cohort_title": "Curriculum Badge",
				"progress":     25,
				"criteria":     a.Description,
				"lock_reason":  "Capstone milestone requirements pending",
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"earned":   earned,
		"upcoming": upcoming,
		"stats": gin.H{
			"total_earned": len(earned),
			"in_progress":  len(upcoming),
		},
	})
}

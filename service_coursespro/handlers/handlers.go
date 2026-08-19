package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

// 1. Public Cohort Programs Catalog
func (h *Handler) GetPublicCohorts(c *gin.Context) {
	var cohorts []models.Cohort
	db.DB.Where("status != ?", "DRAFT").Order("start_date ASC").Find(&cohorts)
	c.JSON(http.StatusOK, gin.H{"cohorts": cohorts})
}

func (h *Handler) GetCohortDetail(c *gin.Context) {
	id := c.Param("id")
	var cohort models.Cohort
	if err := db.DB.First(&cohort, "id = ? OR slug = ?", id, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"cohort": cohort})
}

// 2. Journey & Modules
func (h *Handler) GetCohortJourney(c *gin.Context) {
	cohortID := c.Param("id")
	var stages []models.JourneyStage
	db.DB.Where("cohort_id = ?", cohortID).Order("stage_number ASC").Find(&stages)

	var modules []models.JourneyModule
	db.DB.Order("order_index ASC").Find(&modules)

	c.JSON(http.StatusOK, gin.H{"stages": stages, "modules": modules})
}

func (h *Handler) UpdateModuleProgress(c *gin.Context) {
	moduleID := c.Param("id")
	userID, _ := c.Get("user_id")

	var input struct {
		Completed        bool   `json:"completed"`
		ReflectionAnswer string `json:"reflection_answer"`
		QuizScore        int    `json:"quiz_score"`
		QuizPassed       bool   `json:"quiz_passed"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var progress models.ModuleProgress
	err := db.DB.Where("user_id = ? AND module_id = ?", userID.(string), moduleID).First(&progress).Error

	now := time.Now()
	if err != nil {
		progress = models.ModuleProgress{
			ID:               uuid.New().String(),
			UserID:           userID.(string),
			ModuleID:         moduleID,
			Completed:        input.Completed,
			ReflectionAnswer: input.ReflectionAnswer,
			QuizScore:        input.QuizScore,
			QuizPassed:       input.QuizPassed,
			CompletedAt:      &now,
			UpdatedAt:        now,
		}
		db.DB.Create(&progress)
	} else {
		progress.Completed = input.Completed
		progress.ReflectionAnswer = input.ReflectionAnswer
		progress.QuizScore = input.QuizScore
		progress.QuizPassed = input.QuizPassed
		progress.UpdatedAt = now
		db.DB.Save(&progress)
	}

	// Award XP to enrollment
	if input.Completed {
		db.DB.Model(&models.Enrollment{}).
			Where("user_id = ?", userID.(string)).
			Update("current_xp", db.DB.Raw("current_xp + ?", 100))
	}

	c.JSON(http.StatusOK, gin.H{"progress": progress})
}

// 3. Project Submissions
func (h *Handler) SubmitProject(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		CohortID     string `json:"cohort_id" binding:"required"`
		StageNumber  int    `json:"stage_number" binding:"required"`
		ProjectTitle string `json:"project_title" binding:"required"`
		RepoURL      string `json:"repo_url"`
		FigmaURL     string `json:"figma_url"`
		LiveDemoURL  string `json:"live_demo_url"`
		Notes        string `json:"notes"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sub := models.ProjectSubmission{
		ID:           uuid.New().String(),
		CohortID:     input.CohortID,
		StageNumber:  input.StageNumber,
		UserID:       userID.(string),
		ProjectTitle: input.ProjectTitle,
		RepoURL:      input.RepoURL,
		FigmaURL:     input.FigmaURL,
		LiveDemoURL:  input.LiveDemoURL,
		Notes:        input.Notes,
		Status:       "MENTOR_REVIEW",
		SubmittedAt:  time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := db.DB.Create(&sub).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit project"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"submission": sub})
}

func (h *Handler) GetMySubmissions(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var submissions []models.ProjectSubmission
	db.DB.Where("user_id = ?", userID.(string)).Order("submitted_at DESC").Find(&submissions)
	c.JSON(http.StatusOK, gin.H{"submissions": submissions})
}

// 4. Mentor Console
func (h *Handler) GetPendingSubmissions(c *gin.Context) {
	var submissions []models.ProjectSubmission
	db.DB.Where("status = ?", "MENTOR_REVIEW").Order("submitted_at ASC").Find(&submissions)
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

	err := db.DB.Model(&models.ProjectSubmission{}).Where("id = ?", subID).Updates(map[string]interface{}{
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

	// If approved, advance student stage
	if input.Status == "APPROVED" {
		var sub models.ProjectSubmission
		db.DB.First(&sub, "id = ?", subID)

		db.DB.Model(&models.Enrollment{}).
			Where("user_id = ? AND cohort_id = ?", sub.UserID, sub.CohortID).
			Updates(map[string]interface{}{
				"current_stage_number": db.DB.Raw("current_stage_number + 1"),
				"current_xp":           db.DB.Raw("current_xp + 500"),
			})
	}

	c.JSON(http.StatusOK, gin.H{"message": "Submission review recorded successfully"})
}

// 5. Presence & Classroom
func (h *Handler) GetPresence(c *gin.Context) {
	var sessions []models.PresenceSession
	threshold := time.Now().Add(-5 * time.Minute)
	db.DB.Where("is_active = ? AND last_heartbeat > ?", true, threshold).Find(&sessions)
	c.JSON(http.StatusOK, gin.H{"sessions": sessions, "active_count": len(sessions)})
}

func (h *Handler) PresenceHeartbeat(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		RoomName string `json:"room_name"`
		Activity string `json:"activity"`
	}
	_ = c.ShouldBindJSON(&input)

	if input.RoomName == "" {
		input.RoomName = "Sprint Room Alpha"
	}
	if input.Activity == "" {
		input.Activity = "Coding"
	}

	var session models.PresenceSession
	err := db.DB.Where("user_id = ?", userID.(string)).First(&session).Error

	now := time.Now()
	if err != nil {
		session = models.PresenceSession{
			ID:            uuid.New().String(),
			UserID:        userID.(string),
			RoomName:      input.RoomName,
			Activity:      input.Activity,
			IsActive:      true,
			LastHeartbeat: now,
		}
		db.DB.Create(&session)
	} else {
		session.RoomName = input.RoomName
		session.Activity = input.Activity
		session.IsActive = true
		session.LastHeartbeat = now
		db.DB.Save(&session)
	}

	c.JSON(http.StatusOK, gin.H{"session": session})
}

// 6. Peers & Pairing
func (h *Handler) GetPeers(c *gin.Context) {
	cohortID := c.Query("cohort_id")
	var enrollments []models.Enrollment
	query := db.DB.Where("status = ?", "ACTIVE")
	if cohortID != "" {
		query = query.Where("cohort_id = ?", cohortID)
	}
	query.Order("current_xp DESC").Find(&enrollments)

	c.JSON(http.StatusOK, gin.H{"peers": enrollments})
}

// 7. Public Portfolios
func (h *Handler) GetPublicPortfolio(c *gin.Context) {
	username := c.Param("username")
	var portfolio models.PublicPortfolio
	if err := db.DB.First(&portfolio, "username = ? AND is_published = ?", username, true).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Portfolio not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"portfolio": portfolio})
}

// 8. Admin Endpoints
func (h *Handler) AdminGetCohorts(c *gin.Context) {
	var cohorts []models.Cohort
	db.DB.Order("created_at DESC").Find(&cohorts)
	c.JSON(http.StatusOK, gin.H{"cohorts": cohorts})
}

func (h *Handler) AdminGetEnrollments(c *gin.Context) {
	var enrollments []models.Enrollment
	db.DB.Order("created_at DESC").Find(&enrollments)
	c.JSON(http.StatusOK, gin.H{"enrollments": enrollments})
}

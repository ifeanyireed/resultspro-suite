package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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
				"current_stage_number": db.WithTenant(c).Raw("current_stage_number + 1"),
				"current_xp":           db.WithTenant(c).Raw("current_xp + 500"),
			})
	}

	c.JSON(http.StatusOK, gin.H{"message": "Submission review recorded successfully"})
}

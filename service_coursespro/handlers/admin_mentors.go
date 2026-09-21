package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"service_coursespro/db"
	"service_coursespro/models"
)

// SyncMentorProfile upserts a mentor profile with data from the Users service
func (h *Handler) SyncMentorProfile(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		UserID         string `json:"user_id" binding:"required"`
		FullName       string `json:"full_name" binding:"required"`
		AvatarURL      string `json:"avatar_url"`
		Specialization string `json:"specialization"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	profile := models.MentorProfile{
		UserID:         input.UserID,
		TenantID:       tenantID.(string),
		FullName:       input.FullName,
		AvatarURL:      input.AvatarURL,
		Specialization: input.Specialization,
	}

	// Upsert (Create or Update)
	// Using Save or Clauses for conflict resolution
	// GORM Save handles update if primary key exists.
	// But it might overwrite total_reviews/pending_reviews/avg_rating if they are zero in struct

	// Check if exists
	var existing models.MentorProfile
	if err := db.WithTenant(c).Where("user_id = ?", input.UserID).First(&existing).Error; err != nil {
		// Does not exist, create
		if err := db.WithTenant(c).Create(&profile).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create mentor profile"})
			return
		}
	} else {
		// Update only specified fields
		if err := db.WithTenant(c).Model(&existing).Updates(map[string]interface{}{
			"full_name":      input.FullName,
			"avatar_url":     input.AvatarURL,
			"specialization": input.Specialization,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update mentor profile"})
			return
		}
		profile = existing
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mentor profile synced", "profile": profile})
}

// AdminGetMentorsStats returns aggregate stats for mentors
func (h *Handler) AdminGetMentorsStats(c *gin.Context) {
	var totalMentors int64
	var pendingReviews int64
	var avgRating float64

	// Total Mentors
	db.WithTenant(c).Model(&models.MentorProfile{}).Count(&totalMentors)

	// Total Pending Reviews (Across all submissions)
	db.WithTenant(c).Model(&models.ProjectSubmission{}).Where("status = ?", "MENTOR_REVIEW").Count(&pendingReviews)

	// Global Average Rating
	db.WithTenant(c).Model(&models.MentorProfile{}).Select("COALESCE(AVG(avg_rating), 0)").Row().Scan(&avgRating)

	c.JSON(http.StatusOK, gin.H{
		"total_mentors":   totalMentors,
		"avg_rating":      avgRating,
		"pending_reviews": pendingReviews,
	})
}

// AdminGetMentors returns the list of mentors
func (h *Handler) AdminGetMentors(c *gin.Context) {
	var mentors []models.MentorProfile
	if err := db.WithTenant(c).Order("avg_rating DESC").Find(&mentors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch mentors"})
		return
	}

	// For each mentor, we could potentially fetch their assigned cohorts to match the UI: "UX/UI Design • Fall Cohort"
	// To do this properly, we need to join crs_cohort_mentors -> crs_cohorts -> crs_programs
	// We will construct a custom response
	type MentorResponse struct {
		models.MentorProfile
		CohortAssignments []string `json:"cohort_assignments"`
		CohortIDs         []string `json:"cohort_ids"`
	}

	var response []MentorResponse

	for _, m := range mentors {
		var assignments []string
		var cids []string

		type Result struct {
			ProgramTitle string
			CohortTitle  string
			CohortID     string
		}
		var results []Result

		db.WithTenant(c).Table("crs_cohort_mentors").
			Select("p.title as program_title, c.title as cohort_title, c.id as cohort_id").
			Joins("JOIN crs_cohorts c ON c.id = crs_cohort_mentors.cohort_id").
			Joins("JOIN crs_programs p ON p.id = c.program_id").
			Where("crs_cohort_mentors.user_id = ?", m.UserID).
			Scan(&results)

		for _, r := range results {
			assignments = append(assignments, r.ProgramTitle+" • "+r.CohortTitle)
			cids = append(cids, r.CohortID)
		}

		response = append(response, MentorResponse{
			MentorProfile:     m,
			CohortAssignments: assignments,
			CohortIDs:         cids,
		})
	}

	c.JSON(http.StatusOK, gin.H{"mentors": response})
}

// AdminUpdateMentor updates a mentor profile and their cohort assignments
func (h *Handler) AdminUpdateMentor(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID := c.Param("id")

	var input struct {
		FullName       string   `json:"full_name"`
		Specialization string   `json:"specialization"`
		CohortIDs      []string `json:"cohort_ids"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the mentor profile
	if err := db.WithTenant(c).Model(&models.MentorProfile{}).Where("user_id = ?", userID).Updates(map[string]interface{}{
		"full_name":      input.FullName,
		"specialization": input.Specialization,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update mentor profile"})
		return
	}

	// Re-assign cohorts
	if input.CohortIDs != nil {
		// Clear existing
		db.WithTenant(c).Where("user_id = ?", userID).Delete(&models.CohortMentor{})

		// Insert new
		for _, cid := range input.CohortIDs {
			db.WithTenant(c).Create(&models.CohortMentor{
				TenantID: tenantID.(string),
				CohortID: cid,
				UserID:   userID,
				Role:     "MENTOR",
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mentor updated successfully"})
}

// AdminInviteMentor invites an existing user to become a mentor via email
func (h *Handler) AdminInviteMentor(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")

	var input struct {
		Email          string   `json:"email" binding:"required,email"`
		FullName       string   `json:"full_name" binding:"required"`
		Specialization string   `json:"specialization"`
		CohortIDs      []string `json:"cohort_ids"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Find User by Email in the global users table
	var user struct {
		ID    string
		Email string
	}
	if err := db.WithTenant(c).Table("users").Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found. They must register an account first."})
		return
	}

	// 2. Check if mentor profile already exists
	var existing models.MentorProfile
	if err := db.WithTenant(c).Where("user_id = ?", user.ID).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This user is already a mentor."})
		return
	}

	// 3. Create Mentor Profile
	profile := models.MentorProfile{
		UserID:         user.ID,
		TenantID:       tenantID.(string),
		FullName:       input.FullName,
		Specialization: input.Specialization,
	}

	if err := db.WithTenant(c).Create(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create mentor profile"})
		return
	}

	// 4. Assign Cohorts
	if input.CohortIDs != nil {
		for _, cid := range input.CohortIDs {
			db.WithTenant(c).Create(&models.CohortMentor{
				TenantID: tenantID.(string),
				CohortID: cid,
				UserID:   user.ID,
				Role:     "MENTOR",
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mentor added successfully", "profile": profile})
}

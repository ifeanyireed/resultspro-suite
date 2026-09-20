import re

with open('service_coursespro/handlers/admin_mentors.go', 'r') as f:
    content = f.read()

update_mentor_func = """
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
"""

if 'AdminUpdateMentor' not in content:
    content += "\n" + update_mentor_func
    with open('service_coursespro/handlers/admin_mentors.go', 'w') as f:
        f.write(content)

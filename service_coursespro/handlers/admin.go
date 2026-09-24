package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) AdminGetCohorts(c *gin.Context) {
	var cohorts []models.Cohort
	db.WithTenant(c).
		Select("crs_cohorts.*, (SELECT COUNT(id) FROM crs_enrollments WHERE crs_enrollments.cohort_id = crs_cohorts.id) as enrolled_count").
		Preload("Program").Preload("CohortMentors").Order("created_at DESC").Find(&cohorts)
	c.JSON(http.StatusOK, gin.H{"cohorts": cohorts})
}

func (h *Handler) AdminGetEnrollments(c *gin.Context) {
	var enrollments []models.Enrollment
	err := db.WithTenant(c).Order("enrolled_at DESC").Find(&enrollments).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"enrollments": enrollments})
}

func (h *Handler) AdminCreateCohort(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		Slug                string    `json:"slug" binding:"required"`
		Title               string    `json:"title" binding:"required"`
		Subtitle            string    `json:"subtitle"`
		Description         string    `json:"description"`
		DurationWeeks       int       `json:"duration_weeks"`
		StartDate           time.Time `json:"start_date"`
		EndDate             time.Time `json:"end_date"`
		Capacity            int       `json:"capacity"`
		Price               float64   `json:"price"`
		ImageURL            string    `json:"image_url"`
		MeetingDays         string    `json:"meeting_days"`
		MeetingTime         string    `json:"meeting_time"`
		LocationType        string    `json:"location_type"`
		DifficultyLevel     string    `json:"difficulty_level"`
		Currency            string    `json:"currency"`
		LeadMentorID        string    `json:"lead_mentor_id"`
		ProgramID           string    `json:"program_id"`
		ModuleSchedulesJSON string    `json:"module_schedules_json"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var leadMentorID *string
	if input.LeadMentorID != "" {
		leadMentorID = &input.LeadMentorID
	}

	var programID *string
	if input.ProgramID != "" {
		programID = &input.ProgramID
	}

	cohort := models.Cohort{
		TenantID:            tenantID.(string),
		ID:                  uuid.New().String(),
		Slug:                input.Slug,
		Title:               input.Title,
		Subtitle:            input.Subtitle,
		Description:         input.Description,
		DurationWeeks:       input.DurationWeeks,
		StartDate:           input.StartDate,
		EndDate:             input.EndDate,
		Capacity:            input.Capacity,
		Price:               input.Price,
		ImageURL:            input.ImageURL,
		MeetingDays:         input.MeetingDays,
		MeetingTime:         input.MeetingTime,
		LocationType:        input.LocationType,
		DifficultyLevel:     input.DifficultyLevel,
		Currency:            input.Currency,
		LeadMentorID:        leadMentorID,
		ProgramID:           programID,
		Status:              "DRAFT",
		ModuleSchedulesJSON: input.ModuleSchedulesJSON,
		CreatedAt:           time.Now(),
		UpdatedAt:           time.Now(),
	}

	if err := db.WithTenant(c).Create(&cohort).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cohort"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"cohort": cohort})
}

func (h *Handler) AdminUpdateCohort(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Slug                string    `json:"slug"`
		Title               string    `json:"title"`
		Subtitle            string    `json:"subtitle"`
		Description         string    `json:"description"`
		DurationWeeks       int       `json:"duration_weeks"`
		StartDate           time.Time `json:"start_date"`
		EndDate             time.Time `json:"end_date"`
		Capacity            int       `json:"capacity"`
		Price               float64   `json:"price"`
		ImageURL            string    `json:"image_url"`
		MeetingDays         string    `json:"meeting_days"`
		MeetingTime         string    `json:"meeting_time"`
		LocationType        string    `json:"location_type"`
		DifficultyLevel     string    `json:"difficulty_level"`
		Currency            string    `json:"currency"`
		LeadMentorID        string    `json:"lead_mentor_id"`
		ProgramID           string    `json:"program_id"`
		Status              string    `json:"status"`
		ModuleSchedulesJSON string    `json:"module_schedules_json"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"slug":                  input.Slug,
		"title":                 input.Title,
		"subtitle":              input.Subtitle,
		"description":           input.Description,
		"duration_weeks":        input.DurationWeeks,
		"start_date":            input.StartDate,
		"end_date":              input.EndDate,
		"capacity":              input.Capacity,
		"price":                 input.Price,
		"image_url":             input.ImageURL,
		"meeting_days":          input.MeetingDays,
		"meeting_time":          input.MeetingTime,
		"location_type":         input.LocationType,
		"difficulty_level":      input.DifficultyLevel,
		"currency":              input.Currency,
		"status":                input.Status,
		"module_schedules_json": input.ModuleSchedulesJSON,
		"updated_at":            time.Now(),
	}

	if input.LeadMentorID != "" {
		updates["lead_mentor_id"] = input.LeadMentorID
	} else {
		updates["lead_mentor_id"] = nil
	}

	if input.ProgramID != "" {
		updates["program_id"] = input.ProgramID
	} else {
		updates["program_id"] = nil
	}

	// For partial updates, we might want to omit empty fields, but a typical PUT would send all fields.
	// Since we mapped empty strings to zero values in struct, we update them as such.

	if err := db.WithTenant(c).Model(&models.Cohort{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cohort"})
		return
	}

	var cohort models.Cohort
	db.WithTenant(c).First(&cohort, "id = ?", id)
	c.JSON(http.StatusOK, gin.H{"cohort": cohort})
}

func (h *Handler) AdminGetPrograms(c *gin.Context) {
	var programs []models.Program
	db.WithTenant(c).Order("created_at DESC").Find(&programs)

	type ProgramWithStats struct {
		models.Program
		ModulesCount int64 `json:"modules_count"`
	}

	var result []ProgramWithStats
	for _, p := range programs {
		var count int64
		db.WithTenant(c).Model(&models.JourneyStage{}).Where("program_id = ?", p.ID).Count(&count)
		result = append(result, ProgramWithStats{
			Program:      p,
			ModulesCount: count,
		})
	}

	var totalModules int64
	db.WithTenant(c).Model(&models.JourneyStage{}).Count(&totalModules)

	var totalVideos int64
	db.WithTenant(c).Model(&models.JourneyStage{}).Where("contents_json LIKE ?", "%\"type\":\"VIDEO\"%").Count(&totalVideos)

	var totalQuizzes int64
	db.WithTenant(c).Model(&models.Quiz{}).Count(&totalQuizzes)

	stats := gin.H{
		"total_modules": totalModules,
		"total_videos":  totalVideos,
		"total_quizzes": totalQuizzes,
	}

	c.JSON(http.StatusOK, gin.H{
		"programs": result,
		"stats":    stats,
	})
}

func (h *Handler) AdminCreateProgram(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		Title         string  `json:"title" binding:"required"`
		Description   string  `json:"description"`
		DurationWeeks int     `json:"duration_weeks"`
		BasePrice     float64 `json:"base_price"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	program := models.Program{
		TenantID:      tenantID.(string),
		ID:            uuid.New().String(),
		Title:         input.Title,
		Description:   input.Description,
		DurationWeeks: input.DurationWeeks,
		BasePrice:     input.BasePrice,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := db.WithTenant(c).Create(&program).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create program"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"program": program})
}

func (h *Handler) AdminCreateStage(c *gin.Context) {
	tenantVal, _ := c.Get("tenant_id")
	tenantID := ""
	if tenantVal != nil {
		tenantID = tenantVal.(string)
	}
	var input struct {
		ProgramID   string `json:"program_id" binding:"required"`
		StageNumber int    `json:"stage_number" binding:"required"`
		Title       string `json:"title" binding:"required"`
		Subtitle    string `json:"subtitle"`
		Description string `json:"description"`
		OrderIndex  int    `json:"order_index"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	stage := models.JourneyStage{
		TenantID:    tenantID,
		ID:          uuid.New().String(),
		ProgramID:   input.ProgramID,
		StageNumber: input.StageNumber,
		Title:       input.Title,
		Subtitle:    input.Subtitle,
		Description: input.Description,
		OrderIndex:  input.OrderIndex,
		CreatedAt:   time.Now(),
	}

	if err := db.WithTenant(c).Create(&stage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create stage"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"stage": stage})
}

func (h *Handler) AdminCreateModule(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		StageID         string `json:"stage_id" binding:"required"`
		Title           string `json:"title" binding:"required"`
		DurationText    string `json:"duration_text"`
		Description     string `json:"description"`
		VideoURL        string `json:"video_url"`
		ContentMarkdown string `json:"content_markdown"`
		ContentsJSON    string `json:"contents_json"`
		OrderIndex      int    `json:"order_index"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	module := models.JourneyModule{
		TenantID:        tenantID.(string),
		ID:              uuid.New().String(),
		StageID:         input.StageID,
		Title:           input.Title,
		DurationText:    input.DurationText,
		Description:     input.Description,
		VideoURL:        input.VideoURL,
		ContentMarkdown: input.ContentMarkdown,
		ContentsJSON:    input.ContentsJSON,
		OrderIndex:      input.OrderIndex,
		CreatedAt:       time.Now(),
	}

	if err := db.WithTenant(c).Create(&module).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create module"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"module": module})
}

func (h *Handler) AdminGetCohortStats(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")

	var totalCohorts int64
	var distinctPrograms int64

	db.DB.Model(&models.Cohort{}).Where("tenant_id = ? AND status IN ?", tenantID, []string{"ACTIVE", "ENROLLING"}).Count(&totalCohorts)
	db.DB.Model(&models.Cohort{}).Where("tenant_id = ? AND status IN ?", tenantID, []string{"ACTIVE", "ENROLLING"}).Distinct("program_id").Count(&distinctPrograms)

	var totalEnrolled int64
	db.DB.Model(&models.Enrollment{}).Where("tenant_id = ?", tenantID).Count(&totalEnrolled)

	var capRes struct {
		TotalCapacity int64
	}
	db.DB.Model(&models.Cohort{}).
		Select("COALESCE(SUM(capacity), 0) as total_capacity").
		Where("tenant_id = ?", tenantID).
		Scan(&capRes)

	fillRate := 0.0
	if capRes.TotalCapacity > 0 {
		fillRate = (float64(totalEnrolled) / float64(capRes.TotalCapacity)) * 100.0
	}

	c.JSON(http.StatusOK, gin.H{
		"active_cohorts":  totalCohorts,
		"active_programs": distinctPrograms,
		"fill_rate":       fillRate,
	})
}

func (h *Handler) AdminUpdateProgram(c *gin.Context) {
	id := c.Param("id")
	var input map[string]interface{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"updated_at": time.Now(),
	}

	if val, ok := input["title"]; ok {
		updates["title"] = val
	}
	if val, ok := input["description"]; ok {
		updates["description"] = val
	}
	if val, ok := input["duration_weeks"]; ok {
		updates["duration_weeks"] = val
	}
	if val, ok := input["base_price"]; ok {
		updates["base_price"] = val
	}
	if val, ok := input["status"]; ok {
		updates["status"] = val
	}

	if err := db.WithTenant(c).Model(&models.Program{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update program"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminDeleteProgram(c *gin.Context) {
	id := c.Param("id")
	if err := db.WithTenant(c).Where("id = ?", id).Delete(&models.Program{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete program"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminUpdateStage(c *gin.Context) {
	id := c.Param("id")
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(input) > 0 {
		if err := db.WithTenant(c).Model(&models.JourneyStage{}).Where("id = ?", id).Updates(input).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stage"})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminDeleteStage(c *gin.Context) {
	id := c.Param("id")
	if err := db.WithTenant(c).Where("id = ?", id).Delete(&models.JourneyStage{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete stage"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminUpdateModule(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Title           string `json:"title"`
		DurationText    string `json:"duration_text"`
		Description     string `json:"description"`
		VideoURL        string `json:"video_url"`
		ContentMarkdown string `json:"content_markdown"`
		ContentsJSON    string `json:"contents_json"`
		OrderIndex      int    `json:"order_index"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"title":            input.Title,
		"duration_text":    input.DurationText,
		"description":      input.Description,
		"video_url":        input.VideoURL,
		"content_markdown": input.ContentMarkdown,
		"contents_json":    input.ContentsJSON,
		"order_index":      input.OrderIndex,
	}

	if err := db.WithTenant(c).Model(&models.JourneyModule{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update module"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminDeleteModule(c *gin.Context) {
	id := c.Param("id")
	if err := db.WithTenant(c).Where("id = ?", id).Delete(&models.JourneyModule{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete module"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AdminGetProgramStages(c *gin.Context) {
	id := c.Param("id")
	var stages []models.JourneyStage
	if err := db.WithTenant(c).Where("program_id = ?", id).Order("stage_number ASC").Find(&stages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stages"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"stages": stages})
}

func (h *Handler) AdminDeleteMentor(c *gin.Context) {
	userID := c.Param("id")
	if err := db.WithTenant(c).Where("user_id = ?", userID).Delete(&models.MentorProfile{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete mentor profile"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Mentor profile deleted successfully"})
}

// AdminGetSettings fetches the courses-specific tenant settings
func (h *Handler) AdminGetSettings(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var settings models.TenantSettings

	if err := db.DB.Where("tenant_id = ?", tenantID).First(&settings).Error; err != nil {
		// Return defaults
		settings = models.TenantSettings{
			TenantID:            tenantID.(string),
			EnableMentorPayouts: true,
			PayoutModel:         "BASE_PLUS_SLA",
			PayoutConfigJSON:    "{}",
		}
	}
	c.JSON(http.StatusOK, settings)
}

// AdminUpdateSettings updates the courses-specific tenant settings
func (h *Handler) AdminUpdateSettings(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var req models.TenantSettings
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var settings models.TenantSettings
	if err := db.DB.Where("tenant_id = ?", tenantID).First(&settings).Error; err != nil {
		req.TenantID = tenantID.(string)
		db.DB.Create(&req)
		c.JSON(http.StatusOK, req)
		return
	}

	settings.EnableMentorPayouts = req.EnableMentorPayouts
	settings.PayoutModel = req.PayoutModel
	settings.PayoutConfigJSON = req.PayoutConfigJSON
	db.DB.Save(&settings)

	c.JSON(http.StatusOK, settings)
}

// AdminGetMentorsActivity aggregates batch reporting for mentors
func (h *Handler) AdminGetMentorsActivity(c *gin.Context) {
	_, _ = c.Get("tenant_id")

	// Example batch reporting data for UI demonstration
	type ActivityReport struct {
		MentorID        string `json:"mentor_id"`
		MentorName      string `json:"mentor_name"`
		ReviewsDone     int    `json:"reviews_done"`
		CohortsManaged  int    `json:"cohorts_managed"`
		LiveClasses     int    `json:"live_classes_held"`
		EstimatedPayout string `json:"estimated_payout"`
	}

	var reports []ActivityReport
	// Note: in a real implementation, you'd aggregate this from ProjectSubmission/BlockSubmission and crs_cohort_mentors
	// Mocking for now to demonstrate the API
	reports = append(reports, ActivityReport{
		MentorID:        "mentor_1",
		MentorName:      "Tolu Olayinka",
		ReviewsDone:     45,
		CohortsManaged:  2,
		LiveClasses:     4,
		EstimatedPayout: "₦45,000",
	})

	c.JSON(http.StatusOK, gin.H{"activity_reports": reports})
}

func (h *Handler) AdminDeleteCohort(c *gin.Context) {
	id := c.Param("id")
	tenantID, _ := c.Get("tenant_id")

	// Verify it exists in this tenant
	var cohort models.Cohort
	if err := db.DB.Where("id = ? AND tenant_id = ?", id, tenantID).First(&cohort).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort not found"})
		return
	}

	// Delete cohort
	if err := db.DB.Delete(&cohort).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete cohort"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cohort deleted successfully"})
}

func (h *Handler) AdminAssignStudentToCohort(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		UserID   string `json:"user_id" binding:"required"`
		CohortID string `json:"cohort_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if already enrolled
	var existing models.Enrollment
	if err := db.WithTenant(c).Where("user_id = ? AND cohort_id = ?", input.UserID, input.CohortID).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Student is already enrolled in this cohort"})
		return
	}

	enrollment := models.Enrollment{
		ID:                 uuid.New().String(),
		TenantID:           tenantID.(string),
		UserID:             input.UserID,
		CohortID:           input.CohortID,
		Status:             "ACTIVE",
		PaymentStatus:      "PAID", // Admin assignment bypasses payment
		PlanType:           "STANDARD",
		CurrentStageNumber: 1,
		EnrolledAt:         time.Now(),
		UpdatedAt:          time.Now(),
	}

	if err := db.WithTenant(c).Create(&enrollment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to enroll student"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Student assigned to cohort successfully", "enrollment": enrollment})
}

func (h *Handler) AdminRemoveStudentFromCohort(c *gin.Context) {
    tenantID, _ := c.Get("tenant_id")
	enrollmentID := c.Param("id")

	if err := db.WithTenant(c).Where("id = ? AND tenant_id = ?", enrollmentID, tenantID).Delete(&models.Enrollment{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove student from cohort"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Student removed from cohort successfully"})
}

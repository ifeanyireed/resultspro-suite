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
	db.WithTenant(c).Preload("Program").Preload("CohortMentors").Order("created_at DESC").Find(&cohorts)
	c.JSON(http.StatusOK, gin.H{"cohorts": cohorts})
}

func (h *Handler) AdminGetEnrollments(c *gin.Context) {
	var enrollments []models.Enrollment
	db.WithTenant(c).Order("created_at DESC").Find(&enrollments)
	c.JSON(http.StatusOK, gin.H{"enrollments": enrollments})
}

func (h *Handler) AdminCreateCohort(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	var input struct {
		Slug          string    `json:"slug" binding:"required"`
		Title         string    `json:"title" binding:"required"`
		Subtitle      string    `json:"subtitle"`
		Description   string    `json:"description"`
		DurationWeeks int       `json:"duration_weeks"`
		StartDate     time.Time `json:"start_date"`
		EndDate       time.Time `json:"end_date"`
		Capacity      int       `json:"capacity"`
		Price         float64   `json:"price"`
		Currency      string    `json:"currency"`
		LeadMentorID  string    `json:"lead_mentor_id"`
		ProgramID     string    `json:"program_id"`
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
		TenantID:      tenantID.(string),
		ID:            uuid.New().String(),
		Slug:          input.Slug,
		Title:         input.Title,
		Subtitle:      input.Subtitle,
		Description:   input.Description,
		DurationWeeks: input.DurationWeeks,
		StartDate:     input.StartDate,
		EndDate:       input.EndDate,
		Capacity:      input.Capacity,
		Price:         input.Price,
		Currency:      input.Currency,
		LeadMentorID:  leadMentorID,
		ProgramID:     programID,
		Status:        "DRAFT",
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
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
		Slug          string    `json:"slug"`
		Title         string    `json:"title"`
		Subtitle      string    `json:"subtitle"`
		Description   string    `json:"description"`
		DurationWeeks int       `json:"duration_weeks"`
		StartDate     time.Time `json:"start_date"`
		EndDate       time.Time `json:"end_date"`
		Capacity      int       `json:"capacity"`
		Price         float64   `json:"price"`
		Currency      string    `json:"currency"`
		LeadMentorID  string    `json:"lead_mentor_id"`
		ProgramID     string    `json:"program_id"`
		Status        string    `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"slug":           input.Slug,
		"title":          input.Title,
		"subtitle":       input.Subtitle,
		"description":    input.Description,
		"duration_weeks": input.DurationWeeks,
		"start_date":     input.StartDate,
		"end_date":       input.EndDate,
		"capacity":       input.Capacity,
		"price":          input.Price,
		"currency":       input.Currency,
		"status":         input.Status,
		"updated_at":     time.Now(),
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

	// Optional: Fetch module and quiz counts per program to match the UI stats
	// But for now, returning just the programs is fine.
	c.JSON(http.StatusOK, gin.H{"programs": programs})
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

	type CapacityResult struct {
		TotalEnrolled int64
		TotalCapacity int64
	}
	var capRes CapacityResult

	db.DB.Model(&models.Cohort{}).Where("tenant_id = ? AND status = ?", tenantID, "ACTIVE").Count(&totalCohorts)
	db.DB.Model(&models.Cohort{}).Where("tenant_id = ? AND status = ?", tenantID, "ACTIVE").Distinct("program_id").Count(&distinctPrograms)

	db.DB.Model(&models.Cohort{}).
		Select("COALESCE(SUM(enrolled_count), 0) as total_enrolled, COALESCE(SUM(capacity), 0) as total_capacity").
		Where("tenant_id = ?", tenantID).
		Scan(&capRes)

	fillRate := 0.0
	if capRes.TotalCapacity > 0 {
		fillRate = (float64(capRes.TotalEnrolled) / float64(capRes.TotalCapacity)) * 100.0
	}

	c.JSON(http.StatusOK, gin.H{
		"active_cohorts":  totalCohorts,
		"active_programs": distinctPrograms,
		"fill_rate":       fillRate,
	})
}

func (h *Handler) AdminUpdateProgram(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Title         string  `json:"title"`
		Description   string  `json:"description"`
		DurationWeeks int     `json:"duration_weeks"`
		BasePrice     float64 `json:"base_price"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"title":          input.Title,
		"description":    input.Description,
		"duration_weeks": input.DurationWeeks,
		"base_price":     input.BasePrice,
		"updated_at":     time.Now(),
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

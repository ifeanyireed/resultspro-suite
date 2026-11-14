package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_tutorspro/db"
	"service_tutorspro/models"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

// Public Tutors Catalog
func (h *Handler) GetPublicTutors(c *gin.Context) {
	subject := c.Query("subject")

	type EnrichedTutor struct {
		ID          string   `json:"id"`
		Name        string   `json:"name"`
		Bio         string   `json:"bio"`
		Subjects    []string `json:"subjects"`
		Rating      float64  `json:"rating"`
		ReviewCount int      `json:"reviewCount"`
		HourlyRate  float64  `json:"hourlyRate"`
		Avatar      string   `json:"avatar"`
		Location    string   `json:"location"`
		IsVerified  bool     `json:"isVerified"`
	}

	subjectKey := "all"
	if strings.TrimSpace(subject) != "" {
		subjectKey = strings.ToLower(strings.TrimSpace(subject))
	}
	cacheKey := db.BuildKey("tutors", "global", "directory", subjectKey)

	// 1. Try reading from Redis cache first (TTL: 4 Hours / 14400s)
	if cachedData, found := db.Get(c.Request.Context(), cacheKey); found && cachedData != "" {
		var cachedTutors []EnrichedTutor
		if err := json.Unmarshal([]byte(cachedData), &cachedTutors); err == nil {
			c.JSON(http.StatusOK, gin.H{"tutors": cachedTutors})
			return
		}
	}

	var results []struct {
		ID           string
		Name         string
		Bio          string
		SubjectsRaw  string `gorm:"column:subjects"`
		Rating       float64
		TotalReviews int     `gorm:"column:total_reviews"`
		HourlyRate   float64 `gorm:"column:hourly_rate"`
		Avatar       string  `gorm:"column:avatar_url"`
		IsVerified   bool    `gorm:"column:is_verified"`
	}

	query := db.DB.Table("tut_profiles").
		Select("tut_profiles.id, users.name, tut_profiles.bio, tut_profiles.subjects, tut_profiles.rating, tut_profiles.total_reviews, tut_profiles.hourly_rate, users.avatar_url, tut_profiles.is_verified").
		Joins("JOIN users ON users.id = tut_profiles.user_id").
		Where("tut_profiles.is_verified = ? AND tut_profiles.is_available = ?", true, true)

	if subject != "" {
		query = query.Where("tut_profiles.subjects LIKE ?", "%"+subject+"%")
	}

	query.Order("tut_profiles.rating DESC").Scan(&results)

	tutors := make([]EnrichedTutor, 0)
	for _, r := range results {
		var subjs []string
		_ = json.Unmarshal([]byte(r.SubjectsRaw), &subjs)
		tutors = append(tutors, EnrichedTutor{
			ID:          r.ID,
			Name:        r.Name,
			Bio:         r.Bio,
			Subjects:    subjs,
			Rating:      r.Rating,
			ReviewCount: r.TotalReviews,
			HourlyRate:  r.HourlyRate,
			Avatar:      r.Avatar,
			Location:    "Online",
			IsVerified:  r.IsVerified,
		})
	}

	// 2. Cache directory listings in Redis (TTL: 4 Hours / 14400s)
	if data, err := json.Marshal(tutors); err == nil {
		_ = db.Set(c.Request.Context(), cacheKey, string(data), 14400)
	}

	c.JSON(http.StatusOK, gin.H{"tutors": tutors})
}

// Tutor Onboarding
func (h *Handler) TutorOnboarding(c *gin.Context) {
	var input struct {
		Headline      string   `json:"headline" binding:"required"`
		Bio           string   `json:"bio" binding:"required"`
		Subjects      []string `json:"subjects" binding:"required"`
		HourlyRate    float64  `json:"hourly_rate" binding:"required"`
		VideoIntroURL string   `json:"video_intro_url"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	subjJSON, _ := json.Marshal(input.Subjects)

	tutor := models.TutorProfile{
		ID:            uuid.New().String(),
		UserID:        userID.(string),
		Headline:      input.Headline,
		Bio:           input.Bio,
		Subjects:      string(subjJSON),
		HourlyRate:    input.HourlyRate,
		Currency:      "NGN",
		Rating:        5.0,
		IsVerified:    true,
		IsAvailable:   true,
		VideoIntroURL: input.VideoIntroURL,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if tenantID, exists := c.Get("tenant_id"); exists && tenantID != "" {
		tutor.TenantID = tenantID.(string)
	}

	if err := db.WithTenant(c).Create(&tutor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tutor profile"})
		return
	}

	// Invalidate public directory cache
	_ = db.Delete(c.Request.Context(), db.BuildKey("tutors", "global", "directory", "all"))

	c.JSON(http.StatusCreated, gin.H{"profile": tutor})
}

// Create Booking
func (h *Handler) CreateBooking(c *gin.Context) {
	var input struct {
		TutorID       string    `json:"tutor_id" binding:"required"`
		StudentID     string    `json:"student_id" binding:"required"`
		ParentID      *string   `json:"parent_id"`
		Subject       string    `json:"subject" binding:"required"`
		ScheduledDate time.Time `json:"scheduled_date" binding:"required"`
		StartTime     string    `json:"start_time" binding:"required"`
		EndTime       string    `json:"end_time" binding:"required"`
		Hours         float64   `json:"hours" binding:"required"`
		Notes         string    `json:"notes"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var tutor models.TutorProfile
	if err := db.WithTenant(c).First(&tutor, "id = ?", input.TutorID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tutor not found"})
		return
	}

	// Standard slot identifier according to Redis spec: {tutor_id}_{slot_timestamp}
	// e.g. tutor_uuid777_20261120_1400
	datePart := input.ScheduledDate.Format("20060102")
	timePart := strings.ReplaceAll(input.StartTime, ":", "")
	slotIdentifier := fmt.Sprintf("%s_%s", datePart, timePart)

	// Acquire distributed lock for booking slot (TTL: 10 mins = 600s)
	// Fail-closed concurrency lock to prevent double-booking of human tutors
	locked, err := db.AcquireSlotLock(c.Request.Context(), input.TutorID, slotIdentifier, 600)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to acquire slot reservation lock"})
		return
	}
	if !locked {
		c.JSON(http.StatusConflict, gin.H{
			"error": "This tutor slot is currently reserved or undergoing checkout by another student. Please select another slot.",
		})
		return
	}

	// Verify database hasn't already confirmed a booking for this slot
	var existingBookings int64
	db.WithTenant(c).Model(&models.Booking{}).
		Where("tutor_id = ? AND scheduled_date = ? AND start_time = ? AND status != ?",
			input.TutorID, input.ScheduledDate, input.StartTime, "CANCELLED").
		Count(&existingBookings)
	if existingBookings > 0 {
		c.JSON(http.StatusConflict, gin.H{
			"error": "This tutor slot has already been confirmed and booked.",
		})
		return
	}

	totalAmount := tutor.HourlyRate * input.Hours
	booking := models.Booking{
		ID:            uuid.New().String(),
		TutorID:       input.TutorID,
		StudentID:     input.StudentID,
		ParentID:      input.ParentID,
		Subject:       input.Subject,
		ScheduledDate: input.ScheduledDate,
		StartTime:     input.StartTime,
		EndTime:       input.EndTime,
		HourlyRate:    tutor.HourlyRate,
		TotalAmount:   totalAmount,
		Currency:      tutor.Currency,
		Status:        "PENDING",
		MeetingURL:    "https://meet.resultspro.ng/room/" + uuid.New().String(),
		Notes:         input.Notes,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if tenantID, exists := c.Get("tenant_id"); exists && tenantID != "" {
		booking.TenantID = tenantID.(string)
	}

	if err := db.WithTenant(c).Create(&booking).Error; err != nil {
		// Release slot lock if DB creation failed so slot is not held unnecessarily
		_ = db.ReleaseSlotLock(c.Request.Context(), input.TutorID, slotIdentifier)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"booking": booking})
}

// List Bookings
func (h *Handler) GetBookings(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var bookings []models.Booking

	db.WithTenant(c).Where("tutor_id = ? OR student_id = ? OR parent_id = ?", userID.(string), userID.(string), userID.(string)).
		Order("scheduled_date DESC").Find(&bookings)

	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}

// Reviews
func (h *Handler) CreateReview(c *gin.Context) {
	var input struct {
		TutorID string `json:"tutor_id" binding:"required"`
		Rating  int    `json:"rating" binding:"required,min=1,max=5"`
		Comment string `json:"comment" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	review := models.TutorReview{
		ID:        uuid.New().String(),
		TutorID:   input.TutorID,
		StudentID: userID.(string),
		Rating:    input.Rating,
		Comment:   input.Comment,
		CreatedAt: time.Now(),
	}

	if tenantID, exists := c.Get("tenant_id"); exists && tenantID != "" {
		review.TenantID = tenantID.(string)
	}

	db.WithTenant(c).Create(&review)

	// Update tutor average rating
	var avgRating float64
	var count int64
	db.WithTenant(c).Model(&models.TutorReview{}).Where("tutor_id = ?", input.TutorID).Count(&count)
	db.WithTenant(c).Model(&models.TutorReview{}).Where("tutor_id = ?", input.TutorID).Select("AVG(rating)").Row().Scan(&avgRating)

	db.WithTenant(c).Model(&models.TutorProfile{}).Where("id = ?", input.TutorID).Updates(map[string]interface{}{
		"rating":        avgRating,
		"total_reviews": count,
	})

	// Invalidate public directory cache & profile
	_ = db.Delete(c.Request.Context(), db.BuildKey("tutors", "global", "directory", "all"))
	_ = db.Delete(c.Request.Context(), db.BuildKey("tutors", "global", "tutor:profile", input.TutorID))

	c.JSON(http.StatusCreated, gin.H{"review": review})
}

// Request Payout
func (h *Handler) RequestPayout(c *gin.Context) {
	var input struct {
		Amount      float64 `json:"amount" binding:"required,min=1000"`
		BankName    string  `json:"bank_name" binding:"required"`
		AccountNum  string  `json:"account_number" binding:"required"`
		AccountName string  `json:"account_name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	payout := models.TutorPayoutRequest{
		ID:          uuid.New().String(),
		TutorID:     userID.(string),
		Amount:      input.Amount,
		Currency:    "NGN",
		BankName:    input.BankName,
		AccountNum:  input.AccountNum,
		AccountName: input.AccountName,
		Status:      "PENDING",
		CreatedAt:   time.Now(),
	}

	if tenantID, exists := c.Get("tenant_id"); exists && tenantID != "" {
		payout.TenantID = tenantID.(string)
	}

	if err := db.WithTenant(c).Create(&payout).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payout request"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"payout": payout})
}

// Admin Endpoints
func (h *Handler) AdminGetTutors(c *gin.Context) {
	var tutors []models.TutorProfile
	db.WithTenant(c).Order("created_at DESC").Find(&tutors)
	c.JSON(http.StatusOK, gin.H{"tutors": tutors})
}

func (h *Handler) AdminGetBookings(c *gin.Context) {
	var bookings []models.Booking
	db.WithTenant(c).Order("created_at DESC").Find(&bookings)
	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}

func (h *Handler) AdminGetPayouts(c *gin.Context) {
	var payouts []models.TutorPayoutRequest
	db.WithTenant(c).Order("created_at DESC").Find(&payouts)
	c.JSON(http.StatusOK, gin.H{"payouts": payouts})
}

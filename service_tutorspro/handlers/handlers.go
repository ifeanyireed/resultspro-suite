package handlers

import (
	"encoding/json"
	"net/http"
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
	var tutors []models.TutorProfile

	query := db.WithTenant(c).Where("is_verified = ? AND is_available = ?", true, true)
	if subject != "" {
		query = query.Where("subjects LIKE ?", "%"+subject+"%")
	}

	query.Order("rating DESC").Find(&tutors)
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

	if err := db.WithTenant(c).Create(&tutor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tutor profile"})
		return
	}

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

	if err := db.WithTenant(c).Create(&booking).Error; err != nil {
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

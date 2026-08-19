package handlers

import (
	"io"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_classroompro/db"
	"service_classroompro/models"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

// ProxyAuth forwards any auth requests to service_users
func (h *Handler) ProxyAuth(c *gin.Context) {
	usersURL := os.Getenv("USERS_SERVICE_URL")
	if usersURL == "" {
		usersURL = "http://localhost:7000"
	}

	targetURL := usersURL + c.Request.URL.Path
	if c.Request.URL.RawQuery != "" {
		targetURL += "?" + c.Request.URL.RawQuery
	}

	req, err := http.NewRequest(c.Request.Method, targetURL, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create proxy request"})
		return
	}

	for key, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Users service unreachable"})
		return
	}
	defer resp.Body.Close()

	for key, values := range resp.Header {
		for _, value := range values {
			c.Writer.Header().Add(key, value)
		}
	}
	c.Writer.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(c.Writer, resp.Body)
}

// Notes
func (h *Handler) CreateNote(c *gin.Context) {
	var input struct {
		SubjectID string  `json:"subject_id" binding:"required"`
		TopicID   *string `json:"topic_id"`
		Title     string  `json:"title" binding:"required"`
		Content   string  `json:"content" binding:"required"`
		IsPublic  bool    `json:"is_public"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	note := models.Note{
		ID:        uuid.New().String(),
		SubjectID: input.SubjectID,
		TopicID:   input.TopicID,
		TeacherID: userID.(string),
		Title:     input.Title,
		Content:   input.Content,
		IsPublic:  input.IsPublic,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := db.WithTenant(c).Create(&note).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create note"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"note": note})
}

func (h *Handler) GetNotes(c *gin.Context) {
	subjectID := c.Query("subject_id")
	var notes []models.Note

	query := db.DB
	if subjectID != "" {
		query = query.Where("subject_id = ?", subjectID)
	}

	query.Order("created_at DESC").Find(&notes)
	c.JSON(http.StatusOK, gin.H{"notes": notes})
}

func (h *Handler) GetNoteByID(c *gin.Context) {
	id := c.Param("id")
	var note models.Note
	if err := db.WithTenant(c).First(&note, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"note": note})
}

// Quizzes
func (h *Handler) CreateQuiz(c *gin.Context) {
	var input struct {
		SubjectID   string  `json:"subject_id" binding:"required"`
		TopicID     *string `json:"topic_id"`
		Title       string  `json:"title" binding:"required"`
		Description string  `json:"description"`
		Questions   string  `json:"questions" binding:"required"`
		DurationMin int     `json:"duration_min"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	quiz := models.Quiz{
		ID:          uuid.New().String(),
		SubjectID:   input.SubjectID,
		TopicID:     input.TopicID,
		TeacherID:   userID.(string),
		Title:       input.Title,
		Description: input.Description,
		Questions:   input.Questions,
		DurationMin: input.DurationMin,
		CreatedAt:   time.Now(),
	}

	if err := db.WithTenant(c).Create(&quiz).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create quiz"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"quiz": quiz})
}

func (h *Handler) GetQuizzes(c *gin.Context) {
	subjectID := c.Query("subject_id")
	var quizzes []models.Quiz

	query := db.DB
	if subjectID != "" {
		query = query.Where("subject_id = ?", subjectID)
	}

	query.Order("created_at DESC").Find(&quizzes)
	c.JSON(http.StatusOK, gin.H{"quizzes": quizzes})
}

func (h *Handler) GetQuizByID(c *gin.Context) {
	id := c.Param("id")
	var quiz models.Quiz
	if err := db.WithTenant(c).First(&quiz, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Quiz not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"quiz": quiz})
}

// Flashcards & SRS
func (h *Handler) CreateFlashcard(c *gin.Context) {
	var input struct {
		SubjectID string  `json:"subject_id" binding:"required"`
		TopicID   *string `json:"topic_id"`
		Front     string  `json:"front" binding:"required"`
		Back      string  `json:"back" binding:"required"`
		Hint      string  `json:"hint"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	card := models.Flashcard{
		ID:        uuid.New().String(),
		SubjectID: input.SubjectID,
		TopicID:   input.TopicID,
		Front:     input.Front,
		Back:      input.Back,
		Hint:      input.Hint,
		CreatedAt: time.Now(),
	}

	if err := db.WithTenant(c).Create(&card).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create flashcard"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"flashcard": card})
}

func (h *Handler) GetFlashcards(c *gin.Context) {
	subjectID := c.Query("subject_id")
	var cards []models.Flashcard

	query := db.DB
	if subjectID != "" {
		query = query.Where("subject_id = ?", subjectID)
	}

	query.Order("created_at DESC").Find(&cards)
	c.JSON(http.StatusOK, gin.H{"flashcards": cards})
}

func (h *Handler) ReviewFlashcard(c *gin.Context) {
	var input struct {
		CardID  string `json:"card_id" binding:"required"`
		Quality int    `json:"quality" binding:"required"` // 0-5
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	var progress models.FlashcardProgress

	err := db.WithTenant(c).Where("student_id = ? AND card_id = ?", userID.(string), input.CardID).First(&progress).Error
	if err != nil {
		progress = models.FlashcardProgress{
			ID:          uuid.New().String(),
			StudentID:   userID.(string),
			CardID:      input.CardID,
			Box:         1,
			EaseFactor:  2.5,
			Repetitions: 0,
			Interval:    1,
		}
	}

	// SuperMemo-2 SRS algorithm
	if input.Quality >= 3 {
		if progress.Repetitions == 0 {
			progress.Interval = 1
		} else if progress.Repetitions == 1 {
			progress.Interval = 6
		} else {
			progress.Interval = int(float64(progress.Interval) * progress.EaseFactor)
		}
		progress.Repetitions++
		if progress.Box < 5 {
			progress.Box++
		}
	} else {
		progress.Repetitions = 0
		progress.Interval = 1
		progress.Box = 1
	}

	progress.EaseFactor += 0.1 - float64(5-input.Quality)*(0.08+float64(5-input.Quality)*0.02)
	if progress.EaseFactor < 1.3 {
		progress.EaseFactor = 1.3
	}

	progress.NextReview = time.Now().AddDate(0, 0, progress.Interval)
	progress.UpdatedAt = time.Now()

	db.WithTenant(c).Save(&progress)
	c.JSON(http.StatusOK, gin.H{"progress": progress})
}

// Gamification
func (h *Handler) LogStudySession(c *gin.Context) {
	var input struct {
		SubjectID string `json:"subject_id"`
		Duration  int    `json:"duration_seconds" binding:"required"`
		Activity  string `json:"activity" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	session := models.StudySession{
		ID:        uuid.New().String(),
		UserID:    userID.(string),
		SubjectID: input.SubjectID,
		Duration:  input.Duration,
		Activity:  input.Activity,
		CreatedAt: time.Now(),
	}

	db.WithTenant(c).Create(&session)

	// Update points
	var profile models.GamificationProfile
	if err := db.WithTenant(c).First(&profile, "user_id = ?", userID.(string)).Error; err != nil {
		profile = models.GamificationProfile{
			UserID:       userID.(string),
			Points:       0,
			Level:        1,
			StreakDays:   1,
			LastActiveAt: time.Now(),
			Badges:       `["FIRST_STUDY"]`,
		}
	}

	pointsEarned := input.Duration / 60 * 2
	profile.Points += pointsEarned
	profile.Level = profile.Points/100 + 1
	profile.LastActiveAt = time.Now()
	db.WithTenant(c).Save(&profile)

	c.JSON(http.StatusOK, gin.H{
		"session":       session,
		"points_earned": pointsEarned,
		"total_points":  profile.Points,
		"level":         profile.Level,
	})
}

func (h *Handler) GetGamificationProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var profile models.GamificationProfile
	if err := db.WithTenant(c).First(&profile, "user_id = ?", userID.(string)).Error; err != nil {
		profile = models.GamificationProfile{
			UserID:       userID.(string),
			Points:       0,
			Level:        1,
			StreakDays:   0,
			LastActiveAt: time.Now(),
			Badges:       "[]",
		}
	}
	c.JSON(http.StatusOK, gin.H{"profile": profile})
}

// Bookmarks
func (h *Handler) ToggleBookmark(c *gin.Context) {
	var input struct {
		ItemType string `json:"item_type" binding:"required"`
		ItemID   string `json:"item_id" binding:"required"`
		Title    string `json:"title" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	var existing models.Bookmark
	err := db.WithTenant(c).Where("user_id = ? AND item_id = ?", userID.(string), input.ItemID).First(&existing).Error
	if err == nil {
		db.WithTenant(c).Delete(&existing)
		c.JSON(http.StatusOK, gin.H{"bookmarked": false})
		return
	}

	bm := models.Bookmark{
		ID:        uuid.New().String(),
		UserID:    userID.(string),
		ItemType:  input.ItemType,
		ItemID:    input.ItemID,
		Title:     input.Title,
		CreatedAt: time.Now(),
	}
	db.WithTenant(c).Create(&bm)
	c.JSON(http.StatusOK, gin.H{"bookmarked": true, "bookmark": bm})
}

func (h *Handler) GetBookmarks(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var bookmarks []models.Bookmark
	db.WithTenant(c).Where("user_id = ?", userID.(string)).Order("created_at DESC").Find(&bookmarks)
	c.JSON(http.StatusOK, gin.H{"bookmarks": bookmarks})
}

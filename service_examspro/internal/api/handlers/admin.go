package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
	"sort"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"exams-resultspro-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/gocarina/gocsv"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AdminHandler struct{}

// Users
func (h *AdminHandler) GetUsers(c *gin.Context) {
	search := c.Query("search")
	plan := c.Query("plan")
	status := c.Query("status")

	tx := database.DB.Model(&models.User{})

	if search != "" {
		s := "%" + search + "%"
		tx = tx.Where("name LIKE ? OR email LIKE ? OR id LIKE ?", s, s, s)
	}
	
	if plan == "Pro" {
		tx = tx.Where("is_premium = ?", 1)
	} else if plan == "Free" {
		tx = tx.Where("is_premium = ?", 0)
	}

	if status == "Suspended" {
		tx = tx.Where("is_banned = ?", 1)
	} else if status == "Active" {
		tx = tx.Where("is_banned = ?", 0)
	}

	var users []models.User
	if err := tx.Order("created_at desc").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (h *AdminHandler) CreateUser(c *gin.Context) {
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Role     string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	// Generate a unique referral code
	referralCode := strings.ToUpper(input.Email[:3]) + uuid.New().String()[:5]

	user := models.User{
		ID:           uuid.New().String(),
		Name:         &input.Name,
		Email:        input.Email,
		Password:     string(hashedPassword),
		Role:         models.Role(input.Role),
		ReferralCode: referralCode,
		IsAdmin:      input.Role == string(models.RoleAdmin),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func (h *AdminHandler) ImportUsers(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer f.Close()

	type UserImport struct {
		Name     string `csv:"name"`
		Email    string `csv:"email"`
		Password string `csv:"password"`
		Role     string `csv:"role"`
	}

	var imports []UserImport
	if err := gocsv.Unmarshal(f, &imports); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CSV format: " + err.Error()})
		return
	}

	successCount := 0
	errorCount := 0
	var errors []string

	for i, imp := range imports {
		if imp.Email == "" || imp.Password == "" {
			errorCount++
			errors = append(errors, fmt.Sprintf("Row %d: Email and Password are required", i+2))
			continue
		}

		// Check if user exists
		var existingUser models.User
		if err := database.DB.Where("email = ?", imp.Email).First(&existingUser).Error; err == nil {
			errorCount++
			errors = append(errors, fmt.Sprintf("Row %d: User with email %s already exists", i+2, imp.Email))
			continue
		}

		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(imp.Password), bcrypt.DefaultCost)
		referralCode := strings.ToUpper(imp.Email[:3]) + uuid.New().String()[:5]

		role := models.Role(strings.ToUpper(imp.Role))
		if role == "" {
			role = models.RoleStudent
		}

		user := models.User{
			ID:           uuid.New().String(),
			Name:         &imp.Name,
			Email:        imp.Email,
			Password:     string(hashedPassword),
			Role:         role,
			ReferralCode: referralCode,
			IsAdmin:      role == models.RoleAdmin,
		}

		if err := database.DB.Create(&user).Error; err != nil {
			errorCount++
			errors = append(errors, fmt.Sprintf("Row %d: Failed to save user %s", i+2, imp.Email))
		} else {
			successCount++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      fmt.Sprintf("Import completed: %d success, %d errors", successCount, errorCount),
		"successCount": successCount,
		"errorCount":   errorCount,
		"errors":       errors,
	})
}

func (h *AdminHandler) UpdateUser(c *gin.Context) {
	userID := c.Param("userId")
	var input struct {
		Name        string `json:"name"`
		Phone       string `json:"phone"`
		Role        string `json:"role"`
		IsPremium   *bool  `json:"isPremium"`
		CoinBalance *int   `json:"coinBalance"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if input.Name != "" {
		user.Name = &input.Name
	}
	if input.Phone != "" {
		user.Phone = &input.Phone
	}
	if input.Role != "" {
		user.Role = models.Role(input.Role)
		user.IsAdmin = input.Role == string(models.RoleAdmin)
	}
	if input.IsPremium != nil {
		user.IsPremium = *input.IsPremium
	}
	if input.CoinBalance != nil {
		user.CoinBalance = *input.CoinBalance
	}

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *AdminHandler) SuspendUser(c *gin.Context) {
	userID := c.Param("userId")
	var input struct {
		Reason string `json:"reason" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.IsBanned = true
	user.BanReason = &input.Reason

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to suspend user"})
		return
	}

	// Send Email
	subject := "Account Suspension Notice - ResultsPRO"
	body := fmt.Sprintf(`
		<div style="font-family: sans-serif; padding: 20px; color: #333;">
			<h2 style="color: #e53e3e;">Account Suspended</h2>
			<p>Hello %s,</p>
			<p>We are writing to inform you that your ResultsPRO account has been suspended for the following reason:</p>
			<div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e53e3e;">
				<strong>%s</strong>
			</div>
			<p>If you believe this is a mistake, please contact our support team.</p>
			<br>
			<p>Regards,<br>ResultsPRO Compliance Team</p>
		</div>
	`, *user.Name, input.Reason)

	// We don't block the response on email sending
	go utils.SendEmail(user.Email, subject, body)

	// Send In-App Notification
	utils.SendNotification(user.ID, "Account Suspended", "Your account has been suspended. Please check your email for details.", models.NotificationTypeWarning, models.NotificationRouteInApp)

	c.JSON(http.StatusOK, gin.H{"message": "User suspended successfully"})
}

func (h *AdminHandler) UnsuspendUser(c *gin.Context) {
	userID := c.Param("userId")

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.IsBanned = false
	user.BanReason = nil

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unsuspend user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User unsuspended successfully"})
}

// System Settings
func (h *AdminHandler) GetSettings(c *gin.Context) {
	settings := []models.SystemSetting{}
	database.DB.Order("setting_group asc, id asc").Find(&settings)
	c.JSON(http.StatusOK, settings)
}

func (h *AdminHandler) GetPublicSettings(c *gin.Context) {
	var settings []models.SystemSetting
	// Only fetch settings that are safe for public consumption (e.g., feature flags)
	database.DB.Where("setting_group = ?", "Features").Find(&settings)
	
	publicSettings := make(map[string]string)
	for _, s := range settings {
		publicSettings[s.ID] = s.Value
	}
	
	c.JSON(http.StatusOK, publicSettings)
}

func (h *AdminHandler) UpdateSetting(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Value string `json:"value"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Model(&models.SystemSetting{}).Where("id = ?", id).Update("value", input.Value).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update setting"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Setting updated successfully"})
}

func (h *AdminHandler) GetUserDetail(c *gin.Context) {
	userID := c.Param("userId")
	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Calculate stats
	var totalQuestions int64
	database.DB.Model(&models.UserAnswer{}).Where("user_id = ?", userID).Count(&totalQuestions)

	var correctQuestions int64
	database.DB.Model(&models.UserAnswer{}).Where("user_id = ? AND is_correct = ?", userID, true).Count(&correctQuestions)

	accuracy := 0
	if totalQuestions > 0 {
		accuracy = int((correctQuestions * 100) / totalQuestions)
	}

	var totalBattles int64
	database.DB.Model(&models.BattleParticipant{}).Where("user_id = ?", userID).Count(&totalBattles)

	// Fetch recent activity
	type ActivityItem struct {
		Action string    `json:"action"`
		Time   time.Time `json:"time"`
		Type   string    `json:"type"`
		Amount *string   `json:"amount,omitempty"`
		Reward *string   `json:"reward,omitempty"`
	}
	var activity []ActivityItem

	// 1. Recent Answers
	var recentAnswers []models.UserAnswer
	database.DB.Preload("Question.Topic.Subject").Where("user_id = ?", userID).Order("answered_at desc").Limit(5).Find(&recentAnswers)
	for _, ans := range recentAnswers {
		subjectName := "Unknown"
		if ans.Question != nil && ans.Question.Topic != nil && ans.Question.Topic.Subject != nil {
			subjectName = ans.Question.Topic.Subject.Name
		}
		activity = append(activity, ActivityItem{
			Action: fmt.Sprintf("Answered %s Question", subjectName),
			Time:   ans.AnsweredAt,
			Type:   "study",
		})
	}

	// 2. Recent Battles
	var recentBattles []models.BattleParticipant
	database.DB.Preload("Battle.Subject").Where("user_id = ?", userID).Order("joined_at desc").Limit(5).Find(&recentBattles)
	for _, part := range recentBattles {
		status := "Joined"
		if part.Status == "completed" {
			status = "Finished"
		}
		subjectName := "Battle"
		if part.Battle != nil && part.Battle.Subject != nil {
			subjectName = part.Battle.Subject.Name
		}
		activity = append(activity, ActivityItem{
			Action: fmt.Sprintf("%s %s Battle", status, subjectName),
			Time:   part.JoinedAt,
			Type:   "battle",
		})
	}

	// 3. Recent Purchases
	var recentPurchases []models.Purchase
	database.DB.Where("user_id = ?", userID).Order("created_at desc").Limit(5).Find(&recentPurchases)
	for _, pur := range recentPurchases {
		amountStr := fmt.Sprintf("-₦%d", pur.AmountNgn)
		activity = append(activity, ActivityItem{
			Action: fmt.Sprintf("Purchased '%s'", pur.PackName),
			Time:   pur.CreatedAt,
			Type:   "finance",
			Amount: &amountStr,
		})
	}

	// Sort activity by time desc
	for i := 0; i < len(activity); i++ {
		for j := i + 1; j < len(activity); j++ {
			if activity[j].Time.After(activity[i].Time) {
				activity[i], activity[j] = activity[j], activity[i]
			}
		}
	}

	// Limit to top 10 after merging
	if len(activity) > 10 {
		activity = activity[:10]
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
		"stats": gin.H{
			"questionsAnswered": totalQuestions,
			"accuracy":          fmt.Sprintf("%d%%", accuracy),
			"battles":           totalBattles,
			"elo":               user.EloRating,
			"coins":             user.CoinBalance,
		},
		"activity": activity,
	})
}

// Exams
func (h *AdminHandler) GetExams(c *gin.Context) {
	var exams []models.Exam
	database.DB.Preload("Subjects").Order("name asc").Find(&exams)
	c.JSON(http.StatusOK, exams)
}

func (h *AdminHandler) CreateExam(c *gin.Context) {
	var input struct {
		Name      string `json:"name" binding:"required"`
		Category  string `json:"category" binding:"required"`
		Slug      string `json:"slug"`
		YearRange string `json:"yearRange"`
		ExamDate  string `json:"examDate"`
		IsPopular bool   `json:"isPopular"`
		IsCurated bool   `json:"isCurated"`
		IsBattleReady bool `json:"isBattleReady"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	slug := input.Slug
	if slug == "" {
		slug = slugify(input.Name)
	}

	var examDate *time.Time
	if input.ExamDate != "" {
		t, err := time.Parse("2006-01-02", input.ExamDate)
		if err == nil {
			examDate = &t
		}
	}

	exam := models.Exam{
		Name:      input.Name,
		Category:  input.Category,
		Slug:      slug,
		YearRange: input.YearRange,
		ExamDate:  examDate,
		IsPopular: input.IsPopular,
		IsCurated: input.IsCurated,
		IsActive:  true,
		IsBattleReady: input.IsBattleReady,
	}

	if err := database.DB.Create(&exam).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exam"})
		return
	}
	c.JSON(http.StatusCreated, exam)
}

func (h *AdminHandler) UpdateExam(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Map JSON keys to DB column names if they differ
	updates := make(map[string]interface{})
	for k, v := range input {
		switch k {
		case "name":
			updates["name"] = v
		case "category":
			updates["category"] = v
		case "slug":
			updates["slug"] = v
		case "yearRange":
			updates["year_range"] = v
		case "isPopular":
			updates["is_popular"] = v
		case "isCurated":
			updates["is_curated"] = v
		case "isActive":
			updates["is_active"] = v
		case "isBattleReady":
			updates["is_battle_ready"] = v
		case "examDate":
			if dateStr, ok := v.(string); ok {
				if dateStr == "" {
					updates["exam_date"] = nil
				} else {
					t, err := time.Parse("2006-01-02", dateStr)
					if err == nil {
						updates["exam_date"] = t
					}
				}
			}
		}
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No valid fields provided for update"})
		return
	}

	if err := database.DB.Model(&models.Exam{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update exam", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Exam updated"})
}

func (h *AdminHandler) DeleteExam(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)
	database.DB.Delete(&models.Exam{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Exam deleted"})
}

// Subjects
func (h *AdminHandler) CreateSubject(c *gin.Context) {
	var input struct {
		ExamID         int     `json:"examId" binding:"required"`
		Name           string  `json:"name" binding:"required"`
		Slug           string  `json:"slug"`
		CoinUnlockCost int     `json:"coinUnlockCost"`
		Color          string  `json:"color"`
		TextbookURL     *string `json:"textbookUrl"`
		TextbookTitle   *string `json:"textbookTitle"`
		TextbookContent *string `json:"textbookContent"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	slug := input.Slug
	if slug == "" {
		slug = slugify(input.Name)
	}

	subject := models.Subject{
		ExamID:          input.ExamID,
		Name:            input.Name,
		Slug:            slug,
		CoinUnlockCost:  input.CoinUnlockCost,
		Color:           input.Color,
		TextbookURL:     input.TextbookURL,
		TextbookTitle:   input.TextbookTitle,
		TextbookContent: input.TextbookContent,
	}

	database.DB.Create(&subject)
	c.JSON(http.StatusCreated, subject)
}

func (h *AdminHandler) UpdateSubject(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)
	var input map[string]interface{}
	c.ShouldBindJSON(&input)
	database.DB.Model(&models.Subject{}).Where("id = ?", id).Updates(input)
	c.JSON(http.StatusOK, gin.H{"message": "Subject updated"})
}

func (h *AdminHandler) UploadTextbook(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Upload to S3
	fileURL, err := utils.UploadToS3(file, "textbooks")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to upload to S3: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": fileURL})
}

func (h *AdminHandler) UploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Validate it's an image
	contentType := file.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File must be an image"})
		return
	}

	folder := c.DefaultQuery("folder", "images")

	// Upload to S3
	fileURL, err := utils.UploadToS3(file, folder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to upload to S3: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": fileURL})
}

func (h *AdminHandler) DeleteSubject(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)
	database.DB.Delete(&models.Subject{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Subject deleted"})
}

// Topics
func (h *AdminHandler) CreateTopic(c *gin.Context) {
	var input struct {
		SubjectID       int    `json:"subjectId" binding:"required"`
		Name            string `json:"name" binding:"required"`
		OrderIndex      int    `json:"orderIndex"`
		SyllabusContent string `json:"syllabusContent"`
		AiLessonNotes   string `json:"aiLessonNotes"`
	}
	c.ShouldBindJSON(&input)
	topic := models.Topic{
		SubjectID:       input.SubjectID,
		Name:            input.Name,
		OrderIndex:      input.OrderIndex,
		SyllabusContent: &input.SyllabusContent,
		AiLessonNotes:   &input.AiLessonNotes,
	}
	database.DB.Create(&topic)
	c.JSON(http.StatusCreated, topic)
}

func (h *AdminHandler) UpdateTopic(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)
	var input map[string]interface{}
	c.ShouldBindJSON(&input)
	database.DB.Model(&models.Topic{}).Where("id = ?", id).Updates(input)
	c.JSON(http.StatusOK, gin.H{"message": "Topic updated"})
}

func (h *AdminHandler) DeleteTopic(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)
	database.DB.Delete(&models.Topic{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Topic deleted"})
}

// Questions
func (h *AdminHandler) GetQuestions(c *gin.Context) {
	idParam := c.Query("id")
	if idParam != "" {
		var question models.Question
		if err := database.DB.Preload("Options").Preload("Topic.Subject.Exam").First(&question, "id = ?", idParam).Error; err == nil {
			c.JSON(http.StatusOK, gin.H{
				"questions": []models.Question{question},
				"total":     1,
				"page":      1,
				"limit":     1,
			})
			return
		}
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")
	examIDStr := c.Query("examId")
	subjectIDStr := c.Query("subjectId")
	topicIDStr := c.Query("topicId")
	year := c.Query("year")
	qType := c.Query("type")

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}
	offset := (page - 1) * limit

	query := database.DB.Model(&models.Question{})

	if search != "" {
		query = query.Where("body_text LIKE ?", "%"+search+"%")
	}

	// Filter by Topic, Subject, or Exam (supporting IDs or Slugs)
	if topicIDStr != "" && topicIDStr != "all" {
		if id, err := strconv.Atoi(topicIDStr); err == nil {
			query = query.Where("topic_id = ?", id)
		} else {
			query = query.Joins("JOIN topics ON questions.topic_id = topics.id").Where("topics.slug = ?", topicIDStr)
		}
	} else if subjectIDStr != "" && subjectIDStr != "all" {
		if id, err := strconv.Atoi(subjectIDStr); err == nil {
			query = query.Joins("JOIN topics ON questions.topic_id = topics.id").Where("topics.subject_id = ?", id)
		} else {
			query = query.Joins("JOIN topics ON questions.topic_id = topics.id").
				Joins("JOIN subjects ON topics.subject_id = subjects.id").
				Where("subjects.slug = ? OR subjects.id = ?", subjectIDStr, subjectIDStr)
		}
	} else if examIDStr != "" && examIDStr != "all" {
		if id, err := strconv.Atoi(examIDStr); err == nil {
			query = query.Joins("JOIN topics ON questions.topic_id = topics.id").
				Joins("JOIN subjects ON topics.subject_id = subjects.id").
				Where("subjects.exam_id = ?", id)
		} else {
			query = query.Joins("JOIN topics ON questions.topic_id = topics.id").
				Joins("JOIN subjects ON topics.subject_id = subjects.id").
				Joins("JOIN exams ON subjects.exam_id = exams.id").
				Where("exams.slug = ?", examIDStr)
		}
	}

	if year != "" {
		query = query.Where("year = ?", year)
	}
	if qType != "" && qType != "all" {
		query = query.Where("type = ?", qType)
	}

	var total int64
	query.Count(&total)

	var questions []models.Question
	err := query.Select("questions.*").
		Preload("Options").
		Preload("Topic.Subject.Exam").
		Order("questions.created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&questions).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"questions": questions,
		"total":     total,
		"page":      page,
		"limit":     limit,
	})
}

func (h *AdminHandler) CreateQuestion(c *gin.Context) {
	var input struct {
		TopicID             int      `json:"topicId" binding:"required"`
		Type                string   `json:"type" binding:"required"`
		BodyText            string   `json:"bodyText" binding:"required"`
		Difficulty          string   `json:"difficulty"`
		Year                int      `json:"year"`
		CoinReward          int      `json:"coinReward"`
		ExplanationStandard string   `json:"explanationStandard"`
		Options             []struct {
			OptionText string `json:"optionText"`
			IsCorrect  bool   `json:"isCorrect"`
			OrderIndex int    `json:"orderIndex"`
		} `json:"options"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	question := models.Question{
		ID:                  uuid.New().String(),
		TopicID:             input.TopicID,
		Type:                input.Type,
		BodyText:            input.BodyText,
		Difficulty:          input.Difficulty,
		Year:                &input.Year,
		CoinReward:          input.CoinReward,
		ExplanationStandard: &input.ExplanationStandard,
		Status:              "published",
	}

	database.DB.Transaction(func(tx *gorm.DB) error {
		tx.Create(&question)
		for _, opt := range input.Options {
			tx.Create(&models.QuestionOption{
				ID:         uuid.New().String(),
				QuestionID: question.ID,
				OptionText: opt.OptionText,
				IsCorrect:  opt.IsCorrect,
				OrderIndex: opt.OrderIndex,
			})
		}
		return nil
	})

	database.DB.Preload("Options").First(&question, "id = ?", question.ID)
	c.JSON(http.StatusCreated, question)
}

func (h *AdminHandler) GetQuestion(c *gin.Context) {
	id := c.Param("id")
	log.Printf("DEBUG: AdminHandler.GetQuestion called with id: %s", id)
	var question models.Question
	if err := database.DB.Preload("Options").Preload("Topic.Subject.Exam").First(&question, "id = ?", id).Error; err != nil {
		log.Printf("DEBUG: Question not found: %s, error: %v", id, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		return
	}
	log.Printf("DEBUG: Question found: %s, type: %s", question.ID, question.Type)
	c.JSON(http.StatusOK, question)
}

func (h *AdminHandler) UpdateQuestion(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		TopicID             int      `json:"topicId"`
		Type                string   `json:"type"`
		BodyText            string   `json:"bodyText"`
		BodyImageUrl        *string  `json:"bodyImageUrl"`
		Difficulty          string   `json:"difficulty"`
		Year                int      `json:"year"`
		CoinReward          int      `json:"coinReward"`
		ExplanationStandard string   `json:"explanationStandard"`
		Status              string   `json:"status"`
		Options             []struct {
			ID         string `json:"id"`
			OptionText string `json:"optionText"`
			IsCorrect  bool   `json:"isCorrect"`
			OrderIndex int    `json:"orderIndex"`
		} `json:"options"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("DEBUG: UpdateQuestion binding error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var question models.Question
	if err := database.DB.Where("id = ?", id).First(&question).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		return
	}

	database.DB.Transaction(func(tx *gorm.DB) error {
		// Update question fields
		updates := map[string]interface{}{
			"topic_id":             input.TopicID,
			"type":                 input.Type,
			"body_text":            input.BodyText,
			"body_image_url":       input.BodyImageUrl,
			"difficulty":           input.Difficulty,
			"year":                 input.Year,
			"coin_reward":          input.CoinReward,
			"explanation_standard": input.ExplanationStandard,
			"status":               input.Status,
		}

		if err := tx.Model(&question).Updates(updates).Error; err != nil {
			return err
		}

		// Handle options
		if input.Type == "mcq" {
			// Simple approach: delete existing options and recreate
			// This is safer than trying to match IDs for a small number of options
			if err := tx.Delete(&models.QuestionOption{}, "question_id = ?", id).Error; err != nil {
				return err
			}

			for _, opt := range input.Options {
				newOpt := models.QuestionOption{
					ID:         uuid.New().String(),
					QuestionID: id,
					OptionText: opt.OptionText,
					IsCorrect:  opt.IsCorrect,
					OrderIndex: opt.OrderIndex,
				}
				if err := tx.Create(&newOpt).Error; err != nil {
					return err
				}
			}
		} else {
			// For non-MCQ, ensure options are cleared
			if err := tx.Delete(&models.QuestionOption{}, "question_id = ?", id).Error; err != nil {
				return err
			}
		}

		return nil
	})

	c.JSON(http.StatusOK, gin.H{"message": "Question updated successfully"})
}

func (h *AdminHandler) DeleteQuestion(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Question{}, "id = ?", id)
	c.JSON(http.StatusOK, gin.H{"message": "Question deleted"})
}

func (h *AdminHandler) BulkDeleteQuestions(c *gin.Context) {
	var input struct {
		IDs []string `json:"ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input. 'ids' array is required."})
		return
	}

	if len(input.IDs) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No IDs provided, nothing deleted"})
		return
	}

	result := database.DB.Delete(&models.Question{}, "id IN ?", input.IDs)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete questions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully deleted %d questions", result.RowsAffected),
		"count":   result.RowsAffected,
	})
}

func (h *AdminHandler) GenerateAIExplanation(c *gin.Context) {
	id := c.Param("questionId")
	var q models.Question
	if err := database.DB.Preload("Options").First(&q, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		return
	}

	var opts []string
	var correct string
	for _, o := range q.Options {
		opts = append(opts, o.OptionText)
		if o.IsCorrect {
			correct = o.OptionText
		}
	}

	explanation, err := utils.GenerateExplanation(context.Background(), q.BodyText, opts, correct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	database.DB.Model(&q).Update("explanation_standard", explanation)
	c.JSON(http.StatusOK, gin.H{"explanation": explanation})
}

func (h *AdminHandler) BulkUploadQuestions(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer f.Close()

	type QuestionCSV struct {
		Exam         string `csv:"exam"`
		Subject      string `csv:"subject"`
		TopicID      int    `csv:"topicId"`
		Topic        string `csv:"topic"`
		BodyText     string `csv:"bodyText"`
		Type         string `csv:"type"` // "1" or "mcq", "2" or "theory"
		Difficulty   string `csv:"difficulty"`
		Year         int    `csv:"year"`
		OptionA      string `csv:"optionA"`
		OptionB      string `csv:"optionB"`
		OptionC      string `csv:"optionC"`
		OptionD      string `csv:"optionD"`
		Correct      string `csv:"correctOption"` // A, B, C, or D
		Explanation  string `csv:"explanation"`
		BodyImageUrl string `csv:"bodyImageUrl"`
	}

	var csvRows []QuestionCSV
	if err := gocsv.Unmarshal(f, &csvRows); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse CSV: " + err.Error()})
		return
	}

	successCount := 0
	for _, row := range csvRows {
		qType := strings.ToLower(row.Type)
		if qType == "1" || qType == "mcq" {
			qType = "mcq"
		} else if qType == "2" || qType == "theory" {
			qType = "theory"
		}

		var bodyImg *string
		if row.BodyImageUrl != "" {
			img := row.BodyImageUrl
			bodyImg = &img
		}

		// Create local copies to avoid pointer to loop variable issues
		yearVal := row.Year
		explVal := row.Explanation

		targetTopicID := row.TopicID
		if targetTopicID == 0 && row.Exam != "" && row.Subject != "" && row.Topic != "" {
			targetTopicID = h.resolveTopicID(row.Exam, row.Subject, row.Topic)
		}

		if targetTopicID == 0 {
			continue
		}

		q := models.Question{
			ID:                  uuid.New().String(),
			TopicID:             targetTopicID,
			BodyText:            row.BodyText,
			BodyImageUrl:        bodyImg,
			Type:                qType,
			Difficulty:          strings.ToLower(row.Difficulty),
			Status:              "published",
			Year:                &yearVal,
			ExplanationStandard: &explVal,
		}

		if err := database.DB.Create(&q).Error; err != nil {
			continue
		}
		successCount++

		if qType == "mcq" {
			opts := []string{row.OptionA, row.OptionB, row.OptionC, row.OptionD}
			for i, text := range opts {
				if text == "" {
					continue
				}
				isCorrect := false
				correctOpt := strings.ToUpper(strings.TrimSpace(row.Correct))
				if (i == 0 && correctOpt == "A") || (i == 1 && correctOpt == "B") || (i == 2 && correctOpt == "C") || (i == 3 && correctOpt == "D") {
					isCorrect = true
				}
				database.DB.Create(&models.QuestionOption{
					ID:         uuid.New().String(),
					QuestionID: q.ID,
					OptionText: text,
					IsCorrect:  isCorrect,
					OrderIndex: i,
				})
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Uploaded %d questions", successCount)})
}

// Stats & Overview
func (h *AdminHandler) GetOverview(c *gin.Context) {
	now := time.Now()
	yesterday := now.Add(-24 * time.Hour)
	firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	var totalUsers int64
	database.DB.Model(&models.User{}).Count(&totalUsers)

	var newUsers24h int64
	database.DB.Model(&models.User{}).Where("created_at >= ?", yesterday).Count(&newUsers24h)

	var revenueMTD int64
	// Use Coalesce to handle NULL sum for new databases
	database.DB.Model(&models.Purchase{}).Where("status = ? AND created_at >= ?", "success", firstOfMonth).Select("COALESCE(SUM(amount_ngn), 0)").Row().Scan(&revenueMTD)

	var activeBattles int64
	database.DB.Model(&models.Battle{}).Where("status = ?", "active").Count(&activeBattles)

	type ActivityResult struct {
		User   string    `json:"user"`
		Action string    `json:"action"`
		Time   time.Time `json:"time"`
		Status string    `json:"status"`
		Img    string    `json:"img"`
	}
	var activities []ActivityResult

	// 1. Get Recent Answer Activity
	var answers []ActivityResult
	database.DB.Table("user_answers").
		Select("users.name as user, 'Answered Question' as action, user_answers.answered_at as time, CASE WHEN is_correct = 1 THEN 'Correct' ELSE 'Wrong' END as status, 'https://ui-avatars.com/api/?name=' || users.name as img").
		Joins("JOIN users ON user_answers.user_id = users.id").
		Order("user_answers.answered_at desc").
		Limit(5).
		Find(&answers)
	activities = append(activities, answers...)

	// 2. Get Recent Registrations
	var registrations []ActivityResult
	database.DB.Table("users").
		Select("users.name as user, 'Joined ResultPRO' as action, users.created_at as time, 'New Student' as status, 'https://ui-avatars.com/api/?name=' || users.name as img").
		Order("users.created_at desc").
		Limit(5).
		Find(&registrations)
	activities = append(activities, registrations...)

	// 3. Get Recent Purchases
	var purchases []ActivityResult
	database.DB.Table("purchases").
		Select("users.name as user, 'Purchased ' || pack_name as action, purchases.created_at as time, 'Success' as status, 'https://ui-avatars.com/api/?name=' || users.name as img").
		Joins("JOIN users ON purchases.user_id = users.id").
		Where("purchases.status = ?", "success").
		Order("purchases.created_at desc").
		Limit(5).
		Find(&purchases)
	activities = append(activities, purchases...)

	// Sort unified activities by time desc
	sort.Slice(activities, func(i, j int) bool {
		return activities[i].Time.After(activities[j].Time)
	})

	if len(activities) > 10 {
		activities = activities[:10]
	}

	// Format Revenue nicely
	revenueFormatted := fmt.Sprintf("₦%d", revenueMTD)
	if revenueMTD > 1000000 {
		revenueFormatted = fmt.Sprintf("₦%.1fM", float64(revenueMTD)/1000000.0)
	} else if revenueMTD > 1000 {
		revenueFormatted = fmt.Sprintf("₦%.1fK", float64(revenueMTD)/1000.0)
	}

	// 4. Get Growth Analytics (Last 7 Days)
	type ChartData struct {
		Day   string `json:"day"`
		Value int64  `json:"value"`
	}
	var revenueGrowth []ChartData
	var userGrowth []ChartData

	sevenDaysAgo := now.AddDate(0, 0, -6)

	// Revenue by day (Last 7 days)
	database.DB.Table("purchases").
		Select("strftime('%m/%d', created_at) as day, COALESCE(SUM(amount_ngn), 0) as value").
		Where("status = ? AND created_at >= ?", "success", sevenDaysAgo).
		Group("day").
		Order("created_at asc").
		Find(&revenueGrowth)

	// Users by day (Last 7 days)
	database.DB.Table("users").
		Select("strftime('%m/%d', created_at) as day, COUNT(*) as value").
		Where("created_at >= ?", sevenDaysAgo).
		Group("day").
		Order("created_at asc").
		Find(&userGrowth)

	c.JSON(http.StatusOK, gin.H{
		"kpis": []gin.H{
			{"label": "Total Students", "value": strconv.FormatInt(totalUsers, 10), "trend": "Active", "up": true},
			{"label": "New (24h)", "value": strconv.FormatInt(newUsers24h, 10), "trend": "+New", "up": true},
			{"label": "Revenue (MTD)", "value": revenueFormatted, "trend": "Gross", "up": true},
			{"label": "Active Battles", "value": strconv.FormatInt(activeBattles, 10), "trend": "Live", "up": true},
		},
		"activity":      activities,
		"revenueGrowth": revenueGrowth,
		"userGrowth":    userGrowth,
	})
}

// Coin Packs
func (h *AdminHandler) GetCoinPacks(c *gin.Context) {
	var packs []models.CoinPack
	database.DB.Order("price asc").Find(&packs)
	c.JSON(http.StatusOK, packs)
}

func (h *AdminHandler) CreateCoinPack(c *gin.Context) {
	var pack models.CoinPack
	if err := c.ShouldBindJSON(&pack); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pack.ID = uuid.New().String()
	database.DB.Create(&pack)
	c.JSON(http.StatusCreated, pack)
}

func (h *AdminHandler) UpdateCoinPack(c *gin.Context) {
	id := c.Param("id")
	var input map[string]interface{}
	c.ShouldBindJSON(&input)
	database.DB.Model(&models.CoinPack{}).Where("id = ?", id).Updates(input)
	c.JSON(http.StatusOK, gin.H{"message": "Coin pack updated"})
}

func (h *AdminHandler) DeleteCoinPack(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.CoinPack{}, "id = ?", id)
	c.JSON(http.StatusOK, gin.H{"message": "Coin pack deleted"})
}

// Helpers
func slugify(s string) string {
	s = strings.ToLower(s)
	reg, _ := regexp.Compile("[^a-z0-9]+")
	s = reg.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

func (h *AdminHandler) GetReferralStats(c *gin.Context) {
	var totalReferrals int64
	database.DB.Model(&models.Referral{}).Count(&totalReferrals)

	var convertedReferrals int64
	database.DB.Model(&models.Referral{}).Where("status = ?", "converted").Count(&convertedReferrals)

	var pendingReferrals int64
	database.DB.Model(&models.Referral{}).Where("status = ?", "pending").Count(&pendingReferrals)

	var totalCoinsAwarded int64
	database.DB.Model(&models.Referral{}).Select("COALESCE(SUM(coins_awarded), 0)").Row().Scan(&totalCoinsAwarded)

	// Top Referrers
	type TopReferrer struct {
		Name         *string `json:"name"`
		Email        string  `json:"email"`
		ReferralCode string  `json:"referralCode"`
		Count        int     `json:"_count"`
		TotalEarned  int     `json:"totalEarned"`
	}
	var topReferrers []TopReferrer
	database.DB.Table("referrals").
		Select("users.name, users.email, users.referral_code, COUNT(referrals.id) as count, SUM(referrals.coins_awarded) as total_earned").
		Joins("JOIN users ON referrals.referrer_id = users.id").
		Group("users.id").
		Order("count DESC").
		Limit(10).
		Scan(&topReferrers)

	// Transform for frontend _count object if needed, but our select does it flat
	// Let's adjust to match the frontend expectation of ref._count.referralsMade
	type TopReferrerFormatted struct {
		Name         *string `json:"name"`
		Email        string  `json:"email"`
		ReferralCode string  `json:"referralCode"`
		CountObj     struct {
			ReferralsMade int `json:"referralsMade"`
		} `json:"_count"`
		TotalEarned int `json:"totalEarned"`
	}
	formattedTop := []TopReferrerFormatted{}
	for _, tr := range topReferrers {
		f := TopReferrerFormatted{
			Name:         tr.Name,
			Email:        tr.Email,
			ReferralCode: tr.ReferralCode,
			TotalEarned:  tr.TotalEarned,
		}
		f.CountObj.ReferralsMade = tr.Count
		formattedTop = append(formattedTop, f)
	}

	// Recent Referrals
	var recentReferrals []models.Referral
	database.DB.Preload("Referee").Preload("Referee"). // Note: Referral model needs Referrer field to preload correctly
		Order("created_at desc").Limit(10).Find(&recentReferrals)

	// Let's check models.Referral - it only has Referee.
	// I'll update the logic to fetch Referrer as well.
	
	type RecentRef struct {
		ID        string    `json:"id"`
		Status    string    `json:"status"`
		CreatedAt time.Time `json:"createdAt"`
		Referrer  struct {
			Name  string `json:"name"`
			Email string `json:"email"`
		} `json:"referrer"`
		Referee struct {
			Name  string `json:"name"`
			Email string `json:"email"`
		} `json:"referee"`
	}
	
	var refs []models.Referral
	database.DB.Order("created_at desc").Limit(10).Find(&refs)
	
	recent := []RecentRef{}
	for _, r := range refs {
		var referrer, referee models.User
		database.DB.Where("id = ?", r.ReferrerID).First(&referrer)
		database.DB.Where("id = ?", r.RefereeID).First(&referee)
		
		item := RecentRef{
			ID:        r.ID,
			Status:    r.Status,
			CreatedAt: r.CreatedAt,
		}
		if referrer.Name != nil { item.Referrer.Name = *referrer.Name } else { item.Referrer.Name = referrer.Email }
		item.Referrer.Email = referrer.Email
		if referee.Name != nil { item.Referee.Name = *referee.Name } else { item.Referee.Name = referee.Email }
		item.Referee.Email = referee.Email
		
		recent = append(recent, item)
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": gin.H{
			"total":         totalReferrals,
			"converted":     convertedReferrals,
			"pending":       pendingReferrals,
			"coinsAwarded":  totalCoinsAwarded,
		},
		"topReferrers":    formattedTop,
		"recentReferrals": recent,
	})
}
func (h *AdminHandler) GetBattleMonitorStats(c *gin.Context) {
	var activeCount int64
	database.DB.Model(&models.Battle{}).Where("status = ?", "active").Count(&activeCount)

	var totalVolume int64
	database.DB.Model(&models.Battle{}).Where("status = ?", "completed").Select("COALESCE(SUM(stake_per_player * max_participants), 0)").Row().Scan(&totalVolume)

	var avgStake float64
	database.DB.Model(&models.Battle{}).Select("COALESCE(AVG(stake_per_player), 0)").Row().Scan(&avgStake)

	var pendingDisputes int64
	database.DB.Model(&models.Report{}).Where("status = ?", "pending").Count(&pendingDisputes)

	var activeBattles []models.Battle
	database.DB.Preload("Subject").Preload("Participants.User").Where("status = ?", "active").Limit(20).Find(&activeBattles)

	type BattleItem struct {
		ID       string `json:"id"`
		P1       string `json:"p1"`
		P2       string `json:"p2"`
		Subject  string `json:"subject"`
		Stake    int    `json:"stake"`
		Progress string `json:"progress"`
		Time     string `json:"time"`
		Status   string `json:"status"`
	}

	formattedBattles := []BattleItem{}
	for _, b := range activeBattles {
		p1Name := "Waiting..."
		p2Name := "Waiting..."
		
		maxProgress := 0
		if len(b.Participants) > 0 {
			if b.Participants[0].User.Name != nil { p1Name = *b.Participants[0].User.Name } else { p1Name = b.Participants[0].User.Email }
			if b.Participants[0].Progress > maxProgress { maxProgress = b.Participants[0].Progress }
		}
		if len(b.Participants) > 1 {
			if b.Participants[1].User.Name != nil { p2Name = *b.Participants[1].User.Name } else { p2Name = b.Participants[1].User.Email }
			if b.Participants[1].Progress > maxProgress { maxProgress = b.Participants[1].Progress }
		}

		subjName := "Unknown"
		if b.Subject != nil {
			subjName = b.Subject.Name
		}

		durationStr := "0m"
		if b.StartedAt != nil {
			mins := int(time.Since(*b.StartedAt).Minutes())
			durationStr = fmt.Sprintf("%dm", mins)
		}

		formattedBattles = append(formattedBattles, BattleItem{
			ID:       b.ID[:8],
			P1:       p1Name,
			P2:       p2Name,
			Subject:  subjName,
			Stake:    b.StakePerPlayer,
			Progress: fmt.Sprintf("%d/%d", maxProgress, b.QuestionCount),
			Time:     durationStr,
			Status:   b.Status,
		})
	}

	// Real Peak activity heatmap (last 28 hours)
	heatmap := make([]float64, 28)
	var battleCounts []struct {
		Hour  int
		Count int64
	}
	cutoff := time.Now().Add(-28 * time.Hour)
	// SQLite specific grouping by hour from now
	database.DB.Model(&models.Battle{}).
		Select("CAST((julianday('now') - julianday(created_at)) * 24 AS INTEGER) as hour, COUNT(*) as count").
		Where("created_at >= ?", cutoff).
		Group("hour").
		Find(&battleCounts)
	
	maxHeatCount := int64(0)
	for _, bc := range battleCounts {
		if bc.Hour >= 0 && bc.Hour < 28 {
			if bc.Count > maxHeatCount { maxHeatCount = bc.Count }
			heatmap[27-bc.Hour] = float64(bc.Count)
		}
	}
	// Normalize heatmap to 0.1 - 1.0 range for UI opacity
	if maxHeatCount > 0 {
		for i := range heatmap {
			if heatmap[i] > 0 {
				heatmap[i] = 0.2 + (0.8 * (heatmap[i] / float64(maxHeatCount)))
			} else {
				heatmap[i] = 0.1
			}
		}
	} else {
		for i := range heatmap { heatmap[i] = 0.1 }
	}

	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"activeCount": activeCount,
			"totalVolume": totalVolume,
			"avgStake":    int(avgStake),
			"disputes":    pendingDisputes,
		},
		"activeBattles": formattedBattles,
		"heatmap":       heatmap,
	})
}
func (h *AdminHandler) GetFinancialStats(c *gin.Context) {
	now := time.Now()
	firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	var mtdRevenue int64
	database.DB.Model(&models.Purchase{}).Where("status = ? AND created_at >= ?", "success", firstOfMonth).Select("COALESCE(SUM(amount_ngn), 0)").Row().Scan(&mtdRevenue)

	var avgTransaction float64
	database.DB.Model(&models.Purchase{}).Where("status = ?", "success").Select("COALESCE(AVG(amount_ngn), 0)").Row().Scan(&avgTransaction)

	var pendingPayouts int64
	database.DB.Model(&models.Withdrawal{}).Where("status = ?", "pending").Select("COALESCE(SUM(amount_ngn), 0)").Row().Scan(&pendingPayouts)

	var purchases []models.Purchase
	database.DB.Preload("User").Order("created_at desc").Limit(50).Find(&purchases)

	type TransactionItem struct {
		ID     string    `json:"id"`
		User   string    `json:"user"`
		Amount string    `json:"amount"`
		Type   string    `json:"type"`
		Method string    `json:"method"`
		Status string    `json:"status"`
		Date   time.Time `json:"date"`
	}

	transactions := []TransactionItem{}
	for _, p := range purchases {
		userName := "Unknown"
		if p.User.Name != nil {
			userName = *p.User.Name
		} else {
			userName = p.User.Email
		}

		status := "Success"
		if p.Status == "pending" {
			status = "Pending"
		} else if p.Status == "failed" {
			status = "Failed"
		}

		transactions = append(transactions, TransactionItem{
			ID:     p.ID,
			User:   userName,
			Amount: fmt.Sprintf("₦%d", p.AmountNgn),
			Type:   p.PackName,
			Method: "Paystack",
			Status: status,
			Date:   p.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": gin.H{
			"mtdRevenue":     mtdRevenue,
			"avgTransaction": int(avgTransaction),
			"pendingPayouts": pendingPayouts,
		},
		"transactions": transactions,
	})
}
func (h *AdminHandler) GetAnalyticsStats(c *gin.Context) {
	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	startOfWeek := startOfDay.AddDate(0, 0, -6)

	var totalUsers int64
	database.DB.Model(&models.User{}).Count(&totalUsers)

	var questionsToday int64
	database.DB.Model(&models.UserAnswer{}).Where("answered_at >= ?", startOfDay).Count(&questionsToday)

	var aiExplanations int64
	database.DB.Model(&models.ChatMessage{}).Where("role = ?", "assistant").Count(&aiExplanations)

	type SessionRange struct {
		MinTime time.Time
		MaxTime time.Time
	}
	var sessionRanges []SessionRange
	database.DB.Model(&models.UserAnswer{}).
		Select("MIN(answered_at) as min_time, MAX(answered_at) as max_time").
		Group("session_id").
		Having("COUNT(*) > 1").
		Find(&sessionRanges)

	var totalDuration float64
	sessionCount := 0
	for _, sr := range sessionRanges {
		dur := sr.MaxTime.Sub(sr.MinTime).Minutes()
		totalDuration += dur
		sessionCount++
	}
	avgSessionStr := "0m 0s"
	if sessionCount > 0 {
		avgMins := totalDuration / float64(sessionCount)
		mins := int(avgMins)
		secs := int((avgMins - float64(mins)) * 60)
		avgSessionStr = fmt.Sprintf("%dm %ds", mins, secs)
	}

	type DailyEngagement struct {
		DateStr string `gorm:"column:date_str"`
		Total   int    `gorm:"column:total"`
		Correct int    `gorm:"column:correct"`
	}
	var dailyData []DailyEngagement
	database.DB.Table("user_answers").
		Select("DATE(answered_at) as date_str, COUNT(*) as total, SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct").
		Where("answered_at >= ?", startOfWeek).
		Group("DATE(answered_at)").
		Order("date_str ASC").
		Find(&dailyData)

	engagementMetrics := []gin.H{}
	dataMap := make(map[string]DailyEngagement)
	for _, d := range dailyData {
		dataMap[d.DateStr] = d
	}

	for i := 0; i < 7; i++ {
		d := startOfWeek.AddDate(0, 0, i)
		dStr := d.Format("2006-01-02")
		label := d.Format("Mon")
		
		total := 0
		correct := 0
		pct := 0
		
		if stat, ok := dataMap[dStr]; ok {
			total = stat.Total
			correct = stat.Correct
			if total > 0 {
				pct = (correct * 100) / total
			}
		}
		
		engagementMetrics = append(engagementMetrics, gin.H{
			"label": label,
			"total": total,
			"correct": correct,
			"percentage": pct,
		})
	}

	type SubjectStat struct {
		Name  string
		Count int
	}
	var subjStats []SubjectStat
	database.DB.Table("user_answers").
		Select("subjects.name as name, COUNT(user_answers.id) as count").
		Joins("JOIN questions ON user_answers.question_id = questions.id").
		Joins("JOIN topics ON questions.topic_id = topics.id").
		Joins("JOIN subjects ON topics.subject_id = subjects.id").
		Group("subjects.id, subjects.name").
		Order("count DESC").
		Limit(4).
		Find(&subjStats)

	totalRanked := 0
	for _, s := range subjStats {
		totalRanked += s.Count
	}

	popularSubjects := []gin.H{}
	colors := []string{"bg-green", "bg-blue-500", "bg-purple-500", "bg-amber"}
	for i, s := range subjStats {
		pct := 0
		if totalRanked > 0 {
			pct = (s.Count * 100) / totalRanked
		}
		color := "bg-blue-500"
		if i < len(colors) {
			color = colors[i]
		}
		popularSubjects = append(popularSubjects, gin.H{
			"name": s.Name,
			"count": s.Count,
			"percentage": pct,
			"color": color,
		})
	}

	var referralUsers int64
	database.DB.Model(&models.User{}).Where("referred_by IS NOT NULL").Count(&referralUsers)

	var organicPct, referralPct int
	if totalUsers > 0 {
		referralPct = int((referralUsers * 100) / totalUsers)
		organicPct = 100 - referralPct
	}

	socialPct := 0
	otherPct := 0
	if organicPct > 20 {
		socialPct = 10
		otherPct = organicPct % 5
		organicPct = organicPct - socialPct - otherPct
	} else if organicPct == 0 && referralPct == 0 {
		// fallback to defaults if no users
		organicPct = 100
	}

	c.JSON(200, gin.H{
		"engagement":      engagementMetrics,
		"popularSubjects": popularSubjects,
		"stats": gin.H{
			"avgSessionTime": avgSessionStr,
			"questionsToday": questionsToday,
			"aiExplanations": aiExplanations,
			"totalUsers":     totalUsers,
		},
		"acquisition": []int{organicPct, referralPct, socialPct, otherPct},
	})
}
func (h *AdminHandler) AssistCreateQuestion(c *gin.Context) { c.JSON(200, gin.H{"stats": "ok"}) }

// Notifications
func (h *AdminHandler) GetNotificationLogs(c *gin.Context) {
	logs := []models.NotificationLog{}
	database.DB.Order("created_at desc").Limit(100).Find(&logs)
	c.JSON(http.StatusOK, logs)
}

func (h *AdminHandler) GetNotificationCampaigns(c *gin.Context) {
	campaigns := []models.NotificationCampaign{}
	database.DB.Order("created_at desc").Find(&campaigns)
	c.JSON(http.StatusOK, campaigns)
}

func (h *AdminHandler) CreateCampaign(c *gin.Context) {
	var input struct {
		Title        string                   `json:"title" binding:"required"`
		Message      string                   `json:"message" binding:"required"`
		Type         models.NotificationType  `json:"type" binding:"required"`
		Route        models.NotificationRoute `json:"route" binding:"required"`
		Target       string                   `json:"target" binding:"required"` // all, pro, free, individual, exam
		TargetValue  string                   `json:"targetValue"`              // userId
		TargetExamID *int                     `json:"targetExamId"`             // examId
		IsPopup      bool                     `json:"isPopup"`
		DisplayPages string                   `json:"displayPages"`
		ScheduledAt  *time.Time               `json:"scheduledAt"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	campaign := models.NotificationCampaign{
		ID:           uuid.New().String(),
		Title:        input.Title,
		Message:      input.Message,
		Type:         input.Type,
		Route:        input.Route,
		Target:       input.Target,
		TargetValue:  &input.TargetValue,
		TargetExamID: input.TargetExamID,
		IsPopup:      input.IsPopup,
		DisplayPages: &input.DisplayPages,
		Status:       "pending",
		ScheduledAt:  input.ScheduledAt,
	}

	if err := database.DB.Create(&campaign).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create campaign"})
		return
	}

	// If it's a popup and scheduled for now, also create the PopupNotification record
	if campaign.IsPopup && (campaign.ScheduledAt == nil || campaign.ScheduledAt.Before(time.Now())) {
		h.CreatePopupFromCampaign(&campaign)
	}

	// If it's not scheduled (or scheduled for now/past), process it immediately
	if campaign.ScheduledAt == nil || campaign.ScheduledAt.Before(time.Now()) {
		go h.ProcessCampaign(&campaign)
	}

	c.JSON(http.StatusCreated, campaign)
}

func (h *AdminHandler) CreatePopupFromCampaign(campaign *models.NotificationCampaign) {
	popup := models.PopupNotification{
		ID:           uuid.New().String(),
		Title:        campaign.Title,
		Message:      campaign.Message,
		Type:         campaign.Type,
		DisplayPages: "*",
		TargetExamID: campaign.TargetExamID,
		IsActive:     true,
		StartTime:    campaign.ScheduledAt,
	}
	if campaign.DisplayPages != nil && *campaign.DisplayPages != "" {
		popup.DisplayPages = *campaign.DisplayPages
	}
	database.DB.Create(&popup)
}

func (h *AdminHandler) ProcessCampaign(campaign *models.NotificationCampaign) {
	database.DB.Model(campaign).Update("status", "processing")

	var users []models.User
	tx := database.DB.Model(&models.User{})

	switch campaign.Target {
	case "all":
		// no filter
	case "pro":
		tx = tx.Where("is_premium = ?", true)
	case "free":
		tx = tx.Where("is_premium = ?", false)
	case "individual":
		if campaign.TargetValue != nil {
			tx = tx.Where("id = ?", *campaign.TargetValue)
		}
	case "exam":
		if campaign.TargetExamID != nil {
			// Find users who have answered questions in this exam
			var userIDs []string
			database.DB.Table("user_answers").
				Joins("JOIN questions ON user_answers.question_id = questions.id").
				Joins("JOIN topics ON questions.topic_id = topics.id").
				Joins("JOIN subjects ON topics.subject_id = subjects.id").
				Where("subjects.exam_id = ?", *campaign.TargetExamID).
				Distinct("user_answers.user_id").
				Pluck("user_id", &userIDs)
			
			tx = tx.Where("id IN ?", userIDs)
		}
	}

	tx.Find(&users)

	for _, user := range users {
		utils.SendNotification(user.ID, campaign.Title, campaign.Message, campaign.Type, campaign.Route)
	}

	database.DB.Model(campaign).Update("status", "completed")
}

// Popups
func (h *AdminHandler) GetPopups(c *gin.Context) {
	popups := []models.PopupNotification{}
	database.DB.Order("created_at desc").Find(&popups)
	c.JSON(http.StatusOK, popups)
}

func (h *AdminHandler) CreatePopup(c *gin.Context) {
	var popup models.PopupNotification
	if err := c.ShouldBindJSON(&popup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	popup.ID = uuid.New().String()
	database.DB.Create(&popup)
	c.JSON(http.StatusCreated, popup)
}

func (h *AdminHandler) UpdatePopup(c *gin.Context) {
	id := c.Param("id")
	var input map[string]interface{}
	c.ShouldBindJSON(&input)
	database.DB.Model(&models.PopupNotification{}).Where("id = ?", id).Updates(input)
	c.JSON(http.StatusOK, gin.H{"message": "Popup updated"})
}

func (h *AdminHandler) DeletePopup(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.PopupNotification{}, "id = ?", id)
	c.JSON(http.StatusOK, gin.H{"message": "Popup deleted"})
}

func (h *AdminHandler) resolveTopicID(examName, subjectName, topicName string) int {
	if examName == "" || subjectName == "" || topicName == "" {
		return 0
	}

	var exam models.Exam
	if err := database.DB.Where("name LIKE ?", examName).First(&exam).Error; err != nil {
		exam = models.Exam{
			Name:     examName,
			Slug:     slugify(examName),
			Category: "General",
			IsActive: true,
		}
		database.DB.Create(&exam)
	}

	var subject models.Subject
	if err := database.DB.Where("exam_id = ? AND name LIKE ?", exam.ID, subjectName).First(&subject).Error; err != nil {
		subject = models.Subject{
			ExamID: exam.ID,
			Name:   subjectName,
			Slug:   slugify(subjectName),
			Color:  "blue",
		}
		database.DB.Create(&subject)
	}

	var topic models.Topic
	if err := database.DB.Where("subject_id = ? AND name LIKE ?", subject.ID, topicName).First(&topic).Error; err != nil {
		var lastTopic models.Topic
		database.DB.Where("subject_id = ?", subject.ID).Order("order_index desc").First(&lastTopic)
		
		topic = models.Topic{
			SubjectID:  subject.ID,
			Name:       topicName,
			OrderIndex: lastTopic.OrderIndex + 1,
		}
		database.DB.Create(&topic)
	}

	return topic.ID
}

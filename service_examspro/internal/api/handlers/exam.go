package handlers

import (
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
	"encoding/csv"
	"fmt"
	"time"
	"log"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ExamHandler struct{}

func (h *ExamHandler) GetExams(c *gin.Context) {
	battleReadyOnly := c.Query("battleReady") == "true"

	var dbName string
	database.DB.Raw("PRAGMA database_list").Row().Scan(new(int), new(string), &dbName)
	log.Printf("GetExams using database file: %s", dbName)

	db := database.DB.Preload("Subjects").Where("is_active = ?", 1)
	if battleReadyOnly {
		db = db.Where("is_battle_ready = ?", true)
	}

	var exams []models.Exam
	if err := db.Find(&exams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exams"})
		return
	}

	log.Printf("GetExams found %d exams", len(exams))
	for _, e := range exams {
		log.Printf("Exam: %s (ID: %d), Subjects: %d", e.Name, e.ID, len(e.Subjects))
	}

	type ExamInfo struct {
		ID        string     `json:"id"`
		DbID      int        `json:"dbId"`
		Name      string     `json:"name"`
		Subjects  int        `json:"subjects"`
		YearRange string     `json:"yearRange"`
		ExamDate  *time.Time `json:"examDate"`
		IsPopular bool       `json:"isPopular"`
		IsCurated bool       `json:"isCurated"`
		IsActive  bool       `json:"isActive"`
		IsBattleReady bool   `json:"isBattleReady"`
	}

	type CategoryGroup struct {
		Name  string     `json:"name"`
		Exams []ExamInfo `json:"exams"`
	}

	categoriesMap := make(map[string]*CategoryGroup)

	for _, exam := range exams {
		if _, ok := categoriesMap[exam.Category]; !ok {
			categoriesMap[exam.Category] = &CategoryGroup{
				Name:  exam.Category,
				Exams: []ExamInfo{},
			}
		}

		categoriesMap[exam.Category].Exams = append(categoriesMap[exam.Category].Exams, ExamInfo{
			ID:        exam.Slug,
			DbID:      exam.ID,
			Name:      exam.Name,
			Subjects:  len(exam.Subjects),
			YearRange: exam.YearRange,
			ExamDate:  exam.ExamDate,
			IsPopular: exam.IsPopular,
			IsCurated: exam.IsCurated,
			IsActive:  exam.IsActive,
			IsBattleReady: exam.IsBattleReady,
		})
	}

	result := []*CategoryGroup{}
	for _, group := range categoriesMap {
		result = append(result, group)
	}

	c.JSON(http.StatusOK, result)
}

func (h *ExamHandler) GetSubjectsByExam(c *gin.Context) {
	examIdOrSlug := c.Param("examId")
	if examIdOrSlug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Exam ID or slug is required"})
		return
	}

	var exam models.Exam
	db := database.DB.Preload("Subjects.Topics")
	
	var err error
	if id, errConv := strconv.Atoi(examIdOrSlug); errConv == nil {
		err = db.First(&exam, id).Error
	} else {
		err = db.Where("slug = ?", examIdOrSlug).First(&exam).Error
	}

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exam not found", "details": err.Error()})
		return
	}

	userID, exists := c.Get("userId")

	type SimpleTopic struct {
		Name      string `json:"name"`
		Questions int    `json:"questions"`
	}

	type SubjectInfo struct {
		ID        int           `json:"id"`
		Slug      string        `json:"slug"`
		Name      string        `json:"name"`
		Questions int           `json:"questions"`
		Completed int           `json:"completed"`
		Color     string        `json:"color"`
		Reward    int           `json:"reward"`
		Topics    []SimpleTopic `json:"topics"`
	}

	var allTopicIDs []int
	for _, subject := range exam.Subjects {
		for _, topic := range subject.Topics {
			allTopicIDs = append(allTopicIDs, topic.ID)
		}
	}

	type TopicStats struct {
		TopicID int
		Count   int
	}
	var topicStats []TopicStats
	if len(allTopicIDs) > 0 {
		database.DB.Model(&models.Question{}).Select("topic_id, count(*) as count").Where("topic_id IN ?", allTopicIDs).Group("topic_id").Scan(&topicStats)
	}

	topicCountMap := make(map[int]int)
	for _, ts := range topicStats {
		topicCountMap[ts.TopicID] = ts.Count
	}

	subjects := []SubjectInfo{}
	for _, subject := range exam.Subjects {
		var subjectTopics []SimpleTopic
		totalQuestions := 0
		for _, topic := range subject.Topics {
			tq := topicCountMap[topic.ID]
			totalQuestions += tq
			subjectTopics = append(subjectTopics, SimpleTopic{
				Name:      topic.Name,
				Questions: tq,
			})
		}

		completed := 0
		if exists && totalQuestions > 0 {
			var answeredCount int64
			database.DB.Model(&models.UserAnswer{}).
				Joins("JOIN questions ON questions.id = user_answers.question_id").
				Joins("JOIN topics ON topics.id = questions.topic_id").
				Where("user_answers.user_id = ? AND topics.subject_id = ? AND user_answers.is_correct = ?", userID, subject.ID, true).
				Count(&answeredCount)

			completed = int(math.Round((float64(answeredCount) / float64(totalQuestions)) * 100))
		}

		subjects = append(subjects, SubjectInfo{
			ID:        subject.ID,
			Slug:      subject.Slug,
			Name:      subject.Name,
			Questions: totalQuestions,
			Completed: completed,
			Color:     subject.Color,
			Reward:    10,
			Topics:    subjectTopics,
		})
	}

	// Calculate real percentile if user is logged in
	percentile := 0.0
	if exists {
		var totalUsersInExam int64
		database.DB.Table("user_answers").
			Joins("JOIN questions ON questions.id = user_answers.question_id").
			Joins("JOIN topics ON topics.id = questions.topic_id").
			Joins("JOIN subjects ON subjects.id = topics.subject_id").
			Where("subjects.exam_id = ?", exam.ID).
			Distinct("user_answers.user_id").
			Count(&totalUsersInExam)

		if totalUsersInExam > 0 {
			var myScore int64
			database.DB.Table("user_answers").
				Joins("JOIN questions ON questions.id = user_answers.question_id").
				Joins("JOIN topics ON topics.id = questions.topic_id").
				Joins("JOIN subjects ON subjects.id = topics.subject_id").
				Where("subjects.exam_id = ? AND user_answers.user_id = ? AND user_answers.is_correct = ?", exam.ID, userID, true).
				Count(&myScore)

			var usersWithLowerScore int64
			database.DB.Raw(`
				SELECT COUNT(*) FROM (
					SELECT user_id, COUNT(*) as score 
					FROM user_answers 
					JOIN questions ON questions.id = user_answers.question_id 
					JOIN topics ON topics.id = questions.topic_id 
					JOIN subjects ON subjects.id = topics.subject_id 
					WHERE subjects.exam_id = ? AND user_answers.is_correct = true
					GROUP BY user_id
					HAVING score < ?
				) AS scores`, exam.ID, myScore).Scan(&usersWithLowerScore)

			percentile = (float64(usersWithLowerScore) / float64(totalUsersInExam)) * 100
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"examName":   exam.Name,
		"subjects":   subjects,
		"percentile": percentile,
	})
}

func (h *ExamHandler) GetTopicsBySubject(c *gin.Context) {
	subjectIdStr := c.Param("subjectId")
	if subjectIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Subject ID is required"})
		return
	}

	var subject models.Subject
	if id, err := strconv.Atoi(subjectIdStr); err == nil {
		if err := database.DB.Where("id = ?", id).First(&subject).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
			return
		}
	} else {
		if err := database.DB.Where("slug = ?", subjectIdStr).First(&subject).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
			return
		}
	}

	var topics []models.Topic
	if err := database.DB.Where("subject_id = ?", subject.ID).Order("id asc").Find(&topics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics"})
		return
	}

	userID, exists := c.Get("userId")

	type TopicInfo struct {
		ID         int    `json:"id"`
		Name       string `json:"name"`
		Questions  int    `json:"questions"`
		Completed  bool   `json:"completed"`
		Active     bool   `json:"active"`
		Locked     bool   `json:"locked"`
		Difficulty      string  `json:"difficulty"`
		Reward          int     `json:"reward"`
		Mastery         int     `json:"mastery"`
		SyllabusContent *string `json:"syllabusContent"`
		AiLessonNotes   *string `json:"aiLessonNotes"`
	}

	type TopicAgg struct {
		TopicID       int
		Total         int
		HardCount     int
		MediumCount   int
		TotalReward   int
	}
	var topicAggs []TopicAgg
	database.DB.Model(&models.Question{}).
		Select("topic_id, count(*) as total, sum(case when difficulty='hard' then 1 else 0 end) as hard_count, sum(case when difficulty='medium' then 1 else 0 end) as medium_count, sum(coin_reward) as total_reward").
		Where("topic_id IN (SELECT id FROM topics WHERE subject_id = ?)", subject.ID).
		Group("topic_id").Scan(&topicAggs)

	topicAggMap := make(map[int]TopicAgg)
	for _, agg := range topicAggs {
		topicAggMap[agg.TopicID] = agg
	}

	formattedTopics := []TopicInfo{}
	for _, topic := range topics {
		agg := topicAggMap[topic.ID]
		totalQuestions := agg.Total
		completed := false
		mastery := 0
		active := false

		if exists && totalQuestions > 0 {
			var answers []models.UserAnswer
			database.DB.Joins("JOIN questions ON questions.id = user_answers.question_id").
				Where("user_answers.user_id = ? AND questions.topic_id = ?", userID, topic.ID).
				Find(&answers)

			correctCount := 0
			for _, a := range answers {
				if a.IsCorrect {
					correctCount++
				}
			}

			mastery = int(math.Round((float64(correctCount) / float64(totalQuestions)) * 100))
			completed = mastery >= 80
			active = len(answers) > 0 && mastery < 80
		}

		avgDifficulty := "Medium"
		if totalQuestions > 0 {
			if agg.HardCount > 0 {
				avgDifficulty = "Hard"
			} else if agg.MediumCount > 0 {
				avgDifficulty = "Medium"
			} else {
				avgDifficulty = "Easy"
			}
		}

		avgReward := 5
		if totalQuestions > 0 {
			avgReward = int(math.Round(float64(agg.TotalReward) / float64(totalQuestions)))
		}

		formattedTopics = append(formattedTopics, TopicInfo{
			ID:         topic.ID,
			Name:       topic.Name,
			Questions:  totalQuestions,
			Completed:  completed,
			Active:     active,
			Locked:     false,
			Difficulty:      avgDifficulty,
			Reward:          avgReward,
			Mastery:         mastery,
			SyllabusContent: topic.SyllabusContent,
			AiLessonNotes:   topic.AiLessonNotes,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"subjectName": subject.Name,
		"topics":      formattedTopics,
	})
}

func (h *ExamHandler) GetQuestionsBySubject(c *gin.Context) {
	subjectIdStr := c.Param("subjectId")
	if subjectIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Subject ID is required"})
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	var limit int
	if limitStr == "all" {
		limit = 1000
	} else {
		limit, _ = strconv.Atoi(limitStr)
		if limit <= 0 {
			limit = 10
		}
	}

	qType := c.Query("type")

	query := database.DB.Debug().Model(&models.Question{}).
		Preload("Options", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "question_id", "option_text", "order_index") // Hide IsCorrect
		}).
		Preload("Topic").Preload("Topic.Subject").Preload("Topic.Subject.Exam").
		Where("status = ?", "published")

	if qType != "" {
		query = query.Where("type = ?", qType)
	}

	if id, err := strconv.Atoi(subjectIdStr); err == nil {
		query = query.Where("topic_id IN (SELECT id FROM topics WHERE subject_id = ?)", id)
	} else {
		query = query.Where("topic_id IN (SELECT id FROM topics WHERE subject_id IN (SELECT id FROM subjects WHERE slug = ?))", subjectIdStr)
	}

	yearStr := c.Query("year")
	if yearStr != "" {
		if year, err := strconv.Atoi(yearStr); err == nil {
			query = query.Where("questions.year = ?", year)
		}
	}

	var questions []models.Question
	if err := query.Select("questions.*").Order("RANDOM()").Limit(limit).Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions"})
		return
	}

	log.Printf("GetQuestionsBySubject: subjectId=%s, year=%s, type=%s, limit=%d, found=%d", subjectIdStr, yearStr, qType, limit, len(questions))

	c.JSON(http.StatusOK, questions)
}

func (h *ExamHandler) GetFullSyllabus(c *gin.Context) {
	examIdOrSlug := c.Param("examId")
	if examIdOrSlug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Exam ID or slug is required"})
		return
	}

	var exam models.Exam
	query := database.DB.Preload("Subjects.Topics")

	if id, err := strconv.Atoi(examIdOrSlug); err == nil {
		if err := query.Where("id = ?", id).First(&exam).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Exam not found"})
			return
		}
	} else {
		if err := query.Where("slug = ?", examIdOrSlug).First(&exam).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Exam not found"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"exam": exam,
	})
}

func (h *ExamHandler) GetSubjectById(c *gin.Context) {
	idStr := c.Param("subjectId")
	var subject models.Subject
	if err := database.DB.Preload("Topics").Where("id = ? OR slug = ?", idStr, idStr).First(&subject).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
		return
	}

	// Normalize URL if it's relative (for old records)
	if subject.TextbookURL != nil && strings.HasPrefix(*subject.TextbookURL, "/uploads") {
		baseURL := os.Getenv("BACKEND_URL")
		if baseURL == "" {
			baseURL = "http://localhost:8080" // Fallback
		}
		normalized := baseURL + *subject.TextbookURL
		subject.TextbookURL = &normalized
	}

	c.JSON(http.StatusOK, subject)
}

func (h *ExamHandler) GetYearsBySubject(c *gin.Context) {
	subjectIdStr := c.Param("subjectId")
	userID, exists := c.Get("userId")

	var subject models.Subject
	if id, err := strconv.Atoi(subjectIdStr); err == nil {
		database.DB.Where("id = ?", id).First(&subject)
	} else {
		database.DB.Where("slug = ?", subjectIdStr).First(&subject)
	}

	if subject.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
		return
	}

	type YearStat struct {
		Year           int  `json:"year"`
		Questions      int  `json:"questions"`
		AnsweredCount  int  `json:"answeredCount"`
		IsCompleted    bool `json:"isCompleted"`
		Mastery        int  `json:"mastery"`
	}

	var rawStats []struct {
		Year int
		Total int
	}

	database.DB.Table("questions").
		Select("questions.year, count(*) as total").
		Joins("JOIN topics ON topics.id = questions.topic_id").
		Where("topics.subject_id = ? AND questions.year IS NOT NULL", subject.ID).
		Group("questions.year").
		Order("questions.year desc").
		Scan(&rawStats)

	var yearStats []YearStat
	totalMastery := 0

	for _, rs := range rawStats {
		answeredCount := int64(0)
		if exists {
			database.DB.Model(&models.UserAnswer{}).
				Joins("JOIN questions ON questions.id = user_answers.question_id").
				Joins("JOIN topics ON topics.id = questions.topic_id").
				Where("user_answers.user_id = ? AND topics.subject_id = ? AND questions.year = ? AND user_answers.is_correct = ?", userID, subject.ID, rs.Year, true).
				Count(&answeredCount)
		}

		mastery := 0
		if rs.Total > 0 {
			mastery = int(math.Round((float64(answeredCount) / float64(rs.Total)) * 100))
		}
		
		totalMastery += mastery

		yearStats = append(yearStats, YearStat{
			Year:          rs.Year,
			Questions:     rs.Total,
			AnsweredCount: int(answeredCount),
			IsCompleted:   mastery >= 80,
			Mastery:       mastery,
		})
	}

	readyPercent := 0
	if len(yearStats) > 0 {
		readyPercent = totalMastery / len(yearStats)
	}

	c.JSON(http.StatusOK, gin.H{
		"subjectName":  subject.Name,
		"years":         yearStats,
		"readyPercent": readyPercent,
	})
}

func (h *ExamHandler) DownloadSyllabusTemplate(c *gin.Context) {
	headers := "topic_id,exam,subject,topic,syllabus_content\n"
	content := "0,JAMB,Commerce,Introduction to Commerce,\"Commerce is the exchange of goods and services...\"\n"
	csv := headers + content

	c.Header("Content-Disposition", "attachment; filename=syllabus_template.csv")
	c.Data(http.StatusOK, "text/csv", []byte(csv))
}

func toSlug(s string) string {
	s = strings.ToLower(s)
	s = strings.ReplaceAll(s, " ", "-")
	return s
}

func (h *ExamHandler) ImportSyllabus(c *gin.Context) {
	// subjectID is not used in the refined auto-hierarchy import logic

	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	// Skip header
	if _, err := reader.Read(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read CSV header"})
		return
	}

	records, err := reader.ReadAll()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse CSV"})
		return
	}

	var createdCount, updatedCount, skippedCount int
	var errors []string

	for i, record := range records {
		if len(record) < 5 {
			errors = append(errors, fmt.Sprintf("Row %d: insufficient columns (min 5)", i+1))
			skippedCount++
			continue
		}

		topicID, _ := strconv.Atoi(strings.TrimSpace(record[0]))
		examName := strings.TrimSpace(record[1])
		subjectName := strings.TrimSpace(record[2])
		topicName := strings.TrimSpace(record[3])
		syllabusContent := strings.TrimSpace(record[4])

		if topicName == "" {
			continue
		}

		// 1. Resolve Hierarchy by Name and create if missing
		var exam models.Exam
		if err := database.DB.Where("name LIKE ?", examName).First(&exam).Error; err != nil {
			// Create Exam if not found
			exam = models.Exam{
				Name: examName,
				Slug: toSlug(examName),
				Category: "General",
				IsActive: true,
			}
			if err := database.DB.Create(&exam).Error; err != nil {
				errors = append(errors, fmt.Sprintf("Row %d: Failed to create exam '%s'", i+1, examName))
				skippedCount++
				continue
			}
		}

		var subject models.Subject
		if err := database.DB.Where("exam_id = ? AND name LIKE ?", exam.ID, subjectName).First(&subject).Error; err != nil {
			// Create Subject if not found
			subject = models.Subject{
				ExamID: exam.ID,
				Name:   subjectName,
				Slug:   toSlug(subjectName),
				Color:  "blue",
			}
			if err := database.DB.Create(&subject).Error; err != nil {
				errors = append(errors, fmt.Sprintf("Row %d: Failed to create subject '%s' for exam '%s'", i+1, subjectName, examName))
				skippedCount++
				continue
			}
		}

		targetSubjectID := subject.ID

		// 2. Resolve Topic
		var topic models.Topic
		isNewTopic := true

		// Check if we have a valid topicID to update
		if topicID > 0 {
			if err := database.DB.Where("id = ?", topicID).First(&topic).Error; err == nil {
				isNewTopic = false
			}
		}

		// If no topicID or topic not found by ID, try finding by name within this subject
		if isNewTopic {
			if err := database.DB.Where("subject_id = ? AND name = ?", targetSubjectID, topicName).First(&topic).Error; err == nil {
				isNewTopic = false
			}
		}

		// 3. Apply changes and Save/Create
		topic.Name = topicName
		topic.SyllabusContent = &syllabusContent
		topic.SubjectID = targetSubjectID

		if isNewTopic {
			// Find last order index for new topics
			var lastTopic models.Topic
			database.DB.Where("subject_id = ?", targetSubjectID).Order("order_index desc").First(&lastTopic)
			topic.OrderIndex = lastTopic.OrderIndex + 1
			
			if err := database.DB.Create(&topic).Error; err == nil {
				createdCount++
			} else {
				errors = append(errors, fmt.Sprintf("Row %d: Failed to create topic '%s'", i+1, topicName))
				skippedCount++
			}
		} else {
			if err := database.DB.Save(&topic).Error; err == nil {
				updatedCount++
			} else {
				errors = append(errors, fmt.Sprintf("Row %d: Failed to update topic '%s'", i+1, topicName))
				skippedCount++
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Import completed: %d created, %d updated, %d skipped", createdCount, updatedCount, skippedCount),
		"created": createdCount,
		"updated": updatedCount,
		"skipped": skippedCount,
		"errors":  errors,
	})
}


package handlers

import (
	"fmt"
	"net/http"
	"sort"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
)

type UserHandler struct{}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, _ := c.Get("userId")

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("userId")

	var input struct {
		Name               *string `json:"name"`
		Phone              *string `json:"phone"`
		EmailNotifications *bool   `json:"emailNotifications"`
		PushNotifications  *bool   `json:"pushNotifications"`
		TargetExams        *string `json:"targetExams"`
		IsPublic           *bool   `json:"isPublic"`
		TwoFactorEnabled   *bool   `json:"twoFactorEnabled"`
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

	if input.Name != nil {
		user.Name = input.Name
	}
	if input.Phone != nil {
		user.Phone = input.Phone
	}
	if input.EmailNotifications != nil {
		user.EmailNotifications = *input.EmailNotifications
	}
	if input.PushNotifications != nil {
		user.PushNotifications = *input.PushNotifications
	}
	if input.TargetExams != nil {
		user.TargetExams = *input.TargetExams
	}
	if input.IsPublic != nil {
		user.IsPublic = *input.IsPublic
	}
	if input.TwoFactorEnabled != nil {
		user.TwoFactorEnabled = *input.TwoFactorEnabled
	}

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	// Fetch fresh user to ensure all fields are correctly returned
	database.DB.Where("id = ?", userID).First(&user)

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) GetCoinHistory(c *gin.Context) {
	userID, _ := c.Get("userId")

	var history []models.CoinTransaction
	if err := database.DB.Where("user_id = ?", userID).Order("created_at desc").Limit(50).Find(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch coin history"})
		return
	}

	c.JSON(http.StatusOK, history)
}

func (h *UserHandler) GetReferrals(c *gin.Context) {
	userID, _ := c.Get("userId")

	var referrals []models.Referral
	if err := database.DB.Preload("Referee").Where("referrer_id = ?", userID).Order("created_at desc").Find(&referrals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch referrals"})
		return
	}

	c.JSON(http.StatusOK, referrals)
}

func (h *UserHandler) GetLeaderboard(c *gin.Context) {
	leaderboardType := c.DefaultQuery("type", "elo")
	
	var users []models.User
	var order string
	
	switch leaderboardType {
	case "coins":
		order = "coin_balance desc"
	case "streak":
		order = "streak_current desc"
	default:
		order = "elo_rating desc"
	}

	if err := database.DB.Select("id, name, elo_rating, coin_balance, streak_current").
		Where("is_banned = ?", false).
		Order(order).
		Limit(100).
		Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaderboard"})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) GetRank(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user models.User
	if err := database.DB.Select("id, name, elo_rating, coin_balance, streak_current").Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var rank int64
	err := database.DB.Model(&models.User{}).Where("is_banned = ? AND elo_rating > ?", false, user.EloRating).Count(&rank).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate rank"})
		return
	}

	myRank := rank + 1

	var nextUser models.User
	gap := 0
	if err := database.DB.Where("is_banned = ? AND elo_rating > ?", false, user.EloRating).Order("elo_rating asc").First(&nextUser).Error; err == nil {
		gap = nextUser.EloRating - user.EloRating
	}

	c.JSON(http.StatusOK, gin.H{
		"rank":        myRank,
		"nextRankGap": gap,
		"user":        user,
	})
}

func (h *UserHandler) GetDashboard(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var leaderboard []models.User
	database.DB.Select("id, name, email, elo_rating").
		Where("is_banned = ?", false).
		Order("elo_rating desc").
		Limit(5).
		Find(&leaderboard)

	var leaderboardData []gin.H
	for i, u := range leaderboard {
		name := "Anonymous"
		if u.Name != nil && *u.Name != "" {
			name = *u.Name
		} else if u.Email != "" {
			name = u.Email
		}
		leaderboardData = append(leaderboardData, gin.H{
			"name":  name,
			"score": u.EloRating,
			"rank":  i + 1,
			"img":   "https://i.pravatar.cc/150?u=" + u.ID,
		})
	}

	name := "Student"
	if user.Name != nil && *user.Name != "" {
		name = *user.Name
	}

	// Dynamic Database Logic
	var target string = "General Exam"
	var daysToGo int = 45

	// 1. Fetch Subjects the user has actually practiced
	var practicedSubjectIDs []int
	database.DB.Model(&models.UserAnswer{}).
		Joins("JOIN questions ON questions.id = user_answers.question_id").
		Joins("JOIN topics ON topics.id = questions.topic_id").
		Where("user_answers.user_id = ?", userID).
		Distinct("topics.subject_id").
		Pluck("topics.subject_id", &practicedSubjectIDs)

	var subjectStats []gin.H
	var practicedExamsMap = make(map[int]bool)

	if len(practicedSubjectIDs) > 0 {
		var subjects []models.Subject
		database.DB.Where("id IN ?", practicedSubjectIDs).Find(&subjects)

		for _, sub := range subjects {
			practicedExamsMap[sub.ExamID] = true
			
			var totalQuestions int64
			database.DB.Model(&models.Question{}).
				Joins("JOIN topics ON topics.id = questions.topic_id").
				Where("topics.subject_id = ?", sub.ID).
				Count(&totalQuestions)

			var correctAnswers int64
			database.DB.Model(&models.UserAnswer{}).
				Joins("JOIN questions ON questions.id = user_answers.question_id").
				Joins("JOIN topics ON topics.id = questions.topic_id").
				Where("user_answers.user_id = ? AND topics.subject_id = ? AND user_answers.is_correct = ?", userID, sub.ID, true).
				Count(&correctAnswers)

			progress := 0
			if totalQuestions > 0 {
				progress = int((float64(correctAnswers) / float64(totalQuestions)) * 100)
			}

			subjectStats = append(subjectStats, gin.H{
				"id":        sub.ID,
				"name":      sub.Name,
				"progress":  progress,
				"color":     sub.Color,
				"questions": totalQuestions,
			})
		}
	} else {
		subjectStats = make([]gin.H, 0)
	}

	// 2. Fetch Exams the user has practiced and calculate Readiness %
	var examStats []gin.H
	if len(practicedExamsMap) > 0 {
		var practicedExamIDs []int
		for id := range practicedExamsMap {
			practicedExamIDs = append(practicedExamIDs, id)
		}

		var exams []models.Exam
		database.DB.Where("id IN ?", practicedExamIDs).Find(&exams)

		for _, ex := range exams {
			// Calculate Total Questions in Exam
			var exTotalQuestions int64
			database.DB.Model(&models.Question{}).
				Joins("JOIN topics ON topics.id = questions.topic_id").
				Joins("JOIN subjects ON subjects.id = topics.subject_id").
				Where("subjects.exam_id = ?", ex.ID).
				Count(&exTotalQuestions)

			// Calculate Total Correct Answers in Exam
			var exCorrectAnswers int64
			database.DB.Model(&models.UserAnswer{}).
				Joins("JOIN questions ON questions.id = user_answers.question_id").
				Joins("JOIN topics ON topics.id = questions.topic_id").
				Joins("JOIN subjects ON subjects.id = topics.subject_id").
				Where("user_answers.user_id = ? AND subjects.exam_id = ? AND user_answers.is_correct = ?", userID, ex.ID, true).
				Count(&exCorrectAnswers)

			readiness := 0
			if exTotalQuestions > 0 {
				readiness = int((float64(exCorrectAnswers) / float64(exTotalQuestions)) * 100)
			}

			examStats = append(examStats, gin.H{
				"id":        ex.ID,
				"slug":      ex.Slug,
				"name":      ex.Name,
				"readiness": readiness,
				"category":  ex.Category,
			})
			
			// Set target to the most recent/relevant exam
			target = ex.Name
			if ex.ExamDate != nil {
				diff := time.Until(*ex.ExamDate)
				daysToGo = int(diff.Hours() / 24)
				if daysToGo < 0 {
					daysToGo = 0
				}
			}
		}
	} else {
		examStats = make([]gin.H, 0)
		// Fallback target if none practiced
		var firstExam models.Exam
		if err := database.DB.Where("is_active = ?", true).First(&firstExam).Error; err == nil {
			target = firstExam.Name
			if firstExam.ExamDate != nil {
				diff := time.Until(*firstExam.ExamDate)
				daysToGo = int(diff.Hours() / 24)
				if daysToGo < 0 {
					daysToGo = 0
				}
			}
		}
	}

	// 3. Recent Activity (Unified Feed)
	var recentActivity []gin.H

	// A. Recent Study Activity
	var recentAnswers []models.UserAnswer
	database.DB.Preload("Question.Topic.Subject").
		Where("user_id = ?", userID).
		Order("answered_at desc").
		Limit(5).
		Find(&recentAnswers)

	for _, ans := range recentAnswers {
		status := "Incorrect"
		if ans.IsCorrect {
			status = "Correct"
		}
		
		title := "Practice Session"
		if ans.Question != nil && ans.Question.Topic != nil && ans.Question.Topic.Subject != nil {
			title = fmt.Sprintf("Practiced %s", ans.Question.Topic.Subject.Name)
		}

		recentActivity = append(recentActivity, gin.H{
			"title":     title,
			"type":      "study",
			"status":    status,
			"timestamp": ans.AnsweredAt,
			"reward":    ans.CoinsEarned,
		})
	}

	// B. Recent Coin Transactions
	var recentCoins []models.CoinTransaction
	database.DB.Where("user_id = ?", userID).
		Order("created_at desc").
		Limit(5).
		Find(&recentCoins)

	for _, tx := range recentCoins {
		recentActivity = append(recentActivity, gin.H{
			"title":     tx.Type,
			"type":      "coins",
			"amount":    tx.Amount,
			"timestamp": tx.CreatedAt,
			"desc":      tx.Description,
		})
	}

	// Sort by timestamp
	sort.Slice(recentActivity, func(i, j int) bool {
		ti, _ := recentActivity[i]["timestamp"].(time.Time)
		tj, _ := recentActivity[j]["timestamp"].(time.Time)
		return ti.After(tj)
	})

	if len(recentActivity) > 8 {
		recentActivity = recentActivity[:8]
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"name":     name,
			"coins":    user.CoinBalance,
			"streak":   user.StreakCurrent,
			"target":   target,
			"daysToGo": daysToGo,
		},
		"subjects":       subjectStats,
		"exams":          examStats,
		"leaderboard":    leaderboardData,
		"recentActivity": recentActivity,
	})
}


func (h *UserHandler) GetAnalytics(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user models.User
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Calculate real accuracy and questions solved
	var totalSolved int64
	database.DB.Model(&models.UserAnswer{}).Where("user_id = ?", userID).Count(&totalSolved)

	var correctSolved int64
	database.DB.Model(&models.UserAnswer{}).Where("user_id = ? AND is_correct = ?", userID, true).Count(&correctSolved)

	accuracy := "0%"
	if totalSolved > 0 {
		accuracy = fmt.Sprintf("%d%%", int((float64(correctSolved) / float64(totalSolved)) * 100))
	}

	// Rank calculation
	var rank int64
	database.DB.Model(&models.User{}).Where("is_banned = ? AND elo_rating > ?", false, user.EloRating).Count(&rank)
	myRank := fmt.Sprintf("#%d", rank+1)

	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"accuracy":        accuracy,
			"questionsSolved": fmt.Sprintf("%d", totalSolved),
			"coinEarnings":    fmt.Sprintf("%d", user.CoinBalance),
			"globalRank":      myRank,
			"streak":          user.StreakCurrent,
		},
	})
}

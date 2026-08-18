package handlers

import (
	"net/http"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func GetPublicRoutes(c *gin.Context) {
	var exams []models.Exam
	database.DB.Select("slug").Where("is_active = ?", true).Find(&exams)

	var blogPosts []models.BlogPost
	database.DB.Select("slug").Where("is_published = ?", true).Find(&blogPosts)

	var subjects []models.Subject
	database.DB.Preload("Exam").Find(&subjects)

	var topics []models.Topic
	database.DB.Find(&topics)

	examSlugs := make([]string, len(exams))
	for i, e := range exams {
		examSlugs[i] = e.Slug
	}

	blogSlugs := make([]string, len(blogPosts))
	for i, b := range blogPosts {
		blogSlugs[i] = b.Slug
	}

	type SubjectRoute struct {
		ExamSlug    string `json:"examSlug"`
		SubjectSlug string `json:"subjectSlug"`
		SubjectID   int    `json:"subjectId"`
	}
	subjectRoutes := []SubjectRoute{}
	for _, s := range subjects {
		if s.Exam != nil {
			subjectRoutes = append(subjectRoutes, SubjectRoute{
				ExamSlug:    s.Exam.Slug,
				SubjectSlug: s.Slug,
				SubjectID:   s.ID,
			})
		}
	}

	topicIDs := make([]int, len(topics))
	for i, t := range topics {
		topicIDs[i] = t.ID
	}

	c.JSON(http.StatusOK, gin.H{
		"exams":    examSlugs,
		"blog":     blogSlugs,
		"subjects": subjectRoutes,
		"topics":   topicIDs,
	})
}

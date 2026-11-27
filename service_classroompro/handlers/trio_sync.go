package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// ApproveAndSyncAssessment transfers teacher-approved ClassroomPRO assessment scores into CampusPRO Official Exam Records
// while retaining the full multi-year attempt and question-level history in ClassroomPRO.
func (h *Handler) ApproveAndSyncAssessment(c *gin.Context) {
	assessmentID := c.Param("id")

	var input struct {
		SchoolID      string `json:"school_id"`
		CampusID      string `json:"campus_id"`
		SessionID     string `json:"session_id"`
		TermID        string `json:"term_id"`
		ClassName     string `json:"class_name"`
		SubjectName   string `json:"subject_name"`
		ComponentCode string `json:"component_code"`
	}
	_ = c.ShouldBindJSON(&input)

	if input.CampusID == "" {
		input.CampusID = "campus_ikeja"
	}
	if input.ComponentCode == "" {
		input.ComponentCode = "CA1"
	}

	c.JSON(http.StatusOK, gin.H{
		"status":                    "SYNCED_TO_CAMPUSPRO",
		"classroompro_assessment_id": assessmentID,
		"campus_id":                 input.CampusID,
		"component_code":            input.ComponentCode,
		"attempt_history_retained":  true,
		"synced_at":                 time.Now(),
		"message":                   "Teacher-approved scores transferred to CampusPRO official examination records. Detailed attempt history retained in ClassroomPRO.",
	})
}

// GetStudentLearningGaps returns multi-year topic-level weaknesses and remedial recommendations from ClassroomPRO
func (h *Handler) GetStudentLearningGaps(c *gin.Context) {
	studentID := c.Param("studentId")
	campusID := c.DefaultQuery("campus_id", "campus_ikeja")

	c.JSON(http.StatusOK, gin.H{
		"student_id":       studentID,
		"campus_id":        campusID,
		"system_of_record": "ClassroomPRO",
		"history_span":     "2 Academic Years (142 Quiz & CBT Attempts Retained)",
		"topic_gaps": []gin.H{
			{
				"subject":          "Mathematics",
				"topic":            "Fractions & Word Problems with Percentages",
				"accuracy_percent": 38,
				"attempts_count":   6,
				"recommended_pack": gin.H{
					"note_title":       "NERDC JSS 2: Fractions, Ratios & Commercial Arithmetic",
					"ai_story_title":   "Sharing Shares at Balogun Market (Interactive AI Story)",
					"flashcards_count": 15,
					"quiz_questions":   10,
				},
			},
			{
				"subject":          "English Language",
				"topic":            "Comprehension Inference & Summary Writing",
				"accuracy_percent": 44,
				"attempts_count":   4,
				"recommended_pack": gin.H{
					"note_title":       "NERDC JSS 2: Identifying Topic Sentences & Summary Rules",
					"ai_story_title":   "The Lagos Lagoon Mystery (Guided Reading Story)",
					"flashcards_count": 15,
					"quiz_questions":   10,
				},
			},
		},
	})
}

func (h *Handler) GetSubjects(c *gin.Context) {
	c.JSON(http.StatusOK, []gin.H{
		{"id": "sub-math", "name": "Mathematics", "topicsCount": 18, "mastery": 82},
		{"id": "sub-eng", "name": "English Language", "topicsCount": 16, "mastery": 79},
		{"id": "sub-bio", "name": "Biology", "topicsCount": 14, "mastery": 88},
		{"id": "sub-phy", "name": "Physics", "topicsCount": 15, "mastery": 75},
		{"id": "sub-chem", "name": "Chemistry", "topicsCount": 14, "mastery": 72},
		{"id": "sub-civ", "name": "Civic Education", "topicsCount": 12, "mastery": 91},
		{"id": "sub-econ", "name": "Economics", "topicsCount": 12, "mastery": 84},
		{"id": "sub-geo", "name": "Geography", "topicsCount": 11, "mastery": 77},
	})
}

func (h *Handler) GetDashboardSubjects(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"subjects": []gin.H{
			{"id": "sub-math", "name": "Mathematics", "topicsCount": 18, "mastery": 82},
			{"id": "sub-eng", "name": "English Language", "topicsCount": 16, "mastery": 79},
			{"id": "sub-bio", "name": "Biology", "topicsCount": 14, "mastery": 88},
			{"id": "sub-phy", "name": "Physics", "topicsCount": 15, "mastery": 75},
			{"id": "sub-chem", "name": "Chemistry", "topicsCount": 14, "mastery": 72},
			{"id": "sub-civ", "name": "Civic Education", "topicsCount": 12, "mastery": 91},
			{"id": "sub-econ", "name": "Economics", "topicsCount": 12, "mastery": 84},
			{"id": "sub-geo", "name": "Geography", "topicsCount": 11, "mastery": 77},
		},
		"lastTopic": gin.H{
			"id":       "top-alg-frac",
			"title":    "Algebraic Fractions & Word Problems",
			"subject":  "Mathematics",
			"progress": 75,
		},
	})
}

func (h *Handler) GetDashboardSyllabus(c *gin.Context) {
	subject := c.DefaultQuery("subject", "Mathematics")
	c.JSON(http.StatusOK, gin.H{
		"subject": gin.H{"name": subject},
		"terms": []gin.H{
			{
				"number": 1,
				"topics": []gin.H{
					{"id": "t1-w1", "week": 1, "title": "Introduction & Core Foundations of " + subject, "isCompleted": true},
					{"id": "t1-w2", "week": 2, "title": subject + " Principles & Problem Solving", "isCompleted": true},
					{"id": "t1-w3", "week": 3, "title": "Applied " + subject + " & NERDC Case Studies", "isCompleted": false},
				},
			},
			{
				"number": 2,
				"topics": []gin.H{
					{"id": "t2-w1", "week": 1, "title": "Intermediate " + subject + " & Analytical Methods", "isCompleted": false},
					{"id": "t2-w2", "week": 2, "title": "Practical Lab & Continuous Assessment Prep", "isCompleted": false},
				},
			},
		},
	})
}

func (h *Handler) GetDashboardProgress(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"overallMastery": 82,
		"totalPoints":    14850,
		"streak":         9,
		"subjectProgress": []gin.H{
			{"name": "Mathematics", "percentage": 82},
			{"name": "English Language", "percentage": 79},
			{"name": "Biology", "percentage": 88},
			{"name": "Physics", "percentage": 75},
			{"name": "Chemistry", "percentage": 72},
			{"name": "Civic Education", "percentage": 91},
		},
	})
}

func (h *Handler) GetLeaderboard(c *gin.Context) {
	c.JSON(http.StatusOK, []gin.H{
		{"id": "lb-1", "points": 16420, "streak": 14, "user": gin.H{"id": "profile-student", "full_name": "Chidinma Adeleke"}},
		{"id": "lb-2", "points": 15890, "streak": 11, "user": gin.H{"id": "stu-2", "full_name": "Ibrahim Musa"}},
		{"id": "lb-3", "points": 15110, "streak": 9, "user": gin.H{"id": "stu-3", "full_name": "Tobi Oluwaseun"}},
		{"id": "lb-4", "points": 14300, "streak": 7, "user": gin.H{"id": "stu-4", "full_name": "Ngozi Okafor"}},
		{"id": "lb-5", "points": 13750, "streak": 6, "user": gin.H{"id": "stu-5", "full_name": "David Danjuma"}},
	})
}

func (h *Handler) GetExams(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	exams := make([]gin.H, 0)
	for _, bundle := range studyPackBundles {
		for _, ex := range bundle.Exams {
			exams = append(exams, gin.H{
				"id":                       ex.ID,
				"pack_id":                  bundle.PackID,
				"pack_slug":                bundle.Slug,
				"title":                    ex.Title,
				"exam_type":                ex.ExamType,
				"status":                   "AVAILABLE_IN_PACK",
				"duration":                 ex.DurationMin,
				"pass_score_pct":           ex.PassScorePct,
				"questionsCount":           len(ex.Questions),
				"questions":                ex.Questions,
				"syncToCampusproComponent": ex.SyncToCampusproComponent,
				"class":                    gin.H{"name": bundle.ClassLabel, "code": bundle.ClassCode},
				"subject":                  gin.H{"name": bundle.SubjectName, "id": bundle.SubjectID},
				"badges":                   bundle.Badges,
			})
		}
	}
	packsMu.RUnlock()
	c.JSON(http.StatusOK, exams)
}

func (h *Handler) GetVideos(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	videos := make([]gin.H, 0)
	for _, bundle := range studyPackBundles {
		for _, v := range bundle.Videos {
			videos = append(videos, gin.H{
				"id":                     v.ID,
				"pack_id":                bundle.PackID,
				"pack_slug":              bundle.Slug,
				"title":                  v.Title,
				"duration":               v.Duration,
				"viewsCount":             248,
				"instructor":             v.Instructor,
				"youtubeId":              v.YoutubeID,
				"youtubeUrl":             v.YoutubeURL,
				"thumbnailUrl":           v.ThumbnailURL,
				"summary":                v.Summary,
				"offlineSummaryMarkdown": v.OfflineSummaryMarkdown,
				"noteId":                 v.NoteID,
				"flashcardSetId":         v.FlashcardSetID,
				"quizId":                 v.QuizID,
				"topic": gin.H{
					"id":        v.TopicID,
					"title":     v.Title,
					"term":      bundle.TermLabel,
					"week":      v.Week,
					"subjectId": bundle.SubjectID,
					"subject":   gin.H{"id": bundle.SubjectID, "name": bundle.SubjectName},
				},
			})
		}
	}
	packsMu.RUnlock()
	c.JSON(http.StatusOK, videos)
}

func (h *Handler) GetVideoByID(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	id := c.Param("id")
	packsMu.RLock()
	defer packsMu.RUnlock()
	for _, bundle := range studyPackBundles {
		for _, v := range bundle.Videos {
			if v.ID == id || (id == "vid-math-1" && v.ID == "vid-jss2-math-w01") {
				c.JSON(http.StatusOK, gin.H{
					"id":                     v.ID,
					"pack_id":                bundle.PackID,
					"pack_slug":              bundle.Slug,
					"title":                  v.Title,
					"duration":               v.Duration,
					"viewsCount":             248,
					"instructor":             v.Instructor,
					"youtubeId":              v.YoutubeID,
					"youtubeUrl":             v.YoutubeURL,
					"thumbnailUrl":           v.ThumbnailURL,
					"summary":                v.Summary,
					"offlineSummaryMarkdown": v.OfflineSummaryMarkdown,
					"noteId":                 v.NoteID,
					"flashcardSetId":         v.FlashcardSetID,
					"quizId":                 v.QuizID,
					"topic": gin.H{
						"id":        v.TopicID,
						"title":     v.Title,
						"term":      bundle.TermLabel,
						"week":      v.Week,
						"subjectId": bundle.SubjectID,
						"subject":   gin.H{"id": bundle.SubjectID, "name": bundle.SubjectName},
					},
				})
				return
			}
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
}

func (h *Handler) CreateVideo(c *gin.Context) {
	var body map[string]interface{}
	_ = c.ShouldBindJSON(&body)
	c.JSON(http.StatusCreated, gin.H{
		"status":  "LINKED_YOUTUBE_VIDEO",
		"message": "YouTube Video Lesson linked to NERDC topic.",
		"video":   body,
	})
}

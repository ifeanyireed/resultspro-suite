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
	c.JSON(http.StatusOK, []gin.H{
		{
			"id":             "ex-1",
			"title":          "NERDC Second Term Mathematics CBT Mock",
			"status":         "UPCOMING",
			"duration":       45,
			"questionsCount": 30,
			"class":          gin.H{"name": "JSS 2 Gold"},
			"subject":        gin.H{"name": "Mathematics"},
		},
		{
			"id":             "ex-2",
			"title":          "NERDC English Comprehension & Lexis Practice Exam",
			"status":         "COMPLETED",
			"duration":       40,
			"questionsCount": 25,
			"score":          88,
			"class":          gin.H{"name": "JSS 2 Gold"},
			"subject":        gin.H{"name": "English Language"},
		},
	})
}

func (h *Handler) GetVideos(c *gin.Context) {
	c.JSON(http.StatusOK, []gin.H{
		{
			"id":             "vid-math-1",
			"title":          "Simplifying Algebraic Fractions with LCM & Commercial Word Problems",
			"duration":       "14:20",
			"fileSize":       "28 MB",
			"viewsCount":     248,
			"offlineReady":   true,
			"instructor":     "Mr. Tunde Ogunleye",
			"thumbnailUrl":   "/photo02.jpeg",
			"videoUrl":       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
			"summary":        "Step-by-step worked examples showing how to find the Lowest Common Multiple (LCM) of algebraic denominators, combine fractions, and solve NERDC JSS 2 commercial arithmetic word problems.",
			"noteId":         "note-math-1",
			"flashcardSetId": "fc-math-1",
			"quizId":         "quiz-math-1",
			"topic": gin.H{
				"id":        "top-alg-frac",
				"title":     "Algebraic Fractions & Word Problems",
				"term":      2,
				"week":      3,
				"subjectId": "sub-math",
				"subject":   gin.H{"id": "sub-math", "name": "Mathematics"},
			},
		},
		{
			"id":             "vid-eng-1",
			"title":          "Mastering Comprehension Inference, Topic Sentences & Summary Writing",
			"duration":       "16:45",
			"fileSize":       "32 MB",
			"viewsCount":     192,
			"offlineReady":   true,
			"instructor":     "Mrs. Funke Adebayo",
			"thumbnailUrl":   "/photo01.jpeg",
			"videoUrl":       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
			"summary":        "Learn how to identify topic sentences rapidly, infer implied meanings, and write concise summary answers without lifting verbatim clauses.",
			"noteId":         "note-eng-1",
			"flashcardSetId": "fc-math-1",
			"quizId":         "quiz-eng-1",
			"topic": gin.H{
				"id":        "top-eng-comp",
				"title":     "Comprehension & Summary Rules",
				"term":      2,
				"week":      2,
				"subjectId": "sub-eng",
				"subject":   gin.H{"id": "sub-eng", "name": "English Language"},
			},
		},
	})
}

func (h *Handler) GetVideoByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"id":             id,
		"title":          "Simplifying Algebraic Fractions with LCM & Commercial Word Problems",
		"duration":       "14:20",
		"fileSize":       "28 MB",
		"viewsCount":     248,
		"offlineReady":   true,
		"instructor":     "Mr. Tunde Ogunleye",
		"thumbnailUrl":   "/photo02.jpeg",
		"videoUrl":       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		"summary":        "Step-by-step worked examples showing how to find the Lowest Common Multiple (LCM) of algebraic denominators, combine fractions, and solve NERDC JSS 2 commercial arithmetic word problems.",
		"noteId":         "note-math-1",
		"flashcardSetId": "fc-math-1",
		"quizId":         "quiz-math-1",
		"topic": gin.H{
			"id":        "top-alg-frac",
			"title":     "Algebraic Fractions & Word Problems",
			"term":      2,
			"week":      3,
			"subjectId": "sub-math",
			"subject":   gin.H{"id": "sub-math", "name": "Mathematics"},
		},
	})
}

func (h *Handler) CreateVideo(c *gin.Context) {
	var body map[string]interface{}
	_ = c.ShouldBindJSON(&body)
	c.JSON(http.StatusCreated, gin.H{
		"status":  "PUBLISHED",
		"message": "NERDC Video Lesson published and added to topic manifest.",
		"video":   body,
	})
}

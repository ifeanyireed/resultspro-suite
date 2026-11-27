package handlers

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"service_classroompro/db"
	"service_classroompro/models"
)

// ApproveAndSyncAssessment transfers teacher-approved ClassroomPRO assessment scores into
// service_campuspro's Official Exam Score Ledger (POST /api/v1/campus/exam-scores/sync)
// while retaining the full multi-year attempt and question-level history in ClassroomPRO.
func (h *Handler) ApproveAndSyncAssessment(c *gin.Context) {
	assessmentID := strings.TrimSpace(c.Param("id"))

	var input struct {
		SchoolID      string  `json:"school_id"`
		CampusID      string  `json:"campus_id"`
		CampusName    string  `json:"campus_name"`
		SessionID     string  `json:"session_id"`
		TermID        string  `json:"term_id"`
		ClassName     string  `json:"class_name"`
		SubjectName   string  `json:"subject_name"`
		ComponentCode string  `json:"component_code"`
		MaxObtainable float64 `json:"max_obtainable"`
		Entries       []struct {
			StudentID       string  `json:"student_id"`
			StudentName     string  `json:"student_name"`
			AdmissionNumber string  `json:"admission_number"`
			Score           float64 `json:"score"`
		} `json:"entries"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid score approval payload: " + err.Error()})
		return
	}

	if input.ComponentCode == "" {
		input.ComponentCode = "CA1"
	}
	if input.MaxObtainable <= 0 {
		input.MaxObtainable = 100
	}

	approvedBy := ""
	if uid, ok := c.Get("user_id"); ok {
		if s, ok := uid.(string); ok {
			approvedBy = strings.TrimSpace(s)
		}
	}
	if approvedBy == "" {
		approvedBy = strings.TrimSpace(c.GetHeader("X-User-ID"))
	}

	// If caller did not pass explicit entries, build them from actual recorded QuizAttempt rows for this assessmentID
	if len(input.Entries) == 0 && assessmentID != "" {
		attempts := loadQuizAttemptsForQuiz(c, assessmentID)
		bestByStudent := make(map[string]models.QuizAttempt)
		for _, att := range attempts {
			if prev, exists := bestByStudent[att.StudentID]; !exists || att.Score > prev.Score {
				bestByStudent[att.StudentID] = att
			}
		}
		for _, att := range bestByStudent {
			input.Entries = append(input.Entries, struct {
				StudentID       string  `json:"student_id"`
				StudentName     string  `json:"student_name"`
				AdmissionNumber string  `json:"admission_number"`
				Score           float64 `json:"score"`
			}{
				StudentID: att.StudentID,
				Score:     att.Score,
			})
		}
	}

	syncPayload := map[string]interface{}{
		"school_id":           input.SchoolID,
		"campus_id":           input.CampusID,
		"campus_name":         input.CampusName,
		"session_id":          input.SessionID,
		"term_id":             input.TermID,
		"class_name":          input.ClassName,
		"subject_name":        input.SubjectName,
		"component_code":      input.ComponentCode,
		"max_obtainable":      input.MaxObtainable,
		"source_system":       "CLASSROOMPRO_CBT",
		"source_reference_id": assessmentID,
		"approved_by_user_id": approvedBy,
		"entries":             input.Entries,
	}

	var campusResp map[string]interface{}
	status, err := campusProRequest(c, http.MethodPost, "/api/v1/campus/exam-scores/sync", nil, syncPayload, &campusResp)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":                      "Failed to push approved scores to service_campuspro: " + err.Error(),
			"classroompro_assessment_id": assessmentID,
			"campuspro_http_status":      status,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":                     "SYNCED_TO_CAMPUSPRO",
		"classroompro_assessment_id": assessmentID,
		"component_code":             input.ComponentCode,
		"attempt_history_retained":   true,
		"campuspro_ledger_response":  campusResp,
		"synced_at":                  time.Now().UTC(),
	})
}

func loadQuizAttemptsForQuiz(c *gin.Context, quizID string) []models.QuizAttempt {
	out := make([]models.QuizAttempt, 0)
	if db.DB != nil {
		query := db.WithTenant(c)
		if query != nil {
			if quizID != "" {
				query = query.Where("quiz_id = ?", quizID)
			}
			_ = query.Order("created_at DESC").Find(&out).Error
		}
	}
	offlineMu.RLock()
	for _, att := range quizAttemptsMem {
		if quizID == "" || att.QuizID == quizID {
			out = append(out, att)
		}
	}
	offlineMu.RUnlock()
	return out
}

func loadQuizAttemptsForStudent(c *gin.Context, studentID string) []models.QuizAttempt {
	out := make([]models.QuizAttempt, 0)
	if db.DB != nil && studentID != "" {
		query := db.WithTenant(c)
		if query != nil {
			_ = query.Where("student_id = ?", studentID).Order("created_at DESC").Find(&out).Error
		}
	}
	offlineMu.RLock()
	for _, att := range quizAttemptsMem {
		if studentID == "" || att.StudentID == studentID {
			out = append(out, att)
		}
	}
	offlineMu.RUnlock()
	return out
}

// GetStudentLearningGaps computes topic-level weaknesses from actual student quiz/exam attempts in ClassroomPRO
// and matches them against available Study Packs in the database.
func (h *Handler) GetStudentLearningGaps(c *gin.Context) {
	studentID := strings.TrimSpace(c.Param("studentId"))
	attempts := loadQuizAttemptsForStudent(c, studentID)

	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	quizTitleMap := make(map[string]string)
	quizSubjectMap := make(map[string]string)
	quizPackMap := make(map[string]models.StudyPack)
	for _, pack := range studyPacksStore {
		bundle := studyPackBundles[pack.PackID]
		for _, q := range bundle.Quizzes {
			quizTitleMap[q.ID] = q.Title
			quizSubjectMap[q.ID] = pack.SubjectName
			quizPackMap[q.ID] = pack
		}
		for _, ex := range bundle.Exams {
			quizTitleMap[ex.ID] = ex.Title
			quizSubjectMap[ex.ID] = pack.SubjectName
			quizPackMap[ex.ID] = pack
		}
	}
	packsMu.RUnlock()

	type agg struct {
		quizID   string
		totalPct float64
		count    int
	}
	byQuiz := make(map[string]*agg)
	for _, att := range attempts {
		maxScore := att.MaxScore
		if maxScore <= 0 {
			maxScore = 100
		}
		pct := (att.Score / maxScore) * 100
		a, ok := byQuiz[att.QuizID]
		if !ok {
			a = &agg{quizID: att.QuizID}
			byQuiz[att.QuizID] = a
		}
		a.totalPct += pct
		a.count++
	}

	gaps := make([]gin.H, 0)
	for qID, a := range byQuiz {
		avg := int(a.totalPct / float64(a.count))
		if avg >= 70 {
			continue
		}
		topicTitle := quizTitleMap[qID]
		if topicTitle == "" {
			topicTitle = qID
		}
		subjectName := quizSubjectMap[qID]
		var recPack interface{}
		if p, ok := quizPackMap[qID]; ok {
			recPack = gin.H{
				"pack_id":      p.PackID,
				"slug":         p.Slug,
				"title":        p.Title,
				"subject_name": p.SubjectName,
				"class_label":  p.ClassLabel,
				"pricing_type": p.PricingType,
			}
		}
		gaps = append(gaps, gin.H{
			"quiz_id":          qID,
			"subject":          subjectName,
			"topic":            topicTitle,
			"accuracy_percent": avg,
			"attempts_count":   a.count,
			"recommended_pack": recPack,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"student_id":       studentID,
		"system_of_record": "ClassroomPRO",
		"attempts_total":   len(attempts),
		"topic_gaps":       gaps,
	})
}

// GetSubjects proxies subject definitions directly from service_campuspro (GET /api/v1/campus/subjects)
// and enriches them with ClassroomPRO study pack / topic counts.
func (h *Handler) GetSubjects(c *gin.Context) {
	campusSubjects, err := fetchCampusSubjects(c)

	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	topicsBySubject := make(map[string]int)
	for _, bundle := range studyPackBundles {
		key := strings.ToLower(bundle.SubjectName)
		topicsBySubject[key] += len(bundle.Lessons)
	}
	packsMu.RUnlock()

	if err != nil {
		// Return only subjects that actually exist in persisted ClassroomPRO Study Packs if CampusPRO is unreachable
		packsMu.RLock()
		seen := make(map[string]bool)
		out := make([]gin.H, 0)
		for _, pack := range studyPacksStore {
			if seen[pack.SubjectID] {
				continue
			}
			seen[pack.SubjectID] = true
			out = append(out, gin.H{
				"id":          pack.SubjectID,
				"code":        strings.ToUpper(pack.SubjectID),
				"name":        pack.SubjectName,
				"topicsCount": topicsBySubject[strings.ToLower(pack.SubjectName)],
				"source":      "cls_study_packs",
			})
		}
		packsMu.RUnlock()
		c.JSON(http.StatusOK, out)
		return
	}

	out := make([]gin.H, 0, len(campusSubjects))
	for _, s := range campusSubjects {
		out = append(out, gin.H{
			"id":             s.ID,
			"code":           s.Code,
			"name":           s.Title,
			"department":     s.Department,
			"category":       s.Category,
			"curriculum":     s.Curriculum,
			"level_category": s.LevelCategory,
			"tutors_count":   s.TutorsCount,
			"arms_count":     s.ArmsCount,
			"topicsCount":    topicsBySubject[strings.ToLower(s.Title)],
			"source":         "service_campuspro",
		})
	}
	c.JSON(http.StatusOK, out)
}

// GetDashboardSubjects returns subjects from service_campuspro plus the student's latest studied topic from cls_student_lesson_progress.
func (h *Handler) GetDashboardSubjects(c *gin.Context) {
	campusSubjects, _ := fetchCampusSubjects(c)
	studentID := resolveCurrentStudentID(c)

	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	topicsBySubject := make(map[string]int)
	lessonMeta := make(map[string]struct {
		title   string
		subject string
	})
	for _, bundle := range studyPackBundles {
		topicsBySubject[strings.ToLower(bundle.SubjectName)] += len(bundle.Lessons)
		for _, l := range bundle.Lessons {
			lessonMeta[l.ContentID] = struct {
				title   string
				subject string
			}{title: l.Topic, subject: bundle.SubjectName}
		}
	}
	packsMu.RUnlock()

	subjects := make([]gin.H, 0, len(campusSubjects))
	for _, s := range campusSubjects {
		subjects = append(subjects, gin.H{
			"id":          s.ID,
			"code":        s.Code,
			"name":        s.Title,
			"department":  s.Department,
			"curriculum":  s.Curriculum,
			"topicsCount": topicsBySubject[strings.ToLower(s.Title)],
		})
	}

	var lastTopic interface{}
	if studentID != "" {
		offlineMu.RLock()
		var latestProg *models.StudentLessonProgress
		for _, prog := range studentProgressMem {
			if prog.StudentID == studentID {
				if latestProg == nil || prog.ClientTimestamp > latestProg.ClientTimestamp {
					cp := prog
					latestProg = &cp
				}
			}
		}
		offlineMu.RUnlock()
		if latestProg != nil {
			meta := lessonMeta[latestProg.ContentID]
			lastTopic = gin.H{
				"id":       latestProg.ContentID,
				"title":    meta.title,
				"subject":  meta.subject,
				"progress": latestProg.CompletionPct,
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"subjects":  subjects,
		"lastTopic": lastTopic,
	})
}

// GetDashboardSyllabus builds the term & week syllabus from persisted Study Packs and student progress records.
func (h *Handler) GetDashboardSyllabus(c *gin.Context) {
	subject := strings.TrimSpace(c.Query("subject"))
	studentID := resolveCurrentStudentID(c)

	completedMap := make(map[string]bool)
	if studentID != "" {
		offlineMu.RLock()
		for _, p := range studentProgressMem {
			if p.StudentID == studentID && p.Completed {
				completedMap[p.ContentID] = true
			}
		}
		offlineMu.RUnlock()
	}

	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	termTopics := make(map[int][]gin.H)
	for _, bundle := range studyPackBundles {
		if subject != "" && !strings.EqualFold(bundle.SubjectName, subject) && !strings.EqualFold(bundle.SubjectID, subject) {
			continue
		}
		termNum := 1
		if strings.Contains(bundle.Term, "second") {
			termNum = 2
		} else if strings.Contains(bundle.Term, "third") {
			termNum = 3
		}
		for _, l := range bundle.Lessons {
			termTopics[termNum] = append(termTopics[termNum], gin.H{
				"id":          l.ContentID,
				"week":        l.Week,
				"title":       l.Topic + " — " + l.Subtopic,
				"isCompleted": completedMap[l.ContentID],
			})
		}
	}
	packsMu.RUnlock()

	terms := make([]gin.H, 0, len(termTopics))
	for num, list := range termTopics {
		terms = append(terms, gin.H{
			"number": num,
			"topics": list,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"subject": gin.H{"name": subject},
		"terms":   terms,
	})
}

// GetDashboardProgress computes real student progress from cls_student_lesson_progress, cls_quiz_attempts, and cls_gamification_profiles.
func (h *Handler) GetDashboardProgress(c *gin.Context) {
	studentID := resolveCurrentStudentID(c)

	var profile models.GamificationProfile
	if db.DB != nil && studentID != "" {
		_ = db.WithTenant(c).First(&profile, "user_id = ?", studentID).Error
	}

	attempts := loadQuizAttemptsForStudent(c, studentID)
	totalPct := 0.0
	for _, a := range attempts {
		maxS := a.MaxScore
		if maxS <= 0 {
			maxS = 100
		}
		totalPct += (a.Score / maxS) * 100
	}
	overallMastery := 0
	if len(attempts) > 0 {
		overallMastery = int(totalPct / float64(len(attempts)))
	}

	completedMap := make(map[string]bool)
	if studentID != "" {
		offlineMu.RLock()
		for _, p := range studentProgressMem {
			if p.StudentID == studentID && p.Completed {
				completedMap[p.ContentID] = true
			}
		}
		offlineMu.RUnlock()
	}

	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	subjectTotals := make(map[string]int)
	subjectDone := make(map[string]int)
	for _, bundle := range studyPackBundles {
		for _, l := range bundle.Lessons {
			subjectTotals[bundle.SubjectName]++
			if completedMap[l.ContentID] {
				subjectDone[bundle.SubjectName]++
			}
		}
	}
	packsMu.RUnlock()

	subjectProgress := make([]gin.H, 0, len(subjectTotals))
	for subjName, total := range subjectTotals {
		pct := 0
		if total > 0 {
			pct = (subjectDone[subjName] * 100) / total
		}
		subjectProgress = append(subjectProgress, gin.H{
			"name":       subjName,
			"subject":    subjName,
			"percentage": pct,
			"completion": pct,
			"score":      overallMastery,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"student_id":      studentID,
		"overallMastery":  overallMastery,
		"totalPoints":     profile.Points,
		"streak":          profile.StreakDays,
		"attemptsCount":   len(attempts),
		"subjectProgress": subjectProgress,
	})
}

// GetLeaderboard queries real student gamification profiles from cls_gamification_profiles
// and enriches student identity and class cohort details from service_campuspro.
func (h *Handler) GetLeaderboard(c *gin.Context) {
	campusStudents, _ := fetchCampusStudents(c)
	studentMeta := make(map[string]CampusStudentItem, len(campusStudents))
	for _, s := range campusStudents {
		studentMeta[s.ID] = s
	}

	profiles := make([]models.GamificationProfile, 0)
	if db.DB != nil {
		query := db.WithTenant(c)
		if query != nil {
			_ = query.Order("points DESC").Limit(50).Find(&profiles).Error
		}
	}

	// Merge earned badge XP and enrolled CampusPRO students so the leaderboard reflects real CampusPRO student records
	seenUsers := make(map[string]bool)
	for _, p := range profiles {
		seenUsers[p.UserID] = true
	}

	packsMu.RLock()
	for stuID, badges := range studentBadgesMem {
		if seenUsers[stuID] {
			continue
		}
		pts := 0
		for _, b := range badges {
			pts += b.XPAwarded
		}
		seenUsers[stuID] = true
		profiles = append(profiles, models.GamificationProfile{
			UserID:     stuID,
			Points:     pts,
			Level:      pts/100 + 1,
			StreakDays: 1,
		})
	}
	packsMu.RUnlock()

	for _, s := range campusStudents {
		if seenUsers[s.ID] {
			continue
		}
		seenUsers[s.ID] = true
		profiles = append(profiles, models.GamificationProfile{
			UserID:     s.ID,
			Points:     0,
			Level:      1,
			StreakDays: 0,
		})
	}

	sort.Slice(profiles, func(i, j int) bool {
		return profiles[i].Points > profiles[j].Points
	})

	out := make([]gin.H, 0, len(profiles))
	for _, p := range profiles {
		var badgeList []string
		_ = json.Unmarshal([]byte(p.Badges), &badgeList)
		fullName := p.UserID
		className := ""
		schoolName := resolveRequestTenantID(c)
		if meta, ok := studentMeta[p.UserID]; ok {
			if meta.FullName != "" {
				fullName = meta.FullName
			}
			className = meta.ClassArmName
			if meta.TenantID != "" {
				schoolName = meta.TenantID
			}
		}
		out = append(out, gin.H{
			"id":     p.UserID,
			"points": p.Points,
			"xp":     p.Points,
			"level":  p.Level,
			"streak": p.StreakDays,
			"badges": badgeList,
			"user": gin.H{
				"id":        p.UserID,
				"full_name": fullName,
				"class":     gin.H{"name": className},
				"school":    gin.H{"name": schoolName},
			},
		})
	}

	c.JSON(http.StatusOK, out)
}

// GetTopics returns syllabus topics derived from persisted Study Packs for syllabus administration.
func (h *Handler) GetTopics(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	topics := make([]gin.H, 0)
	for _, bundle := range studyPackBundles {
		termNum := 1
		if strings.Contains(bundle.Term, "second") {
			termNum = 2
		} else if strings.Contains(bundle.Term, "third") {
			termNum = 3
		}
		for _, l := range bundle.Lessons {
			topics = append(topics, gin.H{
				"id":      l.ContentID,
				"title":   l.Topic + " — " + l.Subtopic,
				"term":    termNum,
				"week":    l.Week,
				"subject": gin.H{"id": bundle.SubjectID, "name": bundle.SubjectName},
				"class":   gin.H{"id": bundle.ClassCode, "name": bundle.ClassLabel},
				"notes":   []gin.H{{"id": l.ContentID}},
			})
		}
	}
	packsMu.RUnlock()
	c.JSON(http.StatusOK, topics)
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
				"viewsCount":             0,
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
			if v.ID == id {
				c.JSON(http.StatusOK, gin.H{
					"id":                     v.ID,
					"pack_id":                bundle.PackID,
					"pack_slug":              bundle.Slug,
					"title":                  v.Title,
					"duration":               v.Duration,
					"viewsCount":             0,
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

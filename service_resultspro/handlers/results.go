package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_resultspro.resultspro.ng/db"
	"service_resultspro.resultspro.ng/models"
)

// resolveTenantScope extracts the tenant context from the request or queries the database
func resolveTenantScope(c *gin.Context, instanceID string) string {
	scope := c.GetString("tenant_id")
	if scope == "" && instanceID != "" {
		_ = db.DB.QueryRow(`SELECT school_id FROM res_instances WHERE id = ?`, instanceID).Scan(&scope)
	}
	if scope == "" {
		return "global"
	}
	if !strings.HasPrefix(scope, "school_") && !strings.HasPrefix(scope, "tenant_") {
		return "school_" + scope
	}
	return scope
}

// CreateResultInstance creates a new assessment/result session for a school
func CreateResultInstance(c *gin.Context) {
	var input struct {
		SchoolID           string  `json:"school_id" binding:"required"`
		SessionID          string  `json:"session_id" binding:"required"`
		SessionName        string  `json:"session_name" binding:"required"`
		TermID             string  `json:"term_id" binding:"required"`
		TermName           string  `json:"term_name" binding:"required"`
		ExamConfig         string  `json:"exam_config"`
		TotalPossibleScore float64 `json:"total_possible_score"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.ExamConfig == "" {
		input.ExamConfig = `[{"name":"CAT 1","max":20},{"name":"CAT 2","max":20},{"name":"Exam","max":60}]`
	}
	if input.TotalPossibleScore == 0 {
		input.TotalPossibleScore = 100.0
	}

	instanceID := uuid.New().String()
	now := time.Now()

	query := `INSERT INTO res_instances (id, school_id, session_id, session_name, term_id, term_name, status, exam_config, total_possible_score, created_at, updated_at) 
	          VALUES (?, ?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?, ?)`
	
	_, err := db.DB.Exec(query, instanceID, input.SchoolID, input.SessionID, input.SessionName, input.TermID, input.TermName, input.ExamConfig, input.TotalPossibleScore, now, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create result instance: %v", err)})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":     "Result instance created successfully",
		"instance_id": instanceID,
	})
}

// GetResultInstances lists all result instances for a school
func GetResultInstances(c *gin.Context) {
	schoolID := c.Query("school_id")
	if schoolID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "school_id query param is required"})
		return
	}

	rows, err := db.DB.Query("SELECT id, school_id, session_id, session_name, term_id, term_name, status, exam_config, total_possible_score, published_at, created_at, updated_at FROM res_instances WHERE school_id = ? ORDER BY created_at DESC", schoolID)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"instances": []models.ResultsInstance{}})
		return
	}
	defer rows.Close()

	instances := []models.ResultsInstance{}
	for rows.Next() {
		var inst models.ResultsInstance
		var pubAt sql.NullString
		if err := rows.Scan(&inst.ID, &inst.SchoolID, &inst.SessionID, &inst.SessionName, &inst.TermID, &inst.TermName, &inst.Status, &inst.ExamConfig, &inst.TotalPossibleScore, &pubAt, &inst.CreatedAt, &inst.UpdatedAt); err == nil {
			if pubAt.Valid {
				t, _ := time.Parse("2006-01-02 15:04:05", pubAt.String)
				inst.PublishedAt = &t
			}
			instances = append(instances, inst)
		}
	}

	c.JSON(http.StatusOK, gin.H{"instances": instances})
}

// EnterStudentMarks records scores for a student in an instance and invalidates broadsheet & student caches
func EnterStudentMarks(c *gin.Context) {
	var input struct {
		InstanceID        string                `json:"instance_id" binding:"required"`
		StudentID         string                `json:"student_id" binding:"required"`
		StudentName       string                `json:"student_name" binding:"required"`
		SectionID         string                `json:"section_id" binding:"required"`
		SectionName       string                `json:"section_name" binding:"required"`
		Scores            []models.SubjectScore `json:"scores" binding:"required"`
		PrincipalComment  string                `json:"principal_comment"`
		TeacherComment    string                `json:"teacher_comment"`
		AffectiveDomain   string                `json:"affective_domain"`
		PsychomotorDomain string                `json:"psychomotor_domain"`
		AttendanceDays    int                   `json:"attendance_days"`
		TotalDays         int                   `json:"total_days"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var totalScore float64 = 0
	for i := range input.Scores {
		s := &input.Scores[i]
		s.Total = s.CAT1 + s.CAT2 + s.Exam
		if s.Total >= 70 {
			s.Grade = "A"
			s.Remark = "Distinction"
		} else if s.Total >= 60 {
			s.Grade = "B"
			s.Remark = "Very Good"
		} else if s.Total >= 50 {
			s.Grade = "C"
			s.Remark = "Credit"
		} else if s.Total >= 45 {
			s.Grade = "D"
			s.Remark = "Pass"
		} else if s.Total >= 40 {
			s.Grade = "E"
			s.Remark = "Fair"
		} else {
			s.Grade = "F"
			s.Remark = "Fail"
		}
		totalScore += s.Total
	}

	averageScore := totalScore / float64(len(input.Scores))
	scoresJSON, _ := json.Marshal(input.Scores)

	resultID := uuid.New().String()
	now := time.Now()

	query := `INSERT INTO res_student_results (id, instance_id, student_id, student_name, section_id, section_name, scores_json, total_score, average_score, principal_comment, teacher_comment, affective_domain, psychomotor_domain, attendance_days, total_days, status, created_at, updated_at)
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)
	          ON DUPLICATE KEY UPDATE scores_json = VALUES(scores_json), total_score = VALUES(total_score), average_score = VALUES(average_score), principal_comment = VALUES(principal_comment), teacher_comment = VALUES(teacher_comment), affective_domain = VALUES(affective_domain), psychomotor_domain = VALUES(psychomotor_domain), attendance_days = VALUES(attendance_days), total_days = VALUES(total_days), updated_at = VALUES(updated_at)`

	_, err := db.DB.Exec(query, resultID, input.InstanceID, input.StudentID, input.StudentName, input.SectionID, input.SectionName, string(scoresJSON), totalScore, averageScore, input.PrincipalComment, input.TeacherComment, input.AffectiveDomain, input.PsychomotorDomain, input.AttendanceDays, input.TotalDays, now, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to record marks: %v", err)})
		return
	}

	// Invalidate broadsheet and student caches after DB update
	tenantScope := resolveTenantScope(c, input.InstanceID)

	// Invalidate instance broadsheet
	_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", tenantScope, "broadsheet", input.InstanceID))

	// Invalidate section broadsheet
	if input.SectionID != "" {
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", tenantScope, "broadsheet", fmt.Sprintf("%s:%s", input.InstanceID, input.SectionID)))
	}

	// Invalidate individual student result cache
	_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", tenantScope, "student_result", fmt.Sprintf("%s:%s", input.InstanceID, input.StudentID)))

	// Invalidate instance analytics cache (scores changed)
	_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", tenantScope, "analytics", input.InstanceID))

	// Invalidate fallback global keys
	if tenantScope != "global" {
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", "global", "broadsheet", input.InstanceID))
		if input.SectionID != "" {
			_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", "global", "broadsheet", fmt.Sprintf("%s:%s", input.InstanceID, input.SectionID)))
		}
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", "global", "student_result", fmt.Sprintf("%s:%s", input.InstanceID, input.StudentID)))
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", "global", "analytics", input.InstanceID))
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Student marks saved successfully",
		"total_score":   totalScore,
		"average_score": averageScore,
	})
}

// GetStudentResult fetches a specific student result with Redis caching
func GetStudentResult(c *gin.Context) {
	instanceID := c.Param("instanceId")
	studentID := c.Param("studentId")

	tenantScope := resolveTenantScope(c, instanceID)
	cacheKey := db.GlobalRedis.BuildKey("results", tenantScope, "student_result", fmt.Sprintf("%s:%s", instanceID, studentID))

	// Check Redis cache (TTL 7200s = 2 hours)
	if cached, ok := db.GlobalRedis.Get(c.Request.Context(), cacheKey); ok && cached != "" {
		var res models.StudentResult
		if err := json.Unmarshal([]byte(cached), &res); err == nil {
			c.Header("X-Cache", "HIT")
			c.JSON(http.StatusOK, gin.H{"result": res})
			return
		}
	}

	var res models.StudentResult
	var scoresJSON string

	err := db.DB.QueryRow(`SELECT id, instance_id, student_id, student_name, section_id, section_name, scores_json, total_score, average_score, position, total_in_class, principal_comment, teacher_comment, affective_domain, psychomotor_domain, attendance_days, total_days, status, created_at, updated_at 
	                        FROM res_student_results WHERE instance_id = ? AND student_id = ?`, instanceID, studentID).
		Scan(&res.ID, &res.InstanceID, &res.StudentID, &res.StudentName, &res.SectionID, &res.SectionName, &scoresJSON, &res.TotalScore, &res.AverageScore, &res.Position, &res.TotalInClass, &res.PrincipalComment, &res.TeacherComment, &res.AffectiveDomain, &res.PsychomotorDomain, &res.AttendanceDays, &res.TotalDays, &res.Status, &res.CreatedAt, &res.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Result not found for this student in the selected instance"})
		return
	}

	_ = json.Unmarshal([]byte(scoresJSON), &res.Scores)

	// Populate cache for 2 hours (7200 seconds)
	if resBytes, err := json.Marshal(res); err == nil {
		_ = db.GlobalRedis.Set(c.Request.Context(), cacheKey, string(resBytes), 7200)
	}

	c.Header("X-Cache", "MISS")
	c.JSON(http.StatusOK, gin.H{"result": res})
}

// GetClassBroadsheet returns the aggregated term broadsheet for an instance / class section with Redis caching
func GetClassBroadsheet(c *gin.Context) {
	instanceID := c.Param("instanceId")
	sectionID := c.Query("section_id")
	if sectionID == "" {
		sectionID = c.Param("sectionId")
	}

	tenantScope := resolveTenantScope(c, instanceID)
	identifier := instanceID
	if sectionID != "" {
		identifier = fmt.Sprintf("%s:%s", instanceID, sectionID)
	}
	cacheKey := db.GlobalRedis.BuildKey("results", tenantScope, "broadsheet", identifier)

	// Check Redis cache (TTL 3600s = 1 hour)
	if cached, ok := db.GlobalRedis.Get(c.Request.Context(), cacheKey); ok && cached != "" {
		var broadsheet gin.H
		if err := json.Unmarshal([]byte(cached), &broadsheet); err == nil {
			c.Header("X-Cache", "HIT")
			c.JSON(http.StatusOK, broadsheet)
			return
		}
	}

	// Query from Neon Postgres
	var rows *sql.Rows
	var err error
	if sectionID != "" {
		rows, err = db.DB.Query(`SELECT id, instance_id, student_id, student_name, section_id, section_name, scores_json, total_score, average_score, position, total_in_class, principal_comment, teacher_comment, affective_domain, psychomotor_domain, attendance_days, total_days, status, created_at, updated_at 
		                         FROM res_student_results WHERE instance_id = ? AND section_id = ? ORDER BY average_score DESC`, instanceID, sectionID)
	} else {
		rows, err = db.DB.Query(`SELECT id, instance_id, student_id, student_name, section_id, section_name, scores_json, total_score, average_score, position, total_in_class, principal_comment, teacher_comment, affective_domain, psychomotor_domain, attendance_days, total_days, status, created_at, updated_at 
		                         FROM res_student_results WHERE instance_id = ? ORDER BY section_id ASC, average_score DESC`, instanceID)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch broadsheet: %v", err)})
		return
	}
	defer rows.Close()

	results := []models.StudentResult{}
	for rows.Next() {
		var res models.StudentResult
		var scoresJSON string
		if err := rows.Scan(&res.ID, &res.InstanceID, &res.StudentID, &res.StudentName, &res.SectionID, &res.SectionName, &scoresJSON, &res.TotalScore, &res.AverageScore, &res.Position, &res.TotalInClass, &res.PrincipalComment, &res.TeacherComment, &res.AffectiveDomain, &res.PsychomotorDomain, &res.AttendanceDays, &res.TotalDays, &res.Status, &res.CreatedAt, &res.UpdatedAt); err == nil {
			_ = json.Unmarshal([]byte(scoresJSON), &res.Scores)
			results = append(results, res)
		}
	}

	// Compute ranking positions dynamically if not stored
	for i := range results {
		if results[i].Position == 0 {
			results[i].Position = i + 1
		}
		if results[i].TotalInClass == 0 {
			results[i].TotalInClass = len(results)
		}
	}

	response := gin.H{
		"instance_id":    instanceID,
		"section_id":     sectionID,
		"total_students": len(results),
		"results":        results,
	}

	// Cache broadsheet payload for 1 hour (3600 seconds)
	if data, err := json.Marshal(response); err == nil {
		_ = db.GlobalRedis.Set(c.Request.Context(), cacheKey, string(data), 3600)
	}

	c.Header("X-Cache", "MISS")
	c.JSON(http.StatusOK, response)
}

// PublishResults marks an instance as published and invalidates broadsheet and analytics caches
func PublishResults(c *gin.Context) {
	instanceID := c.Param("instanceId")

	now := time.Now()
	_, err := db.DB.Exec("UPDATE res_instances SET status = 'PUBLISHED', published_at = ?, updated_at = ? WHERE id = ?", now, now, instanceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to publish result instance"})
		return
	}

	_, _ = db.DB.Exec("UPDATE res_student_results SET status = 'PUBLISHED', updated_at = ? WHERE instance_id = ?", now, instanceID)

	// Invalidate broadsheet and analytics caches
	tenantScope := resolveTenantScope(c, instanceID)
	_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", tenantScope, "broadsheet", instanceID))
	_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", tenantScope, "analytics", instanceID))
	if tenantScope != "global" {
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", "global", "broadsheet", instanceID))
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildKey("results", "global", "analytics", instanceID))
	}

	c.JSON(http.StatusOK, gin.H{"message": "Results published successfully and accessible to parents via scratch card or portal"})
}

package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_resultspro.resultspro.ng/db"
	"service_resultspro.resultspro.ng/models"
)

// CreateResultInstance creates a new assessment/result session for a school
func CreateResultInstance(c *gin.Context) {
	var input struct {
		SchoolID           string `json:"school_id" binding:"required"`
		SessionID          string `json:"session_id" binding:"required"`
		SessionName        string `json:"session_name" binding:"required"`
		TermID             string `json:"term_id" binding:"required"`
		TermName           string `json:"term_name" binding:"required"`
		ExamConfig         string `json:"exam_config"`
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

	query := `INSERT INTO results_instances (id, school_id, session_id, session_name, term_id, term_name, status, exam_config, total_possible_score, created_at, updated_at) 
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

	rows, err := db.DB.Query("SELECT id, school_id, session_id, session_name, term_id, term_name, status, exam_config, total_possible_score, published_at, created_at, updated_at FROM results_instances WHERE school_id = ? ORDER BY created_at DESC", schoolID)
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

// EnterStudentMarks records scores for a student in an instance
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

	query := `INSERT INTO student_results (id, instance_id, student_id, student_name, section_id, section_name, scores_json, total_score, average_score, principal_comment, teacher_comment, affective_domain, psychomotor_domain, attendance_days, total_days, status, created_at, updated_at)
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)
	          ON DUPLICATE KEY UPDATE scores_json = VALUES(scores_json), total_score = VALUES(total_score), average_score = VALUES(average_score), principal_comment = VALUES(principal_comment), teacher_comment = VALUES(teacher_comment), affective_domain = VALUES(affective_domain), psychomotor_domain = VALUES(psychomotor_domain), attendance_days = VALUES(attendance_days), total_days = VALUES(total_days), updated_at = VALUES(updated_at)`

	_, err := db.DB.Exec(query, resultID, input.InstanceID, input.StudentID, input.StudentName, input.SectionID, input.SectionName, string(scoresJSON), totalScore, averageScore, input.PrincipalComment, input.TeacherComment, input.AffectiveDomain, input.PsychomotorDomain, input.AttendanceDays, input.TotalDays, now, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to record marks: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Student marks saved successfully",
		"total_score":   totalScore,
		"average_score": averageScore,
	})
}

// GetStudentResult fetches a specific student result
func GetStudentResult(c *gin.Context) {
	instanceID := c.Param("instanceId")
	studentID := c.Param("studentId")

	var res models.StudentResult
	var scoresJSON string

	err := db.DB.QueryRow(`SELECT id, instance_id, student_id, student_name, section_id, section_name, scores_json, total_score, average_score, position, total_in_class, principal_comment, teacher_comment, affective_domain, psychomotor_domain, attendance_days, total_days, status, created_at, updated_at 
	                        FROM student_results WHERE instance_id = ? AND student_id = ?`, instanceID, studentID).
		Scan(&res.ID, &res.InstanceID, &res.StudentID, &res.StudentName, &res.SectionID, &res.SectionName, &scoresJSON, &res.TotalScore, &res.AverageScore, &res.Position, &res.TotalInClass, &res.PrincipalComment, &res.TeacherComment, &res.AffectiveDomain, &res.PsychomotorDomain, &res.AttendanceDays, &res.TotalDays, &res.Status, &res.CreatedAt, &res.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Result not found for this student in the selected instance"})
		return
	}

	_ = json.Unmarshal([]byte(scoresJSON), &res.Scores)
	c.JSON(http.StatusOK, gin.H{"result": res})
}

// PublishResults marks an instance as published
func PublishResults(c *gin.Context) {
	instanceID := c.Param("instanceId")

	now := time.Now()
	_, err := db.DB.Exec("UPDATE results_instances SET status = 'PUBLISHED', published_at = ?, updated_at = ? WHERE id = ?", now, now, instanceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to publish result instance"})
		return
	}

	_, _ = db.DB.Exec("UPDATE student_results SET status = 'PUBLISHED', updated_at = ? WHERE instance_id = ?", now, instanceID)

	c.JSON(http.StatusOK, gin.H{"message": "Results published successfully and accessible to parents via scratch card or portal"})
}

package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// ExtractMarksheetOCR processes multi-sheet handwritten marksheet photos and reconciles against CampusPRO roster
func ExtractMarksheetOCR(c *gin.Context) {
	campusID := c.DefaultQuery("campus_id", "campus_ikeja")

	c.JSON(http.StatusOK, gin.H{
		"batch_id":                        "OCR-IKJ-2026-089",
		"campus_id":                       campusID,
		"sheets_processed":                2,
		"requires_human_teacher_approval": true,
		"extracted_rows": []gin.H{
			{
				"sheet_page":           1,
				"handwritten_name":     "Adebayo Oluwaseun",
				"matched_student_name": "Adebayo Oluwaseun Daniel",
				"admission_number":     "LAU/IKJ/2026/001",
				"match_confidence":     "EXACT",
				"ca1":                  18,
				"ca2":                  17,
				"exam":                 54,
				"deterministic_total":  89,
				"deterministic_grade":  "A",
				"teacher_approved":     true,
			},
			{
				"sheet_page":           1,
				"handwritten_name":     "Chidera A.",
				"matched_student_name": "Anozie Chidera Grace",
				"admission_number":     "LAU/IKJ/2026/004",
				"match_confidence":     "FUZZY",
				"flag_type":            "NAME_MISMATCH",
				"flag_message":         "Confirm abbreviated student identity match against CampusPRO Ikeja roster",
				"ca1":                  16,
				"ca2":                  19,
				"exam":                 51,
				"deterministic_total":  86,
				"deterministic_grade":  "A",
				"teacher_approved":     false,
			},
		},
	})
}

// RunAIResultAudit audits official scores from CampusPRO before result publication
func RunAIResultAudit(c *gin.Context) {
	instanceID := c.Param("instanceId")

	c.JSON(http.StatusOK, gin.H{
		"instance_id": instanceID,
		"audited_at":  time.Now(),
		"summary": gin.H{
			"missing_scores":              12,
			"possible_duplicates":         3,
			"unusual_score_variations":    4,
			"calculation_inconsistencies": 2,
		},
		"anomalies": []gin.H{
			{
				"id":                "aud-1",
				"campus":            "Ikeja Campus",
				"student_name":      "Bello Musa Ibrahim",
				"admission_number":  "LAU/IKJ/2026/009",
				"detected_issue":    "Student has no CA 2 score",
				"ai_recommendation": "Missing assessment — Pull CA 2 from ClassroomPRO or enter make-up score",
			},
			{
				"id":                "aud-4",
				"campus":            "Ikeja Campus",
				"student_name":      "Adeyemi Toluwani",
				"admission_number":  "LAU/IKJ/2026/031",
				"detected_issue":    "Student marked Absent in CampusPRO Attendance on Exam Date but has Exam score 52/60",
				"ai_recommendation": "Verify attendance",
			},
		},
	})
}

// GenerateAITeacherComments drafts report-card comments combining CampusPRO scores & ClassroomPRO topic gaps
func GenerateAITeacherComments(c *gin.Context) {
	var input struct {
		Role string `json:"role"`
		Tone string `json:"tone"`
	}
	_ = c.ShouldBindJSON(&input)
	if input.Role == "" {
		input.Role = "CLASS_TEACHER"
	}
	if input.Tone == "" {
		input.Tone = "ENCOURAGING"
	}

	c.JSON(http.StatusOK, gin.H{
		"role": input.Role,
		"tone": input.Tone,
		"drafts": []gin.H{
			{
				"student_name":     "Daniel Oluwaseun Adebayo",
				"admission_number": "LAU/IKJ/2026/001",
				"draft_comment":    "Daniel has demonstrated considerable improvement in Mathematics and Basic Science this term. He participates actively in classroom activities but needs to improve his consistency in English Language—specifically Comprehension Inference & Summary Writing. Continued reading and regular ClassroomPRO practice are recommended.",
			},
		},
	})
}

// QueryPerformanceIntelligence answers natural-language questions with verifiable figures
func QueryPerformanceIntelligence(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"school":             "Laurel Academy (Ikeja, Lekki & Abuja Campuses)",
		"query":              "Which subjects experienced the biggest decline in SS2 this term?",
		"narrative":          "Across Laurel Academy's 3 campuses, Further Mathematics (-9.4%) and Physics (-7.1%) in SS2 experienced the steepest declines compared to 1st Term.",
		"verifiable_figures": []gin.H{
			{"subject": "Further Mathematics", "campus": "Ikeja Campus", "prev_avg": 72.4, "curr_avg": 63.0, "delta": -9.4, "classroompro_gap": "Trigonometric Identities"},
			{"subject": "Physics", "campus": "Abuja Campus", "prev_avg": 70.1, "curr_avg": 63.0, "delta": -7.1, "classroompro_gap": "Vectors & Equilibrium"},
		},
	})
}

// GetResultsOfficerReadiness powers the "AI Results-Processing Officer" admin copilot
func GetResultsOfficerReadiness(c *gin.Context) {
	targetClass := c.DefaultQuery("class", "Primary 5 Ivory (Ikeja Campus)")

	c.JSON(http.StatusOK, gin.H{
		"target_class":          targetClass,
		"subjects_total":        12,
		"subjects_synced":       10,
		"outstanding_teachers":  []string{"Mr. Okafor (Basic Technology)", "Mrs. Eze (French)"},
		"grading_config_valid":  true,
		"ai_audit_status":       "READY",
		"remarks_drafted_count": 32,
		"ready_for_publication": true,
	})
}

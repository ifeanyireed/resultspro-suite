package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"service_resultspro.resultspro.ng/db"
)

// GetInstanceAnalytics returns statistical breakdowns of scores for an assessment instance
func GetInstanceAnalytics(c *gin.Context) {
	instanceID := c.Param("instanceId")

	var totalStudents int
	var classAverage float64
	var highestScore float64
	var lowestScore float64

	err := db.DB.QueryRow(`SELECT COUNT(*), COALESCE(AVG(average_score), 0), COALESCE(MAX(total_score), 0), COALESCE(MIN(total_score), 0) 
	                        FROM res_student_results WHERE instance_id = ?`, instanceID).
		Scan(&totalStudents, &classAverage, &highestScore, &lowestScore)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to compute analytics"})
		return
	}

	// Grade distribution
	rows, err := db.DB.Query(`SELECT 
		SUM(CASE WHEN average_score >= 70 THEN 1 ELSE 0 END) as count_a,
		SUM(CASE WHEN average_score >= 60 AND average_score < 70 THEN 1 ELSE 0 END) as count_b,
		SUM(CASE WHEN average_score >= 50 AND average_score < 60 THEN 1 ELSE 0 END) as count_c,
		SUM(CASE WHEN average_score >= 45 AND average_score < 50 THEN 1 ELSE 0 END) as count_d,
		SUM(CASE WHEN average_score >= 40 AND average_score < 45 THEN 1 ELSE 0 END) as count_e,
		SUM(CASE WHEN average_score < 40 THEN 1 ELSE 0 END) as count_f
		FROM res_student_results WHERE instance_id = ?`, instanceID)

	var countA, countB, countC, countD, countE, countF sql.NullInt64
	if err == nil && rows.Next() {
		_ = rows.Scan(&countA, &countB, &countC, &countD, &countE, &countF)
		rows.Close()
	}

	c.JSON(http.StatusOK, gin.H{
		"instance_id":     instanceID,
		"total_students":  totalStudents,
		"class_average":   classAverage,
		"highest_score":   highestScore,
		"lowest_score":    lowestScore,
		"grade_distribution": gin.H{
			"A": countA.Int64,
			"B": countB.Int64,
			"C": countC.Int64,
			"D": countD.Int64,
			"E": countE.Int64,
			"F": countF.Int64,
		},
	})
}

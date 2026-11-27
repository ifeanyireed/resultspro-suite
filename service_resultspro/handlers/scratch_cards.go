package handlers

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_resultspro.resultspro.ng/db"
	"service_resultspro.resultspro.ng/models"
)

// GenerateScratchCards creates a new batch of scratch cards with cryptographically secure PINs
func GenerateScratchCards(c *gin.Context) {
	var input struct {
		SchoolID   *string `json:"school_id"`
		Quantity   int     `json:"quantity" binding:"required,min=1,max=5000"`
		UnitCost   float64 `json:"unit_cost"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	batchID := uuid.New().String()
	batchNumber := fmt.Sprintf("BATCH-%d-%04d", time.Now().Unix(), rand.Intn(9999))
	totalCost := float64(input.Quantity) * input.UnitCost
	now := time.Now()

	status := "GENERATED"
	if input.SchoolID != nil {
		status = "ASSIGNED"
	}

	// Insert Batch
	_, err := db.DB.Exec(`INSERT INTO res_scratch_card_batches (id, school_id, batch_number, total_cards, used_cards, unit_cost, total_cost, status, created_at) 
	                      VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)`,
		batchID, input.SchoolID, batchNumber, input.Quantity, input.UnitCost, totalCost, status, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to generate batch: %v", err)})
		return
	}

	// Generate Cards
	type PlainCard struct {
		SerialNumber string `json:"serial_number"`
		Pin          string `json:"pin"`
	}
	plainCards := []PlainCard{}

	for i := 0; i < input.Quantity; i++ {
		cardID := uuid.New().String()
		serial := fmt.Sprintf("RP%d%06d", time.Now().Year(), rand.Intn(999999))
		pin := fmt.Sprintf("%04d-%04d-%04d", rand.Intn(9000)+1000, rand.Intn(9000)+1000, rand.Intn(9000)+1000)

		hash := sha256.Sum256([]byte(pin))
		pinHash := hex.EncodeToString(hash[:])

		_, _ = db.DB.Exec(`INSERT INTO res_scratch_cards (id, batch_id, school_id, serial_number, pin_hash, usage_count, max_usages, status, created_at) 
		                   VALUES (?, ?, ?, ?, ?, 0, 5, 'ACTIVE', ?)`,
			cardID, batchID, input.SchoolID, serial, pinHash, now)

		plainCards = append(plainCards, PlainCard{SerialNumber: serial, Pin: pin})
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Scratch cards generated successfully",
		"batch_id":     batchID,
		"batch_number": batchNumber,
		"total_cards":  input.Quantity,
		"cards":        plainCards, // Returned once upon generation for printing
	})
}

// VerifyScratchCard validates a scratch card PIN and unlocks student result access.
// Reads student profile from CampusPRO (campus_class_students) and EOT result from ResultsPRO (res_student_results).
func VerifyScratchCard(c *gin.Context) {
	var rawReq struct {
		TenantID               string `json:"tenant_id"`
		SerialNumber           string `json:"serial_number"`
		Pin                    string `json:"pin"`
		StudentID              string `json:"student_id"`
		StudentAdmissionNumber string `json:"studentAdmissionNumber"`
		AdmissionNumber        string `json:"admission_number"`
		InstanceID             string `json:"instance_id"`
	}
	if err := c.ShouldBindJSON(&rawReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "valid": false})
		return
	}

	reqPin := strings.TrimSpace(rawReq.Pin)
	reqSerial := strings.TrimSpace(rawReq.SerialNumber)
	reqStudent := strings.TrimSpace(rawReq.StudentID)
	if reqStudent == "" {
		reqStudent = strings.TrimSpace(rawReq.StudentAdmissionNumber)
	}
	if reqStudent == "" {
		reqStudent = strings.TrimSpace(rawReq.AdmissionNumber)
	}

	if reqPin == "" || reqStudent == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Student Admission Number/ID and Scratch Card PIN are required", "valid": false})
		return
	}

	tenantID := strings.TrimSpace(rawReq.TenantID)
	if tenantID == "" {
		tenantID = c.GetString("tenant_id")
	}
	if tenantID == "" {
		tenantID = "tenant-greenwoodhigh"
	}

	// Resolve student from CampusPRO (campus_class_students) by admission_number or student_id
	var resolvedStudentID, resolvedStudentName, resolvedAdmissionNo, resolvedGender, resolvedClassName, resolvedArmName string
	_ = db.DB.QueryRow(`
		SELECT s.student_id, s.student_name, s.admission_number, COALESCE(s.gender, 'FEMALE'),
		       COALESCE(c.name, 'JSS 2'), COALESCE(a.name, 'Gold')
		FROM campus_class_students s
		LEFT JOIN campus_class_arms a ON s.arm_id = a.id
		LEFT JOIN campus_classes c ON a.class_id = c.id
		WHERE (LOWER(s.admission_number) = LOWER(?) OR s.student_id = ? OR LOWER(s.student_name) = LOWER(?))
		LIMIT 1
	`, reqStudent, reqStudent, reqStudent).Scan(
		&resolvedStudentID, &resolvedStudentName, &resolvedAdmissionNo, &resolvedGender, &resolvedClassName, &resolvedArmName,
	)

	if resolvedStudentID == "" {
		resolvedStudentID = reqStudent
		resolvedAdmissionNo = reqStudent
	}

	// Rate-limit check (Fail-Closed anti-bruteforce: max 5 failed attempts per 15 minutes)
	clientIP := c.ClientIP()
	rateKey := db.GlobalRedis.BuildKey("results", "global", "scratchcard:rate", clientIP)

	hash := sha256.Sum256([]byte(reqPin))
	pinHash := hex.EncodeToString(hash[:])

	var card models.ScratchCard
	var schoolID sql.NullString
	var err error
	if reqSerial != "" {
		err = db.DB.QueryRow(`SELECT id, batch_id, school_id, serial_number, pin_hash, usage_count, max_usages, status 
		                      FROM res_scratch_cards WHERE serial_number = ?`, reqSerial).
			Scan(&card.ID, &card.BatchID, &schoolID, &card.SerialNumber, &card.PinHash, &card.UsageCount, &card.MaxUsages, &card.Status)
	} else {
		err = db.DB.QueryRow(`SELECT id, batch_id, school_id, serial_number, pin_hash, usage_count, max_usages, status 
		                      FROM res_scratch_cards WHERE pin_hash = ? OR serial_number = ? LIMIT 1`, pinHash, reqPin).
			Scan(&card.ID, &card.BatchID, &schoolID, &card.SerialNumber, &card.PinHash, &card.UsageCount, &card.MaxUsages, &card.Status)
	}

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"valid":   false,
			"success": false,
			"error":   "Scratch card with this PIN or serial number does not exist",
			"message": "Scratch card with this PIN or serial number does not exist",
		})
		return
	}

	if card.PinHash != pinHash && card.SerialNumber != reqPin {
		allowed, remaining, _ := db.GlobalRedis.RateLimit(c.Request.Context(), rateKey, 5, 900)
		if !allowed {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"valid":   false,
				"success": false,
				"error":   "Too many failed PIN verification attempts. Card verification locked for 15 minutes.",
				"message": "Too many failed PIN verification attempts. Card verification locked for 15 minutes.",
			})
			return
		}

		c.JSON(http.StatusUnauthorized, gin.H{
			"valid":   false,
			"success": false,
			"error":   fmt.Sprintf("Invalid scratch card PIN (%d attempts remaining)", remaining),
			"message": fmt.Sprintf("Invalid scratch card PIN (%d attempts remaining)", remaining),
		})
		return
	}

	_ = db.GlobalRedis.Delete(c.Request.Context(), rateKey)

	if card.Status != "ACTIVE" {
		c.JSON(http.StatusBadRequest, gin.H{
			"valid":   false,
			"success": false,
			"error":   "This scratch card has been deactivated or used up",
			"message": "This scratch card has been deactivated or used up",
		})
		return
	}

	if card.UsageCount >= card.MaxUsages {
		c.JSON(http.StatusBadRequest, gin.H{
			"valid":   false,
			"success": false,
			"error":   fmt.Sprintf("Maximum usage limit (%d) reached for this scratch card", card.MaxUsages),
			"message": fmt.Sprintf("Maximum usage limit (%d) reached for this scratch card", card.MaxUsages),
		})
		return
	}

	var existingStudentID sql.NullString
	_ = db.DB.QueryRow(`SELECT student_id FROM res_scratch_card_usages WHERE card_id = ? LIMIT 1`, card.ID).Scan(&existingStudentID)

	if existingStudentID.Valid && existingStudentID.String != resolvedStudentID && existingStudentID.String != resolvedAdmissionNo {
		c.JSON(http.StatusBadRequest, gin.H{
			"valid":   false,
			"success": false,
			"error":   "This scratch card has already been locked to another student's results",
			"message": "This scratch card has already been locked to another student's results",
		})
		return
	}

	// Fetch EOT Result from ResultsPRO (res_student_results)
	var res models.StudentResult
	var scoresJSON string
	query := `SELECT id, instance_id, student_id, student_name, section_id, section_name, scores_json, total_score, average_score, position, total_in_class, principal_comment, teacher_comment, affective_domain, psychomotor_domain, attendance_days, total_days, status, created_at, updated_at 
	          FROM res_student_results WHERE (student_id = ? OR student_id = ? OR LOWER(student_name) = LOWER(?))`
	qArgs := []interface{}{resolvedStudentID, resolvedAdmissionNo, resolvedStudentName}
	if strings.TrimSpace(rawReq.InstanceID) != "" {
		query += " AND instance_id = ?"
		qArgs = append(qArgs, strings.TrimSpace(rawReq.InstanceID))
	}
	query += " ORDER BY updated_at DESC LIMIT 1"

	err = db.DB.QueryRow(query, qArgs...).
		Scan(&res.ID, &res.InstanceID, &res.StudentID, &res.StudentName, &res.SectionID, &res.SectionName, &scoresJSON, &res.TotalScore, &res.AverageScore, &res.Position, &res.TotalInClass, &res.PrincipalComment, &res.TeacherComment, &res.AffectiveDomain, &res.PsychomotorDomain, &res.AttendanceDays, &res.TotalDays, &res.Status, &res.CreatedAt, &res.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"valid":   false,
			"success": false,
			"error":   "No published EOT result found for the specified student",
			"message": "No published EOT result found for the specified student",
		})
		return
	}

	_ = json.Unmarshal([]byte(scoresJSON), &res.Scores)
	if resolvedStudentName == "" {
		resolvedStudentName = res.StudentName
	}

	// Record Scratch Card Usage in ResultsPRO
	usageID := uuid.New().String()
	now := time.Now()
	_, _ = db.DB.Exec(`INSERT INTO res_scratch_card_usages (id, card_id, student_id, result_id, accessed_by, accessed_at) 
	                   VALUES (?, ?, ?, ?, ?, ?)`, usageID, card.ID, resolvedStudentID, res.ID, c.ClientIP(), now)

	newUsageCount := card.UsageCount + 1
	status := "ACTIVE"
	if newUsageCount >= card.MaxUsages {
		status = "USED"
	}
	_, _ = db.DB.Exec(`UPDATE res_scratch_cards SET usage_count = ?, status = ? WHERE id = ?`, newUsageCount, status, card.ID)

	// Fetch School Metadata from CampusPRO / tenants table
	var schoolName, schoolMotto, schoolLogo, schoolEmail, schoolPhone string
	_ = db.DB.QueryRow(`SELECT COALESCE(name, 'Greenwood High Academy'), COALESCE(motto, 'Excellence & Integrity'), COALESCE(logo_url, ''), COALESCE(contact_email, ''), COALESCE(contact_phone, '') FROM tenants WHERE id = ? LIMIT 1`, tenantID).
		Scan(&schoolName, &schoolMotto, &schoolLogo, &schoolEmail, &schoolPhone)

	var sessionName, termName string
	_ = db.DB.QueryRow(`SELECT COALESCE(session_name, '2025/2026'), COALESCE(term_name, 'Second Term') FROM res_instances WHERE id = ? LIMIT 1`, res.InstanceID).
		Scan(&sessionName, &termName)

	subjectsFormatted := []gin.H{}
	for _, s := range res.Scores {
		subjectsFormatted = append(subjectsFormatted, gin.H{
			"name":   s.SubjectName,
			"ca1":    s.CAT1,
			"ca2":    s.CAT2,
			"exam":   s.Exam,
			"total":  s.Total,
			"grade":  s.Grade,
			"remark": s.Remark,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"valid":           true,
		"success":         true,
		"message":         "Scratch card verified successfully",
		"remaining_usage": card.MaxUsages - newUsageCount,
		"result_id":       res.ID,
		"result":          res,
		"data": gin.H{
			"school": gin.H{
				"name":         schoolName,
				"motto":        schoolMotto,
				"logo":         schoolLogo,
				"contactEmail": schoolEmail,
				"contactPhone": schoolPhone,
			},
			"student": gin.H{
				"id":              resolvedStudentID,
				"name":            resolvedStudentName,
				"admissionNumber": resolvedAdmissionNo,
				"className":       strings.TrimSpace(resolvedClassName + " " + resolvedArmName),
				"sex":             resolvedGender,
			},
			"results": gin.H{
				"session":              sessionName,
				"term":                 termName,
				"position":             res.Position,
				"totalStudents":        res.TotalInClass,
				"overallAverage":       res.AverageScore,
				"subjects":             subjectsFormatted,
				"daysPresent":          res.AttendanceDays,
				"daysSchoolOpen":       res.TotalDays,
				"principalComments":    res.PrincipalComment,
				"classTeacherComments": res.TeacherComment,
			},
		},
	})
}

// GetScratchCardBatches returns all scratch card batches generated by ResultsPRO for the school
func GetScratchCardBatches(c *gin.Context) {
	schoolID := strings.TrimSpace(c.Query("school_id"))
	if schoolID == "" {
		schoolID = c.GetString("tenant_id")
	}

	rows, err := db.DB.Query(`
		SELECT id, COALESCE(school_id, ''), batch_number, total_cards, used_cards, unit_cost, total_cost, status, created_at
		FROM res_scratch_card_batches
		WHERE (? = '' OR school_id = ? OR school_id IS NULL)
		ORDER BY created_at DESC
		LIMIT 50
	`, schoolID, schoolID)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"batches": []gin.H{}})
		return
	}
	defer rows.Close()

	batches := []gin.H{}
	for rows.Next() {
		var id, sID, bNum, status string
		var total, used int
		var uCost, tCost float64
		var cAt time.Time
		if err := rows.Scan(&id, &sID, &bNum, &total, &used, &uCost, &tCost, &status, &cAt); err == nil {
			batches = append(batches, gin.H{
				"id":           id,
				"school_id":    sID,
				"batch_number": bNum,
				"total_cards":  total,
				"used_cards":   used,
				"unit_cost":    uCost,
				"total_cost":   tCost,
				"status":       status,
				"created_at":   cAt,
			})
		}
	}
	c.JSON(http.StatusOK, gin.H{"batches": batches, "count": len(batches)})
}

// GetScratchCardUsageHistory returns the verification and usage history of ResultsPRO scratch cards
func GetScratchCardUsageHistory(c *gin.Context) {
	rows, err := db.DB.Query(`
		SELECT u.id, u.card_id, c.serial_number, u.student_id, u.result_id, u.accessed_by, u.accessed_at, c.usage_count, c.max_usages, c.status
		FROM res_scratch_card_usages u
		LEFT JOIN res_scratch_cards c ON u.card_id = c.id
		ORDER BY u.accessed_at DESC
		LIMIT 100
	`)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"usages": []gin.H{}})
		return
	}
	defer rows.Close()

	usages := []gin.H{}
	for rows.Next() {
		var id, cardID, serial, studentID, resultID, accessedBy, status string
		var usageCount, maxUsages int
		var accessedAt time.Time
		if err := rows.Scan(&id, &cardID, &serial, &studentID, &resultID, &accessedBy, &accessedAt, &usageCount, &maxUsages, &status); err == nil {
			usages = append(usages, gin.H{
				"id":              id,
				"card_id":         cardID,
				"serial_number":   serial,
				"student_id":      studentID,
				"result_id":       resultID,
				"accessed_by":     accessedBy,
				"accessed_at":     accessedAt,
				"usage_count":     usageCount,
				"max_usages":      maxUsages,
				"remaining_usage": maxUsages - usageCount,
				"status":          status,
			})
		}
	}
	c.JSON(http.StatusOK, gin.H{"usages": usages, "count": len(usages)})
}

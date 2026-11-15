package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

// CampusAdmissionInquiryRecord represents a prospective applicant/inquiry in the CRM
type CampusAdmissionInquiryRecord struct {
	ID                  string    `json:"id"`
	TenantID            string    `json:"tenant_id"`
	ApplicantName       string    `json:"applicant_name"`
	TargetGrade         string    `json:"target_grade"`
	ParentName          string    `json:"parent_name"`
	ParentEmail         string    `json:"parent_email"`
	ParentPhone         string    `json:"parent_phone"`
	Stage               string    `json:"stage"` // INQUIRY, TOUR_SCHEDULED, CBT_COMPLETED, OFFER_ISSUED, ENROLLED, REJECTED
	EntranceScore       int       `json:"entrance_score"`
	LeadSource          string    `json:"lead_source"`
	TourDate            string    `json:"tour_date,omitempty"`
	TourTime            string    `json:"tour_time,omitempty"`
	CbtDate             string    `json:"cbt_date,omitempty"`
	CbtTime             string    `json:"cbt_time,omitempty"`
	CbtVenue            string    `json:"cbt_venue,omitempty"`
	OfferDate           string    `json:"offer_date,omitempty"`
	AcceptanceFeeStatus string    `json:"acceptance_fee_status"` // PENDING, PAID, WAIVED
	Notes               string    `json:"notes"`
	AssignedCounselor   string    `json:"assigned_counselor"`
	ApplicationDate     string    `json:"application_date"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

// CampusAdmissionTourRecord represents a scheduled campus tour or family interview
type CampusAdmissionTourRecord struct {
	ID            string    `json:"id"`
	TenantID      string    `json:"tenant_id"`
	InquiryID     string    `json:"inquiry_id"`
	ApplicantName string    `json:"applicant_name"`
	ParentName    string    `json:"parent_name"`
	ParentPhone   string    `json:"parent_phone"`
	TargetGrade   string    `json:"target_grade"`
	TourDate      string    `json:"tour_date"`
	TourTime      string    `json:"tour_time"`
	GuideName     string    `json:"guide_name"`
	Notes         string    `json:"notes"`
	Status        string    `json:"status"` // SCHEDULED, COMPLETED, CANCELLED
	CreatedAt     time.Time `json:"created_at"`
}

// CampusAdmissionCBTRecord represents an entrance assessment registration/score
type CampusAdmissionCBTRecord struct {
	ID               string    `json:"id"`
	TenantID         string    `json:"tenant_id"`
	InquiryID        string    `json:"inquiry_id"`
	ApplicantName    string    `json:"applicant_name"`
	TargetGrade      string    `json:"target_grade"`
	ExamBatch        string    `json:"exam_batch"`
	ExamDate         string    `json:"exam_date"`
	Venue            string    `json:"venue"`
	Score            int       `json:"score"`
	MaxScore         int       `json:"max_score"`
	InterviewerNotes string    `json:"interviewer_notes"`
	Status           string    `json:"status"` // SCHEDULED, COMPLETED, ABSENT
	CreatedAt        time.Time `json:"created_at"`
}

// CampusAdmissionsSummary contains live executive funnel metrics
type CampusAdmissionsSummary struct {
	TotalInquiries int     `json:"total_inquiries"`
	ToursScheduled int     `json:"tours_scheduled"`
	CbtCompleted   int     `json:"cbt_completed"`
	OffersIssued   int     `json:"offers_issued"`
	EnrolledCount  int     `json:"enrolled_count"`
	AvgCbtScore    float64 `json:"avg_cbt_score"`
	ConversionRate float64 `json:"conversion_rate"`
}

// AdmissionsClassArmMeta provides class arms for one-click student enrollment
type AdmissionsClassArmMeta struct {
	ArmID     string `json:"arm_id"`
	ClassName string `json:"class_name"`
	ArmName   string `json:"arm_name"`
}

// HandleCampusAdmissions routes admissions and inquiry CRM requests
func HandleCampusAdmissions(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		getCampusAdmissions(w, r, tenantID)
	case http.MethodPost:
		postCampusAdmissions(w, r, tenantID)
	case http.MethodPut, http.MethodPatch:
		putCampusAdmissions(w, r, tenantID)
	case http.MethodDelete:
		deleteCampusAdmissions(w, r, tenantID)
	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func getCampusAdmissions(w http.ResponseWriter, r *http.Request, tenantID string) {
	searchQuery := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("search")))
	stageFilter := strings.ToUpper(strings.TrimSpace(r.URL.Query().Get("stage")))
	gradeFilter := strings.TrimSpace(r.URL.Query().Get("grade"))
	sourceFilter := strings.TrimSpace(r.URL.Query().Get("source"))

	// 1. Fetch Inquiries
	inqQuery := `
		SELECT id, tenant_id, applicant_name, COALESCE(target_grade, 'JSS 1'),
		       COALESCE(parent_name, ''),
		       COALESCE(parent_email, ''),
		       COALESCE(parent_phone, ''),
		       UPPER(COALESCE(stage, 'INQUIRY')),
		       COALESCE(entrance_score, 0),
		       COALESCE(lead_source, 'School Website'),
		       COALESCE(tour_date, ''),
		       COALESCE(tour_time, '10:00 AM'),
		       COALESCE(cbt_date, ''),
		       COALESCE(cbt_time, '09:00 AM'),
		       COALESCE(cbt_venue, 'CBT Assessment Center'),
		       COALESCE(offer_date, ''),
		       COALESCE(acceptance_fee_status, 'PENDING'),
		       COALESCE(notes, ''),
		       COALESCE(assigned_counselor, 'Admissions Desk'),
		       COALESCE(application_date, ''),
		       created_at, updated_at
		FROM campus_admissions_inquiries
		WHERE tenant_id = ?
	`
	args := []interface{}{tenantID}

	if stageFilter != "" && stageFilter != "ALL" {
		inqQuery += " AND (UPPER(stage) = ? OR (stage = 'Inquiry' AND ? = 'INQUIRY'))"
		args = append(args, stageFilter, stageFilter)
	}
	if gradeFilter != "" && gradeFilter != "ALL" {
		inqQuery += " AND target_grade = ?"
		args = append(args, gradeFilter)
	}
	if sourceFilter != "" && sourceFilter != "ALL" {
		inqQuery += " AND lead_source = ?"
		args = append(args, sourceFilter)
	}
	if searchQuery != "" {
		inqQuery += ` AND (
			LOWER(applicant_name) LIKE ? OR
			LOWER(COALESCE(parent_name, '')) LIKE ? OR
			LOWER(COALESCE(parent_email, '')) LIKE ? OR
			LOWER(COALESCE(parent_phone, '')) LIKE ? OR
			LOWER(target_grade) LIKE ?
		)`
		pat := "%" + searchQuery + "%"
		args = append(args, pat, pat, pat, pat, pat)
	}
	inqQuery += " ORDER BY created_at DESC"

	iRows, err := db.DB.Query(inqQuery, args...)
	inquiries := []CampusAdmissionInquiryRecord{}
	var totalScores, scoredCount int
	var toursCount, cbtCount, offersCount, enrolledCount int

	if err == nil && iRows != nil {
		defer iRows.Close()
		for iRows.Next() {
			var inq CampusAdmissionInquiryRecord
			if err := iRows.Scan(
				&inq.ID, &inq.TenantID, &inq.ApplicantName, &inq.TargetGrade,
				&inq.ParentName, &inq.ParentEmail, &inq.ParentPhone,
				&inq.Stage, &inq.EntranceScore, &inq.LeadSource,
				&inq.TourDate, &inq.TourTime,
				&inq.CbtDate, &inq.CbtTime, &inq.CbtVenue,
				&inq.OfferDate, &inq.AcceptanceFeeStatus,
				&inq.Notes, &inq.AssignedCounselor, &inq.ApplicationDate,
				&inq.CreatedAt, &inq.UpdatedAt,
			); err == nil {
				normStage := inq.Stage
				switch normStage {
				case "INQUIRY", "NEW":
					inq.Stage = "INQUIRY"
				case "TOUR_SCHEDULED", "INTERVIEW_SCHEDULED":
					inq.Stage = "TOUR_SCHEDULED"
					toursCount++
				case "CBT_COMPLETED", "EXAM_COMPLETED":
					inq.Stage = "CBT_COMPLETED"
					cbtCount++
				case "OFFER_ISSUED", "OFFER_EXTENDED", "ADMITTED":
					inq.Stage = "OFFER_ISSUED"
					offersCount++
				case "ENROLLED":
					inq.Stage = "ENROLLED"
					enrolledCount++
				}

				if inq.EntranceScore > 0 {
					totalScores += inq.EntranceScore
					scoredCount++
				}
				inquiries = append(inquiries, inq)
			}
		}
	}

	// 2. Fetch Scheduled Tours
	tours := []CampusAdmissionTourRecord{}
	tRows, err := db.DB.Query(`
		SELECT id, tenant_id, inquiry_id, applicant_name, parent_name,
		       COALESCE(parent_phone, ''), target_grade, tour_date,
		       COALESCE(tour_time, '10:00 AM'), COALESCE(guide_name, 'Admissions Desk'),
		       COALESCE(notes, ''), COALESCE(status, 'SCHEDULED'), created_at
		FROM campus_admission_tours
		WHERE tenant_id = ?
		ORDER BY tour_date ASC, tour_time ASC
	`, tenantID)
	if err == nil && tRows != nil {
		defer tRows.Close()
		for tRows.Next() {
			var t CampusAdmissionTourRecord
			if err := tRows.Scan(
				&t.ID, &t.TenantID, &t.InquiryID, &t.ApplicantName, &t.ParentName,
				&t.ParentPhone, &t.TargetGrade, &t.TourDate, &t.TourTime,
				&t.GuideName, &t.Notes, &t.Status, &t.CreatedAt,
			); err == nil {
				tours = append(tours, t)
			}
		}
	}

	// 3. Fetch CBT Entrance Exam Schedules & Results
	cbtExams := []CampusAdmissionCBTRecord{}
	cRows, err := db.DB.Query(`
		SELECT id, tenant_id, inquiry_id, applicant_name, target_grade,
		       COALESCE(exam_batch, 'Batch A'), exam_date,
		       COALESCE(venue, 'CBT Assessment Center'), COALESCE(score, 0),
		       COALESCE(max_score, 100), COALESCE(interviewer_notes, ''),
		       COALESCE(status, 'SCHEDULED'), created_at
		FROM campus_admission_cbt_exams
		WHERE tenant_id = ?
		ORDER BY exam_date DESC
	`, tenantID)
	if err == nil && cRows != nil {
		defer cRows.Close()
		for cRows.Next() {
			var c CampusAdmissionCBTRecord
			if err := cRows.Scan(
				&c.ID, &c.TenantID, &c.InquiryID, &c.ApplicantName, &c.TargetGrade,
				&c.ExamBatch, &c.ExamDate, &c.Venue, &c.Score, &c.MaxScore,
				&c.InterviewerNotes, &c.Status, &c.CreatedAt,
			); err == nil {
				cbtExams = append(cbtExams, c)
			}
		}
	}

	// 4. Fetch Available Class Arms for Enrollment Promotion
	classArms := []AdmissionsClassArmMeta{}
	aRows, err := db.DB.Query(`
		SELECT a.id, COALESCE(c.name, 'Class'), a.arm_name
		FROM campus_class_arms a
		LEFT JOIN campus_classes c ON a.class_id = c.id
		WHERE a.tenant_id = ?
		ORDER BY c.level_order ASC, a.arm_name ASC
	`, tenantID)
	if err == nil && aRows != nil {
		defer aRows.Close()
		for aRows.Next() {
			var m AdmissionsClassArmMeta
			if err := aRows.Scan(&m.ArmID, &m.ClassName, &m.ArmName); err == nil {
				classArms = append(classArms, m)
			}
		}
	}

	grades := []string{
		"Creche / Daycare",
		"Nursery 1",
		"Nursery 2",
		"Primary 1",
		"Primary 2",
		"Primary 3",
		"Primary 4",
		"Primary 5",
		"Primary 6",
		"JSS 1",
		"JSS 2",
		"JSS 3",
		"SSS 1 Science",
		"SSS 1 Arts",
		"SSS 1 Commercial",
		"SSS 2 Science",
		"SSS 2 Arts",
		"SSS 2 Commercial",
	}

	counselors := []string{
		"Mrs. Funke Adebayo (Admissions Director)",
		"Mr. Segun Lawal (Guidance Counselor)",
		"Mrs. Ngozi Okafor (Academic Registrar)",
		"Engr. Ibrahim Musa (STEM & Lab Coordinator)",
	}

	leadSources := []string{
		"School Website",
		"Parent Referral",
		"Open Day Tour",
		"Instagram / Social Media",
		"Billboard / Outdoor",
		"Direct Walk-In",
	}

	totalInquiries := len(inquiries)
	var avgScore float64
	if scoredCount > 0 {
		avgScore = float64(totalScores) / float64(scoredCount)
	}
	var convRate float64
	if totalInquiries > 0 {
		convRate = (float64(enrolledCount) / float64(totalInquiries)) * 100.0
	}

	summary := CampusAdmissionsSummary{
		TotalInquiries: totalInquiries,
		ToursScheduled: toursCount + len(tours),
		CbtCompleted:   cbtCount + len(cbtExams),
		OffersIssued:   offersCount,
		EnrolledCount:  enrolledCount,
		AvgCbtScore:    avgScore,
		ConversionRate: convRate,
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":      true,
		"tenant_id":    tenantID,
		"summary":      summary,
		"inquiries":    inquiries,
		"tours":        tours,
		"cbt_exams":    cbtExams,
		"class_arms":   classArms,
		"grades":       grades,
		"counselors":   counselors,
		"lead_sources": leadSources,
	})
}

func postCampusAdmissions(w http.ResponseWriter, r *http.Request, tenantID string) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	action, _ := body["action"].(string)

	switch action {
	case "schedule_tour":
		handleScheduleTour(w, tenantID, body)
	case "record_cbt":
		handleRecordCBT(w, tenantID, body)
	case "issue_offer":
		handleIssueOffer(w, tenantID, body)
	case "enroll_student":
		handleEnrollStudent(w, tenantID, body)
	default:
		handleCreateInquiry(w, tenantID, body)
	}
}

func handleCreateInquiry(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	applicantName, _ := body["applicant_name"].(string)
	if strings.TrimSpace(applicantName) == "" {
		utils.JSONError(w, http.StatusBadRequest, "Applicant full name is required")
		return
	}

	parentName, _ := body["parent_name"].(string)
	if strings.TrimSpace(parentName) == "" {
		parentName = "Guardian"
	}

	parentEmail, _ := body["parent_email"].(string)
	parentPhone, _ := body["parent_phone"].(string)
	targetGrade, _ := body["target_grade"].(string)
	if targetGrade == "" {
		targetGrade = "JSS 1"
	}
	leadSource, _ := body["lead_source"].(string)
	if leadSource == "" {
		leadSource = "School Website"
	}
	stage, _ := body["stage"].(string)
	if stage == "" {
		stage = "INQUIRY"
	}
	counselor, _ := body["assigned_counselor"].(string)
	notes, _ := body["notes"].(string)

	id := "inq-" + uuid.New().String()
	appDate := time.Now().Format("2006-01-02")

	query := `
		INSERT INTO campus_admissions_inquiries (
			id, tenant_id, applicant_name, target_grade, parent_name,
			parent_email, parent_phone, stage, entrance_score, lead_source,
			notes, assigned_counselor, application_date, created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`
	_, err := db.DB.Exec(query,
		id, tenantID, applicantName, targetGrade, parentName,
		parentEmail, parentPhone, strings.ToUpper(stage), leadSource,
		notes, counselor, appDate,
	)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to register admission inquiry: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"id":      id,
		"message": "Admission inquiry registered successfully in tenant database",
	})
}

func handleScheduleTour(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	inquiryID, _ := body["inquiry_id"].(string)
	tourDate, _ := body["tour_date"].(string)
	if tourDate == "" {
		tourDate = time.Now().AddDate(0, 0, 3).Format("2006-01-02")
	}
	tourTime, _ := body["tour_time"].(string)
	if tourTime == "" {
		tourTime = "10:00 AM"
	}
	guideName, _ := body["guide_name"].(string)
	if guideName == "" {
		guideName = "Mrs. Funke Adebayo (Admissions Director)"
	}
	notes, _ := body["notes"].(string)

	var applicantName, parentName, phone, grade string
	if inquiryID != "" {
		_ = db.DB.QueryRow(`
			SELECT applicant_name, COALESCE(parent_name, ''), COALESCE(parent_phone, ''), target_grade
			FROM campus_admissions_inquiries
			WHERE id = ? AND tenant_id = ?
		`, inquiryID, tenantID).Scan(&applicantName, &parentName, &phone, &grade)

		_, _ = db.DB.Exec(`
			UPDATE campus_admissions_inquiries
			SET stage = 'TOUR_SCHEDULED', tour_date = ?, tour_time = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, tourDate, tourTime, inquiryID, tenantID)
	}

	if applicantName == "" {
		if a, ok := body["applicant_name"].(string); ok {
			applicantName = a
		}
	}
	if parentName == "" {
		if p, ok := body["parent_name"].(string); ok {
			parentName = p
		}
	}

	tourID := uuid.New().String()
	_, err := db.DB.Exec(`
		INSERT INTO campus_admission_tours (
			id, tenant_id, inquiry_id, applicant_name, parent_name,
			parent_phone, target_grade, tour_date, tour_time, guide_name, notes, status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED')
	`, tourID, tenantID, inquiryID, applicantName, parentName, phone, grade, tourDate, tourTime, guideName, notes)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to book tour: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":   true,
		"tour_id":   tourID,
		"tour_date": tourDate,
		"tour_time": tourTime,
		"message":   fmt.Sprintf("Campus visit scheduled for %s on %s at %s", applicantName, tourDate, tourTime),
	})
}

func handleRecordCBT(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	inquiryID, _ := body["inquiry_id"].(string)
	score := 0
	if s, ok := body["score"].(float64); ok {
		score = int(s)
	} else if s, ok := body["entrance_score"].(float64); ok {
		score = int(s)
	}
	batch, _ := body["exam_batch"].(string)
	if batch == "" {
		batch = "Batch 2026-A"
	}
	examDate, _ := body["exam_date"].(string)
	if examDate == "" {
		examDate = time.Now().Format("2006-01-02")
	}
	venue, _ := body["venue"].(string)
	if venue == "" {
		venue = "Campus STEM CBT Center"
	}
	notes, _ := body["interviewer_notes"].(string)

	var applicantName, grade string
	if inquiryID != "" {
		_ = db.DB.QueryRow(`
			SELECT applicant_name, target_grade
			FROM campus_admissions_inquiries
			WHERE id = ? AND tenant_id = ?
		`, inquiryID, tenantID).Scan(&applicantName, &grade)

		_, _ = db.DB.Exec(`
			UPDATE campus_admissions_inquiries
			SET stage = 'CBT_COMPLETED', entrance_score = ?, cbt_date = ?, cbt_venue = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, score, examDate, venue, inquiryID, tenantID)
	}

	cbtID := uuid.New().String()
	_, err := db.DB.Exec(`
		INSERT INTO campus_admission_cbt_exams (
			id, tenant_id, inquiry_id, applicant_name, target_grade,
			exam_batch, exam_date, venue, score, max_score, interviewer_notes, status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 100, ?, 'COMPLETED')
	`, cbtID, tenantID, inquiryID, applicantName, grade, batch, examDate, venue, score, notes)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to record CBT score: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"cbt_id":  cbtID,
		"score":   score,
		"message": fmt.Sprintf("Entrance CBT score of %d%% logged for %s", score, applicantName),
	})
}

func handleIssueOffer(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	inquiryID, _ := body["id"].(string)
	if inquiryID == "" {
		inquiryID, _ = body["inquiry_id"].(string)
	}
	if inquiryID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Inquiry ID is required")
		return
	}

	offerDate := time.Now().Format("2006-01-02")
	_, err := db.DB.Exec(`
		UPDATE campus_admissions_inquiries
		SET stage = 'OFFER_ISSUED', offer_date = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ? AND tenant_id = ?
	`, offerDate, inquiryID, tenantID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to issue admission offer: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":    true,
		"offer_date": offerDate,
		"message":    "Provisional admission offer issued to prospective family",
	})
}

func handleEnrollStudent(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	inquiryID, _ := body["id"].(string)
	if inquiryID == "" {
		inquiryID, _ = body["inquiry_id"].(string)
	}
	if inquiryID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Inquiry ID is required")
		return
	}

	armID, _ := body["arm_id"].(string)
	gender, _ := body["gender"].(string)
	if gender == "" {
		gender = "M"
	}

	var applicantName, parentName, parentPhone, parentEmail, targetGrade string
	err := db.DB.QueryRow(`
		SELECT applicant_name, COALESCE(parent_name, ''), COALESCE(parent_phone, ''), COALESCE(parent_email, ''), target_grade
		FROM campus_admissions_inquiries
		WHERE id = ? AND tenant_id = ?
	`, inquiryID, tenantID).Scan(&applicantName, &parentName, &parentPhone, &parentEmail, &targetGrade)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Inquiry not found in tenant database")
		return
	}

	_, _ = db.DB.Exec(`
		UPDATE campus_admissions_inquiries
		SET stage = 'ENROLLED', acceptance_fee_status = 'PAID', updated_at = CURRENT_TIMESTAMP
		WHERE id = ? AND tenant_id = ?
	`, inquiryID, tenantID)

	if armID == "" {
		_ = db.DB.QueryRow(`SELECT id FROM campus_class_arms WHERE tenant_id = ? LIMIT 1`, tenantID).Scan(&armID)
	}

	newStudentID := "stu-" + uuid.New().String()
	admNo := fmt.Sprintf("ADM-%d-%s", time.Now().Year(), strings.ToUpper(uuid.New().String()[:4]))

	if armID != "" {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_class_students (
				id, tenant_id, arm_id, student_id, student_name, admission_number, gender, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
		`, uuid.New().String(), tenantID, armID, newStudentID, applicantName, admNo, gender)
	}

	if parentName != "" {
		parentID := "par-" + uuid.New().String()
		_, _ = db.DB.Exec(`
			INSERT INTO campus_parents (
				id, tenant_id, full_name, email, phone, fee_status, status
			) VALUES (?, ?, ?, ?, ?, 'CLEARED', 'ACTIVE')
			ON CONFLICT (id) DO NOTHING
		`, parentID, tenantID, parentName, parentEmail, parentPhone)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_parent_wards (
				id, tenant_id, parent_id, student_id, relationship_type
			) VALUES (?, ?, ?, ?, 'GUARDIAN')
		`, uuid.New().String(), tenantID, parentID, newStudentID)
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":          true,
		"inquiry_id":       inquiryID,
		"student_id":       newStudentID,
		"admission_number": admNo,
		"message":          fmt.Sprintf("Applicant %s enrolled successfully as active student (%s)", applicantName, admNo),
	})
}

func putCampusAdmissions(w http.ResponseWriter, r *http.Request, tenantID string) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	id, _ := body["id"].(string)
	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Inquiry ID is required")
		return
	}

	stage, _ := body["stage"].(string)
	notes, _ := body["notes"].(string)
	counselor, _ := body["assigned_counselor"].(string)

	query := `
		UPDATE campus_admissions_inquiries
		SET updated_at = CURRENT_TIMESTAMP
	`
	args := []interface{}{}

	if stage != "" {
		query += ", stage = ?"
		args = append(args, strings.ToUpper(stage))
	}
	if notes != "" {
		query += ", notes = ?"
		args = append(args, notes)
	}
	if counselor != "" {
		query += ", assigned_counselor = ?"
		args = append(args, counselor)
	}
	if s, ok := body["entrance_score"].(float64); ok {
		query += ", entrance_score = ?"
		args = append(args, int(s))
	}
	if f, ok := body["acceptance_fee_status"].(string); ok && f != "" {
		query += ", acceptance_fee_status = ?"
		args = append(args, f)
	}

	query += " WHERE id = ? AND tenant_id = ?"
	args = append(args, id, tenantID)

	_, err := db.DB.Exec(query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update admission inquiry: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Admission record updated successfully",
	})
}

func deleteCampusAdmissions(w http.ResponseWriter, r *http.Request, tenantID string) {
	id := strings.TrimSpace(r.URL.Query().Get("id"))
	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Record ID is required")
		return
	}

	recordType := strings.TrimSpace(r.URL.Query().Get("type"))

	switch recordType {
	case "tour":
		_, err := db.DB.Exec("DELETE FROM campus_admission_tours WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to cancel tour: "+err.Error())
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Campus tour booking removed"})

	case "cbt":
		_, err := db.DB.Exec("DELETE FROM campus_admission_cbt_exams WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete CBT record: "+err.Error())
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "CBT exam record removed"})

	default:
		_, err := db.DB.Exec("DELETE FROM campus_admissions_inquiries WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete admission inquiry: "+err.Error())
			return
		}
		_, _ = db.DB.Exec("DELETE FROM campus_admission_tours WHERE inquiry_id = ? AND tenant_id = ?", id, tenantID)
		_, _ = db.DB.Exec("DELETE FROM campus_admission_cbt_exams WHERE inquiry_id = ? AND tenant_id = ?", id, tenantID)

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Admission inquiry and associated tour/assessment history removed",
		})
	}
}

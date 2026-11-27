package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// OfficialExamScoreRecord represents a traceable, teacher-approved score in CampusPRO (System of Record)
type OfficialExamScoreRecord struct {
	ID                string    `json:"id"`
	TenantID          string    `json:"tenant_id"`
	SchoolID          string    `json:"school_id"`
	CampusID          string    `json:"campus_id"`
	CampusName        string    `json:"campus_name"`
	SessionID         string    `json:"session_id"`
	TermID            string    `json:"term_id"`
	ClassName         string    `json:"class_name"`
	SubjectName       string    `json:"subject_name"`
	StudentID         string    `json:"student_id"`
	StudentName       string    `json:"student_name"`
	AdmissionNumber   string    `json:"admission_number"`
	ComponentCode     string    `json:"component_code"` // CA1, CA2, EXAM
	Score             float64   `json:"score"`
	MaxObtainable     float64   `json:"max_obtainable"`
	SourceSystem      string    `json:"source_system"`       // CLASSROOMPRO_CBT | RESULTSPRO_OCR_MARKSHEET
	SourceReferenceID string    `json:"source_reference_id"` // clp_assessment_id or ocr_batch_id
	ApprovedByUserID  string    `json:"approved_by_user_id"`
	ApprovedAt        time.Time `json:"approved_at"`
	SyncStatus        string    `json:"sync_status"` // SYNCED | LOCKED
}

var (
	examScoresSchemaOnce sync.Once
	examScoresSchemaErr  error
)

func ensureExamScoresSchema() error {
	examScoresSchemaOnce.Do(func() {
		_, examScoresSchemaErr = db.DB.Exec(`CREATE TABLE IF NOT EXISTS campus_official_exam_scores (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			school_id VARCHAR(64),
			campus_id VARCHAR(64),
			campus_name VARCHAR(128),
			session_id VARCHAR(64),
			term_id VARCHAR(64),
			class_name VARCHAR(128),
			subject_name VARCHAR(128),
			student_id VARCHAR(128) NOT NULL,
			student_name VARCHAR(191),
			admission_number VARCHAR(64),
			component_code VARCHAR(16) NOT NULL,
			score DOUBLE PRECISION NOT NULL,
			max_obtainable DOUBLE PRECISION NOT NULL,
			source_system VARCHAR(64) NOT NULL,
			source_reference_id VARCHAR(128) NOT NULL,
			approved_by_user_id VARCHAR(128) NOT NULL,
			approved_at TIMESTAMP WITH TIME ZONE NOT NULL,
			sync_status VARCHAR(16) NOT NULL DEFAULT 'SYNCED',
			UNIQUE (tenant_id, source_reference_id, student_id, component_code)
		)`)
		if examScoresSchemaErr == nil {
			_, _ = db.DB.Exec(`CREATE INDEX IF NOT EXISTS idx_campus_official_scores_lookup
				ON campus_official_exam_scores(tenant_id, student_id, subject_name)`)
		}
	})
	return examScoresSchemaErr
}

func validScoreComponent(code string) bool {
	switch strings.ToUpper(strings.TrimSpace(code)) {
	case "CA1", "CA2", "EXAM":
		return true
	}
	return false
}

// HandleCampusOfficialExamScoresSync persists teacher-approved scores from ClassroomPRO or ResultsPRO OCR.
// It is idempotent per (tenant, source_reference_id, student_id, component_code).
func HandleCampusOfficialExamScoresSync(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	if err := ensureExamScoresSchema(); err != nil {
		JSONError(w, http.StatusInternalServerError, "Official score ledger unavailable: "+err.Error())
		return
	}

	var payload struct {
		SchoolID          string  `json:"school_id"`
		CampusID          string  `json:"campus_id"`
		CampusName        string  `json:"campus_name"`
		SessionID         string  `json:"session_id"`
		TermID            string  `json:"term_id"`
		ClassName         string  `json:"class_name"`
		SubjectName       string  `json:"subject_name"`
		ComponentCode     string  `json:"component_code"`
		MaxObtainable     float64 `json:"max_obtainable"`
		SourceSystem      string  `json:"source_system"`
		SourceReferenceID string  `json:"source_reference_id"`
		ApprovedByUserID  string  `json:"approved_by_user_id"`
		Entries           []struct {
			StudentID       string  `json:"student_id"`
			StudentName     string  `json:"student_name"`
			AdmissionNumber string  `json:"admission_number"`
			Score           float64 `json:"score"`
		} `json:"entries"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid payload: "+err.Error())
		return
	}

	payload.ComponentCode = strings.ToUpper(strings.TrimSpace(payload.ComponentCode))
	switch {
	case !validScoreComponent(payload.ComponentCode):
		JSONError(w, http.StatusBadRequest, "component_code must be CA1, CA2 or EXAM")
		return
	case payload.MaxObtainable <= 0:
		JSONError(w, http.StatusBadRequest, "max_obtainable must be greater than zero")
		return
	case strings.TrimSpace(payload.SourceReferenceID) == "":
		JSONError(w, http.StatusBadRequest, "source_reference_id is required for traceability")
		return
	case strings.TrimSpace(payload.ApprovedByUserID) == "":
		JSONError(w, http.StatusBadRequest, "approved_by_user_id is required: only teacher-approved scores may be synced")
		return
	case len(payload.Entries) == 0:
		JSONError(w, http.StatusBadRequest, "entries must contain at least one student score")
		return
	}
	if payload.SourceSystem == "" {
		payload.SourceSystem = "CLASSROOMPRO_CBT"
	}

	now := time.Now().UTC()
	synced := 0
	rejected := []map[string]interface{}{}
	for _, e := range payload.Entries {
		if strings.TrimSpace(e.StudentID) == "" {
			rejected = append(rejected, map[string]interface{}{"student_id": e.StudentID, "reason": "student_id is required"})
			continue
		}
		if e.Score < 0 || e.Score > payload.MaxObtainable {
			rejected = append(rejected, map[string]interface{}{"student_id": e.StudentID, "reason": "score outside 0..max_obtainable"})
			continue
		}
		_, err := db.DB.Exec(`
			INSERT INTO campus_official_exam_scores (
				id, tenant_id, school_id, campus_id, campus_name, session_id, term_id, class_name, subject_name,
				student_id, student_name, admission_number, component_code, score, max_obtainable,
				source_system, source_reference_id, approved_by_user_id, approved_at, sync_status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SYNCED')
			ON CONFLICT (tenant_id, source_reference_id, student_id, component_code)
			DO UPDATE SET score = EXCLUDED.score, max_obtainable = EXCLUDED.max_obtainable,
				approved_by_user_id = EXCLUDED.approved_by_user_id, approved_at = EXCLUDED.approved_at
		`, uuid.New().String(), tenantID, payload.SchoolID, payload.CampusID, payload.CampusName, payload.SessionID,
			payload.TermID, payload.ClassName, payload.SubjectName, e.StudentID, e.StudentName, e.AdmissionNumber,
			payload.ComponentCode, e.Score, payload.MaxObtainable, payload.SourceSystem, payload.SourceReferenceID,
			payload.ApprovedByUserID, now)
		if err != nil {
			rejected = append(rejected, map[string]interface{}{"student_id": e.StudentID, "reason": err.Error()})
			continue
		}
		synced++
	}

	status := http.StatusOK
	if synced == 0 {
		status = http.StatusUnprocessableEntity
	}
	JSONResponse(w, status, map[string]interface{}{
		"status":              map[bool]string{true: "SYNCED", false: "REJECTED"}[synced > 0],
		"tenant_id":           tenantID,
		"source_system":       payload.SourceSystem,
		"source_reference_id": payload.SourceReferenceID,
		"component_code":      payload.ComponentCode,
		"records_synced":      synced,
		"records_rejected":    rejected,
		"approved_at":         now,
	})
}

// HandleCampusOfficialExamScoresList serves approved official scores from the CampusPRO ledger.
// Optional filters: student_id, class_name, subject_name, component_code, source_system, limit.
func HandleCampusOfficialExamScoresList(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	if err := ensureExamScoresSchema(); err != nil {
		JSONError(w, http.StatusInternalServerError, "Official score ledger unavailable: "+err.Error())
		return
	}

	q := r.URL.Query()
	query := `SELECT id, tenant_id, COALESCE(school_id,''), COALESCE(campus_id,''), COALESCE(campus_name,''),
		COALESCE(session_id,''), COALESCE(term_id,''), COALESCE(class_name,''), COALESCE(subject_name,''),
		student_id, COALESCE(student_name,''), COALESCE(admission_number,''), component_code, score,
		max_obtainable, source_system, source_reference_id, approved_by_user_id, approved_at, sync_status
		FROM campus_official_exam_scores WHERE tenant_id = ?`
	args := []interface{}{tenantID}
	for col, key := range map[string]string{
		"student_id": "student_id", "class_name": "class_name", "subject_name": "subject_name",
		"component_code": "component_code", "source_system": "source_system",
	} {
		if v := strings.TrimSpace(q.Get(key)); v != "" {
			query += " AND " + col + " = ?"
			args = append(args, v)
		}
	}
	limit := 200
	if l, err := strconv.Atoi(q.Get("limit")); err == nil && l > 0 && l <= 1000 {
		limit = l
	}
	query += " ORDER BY approved_at DESC LIMIT " + strconv.Itoa(limit)

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to load official scores")
		return
	}
	defer rows.Close()

	records := []OfficialExamScoreRecord{}
	for rows.Next() {
		var rec OfficialExamScoreRecord
		if err := rows.Scan(&rec.ID, &rec.TenantID, &rec.SchoolID, &rec.CampusID, &rec.CampusName, &rec.SessionID,
			&rec.TermID, &rec.ClassName, &rec.SubjectName, &rec.StudentID, &rec.StudentName, &rec.AdmissionNumber,
			&rec.ComponentCode, &rec.Score, &rec.MaxObtainable, &rec.SourceSystem, &rec.SourceReferenceID,
			&rec.ApprovedByUserID, &rec.ApprovedAt, &rec.SyncStatus); err == nil {
			records = append(records, rec)
		}
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{
		"tenant_id":        tenantID,
		"system_of_record": "CampusPRO",
		"count":            len(records),
		"official_scores":  records,
	})
}

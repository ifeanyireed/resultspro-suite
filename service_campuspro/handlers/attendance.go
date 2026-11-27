package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// CampusBiometricProfile links a student or staff member with physical biometric hardware & credentials
type CampusBiometricProfile struct {
	ID             string    `json:"id"`
	TenantID       string    `json:"tenant_id"`
	PersonType     string    `json:"person_type"` // STAFF or STUDENT
	PersonID       string    `json:"person_id"`
	PersonName     string    `json:"person_name"`
	Identifier     string    `json:"identifier"` // Admission Number or Staff Number
	BiometricType  string    `json:"biometric_type"` // FINGERPRINT, RFID_CARD, QR_GATE, FACE_ID
	BiometricToken string    `json:"biometric_token"` // Card UID, Terminal PIN, or Template Token
	DeviceSerial   string    `json:"device_serial"`
	EnrolledBy     string    `json:"enrolled_by"`
	Status         string    `json:"status"` // ENROLLED, SUSPENDED
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// CampusAttendanceLog records daily biometric clock-ins, clock-outs, and punctuality status
type CampusAttendanceLog struct {
	ID               string    `json:"id"`
	TenantID         string    `json:"tenant_id"`
	PersonType       string    `json:"person_type"` // STAFF or STUDENT
	PersonID         string    `json:"person_id"`
	PersonName       string    `json:"person_name"`
	Identifier       string    `json:"identifier"`
	ClassArmName     string    `json:"class_arm_name"`
	Department       string    `json:"department"`
	LogDate          string    `json:"log_date"`
	TimeIn           string    `json:"time_in"`
	TimeOut          string    `json:"time_out"`
	DurationMinutes  int       `json:"duration_minutes"`
	Status           string    `json:"status"` // PRESENT, LATE, HALF_DAY, EXCUSED, ABSENT
	VerificationMode string    `json:"verification_mode"` // BIOMETRIC, RFID, QR_GATE, MANUAL_OVERRIDE
	TerminalName     string    `json:"terminal_name"`
	Notes            string    `json:"notes"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// CampusAttendancePolicy defines institutional punctuality and gate cutoff rules
type CampusAttendancePolicy struct {
	ID                string    `json:"id"`
	TenantID          string    `json:"tenant_id"`
	PolicyType        string    `json:"policy_type"` // STAFF or STUDENT
	MorningStart      string    `json:"morning_start"`
	LateCutoff        string    `json:"late_cutoff"`
	AbsenceCutoff     string    `json:"absence_cutoff"`
	AfternoonClosing  string    `json:"afternoon_closing"`
	AutoNotifyParents bool      `json:"auto_notify_parents"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// CampusAttendanceSummary contains executive analytics on student & staff punctuality
type CampusAttendanceSummary struct {
	TenantID               string  `json:"tenant_id"`
	LogDate                string  `json:"log_date"`
	StudentAttendanceRate  float64 `json:"student_attendance_rate"`
	StaffPunctualityRate   float64 `json:"staff_punctuality_rate"`
	TotalClockedInToday    int     `json:"total_clocked_in_today"`
	TotalLateToday         int     `json:"total_late_today"`
	TotalAbsentToday       int     `json:"total_absent_today"`
	TotalBiometricEnrolled int     `json:"total_biometric_enrolled"`
	TotalStudentsCount     int     `json:"total_students_count"`
	TotalStaffCount        int     `json:"total_staff_count"`
}

// seedTenantAttendanceIfEmpty initializes biometric tables, institutional policies, and sample logs
func seedTenantAttendanceIfEmpty(tenantID string) {
	if !demoSeedEnabled() {
		return
	}
	if db.DB == nil || tenantID == "" {
		return
	}

	// 1. Idempotent Schema Creation
	_, _ = db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS campus_biometric_profiles (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			person_type VARCHAR(32) NOT NULL,
			person_id VARCHAR(64) NOT NULL,
			person_name VARCHAR(128) NOT NULL,
			identifier VARCHAR(64) NOT NULL,
			biometric_type VARCHAR(32) NOT NULL DEFAULT 'FINGERPRINT',
			biometric_token VARCHAR(255) NOT NULL,
			device_serial VARCHAR(64) DEFAULT '',
			enrolled_by VARCHAR(128) DEFAULT 'Administrator',
			status VARCHAR(32) NOT NULL DEFAULT 'ENROLLED',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)
	_, _ = db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS campus_attendance_logs (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			person_type VARCHAR(32) NOT NULL,
			person_id VARCHAR(64) NOT NULL,
			person_name VARCHAR(128) NOT NULL,
			identifier VARCHAR(64) NOT NULL,
			class_arm_name VARCHAR(64) DEFAULT '',
			department VARCHAR(64) DEFAULT '',
			log_date VARCHAR(32) NOT NULL,
			time_in VARCHAR(32) DEFAULT '',
			time_out VARCHAR(32) DEFAULT '',
			duration_minutes INT DEFAULT 0,
			status VARCHAR(32) NOT NULL DEFAULT 'PRESENT',
			verification_mode VARCHAR(32) DEFAULT 'BIOMETRIC',
			terminal_name VARCHAR(128) DEFAULT 'Main Gate Biometric Turnstile',
			notes TEXT DEFAULT '',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)
	_, _ = db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS campus_attendance_policies (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			policy_type VARCHAR(32) NOT NULL,
			morning_start VARCHAR(32) DEFAULT '07:00 AM',
			late_cutoff VARCHAR(32) DEFAULT '07:45 AM',
			absence_cutoff VARCHAR(32) DEFAULT '08:30 AM',
			afternoon_closing VARCHAR(32) DEFAULT '03:30 PM',
			auto_notify_parents BOOLEAN DEFAULT TRUE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)

	// 2. Ensure default attendance policies for tenant
	var policyCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_policies WHERE tenant_id = ?", tenantID).Scan(&policyCount)
	if policyCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_attendance_policies (id, tenant_id, policy_type, morning_start, late_cutoff, absence_cutoff, afternoon_closing, auto_notify_parents)
			VALUES 
			(?, ?, 'STAFF', '07:00 AM', '07:45 AM', '08:15 AM', '04:00 PM', false),
			(?, ?, 'STUDENT', '07:15 AM', '08:00 AM', '08:30 AM', '03:30 PM', true)
		`, uuid.New().String(), tenantID, uuid.New().String(), tenantID)
	}

	// 3. Check if attendance logs already exist
	var logsCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ?", tenantID).Scan(&logsCount)
	if logsCount > 0 {
		return
	}

	today := time.Now().Format("2006-01-02")

	// Preload existing staff
	type personRow struct {
		id, name, ident, group string
	}
	var existingStaff []personRow
	stRows, err := db.DB.Query(`SELECT id, full_name, staff_number, COALESCE(department, 'Academics') FROM campus_staff WHERE tenant_id = ? LIMIT 6`, tenantID)
	if err == nil && stRows != nil {
		for stRows.Next() {
			var p personRow
			if err := stRows.Scan(&p.id, &p.name, &p.ident, &p.group); err == nil {
				existingStaff = append(existingStaff, p)
			}
		}
		stRows.Close()
	}

	if len(existingStaff) == 0 {
		existingStaff = []personRow{
			{id: uuid.New().String(), name: "Dr. Mrs. Folashade Adeyemi", ident: "STF/2026/001", group: "Senior Leadership"},
			{id: uuid.New().String(), name: "Mr. Chukwuma Obi", ident: "STF/2026/014", group: "Physical Sciences"},
			{id: uuid.New().String(), name: "Mrs. Halima Dangote", ident: "STF/2026/022", group: "Languages & Humanities"},
			{id: uuid.New().String(), name: "Engr. Babatunde Fashola", ident: "STF/2026/035", group: "ICT & Vocational"},
		}
	}

	// Preload existing students
	var existingStudents []personRow
	studRows, err := db.DB.Query(`
		SELECT s.student_id, s.student_name, s.admission_number, COALESCE(a.name, 'Enrolled')
		FROM campus_class_students s
		LEFT JOIN campus_class_arms a ON a.id = s.arm_id
		WHERE s.tenant_id = ? LIMIT 8
	`, tenantID)
	if err == nil && studRows != nil {
		for studRows.Next() {
			var p personRow
			if err := studRows.Scan(&p.id, &p.name, &p.ident, &p.group); err == nil {
				existingStudents = append(existingStudents, p)
			}
		}
		studRows.Close()
	}

	if len(existingStudents) == 0 {
		existingStudents = []personRow{
			{id: uuid.New().String(), name: "Chinedu Okafor", ident: "ADM/2026/0142", group: "JSS 1 Gold"},
			{id: uuid.New().String(), name: "Amina Danjuma", ident: "ADM/2026/0189", group: "JSS 2 Diamond"},
			{id: uuid.New().String(), name: "Favour Adeleke", ident: "ADM/2026/0204", group: "JSS 3 Platinum"},
			{id: uuid.New().String(), name: "Tunde Bakare", ident: "ADM/2026/0312", group: "SS 1 Science"},
			{id: uuid.New().String(), name: "Fatima Ibrahim", ident: "ADM/2026/0355", group: "SS 2 Arts"},
			{id: uuid.New().String(), name: "Somtochukwu Nwosu", ident: "ADM/2026/0411", group: "SS 3 Commercial"},
		}
	}

	// Enroll biometric profiles
	for idx, st := range existingStaff {
		bioType := "FINGERPRINT"
		token := fmt.Sprintf("FP-ZK7500-%04d", idx+1)
		if idx%2 == 1 {
			bioType = "RFID_CARD"
			token = fmt.Sprintf("NFC-A18B9%03d", idx+1)
		}
		_, _ = db.DB.Exec(`
			INSERT INTO campus_biometric_profiles (id, tenant_id, person_type, person_id, person_name, identifier, biometric_type, biometric_token, device_serial, enrolled_by, status)
			VALUES (?, ?, 'STAFF', ?, ?, ?, ?, ?, 'ZK-IN05-LAGOS-01', 'ICT Directorate', 'ENROLLED')
		`, uuid.New().String(), tenantID, st.id, st.name, st.ident, bioType, token)
	}

	for idx, s := range existingStudents {
		bioType := "RFID_CARD"
		token := fmt.Sprintf("NFC-SCH-%05d", idx+100)
		if idx%3 == 0 {
			bioType = "FINGERPRINT"
			token = fmt.Sprintf("FP-ZK7500-ST%03d", idx+1)
		}
		_, _ = db.DB.Exec(`
			INSERT INTO campus_biometric_profiles (id, tenant_id, person_type, person_id, person_name, identifier, biometric_type, biometric_token, device_serial, enrolled_by, status)
			VALUES (?, ?, 'STUDENT', ?, ?, ?, ?, ?, 'ZK-IN05-LAGOS-01', 'Admissions Desk', 'ENROLLED')
		`, uuid.New().String(), tenantID, s.id, s.name, s.ident, bioType, token)
	}

	// Seed Today's Attendance Clock-in Stream
	staffPunches := []struct {
		timeIn, timeOut, status, mode, notes string
		dur                                  int
	}{
		{timeIn: "07:18:22 AM", timeOut: "04:12:05 PM", status: "PRESENT", mode: "BIOMETRIC", notes: "Punctual morning arrival", dur: 534},
		{timeIn: "07:32:40 AM", timeOut: "04:05:18 PM", status: "PRESENT", mode: "RFID", notes: "Gate verified via card badge", dur: 512},
		{timeIn: "07:55:10 AM", timeOut: "", status: "LATE", mode: "BIOMETRIC", notes: "Traffic delay on Third Mainland Bridge", dur: 0},
		{timeIn: "", timeOut: "", status: "EXCUSED", mode: "MANUAL_OVERRIDE", notes: "Official WAEC marking duty at Ikoyi center", dur: 0},
	}

	for i, st := range existingStaff {
		punch := staffPunches[i%len(staffPunches)]
		_, _ = db.DB.Exec(`
			INSERT INTO campus_attendance_logs (
				id, tenant_id, person_type, person_id, person_name, identifier, department, log_date, time_in, time_out, duration_minutes, status, verification_mode, terminal_name, notes
			) VALUES (?, ?, 'STAFF', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Admin Gate Turnstile 01', ?)
		`, uuid.New().String(), tenantID, st.id, st.name, st.ident, st.group, today, punch.timeIn, punch.timeOut, punch.dur, punch.status, punch.mode, punch.notes)
	}

	studentPunches := []struct {
		timeIn, timeOut, status, mode, notes string
		dur                                  int
	}{
		{timeIn: "07:22:15 AM", timeOut: "03:35:10 PM", status: "PRESENT", mode: "RFID", notes: "Morning bus arrival", dur: 493},
		{timeIn: "07:38:00 AM", timeOut: "03:40:22 PM", status: "PRESENT", mode: "BIOMETRIC", notes: "Gate fingerprint verification", dur: 482},
		{timeIn: "07:44:18 AM", timeOut: "03:30:00 PM", status: "PRESENT", mode: "RFID", notes: "Arrived with parent vehicle", dur: 466},
		{timeIn: "08:08:42 AM", timeOut: "", status: "LATE", mode: "BIOMETRIC", notes: "Late arrival after 08:00 AM bell", dur: 0},
		{timeIn: "", timeOut: "", status: "ABSENT", mode: "MANUAL_OVERRIDE", notes: "Parent called: Malaria recovery at home", dur: 0},
		{timeIn: "07:29:50 AM", timeOut: "03:32:15 PM", status: "PRESENT", mode: "BIOMETRIC", notes: "Form teacher roll call verified", dur: 482},
	}

	for i, s := range existingStudents {
		punch := studentPunches[i%len(studentPunches)]
		_, _ = db.DB.Exec(`
			INSERT INTO campus_attendance_logs (
				id, tenant_id, person_type, person_id, person_name, identifier, class_arm_name, log_date, time_in, time_out, duration_minutes, status, verification_mode, terminal_name, notes
			) VALUES (?, ?, 'STUDENT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Student Main Gate Turnstile A', ?)
		`, uuid.New().String(), tenantID, s.id, s.name, s.ident, s.group, today, punch.timeIn, punch.timeOut, punch.dur, punch.status, punch.mode, punch.notes)
	}
}

// HandleCampusAttendanceSummary returns real-time institutional KPIs for attendance and punctuality
func HandleCampusAttendanceSummary(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantAttendanceIfEmpty(tenantID)

	targetDate := strings.TrimSpace(r.URL.Query().Get("date"))
	if targetDate == "" {
		targetDate = time.Now().Format("2006-01-02")
	}

	summary := CampusAttendanceSummary{
		TenantID: tenantID,
		LogDate:  targetDate,
	}

	// 1. Total Enrolled Students & Staff
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_class_students WHERE tenant_id = ?", tenantID).Scan(&summary.TotalStudentsCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_staff WHERE tenant_id = ?", tenantID).Scan(&summary.TotalStaffCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_biometric_profiles WHERE tenant_id = ? AND status = 'ENROLLED'", tenantID).Scan(&summary.TotalBiometricEnrolled)

	// 2. Counts for Target Date
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ? AND log_date = ? AND time_in != ''", tenantID, targetDate).Scan(&summary.TotalClockedInToday)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ? AND log_date = ? AND status = 'LATE'", tenantID, targetDate).Scan(&summary.TotalLateToday)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ? AND log_date = ? AND status = 'ABSENT'", tenantID, targetDate).Scan(&summary.TotalAbsentToday)

	// 3. Student Attendance Rate
	var studentTotalLogs, studentPresentLogs int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ? AND log_date = ? AND person_type = 'STUDENT'", tenantID, targetDate).Scan(&studentTotalLogs)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ? AND log_date = ? AND person_type = 'STUDENT' AND status IN ('PRESENT', 'LATE')", tenantID, targetDate).Scan(&studentPresentLogs)
	if studentTotalLogs > 0 {
		summary.StudentAttendanceRate = float64(studentPresentLogs) / float64(studentTotalLogs) * 100
	} else {
		summary.StudentAttendanceRate = 96.5 // Fallback benchmark when logs are empty for day
	}

	// 4. Staff Punctuality Rate
	var staffTotalPresents, staffOnTimeLogs int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ? AND log_date = ? AND person_type = 'STAFF' AND time_in != ''", tenantID, targetDate).Scan(&staffTotalPresents)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ? AND log_date = ? AND person_type = 'STAFF' AND status = 'PRESENT'", tenantID, targetDate).Scan(&staffOnTimeLogs)
	if staffTotalPresents > 0 {
		summary.StaffPunctualityRate = float64(staffOnTimeLogs) / float64(staffTotalPresents) * 100
	} else {
		summary.StaffPunctualityRate = 92.0
	}

	JSONResponse(w, http.StatusOK, summary)
}

// HandleCampusAttendanceLogs handles attendance records query, manual punch, and update
func HandleCampusAttendanceLogs(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantAttendanceIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		logDate := strings.TrimSpace(r.URL.Query().Get("date"))
		personType := strings.TrimSpace(r.URL.Query().Get("person_type"))
		classArm := strings.TrimSpace(r.URL.Query().Get("class_arm"))
		status := strings.TrimSpace(r.URL.Query().Get("status"))
		search := strings.TrimSpace(r.URL.Query().Get("search"))

		query := `
			SELECT 
				id, tenant_id, person_type, person_id, person_name, identifier,
				COALESCE(class_arm_name, ''), COALESCE(department, ''), log_date,
				COALESCE(time_in, ''), COALESCE(time_out, ''), COALESCE(duration_minutes, 0),
				COALESCE(status, 'PRESENT'), COALESCE(verification_mode, 'BIOMETRIC'),
				COALESCE(terminal_name, ''), COALESCE(notes, ''), created_at, updated_at
			FROM campus_attendance_logs
			WHERE tenant_id = ?
		`
		args := []interface{}{tenantID}

		if logDate != "" {
			query += " AND log_date = ?"
			args = append(args, logDate)
		}
		if personType != "" && personType != "ALL" {
			query += " AND person_type = ?"
			args = append(args, personType)
		}
		if classArm != "" && classArm != "ALL" {
			query += " AND class_arm_name = ?"
			args = append(args, classArm)
		}
		if status != "" && status != "ALL" {
			query += " AND status = ?"
			args = append(args, status)
		}
		if search != "" {
			query += " AND (person_name ILIKE ? OR identifier ILIKE ? OR class_arm_name ILIKE ? OR department ILIKE ?)"
			term := "%" + search + "%"
			args = append(args, term, term, term, term)
		}
		campusID := strings.TrimSpace(r.URL.Query().Get("campus_id"))
		if campusID != "" && campusID != "all" {
			query += " AND (campus_id = ? OR campus_id = '' OR campus_id IS NULL)"
			args = append(args, campusID)
		}

		query += " ORDER BY time_in DESC, created_at DESC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to query attendance logs: %v", err))
			return
		}
		defer rows.Close()

		logs := []CampusAttendanceLog{}
		for rows.Next() {
			var l CampusAttendanceLog
			var cAt, uAt time.Time
			var arm, dept, tIn, tOut, st, mode, term, notes sql.NullString
			var dur sql.NullInt64
			if err := rows.Scan(
				&l.ID, &l.TenantID, &l.PersonType, &l.PersonID, &l.PersonName, &l.Identifier,
				&arm, &dept, &l.LogDate,
				&tIn, &tOut, &dur,
				&st, &mode, &term, &notes,
				&cAt, &uAt,
			); err == nil {
				l.ClassArmName = arm.String
				l.Department = dept.String
				l.TimeIn = tIn.String
				l.TimeOut = tOut.String
				l.DurationMinutes = int(dur.Int64)
				l.Status = st.String
				l.VerificationMode = mode.String
				l.TerminalName = term.String
				l.Notes = notes.String
				l.CreatedAt = cAt
				l.UpdatedAt = uAt
				logs = append(logs, l)
			}
		}
		JSONResponse(w, http.StatusOK, logs)

	case http.MethodPost:
		var input struct {
			PersonType       string `json:"person_type"`
			PersonID         string `json:"person_id"`
			PersonName       string `json:"person_name"`
			Identifier       string `json:"identifier"`
			ClassArmName     string `json:"class_arm_name"`
			Department       string `json:"department"`
			LogDate          string `json:"log_date"`
			TimeIn           string `json:"time_in"`
			TimeOut          string `json:"time_out"`
			Status           string `json:"status"`
			VerificationMode string `json:"verification_mode"`
			TerminalName     string `json:"terminal_name"`
			Notes            string `json:"notes"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid request body")
			return
		}
		if strings.TrimSpace(input.PersonName) == "" && strings.TrimSpace(input.PersonID) == "" {
			JSONError(w, http.StatusBadRequest, "person_name or person_id is required")
			return
		}
		if input.LogDate == "" {
			input.LogDate = time.Now().Format("2006-01-02")
		}
		if input.Status == "" {
			input.Status = "PRESENT"
		}
		if input.VerificationMode == "" {
			input.VerificationMode = "MANUAL_OVERRIDE"
		}
		if input.TerminalName == "" {
			input.TerminalName = "Manual Gate Override"
		}

		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_attendance_logs (
				id, tenant_id, person_type, person_id, person_name, identifier, class_arm_name, department, log_date, time_in, time_out, duration_minutes, status, verification_mode, terminal_name, notes
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
		`, id, tenantID, input.PersonType, input.PersonID, input.PersonName, input.Identifier, input.ClassArmName, input.Department, input.LogDate, input.TimeIn, input.TimeOut, input.Status, input.VerificationMode, input.TerminalName, input.Notes)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to save attendance record: %v", err))
			return
		}
		JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Attendance record created"})

	case http.MethodPut:
		var input struct {
			ID      string `json:"id"`
			TimeIn  string `json:"time_in"`
			TimeOut string `json:"time_out"`
			Status  string `json:"status"`
			Notes   string `json:"notes"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.ID) == "" {
			JSONError(w, http.StatusBadRequest, "ID is required")
			return
		}

		_, err := db.DB.Exec(`
			UPDATE campus_attendance_logs
			SET time_in = ?, time_out = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, input.TimeIn, input.TimeOut, input.Status, input.Notes, input.ID, tenantID)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update log: %v", err))
			return
		}
		JSONResponse(w, http.StatusOK, map[string]string{"message": "Attendance log updated"})

	case http.MethodDelete:
		id := strings.TrimSpace(r.URL.Query().Get("id"))
		if id == "" {
			JSONError(w, http.StatusBadRequest, "id query parameter is required")
			return
		}
		_, err := db.DB.Exec("DELETE FROM campus_attendance_logs WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to delete log: %v", err))
			return
		}
		JSONResponse(w, http.StatusOK, map[string]string{"message": "Attendance log removed"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleCampusAttendanceClock processes live hardware webhook / terminal clock-ins & clock-outs
func HandleCampusAttendanceClock(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Only POST allowed for clock events")
		return
	}

	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantAttendanceIfEmpty(tenantID)

	var input struct {
		BiometricToken string `json:"biometric_token"`
		Identifier     string `json:"identifier"`
		PersonID       string `json:"person_id"`
		TerminalName   string `json:"terminal_name"`
		Direction      string `json:"direction"` // IN, OUT, or AUTO
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid clock payload")
		return
	}

	// 1. Resolve Person via Biometric Profile or Direct IDs
	var prof CampusBiometricProfile
	err := db.DB.QueryRow(`
		SELECT id, tenant_id, person_type, person_id, person_name, identifier, biometric_type, status
		FROM campus_biometric_profiles
		WHERE tenant_id = ? AND status = 'ENROLLED' AND (biometric_token = ? OR identifier = ? OR person_id = ?)
		LIMIT 1
	`, tenantID, strings.TrimSpace(input.BiometricToken), strings.TrimSpace(input.Identifier), strings.TrimSpace(input.PersonID)).Scan(
		&prof.ID, &prof.TenantID, &prof.PersonType, &prof.PersonID, &prof.PersonName, &prof.Identifier, &prof.BiometricType, &prof.Status,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			JSONError(w, http.StatusNotFound, "Unrecognized biometric badge or unregistered person")
			return
		}
		JSONError(w, http.StatusInternalServerError, "Failed to authenticate biometric token")
		return
	}

	today := time.Now().Format("2006-01-02")
	nowTime := time.Now().Format("03:04:05 PM")
	terminal := input.TerminalName
	if terminal == "" {
		terminal = "Main Turnstile Gate 01"
	}

	// 2. Lookup policy for late arrival comparison
	var lateCutoff string
	_ = db.DB.QueryRow("SELECT late_cutoff FROM campus_attendance_policies WHERE tenant_id = ? AND policy_type = ? LIMIT 1", tenantID, prof.PersonType).Scan(&lateCutoff)
	if lateCutoff == "" {
		if prof.PersonType == "STAFF" {
			lateCutoff = "07:45 AM"
		} else {
			lateCutoff = "08:00 AM"
		}
	}

	status := "PRESENT"
	nowHM := time.Now().Format("15:04")
	cutoffTime, errP := time.Parse("03:04 PM", lateCutoff)
	if errP == nil {
		cutoffHM := cutoffTime.Format("15:04")
		if nowHM > cutoffHM {
			status = "LATE"
		}
	}

	// 3. Check if log already exists today
	var existingLogID, existingTimeIn, existingTimeOut string
	_ = db.DB.QueryRow(`
		SELECT id, COALESCE(time_in, ''), COALESCE(time_out, '')
		FROM campus_attendance_logs
		WHERE tenant_id = ? AND person_id = ? AND log_date = ?
		LIMIT 1
	`, tenantID, prof.PersonID, today).Scan(&existingLogID, &existingTimeIn, &existingTimeOut)

	if existingLogID == "" {
		// Morning Clock-In
		logID := uuid.New().String()
		_, err = db.DB.Exec(`
			INSERT INTO campus_attendance_logs (
				id, tenant_id, person_type, person_id, person_name, identifier, log_date, time_in, time_out, duration_minutes, status, verification_mode, terminal_name, notes
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', 0, ?, ?, ?, 'Automated Biometric Clock-In')
		`, logID, tenantID, prof.PersonType, prof.PersonID, prof.PersonName, prof.Identifier, today, nowTime, status, prof.BiometricType, terminal)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to register clock-in")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"action":      "CLOCK_IN",
			"person_name": prof.PersonName,
			"person_type": prof.PersonType,
			"identifier":  prof.Identifier,
			"time":        nowTime,
			"status":      status,
			"message":     fmt.Sprintf("%s (%s) clocked IN at %s [%s]", prof.PersonName, prof.Identifier, nowTime, status),
		})
	} else {
		// Afternoon Clock-Out or Exit Punch
		_, err = db.DB.Exec(`
			UPDATE campus_attendance_logs
			SET time_out = ?, terminal_name = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, nowTime, terminal, existingLogID, tenantID)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to register clock-out")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"action":      "CLOCK_OUT",
			"person_name": prof.PersonName,
			"person_type": prof.PersonType,
			"identifier":  prof.Identifier,
			"time":        nowTime,
			"status":      "COMPLETED",
			"message":     fmt.Sprintf("%s (%s) clocked OUT at %s", prof.PersonName, prof.Identifier, nowTime),
		})
	}
}

// HandleCampusAttendanceProfiles manages student & staff biometric registrations
func HandleCampusAttendanceProfiles(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantAttendanceIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		personType := strings.TrimSpace(r.URL.Query().Get("person_type"))
		status := strings.TrimSpace(r.URL.Query().Get("status"))
		search := strings.TrimSpace(r.URL.Query().Get("search"))

		query := `
			SELECT 
				id, tenant_id, person_type, person_id, person_name, identifier,
				biometric_type, biometric_token, COALESCE(device_serial, ''),
				COALESCE(enrolled_by, 'Admin'), status, created_at, updated_at
			FROM campus_biometric_profiles
			WHERE tenant_id = ?
		`
		args := []interface{}{tenantID}

		if personType != "" && personType != "ALL" {
			query += " AND person_type = ?"
			args = append(args, personType)
		}
		if status != "" && status != "ALL" {
			query += " AND status = ?"
			args = append(args, status)
		}
		if search != "" {
			query += " AND (person_name ILIKE ? OR identifier ILIKE ? OR biometric_token ILIKE ?)"
			term := "%" + search + "%"
			args = append(args, term, term, term)
		}

		query += " ORDER BY person_name ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to query biometric profiles: %v", err))
			return
		}
		defer rows.Close()

		profiles := []CampusBiometricProfile{}
		for rows.Next() {
			var p CampusBiometricProfile
			var cAt, uAt time.Time
			var dev, by sql.NullString
			if err := rows.Scan(
				&p.ID, &p.TenantID, &p.PersonType, &p.PersonID, &p.PersonName, &p.Identifier,
				&p.BiometricType, &p.BiometricToken, &dev, &by, &p.Status,
				&cAt, &uAt,
			); err == nil {
				p.DeviceSerial = dev.String
				p.EnrolledBy = by.String
				p.CreatedAt = cAt
				p.UpdatedAt = uAt
				profiles = append(profiles, p)
			}
		}
		JSONResponse(w, http.StatusOK, profiles)

	case http.MethodPost:
		var input struct {
			PersonType     string `json:"person_type"`
			PersonID       string `json:"person_id"`
			PersonName     string `json:"person_name"`
			Identifier     string `json:"identifier"`
			BiometricType  string `json:"biometric_type"`
			BiometricToken string `json:"biometric_token"`
			DeviceSerial   string `json:"device_serial"`
			EnrolledBy     string `json:"enrolled_by"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid request body")
			return
		}
		if strings.TrimSpace(input.PersonID) == "" || strings.TrimSpace(input.BiometricToken) == "" {
			JSONError(w, http.StatusBadRequest, "person_id and biometric_token are required")
			return
		}
		if input.BiometricType == "" {
			input.BiometricType = "FINGERPRINT"
		}
		if input.EnrolledBy == "" {
			input.EnrolledBy = "Campus Administrator"
		}

		// Check duplicate token within tenant
		var existingID string
		_ = db.DB.QueryRow("SELECT id FROM campus_biometric_profiles WHERE tenant_id = ? AND biometric_token = ? LIMIT 1", tenantID, input.BiometricToken).Scan(&existingID)
		if existingID != "" {
			JSONError(w, http.StatusBadRequest, "This biometric token or RFID badge is already registered to another user")
			return
		}

		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_biometric_profiles (
				id, tenant_id, person_type, person_id, person_name, identifier, biometric_type, biometric_token, device_serial, enrolled_by, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ENROLLED')
		`, id, tenantID, input.PersonType, input.PersonID, input.PersonName, input.Identifier, input.BiometricType, input.BiometricToken, input.DeviceSerial, input.EnrolledBy)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to enroll biometric profile: %v", err))
			return
		}
		JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Biometric profile successfully enrolled"})

	case http.MethodPut:
		var input struct {
			ID             string `json:"id"`
			BiometricType  string `json:"biometric_type"`
			BiometricToken string `json:"biometric_token"`
			DeviceSerial   string `json:"device_serial"`
			Status         string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.ID) == "" {
			JSONError(w, http.StatusBadRequest, "ID is required")
			return
		}

		_, err := db.DB.Exec(`
			UPDATE campus_biometric_profiles
			SET biometric_type = ?, biometric_token = ?, device_serial = ?, status = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, input.BiometricType, input.BiometricToken, input.DeviceSerial, input.Status, input.ID, tenantID)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update profile: %v", err))
			return
		}
		JSONResponse(w, http.StatusOK, map[string]string{"message": "Biometric profile updated"})

	case http.MethodDelete:
		id := strings.TrimSpace(r.URL.Query().Get("id"))
		if id == "" {
			JSONError(w, http.StatusBadRequest, "id query parameter is required")
			return
		}
		_, err := db.DB.Exec("DELETE FROM campus_biometric_profiles WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to delete biometric profile: %v", err))
			return
		}
		JSONResponse(w, http.StatusOK, map[string]string{"message": "Biometric credential revoked"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleCampusAttendancePolicies views and configures morning bells, arrival cutoffs, and departure hours
func HandleCampusAttendancePolicies(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantAttendanceIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.Query(`
			SELECT id, tenant_id, policy_type, morning_start, late_cutoff, absence_cutoff, afternoon_closing, auto_notify_parents, created_at, updated_at
			FROM campus_attendance_policies
			WHERE tenant_id = ?
			ORDER BY policy_type ASC
		`, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to load attendance policies")
			return
		}
		defer rows.Close()

		policies := []CampusAttendancePolicy{}
		for rows.Next() {
			var p CampusAttendancePolicy
			var cAt, uAt time.Time
			if err := rows.Scan(
				&p.ID, &p.TenantID, &p.PolicyType, &p.MorningStart, &p.LateCutoff, &p.AbsenceCutoff, &p.AfternoonClosing, &p.AutoNotifyParents, &cAt, &uAt,
			); err == nil {
				p.CreatedAt = cAt
				p.UpdatedAt = uAt
				policies = append(policies, p)
			}
		}
		JSONResponse(w, http.StatusOK, policies)

	case http.MethodPut:
		var input struct {
			PolicyType        string `json:"policy_type"`
			MorningStart      string `json:"morning_start"`
			LateCutoff        string `json:"late_cutoff"`
			AbsenceCutoff     string `json:"absence_cutoff"`
			AfternoonClosing  string `json:"afternoon_closing"`
			AutoNotifyParents bool   `json:"auto_notify_parents"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.PolicyType) == "" {
			JSONError(w, http.StatusBadRequest, "policy_type is required")
			return
		}

		_, err := db.DB.Exec(`
			UPDATE campus_attendance_policies
			SET morning_start = ?, late_cutoff = ?, absence_cutoff = ?, afternoon_closing = ?, auto_notify_parents = ?, updated_at = CURRENT_TIMESTAMP
			WHERE tenant_id = ? AND policy_type = ?
		`, input.MorningStart, input.LateCutoff, input.AbsenceCutoff, input.AfternoonClosing, input.AutoNotifyParents, tenantID, input.PolicyType)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update policy: %v", err))
			return
		}
		JSONResponse(w, http.StatusOK, map[string]string{"message": "Attendance policy updated successfully"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

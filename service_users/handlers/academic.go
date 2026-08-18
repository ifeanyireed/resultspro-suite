package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// --- Sessions & Terms ---

func HandleCreateSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		SchoolID  string `json:"school_id"`
		Name      string `json:"name"`
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
		IsCurrent bool   `json:"is_current"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.SchoolID == "" || input.Name == "" {
		utils.JSONError(w, http.StatusBadRequest, "school_id and name are required")
		return
	}

	sessionID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	if input.IsCurrent {
		db.DB.Exec("UPDATE academic_sessions SET is_current = 0 WHERE school_id = ?", input.SchoolID)
	}

	query := `INSERT INTO academic_sessions (id, school_id, name, start_date, end_date, is_current, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, sessionID, input.SchoolID, input.Name, input.StartDate, input.EndDate, input.IsCurrent, now, now)
	if err != nil {
		log.Printf("Create session error: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create academic session")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      sessionID,
		"name":    input.Name,
		"message": "Academic session created successfully",
	})
}

func HandleGetSessions(w http.ResponseWriter, r *http.Request) {
	schoolID := r.URL.Query().Get("school_id")
	if schoolID == "" {
		parts := strings.Split(r.URL.Path, "/")
		for i, part := range parts {
			if (part == "schools" || part == "school") && i+1 < len(parts) {
				schoolID = parts[i+1]
				break
			}
		}
	}

	query := "SELECT id, school_id, name, start_date, end_date, is_current, created_at FROM academic_sessions WHERE 1=1"
	args := []interface{}{}
	if schoolID != "" {
		query += " AND school_id = ?"
		args = append(args, schoolID)
	}
	query += " ORDER BY start_date DESC, created_at DESC"

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	sessions := []models.AcademicSession{}
	for rows.Next() {
		var s models.AcademicSession
		var start, end sql.NullString
		if err := rows.Scan(&s.ID, &s.SchoolID, &s.Name, &start, &end, &s.IsCurrent, &s.CreatedAt); err == nil {
			if start.Valid {
				t, _ := time.Parse("2006-01-02 15:04:05", start.String)
				s.StartDate = t
			}
			if end.Valid {
				t, _ := time.Parse("2006-01-02 15:04:05", end.String)
				s.EndDate = t
			}
			sessions = append(sessions, s)
		}
	}

	utils.JSONResponse(w, http.StatusOK, sessions)
}

func HandleCreateTerm(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		SessionID string `json:"session_id"`
		Name      string `json:"name"`
		IsCurrent bool   `json:"is_current"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.SessionID == "" || input.Name == "" {
		utils.JSONError(w, http.StatusBadRequest, "session_id and name are required")
		return
	}

	termID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	if input.IsCurrent {
		db.DB.Exec("UPDATE terms SET is_current = 0 WHERE session_id = ?", input.SessionID)
	}

	query := `INSERT INTO terms (id, session_id, name, is_current, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, termID, input.SessionID, input.Name, input.IsCurrent, now, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create term")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      termID,
		"name":    input.Name,
		"message": "Term created successfully",
	})
}

func HandleGetTerms(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("session_id")
	if sessionID == "" {
		parts := strings.Split(r.URL.Path, "/")
		for i, part := range parts {
			if (part == "sessions" || part == "session") && i+1 < len(parts) {
				sessionID = parts[i+1]
				break
			}
		}
	}

	query := "SELECT id, session_id, name, is_current, created_at FROM terms WHERE 1=1"
	args := []interface{}{}
	if sessionID != "" {
		query += " AND session_id = ?"
		args = append(args, sessionID)
	}

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	terms := []models.Term{}
	for rows.Next() {
		var t models.Term
		if err := rows.Scan(&t.ID, &t.SessionID, &t.Name, &t.IsCurrent, &t.CreatedAt); err == nil {
			terms = append(terms, t)
		}
	}

	utils.JSONResponse(w, http.StatusOK, terms)
}

// --- Classes & Sections ---

func HandleCreateClass(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		SchoolID     string `json:"school_id"`
		CurriculumID string `json:"curriculum_id"`
		Name         string `json:"name"`
		Level        int    `json:"level"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.SchoolID == "" || input.Name == "" {
		utils.JSONError(w, http.StatusBadRequest, "school_id and name are required")
		return
	}

	classID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `INSERT INTO classes (id, school_id, curriculum_id, name, level, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, classID, input.SchoolID, sql.NullString{String: input.CurriculumID, Valid: input.CurriculumID != ""}, input.Name, input.Level, now, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create class")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      classID,
		"name":    input.Name,
		"message": "Class created successfully",
	})
}

func HandleGetClasses(w http.ResponseWriter, r *http.Request) {
	schoolID := r.URL.Query().Get("school_id")
	if schoolID == "" {
		parts := strings.Split(r.URL.Path, "/")
		for i, part := range parts {
			if (part == "schools" || part == "school") && i+1 < len(parts) {
				schoolID = parts[i+1]
				break
			}
		}
	}

	query := "SELECT id, school_id, curriculum_id, name, level, created_at FROM classes WHERE 1=1"
	args := []interface{}{}
	if schoolID != "" {
		query += " AND school_id = ?"
		args = append(args, schoolID)
	}
	query += " ORDER BY level ASC, name ASC"

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	classes := []models.Class{}
	for rows.Next() {
		var c models.Class
		var curID sql.NullString
		if err := rows.Scan(&c.ID, &c.SchoolID, &curID, &c.Name, &c.Level, &c.CreatedAt); err == nil {
			if curID.Valid {
				c.CurriculumID = curID.String
			}
			classes = append(classes, c)
		}
	}

	utils.JSONResponse(w, http.StatusOK, classes)
}

func HandleCreateSection(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		ClassID    string `json:"class_id"`
		Name       string `json:"name"`
		RoomNumber string `json:"room_number"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ClassID == "" || input.Name == "" {
		utils.JSONError(w, http.StatusBadRequest, "class_id and name are required")
		return
	}

	sectionID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `INSERT INTO sections (id, class_id, name, room_number, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, sectionID, input.ClassID, input.Name, sql.NullString{String: input.RoomNumber, Valid: input.RoomNumber != ""}, now, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create section")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      sectionID,
		"name":    input.Name,
		"message": "Section created successfully",
	})
}

func HandleGetSections(w http.ResponseWriter, r *http.Request) {
	classID := r.URL.Query().Get("class_id")
	if classID == "" {
		parts := strings.Split(r.URL.Path, "/")
		for i, part := range parts {
			if (part == "classes" || part == "class") && i+1 < len(parts) {
				classID = parts[i+1]
				break
			}
		}
	}

	query := "SELECT id, class_id, name, room_number, created_at FROM sections WHERE 1=1"
	args := []interface{}{}
	if classID != "" {
		query += " AND class_id = ?"
		args = append(args, classID)
	}

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	sections := []models.Section{}
	for rows.Next() {
		var s models.Section
		var room sql.NullString
		if err := rows.Scan(&s.ID, &s.ClassID, &s.Name, &room, &s.CreatedAt); err == nil {
			if room.Valid {
				s.RoomNumber = room.String
			}
			sections = append(sections, s)
		}
	}

	utils.JSONResponse(w, http.StatusOK, sections)
}

// --- Subjects & Syllabus ---

func HandleCreateSubject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		SchoolID string `json:"school_id"`
		Name     string `json:"name"`
		Code     string `json:"code"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.SchoolID == "" || input.Name == "" {
		utils.JSONError(w, http.StatusBadRequest, "school_id and name are required")
		return
	}

	subjectID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `INSERT INTO subjects (id, school_id, name, code, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, subjectID, input.SchoolID, input.Name, sql.NullString{String: input.Code, Valid: input.Code != ""}, now, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create subject")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      subjectID,
		"name":    input.Name,
		"code":    input.Code,
		"message": "Subject created successfully",
	})
}

func HandleGetSubjects(w http.ResponseWriter, r *http.Request) {
	schoolID := r.URL.Query().Get("school_id")
	if schoolID == "" {
		parts := strings.Split(r.URL.Path, "/")
		for i, part := range parts {
			if (part == "schools" || part == "school") && i+1 < len(parts) {
				schoolID = parts[i+1]
				break
			}
		}
	}

	query := "SELECT id, school_id, name, code, created_at FROM subjects WHERE 1=1"
	args := []interface{}{}
	if schoolID != "" {
		query += " AND school_id = ?"
		args = append(args, schoolID)
	}
	query += " ORDER BY name ASC"

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	subjects := []models.Subject{}
	for rows.Next() {
		var s models.Subject
		var code sql.NullString
		if err := rows.Scan(&s.ID, &s.SchoolID, &s.Name, &code, &s.CreatedAt); err == nil {
			if code.Valid {
				s.Code = code.String
			}
			subjects = append(subjects, s)
		}
	}

	utils.JSONResponse(w, http.StatusOK, subjects)
}

// HandleGetStudentSubjects retrieves the active subjects for a student
func HandleGetStudentSubjects(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	studentID := ""
	for i, part := range parts {
		if (part == "student" || part == "students") && i+1 < len(parts) {
			studentID = parts[i+1]
			break
		}
	}

	if studentID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Student ID is required")
		return
	}

	termID := r.URL.Query().Get("termId")
	if termID == "" {
		termID = r.URL.Query().Get("term_id")
	}

	var sectionID string
	err := db.DB.QueryRow("SELECT section_id FROM enrollments WHERE student_id = ? AND status = 'active' LIMIT 1", studentID).Scan(&sectionID)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.JSONResponse(w, http.StatusOK, []interface{}{})
			return
		}
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	query := `
		SELECT sub.id, sub.name, sub.code, t.id, t.name
		FROM assignments a
		JOIN subjects sub ON a.subject_id = sub.id
		JOIN terms t ON a.term_id = t.id
		WHERE a.section_id = ?`

	args := []interface{}{sectionID}
	if termID != "" {
		query += " AND a.term_id = ?"
		args = append(args, termID)
	}

	type SubjectAssignment struct {
		SubjectID   string `json:"subject_id"`
		SubjectName string `json:"subject_name"`
		SubjectCode string `json:"subject_code"`
		TermID      string `json:"term_id"`
		TermName    string `json:"term_name"`
	}

	assignments := []SubjectAssignment{}
	rows, err := db.DB.Query(query, args...)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var sa SubjectAssignment
			var code sql.NullString
			if err := rows.Scan(&sa.SubjectID, &sa.SubjectName, &code, &sa.TermID, &sa.TermName); err == nil {
				if code.Valid {
					sa.SubjectCode = code.String
				}
				assignments = append(assignments, sa)
			}
		}
	}

	utils.JSONResponse(w, http.StatusOK, assignments)
}

// HandleGetCurriculums lists all national/international curriculums
func HandleGetCurriculums(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, name, country, created_at FROM curriculums ORDER BY name ASC")
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	curriculums := []models.Curriculum{}
	for rows.Next() {
		var c models.Curriculum
		if err := rows.Scan(&c.ID, &c.Name, &c.Country, &c.CreatedAt); err == nil {
			curriculums = append(curriculums, c)
		}
	}

	utils.JSONResponse(w, http.StatusOK, curriculums)
}

// HandleCreateCurriculum registers a new curriculum
func HandleCreateCurriculum(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Name    string `json:"name"`
		Country string `json:"country"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Name == "" {
		utils.JSONError(w, http.StatusBadRequest, "Name is required")
		return
	}

	id := uuid.New().String()
	country := input.Country
	if country == "" {
		country = "Nigeria"
	}

	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	_, err := db.DB.Exec("INSERT INTO curriculums (id, name, country, created_at) VALUES (?, ?, ?, ?)", id, input.Name, country, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]string{"id": id, "name": input.Name})
}

// HandleGetSchoolSyllabus returns the weekly breakdown and topics for a subject
func HandleGetSchoolSyllabus(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	subjectID := parts[len(parts)-1]

	rows, err := db.DB.Query(`
		SELECT w.id, w.week_number, w.term, t.id, t.name, t.description, t.order
		FROM syllabus_weeks w
		LEFT JOIN topics t ON w.id = t.syllabus_week_id
		WHERE w.subject_id = ?
		ORDER BY w.term, w.week_number, t.order`, subjectID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to query syllabus")
		return
	}
	defer rows.Close()

	type TopicData struct {
		ID          string `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
		Order       int    `json:"order"`
	}
	type WeekData struct {
		ID         string      `json:"id"`
		WeekNumber int         `json:"week_number"`
		Term       int         `json:"term"`
		Topics     []TopicData `json:"topics"`
	}

	weeksMap := make(map[string]*WeekData)
	var weeksList []string

	for rows.Next() {
		var wID, tID, tName, tDesc sql.NullString
		var wNum, wTerm, tOrder int
		if err := rows.Scan(&wID, &wNum, &wTerm, &tID, &tName, &tDesc, &tOrder); err != nil {
			continue
		}

		if !wID.Valid {
			continue
		}

		if _, ok := weeksMap[wID.String]; !ok {
			weeksMap[wID.String] = &WeekData{
				ID:         wID.String,
				WeekNumber: wNum,
				Term:       wTerm,
				Topics:     []TopicData{},
			}
			weeksList = append(weeksList, wID.String)
		}

		if tID.Valid {
			weeksMap[wID.String].Topics = append(weeksMap[wID.String].Topics, TopicData{
				ID:          tID.String,
				Name:        tName.String,
				Description: tDesc.String,
				Order:       tOrder,
			})
		}
	}

	response := []WeekData{}
	for _, id := range weeksList {
		response = append(response, *weeksMap[id])
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// HandleAddSyllabusWeek adds a syllabus week and its topics
func HandleAddSyllabusWeek(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		SubjectID  string `json:"subject_id"`
		WeekNumber int    `json:"week_number"`
		Term       int    `json:"term"`
		Topics     []struct {
			Name        string `json:"name"`
			Description string `json:"description"`
			Order       int    `json:"order"`
		} `json:"topics"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.SubjectID == "" {
		utils.JSONError(w, http.StatusBadRequest, "subject_id is required")
		return
	}

	weekID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	termVal := input.Term
	if termVal == 0 {
		termVal = 1
	}

	_, err := db.DB.Exec("INSERT INTO syllabus_weeks (id, subject_id, week_number, term, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
		weekID, input.SubjectID, input.WeekNumber, termVal, now, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create syllabus week")
		return
	}

	for _, t := range input.Topics {
		topicID := uuid.New().String()
		db.DB.Exec("INSERT INTO topics (id, syllabus_week_id, name, description, `order`, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
			topicID, weekID, t.Name, t.Description, t.Order, now, now)
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      weekID,
		"message": "Syllabus week and topics saved successfully",
	})
}

// HandleGetExamSyllabus retrieves the national exam syllabus / areas of concentration
func HandleGetExamSyllabus(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	examID := parts[len(parts)-1]

	rows, err := db.DB.Query("SELECT id, subject_name, syllabus_data FROM areas_of_concentration WHERE national_exam_id = ?", examID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to query exam syllabus")
		return
	}
	defer rows.Close()

	aocs := []models.AreaOfConcentration{}
	for rows.Next() {
		var aoc models.AreaOfConcentration
		var data sql.NullString
		if err := rows.Scan(&aoc.ID, &aoc.SubjectName, &data); err == nil {
			if data.Valid {
				aoc.SyllabusData = data.String
			}
			aocs = append(aocs, aoc)
		}
	}

	utils.JSONResponse(w, http.StatusOK, aocs)
}

// HandleSaveExamSyllabus saves or updates an area of concentration for an exam
func HandleSaveExamSyllabus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodPut {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		NationalExamID string `json:"national_exam_id"`
		SubjectName    string `json:"subject_name"`
		SyllabusData   string `json:"syllabus_data"` // JSON
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.NationalExamID == "" || input.SubjectName == "" {
		utils.JSONError(w, http.StatusBadRequest, "national_exam_id and subject_name are required")
		return
	}

	id := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	_, err := db.DB.Exec("INSERT INTO areas_of_concentration (id, national_exam_id, subject_name, syllabus_data, created_at) VALUES (?, ?, ?, ?, ?)",
		id, input.NationalExamID, input.SubjectName, input.SyllabusData, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to save exam syllabus")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]string{"id": id, "message": "Exam syllabus saved successfully"})
}

func HandleGetExamBodies(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, name FROM exam_bodies ORDER BY name ASC")
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	bodies := []models.ExamBody{}
	for rows.Next() {
		var b models.ExamBody
		if err := rows.Scan(&b.ID, &b.Name); err == nil {
			bodies = append(bodies, b)
		}
	}

	utils.JSONResponse(w, http.StatusOK, bodies)
}

func HandleGetNationalExams(w http.ResponseWriter, r *http.Request) {
	bodyID := r.URL.Query().Get("exam_body_id")
	query := "SELECT id, exam_body_id, name FROM national_exams WHERE 1=1"
	args := []interface{}{}
	if bodyID != "" {
		query += " AND exam_body_id = ?"
		args = append(args, bodyID)
	}

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	exams := []models.NationalExam{}
	for rows.Next() {
		var e models.NationalExam
		if err := rows.Scan(&e.ID, &e.ExamBodyID, &e.Name); err == nil {
			exams = append(exams, e)
		}
	}

	utils.JSONResponse(w, http.StatusOK, exams)
}

// --- Enrollments & Teaching Assignments ---

func HandleEnrollStudent(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		StudentID string `json:"student_id"`
		SectionID string `json:"section_id"`
		SessionID string `json:"session_id"`
		Status    string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.StudentID == "" || input.SectionID == "" || input.SessionID == "" {
		utils.JSONError(w, http.StatusBadRequest, "student_id, section_id, and session_id are required")
		return
	}

	status := input.Status
	if status == "" {
		status = "active"
	}

	enrollID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `INSERT INTO enrollments (id, student_id, section_id, session_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, enrollID, input.StudentID, input.SectionID, input.SessionID, status, now, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to enroll student")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      enrollID,
		"message": "Student enrolled successfully",
	})
}

func HandleGetSectionEnrollments(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	sectionID := ""
	for i, part := range parts {
		if (part == "sections" || part == "section") && i+1 < len(parts) {
			sectionID = parts[i+1]
			break
		}
	}

	if sectionID == "" {
		sectionID = r.URL.Query().Get("section_id")
	}

	query := `
		SELECT e.id, e.student_id, u.full_name, u.email, e.status, e.created_at
		FROM enrollments e
		JOIN users u ON e.student_id = u.id
		WHERE e.section_id = ? AND e.status = 'active'
		ORDER BY u.full_name ASC`

	rows, err := db.DB.Query(query, sectionID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	type EnrolledStudent struct {
		EnrollmentID string    `json:"enrollment_id"`
		StudentID    string    `json:"student_id"`
		FullName     string    `json:"full_name"`
		Email        string    `json:"email"`
		Status       string    `json:"status"`
		CreatedAt    time.Time `json:"created_at"`
	}

	students := []EnrolledStudent{}
	for rows.Next() {
		var s EnrolledStudent
		var fullName sql.NullString
		if err := rows.Scan(&s.EnrollmentID, &s.StudentID, &fullName, &s.Email, &s.Status, &s.CreatedAt); err == nil {
			if fullName.Valid {
				s.FullName = fullName.String
			}
			students = append(students, s)
		}
	}

	utils.JSONResponse(w, http.StatusOK, students)
}

func HandleAssignTeacher(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		TeacherID string `json:"teacher_id"`
		SectionID string `json:"section_id"`
		SubjectID string `json:"subject_id"`
		TermID    string `json:"term_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.TeacherID == "" || input.SectionID == "" || input.SubjectID == "" || input.TermID == "" {
		utils.JSONError(w, http.StatusBadRequest, "teacher_id, section_id, subject_id, and term_id are required")
		return
	}

	assignID := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `INSERT INTO assignments (id, section_id, subject_id, teacher_id, term_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, assignID, input.SectionID, input.SubjectID, input.TeacherID, input.TermID, now, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to assign teacher")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      assignID,
		"message": "Teacher assigned successfully",
	})
}

func HandleGetTeacherAssignments(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	teacherID := ""
	for i, part := range parts {
		if (part == "teachers" || part == "teacher") && i+1 < len(parts) {
			teacherID = parts[i+1]
			break
		}
	}

	if teacherID == "" {
		teacherID = r.URL.Query().Get("teacher_id")
	}

	query := `
		SELECT a.id, a.section_id, sec.name, c.name, a.subject_id, sub.name, a.term_id, t.name, s.name
		FROM assignments a
		JOIN sections sec ON a.section_id = sec.id
		JOIN classes c ON sec.class_id = c.id
		JOIN subjects sub ON a.subject_id = sub.id
		JOIN terms t ON a.term_id = t.id
		JOIN schools s ON c.school_id = s.id
		WHERE a.teacher_id = ?`

	rows, err := db.DB.Query(query, teacherID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	type AssignmentView struct {
		ID          string `json:"id"`
		SectionID   string `json:"section_id"`
		SectionName string `json:"section_name"`
		ClassName   string `json:"class_name"`
		SubjectID   string `json:"subject_id"`
		SubjectName string `json:"subject_name"`
		TermID      string `json:"term_id"`
		TermName    string `json:"term_name"`
		SchoolName  string `json:"school_name"`
	}

	results := []AssignmentView{}
	for rows.Next() {
		var av AssignmentView
		if err := rows.Scan(&av.ID, &av.SectionID, &av.SectionName, &av.ClassName, &av.SubjectID, &av.SubjectName, &av.TermID, &av.TermName, &av.SchoolName); err == nil {
			results = append(results, av)
		}
	}

	utils.JSONResponse(w, http.StatusOK, results)
}

// --- Progress & Resource Links ---

func HandleUpdateProgress(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodPatch {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		StudentID string  `json:"student_id"`
		TopicID   string  `json:"topic_id"`
		Status    string  `json:"status"` // NOT_STARTED, IN_PROGRESS, COMPLETED
		Score     float64 `json:"score"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.StudentID == "" || input.TopicID == "" {
		utils.JSONError(w, http.StatusBadRequest, "student_id and topic_id are required")
		return
	}

	id := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	var completedAt sql.NullString
	if input.Status == "COMPLETED" {
		completedAt = sql.NullString{String: now, Valid: true}
	}

	query := `
		INSERT INTO student_progress (id, student_id, topic_id, status, score, completed_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE status = VALUES(status), score = VALUES(score), completed_at = VALUES(completed_at), updated_at = VALUES(updated_at)`

	_, err := db.DB.Exec(query, id, input.StudentID, input.TopicID, input.Status, input.Score, completedAt, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update progress")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Progress updated successfully"})
}

func HandleGetProgress(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	studentID := parts[len(parts)-1]

	rows, err := db.DB.Query("SELECT id, student_id, topic_id, status, score, completed_at, updated_at FROM student_progress WHERE student_id = ?", studentID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	progressList := []models.StudentProgress{}
	for rows.Next() {
		var p models.StudentProgress
		var completed sql.NullString
		if err := rows.Scan(&p.ID, &p.StudentID, &p.TopicID, &p.Status, &p.Score, &completed, &p.UpdatedAt); err == nil {
			if completed.Valid {
				t, _ := time.Parse("2006-01-02 15:04:05", completed.String)
				p.CompletedAt = &t
			}
			progressList = append(progressList, p)
		}
	}

	utils.JSONResponse(w, http.StatusOK, progressList)
}

func HandleLinkResource(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		TopicID      string `json:"topic_id"`
		AppID        string `json:"app_id"`
		ResourceType string `json:"resource_type"`
		ExternalID   string `json:"external_id"`
		Title        string `json:"title"`
		URL          string `json:"url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.TopicID == "" || input.Title == "" {
		utils.JSONError(w, http.StatusBadRequest, "topic_id and title are required")
		return
	}

	id := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `INSERT INTO resource_links (id, topic_id, app_id, resource_type, external_id, title, url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := db.DB.Exec(query, id, input.TopicID, input.AppID, input.ResourceType, input.ExternalID, input.Title, input.URL, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to link resource")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]string{"id": id, "message": "Resource linked successfully"})
}

func HandleGetTopicResources(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	topicID := parts[len(parts)-1]

	rows, err := db.DB.Query("SELECT id, topic_id, app_id, resource_type, external_id, title, url, created_at FROM resource_links WHERE topic_id = ?", topicID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	resources := []models.ResourceLink{}
	for rows.Next() {
		var rl models.ResourceLink
		if err := rows.Scan(&rl.ID, &rl.TopicID, &rl.AppID, &rl.ResourceType, &rl.ExternalID, &rl.Title, &rl.URL, &rl.CreatedAt); err == nil {
			resources = append(resources, rl)
		}
	}

	utils.JSONResponse(w, http.StatusOK, resources)
}

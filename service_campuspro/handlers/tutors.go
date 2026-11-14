package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// TutorAssignmentRecord represents a single subject-arm allocation
type TutorAssignmentRecord struct {
	ID            string    `json:"id"`
	TenantID      string    `json:"tenant_id"`
	SubjectID     string    `json:"subject_id"`
	SubjectCode   string    `json:"subject_code"`
	SubjectTitle  string    `json:"subject_title"`
	Department    string    `json:"department"`
	ArmID         string    `json:"arm_id"`
	ArmName       string    `json:"arm_name"`
	TeacherID     string    `json:"teacher_id"`
	TeacherName   string    `json:"teacher_name"`
	Role          string    `json:"role"`
	WeeklyPeriods int       `json:"weekly_periods"`
	CreatedAt     time.Time `json:"created_at"`
}

// TutorProfileRecord represents an educator and their aggregate academic load
type TutorProfileRecord struct {
	StaffID            string                  `json:"staff_id"`
	StaffNumber        string                  `json:"staff_number"`
	Title              string                  `json:"title"`
	FullName           string                  `json:"full_name"`
	DisplayName        string                  `json:"display_name"`
	Gender             string                  `json:"gender"`
	Email              string                  `json:"email"`
	Phone              string                  `json:"phone"`
	Cadre              string                  `json:"cadre"`
	Designation        string                  `json:"designation"`
	Department         string                  `json:"department"`
	Qualification      string                  `json:"qualification"`
	TRCNNumber         string                  `json:"trcn_number"`
	AssignedArmID      string                  `json:"assigned_arm_id"`
	AssignedArmName    string                  `json:"assigned_arm_name"`
	IsFormTeacher      bool                    `json:"is_form_teacher"`
	Status             string                  `json:"status"`
	Assignments        []TutorAssignmentRecord `json:"assignments"`
	SubjectsTaught     []string                `json:"subjects_taught"`
	ClassesTaught      []string                `json:"classes_taught"`
	TotalWeeklyPeriods int                     `json:"total_weekly_periods"`
	WorkloadStatus     string                  `json:"workload_status"` // 'Optimal Load', 'Full Capacity', 'Overloaded', 'Under-Allocated', 'Unassigned'
	AttendanceRate     float64                 `json:"attendance_rate"`
}

// TutorSummaryMetrics contains high-level KPIs for tutor management
type TutorSummaryMetrics struct {
	TotalTutors             int     `json:"total_tutors"`
	AssignedCount           int     `json:"assigned_count"`
	UnassignedCount         int     `json:"unassigned_count"`
	FormTeachersCount       int     `json:"form_teachers_count"`
	AvgWeeklyPeriods        float64 `json:"avg_weekly_periods"`
	OverloadedCount         int     `json:"overloaded_count"`
	TotalSubjectsCount      int     `json:"total_subjects_count"`
	UnassignedSubjectsCount int     `json:"unassigned_subjects_count"`
}

// HandleCampusTutors handles GET, POST, PUT, DELETE for assigned tutors & workload allocation
func HandleCampusTutors(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	// Ensure staff and subjects are seeded
	seedTenantStaffIfEmpty(tenantID)
	seedTenantSubjectsIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		deptFilter := strings.TrimSpace(r.URL.Query().Get("department"))
		workloadFilter := strings.TrimSpace(r.URL.Query().Get("workload"))
		searchQuery := strings.TrimSpace(strings.ToLower(r.URL.Query().Get("search")))

		// 1. Fetch teaching staff from campus_staff
		staffRows, err := db.DB.Query(`
			SELECT id, staff_number, title, full_name, gender, COALESCE(email, ''), COALESCE(phone, ''),
			       cadre, designation, department, COALESCE(qualification, ''), COALESCE(trcn_number, ''),
			       COALESCE(assigned_arm_id, ''), COALESCE(assigned_arm_name, ''), weekly_teaching_periods,
			       attendance_rate, status
			FROM campus_staff
			WHERE tenant_id = ? AND cadre = 'TEACHING'
			ORDER BY full_name ASC`, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to query teaching staff: %v", err))
			return
		}
		defer staffRows.Close()

		tutorsMap := make(map[string]*TutorProfileRecord)
		tutorsList := []*TutorProfileRecord{}

		for staffRows.Next() {
			var t TutorProfileRecord
			var email, phone, qual, trcn, armID, armName string
			if err := staffRows.Scan(
				&t.StaffID, &t.StaffNumber, &t.Title, &t.FullName, &t.Gender, &email, &phone,
				&t.Cadre, &t.Designation, &t.Department, &qual, &trcn,
				&armID, &armName, &t.TotalWeeklyPeriods, &t.AttendanceRate, &t.Status,
			); err == nil {
				t.Email = email
				t.Phone = phone
				t.Qualification = qual
				t.TRCNNumber = trcn
				t.AssignedArmID = armID
				t.AssignedArmName = armName
				if armName != "" && armName != "—" {
					t.IsFormTeacher = true
				}
				if t.Title != "" {
					t.DisplayName = t.Title + " " + t.FullName
				} else {
					t.DisplayName = t.FullName
				}
				t.Assignments = []TutorAssignmentRecord{}
				t.SubjectsTaught = []string{}
				t.ClassesTaught = []string{}

				tutorsMap[t.StaffID] = &t
				tutorsList = append(tutorsList, &t)
			}
		}

		// 2. Fetch all subject-teacher allocations
		allocRows, err := db.DB.Query(`
			SELECT st.id, st.tenant_id, st.subject_id, COALESCE(s.code, ''), COALESCE(s.title, ''), COALESCE(s.department, ''),
			       COALESCE(st.arm_id, ''), COALESCE(st.arm_name, ''), COALESCE(st.teacher_id, ''), st.teacher_name,
			       COALESCE(st.role, 'Subject Teacher'), st.weekly_periods, st.created_at
			FROM campus_subject_teachers st
			LEFT JOIN campus_subjects s ON st.subject_id = s.id AND st.tenant_id = s.tenant_id
			WHERE st.tenant_id = ?
			ORDER BY st.teacher_name ASC, s.title ASC`, tenantID)
		if err == nil && allocRows != nil {
			defer allocRows.Close()
			for allocRows.Next() {
				var a TutorAssignmentRecord
				if err := allocRows.Scan(
					&a.ID, &a.TenantID, &a.SubjectID, &a.SubjectCode, &a.SubjectTitle, &a.Department,
					&a.ArmID, &a.ArmName, &a.TeacherID, &a.TeacherName, &a.Role, &a.WeeklyPeriods, &a.CreatedAt,
				); err == nil {
					// Match to staff record
					var matchedTutor *TutorProfileRecord
					if a.TeacherID != "" {
						matchedTutor = tutorsMap[a.TeacherID]
					}
					if matchedTutor == nil {
						// Match by name
						normAllocName := strings.ToLower(strings.TrimSpace(a.TeacherName))
						for _, t := range tutorsList {
							normStaffName := strings.ToLower(strings.TrimSpace(t.FullName))
							normDisplayName := strings.ToLower(strings.TrimSpace(t.DisplayName))
							if normAllocName == normStaffName || normAllocName == normDisplayName ||
								strings.Contains(normAllocName, normStaffName) || strings.Contains(normStaffName, normAllocName) {
								matchedTutor = t
								break
							}
						}
					}

					if matchedTutor != nil {
						matchedTutor.Assignments = append(matchedTutor.Assignments, a)
						if a.SubjectTitle != "" && !containsString(matchedTutor.SubjectsTaught, a.SubjectTitle) {
							matchedTutor.SubjectsTaught = append(matchedTutor.SubjectsTaught, a.SubjectTitle)
						}
						if a.ArmName != "" && !containsString(matchedTutor.ClassesTaught, a.ArmName) {
							matchedTutor.ClassesTaught = append(matchedTutor.ClassesTaught, a.ArmName)
						}
					} else {
						// Standalone tutor not currently in campus_staff
						standalone := &TutorProfileRecord{
							StaffID:            a.TeacherID,
							StaffNumber:        "VISITING-TUTOR",
							Title:              "",
							FullName:           a.TeacherName,
							DisplayName:        a.TeacherName,
							Gender:             "—",
							Cadre:              "TEACHING",
							Designation:        "Visiting / Adjunct Tutor",
							Department:         a.Department,
							Status:             "ACTIVE",
							Assignments:        []TutorAssignmentRecord{a},
							SubjectsTaught:     []string{a.SubjectTitle},
							ClassesTaught:      []string{a.ArmName},
							TotalWeeklyPeriods: a.WeeklyPeriods,
							AttendanceRate:     98.0,
						}
						tutorsList = append(tutorsList, standalone)
					}
				}
			}
		}

		// 3. Calculate weekly periods, workload status, and metrics
		var metrics TutorSummaryMetrics
		metrics.TotalTutors = len(tutorsList)
		var totalPeriodsSum int

		finalTutors := []*TutorProfileRecord{}
		for _, t := range tutorsList {
			// Recalculate total weekly periods from active assignments if any exist
			var calcPeriods int
			if len(t.Assignments) > 0 {
				for _, asgn := range t.Assignments {
					calcPeriods += asgn.WeeklyPeriods
				}
				t.TotalWeeklyPeriods = calcPeriods
			}

			// Determine workload status
			if t.TotalWeeklyPeriods > 26 {
				t.WorkloadStatus = "Overloaded"
				metrics.OverloadedCount++
			} else if t.TotalWeeklyPeriods >= 23 {
				t.WorkloadStatus = "Full Capacity"
			} else if t.TotalWeeklyPeriods >= 16 {
				t.WorkloadStatus = "Optimal Load"
			} else if t.TotalWeeklyPeriods > 0 {
				t.WorkloadStatus = "Under-Allocated"
			} else {
				t.WorkloadStatus = "Unassigned"
			}

			if len(t.Assignments) > 0 || (t.AssignedArmName != "" && t.AssignedArmName != "—") {
				metrics.AssignedCount++
			} else {
				metrics.UnassignedCount++
			}

			if t.IsFormTeacher {
				metrics.FormTeachersCount++
			}

			totalPeriodsSum += t.TotalWeeklyPeriods

			// Apply filters
			if deptFilter != "" && deptFilter != "ALL" && !strings.EqualFold(t.Department, deptFilter) {
				continue
			}
			if workloadFilter != "" && workloadFilter != "ALL" && !strings.EqualFold(t.WorkloadStatus, workloadFilter) {
				continue
			}
			if searchQuery != "" {
				nameMatch := strings.Contains(strings.ToLower(t.DisplayName), searchQuery)
				deptMatch := strings.Contains(strings.ToLower(t.Department), searchQuery)
				roleMatch := strings.Contains(strings.ToLower(t.Designation), searchQuery)
				subjMatch := false
				for _, s := range t.SubjectsTaught {
					if strings.Contains(strings.ToLower(s), searchQuery) {
						subjMatch = true
						break
					}
				}
				if !nameMatch && !deptMatch && !roleMatch && !subjMatch {
					continue
				}
			}

			finalTutors = append(finalTutors, t)
		}

		if metrics.TotalTutors > 0 {
			metrics.AvgWeeklyPeriods = float64(totalPeriodsSum) / float64(metrics.TotalTutors)
		}

		// 4. Fetch count of subjects and unassigned subjects
		_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_subjects WHERE tenant_id = ?", tenantID).Scan(&metrics.TotalSubjectsCount)
		_ = db.DB.QueryRow(`
			SELECT COUNT(*) FROM campus_subjects s
			WHERE s.tenant_id = ?
			  AND (SELECT COUNT(*) FROM campus_subject_teachers st WHERE st.subject_id = s.id AND st.tenant_id = s.tenant_id) = 0
		`, tenantID).Scan(&metrics.UnassignedSubjectsCount)

		// 5. Fetch dropdown data for assignment modal
		availableStaff := []map[string]interface{}{}
		for _, t := range tutorsList {
			if t.StaffID != "" {
				availableStaff = append(availableStaff, map[string]interface{}{
					"id":          t.StaffID,
					"name":        t.DisplayName,
					"full_name":   t.FullName,
					"designation": t.Designation,
					"department":  t.Department,
				})
			}
		}

		availableSubjects := []map[string]interface{}{}
		subjRows, err := db.DB.Query("SELECT id, code, title, department, periods_per_week FROM campus_subjects WHERE tenant_id = ? ORDER BY title ASC", tenantID)
		if err == nil && subjRows != nil {
			defer subjRows.Close()
			for subjRows.Next() {
				var id, code, title, dept string
				var periods int
				if err := subjRows.Scan(&id, &code, &title, &dept, &periods); err == nil {
					availableSubjects = append(availableSubjects, map[string]interface{}{
						"id":               id,
						"code":             code,
						"title":            title,
						"department":       dept,
						"periods_per_week": periods,
					})
				}
			}
		}

		availableArms := []map[string]interface{}{}
		armRows, err := db.DB.Query(`
			SELECT a.id, a.name, COALESCE(a.arm_code, ''), COALESCE(c.name, ''), COALESCE(a.room_number, ''), COALESCE(a.form_teacher_name, '')
			FROM campus_class_arms a
			LEFT JOIN campus_classes c ON a.class_id = c.id AND a.tenant_id = c.tenant_id
			WHERE a.tenant_id = ?
			ORDER BY c.level_order ASC, a.name ASC`, tenantID)
		if err == nil && armRows != nil {
			defer armRows.Close()
			for armRows.Next() {
				var id, name, code, className, room, ftName string
				if err := armRows.Scan(&id, &name, &code, &className, &room, &ftName); err == nil {
					availableArms = append(availableArms, map[string]interface{}{
						"id":                id,
						"name":              name,
						"arm_code":          code,
						"class_name":        className,
						"room_number":       room,
						"form_teacher_name": ftName,
					})
				}
			}
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":            true,
			"metrics":            metrics,
			"tutors":             finalTutors,
			"available_staff":    availableStaff,
			"available_subjects": availableSubjects,
			"available_arms":     availableArms,
		})

	case http.MethodPost:
		var input struct {
			StaffID       string   `json:"staff_id"`
			TeacherName   string   `json:"teacher_name"`
			SubjectID     string   `json:"subject_id"`
			ArmIDs        []string `json:"arm_ids"`
			ArmID         string   `json:"arm_id"`
			ArmName       string   `json:"arm_name"`
			Role          string   `json:"role"`
			WeeklyPeriods int      `json:"weekly_periods"`
			IsFormTeacher bool     `json:"is_form_teacher"`
			FormArmID     string   `json:"form_arm_id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid request payload")
			return
		}

		if strings.TrimSpace(input.TeacherName) == "" && input.StaffID != "" {
			_ = db.DB.QueryRow("SELECT full_name FROM campus_staff WHERE id = ? AND tenant_id = ?", input.StaffID, tenantID).Scan(&input.TeacherName)
		}
		if strings.TrimSpace(input.TeacherName) == "" {
			JSONError(w, http.StatusBadRequest, "Teacher name is required")
			return
		}
		if input.SubjectID == "" {
			JSONError(w, http.StatusBadRequest, "Subject is required")
			return
		}
		if input.Role == "" {
			input.Role = "Subject Specialist"
		}
		if input.WeeklyPeriods <= 0 {
			input.WeeklyPeriods = 4
		}

		// Consolidate target arm IDs
		targetArmIDs := input.ArmIDs
		if len(targetArmIDs) == 0 && input.ArmID != "" {
			targetArmIDs = []string{input.ArmID}
		}
		if len(targetArmIDs) == 0 {
			targetArmIDs = []string{""}
		}

		createdIDs := []string{}
		for _, armID := range targetArmIDs {
			var armName string
			if armID != "" {
				_ = db.DB.QueryRow("SELECT name FROM campus_class_arms WHERE id = ? AND tenant_id = ?", armID, tenantID).Scan(&armName)
			}
			if armName == "" {
				armName = input.ArmName
			}

			newID := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_subject_teachers (
					id, tenant_id, subject_id, arm_id, arm_name, teacher_id, teacher_name, role, weekly_periods, created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
				newID, tenantID, input.SubjectID, armID, armName, input.StaffID, input.TeacherName, input.Role, input.WeeklyPeriods,
			)
			if err == nil {
				createdIDs = append(createdIDs, newID)
			}
		}

		// Handle Form Teacher assignment if requested
		if input.IsFormTeacher && input.FormArmID != "" {
			var formArmName string
			_ = db.DB.QueryRow("SELECT name FROM campus_class_arms WHERE id = ? AND tenant_id = ?", input.FormArmID, tenantID).Scan(&formArmName)

			if input.StaffID != "" {
				_, _ = db.DB.Exec("UPDATE campus_staff SET assigned_arm_id = ?, assigned_arm_name = ? WHERE id = ? AND tenant_id = ?",
					input.FormArmID, formArmName, input.StaffID, tenantID)
			}
			_, _ = db.DB.Exec("UPDATE campus_class_arms SET form_teacher_id = ?, form_teacher_name = ? WHERE id = ? AND tenant_id = ?",
				input.StaffID, input.TeacherName, input.FormArmID, tenantID)
		}

		// Recalculate teacher's total weekly periods in campus_staff
		if input.StaffID != "" {
			var totalPeriods int
			_ = db.DB.QueryRow(`
				SELECT COALESCE(SUM(weekly_periods), 0) FROM campus_subject_teachers
				WHERE (teacher_id = ? OR teacher_name = ?) AND tenant_id = ?
			`, input.StaffID, input.TeacherName, tenantID).Scan(&totalPeriods)

			_, _ = db.DB.Exec("UPDATE campus_staff SET weekly_teaching_periods = ? WHERE id = ? AND tenant_id = ?", totalPeriods, input.StaffID, tenantID)
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"success":     true,
			"message":     "Tutor allocated successfully",
			"created_ids": createdIDs,
		})

	case http.MethodPut:
		var input struct {
			AssignmentID  string `json:"assignment_id"`
			WeeklyPeriods int    `json:"weekly_periods"`
			Role          string `json:"role"`
			ArmID         string `json:"arm_id"`
			ArmName       string `json:"arm_name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.AssignmentID == "" {
			JSONError(w, http.StatusBadRequest, "Invalid request payload")
			return
		}

		if input.ArmID != "" && input.ArmName == "" {
			_ = db.DB.QueryRow("SELECT name FROM campus_class_arms WHERE id = ? AND tenant_id = ?", input.ArmID, tenantID).Scan(&input.ArmName)
		}

		_, err := db.DB.Exec(`
			UPDATE campus_subject_teachers
			SET weekly_periods = COALESCE(NULLIF(?, 0), weekly_periods),
			    role = COALESCE(NULLIF(?, ''), role),
			    arm_id = COALESCE(NULLIF(?, ''), arm_id),
			    arm_name = COALESCE(NULLIF(?, ''), arm_name)
			WHERE id = ? AND tenant_id = ?`,
			input.WeeklyPeriods, input.Role, input.ArmID, input.ArmName, input.AssignmentID, tenantID,
		)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update allocation: %v", err))
			return
		}

		JSONResponse(w, http.StatusOK, map[string]string{"message": "Allocation updated successfully"})

	case http.MethodDelete:
		assignmentID := strings.TrimSpace(r.URL.Query().Get("id"))
		if assignmentID == "" {
			JSONError(w, http.StatusBadRequest, "Allocation ID is required")
			return
		}

		// Find teacher_id before deleting so we can update campus_staff
		var staffID, teacherName string
		_ = db.DB.QueryRow("SELECT COALESCE(teacher_id, ''), teacher_name FROM campus_subject_teachers WHERE id = ? AND tenant_id = ?", assignmentID, tenantID).Scan(&staffID, &teacherName)

		_, err := db.DB.Exec("DELETE FROM campus_subject_teachers WHERE id = ? AND tenant_id = ?", assignmentID, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to remove allocation: %v", err))
			return
		}

		// Recalculate periods
		if staffID != "" || teacherName != "" {
			var totalPeriods int
			_ = db.DB.QueryRow(`
				SELECT COALESCE(SUM(weekly_periods), 0) FROM campus_subject_teachers
				WHERE (teacher_id = ? OR teacher_name = ?) AND tenant_id = ?
			`, staffID, teacherName, tenantID).Scan(&totalPeriods)

			if staffID != "" {
				_, _ = db.DB.Exec("UPDATE campus_staff SET weekly_teaching_periods = ? WHERE id = ? AND tenant_id = ?", totalPeriods, staffID, tenantID)
			}
		}

		JSONResponse(w, http.StatusOK, map[string]string{"message": "Allocation removed successfully"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func containsString(slice []string, val string) bool {
	for _, item := range slice {
		if strings.EqualFold(item, val) {
			return true
		}
	}
	return false
}

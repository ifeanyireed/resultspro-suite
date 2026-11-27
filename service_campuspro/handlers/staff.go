package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// CampusStaffRecord represents a faculty or administrative employee in Campus OS
type CampusStaffRecord struct {
	ID                    string    `json:"id"`
	TenantID              string    `json:"tenant_id"`
	StaffNumber           string    `json:"staff_number"`
	Title                 string    `json:"title"`
	FullName              string    `json:"full_name"`
	Gender                string    `json:"gender"`
	Email                 string    `json:"email"`
	Phone                 string    `json:"phone"`
	Cadre                 string    `json:"cadre"`
	Designation           string    `json:"designation"`
	Department            string    `json:"department"`
	EmploymentType        string    `json:"employment_type"`
	Qualification         string    `json:"qualification"`
	TRCNNumber            string    `json:"trcn_number"`
	AssignedArmID         string    `json:"assigned_arm_id"`
	AssignedArmName       string    `json:"assigned_arm_name"`
	WeeklyTeachingPeriods int       `json:"weekly_teaching_periods"`
	AttendanceRate        float64   `json:"attendance_rate"`
	Status                string    `json:"status"`
	JoinedDate            string    `json:"joined_date"`
	Notes                 string    `json:"notes"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
}

// CampusStaffSummary contains aggregate staff KPIs
type CampusStaffSummary struct {
	TotalStaff        int     `json:"total_staff"`
	TeachingCount     int     `json:"teaching_count"`
	NonTeachingCount  int     `json:"non_teaching_count"`
	FormMastersCount  int     `json:"form_masters_count"`
	AverageAttendance float64 `json:"average_attendance"`
}

// seedTenantStaffIfEmpty seeds realistic persistent Nigerian faculty and administrative staff
func seedTenantStaffIfEmpty(tenantID string) {
	if !demoSeedEnabled() {
		return
	}
	if tenantID == "" {
		return
	}

	var count int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_staff WHERE tenant_id = ?", tenantID).Scan(&count)
	if count > 0 {
		return
	}

	seeds := []struct {
		staffNo        string
		title          string
		name           string
		gender         string
		email          string
		phone          string
		cadre          string
		designation    string
		dept           string
		empType        string
		qualification  string
		trcn           string
		assignedArm    string
		weeklyPeriods  int
		attendanceRate float64
		joinedDate     string
	}{
		{
			staffNo: "STF-2026-001", title: "Engr.", name: "David Adeleke", gender: "MALE",
			email: "d.adeleke@scholars.ng", phone: "+234 803 442 1190", cadre: "TEACHING",
			designation: "HOD Sciences & STEM Coordinator", dept: "Sciences", empType: "FULL_TIME",
			qualification: "B.Sc. (Ed) Mathematics, COREN Registered", trcn: "TRCN/LA/88219/2021",
			assignedArm: "SSS 3 Science A", weeklyPeriods: 18, attendanceRate: 98.4, joinedDate: "2021-09-01",
		},
		{
			staffNo: "STF-2026-002", title: "Mrs.", name: "Ngozi Okafor", gender: "FEMALE",
			email: "n.okafor@scholars.ng", phone: "+234 802 884 9912", cadre: "TEACHING",
			designation: "Form Master & English Language Lead", dept: "Arts & Humanities", empType: "FULL_TIME",
			qualification: "B.A. (Ed) English Language, M.Ed Literature", trcn: "TRCN/EN/44012/2019",
			assignedArm: "JSS 1 Gold", weeklyPeriods: 20, attendanceRate: 97.5, joinedDate: "2019-10-15",
		},
		{
			staffNo: "STF-2026-003", title: "Dr.", name: "Chinedu Nwosu", gender: "MALE",
			email: "c.nwosu@scholars.ng", phone: "+234 809 332 1092", cadre: "TEACHING",
			designation: "Senior Physics Master & Lab Director", dept: "Sciences", empType: "FULL_TIME",
			qualification: "Ph.D Physics Education, TRCN Fellow", trcn: "TRCN/AB/19082/2018",
			assignedArm: "SSS 2 Science", weeklyPeriods: 16, attendanceRate: 99.1, joinedDate: "2018-01-10",
		},
		{
			staffNo: "STF-2026-004", title: "Mrs.", name: "Funke Adebayo", gender: "FEMALE",
			email: "f.adebayo@scholars.ng", phone: "+234 818 550 4421", cadre: "TEACHING",
			designation: "Vice Principal (Academics)", dept: "Administration", empType: "FULL_TIME",
			qualification: "M.Ed Educational Admin, B.Sc Biology", trcn: "TRCN/OG/77103/2017",
			assignedArm: "JSS 1 Emerald", weeklyPeriods: 10, attendanceRate: 98.8, joinedDate: "2017-08-20",
		},
		{
			staffNo: "STF-2026-005", title: "Mr.", name: "Babatunde Adewale", gender: "MALE",
			email: "b.adewale@scholars.ng", phone: "+234 812 778 9012", cadre: "TEACHING",
			designation: "Basic Technology & Robotics Tutor", dept: "Sciences", empType: "FULL_TIME",
			qualification: "B.Eng Mechanical, PGDE", trcn: "TRCN/LA/66014/2022",
			assignedArm: "JSS 1 Diamond", weeklyPeriods: 18, attendanceRate: 96.0, joinedDate: "2022-09-05",
		},
		{
			staffNo: "STF-2026-006", title: "Barr.", name: "K. Ibrahim", gender: "MALE",
			email: "k.ibrahim@scholars.ng", phone: "+234 805 221 3409", cadre: "TEACHING",
			designation: "Civic Education & Government Master", dept: "Arts & Humanities", empType: "FULL_TIME",
			qualification: "LL.B, B.L, PGDE", trcn: "TRCN/KD/55901/2020",
			assignedArm: "JSS 3 Gold", weeklyPeriods: 16, attendanceRate: 95.8, joinedDate: "2020-11-01",
		},
		{
			staffNo: "STF-2026-007", title: "Mr.", name: "Chinedu Eze", gender: "MALE",
			email: "c.eze@scholars.ng", phone: "+234 803 998 1284", cadre: "TEACHING",
			designation: "Financial Accounting & Commerce Tutor", dept: "Commercial & ICT", empType: "FULL_TIME",
			qualification: "B.Sc Accounting, TRCN Certified", trcn: "TRCN/AN/33109/2021",
			assignedArm: "JSS 2 Sapphire", weeklyPeriods: 18, attendanceRate: 97.0, joinedDate: "2021-02-14",
		},
		{
			staffNo: "STF-2026-008", title: "Mrs.", name: "Folashade Adeleke", gender: "FEMALE",
			email: "f.adeleke@scholars.ng", phone: "+234 813 440 9918", cadre: "TEACHING",
			designation: "Literature in English & Drama Lead", dept: "Arts & Humanities", empType: "FULL_TIME",
			qualification: "B.A. Literature in English, PGDE", trcn: "TRCN/OY/44192/2020",
			assignedArm: "SSS 1 Arts", weeklyPeriods: 18, attendanceRate: 96.5, joinedDate: "2020-03-01",
		},
		{
			staffNo: "STF-2026-009", title: "Mr.", name: "Segun Lawal", gender: "MALE",
			email: "s.lawal@scholars.ng", phone: "+234 802 331 4401", cadre: "NON_TEACHING",
			designation: "Chief Bursar & Financial Controller", dept: "Bursary", empType: "FULL_TIME",
			qualification: "FCA, B.Sc Accounting", trcn: "",
			assignedArm: "—", weeklyPeriods: 0, attendanceRate: 98.0, joinedDate: "2019-05-10",
		},
		{
			staffNo: "STF-2026-010", title: "Dr.", name: "Chioma Okonkwo", gender: "FEMALE",
			email: "clinic@scholars.ng", phone: "+234 803 559 1102", cadre: "NON_TEACHING",
			designation: "Campus Medical Director & Head Nurse", dept: "Campus Clinic", empType: "FULL_TIME",
			qualification: "MBBS, MPH", trcn: "",
			assignedArm: "—", weeklyPeriods: 0, attendanceRate: 99.5, joinedDate: "2018-06-15",
		},
		{
			staffNo: "STF-2026-011", title: "Alhaji", name: "Yusuf Abdullahi", gender: "MALE",
			email: "security@scholars.ng", phone: "+234 809 112 8840", cadre: "NON_TEACHING",
			designation: "Chief Security & Transport Officer", dept: "Logistics", empType: "FULL_TIME",
			qualification: "HND Crime Management, Retired Police DSP", trcn: "",
			assignedArm: "—", weeklyPeriods: 0, attendanceRate: 97.2, joinedDate: "2020-01-08",
		},
		{
			staffNo: "STF-2026-012", title: "Miss", name: "T. Bakare", gender: "FEMALE",
			email: "t.bakare@scholars.ng", phone: "+234 815 667 8901", cadre: "TEACHING",
			designation: "ICT & Data Processing Tutor", dept: "Commercial & ICT", empType: "FULL_TIME",
			qualification: "B.Sc Computer Science, TRCN Certified", trcn: "TRCN/LA/99014/2023",
			assignedArm: "JSS 2 Topaz", weeklyPeriods: 18, attendanceRate: 96.8, joinedDate: "2023-01-15",
		},
	}

	for _, s := range seeds {
		id := uuid.New().String()
		_, _ = db.DB.Exec(`
			INSERT INTO campus_staff (
				id, tenant_id, staff_number, title, full_name, gender, email, phone,
				cadre, designation, department, employment_type, qualification, trcn_number,
				assigned_arm_name, weekly_teaching_periods, attendance_rate, status, joined_date
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
		`, id, tenantID, s.staffNo, s.title, s.name, s.gender, s.email, s.phone,
			s.cadre, s.designation, s.dept, s.empType, s.qualification, s.trcn,
			s.assignedArm, s.weeklyPeriods, s.attendanceRate, s.joinedDate)
	}
}

// HandleCampusStaff handles GET, POST, PUT, DELETE for staff members
func HandleCampusStaff(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantStaffIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		cadreFilter := strings.TrimSpace(r.URL.Query().Get("cadre"))
		deptFilter := strings.TrimSpace(r.URL.Query().Get("department"))
		statusFilter := strings.TrimSpace(r.URL.Query().Get("status"))
		searchQuery := strings.TrimSpace(r.URL.Query().Get("search"))

		query := `
			SELECT id, tenant_id, staff_number, title, full_name, gender, COALESCE(email, ''), COALESCE(phone, ''),
			       cadre, designation, department, employment_type, COALESCE(qualification, ''), COALESCE(trcn_number, ''),
			       COALESCE(assigned_arm_id, ''), COALESCE(assigned_arm_name, ''), weekly_teaching_periods,
			       attendance_rate, status, COALESCE(joined_date, ''), COALESCE(notes, ''), created_at, updated_at
			FROM campus_staff
			WHERE tenant_id = ?
		`
		args := []interface{}{tenantID}

		if cadreFilter != "" && cadreFilter != "ALL" {
			query += " AND cadre = ?"
			args = append(args, cadreFilter)
		}
		if deptFilter != "" && deptFilter != "ALL" {
			query += " AND department = ?"
			args = append(args, deptFilter)
		}
		if statusFilter != "" && statusFilter != "ALL" {
			query += " AND status = ?"
			args = append(args, statusFilter)
		}
		if searchQuery != "" {
			query += " AND (LOWER(full_name) LIKE ? OR LOWER(staff_number) LIKE ? OR LOWER(designation) LIKE ? OR LOWER(department) LIKE ?)"
			likePattern := "%" + strings.ToLower(searchQuery) + "%"
			args = append(args, likePattern, likePattern, likePattern, likePattern)
		}

		query += " ORDER BY cadre ASC, designation ASC, full_name ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to load staff records from database")
			return
		}
		defer rows.Close()

		staffList := []CampusStaffRecord{}
		teachingCount := 0
		nonTeachingCount := 0
		formMastersCount := 0
		var totalAttendance float64

		for rows.Next() {
			var s CampusStaffRecord
			if err := rows.Scan(
				&s.ID, &s.TenantID, &s.StaffNumber, &s.Title, &s.FullName, &s.Gender,
				&s.Email, &s.Phone, &s.Cadre, &s.Designation, &s.Department, &s.EmploymentType,
				&s.Qualification, &s.TRCNNumber, &s.AssignedArmID, &s.AssignedArmName,
				&s.WeeklyTeachingPeriods, &s.AttendanceRate, &s.Status, &s.JoinedDate,
				&s.Notes, &s.CreatedAt, &s.UpdatedAt,
			); err == nil {
				staffList = append(staffList, s)
				if s.Cadre == "TEACHING" {
					teachingCount++
				} else {
					nonTeachingCount++
				}
				if s.AssignedArmName != "" && s.AssignedArmName != "—" {
					formMastersCount++
				}
				totalAttendance += s.AttendanceRate
			}
		}

		avgAttendance := 0.0
		if len(staffList) > 0 {
			avgAttendance = totalAttendance / float64(len(staffList))
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"staff": staffList,
			"summary": CampusStaffSummary{
				TotalStaff:        len(staffList),
				TeachingCount:     teachingCount,
				NonTeachingCount:  nonTeachingCount,
				FormMastersCount:  formMastersCount,
				AverageAttendance: avgAttendance,
			},
		})

	case http.MethodPost:
		var input struct {
			StaffNumber           string  `json:"staff_number"`
			Title                 string  `json:"title"`
			FullName              string  `json:"full_name"`
			Gender                string  `json:"gender"`
			Email                 string  `json:"email"`
			Phone                 string  `json:"phone"`
			Cadre                 string  `json:"cadre"`
			Designation           string  `json:"designation"`
			Department            string  `json:"department"`
			EmploymentType        string  `json:"employment_type"`
			Qualification         string  `json:"qualification"`
			TRCNNumber            string  `json:"trcn_number"`
			AssignedArmName       string  `json:"assigned_arm_name"`
			WeeklyTeachingPeriods int     `json:"weekly_teaching_periods"`
			JoinedDate            string  `json:"joined_date"`
			Notes                 string  `json:"notes"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.FullName) == "" {
			JSONError(w, http.StatusBadRequest, "Staff full name is required")
			return
		}

		if input.Title == "" {
			input.Title = "Mr."
		}
		if input.Cadre == "" {
			input.Cadre = "TEACHING"
		}
		if input.Designation == "" {
			input.Designation = "Subject Teacher"
		}
		if input.Department == "" {
			input.Department = "Sciences"
		}
		if input.EmploymentType == "" {
			input.EmploymentType = "FULL_TIME"
		}
		if input.StaffNumber == "" {
			input.StaffNumber = "STF-" + time.Now().Format("2006") + "-" + uuid.New().String()[:4]
		}
		if input.JoinedDate == "" {
			input.JoinedDate = time.Now().Format("2006-01-02")
		}

		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_staff (
				id, tenant_id, staff_number, title, full_name, gender, email, phone,
				cadre, designation, department, employment_type, qualification, trcn_number,
				assigned_arm_name, weekly_teaching_periods, attendance_rate, status, joined_date, notes
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 98.0, 'ACTIVE', ?, ?)
		`, id, tenantID, input.StaffNumber, input.Title, strings.TrimSpace(input.FullName),
			input.Gender, input.Email, input.Phone, input.Cadre, input.Designation,
			input.Department, input.EmploymentType, input.Qualification, input.TRCNNumber,
			input.AssignedArmName, input.WeeklyTeachingPeriods, input.JoinedDate, input.Notes)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to persist staff record to database")
			return
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":           id,
			"tenant_id":    tenantID,
			"staff_number": input.StaffNumber,
			"full_name":    input.FullName,
			"message":      "Staff member onboarded successfully",
		})

	case http.MethodPut:
		var input struct {
			ID                    string  `json:"id"`
			Title                 string  `json:"title"`
			FullName              string  `json:"full_name"`
			Gender                string  `json:"gender"`
			Email                 string  `json:"email"`
			Phone                 string  `json:"phone"`
			Cadre                 string  `json:"cadre"`
			Designation           string  `json:"designation"`
			Department            string  `json:"department"`
			EmploymentType        string  `json:"employment_type"`
			Qualification         string  `json:"qualification"`
			TRCNNumber            string  `json:"trcn_number"`
			AssignedArmName       string  `json:"assigned_arm_name"`
			WeeklyTeachingPeriods int     `json:"weekly_teaching_periods"`
			Status                string  `json:"status"`
			Notes                 string  `json:"notes"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			JSONError(w, http.StatusBadRequest, "Staff ID is required")
			return
		}

		if input.Status == "" {
			input.Status = "ACTIVE"
		}

		_, err := db.DB.Exec(`
			UPDATE campus_staff
			SET title = ?, full_name = ?, gender = ?, email = ?, phone = ?,
			    cadre = ?, designation = ?, department = ?, employment_type = ?,
			    qualification = ?, trcn_number = ?, assigned_arm_name = ?,
			    weekly_teaching_periods = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, input.Title, input.FullName, input.Gender, input.Email, input.Phone,
			input.Cadre, input.Designation, input.Department, input.EmploymentType,
			input.Qualification, input.TRCNNumber, input.AssignedArmName,
			input.WeeklyTeachingPeriods, input.Status, input.Notes, input.ID, tenantID)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to update staff record")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Staff record updated successfully"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Staff ID is required")
			return
		}

		_, err := db.DB.Exec("DELETE FROM campus_staff WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to delete staff record")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Staff record deleted successfully"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

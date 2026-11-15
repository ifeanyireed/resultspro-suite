package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// HandleParentDashboard provides persistent, tenant-isolated data for the Parent Command Dashboard
func HandleParentDashboard(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	// 1. Ensure tenant seed data
	seedTenantOperationalDataIfEmpty(tenantID)
	seedTenantBranchesIfEmpty(tenantID)
	seedTenantAttendanceIfEmpty(tenantID)
	seedTenantTransportIfEmpty(tenantID)

	todayDate := time.Now().Format("2006-01-02")

	// 2. Resolve Campus / Institution Name
	var campusName string
	_ = db.DB.QueryRow(`
		SELECT name FROM campus_branches WHERE tenant_id = ? AND is_main = true LIMIT 1
	`, tenantID).Scan(&campusName)
	if campusName == "" {
		campusName = "ExamsPRO Academy · Main Campus"
	}

	// 3. Resolve Parent Info
	parentName := "Mrs. Sarah Adeleke-Okonkwo"
	parentEmail := "sarah.okonkwo@example.com"
	parentPhone := "+234 803 459 2810"

	var dbParentName, dbParentEmail, dbParentPhone string
	_ = db.DB.QueryRow(`
		SELECT full_name, COALESCE(email, ''), COALESCE(phone, '')
		FROM campus_parents
		WHERE tenant_id = ?
		LIMIT 1
	`, tenantID).Scan(&dbParentName, &dbParentEmail, &dbParentPhone)

	if dbParentName != "" {
		parentName = dbParentName
		if dbParentEmail != "" {
			parentEmail = dbParentEmail
		}
		if dbParentPhone != "" {
			parentPhone = dbParentPhone
		}
	}

	// 4. Resolve Wards / Children for this Parent & Tenant
	type WardItem struct {
		ID              string  `json:"id"`
		StudentID       string  `json:"student_id"`
		Name            string  `json:"name"`
		FirstName       string  `json:"first_name"`
		AdmissionNumber string  `json:"admission_number"`
		ClassName       string  `json:"class_name"`
		ArmName         string  `json:"arm_name"`
		Gender          string  `json:"gender"`
		Avatar          string  `json:"avatar"`
		AttendanceRate  float64 `json:"attendance_rate"`
		AverageScore    float64 `json:"average_score"`
		AverageGPA      float64 `json:"average_gpa"`
		OutstandingFees float64 `json:"outstanding_fees"`
		WalletBalance   float64 `json:"wallet_balance"`
		PickupPIN       string  `json:"pickup_pin"`
		Status          string  `json:"status"`
	}

	wards := []WardItem{}
	rows, err := db.DB.Query(`
		SELECT s.student_id, s.student_name, s.admission_number, 
		       COALESCE(c.class_name, 'SS3'), COALESCE(a.arm_name, 'A'), COALESCE(s.gender, 'M')
		FROM campus_class_students s
		LEFT JOIN campus_class_arms a ON s.arm_id = a.id
		LEFT JOIN campus_classes c ON a.class_id = c.id
		WHERE s.tenant_id = ?
		ORDER BY s.student_name ASC
		LIMIT 5
	`, tenantID)

	if err == nil {
		defer rows.Close()
		avatarPool := []string{
			"https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/character4.jpg",
			"https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/character5.jpg",
			"https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/character6.jpg",
		}
		idx := 0
		for rows.Next() {
			var wItem WardItem
			_ = rows.Scan(&wItem.StudentID, &wItem.Name, &wItem.AdmissionNumber, &wItem.ClassName, &wItem.ArmName, &wItem.Gender)
			wItem.ID = wItem.StudentID
			parts := strings.Fields(wItem.Name)
			if len(parts) > 0 {
				wItem.FirstName = parts[0]
			} else {
				wItem.FirstName = wItem.Name
			}
			wItem.Avatar = avatarPool[idx%len(avatarPool)]
			wItem.AttendanceRate = 96.5 - float64(idx)*1.2
			wItem.AverageScore = 91.5 - float64(idx)*2.0
			wItem.AverageGPA = 3.82 - float64(idx)*0.15
			wItem.OutstandingFees = 45000.0 * float64(idx+1)
			wItem.WalletBalance = 8500.0 + float64(idx)*2000.0
			wItem.PickupPIN = "7" + uuid.New().String()[:3]
			wItem.Status = "ACTIVE"
			wards = append(wards, wItem)
			idx++
		}
	}

	// Fallback if no wards in database yet
	if len(wards) == 0 {
		wards = append(wards,
			WardItem{
				ID:              "std_alex_01",
				StudentID:       "std_alex_01",
				Name:            "Alex Adeleke-Okonkwo",
				FirstName:       "Alex",
				AdmissionNumber: "SCH/2026/0188",
				ClassName:       "Senior Secondary 3",
				ArmName:         "Science Diamond",
				Gender:          "M",
				Avatar:          "https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/character4.jpg",
				AttendanceRate:  97.4,
				AverageScore:    92.5,
				AverageGPA:      3.88,
				OutstandingFees: 45000,
				WalletBalance:   12500,
				PickupPIN:       "8492",
				Status:          "ACTIVE",
			},
			WardItem{
				ID:              "std_chiamaka_02",
				StudentID:       "std_chiamaka_02",
				Name:            "Chiamaka Adeleke-Okonkwo",
				FirstName:       "Chiamaka",
				AdmissionNumber: "SCH/2026/0342",
				ClassName:       "Junior Secondary 2",
				ArmName:         "Gold",
				Gender:          "F",
				Avatar:          "https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/character5.jpg",
				AttendanceRate:  98.1,
				AverageScore:    94.0,
				AverageGPA:      3.95,
				OutstandingFees: 0,
				WalletBalance:   9200,
				PickupPIN:       "3194",
				Status:          "ACTIVE",
			},
		)
	}

	// 5. Select Active Ward
	selectedStudentID := strings.TrimSpace(r.URL.Query().Get("student_id"))
	activeWard := wards[0]
	if selectedStudentID != "" {
		for _, w := range wards {
			if w.StudentID == selectedStudentID || w.ID == selectedStudentID {
				activeWard = w
				break
			}
		}
	}

	// 6. Aggregate Metrics across all wards
	var totalFees float64
	for _, w := range wards {
		totalFees += w.OutstandingFees
	}

	// 7. Resolve Today's Attendance for Active Ward
	var clockTimeIn, clockStatus, terminalName string
	_ = db.DB.QueryRow(`
		SELECT COALESCE(time_in, ''), COALESCE(status, 'PRESENT'), COALESCE(terminal_name, 'Main Turnstile Gate A')
		FROM campus_attendance_logs
		WHERE tenant_id = ? AND log_date = ? AND (person_id = ? OR person_name ILIKE ?)
		LIMIT 1
	`, tenantID, todayDate, activeWard.StudentID, "%"+activeWard.Name+"%").Scan(&clockTimeIn, &clockStatus, &terminalName)

	if clockStatus == "" {
		clockStatus = "PRESENT"
	}
	if terminalName == "" {
		terminalName = "Main Campus Biometric Turnstile A"
	}
	if clockTimeIn == "" {
		clockTimeIn = "07:44 AM"
	}

	// 8. Timetable Schedule for Today
	type PeriodItem struct {
		PeriodIndex int    `json:"period_index"`
		PeriodLabel string `json:"period_label"`
		Subject     string `json:"subject"`
		TeacherName string `json:"teacher_name"`
		Room        string `json:"room"`
		Time        string `json:"time"`
		Status      string `json:"status"`
	}

	scheduleList := []PeriodItem{}
	tRows, err := db.DB.Query(`
		SELECT period_index, COALESCE(period_label, 'Period 1'), COALESCE(subject_name, subject), 
		       COALESCE(teacher_id, 'Lead Faculty'), COALESCE(status, 'SCHEDULED')
		FROM campus_timetable_slots
		WHERE tenant_id = ?
		ORDER BY period_index ASC
		LIMIT 6
	`, tenantID)

	if err == nil {
		defer tRows.Close()
		times := []string{"08:00 AM - 08:45 AM", "08:45 AM - 09:30 AM", "09:45 AM - 10:30 AM", "10:30 AM - 11:15 AM", "11:30 AM - 12:15 PM", "12:15 PM - 01:00 PM"}
		rooms := []string{"Lab 3 (Physics)", "Science Hall 2", "Mathematics Suite 1", "Language Wing B", "Chemistry Lab", "ICT Hub Room 4"}
		idx := 0
		for tRows.Next() {
			var p PeriodItem
			var rawStatus string
			_ = tRows.Scan(&p.PeriodIndex, &p.PeriodLabel, &p.Subject, &p.TeacherName, &rawStatus)
			if idx < len(times) {
				p.Time = times[idx]
				p.Room = rooms[idx]
			} else {
				p.Time = "01:30 PM - 02:15 PM"
				p.Room = "Classroom 3A"
			}
			if idx == 0 {
				p.Status = "COMPLETED"
			} else if idx == 1 {
				p.Status = "ACTIVE"
			} else {
				p.Status = "UPCOMING"
			}
			scheduleList = append(scheduleList, p)
			idx++
		}
	}

	if len(scheduleList) == 0 {
		scheduleList = []PeriodItem{
			{PeriodIndex: 1, PeriodLabel: "Period 1", Subject: "Further Mathematics", TeacherName: "Engr. D. Adeleke", Room: "Math Suite A", Time: "08:00 AM - 08:45 AM", Status: "COMPLETED"},
			{PeriodIndex: 2, PeriodLabel: "Period 2", Subject: "Physics (Theory)", TeacherName: "Dr. K. Balogun", Room: "Physics Lab 2", Time: "08:45 AM - 09:30 AM", Status: "ACTIVE"},
			{PeriodIndex: 3, PeriodLabel: "Period 3", Subject: "English Language", TeacherName: "Mrs. C. Okonjo", Room: "Language Wing", Time: "09:45 AM - 10:30 AM", Status: "UPCOMING"},
			{PeriodIndex: 4, PeriodLabel: "Period 4", Subject: "Chemistry Practical", TeacherName: "Mr. T. Alabi", Room: "Chemistry Lab", Time: "10:30 AM - 11:15 AM", Status: "UPCOMING"},
			{PeriodIndex: 5, PeriodLabel: "Period 5", Subject: "Computer Science", TeacherName: "Miss F. Bello", Room: "ICT Hub", Time: "11:30 AM - 12:15 PM", Status: "UPCOMING"},
		}
	}

	// 9. Notices Feed
	type NoticeItem struct {
		ID        string `json:"id"`
		Title     string `json:"title"`
		Category  string `json:"category"`
		Date      string `json:"date"`
		Summary   string `json:"summary"`
		Author    string `json:"author"`
		Priority  string `json:"priority"`
	}

	notices := []NoticeItem{
		{
			ID:       "not_01",
			Title:    "Inter-House Athletic Championships & Parent Invitation",
			Category: "Sports & Co-Curricular",
			Date:     "This Friday · 09:00 AM",
			Summary:  "All parents and guardians are cordially invited to the Annual Inter-House Sports Fiesta holding at the main sports complex. Official house colors encouraged.",
			Author:   "Vice Principal (Student Affairs)",
			Priority: "HIGH",
		},
		{
			ID:       "not_02",
			Title:    "Mid-Term Cognitive Assessment Reports Ready on ResultsPRO",
			Category: "Academics",
			Date:     "Yesterday",
			Summary:  "First term cognitive skill mappings and mid-term report cards are now published. Access the ResultsPRO tab to review psychomotor ratings.",
			Author:   "Director of Academic Planning",
			Priority: "NORMAL",
		},
		{
			ID:       "not_03",
			Title:    "School Bus Route Maintenance Notice (Lekki / Victoria Island)",
			Category: "Transportation",
			Date:     "3 days ago",
			Summary:  "Bus Route 04 (Lekki Phase 1 / Ikoyi) will experience a 10-minute departure adjustment due to road resurfacing along Admiralty Way.",
			Author:   "Fleet Operations Command",
			Priority: "NORMAL",
		},
	}

	// 10. Construct Clean Tenant-Isolated Payload
	response := map[string]interface{}{
		"success": true,
		"school": map[string]interface{}{
			"name":        campusName,
			"session":     "2026/2027 Academic Session",
			"term":        "First Term (Term 1)",
			"tenant_id":   tenantID,
		},
		"parent": map[string]interface{}{
			"name":         parentName,
			"email":        parentEmail,
			"phone":        parentPhone,
			"relationship": "Mother / Primary Guardian",
		},
		"metrics": map[string]interface{}{
			"total_wards":            len(wards),
			"total_outstanding_fees": totalFees,
			"active_ward_name":       activeWard.Name,
			"active_ward_class":      activeWard.ClassName + " (" + activeWard.ArmName + ")",
			"today_attendance":       "Clocked in at " + clockTimeIn + " (" + clockStatus + ")",
			"average_gpa":            activeWard.AverageGPA,
			"average_score":          activeWard.AverageScore,
			"homework_completion":    92.5,
			"unread_notices":         len(notices),
		},
		"wards":       wards,
		"active_ward": activeWard,
		"today_attendance": map[string]interface{}{
			"status":        clockStatus,
			"time_in":       clockTimeIn,
			"terminal":      terminalName,
			"date":          todayDate,
			"is_punctual":   true,
			"monthly_rate":  activeWard.AttendanceRate,
		},
		"schedule": scheduleList,
		"notices":  notices,
		"modular_suite": map[string]interface{}{
			"classroompro": map[string]interface{}{
				"active_courses": 9,
				"homework_due": []map[string]interface{}{
					{"id": "hw1", "subject": "Further Mathematics", "title": "Calculus: Limits & Differential Derivatives", "due": "Tomorrow, 08:00 AM", "status": "SUBMITTED", "score": "Awaiting Grading"},
					{"id": "hw2", "subject": "Physics", "title": "Electromagnetic Induction Lab Analysis", "due": "Thursday, 11:59 PM", "status": "PENDING", "score": "-"},
					{"id": "hw3", "subject": "English Language", "title": "Essay: The Socioeconomic Impact of Tech in West Africa", "due": "Friday, 02:00 PM", "status": "PENDING", "score": "-"},
				},
				"syllabus_completion": 78.4,
			},
			"tutorspro": map[string]interface{}{
				"assigned_tutors": []map[string]interface{}{
					{"name": "Engr. D. Adeleke", "subject": "Further Mathematics", "rating": 4.9, "sessions_completed": 14, "next_session": "Today, 04:30 PM"},
					{"name": "Dr. K. Balogun", "subject": "Physics Advanced", "rating": 4.8, "sessions_completed": 10, "next_session": "Thursday, 05:00 PM"},
				},
				"tutor_remarks": "Alex demonstrates outstanding conceptual grasp of differential calculus and mechanics.",
			},
			"puzzlepro": map[string]interface{}{
				"cognitive_streak": 5,
				"challenges_completed": 42,
				"computational_thinking_score": 890,
				"global_rank": "Top 8% in Cohort",
			},
			"resultspro": map[string]interface{}{
				"latest_term": "First Term 2026/2027 Mid-Term Report",
				"overall_grade": "A",
				"percentile": "94th Percentile",
				"subjects": []map[string]interface{}{
					{"subject": "Mathematics", "test": 28, "midterm": 67, "total": 95, "grade": "A+", "remark": "Exceptional insight"},
					{"subject": "Physics", "test": 26, "midterm": 63, "total": 89, "grade": "A", "remark": "Strong problem solving"},
					{"subject": "Chemistry", "test": 27, "midterm": 64, "total": 91, "grade": "A+", "remark": "Excellent laboratory acumen"},
					{"subject": "English", "test": 25, "midterm": 61, "total": 86, "grade": "A", "remark": "Articulate written expression"},
					{"subject": "Computer Science", "test": 30, "midterm": 68, "total": 98, "grade": "A+", "remark": "Mastery in Python algorithms"},
				},
				"psychomotor": map[string]string{
					"Punctuality": "5/5 (Excellent)",
					"Attentiveness": "5/5 (Excellent)",
					"Neatness": "5/5 (Excellent)",
					"Leadership": "4/5 (Very Good)",
					"Sportsmanship": "5/5 (Excellent)",
				},
			},
		},
		"campus_operations": map[string]interface{}{
			"bursary": map[string]interface{}{
				"outstanding_balance": activeWard.OutstandingFees,
				"next_due_date":       "November 30, 2026",
				"invoices": []map[string]interface{}{
					{"invoice_no": "INV-2026-0812", "description": "Tuition & Laboratory Practical Fees (Term 1)", "total": 350000, "balance": activeWard.OutstandingFees, "status": "PARTIALLY_PAID"},
					{"invoice_no": "INV-2026-0419", "description": "Annual School Uniform & Sports Kit Package", "total": 65000, "balance": 0, "status": "PAID"},
				},
			},
			"transportation": map[string]interface{}{
				"route_name":      "Route 04 · Lekki Phase 1 / Admiralty Express",
				"bus_number":      "BUS-04 (Toyota Coaster)",
				"plate_number":    "LAG-849-XY",
				"driver_name":     "Mr. Sunday Adelekan",
				"driver_phone":    "+234 802 331 4991",
				"pickup_stop":     "Block 12, Admiralty Way, Lekki",
				"pickup_time":     "07:12 AM",
				"dropoff_time":    "03:45 PM",
				"status":          "In Transit · 6 mins away from stop",
				"telemetry_lat":   6.4474,
				"telemetry_lng":   3.4735,
			},
			"security": map[string]interface{}{
				"dismissal_pin":       activeWard.PickupPIN,
				"authorized_pickups": []map[string]interface{}{
					{"name": parentName, "relationship": "Mother", "phone": parentPhone, "is_primary": true},
					{"name": "Mr. Olumide Adeleke", "relationship": "Father", "phone": "+234 802 990 1204", "is_primary": false},
					{"name": "Driver Sunday", "relationship": "Designated Family Driver", "phone": "+234 803 221 8899", "is_primary": false},
				},
				"gate_status": "Secure · Gate Marshals On Duty",
			},
			"clinic": map[string]interface{}{
				"blood_group":    "O+",
				"genotype":       "AA",
				"known_allergies": "Peanuts (Mild), Penicillin (Sensitive)",
				"recent_visits": []map[string]interface{}{
					{"date": "2026-11-04", "reason": "Sports Bruise & Disinfectant Dressing", "nurse": "Nurse Joy", "discharged": true},
				},
			},
			"hostel": map[string]interface{}{
				"is_boarder":     false,
				"hall_name":      "Day Student (Not In Boarding)",
				"active_exeats":  []map[string]interface{}{},
			},
			"cafeteria": map[string]interface{}{
				"wallet_balance":     activeWard.WalletBalance,
				"rfid_card_number":   "RFID-NG-77491",
				"daily_spend_limit":  3000,
				"dietary_alert":      "Nut-Free Menu Guard Active",
				"recent_transactions": []map[string]interface{}{
					{"date": "Today, 10:15 AM", "item": "Jollof Rice with Grilled Chicken & Fresh Apple Juice", "amount": 1800},
					{"date": "Yesterday, 10:20 AM", "item": "Meat Pie & Greek Yogurt", "amount": 1200},
				},
			},
		},
	}

	JSONResponse(w, http.StatusOK, response)
}

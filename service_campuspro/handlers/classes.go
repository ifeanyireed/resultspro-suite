package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// ClassArmRecord represents an academic class section/arm
type ClassArmRecord struct {
	ID               string    `json:"id"`
	TenantID         string    `json:"tenant_id"`
	ClassID          string    `json:"class_id"`
	ClassName        string    `json:"class_name,omitempty"`
	Name             string    `json:"name"`
	ArmCode          string    `json:"arm_code"`
	FormTeacherID    string    `json:"form_teacher_id"`
	FormTeacherName  string    `json:"form_teacher_name"`
	RoomNumber       string    `json:"room_number"`
	Capacity         int       `json:"capacity"`
	EnrolledStudents int       `json:"enrolled_students"`
	Status           string    `json:"status"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// CampusClassRecord represents a master class level
type CampusClassRecord struct {
	ID          string           `json:"id"`
	TenantID    string           `json:"tenant_id"`
	Name        string           `json:"name"`
	LevelOrder  int              `json:"level_order"`
	Category    string           `json:"category"`
	Curriculum  string           `json:"curriculum"`
	Description string           `json:"description"`
	Arms        []ClassArmRecord `json:"arms"`
	TotalArms   int              `json:"total_arms"`
	TotalPupils int              `json:"total_pupils"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
}

// CampusArmStudent represents an enrolled student in an arm
type CampusArmStudent struct {
	ID              string    `json:"id"`
	TenantID        string    `json:"tenant_id"`
	ArmID           string    `json:"arm_id"`
	StudentID       string    `json:"student_id"`
	StudentName     string    `json:"student_name"`
	AdmissionNumber string    `json:"admission_number"`
	Gender          string    `json:"gender"`
	Status          string    `json:"status"`
	CreatedAt       time.Time `json:"created_at"`
}

// seedTenantClassesIfEmpty seeds persistent Nigerian school class levels & arms for a tenant
func seedTenantClassesIfEmpty(tenantID string) {
	if tenantID == "" {
		return
	}

	var count int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_classes WHERE tenant_id = ?", tenantID).Scan(&count)
	if count > 0 {
		return
	}

	type armSeed struct {
		name        string
		code        string
		room        string
		teacher     string
		cap         int
		enrolled    int
		sampleNames []string
	}

	type classSeed struct {
		name       string
		levelOrder int
		category   string
		curriculum string
		desc       string
		arms       []armSeed
	}

	seeds := []classSeed{
		{
			name:       "JSS 1",
			levelOrder: 1,
			category:   "JUNIOR_SECONDARY",
			curriculum: "NERDC Standard (Universal Basic Education)",
			desc:       "Junior Secondary School Year 1 (Foundational Secondary Track)",
			arms: []armSeed{
				{
					name: "Gold", code: "JSS1-GLD", room: "Room 101", teacher: "Mrs. Ngozi Okafor", cap: 35, enrolled: 32,
					sampleNames: []string{"Chukwuemeka Okonkwo", "Amina Bello", "David Adeleke", "Fatima Aliyu", "Kamsiyochukwu Ani"},
				},
				{
					name: "Diamond", code: "JSS1-DMD", room: "Room 102", teacher: "Mr. Babatunde Adewale", cap: 35, enrolled: 34,
					sampleNames: []string{"Temiloluwa Johnson", "Mustapha Bello", "Somtochukwu Eze", "Zainab Mohammed", "Tunde Fashola"},
				},
				{
					name: "Emerald", code: "JSS1-EMR", room: "Room 103", teacher: "Mrs. Funke Adebayo", cap: 35, enrolled: 30,
					sampleNames: []string{"Blessing Nwachukwu", "Ibrahim Yakubu", "Chioma Okoli", "Oluwaseun Bakare", "Hassan Danjuma"},
				},
			},
		},
		{
			name:       "JSS 2",
			levelOrder: 2,
			category:   "JUNIOR_SECONDARY",
			curriculum: "NERDC Standard (Universal Basic Education)",
			desc:       "Junior Secondary School Year 2",
			arms: []armSeed{
				{
					name: "Sapphire", code: "JSS2-SPH", room: "Room 104", teacher: "Mr. Chinedu Eze", cap: 35, enrolled: 33,
					sampleNames: []string{"Precious Oladipo", "Usman Abubakar", "Stephanie Umeh", "Emmanuel Peters", "Hadiza Garba"},
				},
				{
					name: "Ruby", code: "JSS2-RBY", room: "Room 105", teacher: "Dr. Emeka Nwosu", cap: 35, enrolled: 35,
					sampleNames: []string{"Chidinma Nwankwo", "Segun Adeleke", "Aisha Sadiq", "Victor Chukwu", "Kehinde Lawal"},
				},
				{
					name: "Topaz", code: "JSS2-TPZ", room: "Room 106", teacher: "Miss T. Bakare", cap: 35, enrolled: 31,
					sampleNames: []string{"Daniel Ojo", "Maryam Tanko", "Tochukwu Nnamani", "Damilola Ajayi", "Bilkisu Kabir"},
				},
			},
		},
		{
			name:       "JSS 3",
			levelOrder: 3,
			category:   "JUNIOR_SECONDARY",
			curriculum: "NERDC / BECE Junior WAEC Exam Track",
			desc:       "Junior Secondary School Year 3 (BECE Examination Preparatory)",
			arms: []armSeed{
				{
					name: "Gold", code: "JSS3-GLD", room: "Room 201", teacher: "Barr. K. Ibrahim", cap: 35, enrolled: 29,
					sampleNames: []string{"Oluwatobi Adeyemi", "Halima Umar", "Kelechi Onyekwelu", "Folashade Balogun", "Abubakar Sani"},
				},
				{
					name: "Diamond", code: "JSS3-DMD", room: "Room 202", teacher: "Mr. Segun Lawal", cap: 35, enrolled: 32,
					sampleNames: []string{"Anita Eke", "Godswill Akpan", "Fatima Balarabe", "Kayode Thomas", "Obinna Maduka"},
				},
				{
					name: "Pearl", code: "JSS3-PRL", room: "Room 203", teacher: "Mrs. F. Alabi", cap: 35, enrolled: 30,
					sampleNames: []string{"Samuel Soyinka", "Zarah Gana", "Ifeoma Achebe", "Rotimi Williams", "Aliyu Shehu"},
				},
			},
		},
		{
			name:       "SSS 1",
			levelOrder: 4,
			category:   "SENIOR_SECONDARY",
			curriculum: "WAEC / NECO Senior Secondary Track",
			desc:       "Senior Secondary School Year 1 (Specialized Stream Selection)",
			arms: []armSeed{
				{
					name: "Science", code: "SS1-SCI", room: "Room 204", teacher: "Engr. Ibrahim Musa", cap: 40, enrolled: 38,
					sampleNames: []string{"Ayomide Ogunlesi", "Fatima Sanusi", "Obianuju Obi", "Kunle Afolayan", "Yakubu Dogara"},
				},
				{
					name: "Arts", code: "SS1-ART", room: "Room 205", teacher: "Mrs. Folashade Adeleke", cap: 40, enrolled: 36,
					sampleNames: []string{"Nneka Ogwumike", "Abdulrasheed Maina", "Peace Udoh", "Tolani Baj", "Chijioke Mba"},
				},
				{
					name: "Commercial", code: "SS1-COM", room: "Room 206", teacher: "Mr. B. Okonkwo", cap: 40, enrolled: 34,
					sampleNames: []string{"Favour Danladi", "Sodiq Oyeleke", "Joy Nnaji", "Kabiru Gaya", "Ebubechukwu Okafor"},
				},
			},
		},
		{
			name:       "SSS 2",
			levelOrder: 5,
			category:   "SENIOR_SECONDARY",
			curriculum: "WAEC / NECO / JAMB Senior Secondary Track",
			desc:       "Senior Secondary School Year 2",
			arms: []armSeed{
				{
					name: "Science", code: "SS2-SCI", room: "Science Lab 1", teacher: "Dr. C. Nwosu", cap: 40, enrolled: 39,
					sampleNames: []string{"Chinecherem Nwoye", "Mansur Dan-Ali", "Glory Udofia", "Babatunde Raji", "Uchechi Amadi"},
				},
				{
					name: "Arts", code: "SS2-ART", room: "Room 302", teacher: "Mrs. B. Ogunleye", cap: 40, enrolled: 35,
					sampleNames: []string{"Faithfulness Idowu", "Nura Ribadu", "Chika Ike", "Simi Phillips", "Emeka Ihedioha"},
				},
				{
					name: "Commercial", code: "SS2-COM", room: "Room 303", teacher: "Mr. A. Balogun", cap: 40, enrolled: 37,
					sampleNames: []string{"Olamide Fashanu", "Zubairu Jibrin", "Ngozi Chimamanda", "Bashir Ahmad", "Somadina Adinma"},
				},
			},
		},
		{
			name:       "SSS 3",
			levelOrder: 6,
			category:   "SENIOR_SECONDARY",
			curriculum: "WASSCE / NECO SSCE / UTME Final Examination",
			desc:       "Senior Secondary School Final Year (WASSCE / JAMB Focus)",
			arms: []armSeed{
				{
					name: "Science A", code: "SS3-SCIA", room: "Hall 3A", teacher: "Engr. D. Adeleke", cap: 40, enrolled: 38,
					sampleNames: []string{"Kamsiyochukwu Ani", "Toluwani Johnson", "Amina Abdullahi", "David Oladipo", "Chioma Chukwuma"},
				},
				{
					name: "Science B", code: "SS3-SCIB", room: "Physics Lab", teacher: "Mr. I. Felix", cap: 40, enrolled: 36,
					sampleNames: []string{"Mustapha Bello", "Somtochukwu Eze", "Blessing Okoli", "Ibrahim Yakubu", "Precious Eke"},
				},
				{
					name: "Arts", code: "SS3-ART", room: "Hall 3B", teacher: "Mrs. K. Danjuma", cap: 40, enrolled: 33,
					sampleNames: []string{"Stephanie Umeh", "Daniel Ojo", "Maryam Tanko", "Tochukwu Nnamani", "Damilola Ajayi"},
				},
				{
					name: "Commercial", code: "SS3-COM", room: "Hall 3C", teacher: "Mr. P. Obi", cap: 40, enrolled: 35,
					sampleNames: []string{"Emmanuel Peters", "Chidinma Nwankwo", "Segun Adeleke", "Aisha Sadiq", "Victor Chukwu"},
				},
			},
		},
	}

	for _, c := range seeds {
		classID := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_classes (id, tenant_id, name, level_order, category, curriculum, description)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`, classID, tenantID, c.name, c.levelOrder, c.category, c.curriculum, c.desc)
		if err != nil {
			continue
		}

		for _, arm := range c.arms {
			armID := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_class_arms (id, tenant_id, class_id, name, arm_code, form_teacher_name, room_number, capacity, enrolled_students, status)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
			`, armID, tenantID, classID, arm.name, arm.code, arm.teacher, arm.room, arm.cap, arm.enrolled)
			if err != nil {
				continue
			}

			// Seed sample student roster rows
			for idx, name := range arm.sampleNames {
				gender := "FEMALE"
				if idx%2 == 0 {
					gender = "MALE"
				}
				admNo := "ADM-2026-" + arm.code + "-" + string(rune('0'+idx+1))
				_, _ = db.DB.Exec(`
					INSERT INTO campus_class_students (id, tenant_id, arm_id, student_id, student_name, admission_number, gender, status)
					VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
				`, uuid.New().String(), tenantID, armID, uuid.New().String(), name, admNo, gender)
			}
		}
	}
}

// HandleCampusClasses handles GET, POST, PUT, DELETE for campus class levels
func HandleCampusClasses(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantClassesIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		// Fetch all classes for this tenant ordered by level
		cRows, err := db.DB.Query(`
			SELECT id, tenant_id, name, level_order, category, COALESCE(curriculum, ''), COALESCE(description, ''), created_at, updated_at
			FROM campus_classes
			WHERE tenant_id = ?
			ORDER BY level_order ASC, name ASC
		`, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to load classes from database")
			return
		}
		defer cRows.Close()

		classes := []CampusClassRecord{}
		for cRows.Next() {
			var c CampusClassRecord
			if err := cRows.Scan(&c.ID, &c.TenantID, &c.Name, &c.LevelOrder, &c.Category, &c.Curriculum, &c.Description, &c.CreatedAt, &c.UpdatedAt); err == nil {
				c.Arms = []ClassArmRecord{}
				classes = append(classes, c)
			}
		}

		// Fetch all arms for this tenant
		aRows, err := db.DB.Query(`
			SELECT id, tenant_id, class_id, name, COALESCE(arm_code, ''), COALESCE(form_teacher_id, ''),
			       COALESCE(form_teacher_name, ''), COALESCE(room_number, ''), capacity, enrolled_students, status, created_at, updated_at
			FROM campus_class_arms
			WHERE tenant_id = ?
			ORDER BY name ASC
		`, tenantID)
		if err == nil {
			defer aRows.Close()
			armsMap := make(map[string][]ClassArmRecord)
			for aRows.Next() {
				var a ClassArmRecord
				if err := aRows.Scan(&a.ID, &a.TenantID, &a.ClassID, &a.Name, &a.ArmCode, &a.FormTeacherID, &a.FormTeacherName, &a.RoomNumber, &a.Capacity, &a.EnrolledStudents, &a.Status, &a.CreatedAt, &a.UpdatedAt); err == nil {
					armsMap[a.ClassID] = append(armsMap[a.ClassID], a)
				}
			}

			// Nest arms into each class
			for i := range classes {
				if arms, ok := armsMap[classes[i].ID]; ok {
					classes[i].Arms = arms
					classes[i].TotalArms = len(arms)
					totalP := 0
					for _, arm := range arms {
						totalP += arm.EnrolledStudents
					}
					classes[i].TotalPupils = totalP
				}
			}
		}

		JSONResponse(w, http.StatusOK, classes)

	case http.MethodPost:
		var input struct {
			Name        string `json:"name"`
			LevelOrder  int    `json:"level_order"`
			Category    string `json:"category"`
			Curriculum  string `json:"curriculum"`
			Description string `json:"description"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.Name) == "" {
			JSONError(w, http.StatusBadRequest, "Class name is required")
			return
		}

		if input.LevelOrder <= 0 {
			input.LevelOrder = 1
		}
		if input.Category == "" {
			input.Category = "SECONDARY"
		}
		if input.Curriculum == "" {
			input.Curriculum = "NERDC / WAEC Standard"
		}

		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_classes (id, tenant_id, name, level_order, category, curriculum, description)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`, id, tenantID, strings.TrimSpace(input.Name), input.LevelOrder, input.Category, input.Curriculum, input.Description)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to create class in database")
			return
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":        id,
			"tenant_id": tenantID,
			"name":      input.Name,
			"message":   "Class created successfully",
		})

	case http.MethodPut:
		var input struct {
			ID          string `json:"id"`
			Name        string `json:"name"`
			LevelOrder  int    `json:"level_order"`
			Category    string `json:"category"`
			Curriculum  string `json:"curriculum"`
			Description string `json:"description"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			JSONError(w, http.StatusBadRequest, "Class ID is required")
			return
		}

		_, err := db.DB.Exec(`
			UPDATE campus_classes
			SET name = ?, level_order = ?, category = ?, curriculum = ?, description = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, input.Name, input.LevelOrder, input.Category, input.Curriculum, input.Description, input.ID, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to update class")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Class updated successfully"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Class ID is required")
			return
		}

		_, err := db.DB.Exec("DELETE FROM campus_classes WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to delete class")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Class and associated arms deleted"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleCampusArms handles GET, POST, PUT, DELETE for class arms/sections
func HandleCampusArms(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantClassesIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		classID := r.URL.Query().Get("class_id")
		query := `
			SELECT a.id, a.tenant_id, a.class_id, c.name as class_name, a.name, COALESCE(a.arm_code, ''),
			       COALESCE(a.form_teacher_id, ''), COALESCE(a.form_teacher_name, ''), COALESCE(a.room_number, ''),
			       a.capacity, a.enrolled_students, a.status, a.created_at, a.updated_at
			FROM campus_class_arms a
			JOIN campus_classes c ON a.class_id = c.id
			WHERE a.tenant_id = ?
		`
		args := []interface{}{tenantID}
		if classID != "" {
			query += " AND a.class_id = ?"
			args = append(args, classID)
		}
		query += " ORDER BY c.level_order ASC, a.name ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to load class arms from database")
			return
		}
		defer rows.Close()

		arms := []ClassArmRecord{}
		for rows.Next() {
			var a ClassArmRecord
			if err := rows.Scan(&a.ID, &a.TenantID, &a.ClassID, &a.ClassName, &a.Name, &a.ArmCode, &a.FormTeacherID, &a.FormTeacherName, &a.RoomNumber, &a.Capacity, &a.EnrolledStudents, &a.Status, &a.CreatedAt, &a.UpdatedAt); err == nil {
				arms = append(arms, a)
			}
		}

		JSONResponse(w, http.StatusOK, arms)

	case http.MethodPost:
		var input struct {
			ClassID         string `json:"class_id"`
			Name            string `json:"name"`
			ArmCode         string `json:"arm_code"`
			FormTeacherName string `json:"form_teacher_name"`
			RoomNumber      string `json:"room_number"`
			Capacity        int    `json:"capacity"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ClassID == "" || strings.TrimSpace(input.Name) == "" {
			JSONError(w, http.StatusBadRequest, "class_id and arm name are required")
			return
		}

		if input.Capacity <= 0 {
			input.Capacity = 35
		}

		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_class_arms (id, tenant_id, class_id, name, arm_code, form_teacher_name, room_number, capacity, enrolled_students, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'ACTIVE')
		`, id, tenantID, input.ClassID, strings.TrimSpace(input.Name), input.ArmCode, input.FormTeacherName, input.RoomNumber, input.Capacity)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to create class arm in database")
			return
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":        id,
			"tenant_id": tenantID,
			"class_id":  input.ClassID,
			"name":      input.Name,
			"message":   "Class arm created successfully",
		})

	case http.MethodPut:
		var input struct {
			ID              string `json:"id"`
			Name            string `json:"name"`
			ArmCode         string `json:"arm_code"`
			FormTeacherName string `json:"form_teacher_name"`
			RoomNumber      string `json:"room_number"`
			Capacity        int    `json:"capacity"`
			Status          string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			JSONError(w, http.StatusBadRequest, "Arm ID is required")
			return
		}

		if input.Status == "" {
			input.Status = "ACTIVE"
		}
		if input.Capacity <= 0 {
			input.Capacity = 35
		}

		_, err := db.DB.Exec(`
			UPDATE campus_class_arms
			SET name = ?, arm_code = ?, form_teacher_name = ?, room_number = ?, capacity = ?, status = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, input.Name, input.ArmCode, input.FormTeacherName, input.RoomNumber, input.Capacity, input.Status, input.ID, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to update class arm")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Class arm updated successfully"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Arm ID is required")
			return
		}

		_, err := db.DB.Exec("DELETE FROM campus_class_arms WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to delete class arm")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Class arm deleted successfully"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleCampusArmStudents handles GET and POST for student roster of an arm
func HandleCampusArmStudents(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantClassesIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		armID := r.URL.Query().Get("arm_id")
		if armID == "" {
			JSONError(w, http.StatusBadRequest, "arm_id parameter is required")
			return
		}

		rows, err := db.DB.Query(`
			SELECT id, tenant_id, arm_id, student_id, student_name, admission_number, gender, status, created_at
			FROM campus_class_students
			WHERE tenant_id = ? AND arm_id = ?
			ORDER BY student_name ASC
		`, tenantID, armID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to load student roster")
			return
		}
		defer rows.Close()

		students := []CampusArmStudent{}
		for rows.Next() {
			var s CampusArmStudent
			if err := rows.Scan(&s.ID, &s.TenantID, &s.ArmID, &s.StudentID, &s.StudentName, &s.AdmissionNumber, &s.Gender, &s.Status, &s.CreatedAt); err == nil {
				students = append(students, s)
			}
		}

		JSONResponse(w, http.StatusOK, students)

	case http.MethodPost:
		var input struct {
			ArmID           string `json:"arm_id"`
			StudentName     string `json:"student_name"`
			AdmissionNumber string `json:"admission_number"`
			Gender          string `json:"gender"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ArmID == "" || strings.TrimSpace(input.StudentName) == "" {
			JSONError(w, http.StatusBadRequest, "arm_id and student_name are required")
			return
		}

		if input.Gender == "" {
			input.Gender = "MALE"
		}
		if input.AdmissionNumber == "" {
			input.AdmissionNumber = "ADM-" + time.Now().Format("2006") + "-" + uuid.New().String()[:5]
		}

		studentID := uuid.New().String()
		recordID := uuid.New().String()

		_, err := db.DB.Exec(`
			INSERT INTO campus_class_students (id, tenant_id, arm_id, student_id, student_name, admission_number, gender, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
		`, recordID, tenantID, input.ArmID, studentID, strings.TrimSpace(input.StudentName), input.AdmissionNumber, input.Gender)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to enroll student into arm")
			return
		}

		// Increment enrolled count on the arm
		_, _ = db.DB.Exec("UPDATE campus_class_arms SET enrolled_students = enrolled_students + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", input.ArmID, tenantID)

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":               recordID,
			"student_id":       studentID,
			"student_name":     input.StudentName,
			"admission_number": input.AdmissionNumber,
			"message":          "Student enrolled successfully",
		})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

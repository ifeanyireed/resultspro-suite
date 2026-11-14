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

// SubjectRecord represents a curriculum subject in Campus OS
type SubjectRecord struct {
	ID             string                 `json:"id"`
	TenantID       string                 `json:"tenant_id"`
	Code           string                 `json:"code"`
	Title          string                 `json:"title"`
	Department     string                 `json:"department"`
	Category       string                 `json:"category"`
	Curriculum     string                 `json:"curriculum"`
	LevelCategory  string                 `json:"level_category"`
	PeriodsPerWeek int                    `json:"periods_per_week"`
	CreditUnits    int                    `json:"credit_units"`
	CAWeight       int                    `json:"ca_weight"`
	ExamWeight     int                    `json:"exam_weight"`
	PassMark       int                    `json:"pass_mark"`
	Status         string                 `json:"status"`
	Description    string                 `json:"description"`
	TutorsCount    int                    `json:"tutors_count"`
	ArmsCount      int                    `json:"arms_count"`
	AssignedTutors []SubjectTeacherRecord `json:"assigned_tutors,omitempty"`
	AssignedArms   []ClassSubjectRecord   `json:"assigned_arms,omitempty"`
	CreatedAt      time.Time              `json:"created_at"`
	UpdatedAt      time.Time              `json:"updated_at"`
}

// ClassSubjectRecord represents a subject mapped to a class arm
type ClassSubjectRecord struct {
	ID           string    `json:"id"`
	TenantID     string    `json:"tenant_id"`
	SubjectID    string    `json:"subject_id"`
	ClassID      string    `json:"class_id"`
	ClassName    string    `json:"class_name"`
	ArmID        string    `json:"arm_id"`
	ArmName      string    `json:"arm_name"`
	IsCompulsory bool      `json:"is_compulsory"`
	CreatedAt    time.Time `json:"created_at"`
}

// SubjectTeacherRecord represents an educator assigned to teach a subject
type SubjectTeacherRecord struct {
	ID            string    `json:"id"`
	TenantID      string    `json:"tenant_id"`
	SubjectID     string    `json:"subject_id"`
	ArmID         string    `json:"arm_id"`
	ArmName       string    `json:"arm_name"`
	TeacherID     string    `json:"teacher_id"`
	TeacherName   string    `json:"teacher_name"`
	Role          string    `json:"role"`
	WeeklyPeriods int       `json:"weekly_periods"`
	CreatedAt     time.Time `json:"created_at"`
}

// seedTenantSubjectsIfEmpty seeds the 28 standard NERDC/WAEC/IGCSE curriculum subjects for a tenant
func seedTenantSubjectsIfEmpty(tenantID string) {
	if tenantID == "" {
		return
	}

	var count int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_subjects WHERE tenant_id = ?", tenantID).Scan(&count)
	if count > 0 {
		return
	}

	type seedItem struct {
		code       string
		title      string
		dept       string
		cat        string
		curr       string
		level      string
		periods    int
		credits    int
		caWeight   int
		examWeight int
		passMark   int
		desc       string
		tutors     []string
	}

	seeds := []seedItem{
		// 1. General Mathematics
		{
			code: "MTH-101", title: "General Mathematics", dept: "STEM & Sciences",
			cat: "Core Compulsory", curr: "NERDC / WAEC / IGCSE", level: "ALL",
			periods: 5, credits: 4, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Foundational mathematics covering algebra, Euclidean geometry, trigonometry, and statistics.",
			tutors: []string{"Mr. David Jenkins", "Mrs. Angela Peters", "Mr. Samuel Alabi", "Ms. Grace Udoh"},
		},
		// 2. English Language & Literature
		{
			code: "ENG-102", title: "English Language & Literature", dept: "Humanities",
			cat: "Core Compulsory", curr: "NERDC / WAEC / IGCSE", level: "ALL",
			periods: 5, credits: 4, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Comprehensive literacy covering syntax, comprehension, oral English diction, and African/world literature.",
			tutors: []string{"Mrs. Funke Adebayo", "Mr. Victor Okonkwo", "Mrs. Halima Bello", "Miss Blessing Danjuma", "Mr. Chinedu Eze"},
		},
		// 3. Physics
		{
			code: "PHY-201", title: "Physics (Practical & Theory)", dept: "STEM & Sciences",
			cat: "Science Core", curr: "WAEC / IGCSE", level: "SENIOR_SECONDARY",
			periods: 4, credits: 3, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Mechanics, waves, thermal physics, electromagnetism, and hands-on laboratory practicals.",
			tutors: []string{"Dr. Samuel Eze", "Engr. Patrick Audu"},
		},
		// 4. Chemistry
		{
			code: "CHM-202", title: "Chemistry (Practical & Theory)", dept: "STEM & Sciences",
			cat: "Science Core", curr: "WAEC / IGCSE", level: "SENIOR_SECONDARY",
			periods: 4, credits: 3, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Inorganic, organic, and physical chemistry with quantitative and qualitative wet-lab analysis.",
			tutors: []string{"Mr. Kayode Bello", "Mrs. Victoria Danladi"},
		},
		// 5. Biology
		{
			code: "BIO-203", title: "Biology & Life Sciences", dept: "STEM & Sciences",
			cat: "Science Core", curr: "NERDC / WAEC", level: "SENIOR_SECONDARY",
			periods: 4, credits: 3, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Cell biology, physiology, genetics, ecology, and anatomy dissection sessions.",
			tutors: []string{"Ms. Zainab Lawal", "Dr. Emeka Nwosu", "Mrs. Maryam Tanko"},
		},
		// 6. Data Processing & AI
		{
			code: "CSC-301", title: "Data Processing, Coding & AI", dept: "Future Skills",
			cat: "Core Compulsory", curr: "NERDC / PuzzlePRO", level: "ALL",
			periods: 4, credits: 3, caWeight: 50, examWeight: 50, passMark: 55,
			desc: "Computational thinking, Python scripting, spreadsheet modeling, and AI ethics via PuzzlePRO labs.",
			tutors: []string{"Mr. Emeka Okafor", "Engr. Tunde Fashola", "Miss Kamsi Ani"},
		},
		// 7. Economics & Financial Accounting
		{
			code: "ECO-210", title: "Economics & Financial Accounting", dept: "Commercial",
			cat: "Commercial Core", curr: "NERDC / WAEC", level: "SENIOR_SECONDARY",
			periods: 4, credits: 3, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Micro/macroeconomics, market dynamics, ledger bookkeeping, trial balances, and financial audits.",
			tutors: []string{"Mrs. Ngozi Obi", "Mr. Babatunde Raji"},
		},
		// 8. Civic Education & Government
		{
			code: "GOV-215", title: "Civic Education & Government", dept: "Humanities",
			cat: "Core / Elective", curr: "NERDC / WAEC", level: "ALL",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Constitutional democracy, national values, institutional governance, human rights, and political systems.",
			tutors: []string{"Mrs. Halima Bello", "Barr. Kelechi Ibrahim"},
		},
		// 9. Further Mathematics
		{
			code: "FMT-205", title: "Further Mathematics", dept: "STEM & Sciences",
			cat: "Science Core", curr: "WAEC / IGCSE", level: "SENIOR_SECONDARY",
			periods: 4, credits: 3, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Advanced calculus, vectors, complex numbers, matrices, and mechanics for engineering tracks.",
			tutors: []string{"Mr. David Jenkins", "Engr. Patrick Audu"},
		},
		// 10. Agricultural Science
		{
			code: "AGR-104", title: "Agricultural Science", dept: "STEM & Sciences",
			cat: "Core / Elective", curr: "NERDC / WAEC", level: "ALL",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Agronomy, crop production, soil science, poultry farming, and agricultural mechanization.",
			tutors: []string{"Mr. Sunday Adeleke", "Mrs. Bisi Alabi"},
		},
		// 11. Technical Drawing & CAD
		{
			code: "TED-208", title: "Technical Drawing & CAD", dept: "STEM & Sciences",
			cat: "Science / Tech Core", curr: "WAEC / IGCSE", level: "SENIOR_SECONDARY",
			periods: 3, credits: 2, caWeight: 50, examWeight: 50, passMark: 50,
			desc: "Orthographic projections, isometric engineering drafting, and computer-aided architectural design.",
			tutors: []string{"Engr. Patrick Audu"},
		},
		// 12. Commerce & Business Studies
		{
			code: "COM-103", title: "Commerce & Business Studies", dept: "Commercial",
			cat: "Commercial Core", curr: "NERDC / WAEC", level: "ALL",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Trade channels, banking services, marketing, commercial law, and enterprise creation.",
			tutors: []string{"Mrs. Ngozi Obi", "Mr. A. Balogun"},
		},
		// 13. Christian Religious Studies
		{
			code: "CRS-107", title: "Christian Religious Studies", dept: "Humanities",
			cat: "Elective", curr: "NERDC / WAEC", level: "ALL",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Old and New Testament narratives, Christian ethics, faith formation, and comparative religion.",
			tutors: []string{"Pastor Emmanuel Peters"},
		},
		// 14. Islamic Religious Studies
		{
			code: "IRS-108", title: "Islamic Religious Studies", dept: "Humanities",
			cat: "Elective", curr: "NERDC / WAEC", level: "ALL",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Tafsir of the Holy Qur'an, Hadith traditions, Fiqh jurisprudence, and Sirah history.",
			tutors: []string{"Ustaz Abubakar Sani"},
		},
		// 15. French Language & Diction
		{
			code: "FRN-109", title: "French Language & Diction", dept: "Languages",
			cat: "Elective", curr: "NERDC / DELF", level: "ALL",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "French grammatical structures, conversational fluency, phonetics, and Francophone cultural studies.",
			tutors: []string{"Mme. Chantal Dubois", "Mr. Segun Lawal"},
		},
		// 16. Nigerian Indigenous Languages (Yoruba, Igbo, Hausa)
		{
			code: "LNG-110", title: "Nigerian Languages & Culture", dept: "Languages",
			cat: "Core / Elective", curr: "NERDC / WAEC", level: "ALL",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Linguistic orthography, proverbs, oral traditions, and cultural heritage across Nigerian regions.",
			tutors: []string{"Mrs. Folashade Adeleke", "Mazi Chijioke Mba"},
		},
		// 17. Catering Craft Practice (NERDC Trade)
		{
			code: "CCP-212", title: "Catering Craft Practice", dept: "Vocational & Trade",
			cat: "Trade / Entrepreneurship", curr: "NERDC / WAEC Trade", level: "SENIOR_SECONDARY",
			periods: 3, credits: 2, caWeight: 60, examWeight: 40, passMark: 50,
			desc: "Mandatory NERDC trade curriculum covering food preparation, hospitality hygiene, and culinary arts.",
			tutors: []string{"Chef Beatrice Ogunleye"},
		},
		// 18. Animal Husbandry (NERDC Trade)
		{
			code: "ANH-214", title: "Animal Husbandry", dept: "Vocational & Trade",
			cat: "Trade / Entrepreneurship", curr: "NERDC / WAEC Trade", level: "SENIOR_SECONDARY",
			periods: 3, credits: 2, caWeight: 50, examWeight: 50, passMark: 50,
			desc: "Livestock management, poultry brooding, animal nutrition, disease prevention, and commercial farm ops.",
			tutors: []string{"Mr. Sunday Adeleke"},
		},
		// 19. Visual Arts & Creative Design
		{
			code: "ART-105", title: "Visual Arts & Creative Design", dept: "Humanities",
			cat: "Elective", curr: "NERDC / Cambridge IGCSE", level: "ALL",
			periods: 3, credits: 2, caWeight: 50, examWeight: 50, passMark: 50,
			desc: "Drawing, painting, textile design, sculpture, ceramics, and African contemporary art history.",
			tutors: []string{"Mr. Rotimi Williams"},
		},
		// 20. Geography & Environmental Studies
		{
			code: "GEO-206", title: "Geography & Environmental Studies", dept: "STEM & Sciences",
			cat: "Social Science Core", curr: "WAEC / IGCSE", level: "SENIOR_SECONDARY",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Physical geomorphology, climatology, GIS spatial mapping, and human socioeconomic geography.",
			tutors: []string{"Mr. Tunde Bakare"},
		},
		// 21. History & African Studies
		{
			code: "HST-207", title: "History & African Heritage", dept: "Humanities",
			cat: "Elective", curr: "NERDC / WAEC", level: "ALL",
			periods: 3, credits: 2, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Pre-colonial empires, transatlantic connections, nationalism, Nigerian constitutional milestones.",
			tutors: []string{"Dr. Emeka Nwosu"},
		},
		// 22. Literature in English
		{
			code: "LIT-209", title: "Literature in English", dept: "Humanities",
			cat: "Arts Core", curr: "WAEC / NECO / IGCSE", level: "SENIOR_SECONDARY",
			periods: 4, credits: 3, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "In-depth literary criticism of Shakespearean drama, African prose, poetry anthologies, and rhetoric.",
			tutors: []string{"Mrs. Funke Adebayo", "Miss Blessing Danjuma"},
		},
		// 23. Basic Science & Technology
		{
			code: "BST-101", title: "Basic Science & Technology", dept: "STEM & Sciences",
			cat: "Junior Secondary Core", curr: "NERDC / BECE", level: "JUNIOR_SECONDARY",
			periods: 4, credits: 3, caWeight: 40, examWeight: 60, passMark: 50,
			desc: "Integrated introduction to energy, environmental changes, basic physiology, and physical world.",
			tutors: []string{"Ms. Zainab Lawal", "Mr. Kayode Bello"},
		},
		// 24. Basic Technology & Robotics
		{
			code: "BTE-102", title: "Basic Technology & Robotics", dept: "Future Skills",
			cat: "Junior Secondary Core", curr: "NERDC / PuzzlePRO", level: "JUNIOR_SECONDARY",
			periods: 3, credits: 2, caWeight: 50, examWeight: 50, passMark: 50,
			desc: "Workshop safety, hand tools, basic electronics, simple mechanisms, and LEGO/VEX robotic builds.",
			tutors: []string{"Mr. Emeka Okafor"},
		},
		// 25. Physical & Health Education
		{
			code: "PHE-106", title: "Physical & Health Education", dept: "Health & Sports",
			cat: "Core Compulsory", curr: "NERDC / WAEC", level: "ALL",
			periods: 2, credits: 1, caWeight: 50, examWeight: 50, passMark: 50,
			desc: "Athletics, team sports tactics, personal hygiene, first aid, nutrition, and kinesiology.",
			tutors: []string{"Coach Monday Musa"},
		},
		// 26. Music & Performing Arts
		{
			code: "MUS-111", title: "Music & Performing Arts", dept: "Creative Arts",
			cat: "Elective", curr: "NERDC / ABRSM", level: "ALL",
			periods: 2, credits: 1, caWeight: 50, examWeight: 50, passMark: 50,
			desc: "Staff notation, ear training, choral singing, instrumental proficiency, and Nigerian indigenous music.",
			tutors: []string{"Mr. Samuel Soyinka"},
		},
		// 27. Cultural & Creative Arts
		{
			code: "CCA-112", title: "Cultural & Creative Arts (CCA)", dept: "Creative Arts",
			cat: "Junior Secondary Core", curr: "NERDC / BECE", level: "JUNIOR_SECONDARY",
			periods: 3, credits: 2, caWeight: 50, examWeight: 50, passMark: 50,
			desc: "Integrated curriculum combining drama, dance, craftwork, and cultural appreciation for junior classes.",
			tutors: []string{"Mr. Rotimi Williams"},
		},
		// 28. Food & Nutrition
		{
			code: "FDN-216", title: "Food & Nutrition", dept: "Vocational & Trade",
			cat: "Science / Voc Core", curr: "WAEC / NECO", level: "SENIOR_SECONDARY",
			periods: 3, credits: 2, caWeight: 50, examWeight: 50, passMark: 50,
			desc: "Nutrient biochemistry, meal planning, dietary deficiencies, food preservation, and clinical nutrition.",
			tutors: []string{"Chef Beatrice Ogunleye"},
		},
	}

	for _, s := range seeds {
		subjID := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_subjects (
				id, tenant_id, code, title, department, category, curriculum, level_category,
				periods_per_week, credit_units, ca_weight, exam_weight, pass_mark, status, description, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			subjID, tenantID, s.code, s.title, s.dept, s.cat, s.curr, s.level,
			s.periods, s.credits, s.caWeight, s.examWeight, s.passMark, s.desc,
		)
		if err != nil {
			continue
		}

		// Seed initial assigned tutors
		for _, tutor := range s.tutors {
			tutorID := uuid.New().String()
			_, _ = db.DB.Exec(`
				INSERT INTO campus_subject_teachers (
					id, tenant_id, subject_id, teacher_name, role, weekly_periods, created_at
				) VALUES (?, ?, ?, ?, 'Subject Specialist', ?, CURRENT_TIMESTAMP)`,
				tutorID, tenantID, subjID, tutor, s.periods,
			)
		}
	}
}

// HandleCampusSubjects manages curriculum subjects CRUD (persistent & tenant-isolated)
func HandleCampusSubjects(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantSubjectsIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		deptFilter := strings.TrimSpace(r.URL.Query().Get("department"))
		catFilter := strings.TrimSpace(r.URL.Query().Get("category"))
		currFilter := strings.TrimSpace(r.URL.Query().Get("curriculum"))
		levelFilter := strings.TrimSpace(r.URL.Query().Get("level_category"))
		search := strings.TrimSpace(strings.ToLower(r.URL.Query().Get("search")))
		subjectID := strings.TrimSpace(r.URL.Query().Get("id"))

		query := `
			SELECT 
				s.id, s.tenant_id, s.code, s.title, s.department, s.category, s.curriculum, s.level_category,
				s.periods_per_week, s.credit_units, s.ca_weight, s.exam_weight, s.pass_mark, s.status,
				COALESCE(s.description, ''), s.created_at, s.updated_at,
				(SELECT COUNT(*) FROM campus_subject_teachers st WHERE st.subject_id = s.id AND st.tenant_id = s.tenant_id) as tutors_count,
				(SELECT COUNT(*) FROM campus_class_subjects cs WHERE cs.subject_id = s.id AND cs.tenant_id = s.tenant_id) as arms_count
			FROM campus_subjects s
			WHERE s.tenant_id = ?
		`
		args := []interface{}{tenantID}

		if subjectID != "" {
			query += " AND s.id = ?"
			args = append(args, subjectID)
		}
		if deptFilter != "" && deptFilter != "ALL" {
			query += " AND s.department = ?"
			args = append(args, deptFilter)
		}
		if catFilter != "" && catFilter != "ALL" {
			query += " AND s.category = ?"
			args = append(args, catFilter)
		}
		if currFilter != "" && currFilter != "ALL" {
			query += " AND s.curriculum LIKE ?"
			args = append(args, "%"+currFilter+"%")
		}
		if levelFilter != "" && levelFilter != "ALL" {
			query += " AND (s.level_category = ? OR s.level_category = 'ALL')"
			args = append(args, levelFilter)
		}
		if search != "" {
			query += " AND (LOWER(s.title) LIKE ? OR LOWER(s.code) LIKE ? OR LOWER(s.department) LIKE ?)"
			args = append(args, "%"+search+"%", "%"+search+"%", "%"+search+"%")
		}

		query += " ORDER BY s.code ASC, s.title ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to query subjects: %v", err))
			return
		}
		defer rows.Close()

		subjects := []SubjectRecord{}
		for rows.Next() {
			var s SubjectRecord
			if err := rows.Scan(
				&s.ID, &s.TenantID, &s.Code, &s.Title, &s.Department, &s.Category, &s.Curriculum, &s.LevelCategory,
				&s.PeriodsPerWeek, &s.CreditUnits, &s.CAWeight, &s.ExamWeight, &s.PassMark, &s.Status,
				&s.Description, &s.CreatedAt, &s.UpdatedAt, &s.TutorsCount, &s.ArmsCount,
			); err == nil {
				subjects = append(subjects, s)
			}
		}

		// Also collect unique departments and count metrics for UI tabs
		deptCounts := map[string]int{}
		for _, s := range subjects {
			deptCounts[s.Department]++
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":     true,
			"subjects":    subjects,
			"total":       len(subjects),
			"dept_counts": deptCounts,
		})

	case http.MethodPost:
		var input struct {
			Code           string `json:"code"`
			Title          string `json:"title"`
			Department     string `json:"department"`
			Category       string `json:"category"`
			Curriculum     string `json:"curriculum"`
			LevelCategory  string `json:"level_category"`
			PeriodsPerWeek int    `json:"periods_per_week"`
			CreditUnits    int    `json:"credit_units"`
			CAWeight       int    `json:"ca_weight"`
			ExamWeight     int    `json:"exam_weight"`
			PassMark       int    `json:"pass_mark"`
			Status         string `json:"status"`
			Description    string `json:"description"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		input.Code = strings.ToUpper(strings.TrimSpace(input.Code))
		input.Title = strings.TrimSpace(input.Title)
		if input.Code == "" || input.Title == "" {
			JSONError(w, http.StatusBadRequest, "Subject code and title are required")
			return
		}
		if input.Department == "" {
			input.Department = "General Studies"
		}
		if input.Category == "" {
			input.Category = "Core Compulsory"
		}
		if input.Curriculum == "" {
			input.Curriculum = "NERDC / WAEC Standard"
		}
		if input.LevelCategory == "" {
			input.LevelCategory = "ALL"
		}
		if input.PeriodsPerWeek <= 0 {
			input.PeriodsPerWeek = 4
		}
		if input.CreditUnits <= 0 {
			input.CreditUnits = 1
		}
		if input.CAWeight <= 0 && input.ExamWeight <= 0 {
			input.CAWeight = 40
			input.ExamWeight = 60
		}
		if input.PassMark <= 0 {
			input.PassMark = 50
		}
		if input.Status == "" {
			input.Status = "ACTIVE"
		}

		newID := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_subjects (
				id, tenant_id, code, title, department, category, curriculum, level_category,
				periods_per_week, credit_units, ca_weight, exam_weight, pass_mark, status, description, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			newID, tenantID, input.Code, input.Title, input.Department, input.Category, input.Curriculum, input.LevelCategory,
			input.PeriodsPerWeek, input.CreditUnits, input.CAWeight, input.ExamWeight, input.PassMark, input.Status, input.Description,
		)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create subject: %v", err))
			return
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"success": true,
			"message": "Subject registered successfully",
			"id":      newID,
		})

	case http.MethodPut:
		var input struct {
			ID             string `json:"id"`
			Code           string `json:"code"`
			Title          string `json:"title"`
			Department     string `json:"department"`
			Category       string `json:"category"`
			Curriculum     string `json:"curriculum"`
			LevelCategory  string `json:"level_category"`
			PeriodsPerWeek int    `json:"periods_per_week"`
			CreditUnits    int    `json:"credit_units"`
			CAWeight       int    `json:"ca_weight"`
			ExamWeight     int    `json:"exam_weight"`
			PassMark       int    `json:"pass_mark"`
			Status         string `json:"status"`
			Description    string `json:"description"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload or missing subject ID")
			return
		}

		_, err := db.DB.Exec(`
			UPDATE campus_subjects SET
				code = COALESCE(NULLIF(?, ''), code),
				title = COALESCE(NULLIF(?, ''), title),
				department = COALESCE(NULLIF(?, ''), department),
				category = COALESCE(NULLIF(?, ''), category),
				curriculum = COALESCE(NULLIF(?, ''), curriculum),
				level_category = COALESCE(NULLIF(?, ''), level_category),
				periods_per_week = ?,
				credit_units = ?,
				ca_weight = ?,
				exam_weight = ?,
				pass_mark = ?,
				status = COALESCE(NULLIF(?, ''), status),
				description = ?,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?`,
			strings.ToUpper(strings.TrimSpace(input.Code)), strings.TrimSpace(input.Title),
			input.Department, input.Category, input.Curriculum, input.LevelCategory,
			input.PeriodsPerWeek, input.CreditUnits, input.CAWeight, input.ExamWeight, input.PassMark,
			input.Status, input.Description, input.ID, tenantID,
		)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update subject: %v", err))
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Subject updated successfully",
		})

	case http.MethodDelete:
		subjectID := strings.TrimSpace(r.URL.Query().Get("id"))
		if subjectID == "" {
			var body struct {
				ID string `json:"id"`
			}
			_ = json.NewDecoder(r.Body).Decode(&body)
			subjectID = body.ID
		}
		if subjectID == "" {
			JSONError(w, http.StatusBadRequest, "Subject ID required")
			return
		}

		_, err := db.DB.Exec("DELETE FROM campus_subjects WHERE id = ? AND tenant_id = ?", subjectID, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to delete subject: %v", err))
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Subject deleted successfully",
		})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleCampusSubjectAllocations handles mapping teachers and class arms to subjects
func HandleCampusSubjectAllocations(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		subjectID := strings.TrimSpace(r.URL.Query().Get("subject_id"))
		if subjectID == "" {
			JSONError(w, http.StatusBadRequest, "subject_id parameter is required")
			return
		}

		// 1. Fetch assigned teachers
		teacherRows, err := db.DB.Query(`
			SELECT id, tenant_id, subject_id, COALESCE(arm_id, ''), COALESCE(arm_name, ''),
			       COALESCE(teacher_id, ''), teacher_name, COALESCE(role, 'Subject Teacher'), weekly_periods, created_at
			FROM campus_subject_teachers
			WHERE tenant_id = ? AND subject_id = ?
			ORDER BY teacher_name ASC`, tenantID, subjectID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to query teachers: %v", err))
			return
		}
		defer teacherRows.Close()

		teachers := []SubjectTeacherRecord{}
		for teacherRows.Next() {
			var t SubjectTeacherRecord
			if err := teacherRows.Scan(
				&t.ID, &t.TenantID, &t.SubjectID, &t.ArmID, &t.ArmName,
				&t.TeacherID, &t.TeacherName, &t.Role, &t.WeeklyPeriods, &t.CreatedAt,
			); err == nil {
				teachers = append(teachers, t)
			}
		}

		// 2. Fetch assigned class arms
		armRows, err := db.DB.Query(`
			SELECT id, tenant_id, subject_id, class_id, COALESCE(class_name, ''),
			       COALESCE(arm_id, ''), COALESCE(arm_name, ''), is_compulsory, created_at
			FROM campus_class_subjects
			WHERE tenant_id = ? AND subject_id = ?
			ORDER BY class_name ASC, arm_name ASC`, tenantID, subjectID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to query class arms: %v", err))
			return
		}
		defer armRows.Close()

		arms := []ClassSubjectRecord{}
		for armRows.Next() {
			var a ClassSubjectRecord
			if err := armRows.Scan(
				&a.ID, &a.TenantID, &a.SubjectID, &a.ClassID, &a.ClassName,
				&a.ArmID, &a.ArmName, &a.IsCompulsory, &a.CreatedAt,
			); err == nil {
				arms = append(arms, a)
			}
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":  true,
			"teachers": teachers,
			"arms":     arms,
		})

	case http.MethodPost:
		var input struct {
			Action        string `json:"action"` // "assign_teacher" or "assign_arm"
			SubjectID     string `json:"subject_id"`
			TeacherName   string `json:"teacher_name"`
			Role          string `json:"role"`
			WeeklyPeriods int    `json:"weekly_periods"`
			ArmID         string `json:"arm_id"`
			ArmName       string `json:"arm_name"`
			ClassID       string `json:"class_id"`
			ClassName     string `json:"class_name"`
			IsCompulsory  bool   `json:"is_compulsory"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.SubjectID == "" {
			JSONError(w, http.StatusBadRequest, "Invalid payload or missing subject_id")
			return
		}

		if input.Action == "assign_teacher" {
			if strings.TrimSpace(input.TeacherName) == "" {
				JSONError(w, http.StatusBadRequest, "Teacher name is required")
				return
			}
			if input.Role == "" {
				input.Role = "Subject Specialist"
			}
			if input.WeeklyPeriods <= 0 {
				input.WeeklyPeriods = 4
			}
			newID := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_subject_teachers (
					id, tenant_id, subject_id, arm_id, arm_name, teacher_name, role, weekly_periods, created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
				newID, tenantID, input.SubjectID, input.ArmID, input.ArmName, input.TeacherName, input.Role, input.WeeklyPeriods,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to assign teacher: %v", err))
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{
				"success": true,
				"message": "Teacher assigned successfully",
				"id":      newID,
			})
			return
		}

		if input.Action == "assign_arm" {
			newID := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_class_subjects (
					id, tenant_id, subject_id, class_id, class_name, arm_id, arm_name, is_compulsory, created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
				newID, tenantID, input.SubjectID, input.ClassID, input.ClassName, input.ArmID, input.ArmName, input.IsCompulsory,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to assign class arm: %v", err))
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{
				"success": true,
				"message": "Class arm mapped successfully",
				"id":      newID,
			})
			return
		}

		JSONError(w, http.StatusBadRequest, "Unknown action: must be 'assign_teacher' or 'assign_arm'")

	case http.MethodDelete:
		targetType := strings.TrimSpace(r.URL.Query().Get("type")) // "teacher" or "arm"
		targetID := strings.TrimSpace(r.URL.Query().Get("id"))

		if targetID == "" {
			JSONError(w, http.StatusBadRequest, "Allocation record ID is required")
			return
		}

		if targetType == "teacher" {
			_, err := db.DB.Exec("DELETE FROM campus_subject_teachers WHERE id = ? AND tenant_id = ?", targetID, tenantID)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to remove teacher: %v", err))
				return
			}
			JSONResponse(w, http.StatusOK, map[string]string{"message": "Teacher unassigned successfully"})
			return
		}

		if targetType == "arm" {
			_, err := db.DB.Exec("DELETE FROM campus_class_subjects WHERE id = ? AND tenant_id = ?", targetID, tenantID)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to remove arm: %v", err))
				return
			}
			JSONResponse(w, http.StatusOK, map[string]string{"message": "Class arm unassigned successfully"})
			return
		}

		JSONError(w, http.StatusBadRequest, "Invalid type: must be 'teacher' or 'arm'")

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// CampusParentWardRecord represents a student ward linked to a parent
type CampusParentWardRecord struct {
	ID               string    `json:"id"`
	TenantID         string    `json:"tenant_id"`
	ParentID         string    `json:"parent_id"`
	StudentID        string    `json:"student_id"`
	StudentName      string    `json:"student_name"`
	AdmissionNumber  string    `json:"admission_number"`
	ClassArmName     string    `json:"class_arm_name"`
	RelationshipType string    `json:"relationship_type"`
	IsPrimaryContact bool      `json:"is_primary_contact"`
	CreatedAt        time.Time `json:"created_at"`
}

// CampusParentRecord represents a verified parent or legal guardian in Campus OS
type CampusParentRecord struct {
	ID                 string                   `json:"id"`
	TenantID           string                   `json:"tenant_id"`
	Title              string                   `json:"title"`
	FullName           string                   `json:"full_name"`
	RelationshipType   string                   `json:"relationship_type"` // FATHER, MOTHER, LEGAL_GUARDIAN, SPONSOR
	Email              string                   `json:"email"`
	Phone              string                   `json:"phone"`
	AlternatePhone     string                   `json:"alternate_phone"`
	Occupation         string                   `json:"occupation"`
	ResidentialAddress string                   `json:"residential_address"`
	IsEmergencyContact bool                     `json:"is_emergency_contact"`
	FeeStatus          string                   `json:"fee_status"` // CLEARED, INSTALLMENTS, OUTSTANDING
	PortalAccessStatus string                   `json:"portal_access_status"` // ACTIVE, INVITED, INACTIVE
	LastLoginAt        *time.Time               `json:"last_login_at"`
	Status             string                   `json:"status"` // ACTIVE, INACTIVE
	LinkedWards        []CampusParentWardRecord `json:"linked_wards"`
	CreatedAt          time.Time                `json:"created_at"`
	UpdatedAt          time.Time                `json:"updated_at"`
}

// CampusParentSummary contains aggregate parent CRM KPIs
type CampusParentSummary struct {
	TotalGuardians      int     `json:"total_guardians"`
	ActivePortalLogins  int     `json:"active_portal_logins"`
	NoticeReadRate      float64 `json:"notice_read_rate"`
	PTAAttendanceRate   float64 `json:"pta_attendance_rate"`
	LinkedStudentsCount int     `json:"linked_students_count"`
	TotalStudentsCount  int     `json:"total_students_count"`
}

// seedTenantParentsIfEmpty seeds realistic persistent Nigerian households and links them to students
func seedTenantParentsIfEmpty(tenantID string) {
	if !demoSeedEnabled() {
		return
	}
	if tenantID == "" {
		return
	}

	var count int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_parents WHERE tenant_id = ?", tenantID).Scan(&count)
	if count > 0 {
		return
	}

	// Fetch existing student roster to link real students if available
	type studentRow struct {
		id       string
		name     string
		admNo    string
		armName  string
	}
	sRows, err := db.DB.Query(`
		SELECT s.student_id, s.student_name, s.admission_number, COALESCE(a.name, 'Class Arm')
		FROM campus_class_students s
		LEFT JOIN campus_class_arms a ON s.arm_id = a.id
		WHERE s.tenant_id = ?
		LIMIT 15
	`, tenantID)
	availableStudents := []studentRow{}
	if err == nil {
		defer sRows.Close()
		for sRows.Next() {
			var sr studentRow
			if err := sRows.Scan(&sr.id, &sr.name, &sr.admNo, &sr.armName); err == nil {
				availableStudents = append(availableStudents, sr)
			}
		}
	}

	type parentSeed struct {
		title        string
		name         string
		relType      string
		email        string
		phone        string
		occupation   string
		address      string
		feeStatus    string
		portalStatus string
		sampleWards  []struct {
			name   string
			admNo  string
			arm    string
		}
	}

	seeds := []parentSeed{
		{
			title: "Chief & Mrs.", name: "Oladimeji Adeleke", relType: "FATHER",
			email: "adeleke.family@gmail.com", phone: "+234 803 412 8890",
			occupation: "Managing Director, Adeleke Holdings",
			address: "14 Admiralty Way, Lekki Phase 1, Lagos",
			feeStatus: "CLEARED", portalStatus: "ACTIVE",
			sampleWards: []struct {
				name  string
				admNo string
				arm   string
			}{
				{name: "Tomiwa Adeleke", admNo: "ADM-2026-SS2-SCI-01", arm: "SSS 2 Science A"},
				{name: "Kemi Adeleke", admNo: "ADM-2026-JS3-GLD-04", arm: "JSS 3 Gold"},
			},
		},
		{
			title: "Engr. & Dr.", name: "Chidi Nwosu", relType: "FATHER",
			email: "c.nwosu@nwosueng.ng", phone: "+234 809 221 3401",
			occupation: "Principal Civil Infrastructure Consultant",
			address: "Plot 8, Victoria Garden City (VGC), Ajah, Lagos",
			feeStatus: "CLEARED", portalStatus: "ACTIVE",
			sampleWards: []struct {
				name  string
				admNo string
				arm   string
			}{
				{name: "Chisom Nwosu", admNo: "ADM-2026-SS3-SCIA-1", arm: "SSS 3 Science A"},
			},
		},
		{
			title: "Alhaji & Hajiya", name: "Ibrahim Danjuma", relType: "FATHER",
			email: "ibrahim.danjuma@yahoo.com", phone: "+234 802 310 5542",
			occupation: "Commodities & Agribusiness Merchant",
			address: "22 Gana Street, Maitama, Abuja",
			feeStatus: "INSTALLMENTS", portalStatus: "ACTIVE",
			sampleWards: []struct {
				name  string
				admNo string
				arm   string
			}{
				{name: "Amina Danjuma", admNo: "ADM-2026-JS2-GLD-02", arm: "JSS 2 Gold"},
				{name: "Musa Danjuma", admNo: "ADM-2026-JS1-DMD-03", arm: "JSS 1 Diamond"},
			},
		},
		{
			title: "Barr. & Mrs.", name: "Efe Omoregie", relType: "FATHER",
			email: "efe.omoregie@chambers.ng", phone: "+234 805 774 1129",
			occupation: "Senior Advocate Partner, Maritime Law",
			address: "7 Isaac John Street, GRA Ikeja, Lagos",
			feeStatus: "CLEARED", portalStatus: "ACTIVE",
			sampleWards: []struct {
				name  string
				admNo string
				arm   string
			}{
				{name: "Osaze Omoregie", admNo: "ADM-2026-SS1-ART-05", arm: "SSS 1 Arts"},
			},
		},
		{
			title: "Dr. (Mrs.)", name: "Folashade Adeyemi", relType: "MOTHER",
			email: "f.adeyemi@unilag.edu.ng", phone: "+234 818 903 2214",
			occupation: "Associate Professor of Chemical Pathology",
			address: "University of Lagos Senior Staff Quarters, Akoka",
			feeStatus: "CLEARED", portalStatus: "ACTIVE",
			sampleWards: []struct {
				name  string
				admNo string
				arm   string
			}{
				{name: "Tobi Adeyemi", admNo: "ADM-2026-SS2-COM-07", arm: "SSS 2 Commercial"},
			},
		},
		{
			title: "Mr. & Mrs.", name: "Emeka Okeke", relType: "FATHER",
			email: "e.okeke@okekelogistics.com", phone: "+234 806 441 9902",
			occupation: "Director of Fleet & Haulage Operations",
			address: "5 Creek Road, Apapa Ports Corridor, Lagos",
			feeStatus: "OUTSTANDING", portalStatus: "INVITED",
			sampleWards: []struct {
				name  string
				admNo string
				arm   string
			}{
				{name: "Somto Okeke", admNo: "ADM-2026-JS1-GLD-08", arm: "JSS 1 Gold"},
			},
		},
	}

	studIndex := 0
	for _, p := range seeds {
		parentID := uuid.New().String()
		now := time.Now()
		_, err := db.DB.Exec(`
			INSERT INTO campus_parents (
				id, tenant_id, title, full_name, relationship_type, email, phone,
				alternate_phone, occupation, residential_address, is_emergency_contact,
				fee_status, portal_access_status, last_login_at, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?, 'ACTIVE')
		`, parentID, tenantID, p.title, p.name, p.relType, p.email, p.phone,
			"", p.occupation, p.address, p.feeStatus, p.portalStatus, now)
		if err != nil {
			continue
		}

		// Link wards: prefer linking real existing students from database if available
		if len(availableStudents) > 0 {
			numWardsToLink := len(p.sampleWards)
			for i := 0; i < numWardsToLink && studIndex < len(availableStudents); i++ {
				st := availableStudents[studIndex]
				wardID := uuid.New().String()
				_, _ = db.DB.Exec(`
					INSERT INTO campus_parent_wards (
						id, tenant_id, parent_id, student_id, student_name, admission_number, class_arm_name, relationship_type, is_primary_contact
					) VALUES (?, ?, ?, ?, ?, ?, ?, 'PARENT', TRUE)
				`, wardID, tenantID, parentID, st.id, st.name, st.admNo, st.armName)
				studIndex++
			}
		} else {
			// Fallback to sample wards in schema
			for _, w := range p.sampleWards {
				wardID := uuid.New().String()
				dummyStudentID := uuid.New().String()
				_, _ = db.DB.Exec(`
					INSERT INTO campus_parent_wards (
						id, tenant_id, parent_id, student_id, student_name, admission_number, class_arm_name, relationship_type, is_primary_contact
					) VALUES (?, ?, ?, ?, ?, ?, ?, 'PARENT', TRUE)
				`, wardID, tenantID, parentID, dummyStudentID, w.name, w.admNo, w.arm)
			}
		}
	}
}

// HandleCampusParents handles GET, POST, PUT, DELETE for campus parent and guardian records
func HandleCampusParents(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantParentsIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		searchQuery := strings.TrimSpace(r.URL.Query().Get("search"))
		relType := strings.TrimSpace(r.URL.Query().Get("relationship_type"))
		feeStatus := strings.TrimSpace(r.URL.Query().Get("fee_status"))
		status := strings.TrimSpace(r.URL.Query().Get("status"))

		query := `
			SELECT id, tenant_id, title, full_name, relationship_type, COALESCE(email, ''),
			       COALESCE(phone, ''), COALESCE(alternate_phone, ''), COALESCE(occupation, ''),
			       COALESCE(residential_address, ''), is_emergency_contact, fee_status,
			       portal_access_status, last_login_at, status, created_at, updated_at
			FROM campus_parents
			WHERE tenant_id = ?
		`
		args := []interface{}{tenantID}

		if relType != "" && relType != "ALL" {
			query += " AND relationship_type = ?"
			args = append(args, relType)
		}
		if feeStatus != "" && feeStatus != "ALL" {
			query += " AND fee_status = ?"
			args = append(args, feeStatus)
		}
		if status != "" && status != "ALL" {
			query += " AND status = ?"
			args = append(args, status)
		}
		if searchQuery != "" {
			query += ` AND (
				LOWER(full_name) LIKE ? OR
				LOWER(email) LIKE ? OR
				LOWER(phone) LIKE ? OR
				LOWER(occupation) LIKE ? OR
				id IN (SELECT parent_id FROM campus_parent_wards WHERE tenant_id = ? AND (LOWER(student_name) LIKE ? OR LOWER(admission_number) LIKE ?))
			)`
			likePat := "%" + strings.ToLower(searchQuery) + "%"
			args = append(args, likePat, likePat, likePat, likePat, tenantID, likePat, likePat)
		}

		query += " ORDER BY full_name ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to load parent records from database")
			return
		}
		defer rows.Close()

		parents := []CampusParentRecord{}
		parentIDs := []string{}
		activeLoginsCount := 0

		for rows.Next() {
			var p CampusParentRecord
			var lastLogin sql.NullTime
			if err := rows.Scan(
				&p.ID, &p.TenantID, &p.Title, &p.FullName, &p.RelationshipType, &p.Email,
				&p.Phone, &p.AlternatePhone, &p.Occupation, &p.ResidentialAddress,
				&p.IsEmergencyContact, &p.FeeStatus, &p.PortalAccessStatus, &lastLogin,
				&p.Status, &p.CreatedAt, &p.UpdatedAt,
			); err == nil {
				if lastLogin.Valid {
					p.LastLoginAt = &lastLogin.Time
				}
				if p.PortalAccessStatus == "ACTIVE" {
					activeLoginsCount++
				}
				p.LinkedWards = []CampusParentWardRecord{}
				parents = append(parents, p)
				parentIDs = append(parentIDs, p.ID)
			}
		}

		// Fetch linked wards for all returned parents
		linkedStudentsCount := 0
		if len(parentIDs) > 0 {
			wRows, err := db.DB.Query(`
				SELECT id, tenant_id, parent_id, student_id, student_name, COALESCE(admission_number, ''),
				       COALESCE(class_arm_name, ''), relationship_type, is_primary_contact, created_at
				FROM campus_parent_wards
				WHERE tenant_id = ?
				ORDER BY student_name ASC
			`, tenantID)
			if err == nil {
				defer wRows.Close()
				wardsMap := make(map[string][]CampusParentWardRecord)
				uniqueStudents := make(map[string]bool)
				for wRows.Next() {
					var w CampusParentWardRecord
					if err := wRows.Scan(
						&w.ID, &w.TenantID, &w.ParentID, &w.StudentID, &w.StudentName,
						&w.AdmissionNumber, &w.ClassArmName, &w.RelationshipType,
						&w.IsPrimaryContact, &w.CreatedAt,
					); err == nil {
						wardsMap[w.ParentID] = append(wardsMap[w.ParentID], w)
						uniqueStudents[w.StudentID] = true
					}
				}
				linkedStudentsCount = len(uniqueStudents)

				for i := range parents {
					if wards, ok := wardsMap[parents[i].ID]; ok {
						parents[i].LinkedWards = wards
					}
				}
			}
		}

		// Get total student enrollment count for ratio
		var totalStudentsCount int
		_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_class_students WHERE tenant_id = ?", tenantID).Scan(&totalStudentsCount)
		if totalStudentsCount == 0 {
			totalStudentsCount = linkedStudentsCount
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"parents": parents,
			"summary": CampusParentSummary{
				TotalGuardians:      len(parents),
				ActivePortalLogins:  activeLoginsCount,
				NoticeReadRate:      91.4,
				PTAAttendanceRate:   86.0,
				LinkedStudentsCount: linkedStudentsCount,
				TotalStudentsCount:  totalStudentsCount,
			},
		})

	case http.MethodPost:
		var input struct {
			Title              string `json:"title"`
			FullName           string `json:"full_name"`
			RelationshipType   string `json:"relationship_type"`
			Email              string `json:"email"`
			Phone              string `json:"phone"`
			AlternatePhone     string `json:"alternate_phone"`
			Occupation         string `json:"occupation"`
			ResidentialAddress string `json:"residential_address"`
			IsEmergencyContact bool   `json:"is_emergency_contact"`
			FeeStatus          string `json:"fee_status"`
			PortalAccessStatus string `json:"portal_access_status"`
			LinkedWards        []struct {
				StudentID       string `json:"student_id"`
				StudentName     string `json:"student_name"`
				AdmissionNumber string `json:"admission_number"`
				ClassArmName    string `json:"class_arm_name"`
			} `json:"linked_wards"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.FullName) == "" {
			JSONError(w, http.StatusBadRequest, "Full name is required")
			return
		}

		if input.Title == "" {
			input.Title = "Mr."
		}
		if input.RelationshipType == "" {
			input.RelationshipType = "FATHER"
		}
		if input.FeeStatus == "" {
			input.FeeStatus = "CLEARED"
		}
		if input.PortalAccessStatus == "" {
			input.PortalAccessStatus = "ACTIVE"
		}

		parentID := uuid.New().String()
		now := time.Now()
		_, err := db.DB.Exec(`
			INSERT INTO campus_parents (
				id, tenant_id, title, full_name, relationship_type, email, phone,
				alternate_phone, occupation, residential_address, is_emergency_contact,
				fee_status, portal_access_status, last_login_at, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
		`, parentID, tenantID, input.Title, strings.TrimSpace(input.FullName), input.RelationshipType,
			strings.TrimSpace(input.Email), strings.TrimSpace(input.Phone), strings.TrimSpace(input.AlternatePhone),
			strings.TrimSpace(input.Occupation), strings.TrimSpace(input.ResidentialAddress),
			input.IsEmergencyContact, input.FeeStatus, input.PortalAccessStatus, now)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to create parent record in database")
			return
		}

		// Insert linked wards
		for _, w := range input.LinkedWards {
			if strings.TrimSpace(w.StudentName) == "" {
				continue
			}
			sID := w.StudentID
			if sID == "" {
				sID = uuid.New().String()
			}
			wardID := uuid.New().String()
			_, _ = db.DB.Exec(`
				INSERT INTO campus_parent_wards (
					id, tenant_id, parent_id, student_id, student_name, admission_number, class_arm_name, relationship_type, is_primary_contact
				) VALUES (?, ?, ?, ?, ?, ?, ?, 'PARENT', TRUE)
			`, wardID, tenantID, parentID, sID, strings.TrimSpace(w.StudentName), strings.TrimSpace(w.AdmissionNumber), strings.TrimSpace(w.ClassArmName))
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":      parentID,
			"message": "Parent or guardian registered successfully",
		})

	case http.MethodPut:
		var input struct {
			ID                 string `json:"id"`
			Title              string `json:"title"`
			FullName           string `json:"full_name"`
			RelationshipType   string `json:"relationship_type"`
			Email              string `json:"email"`
			Phone              string `json:"phone"`
			AlternatePhone     string `json:"alternate_phone"`
			Occupation         string `json:"occupation"`
			ResidentialAddress string `json:"residential_address"`
			IsEmergencyContact bool   `json:"is_emergency_contact"`
			FeeStatus          string `json:"fee_status"`
			PortalAccessStatus string `json:"portal_access_status"`
			Status             string `json:"status"`
			LinkedWards        []struct {
				StudentID       string `json:"student_id"`
				StudentName     string `json:"student_name"`
				AdmissionNumber string `json:"admission_number"`
				ClassArmName    string `json:"class_arm_name"`
			} `json:"linked_wards"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" || strings.TrimSpace(input.FullName) == "" {
			JSONError(w, http.StatusBadRequest, "Parent ID and Full Name are required")
			return
		}

		if input.Status == "" {
			input.Status = "ACTIVE"
		}

		_, err := db.DB.Exec(`
			UPDATE campus_parents
			SET title = ?, full_name = ?, relationship_type = ?, email = ?, phone = ?,
			    alternate_phone = ?, occupation = ?, residential_address = ?,
			    is_emergency_contact = ?, fee_status = ?, portal_access_status = ?,
			    status = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, input.Title, strings.TrimSpace(input.FullName), input.RelationshipType,
			strings.TrimSpace(input.Email), strings.TrimSpace(input.Phone), strings.TrimSpace(input.AlternatePhone),
			strings.TrimSpace(input.Occupation), strings.TrimSpace(input.ResidentialAddress),
			input.IsEmergencyContact, input.FeeStatus, input.PortalAccessStatus, input.Status,
			input.ID, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to update parent record in database")
			return
		}

		// If linked wards are provided, replace existing links
		if input.LinkedWards != nil {
			_, _ = db.DB.Exec("DELETE FROM campus_parent_wards WHERE parent_id = ? AND tenant_id = ?", input.ID, tenantID)
			for _, w := range input.LinkedWards {
				if strings.TrimSpace(w.StudentName) == "" {
					continue
				}
				sID := w.StudentID
				if sID == "" {
					sID = uuid.New().String()
				}
				wardID := uuid.New().String()
				_, _ = db.DB.Exec(`
					INSERT INTO campus_parent_wards (
						id, tenant_id, parent_id, student_id, student_name, admission_number, class_arm_name, relationship_type, is_primary_contact
					) VALUES (?, ?, ?, ?, ?, ?, ?, 'PARENT', TRUE)
				`, wardID, tenantID, input.ID, sID, strings.TrimSpace(w.StudentName), strings.TrimSpace(w.AdmissionNumber), strings.TrimSpace(w.ClassArmName))
			}
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"id":      input.ID,
			"message": "Parent or guardian updated successfully",
		})

	case http.MethodDelete:
		id := strings.TrimSpace(r.URL.Query().Get("id"))
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Parent ID is required")
			return
		}

		_, err := db.DB.Exec("DELETE FROM campus_parents WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to delete parent record")
			return
		}
		_, _ = db.DB.Exec("DELETE FROM campus_parent_wards WHERE parent_id = ? AND tenant_id = ?", id, tenantID)

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Parent record and linked ward associations removed successfully",
		})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleCampusParentWards handles linking and unlinking wards to parents
func HandleCampusParentWards(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodPost:
		var input struct {
			ParentID        string `json:"parent_id"`
			StudentID       string `json:"student_id"`
			StudentName     string `json:"student_name"`
			AdmissionNumber string `json:"admission_number"`
			ClassArmName    string `json:"class_arm_name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ParentID == "" || strings.TrimSpace(input.StudentName) == "" {
			JSONError(w, http.StatusBadRequest, "Parent ID and Student Name are required")
			return
		}

		sID := input.StudentID
		if sID == "" {
			sID = uuid.New().String()
		}
		wardID := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_parent_wards (
				id, tenant_id, parent_id, student_id, student_name, admission_number, class_arm_name, relationship_type, is_primary_contact
			) VALUES (?, ?, ?, ?, ?, ?, ?, 'PARENT', TRUE)
		`, wardID, tenantID, input.ParentID, sID, strings.TrimSpace(input.StudentName), strings.TrimSpace(input.AdmissionNumber), strings.TrimSpace(input.ClassArmName))
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to link ward to parent")
			return
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":      wardID,
			"message": "Ward successfully linked to parent profile",
		})

	case http.MethodDelete:
		id := strings.TrimSpace(r.URL.Query().Get("id"))
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Ward record ID is required")
			return
		}

		_, err := db.DB.Exec("DELETE FROM campus_parent_wards WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to unlink ward")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Ward unlinked successfully",
		})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

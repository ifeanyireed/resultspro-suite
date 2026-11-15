package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// HandleCampusClinic handles clinic visits, student health records, and medication logs
func HandleCampusClinic(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		// 1. KPI Telemetry
		var totalVisits, admittedCount, severeCount, parentAlertsCount int
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_clinic_visits WHERE tenant_id = ?`, tenantID).Scan(&totalVisits)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_clinic_visits WHERE tenant_id = ? AND admitted_to_bed != '' AND discharge_time = ''`, tenantID).Scan(&admittedCount)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_clinic_visits WHERE tenant_id = ? AND triage_priority = 'EMERGENCY'`, tenantID).Scan(&severeCount)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_clinic_visits WHERE tenant_id = ? AND parent_notified = TRUE`, tenantID).Scan(&parentAlertsCount)

		// 2. Visits List
		visitRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_id, student_name, class_name, visit_type, symptoms, 
			       COALESCE(diagnosis, ''), COALESCE(treatment, ''), triage_priority, nurse_name, 
			       COALESCE(admitted_to_bed, ''), COALESCE(discharge_time, ''), parent_notified, 
			       COALESCE(notes, ''), created_at
			FROM campus_clinic_visits
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 100`, tenantID)
		visits := []map[string]interface{}{}
		if err == nil {
			defer visitRows.Close()
			for visitRows.Next() {
				var id, tID, stuID, stuName, cls, vType, symptoms, diag, treat, priority, nurse, bed, discharge, notes string
				var parentAlert bool
				var createdAt time.Time
				if err := visitRows.Scan(&id, &tID, &stuID, &stuName, &cls, &vType, &symptoms, &diag, &treat, &priority, &nurse, &bed, &discharge, &parentAlert, &notes, &createdAt); err == nil {
					visits = append(visits, map[string]interface{}{
						"id":              id,
						"tenant_id":       tID,
						"student_id":      stuID,
						"student_name":    stuName,
						"class_name":      cls,
						"visit_type":      vType,
						"symptoms":        symptoms,
						"diagnosis":       diag,
						"treatment":       treat,
						"triage_priority": priority,
						"nurse_name":      nurse,
						"admitted_to_bed": bed,
						"discharge_time":  discharge,
						"parent_notified": parentAlert,
						"notes":           notes,
						"created_at":      createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		// 3. Health Passports
		healthRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_id, student_name, class_name, blood_group, genotype,
			       COALESCE(allergies, ''), COALESCE(chronic_conditions, ''),
			       COALESCE(emergency_contact_name, ''), COALESCE(emergency_contact_phone, ''),
			       COALESCE(immunization_summary, ''), COALESCE(notes, ''), updated_at
			FROM campus_clinic_health_records
			WHERE tenant_id = ?
			ORDER BY student_name ASC LIMIT 100`, tenantID)
		healthRecords := []map[string]interface{}{}
		if err == nil {
			defer healthRows.Close()
			for healthRows.Next() {
				var id, tID, stuID, stuName, cls, blood, geno, allergies, chronic, emName, emPhone, immun, notes string
				var updatedAt time.Time
				if err := healthRows.Scan(&id, &tID, &stuID, &stuName, &cls, &blood, &geno, &allergies, &chronic, &emName, &emPhone, &immun, &notes, &updatedAt); err == nil {
					healthRecords = append(healthRecords, map[string]interface{}{
						"id":                      id,
						"tenant_id":               tID,
						"student_id":              stuID,
						"student_name":            stuName,
						"class_name":              cls,
						"blood_group":             blood,
						"genotype":                geno,
						"allergies":               allergies,
						"chronic_conditions":      chronic,
						"emergency_contact_name":  emName,
						"emergency_contact_phone": emPhone,
						"immunization_summary":    immun,
						"notes":                   notes,
						"updated_at":              updatedAt.Format("2006-01-02"),
					})
				}
			}
		}

		// 4. Medications Log
		medRows, err := db.DB.Query(`
			SELECT id, tenant_id, visit_id, student_id, student_name, medication_name, dosage,
			       administered_by, administered_at, status, COALESCE(notes, ''), created_at
			FROM campus_clinic_medications
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 50`, tenantID)
		medications := []map[string]interface{}{}
		if err == nil {
			defer medRows.Close()
			for medRows.Next() {
				var id, tID, vID, stuID, stuName, med, dose, adminBy, adminAt, status, notes string
				var createdAt time.Time
				if err := medRows.Scan(&id, &tID, &vID, &stuID, &stuName, &med, &dose, &adminBy, &adminAt, &status, &notes, &createdAt); err == nil {
					medications = append(medications, map[string]interface{}{
						"id":              id,
						"tenant_id":       tID,
						"visit_id":        vID,
						"student_id":      stuID,
						"student_name":    stuName,
						"medication_name": med,
						"dosage":          dose,
						"administered_by": adminBy,
						"administered_at": adminAt,
						"status":          status,
						"notes":           notes,
						"created_at":      createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"summary": map[string]interface{}{
				"total_visits":          totalVisits,
				"admitted_to_bed":       admittedCount,
				"emergency_cases":       severeCount,
				"parent_alerts_sent":    parentAlertsCount,
				"active_health_records": len(healthRecords),
			},
			"visits":         visits,
			"health_records": healthRecords,
			"medications":    medications,
		})

	case http.MethodPost:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		action, _ := payload["action"].(string)
		if action == "" {
			action = "record_visit"
		}

		switch action {
		case "save_health_record":
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			blood, _ := payload["blood_group"].(string)
			geno, _ := payload["genotype"].(string)
			allergies, _ := payload["allergies"].(string)
			chronic, _ := payload["chronic_conditions"].(string)
			emName, _ := payload["emergency_contact_name"].(string)
			emPhone, _ := payload["emergency_contact_phone"].(string)
			immun, _ := payload["immunization_summary"].(string)
			notes, _ := payload["notes"].(string)

			if stuName == "" {
				JSONError(w, http.StatusBadRequest, "Student name is required")
				return
			}
			if stuID == "" {
				stuID = "STU-" + uuid.New().String()[:8]
			}

			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_clinic_health_records (
					id, tenant_id, student_id, student_name, class_name, blood_group, genotype,
					allergies, chronic_conditions, emergency_contact_name, emergency_contact_phone,
					immunization_summary, notes
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				ON CONFLICT (id) DO UPDATE SET
					blood_group = EXCLUDED.blood_group,
					genotype = EXCLUDED.genotype,
					allergies = EXCLUDED.allergies,
					chronic_conditions = EXCLUDED.chronic_conditions,
					emergency_contact_name = EXCLUDED.emergency_contact_name,
					emergency_contact_phone = EXCLUDED.emergency_contact_phone,
					immunization_summary = EXCLUDED.immunization_summary,
					notes = EXCLUDED.notes,
					updated_at = CURRENT_TIMESTAMP`,
				id, tenantID, stuID, stuName, cls, blood, geno, allergies, chronic, emName, emPhone, immun, notes,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to save health record: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Health record saved"})

		case "administer_medication":
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			vID, _ := payload["visit_id"].(string)
			med, _ := payload["medication_name"].(string)
			dose, _ := payload["dosage"].(string)
			adminBy, _ := payload["administered_by"].(string)
			notes, _ := payload["notes"].(string)

			if med == "" || dose == "" {
				JSONError(w, http.StatusBadRequest, "Medication name and dosage are required")
				return
			}
			if adminBy == "" {
				adminBy = "School Nurse"
			}

			id := uuid.New().String()
			nowStr := time.Now().Format("2006-01-02 15:04")
			_, err := db.DB.Exec(`
				INSERT INTO campus_clinic_medications (
					id, tenant_id, visit_id, student_id, student_name, medication_name, dosage,
					administered_by, administered_at, status, notes
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'GIVEN', ?)`,
				id, tenantID, vID, stuID, stuName, med, dose, adminBy, nowStr, notes,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to record medication: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Medication administered and logged"})

		case "record_visit":
			fallthrough
		default:
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			vType, _ := payload["visit_type"].(string)
			symptoms, _ := payload["symptoms"].(string)
			diag, _ := payload["diagnosis"].(string)
			treat, _ := payload["treatment"].(string)
			priority, _ := payload["triage_priority"].(string)
			nurse, _ := payload["nurse_name"].(string)
			bed, _ := payload["admitted_to_bed"].(string)
			discharge, _ := payload["discharge_time"].(string)
			parentAlert, _ := payload["parent_notified"].(bool)
			notes, _ := payload["notes"].(string)

			if stuName == "" || symptoms == "" {
				JSONError(w, http.StatusBadRequest, "Student name and symptoms are required")
				return
			}
			if priority == "" {
				priority = "NORMAL"
			}
			if nurse == "" {
				nurse = "School Nurse"
			}
			if vType == "" {
				vType = "OUTPATIENT"
			}

			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_clinic_visits (
					id, tenant_id, student_id, student_name, class_name, visit_type, symptoms,
					diagnosis, treatment, triage_priority, nurse_name, admitted_to_bed, discharge_time,
					parent_notified, notes
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				id, tenantID, stuID, stuName, cls, vType, symptoms, diag, treat, priority, nurse, bed, discharge, parentAlert, notes,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to log clinic visit: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Clinic visit recorded"})
		}

	case http.MethodPut, http.MethodPatch:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}
		id, _ := payload["id"].(string)
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Visit ID is required")
			return
		}

		discharge, _ := payload["discharge_time"].(string)
		if discharge == "" {
			discharge = time.Now().Format("2006-01-02 15:04")
		}
		_, err := db.DB.Exec(`
			UPDATE campus_clinic_visits 
			SET discharge_time = ?, admitted_to_bed = '' 
			WHERE id = ? AND tenant_id = ?`,
			discharge, id, tenantID,
		)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to discharge student")
			return
		}
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Student discharged from infirmary"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Record ID is required")
			return
		}
		table := r.URL.Query().Get("type")
		if table == "health" {
			_, _ = db.DB.Exec("DELETE FROM campus_clinic_health_records WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else {
			_, _ = db.DB.Exec("DELETE FROM campus_clinic_visits WHERE id = ? AND tenant_id = ?", id, tenantID)
		}
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Record deleted"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

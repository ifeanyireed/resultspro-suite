package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// HandleCampusAlumni manages alumni directories, transcript dispatch, and credential verifications
func HandleCampusAlumni(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		// 1. KPI Telemetry
		var totalAlumni, pendingTranscripts, dispatchedTranscripts, totalVerified int
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_alumni_directory WHERE tenant_id = ?`, tenantID).Scan(&totalAlumni)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_transcript_requests WHERE tenant_id = ? AND processing_status != 'DISPATCHED'`, tenantID).Scan(&pendingTranscripts)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_transcript_requests WHERE tenant_id = ? AND processing_status = 'DISPATCHED'`, tenantID).Scan(&dispatchedTranscripts)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_credential_verifications WHERE tenant_id = ?`, tenantID).Scan(&totalVerified)

		// 2. Alumni Directory
		alumniRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_name, graduation_year, class_set,
			       COALESCE(email, ''), COALESCE(phone, ''), COALESCE(current_occupation, ''),
			       COALESCE(organization, ''), COALESCE(university, ''), COALESCE(city, ''),
			       COALESCE(country, ''), COALESCE(linkedin_url, ''), status, created_at
			FROM campus_alumni_directory
			WHERE tenant_id = ?
			ORDER BY graduation_year DESC, student_name ASC LIMIT 100`, tenantID)
		alumni := []map[string]interface{}{}
		if err == nil {
			defer alumniRows.Close()
			for alumniRows.Next() {
				var id, tID, name, yr, cSet, email, phone, occ, org, uni, city, country, linkedin, status string
				var createdAt time.Time
				if err := alumniRows.Scan(&id, &tID, &name, &yr, &cSet, &email, &phone, &occ, &org, &uni, &city, &country, &linkedin, &status, &createdAt); err == nil {
					alumni = append(alumni, map[string]interface{}{
						"id":                 id,
						"tenant_id":          tID,
						"student_name":       name,
						"graduation_year":    yr,
						"class_set":          cSet,
						"email":              email,
						"phone":              phone,
						"current_occupation": occ,
						"organization":       org,
						"university":         uni,
						"city":               city,
						"country":            country,
						"linkedin_url":       linkedin,
						"status":             status,
						"created_at":         createdAt.Format("2006-01-02"),
					})
				}
			}
		}

		// 3. Transcript Requests
		transcriptRows, err := db.DB.Query(`
			SELECT id, tenant_id, applicant_name, graduation_year, student_reg_no,
			       destination_institution, COALESCE(destination_email, ''), purpose,
			       fee_status, processing_status, COALESCE(tracking_number, ''),
			       requested_date, COALESCE(dispatched_date, ''), COALESCE(notes, ''), created_at
			FROM campus_transcript_requests
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 50`, tenantID)
		transcripts := []map[string]interface{}{}
		if err == nil {
			defer transcriptRows.Close()
			for transcriptRows.Next() {
				var id, tID, name, yr, regNo, dest, destEmail, purpose, feeStat, pStat, track, reqDate, dispDate, notes string
				var createdAt time.Time
				if err := transcriptRows.Scan(&id, &tID, &name, &yr, &regNo, &dest, &destEmail, &purpose, &feeStat, &pStat, &track, &reqDate, &dispDate, &notes, &createdAt); err == nil {
					transcripts = append(transcripts, map[string]interface{}{
						"id":                      id,
						"tenant_id":               tID,
						"applicant_name":          name,
						"graduation_year":         yr,
						"student_reg_no":          regNo,
						"destination_institution": dest,
						"destination_email":       destEmail,
						"purpose":                 purpose,
						"fee_status":              feeStat,
						"processing_status":       pStat,
						"tracking_number":         track,
						"requested_date":          reqDate,
						"dispatched_date":         dispDate,
						"notes":                   notes,
						"created_at":              createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		// 4. Credential Verifications
		credRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_name, certificate_number, qualification,
			       graduation_year, honors, verification_code, issue_date, status, verified_count, created_at
			FROM campus_credential_verifications
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 50`, tenantID)
		credentials := []map[string]interface{}{}
		if err == nil {
			defer credRows.Close()
			for credRows.Next() {
				var id, tID, name, certNo, qual, yr, honors, vCode, iDate, status string
				var vCount int
				var createdAt time.Time
				if err := credRows.Scan(&id, &tID, &name, &certNo, &qual, &yr, &honors, &vCode, &iDate, &status, &vCount, &createdAt); err == nil {
					credentials = append(credentials, map[string]interface{}{
						"id":                 id,
						"tenant_id":          tID,
						"student_name":       name,
						"certificate_number": certNo,
						"qualification":      qual,
						"graduation_year":    yr,
						"honors":             honors,
						"verification_code":  vCode,
						"issue_date":         iDate,
						"status":             status,
						"verified_count":     vCount,
					})
				}
			}
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"summary": map[string]interface{}{
				"total_alumni":           totalAlumni,
				"pending_transcripts":    pendingTranscripts,
				"dispatched_transcripts": dispatchedTranscripts,
				"verified_credentials":   totalVerified,
			},
			"alumni":      alumni,
			"transcripts": transcripts,
			"credentials": credentials,
		})

	case http.MethodPost:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		action, _ := payload["action"].(string)
		if action == "" {
			action = "register_alumnus"
		}

		switch action {
		case "request_transcript":
			name, _ := payload["applicant_name"].(string)
			yr, _ := payload["graduation_year"].(string)
			regNo, _ := payload["student_reg_no"].(string)
			dest, _ := payload["destination_institution"].(string)
			destEmail, _ := payload["destination_email"].(string)
			purpose, _ := payload["purpose"].(string)
			notes, _ := payload["notes"].(string)

			if name == "" || dest == "" {
				JSONError(w, http.StatusBadRequest, "Applicant name and destination institution are required")
				return
			}
			if purpose == "" {
				purpose = "Postgraduate / Undergraduate Admissions"
			}
			trackNo := "TRX-" + uuid.New().String()[:8]
			reqDate := time.Now().Format("2006-01-02")
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_transcript_requests (
					id, tenant_id, applicant_name, graduation_year, student_reg_no,
					destination_institution, destination_email, purpose, fee_status,
					processing_status, tracking_number, requested_date, notes
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PAID', 'IN_REVIEW', ?, ?, ?)`,
				id, tenantID, name, yr, regNo, dest, destEmail, purpose, trackNo, reqDate, notes,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to submit transcript request: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "tracking_number": trackNo, "message": "Transcript request logged"})

		case "update_transcript_status":
			id, _ := payload["id"].(string)
			status, _ := payload["processing_status"].(string)
			if id == "" || status == "" {
				JSONError(w, http.StatusBadRequest, "Transcript ID and status required")
				return
			}
			dispDate := ""
			if status == "DISPATCHED" {
				dispDate = time.Now().Format("2006-01-02")
			}
			_, _ = db.DB.Exec(`UPDATE campus_transcript_requests SET processing_status = ?, dispatched_date = ? WHERE id = ? AND tenant_id = ?`, status, dispDate, id, tenantID)
			JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Transcript status updated"})

		case "issue_credential":
			name, _ := payload["student_name"].(string)
			certNo, _ := payload["certificate_number"].(string)
			qual, _ := payload["qualification"].(string)
			yr, _ := payload["graduation_year"].(string)
			honors, _ := payload["honors"].(string)

			if name == "" || certNo == "" {
				JSONError(w, http.StatusBadRequest, "Student name and certificate number required")
				return
			}
			vCode := "VER-" + uuid.New().String()[:8]
			iDate := time.Now().Format("2006-01-02")
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_credential_verifications (
					id, tenant_id, student_name, certificate_number, qualification,
					graduation_year, honors, verification_code, issue_date, status, verified_count
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'VALID', 0)`,
				id, tenantID, name, certNo, qual, yr, honors, vCode, iDate,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to register credential: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "verification_code": vCode, "message": "Credential verification token registered"})

		case "register_alumnus":
			fallthrough
		default:
			name, _ := payload["student_name"].(string)
			yr, _ := payload["graduation_year"].(string)
			cSet, _ := payload["class_set"].(string)
			email, _ := payload["email"].(string)
			phone, _ := payload["phone"].(string)
			occ, _ := payload["current_occupation"].(string)
			org, _ := payload["organization"].(string)
			uni, _ := payload["university"].(string)
			city, _ := payload["city"].(string)
			country, _ := payload["country"].(string)
			linkedin, _ := payload["linkedin_url"].(string)

			if name == "" || yr == "" {
				JSONError(w, http.StatusBadRequest, "Alumnus name and graduation year are required")
				return
			}
			if cSet == "" {
				cSet = "Class of " + yr
			}
			if country == "" {
				country = "Nigeria"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_alumni_directory (
					id, tenant_id, student_name, graduation_year, class_set, email, phone,
					current_occupation, organization, university, city, country, linkedin_url, status
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED')`,
				id, tenantID, name, yr, cSet, email, phone, occ, org, uni, city, country, linkedin,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to register alumnus: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Alumnus directory profile created"})
		}

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Record ID is required")
			return
		}
		table := r.URL.Query().Get("type")
		if table == "transcript" {
			_, _ = db.DB.Exec("DELETE FROM campus_transcript_requests WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else if table == "credential" {
			_, _ = db.DB.Exec("DELETE FROM campus_credential_verifications WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else {
			_, _ = db.DB.Exec("DELETE FROM campus_alumni_directory WHERE id = ? AND tenant_id = ?", id, tenantID)
		}
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Record deleted"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

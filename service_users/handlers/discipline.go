package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

// HandleCampusDiscipline manages merits, demerits, disciplinary actions, and counseling
func HandleCampusDiscipline(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		var totalDemerits, totalMerits, counselingSessions, parentAlerts int
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_discipline_incidents WHERE tenant_id = ? AND incident_type = 'DEMERIT'`, tenantID).Scan(&totalDemerits)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_merit_awards WHERE tenant_id = ?`, tenantID).Scan(&totalMerits)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_pastoral_counseling WHERE tenant_id = ?`, tenantID).Scan(&counselingSessions)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_discipline_incidents WHERE tenant_id = ? AND parent_notified = TRUE`, tenantID).Scan(&parentAlerts)

		incRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_id, student_name, class_name, incident_type,
			       category, severity, points_impact, description, action_taken,
			       reported_by, incident_date, parent_notified, status, created_at
			FROM campus_discipline_incidents
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 100`, tenantID)
		incidents := []map[string]interface{}{}
		if err == nil {
			defer incRows.Close()
			for incRows.Next() {
				var id, tID, stuID, stuName, cls, iType, cat, sev, desc, action, repBy, iDate, status string
				var points int
				var pNotified bool
				var createdAt time.Time
				if err := incRows.Scan(&id, &tID, &stuID, &stuName, &cls, &iType, &cat, &sev, &points, &desc, &action, &repBy, &iDate, &pNotified, &status, &createdAt); err == nil {
					incidents = append(incidents, map[string]interface{}{
						"id":              id,
						"tenant_id":       tID,
						"student_id":      stuID,
						"student_name":    stuName,
						"class_name":      cls,
						"incident_type":   iType,
						"category":        cat,
						"severity":        sev,
						"points_impact":   points,
						"description":     desc,
						"action_taken":    action,
						"reported_by":     repBy,
						"incident_date":   iDate,
						"parent_notified": pNotified,
						"status":          status,
						"created_at":      createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		meritRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_id, student_name, class_name, award_name,
			       category, points, reason, awarded_by, award_date, created_at
			FROM campus_merit_awards
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 100`, tenantID)
		merits := []map[string]interface{}{}
		if err == nil {
			defer meritRows.Close()
			for meritRows.Next() {
				var id, tID, stuID, stuName, cls, awName, cat, reason, awBy, awDate string
				var points int
				var createdAt time.Time
				if err := meritRows.Scan(&id, &tID, &stuID, &stuName, &cls, &awName, &cat, &points, &reason, &awBy, &awDate, &createdAt); err == nil {
					merits = append(merits, map[string]interface{}{
						"id":           id,
						"tenant_id":    tID,
						"student_id":   stuID,
						"student_name": stuName,
						"class_name":   cls,
						"award_name":   awName,
						"category":     cat,
						"points":       points,
						"reason":       reason,
						"awarded_by":   awBy,
						"award_date":   awDate,
						"created_at":   createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		counselRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_id, student_name, class_name, counselor_name,
			       session_date, category, notes, COALESCE(follow_up_date, ''), is_confidential,
			       status, created_at
			FROM campus_pastoral_counseling
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 50`, tenantID)
		counseling := []map[string]interface{}{}
		if err == nil {
			defer counselRows.Close()
			for counselRows.Next() {
				var id, tID, stuID, stuName, cls, counselor, sDate, cat, notes, followUp, status string
				var isConf bool
				var createdAt time.Time
				if err := counselRows.Scan(&id, &tID, &stuID, &stuName, &cls, &counselor, &sDate, &cat, &notes, &followUp, &isConf, &status, &createdAt); err == nil {
					counseling = append(counseling, map[string]interface{}{
						"id":              id,
						"tenant_id":       tID,
						"student_id":      stuID,
						"student_name":    stuName,
						"class_name":      cls,
						"counselor_name":  counselor,
						"session_date":    sDate,
						"category":        cat,
						"notes":           notes,
						"follow_up_date":  followUp,
						"is_confidential": isConf,
						"status":          status,
						"created_at":      createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"summary": map[string]interface{}{
				"total_demerits":      totalDemerits,
				"total_merits":        totalMerits,
				"counseling_sessions": counselingSessions,
				"parent_alerts_sent":  parentAlerts,
			},
			"incidents":  incidents,
			"merits":     merits,
			"counseling": counseling,
		})

	case http.MethodPost:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		action, _ := payload["action"].(string)
		if action == "" {
			action = "record_infraction"
		}

		switch action {
		case "award_merit":
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			awName, _ := payload["award_name"].(string)
			cat, _ := payload["category"].(string)
			pts, _ := payload["points"].(float64)
			reason, _ := payload["reason"].(string)
			awBy, _ := payload["awarded_by"].(string)

			if stuName == "" || awName == "" || reason == "" {
				utils.JSONError(w, http.StatusBadRequest, "Student name, award name, and reason are required")
				return
			}
			if pts == 0 {
				pts = 10
			}
			if awBy == "" {
				awBy = "Principal"
			}
			nowDate := time.Now().Format("2006-01-02")
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_merit_awards (
					id, tenant_id, student_id, student_name, class_name, award_name,
					category, points, reason, awarded_by, award_date
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				id, tenantID, stuID, stuName, cls, awName, cat, int(pts), reason, awBy, nowDate,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to award merit: "+err.Error())
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Merit award recorded"})

		case "log_counseling":
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			counselor, _ := payload["counselor_name"].(string)
			cat, _ := payload["category"].(string)
			notes, _ := payload["notes"].(string)
			followUp, _ := payload["follow_up_date"].(string)
			isConf, _ := payload["is_confidential"].(bool)

			if stuName == "" || notes == "" {
				utils.JSONError(w, http.StatusBadRequest, "Student name and counseling notes are required")
				return
			}
			if counselor == "" {
				counselor = "Guidance Counselor"
			}
			nowDate := time.Now().Format("2006-01-02")
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_pastoral_counseling (
					id, tenant_id, student_id, student_name, class_name, counselor_name,
					session_date, category, notes, follow_up_date, is_confidential, status
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED')`,
				id, tenantID, stuID, stuName, cls, counselor, nowDate, cat, notes, followUp, isConf,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to log counseling: "+err.Error())
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Pastoral counseling session logged"})

		case "record_infraction":
			fallthrough
		default:
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			cat, _ := payload["category"].(string)
			sev, _ := payload["severity"].(string)
			pts, _ := payload["points_impact"].(float64)
			desc, _ := payload["description"].(string)
			actionTaken, _ := payload["action_taken"].(string)
			repBy, _ := payload["reported_by"].(string)
			pNotified, _ := payload["parent_notified"].(bool)

			if stuName == "" || desc == "" {
				utils.JSONError(w, http.StatusBadRequest, "Student name and description are required")
				return
			}
			if pts == 0 {
				pts = -5
			}
			if sev == "" {
				sev = "MINOR"
			}
			if repBy == "" {
				repBy = "Duty Teacher"
			}
			nowDate := time.Now().Format("2006-01-02")
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_discipline_incidents (
					id, tenant_id, student_id, student_name, class_name, incident_type,
					category, severity, points_impact, description, action_taken, reported_by,
					incident_date, parent_notified, status
				) VALUES (?, ?, ?, ?, ?, 'DEMERIT', ?, ?, ?, ?, ?, ?, ?, ?, 'RECORDED')`,
				id, tenantID, stuID, stuName, cls, cat, sev, int(pts), desc, actionTaken, repBy, nowDate, pNotified,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to record infraction: "+err.Error())
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Disciplinary infraction recorded"})
		}

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			utils.JSONError(w, http.StatusBadRequest, "Record ID is required")
			return
		}
		table := r.URL.Query().Get("type")
		if table == "merit" {
			_, _ = db.DB.Exec("DELETE FROM campus_merit_awards WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else if table == "counseling" {
			_, _ = db.DB.Exec("DELETE FROM campus_pastoral_counseling WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else {
			_, _ = db.DB.Exec("DELETE FROM campus_discipline_incidents WHERE id = ? AND tenant_id = ?", id, tenantID)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Record deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

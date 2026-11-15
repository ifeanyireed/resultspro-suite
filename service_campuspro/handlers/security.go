package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// HandleCampusSecurity handles visitor logs, authorized student dismissals, and gate passes
func HandleCampusSecurity(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		// 1. KPI Telemetry
		var activeVisitors, totalPickups, totalIncidents, vehiclesPassed int
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_security_visitors WHERE tenant_id = ? AND status = 'ON_CAMPUS'`, tenantID).Scan(&activeVisitors)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_security_authorized_pickups WHERE tenant_id = ? AND status = 'ACTIVE'`, tenantID).Scan(&totalPickups)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_security_incidents WHERE tenant_id = ?`, tenantID).Scan(&totalIncidents)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_security_visitors WHERE tenant_id = ? AND vehicle_plate != ''`, tenantID).Scan(&vehiclesPassed)

		// 2. Visitors Log
		visitorRows, err := db.DB.Query(`
			SELECT id, tenant_id, visitor_name, visitor_phone, COALESCE(visitor_email, ''),
			       COALESCE(id_type, ''), COALESCE(id_number, ''), purpose, person_to_visit,
			       badge_number, COALESCE(vehicle_plate, ''), check_in_time, COALESCE(check_out_time, ''),
			       status, COALESCE(notes, ''), created_at
			FROM campus_security_visitors
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 100`, tenantID)
		visitors := []map[string]interface{}{}
		if err == nil {
			defer visitorRows.Close()
			for visitorRows.Next() {
				var id, tID, vName, vPhone, vEmail, idType, idNum, purpose, pVisit, badge, plate, inTime, outTime, status, notes string
				var createdAt time.Time
				if err := visitorRows.Scan(&id, &tID, &vName, &vPhone, &vEmail, &idType, &idNum, &purpose, &pVisit, &badge, &plate, &inTime, &outTime, &status, &notes, &createdAt); err == nil {
					visitors = append(visitors, map[string]interface{}{
						"id":              id,
						"tenant_id":       tID,
						"visitor_name":    vName,
						"visitor_phone":   vPhone,
						"visitor_email":   vEmail,
						"id_type":         idType,
						"id_number":       idNum,
						"purpose":         purpose,
						"person_to_visit": pVisit,
						"badge_number":    badge,
						"vehicle_plate":   plate,
						"check_in_time":   inTime,
						"check_out_time":  outTime,
						"status":          status,
						"notes":           notes,
						"created_at":      createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		// 3. Authorized Child Pickups
		pickupRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_id, student_name, class_name, guardian_name,
			       relationship, phone_number, COALESCE(id_card_number, ''), COALESCE(photo_url, ''),
			       COALESCE(pin_code, ''), status, created_at
			FROM campus_security_authorized_pickups
			WHERE tenant_id = ?
			ORDER BY student_name ASC LIMIT 100`, tenantID)
		pickups := []map[string]interface{}{}
		if err == nil {
			defer pickupRows.Close()
			for pickupRows.Next() {
				var id, tID, stuID, stuName, cls, gName, rel, phone, idCard, photo, pin, status string
				var createdAt time.Time
				if err := pickupRows.Scan(&id, &tID, &stuID, &stuName, &cls, &gName, &rel, &phone, &idCard, &photo, &pin, &status, &createdAt); err == nil {
					pickups = append(pickups, map[string]interface{}{
						"id":             id,
						"tenant_id":      tID,
						"student_id":     stuID,
						"student_name":   stuName,
						"class_name":     cls,
						"guardian_name":  gName,
						"relationship":   rel,
						"phone_number":   phone,
						"id_card_number": idCard,
						"photo_url":      photo,
						"pin_code":       pin,
						"status":         status,
						"created_at":     createdAt.Format("2006-01-02"),
					})
				}
			}
		}

		// 4. Incidents Log
		incidentRows, err := db.DB.Query(`
			SELECT id, tenant_id, incident_date, title, category, severity, description,
			       reported_by, resolution_status, COALESCE(action_taken, ''), created_at
			FROM campus_security_incidents
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 50`, tenantID)
		incidents := []map[string]interface{}{}
		if err == nil {
			defer incidentRows.Close()
			for incidentRows.Next() {
				var id, tID, iDate, title, cat, sev, desc, repBy, resStat, action string
				var createdAt time.Time
				if err := incidentRows.Scan(&id, &tID, &iDate, &title, &cat, &sev, &desc, &repBy, &resStat, &action, &createdAt); err == nil {
					incidents = append(incidents, map[string]interface{}{
						"id":                id,
						"tenant_id":         tID,
						"incident_date":     iDate,
						"title":             title,
						"category":          cat,
						"severity":          sev,
						"description":       desc,
						"reported_by":       repBy,
						"resolution_status": resStat,
						"action_taken":      action,
						"created_at":        createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"summary": map[string]interface{}{
				"active_visitors":    activeVisitors,
				"authorized_pickups": totalPickups,
				"security_incidents": totalIncidents,
				"vehicles_logged":    vehiclesPassed,
			},
			"visitors":  visitors,
			"pickups":   pickups,
			"incidents": incidents,
		})

	case http.MethodPost:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		action, _ := payload["action"].(string)
		if action == "" {
			action = "checkin_visitor"
		}

		switch action {
		case "register_pickup":
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			gName, _ := payload["guardian_name"].(string)
			rel, _ := payload["relationship"].(string)
			phone, _ := payload["phone_number"].(string)
			idCard, _ := payload["id_card_number"].(string)
			photo, _ := payload["photo_url"].(string)
			pin, _ := payload["pin_code"].(string)

			if stuName == "" || gName == "" || phone == "" {
				JSONError(w, http.StatusBadRequest, "Student name, guardian name, and phone are required")
				return
			}
			if pin == "" {
				pin = uuid.New().String()[:4]
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_security_authorized_pickups (
					id, tenant_id, student_id, student_name, class_name, guardian_name,
					relationship, phone_number, id_card_number, photo_url, pin_code, status
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
				id, tenantID, stuID, stuName, cls, gName, rel, phone, idCard, photo, pin,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to register authorized pickup: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "pin_code": pin, "message": "Authorized pickup registered"})

		case "report_incident":
			title, _ := payload["title"].(string)
			cat, _ := payload["category"].(string)
			sev, _ := payload["severity"].(string)
			desc, _ := payload["description"].(string)
			repBy, _ := payload["reported_by"].(string)
			actionTaken, _ := payload["action_taken"].(string)

			if title == "" || desc == "" {
				JSONError(w, http.StatusBadRequest, "Incident title and description are required")
				return
			}
			if sev == "" {
				sev = "LOW"
			}
			if repBy == "" {
				repBy = "Gate Security Officer"
			}
			nowDate := time.Now().Format("2006-01-02")
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_security_incidents (
					id, tenant_id, incident_date, title, category, severity, description,
					reported_by, resolution_status, action_taken
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'RESOLVED', ?)`,
				id, tenantID, nowDate, title, cat, sev, desc, repBy, actionTaken,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to report incident: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Security incident logged"})

		case "checkout_visitor":
			id, _ := payload["id"].(string)
			if id == "" {
				JSONError(w, http.StatusBadRequest, "Visitor ID required")
				return
			}
			nowTime := time.Now().Format("15:04")
			_, err := db.DB.Exec(`UPDATE campus_security_visitors SET status = 'DEPARTED', check_out_time = ? WHERE id = ? AND tenant_id = ?`, nowTime, id, tenantID)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to checkout visitor")
				return
			}
			JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Visitor departure recorded"})

		case "checkin_visitor":
			fallthrough
		default:
			vName, _ := payload["visitor_name"].(string)
			vPhone, _ := payload["visitor_phone"].(string)
			vEmail, _ := payload["visitor_email"].(string)
			idType, _ := payload["id_type"].(string)
			idNum, _ := payload["id_number"].(string)
			purpose, _ := payload["purpose"].(string)
			pVisit, _ := payload["person_to_visit"].(string)
			badge, _ := payload["badge_number"].(string)
			plate, _ := payload["vehicle_plate"].(string)
			notes, _ := payload["notes"].(string)

			if vName == "" || vPhone == "" || purpose == "" {
				JSONError(w, http.StatusBadRequest, "Visitor name, phone, and purpose are required")
				return
			}
			if badge == "" {
				badge = "V-" + uuid.New().String()[:4]
			}
			nowTime := time.Now().Format("15:04")
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_security_visitors (
					id, tenant_id, visitor_name, visitor_phone, visitor_email, id_type,
					id_number, purpose, person_to_visit, badge_number, vehicle_plate,
					check_in_time, status, notes
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ON_CAMPUS', ?)`,
				id, tenantID, vName, vPhone, vEmail, idType, idNum, purpose, pVisit, badge, plate, nowTime, notes,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to check-in visitor: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "badge_number": badge, "message": "Visitor checked in successfully"})
		}

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Record ID is required")
			return
		}
		table := r.URL.Query().Get("type")
		if table == "pickup" {
			_, _ = db.DB.Exec("DELETE FROM campus_security_authorized_pickups WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else {
			_, _ = db.DB.Exec("DELETE FROM campus_security_visitors WHERE id = ? AND tenant_id = ?", id, tenantID)
		}
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Record deleted"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

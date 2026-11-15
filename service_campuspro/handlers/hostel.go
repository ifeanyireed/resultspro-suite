package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// HandleCampusHostel manages hostel allocations, digital exeat passes, and roll-calls
func HandleCampusHostel(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		// 1. KPI Telemetry
		var totalAllocations, totalOccupants, activeExeats, completedRollcalls int
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_hostel_allocations WHERE tenant_id = ?`, tenantID).Scan(&totalAllocations)
		_ = db.DB.QueryRow(`SELECT COALESCE(SUM(occupants_count), 0) FROM campus_hostel_allocations WHERE tenant_id = ?`, tenantID).Scan(&totalOccupants)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_hostel_exeats WHERE tenant_id = ? AND status IN ('PENDING', 'APPROVED', 'CHECKED_OUT')`, tenantID).Scan(&activeExeats)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_hostel_rollcalls WHERE tenant_id = ?`, tenantID).Scan(&completedRollcalls)

		// 2. Allocations
		allocRows, err := db.DB.Query(`
			SELECT id, tenant_id, hostel_name, COALESCE(wing_or_floor, ''), room_number, 
			       COALESCE(bed_label, ''), COALESCE(capacity, 4), COALESCE(occupants_count, 1), 
			       COALESCE(student_name, ''), COALESCE(class_name, ''), COALESCE(matron_name, ''), 
			       COALESCE(exeat_status, 'ON_CAMPUS'), COALESCE(status, 'OCCUPIED'), created_at
			FROM campus_hostel_allocations
			WHERE tenant_id = ?
			ORDER BY hostel_name ASC, room_number ASC`, tenantID)
		allocations := []map[string]interface{}{}
		if err == nil {
			defer allocRows.Close()
			for allocRows.Next() {
				var id, tID, hostel, wing, room, bed, stuName, cls, matron, exeat, status string
				var cap, occ int
				var createdAt time.Time
				if err := allocRows.Scan(&id, &tID, &hostel, &wing, &room, &bed, &cap, &occ, &stuName, &cls, &matron, &exeat, &status, &createdAt); err == nil {
					allocations = append(allocations, map[string]interface{}{
						"id":              id,
						"tenant_id":       tID,
						"hostel_name":     hostel,
						"wing_or_floor":   wing,
						"room_number":     room,
						"bed_label":       bed,
						"capacity":        cap,
						"occupants_count": occ,
						"student_name":    stuName,
						"class_name":      cls,
						"matron_name":     matron,
						"exeat_status":    exeat,
						"status":          status,
						"created_at":      createdAt.Format("2006-01-02"),
					})
				}
			}
		}

		// 3. Exeat Passes
		exeatRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_id, student_name, class_name, hostel_name, 
			       room_number, exeat_type, reason, departure_date, expected_return_date, 
			       actual_return_date, parent_name, parent_phone, parent_approval, 
			       matron_approval, principal_approval, status, security_checkout_at, 
			       security_checkin_at, pass_code, created_at
			FROM campus_hostel_exeats
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 100`, tenantID)
		exeats := []map[string]interface{}{}
		if err == nil {
			defer exeatRows.Close()
			for exeatRows.Next() {
				var id, tID, stuID, stuName, cls, hostel, room, eType, reason, dep, ret, actRet, pName, pPhone, pApp, mApp, princApp, status, chkOut, chkIn, pCode string
				var createdAt time.Time
				if err := exeatRows.Scan(&id, &tID, &stuID, &stuName, &cls, &hostel, &room, &eType, &reason, &dep, &ret, &actRet, &pName, &pPhone, &pApp, &mApp, &princApp, &status, &chkOut, &chkIn, &pCode, &createdAt); err == nil {
					exeats = append(exeats, map[string]interface{}{
						"id":                   id,
						"tenant_id":            tID,
						"student_id":           stuID,
						"student_name":         stuName,
						"class_name":           cls,
						"hostel_name":          hostel,
						"room_number":          room,
						"exeat_type":           eType,
						"reason":               reason,
						"departure_date":       dep,
						"expected_return_date": ret,
						"actual_return_date":   actRet,
						"parent_name":          pName,
						"parent_phone":         pPhone,
						"parent_approval":      pApp,
						"matron_approval":      mApp,
						"principal_approval":   princApp,
						"status":               status,
						"security_checkout_at": chkOut,
						"security_checkin_at":  chkIn,
						"pass_code":            pCode,
						"created_at":           createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		// 4. Rollcalls
		rcRows, err := db.DB.Query(`
			SELECT id, tenant_id, hostel_name, rollcall_date, total_students, 
			       present_count, absent_count, on_exeat_count, taken_by, notes, created_at
			FROM campus_hostel_rollcalls
			WHERE tenant_id = ?
			ORDER BY rollcall_date DESC LIMIT 30`, tenantID)
		rollcalls := []map[string]interface{}{}
		if err == nil {
			defer rcRows.Close()
			for rcRows.Next() {
				var id, tID, hostel, rDate, takenBy, notes string
				var tot, pres, abs, onEx int
				var createdAt time.Time
				if err := rcRows.Scan(&id, &tID, &hostel, &rDate, &tot, &pres, &abs, &onEx, &takenBy, &notes, &createdAt); err == nil {
					rollcalls = append(rollcalls, map[string]interface{}{
						"id":             id,
						"tenant_id":      tID,
						"hostel_name":    hostel,
						"rollcall_date":  rDate,
						"total_students": tot,
						"present_count":  pres,
						"absent_count":   abs,
						"on_exeat_count": onEx,
						"taken_by":       takenBy,
						"notes":          notes,
						"created_at":     createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"summary": map[string]interface{}{
				"total_allocations":   totalAllocations,
				"total_occupants":     totalOccupants,
				"active_exeats":       activeExeats,
				"completed_rollcalls": completedRollcalls,
			},
			"allocations": allocations,
			"exeats":      exeats,
			"rollcalls":   rollcalls,
		})

	case http.MethodPost:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		action, _ := payload["action"].(string)
		if action == "" {
			action = "allocate_bed"
		}

		switch action {
		case "request_exeat":
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			hostel, _ := payload["hostel_name"].(string)
			room, _ := payload["room_number"].(string)
			eType, _ := payload["exeat_type"].(string)
			reason, _ := payload["reason"].(string)
			dep, _ := payload["departure_date"].(string)
			ret, _ := payload["expected_return_date"].(string)
			pName, _ := payload["parent_name"].(string)
			pPhone, _ := payload["parent_phone"].(string)

			if stuName == "" || reason == "" || dep == "" {
				JSONError(w, http.StatusBadRequest, "Student name, reason, and departure date are required")
				return
			}
			if eType == "" {
				eType = "WEEKEND"
			}
			passCode := "EXT-" + uuid.New().String()[:6]
			id := uuid.New().String()

			_, err := db.DB.Exec(`
				INSERT INTO campus_hostel_exeats (
					id, tenant_id, student_id, student_name, class_name, hostel_name, room_number,
					exeat_type, reason, departure_date, expected_return_date, parent_name, parent_phone,
					parent_approval, matron_approval, principal_approval, status, pass_code
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED', 'PENDING', 'PENDING', 'PENDING', ?)`,
				id, tenantID, stuID, stuName, cls, hostel, room, eType, reason, dep, ret, pName, pPhone, passCode,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to submit exeat: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "pass_code": passCode, "message": "Exeat pass requested"})

		case "approve_exeat":
			id, _ := payload["id"].(string)
			role, _ := payload["role"].(string) // matron or principal
			if id == "" {
				JSONError(w, http.StatusBadRequest, "Exeat ID required")
				return
			}
			if role == "principal" {
				_, err := db.DB.Exec(`UPDATE campus_hostel_exeats SET principal_approval = 'APPROVED', status = 'APPROVED' WHERE id = ? AND tenant_id = ?`, id, tenantID)
				if err != nil {
					JSONError(w, http.StatusInternalServerError, "Failed to update exeat")
					return
				}
			} else {
				_, err := db.DB.Exec(`UPDATE campus_hostel_exeats SET matron_approval = 'APPROVED' WHERE id = ? AND tenant_id = ?`, id, tenantID)
				if err != nil {
					JSONError(w, http.StatusInternalServerError, "Failed to update exeat")
					return
				}
			}
			JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Exeat status updated"})

		case "gate_checkout":
			id, _ := payload["id"].(string)
			nowStr := time.Now().Format("2006-01-02 15:04")
			_, err := db.DB.Exec(`UPDATE campus_hostel_exeats SET status = 'CHECKED_OUT', security_checkout_at = ? WHERE id = ? AND tenant_id = ?`, nowStr, id, tenantID)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed gate checkout")
				return
			}
			JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Student gate departure confirmed"})

		case "gate_checkin":
			id, _ := payload["id"].(string)
			nowStr := time.Now().Format("2006-01-02 15:04")
			_, err := db.DB.Exec(`UPDATE campus_hostel_exeats SET status = 'CHECKED_IN', actual_return_date = ?, security_checkin_at = ? WHERE id = ? AND tenant_id = ?`, nowStr, nowStr, id, tenantID)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed gate checkin")
				return
			}
			JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Student return to hostel recorded"})

		case "record_rollcall":
			hostel, _ := payload["hostel_name"].(string)
			rDate, _ := payload["rollcall_date"].(string)
			tot, _ := payload["total_students"].(float64)
			pres, _ := payload["present_count"].(float64)
			abs, _ := payload["absent_count"].(float64)
			onEx, _ := payload["on_exeat_count"].(float64)
			takenBy, _ := payload["taken_by"].(string)
			notes, _ := payload["notes"].(string)

			if hostel == "" {
				JSONError(w, http.StatusBadRequest, "Hostel name required")
				return
			}
			if rDate == "" {
				rDate = time.Now().Format("2006-01-02")
			}
			if takenBy == "" {
				takenBy = "Housemaster on Duty"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_hostel_rollcalls (
					id, tenant_id, hostel_name, rollcall_date, total_students, present_count,
					absent_count, on_exeat_count, taken_by, notes
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				id, tenantID, hostel, rDate, int(tot), int(pres), int(abs), int(onEx), takenBy, notes,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to log rollcall: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Dormitory roll-call logged"})

		case "allocate_bed":
			fallthrough
		default:
			hostel, _ := payload["hostel_name"].(string)
			wing, _ := payload["wing_or_floor"].(string)
			room, _ := payload["room_number"].(string)
			bed, _ := payload["bed_label"].(string)
			cap, _ := payload["capacity"].(float64)
			occ, _ := payload["occupants_count"].(float64)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			matron, _ := payload["matron_name"].(string)
			exeat, _ := payload["exeat_status"].(string)

			if hostel == "" || room == "" {
				JSONError(w, http.StatusBadRequest, "hostel_name and room_number are required")
				return
			}
			if cap == 0 {
				cap = 4
			}
			if occ == 0 {
				occ = 1
			}
			if exeat == "" {
				exeat = "ON_CAMPUS"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_hostel_allocations (
					id, tenant_id, hostel_name, wing_or_floor, room_number, bed_label,
					capacity, occupants_count, student_name, class_name, matron_name,
					exeat_status, status
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OCCUPIED')`,
				id, tenantID, hostel, wing, room, bed, int(cap), int(occ), stuName, cls, matron, exeat,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to save allocation: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Hostel room/bed allocated"})
		}

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Record ID is required")
			return
		}
		table := r.URL.Query().Get("type")
		if table == "exeat" {
			_, _ = db.DB.Exec("DELETE FROM campus_hostel_exeats WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else {
			_, _ = db.DB.Exec("DELETE FROM campus_hostel_allocations WHERE id = ? AND tenant_id = ?", id, tenantID)
		}
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Record deleted"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

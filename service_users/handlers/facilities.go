package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

// HandleCampusFacilities manages campus venues, auditorium bookings, and equipment reservations
func HandleCampusFacilities(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		var totalVenues, activeBookings, confirmedBookings, pendingApproval int
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_facilities WHERE tenant_id = ?`, tenantID).Scan(&totalVenues)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_facility_bookings WHERE tenant_id = ?`, tenantID).Scan(&activeBookings)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_facility_bookings WHERE tenant_id = ? AND status = 'CONFIRMED'`, tenantID).Scan(&confirmedBookings)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_facility_bookings WHERE tenant_id = ? AND status = 'PENDING'`, tenantID).Scan(&pendingApproval)

		facilityRows, err := db.DB.Query(`
			SELECT id, tenant_id, name, facility_type, capacity, location,
			       hourly_rate, equipment_available, status, created_at
			FROM campus_facilities
			WHERE tenant_id = ?
			ORDER BY name ASC`, tenantID)
		facilities := []map[string]interface{}{}
		if err == nil {
			defer facilityRows.Close()
			for facilityRows.Next() {
				var id, tID, name, fType, loc, equip, status string
				var cap int
				var rate float64
				var createdAt time.Time
				if err := facilityRows.Scan(&id, &tID, &name, &fType, &cap, &loc, &rate, &equip, &status, &createdAt); err == nil {
					facilities = append(facilities, map[string]interface{}{
						"id":                  id,
						"tenant_id":           tID,
						"name":                name,
						"facility_type":       fType,
						"capacity":            cap,
						"location":            loc,
						"hourly_rate":         rate,
						"equipment_available": equip,
						"status":              status,
					})
				}
			}
		}

		bookingRows, err := db.DB.Query(`
			SELECT id, tenant_id, facility_id, facility_name, event_title, booked_by,
			       department, start_date, start_time, end_date, end_time, attendees_estimate,
			       status, notes, created_at
			FROM campus_facility_bookings
			WHERE tenant_id = ?
			ORDER BY start_date ASC, start_time ASC LIMIT 100`, tenantID)
		bookings := []map[string]interface{}{}
		if err == nil {
			defer bookingRows.Close()
			for bookingRows.Next() {
				var id, tID, fID, fName, title, bookedBy, dept, sDate, sTime, eDate, eTime, status, notes string
				var attendees int
				var createdAt time.Time
				if err := bookingRows.Scan(&id, &tID, &fID, &fName, &title, &bookedBy, &dept, &sDate, &sTime, &eDate, &eTime, &attendees, &status, &notes, &createdAt); err == nil {
					bookings = append(bookings, map[string]interface{}{
						"id":                 id,
						"tenant_id":          tID,
						"facility_id":        fID,
						"facility_name":      fName,
						"event_title":        title,
						"booked_by":          bookedBy,
						"department":         dept,
						"start_date":         sDate,
						"start_time":         sTime,
						"end_date":           eDate,
						"end_time":           eTime,
						"attendees_estimate": attendees,
						"status":             status,
						"notes":              notes,
						"created_at":         createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"summary": map[string]interface{}{
				"total_venues":       totalVenues,
				"active_bookings":    activeBookings,
				"confirmed_bookings": confirmedBookings,
				"pending_approval":   pendingApproval,
			},
			"facilities": facilities,
			"bookings":   bookings,
		})

	case http.MethodPost:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		action, _ := payload["action"].(string)
		if action == "" {
			action = "book_facility"
		}

		switch action {
		case "create_facility":
			name, _ := payload["name"].(string)
			fType, _ := payload["facility_type"].(string)
			cap, _ := payload["capacity"].(float64)
			loc, _ := payload["location"].(string)
			rate, _ := payload["hourly_rate"].(float64)
			equip, _ := payload["equipment_available"].(string)

			if name == "" {
				utils.JSONError(w, http.StatusBadRequest, "Facility name is required")
				return
			}
			if cap == 0 {
				cap = 100
			}
			if fType == "" {
				fType = "AUDITORIUM"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_facilities (
					id, tenant_id, name, facility_type, capacity, location, hourly_rate,
					equipment_available, status
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`,
				id, tenantID, name, fType, int(cap), loc, rate, equip,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to register facility: "+err.Error())
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Campus venue/facility registered"})

		case "approve_booking":
			id, _ := payload["id"].(string)
			if id == "" {
				utils.JSONError(w, http.StatusBadRequest, "Booking ID required")
				return
			}
			_, _ = db.DB.Exec(`UPDATE campus_facility_bookings SET status = 'CONFIRMED' WHERE id = ? AND tenant_id = ?`, id, tenantID)
			utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Booking confirmed"})

		case "book_facility":
			fallthrough
		default:
			fID, _ := payload["facility_id"].(string)
			fName, _ := payload["facility_name"].(string)
			title, _ := payload["event_title"].(string)
			bookedBy, _ := payload["booked_by"].(string)
			dept, _ := payload["department"].(string)
			sDate, _ := payload["start_date"].(string)
			sTime, _ := payload["start_time"].(string)
			eDate, _ := payload["end_date"].(string)
			eTime, _ := payload["end_time"].(string)
			attendees, _ := payload["attendees_estimate"].(float64)
			notes, _ := payload["notes"].(string)

			if fName == "" || title == "" || sDate == "" {
				utils.JSONError(w, http.StatusBadRequest, "Facility name, event title, and date are required")
				return
			}
			if sTime == "" {
				sTime = "09:00 AM"
			}
			if eDate == "" {
				eDate = sDate
			}
			if eTime == "" {
				eTime = "12:00 PM"
			}
			if bookedBy == "" {
				bookedBy = "Staff Organizer"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_facility_bookings (
					id, tenant_id, facility_id, facility_name, event_title, booked_by,
					department, start_date, start_time, end_date, end_time,
					attendees_estimate, status, notes
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)`,
				id, tenantID, fID, fName, title, bookedBy, dept, sDate, sTime, eDate, eTime, int(attendees), notes,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to book facility: "+err.Error())
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Facility booking reserved"})
		}

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			utils.JSONError(w, http.StatusBadRequest, "Record ID is required")
			return
		}
		table := r.URL.Query().Get("type")
		if table == "facility" {
			_, _ = db.DB.Exec("DELETE FROM campus_facilities WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else {
			_, _ = db.DB.Exec("DELETE FROM campus_facility_bookings WHERE id = ? AND tenant_id = ?", id, tenantID)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Record deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

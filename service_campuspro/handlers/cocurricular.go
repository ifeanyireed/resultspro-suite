package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// HandleCampusCoCurricular manages school houses, clubs, and sports fixtures
func HandleCampusCoCurricular(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		// 1. KPI Telemetry
		var totalHouses, totalClubs, totalClubMembers, upcomingFixtures int
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_houses WHERE tenant_id = ?`, tenantID).Scan(&totalHouses)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_clubs WHERE tenant_id = ? AND status = 'ACTIVE'`, tenantID).Scan(&totalClubs)
		_ = db.DB.QueryRow(`SELECT COALESCE(SUM(member_count), 0) FROM campus_clubs WHERE tenant_id = ?`, tenantID).Scan(&totalClubMembers)
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_sports_fixtures WHERE tenant_id = ? AND status = 'UPCOMING'`, tenantID).Scan(&upcomingFixtures)

		// 2. Houses Leaderboard
		houseRows, err := db.DB.Query(`
			SELECT id, tenant_id, house_name, color_code, COALESCE(house_master, ''),
			       total_points, student_count, COALESCE(motto, ''), created_at
			FROM campus_houses
			WHERE tenant_id = ?
			ORDER BY total_points DESC`, tenantID)
		houses := []map[string]interface{}{}
		if err == nil {
			defer houseRows.Close()
			for houseRows.Next() {
				var id, tID, name, color, master, motto string
				var pts, count int
				var createdAt time.Time
				if err := houseRows.Scan(&id, &tID, &name, &color, &master, &pts, &count, &motto, &createdAt); err == nil {
					houses = append(houses, map[string]interface{}{
						"id":            id,
						"tenant_id":     tID,
						"house_name":    name,
						"color_code":    color,
						"house_master":  master,
						"total_points":  pts,
						"student_count": count,
						"motto":         motto,
					})
				}
			}
		}

		// 3. Clubs & Societies
		clubRows, err := db.DB.Query(`
			SELECT id, tenant_id, club_name, category, COALESCE(patron_teacher, ''),
			       meeting_day, meeting_time, venue, member_count, COALESCE(description, ''), status
			FROM campus_clubs
			WHERE tenant_id = ?
			ORDER BY club_name ASC`, tenantID)
		clubs := []map[string]interface{}{}
		if err == nil {
			defer clubRows.Close()
			for clubRows.Next() {
				var id, tID, name, cat, patron, day, mTime, venue, desc, status string
				var mCount int
				if err := clubRows.Scan(&id, &tID, &name, &cat, &patron, &day, &mTime, &venue, &mCount, &desc, &status); err == nil {
					clubs = append(clubs, map[string]interface{}{
						"id":             id,
						"tenant_id":      tID,
						"club_name":      name,
						"category":       cat,
						"patron_teacher": patron,
						"meeting_day":    day,
						"meeting_time":   mTime,
						"venue":          venue,
						"member_count":   mCount,
						"description":    desc,
						"status":         status,
					})
				}
			}
		}

		// 4. Sports Fixtures
		fixtureRows, err := db.DB.Query(`
			SELECT id, tenant_id, event_name, event_type, event_date, venue,
			       COALESCE(winning_house, ''), COALESCE(score_summary, ''), status, created_at
			FROM campus_sports_fixtures
			WHERE tenant_id = ?
			ORDER BY event_date ASC LIMIT 50`, tenantID)
		fixtures := []map[string]interface{}{}
		if err == nil {
			defer fixtureRows.Close()
			for fixtureRows.Next() {
				var id, tID, name, eType, eDate, venue, winHouse, score, status string
				var createdAt time.Time
				if err := fixtureRows.Scan(&id, &tID, &name, &eType, &eDate, &venue, &winHouse, &score, &status, &createdAt); err == nil {
					fixtures = append(fixtures, map[string]interface{}{
						"id":            id,
						"tenant_id":     tID,
						"event_name":    name,
						"event_type":    eType,
						"event_date":    eDate,
						"venue":         venue,
						"winning_house": winHouse,
						"score_summary": score,
						"status":        status,
					})
				}
			}
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"summary": map[string]interface{}{
				"total_houses":       totalHouses,
				"total_clubs":        totalClubs,
				"total_club_members": totalClubMembers,
				"upcoming_fixtures":  upcomingFixtures,
			},
			"houses":   houses,
			"clubs":    clubs,
			"fixtures": fixtures,
		})

	case http.MethodPost:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		action, _ := payload["action"].(string)
		if action == "" {
			action = "create_club"
		}

		switch action {
		case "create_house":
			name, _ := payload["house_name"].(string)
			color, _ := payload["color_code"].(string)
			master, _ := payload["house_master"].(string)
			motto, _ := payload["motto"].(string)
			pts, _ := payload["total_points"].(float64)

			if name == "" {
				JSONError(w, http.StatusBadRequest, "House name is required")
				return
			}
			if color == "" {
				color = "#146ef5"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_houses (
					id, tenant_id, house_name, color_code, house_master, total_points, student_count, motto
				) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
				id, tenantID, name, color, master, int(pts), motto,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to create house: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "School house registered"})

		case "update_house_points":
			houseID, _ := payload["house_id"].(string)
			deltaPoints, _ := payload["delta_points"].(float64)
			if houseID == "" {
				JSONError(w, http.StatusBadRequest, "House ID is required")
				return
			}
			_, _ = db.DB.Exec(`UPDATE campus_houses SET total_points = total_points + ? WHERE id = ? AND tenant_id = ?`, int(deltaPoints), houseID, tenantID)
			JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "House points updated"})

		case "schedule_fixture":
			name, _ := payload["event_name"].(string)
			eType, _ := payload["event_type"].(string)
			eDate, _ := payload["event_date"].(string)
			venue, _ := payload["venue"].(string)

			if name == "" || eDate == "" {
				JSONError(w, http.StatusBadRequest, "Event name and date are required")
				return
			}
			if eType == "" {
				eType = "Inter-House Athletics"
			}
			if venue == "" {
				venue = "Campus Sports Complex"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_sports_fixtures (
					id, tenant_id, event_name, event_type, event_date, venue, status
				) VALUES (?, ?, ?, ?, ?, ?, 'UPCOMING')`,
				id, tenantID, name, eType, eDate, venue,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to schedule fixture: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Sports fixture scheduled"})

		case "record_fixture_result":
			id, _ := payload["id"].(string)
			winHouse, _ := payload["winning_house"].(string)
			score, _ := payload["score_summary"].(string)
			if id == "" {
				JSONError(w, http.StatusBadRequest, "Fixture ID required")
				return
			}
			_, _ = db.DB.Exec(`UPDATE campus_sports_fixtures SET winning_house = ?, score_summary = ?, status = 'COMPLETED' WHERE id = ? AND tenant_id = ?`, winHouse, score, id, tenantID)
			JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Fixture result recorded"})

		case "create_club":
			fallthrough
		default:
			name, _ := payload["club_name"].(string)
			cat, _ := payload["category"].(string)
			patron, _ := payload["patron_teacher"].(string)
			day, _ := payload["meeting_day"].(string)
			mTime, _ := payload["meeting_time"].(string)
			venue, _ := payload["venue"].(string)
			desc, _ := payload["description"].(string)
			mCount, _ := payload["member_count"].(float64)

			if name == "" {
				JSONError(w, http.StatusBadRequest, "Club name is required")
				return
			}
			if day == "" {
				day = "Wednesday"
			}
			if mTime == "" {
				mTime = "03:45 PM"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_clubs (
					id, tenant_id, club_name, category, patron_teacher, meeting_day,
					meeting_time, venue, member_count, description, status
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
				id, tenantID, name, cat, patron, day, mTime, venue, int(mCount), desc,
			)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to register club: "+err.Error())
				return
			}
			JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Co-curricular club created"})
		}

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			JSONError(w, http.StatusBadRequest, "Record ID is required")
			return
		}
		table := r.URL.Query().Get("type")
		if table == "house" {
			_, _ = db.DB.Exec("DELETE FROM campus_houses WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else if table == "fixture" {
			_, _ = db.DB.Exec("DELETE FROM campus_sports_fixtures WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else {
			_, _ = db.DB.Exec("DELETE FROM campus_clubs WHERE id = ? AND tenant_id = ?", id, tenantID)
		}
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Record deleted"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

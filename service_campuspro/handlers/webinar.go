package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// WebinarRegistrationPayload defines the registration payload from the landing page
type WebinarRegistrationPayload struct {
	SeriesName        string `json:"series_name"`
	EditionTitle      string `json:"edition_title"`
	FullName          string `json:"full_name"`
	Email             string `json:"email"`
	Phone             string `json:"phone"`
	SchoolName        string `json:"school_name"`
	Role              string `json:"role"`
	StateLocation     string `json:"state_location"`
	EstimatedStudents string `json:"estimated_students"`
	PainPoints        string `json:"pain_points"`
	AttendanceMode    string `json:"attendance_mode"`
}

// HandlePublicWebinarRegister handles public registration for the Smart School Webinar Series
func HandlePublicWebinarRegister(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for cross-origin landing page requests
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Tenant-Id")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed. Use POST.")
		return
	}

	var req WebinarRegistrationPayload
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	req.FullName = strings.TrimSpace(req.FullName)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	req.Phone = strings.TrimSpace(req.Phone)
	req.SchoolName = strings.TrimSpace(req.SchoolName)
	req.Role = strings.TrimSpace(req.Role)

	if req.FullName == "" || req.Email == "" || req.Phone == "" || req.SchoolName == "" {
		JSONError(w, http.StatusBadRequest, "Full name, email, phone number, and school name are required.")
		return
	}

	if req.SeriesName == "" {
		req.SeriesName = "Smart School Webinar Series"
	}
	if req.EditionTitle == "" {
		req.EditionTitle = "Free & Easy EOT Results Processing"
	}
	if req.StateLocation == "" {
		req.StateLocation = "Lagos"
	}
	if req.Role == "" {
		req.Role = "School Leader"
	}

	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		tenantID = "default"
	}

	// Check if already registered
	var existingID string
	_ = db.DB.QueryRow(`
		SELECT id FROM campus_webinar_registrations
		WHERE email = ? AND edition_title = ?
		LIMIT 1
	`, req.Email, req.EditionTitle).Scan(&existingID)

	ticketCode := "SSW-" + strings.ToUpper(uuid.New().String()[:6])

	if existingID != "" {
		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Welcome back! You are already registered for this webinar edition.",
			"already_registered": true,
			"registration": map[string]interface{}{
				"id":             existingID,
				"ticket_code":    ticketCode,
				"full_name":      req.FullName,
				"email":          req.Email,
				"school_name":    req.SchoolName,
				"series_name":    req.SeriesName,
				"edition_title":  req.EditionTitle,
				"date_time":      "Thursday, November 26, 2026 · 11:00 AM WAT (Lagos)",
				"zoom_access":    "https://us02web.zoom.us/j/84920260412",
			},
		})
		return
	}

	newID := uuid.New().String()
	_, err := db.DB.Exec(`
		INSERT INTO campus_webinar_registrations (
			id, tenant_id, series_name, edition_title, full_name, email,
			phone, school_name, role, state_location, estimated_students,
			pain_points, attendance_mode, status, notes
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ONLINE_ZOOM', 'REGISTERED', 'Registered via ScholarsNG /smart_school landing page')
	`, newID, tenantID, req.SeriesName, req.EditionTitle, req.FullName, req.Email,
		req.Phone, req.SchoolName, req.Role, req.StateLocation, req.EstimatedStudents, req.PainPoints)

	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to persist registration: "+err.Error())
		return
	}

	JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"message": "Registration confirmed! We have reserved your seat for the Smart School Webinar.",
		"registration": map[string]interface{}{
			"id":             newID,
			"ticket_code":    ticketCode,
			"full_name":      req.FullName,
			"email":          req.Email,
			"phone":          req.Phone,
			"school_name":    req.SchoolName,
			"role":           req.Role,
			"series_name":    req.SeriesName,
			"edition_title":  req.EditionTitle,
			"date_time":      "Thursday, November 26, 2026 · 11:00 AM WAT (Lagos)",
			"calendar_date":  "2026-11-26T11:00:00+01:00",
			"zoom_access":    "https://us02web.zoom.us/j/84920260412",
			"whatsapp_group": "https://chat.whatsapp.com/smart-school-webinar-vip",
		},
	})
}

// HandleCampusWebinarRegistrations lists registered webinar attendees (Admin / Lead Management)
func HandleCampusWebinarRegistrations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed. Use GET.")
		return
	}

	edition := r.URL.Query().Get("edition")
	if edition == "" {
		edition = "Free & Easy EOT Results Processing"
	}

	var totalRegistrations int
	_ = db.DB.QueryRow(`
		SELECT COUNT(*) FROM campus_webinar_registrations
		WHERE edition_title = ?
	`, edition).Scan(&totalRegistrations)

	rows, err := db.DB.Query(`
		SELECT id, series_name, edition_title, full_name, email, phone, school_name, role, state_location, estimated_students, pain_points, created_at
		FROM campus_webinar_registrations
		WHERE edition_title = ?
		ORDER BY created_at DESC
		LIMIT 200
	`, edition)

	registrations := []map[string]interface{}{}
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var id, series, ed, name, email, phone, school, role, state, students, pains string
			var cAt time.Time
			_ = rows.Scan(&id, &series, &ed, &name, &email, &phone, &school, &role, &state, &students, &pains, &cAt)
			registrations = append(registrations, map[string]interface{}{
				"id":                 id,
				"series_name":        series,
				"edition_title":      ed,
				"full_name":          name,
				"email":              email,
				"phone":              phone,
				"school_name":        school,
				"role":               role,
				"state_location":     state,
				"estimated_students": students,
				"pain_points":        pains,
				"registered_at":      cAt.Format("2006-01-02 15:04"),
			})
		}
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":       true,
		"total_count":   totalRegistrations,
		"edition_title": edition,
		"registrations": registrations,
	})
}

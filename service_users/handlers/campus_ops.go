package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/middleware"
	"service_users.resultspro.ng/utils"
)

// resolveHandlerTenantID resolves the active tenant ID using middleware or fallback query/headers
func resolveHandlerTenantID(r *http.Request) string {
	tID := middleware.GetTenantID(r)
	if tID != "" {
		return tID
	}
	qID := strings.TrimSpace(r.URL.Query().Get("tenant_id"))
	if qID != "" {
		return qID
	}
	return ""
}

// seedTenantOperationalDataIfEmpty seeds initial persistent database rows for a tenant on first visit
// so every module has real Postgres-persisted records isolated by tenant_id.
func seedTenantOperationalDataIfEmpty(tenantID string) {
	if tenantID == "" {
		return
	}

	// Check if already seeded for this tenant (via timetable or fees count)
	var feeCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_fee_structures WHERE tenant_id = ?", tenantID).Scan(&feeCount)
	if feeCount > 0 {
		return
	}

	var schoolName string
	_ = db.DB.QueryRow("SELECT name FROM tenants WHERE id = ?", tenantID).Scan(&schoolName)
	if schoolName == "" {
		schoolName = "Scholars Academy"
	}

	// 1. Seed Timetable Slots
	_, _ = db.DB.Exec(`
		INSERT INTO campus_timetable_slots (id, tenant_id, class_name, day_of_week, period_label, start_time, end_time, subject_name, teacher_name, room, status)
		VALUES
		(?, ?, 'JSS 1 Gold', 'Monday', 'Period 1', '08:00 AM', '08:45 AM', 'Mathematics', 'Mr. Babatunde Adewale', 'Room 101', 'SCHEDULED'),
		(?, ?, 'JSS 1 Gold', 'Monday', 'Period 2', '08:45 AM', '09:30 AM', 'English Language', 'Mrs. Ngozi Okafor', 'Room 101', 'SCHEDULED'),
		(?, ?, 'SS 2 Science', 'Tuesday', 'Period 1', '08:00 AM', '08:45 AM', 'Physics', 'Engr. Ibrahim Musa', 'Physics Lab', 'SCHEDULED'),
		(?, ?, 'SS 3 Commercial', 'Wednesday', 'Period 3', '10:00 AM', '10:45 AM', 'Financial Accounting', 'Mr. Chinedu Eze', 'Room 204', 'SCHEDULED')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 2. Seed Admissions Inquiries
	_, _ = db.DB.Exec(`
		INSERT INTO campus_admissions_inquiries (id, tenant_id, applicant_name, target_grade, parent_name, parent_email, parent_phone, stage, entrance_score, notes, assigned_counselor, application_date)
		VALUES
		(?, ?, 'Kamsiyochukwu Nwosu', 'JSS 1', 'Dr. Emeka Nwosu', 'emeka.nwosu@gmail.com', '+234 803 412 8890', 'INTERVIEW_SCHEDULED', 86, 'Strong mathematics aptitude; requested boarding tour.', 'Mrs. Funke Adebayo', '2026-10-18'),
		(?, ?, 'Amina Abdullahi', 'SS 1 Science', 'Alhaji Yusuf Abdullahi', 'y.abdullahi@yahoo.com', '+234 809 221 3409', 'OFFER_EXTENDED', 92, 'Top 5% in entrance CBT assessment.', 'Mrs. Funke Adebayo', '2026-10-20'),
		(?, ?, 'Toluwani Ogunleye', 'Grade 4', 'Mrs. Bukola Ogunleye', 'bukola.o@outlook.com', '+234 812 778 9012', 'INQUIRY', 0, 'Submitted inquiry via school portal landing page.', 'Mr. Segun Lawal', '2026-11-02')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 3. Seed Fee Structures & Student Invoices
	_, _ = db.DB.Exec(`
		INSERT INTO campus_fee_structures (id, tenant_id, title, category, class_level, term_name, amount, is_mandatory)
		VALUES
		(?, ?, 'Termly Tuition & Academic Levy', 'TUITION', 'Junior Secondary (JSS 1-3)', 'First Term', 185000, true),
		(?, ?, 'Senior Secondary Science & Lab Fee', 'TUITION', 'Senior Secondary (SS 1-3)', 'First Term', 225000, true),
		(?, ?, 'STEM Robotics & Digital Learning Levy', 'ICT_LEVY', 'All Levels', 'First Term', 25000, true),
		(?, ?, 'Campus Shuttle Bus Service (Optional)', 'TRANSPORT', 'All Levels', 'First Term', 65000, false)
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	_, _ = db.DB.Exec(`
		INSERT INTO campus_student_invoices (id, tenant_id, invoice_no, student_name, class_name, term_name, total_billed, amount_paid, balance_due, status, payment_method, due_date)
		VALUES
		(?, ?, 'INV-2026-001', 'Chizaram Okafor', 'SS 2 Science', 'First Term', 250000, 250000, 0, 'PAID', 'Paystack DVA', '2026-10-01'),
		(?, ?, 'INV-2026-002', 'Ayomide Balogun', 'JSS 2 Gold', 'First Term', 210000, 140000, 70000, 'PARTIAL', 'Bank Transfer', '2026-10-15'),
		(?, ?, 'INV-2026-003', 'Zainab Danjuma', 'SS 1 Arts', 'First Term', 225000, 0, 225000, 'UNPAID', 'Pending', '2026-11-15')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 4. Seed Library Books & Loans
	book1ID := uuid.New().String()
	book2ID := uuid.New().String()
	_, _ = db.DB.Exec(`
		INSERT INTO campus_library_books (id, tenant_id, isbn, title, author, category, shelf_location, total_copies, available_copies, status)
		VALUES
		(?, ?, '978-0198422006', 'New General Mathematics for Senior Secondary Schools', 'M.F. Macrae et al.', 'STEM & Mathematics', 'Aisle B · Shelf 04', 45, 38, 'AVAILABLE'),
		(?, ?, '978-0435905255', 'Things Fall Apart (Annotated WAEC Edition)', 'Chinua Achebe', 'African Literature', 'Aisle A · Shelf 01', 60, 52, 'AVAILABLE'),
		(?, ?, '978-0521680585', 'Essential Physics for Cambridge IGCSE & WAEC', 'Jim Breithaupt', 'Sciences', 'Aisle C · Shelf 02', 30, 27, 'AVAILABLE')
	`, book1ID, tenantID, book2ID, tenantID, uuid.New().String(), tenantID)

	_, _ = db.DB.Exec(`
		INSERT INTO campus_library_loans (id, tenant_id, book_id, book_title, borrower_name, borrower_role, class_name, issued_date, due_date, fine_amount, status)
		VALUES
		(?, ?, ?, 'New General Mathematics for Senior Secondary Schools', 'Chizaram Okafor', 'student', 'SS 2 Science', '2026-11-01', '2026-11-15', 0, 'BORROWED'),
		(?, ?, ?, 'Things Fall Apart (Annotated WAEC Edition)', 'Ayomide Balogun', 'student', 'JSS 2 Gold', '2026-10-20', '2026-11-05', 500, 'OVERDUE')
	`, uuid.New().String(), tenantID, book1ID, uuid.New().String(), tenantID, book2ID)

	// 5. Seed Inventory & Procurement
	_, _ = db.DB.Exec(`
		INSERT INTO campus_inventory_items (id, tenant_id, sku, item_name, category, unit, quantity_in_stock, reorder_level, unit_cost, location, supplier_name, status)
		VALUES
		(?, ?, 'INV-LAB-01', 'Digital Compound Microscopes (Olympus CX23)', 'Laboratory', 'Units', 24, 5, 185000, 'Main Science Block Store', 'Finlab Nigeria Ltd', 'IN_STOCK'),
		(?, ?, 'INV-STA-04', 'A4 80gsm Exam Answer Booklets (Cartons)', 'Stationery', 'Cartons', 8, 15, 38000, 'Bursary Central Store', 'Academy Press Lagos', 'LOW_STOCK'),
		(?, ?, 'INV-ICT-09', 'Chromebook 11" CBT Assessment Terminals', 'ICT Hardware', 'Units', 65, 10, 210000, 'CBT Hall Server Room', 'Slot Enterprise B2B', 'IN_STOCK')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	_, _ = db.DB.Exec(`
		INSERT INTO campus_procurement_requests (id, tenant_id, po_number, department, requested_by, vendor_name, items_summary, total_amount, priority, status)
		VALUES
		(?, ?, 'PO-2026-084', 'Sciences Department', 'Engr. Ibrahim Musa', 'Finlab Nigeria Ltd', 'Titration burettes, hydrochloric acid reagents & 30 lab coats', 420000, 'HIGH', 'PENDING_APPROVAL'),
		(?, ?, 'PO-2026-081', 'Examinations Committee', 'Mrs. Ngozi Okafor', 'Academy Press Lagos', '20 Cartons of WAEC-standard answer booklets', 760000, 'NORMAL', 'APPROVED')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 6. Seed Transport Routes
	_, _ = db.DB.Exec(`
		INSERT INTO campus_transport_routes (id, tenant_id, route_name, bus_number, driver_name, driver_phone, attendant_name, capacity, assigned_students, stops_summary, morning_departure, afternoon_return, term_fee, gps_status)
		VALUES
		(?, ?, 'Route A · Lekki Phase 1 / Ikate Corridor', 'BUS-01 (Toyota Coaster)', 'Mr. Sunday Adeleke', '+234 802 331 4450', 'Ms. Grace Udoh', 30, 27, 'Admiralty Way → Freedom Way → Ikate Elegushi → Campus Gate', '06:35 AM', '03:30 PM', 65000, 'EN_ROUTE'),
		(?, ?, 'Route B · Ikeja GRA / Maryland Express', 'BUS-02 (Mercedes Sprinter)', 'Mr. Segun Obasanjo', '+234 805 662 1190', 'Mrs.Bisi Alabi', 22, 19, 'Joel Ogunnaike → Isaac John → Maryland Mall → Campus Gate', '06:40 AM', '03:30 PM', 60000, 'PARKED_ON_CAMPUS')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 7. Seed Hostel Allocations
	_, _ = db.DB.Exec(`
		INSERT INTO campus_hostel_allocations (id, tenant_id, hostel_name, wing_or_floor, room_number, bed_label, capacity, occupants_count, student_name, class_name, matron_name, exeat_status, status)
		VALUES
		(?, ?, 'Queen Amina Hall (Girls)', 'First Floor · Wing A', 'Room 104', 'Bed B', 4, 4, 'Chizaram Okafor', 'SS 2 Science', 'Matron Comfort Eze', 'ON_CAMPUS', 'OCCUPIED'),
		(?, ?, 'Nelson Mandela Hall (Boys)', 'Second Floor · Wing B', 'Room 208', 'Bed A', 4, 3, 'Ayomide Balogun', 'JSS 2 Gold', 'Housemaster Tunde Peters', 'WEEKEND_EXEAT', 'OCCUPIED')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 8. Seed Notices, Events & Broadcast Messages
	_, _ = db.DB.Exec(`
		INSERT INTO campus_notices_and_events (id, tenant_id, title, category, audience, event_date, event_time, location, content, author_name, is_pinned)
		VALUES
		(?, ?, 'First Term Mid-Term Continuous Assessment (CBT) Schedule', 'ACADEMIC_CALENDAR', 'ALL', '2026-11-20', '08:30 AM', 'Campus CBT Complex', 'All JSS 1 to SS 3 students are to complete their mid-term continuous assessment on ExamsPRO.', 'Principal''s Office', true),
		(?, ?, 'PTA General Assembly & Open Day Review', 'EVENT', 'PARENTS', '2026-11-28', '10:00 AM', 'Main Multipurpose Hall', 'Parents are invited to review continuous assessment dossiers with form teachers.', 'PTA Secretariat', false)
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	_, _ = db.DB.Exec(`
		INSERT INTO campus_messages (id, tenant_id, sender_name, sender_role, recipient_group, channel, subject, body, delivery_status, read_count)
		VALUES
		(?, ?, 'Bursary Department', 'admin', 'ALL_PARENTS', 'SMS_AND_EMAIL', 'First Term Fee Completion Reminder', 'Dear Parents, kindly settle any outstanding First Term balance via your dedicated Paystack Virtual Account on the Parent Portal.', 'DELIVERED', 142),
		(?, ?, 'Academic Vice Principal', 'admin', 'ALL_TEACHERS', 'IN_APP', 'Continuous Assessment Broadsheet Submission Deadline', 'All subject teachers must publish CA1 and CA2 scores on ResultsPRO before Friday 4:00 PM.', 'DELIVERED', 28)
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 9. Seed Mobile App Accounts
	_, _ = db.DB.Exec(`
		INSERT INTO campus_mobile_app_accounts (id, tenant_id, full_name, email, phone, role, linked_ward_or_class, app_version, device_platform, push_enabled, invite_code, account_status)
		VALUES
		(?, ?, 'Chief & Mrs. Okafor', 'okafor.family@gmail.com', '+234 803 555 0192', 'parent', 'Ward: Chizaram Okafor (SS 2 Science)', 'v2.5.1', 'iOS (iPhone 15 Pro)', true, 'SCH-PR-8821', 'ACTIVE'),
		(?, ?, 'Mr. Babatunde Adewale', 'b.adewale@school.edu.ng', '+234 806 221 9044', 'teacher', 'Form Teacher · JSS 1 Gold', 'v2.5.1', 'Android (Samsung S23)', true, 'SCH-TR-4402', 'ACTIVE'),
		(?, ?, 'Chizaram Okafor', 'chizaram.o@student.scholars.ng', '+234 810 004 2219', 'student', 'Class: SS 2 Science', 'v2.5.1', 'iPadOS / Web PWA', true, 'SCH-ST-1094', 'ACTIVE')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 10. Seed Homework & Assessments
	_, _ = db.DB.Exec(`
		INSERT INTO campus_homework_and_assessments (id, tenant_id, title, subject_name, class_name, teacher_name, assessment_type, due_date, max_score, instructions, submissions_count, total_students, status)
		VALUES
		(?, ?, 'Quadratic Equations & Factorization Problem Set', 'Mathematics', 'SS 2 Science', 'Mr. Babatunde Adewale', 'HOMEWORK', '2026-11-18', 20, 'Solve exercises 4a–4f showing full working steps and upload via ClassroomPRO.', 24, 28, 'PUBLISHED'),
		(?, ?, 'Laws of Motion & Projectile Lab Report', 'Physics', 'SS 2 Science', 'Engr. Ibrahim Musa', 'LAB_ASSESSMENT', '2026-11-21', 30, 'Complete the pendulum oscillation table and calculate acceleration due to gravity.', 19, 28, 'PUBLISHED')
	`, uuid.New().String(), tenantID, uuid.New().String(), tenantID)

	// 11. Seed Academic Sessions, Terms and Calendar Events
	var sessCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_academic_sessions WHERE tenant_id = ?", tenantID).Scan(&sessCount)
	if sessCount == 0 {
		currentSessID := uuid.New().String()
		archivedSessID := uuid.New().String()

		_, _ = db.DB.Exec(`
			INSERT INTO campus_academic_sessions (id, tenant_id, session_name, academic_year, start_date, end_date, is_current, status, terms_count, description)
			VALUES
			(?, ?, '2026 / 2027 Session', '2026/2027', '2026-09-09', '2027-07-23', true, 'ACTIVE', 3, 'Active academic year covering Harmattan, Rain, and Promotional terms.'),
			(?, ?, '2025 / 2026 Session', '2025/2026', '2025-09-11', '2026-07-25', false, 'ARCHIVED', 3, 'Concluded and archived academic session.')
		`, currentSessID, tenantID, archivedSessID, tenantID)

		term1ID := uuid.New().String()
		term2ID := uuid.New().String()
		term3ID := uuid.New().String()

		_, _ = db.DB.Exec(`
			INSERT INTO campus_academic_terms (
				id, tenant_id, session_id, term_name, term_alias, term_order, is_current, status,
				resumption_date, mid_term_break_start, mid_term_break_end, exams_start_date, exams_end_date, vacation_date,
				teaching_days, weeks_count, ca1_start_date, ca1_end_date, ca1_submission_deadline,
				ca2_start_date, ca2_end_date, ca2_submission_deadline, terminal_exam_submission_deadline,
				broadsheet_approval_date, results_release_date, notes
			)
			VALUES
			(?, ?, ?, 'First Term', 'Harmattan', 1, true, 'ACTIVE',
			 '2026-09-09', '2026-10-26', '2026-10-30', '2026-11-30', '2026-12-09', '2026-12-16',
			 68, 14, '2026-10-05', '2026-10-16', '2026-10-19',
			 '2026-11-09', '2026-11-20', '2026-11-23', '2026-12-11',
			 '2026-12-14', '2026-12-16', 'Harmattan term active. Continuous assessment and terminal CBT exams scheduled.'),
			(?, ?, ?, 'Second Term', 'Rain', 2, false, 'UPCOMING',
			 '2027-01-11', '2027-02-22', '2027-02-26', '2027-03-22', '2027-04-02', '2027-04-09',
			 63, 13, '2027-02-01', '2027-02-12', '2027-02-15',
			 '2027-03-01', '2027-03-12', '2027-03-15', '2027-04-05',
			 '2027-04-07', '2027-04-09', 'Rain term preparation and curriculum coverage.'),
			(?, ?, ?, 'Third Term', 'Promotional', 3, false, 'PLANNED',
			 '2027-04-26', '2027-06-07', '2027-06-11', '2027-07-05', '2027-07-16', '2027-07-23',
			 62, 13, '2027-05-17', '2027-05-28', '2027-05-31',
			 '2027-06-21', '2027-07-02', '2027-07-05', '2027-07-19',
			 '2027-07-21', '2027-07-23', 'Promotional exams, broadsheets compilation, and graduation.')
		`, term1ID, tenantID, currentSessID, term2ID, tenantID, currentSessID, term3ID, tenantID, currentSessID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_calendar_events (id, tenant_id, session_id, term_id, title, category, start_date, end_date, is_statutory_holiday, description)
			VALUES
			(?, ?, ?, ?, 'Independence Day Holiday', 'HOLIDAY', '2026-10-01', '2026-10-01', true, 'Federal Republic of Nigeria Independence Day public holiday.'),
			(?, ?, ?, ?, 'First Term Mid-Term Break', 'ACADEMIC', '2026-10-26', '2026-10-30', false, 'School-wide mid-term rest and teacher marking break.'),
			(?, ?, ?, ?, 'Annual Inter-House Sports Championship', 'SPORTS', '2026-11-14', '2026-11-14', false, 'Track and field events at the main campus sports arena.'),
			(?, ?, ?, ?, 'Speech & Prize-Giving Assembly', 'ACADEMIC', '2026-12-15', '2026-12-15', false, 'Awards presentation for academic excellence and leadership.'),
			(?, ?, ?, ?, 'Christmas & New Year Vacation', 'HOLIDAY', '2026-12-17', '2027-01-08', true, 'Statutory end-of-year festive vacation.')
		`, uuid.New().String(), tenantID, currentSessID, term1ID,
			uuid.New().String(), tenantID, currentSessID, term1ID,
			uuid.New().String(), tenantID, currentSessID, term1ID,
			uuid.New().String(), tenantID, currentSessID, term1ID,
			uuid.New().String(), tenantID, currentSessID, term1ID)
	}
}

// ============================================================================
// 1. WEBSITE CMS & LANDING CONFIG (PERSISTENT IN tenants.settings + columns)
// ============================================================================

func HandleCampusWebsiteConfig(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	if r.Method == http.MethodGet {
		var name, slug, defaultSubdomain, customDomain, motto, logoURL, primaryColor, secondaryColor, accentColor, contactEmail, contactPhone, fullAddress, settings sql.NullString
		err := db.DB.QueryRow(`
			SELECT name, slug, default_subdomain, custom_domain, motto, logo_url, primary_color, secondary_color, accent_color, contact_email, contact_phone, full_address, settings
			FROM tenants WHERE id = ?`, tenantID).Scan(
			&name, &slug, &defaultSubdomain, &customDomain, &motto, &logoURL, &primaryColor, &secondaryColor, &accentColor, &contactEmail, &contactPhone, &fullAddress, &settings,
		)
		if err != nil {
			utils.JSONError(w, http.StatusNotFound, "Tenant not found")
			return
		}

		var parsedSettings map[string]interface{}
		if settings.Valid && settings.String != "" {
			_ = json.Unmarshal([]byte(settings.String), &parsedSettings)
		}
		if parsedSettings == nil {
			parsedSettings = map[string]interface{}{}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"tenant_id":         tenantID,
			"name":              name.String,
			"slug":              slug.String,
			"default_subdomain": defaultSubdomain.String,
			"custom_domain":     customDomain.String,
			"motto":             motto.String,
			"logo_url":          logoURL.String,
			"primary_color":     primaryColor.String,
			"secondary_color":   secondaryColor.String,
			"accent_color":      accentColor.String,
			"contact_email":     contactEmail.String,
			"contact_phone":     contactPhone.String,
			"full_address":      fullAddress.String,
			"config":            parsedSettings["landing_config"],
			"settings":          parsedSettings,
		})
		return
	}

	if r.Method == http.MethodPost || r.Method == http.MethodPut || r.Method == http.MethodPatch {
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		// Load existing settings JSON so we merge cleanly
		var existingSettingsRaw sql.NullString
		_ = db.DB.QueryRow("SELECT settings FROM tenants WHERE id = ?", tenantID).Scan(&existingSettingsRaw)
		settingsMap := map[string]interface{}{}
		if existingSettingsRaw.Valid && existingSettingsRaw.String != "" {
			_ = json.Unmarshal([]byte(existingSettingsRaw.String), &settingsMap)
		}

		if cfg, ok := payload["config"].(map[string]interface{}); ok {
			settingsMap["landing_config"] = cfg
			// Sync top-level tenant columns from landing_config if present
			now := time.Now().UTC().Format("2006-01-02 15:04:05")
			if sName, ok := cfg["schoolName"].(string); ok && sName != "" {
				_, _ = db.DB.Exec("UPDATE tenants SET name = ?, updated_at = ? WHERE id = ?", sName, now, tenantID)
			}
			if tagline, ok := cfg["tagline"].(string); ok && tagline != "" {
				_, _ = db.DB.Exec("UPDATE tenants SET motto = ?, updated_at = ? WHERE id = ?", tagline, now, tenantID)
			}
			if pColor, ok := cfg["primaryColor"].(string); ok && pColor != "" {
				_, _ = db.DB.Exec("UPDATE tenants SET primary_color = ?, updated_at = ? WHERE id = ?", pColor, now, tenantID)
			}
			if sColor, ok := cfg["secondaryColor"].(string); ok && sColor != "" {
				_, _ = db.DB.Exec("UPDATE tenants SET secondary_color = ?, updated_at = ? WHERE id = ?", sColor, now, tenantID)
			}
			if logo, ok := cfg["logoUrl"].(string); ok && logo != "" {
				_, _ = db.DB.Exec("UPDATE tenants SET logo_url = ?, updated_at = ? WHERE id = ?", logo, now, tenantID)
			}
			if cEmail, ok := cfg["contactEmail"].(string); ok && cEmail != "" {
				_, _ = db.DB.Exec("UPDATE tenants SET contact_email = ?, updated_at = ? WHERE id = ?", cEmail, now, tenantID)
			}
			if cPhone, ok := cfg["contactPhone"].(string); ok && cPhone != "" {
				_, _ = db.DB.Exec("UPDATE tenants SET contact_phone = ?, updated_at = ? WHERE id = ?", cPhone, now, tenantID)
			}
			if addr, ok := cfg["address"].(string); ok && addr != "" {
				_, _ = db.DB.Exec("UPDATE tenants SET full_address = ?, updated_at = ? WHERE id = ?", addr, now, tenantID)
			}
		} else {
			settingsMap["landing_config"] = payload
		}

		if customDomain, ok := payload["custom_domain"].(string); ok {
			cleaned := normalizeDomainInput(customDomain)
			var domVal interface{}
			if cleaned != "" {
				domVal = cleaned
			}
			_, _ = db.DB.Exec("UPDATE tenants SET custom_domain = ? WHERE id = ?", domVal, tenantID)
		}

		mergedJSON, _ := json.Marshal(settingsMap)
		now := time.Now().UTC().Format("2006-01-02 15:04:05")
		_, err := db.DB.Exec("UPDATE tenants SET settings = ?, updated_at = ? WHERE id = ?", string(mergedJSON), now, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to persist website configuration")
			return
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":   true,
			"tenant_id": tenantID,
			"message":   "Website configuration saved to database",
		})
		return
	}

	utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
}

// ============================================================================
// 2. CAMPUS SUMMARY TELEMETRY
// ============================================================================

func HandleCampusSummary(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	seedTenantOperationalDataIfEmpty(tenantID)

	var studentsCount, teachersCount, parentsCount, classesCount, inquiriesCount int
	var booksCount, activeLoansCount, inventoryCount, routesCount, hostelCount, noticesCount, mobileCount int
	var feeCollected, feeOutstanding float64

	_ = db.DB.QueryRow("SELECT COUNT(*) FROM user_tenant_roles WHERE tenant_id = ? AND role = 'student'", tenantID).Scan(&studentsCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM user_tenant_roles WHERE tenant_id = ? AND role = 'teacher'", tenantID).Scan(&teachersCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM user_tenant_roles WHERE tenant_id = ? AND role = 'parent'", tenantID).Scan(&parentsCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM classes WHERE tenant_id = ?", tenantID).Scan(&classesCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_admissions_inquiries WHERE tenant_id = ?", tenantID).Scan(&inquiriesCount)
	_ = db.DB.QueryRow("SELECT COALESCE(SUM(amount_paid), 0), COALESCE(SUM(balance_due), 0) FROM campus_student_invoices WHERE tenant_id = ?", tenantID).Scan(&feeCollected, &feeOutstanding)
	_ = db.DB.QueryRow("SELECT COALESCE(SUM(total_copies), 0) FROM campus_library_books WHERE tenant_id = ?", tenantID).Scan(&booksCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_library_loans WHERE tenant_id = ? AND status != 'RETURNED'", tenantID).Scan(&activeLoansCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_inventory_items WHERE tenant_id = ?", tenantID).Scan(&inventoryCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_transport_routes WHERE tenant_id = ?", tenantID).Scan(&routesCount)
	_ = db.DB.QueryRow("SELECT COALESCE(SUM(occupants_count), 0) FROM campus_hostel_allocations WHERE tenant_id = ?", tenantID).Scan(&hostelCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_notices_and_events WHERE tenant_id = ?", tenantID).Scan(&noticesCount)
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_mobile_app_accounts WHERE tenant_id = ?", tenantID).Scan(&mobileCount)

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"tenant_id":        tenantID,
		"students":         studentsCount,
		"teachers":         teachersCount,
		"parents":          parentsCount,
		"classes":          classesCount,
		"inquiries":        inquiriesCount,
		"fee_collected":    feeCollected,
		"fee_outstanding":  feeOutstanding,
		"library_books":    booksCount,
		"active_loans":     activeLoansCount,
		"inventory_items":  inventoryCount,
		"transport_routes": routesCount,
		"hostel_occupants": hostelCount,
		"notices":          noticesCount,
		"mobile_accounts":  mobileCount,
	})
}

// ============================================================================
// 3. TIMETABLE ENGINE (campus_timetable_slots)
// ============================================================================

func HandleCampusTimetable(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		classFilter := r.URL.Query().Get("class_name")
		query := `SELECT id, tenant_id, class_name, COALESCE(section_id, ''), day_of_week, period_label, COALESCE(start_time, ''), COALESCE(end_time, ''), subject_name, COALESCE(teacher_id, ''), COALESCE(teacher_name, ''), COALESCE(room, ''), COALESCE(status, 'SCHEDULED')
		          FROM campus_timetable_slots WHERE tenant_id = ?`
		args := []interface{}{tenantID}
		if classFilter != "" {
			query += " AND class_name = ?"
			args = append(args, classFilter)
		}
		query += " ORDER BY day_of_week ASC, period_label ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to load timetable")
			return
		}
		defer rows.Close()

		items := []map[string]interface{}{}
		for rows.Next() {
			var id, tID, className, sectionID, day, period, start, end, subject, teacherID, teacherName, room, status string
			if err := rows.Scan(&id, &tID, &className, &sectionID, &day, &period, &start, &end, &subject, &teacherID, &teacherName, &room, &status); err == nil {
				items = append(items, map[string]interface{}{
					"id":           id,
					"tenant_id":    tID,
					"class_name":   className,
					"section_id":   sectionID,
					"day_of_week":  day,
					"period_label": period,
					"start_time":   start,
					"end_time":     end,
					"subject_name": subject,
					"teacher_id":   teacherID,
					"teacher_name": teacherName,
					"room":         room,
					"status":       status,
				})
			}
		}
		utils.JSONResponse(w, http.StatusOK, items)

	case http.MethodPost:
		var input struct {
			ClassName   string `json:"class_name"`
			SectionID   string `json:"section_id"`
			DayOfWeek   string `json:"day_of_week"`
			PeriodLabel string `json:"period_label"`
			StartTime   string `json:"start_time"`
			EndTime     string `json:"end_time"`
			SubjectName string `json:"subject_name"`
			TeacherID   string `json:"teacher_id"`
			TeacherName string `json:"teacher_name"`
			Room        string `json:"room"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ClassName == "" || input.SubjectName == "" {
			utils.JSONError(w, http.StatusBadRequest, "class_name and subject_name are required")
			return
		}
		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_timetable_slots (id, tenant_id, class_name, section_id, day_of_week, period_label, start_time, end_time, subject_name, teacher_id, teacher_name, room, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED')`,
			id, tenantID, input.ClassName, input.SectionID, input.DayOfWeek, input.PeriodLabel, input.StartTime, input.EndTime, input.SubjectName, input.TeacherID, input.TeacherName, input.Room,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to save timetable slot")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "tenant_id": tenantID, "message": "Timetable slot saved"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_timetable_slots WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Timetable slot deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 4. ADMISSIONS CRM & INQUIRIES (campus_admissions_inquiries)
// ============================================================================

func HandleCampusAdmissions(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.Query(`
			SELECT id, tenant_id, applicant_name, target_grade, parent_name, COALESCE(parent_email, ''), COALESCE(parent_phone, ''), COALESCE(stage, 'INQUIRY'), COALESCE(entrance_score, 0), COALESCE(notes, ''), COALESCE(assigned_counselor, ''), COALESCE(application_date, '')
			FROM campus_admissions_inquiries
			WHERE tenant_id = ?
			ORDER BY created_at DESC`, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch admissions")
			return
		}
		defer rows.Close()

		list := []map[string]interface{}{}
		for rows.Next() {
			var id, tID, applicant, grade, parent, email, phone, stage, notes, counselor, appDate string
			var score int
			if err := rows.Scan(&id, &tID, &applicant, &grade, &parent, &email, &phone, &stage, &score, &notes, &counselor, &appDate); err == nil {
				list = append(list, map[string]interface{}{
					"id":                 id,
					"tenant_id":          tID,
					"applicant_name":     applicant,
					"target_grade":       grade,
					"parent_name":        parent,
					"parent_email":       email,
					"parent_phone":       phone,
					"stage":              stage,
					"entrance_score":     score,
					"notes":              notes,
					"assigned_counselor": counselor,
					"application_date":   appDate,
				})
			}
		}
		utils.JSONResponse(w, http.StatusOK, list)

	case http.MethodPost:
		var input struct {
			ApplicantName     string `json:"applicant_name"`
			TargetGrade       string `json:"target_grade"`
			ParentName        string `json:"parent_name"`
			ParentEmail       string `json:"parent_email"`
			ParentPhone       string `json:"parent_phone"`
			Stage             string `json:"stage"`
			EntranceScore     int    `json:"entrance_score"`
			Notes             string `json:"notes"`
			AssignedCounselor string `json:"assigned_counselor"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ApplicantName == "" {
			utils.JSONError(w, http.StatusBadRequest, "applicant_name is required")
			return
		}
		if input.Stage == "" {
			input.Stage = "INQUIRY"
		}
		id := uuid.New().String()
		today := time.Now().UTC().Format("2006-01-02")
		_, err := db.DB.Exec(`
			INSERT INTO campus_admissions_inquiries (id, tenant_id, applicant_name, target_grade, parent_name, parent_email, parent_phone, stage, entrance_score, notes, assigned_counselor, application_date)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			id, tenantID, input.ApplicantName, input.TargetGrade, input.ParentName, input.ParentEmail, input.ParentPhone, input.Stage, input.EntranceScore, input.Notes, input.AssignedCounselor, today,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create admission inquiry")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "tenant_id": tenantID, "message": "Admission inquiry recorded"})

	case http.MethodPatch, http.MethodPut:
		var input struct {
			ID            string `json:"id"`
			Stage         string `json:"stage"`
			EntranceScore *int   `json:"entrance_score"`
			Notes         string `json:"notes"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			utils.JSONError(w, http.StatusBadRequest, "id is required")
			return
		}
		if input.Stage != "" {
			_, _ = db.DB.Exec("UPDATE campus_admissions_inquiries SET stage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", input.Stage, input.ID, tenantID)
		}
		if input.EntranceScore != nil {
			_, _ = db.DB.Exec("UPDATE campus_admissions_inquiries SET entrance_score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", *input.EntranceScore, input.ID, tenantID)
		}
		if input.Notes != "" {
			_, _ = db.DB.Exec("UPDATE campus_admissions_inquiries SET notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", input.Notes, input.ID, tenantID)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Admission record updated"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_admissions_inquiries WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Admission record deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 5. FEES & STUDENT INVOICES (campus_fee_structures & campus_student_invoices)
// ============================================================================

func HandleCampusFees(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		// Fetch fee structures
		sRows, _ := db.DB.Query(`
			SELECT id, tenant_id, title, COALESCE(category, 'TUITION'), COALESCE(class_level, 'All Levels'), COALESCE(term_name, 'First Term'), amount, is_mandatory
			FROM campus_fee_structures WHERE tenant_id = ? ORDER BY created_at DESC`, tenantID)
		structures := []map[string]interface{}{}
		if sRows != nil {
			defer sRows.Close()
			for sRows.Next() {
				var id, tID, title, cat, level, term string
				var amount float64
				var mandatory bool
				if err := sRows.Scan(&id, &tID, &title, &cat, &level, &term, &amount, &mandatory); err == nil {
					structures = append(structures, map[string]interface{}{
						"id":           id,
						"tenant_id":    tID,
						"title":        title,
						"category":     cat,
						"class_level":  level,
						"term_name":    term,
						"amount":       amount,
						"is_mandatory": mandatory,
					})
				}
			}
		}

		// Fetch student invoices
		iRows, _ := db.DB.Query(`
			SELECT id, tenant_id, invoice_no, COALESCE(student_id, ''), student_name, class_name, COALESCE(term_name, 'First Term'), total_billed, amount_paid, balance_due, COALESCE(status, 'UNPAID'), COALESCE(payment_method, 'Pending'), COALESCE(due_date, '')
			FROM campus_student_invoices WHERE tenant_id = ? ORDER BY created_at DESC`, tenantID)
		invoices := []map[string]interface{}{}
		if iRows != nil {
			defer iRows.Close()
			for iRows.Next() {
				var id, tID, invNo, stuID, stuName, clsName, term, status, method, due string
				var billed, paid, bal float64
				if err := iRows.Scan(&id, &tID, &invNo, &stuID, &stuName, &clsName, &term, &billed, &paid, &bal, &status, &method, &due); err == nil {
					invoices = append(invoices, map[string]interface{}{
						"id":             id,
						"tenant_id":      tID,
						"invoice_no":     invNo,
						"student_id":     stuID,
						"student_name":   stuName,
						"class_name":     clsName,
						"term_name":      term,
						"total_billed":   billed,
						"amount_paid":    paid,
						"balance_due":    bal,
						"status":         status,
						"payment_method": method,
						"due_date":       due,
					})
				}
			}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"tenant_id":      tenantID,
			"fee_structures": structures,
			"invoices":       invoices,
		})

	case http.MethodPost:
		var input map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}
		recordType, _ := input["record_type"].(string)
		id := uuid.New().String()

		if recordType == "invoice" {
			stuName, _ := input["student_name"].(string)
			clsName, _ := input["class_name"].(string)
			termName, _ := input["term_name"].(string)
			if termName == "" {
				termName = "First Term"
			}
			billed, _ := input["total_billed"].(float64)
			paid, _ := input["amount_paid"].(float64)
			bal := billed - paid
			status := "UNPAID"
			if bal <= 0 && billed > 0 {
				status = "PAID"
				bal = 0
			} else if paid > 0 {
				status = "PARTIAL"
			}
			invNo := fmt.Sprintf("INV-%d-%s", time.Now().Year(), strings.ToUpper(id[:4]))
			dueDate, _ := input["due_date"].(string)
			method, _ := input["payment_method"].(string)
			if method == "" {
				method = "Paystack DVA"
			}

			_, err := db.DB.Exec(`
				INSERT INTO campus_student_invoices (id, tenant_id, invoice_no, student_name, class_name, term_name, total_billed, amount_paid, balance_due, status, payment_method, due_date)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				id, tenantID, invNo, stuName, clsName, termName, billed, paid, bal, status, method, dueDate,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to create invoice")
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "invoice_no": invNo, "message": "Invoice created"})
			return
		}

		// Default: fee structure
		title, _ := input["title"].(string)
		cat, _ := input["category"].(string)
		level, _ := input["class_level"].(string)
		term, _ := input["term_name"].(string)
		amount, _ := input["amount"].(float64)
		mandatory := true
		if m, ok := input["is_mandatory"].(bool); ok {
			mandatory = m
		}
		_, err := db.DB.Exec(`
			INSERT INTO campus_fee_structures (id, tenant_id, title, category, class_level, term_name, amount, is_mandatory)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			id, tenantID, title, cat, level, term, amount, mandatory,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create fee structure")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Fee structure saved"})

	case http.MethodPatch, http.MethodPut:
		var input struct {
			ID            string  `json:"id"`
			AmountPaid    float64 `json:"amount_paid"`
			PaymentMethod string  `json:"payment_method"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			utils.JSONError(w, http.StatusBadRequest, "id is required")
			return
		}
		var totalBilled float64
		_ = db.DB.QueryRow("SELECT total_billed FROM campus_student_invoices WHERE id = ? AND tenant_id = ?", input.ID, tenantID).Scan(&totalBilled)
		bal := totalBilled - input.AmountPaid
		status := "PARTIAL"
		if bal <= 0 {
			bal = 0
			status = "PAID"
		} else if input.AmountPaid <= 0 {
			status = "UNPAID"
		}
		_, _ = db.DB.Exec(`
			UPDATE campus_student_invoices
			SET amount_paid = ?, balance_due = ?, status = ?, payment_method = COALESCE(NULLIF(?, ''), payment_method), last_payment_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?`,
			input.AmountPaid, bal, status, input.PaymentMethod, input.ID, tenantID,
		)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Invoice payment updated"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		recordType := r.URL.Query().Get("type")
		if recordType == "invoice" {
			_, _ = db.DB.Exec("DELETE FROM campus_student_invoices WHERE id = ? AND tenant_id = ?", id, tenantID)
		} else {
			_, _ = db.DB.Exec("DELETE FROM campus_fee_structures WHERE id = ? AND tenant_id = ?", id, tenantID)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Fee record deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 6. LIBRARY CATALOG & LOANS (campus_library_books & campus_library_loans)
// ============================================================================

func HandleCampusLibrary(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		bRows, _ := db.DB.Query(`
			SELECT id, tenant_id, COALESCE(isbn, ''), title, author, COALESCE(category, 'General'), COALESCE(shelf_location, ''), total_copies, available_copies, COALESCE(status, 'AVAILABLE')
			FROM campus_library_books WHERE tenant_id = ? ORDER BY title ASC`, tenantID)
		books := []map[string]interface{}{}
		if bRows != nil {
			defer bRows.Close()
			for bRows.Next() {
				var id, tID, isbn, title, author, cat, shelf, status string
				var total, avail int
				if err := bRows.Scan(&id, &tID, &isbn, &title, &author, &cat, &shelf, &total, &avail, &status); err == nil {
					books = append(books, map[string]interface{}{
						"id":               id,
						"tenant_id":        tID,
						"isbn":             isbn,
						"title":            title,
						"author":           author,
						"category":         cat,
						"shelf_location":   shelf,
						"total_copies":     total,
						"available_copies": avail,
						"status":           status,
					})
				}
			}
		}

		lRows, _ := db.DB.Query(`
			SELECT id, tenant_id, book_id, book_title, borrower_name, COALESCE(borrower_role, 'student'), COALESCE(class_name, ''), COALESCE(issued_date, ''), COALESCE(due_date, ''), COALESCE(returned_date, ''), fine_amount, COALESCE(status, 'BORROWED')
			FROM campus_library_loans WHERE tenant_id = ? ORDER BY created_at DESC`, tenantID)
		loans := []map[string]interface{}{}
		if lRows != nil {
			defer lRows.Close()
			for lRows.Next() {
				var id, tID, bookID, bookTitle, borrower, role, cls, issued, due, ret, status string
				var fine float64
				if err := lRows.Scan(&id, &tID, &bookID, &bookTitle, &borrower, &role, &cls, &issued, &due, &ret, &fine, &status); err == nil {
					loans = append(loans, map[string]interface{}{
						"id":            id,
						"tenant_id":     tID,
						"book_id":       bookID,
						"book_title":    bookTitle,
						"borrower_name": borrower,
						"borrower_role": role,
						"class_name":    cls,
						"issued_date":   issued,
						"due_date":      due,
						"returned_date": ret,
						"fine_amount":   fine,
						"status":        status,
					})
				}
			}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"tenant_id": tenantID,
			"books":     books,
			"loans":     loans,
		})

	case http.MethodPost:
		var input map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid JSON")
			return
		}
		recordType, _ := input["record_type"].(string)
		id := uuid.New().String()

		if recordType == "loan" {
			bookID, _ := input["book_id"].(string)
			bookTitle, _ := input["book_title"].(string)
			borrower, _ := input["borrower_name"].(string)
			cls, _ := input["class_name"].(string)
			due, _ := input["due_date"].(string)
			issued := time.Now().UTC().Format("2006-01-02")
			if due == "" {
				due = time.Now().UTC().AddDate(0, 0, 14).Format("2006-01-02")
			}

			_, err := db.DB.Exec(`
				INSERT INTO campus_library_loans (id, tenant_id, book_id, book_title, borrower_name, class_name, issued_date, due_date, status)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'BORROWED')`,
				id, tenantID, bookID, bookTitle, borrower, cls, issued, due,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to issue book loan")
				return
			}
			if bookID != "" {
				_, _ = db.DB.Exec("UPDATE campus_library_books SET available_copies = GREATEST(available_copies - 1, 0) WHERE id = ? AND tenant_id = ?", bookID, tenantID)
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Book loan issued"})
			return
		}

		title, _ := input["title"].(string)
		author, _ := input["author"].(string)
		isbn, _ := input["isbn"].(string)
		cat, _ := input["category"].(string)
		shelf, _ := input["shelf_location"].(string)
		copies := 1
		if c, ok := input["total_copies"].(float64); ok && c > 0 {
			copies = int(c)
		}
		_, err := db.DB.Exec(`
			INSERT INTO campus_library_books (id, tenant_id, isbn, title, author, category, shelf_location, total_copies, available_copies, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`,
			id, tenantID, isbn, title, author, cat, shelf, copies, copies,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to catalog book")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Book added to catalog"})

	case http.MethodPatch, http.MethodPut:
		var input struct {
			LoanID string `json:"loan_id"`
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.LoanID == "" {
			utils.JSONError(w, http.StatusBadRequest, "loan_id is required")
			return
		}
		today := time.Now().UTC().Format("2006-01-02")
		var bookID string
		_ = db.DB.QueryRow("SELECT book_id FROM campus_library_loans WHERE id = ? AND tenant_id = ?", input.LoanID, tenantID).Scan(&bookID)
		_, _ = db.DB.Exec("UPDATE campus_library_loans SET status = ?, returned_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", input.Status, today, input.LoanID, tenantID)
		if input.Status == "RETURNED" && bookID != "" {
			_, _ = db.DB.Exec("UPDATE campus_library_books SET available_copies = LEAST(available_copies + 1, total_copies) WHERE id = ? AND tenant_id = ?", bookID, tenantID)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Loan updated"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_library_books WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Library item removed"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 7. INVENTORY & PROCUREMENT (campus_inventory_items & campus_procurement_requests)
// ============================================================================

func HandleCampusProcurement(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		iRows, _ := db.DB.Query(`
			SELECT id, tenant_id, COALESCE(sku, ''), item_name, COALESCE(category, 'General'), COALESCE(unit, 'Units'), quantity_in_stock, reorder_level, unit_cost, COALESCE(location, ''), COALESCE(supplier_name, ''), COALESCE(status, 'IN_STOCK')
			FROM campus_inventory_items WHERE tenant_id = ? ORDER BY item_name ASC`, tenantID)
		inventory := []map[string]interface{}{}
		if iRows != nil {
			defer iRows.Close()
			for iRows.Next() {
				var id, tID, sku, name, cat, unit, loc, sup, status string
				var qty, reorder int
				var cost float64
				if err := iRows.Scan(&id, &tID, &sku, &name, &cat, &unit, &qty, &reorder, &cost, &loc, &sup, &status); err == nil {
					inventory = append(inventory, map[string]interface{}{
						"id":                id,
						"tenant_id":         tID,
						"sku":               sku,
						"item_name":         name,
						"category":          cat,
						"unit":              unit,
						"quantity_in_stock": qty,
						"reorder_level":     reorder,
						"unit_cost":         cost,
						"location":          loc,
						"supplier_name":     sup,
						"status":            status,
					})
				}
			}
		}

		pRows, _ := db.DB.Query(`
			SELECT id, tenant_id, po_number, department, requested_by, COALESCE(vendor_name, ''), items_summary, total_amount, COALESCE(priority, 'NORMAL'), COALESCE(status, 'PENDING_APPROVAL')
			FROM campus_procurement_requests WHERE tenant_id = ? ORDER BY created_at DESC`, tenantID)
		requests := []map[string]interface{}{}
		if pRows != nil {
			defer pRows.Close()
			for pRows.Next() {
				var id, tID, po, dept, reqBy, vendor, summary, prio, status string
				var total float64
				if err := pRows.Scan(&id, &tID, &po, &dept, &reqBy, &vendor, &summary, &total, &prio, &status); err == nil {
					requests = append(requests, map[string]interface{}{
						"id":            id,
						"tenant_id":     tID,
						"po_number":     po,
						"department":    dept,
						"requested_by":  reqBy,
						"vendor_name":   vendor,
						"items_summary": summary,
						"total_amount":  total,
						"priority":      prio,
						"status":        status,
					})
				}
			}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"tenant_id":            tenantID,
			"inventory":            inventory,
			"procurement_requests": requests,
		})

	case http.MethodPost:
		var input map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid JSON")
			return
		}
		recordType, _ := input["record_type"].(string)
		id := uuid.New().String()

		if recordType == "procurement" {
			dept, _ := input["department"].(string)
			reqBy, _ := input["requested_by"].(string)
			vendor, _ := input["vendor_name"].(string)
			summary, _ := input["items_summary"].(string)
			total, _ := input["total_amount"].(float64)
			prio, _ := input["priority"].(string)
			if prio == "" {
				prio = "NORMAL"
			}
			poNo := fmt.Sprintf("PO-%d-%s", time.Now().Year(), strings.ToUpper(id[:4]))
			_, err := db.DB.Exec(`
				INSERT INTO campus_procurement_requests (id, tenant_id, po_number, department, requested_by, vendor_name, items_summary, total_amount, priority, status)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL')`,
				id, tenantID, poNo, dept, reqBy, vendor, summary, total, prio,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to create procurement request")
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "po_number": poNo, "message": "Purchase order request submitted"})
			return
		}

		name, _ := input["item_name"].(string)
		cat, _ := input["category"].(string)
		unit, _ := input["unit"].(string)
		loc, _ := input["location"].(string)
		sup, _ := input["supplier_name"].(string)
		qty := 0
		if q, ok := input["quantity_in_stock"].(float64); ok {
			qty = int(q)
		}
		reorder := 10
		if r, ok := input["reorder_level"].(float64); ok {
			reorder = int(r)
		}
		cost, _ := input["unit_cost"].(float64)
		status := "IN_STOCK"
		if qty <= reorder {
			status = "LOW_STOCK"
		}
		sku := fmt.Sprintf("SKU-%s", strings.ToUpper(id[:5]))
		_, err := db.DB.Exec(`
			INSERT INTO campus_inventory_items (id, tenant_id, sku, item_name, category, unit, quantity_in_stock, reorder_level, unit_cost, location, supplier_name, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			id, tenantID, sku, name, cat, unit, qty, reorder, cost, loc, sup, status,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to add inventory item")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "sku": sku, "message": "Inventory item added"})

	case http.MethodPatch, http.MethodPut:
		var input struct {
			ID       string `json:"id"`
			Status   string `json:"status"`
			Quantity *int   `json:"quantity_in_stock"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			utils.JSONError(w, http.StatusBadRequest, "id is required")
			return
		}
		if input.Quantity != nil {
			_, _ = db.DB.Exec("UPDATE campus_inventory_items SET quantity_in_stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", *input.Quantity, input.ID, tenantID)
		}
		if input.Status != "" {
			_, _ = db.DB.Exec("UPDATE campus_procurement_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", input.Status, input.ID, tenantID)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Record updated"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_inventory_items WHERE id = ? AND tenant_id = ?", id, tenantID)
		_, _ = db.DB.Exec("DELETE FROM campus_procurement_requests WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Record deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 8. TRANSPORT & FLEET ROUTES (campus_transport_routes)
// ============================================================================

func HandleCampusTransport(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.Query(`
			SELECT id, tenant_id, route_name, bus_number, driver_name, COALESCE(driver_phone, ''), COALESCE(attendant_name, ''), capacity, assigned_students, COALESCE(stops_summary, ''), COALESCE(morning_departure, '06:45 AM'), COALESCE(afternoon_return, '03:30 PM'), term_fee, COALESCE(gps_status, 'ACTIVE')
			FROM campus_transport_routes WHERE tenant_id = ? ORDER BY route_name ASC`, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch transport routes")
			return
		}
		defer rows.Close()

		routes := []map[string]interface{}{}
		for rows.Next() {
			var id, tID, rName, bus, driver, phone, attendant, stops, morn, aft, gps string
			var cap, assigned int
			var fee float64
			if err := rows.Scan(&id, &tID, &rName, &bus, &driver, &phone, &attendant, &cap, &assigned, &stops, &morn, &aft, &fee, &gps); err == nil {
				routes = append(routes, map[string]interface{}{
					"id":                id,
					"tenant_id":         tID,
					"route_name":        rName,
					"bus_number":        bus,
					"driver_name":       driver,
					"driver_phone":      phone,
					"attendant_name":    attendant,
					"capacity":          cap,
					"assigned_students": assigned,
					"stops_summary":     stops,
					"morning_departure": morn,
					"afternoon_return":  aft,
					"term_fee":          fee,
					"gps_status":        gps,
				})
			}
		}
		utils.JSONResponse(w, http.StatusOK, routes)

	case http.MethodPost:
		var input struct {
			RouteName        string  `json:"route_name"`
			BusNumber        string  `json:"bus_number"`
			DriverName       string  `json:"driver_name"`
			DriverPhone      string  `json:"driver_phone"`
			AttendantName    string  `json:"attendant_name"`
			Capacity         int     `json:"capacity"`
			AssignedStudents int     `json:"assigned_students"`
			StopsSummary     string  `json:"stops_summary"`
			MorningDeparture string  `json:"morning_departure"`
			AfternoonReturn  string  `json:"afternoon_return"`
			TermFee          float64 `json:"term_fee"`
			GpsStatus        string  `json:"gps_status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.RouteName == "" {
			utils.JSONError(w, http.StatusBadRequest, "route_name is required")
			return
		}
		if input.Capacity == 0 {
			input.Capacity = 30
		}
		if input.GpsStatus == "" {
			input.GpsStatus = "ACTIVE"
		}
		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_transport_routes (id, tenant_id, route_name, bus_number, driver_name, driver_phone, attendant_name, capacity, assigned_students, stops_summary, morning_departure, afternoon_return, term_fee, gps_status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			id, tenantID, input.RouteName, input.BusNumber, input.DriverName, input.DriverPhone, input.AttendantName, input.Capacity, input.AssignedStudents, input.StopsSummary, input.MorningDeparture, input.AfternoonReturn, input.TermFee, input.GpsStatus,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create transport route")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Transport route added"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_transport_routes WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Route removed"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 9. HOSTEL & BOARDING ALLOCATIONS (campus_hostel_allocations)
// ============================================================================

func HandleCampusHostel(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.Query(`
			SELECT id, tenant_id, hostel_name, COALESCE(wing_or_floor, ''), room_number, COALESCE(bed_label, ''), capacity, occupants_count, COALESCE(student_name, ''), COALESCE(class_name, ''), COALESCE(matron_name, ''), COALESCE(exeat_status, 'ON_CAMPUS'), COALESCE(status, 'OCCUPIED')
			FROM campus_hostel_allocations WHERE tenant_id = ? ORDER BY hostel_name ASC, room_number ASC`, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to load hostel allocations")
			return
		}
		defer rows.Close()

		allocations := []map[string]interface{}{}
		for rows.Next() {
			var id, tID, hostel, wing, room, bed, stuName, cls, matron, exeat, status string
			var cap, occ int
			if err := rows.Scan(&id, &tID, &hostel, &wing, &room, &bed, &cap, &occ, &stuName, &cls, &matron, &exeat, &status); err == nil {
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
				})
			}
		}
		utils.JSONResponse(w, http.StatusOK, allocations)

	case http.MethodPost:
		var input struct {
			HostelName     string `json:"hostel_name"`
			WingOrFloor    string `json:"wing_or_floor"`
			RoomNumber     string `json:"room_number"`
			BedLabel       string `json:"bed_label"`
			Capacity       int    `json:"capacity"`
			OccupantsCount int    `json:"occupants_count"`
			StudentName    string `json:"student_name"`
			ClassName      string `json:"class_name"`
			MatronName     string `json:"matron_name"`
			ExeatStatus    string `json:"exeat_status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.HostelName == "" || input.RoomNumber == "" {
			utils.JSONError(w, http.StatusBadRequest, "hostel_name and room_number are required")
			return
		}
		if input.Capacity == 0 {
			input.Capacity = 4
		}
		if input.OccupantsCount == 0 {
			input.OccupantsCount = 1
		}
		if input.ExeatStatus == "" {
			input.ExeatStatus = "ON_CAMPUS"
		}
		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_hostel_allocations (id, tenant_id, hostel_name, wing_or_floor, room_number, bed_label, capacity, occupants_count, student_name, class_name, matron_name, exeat_status, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OCCUPIED')`,
			id, tenantID, input.HostelName, input.WingOrFloor, input.RoomNumber, input.BedLabel, input.Capacity, input.OccupantsCount, input.StudentName, input.ClassName, input.MatronName, input.ExeatStatus,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to allocate hostel room")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Hostel allocation saved"})

	case http.MethodPatch, http.MethodPut:
		var input struct {
			ID          string `json:"id"`
			ExeatStatus string `json:"exeat_status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			utils.JSONError(w, http.StatusBadRequest, "id is required")
			return
		}
		_, _ = db.DB.Exec("UPDATE campus_hostel_allocations SET exeat_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", input.ExeatStatus, input.ID, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Exeat status updated"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_hostel_allocations WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Hostel allocation removed"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 10. NOTICES, EVENTS & BROADCAST MESSAGING
// ============================================================================

func HandleCampusNotices(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.Query(`
			SELECT id, tenant_id, title, COALESCE(category, 'NOTICE'), COALESCE(audience, 'ALL'), COALESCE(event_date, ''), COALESCE(event_time, ''), COALESCE(location, ''), content, COALESCE(author_name, 'Administration'), is_pinned
			FROM campus_notices_and_events WHERE tenant_id = ? ORDER BY is_pinned DESC, created_at DESC`, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to load notices")
			return
		}
		defer rows.Close()

		items := []map[string]interface{}{}
		for rows.Next() {
			var id, tID, title, cat, aud, date, tm, loc, content, author string
			var pinned bool
			if err := rows.Scan(&id, &tID, &title, &cat, &aud, &date, &tm, &loc, &content, &author, &pinned); err == nil {
				items = append(items, map[string]interface{}{
					"id":          id,
					"tenant_id":   tID,
					"title":       title,
					"category":    cat,
					"audience":    aud,
					"event_date":  date,
					"event_time":  tm,
					"location":    loc,
					"content":     content,
					"author_name": author,
					"is_pinned":   pinned,
				})
			}
		}
		utils.JSONResponse(w, http.StatusOK, items)

	case http.MethodPost:
		var input struct {
			Title      string `json:"title"`
			Category   string `json:"category"`
			Audience   string `json:"audience"`
			EventDate  string `json:"event_date"`
			EventTime  string `json:"event_time"`
			Location   string `json:"location"`
			Content    string `json:"content"`
			AuthorName string `json:"author_name"`
			IsPinned   bool   `json:"is_pinned"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Title == "" {
			utils.JSONError(w, http.StatusBadRequest, "title is required")
			return
		}
		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_notices_and_events (id, tenant_id, title, category, audience, event_date, event_time, location, content, author_name, is_pinned)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			id, tenantID, input.Title, input.Category, input.Audience, input.EventDate, input.EventTime, input.Location, input.Content, input.AuthorName, input.IsPinned,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to publish notice")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Notice published"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_notices_and_events WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Notice deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func HandleCampusMessages(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.Query(`
			SELECT id, tenant_id, sender_name, COALESCE(sender_role, 'admin'), COALESCE(recipient_group, 'ALL_PARENTS'), COALESCE(channel, 'IN_APP'), subject, body, COALESCE(delivery_status, 'DELIVERED'), read_count, created_at
			FROM campus_messages WHERE tenant_id = ? ORDER BY created_at DESC`, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to load messages")
			return
		}
		defer rows.Close()

		list := []map[string]interface{}{}
		for rows.Next() {
			var id, tID, sender, role, group, chanType, subj, body, status string
			var reads int
			var created time.Time
			if err := rows.Scan(&id, &tID, &sender, &role, &group, &chanType, &subj, &body, &status, &reads, &created); err == nil {
				list = append(list, map[string]interface{}{
					"id":               id,
					"tenant_id":        tID,
					"sender_name":      sender,
					"sender_role":      role,
					"recipient_group":  group,
					"channel":          chanType,
					"subject":          subj,
					"body":             body,
					"delivery_status":  status,
					"read_count":       reads,
					"created_at":       created.Format(time.RFC3339),
				})
			}
		}
		utils.JSONResponse(w, http.StatusOK, list)

	case http.MethodPost:
		var input struct {
			SenderName     string `json:"sender_name"`
			SenderRole     string `json:"sender_role"`
			RecipientGroup string `json:"recipient_group"`
			Channel        string `json:"channel"`
			Subject        string `json:"subject"`
			Body           string `json:"body"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Subject == "" || input.Body == "" {
			utils.JSONError(w, http.StatusBadRequest, "subject and body are required")
			return
		}
		if input.SenderName == "" {
			input.SenderName = "School Administration"
		}
		if input.Channel == "" {
			input.Channel = "IN_APP"
		}
		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_messages (id, tenant_id, sender_name, sender_role, recipient_group, channel, subject, body, delivery_status, read_count)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DELIVERED', 1)`,
			id, tenantID, input.SenderName, input.SenderRole, input.RecipientGroup, input.Channel, input.Subject, input.Body,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to dispatch message")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Broadcast message dispatched"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_messages WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Message deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 11. MOBILE APP ACCOUNTS (campus_mobile_app_accounts)
// ============================================================================

func HandleCampusMobileAccounts(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		roleFilter := r.URL.Query().Get("role")
		query := `
			SELECT id, tenant_id, COALESCE(user_id, ''), full_name, COALESCE(email, ''), COALESCE(phone, ''), role, COALESCE(linked_ward_or_class, ''), COALESCE(app_version, 'v2.5.1'), COALESCE(device_platform, 'iOS / Android'), push_enabled, COALESCE(invite_code, ''), COALESCE(account_status, 'ACTIVE'), last_active_at
			FROM campus_mobile_app_accounts WHERE tenant_id = ?`
		args := []interface{}{tenantID}
		if roleFilter != "" && roleFilter != "all" {
			query += " AND LOWER(role) = ?"
			args = append(args, strings.ToLower(roleFilter))
		}
		query += " ORDER BY created_at DESC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to load mobile app accounts")
			return
		}
		defer rows.Close()

		accounts := []map[string]interface{}{}
		for rows.Next() {
			var id, tID, uID, name, email, phone, role, linked, ver, dev, code, status string
			var push bool
			var lastActive time.Time
			if err := rows.Scan(&id, &tID, &uID, &name, &email, &phone, &role, &linked, &ver, &dev, &push, &code, &status, &lastActive); err == nil {
				accounts = append(accounts, map[string]interface{}{
					"id":                   id,
					"tenant_id":            tID,
					"user_id":              uID,
					"full_name":            name,
					"email":                email,
					"phone":                phone,
					"role":                 role,
					"linked_ward_or_class": linked,
					"app_version":          ver,
					"device_platform":      dev,
					"push_enabled":         push,
					"invite_code":          code,
					"account_status":       status,
					"last_active_at":       lastActive.Format("2006-01-02 15:04"),
				})
			}
		}
		utils.JSONResponse(w, http.StatusOK, accounts)

	case http.MethodPost:
		var input struct {
			FullName          string `json:"full_name"`
			Email             string `json:"email"`
			Phone             string `json:"phone"`
			Role              string `json:"role"`
			LinkedWardOrClass string `json:"linked_ward_or_class"`
			DevicePlatform    string `json:"device_platform"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.FullName == "" || input.Role == "" {
			utils.JSONError(w, http.StatusBadRequest, "full_name and role are required")
			return
		}
		id := uuid.New().String()
		inviteCode := fmt.Sprintf("SCH-%s-%s", strings.ToUpper(input.Role[:2]), strings.ToUpper(id[:4]))
		if input.DevicePlatform == "" {
			input.DevicePlatform = "Android / iOS"
		}
		_, err := db.DB.Exec(`
			INSERT INTO campus_mobile_app_accounts (id, tenant_id, full_name, email, phone, role, linked_ward_or_class, app_version, device_platform, push_enabled, invite_code, account_status)
			VALUES (?, ?, ?, ?, ?, ?, ?, 'v2.5.1', ?, true, ?, 'ACTIVE')`,
			id, tenantID, input.FullName, input.Email, input.Phone, strings.ToLower(input.Role), input.LinkedWardOrClass, input.DevicePlatform, inviteCode,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to provision mobile app account")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":          id,
			"invite_code": inviteCode,
			"message":     "Mobile app account provisioned",
		})

	case http.MethodPatch, http.MethodPut:
		var input struct {
			ID            string `json:"id"`
			AccountStatus string `json:"account_status"`
			PushEnabled   *bool  `json:"push_enabled"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			utils.JSONError(w, http.StatusBadRequest, "id is required")
			return
		}
		if input.AccountStatus != "" {
			_, _ = db.DB.Exec("UPDATE campus_mobile_app_accounts SET account_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", input.AccountStatus, input.ID, tenantID)
		}
		if input.PushEnabled != nil {
			_, _ = db.DB.Exec("UPDATE campus_mobile_app_accounts SET push_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?", *input.PushEnabled, input.ID, tenantID)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Mobile account updated"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_mobile_app_accounts WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Mobile account revoked"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 12. HOMEWORK & ASSESSMENTS (campus_homework_and_assessments)
// ============================================================================

func HandleCampusHomework(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.Query(`
			SELECT id, tenant_id, title, subject_name, class_name, COALESCE(teacher_name, ''), COALESCE(assessment_type, 'HOMEWORK'), COALESCE(due_date, ''), max_score, COALESCE(instructions, ''), submissions_count, total_students, COALESCE(status, 'PUBLISHED')
			FROM campus_homework_and_assessments WHERE tenant_id = ? ORDER BY created_at DESC`, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to load homework & assessments")
			return
		}
		defer rows.Close()

		items := []map[string]interface{}{}
		for rows.Next() {
			var id, tID, title, subj, cls, teacher, aType, due, instr, status string
			var maxScore, subs, total int
			if err := rows.Scan(&id, &tID, &title, &subj, &cls, &teacher, &aType, &due, &maxScore, &instr, &subs, &total, &status); err == nil {
				items = append(items, map[string]interface{}{
					"id":                id,
					"tenant_id":         tID,
					"title":             title,
					"subject_name":      subj,
					"class_name":        cls,
					"teacher_name":      teacher,
					"assessment_type":   aType,
					"due_date":          due,
					"max_score":         maxScore,
					"instructions":      instr,
					"submissions_count": subs,
					"total_students":    total,
					"status":            status,
				})
			}
		}
		utils.JSONResponse(w, http.StatusOK, items)

	case http.MethodPost:
		var input struct {
			Title          string `json:"title"`
			SubjectName    string `json:"subject_name"`
			ClassName      string `json:"class_name"`
			TeacherName    string `json:"teacher_name"`
			AssessmentType string `json:"assessment_type"`
			DueDate        string `json:"due_date"`
			MaxScore       int    `json:"max_score"`
			Instructions   string `json:"instructions"`
			TotalStudents  int    `json:"total_students"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Title == "" {
			utils.JSONError(w, http.StatusBadRequest, "title is required")
			return
		}
		if input.MaxScore == 0 {
			input.MaxScore = 100
		}
		if input.TotalStudents == 0 {
			input.TotalStudents = 30
		}
		if input.AssessmentType == "" {
			input.AssessmentType = "HOMEWORK"
		}
		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_homework_and_assessments (id, tenant_id, title, subject_name, class_name, teacher_name, assessment_type, due_date, max_score, instructions, submissions_count, total_students, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'PUBLISHED')`,
			id, tenantID, input.Title, input.SubjectName, input.ClassName, input.TeacherName, input.AssessmentType, input.DueDate, input.MaxScore, input.Instructions, input.TotalStudents,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create homework")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": id, "message": "Assessment published"})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, _ = db.DB.Exec("DELETE FROM campus_homework_and_assessments WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Assessment deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============================================================================
// 14. ACADEMIC SESSIONS & TERM CALENDAR (TENANT-ISOLATED & PERSISTENT)
// ============================================================================

func HandleCampusAcademicSessions(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		requestedSessID := strings.TrimSpace(r.URL.Query().Get("session_id"))

		// 1. Fetch all sessions for this tenant
		sessRows, err := db.DB.Query(`
			SELECT id, tenant_id, session_name, academic_year, start_date, end_date, is_current, status, terms_count, COALESCE(description, '')
			FROM campus_academic_sessions
			WHERE tenant_id = ?
			ORDER BY is_current DESC, start_date DESC`, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch academic sessions")
			return
		}
		defer sessRows.Close()

		sessions := []map[string]interface{}{}
		var activeSessionID string
		var selectedSession map[string]interface{}

		for sessRows.Next() {
			var id, tID, sName, aYear, sDate, eDate, status, desc string
			var isCurrent bool
			var tCount int
			if err := sessRows.Scan(&id, &tID, &sName, &aYear, &sDate, &eDate, &isCurrent, &status, &tCount, &desc); err == nil {
				sessMap := map[string]interface{}{
					"id":            id,
					"tenant_id":     tID,
					"session_name":  sName,
					"academic_year": aYear,
					"start_date":    sDate,
					"end_date":      eDate,
					"is_current":    isCurrent,
					"status":        status,
					"terms_count":   tCount,
					"description":   desc,
				}
				sessions = append(sessions, sessMap)
				if isCurrent && activeSessionID == "" {
					activeSessionID = id
				}
				if requestedSessID != "" && id == requestedSessID {
					selectedSession = sessMap
				}
			}
		}

		targetSessID := requestedSessID
		if targetSessID == "" {
			targetSessID = activeSessionID
		}
		if targetSessID == "" && len(sessions) > 0 {
			targetSessID = sessions[0]["id"].(string)
		}
		if selectedSession == nil && len(sessions) > 0 {
			for _, s := range sessions {
				if s["id"] == targetSessID {
					selectedSession = s
					break
				}
			}
		}

		// 2. Fetch terms for target session
		terms := []map[string]interface{}{}
		var activeTerm map[string]interface{}

		if targetSessID != "" {
			tRows, err := db.DB.Query(`
				SELECT id, tenant_id, session_id, term_name, COALESCE(term_alias, ''), term_order, is_current, status,
				       COALESCE(resumption_date, ''), COALESCE(mid_term_break_start, ''), COALESCE(mid_term_break_end, ''),
				       COALESCE(exams_start_date, ''), COALESCE(exams_end_date, ''), COALESCE(vacation_date, ''),
				       teaching_days, weeks_count,
				       COALESCE(ca1_start_date, ''), COALESCE(ca1_end_date, ''), COALESCE(ca1_submission_deadline, ''),
				       COALESCE(ca2_start_date, ''), COALESCE(ca2_end_date, ''), COALESCE(ca2_submission_deadline, ''),
				       COALESCE(terminal_exam_submission_deadline, ''), COALESCE(broadsheet_approval_date, ''),
				       COALESCE(results_release_date, ''), COALESCE(notes, '')
				FROM campus_academic_terms
				WHERE tenant_id = ? AND session_id = ?
				ORDER BY term_order ASC`, tenantID, targetSessID)
			if err == nil && tRows != nil {
				defer tRows.Close()
				for tRows.Next() {
					var id, tID, sID, tName, tAlias, status, resDate, mtStart, mtEnd, exStart, exEnd, vacDate string
					var ca1Start, ca1End, ca1Sub, ca2Start, ca2End, ca2Sub, examSub, broadApp, resRel, notes string
					var isCur bool
					var order, teachDays, weeks int
					if err := tRows.Scan(
						&id, &tID, &sID, &tName, &tAlias, &order, &isCur, &status,
						&resDate, &mtStart, &mtEnd, &exStart, &exEnd, &vacDate,
						&teachDays, &weeks,
						&ca1Start, &ca1End, &ca1Sub, &ca2Start, &ca2End, &ca2Sub, &examSub, &broadApp, &resRel, &notes,
					); err == nil {
						termMap := map[string]interface{}{
							"id":                                id,
							"tenant_id":                         tID,
							"session_id":                        sID,
							"term_name":                         tName,
							"term_alias":                        tAlias,
							"term_order":                        order,
							"is_current":                        isCur,
							"status":                            status,
							"resumption_date":                   resDate,
							"mid_term_break_start":              mtStart,
							"mid_term_break_end":                mtEnd,
							"exams_start_date":                  exStart,
							"exams_end_date":                    exEnd,
							"vacation_date":                     vacDate,
							"teaching_days":                     teachDays,
							"weeks_count":                       weeks,
							"ca1_start_date":                    ca1Start,
							"ca1_end_date":                      ca1End,
							"ca1_submission_deadline":           ca1Sub,
							"ca2_start_date":                    ca2Start,
							"ca2_end_date":                      ca2End,
							"ca2_submission_deadline":           ca2Sub,
							"terminal_exam_submission_deadline": examSub,
							"broadsheet_approval_date":          broadApp,
							"results_release_date":              resRel,
							"notes":                             notes,
						}
						terms = append(terms, termMap)
						if isCur && activeTerm == nil {
							activeTerm = termMap
						}
					}
				}
			}
		}

		// 3. Fetch events
		events := []map[string]interface{}{}
		if targetSessID != "" {
			eRows, err := db.DB.Query(`
				SELECT id, tenant_id, session_id, COALESCE(term_id, ''), title, category, start_date, COALESCE(end_date, ''), is_statutory_holiday, COALESCE(description, '')
				FROM campus_calendar_events
				WHERE tenant_id = ? AND session_id = ?
				ORDER BY start_date ASC`, tenantID, targetSessID)
			if err == nil && eRows != nil {
				defer eRows.Close()
				for eRows.Next() {
					var id, tID, sID, termID, title, cat, sDate, eDate, desc string
					var isStat bool
					if err := eRows.Scan(&id, &tID, &sID, &termID, &title, &cat, &sDate, &eDate, &isStat, &desc); err == nil {
						events = append(events, map[string]interface{}{
							"id":                   id,
							"tenant_id":            tID,
							"session_id":           sID,
							"term_id":              termID,
							"title":                title,
							"category":             cat,
							"start_date":           sDate,
							"end_date":             eDate,
							"is_statutory_holiday": isStat,
							"description":          desc,
						})
					}
				}
			}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"status":         "success",
			"sessions":       sessions,
			"active_session": selectedSession,
			"active_term":    activeTerm,
			"terms":          terms,
			"events":         events,
		})

	case http.MethodPost:
		var input struct {
			SessionName  string `json:"session_name"`
			AcademicYear string `json:"academic_year"`
			StartDate    string `json:"start_date"`
			EndDate      string `json:"end_date"`
			Description  string `json:"description"`
			MakeActive   bool   `json:"make_active"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
			return
		}
		if strings.TrimSpace(input.SessionName) == "" {
			utils.JSONError(w, http.StatusBadRequest, "Session name is required")
			return
		}
		if input.AcademicYear == "" {
			input.AcademicYear = input.SessionName
		}
		if input.StartDate == "" {
			input.StartDate = time.Now().Format("2006-01-02")
		}
		if input.EndDate == "" {
			input.EndDate = time.Now().AddDate(1, 0, 0).Format("2006-01-02")
		}

		newID := uuid.New().String()
		if input.MakeActive {
			_, _ = db.DB.Exec("UPDATE campus_academic_sessions SET is_current = false WHERE tenant_id = ?", tenantID)
		}

		_, err := db.DB.Exec(`
			INSERT INTO campus_academic_sessions (id, tenant_id, session_name, academic_year, start_date, end_date, is_current, status, terms_count, description)
			VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 3, ?)`,
			newID, tenantID, input.SessionName, input.AcademicYear, input.StartDate, input.EndDate, input.MakeActive, input.Description,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create academic session")
			return
		}

		// Auto seed 3 terms for the new session
		_, _ = db.DB.Exec(`
			INSERT INTO campus_academic_terms (id, tenant_id, session_id, term_name, term_alias, term_order, is_current, status, resumption_date, mid_term_break_start, mid_term_break_end, exams_start_date, exams_end_date, vacation_date, teaching_days, weeks_count)
			VALUES
			(?, ?, ?, 'First Term', 'Harmattan', 1, true, 'ACTIVE', ?, '', '', '', '', '', 68, 14),
			(?, ?, ?, 'Second Term', 'Rain', 2, false, 'UPCOMING', '', '', '', '', '', '', 63, 13),
			(?, ?, ?, 'Third Term', 'Promotional', 3, false, 'PLANNED', '', '', '', '', '', '', 62, 13)
		`, uuid.New().String(), tenantID, newID, input.StartDate,
			uuid.New().String(), tenantID, newID,
			uuid.New().String(), tenantID, newID)

		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":      newID,
			"message": "Academic session created successfully",
		})

	case http.MethodPut:
		var input struct {
			Action    string `json:"action"`
			SessionID string `json:"session_id"`
			Status    string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid payload")
			return
		}

		if input.Action == "set_active_session" {
			_, _ = db.DB.Exec("UPDATE campus_academic_sessions SET is_current = false WHERE tenant_id = ?", tenantID)
			_, err := db.DB.Exec("UPDATE campus_academic_sessions SET is_current = true, status = 'ACTIVE' WHERE id = ? AND tenant_id = ?", input.SessionID, tenantID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to activate session")
				return
			}
			utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Active academic session updated"})
			return
		}

		if input.Action == "archive_session" {
			_, err := db.DB.Exec("UPDATE campus_academic_sessions SET status = 'ARCHIVED', is_current = false WHERE id = ? AND tenant_id = ?", input.SessionID, tenantID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to archive session")
				return
			}
			utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Academic session archived"})
			return
		}

		utils.JSONError(w, http.StatusBadRequest, "Unknown action")

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func HandleCampusAcademicTerms(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodPut, http.MethodPatch, http.MethodPost:
		var input struct {
			Action                         string `json:"action"`
			TermID                         string `json:"term_id"`
			SessionID                      string `json:"session_id"`
			ResumptionDate                 string `json:"resumption_date"`
			MidTermBreakStart              string `json:"mid_term_break_start"`
			MidTermBreakEnd                string `json:"mid_term_break_end"`
			ExamsStartDate                 string `json:"exams_start_date"`
			ExamsEndDate                   string `json:"exams_end_date"`
			VacationDate                   string `json:"vacation_date"`
			TeachingDays                   int    `json:"teaching_days"`
			WeeksCount                     int    `json:"weeks_count"`
			CA1StartDate                   string `json:"ca1_start_date"`
			CA1EndDate                     string `json:"ca1_end_date"`
			CA1SubmissionDeadline          string `json:"ca1_submission_deadline"`
			CA2StartDate                   string `json:"ca2_start_date"`
			CA2EndDate                     string `json:"ca2_end_date"`
			CA2SubmissionDeadline          string `json:"ca2_submission_deadline"`
			TerminalExamSubmissionDeadline string `json:"terminal_exam_submission_deadline"`
			BroadsheetApprovalDate         string `json:"broadsheet_approval_date"`
			ResultsReleaseDate             string `json:"results_release_date"`
			Status                         string `json:"status"`
			Notes                          string `json:"notes"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
			return
		}

		if input.Action == "set_active_term" {
			if input.SessionID == "" {
				_ = db.DB.QueryRow("SELECT session_id FROM campus_academic_terms WHERE id = ? AND tenant_id = ?", input.TermID, tenantID).Scan(&input.SessionID)
			}
			_, _ = db.DB.Exec("UPDATE campus_academic_terms SET is_current = false, status = 'UPCOMING' WHERE tenant_id = ? AND session_id = ?", tenantID, input.SessionID)
			_, err := db.DB.Exec("UPDATE campus_academic_terms SET is_current = true, status = 'ACTIVE' WHERE id = ? AND tenant_id = ?", input.TermID, tenantID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to set active term")
				return
			}
			utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Active term updated successfully"})
			return
		}

		// Update term dates and assessment windows
		_, err := db.DB.Exec(`
			UPDATE campus_academic_terms
			SET resumption_date = ?, mid_term_break_start = ?, mid_term_break_end = ?,
			    exams_start_date = ?, exams_end_date = ?, vacation_date = ?,
			    teaching_days = COALESCE(NULLIF(?, 0), teaching_days),
			    weeks_count = COALESCE(NULLIF(?, 0), weeks_count),
			    ca1_start_date = ?, ca1_end_date = ?, ca1_submission_deadline = ?,
			    ca2_start_date = ?, ca2_end_date = ?, ca2_submission_deadline = ?,
			    terminal_exam_submission_deadline = ?, broadsheet_approval_date = ?,
			    results_release_date = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?`,
			input.ResumptionDate, input.MidTermBreakStart, input.MidTermBreakEnd,
			input.ExamsStartDate, input.ExamsEndDate, input.VacationDate,
			input.TeachingDays, input.WeeksCount,
			input.CA1StartDate, input.CA1EndDate, input.CA1SubmissionDeadline,
			input.CA2StartDate, input.CA2EndDate, input.CA2SubmissionDeadline,
			input.TerminalExamSubmissionDeadline, input.BroadsheetApprovalDate,
			input.ResultsReleaseDate, input.Notes,
			input.TermID, tenantID,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to update term configuration")
			return
		}

		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Term dates and assessment windows saved successfully"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func HandleCampusAcademicEvents(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodPost:
		var input struct {
			SessionID          string `json:"session_id"`
			TermID             string `json:"term_id"`
			Title              string `json:"title"`
			Category           string `json:"category"`
			StartDate          string `json:"start_date"`
			EndDate            string `json:"end_date"`
			IsStatutoryHoliday bool   `json:"is_statutory_holiday"`
			Description        string `json:"description"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid payload")
			return
		}
		if strings.TrimSpace(input.Title) == "" {
			utils.JSONError(w, http.StatusBadRequest, "Event title is required")
			return
		}
		if input.Category == "" {
			input.Category = "ACADEMIC"
		}

		newID := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_calendar_events (id, tenant_id, session_id, term_id, title, category, start_date, end_date, is_statutory_holiday, description)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			newID, tenantID, input.SessionID, input.TermID, input.Title, input.Category, input.StartDate, input.EndDate, input.IsStatutoryHoliday, input.Description,
		)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create calendar event")
			return
		}
		utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"id": newID, "message": "Event created"})

	case http.MethodDelete:
		eventID := r.URL.Query().Get("id")
		_, err := db.DB.Exec("DELETE FROM campus_calendar_events WHERE id = ? AND tenant_id = ?", eventID, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete event")
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Event deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

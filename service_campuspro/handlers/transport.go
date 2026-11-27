package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// CampusTransportRoute represents a dedicated school bus corridor and vehicle fleet
type CampusTransportRoute struct {
	ID               string    `json:"id"`
	TenantID         string    `json:"tenant_id"`
	RouteName        string    `json:"route_name"`
	BusNumber        string    `json:"bus_number"`
	DriverName       string    `json:"driver_name"`
	DriverPhone      string    `json:"driver_phone"`
	AttendantName    string    `json:"attendant_name"`
	Capacity         int       `json:"capacity"`
	AssignedStudents int       `json:"assigned_students"`
	StopsSummary     string    `json:"stops_summary"`
	MorningDeparture string    `json:"morning_departure"`
	AfternoonReturn  string    `json:"afternoon_return"`
	TermFee          float64   `json:"term_fee"`
	GpsStatus        string    `json:"gps_status"` // EN_ROUTE, PARKED_ON_CAMPUS, MAINTENANCE, DELAYED
	Status           string    `json:"status"`     // ACTIVE, SUSPENDED
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// CampusTransportRider represents an enrolled student passenger on a bus corridor
type CampusTransportRider struct {
	ID                   string    `json:"id"`
	TenantID             string    `json:"tenant_id"`
	RouteID              string    `json:"route_id"`
	RouteName            string    `json:"route_name"`
	StudentID            string    `json:"student_id"`
	StudentName          string    `json:"student_name"`
	AdmissionNumber      string    `json:"admission_number"`
	ClassArmName         string    `json:"class_arm_name"`
	PickupStop           string    `json:"pickup_stop"`
	MorningPickupTime    string    `json:"morning_pickup_time"`
	AfternoonDropoffTime string    `json:"afternoon_dropoff_time"`
	ParentPhone          string    `json:"parent_phone"`
	FeeStatus            string    `json:"fee_status"` // CLEARED, PENDING, WAIVED
	Status               string    `json:"status"`     // ACTIVE, INACTIVE
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

// seedTenantTransportIfEmpty initializes authentic Nigerian school bus routes & student manifests
func seedTenantTransportIfEmpty(tenantID string) {
	if !demoSeedEnabled() {
		return
	}
	if db.DB == nil || tenantID == "" {
		return
	}

	// 1. Ensure table and column integrity on live database
	_, _ = db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS campus_transport_routes (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			route_name VARCHAR(128) NOT NULL,
			bus_number VARCHAR(64) NOT NULL DEFAULT '',
			driver_name VARCHAR(128) NOT NULL DEFAULT '',
			driver_phone VARCHAR(64) DEFAULT '',
			attendant_name VARCHAR(128) DEFAULT '',
			capacity INT NOT NULL DEFAULT 30,
			assigned_students INT NOT NULL DEFAULT 0,
			stops_summary TEXT DEFAULT '',
			morning_departure VARCHAR(32) DEFAULT '06:45 AM',
			afternoon_return VARCHAR(32) DEFAULT '03:30 PM',
			term_fee NUMERIC(12,2) DEFAULT 0,
			gps_status VARCHAR(32) DEFAULT 'ACTIVE',
			status VARCHAR(32) DEFAULT 'ACTIVE',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS bus_number VARCHAR(64) DEFAULT ''")
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS attendant_name VARCHAR(128) DEFAULT ''")
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS assigned_students INT NOT NULL DEFAULT 0")
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS stops_summary TEXT DEFAULT ''")
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS morning_departure VARCHAR(32) DEFAULT '06:45 AM'")
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS afternoon_return VARCHAR(32) DEFAULT '03:30 PM'")
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS term_fee NUMERIC(12,2) DEFAULT 0")
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS gps_status VARCHAR(32) DEFAULT 'ACTIVE'")
	_, _ = db.DB.Exec("ALTER TABLE campus_transport_routes ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'ACTIVE'")

	_, _ = db.DB.Exec(`
		CREATE TABLE IF NOT EXISTS campus_transport_riders (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			route_id VARCHAR(64) NOT NULL,
			route_name VARCHAR(128) NOT NULL,
			student_id VARCHAR(64) NOT NULL,
			student_name VARCHAR(128) NOT NULL,
			admission_number VARCHAR(64) DEFAULT '',
			class_arm_name VARCHAR(64) DEFAULT '',
			pickup_stop VARCHAR(128) NOT NULL,
			morning_pickup_time VARCHAR(32) DEFAULT '06:45 AM',
			afternoon_dropoff_time VARCHAR(32) DEFAULT '03:45 PM',
			parent_phone VARCHAR(64) DEFAULT '',
			fee_status VARCHAR(32) DEFAULT 'CLEARED',
			status VARCHAR(32) DEFAULT 'ACTIVE',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)

	var routesCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_transport_routes WHERE tenant_id = ?", tenantID).Scan(&routesCount)
	if routesCount > 0 {
		return
	}

	routeAId := uuid.New().String()
	routeBId := uuid.New().String()
	routeCId := uuid.New().String()

	// Seed 3 authentic Lagos bus routes
	routes := []struct {
		id, name, bus, driver, phone, attendant, stops, morn, aft, gps string
		cap                                                            int
		fee                                                            float64
	}{
		{
			id:        routeAId,
			name:      "Route A · Lekki Phase 1 / Ikate / Chevron Corridor",
			bus:       "BUS-01 (Toyota Coaster · 32 Seater)",
			driver:    "Mr. Sunday Adeleke",
			phone:     "+234 802 331 4450",
			attendant: "Mrs. Grace Udoh",
			cap:       30,
			stops:     "Admiralty Way → Freedom Way → Ikate Elegushi → Agungi → Chevron Drive → Campus Gate",
			morn:      "06:35 AM",
			aft:       "03:45 PM",
			fee:       85000.00,
			gps:       "EN_ROUTE",
		},
		{
			id:        routeBId,
			name:      "Route B · Ikeja GRA / Maryland / Anthony Corridor",
			bus:       "BUS-02 (Mercedes-Benz Sprinter · 24 Seater)",
			driver:    "Mr. Segun Obasanjo",
			phone:     "+234 805 662 1190",
			attendant: "Mrs. Bisi Alabi",
			cap:       22,
			stops:     "Isaac John St → Joel Ogunnaike → Maryland Mall → Anthony Village → Campus Gate",
			morn:      "06:40 AM",
			aft:       "03:30 PM",
			fee:       75000.00,
			gps:       "PARKED_ON_CAMPUS",
		},
		{
			id:        routeCId,
			name:      "Route C · Victoria Island / Oniru / Ikoyi Shuttle",
			bus:       "BUS-03 (Toyota HiAce Exec · 18 Seater)",
			driver:    "Mr. Chinedu Eze",
			phone:     "+234 803 718 9920",
			attendant: "Ms. Funke Adeyemi",
			cap:       16,
			stops:     "Ahmadu Bello Way → Ozumba Mbadiwe → Oniru Estate → Bourdillon Ikoyi → Campus Gate",
			morn:      "06:45 AM",
			aft:       "04:00 PM",
			fee:       95000.00,
			gps:       "EN_ROUTE",
		},
	}

	for _, r := range routes {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_transport_routes (
				id, tenant_id, route_name, bus_number, driver_name, driver_phone, attendant_name, capacity, assigned_students, stops_summary, morning_departure, afternoon_return, term_fee, gps_status, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 'ACTIVE')
		`, r.id, tenantID, r.name, r.bus, r.driver, r.phone, r.attendant, r.cap, r.stops, r.morn, r.aft, r.fee, r.gps)
	}

	// Fetch real students from roster if available
	type studentRow struct {
		id, name, admNo, armName string
	}
	var existingStudents []studentRow
	sRows, err := db.DB.Query(`SELECT student_id, student_name, admission_number, COALESCE((SELECT name FROM campus_class_arms WHERE id = campus_class_students.arm_id LIMIT 1), 'Enrolled') FROM campus_class_students WHERE tenant_id = ? LIMIT 10`, tenantID)
	if err == nil && sRows != nil {
		for sRows.Next() {
			var st studentRow
			if err := sRows.Scan(&st.id, &st.name, &st.admNo, &st.armName); err == nil {
				existingStudents = append(existingStudents, st)
			}
		}
		sRows.Close()
	}

	// Fallback Nigerian students if table was empty
	if len(existingStudents) < 6 {
		existingStudents = []studentRow{
			{id: uuid.New().String(), name: "Chinedu Okafor", admNo: "ADM/2026/0142", armName: "JSS 1 Gold"},
			{id: uuid.New().String(), name: "Amina Danjuma", admNo: "ADM/2026/0189", armName: "JSS 2 Diamond"},
			{id: uuid.New().String(), name: "Favour Adeleke", admNo: "ADM/2026/0204", armName: "JSS 3 Platinum"},
			{id: uuid.New().String(), name: "Tunde Bakare", admNo: "ADM/2026/0312", armName: "SS 1 Science"},
			{id: uuid.New().String(), name: "Fatima Ibrahim", admNo: "ADM/2026/0355", armName: "SS 2 Arts"},
			{id: uuid.New().String(), name: "Somtochukwu Nwosu", admNo: "ADM/2026/0411", armName: "SS 3 Commercial"},
		}
	}

	ridersSeed := []struct {
		routeID, routeName, stop, morn, aft, phone, fee string
		student                                         studentRow
	}{
		{
			routeID:   routeAId,
			routeName: "Route A · Lekki Phase 1 / Ikate / Chevron Corridor",
			stop:      "Admiralty Way (Admiralty Mall Bus Stop)",
			morn:      "06:35 AM",
			aft:       "03:45 PM",
			phone:     "+234 803 301 2284",
			fee:       "CLEARED",
			student:   existingStudents[0],
		},
		{
			routeID:   routeAId,
			routeName: "Route A · Lekki Phase 1 / Ikate / Chevron Corridor",
			stop:      "Freedom Way (Meadow Hall Junction)",
			morn:      "06:42 AM",
			aft:       "03:40 PM",
			phone:     "+234 802 210 9941",
			fee:       "CLEARED",
			student:   existingStudents[1],
		},
		{
			routeID:   routeAId,
			routeName: "Route A · Lekki Phase 1 / Ikate / Chevron Corridor",
			stop:      "Ikate Elegushi (House on the Rock Roundabout)",
			morn:      "06:50 AM",
			aft:       "03:35 PM",
			phone:     "+234 805 441 8832",
			fee:       "PENDING",
			student:   existingStudents[2],
		},
		{
			routeID:   routeBId,
			routeName: "Route B · Ikeja GRA / Maryland / Anthony Corridor",
			stop:      "Isaac John Street (Radisson Blu Corner)",
			morn:      "06:45 AM",
			aft:       "03:30 PM",
			phone:     "+234 802 881 7733",
			fee:       "CLEARED",
			student:   existingStudents[3],
		},
		{
			routeID:   routeBId,
			routeName: "Route B · Ikeja GRA / Maryland / Anthony Corridor",
			stop:      "Maryland Mall (BRT Interchange)",
			morn:      "06:55 AM",
			aft:       "03:20 PM",
			phone:     "+234 803 661 2244",
			fee:       "CLEARED",
			student:   existingStudents[4],
		},
		{
			routeID:   routeCId,
			routeName: "Route C · Victoria Island / Oniru / Ikoyi Shuttle",
			stop:      "Oniru Private Estate (Palms Mall Gate)",
			morn:      "06:50 AM",
			aft:       "04:00 PM",
			phone:     "+234 807 551 3322",
			fee:       "CLEARED",
			student:   existingStudents[5],
		},
	}

	for _, rd := range ridersSeed {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_transport_riders (
				id, tenant_id, route_id, route_name, student_id, student_name, admission_number, class_arm_name, pickup_stop, morning_pickup_time, afternoon_dropoff_time, parent_phone, fee_status, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
		`, uuid.New().String(), tenantID, rd.routeID, rd.routeName, rd.student.id, rd.student.name, rd.student.admNo, rd.student.armName, rd.stop, rd.morn, rd.aft, rd.phone, rd.fee)
	}

	// Authoritatively sync assigned student counts on the routes
	_, _ = db.DB.Exec(`
		UPDATE campus_transport_routes r
		SET assigned_students = (
			SELECT COUNT(*) FROM campus_transport_riders
			WHERE route_id = r.id AND tenant_id = r.tenant_id AND status = 'ACTIVE'
		)
		WHERE tenant_id = ?
	`, tenantID)
}

// HandleCampusTransport handles Bus Routes & Fleet operations (GET, POST, PUT, DELETE)
func HandleCampusTransport(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantTransportIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		search := strings.TrimSpace(r.URL.Query().Get("search"))
		gpsStatus := strings.TrimSpace(r.URL.Query().Get("gps_status"))
		status := strings.TrimSpace(r.URL.Query().Get("status"))

		query := `
			SELECT 
				r.id, r.tenant_id, r.route_name, 
				COALESCE(r.bus_number, ''), 
				r.driver_name, COALESCE(r.driver_phone, ''), COALESCE(r.attendant_name, ''), 
				COALESCE(r.capacity, 30),
				COALESCE(r.assigned_students, 0),
				COALESCE(r.stops_summary, ''), 
				COALESCE(r.morning_departure, '06:45 AM'), 
				COALESCE(r.afternoon_return, '03:30 PM'), 
				COALESCE(r.term_fee, 0), 
				COALESCE(r.gps_status, 'ACTIVE'), 
				COALESCE(r.status, 'ACTIVE'), 
				r.created_at, r.updated_at
			FROM campus_transport_routes r
			WHERE r.tenant_id = ?
		`
		args := []interface{}{tenantID}

		if search != "" {
			query += " AND (r.route_name ILIKE ? OR r.bus_number ILIKE ? OR r.driver_name ILIKE ? OR r.stops_summary ILIKE ?)"
			term := "%" + search + "%"
			args = append(args, term, term, term, term)
		}
		if gpsStatus != "" && gpsStatus != "ALL" {
			query += " AND r.gps_status = ?"
			args = append(args, gpsStatus)
		}
		if status != "" && status != "ALL" {
			query += " AND r.status = ?"
			args = append(args, status)
		}
		campusID := strings.TrimSpace(r.URL.Query().Get("campus_id"))
		if campusID != "" && campusID != "all" {
			query += " AND (r.campus_id = ? OR r.campus_id = '' OR r.campus_id IS NULL)"
			args = append(args, campusID)
		}

		query += " ORDER BY r.route_name ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to fetch transport routes: %v", err))
			return
		}
		defer rows.Close()

		routes := []CampusTransportRoute{}
		for rows.Next() {
			var item CampusTransportRoute
			var cAt, uAt time.Time
			var driverPhone, attendantName, stopsSummary, morn, aft, gps, st sql.NullString
			var termFee sql.NullFloat64
			var cap, assigned sql.NullInt64
			if err := rows.Scan(
				&item.ID, &item.TenantID, &item.RouteName,
				&item.BusNumber, &item.DriverName, &driverPhone, &attendantName,
				&cap, &assigned,
				&stopsSummary, &morn, &aft,
				&termFee, &gps, &st,
				&cAt, &uAt,
			); err == nil {
				item.DriverPhone = driverPhone.String
				item.AttendantName = attendantName.String
				item.Capacity = int(cap.Int64)
				if item.Capacity <= 0 {
					item.Capacity = 30
				}
				item.AssignedStudents = int(assigned.Int64)
				item.StopsSummary = stopsSummary.String
				item.MorningDeparture = morn.String
				if item.MorningDeparture == "" {
					item.MorningDeparture = "06:45 AM"
				}
				item.AfternoonReturn = aft.String
				if item.AfternoonReturn == "" {
					item.AfternoonReturn = "03:30 PM"
				}
				item.TermFee = termFee.Float64
				item.GpsStatus = gps.String
				if item.GpsStatus == "" {
					item.GpsStatus = "ACTIVE"
				}
				item.Status = st.String
				if item.Status == "" {
					item.Status = "ACTIVE"
				}
				item.CreatedAt = cAt
				item.UpdatedAt = uAt
				routes = append(routes, item)
			}
		}
		JSONResponse(w, http.StatusOK, routes)

	case http.MethodPost:
		var input struct {
			RouteName        string  `json:"route_name"`
			BusNumber        string  `json:"bus_number"`
			DriverName       string  `json:"driver_name"`
			DriverPhone      string  `json:"driver_phone"`
			AttendantName    string  `json:"attendant_name"`
			Capacity         int     `json:"capacity"`
			StopsSummary     string  `json:"stops_summary"`
			MorningDeparture string  `json:"morning_departure"`
			AfternoonReturn  string  `json:"afternoon_return"`
			TermFee          float64 `json:"term_fee"`
			GpsStatus        string  `json:"gps_status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON body")
			return
		}
		if strings.TrimSpace(input.RouteName) == "" {
			JSONError(w, http.StatusBadRequest, "route_name is required")
			return
		}
		if strings.TrimSpace(input.BusNumber) == "" {
			JSONError(w, http.StatusBadRequest, "bus_number is required")
			return
		}
		if strings.TrimSpace(input.DriverName) == "" {
			JSONError(w, http.StatusBadRequest, "driver_name is required")
			return
		}
		if input.Capacity <= 0 {
			input.Capacity = 30
		}
		if input.MorningDeparture == "" {
			input.MorningDeparture = "06:45 AM"
		}
		if input.AfternoonReturn == "" {
			input.AfternoonReturn = "03:30 PM"
		}
		if input.GpsStatus == "" {
			input.GpsStatus = "ACTIVE"
		}

		id := uuid.New().String()
		_, err := db.DB.Exec(`
			INSERT INTO campus_transport_routes (
				id, tenant_id, route_name, bus_number, driver_name, driver_phone, attendant_name, capacity, assigned_students, stops_summary, morning_departure, afternoon_return, term_fee, gps_status, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 'ACTIVE')
		`, id, tenantID, strings.TrimSpace(input.RouteName), strings.TrimSpace(input.BusNumber), strings.TrimSpace(input.DriverName), strings.TrimSpace(input.DriverPhone), strings.TrimSpace(input.AttendantName), input.Capacity, strings.TrimSpace(input.StopsSummary), input.MorningDeparture, input.AfternoonReturn, input.TermFee, input.GpsStatus)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create transport route: %v", err))
			return
		}
		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"id":      id,
			"message": "Transport route successfully created",
		})

	case http.MethodPut:
		var input struct {
			ID               string  `json:"id"`
			RouteName        string  `json:"route_name"`
			BusNumber        string  `json:"bus_number"`
			DriverName       string  `json:"driver_name"`
			DriverPhone      string  `json:"driver_phone"`
			AttendantName    string  `json:"attendant_name"`
			Capacity         int     `json:"capacity"`
			StopsSummary     string  `json:"stops_summary"`
			MorningDeparture string  `json:"morning_departure"`
			AfternoonReturn  string  `json:"afternoon_return"`
			TermFee          float64 `json:"term_fee"`
			GpsStatus        string  `json:"gps_status"`
			Status           string  `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.ID) == "" {
			JSONError(w, http.StatusBadRequest, "Route ID and fields are required")
			return
		}
		if input.Capacity <= 0 {
			input.Capacity = 30
		}
		if input.Status == "" {
			input.Status = "ACTIVE"
		}

		res, err := db.DB.Exec(`
			UPDATE campus_transport_routes
			SET route_name = ?, bus_number = ?, driver_name = ?, driver_phone = ?, attendant_name = ?, capacity = ?, stops_summary = ?, morning_departure = ?, afternoon_return = ?, term_fee = ?, gps_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, strings.TrimSpace(input.RouteName), strings.TrimSpace(input.BusNumber), strings.TrimSpace(input.DriverName), strings.TrimSpace(input.DriverPhone), strings.TrimSpace(input.AttendantName), input.Capacity, strings.TrimSpace(input.StopsSummary), input.MorningDeparture, input.AfternoonReturn, input.TermFee, input.GpsStatus, input.Status, input.ID, tenantID)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update transport route: %v", err))
			return
		}
		rowsAff, _ := res.RowsAffected()
		if rowsAff == 0 {
			JSONError(w, http.StatusNotFound, "Route not found or unauthorized")
			return
		}

		// Also update route_name in passenger manifest
		if input.RouteName != "" {
			_, _ = db.DB.Exec("UPDATE campus_transport_riders SET route_name = ? WHERE route_id = ? AND tenant_id = ?", strings.TrimSpace(input.RouteName), input.ID, tenantID)
		}

		JSONResponse(w, http.StatusOK, map[string]string{
			"message": "Transport route updated successfully",
		})

	case http.MethodDelete:
		id := strings.TrimSpace(r.URL.Query().Get("id"))
		if id == "" {
			JSONError(w, http.StatusBadRequest, "id query parameter is required")
			return
		}

		// Delete riders on this route
		_, _ = db.DB.Exec("DELETE FROM campus_transport_riders WHERE route_id = ? AND tenant_id = ?", id, tenantID)

		res, err := db.DB.Exec("DELETE FROM campus_transport_routes WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to delete transport route: %v", err))
			return
		}
		rowsAff, _ := res.RowsAffected()
		if rowsAff == 0 {
			JSONError(w, http.StatusNotFound, "Route not found or unauthorized")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]string{
			"message": "Transport route and associated riders deleted successfully",
		})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleCampusTransportRiders manages student passenger enrollments on routes
func HandleCampusTransportRiders(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantTransportIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		routeID := strings.TrimSpace(r.URL.Query().Get("route_id"))
		search := strings.TrimSpace(r.URL.Query().Get("search"))
		feeStatus := strings.TrimSpace(r.URL.Query().Get("fee_status"))
		status := strings.TrimSpace(r.URL.Query().Get("status"))

		query := `
			SELECT 
				id, tenant_id, route_id, route_name, student_id, student_name, 
				COALESCE(admission_number, ''), COALESCE(class_arm_name, ''), 
				pickup_stop, COALESCE(morning_pickup_time, '06:45 AM'), COALESCE(afternoon_dropoff_time, '03:45 PM'), 
				COALESCE(parent_phone, ''), COALESCE(fee_status, 'CLEARED'), COALESCE(status, 'ACTIVE'), 
				created_at, updated_at
			FROM campus_transport_riders
			WHERE tenant_id = ?
		`
		args := []interface{}{tenantID}

		if routeID != "" && routeID != "ALL" {
			query += " AND route_id = ?"
			args = append(args, routeID)
		}
		if search != "" {
			query += " AND (student_name ILIKE ? OR admission_number ILIKE ? OR pickup_stop ILIKE ? OR route_name ILIKE ?)"
			term := "%" + search + "%"
			args = append(args, term, term, term, term)
		}
		if feeStatus != "" && feeStatus != "ALL" {
			query += " AND fee_status = ?"
			args = append(args, feeStatus)
		}
		if status != "" && status != "ALL" {
			query += " AND status = ?"
			args = append(args, status)
		}

		query += " ORDER BY route_name ASC, student_name ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to fetch passenger manifest: %v", err))
			return
		}
		defer rows.Close()

		riders := []CampusTransportRider{}
		for rows.Next() {
			var rd CampusTransportRider
			var cAt, uAt time.Time
			var admNo, classArm, parentPhone, morn, aft, feeSt, st sql.NullString
			if err := rows.Scan(
				&rd.ID, &rd.TenantID, &rd.RouteID, &rd.RouteName, &rd.StudentID, &rd.StudentName,
				&admNo, &classArm,
				&rd.PickupStop, &morn, &aft,
				&parentPhone, &feeSt, &st,
				&cAt, &uAt,
			); err == nil {
				rd.AdmissionNumber = admNo.String
				rd.ClassArmName = classArm.String
				rd.MorningPickupTime = morn.String
				if rd.MorningPickupTime == "" {
					rd.MorningPickupTime = "06:45 AM"
				}
				rd.AfternoonDropoffTime = aft.String
				if rd.AfternoonDropoffTime == "" {
					rd.AfternoonDropoffTime = "03:45 PM"
				}
				rd.ParentPhone = parentPhone.String
				rd.FeeStatus = feeSt.String
				if rd.FeeStatus == "" {
					rd.FeeStatus = "CLEARED"
				}
				rd.Status = st.String
				if rd.Status == "" {
					rd.Status = "ACTIVE"
				}
				rd.CreatedAt = cAt
				rd.UpdatedAt = uAt
				riders = append(riders, rd)
			}
		}
		JSONResponse(w, http.StatusOK, riders)

	case http.MethodPost:
		var input struct {
			RouteID              string `json:"route_id"`
			StudentID            string `json:"student_id"`
			StudentName          string `json:"student_name"`
			AdmissionNumber      string `json:"admission_number"`
			ClassArmName         string `json:"class_arm_name"`
			PickupStop           string `json:"pickup_stop"`
			MorningPickupTime    string `json:"morning_pickup_time"`
			AfternoonDropoffTime string `json:"afternoon_dropoff_time"`
			ParentPhone          string `json:"parent_phone"`
			FeeStatus            string `json:"fee_status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON body")
			return
		}
		if strings.TrimSpace(input.RouteID) == "" {
			JSONError(w, http.StatusBadRequest, "route_id is required")
			return
		}
		if strings.TrimSpace(input.StudentID) == "" && strings.TrimSpace(input.StudentName) == "" {
			JSONError(w, http.StatusBadRequest, "student_id or student_name is required")
			return
		}
		if strings.TrimSpace(input.PickupStop) == "" {
			JSONError(w, http.StatusBadRequest, "pickup_stop is required")
			return
		}

		// Verify route existence and get route name
		var routeName string
		err := db.DB.QueryRow("SELECT route_name FROM campus_transport_routes WHERE id = ? AND tenant_id = ?", input.RouteID, tenantID).Scan(&routeName)
		if err != nil {
			if err == sql.ErrNoRows {
				JSONError(w, http.StatusBadRequest, "Specified bus route does not exist")
				return
			}
			JSONError(w, http.StatusInternalServerError, "Failed to verify bus route")
			return
		}

		// If student details are missing, look them up from campus_class_students
		if input.StudentName == "" || input.AdmissionNumber == "" || input.ClassArmName == "" {
			var stName, admNo, armId string
			err := db.DB.QueryRow(`
				SELECT student_name, admission_number, arm_id 
				FROM campus_class_students 
				WHERE (student_id = ? OR id = ?) AND tenant_id = ? LIMIT 1
			`, input.StudentID, input.StudentID, tenantID).Scan(&stName, &admNo, &armId)
			if err == nil {
				if input.StudentName == "" {
					input.StudentName = stName
				}
				if input.AdmissionNumber == "" {
					input.AdmissionNumber = admNo
				}
				if input.ClassArmName == "" && armId != "" {
					var armName string
					_ = db.DB.QueryRow("SELECT name FROM campus_class_arms WHERE id = ? AND tenant_id = ?", armId, tenantID).Scan(&armName)
					input.ClassArmName = armName
				}
			}
		}

		if input.StudentID == "" {
			input.StudentID = uuid.New().String()
		}
		if input.MorningPickupTime == "" {
			input.MorningPickupTime = "06:45 AM"
		}
		if input.AfternoonDropoffTime == "" {
			input.AfternoonDropoffTime = "03:45 PM"
		}
		if input.FeeStatus == "" {
			input.FeeStatus = "CLEARED"
		}

		// Check if already enrolled in an active route
		var existingRiderID string
		_ = db.DB.QueryRow("SELECT id FROM campus_transport_riders WHERE tenant_id = ? AND student_id = ? AND status = 'ACTIVE' LIMIT 1", tenantID, input.StudentID).Scan(&existingRiderID)
		if existingRiderID != "" {
			// Update the existing rider's route
			_, err = db.DB.Exec(`
				UPDATE campus_transport_riders
				SET route_id = ?, route_name = ?, pickup_stop = ?, morning_pickup_time = ?, afternoon_dropoff_time = ?, parent_phone = ?, fee_status = ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ? AND tenant_id = ?
			`, input.RouteID, routeName, strings.TrimSpace(input.PickupStop), input.MorningPickupTime, input.AfternoonDropoffTime, strings.TrimSpace(input.ParentPhone), input.FeeStatus, existingRiderID, tenantID)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, "Failed to update existing rider route")
				return
			}
		} else {
			riderID := uuid.New().String()
			_, err = db.DB.Exec(`
				INSERT INTO campus_transport_riders (
					id, tenant_id, route_id, route_name, student_id, student_name, admission_number, class_arm_name, pickup_stop, morning_pickup_time, afternoon_dropoff_time, parent_phone, fee_status, status
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
			`, riderID, tenantID, input.RouteID, routeName, input.StudentID, input.StudentName, input.AdmissionNumber, input.ClassArmName, strings.TrimSpace(input.PickupStop), input.MorningPickupTime, input.AfternoonDropoffTime, strings.TrimSpace(input.ParentPhone), input.FeeStatus)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to enroll rider: %v", err))
				return
			}
		}

		// Sync assigned_students count on all routes
		_, _ = db.DB.Exec(`
			UPDATE campus_transport_routes r
			SET assigned_students = (
				SELECT COUNT(*) FROM campus_transport_riders
				WHERE route_id = r.id AND tenant_id = r.tenant_id AND status = 'ACTIVE'
			)
			WHERE tenant_id = ?
		`, tenantID)

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"message": "Student successfully enrolled on bus passenger manifest",
		})

	case http.MethodPut:
		var input struct {
			ID                   string `json:"id"`
			RouteID              string `json:"route_id"`
			PickupStop           string `json:"pickup_stop"`
			MorningPickupTime    string `json:"morning_pickup_time"`
			AfternoonDropoffTime string `json:"afternoon_dropoff_time"`
			ParentPhone          string `json:"parent_phone"`
			FeeStatus            string `json:"fee_status"`
			Status               string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.ID) == "" {
			JSONError(w, http.StatusBadRequest, "Rider ID and fields are required")
			return
		}
		if input.Status == "" {
			input.Status = "ACTIVE"
		}

		var routeName string
		if input.RouteID != "" {
			_ = db.DB.QueryRow("SELECT route_name FROM campus_transport_routes WHERE id = ? AND tenant_id = ?", input.RouteID, tenantID).Scan(&routeName)
		}

		var res sql.Result
		var err error
		if routeName != "" {
			res, err = db.DB.Exec(`
				UPDATE campus_transport_riders
				SET route_id = ?, route_name = ?, pickup_stop = ?, morning_pickup_time = ?, afternoon_dropoff_time = ?, parent_phone = ?, fee_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ? AND tenant_id = ?
			`, input.RouteID, routeName, strings.TrimSpace(input.PickupStop), input.MorningPickupTime, input.AfternoonDropoffTime, strings.TrimSpace(input.ParentPhone), input.FeeStatus, input.Status, input.ID, tenantID)
		} else {
			res, err = db.DB.Exec(`
				UPDATE campus_transport_riders
				SET pickup_stop = ?, morning_pickup_time = ?, afternoon_dropoff_time = ?, parent_phone = ?, fee_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ? AND tenant_id = ?
			`, strings.TrimSpace(input.PickupStop), input.MorningPickupTime, input.AfternoonDropoffTime, strings.TrimSpace(input.ParentPhone), input.FeeStatus, input.Status, input.ID, tenantID)
		}

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update rider: %v", err))
			return
		}
		rowsAff, _ := res.RowsAffected()
		if rowsAff == 0 {
			JSONError(w, http.StatusNotFound, "Rider not found or unauthorized")
			return
		}

		// Re-sync assigned students
		_, _ = db.DB.Exec(`
			UPDATE campus_transport_routes r
			SET assigned_students = (
				SELECT COUNT(*) FROM campus_transport_riders
				WHERE route_id = r.id AND tenant_id = r.tenant_id AND status = 'ACTIVE'
			)
			WHERE tenant_id = ?
		`, tenantID)

		JSONResponse(w, http.StatusOK, map[string]string{
			"message": "Passenger manifest entry updated successfully",
		})

	case http.MethodDelete:
		id := strings.TrimSpace(r.URL.Query().Get("id"))
		if id == "" {
			JSONError(w, http.StatusBadRequest, "id query parameter is required")
			return
		}

		res, err := db.DB.Exec("DELETE FROM campus_transport_riders WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to remove rider: %v", err))
			return
		}
		rowsAff, _ := res.RowsAffected()
		if rowsAff == 0 {
			JSONError(w, http.StatusNotFound, "Rider not found or unauthorized")
			return
		}

		// Sync assigned students
		_, _ = db.DB.Exec(`
			UPDATE campus_transport_routes r
			SET assigned_students = (
				SELECT COUNT(*) FROM campus_transport_riders
				WHERE route_id = r.id AND tenant_id = r.tenant_id AND status = 'ACTIVE'
			)
			WHERE tenant_id = ?
		`, tenantID)

		JSONResponse(w, http.StatusOK, map[string]string{
			"message": "Student passenger removed from route manifest",
		})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

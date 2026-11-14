package db

import (
	"log"
)

// InitCampusSchema creates all campus operations tables if they do not exist
func InitCampusSchema() {
	tables := []string{
		`CREATE TABLE IF NOT EXISTS campus_timetable_slots (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			class_name VARCHAR(64) NOT NULL,
			day_of_week VARCHAR(16) NOT NULL,
			period_index INT NOT NULL,
			start_time VARCHAR(16) NOT NULL,
			end_time VARCHAR(16) NOT NULL,
			subject VARCHAR(128) NOT NULL,
			teacher_name VARCHAR(128) NOT NULL,
			room VARCHAR(64) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_admissions_inquiries (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			applicant_name VARCHAR(128) NOT NULL,
			guardian_name VARCHAR(128) NOT NULL,
			email VARCHAR(128) NOT NULL,
			phone VARCHAR(32) NOT NULL,
			target_grade VARCHAR(64) NOT NULL,
			previous_school VARCHAR(128),
			stage VARCHAR(32) NOT NULL DEFAULT 'Inquiry',
			tour_date VARCHAR(32),
			notes TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_fee_structures (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			class_level VARCHAR(64) NOT NULL,
			term VARCHAR(32) NOT NULL,
			tuition_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
			development_levy NUMERIC(12,2) NOT NULL DEFAULT 0,
			ict_stem_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
			exam_materials_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
			total_due NUMERIC(12,2) NOT NULL DEFAULT 0,
			due_date VARCHAR(32),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_student_invoices (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			student_id VARCHAR(64) NOT NULL,
			student_name VARCHAR(128) NOT NULL,
			class_name VARCHAR(64) NOT NULL,
			term VARCHAR(32) NOT NULL,
			session VARCHAR(32) NOT NULL,
			total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
			amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
			balance NUMERIC(12,2) NOT NULL DEFAULT 0,
			status VARCHAR(32) NOT NULL DEFAULT 'UNPAID',
			payment_reference VARCHAR(128),
			paid_at TIMESTAMP WITH TIME ZONE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_library_books (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			title VARCHAR(255) NOT NULL,
			author VARCHAR(128) NOT NULL,
			isbn VARCHAR(64),
			category VARCHAR(64) NOT NULL,
			total_copies INT NOT NULL DEFAULT 1,
			available_copies INT NOT NULL DEFAULT 1,
			shelf_location VARCHAR(64),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_library_loans (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			book_id VARCHAR(64) NOT NULL,
			borrower_id VARCHAR(64) NOT NULL,
			borrower_name VARCHAR(128) NOT NULL,
			borrower_type VARCHAR(32) NOT NULL DEFAULT 'STUDENT',
			borrowed_date VARCHAR(32) NOT NULL,
			due_date VARCHAR(32) NOT NULL,
			return_date VARCHAR(32),
			status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_inventory_items (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			item_name VARCHAR(128) NOT NULL,
			category VARCHAR(64) NOT NULL,
			current_stock INT NOT NULL DEFAULT 0,
			reorder_threshold INT NOT NULL DEFAULT 5,
			unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
			location VARCHAR(64),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_procurement_requests (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			requested_by VARCHAR(128) NOT NULL,
			department VARCHAR(64) NOT NULL,
			title VARCHAR(128) NOT NULL,
			estimated_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
			status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
			approval_notes TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_transport_routes (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			route_name VARCHAR(128) NOT NULL,
			vehicle_plate VARCHAR(32) NOT NULL,
			driver_name VARCHAR(128) NOT NULL,
			driver_phone VARCHAR(32) NOT NULL,
			capacity INT NOT NULL DEFAULT 30,
			enrolled_students INT NOT NULL DEFAULT 0,
			corridor_areas TEXT,
			status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_hostel_allocations (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			hostel_name VARCHAR(128) NOT NULL,
			gender VARCHAR(16) NOT NULL,
			room_number VARCHAR(32) NOT NULL,
			bed_number VARCHAR(32) NOT NULL,
			student_id VARCHAR(64),
			student_name VARCHAR(128),
			class_name VARCHAR(64),
			guardian_phone VARCHAR(32),
			session VARCHAR(32) NOT NULL,
			term VARCHAR(32) NOT NULL,
			status VARCHAR(32) NOT NULL DEFAULT 'OCCUPIED',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_notices_and_events (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			title VARCHAR(255) NOT NULL,
			category VARCHAR(64) NOT NULL,
			body TEXT NOT NULL,
			event_date VARCHAR(32),
			target_audience VARCHAR(64) NOT NULL DEFAULT 'ALL',
			is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_messages (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			sender_name VARCHAR(128) NOT NULL,
			sender_role VARCHAR(64) NOT NULL,
			recipient_group VARCHAR(64) NOT NULL,
			subject VARCHAR(255) NOT NULL,
			message TEXT NOT NULL,
			channel VARCHAR(32) NOT NULL DEFAULT 'PORTAL',
			sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_mobile_app_accounts (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			user_id VARCHAR(64) NOT NULL,
			full_name VARCHAR(128) NOT NULL,
			role VARCHAR(32) NOT NULL,
			device_type VARCHAR(32),
			push_token VARCHAR(255),
			last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS campus_homework_and_assessments (
			id VARCHAR(64) PRIMARY KEY,
			tenant_id VARCHAR(64) NOT NULL,
			title VARCHAR(255) NOT NULL,
			class_name VARCHAR(64) NOT NULL,
			subject VARCHAR(128) NOT NULL,
			due_date VARCHAR(32) NOT NULL,
			instructions TEXT NOT NULL,
			max_score NUMERIC(5,2) NOT NULL DEFAULT 10,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, stmt := range tables {
		if _, err := DB.Exec(stmt); err != nil {
			log.Printf("⚠️ [service_campuspro] Table creation warning: %v", err)
		}
	}
	log.Println("⚡ [service_campuspro] Schema initialized successfully")
}

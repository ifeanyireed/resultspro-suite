package db

import (
	"context"
	"log"
	"time"
)

// InitPuzzleSchema initializes PostgreSQL tables for PuzzlePro Identity, Organisations & Subscriptions
func InitPuzzleSchema() {
	if DB == nil || DB.DB == nil {
		log.Println("⚠️ [PuzzlePro] DB connection not initialized yet.")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	queries := []string{
		`CREATE TABLE IF NOT EXISTS puzzle_organisations (
			id VARCHAR(100) PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			domain VARCHAR(255) DEFAULT '',
			contact_email VARCHAR(255) DEFAULT '',
			contact_phone VARCHAR(100) DEFAULT '',
			password VARCHAR(255) DEFAULT 'school123',
			logo_url VARCHAR(500) DEFAULT '/monkey1.svg',
			token VARCHAR(255) UNIQUE NOT NULL,
			google_ads_enabled BOOLEAN DEFAULT TRUE,
			type VARCHAR(50) DEFAULT 'school',
			email_verified BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`,

		`CREATE TABLE IF NOT EXISTS puzzle_centres (
			id SERIAL PRIMARY KEY,
			organisation_id VARCHAR(100) REFERENCES puzzle_organisations(id) ON DELETE CASCADE,
			name VARCHAR(255) NOT NULL,
			location VARCHAR(255) DEFAULT '',
			code VARCHAR(100) DEFAULT '',
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`,

		`CREATE TABLE IF NOT EXISTS puzzle_groups (
			id SERIAL PRIMARY KEY,
			organisation_id VARCHAR(100) REFERENCES puzzle_organisations(id) ON DELETE CASCADE,
			centre_id INT REFERENCES puzzle_centres(id) ON DELETE SET NULL,
			name VARCHAR(255) NOT NULL,
			code VARCHAR(100) UNIQUE NOT NULL,
			assigned_world_id INT DEFAULT 1,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`,

		`CREATE TABLE IF NOT EXISTS puzzle_users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(100) UNIQUE NOT NULL,
			access_code VARCHAR(50) UNIQUE DEFAULT NULL,
			role VARCHAR(50) DEFAULT 'student',
			organisation_id VARCHAR(100) REFERENCES puzzle_organisations(id) ON DELETE SET NULL,
			group_id INT REFERENCES puzzle_groups(id) ON DELETE SET NULL,
			avatar VARCHAR(255) DEFAULT 'https://cdn.resultspro.ng/assets/character1.jpg',
			assigned_world_id INT DEFAULT 1,
			total_xp INT DEFAULT 0,
			total_stars INT DEFAULT 0,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`,

		`CREATE TABLE IF NOT EXISTS puzzle_subscriptions (
			id VARCHAR(100) PRIMARY KEY,
			organisation_id VARCHAR(100) REFERENCES puzzle_organisations(id) ON DELETE CASCADE,
			organisation_name VARCHAR(255) NOT NULL,
			user_email VARCHAR(255) NOT NULL,
			plan_name VARCHAR(100) DEFAULT 'School Enterprise',
			status VARCHAR(50) DEFAULT 'active',
			seats INT DEFAULT 100,
			price VARCHAR(50) DEFAULT '$299/mo',
			renewal_date VARCHAR(50) DEFAULT '2027-01-01',
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`,

		`CREATE TABLE IF NOT EXISTS puzzle_verification_codes (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) NOT NULL,
			code VARCHAR(10) NOT NULL,
			type VARCHAR(50) NOT NULL DEFAULT 'email_verification',
			expires_at TIMESTAMPTZ NOT NULL,
			used BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE INDEX IF NOT EXISTS idx_puzzle_verif_email_code ON puzzle_verification_codes (email, code, type);`,
	}

	for _, q := range queries {
		if _, err := DB.ExecContext(ctx, q); err != nil {
			log.Printf("⚠️ [PuzzlePro PostgreSQL Schema] Note on query: %v", err)
		}
	}

	seedPuzzleData(ctx)
	log.Println("✅ [service_users] PuzzlePro PostgreSQL tables and seeds verified.")
}

func seedPuzzleData(ctx context.Context) {
	_, _ = DB.ExecContext(ctx, `
		INSERT INTO puzzle_organisations (id, name, domain, contact_email, contact_phone, token, google_ads_enabled, type)
		VALUES ('org_001', 'STEM Explorers Academy', 'stemexplorers.edu', 'admin@stemexplorers.edu', '+1 (555) 234-5678', 'TOKEN_STEM_9932A', false, 'school')
		ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
	`)

	_, _ = DB.ExecContext(ctx, `
		INSERT INTO puzzle_organisations (id, name, domain, contact_email, contact_phone, token, google_ads_enabled, type)
		VALUES ('org_skil_9901', 'SkillUp Learning Academy', 'skilluplearningacademy.com', 'contact@skilluplearningacademy.com', '+1 (555) 019-2831', 'TOKEN_SKIL_9901', true, 'school')
		ON CONFLICT (id) DO UPDATE SET domain = EXCLUDED.domain, token = EXCLUDED.token;
	`)

	_, _ = DB.ExecContext(ctx, "INSERT INTO puzzle_centres (id, organisation_id, name, location, code) VALUES (1, 'org_001', 'Main Campus', 'Central Education Hub', '784912') ON CONFLICT (id) DO NOTHING;")
	_, _ = DB.ExecContext(ctx, "INSERT INTO puzzle_groups (id, organisation_id, centre_id, name, code) VALUES (1, 'org_001', 1, 'Grade 5 Coding Class', '784912') ON CONFLICT (id) DO NOTHING;")
	_, _ = DB.ExecContext(ctx, "INSERT INTO puzzle_groups (id, organisation_id, centre_id, name, code) VALUES (2, 'org_001', 1, 'Senior Coders Club', '592810') ON CONFLICT (id) DO NOTHING;")
	_, _ = DB.ExecContext(ctx, "INSERT INTO puzzle_groups (id, organisation_id, centre_id, name, code) VALUES (3, 'org_001', 1, 'STEM Lab 1', '310492') ON CONFLICT (id) DO NOTHING;")

	seedUsers := []struct {
		Username       string
		AccessCode     string
		Role           string
		OrganisationID string
		Avatar         string
		WorldID        int
		XP             int
	}{
		{"Admin_Explorer", "ADMN-2026", "admin", "org_001", "/images/character1.jpg", 1, 0},
		{"Alex Johnson", "83920193", "student", "org_001", "/images/character1.jpg", 1, 450},
		{"Sarah Williams", "47201948", "student", "org_001", "/images/character2.jpg", 2, 820},
		{"David Chen", "91823746", "student", "org_001", "/images/character3.jpg", 3, 1200},
	}

	for _, u := range seedUsers {
		_, _ = DB.ExecContext(ctx, `
			INSERT INTO puzzle_users (username, access_code, role, organisation_id, group_id, avatar, assigned_world_id, total_xp, total_stars)
			VALUES ($1, $2, $3, $4, 1, $5, $6, $7, 0)
			ON CONFLICT (username) DO UPDATE SET access_code = EXCLUDED.access_code, role = EXCLUDED.role, organisation_id = EXCLUDED.organisation_id, assigned_world_id = EXCLUDED.assigned_world_id;
		`, u.Username, u.AccessCode, u.Role, u.OrganisationID, u.Avatar, u.WorldID, u.XP)
	}
}

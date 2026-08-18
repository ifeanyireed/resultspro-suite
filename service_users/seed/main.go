package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load(".env", "../.env")
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is required to seed database")
	}

	db, err := sql.Open("mysql", dbURL)
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}
	defer db.Close()

	fmt.Println("Seeding unified service_users database...")

	// 1. Demo Users (Password: Password123! hashed with bcrypt)
	// bcrypt hash for Password123!: $2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i
	users := []struct {
		ID       string
		Email    string
		Pass     string
		Provider string
		Name     string
		Phone    string
		Sex      string
		Status   string
	}{
		{"bfb51c68-ccb0-401f-b58f-27fd41c6a856", "superadmin@resultspro.ng", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "local", "Super Admin", "+2348011111111", "male", "active"},
		{"8d3a7776-5d21-4f1e-9a6d-e4c1d63e9f01", "platform-admin@resultspro.ng", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "local", "Platform Admin", "+2348022222222", "female", "active"},
		{"8d3a7776-5d21-4f1e-9a6d-e4c1d63e9f02", "school-admin@example.edu", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "local", "School Admin", "+2348033333333", "male", "active"},
		{"8d3a7776-5d21-4f1e-9a6d-e4c1d63e9f03", "support-staff@resultspro.ng", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "local", "Support Staff", "+2348044444444", "female", "active"},
		{"2db093ed-bdc9-47c4-b71c-66869f0f1ea7", "teacher@example.edu", "$2a$14$Jg0JSBXO09zmMOssPyzEj.VyO/iuXai.QCZQFicC4CTR.plVD9dMS", "local", "Mr. Adeniyi", "+2348055555555", "male", "active"},
		{"111efa7d-e12d-4ed1-9902-d341c6826b50", "student@example.com", "$2a$14$OiOxIN4UiEuFHKIhwdmFHuNbtI2FoVpU95KVD8Dc3FxLhHM2.EMve", "local", "Jane Doe", "+2348066666666", "female", "active"},
		{"dac38ffd-866f-47ab-8ac4-ecf6ea520ba8", "parent@example.com", "$2a$14$4nofWUGNaOyx9/2zF23ySuu5ehgcPa1kApyvp5dLAHszuA.NoLOWS", "local", "Mrs. Doe", "+2348077777777", "female", "active"},
		{"999efa7d-e12d-4ed1-9902-d341c6826b99", "agent@resultspro.ng", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "local", "Agent Chinedu", "+2348088888888", "male", "active"},
	}

	for _, u := range users {
		seed(db, `INSERT IGNORE INTO users (id, email, password_hash, auth_provider, full_name, phone, sex, account_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			u.ID, u.Email, u.Pass, u.Provider, u.Name, u.Phone, u.Sex, u.Status)
	}

	// 2. Apps Registry (Sub-apps)
	apps := []struct {
		ID     string
		Name   string
		Secret string
	}{
		{"classroompro-app-id", "ClassroomPRO", "your-app-secret-key-123"},
		{"resultspro-app-id", "ResultPRO", "resultspro_secret_456"},
		{"examspro-app-id", "examsPRO", "examspro_secret_789"},
		{"tutorspro-app-id", "TutorsPRO", "tutorspro_secret_101"},
		{"schoolhub-app-id", "SchoolHub", "schoolhub_secret_202"},
		{"acad_service_001", "AcadService", "your_secret_here"},
	}

	for _, a := range apps {
		seed(db, "INSERT IGNORE INTO apps (id, name, secret_key) VALUES (?, ?, ?)", a.ID, a.Name, a.Secret)
	}

	// 3. Curriculums
	seed(db, "INSERT IGNORE INTO curriculums (id, name, country) VALUES (?, ?, ?)", "cur-1", "Nigerian National Curriculum (NERDC)", "Nigeria")
	seed(db, "INSERT IGNORE INTO curriculums (id, name, country) VALUES (?, ?, ?)", "cur-2", "British National Curriculum (Cambridge)", "United Kingdom")

	// 4. Sample School: Greenwood High
	seed(db, `INSERT IGNORE INTO schools (id, name, slug, school_code, short_name, motto, logo_url, primary_color, secondary_color, accent_color, contact_email, full_address, status, verification_status, referred_by_agent_id, subscription_tier, settings) 
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 'VERIFIED', ?, 'PRO', ?)`,
		"school-1", "Greenwood High", "greenwood-high", "GHS001", "GHS", "Excellence and Integrity",
		"https://auth.resultspro.ng/logos/greenwood.png", "#2563eb", "#1e293b", "#f59e0b",
		"info@greenwoodhigh.edu.ng", "123 Academic Way, Owerri, Imo State",
		"999efa7d-e12d-4ed1-9902-d341c6826b99",
		`{"theme": "modern", "hero_title": "Welcome to Greenwood High", "hero_subtitle": "Fostering academic excellence and character building."}`)

	// 5. User School Roles
	seed(db, "INSERT IGNORE INTO user_school_roles (id, user_id, school_id, role, status) VALUES (?, ?, ?, ?, ?)", "role-1", "bfb51c68-ccb0-401f-b58f-27fd41c6a856", "school-1", "super-admin", "active")
	seed(db, "INSERT IGNORE INTO user_school_roles (id, user_id, school_id, role, status) VALUES (?, ?, ?, ?, ?)", "role-2", "8d3a7776-5d21-4f1e-9a6d-e4c1d63e9f02", "school-1", "school-admin", "active")
	seed(db, "INSERT IGNORE INTO user_school_roles (id, user_id, school_id, role, status) VALUES (?, ?, ?, ?, ?)", "role-3", "2db093ed-bdc9-47c4-b71c-66869f0f1ea7", "school-1", "teacher", "active")
	seed(db, "INSERT IGNORE INTO user_school_roles (id, user_id, school_id, role, status) VALUES (?, ?, ?, ?, ?)", "role-4", "111efa7d-e12d-4ed1-9902-d341c6826b50", "school-1", "student", "active")
	seed(db, "INSERT IGNORE INTO user_school_roles (id, user_id, school_id, role, status) VALUES (?, ?, ?, ?, ?)", "role-5", "dac38ffd-866f-47ab-8ac4-ecf6ea520ba8", "school-1", "parent", "active")

	// 6. Academic Sessions & Terms
	seed(db, "INSERT IGNORE INTO academic_sessions (id, school_id, name, is_current) VALUES (?, ?, ?, ?)", "session-1", "school-1", "2025/2026", 1)
	seed(db, "INSERT IGNORE INTO terms (id, session_id, name, is_current) VALUES (?, ?, ?, ?)", "term-1", "session-1", "First Term", 1)
	seed(db, "INSERT IGNORE INTO terms (id, session_id, name, is_current) VALUES (?, ?, ?, ?)", "term-2", "session-1", "Second Term", 0)
	seed(db, "INSERT IGNORE INTO terms (id, session_id, name, is_current) VALUES (?, ?, ?, ?)", "term-3", "session-1", "Third Term", 0)

	// 7. Classes & Sections
	seed(db, "INSERT IGNORE INTO classes (id, school_id, curriculum_id, name, level) VALUES (?, ?, ?, ?, ?)", "class-1", "school-1", "cur-1", "Grade 10 (SS1)", 10)
	seed(db, "INSERT IGNORE INTO classes (id, school_id, curriculum_id, name, level) VALUES (?, ?, ?, ?, ?)", "class-2", "school-1", "cur-1", "Grade 11 (SS2)", 11)
	seed(db, "INSERT IGNORE INTO sections (id, class_id, name, room_number) VALUES (?, ?, ?, ?)", "section-1", "class-1", "10A (Science)", "Room 101")
	seed(db, "INSERT IGNORE INTO sections (id, class_id, name, room_number) VALUES (?, ?, ?, ?)", "section-2", "class-1", "10B (Arts)", "Room 102")

	// 8. Subjects
	seed(db, "INSERT IGNORE INTO subjects (id, school_id, name, code) VALUES (?, ?, ?, ?)", "subject-1", "school-1", "Mathematics", "MTH101")
	seed(db, "INSERT IGNORE INTO subjects (id, school_id, name, code) VALUES (?, ?, ?, ?)", "subject-2", "school-1", "English Language", "ENG101")
	seed(db, "INSERT IGNORE INTO subjects (id, school_id, name, code) VALUES (?, ?, ?, ?)", "subject-3", "school-1", "Physics", "PHY101")
	seed(db, "INSERT IGNORE INTO subjects (id, school_id, name, code) VALUES (?, ?, ?, ?)", "subject-4", "school-1", "Chemistry", "CHM101")

	// 9. Syllabus Weeks & Topics
	seed(db, "INSERT IGNORE INTO syllabus_weeks (id, subject_id, week_number, term) VALUES (?, ?, ?, ?)", "week-1", "subject-1", 1, 1)
	seed(db, "INSERT IGNORE INTO syllabus_weeks (id, subject_id, week_number, term) VALUES (?, ?, ?, ?)", "week-2", "subject-1", 2, 1)
	seed(db, "INSERT IGNORE INTO topics (id, syllabus_week_id, name, description, `order`) VALUES (?, ?, ?, ?, ?)", "topic-1", "week-1", "Quadratic Equations", "Solving quadratics by factorisation and formula", 1)
	seed(db, "INSERT IGNORE INTO topics (id, syllabus_week_id, name, description, `order`) VALUES (?, ?, ?, ?, ?)", "topic-2", "week-2", "Simultaneous Equations", "Linear and non-linear simultaneous equations", 1)

	// 10. Enrollments & Assignments
	seed(db, "INSERT IGNORE INTO enrollments (id, student_id, section_id, session_id, status) VALUES (?, ?, ?, ?, ?)",
		"enroll-1", "111efa7d-e12d-4ed1-9902-d341c6826b50", "section-1", "session-1", "active")

	seed(db, "INSERT IGNORE INTO assignments (id, section_id, subject_id, teacher_id, term_id) VALUES (?, ?, ?, ?, ?)",
		"assign-1", "section-1", "subject-1", "2db093ed-bdc9-47c4-b71c-66869f0f1ea7", "term-1")

	// 11. Family Relationships
	seed(db, "INSERT IGNORE INTO family_relationships (id, parent_user_id, child_user_id, relationship_type, is_emergency_contact) VALUES (?, ?, ?, ?, ?)",
		"rel-1", "dac38ffd-866f-47ab-8ac4-ecf6ea520ba8", "111efa7d-e12d-4ed1-9902-d341c6826b50", "mother", 1)

	// 12. Agent Commissions & Earnings
	seed(db, "INSERT IGNORE INTO agent_commissions (agent_id, default_rate, bank_name, account_number, account_name) VALUES (?, ?, ?, ?, ?)",
		"999efa7d-e12d-4ed1-9902-d341c6826b99", 15.0, "Zenith Bank", "1029384756", "Chinedu Okafor")
	seed(db, "INSERT IGNORE INTO agent_earnings (id, agent_id, school_id, amount, source_type, status) VALUES (?, ?, ?, ?, ?, ?)",
		"earn-1", "999efa7d-e12d-4ed1-9902-d341c6826b99", "school-1", 75000.0, "SUBSCRIPTION", "EARNED")

	// 13. Exam Bodies & National Exams
	seed(db, "INSERT IGNORE INTO exam_bodies (id, name) VALUES (?, ?)", "body-1", "West African Examinations Council (WAEC)")
	seed(db, "INSERT IGNORE INTO exam_bodies (id, name) VALUES (?, ?)", "body-2", "Joint Admissions and Matriculation Board (JAMB)")
	seed(db, "INSERT IGNORE INTO national_exams (id, exam_body_id, name) VALUES (?, ?, ?)", "exam-1", "body-1", "WASSCE May/June")
	seed(db, "INSERT IGNORE INTO national_exams (id, exam_body_id, name) VALUES (?, ?, ?)", "exam-2", "body-2", "UTME CBT Exam")

	fmt.Println("✅ service_users database seeding completed successfully!")
}

func seed(db *sql.DB, query string, args ...interface{}) {
	_, err := db.Exec(query, args...)
	if err != nil {
		log.Printf("Seeding warning for query [%s]: %v", query, err)
	}
}

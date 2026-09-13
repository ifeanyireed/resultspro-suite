package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load("../.env")
	godotenv.Load("../../.env")
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is required to seed database")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}
	defer db.Close()

	fmt.Println("Seeding tutors...")

	users := []struct {
		ID       string
		Email    string
		Pass     string
		Name     string
		Avatar   string
	}{
		{uuid.New().String(), "tutor1@example.com", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "Dr. Sarah Johnson", "https://i.pravatar.cc/150?u=sarah"},
		{uuid.New().String(), "tutor2@example.com", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "Prof. Michael Adebayo", "https://i.pravatar.cc/150?u=michael"},
		{uuid.New().String(), "tutor3@example.com", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "Engr. Fatima Bello", "https://i.pravatar.cc/150?u=fatima"},
		{uuid.New().String(), "tutor4@example.com", "$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i", "Mr. John Smith", "https://i.pravatar.cc/150?u=john"},
	}

	for _, u := range users {
		_, err := db.Exec(`
			INSERT INTO users (id, email, password_hash, auth_provider, name, full_name, account_status, avatar_url, role, created_at, updated_at)
			VALUES ($1, $2, $3, 'local', $4, $4, 'active', $5, 'TUTOR', $6, $7)
			ON CONFLICT (email) DO NOTHING
		`, u.ID, u.Email, u.Pass, u.Name, u.Avatar, time.Now(), time.Now())
		if err != nil {
			log.Printf("Failed to insert user %s: %v", u.Email, err)
		}
	}

	var tutor1ID, tutor2ID, tutor3ID, tutor4ID string
	db.QueryRow("SELECT id FROM users WHERE email = 'tutor1@example.com'").Scan(&tutor1ID)
	db.QueryRow("SELECT id FROM users WHERE email = 'tutor2@example.com'").Scan(&tutor2ID)
	db.QueryRow("SELECT id FROM users WHERE email = 'tutor3@example.com'").Scan(&tutor3ID)
	db.QueryRow("SELECT id FROM users WHERE email = 'tutor4@example.com'").Scan(&tutor4ID)

	tutors := []struct {
		UserID     string
		Headline   string
		Bio        string
		Subjects   string
		HourlyRate float64
		Rating     float64
		Reviews    int
	}{
		{tutor1ID, "PhD in Mathematics", "Passionate about making math easy and fun for everyone. 10+ years of experience.", `["Mathematics", "Further Math", "Physics"]`, 15000, 4.9, 124},
		{tutor2ID, "Senior Science Educator", "Expert in Chemistry and Biology. Helping students ace WAEC and JAMB since 2010.", `["Chemistry", "Biology"]`, 12000, 4.8, 89},
		{tutor3ID, "Software Engineer & Coding Instructor", "I teach Python, JavaScript, and Computer Science fundamentals for beginners and advanced students.", `["Computer Science", "Coding", "Physics"]`, 20000, 5.0, 210},
		{tutor4ID, "English & Literature Expert", "Improve your essay writing, reading comprehension, and grammar with personalized lessons.", `["English Language", "Literature in English"]`, 10000, 4.7, 56},
	}

	for _, t := range tutors {
		if t.UserID == "" {
			continue
		}
		_, err := db.Exec(`
			INSERT INTO tut_profiles (id, user_id, headline, bio, subjects, hourly_rate, currency, rating, total_reviews, is_verified, is_available, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, 'NGN', $7, $8, true, true, $9, $10)
			ON CONFLICT (user_id) DO NOTHING
		`, uuid.New().String(), t.UserID, t.Headline, t.Bio, t.Subjects, t.HourlyRate, t.Rating, t.Reviews, time.Now(), time.Now())
		if err != nil {
			log.Printf("Failed to insert tutor profile for user %s: %v", t.UserID, err)
		}
	}

	fmt.Println("Successfully seeded tutors!")
}

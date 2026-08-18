package main

import (
	"log"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found, using defaults")
	}

	database.ConnectDB()

	seedUsers()
	seedExams()

	log.Println("Seeding completed successfully!")
}

func seedUsers() {
	password, _ := bcrypt.GenerateFromPassword([]byte("password123"), 10)
	hashedPassword := string(password)

	users := []models.User{
		{
			ID:           uuid.New().String(),
			Email:        "admin@resultspro.ng",
			Name:         stringPtr("Admin User"),
			Password:     hashedPassword,
			Role:         models.RoleAdmin,
			IsAdmin:      true,
			ReferralCode: "ADMIN001",
			CoinBalance:  1000,
		},
		{
			ID:           uuid.New().String(),
			Email:        "moderator@resultspro.ng",
			Name:         stringPtr("Moderator User"),
			Password:     hashedPassword,
			Role:         models.RoleModerator,
			ReferralCode: "MOD001",
			CoinBalance:  500,
		},
		{
			ID:           uuid.New().String(),
			Email:        "student@resultspro.ng",
			Name:         stringPtr("Test Student"),
			Password:     hashedPassword,
			Role:         models.RoleStudent,
			ReferralCode: "STUDENT001",
			CoinBalance:  100,
		},
	}

	for _, u := range users {
		var existing models.User
		if err := database.DB.Where("email = ?", u.Email).First(&existing).Error; err != nil {
			database.DB.Create(&u)
			log.Printf("Created user: %s\n", u.Email)
		}
	}
}

func seedExams() {
	exams := []models.Exam{
		{
			Name:      "JAMB/UTME",
			Slug:      "jamb-utme",
			Category:  "Nigerian Exams",
			IsPopular: true,
			IsActive:  true,
		},
		{
			Name:      "WAEC",
			Slug:      "waec",
			Category:  "Nigerian Exams",
			IsActive:  true,
		},
		{
			Name:      "SAT",
			Slug:      "sat",
			Category:  "International Exams",
			IsActive:  true,
		},
	}

	for _, e := range exams {
		var existing models.Exam
		if err := database.DB.Where("slug = ?", e.Slug).First(&existing).Error; err != nil {
			database.DB.Create(&e)
			log.Printf("Created exam: %s\n", e.Name)

			// Seed a Subject for each
			if e.Slug == "jamb-utme" {
				seedJambData(e.ID)
			} else if e.Slug == "waec" {
				seedWaecData(e.ID)
			}
		}
	}
}

func seedJambData(examID int) {
	subject := models.Subject{
		ExamID: examID,
		Name:   "Physics",
		Slug:   "physics",
		Color:  "blue",
	}
	database.DB.Create(&subject)

	topic := models.Topic{
		SubjectID:  subject.ID,
		Name:       "Optics",
		OrderIndex: 1,
	}
	database.DB.Create(&topic)

	q := models.Question{
		ID:         uuid.New().String(),
		TopicID:    topic.ID,
		Type:       "mcq",
		BodyText:   "Which of the following is a primary color of light?",
		Difficulty: "easy",
		Status:     "published",
		CoinReward: 5,
	}
	database.DB.Create(&q)

	options := []models.QuestionOption{
		{ID: uuid.New().String(), QuestionID: q.ID, OptionText: "Red", IsCorrect: true, OrderIndex: 0},
		{ID: uuid.New().String(), QuestionID: q.ID, OptionText: "Yellow", IsCorrect: false, OrderIndex: 1},
		{ID: uuid.New().String(), QuestionID: q.ID, OptionText: "Magenta", IsCorrect: false, OrderIndex: 2},
		{ID: uuid.New().String(), QuestionID: q.ID, OptionText: "Cyan", IsCorrect: false, OrderIndex: 3},
	}
	for _, opt := range options {
		database.DB.Create(&opt)
	}
}

func seedWaecData(examID int) {
	subject := models.Subject{
		ExamID: examID,
		Name:   "Mathematics",
		Slug:   "mathematics",
		Color:  "green",
	}
	database.DB.Create(&subject)

	topic := models.Topic{
		SubjectID:  subject.ID,
		Name:       "Algebra",
		OrderIndex: 1,
	}
	database.DB.Create(&topic)

	q := models.Question{
		ID:         uuid.New().String(),
		TopicID:    topic.ID,
		Type:       "mcq",
		BodyText:   "Solve for x: 2x + 5 = 15",
		Difficulty: "easy",
		Status:     "published",
		CoinReward: 5,
	}
	database.DB.Create(&q)

	options := []models.QuestionOption{
		{ID: uuid.New().String(), QuestionID: q.ID, OptionText: "5", IsCorrect: true, OrderIndex: 0},
		{ID: uuid.New().String(), QuestionID: q.ID, OptionText: "10", IsCorrect: false, OrderIndex: 1},
		{ID: uuid.New().String(), QuestionID: q.ID, OptionText: "20", IsCorrect: false, OrderIndex: 2},
		{ID: uuid.New().String(), QuestionID: q.ID, OptionText: "7", IsCorrect: false, OrderIndex: 3},
	}
	for _, opt := range options {
		database.DB.Create(&opt)
	}
}

func stringPtr(s string) *string {
	return &s
}

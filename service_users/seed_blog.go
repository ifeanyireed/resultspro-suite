package main

import (
	"log"
	"time"
	"math/rand"
	"service_users.resultspro.ng/config"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"github.com/joho/godotenv"
)

func generateID(prefix string) string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 10)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return prefix + "_" + string(b)
}

func main() {
	godotenv.Load()
	config.InitConfig()
	db.InitDB(config.DatabaseURL)

	
    // Fix existing schema manually
    db.GormDB.Exec("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PUBLISHED'")
    db.GormDB.Exec("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published_at DATETIME(3)")
    
    // Ensure tables exist

	db.GormDB.AutoMigrate(&models.BlogCategory{}, &models.BlogTag{}, &models.BlogPost{})

	// Get any admin user for author_id
	var user models.User
	if err := db.GormDB.First(&user).Error; err != nil {
		log.Fatalf("No users found to set as author. Please create a user first: %v", err)
	}

	categories := []models.BlogCategory{
		{ID: generateID("cat"), Name: "Education", Slug: "education"},
		{ID: generateID("cat"), Name: "Exams", Slug: "exams"},
		{ID: generateID("cat"), Name: "Product", Slug: "product"},
	}

	catMap := make(map[string]string)
		for i := range categories {
		c := &categories[i]
		if err := db.GormDB.Where("slug = ?", c.Slug).FirstOrCreate(c).Error; err != nil {
			log.Printf("Failed to create/find cat: %v", err)
		}
		catMap[c.Name] = c.ID
	}

	strPtr := func(s string) *string { return &s }
	now := time.Now()

	posts := []models.BlogPost{
		{
			ID:          generateID("post"),
			Title:       "How Digital Campuses Are Transforming African Schools",
			Slug:        "how-digital-campuses-transform-schools",
			Excerpt:     "Discover the tangible impact of mobile-first educational infrastructure on student performance and parent engagement.",
			Content:     "<p>This is the full article content. The digital campus revolution is here...</p>",
			CoverImage:  strPtr("/photo13.jpeg"),
			AuthorID:    user.ID,
			CategoryID:  strPtr(catMap["Education"]),
			Status:      "PUBLISHED",
			PublishedAt: &now,
		},
		{
			ID:          generateID("post"),
			Title:       "Gamifying WAEC Preparation: The ExamsPRO Approach",
			Slug:        "gamifying-waec-preparation",
			Excerpt:     "Why traditional study methods are failing modern students, and how gamified CBT engines build extreme readiness.",
			Content:     "<p>This is the full article content. Extreme readiness requires extreme gamification...</p>",
			CoverImage:  strPtr("/photo03.jpeg"),
			AuthorID:    user.ID,
			CategoryID:  strPtr(catMap["Exams"]),
			Status:      "PUBLISHED",
			PublishedAt: &now,
		},
		{
			ID:          generateID("post"),
			Title:       "Introducing ClassroomPRO: Offline-First Learning",
			Slug:        "introducing-classroompro-offline-first",
			Excerpt:     "Internet access shouldn't limit education. Learn how our offline-first architecture is keeping students connected to their curriculum.",
			Content:     "<p>This is the full article content. Offline-first allows constant sync...</p>",
			CoverImage:  strPtr("/photo04.jpeg"),
			AuthorID:    user.ID,
			CategoryID:  strPtr(catMap["Product"]),
			Status:      "PUBLISHED",
			PublishedAt: &now,
		},
	}

	for _, p := range posts {
		if err := db.GormDB.Create(&p).Error; err != nil {
			log.Printf("Failed to insert post %s: %v", p.Title, err)
		} else {
			log.Printf("Inserted post: %s", p.Title)
		}
	}
	
	log.Println("Seed completed successfully!")
}

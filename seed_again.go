package main

import (
	"log"
	"time"
	"math/rand"
	"service_users.resultspro.ng/config"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
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
	config.InitConfig()
	db.InitDB(config.DatabaseURL)

	var user models.User
	db.GormDB.First(&user)

	// Fetch existing categories by slug
	var catEd, catEx, catPr models.BlogCategory
	
	db.GormDB.Where("slug = ?", "education").First(&catEd)
	db.GormDB.Where("slug = ?", "exams").First(&catEx)
	db.GormDB.Where("slug = ?", "product").First(&catPr)

	log.Printf("Fetched cats: %s, %s, %s", catEd.ID, catEx.ID, catPr.ID)

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
			CategoryID:  strPtr(catEd.ID),
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
			CategoryID:  strPtr(catEx.ID),
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
			CategoryID:  strPtr(catPr.ID),
			Status:      "PUBLISHED",
			PublishedAt: &now,
		},
	}

	for _, p := range posts {
		if err := db.GormDB.Create(&p).Error; err != nil {
			log.Fatalf("Failed to insert post %s: %v", p.Title, err)
		} else {
			log.Printf("Inserted post: %s", p.Title)
		}
	}
}

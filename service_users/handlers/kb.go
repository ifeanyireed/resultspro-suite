package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
)

type KBCategory struct {
	ID          string    `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	CreatedAt   time.Time `json:"created_at"`
}

func (KBCategory) TableName() string { return "support_kb_categories" }

type KBArticle struct {
	ID         string     `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	CategoryID string     `json:"category_id"`
	Title      string     `json:"title"`
	Slug       string     `json:"slug"`
	Content    string     `json:"content"`
	Status     string     `json:"status"`
	AuthorID   string     `json:"author_id"`
	Views      int        `json:"views"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
	Category   KBCategory `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
}

func (KBArticle) TableName() string { return "support_kb_articles" }

// GET /api/v1/support/kb/categories
func GetKBCategories(w http.ResponseWriter, r *http.Request) {
	var cats []KBCategory
	db.GormDB.Order("name ASC").Find(&cats)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cats)
}

// POST /api/v1/support/kb/categories
func CreateKBCategory(w http.ResponseWriter, r *http.Request) {
	var cat KBCategory
	if err := json.NewDecoder(r.Body).Decode(&cat); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if cat.ID == "" {
		cat.ID = uuid.New().String()
	}
	db.GormDB.Create(&cat)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cat)
}

// GET /api/v1/support/kb/articles
func GetKBArticles(w http.ResponseWriter, r *http.Request) {
	var articles []KBArticle
	catID := r.URL.Query().Get("category_id")
	q := db.GormDB.Preload("Category").Order("created_at DESC")
	if catID != "" {
		q = q.Where("category_id = ?", catID)
	}
	q.Find(&articles)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(articles)
}

// GET /api/v1/support/kb/articles/{id}
func GetKBArticle(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var article KBArticle
	if err := db.GormDB.Preload("Category").First(&article, "id = ? OR slug = ?", id, id).Error; err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(article)
}

// POST /api/v1/support/kb/articles
func CreateKBArticle(w http.ResponseWriter, r *http.Request) {
	var art KBArticle
	if err := json.NewDecoder(r.Body).Decode(&art); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if art.ID == "" {
		art.ID = uuid.New().String()
	}
	art.CreatedAt = time.Now()
	art.UpdatedAt = time.Now()
	db.GormDB.Create(&art)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(art)
}

// PUT /api/v1/support/kb/articles/{id}
func UpdateKBArticle(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var art KBArticle
	if err := db.GormDB.First(&art, "id = ?", id).Error; err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	
	var updateData KBArticle
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	updateData.UpdatedAt = time.Now()
	db.GormDB.Model(&art).Updates(updateData)
	
	db.GormDB.Preload("Category").First(&art, "id = ?", id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(art)
}

// DELETE /api/v1/support/kb/articles/{id}
func DeleteKBArticle(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	db.GormDB.Delete(&KBArticle{}, "id = ?", id)
	w.WriteHeader(http.StatusNoContent)
}

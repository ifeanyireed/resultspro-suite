package handlers

import (
	"net/http"
	"strings"
	"time"
	"math/rand"
	"encoding/json"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// Helper for generating IDs
func generateID(prefix string) string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 10)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return prefix + "_" + string(b)
}

// ----------------------------------------------------------------------------
// POSTS
// ----------------------------------------------------------------------------

func HandleGetPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	var posts []models.BlogPost
	if err := db.GormDB.Preload("Author").Order("created_at desc").Find(&posts).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch posts")
		return
	}
	posts = loadTags(posts)
	utils.JSONResponse(w, http.StatusOK, posts)
}

func HandleUpdatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		ID         string  `json:"id"`
		Title      string  `json:"title"`
		Slug       string  `json:"slug"`
		Excerpt    string  `json:"excerpt"`
		Content    string  `json:"content"`
		CoverImage *string `json:"cover_image"`
		AuthorID   string  `json:"author_id"`
		CategoryID *string `json:"category_id"`
		Status     string  `json:"status"`
		Tags       string  `json:"tags"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	var post models.BlogPost
	if err := db.GormDB.First(&post, "id = ?", input.ID).Error; err != nil {
		utils.JSONError(w, http.StatusNotFound, "Post not found")
		return
	}

	post.Title = input.Title
	if input.Slug != "" {
		post.Slug = input.Slug
	}
	post.Excerpt = input.Excerpt
	post.Content = input.Content
	post.CoverImage = input.CoverImage
	post.AuthorID = input.AuthorID
	post.CategoryID = input.CategoryID
	post.Status = input.Status

	if err := db.GormDB.Save(&post).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update post")
		return
	}

	syncTags(post.ID, input.Tags)
	post.Tags = input.Tags
	utils.JSONResponse(w, http.StatusOK, post)
}

func HandleCreatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Title      string  `json:"title"`
		Slug       string  `json:"slug"`
		Excerpt    string  `json:"excerpt"`
		Content    string  `json:"content"`
		CoverImage *string `json:"cover_image"`
		AuthorID   string  `json:"author_id"`
		CategoryID *string `json:"category_id"`
		Status     string  `json:"status"`
		Tags       string  `json:"tags"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Auto-generate slug if empty
	if input.Slug == "" {
		input.Slug = strings.ToLower(strings.ReplaceAll(input.Title, " ", "-")) + "-" + generateID("")[1:]
	}

	post := models.BlogPost{
		ID:         generateID("post"),
		Title:      input.Title,
		Slug:       input.Slug,
		Excerpt:    input.Excerpt,
		Content:    input.Content,
		CoverImage: input.CoverImage,
		AuthorID:   input.AuthorID,
		CategoryID: input.CategoryID,
		Status:     input.Status,
	}

	if post.Status == "PUBLISHED" {
		now := time.Now()
		post.PublishedAt = &now
	}

	if err := db.GormDB.Create(&post).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create post")
		return
	}

	syncTags(post.ID, input.Tags)
	post.Tags = input.Tags
	utils.JSONResponse(w, http.StatusCreated, post)
}

// ----------------------------------------------------------------------------
// CATEGORIES
// ----------------------------------------------------------------------------

func HandleGetCategories(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	var categories []models.BlogCategory
	if err := db.GormDB.Order("name asc").Find(&categories).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch categories")
		return
	}
	utils.JSONResponse(w, http.StatusOK, categories)
}

func HandleCreateCategory(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if input.Slug == "" {
		input.Slug = strings.ToLower(strings.ReplaceAll(input.Name, " ", "-"))
	}

	category := models.BlogCategory{
		ID:   generateID("cat"),
		Name: input.Name,
		Slug: input.Slug,
	}

	if err := db.GormDB.Create(&category).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create category")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, category)
}

// ----------------------------------------------------------------------------
// TAGS
// ----------------------------------------------------------------------------

func HandleGetTags(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	var tags []models.BlogTag
	if err := db.GormDB.Order("name asc").Find(&tags).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch tags")
		return
	}
	utils.JSONResponse(w, http.StatusOK, tags)
}

func HandleCreateTag(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if input.Slug == "" {
		input.Slug = strings.ToLower(strings.ReplaceAll(input.Name, " ", "-"))
	}

	tag := models.BlogTag{
		ID:   generateID("tag"),
		Name: input.Name,
		Slug: input.Slug,
	}

	if err := db.GormDB.Create(&tag).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create tag")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, tag)
}

// ----------------------------------------------------------------------------
// COMMENTS
// ----------------------------------------------------------------------------

func HandleGetComments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	var comments []models.BlogComment
	if err := db.GormDB.Order("created_at desc").Find(&comments).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch comments")
		return
	}
	utils.JSONResponse(w, http.StatusOK, comments)
}


func syncTags(postID string, tagsStr string) {
	db.GormDB.AutoMigrate(&models.BlogTag{}, &models.BlogPostTag{})
	if tagsStr == "" {
		db.GormDB.Exec("DELETE FROM blog_post_tags WHERE post_id = ?", postID)
		return
	}
	db.GormDB.Exec("DELETE FROM blog_post_tags WHERE post_id = ?", postID)
	tags := strings.Split(tagsStr, ",")
	for _, t := range tags {
		t = strings.TrimSpace(t)
		if t == "" { continue }
		slug := strings.ToLower(strings.ReplaceAll(t, " ", "-"))
		var tag models.BlogTag
		if err := db.GormDB.Where("slug = ?", slug).First(&tag).Error; err != nil {
			tag = models.BlogTag{ID: generateID("tag"), Name: t, Slug: slug}
			db.GormDB.Create(&tag)
		}
		db.GormDB.Exec("INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)", postID, tag.ID)
	}
}

func loadTags(posts []models.BlogPost) []models.BlogPost {
	for i, p := range posts {
		var tags []string
		db.GormDB.Raw("SELECT t.name FROM blog_tags t JOIN blog_post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?", p.ID).Scan(&tags)
		posts[i].Tags = strings.Join(tags, ", ")
	}
	return posts
}

func HandleCreateComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		PostID  string `json:"post_id"`
		Content string `json:"content"`
		Name    string `json:"name"`
		Email   string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	db.GormDB.AutoMigrate(&models.BlogComment{})

	authorString := input.Name
	if input.Email != "" {
		authorString = input.Name + " (" + input.Email + ")"
	}

	comment := models.BlogComment{
		ID:       generateID("cmt"),
		PostID:   input.PostID,
		Content:  input.Content,
		AuthorID: authorString,
		Status:   "PENDING",
	}

	if err := db.GormDB.Create(&comment).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create comment: " + err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusCreated, comment)
}

func HandleSubscribeNewsletter(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if input.Email == "" {
		utils.JSONError(w, http.StatusBadRequest, "Email is required")
		return
	}

	db.GormDB.AutoMigrate(&models.NewsletterSubscriber{})

	sub := models.NewsletterSubscriber{
		ID:     generateID("sub"),
		Email:  input.Email,
		Status: "ACTIVE",
	}

	if err := db.GormDB.Create(&sub).Error; err != nil {
		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Already subscribed or error"})
		return
	}

	utils.JSONResponse(w, http.StatusCreated, sub)
}

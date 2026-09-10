import re

with open('service_users/handlers/blog.go', 'r') as f:
    content = f.read()

update_handler = """func HandleUpdatePost(w http.ResponseWriter, r *http.Request) {
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

	utils.JSONResponse(w, http.StatusOK, post)
}

"""

if 'HandleUpdatePost' not in content:
    content = content.replace('func HandleCreatePost', update_handler + 'func HandleCreatePost')

with open('service_users/handlers/blog.go', 'w') as f:
    f.write(content)

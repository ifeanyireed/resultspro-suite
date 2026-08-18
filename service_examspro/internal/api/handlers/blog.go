package handlers

import (
	"net/http"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
	"exams-resultspro-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BlogHandler struct{}

// Public Endpoints

func (h *BlogHandler) GetPosts(c *gin.Context) {
	var posts []models.BlogPost
	query := database.DB.Preload("Author").Preload("Category").Where("is_published = ?", true)

	categorySlug := c.Query("category")
	if categorySlug != "" {
		var category models.BlogCategory
		if err := database.DB.Where("slug = ?", categorySlug).First(&category).Error; err == nil {
			query = query.Where("category_id = ?", category.ID)
		}
	}

	if err := query.Order("published_at desc").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, posts)
}

func (h *BlogHandler) GetPostBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var post models.BlogPost
	if err := database.DB.Preload("Author").Preload("Category").Where("slug = ? AND is_published = ?", slug, true).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Increment view count (async-ish)
	database.DB.Model(&post).Update("view_count", post.ViewCount+1)

	c.JSON(http.StatusOK, post)
}

func (h *BlogHandler) GetCategories(c *gin.Context) {
	var categories []models.BlogCategory
	if err := database.DB.Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

// Admin Endpoints

func (h *BlogHandler) AdminGetPosts(c *gin.Context) {
	var posts []models.BlogPost
	if err := database.DB.Preload("Author").Preload("Category").Order("created_at desc").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}
	c.JSON(http.StatusOK, posts)
}

func (h *BlogHandler) CreatePost(c *gin.Context) {
	var post models.BlogPost
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	post.ID = uuid.New().String()
	authorID, _ := c.Get("userId")
	post.AuthorID = authorID.(string)

	if post.IsPublished && post.PublishedAt == nil {
		now := time.Now()
		post.PublishedAt = &now
	}

	if err := database.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, post)
}

func (h *BlogHandler) UpdatePost(c *gin.Context) {
	id := c.Param("id")
	var post models.BlogPost
	if err := database.DB.Where("id = ?", id).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	var input models.BlogPost
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	post.Title = input.Title
	post.Slug = input.Slug
	post.Content = input.Content
	post.Summary = input.Summary
	post.FeaturedImage = input.FeaturedImage
	post.CategoryID = input.CategoryID
	post.Tags = input.Tags
	
	if !post.IsPublished && input.IsPublished {
		now := time.Now()
		post.PublishedAt = &now
	}
	post.IsPublished = input.IsPublished

	if err := database.DB.Save(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *BlogHandler) DeletePost(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.BlogPost{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

// Category Admin

func (h *BlogHandler) CreateCategory(c *gin.Context) {
	var category models.BlogCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category.ID = uuid.New().String()
	if err := database.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

// Comments

func (h *BlogHandler) GetComments(c *gin.Context) {
	postId := c.Param("postId")
	var comments []models.BlogComment
	if err := database.DB.Preload("User").Where("post_id = ? AND status = ?", postId, "approved").Order("created_at asc").Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}
	c.JSON(http.StatusOK, comments)
}

func (h *BlogHandler) CreateComment(c *gin.Context) {
	var comment models.BlogComment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment.ID = uuid.New().String()
	
	// Check auth
	userId, exists := c.Get("userId")
	if exists {
		uID := userId.(string)
		comment.UserID = &uID
		var user models.User
		database.DB.Where("id = ?", uID).First(&user)
		if user.Name != nil {
			comment.UserName = *user.Name
		} else {
			comment.UserName = user.Email
		}
	}

	if comment.UserName == "" {
		comment.UserName = "Guest"
	}

	autoApprove := utils.GetSettingWithFallback("auto_approve_comments", "AUTO_APPROVE_COMMENTS")
	if autoApprove == "true" {
		comment.Status = "approved"
	} else {
		comment.Status = "pending"
	}

	if err := database.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to post comment"})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

func (h *BlogHandler) AdminGetComments(c *gin.Context) {
	var comments []models.BlogComment
	if err := database.DB.Preload("User").Preload("Post").Order("created_at desc").Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}
	c.JSON(http.StatusOK, comments)
}

func (h *BlogHandler) UpdateCommentStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Model(&models.BlogComment{}).Where("id = ?", id).Update("status", input.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}

func (h *BlogHandler) DeleteComment(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.BlogComment{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted"})
}

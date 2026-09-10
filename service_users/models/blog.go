package models

import "time"

type BlogCategory struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug" gorm:"uniqueIndex"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type BlogTag struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug" gorm:"uniqueIndex"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type BlogPost struct {
	ID          string     `json:"id" gorm:"primaryKey"`
	Title       string     `json:"title"`
	Slug        string     `json:"slug" gorm:"uniqueIndex"`
	Excerpt     string     `json:"excerpt"`
	Content     string     `json:"content" gorm:"type:longtext"`
	CoverImage  *string    `json:"cover_image"`
	AuthorID    string     `json:"author_id" gorm:"type:varchar(191)"`
	CategoryID  *string    `json:"category_id" gorm:"type:varchar(191)"`
	Status      string     `json:"status"` // DRAFT, PUBLISHED
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type BlogPostTag struct {
	PostID string `json:"post_id" gorm:"primaryKey"`
	TagID  string `json:"tag_id" gorm:"primaryKey"`
}

type BlogComment struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	PostID    string    `json:"post_id"`
	AuthorID  string    `json:"author_id"`
	Content   string    `json:"content" gorm:"type:text"`
	Status    string    `json:"status"` // PENDING, APPROVED, SPAM
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

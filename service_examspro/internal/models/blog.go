package models

import (
	"time"

	"gorm.io/gorm"
)

type BlogPost struct {
	ID              string         `gorm:"primaryKey;type:uuid" json:"id"`
	Title           string         `gorm:"not null" json:"title"`
	Slug            string         `gorm:"uniqueIndex;not null" json:"slug"`
	Content         string         `gorm:"type:text;not null" json:"content"`
	Summary         string         `gorm:"type:text" json:"summary"`
	FeaturedImage   string         `json:"featuredImage"`
	AuthorID        string         `gorm:"index" json:"authorId"`
	Author          *User          `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	CategoryID      *string        `gorm:"index" json:"categoryId"`
	Category        *BlogCategory  `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	IsPublished     bool           `gorm:"default:false" json:"isPublished"`
	PublishedAt     *time.Time     `json:"publishedAt"`
	ViewCount       int            `gorm:"default:0" json:"viewCount"`
	Tags            string         `json:"tags"` // Comma-separated tags
	CreatedAt       time.Time      `json:"createdAt"`
	UpdatedAt       time.Time      `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

type BlogCategory struct {
	ID          string         `gorm:"primaryKey;type:uuid" json:"id"`
	Name        string         `gorm:"uniqueIndex;not null" json:"name"`
	Slug        string         `gorm:"uniqueIndex;not null" json:"slug"`
	Description string         `json:"description"`
	Posts       []BlogPost     `gorm:"foreignKey:CategoryID" json:"posts,omitempty"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type BlogComment struct {
	ID        string         `gorm:"primaryKey;type:uuid" json:"id"`
	PostID    string         `gorm:"index;not null" json:"postId"`
	Post      *BlogPost      `gorm:"foreignKey:PostID" json:"post,omitempty"`
	UserID    *string        `gorm:"index" json:"userId"`
	User      *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
	UserName  string         `json:"userName"` // For guests or fallback
	Content   string         `gorm:"type:text;not null" json:"content"`
	Status    string         `gorm:"default:'pending'" json:"status"` // 'pending', 'approved', 'spam'
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

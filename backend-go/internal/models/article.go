package models

import (
	"time"

	"gorm.io/gorm"
)

type Article struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Title        string         `gorm:"not null" json:"title"`
	Slug         string         `gorm:"unique;index" json:"slug"`
	Content      string         `gorm:"type:text" json:"content"`
	ThumbnailURL string         `json:"thumbnail_url"`
	IsPublished  bool           `gorm:"default:false" json:"is_published"`
	AuthorID     uint           `json:"author_id"`
	Author       User           `json:"author" gorm:"foreignKey:AuthorID"`
	CategoryID   *uint          `json:"category_id"`
	Category     *Category      `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Tags         []Tag          `json:"tags,omitempty" gorm:"many2many:article_tags;"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

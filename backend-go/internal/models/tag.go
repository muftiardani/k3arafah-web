package models

import (
	"time"

	"gorm.io/gorm"
)

type Tag struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:50;not null" json:"name"`
	Slug      string         `gorm:"size:50;uniqueIndex;not null" json:"slug"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Many-to-many relation with articles
	Articles []Article `gorm:"many2many:article_tags;" json:"articles,omitempty"`
}

func (Tag) TableName() string {
	return "tags"
}

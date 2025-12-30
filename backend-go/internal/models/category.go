package models

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"size:100;not null" json:"name"`
	Slug        string         `gorm:"size:100;uniqueIndex;not null" json:"slug"`
	Description string         `gorm:"type:text" json:"description"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relation
	Articles []Article `gorm:"foreignKey:CategoryID" json:"articles,omitempty"`
}

func (Category) TableName() string {
	return "categories"
}

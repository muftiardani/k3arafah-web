package models

import (
	"time"

	"gorm.io/gorm"
)

type Achievement struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Subtitle    string         `gorm:"type:varchar(255)" json:"subtitle"`
	Description string         `gorm:"type:text" json:"description"`
	Icon        string         `gorm:"type:varchar(50);not null" json:"icon"`  // E.g., "trophy", "award"
	Color       string         `gorm:"type:varchar(50);not null" json:"color"` // E.g., "yellow", "blue"
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

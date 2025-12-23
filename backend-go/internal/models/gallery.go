package models

import (
	"time"

	"gorm.io/gorm"
)

type Gallery struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `json:"description"`
	CoverURL    string         `json:"cover_url"`
	Photos      []Photo        `gorm:"foreignKey:GalleryID" json:"photos"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type Photo struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	GalleryID uint      `gorm:"not null" json:"gallery_id"`
	PhotoURL  string    `gorm:"not null" json:"photo_url"`
	Caption   string    `json:"caption"`
	CreatedAt time.Time `json:"created_at"`
}

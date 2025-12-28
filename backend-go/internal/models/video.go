package models

import (
	"time"

	"gorm.io/gorm"
)

type Video struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Title     string         `gorm:"not null" json:"title"`
	YoutubeID string         `gorm:"not null" json:"youtube_id"`
	Thumbnail string         `json:"thumbnail"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

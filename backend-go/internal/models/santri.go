package models

import (
	"time"

	"gorm.io/gorm"
)

type SantriStatus string

const (
	StatusPending  SantriStatus = "PENDING"
	StatusVerified SantriStatus = "VERIFIED"
	StatusAccepted SantriStatus = "ACCEPTED"
	StatusRejected SantriStatus = "REJECTED"
)

type Santri struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	FullName    string         `gorm:"not null" json:"full_name"`
	NIK         string         `gorm:"unique" json:"nik"`
	BirthPlace  string         `json:"birth_place"`
	BirthDate   time.Time      `json:"birth_date"`
	Gender      string         `json:"gender"` // L/P
	Address     string         `json:"address"`
	ParentName  string         `json:"parent_name"`
	ParentPhone string         `json:"parent_phone"`
	PhotoURL    string         `json:"photo_url"` // New field for pas foto
	Status      SantriStatus   `gorm:"default:PENDING" json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

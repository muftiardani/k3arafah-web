package repository

import (
	"backend-go/internal/models"

	"gorm.io/gorm"
)

type SantriRepository interface {
	Create(santri *models.Santri) error
	FindAll() ([]models.Santri, error)
	FindByID(id uint) (*models.Santri, error)
	UpdateStatus(id uint, status models.SantriStatus) error
}

type santriRepository struct {
	db *gorm.DB
}

func NewSantriRepository(db *gorm.DB) SantriRepository {
	return &santriRepository{db}
}

func (r *santriRepository) Create(santri *models.Santri) error {
	return r.db.Create(santri).Error
}

func (r *santriRepository) FindAll() ([]models.Santri, error) {
	var santris []models.Santri
	err := r.db.Find(&santris).Error
	return santris, err
}

func (r *santriRepository) FindByID(id uint) (*models.Santri, error) {
	var santri models.Santri
	err := r.db.First(&santri, id).Error
	return &santri, err
}

func (r *santriRepository) UpdateStatus(id uint, status models.SantriStatus) error {
	return r.db.Model(&models.Santri{}).Where("id = ?", id).Update("status", status).Error
}

package repository

import (
	"backend-go/internal/models"
	"context"

	"gorm.io/gorm"
)

type SantriRepository interface {
	Create(ctx context.Context, santri *models.Santri) error
	FindAll(ctx context.Context) ([]models.Santri, error)
	FindByID(ctx context.Context, id uint) (*models.Santri, error)
	UpdateStatus(ctx context.Context, id uint, status models.SantriStatus) error
}

type santriRepository struct {
	db *gorm.DB
}

func NewSantriRepository(db *gorm.DB) SantriRepository {
	return &santriRepository{db}
}

func (r *santriRepository) Create(ctx context.Context, santri *models.Santri) error {
	return r.db.WithContext(ctx).Create(santri).Error
}

func (r *santriRepository) FindAll(ctx context.Context) ([]models.Santri, error) {
	var santris []models.Santri
	err := r.db.WithContext(ctx).Find(&santris).Error
	return santris, err
}

func (r *santriRepository) FindByID(ctx context.Context, id uint) (*models.Santri, error) {
	var santri models.Santri
	err := r.db.WithContext(ctx).First(&santri, id).Error
	return &santri, err
}

func (r *santriRepository) UpdateStatus(ctx context.Context, id uint, status models.SantriStatus) error {
	return r.db.WithContext(ctx).Model(&models.Santri{}).Where("id = ?", id).Update("status", status).Error
}

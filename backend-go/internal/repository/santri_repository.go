package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type SantriRepository interface {
	Create(ctx context.Context, santri *models.Santri) error
	FindAll(ctx context.Context) ([]models.Santri, error)
	FindByStatus(ctx context.Context, status models.SantriStatus) ([]models.Santri, error)
	FindByID(ctx context.Context, id uint) (*models.Santri, error)
	UpdateStatus(ctx context.Context, id uint, status models.SantriStatus) error
	UpdateAcademicInfo(ctx context.Context, id uint, nis string, class string, entryYear int) error
}

type santriRepository struct {
	db *gorm.DB
}

func NewSantriRepository(db *gorm.DB) SantriRepository {
	return &santriRepository{db}
}

func (r *santriRepository) Create(ctx context.Context, santri *models.Santri) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(santri).Error)
}

func (r *santriRepository) FindAll(ctx context.Context) ([]models.Santri, error) {
	var santris []models.Santri
	err := r.db.WithContext(ctx).Order("created_at desc").Find(&santris).Error
	return santris, utils.HandleDBError(err)
}

func (r *santriRepository) FindByStatus(ctx context.Context, status models.SantriStatus) ([]models.Santri, error) {
	var santris []models.Santri
	err := r.db.WithContext(ctx).Where("status = ?", status).Order("created_at desc").Find(&santris).Error
	return santris, utils.HandleDBError(err)
}

func (r *santriRepository) FindByID(ctx context.Context, id uint) (*models.Santri, error) {
	var santri models.Santri
	err := r.db.WithContext(ctx).First(&santri, id).Error
	return &santri, utils.HandleDBError(err)
}

func (r *santriRepository) UpdateStatus(ctx context.Context, id uint, status models.SantriStatus) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Model(&models.Santri{}).Where("id = ?", id).Update("status", status).Error)
}

func (r *santriRepository) UpdateAcademicInfo(ctx context.Context, id uint, nis string, class string, entryYear int) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Model(&models.Santri{}).Where("id = ?", id).Updates(map[string]interface{}{
		"nis":        nis,
		"class":      class,
		"entry_year": entryYear,
		"status":     models.StatusAccepted,
	}).Error)
}

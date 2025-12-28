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
	VerifyAndAcceptSantri(ctx context.Context, id uint, nis string, class string, entryYear int) error
	Count(ctx context.Context) (int64, error)
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

// VerifyAndAcceptSantri performs atomic verification of a santri using a database transaction.
// This ensures all updates succeed together or none at all.
func (r *santriRepository) VerifyAndAcceptSantri(ctx context.Context, id uint, nis string, class string, entryYear int) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// First, verify the santri exists and is in a verifiable state
		var santri models.Santri
		if err := tx.First(&santri, id).Error; err != nil {
			return utils.HandleDBError(err)
		}

		// Check if already accepted
		if santri.Status == models.StatusAccepted {
			return utils.NewAppError(400, "Santri already accepted")
		}

		// Update to VERIFIED status first
		if err := tx.Model(&santri).Update("status", models.StatusVerified).Error; err != nil {
			return utils.HandleDBError(err)
		}

		// Then update academic info and set to ACCEPTED
		if err := tx.Model(&santri).Updates(map[string]interface{}{
			"nis":        nis,
			"class":      class,
			"entry_year": entryYear,
			"status":     models.StatusAccepted,
		}).Error; err != nil {
			return utils.HandleDBError(err)
		}

		return nil
	})
}

func (r *santriRepository) Count(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Santri{}).Count(&count).Error
	return count, utils.HandleDBError(err)
}

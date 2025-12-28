package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type GalleryRepository interface {
	Create(ctx context.Context, gallery *models.Gallery) error
	FindAll(ctx context.Context) ([]models.Gallery, error)
	FindAllSummary(ctx context.Context) ([]models.GallerySummary, error)
	FindByID(ctx context.Context, id uint) (*models.Gallery, error)
	Update(ctx context.Context, gallery *models.Gallery) error
	Delete(ctx context.Context, id uint) error
	Count(ctx context.Context) (int64, error)

	// Photo methods
	AddPhoto(ctx context.Context, photo *models.Photo) error
	DeletePhoto(ctx context.Context, id uint) error
}

type galleryRepository struct {
	db *gorm.DB
}

func NewGalleryRepository(db *gorm.DB) GalleryRepository {
	return &galleryRepository{db}
}

func (r *galleryRepository) Create(ctx context.Context, gallery *models.Gallery) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(gallery).Error)
}

// FindAll returns all galleries with their photos (use for detail views)
func (r *galleryRepository) FindAll(ctx context.Context) ([]models.Gallery, error) {
	var galleries []models.Gallery
	err := r.db.WithContext(ctx).Preload("Photos").Order("created_at desc").Find(&galleries).Error
	return galleries, utils.HandleDBError(err)
}

// FindAllSummary returns galleries with photo count only (optimized for list views)
func (r *galleryRepository) FindAllSummary(ctx context.Context) ([]models.GallerySummary, error) {
	var summaries []models.GallerySummary
	err := r.db.WithContext(ctx).
		Table("galleries").
		Select("galleries.id, galleries.title, galleries.description, galleries.cover_image, galleries.created_at, galleries.updated_at, COUNT(photos.id) as photo_count").
		Joins("LEFT JOIN photos ON photos.gallery_id = galleries.id").
		Group("galleries.id").
		Order("galleries.created_at desc").
		Scan(&summaries).Error
	return summaries, utils.HandleDBError(err)
}

func (r *galleryRepository) FindByID(ctx context.Context, id uint) (*models.Gallery, error) {
	var gallery models.Gallery
	err := r.db.WithContext(ctx).Preload("Photos").First(&gallery, id).Error
	return &gallery, utils.HandleDBError(err)
}

func (r *galleryRepository) Update(ctx context.Context, gallery *models.Gallery) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Save(gallery).Error)
}

func (r *galleryRepository) Delete(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Gallery{}, id).Error)
}

func (r *galleryRepository) Count(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Gallery{}).Count(&count).Error
	return count, utils.HandleDBError(err)
}

func (r *galleryRepository) AddPhoto(ctx context.Context, photo *models.Photo) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(photo).Error)
}

func (r *galleryRepository) DeletePhoto(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Photo{}, id).Error)
}


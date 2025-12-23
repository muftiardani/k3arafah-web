package repository

import (
	"backend-go/internal/models"
	"context"

	"gorm.io/gorm"
)

type GalleryRepository interface {
	Create(ctx context.Context, gallery *models.Gallery) error
	FindAll(ctx context.Context) ([]models.Gallery, error)
	FindByID(ctx context.Context, id uint) (*models.Gallery, error)
	Update(ctx context.Context, gallery *models.Gallery) error
	Delete(ctx context.Context, id uint) error

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
	// Create gallery and photos if any
	return r.db.WithContext(ctx).Create(gallery).Error
}

func (r *galleryRepository) FindAll(ctx context.Context) ([]models.Gallery, error) {
	var galleries []models.Gallery
	// Preload photos to show cover or count? Ideally simple list first
	err := r.db.WithContext(ctx).Preload("Photos").Order("created_at desc").Find(&galleries).Error
	return galleries, err
}

func (r *galleryRepository) FindByID(ctx context.Context, id uint) (*models.Gallery, error) {
	var gallery models.Gallery
	err := r.db.WithContext(ctx).Preload("Photos").First(&gallery, id).Error
	return &gallery, err
}

func (r *galleryRepository) Update(ctx context.Context, gallery *models.Gallery) error {
	return r.db.WithContext(ctx).Save(gallery).Error
}

func (r *galleryRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&models.Gallery{}, id).Error
}

func (r *galleryRepository) AddPhoto(ctx context.Context, photo *models.Photo) error {
	return r.db.WithContext(ctx).Create(photo).Error
}

func (r *galleryRepository) DeletePhoto(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&models.Photo{}, id).Error
}

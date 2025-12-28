package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type VideoRepository interface {
	Create(ctx context.Context, video *models.Video) error
	FindAll(ctx context.Context) ([]models.Video, error)
	FindByID(ctx context.Context, id uint) (*models.Video, error)
	Update(ctx context.Context, video *models.Video) error
	Delete(ctx context.Context, id uint) error
}

type videoRepository struct {
	db *gorm.DB
}

func NewVideoRepository(db *gorm.DB) VideoRepository {
	return &videoRepository{db}
}

func (r *videoRepository) Create(ctx context.Context, video *models.Video) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(video).Error)
}

func (r *videoRepository) FindAll(ctx context.Context) ([]models.Video, error) {
	var videos []models.Video
	err := r.db.WithContext(ctx).Order("created_at desc").Find(&videos).Error
	return videos, utils.HandleDBError(err)
}

func (r *videoRepository) FindByID(ctx context.Context, id uint) (*models.Video, error) {
	var video models.Video
	err := r.db.WithContext(ctx).First(&video, id).Error
	return &video, utils.HandleDBError(err)
}

func (r *videoRepository) Update(ctx context.Context, video *models.Video) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Save(video).Error)
}

func (r *videoRepository) Delete(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Video{}, id).Error)
}

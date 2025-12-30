package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type TagRepository interface {
	Create(ctx context.Context, tag *models.Tag) error
	FindAll(ctx context.Context) ([]models.Tag, error)
	FindByID(ctx context.Context, id uint) (*models.Tag, error)
	FindBySlug(ctx context.Context, slug string) (*models.Tag, error)
	FindByIDs(ctx context.Context, ids []uint) ([]models.Tag, error)
	Update(ctx context.Context, tag *models.Tag) error
	Delete(ctx context.Context, id uint) error
	Count(ctx context.Context) (int64, error)
}

type tagRepository struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) TagRepository {
	return &tagRepository{db}
}

func (r *tagRepository) Create(ctx context.Context, tag *models.Tag) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(tag).Error)
}

func (r *tagRepository) FindAll(ctx context.Context) ([]models.Tag, error) {
	var tags []models.Tag
	err := r.db.WithContext(ctx).Order("name asc").Find(&tags).Error
	return tags, utils.HandleDBError(err)
}

func (r *tagRepository) FindByID(ctx context.Context, id uint) (*models.Tag, error) {
	var tag models.Tag
	err := r.db.WithContext(ctx).First(&tag, id).Error
	return &tag, utils.HandleDBError(err)
}

func (r *tagRepository) FindBySlug(ctx context.Context, slug string) (*models.Tag, error) {
	var tag models.Tag
	err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&tag).Error
	return &tag, utils.HandleDBError(err)
}

func (r *tagRepository) FindByIDs(ctx context.Context, ids []uint) ([]models.Tag, error) {
	var tags []models.Tag
	err := r.db.WithContext(ctx).Where("id IN ?", ids).Find(&tags).Error
	return tags, utils.HandleDBError(err)
}

func (r *tagRepository) Update(ctx context.Context, tag *models.Tag) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Save(tag).Error)
}

func (r *tagRepository) Delete(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Tag{}, id).Error)
}

func (r *tagRepository) Count(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Tag{}).Count(&count).Error
	return count, utils.HandleDBError(err)
}

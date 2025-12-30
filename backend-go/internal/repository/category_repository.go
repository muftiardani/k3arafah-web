package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type CategoryRepository interface {
	Create(ctx context.Context, category *models.Category) error
	FindAll(ctx context.Context) ([]models.Category, error)
	FindByID(ctx context.Context, id uint) (*models.Category, error)
	FindBySlug(ctx context.Context, slug string) (*models.Category, error)
	Update(ctx context.Context, category *models.Category) error
	Delete(ctx context.Context, id uint) error
	Count(ctx context.Context) (int64, error)
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db}
}

func (r *categoryRepository) Create(ctx context.Context, category *models.Category) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(category).Error)
}

func (r *categoryRepository) FindAll(ctx context.Context) ([]models.Category, error) {
	var categories []models.Category
	err := r.db.WithContext(ctx).Order("name asc").Find(&categories).Error
	return categories, utils.HandleDBError(err)
}

func (r *categoryRepository) FindByID(ctx context.Context, id uint) (*models.Category, error) {
	var category models.Category
	err := r.db.WithContext(ctx).First(&category, id).Error
	return &category, utils.HandleDBError(err)
}

func (r *categoryRepository) FindBySlug(ctx context.Context, slug string) (*models.Category, error) {
	var category models.Category
	err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&category).Error
	return &category, utils.HandleDBError(err)
}

func (r *categoryRepository) Update(ctx context.Context, category *models.Category) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Save(category).Error)
}

func (r *categoryRepository) Delete(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Category{}, id).Error)
}

func (r *categoryRepository) Count(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Category{}).Count(&count).Error
	return count, utils.HandleDBError(err)
}

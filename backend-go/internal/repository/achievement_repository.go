package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type AchievementRepository interface {
	Create(ctx context.Context, achievement *models.Achievement) error
	FindAll(ctx context.Context) ([]models.Achievement, error)
	FindByID(ctx context.Context, id uint) (*models.Achievement, error)
	Update(ctx context.Context, achievement *models.Achievement) error
	Delete(ctx context.Context, id uint) error
	Count(ctx context.Context) (int64, error)
}

type achievementRepository struct {
	db *gorm.DB
}

func NewAchievementRepository(db *gorm.DB) AchievementRepository {
	return &achievementRepository{db}
}

func (r *achievementRepository) Create(ctx context.Context, achievement *models.Achievement) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(achievement).Error)
}

func (r *achievementRepository) FindAll(ctx context.Context) ([]models.Achievement, error) {
	var achievements []models.Achievement
	err := r.db.WithContext(ctx).Order("created_at desc").Find(&achievements).Error
	return achievements, utils.HandleDBError(err)
}

func (r *achievementRepository) FindByID(ctx context.Context, id uint) (*models.Achievement, error) {
	var achievement models.Achievement
	err := r.db.WithContext(ctx).First(&achievement, id).Error
	return &achievement, utils.HandleDBError(err)
}

func (r *achievementRepository) Update(ctx context.Context, achievement *models.Achievement) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Save(achievement).Error)
}

func (r *achievementRepository) Delete(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Achievement{}, id).Error)
}

func (r *achievementRepository) Count(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Achievement{}).Count(&count).Error
	return count, utils.HandleDBError(err)
}


package repository

import (
	"backend-go/internal/models"
	"context"

	"gorm.io/gorm"
)

type AchievementRepository interface {
	Create(ctx context.Context, achievement *models.Achievement) error
	FindAll(ctx context.Context) ([]models.Achievement, error)
	FindByID(ctx context.Context, id uint) (*models.Achievement, error)
	Update(ctx context.Context, achievement *models.Achievement) error
	Delete(ctx context.Context, id uint) error
}

type achievementRepository struct {
	db *gorm.DB
}

func NewAchievementRepository(db *gorm.DB) AchievementRepository {
	return &achievementRepository{db}
}

func (r *achievementRepository) Create(ctx context.Context, achievement *models.Achievement) error {
	return r.db.WithContext(ctx).Create(achievement).Error
}

func (r *achievementRepository) FindAll(ctx context.Context) ([]models.Achievement, error) {
	var achievements []models.Achievement
	if err := r.db.WithContext(ctx).Order("created_at desc").Find(&achievements).Error; err != nil {
		return nil, err
	}
	return achievements, nil
}

func (r *achievementRepository) FindByID(ctx context.Context, id uint) (*models.Achievement, error) {
	var achievement models.Achievement
	if err := r.db.WithContext(ctx).First(&achievement, id).Error; err != nil {
		return nil, err
	}
	return &achievement, nil
}

func (r *achievementRepository) Update(ctx context.Context, achievement *models.Achievement) error {
	return r.db.WithContext(ctx).Save(achievement).Error
}

func (r *achievementRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&models.Achievement{}, id).Error
}

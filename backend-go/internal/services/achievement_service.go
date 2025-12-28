package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
)

type AchievementService interface {
	CreateAchievement(ctx context.Context, achievement *models.Achievement) error
	GetAllAchievements(ctx context.Context) ([]models.Achievement, error)
	GetAchievementByID(ctx context.Context, id uint) (*models.Achievement, error)
	UpdateAchievement(ctx context.Context, id uint, data *models.Achievement) error
	DeleteAchievement(ctx context.Context, id uint) error
}

type achievementService struct {
	repo repository.AchievementRepository
}

func NewAchievementService(repo repository.AchievementRepository) AchievementService {
	return &achievementService{repo}
}

func (s *achievementService) CreateAchievement(ctx context.Context, achievement *models.Achievement) error {
	return s.repo.Create(ctx, achievement)
}

func (s *achievementService) GetAllAchievements(ctx context.Context) ([]models.Achievement, error) {
	return s.repo.FindAll(ctx)
}

func (s *achievementService) GetAchievementByID(ctx context.Context, id uint) (*models.Achievement, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *achievementService) UpdateAchievement(ctx context.Context, id uint, data *models.Achievement) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	// Update fields
	existing.Title = data.Title
	existing.Subtitle = data.Subtitle
	existing.Description = data.Description
	existing.Icon = data.Icon
	existing.Color = data.Color

	return s.repo.Update(ctx, existing)
}

func (s *achievementService) DeleteAchievement(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}

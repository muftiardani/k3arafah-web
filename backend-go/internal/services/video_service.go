package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
)

type VideoService interface {
	CreateVideo(ctx context.Context, video *models.Video) error
	GetAllVideos(ctx context.Context) ([]models.Video, error)
	GetVideoByID(ctx context.Context, id uint) (*models.Video, error)
	UpdateVideo(ctx context.Context, video *models.Video) error
	DeleteVideo(ctx context.Context, id uint) error
}

type videoService struct {
	repo repository.VideoRepository
}

func NewVideoService(repo repository.VideoRepository) VideoService {
	return &videoService{repo}
}

func (s *videoService) CreateVideo(ctx context.Context, video *models.Video) error {
	return s.repo.Create(ctx, video)
}

func (s *videoService) GetAllVideos(ctx context.Context) ([]models.Video, error) {
	return s.repo.FindAll(ctx)
}

func (s *videoService) GetVideoByID(ctx context.Context, id uint) (*models.Video, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *videoService) UpdateVideo(ctx context.Context, video *models.Video) error {
	return s.repo.Update(ctx, video)
}

func (s *videoService) DeleteVideo(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}


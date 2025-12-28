package services

import (
	"backend-go/internal/repository"
	"context"
)

type DashboardStats struct {
	TotalSantri   int64 `json:"total_santri"`
	TotalArticles int64 `json:"total_articles"`
	TotalUsers    int64 `json:"total_users"` // Admin users
}

type DashboardService interface {
	GetStats(ctx context.Context) (*DashboardStats, error)
}

type dashboardService struct {
	santriRepo  repository.SantriRepository
	articleRepo repository.ArticleRepository
	userRepo    repository.UserRepository
}

func NewDashboardService(
	santriRepo repository.SantriRepository,
	articleRepo repository.ArticleRepository,
	userRepo repository.UserRepository,
) DashboardService {
	return &dashboardService{
		santriRepo:  santriRepo,
		articleRepo: articleRepo,
		userRepo:    userRepo,
	}
}

func (s *dashboardService) GetStats(ctx context.Context) (*DashboardStats, error) {
	// Use COUNT queries for efficiency instead of fetching all records
	totalSantri, err := s.santriRepo.Count(ctx)
	if err != nil {
		return nil, err
	}

	totalArticles, err := s.articleRepo.Count(ctx)
	if err != nil {
		return nil, err
	}

	totalUsers, err := s.userRepo.Count(ctx)
	if err != nil {
		return nil, err
	}

	stats := &DashboardStats{
		TotalSantri:   totalSantri,
		TotalArticles: totalArticles,
		TotalUsers:    totalUsers,
	}

	return stats, nil
}

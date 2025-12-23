package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
)

type PSBService interface {
	RegisterSantri(ctx context.Context, santri *models.Santri) error
	GetAllRegistrants(ctx context.Context) ([]models.Santri, error)
	GetRegistrantID(ctx context.Context, id uint) (*models.Santri, error)
	UpdateStatus(ctx context.Context, id uint, status string) error
}

type psbService struct {
	repo repository.SantriRepository
}

func NewPSBService(repo repository.SantriRepository) PSBService {
	return &psbService{repo}
}

func (s *psbService) RegisterSantri(ctx context.Context, santri *models.Santri) error {
	// Add business logic validation here if needed
	return s.repo.Create(ctx, santri)
}

func (s *psbService) GetAllRegistrants(ctx context.Context) ([]models.Santri, error) {
	return s.repo.FindAll(ctx)
}

func (s *psbService) GetRegistrantID(ctx context.Context, id uint) (*models.Santri, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *psbService) UpdateStatus(ctx context.Context, id uint, status string) error {
	return s.repo.UpdateStatus(ctx, id, models.SantriStatus(status))
}

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
	VerifySantri(ctx context.Context, id uint, nis string, class string, entryYear int) error
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
	// Find all or only PENDING/VERIFIED? For PSB module, usually we want to see PENDING/VERIFIED.
	// ACCEPTED ones move to Student Module.
	// But GetAllRegistrants name implies just "Registrants".
	// Let's filter out ACCEPTED? Or return all?
	// For "Data Pendaftar" page, usually we see everyone who registered.
	// Let's keep it FindAll for now, or FindByStatus if needed.
	return s.repo.FindAll(ctx)
}

func (s *psbService) GetRegistrantID(ctx context.Context, id uint) (*models.Santri, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *psbService) UpdateStatus(ctx context.Context, id uint, status string) error {
	return s.repo.UpdateStatus(ctx, id, models.SantriStatus(status))
}

func (s *psbService) VerifySantri(ctx context.Context, id uint, nis string, class string, entryYear int) error {
	// Logic: When verifying (Accepting), we assign NIS and Class
	return s.repo.UpdateAcademicInfo(ctx, id, nis, class, entryYear)
}

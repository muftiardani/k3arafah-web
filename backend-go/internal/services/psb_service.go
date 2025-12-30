package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
	"time"
)

type PSBService interface {
	RegisterSantri(ctx context.Context, santri *models.Santri) error
	GetAllRegistrants(ctx context.Context) ([]models.Santri, error)
	GetRegistrantsPaginated(ctx context.Context, page, limit int, status string) ([]models.Santri, int64, error)
	GetRegistrantsByStatus(ctx context.Context, status string) ([]models.Santri, error)
	GetRegistrantByID(ctx context.Context, id uint) (*models.Santri, error)
	UpdateSantri(ctx context.Context, id uint, data *models.Santri) error
	DeleteSantri(ctx context.Context, id uint) error
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
	return s.repo.FindAll(ctx)
}

func (s *psbService) GetRegistrantsPaginated(ctx context.Context, page, limit int, status string) ([]models.Santri, int64, error) {
	return s.repo.FindAllPaginated(ctx, page, limit, status)
}

func (s *psbService) GetRegistrantsByStatus(ctx context.Context, status string) ([]models.Santri, error) {
	return s.repo.FindByStatus(ctx, models.SantriStatus(status))
}

func (s *psbService) GetRegistrantByID(ctx context.Context, id uint) (*models.Santri, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *psbService) UpdateSantri(ctx context.Context, id uint, data *models.Santri) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	// Update fields only if provided
	if data.FullName != "" {
		existing.FullName = data.FullName
	}
	if data.NIK != "" {
		existing.NIK = data.NIK
	}
	if data.BirthPlace != "" {
		existing.BirthPlace = data.BirthPlace
	}
	if !data.BirthDate.IsZero() {
		existing.BirthDate = data.BirthDate
	}
	if data.Gender != "" {
		existing.Gender = data.Gender
	}
	if data.Address != "" {
		existing.Address = data.Address
	}
	if data.ParentName != "" {
		existing.ParentName = data.ParentName
	}
	if data.ParentPhone != "" {
		existing.ParentPhone = data.ParentPhone
	}
	if data.PhotoURL != "" {
		existing.PhotoURL = data.PhotoURL
	}

	existing.UpdatedAt = time.Now()
	return s.repo.Update(ctx, existing)
}

func (s *psbService) DeleteSantri(ctx context.Context, id uint) error {
	// First verify it exists
	_, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, id)
}

func (s *psbService) UpdateStatus(ctx context.Context, id uint, status string) error {
	return s.repo.UpdateStatus(ctx, id, models.SantriStatus(status))
}

func (s *psbService) VerifySantri(ctx context.Context, id uint, nis string, class string, entryYear int) error {
	// Logic: When verifying (Accepting), we assign NIS and Class
	return s.repo.UpdateAcademicInfo(ctx, id, nis, class, entryYear)
}

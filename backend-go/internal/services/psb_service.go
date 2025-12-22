package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
)

type PSBService interface {
	RegisterSantri(santri *models.Santri) error
	GetAllRegistrants() ([]models.Santri, error)
	GetRegistrantID(id uint) (*models.Santri, error)
	UpdateStatus(id uint, status string) error
}

type psbService struct {
	repo repository.SantriRepository
}

func NewPSBService(repo repository.SantriRepository) PSBService {
	return &psbService{repo}
}

func (s *psbService) RegisterSantri(santri *models.Santri) error {
	// Add business logic validation here if needed
	return s.repo.Create(santri)
}

func (s *psbService) GetAllRegistrants() ([]models.Santri, error) {
	return s.repo.FindAll()
}

func (s *psbService) GetRegistrantID(id uint) (*models.Santri, error) {
	return s.repo.FindByID(id)
}

func (s *psbService) UpdateStatus(id uint, status string) error {
	return s.repo.UpdateStatus(id, models.SantriStatus(status))
}

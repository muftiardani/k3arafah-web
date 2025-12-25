package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
)

type MessageService interface {
	CreateMessage(input *models.Message) error
	GetAllMessages() ([]models.Message, error)
	DeleteMessage(id uint) error
}

type messageService struct {
	repo repository.MessageRepository
}

func NewMessageService(repo repository.MessageRepository) MessageService {
	return &messageService{repo}
}

func (s *messageService) CreateMessage(input *models.Message) error {
	return s.repo.Create(input)
}

func (s *messageService) GetAllMessages() ([]models.Message, error) {
	return s.repo.GetAll()
}

func (s *messageService) DeleteMessage(id uint) error {
	return s.repo.Delete(id)
}

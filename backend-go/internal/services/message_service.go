package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
)

type MessageService interface {
	CreateMessage(ctx context.Context, input *models.Message) error
	GetAllMessages(ctx context.Context) ([]models.Message, error)
	MarkAsRead(ctx context.Context, id uint) error
	DeleteMessage(ctx context.Context, id uint) error
}

type messageService struct {
	repo repository.MessageRepository
}

func NewMessageService(repo repository.MessageRepository) MessageService {
	return &messageService{repo}
}

func (s *messageService) CreateMessage(ctx context.Context, input *models.Message) error {
	return s.repo.Create(ctx, input)
}

func (s *messageService) GetAllMessages(ctx context.Context) ([]models.Message, error) {
	return s.repo.FindAll(ctx)
}

func (s *messageService) MarkAsRead(ctx context.Context, id uint) error {
	return s.repo.MarkAsRead(ctx, id)
}

func (s *messageService) DeleteMessage(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}


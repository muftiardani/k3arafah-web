package repository

import (
	"backend-go/internal/models"
	"context"

	"gorm.io/gorm"
)

type MessageRepository interface {
	Create(ctx context.Context, message *models.Message) error
	FindAll(ctx context.Context) ([]models.Message, error)
	FindByID(ctx context.Context, id uint) (*models.Message, error)
	MarkAsRead(ctx context.Context, id uint) error
	Delete(ctx context.Context, id uint) error
}

type messageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) MessageRepository {
	return &messageRepository{db}
}

func (r *messageRepository) Create(ctx context.Context, message *models.Message) error {
	return r.db.WithContext(ctx).Create(message).Error
}

func (r *messageRepository) FindAll(ctx context.Context) ([]models.Message, error) {
	var messages []models.Message
	err := r.db.WithContext(ctx).Order("created_at desc").Find(&messages).Error
	return messages, err
}

func (r *messageRepository) FindByID(ctx context.Context, id uint) (*models.Message, error) {
	var message models.Message
	err := r.db.WithContext(ctx).First(&message, id).Error
	if err != nil {
		return nil, err
	}
	return &message, nil
}

func (r *messageRepository) MarkAsRead(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Model(&models.Message{}).Where("id = ?", id).Update("is_read", true).Error
}

func (r *messageRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&models.Message{}, id).Error
}


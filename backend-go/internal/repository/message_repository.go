package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type MessageRepository interface {
	Create(ctx context.Context, message *models.Message) error
	FindAll(ctx context.Context) ([]models.Message, error)
	FindByID(ctx context.Context, id uint) (*models.Message, error)
	MarkAsRead(ctx context.Context, id uint) error
	Delete(ctx context.Context, id uint) error
	CountUnread(ctx context.Context) (int64, error)
}

type messageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) MessageRepository {
	return &messageRepository{db}
}

func (r *messageRepository) Create(ctx context.Context, message *models.Message) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(message).Error)
}

func (r *messageRepository) FindAll(ctx context.Context) ([]models.Message, error) {
	var messages []models.Message
	err := r.db.WithContext(ctx).
		Select("id, name, email, subject, message, is_read, created_at").
		Order("created_at desc").
		Find(&messages).Error
	return messages, utils.HandleDBError(err)
}

func (r *messageRepository) FindByID(ctx context.Context, id uint) (*models.Message, error) {
	var message models.Message
	err := r.db.WithContext(ctx).First(&message, id).Error
	return &message, utils.HandleDBError(err)
}

func (r *messageRepository) MarkAsRead(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Model(&models.Message{}).Where("id = ?", id).Update("is_read", true).Error)
}

func (r *messageRepository) Delete(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Message{}, id).Error)
}

// CountUnread returns the count of unread messages
func (r *messageRepository) CountUnread(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Message{}).Where("is_read = ?", false).Count(&count).Error
	return count, utils.HandleDBError(err)
}


package repository

import (
	"backend-go/internal/models"

	"gorm.io/gorm"
)

type MessageRepository interface {
	Create(message *models.Message) error
	GetAll() ([]models.Message, error)
	GetByID(id uint) (*models.Message, error)
	Delete(id uint) error
}

type messageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) MessageRepository {
	return &messageRepository{db}
}

func (r *messageRepository) Create(message *models.Message) error {
	return r.db.Create(message).Error
}

func (r *messageRepository) GetAll() ([]models.Message, error) {
	var messages []models.Message
	err := r.db.Order("created_at desc").Find(&messages).Error
	return messages, err
}

func (r *messageRepository) GetByID(id uint) (*models.Message, error) {
	var message models.Message
	err := r.db.First(&message, id).Error
	if err != nil {
		return nil, err
	}
	return &message, nil
}

func (r *messageRepository) Delete(id uint) error {
	return r.db.Delete(&models.Message{}, id).Error
}

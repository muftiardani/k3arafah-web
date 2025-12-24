package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *models.User) error
	FindByUsername(ctx context.Context, username string) (*models.User, error)
	FindAll(ctx context.Context) ([]models.User, error)
	FindByID(ctx context.Context, id uint) (*models.User, error)
	UpdateUser(ctx context.Context, user *models.User) error
	DeleteUser(ctx context.Context, id uint) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) CreateUser(ctx context.Context, user *models.User) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(user).Error)
}

func (r *userRepository) FindByUsername(ctx context.Context, username string) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(ctx).Where("username = ?", username).First(&user).Error
	return &user, utils.HandleDBError(err)
}

func (r *userRepository) FindAll(ctx context.Context) ([]models.User, error) {
	var users []models.User
	err := r.db.WithContext(ctx).Find(&users).Error
	return users, utils.HandleDBError(err)
}

func (r *userRepository) FindByID(ctx context.Context, id uint) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(ctx).First(&user, id).Error
	return &user, utils.HandleDBError(err)
}

func (r *userRepository) UpdateUser(ctx context.Context, user *models.User) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Save(user).Error)
}

func (r *userRepository) DeleteUser(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.User{}, id).Error)
}

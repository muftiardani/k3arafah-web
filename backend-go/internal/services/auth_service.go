package services

import (
	"backend-go/config"
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"backend-go/internal/utils"
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	RegisterAdmin(ctx context.Context, username, password, role string) error
	Login(ctx context.Context, username, password string) (string, error)
	GetAllAdmins(ctx context.Context) ([]models.User, error)
	DeleteAdmin(ctx context.Context, id uint) error
	UpdateAdminPassword(ctx context.Context, id uint, password string) error
}

type authService struct {
	repo repository.UserRepository
}

func NewAuthService(repo repository.UserRepository) AuthService {
	return &authService{repo}
}

func (s *authService) RegisterAdmin(ctx context.Context, username, password, role string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if role == "" {
		role = models.RoleAdmin
	}

	user := &models.User{
		Username: username,
		Password: string(hashedPassword),
		Role:     role,
	}

	return s.repo.CreateUser(ctx, user)
}

func (s *authService) Login(ctx context.Context, username, password string) (string, error) {
	user, err := s.repo.FindByUsername(ctx, username)
	if err != nil {
		// Return generic unauthorized to avoid leaking verification details
		return "", utils.ErrUnauthorized
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", utils.ErrUnauthorized
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(config.AppConfig.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *authService) GetAllAdmins(ctx context.Context) ([]models.User, error) {
	return s.repo.FindAll(ctx)
}

func (s *authService) DeleteAdmin(ctx context.Context, id uint) error {
	return s.repo.DeleteUser(ctx, id)
}

func (s *authService) UpdateAdminPassword(ctx context.Context, id uint, password string) error {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return s.repo.UpdateUser(ctx, user)
}

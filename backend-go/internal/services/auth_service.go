package services

import (
	"backend-go/config"
	"backend-go/internal/dto"
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"backend-go/internal/utils"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Token expiry durations
const (
	AccessTokenExpiry  = 15 * time.Minute // 15 minutes
	RefreshTokenExpiry = 7 * 24 * time.Hour // 7 days
)

// Cache key prefix for blacklisted tokens
const TokenBlacklistPrefix = "token:blacklist:"

type AuthService interface {
	RegisterAdmin(ctx context.Context, username, password, role string) error
	Login(ctx context.Context, username, password string) (*dto.TokenPair, error)
	RefreshToken(ctx context.Context, refreshToken string) (*dto.TokenPair, error)
	BlacklistToken(ctx context.Context, token string) error
	IsTokenBlacklisted(ctx context.Context, token string) bool
	GetAllAdmins(ctx context.Context) ([]models.User, error)
	DeleteAdmin(ctx context.Context, id uint) error
	UpdateAdminPassword(ctx context.Context, id uint, password string) error
}

type authService struct {
	repo  repository.UserRepository
	cache CacheService
}

func NewAuthService(repo repository.UserRepository, cache CacheService) AuthService {
	return &authService{repo: repo, cache: cache}
}

func (s *authService) RegisterAdmin(ctx context.Context, username, password, role string) error {
	// Validate password policy
	if err := utils.ValidatePassword(password); err != nil {
		return utils.NewAppError(400, err.Error())
	}

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

func (s *authService) Login(ctx context.Context, username, password string) (*dto.TokenPair, error) {
	user, err := s.repo.FindByUsername(ctx, username)
	if err != nil {
		// Return generic unauthorized to avoid leaking verification details
		return nil, utils.ErrUnauthorized
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, utils.ErrUnauthorized
	}

	return s.generateTokenPair(user)
}

// hashToken creates a hash of the token for storage (more secure than storing raw tokens)
func hashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}

// BlacklistToken adds a token to the blacklist
func (s *authService) BlacklistToken(ctx context.Context, token string) error {
	if token == "" {
		return nil
	}
	tokenHash := hashToken(token)
	key := TokenBlacklistPrefix + tokenHash
	// Store in cache with expiry matching refresh token expiry
	return s.cache.Set(key, true, RefreshTokenExpiry)
}

// IsTokenBlacklisted checks if a token is in the blacklist
func (s *authService) IsTokenBlacklisted(ctx context.Context, token string) bool {
	if token == "" {
		return false
	}
	tokenHash := hashToken(token)
	key := TokenBlacklistPrefix + tokenHash
	var blacklisted bool
	if err := s.cache.Get(key, &blacklisted); err == nil && blacklisted {
		return true
	}
	return false
}

func (s *authService) RefreshToken(ctx context.Context, refreshToken string) (*dto.TokenPair, error) {
	// Check if token is blacklisted
	if s.IsTokenBlacklisted(ctx, refreshToken) {
		return nil, utils.ErrUnauthorized
	}

	// Parse and validate refresh token
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(config.AppConfig.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, utils.ErrUnauthorized
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, utils.ErrUnauthorized
	}

	// Check token type
	tokenType, ok := claims["type"].(string)
	if !ok || tokenType != "refresh" {
		return nil, errors.New("invalid token type")
	}

	// Get user ID
	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return nil, utils.ErrUnauthorized
	}
	userID := uint(userIDFloat)

	// Find user to get latest info
	user, err := s.repo.FindByID(ctx, userID)
	if err != nil {
		return nil, utils.ErrUnauthorized
	}

	// Blacklist the old refresh token (token rotation)
	_ = s.BlacklistToken(ctx, refreshToken)

	// Generate new token pair
	return s.generateTokenPair(user)
}

func (s *authService) generateTokenPair(user *models.User) (*dto.TokenPair, error) {
	now := time.Now()
	accessExpiry := now.Add(AccessTokenExpiry)
	refreshExpiry := now.Add(RefreshTokenExpiry)

	// Access Token
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"type":    "access",
		"exp":     accessExpiry.Unix(),
		"iat":     now.Unix(),
	})

	accessTokenString, err := accessToken.SignedString([]byte(config.AppConfig.JWTSecret))
	if err != nil {
		return nil, err
	}

	// Refresh Token
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"type":    "refresh",
		"exp":     refreshExpiry.Unix(),
		"iat":     now.Unix(),
	})

	refreshTokenString, err := refreshToken.SignedString([]byte(config.AppConfig.JWTSecret))
	if err != nil {
		return nil, err
	}

	return &dto.TokenPair{
		AccessToken:  accessTokenString,
		RefreshToken: refreshTokenString,
		ExpiresIn:    int64(AccessTokenExpiry.Seconds()),
		User: dto.UserDTO{
			ID:       user.ID,
			Username: user.Username,
			Role:     user.Role,
		},
	}, nil
}

func (s *authService) GetAllAdmins(ctx context.Context) ([]models.User, error) {
	return s.repo.FindAll(ctx)
}

func (s *authService) DeleteAdmin(ctx context.Context, id uint) error {
	return s.repo.DeleteUser(ctx, id)
}

func (s *authService) UpdateAdminPassword(ctx context.Context, id uint, password string) error {
	// Validate password policy
	if err := utils.ValidatePassword(password); err != nil {
		return utils.NewAppError(400, err.Error())
	}

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

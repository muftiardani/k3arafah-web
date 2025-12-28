package services_test

import (
	"backend-go/config"
	"backend-go/internal/models"
	"backend-go/internal/services"
	"context"
	"errors"
	"testing"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// Manual Mock for UserRepository
type mockUserRepository struct {
	users map[string]*models.User
}

func newMockRepo() *mockUserRepository {
	return &mockUserRepository{
		users: make(map[string]*models.User),
	}
}

func (m *mockUserRepository) CreateUser(ctx context.Context, user *models.User) error {
	if _, exists := m.users[user.Username]; exists {
		return errors.New("user already exists")
	}
	// Simulate DB saving (with ID generation)
	user.ID = uint(len(m.users) + 1)
	m.users[user.Username] = user
	return nil
}

func (m *mockUserRepository) FindByUsername(ctx context.Context, username string) (*models.User, error) {
	if user, exists := m.users[username]; exists {
		return user, nil
	}
	return nil, errors.New("record not found")
}

func (m *mockUserRepository) FindAll(ctx context.Context) ([]models.User, error) {
	var users []models.User
	for _, u := range m.users {
		users = append(users, *u)
	}
	return users, nil
}

func (m *mockUserRepository) FindByID(ctx context.Context, id uint) (*models.User, error) {
	for _, u := range m.users {
		if u.ID == id {
			return u, nil
		}
	}
	return nil, errors.New("record not found")
}

func (m *mockUserRepository) UpdateUser(ctx context.Context, user *models.User) error {
	m.users[user.Username] = user
	return nil
}

func (m *mockUserRepository) DeleteUser(ctx context.Context, id uint) error {
	for k, u := range m.users {
		if u.ID == id {
			delete(m.users, k)
			return nil
		}
	}
	return errors.New("record not found")
}

func (m *mockUserRepository) Count(ctx context.Context) (int64, error) {
	return int64(len(m.users)), nil
}


// Mock CacheService
type mockCacheService struct {
	cache map[string]interface{}
}

func newMockCache() *mockCacheService {
	return &mockCacheService{
		cache: make(map[string]interface{}),
	}
}

func (m *mockCacheService) Get(key string, dest interface{}) error {
	val, ok := m.cache[key]
	if !ok {
		return errors.New("key not found")
	}
	// Simplified reflection for test (assumes bool for blacklist)
	if v, ok := dest.(*bool); ok {
		if valBool, ok := val.(bool); ok {
			*v = valBool
			return nil
		}
	}
	return nil
}

func (m *mockCacheService) Set(key string, value interface{}, expiration time.Duration) error {
	m.cache[key] = value
	return nil
}

func (m *mockCacheService) Delete(key string) error {
	delete(m.cache, key)
	return nil
}

func (m *mockCacheService) DeleteByPattern(pattern string) error {
	// Simple mock implementation
	return nil
}

func (m *mockCacheService) IsAvailable() bool {
	return true
}

// Test Suite
func TestAuthService_RegisterAdmin(t *testing.T) {
	repo := newMockRepo()
	cache := newMockCache()
	service := services.NewAuthService(repo, cache)
	ctx := context.Background()

	// Test Success
	err := service.RegisterAdmin(ctx, "admin", "Password123", "")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}

	// Verify Password Hashing
	user, _ := repo.FindByUsername(ctx, "admin")
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("Password123"))
	if err != nil {
		t.Errorf("password was not hashed correctly")
	}

	// Test Duplicate
	err = service.RegisterAdmin(ctx, "admin", "newpass", "")
	if err == nil {
		t.Error("expected error for duplicate user, got nil")
	}
}

func TestAuthService_Login(t *testing.T) {
	// Setup Config for JWT
	config.AppConfig.JWTSecret = "supersecret"

	repo := newMockRepo()
	cache := newMockCache()
	service := services.NewAuthService(repo, cache)
	ctx := context.Background()

	// Seed User
	service.RegisterAdmin(ctx, "user1", "CorrectPass1", "")

	// Test Success
	tokenPair, err := service.Login(ctx, "user1", "CorrectPass1")
	if err != nil {
		t.Errorf("login failed: %v", err)
	}
	if tokenPair == nil || tokenPair.AccessToken == "" {
		t.Error("expected token pair with access token, got nil or empty")
	}

	// Test Wrong Password
	_, err = service.Login(ctx, "user1", "wrongpass")
	if err == nil {
		t.Error("expected error for wrong password")
	}

	// Test Non-existent User
	_, err = service.Login(ctx, "ghost", "pass")
	if err == nil {
		t.Error("expected error for non-existent user")
	}
}

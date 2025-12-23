package services_test

import (
	"backend-go/config"
	"backend-go/internal/models"
	"backend-go/internal/services"
	"context"
	"errors"
	"testing"

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

// Test Suite
func TestAuthService_RegisterAdmin(t *testing.T) {
	repo := newMockRepo()
	service := services.NewAuthService(repo)
	ctx := context.Background()

	// Test Success
	err := service.RegisterAdmin(ctx, "admin", "password123", "")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}

	// Verify Password Hashing
	user, _ := repo.FindByUsername(ctx, "admin")
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("password123"))
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
	service := services.NewAuthService(repo)
	ctx := context.Background()

	// Seed User
	service.RegisterAdmin(ctx, "user1", "correctpass", "")

	// Test Success
	token, err := service.Login(ctx, "user1", "correctpass")
	if err != nil {
		t.Errorf("login failed: %v", err)
	}
	if token == "" {
		t.Error("expected token, got empty string")
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

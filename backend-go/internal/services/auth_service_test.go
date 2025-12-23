package services_test

import (
	"backend-go/internal/models"
	"backend-go/internal/services"
	"errors"
	"os"
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

func (m *mockUserRepository) CreateUser(user *models.User) error {
	if _, exists := m.users[user.Username]; exists {
		return errors.New("user already exists")
	}
	// Simulate DB saving (with ID generation)
	user.ID = uint(len(m.users) + 1)
	m.users[user.Username] = user
	return nil
}

func (m *mockUserRepository) FindByUsername(username string) (*models.User, error) {
	if user, exists := m.users[username]; exists {
		return user, nil
	}
	return nil, errors.New("record not found")
}

// Test Suite
func TestAuthService_RegisterAdmin(t *testing.T) {
	repo := newMockRepo()
	service := services.NewAuthService(repo)

	// Test Success
	err := service.RegisterAdmin("admin", "password123")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}

	// Verify Password Hashing
	user, _ := repo.FindByUsername("admin")
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("password123"))
	if err != nil {
		t.Errorf("password was not hashed correctly")
	}

	// Test Duplicate
	err = service.RegisterAdmin("admin", "newpass")
	if err == nil {
		t.Error("expected error for duplicate user, got nil")
	}
}

func TestAuthService_Login(t *testing.T) {
	// Setup Environment for JWT
	os.Setenv("JWT_SECRET", "supersecret")
	defer os.Unsetenv("JWT_SECRET")

	repo := newMockRepo()
	service := services.NewAuthService(repo)

	// Seed User
	service.RegisterAdmin("user1", "correctpass")

	// Test Success
	token, err := service.Login("user1", "correctpass")
	if err != nil {
		t.Errorf("login failed: %v", err)
	}
	if token == "" {
		t.Error("expected token, got empty string")
	}

	// Test Wrong Password
	_, err = service.Login("user1", "wrongpass")
	if err == nil {
		t.Error("expected error for wrong password")
	}

	// Test Non-existent User
	_, err = service.Login("ghost", "pass")
	if err == nil {
		t.Error("expected error for non-existent user")
	}
}

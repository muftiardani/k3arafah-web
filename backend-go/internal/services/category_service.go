package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
	"regexp"
	"strings"
)

type CategoryService interface {
	CreateCategory(ctx context.Context, category *models.Category) error
	GetAllCategories(ctx context.Context) ([]models.Category, error)
	GetCategoryByID(ctx context.Context, id uint) (*models.Category, error)
	GetCategoryBySlug(ctx context.Context, slug string) (*models.Category, error)
	UpdateCategory(ctx context.Context, id uint, data *models.Category) error
	DeleteCategory(ctx context.Context, id uint) error
}

type categoryService struct {
	repo repository.CategoryRepository
}

func NewCategoryService(repo repository.CategoryRepository) CategoryService {
	return &categoryService{repo}
}

func (s *categoryService) CreateCategory(ctx context.Context, category *models.Category) error {
	// Generate slug from name
	category.Slug = generateSlug(category.Name)
	return s.repo.Create(ctx, category)
}

func (s *categoryService) GetAllCategories(ctx context.Context) ([]models.Category, error) {
	return s.repo.FindAll(ctx)
}

func (s *categoryService) GetCategoryByID(ctx context.Context, id uint) (*models.Category, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *categoryService) GetCategoryBySlug(ctx context.Context, slug string) (*models.Category, error) {
	return s.repo.FindBySlug(ctx, slug)
}

func (s *categoryService) UpdateCategory(ctx context.Context, id uint, data *models.Category) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if data.Name != "" {
		existing.Name = data.Name
		existing.Slug = generateSlug(data.Name)
	}
	if data.Description != "" {
		existing.Description = data.Description
	}

	return s.repo.Update(ctx, existing)
}

func (s *categoryService) DeleteCategory(ctx context.Context, id uint) error {
	_, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, id)
}

// generateSlug creates a URL-friendly slug from a string
func generateSlug(s string) string {
	// Convert to lowercase
	slug := strings.ToLower(s)
	// Replace spaces with hyphens
	slug = strings.ReplaceAll(slug, " ", "-")
	// Remove non-alphanumeric characters except hyphens
	reg := regexp.MustCompile("[^a-z0-9-]+")
	slug = reg.ReplaceAllString(slug, "")
	// Remove multiple consecutive hyphens
	reg = regexp.MustCompile("-+")
	slug = reg.ReplaceAllString(slug, "-")
	// Trim hyphens from start and end
	slug = strings.Trim(slug, "-")
	return slug
}

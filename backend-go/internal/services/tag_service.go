package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
	"regexp"
	"strings"
)

type TagService interface {
	CreateTag(ctx context.Context, tag *models.Tag) error
	GetAllTags(ctx context.Context) ([]models.Tag, error)
	GetTagByID(ctx context.Context, id uint) (*models.Tag, error)
	GetTagBySlug(ctx context.Context, slug string) (*models.Tag, error)
	GetTagsByIDs(ctx context.Context, ids []uint) ([]models.Tag, error)
	UpdateTag(ctx context.Context, id uint, data *models.Tag) error
	DeleteTag(ctx context.Context, id uint) error
}

type tagService struct {
	repo repository.TagRepository
}

func NewTagService(repo repository.TagRepository) TagService {
	return &tagService{repo}
}

func (s *tagService) CreateTag(ctx context.Context, tag *models.Tag) error {
	// Generate slug from name
	tag.Slug = generateTagSlug(tag.Name)
	return s.repo.Create(ctx, tag)
}

func (s *tagService) GetAllTags(ctx context.Context) ([]models.Tag, error) {
	return s.repo.FindAll(ctx)
}

func (s *tagService) GetTagByID(ctx context.Context, id uint) (*models.Tag, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *tagService) GetTagBySlug(ctx context.Context, slug string) (*models.Tag, error) {
	return s.repo.FindBySlug(ctx, slug)
}

func (s *tagService) GetTagsByIDs(ctx context.Context, ids []uint) ([]models.Tag, error) {
	return s.repo.FindByIDs(ctx, ids)
}

func (s *tagService) UpdateTag(ctx context.Context, id uint, data *models.Tag) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if data.Name != "" {
		existing.Name = data.Name
		existing.Slug = generateTagSlug(data.Name)
	}

	return s.repo.Update(ctx, existing)
}

func (s *tagService) DeleteTag(ctx context.Context, id uint) error {
	_, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, id)
}

// generateTagSlug creates a URL-friendly slug from a string
func generateTagSlug(s string) string {
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

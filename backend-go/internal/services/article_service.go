package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"strings"
	"time"
)

type ArticleService interface {
	CreateArticle(article *models.Article) error
	GetAllArticles() ([]models.Article, error)
	GetArticleByID(id uint) (*models.Article, error)
	UpdateArticle(id uint, articleData *models.Article) error
	DeleteArticle(id uint) error
}

type articleService struct {
	repo repository.ArticleRepository
}

func NewArticleService(repo repository.ArticleRepository) ArticleService {
	return &articleService{repo}
}

func (s *articleService) CreateArticle(article *models.Article) error {
	// Simple slug generation
	slug := strings.ToLower(strings.ReplaceAll(article.Title, " ", "-"))
	slug = strings.ReplaceAll(slug, "?", "") // basic cleanup
	article.Slug = slug
	article.CreatedAt = time.Now()
	return s.repo.Create(article)
}

func (s *articleService) GetAllArticles() ([]models.Article, error) {
	return s.repo.FindAll()
}

func (s *articleService) GetArticleByID(id uint) (*models.Article, error) {
	return s.repo.FindByID(id)
}

func (s *articleService) UpdateArticle(id uint, articleData *models.Article) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	existing.Title = articleData.Title
	existing.Content = articleData.Content
	existing.ThumbnailURL = articleData.ThumbnailURL
	existing.IsPublished = articleData.IsPublished
	// re-generate slug if title changed? optional. keeping simple for now.
	
	return s.repo.Update(existing)
}

func (s *articleService) DeleteArticle(id uint) error {
	return s.repo.Delete(id)
}

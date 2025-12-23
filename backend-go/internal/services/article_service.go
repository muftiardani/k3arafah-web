package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"fmt"
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
	repo  repository.ArticleRepository
	cache CacheService
}

func NewArticleService(repo repository.ArticleRepository, cache CacheService) ArticleService {
	return &articleService{repo, cache}
}

func (s *articleService) CreateArticle(article *models.Article) error {
	// Simple slug generation
	slug := strings.ToLower(strings.ReplaceAll(article.Title, " ", "-"))
	slug = strings.ReplaceAll(slug, "?", "") // basic cleanup
	article.Slug = slug
	article.CreatedAt = time.Now()
	
	err := s.repo.Create(article)
	if err == nil {
		s.cache.Delete("articles:all") // Invalidate list
	}
	return err
}

func (s *articleService) GetAllArticles() ([]models.Article, error) {
	var articles []models.Article
	key := "articles:all"

	// Try Cache
	if err := s.cache.Get(key, &articles); err == nil {
		return articles, nil
	}

	// DB Fallback
	articles, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}

	// Set Cache (5 minutes)
	_ = s.cache.Set(key, articles, 5*time.Minute)
	return articles, nil
}

func (s *articleService) GetArticleByID(id uint) (*models.Article, error) {
	var article models.Article
	key := fmt.Sprintf("articles:id:%d", id)

	// Try Cache
	if err := s.cache.Get(key, &article); err == nil {
		return &article, nil
	}

	// DB Fallback
	result, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Set Cache (10 minutes)
	_ = s.cache.Set(key, result, 10*time.Minute)
	return result, nil
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
	
	err = s.repo.Update(existing)
	if err == nil {
		s.cache.Delete("articles:all")
		s.cache.Delete(fmt.Sprintf("articles:id:%d", id))
	}
	return err
}

func (s *articleService) DeleteArticle(id uint) error {
	err := s.repo.Delete(id)
	if err == nil {
		s.cache.Delete("articles:all")
		s.cache.Delete(fmt.Sprintf("articles:id:%d", id))
	}
	return err
}

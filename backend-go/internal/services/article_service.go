package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
	"fmt"
	"time"

	"github.com/gosimple/slug"
	"github.com/microcosm-cc/bluemonday"
)

type ArticleService interface {
	CreateArticle(ctx context.Context, article *models.Article) error
	GetAllArticles(ctx context.Context) ([]models.Article, error)
	GetArticleByID(ctx context.Context, id uint) (*models.Article, error)
	UpdateArticle(ctx context.Context, id uint, articleData *models.Article) error
	DeleteArticle(ctx context.Context, id uint) error
}

type articleService struct {
	repo  repository.ArticleRepository
	cache CacheService
}

func NewArticleService(repo repository.ArticleRepository, cache CacheService) ArticleService {
	return &articleService{repo, cache}
}

func (s *articleService) CreateArticle(ctx context.Context, article *models.Article) error {
	p := bluemonday.UGCPolicy()
	article.Content = p.Sanitize(article.Content)

	article.Slug = slug.Make(article.Title)
	article.CreatedAt = time.Now()

	err := s.repo.Create(ctx, article)
	if err == nil {
		s.cache.Delete("articles:all")
	}
	return err
}

func (s *articleService) GetAllArticles(ctx context.Context) ([]models.Article, error) {
	var articles []models.Article
	key := "articles:all"

	if err := s.cache.Get(key, &articles); err == nil {
		return articles, nil
	}

	articles, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	_ = s.cache.Set(key, articles, 5*time.Minute)
	return articles, nil
}

func (s *articleService) GetArticleByID(ctx context.Context, id uint) (*models.Article, error) {
	var article models.Article
	key := fmt.Sprintf("articles:id:%d", id)

	if err := s.cache.Get(key, &article); err == nil {
		return &article, nil
	}

	result, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	_ = s.cache.Set(key, result, 10*time.Minute)
	return result, nil
}

func (s *articleService) UpdateArticle(ctx context.Context, id uint, articleData *models.Article) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	
	p := bluemonday.UGCPolicy()
	
	existing.Title = articleData.Title
	existing.Content = p.Sanitize(articleData.Content)
	existing.ThumbnailURL = articleData.ThumbnailURL
	existing.IsPublished = articleData.IsPublished

	err = s.repo.Update(ctx, existing)
	if err == nil {
		s.cache.Delete("articles:all")
		s.cache.Delete(fmt.Sprintf("articles:id:%d", id))
	}
	return err
}

func (s *articleService) DeleteArticle(ctx context.Context, id uint) error {
	err := s.repo.Delete(ctx, id)
	if err == nil {
		s.cache.Delete("articles:all")
		s.cache.Delete(fmt.Sprintf("articles:id:%d", id))
	}
	return err
}

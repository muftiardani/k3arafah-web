package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"backend-go/internal/utils"
	"context"
	"fmt"
	"time"

	"github.com/gosimple/slug"
	"github.com/microcosm-cc/bluemonday"
)

type ArticleService interface {
	CreateArticle(ctx context.Context, article *models.Article) error
	GetAllArticles(ctx context.Context) ([]models.Article, error)
	GetAllArticlesPaginated(ctx context.Context, page, limit int) ([]models.Article, int64, error)
	GetArticleByID(ctx context.Context, id uint) (*models.Article, error)
	GetArticleBySlug(ctx context.Context, slug string) (*models.Article, error)
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
		s.cache.Delete(utils.CacheKeyArticlesAll)
        s.cache.DeleteByPattern("articles:page:*")
	}
	return err
}

func (s *articleService) GetAllArticles(ctx context.Context) ([]models.Article, error) {
	var articles []models.Article
	key := utils.CacheKeyArticlesAll

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

func (s *articleService) GetAllArticlesPaginated(ctx context.Context, page, limit int) ([]models.Article, int64, error) {
	var articles []models.Article
	// We cache only first page for performance boost on landing page
	// or caching all pages with shorter TTL
	key := fmt.Sprintf("articles:page:%d:limit:%d", page, limit)

	// Attempt to get from cache (we need a struct that holds items + total to cache properly)
	// But since the return signature is separate, we might skip caching for complex pagination 
	// or cache specifically items and total.
	
	// For simplicity in this iteration, let's cache the whole result struct if we defined one, 
	// but here we return (items, total).
	// Let's Skip caching for pagination for a moment or implement it properly.
	// Implementing simple caching:
	
	type CachedResult struct {
		Articles []models.Article
		Total    int64
	}
	var cached CachedResult
	if err := s.cache.Get(key, &cached); err == nil {
		return cached.Articles, cached.Total, nil
	}

	articles, total, err := s.repo.FindAllPaginated(ctx, page, limit)
	if err != nil {
		return nil, 0, err
	}
	
	_ = s.cache.Set(key, CachedResult{Articles: articles, Total: total}, 1*time.Minute)
	return articles, total, nil
}

func (s *articleService) GetArticleByID(ctx context.Context, id uint) (*models.Article, error) {
	var article models.Article
	key := fmt.Sprintf(utils.CacheKeyArticlesIDPattern, id)

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

func (s *articleService) GetArticleBySlug(ctx context.Context, slug string) (*models.Article, error) {
	var article models.Article
	key := fmt.Sprintf(utils.CacheKeyArticlesSlugPattern, slug)

	if err := s.cache.Get(key, &article); err == nil {
		return &article, nil
	}

	result, err := s.repo.FindBySlug(ctx, slug)
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
		s.cache.Delete(utils.CacheKeyArticlesAll)
		s.cache.Delete(fmt.Sprintf(utils.CacheKeyArticlesIDPattern, id))
		s.cache.Delete(fmt.Sprintf(utils.CacheKeyArticlesSlugPattern, existing.Slug))
        s.cache.DeleteByPattern("articles:page:*")
	}
	return err
}

func (s *articleService) DeleteArticle(ctx context.Context, id uint) error {
	err := s.repo.Delete(ctx, id)
	if err == nil {
		s.cache.Delete(utils.CacheKeyArticlesAll)
		s.cache.Delete(fmt.Sprintf(utils.CacheKeyArticlesIDPattern, id))
		// For simplicity, invalidate all slug caches or requires fetching before delete.
		// Using pattern delete for safety here.
		s.cache.DeleteByPattern("articles:slug:*")
        s.cache.DeleteByPattern("articles:page:*")
	}
	return err
}

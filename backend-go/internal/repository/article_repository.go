package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type ArticleRepository interface {
	Create(ctx context.Context, article *models.Article) error
	FindAll(ctx context.Context) ([]models.Article, error)
	FindByID(ctx context.Context, id uint) (*models.Article, error)
	Update(ctx context.Context, article *models.Article) error
	Delete(ctx context.Context, id uint) error
	FindBySlug(ctx context.Context, slug string) (*models.Article, error)
	FindAllPaginated(ctx context.Context, page, limit int) ([]models.Article, int64, error)
	Count(ctx context.Context) (int64, error)
}

type articleRepository struct {
	db *gorm.DB
}

func NewArticleRepository(db *gorm.DB) ArticleRepository {
	return &articleRepository{db}
}

func (r *articleRepository) Create(ctx context.Context, article *models.Article) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(article).Error)
}

func (r *articleRepository) FindAll(ctx context.Context) ([]models.Article, error) {
	var articles []models.Article
	err := r.db.WithContext(ctx).Preload("Author").Order("created_at desc").Find(&articles).Error
	return articles, utils.HandleDBError(err)
}

func (r *articleRepository) FindByID(ctx context.Context, id uint) (*models.Article, error) {
	var article models.Article
	err := r.db.WithContext(ctx).Preload("Author").First(&article, id).Error
	return &article, utils.HandleDBError(err)
}

func (r *articleRepository) FindBySlug(ctx context.Context, slug string) (*models.Article, error) {
	var article models.Article
	err := r.db.WithContext(ctx).Preload("Author").Where("slug = ?", slug).First(&article).Error
	return &article, utils.HandleDBError(err)
}

func (r *articleRepository) FindAllPaginated(ctx context.Context, page, limit int) ([]models.Article, int64, error) {
	var articles []models.Article
	var total int64
	
	offset := (page - 1) * limit
	
	// Count total
	if err := r.db.WithContext(ctx).Model(&models.Article{}).Count(&total).Error; err != nil {
		return nil, 0, utils.HandleDBError(err)
	}

	// Fetch paginated
	err := r.db.WithContext(ctx).Preload("Author").Order("created_at desc").
		Offset(offset).Limit(limit).Find(&articles).Error
		
	return articles, total, utils.HandleDBError(err)
}

func (r *articleRepository) Update(ctx context.Context, article *models.Article) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Save(article).Error)
}

func (r *articleRepository) Delete(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Article{}, id).Error)
}

func (r *articleRepository) Count(ctx context.Context) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Article{}).Count(&count).Error
	return count, utils.HandleDBError(err)
}

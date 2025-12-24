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

func (r *articleRepository) Update(ctx context.Context, article *models.Article) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Save(article).Error)
}

func (r *articleRepository) Delete(ctx context.Context, id uint) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Delete(&models.Article{}, id).Error)
}

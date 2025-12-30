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
	Search(ctx context.Context, query string, page, limit int) ([]models.Article, int64, error)
	FindByCategory(ctx context.Context, categoryID uint, page, limit int) ([]models.Article, int64, error)
	FindByTag(ctx context.Context, tagID uint, page, limit int) ([]models.Article, int64, error)
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
	err := r.db.WithContext(ctx).Preload("Author").Preload("Category").Preload("Tags").Order("created_at desc").Find(&articles).Error
	return articles, utils.HandleDBError(err)
}

func (r *articleRepository) FindByID(ctx context.Context, id uint) (*models.Article, error) {
	var article models.Article
	err := r.db.WithContext(ctx).Preload("Author").Preload("Category").Preload("Tags").First(&article, id).Error
	return &article, utils.HandleDBError(err)
}

func (r *articleRepository) FindBySlug(ctx context.Context, slug string) (*models.Article, error) {
	var article models.Article
	err := r.db.WithContext(ctx).Preload("Author").Preload("Category").Preload("Tags").Where("slug = ?", slug).First(&article).Error
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
	err := r.db.WithContext(ctx).Preload("Author").Preload("Category").Preload("Tags").Order("created_at desc").
		Offset(offset).Limit(limit).Find(&articles).Error

	return articles, total, utils.HandleDBError(err)
}

func (r *articleRepository) Search(ctx context.Context, query string, page, limit int) ([]models.Article, int64, error) {
	var articles []models.Article
	var total int64

	offset := (page - 1) * limit
	searchPattern := "%" + query + "%"

	baseQuery := r.db.WithContext(ctx).Model(&models.Article{}).
		Where("title ILIKE ? OR content ILIKE ?", searchPattern, searchPattern)

	// Count total
	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, 0, utils.HandleDBError(err)
	}

	// Fetch paginated
	err := r.db.WithContext(ctx).Preload("Author").Preload("Category").Preload("Tags").
		Where("title ILIKE ? OR content ILIKE ?", searchPattern, searchPattern).
		Order("created_at desc").
		Offset(offset).Limit(limit).Find(&articles).Error

	return articles, total, utils.HandleDBError(err)
}

func (r *articleRepository) FindByCategory(ctx context.Context, categoryID uint, page, limit int) ([]models.Article, int64, error) {
	var articles []models.Article
	var total int64

	offset := (page - 1) * limit

	baseQuery := r.db.WithContext(ctx).Model(&models.Article{}).Where("category_id = ?", categoryID)

	// Count total
	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, 0, utils.HandleDBError(err)
	}

	// Fetch paginated
	err := r.db.WithContext(ctx).Preload("Author").Preload("Category").Preload("Tags").
		Where("category_id = ?", categoryID).
		Order("created_at desc").
		Offset(offset).Limit(limit).Find(&articles).Error

	return articles, total, utils.HandleDBError(err)
}

func (r *articleRepository) FindByTag(ctx context.Context, tagID uint, page, limit int) ([]models.Article, int64, error) {
	var articles []models.Article
	var total int64

	offset := (page - 1) * limit

	// Count total through join
	countQuery := r.db.WithContext(ctx).Model(&models.Article{}).
		Joins("JOIN article_tags ON article_tags.article_id = articles.id").
		Where("article_tags.tag_id = ?", tagID)

	if err := countQuery.Count(&total).Error; err != nil {
		return nil, 0, utils.HandleDBError(err)
	}

	// Fetch paginated
	err := r.db.WithContext(ctx).Preload("Author").Preload("Category").Preload("Tags").
		Joins("JOIN article_tags ON article_tags.article_id = articles.id").
		Where("article_tags.tag_id = ?", tagID).
		Order("articles.created_at desc").
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

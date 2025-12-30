package repository

import (
	"backend-go/internal/models"
	"backend-go/internal/utils"
	"context"

	"gorm.io/gorm"
)

type ActivityLogRepository interface {
	Create(ctx context.Context, log *models.ActivityLog) error
	FindAll(ctx context.Context, page, limit int) ([]models.ActivityLog, int64, error)
	FindByUserID(ctx context.Context, userID uint, page, limit int) ([]models.ActivityLog, int64, error)
	FindByEntity(ctx context.Context, entityType string, entityID uint) ([]models.ActivityLog, error)
	FindByAction(ctx context.Context, action models.ActivityAction, page, limit int) ([]models.ActivityLog, int64, error)
}

type activityLogRepository struct {
	db *gorm.DB
}

func NewActivityLogRepository(db *gorm.DB) ActivityLogRepository {
	return &activityLogRepository{db}
}

func (r *activityLogRepository) Create(ctx context.Context, log *models.ActivityLog) error {
	return utils.HandleDBError(r.db.WithContext(ctx).Create(log).Error)
}

func (r *activityLogRepository) FindAll(ctx context.Context, page, limit int) ([]models.ActivityLog, int64, error) {
	var logs []models.ActivityLog
	var total int64

	offset := (page - 1) * limit

	if err := r.db.WithContext(ctx).Model(&models.ActivityLog{}).Count(&total).Error; err != nil {
		return nil, 0, utils.HandleDBError(err)
	}

	err := r.db.WithContext(ctx).
		Preload("User").
		Order("created_at desc").
		Offset(offset).
		Limit(limit).
		Find(&logs).Error

	return logs, total, utils.HandleDBError(err)
}

func (r *activityLogRepository) FindByUserID(ctx context.Context, userID uint, page, limit int) ([]models.ActivityLog, int64, error) {
	var logs []models.ActivityLog
	var total int64

	offset := (page - 1) * limit

	query := r.db.WithContext(ctx).Model(&models.ActivityLog{}).Where("user_id = ?", userID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, utils.HandleDBError(err)
	}

	err := query.
		Preload("User").
		Order("created_at desc").
		Offset(offset).
		Limit(limit).
		Find(&logs).Error

	return logs, total, utils.HandleDBError(err)
}

func (r *activityLogRepository) FindByEntity(ctx context.Context, entityType string, entityID uint) ([]models.ActivityLog, error) {
	var logs []models.ActivityLog
	err := r.db.WithContext(ctx).
		Preload("User").
		Where("entity_type = ? AND entity_id = ?", entityType, entityID).
		Order("created_at desc").
		Find(&logs).Error
	return logs, utils.HandleDBError(err)
}

func (r *activityLogRepository) FindByAction(ctx context.Context, action models.ActivityAction, page, limit int) ([]models.ActivityLog, int64, error) {
	var logs []models.ActivityLog
	var total int64

	offset := (page - 1) * limit

	query := r.db.WithContext(ctx).Model(&models.ActivityLog{}).Where("action = ?", action)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, utils.HandleDBError(err)
	}

	err := query.
		Preload("User").
		Order("created_at desc").
		Offset(offset).
		Limit(limit).
		Find(&logs).Error

	return logs, total, utils.HandleDBError(err)
}

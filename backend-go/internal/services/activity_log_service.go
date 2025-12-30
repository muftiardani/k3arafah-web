package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
	"encoding/json"
)

type ActivityLogService interface {
	LogActivity(ctx context.Context, userID uint, action models.ActivityAction, entityType string, entityID *uint, oldValue, newValue interface{}, ipAddress, userAgent string) error
	GetAllLogs(ctx context.Context, page, limit int) ([]models.ActivityLog, int64, error)
	GetLogsByUser(ctx context.Context, userID uint, page, limit int) ([]models.ActivityLog, int64, error)
	GetLogsByEntity(ctx context.Context, entityType string, entityID uint) ([]models.ActivityLog, error)
	GetLogsByAction(ctx context.Context, action models.ActivityAction, page, limit int) ([]models.ActivityLog, int64, error)
}

type activityLogService struct {
	repo repository.ActivityLogRepository
}

func NewActivityLogService(repo repository.ActivityLogRepository) ActivityLogService {
	return &activityLogService{repo}
}

func (s *activityLogService) LogActivity(ctx context.Context, userID uint, action models.ActivityAction, entityType string, entityID *uint, oldValue, newValue interface{}, ipAddress, userAgent string) error {
	var oldValueJSON, newValueJSON string

	if oldValue != nil {
		bytes, err := json.Marshal(oldValue)
		if err == nil {
			oldValueJSON = string(bytes)
		}
	}

	if newValue != nil {
		bytes, err := json.Marshal(newValue)
		if err == nil {
			newValueJSON = string(bytes)
		}
	}

	log := &models.ActivityLog{
		UserID:     userID,
		Action:     action,
		EntityType: entityType,
		EntityID:   entityID,
		OldValue:   oldValueJSON,
		NewValue:   newValueJSON,
		IPAddress:  ipAddress,
		UserAgent:  userAgent,
	}

	return s.repo.Create(ctx, log)
}

func (s *activityLogService) GetAllLogs(ctx context.Context, page, limit int) ([]models.ActivityLog, int64, error) {
	return s.repo.FindAll(ctx, page, limit)
}

func (s *activityLogService) GetLogsByUser(ctx context.Context, userID uint, page, limit int) ([]models.ActivityLog, int64, error) {
	return s.repo.FindByUserID(ctx, userID, page, limit)
}

func (s *activityLogService) GetLogsByEntity(ctx context.Context, entityType string, entityID uint) ([]models.ActivityLog, error) {
	return s.repo.FindByEntity(ctx, entityType, entityID)
}

func (s *activityLogService) GetLogsByAction(ctx context.Context, action models.ActivityAction, page, limit int) ([]models.ActivityLog, int64, error) {
	return s.repo.FindByAction(ctx, action, page, limit)
}

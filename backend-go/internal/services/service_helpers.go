package services

import (
	"backend-go/internal/models"
	"context"
)

// ActivityLogger is a global instance for logging activities
// This allows handlers to log without requiring DI changes
var ActivityLogger ActivityLogService

// SetActivityLogger sets the global activity logger
func SetActivityLogger(logger ActivityLogService) {
	ActivityLogger = logger
}

// LogActivityAsync logs an activity asynchronously to avoid blocking the request
func LogActivityAsync(ctx context.Context, userID uint, action models.ActivityAction, entityType string, entityID *uint, oldValue, newValue interface{}, ipAddress, userAgent string) {
	if ActivityLogger == nil {
		return
	}
	go func() {
		// Use background context since the original context may be cancelled
		_ = ActivityLogger.LogActivity(context.Background(), userID, action, entityType, entityID, oldValue, newValue, ipAddress, userAgent)
	}()
}

// Emailer is a global instance for sending emails
var Emailer EmailService

// SetEmailer sets the global email service
func SetEmailer(emailer EmailService) {
	Emailer = emailer
}

// SendPSBConfirmationAsync sends PSB confirmation email asynchronously
func SendPSBConfirmationAsync(to, santriName, registrationID string) {
	if Emailer == nil {
		return
	}
	go func() {
		_ = Emailer.SendPSBConfirmation(to, santriName, registrationID)
	}()
}

// SendStatusUpdateAsync sends status update email asynchronously
func SendStatusUpdateAsync(to, santriName, status string) {
	if Emailer == nil {
		return
	}
	go func() {
		_ = Emailer.SendStatusUpdate(to, santriName, status)
	}()
}

// MediaCleaner is a global instance for cleaning up media files
var MediaCleaner MediaService

// SetMediaCleaner sets the global media cleaner
func SetMediaCleaner(cleaner MediaService) {
	MediaCleaner = cleaner
}

// CleanupImageAsync deletes an image from Cloudinary asynchronously
func CleanupImageAsync(imageURL string) {
	if MediaCleaner == nil || imageURL == "" {
		return
	}
	go func() {
		_ = MediaCleaner.DeleteImageByURL(context.Background(), imageURL)
	}()
}


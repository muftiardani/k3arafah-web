package services

import (
	"backend-go/config"
	"backend-go/internal/logger"
	"context"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"go.uber.org/zap"
)

// File upload constraints
const (
	MaxFileSize      = 5 * 1024 * 1024 // 5MB
	AllowedMimeTypes = "image/jpeg,image/png,image/webp,image/gif"
)

// ErrFileTooLarge is returned when file exceeds size limit
var ErrFileTooLarge = errors.New("file size exceeds 5MB limit")

// ErrInvalidFileType is returned when file type is not allowed
var ErrInvalidFileType = errors.New("file type not allowed. Allowed types: JPEG, PNG, WebP, GIF")

type MediaService interface {
	UploadImage(ctx context.Context, file multipart.File, header *multipart.FileHeader, folder string) (string, error)
	ValidateFile(file multipart.File, header *multipart.FileHeader) error
	DeleteImage(ctx context.Context, publicID string) error
	DeleteImageByURL(ctx context.Context, imageURL string) error
	GetUsageStats(ctx context.Context) (*CloudinaryUsage, error)
}

// CloudinaryUsage represents Cloudinary storage usage
type CloudinaryUsage struct {
	UsedStorage     int64   `json:"used_storage"`
	UsedBandwidth   int64   `json:"used_bandwidth"`
	TotalResources  int     `json:"total_resources"`
	StorageLimit    int64   `json:"storage_limit"`
	BandwidthLimit  int64   `json:"bandwidth_limit"`
	UsagePercentage float64 `json:"usage_percentage"`
}

type mediaService struct {
	cld *cloudinary.Cloudinary
}

func NewMediaService() (MediaService, error) {
	cldURL := config.AppConfig.CloudinaryURL
	if cldURL == "" {
		return nil, errors.New("CLOUDINARY_URL is not set")
	}

	cld, err := cloudinary.NewFromURL(cldURL)
	if err != nil {
		return nil, err
	}

	return &mediaService{cld}, nil
}

// ValidateFile checks file size and MIME type before upload
func (s *mediaService) ValidateFile(file multipart.File, header *multipart.FileHeader) error {
	// Check file size
	if header.Size > MaxFileSize {
		return fmt.Errorf("%w: got %d bytes, max %d bytes", ErrFileTooLarge, header.Size, MaxFileSize)
	}

	// Read first 512 bytes to detect MIME type
	buff := make([]byte, 512)
	_, err := file.Read(buff)
	if err != nil && err != io.EOF {
		return fmt.Errorf("failed to read file: %w", err)
	}

	// Reset file reader position
	if seeker, ok := file.(io.Seeker); ok {
		if _, err := seeker.Seek(0, io.SeekStart); err != nil {
			return fmt.Errorf("failed to reset file reader: %w", err)
		}
	}

	// Detect actual MIME type from file content
	mimeType := http.DetectContentType(buff)

	// Check if MIME type is allowed
	if !strings.Contains(AllowedMimeTypes, mimeType) {
		return fmt.Errorf("%w: got %s", ErrInvalidFileType, mimeType)
	}

	return nil
}

// UploadImage validates and uploads an image to Cloudinary
func (s *mediaService) UploadImage(ctx context.Context, file multipart.File, header *multipart.FileHeader, folder string) (string, error) {
	// Validate file before upload
	if err := s.ValidateFile(file, header); err != nil {
		return "", err
	}

	// Upload to Cloudinary with optimization
	uploadResult, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:         folder,
		Transformation: "c_limit,w_1920,h_1080,q_auto,f_auto", // Auto optimize and limit size
	})
	if err != nil {
		return "", fmt.Errorf("cloudinary upload failed: %w", err)
	}

	return uploadResult.SecureURL, nil
}

// DeleteImage deletes an image from Cloudinary by its public ID
func (s *mediaService) DeleteImage(ctx context.Context, publicID string) error {
	if publicID == "" {
		return errors.New("public ID is required")
	}

	result, err := s.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	if err != nil {
		logger.Error("Failed to delete image from Cloudinary", zap.String("publicId", publicID), zap.Error(err))
		return fmt.Errorf("failed to delete image: %w", err)
	}

	if result.Result != "ok" {
		logger.Warn("Image deletion returned non-ok result", zap.String("publicId", publicID), zap.String("result", result.Result))
	}

	logger.Info("Image deleted from Cloudinary", zap.String("publicId", publicID))
	return nil
}

// DeleteImageByURL extracts the public ID from a Cloudinary URL and deletes the image
func (s *mediaService) DeleteImageByURL(ctx context.Context, imageURL string) error {
	if imageURL == "" {
		return nil // Nothing to delete
	}

	// Extract public ID from URL
	// URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
	publicID := extractPublicIDFromURL(imageURL)
	if publicID == "" {
		logger.Warn("Could not extract public ID from URL", zap.String("url", imageURL))
		return nil // Can't extract, skip silently
	}

	return s.DeleteImage(ctx, publicID)
}

// GetUsageStats retrieves Cloudinary account usage statistics
func (s *mediaService) GetUsageStats(ctx context.Context) (*CloudinaryUsage, error) {
	result, err := s.cld.Admin.Usage(ctx, admin.UsageParams{})
	if err != nil {
		return nil, fmt.Errorf("failed to get Cloudinary usage: %w", err)
	}

	usage := &CloudinaryUsage{
		UsedStorage:    result.Storage.Usage,
		UsedBandwidth:  result.Bandwidth.Usage,
		TotalResources: result.Resources,
		StorageLimit:   result.Storage.Limit,
		BandwidthLimit: result.Bandwidth.Limit,
	}

	if usage.StorageLimit > 0 {
		usage.UsagePercentage = float64(usage.UsedStorage) / float64(usage.StorageLimit) * 100
	}

	return usage, nil
}

// extractPublicIDFromURL extracts the Cloudinary public ID from a URL
func extractPublicIDFromURL(url string) string {
	// Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image_name.jpg

	// Find "/upload/" and get everything after it
	uploadIdx := strings.Index(url, "/upload/")
	if uploadIdx == -1 {
		return ""
	}

	// Get the path after /upload/
	path := url[uploadIdx+8:] // 8 = len("/upload/")

	// Remove version if present (starts with v followed by digits)
	if len(path) > 0 && path[0] == 'v' {
		slashIdx := strings.Index(path, "/")
		if slashIdx != -1 {
			path = path[slashIdx+1:]
		}
	}

	// Remove file extension
	lastDotIdx := strings.LastIndex(path, ".")
	if lastDotIdx != -1 {
		path = path[:lastDotIdx]
	}

	return path
}

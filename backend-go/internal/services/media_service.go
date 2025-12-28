package services

import (
	"backend-go/config"
	"context"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
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

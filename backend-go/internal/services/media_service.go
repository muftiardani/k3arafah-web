package services

import (
	"backend-go/config"
	"context"
	"errors"
	"mime/multipart"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type MediaService interface {
	UploadImage(ctx context.Context, file multipart.File, folder string) (string, error)
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

func (s *mediaService) UploadImage(ctx context.Context, file multipart.File, folder string) (string, error) {
	// Upload to Cloudinary
	uploadResult, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: folder,
	})
	if err != nil {
		return "", err
	}

	return uploadResult.SecureURL, nil
}

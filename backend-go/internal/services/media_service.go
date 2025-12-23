package services

import (
	"context"
	"errors"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type MediaService interface {
	UploadImage(file multipart.File, folder string) (string, error)
}

type mediaService struct {
	cld *cloudinary.Cloudinary
}

func NewMediaService() (MediaService, error) {
	cldURL := os.Getenv("CLOUDINARY_URL")
	if cldURL == "" {
		return nil, errors.New("CLOUDINARY_URL is not set")
	}

	cld, err := cloudinary.NewFromURL(cldURL)
	if err != nil {
		return nil, err
	}

	return &mediaService{cld}, nil
}

func (s *mediaService) UploadImage(file multipart.File, folder string) (string, error) {
	ctx := context.Background()

	// Upload to Cloudinary
	uploadResult, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: folder,
	})
	if err != nil {
		return "", err
	}

	return uploadResult.SecureURL, nil
}

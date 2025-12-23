package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"context"
	"mime/multipart"
)

type GalleryService interface {
	CreateGallery(ctx context.Context, gallery *models.Gallery, coverFile *multipart.FileHeader) error
	GetAllGalleries(ctx context.Context) ([]models.Gallery, error)
	GetGalleryByID(ctx context.Context, id uint) (*models.Gallery, error)
	UpdateGallery(ctx context.Context, id uint, galleryData *models.Gallery) error
	DeleteGallery(ctx context.Context, id uint) error

	AddPhotos(ctx context.Context, galleryID uint, files []*multipart.FileHeader) error
	DeletePhoto(ctx context.Context, photoID uint) error
}

type galleryService struct {
	repo         repository.GalleryRepository
	mediaService MediaService
}

func NewGalleryService(repo repository.GalleryRepository, mediaService MediaService) GalleryService {
	return &galleryService{repo, mediaService}
}

func (s *galleryService) CreateGallery(ctx context.Context, gallery *models.Gallery, coverFile *multipart.FileHeader) error {
	// Upload cover if present
	if coverFile != nil {
		file, err := coverFile.Open()
		if err != nil {
			return err
		}
		defer file.Close()

		url, err := s.mediaService.UploadImage(ctx, file, "k3arafah/galleries")
		if err != nil {
			return err
		}
		gallery.CoverURL = url
	}

	return s.repo.Create(ctx, gallery)
}

func (s *galleryService) GetAllGalleries(ctx context.Context) ([]models.Gallery, error) {
	return s.repo.FindAll(ctx)
}

func (s *galleryService) GetGalleryByID(ctx context.Context, id uint) (*models.Gallery, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *galleryService) UpdateGallery(ctx context.Context, id uint, galleryData *models.Gallery) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	existing.Title = galleryData.Title
	existing.Description = galleryData.Description
	// Note: Cover update handles separately or here? Keeping simple for now

	return s.repo.Update(ctx, existing)
}

func (s *galleryService) DeleteGallery(ctx context.Context, id uint) error {
	// Ideally delete photos from Cloudinary too, but we skip for now to simplify
	return s.repo.Delete(ctx, id)
}

func (s *galleryService) AddPhotos(ctx context.Context, galleryID uint, files []*multipart.FileHeader) error {
	_, err := s.repo.FindByID(ctx, galleryID)
	if err != nil {
		return err
	}

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			continue // Skip bad files? Or error out?
		}
		defer file.Close()

		url, err := s.mediaService.UploadImage(ctx, file, "k3arafah/galleries/photos")
		if err != nil {
			continue
		}

		photo := &models.Photo{
			GalleryID: galleryID,
			PhotoURL:  url,
		}
		_ = s.repo.AddPhoto(ctx, photo)
	}
	return nil
}

func (s *galleryService) DeletePhoto(ctx context.Context, photoID uint) error {
	return s.repo.DeletePhoto(ctx, photoID)
}

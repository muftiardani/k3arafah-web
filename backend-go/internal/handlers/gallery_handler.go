package handlers

import (
	"backend-go/internal/models"
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type GalleryHandler struct {
	service services.GalleryService
}

func NewGalleryHandler(service services.GalleryService) *GalleryHandler {
	return &GalleryHandler{service}
}

func (h *GalleryHandler) Create(c *gin.Context) {
	title := c.PostForm("title")
	description := c.PostForm("description")

	if title == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Title is required", nil)
		return
	}

	gallery := &models.Gallery{
		Title:       title,
		Description: description,
	}

	// Handle Cover File
	coverFile, _ := c.FormFile("cover")

	if err := h.service.CreateGallery(c.Request.Context(), gallery, coverFile); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Gallery created successfully", gallery)
}

func (h *GalleryHandler) GetAll(c *gin.Context) {
	galleries, err := h.service.GetAllGalleries(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Galleries fetched successfully", galleries)
}

func (h *GalleryHandler) GetDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	gallery, err := h.service.GetGalleryByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Gallery detail fetched successfully", gallery)
}

func (h *GalleryHandler) UploadPhotos(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	form, _ := c.MultipartForm()
	files := form.File["photos"]

	if len(files) == 0 {
		utils.ErrorResponse(c, http.StatusBadRequest, "No photos uploaded", nil)
		return
	}

	if err := h.service.AddPhotos(c.Request.Context(), uint(id), files); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Photos uploaded successfully", nil)
}

func (h *GalleryHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.DeleteGallery(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Gallery deleted successfully", nil)
}

func (h *GalleryHandler) DeletePhoto(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("photo_id"))
	if err := h.service.DeletePhoto(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Photo deleted successfully", nil)
}

package handlers

import (
	"backend-go/internal/dto"
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

// Create godoc
// @Summary      Create a new gallery
// @Description  Create a new gallery album (admin only)
// @Tags         galleries
// @Accept       multipart/form-data
// @Produce      json
// @Param        title        formData  string  true   "Gallery title"
// @Param        description  formData  string  false  "Gallery description"
// @Param        cover        formData  file    false  "Cover image"
// @Success      201          {object}  utils.APIResponse
// @Failure      400          {object}  utils.APIResponse
// @Failure      401          {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /galleries [post]
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

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionCreate, "gallery", &gallery.ID, nil, gallery, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusCreated, "Gallery created successfully", gallery)
}

// GetAll godoc
// @Summary      Get all galleries
// @Description  Get all gallery albums
// @Tags         galleries
// @Produce      json
// @Success      200  {object}  utils.APIResponse
// @Failure      500  {object}  utils.APIResponse
// @Router       /galleries [get]
func (h *GalleryHandler) GetAll(c *gin.Context) {
	galleries, err := h.service.GetAllGalleries(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Galleries fetched successfully", galleries)
}

// GetDetail godoc
// @Summary      Get gallery by ID
// @Description  Get a single gallery with all its photos
// @Tags         galleries
// @Produce      json
// @Param        id   path      int  true  "Gallery ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Router       /galleries/{id} [get]
func (h *GalleryHandler) GetDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	gallery, err := h.service.GetGalleryByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Gallery detail fetched successfully", gallery)
}

// UploadPhotos godoc
// @Summary      Upload photos to gallery
// @Description  Upload multiple photos to a gallery (admin only)
// @Tags         galleries
// @Accept       multipart/form-data
// @Produce      json
// @Param        id      path      int     true  "Gallery ID"
// @Param        photos  formData  file    true  "Photos to upload"
// @Success      200     {object}  utils.APIResponse
// @Failure      400     {object}  utils.APIResponse
// @Failure      401     {object}  utils.APIResponse
// @Failure      404     {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /galleries/{id}/photos [post]
func (h *GalleryHandler) UploadPhotos(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

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

// Update godoc
// @Summary      Update a gallery
// @Description  Update gallery details (admin only)
// @Tags         galleries
// @Accept       json
// @Produce      json
// @Param        id       path      int                      true  "Gallery ID"
// @Param        gallery  body      dto.UpdateGalleryRequest true  "Updated gallery data"
// @Success      200      {object}  utils.APIResponse
// @Failure      400      {object}  utils.APIResponse
// @Failure      401      {object}  utils.APIResponse
// @Failure      404      {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /galleries/{id} [put]
func (h *GalleryHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var input dto.UpdateGalleryRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	galleryData := &models.Gallery{
		Title:       input.Title,
		Description: input.Description,
	}

	if err := h.service.UpdateGallery(c.Request.Context(), uint(id), galleryData); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionUpdate, "gallery", &entityID, nil, galleryData, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Gallery updated successfully", nil)
}

// Delete godoc
// @Summary      Delete a gallery
// @Description  Delete a gallery and all its photos (admin only)
// @Tags         galleries
// @Produce      json
// @Param        id   path      int  true  "Gallery ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /galleries/{id} [delete]
func (h *GalleryHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteGallery(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionDelete, "gallery", &entityID, nil, nil, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Gallery deleted successfully", nil)
}

// DeletePhoto godoc
// @Summary      Delete a photo
// @Description  Delete a single photo from a gallery (admin only)
// @Tags         galleries
// @Produce      json
// @Param        photo_id  path      int  true  "Photo ID"
// @Success      200       {object}  utils.APIResponse
// @Failure      400       {object}  utils.APIResponse
// @Failure      401       {object}  utils.APIResponse
// @Failure      404       {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /galleries/photos/{photo_id} [delete]
func (h *GalleryHandler) DeletePhoto(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("photo_id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid photo ID", err.Error())
		return
	}

	if err := h.service.DeletePhoto(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Photo deleted successfully", nil)
}


package handlers

import (
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	service services.MediaService
}

func NewMediaHandler(service services.MediaService) *MediaHandler {
	return &MediaHandler{service}
}

// Upload godoc
// @Summary      Upload image
// @Description  Upload an image file to Cloudinary (max 5MB, JPEG/PNG/WebP/GIF only)
// @Tags         media
// @Accept       multipart/form-data
// @Produce      json
// @Param        file   formData  file    true  "Image file to upload"
// @Param        folder formData  string  false "Folder name (default: general)"
// @Success      200    {object}  utils.APIResponse{data=object{url=string}}
// @Failure      400    {object}  utils.APIResponse
// @Failure      500    {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /upload [post]
func (h *MediaHandler) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "No file uploaded", err.Error())
		return
	}
	defer file.Close()

	folder := c.DefaultPostForm("folder", "general")

	url, err := h.service.UploadImage(c.Request.Context(), file, header, "k3arafah/"+folder)
	if err != nil {
		// Check for specific validation errors
		if errors.Is(err, services.ErrFileTooLarge) || errors.Is(err, services.ErrInvalidFileType) {
			utils.ErrorResponse(c, http.StatusBadRequest, "File validation failed", err.Error())
			return
		}
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to upload image", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Image uploaded successfully", gin.H{"url": url})
}


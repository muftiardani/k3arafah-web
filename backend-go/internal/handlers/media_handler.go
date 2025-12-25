package handlers

import (
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	service services.MediaService
}

func NewMediaHandler(service services.MediaService) *MediaHandler {
	return &MediaHandler{service}
}

func (h *MediaHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "No file uploaded", err.Error())
		return
	}

	src, err := file.Open()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to open file", err.Error())
		return
	}
	defer src.Close()

	folder := c.DefaultPostForm("folder", "general")

	url, err := h.service.UploadImage(c.Request.Context(), src, "k3arafah/"+folder)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to upload image", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Image uploaded successfully", gin.H{"url": url})
}

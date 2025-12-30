package handlers

import (
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CleanupHandler struct {
	mediaService services.MediaService
}

func NewCleanupHandler(mediaService services.MediaService) *CleanupHandler {
	return &CleanupHandler{mediaService}
}

// GetCloudinaryUsage godoc
// @Summary      Get Cloudinary usage statistics
// @Description  Get storage and bandwidth usage from Cloudinary (super_admin only)
// @Tags         cleanup
// @Produce      json
// @Success      200  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      403  {object}  utils.APIResponse
// @Failure      500  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /cleanup/cloudinary/usage [get]
func (h *CleanupHandler) GetCloudinaryUsage(c *gin.Context) {
	usage, err := h.mediaService.GetUsageStats(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cloudinary usage fetched successfully", usage)
}

// DeleteImageByURL godoc
// @Summary      Delete an image from Cloudinary by URL
// @Description  Delete a specific image from Cloudinary using its URL (super_admin only)
// @Tags         cleanup
// @Accept       json
// @Produce      json
// @Param        input  body      object{url=string}  true  "Image URL to delete"
// @Success      200    {object}  utils.APIResponse
// @Failure      400    {object}  utils.APIResponse
// @Failure      401    {object}  utils.APIResponse
// @Failure      403    {object}  utils.APIResponse
// @Failure      500    {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /cleanup/cloudinary/delete [post]
func (h *CleanupHandler) DeleteImageByURL(c *gin.Context) {
	var input struct {
		URL string `json:"url" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	if err := h.mediaService.DeleteImageByURL(c.Request.Context(), input.URL); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Image deleted successfully", nil)
}

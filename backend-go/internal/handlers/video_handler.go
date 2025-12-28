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

type VideoHandler struct {
	service services.VideoService
}

func NewVideoHandler(service services.VideoService) *VideoHandler {
	return &VideoHandler{service}
}

// Create godoc
// @Summary      Create a new video
// @Description  Create a new video entry (admin only)
// @Tags         videos
// @Accept       json
// @Produce      json
// @Param        video  body      dto.CreateVideoRequest  true  "Video data"
// @Success      201    {object}  utils.APIResponse
// @Failure      400    {object}  utils.APIResponse
// @Failure      401    {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /videos [post]
func (h *VideoHandler) Create(c *gin.Context) {
	var input dto.CreateVideoRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	video := &models.Video{
		Title:     input.Title,
		YoutubeID: input.YoutubeID,
		Thumbnail: input.Thumbnail,
	}

	if err := h.service.CreateVideo(c.Request.Context(), video); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Video created successfully", video)
}

// GetAll godoc
// @Summary      Get all videos
// @Description  Get all videos
// @Tags         videos
// @Produce      json
// @Success      200  {object}  utils.APIResponse
// @Failure      500  {object}  utils.APIResponse
// @Router       /videos [get]
func (h *VideoHandler) GetAll(c *gin.Context) {
	videos, err := h.service.GetAllVideos(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Videos fetched successfully", videos)
}

// GetByID godoc
// @Summary      Get video by ID
// @Description  Get a single video by its ID (admin only)
// @Tags         videos
// @Produce      json
// @Param        id   path      int  true  "Video ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /videos/{id} [get]
func (h *VideoHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	video, err := h.service.GetVideoByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Video fetched successfully", video)
}

// Update godoc
// @Summary      Update a video
// @Description  Update an existing video (admin only)
// @Tags         videos
// @Accept       json
// @Produce      json
// @Param        id     path      int                     true  "Video ID"
// @Param        video  body      dto.UpdateVideoRequest  true  "Updated video data"
// @Success      200    {object}  utils.APIResponse
// @Failure      400    {object}  utils.APIResponse
// @Failure      401    {object}  utils.APIResponse
// @Failure      404    {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /videos/{id} [put]
func (h *VideoHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var input dto.UpdateVideoRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	// Get existing video
	existing, err := h.service.GetVideoByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Update fields
	if input.Title != "" {
		existing.Title = input.Title
	}
	if input.YoutubeID != "" {
		existing.YoutubeID = input.YoutubeID
	}
	if input.Thumbnail != "" {
		existing.Thumbnail = input.Thumbnail
	}

	if err := h.service.UpdateVideo(c.Request.Context(), existing); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Video updated successfully", existing)
}

// Delete godoc
// @Summary      Delete a video
// @Description  Delete a video (admin only)
// @Tags         videos
// @Produce      json
// @Param        id   path      int  true  "Video ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /videos/{id} [delete]
func (h *VideoHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteVideo(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Video deleted successfully", nil)
}


package handlers

import (
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

func (h *VideoHandler) Create(c *gin.Context) {
	var input struct {
		Title     string `json:"title" binding:"required"`
		YoutubeID string `json:"youtube_id" binding:"required"`
		Thumbnail string `json:"thumbnail"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
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

func (h *VideoHandler) GetAll(c *gin.Context) {
	videos, err := h.service.GetAllVideos(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Videos fetched successfully", videos)
}

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

func (h *VideoHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var input struct {
		Title     string `json:"title"`
		YoutubeID string `json:"youtube_id"`
		Thumbnail string `json:"thumbnail"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
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

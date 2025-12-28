package handlers

import (
	"backend-go/internal/models"
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AchievementHandler struct {
	service services.AchievementService
}

func NewAchievementHandler(service services.AchievementService) *AchievementHandler {
	return &AchievementHandler{service}
}

func (h *AchievementHandler) Create(c *gin.Context) {
	var req struct {
		Title       string `json:"title" binding:"required"`
		Subtitle    string `json:"subtitle"`
		Description string `json:"description"`
		Icon        string `json:"icon" binding:"required"`
		Color       string `json:"color" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	achievement := &models.Achievement{
		Title:       req.Title,
		Subtitle:    req.Subtitle,
		Description: req.Description,
		Icon:        req.Icon,
		Color:       req.Color,
	}

	if err := h.service.CreateAchievement(c.Request.Context(), achievement); err != nil {
		utils.ResponseWithError(c, utils.HandleDBError(err))
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Achievement created successfully", achievement)
}

func (h *AchievementHandler) GetAll(c *gin.Context) {
	achievements, err := h.service.GetAllAchievements(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, utils.HandleDBError(err))
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Achievements retrieved successfully", achievements)
}

func (h *AchievementHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteAchievement(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, utils.HandleDBError(err))
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Achievement deleted successfully", nil)
}

func (h *AchievementHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var req struct {
		Title       string `json:"title"`
		Subtitle    string `json:"subtitle"`
		Description string `json:"description"`
		Icon        string `json:"icon"`
		Color       string `json:"color"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body", err.Error())
		return
	}

	achievement := &models.Achievement{
		Title:       req.Title,
		Subtitle:    req.Subtitle,
		Description: req.Description,
		Icon:        req.Icon,
		Color:       req.Color,
	}

	if err := h.service.UpdateAchievement(c.Request.Context(), uint(id), achievement); err != nil {
		utils.ResponseWithError(c, utils.HandleDBError(err))
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Achievement updated successfully", nil)
}

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

type AchievementHandler struct {
	service services.AchievementService
}

func NewAchievementHandler(service services.AchievementService) *AchievementHandler {
	return &AchievementHandler{service}
}

// Create godoc
// @Summary      Create a new achievement
// @Description  Create a new achievement entry (admin only)
// @Tags         achievements
// @Accept       json
// @Produce      json
// @Param        achievement  body      dto.CreateAchievementRequest  true  "Achievement data"
// @Success      201          {object}  utils.APIResponse
// @Failure      400          {object}  utils.APIResponse
// @Failure      401          {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /achievements [post]
func (h *AchievementHandler) Create(c *gin.Context) {
	var req dto.CreateAchievementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
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
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionCreate, "achievement", &achievement.ID, nil, achievement, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusCreated, "Achievement created successfully", achievement)
}

// GetAll godoc
// @Summary      Get all achievements
// @Description  Get all achievements
// @Tags         achievements
// @Produce      json
// @Success      200  {object}  utils.APIResponse
// @Failure      500  {object}  utils.APIResponse
// @Router       /achievements [get]
func (h *AchievementHandler) GetAll(c *gin.Context) {
	achievements, err := h.service.GetAllAchievements(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Achievements retrieved successfully", achievements)
}

// Delete godoc
// @Summary      Delete an achievement
// @Description  Delete an achievement (admin only)
// @Tags         achievements
// @Produce      json
// @Param        id   path      int  true  "Achievement ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /achievements/{id} [delete]
func (h *AchievementHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteAchievement(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionDelete, "achievement", &entityID, nil, nil, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Achievement deleted successfully", nil)
}

// Update godoc
// @Summary      Update an achievement
// @Description  Update an existing achievement (admin only)
// @Tags         achievements
// @Accept       json
// @Produce      json
// @Param        id           path      int                           true  "Achievement ID"
// @Param        achievement  body      dto.UpdateAchievementRequest  true  "Updated achievement data"
// @Success      200          {object}  utils.APIResponse
// @Failure      400          {object}  utils.APIResponse
// @Failure      401          {object}  utils.APIResponse
// @Failure      404          {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /achievements/{id} [put]
func (h *AchievementHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var req dto.UpdateAchievementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
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
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionUpdate, "achievement", &entityID, nil, achievement, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Achievement updated successfully", nil)
}


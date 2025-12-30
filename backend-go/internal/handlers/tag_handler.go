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

type TagHandler struct {
	service services.TagService
}

func NewTagHandler(service services.TagService) *TagHandler {
	return &TagHandler{service}
}

// Create godoc
// @Summary      Create a new tag
// @Description  Create a new article tag (admin only)
// @Tags         tags
// @Accept       json
// @Produce      json
// @Param        tag  body      dto.CreateTagRequest  true  "Tag data"
// @Success      201  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /tags [post]
func (h *TagHandler) Create(c *gin.Context) {
	var input dto.CreateTagRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	tag := &models.Tag{
		Name: input.Name,
	}

	if err := h.service.CreateTag(c.Request.Context(), tag); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionCreate, "tag", &tag.ID, nil, tag, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusCreated, "Tag created successfully", tag)
}

// GetAll godoc
// @Summary      Get all tags
// @Description  Get all article tags
// @Tags         tags
// @Produce      json
// @Success      200  {object}  utils.APIResponse
// @Failure      500  {object}  utils.APIResponse
// @Router       /tags [get]
func (h *TagHandler) GetAll(c *gin.Context) {
	tags, err := h.service.GetAllTags(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Tags fetched successfully", tags)
}

// GetByID godoc
// @Summary      Get tag by ID
// @Description  Get a single tag by its ID
// @Tags         tags
// @Produce      json
// @Param        id   path      int  true  "Tag ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Router       /tags/{id} [get]
func (h *TagHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	tag, err := h.service.GetTagByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Tag fetched successfully", tag)
}

// Update godoc
// @Summary      Update a tag
// @Description  Update an existing tag (admin only)
// @Tags         tags
// @Accept       json
// @Produce      json
// @Param        id   path      int                   true  "Tag ID"
// @Param        tag  body      dto.UpdateTagRequest  true  "Updated tag data"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /tags/{id} [put]
func (h *TagHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var input dto.UpdateTagRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	tag := &models.Tag{
		Name: input.Name,
	}

	if err := h.service.UpdateTag(c.Request.Context(), uint(id), tag); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionUpdate, "tag", &entityID, nil, tag, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Tag updated successfully", nil)
}

// Delete godoc
// @Summary      Delete a tag
// @Description  Delete a tag (admin only)
// @Tags         tags
// @Produce      json
// @Param        id   path      int  true  "Tag ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /tags/{id} [delete]
func (h *TagHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteTag(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionDelete, "tag", &entityID, nil, nil, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Tag deleted successfully", nil)
}

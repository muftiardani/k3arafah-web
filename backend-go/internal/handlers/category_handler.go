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

type CategoryHandler struct {
	service services.CategoryService
}

func NewCategoryHandler(service services.CategoryService) *CategoryHandler {
	return &CategoryHandler{service}
}

// Create godoc
// @Summary      Create a new category
// @Description  Create a new article category (admin only)
// @Tags         categories
// @Accept       json
// @Produce      json
// @Param        category  body      dto.CreateCategoryRequest  true  "Category data"
// @Success      201       {object}  utils.APIResponse
// @Failure      400       {object}  utils.APIResponse
// @Failure      401       {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /categories [post]
func (h *CategoryHandler) Create(c *gin.Context) {
	var input dto.CreateCategoryRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	category := &models.Category{
		Name:        input.Name,
		Description: input.Description,
	}

	if err := h.service.CreateCategory(c.Request.Context(), category); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionCreate, "category", &category.ID, nil, category, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusCreated, "Category created successfully", category)
}

// GetAll godoc
// @Summary      Get all categories
// @Description  Get all article categories
// @Tags         categories
// @Produce      json
// @Success      200  {object}  utils.APIResponse
// @Failure      500  {object}  utils.APIResponse
// @Router       /categories [get]
func (h *CategoryHandler) GetAll(c *gin.Context) {
	categories, err := h.service.GetAllCategories(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Categories fetched successfully", categories)
}

// GetByID godoc
// @Summary      Get category by ID
// @Description  Get a single category by its ID
// @Tags         categories
// @Produce      json
// @Param        id   path      int  true  "Category ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Router       /categories/{id} [get]
func (h *CategoryHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	category, err := h.service.GetCategoryByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Category fetched successfully", category)
}

// Update godoc
// @Summary      Update a category
// @Description  Update an existing category (admin only)
// @Tags         categories
// @Accept       json
// @Produce      json
// @Param        id        path      int                        true  "Category ID"
// @Param        category  body      dto.UpdateCategoryRequest  true  "Updated category data"
// @Success      200       {object}  utils.APIResponse
// @Failure      400       {object}  utils.APIResponse
// @Failure      401       {object}  utils.APIResponse
// @Failure      404       {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /categories/{id} [put]
func (h *CategoryHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var input dto.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	category := &models.Category{
		Name:        input.Name,
		Description: input.Description,
	}

	if err := h.service.UpdateCategory(c.Request.Context(), uint(id), category); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionUpdate, "category", &entityID, nil, category, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Category updated successfully", nil)
}

// Delete godoc
// @Summary      Delete a category
// @Description  Delete a category (admin only)
// @Tags         categories
// @Produce      json
// @Param        id   path      int  true  "Category ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /categories/{id} [delete]
func (h *CategoryHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteCategory(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionDelete, "category", &entityID, nil, nil, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Category deleted successfully", nil)
}

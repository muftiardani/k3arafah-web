package handlers

import (
	"backend-go/internal/consts"
	"backend-go/internal/dto"
	"backend-go/internal/models"
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ArticleHandler struct {
	service services.ArticleService
}

func NewArticleHandler(service services.ArticleService) *ArticleHandler {
	return &ArticleHandler{service}
}

// Create godoc
// @Summary      Create a new article
// @Description  Create a new article (admin only)
// @Tags         articles
// @Accept       json
// @Produce      json
// @Param        article  body      models.Article  true  "Article data"
// @Success      201      {object}  utils.APIResponse
// @Failure      400      {object}  utils.APIResponse
// @Failure      401      {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /articles [post]
func (h *ArticleHandler) Create(c *gin.Context) {
	var input dto.CreateArticleRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.ResponseWithError(c, utils.ErrUnauthorized)
		return
	}

	article := &models.Article{
		Title:        input.Title,
		Content:      input.Content,
		ThumbnailURL: input.ThumbnailURL,
		IsPublished:  input.IsPublished,
		AuthorID:     userID.(uint),
	}

	if err := h.service.CreateArticle(c.Request.Context(), article); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Article created successfully", article)
}

// GetAll godoc
// @Summary      Get all articles
// @Description  Get all articles with optional pagination
// @Tags         articles
// @Produce      json
// @Param        page   query     int  false  "Page number"
// @Param        limit  query     int  false  "Items per page"
// @Success      200    {object}  utils.APIResponse
// @Failure      500    {object}  utils.APIResponse
// @Router       /articles [get]
func (h *ArticleHandler) GetAll(c *gin.Context) {
	pageStr := c.Query("page")
	limitStr := c.Query("limit")

	if pageStr != "" || limitStr != "" {
		page, _ := strconv.Atoi(pageStr)
		if page < 1 {
			page = consts.DefaultPage
		}
		
		limit, _ := strconv.Atoi(limitStr)
		if limit < 1 {
			limit = consts.DefaultPageLimit
		} else if limit > consts.MaxPageLimit {
			limit = consts.MaxPageLimit
		}

		articles, total, err := h.service.GetAllArticlesPaginated(c.Request.Context(), page, limit)
		if err != nil {
			utils.ResponseWithError(c, err)
			return
		}
		
		utils.SuccessResponsePaginated(c, http.StatusOK, "Articles fetched successfully", articles, page, limit, total)
		return
	}

	articles, err := h.service.GetAllArticles(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Articles fetched successfully", articles)
}

// GetDetail godoc
// @Summary      Get article by ID
// @Description  Get a single article by its ID
// @Tags         articles
// @Produce      json
// @Param        id   path      int  true  "Article ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Router       /articles/{id} [get]
func (h *ArticleHandler) GetDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	article, err := h.service.GetArticleByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article detail fetched successfully", article)
}

// GetDetailBySlug godoc
// @Summary      Get article by slug
// @Description  Get a single article by its URL slug
// @Tags         articles
// @Produce      json
// @Param        slug  path      string  true  "Article slug"
// @Success      200   {object}  utils.APIResponse
// @Failure      404   {object}  utils.APIResponse
// @Router       /articles/slug/{slug} [get]
func (h *ArticleHandler) GetDetailBySlug(c *gin.Context) {
	slug := c.Param("slug")
	article, err := h.service.GetArticleBySlug(c.Request.Context(), slug)
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article detail fetched successfully", article)
}

// Update godoc
// @Summary      Update an article
// @Description  Update an existing article (admin only)
// @Tags         articles
// @Accept       json
// @Produce      json
// @Param        id       path      int             true  "Article ID"
// @Param        article  body      models.Article  true  "Updated article data"
// @Success      200      {object}  utils.APIResponse
// @Failure      400      {object}  utils.APIResponse
// @Failure      401      {object}  utils.APIResponse
// @Failure      404      {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /articles/{id} [put]
func (h *ArticleHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var input dto.UpdateArticleRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	article := &models.Article{
		Title:        input.Title,
		Content:      input.Content,
		ThumbnailURL: input.ThumbnailURL,
	}
	if input.IsPublished != nil {
		article.IsPublished = *input.IsPublished
	}

	if err := h.service.UpdateArticle(c.Request.Context(), uint(id), article); err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article updated successfully", nil)
}

// Delete godoc
// @Summary      Delete an article
// @Description  Delete an article (admin only)
// @Tags         articles
// @Produce      json
// @Param        id   path      int  true  "Article ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /articles/{id} [delete]
func (h *ArticleHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteArticle(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article deleted successfully", nil)
}


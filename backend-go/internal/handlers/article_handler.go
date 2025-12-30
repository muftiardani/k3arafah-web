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

	// Log activity
	services.LogActivityAsync(c.Request.Context(), userID.(uint), models.ActionCreate, "article", &article.ID, nil, article, c.ClientIP(), c.GetHeader("User-Agent"))

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

// Search godoc
// @Summary      Search articles
// @Description  Search articles by title or content
// @Tags         articles
// @Produce      json
// @Param        q      query     string  true   "Search query"
// @Param        page   query     int     false  "Page number (default: 1)"
// @Param        limit  query     int     false  "Items per page (default: 10)"
// @Success      200    {object}  utils.APIResponse
// @Failure      400    {object}  utils.APIResponse
// @Router       /articles/search [get]
func (h *ArticleHandler) Search(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Query parameter 'q' is required", nil)
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}

	articles, total, err := h.service.SearchArticles(c.Request.Context(), query, page, limit)
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	response := map[string]interface{}{
		"items": articles,
		"meta": map[string]interface{}{
			"page":        page,
			"limit":       limit,
			"total_items": total,
			"total_pages": totalPages,
			"query":       query,
		},
	}

	utils.SuccessResponse(c, http.StatusOK, "Search results fetched successfully", response)
}

// GetByCategory godoc
// @Summary      Get articles by category
// @Description  Get articles filtered by category ID
// @Tags         articles
// @Produce      json
// @Param        category_id  query     int  true   "Category ID"
// @Param        page         query     int  false  "Page number (default: 1)"
// @Param        limit        query     int  false  "Items per page (default: 10)"
// @Success      200          {object}  utils.APIResponse
// @Failure      400          {object}  utils.APIResponse
// @Router       /articles/category [get]
func (h *ArticleHandler) GetByCategory(c *gin.Context) {
	categoryIDStr := c.Query("category_id")
	if categoryIDStr == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Query parameter 'category_id' is required", nil)
		return
	}

	categoryID, err := strconv.Atoi(categoryIDStr)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid category_id", err.Error())
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}

	articles, total, err := h.service.GetArticlesByCategory(c.Request.Context(), uint(categoryID), page, limit)
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	response := map[string]interface{}{
		"items": articles,
		"meta": map[string]interface{}{
			"page":        page,
			"limit":       limit,
			"total_items": total,
			"total_pages": totalPages,
			"category_id": categoryID,
		},
	}

	utils.SuccessResponse(c, http.StatusOK, "Articles by category fetched successfully", response)
}

// GetByTag godoc
// @Summary      Get articles by tag
// @Description  Get articles filtered by tag ID
// @Tags         articles
// @Produce      json
// @Param        tag_id  query     int  true   "Tag ID"
// @Param        page    query     int  false  "Page number (default: 1)"
// @Param        limit   query     int  false  "Items per page (default: 10)"
// @Success      200     {object}  utils.APIResponse
// @Failure      400     {object}  utils.APIResponse
// @Router       /articles/tag [get]
func (h *ArticleHandler) GetByTag(c *gin.Context) {
	tagIDStr := c.Query("tag_id")
	if tagIDStr == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Query parameter 'tag_id' is required", nil)
		return
	}

	tagID, err := strconv.Atoi(tagIDStr)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid tag_id", err.Error())
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}

	articles, total, err := h.service.GetArticlesByTag(c.Request.Context(), uint(tagID), page, limit)
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	response := map[string]interface{}{
		"items": articles,
		"meta": map[string]interface{}{
			"page":        page,
			"limit":       limit,
			"total_items": total,
			"total_pages": totalPages,
			"tag_id":      tagID,
		},
	}

	utils.SuccessResponse(c, http.StatusOK, "Articles by tag fetched successfully", response)
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

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionUpdate, "article", &entityID, nil, article, c.ClientIP(), c.GetHeader("User-Agent"))
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

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionDelete, "article", &entityID, nil, nil, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Article deleted successfully", nil)
}


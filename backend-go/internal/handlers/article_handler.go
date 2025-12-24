package handlers

import (
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

func (h *ArticleHandler) Create(c *gin.Context) {
	var article models.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	// Get user_id from context
	if userID, exists := c.Get("user_id"); exists {
		article.AuthorID = userID.(uint)
	} else {
		utils.ResponseWithError(c, utils.ErrUnauthorized)
		return
	}

	if err := h.service.CreateArticle(c.Request.Context(), &article); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Article created successfully", article)
}

func (h *ArticleHandler) GetAll(c *gin.Context) {
	articles, err := h.service.GetAllArticles(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Articles fetched successfully", articles)
}

func (h *ArticleHandler) GetDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	article, err := h.service.GetArticleByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article detail fetched successfully", article)
}

func (h *ArticleHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var article models.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := h.service.UpdateArticle(c.Request.Context(), uint(id), &article); err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article updated successfully", nil)
}

func (h *ArticleHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.DeleteArticle(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article deleted successfully", nil)
}

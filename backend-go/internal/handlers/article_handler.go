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
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	
	if err := h.service.CreateArticle(&article); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create article", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Article created successfully", article)
}

func (h *ArticleHandler) GetAll(c *gin.Context) {
	articles, err := h.service.GetAllArticles()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch articles", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Articles fetched successfully", articles)
}

func (h *ArticleHandler) GetDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	article, err := h.service.GetArticleByID(uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Article not found", err.Error())
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

	if err := h.service.UpdateArticle(uint(id), &article); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update article", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article updated successfully", nil)
}

func (h *ArticleHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.DeleteArticle(uint(id)); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete article", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Article deleted successfully", nil)
}

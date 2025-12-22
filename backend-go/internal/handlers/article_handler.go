package handlers

import (
	"backend-go/internal/models"
	"backend-go/internal/services"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user_id from context
	if userID, exists := c.Get("user_id"); exists {
		article.AuthorID = userID.(uint)
	} else {
		// Fallback for dev/test or if middleware didn't set it (shouldn't happen with auth)
		// For now we error or set to 1 if we know admin exists
		// But better to return unauthorized if not found
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	
	if err := h.service.CreateArticle(&article); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create article"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Article created successfully", "data": article})
}

func (h *ArticleHandler) GetAll(c *gin.Context) {
	articles, err := h.service.GetAllArticles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch articles"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": articles})
}

func (h *ArticleHandler) GetDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	article, err := h.service.GetArticleByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": article})
}

func (h *ArticleHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var article models.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateArticle(uint(id), &article); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update article"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Article updated successfully"})
}

func (h *ArticleHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.DeleteArticle(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete article"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Article deleted successfully"})
}

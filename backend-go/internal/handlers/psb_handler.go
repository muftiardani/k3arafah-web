package handlers

import (
	"backend-go/internal/models"
	"backend-go/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PSBHandler struct {
	service services.PSBService
}

func NewPSBHandler(service services.PSBService) *PSBHandler {
	return &PSBHandler{service}
}

func (h *PSBHandler) Register(c *gin.Context) {
	var santri models.Santri
	if err := c.ShouldBindJSON(&santri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.RegisterSantri(&santri); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register santri"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registration successful", "data": santri})
}

func (h *PSBHandler) GetAll(c *gin.Context) {
	santris, err := h.service.GetAllRegistrants()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": santris})
}

func (h *PSBHandler) GetDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	santri, err := h.service.GetRegistrantID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Santri not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": santri})
}

func (h *PSBHandler) UpdateStatus(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var input struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateStatus(uint(id), input.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}

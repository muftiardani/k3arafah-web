package handlers

import (
	"backend-go/internal/models"
	"backend-go/internal/services"
	"backend-go/internal/utils"
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
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := h.service.RegisterSantri(c.Request.Context(), &santri); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Registration successful", santri)
}

func (h *PSBHandler) GetAll(c *gin.Context) {
	santris, err := h.service.GetAllRegistrants(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Data fetched successfully", santris)
}

func (h *PSBHandler) GetDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	santri, err := h.service.GetRegistrantID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Detail fetched successfully", santri)
}

func (h *PSBHandler) UpdateStatus(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var input struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid status input", err.Error())
		return
	}

	if err := h.service.UpdateStatus(c.Request.Context(), uint(id), input.Status); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Status updated successfully", nil)
}

func (h *PSBHandler) Verify(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var input struct {
		NIS       string `json:"nis" binding:"required"`
		Class     string `json:"class" binding:"required"`
		EntryYear int    `json:"entry_year" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := h.service.VerifySantri(c.Request.Context(), uint(id), input.NIS, input.Class, input.EntryYear); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Santri verified and accepted successfully", nil)
}

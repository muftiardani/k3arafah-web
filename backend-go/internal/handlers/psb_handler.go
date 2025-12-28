package handlers

import (
	"backend-go/internal/dto"
	"backend-go/internal/models"
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type PSBHandler struct {
	service services.PSBService
}

func NewPSBHandler(service services.PSBService) *PSBHandler {
	return &PSBHandler{service}
}

func (h *PSBHandler) Register(c *gin.Context) {
	var input dto.RegisterSantriRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	// Parse birth date
	birthDate, err := time.Parse("2006-01-02", input.BirthDate)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid birth date format", "Use YYYY-MM-DD format")
		return
	}

	// Convert DTO to Model
	santri := &models.Santri{
		FullName:    input.FullName,
		NIK:         input.NIK,
		BirthPlace:  input.BirthPlace,
		BirthDate:   birthDate,
		Gender:      input.Gender,
		Address:     input.Address,
		ParentName:  input.FatherName, // Using father name as parent name
		ParentPhone: input.ParentPhone,
		PhotoURL:    input.PhotoURL,
		Status:      models.StatusPending,
	}

	if err := h.service.RegisterSantri(c.Request.Context(), santri); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Registration successful", santri)
}

func (h *PSBHandler) GetAll(c *gin.Context) {
	// Optional status filter
	status := c.Query("status")
	
	var santris []models.Santri
	var err error

	if status != "" {
		// Validate status
		validStatuses := map[string]bool{
			"PENDING":  true,
			"VERIFIED": true,
			"ACCEPTED": true,
			"REJECTED": true,
		}
		if !validStatuses[status] {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid status", "Status must be one of: PENDING, VERIFIED, ACCEPTED, REJECTED")
			return
		}
		santris, err = h.service.GetRegistrantsByStatus(c.Request.Context(), status)
	} else {
		santris, err = h.service.GetAllRegistrants(c.Request.Context())
	}

	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Data fetched successfully", santris)
}

func (h *PSBHandler) GetDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	santri, err := h.service.GetRegistrantByID(c.Request.Context(), uint(id))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Detail fetched successfully", santri)
}

func (h *PSBHandler) UpdateStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

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
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

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

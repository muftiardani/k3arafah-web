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

// Register godoc
// @Summary      Register new santri
// @Description  Register a new santri for PSB (public)
// @Tags         psb
// @Accept       json
// @Produce      json
// @Param        santri  body      dto.RegisterSantriRequest  true  "Registration data"
// @Success      201     {object}  utils.APIResponse
// @Failure      400     {object}  utils.APIResponse
// @Router       /psb/register [post]
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

// GetAll godoc
// @Summary      Get all registrants
// @Description  Get all PSB registrants with optional status filter (admin only)
// @Tags         psb
// @Produce      json
// @Param        status  query     string  false  "Filter by status (PENDING, VERIFIED, ACCEPTED, REJECTED)"
// @Success      200     {object}  utils.APIResponse
// @Failure      400     {object}  utils.APIResponse
// @Failure      401     {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /psb/registrants [get]
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

// GetDetail godoc
// @Summary      Get registrant by ID
// @Description  Get a single registrant's detail (admin only)
// @Tags         psb
// @Produce      json
// @Param        id   path      int  true  "Registrant ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /psb/registrants/{id} [get]
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

// UpdateStatus godoc
// @Summary      Update registrant status
// @Description  Update the status of a registrant (admin only)
// @Tags         psb
// @Accept       json
// @Produce      json
// @Param        id      path      int                         true  "Registrant ID"
// @Param        status  body      object{status=string}       true  "New status"
// @Success      200     {object}  utils.APIResponse
// @Failure      400     {object}  utils.APIResponse
// @Failure      401     {object}  utils.APIResponse
// @Failure      404     {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /psb/registrants/{id}/status [put]
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

// Verify godoc
// @Summary      Verify and accept santri
// @Description  Verify a registrant and accept them as santri (admin only)
// @Tags         psb
// @Accept       json
// @Produce      json
// @Param        id     path      int                                          true  "Registrant ID"
// @Param        input  body      object{nis=string,class=string,entry_year=int}  true  "Verification data"
// @Success      200    {object}  utils.APIResponse
// @Failure      400    {object}  utils.APIResponse
// @Failure      401    {object}  utils.APIResponse
// @Failure      404    {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /psb/registrants/{id}/verify [put]
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
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	if err := h.service.VerifySantri(c.Request.Context(), uint(id), input.NIS, input.Class, input.EntryYear); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Santri verified and accepted successfully", nil)
}

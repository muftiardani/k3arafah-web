package handlers

import (
	"backend-go/internal/dto"
	"backend-go/internal/models"
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"fmt"
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

	// Send confirmation email asynchronously
	if input.ParentPhone != "" {
		registrationID := fmt.Sprintf("REG-%d", santri.ID)
		services.SendPSBConfirmationAsync(input.ParentPhone, input.FullName, registrationID)
	}

	utils.SuccessResponse(c, http.StatusCreated, "Registration successful", santri)
}

// GetAll godoc
// @Summary      Get all registrants
// @Description  Get all PSB registrants with optional status filter and pagination (admin only)
// @Tags         psb
// @Produce      json
// @Param        status  query     string  false  "Filter by status (PENDING, VERIFIED, ACCEPTED, REJECTED)"
// @Param        page    query     int     false  "Page number (default: 1)"
// @Param        limit   query     int     false  "Items per page (default: 10)"
// @Success      200     {object}  utils.APIResponse
// @Failure      400     {object}  utils.APIResponse
// @Failure      401     {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /psb/registrants [get]
func (h *PSBHandler) GetAll(c *gin.Context) {
	status := c.Query("status")
	pageStr := c.DefaultQuery("page", "0")
	limitStr := c.DefaultQuery("limit", "0")

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)

	// Validate status if provided
	if status != "" {
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
	}

	// If pagination params provided, use paginated query
	if page > 0 && limit > 0 {
		santris, total, err := h.service.GetRegistrantsPaginated(c.Request.Context(), page, limit, status)
		if err != nil {
			utils.ResponseWithError(c, err)
			return
		}

		totalPages := int(total) / limit
		if int(total)%limit > 0 {
			totalPages++
		}

		response := dto.PaginatedSantriResponse{
			Items: make([]interface{}, len(santris)),
			Meta: dto.PaginationMeta{
				Page:       page,
				Limit:      limit,
				TotalItems: total,
				TotalPages: totalPages,
			},
		}
		for i, s := range santris {
			response.Items[i] = s
		}

		utils.SuccessResponse(c, http.StatusOK, "Data fetched successfully", response)
		return
	}

	// Non-paginated query (backward compatible)
	var santris []models.Santri
	var err error

	if status != "" {
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

// Update godoc
// @Summary      Update registrant data
// @Description  Update a registrant's data (admin only)
// @Tags         psb
// @Accept       json
// @Produce      json
// @Param        id     path      int                      true  "Registrant ID"
// @Param        input  body      dto.UpdateSantriRequest  true  "Update data"
// @Success      200    {object}  utils.APIResponse
// @Failure      400    {object}  utils.APIResponse
// @Failure      401    {object}  utils.APIResponse
// @Failure      404    {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /psb/registrants/{id} [put]
func (h *PSBHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var input dto.UpdateSantriRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	santri := &models.Santri{
		FullName:    input.FullName,
		NIK:         input.NIK,
		BirthPlace:  input.BirthPlace,
		Gender:      input.Gender,
		Address:     input.Address,
		ParentName:  input.ParentName,
		ParentPhone: input.ParentPhone,
		PhotoURL:    input.PhotoURL,
	}

	// Parse birth date if provided
	if input.BirthDate != "" {
		birthDate, err := time.Parse("2006-01-02", input.BirthDate)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid birth date format", "Use YYYY-MM-DD format")
			return
		}
		santri.BirthDate = birthDate
	}

	if err := h.service.UpdateSantri(c.Request.Context(), uint(id), santri); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionUpdate, "santri", &entityID, nil, santri, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Santri updated successfully", nil)
}

// Delete godoc
// @Summary      Delete registrant
// @Description  Delete a registrant (admin only)
// @Tags         psb
// @Produce      json
// @Param        id   path      int  true  "Registrant ID"
// @Success      200  {object}  utils.APIResponse
// @Failure      400  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      404  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /psb/registrants/{id} [delete]
func (h *PSBHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteSantri(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionDelete, "santri", &entityID, nil, nil, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Santri deleted successfully", nil)
}

// UpdateStatus godoc
// @Summary      Update registrant status
// @Description  Update the status of a registrant (admin only)
// @Tags         psb
// @Accept       json
// @Produce      json
// @Param        id      path      int                            true  "Registrant ID"
// @Param        status  body      dto.UpdateSantriStatusRequest  true  "New status"
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

	var input dto.UpdateSantriStatusRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	// Get santri data for email notification before update
	santri, _ := h.service.GetRegistrantByID(c.Request.Context(), uint(id))

	if err := h.service.UpdateStatus(c.Request.Context(), uint(id), input.Status); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity and send email notification
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionUpdate, "santri", &entityID, nil, map[string]string{"status": input.Status}, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	// Send status update email if santri data is available
	if santri != nil && santri.ParentPhone != "" {
		services.SendStatusUpdateAsync(santri.ParentPhone, santri.FullName, input.Status)
	}

	utils.SuccessResponse(c, http.StatusOK, "Status updated successfully", nil)
}

// Verify godoc
// @Summary      Verify and accept santri
// @Description  Verify a registrant and accept them as santri (admin only)
// @Tags         psb
// @Accept       json
// @Produce      json
// @Param        id     path      int                      true  "Registrant ID"
// @Param        input  body      dto.VerifySantriRequest  true  "Verification data"
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

	var input dto.VerifySantriRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	if err := h.service.VerifySantri(c.Request.Context(), uint(id), input.NIS, input.Class, input.EntryYear); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Log activity
	userID, _ := c.Get("user_id")
	if uid, ok := userID.(uint); ok {
		entityID := uint(id)
		services.LogActivityAsync(c.Request.Context(), uid, models.ActionVerify, "santri", &entityID, nil, map[string]string{"nis": input.NIS, "class": input.Class}, c.ClientIP(), c.GetHeader("User-Agent"))
	}

	utils.SuccessResponse(c, http.StatusOK, "Santri verified and accepted successfully", nil)
}

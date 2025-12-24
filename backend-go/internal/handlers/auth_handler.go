package handlers

import (
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service services.AuthService
}

func NewAuthHandler(service services.AuthService) *AuthHandler {
	return &AuthHandler{service}
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// Login godoc
// @Summary      Login admin
// @Description  Login with username and password to get JWT token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input body LoginRequest true "Login Input"
// @Success      200  {object} map[string]string
// @Failure      400  {object} map[string]string
// @Failure      401  {object} map[string]string
// @Router       /login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var input LoginRequest

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid JSON format", err.Error())
		return
	}

	if err := utils.ValidateStruct(input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	token, err := h.service.Login(c.Request.Context(), input.Username, input.Password)
	if err != nil {
		// ResponseWithError will maps ErrUnauthorized to 401
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Login successful", gin.H{"token": token})
}

func (h *AuthHandler) CreateAdmin(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required,min=6"`
		Role     string `json:"role"` // Optional
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := h.service.RegisterAdmin(c.Request.Context(), input.Username, input.Password, input.Role); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Admin created successfully", nil)
}

func (h *AuthHandler) GetAllAdmins(c *gin.Context) {
	admins, err := h.service.GetAllAdmins(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Admins fetched successfully", admins)
}

func (h *AuthHandler) DeleteAdmin(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteAdmin(c.Request.Context(), uint(id)); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Admin deleted successfully", nil)
}

package handlers

import (
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service services.AuthService
}

func NewAuthHandler(service services.AuthService) *AuthHandler {
	return &AuthHandler{service}
}

type RegisterRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required,min=6"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// Register godoc
// @Summary      Register a new admin
// @Description  Register a new admin user (Development only)
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input body RegisterRequest true "Register Input"
// @Success      201  {object} map[string]string
// @Failure      400  {object} map[string]string
// @Failure      500  {object} map[string]string
// @Router       /register-admin [post]
// @Router       /register-admin [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var input RegisterRequest

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid JSON format", err.Error())
		return
	}

	if err := utils.ValidateStruct(input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	if err := h.service.RegisterAdmin(c.Request.Context(), input.Username, input.Password); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create user", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "User registered successfully", nil)
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
		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid credentials", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Login successful", gin.H{"token": token})
}

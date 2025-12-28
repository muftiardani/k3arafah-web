package handlers

import (
	"backend-go/internal/dto"
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

// Login godoc
// @Summary      Login admin
// @Description  Login with username and password to get JWT tokens
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input body dto.LoginRequest true "Login Credentials"
// @Success      200  {object} utils.APIResponse{data=dto.TokenPair}
// @Failure      400  {object} utils.APIResponse
// @Failure      401  {object} utils.APIResponse
// @Router       /login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var input dto.LoginRequest

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input or validation failed", err.Error())
		return
	}

	tokenPair, err := h.service.Login(c.Request.Context(), input.Username, input.Password)
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Set access token in HttpOnly cookie
	c.SetCookie("auth_token", tokenPair.AccessToken, int(tokenPair.ExpiresIn), "/", "", false, true)
	
	// Set refresh token in HttpOnly cookie with longer expiry
	c.SetCookie("refresh_token", tokenPair.RefreshToken, 7*24*3600, "/", "", false, true)

	// Return tokens in response body as well (for mobile/API clients)
	utils.SuccessResponse(c, http.StatusOK, "Login successful", tokenPair)
}

// RefreshToken godoc
// @Summary      Refresh access token
// @Description  Use refresh token to get new access token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input body dto.RefreshTokenRequest true "Refresh Token"
// @Success      200  {object} utils.APIResponse{data=dto.TokenPair}
// @Failure      400  {object} utils.APIResponse
// @Failure      401  {object} utils.APIResponse
// @Router       /refresh [post]
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var input dto.RefreshTokenRequest

	// Try to get refresh token from cookie first
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		// If not in cookie, try request body
		if err := c.ShouldBindJSON(&input); err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Refresh token required", err.Error())
			return
		}
		refreshToken = input.RefreshToken
	}

	tokenPair, err := h.service.RefreshToken(c.Request.Context(), refreshToken)
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	// Update cookies with new tokens
	c.SetCookie("auth_token", tokenPair.AccessToken, int(tokenPair.ExpiresIn), "/", "", false, true)
	c.SetCookie("refresh_token", tokenPair.RefreshToken, 7*24*3600, "/", "", false, true)

	utils.SuccessResponse(c, http.StatusOK, "Token refreshed successfully", tokenPair)
}

// Logout godoc
// @Summary      Logout admin
// @Description  Clear authentication cookies
// @Tags         auth
// @Produce      json
// @Success      200  {object} utils.APIResponse
// @Router       /logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
	// Get refresh token from cookie to blacklist it
	if refreshToken, err := c.Cookie("refresh_token"); err == nil && refreshToken != "" {
		// Blacklist the refresh token to prevent reuse
		_ = h.service.BlacklistToken(c.Request.Context(), refreshToken)
	}

	// Clear both cookies
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)
	utils.SuccessResponse(c, http.StatusOK, "Logout successful", nil)
}

// CreateAdmin godoc
// @Summary      Create new admin
// @Description  Create a new admin user (Super Admin only)
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        input body dto.CreateAdminRequest true "Admin Data"
// @Success      201  {object} utils.APIResponse
// @Failure      400  {object} utils.APIResponse
// @Failure      401  {object} utils.APIResponse
// @Security     BearerAuth
// @Router       /admins [post]
func (h *AuthHandler) CreateAdmin(c *gin.Context) {
	var input dto.CreateAdminRequest

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	if err := h.service.RegisterAdmin(c.Request.Context(), input.Username, input.Password, ""); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Admin created successfully", nil)
}

// GetAllAdmins godoc
// @Summary      Get all admins
// @Description  Retrieve list of all admin users
// @Tags         auth
// @Produce      json
// @Success      200  {object} utils.APIResponse{data=[]models.User}
// @Failure      401  {object} utils.APIResponse
// @Security     BearerAuth
// @Router       /admins [get]
func (h *AuthHandler) GetAllAdmins(c *gin.Context) {
	admins, err := h.service.GetAllAdmins(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Admins fetched successfully", admins)
}

// DeleteAdmin godoc
// @Summary      Delete admin
// @Description  Delete an admin user by ID
// @Tags         auth
// @Produce      json
// @Param        id   path      int  true  "Admin ID"
// @Success      200  {object} utils.APIResponse
// @Failure      400  {object} utils.APIResponse
// @Failure      401  {object} utils.APIResponse
// @Security     BearerAuth
// @Router       /admins/{id} [delete]
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

// UpdateAdminPassword godoc
// @Summary      Update admin password
// @Description  Update password for an admin user (Super Admin only)
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        id   path      int  true  "Admin ID"
// @Param        input body dto.ChangePasswordRequest true "New Password"
// @Success      200  {object} utils.APIResponse
// @Failure      400  {object} utils.APIResponse
// @Failure      401  {object} utils.APIResponse
// @Security     BearerAuth
// @Router       /admins/{id}/password [put]
func (h *AuthHandler) UpdateAdminPassword(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var input dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Validation failed", err.Error())
		return
	}

	if err := h.service.UpdateAdminPassword(c.Request.Context(), uint(id), input.Password); err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Password updated successfully", nil)
}

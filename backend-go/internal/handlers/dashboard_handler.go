package handlers

import (
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	service services.DashboardService
}

func NewDashboardHandler(service services.DashboardService) *DashboardHandler {
	return &DashboardHandler{service}
}

// GetStats godoc
// @Summary      Get dashboard statistics
// @Description  Get dashboard statistics (admin only)
// @Tags         dashboard
// @Produce      json
// @Success      200  {object}  utils.APIResponse
// @Failure      401  {object}  utils.APIResponse
// @Failure      500  {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /dashboard/stats [get]
func (h *DashboardHandler) GetStats(c *gin.Context) {
	stats, err := h.service.GetStats(c.Request.Context())
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Dashboard stats fetched successfully", stats)
}

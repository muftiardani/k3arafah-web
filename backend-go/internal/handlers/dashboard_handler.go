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

func (h *DashboardHandler) GetStats(c *gin.Context) {
	stats, err := h.service.GetStats(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard stats", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Dashboard stats fetched successfully", stats)
}

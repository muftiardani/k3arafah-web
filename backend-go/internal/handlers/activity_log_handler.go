package handlers

import (
	"backend-go/internal/models"
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ActivityLogHandler struct {
	service services.ActivityLogService
}

func NewActivityLogHandler(service services.ActivityLogService) *ActivityLogHandler {
	return &ActivityLogHandler{service}
}

// GetAll godoc
// @Summary      Get all activity logs
// @Description  Get paginated activity logs (super_admin only)
// @Tags         activity-logs
// @Produce      json
// @Param        page    query     int     false  "Page number (default: 1)"
// @Param        limit   query     int     false  "Items per page (default: 20)"
// @Param        user_id query     int     false  "Filter by user ID"
// @Param        action  query     string  false  "Filter by action (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VERIFY)"
// @Success      200     {object}  utils.APIResponse
// @Failure      401     {object}  utils.APIResponse
// @Failure      403     {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /activity-logs [get]
func (h *ActivityLogHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	userIDStr := c.Query("user_id")
	action := c.Query("action")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	var logs []models.ActivityLog
	var total int64
	var err error

	ctx := c.Request.Context()

	if userIDStr != "" {
		userID, _ := strconv.Atoi(userIDStr)
		logs, total, err = h.service.GetLogsByUser(ctx, uint(userID), page, limit)
	} else if action != "" {
		logs, total, err = h.service.GetLogsByAction(ctx, models.ActivityAction(action), page, limit)
	} else {
		logs, total, err = h.service.GetAllLogs(ctx, page, limit)
	}

	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	response := gin.H{
		"items": logs,
		"meta": gin.H{
			"page":        page,
			"limit":       limit,
			"total_items": total,
			"total_pages": totalPages,
		},
	}

	utils.SuccessResponse(c, http.StatusOK, "Activity logs fetched successfully", response)
}

// GetByEntity godoc
// @Summary      Get activity logs by entity
// @Description  Get activity logs for a specific entity (super_admin only)
// @Tags         activity-logs
// @Produce      json
// @Param        entity_type  path      string  true  "Entity type (article, santri, gallery, etc.)"
// @Param        entity_id    path      int     true  "Entity ID"
// @Success      200          {object}  utils.APIResponse
// @Failure      400          {object}  utils.APIResponse
// @Failure      401          {object}  utils.APIResponse
// @Failure      403          {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /activity-logs/{entity_type}/{entity_id} [get]
func (h *ActivityLogHandler) GetByEntity(c *gin.Context) {
	entityType := c.Param("entity_type")
	entityID, err := strconv.Atoi(c.Param("entity_id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid entity ID", err.Error())
		return
	}

	logs, err := h.service.GetLogsByEntity(c.Request.Context(), entityType, uint(entityID))
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Activity logs fetched successfully", logs)
}

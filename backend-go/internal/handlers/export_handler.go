package handlers

import (
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ExportHandler struct {
	service services.ExportService
}

func NewExportHandler(service services.ExportService) *ExportHandler {
	return &ExportHandler{service}
}

// ExportSantriExcel godoc
// @Summary      Export santri data to Excel
// @Description  Export all or filtered santri data to Excel file (admin only)
// @Tags         export
// @Produce      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// @Param        status  query     string  false  "Filter by status (PENDING, VERIFIED, ACCEPTED, REJECTED)"
// @Success      200     {file}    file
// @Failure      401     {object}  utils.APIResponse
// @Failure      500     {object}  utils.APIResponse
// @Security     BearerAuth
// @Router       /export/santri/excel [get]
func (h *ExportHandler) ExportSantriExcel(c *gin.Context) {
	status := c.Query("status")

	buf, err := h.service.ExportSantriToExcel(c.Request.Context(), status)
	if err != nil {
		utils.ResponseWithError(c, err)
		return
	}

	filename := fmt.Sprintf("data_santri_%s.xlsx", time.Now().Format("20060102_150405"))

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Transfer-Encoding", "binary")

	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buf.Bytes())
}

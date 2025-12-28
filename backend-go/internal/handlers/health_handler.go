package handlers

import (
	"backend-go/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

type HealthHandler struct{}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// HealthResponse represents the health check response
type HealthResponse struct {
	Status   string            `json:"status"`
	Services map[string]string `json:"services"`
}

// Check godoc
// @Summary      Health Check
// @Description  Check the health status of the API and its dependencies
// @Tags         health
// @Produce      json
// @Success      200  {object}  HealthResponse
// @Failure      503  {object}  HealthResponse
// @Router       /health [get]
func (h *HealthHandler) Check(c *gin.Context) {
	response := HealthResponse{
		Status:   "healthy",
		Services: make(map[string]string),
	}

	// Check Database
	if config.DB != nil {
		sqlDB, err := config.DB.DB()
		if err != nil || sqlDB.Ping() != nil {
			response.Status = "unhealthy"
			response.Services["database"] = "down"
		} else {
			response.Services["database"] = "up"
		}
	} else {
		response.Status = "unhealthy"
		response.Services["database"] = "not configured"
	}

	// Check Redis
	if config.RedisClient != nil {
		ctx := c.Request.Context()
		if err := config.RedisClient.Ping(ctx).Err(); err != nil {
			response.Services["redis"] = "down"
		} else {
			response.Services["redis"] = "up"
		}
	} else {
		response.Services["redis"] = "not configured"
	}

	statusCode := http.StatusOK
	if response.Status == "unhealthy" {
		statusCode = http.StatusServiceUnavailable
	}

	c.JSON(statusCode, response)
}

// Ready godoc
// @Summary      Readiness Check
// @Description  Check if the service is ready to accept traffic
// @Tags         health
// @Produce      json
// @Success      200  {object}  map[string]string
// @Router       /ready [get]
func (h *HealthHandler) Ready(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ready",
	})
}

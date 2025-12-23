package utils

import (
	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

func SuccessResponse(c *gin.Context, code int, message string, data interface{}) {
	c.JSON(code, APIResponse{
		Status:  true,
		Message: message,
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, code int, message string, err interface{}) {
	c.AbortWithStatusJSON(code, APIResponse{
		Status:  false,
		Message: message,
		Error:   err,
	})
}

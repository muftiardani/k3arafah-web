package utils

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	RequestID string      `json:"request_id,omitempty"`
	Status    bool        `json:"status"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data,omitempty"`
	Error     interface{} `json:"error,omitempty"`
}

func SuccessResponse(c *gin.Context, code int, message string, data interface{}) {
	c.JSON(code, APIResponse{
		RequestID: c.GetString("RequestID"),
		Status:    true,
		Message:   message,
		Data:      data,
	})
}

func ErrorResponse(c *gin.Context, code int, message string, err interface{}) {
	c.AbortWithStatusJSON(code, APIResponse{
		RequestID: c.GetString("RequestID"),
		Status:    false,
		Message:   message,
		Error:     err,
	})
}

// ResponseWithError automatically determines the status code based on the error type
func ResponseWithError(c *gin.Context, err error) {
	var appErr *AppError
	if ok := errors.As(err, &appErr); ok {
		ErrorResponse(c, appErr.Code, appErr.Message, nil)
		return
	}

	if errors.Is(err, ErrNotFound) {
		ErrorResponse(c, http.StatusNotFound, "Resource not found", err.Error())
		return
	}

	if errors.Is(err, ErrConflict) {
		ErrorResponse(c, http.StatusConflict, "Resource already exists", err.Error())
		return
	}

	if errors.Is(err, ErrUnauthorized) {
		ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", err.Error())
		return
	}

	if errors.Is(err, ErrForbidden) {
		ErrorResponse(c, http.StatusForbidden, "Forbidden", err.Error())
		return
	}

	// Default to 500
	ErrorResponse(c, http.StatusInternalServerError, "Internal Server Error", err.Error())
}

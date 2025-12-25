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

type PaginationMeta struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	TotalItems int64 `json:"total_items"`
	TotalPages int   `json:"total_pages"`
}

type PaginatedData struct {
	Items interface{}    `json:"items"`
	Meta  PaginationMeta `json:"meta"`
}

func SuccessResponsePaginated(c *gin.Context, code int, message string, items interface{}, page, limit int, total int64) {
	totalPages := 0
	if limit > 0 {
		totalPages = int((total + int64(limit) - 1) / int64(limit)) // Ceiling division
	}
	
	data := PaginatedData{
		Items: items,
		Meta: PaginationMeta{
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		},
	}
	SuccessResponse(c, code, message, data)
}

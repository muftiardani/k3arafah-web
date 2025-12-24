package utils

import (
	"errors"
	"net/http"

	"gorm.io/gorm"
)

// Sentinel Errors (Static errors for equality checks)
var (
	ErrNotFound            = errors.New("record not found")
	ErrConflict            = errors.New("record already exists")
	ErrInternalServerError = errors.New("internal server error")
	ErrUnauthorized        = errors.New("unauthorized action")
	ErrForbidden           = errors.New("forbidden action")
)

type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e *AppError) Error() string {
	return e.Message
}

func NewAppError(code int, message string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
	}
}

// MapDBError converts database errors to AppErrors or Sentinel Errors
func HandleDBError(err error) error {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrNotFound
	}
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return ErrConflict
	}
	return err
}

func NewBadRequestError(message string) *AppError {
	return NewAppError(http.StatusBadRequest, message)
}

func NewNotFoundError(message string) *AppError {
	return NewAppError(http.StatusNotFound, message)
}

func NewInternalServerError(message string) *AppError {
	return NewAppError(http.StatusInternalServerError, message)
}

func NewUnauthorizedError(message string) *AppError {
	return NewAppError(http.StatusUnauthorized, message)
}

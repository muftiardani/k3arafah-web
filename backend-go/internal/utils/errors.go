package utils

import (
	"errors"
	"strings"

	"gorm.io/gorm"
)

// Sentinel Errors (Static errors for equality checks)
var (
	ErrNotFound     = errors.New("record not found")
	ErrConflict     = errors.New("record already exists")
	ErrUnauthorized = errors.New("unauthorized action")
	ErrForbidden    = errors.New("forbidden action")
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
	if err == nil {
		return nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrNotFound
	}
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return ErrConflict
	}

	// PostgreSQL unique constraint violation detection
	errStr := err.Error()
	if strings.Contains(errStr, "duplicate key") ||
		strings.Contains(errStr, "unique constraint") ||
		strings.Contains(errStr, "UNIQUE constraint") ||
		strings.Contains(errStr, "23505") { // PostgreSQL error code for unique_violation
		return ErrConflict
	}

	return err
}


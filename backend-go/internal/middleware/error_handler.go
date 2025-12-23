package middleware

import (
	"backend-go/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ErrorHandlerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Check if there are any errors in the context
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			// Check if it's our custom AppError
			if appErr, ok := err.(*utils.AppError); ok {
				utils.ErrorResponse(c, appErr.Code, appErr.Message, nil)
				return
			}

			// Default to 500 Internal Server Error for unknown errors
			// Log the actual error for debugging
			// Assuming we have a global logger or we can inject it,
			// but for now let's just use the Zap logger from context if available or generic one
			// In a real app we might want to log the full stack trace here

			utils.ErrorResponse(c, http.StatusInternalServerError, "Internal Server Error", err.Error())
		}
	}
}

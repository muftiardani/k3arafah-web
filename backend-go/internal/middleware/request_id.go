package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const (
	// RequestIDHeader is the header key for request ID
	RequestIDHeader = "X-Request-ID"
	// RequestIDKey is the context key for request ID
	RequestIDKey = "RequestID"
)

// RequestIDMiddleware generates or extracts a unique request ID for each request.
// This enables request tracing across logs and services.
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check if request ID already exists in header (from upstream service or client)
		requestID := c.GetHeader(RequestIDHeader)
		
		// Generate new UUID if not provided
		if requestID == "" {
			requestID = uuid.New().String()
		}
		
		// Store in context for handlers/services to access
		c.Set(RequestIDKey, requestID)
		
		// Add to response headers for client correlation
		c.Header(RequestIDHeader, requestID)
		
		c.Next()
	}
}

// GetRequestID retrieves the request ID from the Gin context.
// Returns empty string if not found.
func GetRequestID(c *gin.Context) string {
	if requestID, exists := c.Get(RequestIDKey); exists {
		return requestID.(string)
	}
	return ""
}

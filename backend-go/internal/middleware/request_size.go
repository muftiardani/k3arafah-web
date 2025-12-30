package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequestSizeLimiter limits the size of request bodies to prevent DoS attacks
func RequestSizeLimiter(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Limit request body size
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)

		c.Next()
	}
}

// DefaultRequestSizeLimiter limits request bodies to 10MB
func DefaultRequestSizeLimiter() gin.HandlerFunc {
	return RequestSizeLimiter(10 << 20) // 10 MB
}

// UploadSizeLimiter limits upload request bodies to 50MB
func UploadSizeLimiter() gin.HandlerFunc {
	return RequestSizeLimiter(50 << 20) // 50 MB
}

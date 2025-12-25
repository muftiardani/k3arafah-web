package middleware

import (
	"backend-go/internal/logger"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		rawQuery := c.Request.URL.RawQuery

		// Generate Request ID
		requestID := uuid.New().String()
		c.Set("RequestID", requestID)
		c.Writer.Header().Set("X-Request-ID", requestID)

		c.Next()

		end := time.Now()
		latency := end.Sub(start)
		status := c.Writer.Status()
		method := c.Request.Method
		clientIP := c.ClientIP()
		errorMessage := c.Errors.ByType(gin.ErrorTypePrivate).String()

		// Mask Sensitive Query Params
		sanitizedQuery := sanitizeQuery(rawQuery)

		fields := []zap.Field{
			zap.String("request_id", requestID),
			zap.Int("status", status),
			zap.String("method", method),
			zap.String("path", path),
			zap.String("query", sanitizedQuery),
			zap.String("ip", clientIP),
			zap.String("user-agent", c.Request.UserAgent()),
			zap.Duration("latency", latency),
		}

		if errorMessage != "" {
			fields = append(fields, zap.String("error", errorMessage))
			logger.Error("Request Failed", fields...)
		} else {
			logger.Info("Request Success", fields...)
		}
	}
}

func sanitizeQuery(query string) string {
	if query == "" {
		return ""
	}
	
	values, err := url.ParseQuery(query)
	if err != nil {
		return query // Return raw if parse fails
	}

	sensitiveKeys := []string{"token", "password", "secret", "authorization", "key"}
	
	for _, key := range sensitiveKeys {
		for param := range values {
			if strings.EqualFold(param, key) {
				values.Set(param, "*****")
			}
		}
	}

	return values.Encode()
}

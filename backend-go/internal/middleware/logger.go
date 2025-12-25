package middleware

import (
	"backend-go/internal/logger"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

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

		fields := []zap.Field{
			zap.String("request_id", requestID),
			zap.Int("status", status),
			zap.String("method", method),
			zap.String("path", path),
			zap.String("query", query),
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

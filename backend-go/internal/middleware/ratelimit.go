package middleware

import (
	"backend-go/internal/utils"
	"net/http"

	"github.com/didip/tollbooth/v7"
	"github.com/didip/tollbooth/v7/limiter"
	"github.com/gin-gonic/gin"
)

func RateLimitMiddleware(rps float64) gin.HandlerFunc {
	// Create a limiter struct.
	lmt := tollbooth.NewLimiter(rps, &limiter.ExpirableOptions{DefaultExpirationTTL: 0})

	return func(c *gin.Context) {
		httpError := tollbooth.LimitByRequest(lmt, c.Writer, c.Request)
		if httpError != nil {
			utils.ErrorResponse(c, http.StatusTooManyRequests, "Too Many Requests", httpError.Message)
			c.Abort()
			return
		}
		c.Next()
	}
}

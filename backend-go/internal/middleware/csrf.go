package middleware

import (
	"backend-go/config"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	csrf "github.com/utrack/gin-csrf"
)

func SessionMiddleware() gin.HandlerFunc {
	store := cookie.NewStore([]byte(config.AppConfig.CSRFSecret))
	// Secure configuration for session cookie
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   3600 * 24, // 1 day
		HttpOnly: true,
		Secure:   config.AppConfig.Environment == "production", // Secure only in production
		SameSite: http.SameSiteLaxMode,
	})
	return sessions.Sessions("mysession", store)
}

func CSRFMiddleware() gin.HandlerFunc {
	return csrf.Middleware(csrf.Options{
		Secret: config.AppConfig.CSRFSecret,
		ErrorFunc: func(c *gin.Context) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"status":  false,
				"message": "CSRF token mismatch",
			})
		},
	})
}

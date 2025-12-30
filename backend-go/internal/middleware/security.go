package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
)

// SecurityMiddleware adds security headers to all responses
func SecurityMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prevent MIME type sniffing
		c.Header("X-Content-Type-Options", "nosniff")

		// Prevent clickjacking
		c.Header("X-Frame-Options", "DENY")

		// XSS Protection (legacy browsers)
		c.Header("X-XSS-Protection", "1; mode=block")

		// Content Security Policy
		c.Header("Content-Security-Policy", "default-src 'self'; img-src 'self' https://res.cloudinary.com https://*.cloudinary.com data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://res.cloudinary.com; frame-ancestors 'none'")

		// HTTP Strict Transport Security (HSTS)
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

		// Referrer Policy - don't leak URLs
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

		// Permissions Policy - restrict browser features
		c.Header("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=()")

		// Prevent caching of sensitive endpoints
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/api/login") ||
			strings.HasPrefix(path, "/api/logout") ||
			strings.HasPrefix(path, "/api/refresh") ||
			strings.HasPrefix(path, "/api/admins") ||
			strings.HasPrefix(path, "/api/activity-logs") {
			c.Header("Cache-Control", "no-store, no-cache, must-revalidate, private")
			c.Header("Pragma", "no-cache")
			c.Header("Expires", "0")
		}

		c.Next()
	}
}


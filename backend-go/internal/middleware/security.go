package middleware

import (
	"github.com/gin-gonic/gin"
)

func SecurityMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// X-Content-Type-Options: nosniff
		c.Header("X-Content-Type-Options", "nosniff")

		// X-Frame-Options: DENY (Prevent Clickjacking)
		c.Header("X-Frame-Options", "DENY")

		// X-XSS-Protection: 1; mode=block
		c.Header("X-XSS-Protection", "1; mode=block")

		// Content-Security-Policy
		// Adjust this based on your needs (e.g., allowing images from Cloudinary)
		c.Header("Content-Security-Policy", "default-src 'self'; img-src 'self' https://res.cloudinary.com data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'")

		// Strict-Transport-Security (HSTS) - 1 Year
		// Only effective on HTTPS, but good practice to set
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		c.Next()
	}
}

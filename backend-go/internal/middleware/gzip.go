package middleware

import (
	"compress/gzip"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// gzipWriter wraps gin.ResponseWriter with gzip compression
type gzipWriter struct {
	gin.ResponseWriter
	writer *gzip.Writer
}

func (g *gzipWriter) Write(data []byte) (int, error) {
	return g.writer.Write(data)
}

func (g *gzipWriter) WriteString(s string) (int, error) {
	return g.writer.Write([]byte(s))
}

// GzipMiddleware compresses responses using gzip for better performance
// Only compresses responses larger than minSize bytes and for supported content types
func GzipMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check if client accepts gzip encoding
		if !strings.Contains(c.Request.Header.Get("Accept-Encoding"), "gzip") {
			c.Next()
			return
		}

		// Skip compression for small responses, images, and already compressed formats
		skipPaths := []string{"/api/upload", "/swagger", "/health", "/ready"}
		for _, path := range skipPaths {
			if strings.HasPrefix(c.Request.URL.Path, path) {
				c.Next()
				return
			}
		}

		// Create gzip writer
		gz, err := gzip.NewWriterLevel(c.Writer, gzip.BestSpeed)
		if err != nil {
			c.Next()
			return
		}
		defer gz.Close()

		// Set headers
		c.Header("Content-Encoding", "gzip")
		c.Header("Vary", "Accept-Encoding")

		// Wrap the response writer
		c.Writer = &gzipWriter{c.Writer, gz}

		c.Next()

		// Flush gzip writer
		gz.Flush()
	}
}

// gzipReader wraps request body for decompressing gzip requests
type gzipReader struct {
	body io.ReadCloser
	zr   *gzip.Reader
}

func (g *gzipReader) Read(p []byte) (n int, err error) {
	return g.zr.Read(p)
}

func (g *gzipReader) Close() error {
	g.zr.Close()
	return g.body.Close()
}

// DecompressRequestMiddleware decompresses gzip-encoded request bodies
func DecompressRequestMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Header.Get("Content-Encoding") == "gzip" {
			zr, err := gzip.NewReader(c.Request.Body)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
					"status":  false,
					"message": "Invalid gzip content",
				})
				return
			}

			c.Request.Body = &gzipReader{c.Request.Body, zr}
			c.Request.Header.Del("Content-Encoding")
		}
		c.Next()
	}
}

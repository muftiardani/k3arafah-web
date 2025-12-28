package api

import (
	"backend-go/internal/handlers"
	"backend-go/internal/middleware"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	csrf "github.com/utrack/gin-csrf"
)

type Handlers struct {
	AuthHandler        *handlers.AuthHandler
	PSBHandler         *handlers.PSBHandler
	ArticleHandler     *handlers.ArticleHandler
	MediaHandler       *handlers.MediaHandler
	DashboardHandler   *handlers.DashboardHandler
	GalleryHandler     *handlers.GalleryHandler
	MessageHandler     *handlers.MessageHandler
	VideoHandler       *handlers.VideoHandler
	AchievementHandler *handlers.AchievementHandler
	HealthHandler      *handlers.HealthHandler
}

func NewRouter(h Handlers) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.RequestIDMiddleware()) // Must be first for request tracing
	r.Use(middleware.LoggerMiddleware())
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.SecurityMiddleware())
	r.Use(middleware.SessionMiddleware()) // Must be before CSRF
	r.Use(middleware.CSRFMiddleware())

	// Health Check Routes (no middleware)
	r.GET("/health", h.HealthHandler.Check)
	r.GET("/ready", h.HealthHandler.Ready)

	// Swagger Configuration
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Rate Limiters
	loginLimiter := middleware.RateLimitMiddleware(1)
	uploadLimiter := middleware.RateLimitMiddleware(0.5)

	// Routes
	api := r.Group("/api")
	{
		// Health check also under /api
		api.GET("/health", h.HealthHandler.Check)

		api.GET("/csrf", func(c *gin.Context) {
			c.JSON(200, gin.H{"csrf_token": csrf.GetToken(c)})
		})

		// Public Routes
		api.POST("/login", loginLimiter, h.AuthHandler.Login)
		api.POST("/logout", h.AuthHandler.Logout)
		api.POST("/refresh", h.AuthHandler.RefreshToken) // New refresh token endpoint
		api.POST("/psb/register", h.PSBHandler.Register)
		api.GET("/articles", h.ArticleHandler.GetAll)
		api.GET("/articles/:id", h.ArticleHandler.GetDetail)
		api.GET("/articles/slug/:slug", h.ArticleHandler.GetDetailBySlug)

		api.POST("/contact", h.MessageHandler.SubmitMessage)

		// Public Gallery Routes
		api.GET("/galleries", h.GalleryHandler.GetAll)
		api.GET("/galleries/:id", h.GalleryHandler.GetDetail)

		// Public Video Routes
		api.GET("/videos", h.VideoHandler.GetAll)

		// Public Achievement Routes
		api.GET("/achievements", h.AchievementHandler.GetAll)
        
		// Protected Routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/upload", uploadLimiter, h.MediaHandler.Upload)

			protected.GET("/psb/registrants", h.PSBHandler.GetAll)
			protected.GET("/psb/registrants/:id", h.PSBHandler.GetDetail)
			protected.PUT("/psb/registrants/:id/status", h.PSBHandler.UpdateStatus)
			protected.PUT("/psb/registrants/:id/verify", h.PSBHandler.Verify)

			// Dashboard Routes
			protected.GET("/dashboard/stats", h.DashboardHandler.GetStats)

			// Message Routes
			protected.GET("/messages", h.MessageHandler.GetAllMessages)
			protected.PUT("/messages/:id/read", h.MessageHandler.MarkAsRead)
			protected.DELETE("/messages/:id", h.MessageHandler.DeleteMessage)

			// CMS Routes
			protected.POST("/articles", h.ArticleHandler.Create)
			protected.PUT("/articles/:id", h.ArticleHandler.Update)
			protected.DELETE("/articles/:id", h.ArticleHandler.Delete)

	// Gallery Routes (Admin Management)
			protected.POST("/galleries", h.GalleryHandler.Create)
			protected.PUT("/galleries/:id", h.GalleryHandler.Update)
			protected.DELETE("/galleries/:id", h.GalleryHandler.Delete)
			protected.POST("/galleries/:id/photos", h.GalleryHandler.UploadPhotos)
			protected.DELETE("/galleries/photos/:photo_id", h.GalleryHandler.DeletePhoto)

			// Video Routes
			protected.GET("/videos/:id", h.VideoHandler.GetByID)
			protected.POST("/videos", h.VideoHandler.Create)
			protected.PUT("/videos/:id", h.VideoHandler.Update)
			protected.DELETE("/videos/:id", h.VideoHandler.Delete)

			// Achievement Routes
			protected.POST("/achievements", h.AchievementHandler.Create)
			protected.PUT("/achievements/:id", h.AchievementHandler.Update)
			protected.DELETE("/achievements/:id", h.AchievementHandler.Delete)

			// Super Admin Routes
			superAdmin := protected.Group("/")
			superAdmin.Use(middleware.RBACMiddleware("super_admin"))
			{
				superAdmin.POST("/admins", h.AuthHandler.CreateAdmin)
				superAdmin.GET("/admins", h.AuthHandler.GetAllAdmins)
				superAdmin.DELETE("/admins/:id", h.AuthHandler.DeleteAdmin)
				superAdmin.PUT("/admins/:id/password", h.AuthHandler.UpdateAdminPassword)
			}
		}
	}

	return r
}

package main

import (
	"context"
	"flag"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"backend-go/config"
	"backend-go/internal/db"
	"backend-go/internal/handlers"
	"backend-go/internal/logger"
	"backend-go/internal/middleware"
	"backend-go/internal/repository"
	"backend-go/internal/services"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "backend-go/docs" // Import generated docs

	"go.uber.org/zap"
)

// @title           K3 Arafah Web API
// @version         1.0
// @description     Backend API for Pondok Pesantren K3 Arafah Website.
// @termsOfService  http://swagger.io/terms/

// @contact.name    API Support
// @contact.url     http://www.swagger.io/support
// @contact.email   support@swagger.io

// @license.name    Apache 2.0
// @license.url     http://www.apache.org/licenses/LICENSE-2.0.html

// @host            localhost:8080
// @BasePath        /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	// Parse Flags
	migrateFlag := flag.Bool("migrate", false, "Run database migration")
	forceFlag := flag.Int("force", -1, "Force database migration version")
	flag.Parse()

	// Load Config & Env
	if err := config.LoadConfig(); err != nil {
		println("Error loading config:", err.Error())
		os.Exit(1)
	}

	// Init Logger
	logger.Init()
	logger.Info("Starting application...")

	// Connect to Database
	config.ConnectDB()

	if *forceFlag != -1 {
		logger.Info("Forcing Database Migration Version...", zap.Int("version", *forceFlag))
		db.MigrateDatabase("force", *forceFlag)
		return
	}

	// Check for migration flag
	if *migrateFlag {
		logger.Info("Running Database Migration (Versioned)...")

		// Call versioned migration
		db.MigrateDatabase("up", 0)
		return
	}

	// Setup Router
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.LoggerMiddleware())
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.SecurityMiddleware()) // Apply Security Headers globally

	// Swagger Configuration
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Init Layers
	userRepo := repository.NewUserRepository(config.DB)
	santriRepo := repository.NewSantriRepository(config.DB)
	articleRepo := repository.NewArticleRepository(config.DB)
	galleryRepo := repository.NewGalleryRepository(config.DB)

	mediaService, err := services.NewMediaService()
	if err != nil {
		logger.Fatal("Failed to init media service", zap.Error(err))
	}

	// Connect Redis for Cache
	config.ConnectRedis()
	cacheService := services.NewCacheService()

	authService := services.NewAuthService(userRepo)
	psbService := services.NewPSBService(santriRepo)
	articleService := services.NewArticleService(articleRepo, cacheService)
	dashboardService := services.NewDashboardService(santriRepo, articleRepo, userRepo)
	galleryService := services.NewGalleryService(galleryRepo, mediaService)

	authHandler := handlers.NewAuthHandler(authService)
	psbHandler := handlers.NewPSBHandler(psbService)
	articleHandler := handlers.NewArticleHandler(articleService)
	mediaHandler := handlers.NewMediaHandler(mediaService)
	dashboardHandler := handlers.NewDashboardHandler(dashboardService)
	galleryHandler := handlers.NewGalleryHandler(galleryService)

	// Rate Limiters
	loginLimiter := middleware.RateLimitMiddleware(1)
	uploadLimiter := middleware.RateLimitMiddleware(0.5)

	// Routes
	api := r.Group("/api")
	{
		// Public Routes
		api.POST("/login", loginLimiter, authHandler.Login)
		api.POST("/logout", authHandler.Logout)
		api.POST("/psb/register", psbHandler.Register)
		api.GET("/articles", articleHandler.GetAll)
		api.GET("/articles/:id", articleHandler.GetDetail)

		// Protected Routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/upload", uploadLimiter, mediaHandler.Upload)

			protected.GET("/psb/registrants", psbHandler.GetAll)
			protected.GET("/psb/registrants/:id", psbHandler.GetDetail)
			protected.PUT("/psb/registrants/:id/status", psbHandler.UpdateStatus)
			protected.PUT("/psb/registrants/:id/verify", psbHandler.Verify)

			// Dashboard Routes
			protected.GET("/dashboard/stats", dashboardHandler.GetStats)

			// CMS Routes
			protected.POST("/articles", articleHandler.Create)
			protected.PUT("/articles/:id", articleHandler.Update)
			protected.DELETE("/articles/:id", articleHandler.Delete)

			// Gallery Routes
			protected.GET("/galleries", galleryHandler.GetAll)
			protected.GET("/galleries/:id", galleryHandler.GetDetail)
			protected.POST("/galleries", galleryHandler.Create)
			protected.DELETE("/galleries/:id", galleryHandler.Delete)
			protected.POST("/galleries/:id/photos", galleryHandler.UploadPhotos)
			protected.DELETE("/galleries/photos/:photo_id", galleryHandler.DeletePhoto)

			// Super Admin Routes
			superAdmin := protected.Group("/")
			superAdmin.Use(middleware.RBACMiddleware("super_admin"))
			{
				superAdmin.POST("/admins", authHandler.CreateAdmin)
				superAdmin.GET("/admins", authHandler.GetAllAdmins)
				superAdmin.DELETE("/admins/:id", authHandler.DeleteAdmin)
			}
		}
	}

	// Run Server
	port := config.AppConfig.Port
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	// Initializing the server in a goroutine so that
	// it won't block the graceful shutdown handling below
	go func() {
		logger.Info("Server running", zap.String("port", port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("listen: %s\n", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server...")

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown:", zap.Error(err))
	}

	logger.Info("Server exiting")
}

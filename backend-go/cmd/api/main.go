package main

import (
	"flag"
	"log"
	"os"

	"backend-go/config"
	"backend-go/internal/handlers"
	"backend-go/internal/middleware"
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"backend-go/internal/services"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "backend-go/docs" // Import generated docs

	"github.com/joho/godotenv"
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
	flag.Parse()

	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Connect to Database
	config.ConnectDB()

	// Check for migration flag
	if *migrateFlag {
		log.Println("Running Database Migration...")
		err := config.DB.AutoMigrate(&models.User{}, &models.Santri{}, &models.Article{})
		if err != nil {
			log.Fatal("Database migration failed:", err)
		}
		log.Println("Migration completed successfully.")
		return
	}

	// Setup Router
	r := gin.Default()

	// Swagger Configuration
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Use(middleware.CORSMiddleware())

	// Init Layers
	userRepo := repository.NewUserRepository(config.DB)
	santriRepo := repository.NewSantriRepository(config.DB)
	articleRepo := repository.NewArticleRepository(config.DB)

	authService := services.NewAuthService(userRepo)
	psbService := services.NewPSBService(santriRepo)
	articleService := services.NewArticleService(articleRepo)

	authHandler := handlers.NewAuthHandler(authService)
	psbHandler := handlers.NewPSBHandler(psbService)
	articleHandler := handlers.NewArticleHandler(articleService)

	// Routes
	api := r.Group("/api")
	{
		// Public Routes
		api.POST("/register-admin", authHandler.Register) // Dev only: remove in prod
		api.POST("/login", authHandler.Login)
		api.POST("/psb/register", psbHandler.Register)
		api.GET("/articles", articleHandler.GetAll)
		api.GET("/articles/:id", articleHandler.GetDetail)

		// Protected Routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/psb/registrants", psbHandler.GetAll)
			protected.GET("/psb/registrants/:id", psbHandler.GetDetail)
			protected.PUT("/psb/registrants/:id/status", psbHandler.UpdateStatus)

			// CMS Routes
			protected.POST("/articles", articleHandler.Create)
			protected.PUT("/articles/:id", articleHandler.Update)
			protected.DELETE("/articles/:id", articleHandler.Delete)
		}
	}

	// Run Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

package main

import (
	"log"
	"os"

	"backend-go/config"
	"backend-go/internal/handlers"
	"backend-go/internal/middleware"
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"backend-go/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Connect to Database
	config.ConnectDB()

	// Auto Migrate
	err := config.DB.AutoMigrate(&models.User{}, &models.Santri{}, &models.Article{})
	if err != nil {
		log.Fatal("Database migration failed:", err)
	}

	// Setup Router
	r := gin.Default()
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

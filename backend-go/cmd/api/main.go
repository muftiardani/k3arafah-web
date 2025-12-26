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
	"backend-go/internal/logger"

	// Kept for server setup usage if needed, wait.
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
	
	// Connect to Redis
	config.ConnectRedis()

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

	// Init Layers and Router via Dependency Injection
	r, err := InitializeAPI()
	if err != nil {
		logger.Fatal("Failed to initialize API", zap.Error(err))
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

//go:build wireinject
// +build wireinject

package main

import (
	"backend-go/config"
	"backend-go/internal/api"
	"backend-go/internal/handlers"
	"backend-go/internal/repository"
	"backend-go/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/wire"
	"gorm.io/gorm"
)

func ProvideDB() *gorm.DB {
	return config.DB
}

var repositorySet = wire.NewSet(
	ProvideDB,
	repository.NewUserRepository,
	repository.NewSantriRepository,
	repository.NewArticleRepository,
	repository.NewGalleryRepository,
	repository.NewMessageRepository,
)

var serviceSet = wire.NewSet(
	services.NewMediaService,
	services.NewCacheService,
	services.NewAuthService,
	services.NewPSBService,
	services.NewArticleService,
	services.NewDashboardService,
	services.NewGalleryService,
	services.NewMessageService,
)

var handlerSet = wire.NewSet(
	handlers.NewAuthHandler,
	handlers.NewPSBHandler,
	handlers.NewArticleHandler,
	handlers.NewMediaHandler,
	handlers.NewDashboardHandler,
	handlers.NewGalleryHandler,
	handlers.NewMessageHandler,
)

func InitializeAPI() (*gin.Engine, error) {
	wire.Build(
		repositorySet,
		serviceSet,
		handlerSet,
		wire.Struct(new(api.Handlers), "*"),
		api.NewRouter,
	)
	return nil, nil
}

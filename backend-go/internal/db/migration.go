package db

import (
	"backend-go/config"
	"backend-go/internal/logger"
	"backend-go/migrations"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"go.uber.org/zap"
)

func MigrateDatabase(action string, version int) {
	cfg := config.AppConfig
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName,
	)

	sourceDriver, err := iofs.New(migrations.MigrationFS, ".")
	if err != nil {
		logger.Fatal("Failed to create iofs source driver", zap.Error(err))
	}

	m, err := migrate.NewWithSourceInstance(
		"iofs",
		sourceDriver,
		dsn,
	)
	if err != nil {
		logger.Fatal("Failed to create migration instance", zap.Error(err))
	}

    curVer, dirty, err := m.Version()
    if err != nil && err != migrate.ErrNilVersion {
        logger.Error("Failed to get version", zap.Error(err))
    } else {
        logger.Info("Current DB Version", zap.Uint("version", curVer), zap.Bool("dirty", dirty))
    }

	if action == "force" {
		if err := m.Force(version); err != nil {
			logger.Fatal("Failed to force version", zap.Error(err))
		}
		logger.Info("Force version successfully", zap.Int("version", version))
		return
	}

	if action == "up" {
		if err := m.Up(); err != nil {
			if err == migrate.ErrNoChange {
				logger.Info("Database is up to date")
			} else {
				logger.Fatal("Failed to run migrations (Up)", zap.Error(err))
			}
		} else {
			logger.Info("Migrations (Up) applied successfully")
		}
		return
	}
	
	if action == "down" {
		if err := m.Down(); err != nil {
			logger.Fatal("Failed to run migrations (Down)", zap.Error(err))
		}
		logger.Info("Migrations (Down) applied successfully")
		return
	}
}

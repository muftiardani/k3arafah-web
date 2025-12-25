package db

import (
	"backend-go/config"
	"backend-go/migrations"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
)

func MigrateDatabase(action string, version int) {
	cfg := config.AppConfig
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName,
	)

	// Use embedded filesystem
	sourceDriver, err := iofs.New(migrations.MigrationFS, ".")
	if err != nil {
		log.Fatal("Failed to create iofs source driver: ", err)
	}

	m, err := migrate.NewWithSourceInstance(
		"iofs",
		sourceDriver,
		dsn,
	)
	if err != nil {
		log.Fatal("Failed to create migration instance: ", err)
	}

    // Log current version
    curVer, dirty, err := m.Version()
    if err != nil && err != migrate.ErrNilVersion {
        log.Printf("Failed to get version: %v", err)
    } else {
        log.Printf("Current DB Version: %d, Dirty: %v", curVer, dirty)
    }

	if action == "force" {
		if err := m.Force(version); err != nil {
			log.Fatal("Failed to force version: ", err)
		}
		log.Printf("Force version %d successfully!", version)
		return
	}

	if action == "up" {
		if err := m.Up(); err != nil {
			if err == migrate.ErrNoChange {
				log.Println("Database is up to date.")
			} else {
				log.Fatal("Failed to run migrations (Up): ", err)
			}
		} else {
			log.Println("Migrations (Up) applied successfully!")
		}
		return
	}
	
	if action == "down" {
		if err := m.Down(); err != nil {
			log.Fatal("Failed to run migrations (Down): ", err)
		}
		log.Println("Migrations (Down) applied successfully!")
		return
	}
}

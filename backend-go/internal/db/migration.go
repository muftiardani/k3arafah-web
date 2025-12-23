package db

import (
	"backend-go/config"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrations() {
	cfg := config.AppConfig
	// Construct DSN specifically for golang-migrate (postgres:// format)
	// Note: GORM might use a slightly different DSN format (key=value), but migrate needs URL format.
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName,
	)

	log.Println("Initiating database migration...")

	// Create migration instance
	// Ensure the "migrations" folder is in the root where the binary is executed
	m, err := migrate.New(
		"file://migrations",
		dsn,
	)
	if err != nil {
		log.Fatal("Failed to create migration instance: ", err)
	}

	// Run Up
	if err := m.Up(); err != nil {
		if err == migrate.ErrNoChange {
			log.Println("Database is up to date.")
		} else {
			log.Fatal("Failed to run migrations: ", err)
		}
	} else {
		log.Println("Migrations applied successfully!")
	}
}

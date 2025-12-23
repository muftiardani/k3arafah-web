package config

import (
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string `validate:"required"`
	DBUser     string `validate:"required"`
	DBPassword string `validate:"required"`
	DBName     string `validate:"required"`
	DBPort     string `validate:"required"`
	Port       string `validate:"required"`
	JWTSecret     string `validate:"required"`
	CloudinaryURL string `validate:"required"`
	RedisAddr     string `validate:"required"` // localhost:6379
	RedisPassword string // Optional
}

var AppConfig Config

func LoadConfig() error {
	// Load .env file, but don't fail if it doesn't exist (might be relying on system env)
	_ = godotenv.Load()

	AppConfig = Config{
		DBHost:        os.Getenv("DB_HOST"),
		DBUser:        os.Getenv("DB_USER"),
		DBPassword:    os.Getenv("DB_PASSWORD"),
		DBName:        os.Getenv("DB_NAME"),
		DBPort:        os.Getenv("DB_PORT"),
		Port:          os.Getenv("PORT"),
		JWTSecret:     os.Getenv("JWT_SECRET"),
		CloudinaryURL: os.Getenv("CLOUDINARY_URL"),
		RedisAddr:     os.Getenv("REDIS_ADDR"),
		RedisPassword: os.Getenv("REDIS_PASSWORD"),
	}

	// Set default port if empty
	if AppConfig.Port == "" {
		AppConfig.Port = "8080"
	}

	validate := validator.New()
	return validate.Struct(&AppConfig)
}

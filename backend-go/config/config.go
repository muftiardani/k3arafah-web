package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
)

type Config struct {
	DBHost        string `mapstructure:"DB_HOST" validate:"required"`
	DBUser        string `mapstructure:"DB_USER" validate:"required"`
	DBPassword    string `mapstructure:"DB_PASSWORD" validate:"required"`
	DBName        string `mapstructure:"DB_NAME" validate:"required"`
	DBPort        string `mapstructure:"DB_PORT" validate:"required"`
	Port          string `mapstructure:"PORT" validate:"required"`
	JWTSecret     string `mapstructure:"JWT_SECRET" validate:"required"`
	CloudinaryURL string `mapstructure:"CLOUDINARY_URL" validate:"required"`
	RedisAddr     string `mapstructure:"REDIS_ADDR" validate:"required"`
	RedisPassword string `mapstructure:"REDIS_PASSWORD"`
	Environment   string `mapstructure:"ENV"`
}

var AppConfig Config

func LoadConfig() error {
	// 1. Setup Viper to read Environment Variables
	viper.AutomaticEnv()

	// 2. Try to read .env file (Backward Compatibility)
	viper.SetConfigFile(".env")
	// We ignore error here because .env might not exist (production might use real env vars)
	_ = viper.ReadInConfig()

	// 3. Try to read config.yaml or config.json (Hierarchical Config)
	viper.SetConfigName("config") // name of config file (without extension)
	viper.SetConfigType("yaml")   // REQUIRED if the config file does not have the extension in the name
	viper.AddConfigPath(".")      // optionally look for config in the working directory
	_ = viper.MergeInConfig()     // Merge if config file exists, overriding .env

	// 4. Set Defaults
	viper.SetDefault("PORT", "8080")

	// 5. Unmarshal into Struct
	if err := viper.Unmarshal(&AppConfig); err != nil {
		return err
	}

	// 6. Validate
	validate := validator.New()
	return validate.Struct(&AppConfig)
}

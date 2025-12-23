package config

import (
	"context"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func ConnectRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     AppConfig.RedisAddr,
		Password: AppConfig.RedisPassword,
		DB:       0, // use default DB
	})

	// Optional: Check connection
	_, err := RedisClient.Ping(context.Background()).Result()
	if err != nil {
		// Log warning but don't panic? Or panic?
		// For now let's just let it be, connection issues will surface during usage
		// Or maybe valid to panic if Cache is critical.
		// Let's assume soft-fail (app runs even if redis down, just slower) - but for this task let's just init.
		// Actually, let's print a warning if we can't ping
		println("Warning: Redis connection failed:", err.Error())
	} else {
		println("Connected to Redis at", AppConfig.RedisAddr)
	}
}

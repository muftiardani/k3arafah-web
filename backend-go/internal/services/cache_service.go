package services

import (
	"backend-go/config"
	"backend-go/internal/logger"
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type CacheService interface {
	Get(key string, dest interface{}) error
	Set(key string, value interface{}, ttl time.Duration) error
	Delete(key string) error
	DeleteByPattern(pattern string) error
	IsAvailable() bool
}

type cacheService struct{}

func NewCacheService() CacheService {
	return &cacheService{}
}

// IsAvailable checks if Redis is connected and responsive
func (s *cacheService) IsAvailable() bool {
	if config.RedisClient == nil {
		return false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	
	return config.RedisClient.Ping(ctx).Err() == nil
}

// Get retrieves a value from cache.
// Returns redis.Nil if key not found, or logs warning and returns error if Redis is unavailable.
func (s *cacheService) Get(key string, dest interface{}) error {
	if config.RedisClient == nil {
		logger.Warn("Redis client not configured, skipping cache get", zap.String("key", key))
		return redis.Nil // Treat as cache miss
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	val, err := config.RedisClient.Get(ctx, key).Result()
	if err != nil {
		if err != redis.Nil {
			// Log warning for actual Redis errors, but don't fail the request
			logger.Warn("Redis GET failed, continuing without cache",
				zap.String("key", key),
				zap.Error(err),
			)
		}
		return err // redis.Nil if not found, or actual error
	}
	return json.Unmarshal([]byte(val), dest)
}

// Set stores a value in cache.
// Logs warning and continues if Redis is unavailable.
func (s *cacheService) Set(key string, value interface{}, ttl time.Duration) error {
	if config.RedisClient == nil {
		logger.Warn("Redis client not configured, skipping cache set", zap.String("key", key))
		return nil // Don't fail the operation
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	bytes, err := json.Marshal(value)
	if err != nil {
		return err
	}

	if err := config.RedisClient.Set(ctx, key, bytes, ttl).Err(); err != nil {
		// Log warning but don't fail the request
		logger.Warn("Redis SET failed, continuing without cache",
			zap.String("key", key),
			zap.Duration("ttl", ttl),
			zap.Error(err),
		)
		return nil // Don't propagate Redis errors
	}
	return nil
}

// Delete removes a key from cache.
// Logs warning and continues if Redis is unavailable.
func (s *cacheService) Delete(key string) error {
	if config.RedisClient == nil {
		logger.Warn("Redis client not configured, skipping cache delete", zap.String("key", key))
		return nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := config.RedisClient.Del(ctx, key).Err(); err != nil {
		logger.Warn("Redis DELETE failed, continuing",
			zap.String("key", key),
			zap.Error(err),
		)
		return nil
	}
	return nil
}

// DeleteByPattern removes all keys matching a pattern.
// Logs warning and continues if Redis is unavailable.
func (s *cacheService) DeleteByPattern(pattern string) error {
	if config.RedisClient == nil {
		logger.Warn("Redis client not configured, skipping cache delete by pattern", zap.String("pattern", pattern))
		return nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	iter := config.RedisClient.Scan(ctx, 0, pattern, 0).Iterator()
	for iter.Next(ctx) {
		if err := config.RedisClient.Del(ctx, iter.Val()).Err(); err != nil {
			logger.Warn("Redis DELETE failed during pattern delete",
				zap.String("key", iter.Val()),
				zap.Error(err),
			)
		}
	}
	
	if err := iter.Err(); err != nil {
		logger.Warn("Redis SCAN failed during pattern delete",
			zap.String("pattern", pattern),
			zap.Error(err),
		)
		return nil // Don't propagate error
	}
	return nil
}

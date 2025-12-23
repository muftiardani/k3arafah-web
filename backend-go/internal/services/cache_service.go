package services

import (
	"backend-go/config"
	"context"
	"encoding/json"
	"time"
)

type CacheService interface {
	Get(key string, dest interface{}) error
	Set(key string, value interface{}, ttl time.Duration) error
	Delete(key string) error
	DeleteByPattern(pattern string) error
}

type cacheService struct{}

func NewCacheService() CacheService {
	return &cacheService{}
}

func (s *cacheService) Get(key string, dest interface{}) error {
	ctx := context.Background()
	val, err := config.RedisClient.Get(ctx, key).Result()
	if err != nil {
		return err // redis.Nil if not found
	}
	return json.Unmarshal([]byte(val), dest)
}

func (s *cacheService) Set(key string, value interface{}, ttl time.Duration) error {
	ctx := context.Background()
	bytes, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return config.RedisClient.Set(ctx, key, bytes, ttl).Err()
}

func (s *cacheService) Delete(key string) error {
	ctx := context.Background()
	return config.RedisClient.Del(ctx, key).Err()
}

func (s *cacheService) DeleteByPattern(pattern string) error {
	ctx := context.Background()
	iter := config.RedisClient.Scan(ctx, 0, pattern, 0).Iterator()
	for iter.Next(ctx) {
		config.RedisClient.Del(ctx, iter.Val())
	}
	return iter.Err()
}

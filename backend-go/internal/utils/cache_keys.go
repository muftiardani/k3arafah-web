package utils

const (
	// Article Cache Keys
	CacheKeyArticlesAll         = "articles:all"
	CacheKeyArticlesIDPattern   = "articles:id:%d"   // Use with fmt.Sprintf
	CacheKeyArticlesSlugPattern = "articles:slug:%s" // Use with fmt.Sprintf
)

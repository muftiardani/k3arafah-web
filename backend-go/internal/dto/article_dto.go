package dto

// CreateArticleRequest is the DTO for creating a new article
type CreateArticleRequest struct {
	Title        string `json:"title" binding:"required,min=3,max=200"`
	Content      string `json:"content" binding:"required,min=10"`
	ThumbnailURL string `json:"thumbnail_url" binding:"omitempty,url"`
	IsPublished  bool   `json:"is_published"`
}

// UpdateArticleRequest is the DTO for updating an existing article
type UpdateArticleRequest struct {
	Title        string `json:"title" binding:"omitempty,min=3,max=200"`
	Content      string `json:"content" binding:"omitempty,min=10"`
	ThumbnailURL string `json:"thumbnail_url" binding:"omitempty,url"`
	IsPublished  *bool  `json:"is_published"`
}

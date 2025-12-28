package dto

// CreateVideoRequest is the DTO for creating a new video
type CreateVideoRequest struct {
	Title     string `json:"title" binding:"required,min=3,max=100"`
	YoutubeID string `json:"youtube_id" binding:"required,min=5,max=20"`
	Thumbnail string `json:"thumbnail" binding:"omitempty,url"`
}

// UpdateVideoRequest is the DTO for updating an existing video
type UpdateVideoRequest struct {
	Title     string `json:"title" binding:"omitempty,min=3,max=100"`
	YoutubeID string `json:"youtube_id" binding:"omitempty,min=5,max=20"`
	Thumbnail string `json:"thumbnail" binding:"omitempty,url"`
}

package dto

// CreateGalleryRequest is the DTO for creating a new gallery
type CreateGalleryRequest struct {
	Title       string `json:"title" binding:"required,min=3,max=100"`
	Description string `json:"description" binding:"required,min=10,max=500"`
	EventDate   string `json:"event_date" binding:"omitempty"` // Format: YYYY-MM-DD
}

// UpdateGalleryRequest is the DTO for updating an existing gallery
type UpdateGalleryRequest struct {
	Title       string `json:"title" binding:"omitempty,min=3,max=100"`
	Description string `json:"description" binding:"omitempty,min=10,max=500"`
	CoverURL    string `json:"cover_url" binding:"omitempty,url"`
}

package dto

// CreateTagRequest is the DTO for creating a tag
type CreateTagRequest struct {
	Name string `json:"name" binding:"required,min=2,max=50"`
}

// UpdateTagRequest is the DTO for updating a tag
type UpdateTagRequest struct {
	Name string `json:"name" binding:"omitempty,min=2,max=50"`
}

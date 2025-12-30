package dto

// CreateCategoryRequest is the DTO for creating a category
type CreateCategoryRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=100"`
	Description string `json:"description" binding:"omitempty,max=500"`
}

// UpdateCategoryRequest is the DTO for updating a category
type UpdateCategoryRequest struct {
	Name        string `json:"name" binding:"omitempty,min=2,max=100"`
	Description string `json:"description" binding:"omitempty,max=500"`
}

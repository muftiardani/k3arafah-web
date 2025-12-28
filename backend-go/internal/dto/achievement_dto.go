package dto

// CreateAchievementRequest is the DTO for creating a new achievement
type CreateAchievementRequest struct {
	Title       string `json:"title" binding:"required,min=3,max=100"`
	Subtitle    string `json:"subtitle" binding:"required,min=3,max=100"`
	Description string `json:"description" binding:"required,min=10,max=500"`
	Icon        string `json:"icon" binding:"required,oneof=trophy award mic crown music book medal zap star"`
	Color       string `json:"color" binding:"required,oneof=yellow blue slate amber purple emerald red orange"`
}

// UpdateAchievementRequest is the DTO for updating an existing achievement
type UpdateAchievementRequest struct {
	Title       string `json:"title" binding:"omitempty,min=3,max=100"`
	Subtitle    string `json:"subtitle" binding:"omitempty,min=3,max=100"`
	Description string `json:"description" binding:"omitempty,min=10,max=500"`
	Icon        string `json:"icon" binding:"omitempty,oneof=trophy award mic crown music book medal zap star"`
	Color       string `json:"color" binding:"omitempty,oneof=yellow blue slate amber purple emerald red orange"`
}

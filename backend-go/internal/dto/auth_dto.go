package dto

// LoginRequest is the DTO for user login
type LoginRequest struct {
	Username string `json:"username" binding:"required,min=2,max=50"`
	Password string `json:"password" binding:"required,min=6"`
}

// CreateAdminRequest is the DTO for creating a new admin user
type CreateAdminRequest struct {
	Username string `json:"username" binding:"required,min=2,max=50"`
	Password string `json:"password" binding:"required,min=8"`
	Name     string `json:"name" binding:"omitempty,max=100"`
}

// RefreshTokenRequest is the DTO for refreshing access token
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// UserDTO for basic user info response
type UserDTO struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

// TokenPair contains tokens and user info
type TokenPair struct {
	AccessToken  string  `json:"access_token"`
	RefreshToken string  `json:"refresh_token"`
	ExpiresIn    int64   `json:"expires_in"` // Access token expiry in seconds
	User         UserDTO `json:"user"`
}

// ChangePasswordRequest is the DTO for changing admin password
type ChangePasswordRequest struct {
	Password string `json:"password" binding:"required,min=8"`
}

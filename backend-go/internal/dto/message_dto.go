package dto

// CreateMessageRequest is the DTO for contact form submission
type CreateMessageRequest struct {
	Name    string `json:"name" binding:"required,min=2,max=100"`
	Email   string `json:"email" binding:"required,email"`
	Subject string `json:"subject" binding:"required,min=3,max=200"`
	Message string `json:"message" binding:"required,min=10,max=2000"`
}

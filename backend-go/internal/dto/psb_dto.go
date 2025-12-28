package dto

// RegisterSantriRequest is the DTO for PSB registration
type RegisterSantriRequest struct {
	// Santri Data
	FullName   string `json:"full_name" binding:"required,min=3,max=100"`
	NIK        string `json:"nik" binding:"required,len=16,numeric"`
	BirthPlace string `json:"birth_place" binding:"required,min=2,max=50"`
	BirthDate  string `json:"birth_date" binding:"required"` // Format: YYYY-MM-DD
	Gender     string `json:"gender" binding:"required,oneof=L P"`
	Address    string `json:"address" binding:"required,min=10,max=500"`

	// Parent Data
	FatherName  string `json:"father_name" binding:"required,min=3,max=100"`
	FatherJob   string `json:"father_job" binding:"required,min=2,max=100"`
	MotherName  string `json:"mother_name" binding:"required,min=3,max=100"`
	MotherJob   string `json:"mother_job" binding:"required,min=2,max=100"`
	ParentPhone string `json:"parent_phone" binding:"required,min=10,max=15"`

	// Education Data
	SchoolOrigin  string `json:"school_origin" binding:"required,min=3,max=100"`
	SchoolAddress string `json:"school_address" binding:"required,min=10,max=500"`
	GraduationYear string `json:"graduation_year" binding:"required,len=4,numeric"`

	// Optional
	PhotoURL string `json:"photo_url" binding:"omitempty,url"`
}

// UpdateSantriStatusRequest is the DTO for updating santri status
type UpdateSantriStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=PENDING VERIFIED ACCEPTED REJECTED"`
}

// VerifySantriRequest is the DTO for verifying and accepting a santri
type VerifySantriRequest struct {
	NIS       string `json:"nis" binding:"required,min=5,max=20"`
	Class     string `json:"class" binding:"required,min=1,max=10"`
	EntryYear int    `json:"entry_year" binding:"required,min=2000,max=2100"`
}

package models

import (
	"time"
)

// ActivityAction represents the type of action performed
type ActivityAction string

const (
	ActionCreate ActivityAction = "CREATE"
	ActionUpdate ActivityAction = "UPDATE"
	ActionDelete ActivityAction = "DELETE"
	ActionLogin  ActivityAction = "LOGIN"
	ActionLogout ActivityAction = "LOGOUT"
	ActionVerify ActivityAction = "VERIFY"
)

// ActivityLog represents an audit log entry
type ActivityLog struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	UserID     uint           `json:"user_id"`
	User       User           `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Action     ActivityAction `gorm:"size:50;not null" json:"action"`
	EntityType string         `gorm:"size:50;not null" json:"entity_type"` // e.g., "article", "santri", "gallery"
	EntityID   *uint          `json:"entity_id"`
	OldValue   string         `gorm:"type:jsonb" json:"old_value,omitempty"`
	NewValue   string         `gorm:"type:jsonb" json:"new_value,omitempty"`
	IPAddress  string         `gorm:"size:45" json:"ip_address"`
	UserAgent  string         `gorm:"size:255" json:"user_agent"`
	CreatedAt  time.Time      `json:"created_at"`
}

func (ActivityLog) TableName() string {
	return "activity_logs"
}

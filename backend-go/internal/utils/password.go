package utils

import (
	"errors"
	"unicode"
)

// Password validation errors
var (
	ErrPasswordTooShort    = errors.New("password must be at least 8 characters long")
	ErrPasswordNoUppercase = errors.New("password must contain at least one uppercase letter")
	ErrPasswordNoLowercase = errors.New("password must contain at least one lowercase letter")
	ErrPasswordNoNumber    = errors.New("password must contain at least one number")
)

// PasswordPolicy defines the password requirements
type PasswordPolicy struct {
	MinLength      int
	RequireUpper   bool
	RequireLower   bool
	RequireNumber  bool
	RequireSpecial bool
}

// DefaultPasswordPolicy returns the default password policy
func DefaultPasswordPolicy() PasswordPolicy {
	return PasswordPolicy{
		MinLength:      8,
		RequireUpper:   true,
		RequireLower:   true,
		RequireNumber:  true,
		RequireSpecial: false, // Optional for now
	}
}

// ValidatePassword checks if a password meets the policy requirements.
// Returns nil if valid, otherwise returns the first validation error.
func ValidatePassword(password string) error {
	policy := DefaultPasswordPolicy()
	return ValidatePasswordWithPolicy(password, policy)
}

// ValidatePasswordWithPolicy checks password against a custom policy
func ValidatePasswordWithPolicy(password string, policy PasswordPolicy) error {
	// Check minimum length
	if len(password) < policy.MinLength {
		return ErrPasswordTooShort
	}

	var (
		hasUpper  = false
		hasLower  = false
		hasNumber = false
	)

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		}
	}

	if policy.RequireUpper && !hasUpper {
		return ErrPasswordNoUppercase
	}

	if policy.RequireLower && !hasLower {
		return ErrPasswordNoLowercase
	}

	if policy.RequireNumber && !hasNumber {
		return ErrPasswordNoNumber
	}

	return nil
}

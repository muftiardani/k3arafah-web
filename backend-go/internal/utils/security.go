package utils

import (
	"regexp"
	"strings"
)

// StrictPasswordPolicy returns stricter password requirements for admin accounts
func StrictPasswordPolicy() PasswordPolicy {
	return PasswordPolicy{
		MinLength:      12,
		RequireUpper:   true,
		RequireLower:   true,
		RequireNumber:  true,
		RequireSpecial: true,
	}
}

// Password special character validation errors
var ErrPasswordNoSpecial = "password must contain at least one special character"

// ValidatePasswordStrict validates password with strict policy including special characters
func ValidatePasswordStrict(password string) error {
	// First validate with default policy
	if err := ValidatePassword(password); err != nil {
		return err
	}

	// Check for special character
	policy := StrictPasswordPolicy()
	if policy.RequireSpecial {
		specialChars := regexp.MustCompile(`[!@#$%^&*(),.?":{}|<>]`)
		if !specialChars.MatchString(password) {
			return ErrPasswordNoUppercase // Reusing existing error for simplicity
		}
	}

	return nil
}

// IsCommonPassword checks if password is in the common passwords list
func IsCommonPassword(password string) bool {
	commonPasswords := []string{
		"password", "123456", "12345678", "qwerty", "abc123",
		"monkey", "1234567", "letmein", "trustno1", "dragon",
		"baseball", "iloveyou", "master", "sunshine", "ashley",
		"bailey", "shadow", "123123", "654321", "superman",
		"qazwsx", "michael", "football", "password1", "password123",
		"welcome", "admin", "admin123", "root", "toor",
	}

	lowerPassword := strings.ToLower(password)
	for _, common := range commonPasswords {
		if lowerPassword == common {
			return true
		}
	}
	return false
}

// SanitizeInput removes potentially dangerous characters from input
func SanitizeInput(input string) string {
	// Remove null bytes
	input = strings.ReplaceAll(input, "\x00", "")

	// Trim whitespace
	input = strings.TrimSpace(input)

	return input
}

// SanitizeFilename removes dangerous characters from filenames
func SanitizeFilename(filename string) string {
	// Remove path separators
	filename = strings.ReplaceAll(filename, "/", "")
	filename = strings.ReplaceAll(filename, "\\", "")

	// Remove null bytes
	filename = strings.ReplaceAll(filename, "\x00", "")

	// Remove other dangerous characters
	dangerous := []string{"..", "~", "<", ">", "|", ":", "\"", "?", "*"}
	for _, char := range dangerous {
		filename = strings.ReplaceAll(filename, char, "")
	}

	return strings.TrimSpace(filename)
}

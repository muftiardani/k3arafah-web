package utils

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

func ValidateStruct(payload interface{}) error {
	err := validate.Struct(payload)
	if err != nil {
		var errors []string
		for _, err := range err.(validator.ValidationErrors) {
			errors = append(errors, fmt.Sprintf("Field %s failed on tag %s", err.Field(), err.Tag()))
		}
		return fmt.Errorf("%s", strings.Join(errors, ", "))
	}
	return nil
}

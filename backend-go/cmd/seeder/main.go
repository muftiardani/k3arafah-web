package main

import (
	"backend-go/config"
	"backend-go/internal/models"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	// Load Config
	if err := config.LoadConfig(); err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// Connect to Database
	config.ConnectDB()
	db := config.DB

	// Check if super admin exists
	var user models.User
	err := db.Where("role = ?", models.RoleSuperAdmin).First(&user).Error
	if err == nil {
		fmt.Printf("Super Admin already exists: %s\n", user.Username)
		return
	}

	if err != gorm.ErrRecordNotFound {
		log.Fatal("Error checking for super admin:", err)
	}

	// Create Super Admin
	username := "superadmin"
	password := "SuperAdmin123" // Default password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}

	superAdmin := models.User{
		Username: username,
		Password: string(hashedPassword),
		Role:     models.RoleSuperAdmin,
	}

	if err := db.Create(&superAdmin).Error; err != nil {
		log.Fatal("Failed to create super admin:", err)
	}

	fmt.Println("------------------------------------------------")
	fmt.Println("Super Admin Created Successfully!")
	fmt.Printf("Username: %s\n", username)
	fmt.Printf("Password: %s\n", password)
	fmt.Println("------------------------------------------------")
}

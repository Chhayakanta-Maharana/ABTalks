package database

import (
	"fmt"
	"log"

	"github.com/Chhayakanta-Maharana/ABTalks/backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB(dsn string) (*gorm.DB, error) {
	log.Printf("Connecting to Neon PostgreSQL Database...")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Neon PostgreSQL database: %w", err)
	}

	log.Println("✅ Successfully connected to Neon PostgreSQL database.")

	// Auto-migrate models
	err = db.AutoMigrate(&models.User{}, &models.Submission{})
	if err != nil {
		return nil, fmt.Errorf("failed to auto-migrate Neon PostgreSQL schema: %w", err)
	}

	log.Println("✅ Neon PostgreSQL database schema synchronized successfully.")
	DB = db
	return db, nil
}

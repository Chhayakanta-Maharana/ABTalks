package main

import (
	"log"
	"net/http"

	"github.com/Chhayakanta-Maharana/ABTalks/backend/config"
	"github.com/Chhayakanta-Maharana/ABTalks/backend/database"
	"github.com/Chhayakanta-Maharana/ABTalks/backend/handlers"
	"github.com/Chhayakanta-Maharana/ABTalks/backend/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()

	// Initialize Neon PostgreSQL Database Connection
	db, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Printf("⚠️ Warning: Neon PostgreSQL connection failed: %v", err)
		log.Println("Ensure DATABASE_URL environment variable is set in backend/.env with your Neon connection string.")
	} else {
		_ = db
	}

	router := gin.Default()

	// Production CORS Configuration for Frontend
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	router.Use(cors.New(corsConfig))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":   "healthy",
			"service":  "ABTalks Golang Backend API Engine (Neon PostgreSQL)",
			"database": err == nil,
		})
	})

	authHandler := handlers.NewAuthHandler(cfg.JWTSecret)
	userHandler := handlers.NewUserHandler()
	subHandler := handlers.NewSubmissionHandler()

	// API v1 Routes
	api := router.Group("/api/v1")
	{
		// Public Auth Routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// Public Feed
		api.GET("/submissions/feed", subHandler.GetFeed)

		// Protected User Routes (JWT Required)
		protected := api.Group("/")
		protected.Use(middleware.JWTAuth(cfg.JWTSecret))
		{
			protected.GET("/user/profile", userHandler.GetProfile)
			protected.PUT("/user/profile", userHandler.UpdateProfile)
			protected.POST("/submissions", subHandler.CreateSubmission)
		}
	}

	log.Printf("🚀 ABTalks Golang Backend Server running on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start Golang server: %v", err)
	}
}

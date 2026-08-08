package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Chhayakanta-Maharana/ABTalks/backend/database"
	"github.com/Chhayakanta-Maharana/ABTalks/backend/models"
	"github.com/gin-gonic/gin"
)

type UserHandler struct{}

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

// GetProfile returns current user profile from Neon PostgreSQL
func (h *UserHandler) GetProfile(c *gin.Context) {
	userIdVal, exists := c.Get("userId")
	if !exists {
		if database.DB != nil {
			var defaultUser models.User
			if err := database.DB.Preload("Submissions").First(&defaultUser).Error; err == nil {
				c.JSON(http.StatusOK, gin.H{"user": defaultUser})
				return
			}
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userId := userIdVal.(string)
	var user models.User
	if database.DB != nil {
		if err := database.DB.Preload("Submissions").Where("id = ?", userId).First(&user).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User profile not found"})
			return
		}
	} else {
		user = models.User{
			ID:       userId,
			Name:     "Chhayakanta Maharana",
			Username: "@chhayakanta",
			Email:    "developer@abtalks.com",
			Avatar:   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
			Track:    "Fullstack Web & AI Systems",
		}
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

// UpdateProfile updates user profile details and custom avatar images in Neon PostgreSQL
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userIdVal, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userId := userIdVal.(string)

	var req models.ProfileUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if database.DB != nil {
		if err := database.DB.Where("id = ?", userId).First(&user).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		if req.Name != "" {
			user.Name = req.Name
		}
		if req.Track != "" {
			user.Track = req.Track
		}
		if req.Avatar != "" {
			user.Avatar = req.Avatar
		}
		if req.GithubHandle != "" {
			user.GithubHandle = req.GithubHandle
		}
		if req.LinkedinHandle != "" {
			user.LinkedinHandle = req.LinkedinHandle
		}
		if req.Thought != "" {
			user.Thought = req.Thought
		}
		if len(req.TechStack) > 0 {
			stackBytes, _ := json.Marshal(req.TechStack)
			user.TechStack = string(stackBytes)
		}

		if err := database.DB.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"user":    user,
	})
}

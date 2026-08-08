package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/Chhayakanta-Maharana/ABTalks/backend/database"
	"github.com/Chhayakanta-Maharana/ABTalks/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	JWTSecret string
}

func NewAuthHandler(secret string) *AuthHandler {
	return &AuthHandler{JWTSecret: secret}
}

// Register registers a new user in Neon PostgreSQL
func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cleanUsername := req.Username
	if cleanUsername == "" {
		cleanUsername = "@" + strings.ToLower(strings.ReplaceAll(req.Name, " ", ""))
	} else if !strings.HasPrefix(cleanUsername, "@") {
		cleanUsername = "@" + cleanUsername
	}

	if database.DB != nil {
		var existing models.User
		if err := database.DB.Where("email = ? OR username = ?", req.Email, cleanUsername).First(&existing).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Account with this email or username already exists"})
			return
		}
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}

	defaultAvatar := "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
	githubHandle := strings.TrimPrefix(cleanUsername, "@")

	user := models.User{
		Name:           req.Name,
		Username:       cleanUsername,
		Email:          req.Email,
		PasswordHash:   string(hashedPassword),
		Avatar:         defaultAvatar,
		Track:          "Fullstack Web & AI Systems",
		GithubHandle:   githubHandle,
		LinkedinHandle: "in/" + githubHandle,
	}

	if database.DB != nil {
		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user record in Neon PostgreSQL"})
			return
		}
	}

	token, err := h.generateToken(user.ID, user.Email, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"token":   token,
		"user":    user,
	})
}

// Login authenticates user against Neon PostgreSQL
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if database.DB != nil {
		if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
	} else {
		user = models.User{
			ID:       "demo-user-id",
			Name:     "Demo Developer",
			Email:    req.Email,
			Username: "@demo",
			Avatar:   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
		}
	}

	token, err := h.generateToken(user.ID, user.Email, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   token,
		"user":    user,
	})
}

func (h *AuthHandler) generateToken(userId, email, username string) (string, error) {
	claims := jwt.MapClaims{
		"userId":   userId,
		"email":    email,
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.JWTSecret))
}

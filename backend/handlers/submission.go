package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Chhayakanta-Maharana/ABTalks/backend/database"
	"github.com/Chhayakanta-Maharana/ABTalks/backend/models"
	"github.com/gin-gonic/gin"
)

type SubmissionHandler struct{}

func NewSubmissionHandler() *SubmissionHandler {
	return &SubmissionHandler{}
}

// CreateSubmission saves daily proof of work and increments streak in Neon PostgreSQL
func (h *SubmissionHandler) CreateSubmission(c *gin.Context) {
	userIdVal, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized. Please log in first."})
		return
	}
	userId := userIdVal.(string)

	var req models.SubmissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var sub models.Submission
	var user models.User

	if database.DB != nil {
		err := database.DB.Where("user_id = ? AND day_number = ?", userId, req.DayNumber).First(&sub).Error
		if err != nil {
			sub = models.Submission{
				UserID:          userId,
				DayNumber:       req.DayNumber,
				GithubCommitURL: req.GithubCommitURL,
				LinkedinPostURL: req.LinkedinPostURL,
				DemoURL:         req.DemoURL,
				SubmittedAt:     time.Now(),
			}
			_ = database.DB.Create(&sub).Error
		} else {
			sub.GithubCommitURL = req.GithubCommitURL
			sub.LinkedinPostURL = req.LinkedinPostURL
			sub.DemoURL = req.DemoURL
			sub.SubmittedAt = time.Now()
			_ = database.DB.Save(&sub).Error
		}

		var totalCount int64
		database.DB.Model(&models.Submission{}).Where("user_id = ?", userId).Count(&totalCount)

		if err := database.DB.Where("id = ?", userId).First(&user).Error; err == nil {
			user.CompletedDays = int(totalCount)
			user.CurrentStreak = int(totalCount)
			if int(totalCount) > user.LongestStreak {
				user.LongestStreak = int(totalCount)
			}
			database.DB.Save(&user)
		}
	} else {
		sub = models.Submission{
			ID:              "sub-demo",
			UserID:          userId,
			DayNumber:       req.DayNumber,
			GithubCommitURL: req.GithubCommitURL,
			LinkedinPostURL: req.LinkedinPostURL,
			DemoURL:         req.DemoURL,
			SubmittedAt:     time.Now(),
		}
		user.CurrentStreak = 12
		user.CompletedDays = 12
	}

	c.JSON(http.StatusOK, gin.H{
		"success":       true,
		"submission":    sub,
		"currentStreak": user.CurrentStreak,
		"completedDays": user.CompletedDays,
	})
}

// GetFeed returns public activity submissions feed from Neon PostgreSQL
func (h *SubmissionHandler) GetFeed(c *gin.Context) {
	type FeedItem struct {
		ID             string `json:"id"`
		StudentName    string `json:"studentName"`
		Avatar         string `json:"avatar"`
		DayNumber      int    `json:"dayNumber"`
		CommitMessage  string `json:"commitMessage"`
		GithubUrl      string `json:"githubUrl"`
		LinkedinUrl    string `json:"linkedinUrl"`
		TimeAgo        string `json:"timeAgo"`
		ReactionsCount int    `json:"reactionsCount"`
	}

	var feed []FeedItem

	if database.DB != nil {
		var submissions []models.Submission
		database.DB.Preload("User").Order("submitted_at desc").Limit(10).Find(&submissions)

		for _, sub := range submissions {
			name := "Anonymous Student"
			avatar := "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
			if sub.User != nil {
				name = sub.User.Name
				avatar = sub.User.Avatar
			}

			feed = append(feed, FeedItem{
				ID:             sub.ID,
				StudentName:    name,
				Avatar:         avatar,
				DayNumber:      sub.DayNumber,
				CommitMessage:  fmt.Sprintf("feat: day %d proof of work submitted", sub.DayNumber),
				GithubUrl:      sub.GithubCommitURL,
				LinkedinUrl:    sub.LinkedinPostURL,
				TimeAgo:        "Recently",
				ReactionsCount: 16,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"feed": feed})
}

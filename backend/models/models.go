package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a student registered in ABTalks (Neon PostgreSQL)
type User struct {
	ID             string       `gorm:"type:uuid;primaryKey" json:"id"`
	Name           string       `gorm:"size:255;not null" json:"name"`
	Username       string       `gorm:"size:255;uniqueIndex;not null" json:"username"`
	Email          string       `gorm:"size:255;uniqueIndex;not null" json:"email"`
	PasswordHash   string       `gorm:"size:255;not null" json:"-"`
	Avatar         string       `gorm:"type:text;not null" json:"avatar"`
	Track          string       `gorm:"size:255;default:'Fullstack Web & AI Systems'" json:"track"`
	Thought        string       `gorm:"type:text" json:"thought"`
	TechStack      string       `gorm:"type:text;default:'[\"Next.js\", \"TypeScript\", \"Golang\", \"Neon PostgreSQL\"]'" json:"techStack"`
	CurrentStreak  int          `gorm:"default:0" json:"currentStreak"`
	LongestStreak  int          `gorm:"default:0" json:"longestStreak"`
	CompletedDays  int          `gorm:"default:0" json:"completedDays"`
	TotalDays      int          `gorm:"default:60" json:"totalDays"`
	StandingRank   string       `gorm:"size:255;default:'Contender'" json:"standingRank"`
	GithubHandle   string       `gorm:"size:255" json:"githubHandle"`
	LinkedinHandle string       `gorm:"size:255" json:"linkedinHandle"`
	CreatedAt      time.Time    `json:"createdAt"`
	UpdatedAt      time.Time    `json:"updatedAt"`
	Submissions    []Submission `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"submissions,omitempty"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}

// Submission represents daily proof of work (GitHub commit + LinkedIn post)
type Submission struct {
	ID              string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID          string    `gorm:"type:uuid;index;not null" json:"userId"`
	DayNumber       int       `gorm:"not null" json:"dayNumber"`
	GithubCommitURL string    `gorm:"type:text;not null" json:"githubCommitUrl"`
	LinkedinPostURL string    `gorm:"type:text;not null" json:"linkedinPostUrl"`
	DemoURL         string    `gorm:"type:text" json:"demoUrl,omitempty"`
	SubmittedAt     time.Time `json:"submittedAt"`
	User            *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (s *Submission) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	if s.SubmittedAt.IsZero() {
		s.SubmittedAt = time.Now()
	}
	return nil
}

// Auth & Request DTOs
type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Username string `json:"username"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ProfileUpdateRequest struct {
	Name           string   `json:"name"`
	Track          string   `json:"track"`
	Avatar         string   `json:"avatar"`
	GithubHandle   string   `json:"githubHandle"`
	LinkedinHandle string   `json:"linkedinHandle"`
	Thought        string   `json:"thought"`
	TechStack      []string `json:"techStack"`
}

type SubmissionRequest struct {
	DayNumber       int    `json:"dayNumber" binding:"required"`
	GithubCommitURL string `json:"githubCommitUrl" binding:"required"`
	LinkedinPostURL string `json:"linkedinPostUrl" binding:"required"`
	DemoURL         string `json:"demoUrl"`
}

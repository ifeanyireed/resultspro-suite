package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
	"service_coursespro/db"
	"service_coursespro/models"
)

// GenerateQuiz uses Gemini to read a module's markdown and generate a JSON quiz
func (h *Handler) GenerateQuiz(c *gin.Context) {
	moduleID := c.Param("moduleId")
	
	var module models.JourneyModule
	if err := db.WithTenant(c).First(&module, "id = ?", moduleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
		return
	}

	if module.ContentMarkdown == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Module has no markdown content to analyze"})
		return
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "GEMINI_API_KEY is not configured"})
		return
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize AI client"})
		return
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	model.ResponseMIMEType = "application/json"
	
	prompt := `
You are an expert educator. Read the following lesson markdown and generate a 3-question multiple choice quiz.
Return ONLY a JSON array of objects with the following schema:
[
  {
    "question": "What is...?",
    "options": ["A", "B", "C", "D"],
    "correct_index": 0
  }
]

Lesson Content:
` + module.ContentMarkdown

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI generation failed"})
		return
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI returned empty response"})
		return
	}

	// Parse response
	var rawJSON string
	if part, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
		rawJSON = string(part)
	}

	// Try to unmarshal to ensure it's valid JSON
	var quiz []map[string]interface{}
	if err := json.Unmarshal([]byte(strings.TrimSpace(rawJSON)), &quiz); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response as JSON", "raw": rawJSON})
		return
	}

	c.JSON(http.StatusOK, gin.H{"quiz": quiz})
}

package utils

import (
	"context"
	"strings"
)

type AIProvider interface {
	GenerateTutorResponse(ctx context.Context, query string, history []map[string]string, weakTopics []string, syllabusContext string) (string, error)
	ValidateTheoryAnswer(ctx context.Context, questionBody string, referenceAnswer *string, userAnswer string) (bool, string, error)
	GenerateExplanation(ctx context.Context, question string, options []string, correctOption string) (string, error)
	GenerateTopicLessonNote(ctx context.Context, topicName string, syllabusContent *string) (string, error)
}

func GetAIProvider() AIProvider {
	providerName := GetSettingWithFallback("ai_provider", "AI_PROVIDER")
	if providerName == "mistral" {
		return &MistralProvider{}
	}
	return &GeminiProvider{}
}

func GenerateTutorResponse(ctx context.Context, query string, history []map[string]string, weakTopics []string, syllabusContext string) (string, error) {
	return GetAIProvider().GenerateTutorResponse(ctx, query, history, weakTopics, syllabusContext)
}

func ValidateTheoryAnswer(ctx context.Context, questionBody string, referenceAnswer *string, userAnswer string) (bool, string, error) {
	return GetAIProvider().ValidateTheoryAnswer(ctx, questionBody, referenceAnswer, userAnswer)
}

func GenerateExplanation(ctx context.Context, question string, options []string, correctOption string) (string, error) {
	return GetAIProvider().GenerateExplanation(ctx, question, options, correctOption)
}

func GenerateTopicLessonNote(ctx context.Context, topicName string, syllabusContent *string) (string, error) {
	return GetAIProvider().GenerateTopicLessonNote(ctx, topicName, syllabusContent)
}

// ExtractJSON attempts to find and extract a JSON object from a string that might contain model chatter.
func ExtractJSON(input string) string {
	// Look for markdown code blocks
	if strings.Contains(input, "```json") {
		parts := strings.Split(input, "```json")
		if len(parts) > 1 {
			inner := strings.Split(parts[1], "```")[0]
			return strings.TrimSpace(inner)
		}
	}
	if strings.Contains(input, "```") {
		parts := strings.Split(input, "```")
		if len(parts) > 1 {
			return strings.TrimSpace(parts[1])
		}
	}

	// Find first { and last }
	start := strings.Index(input, "{")
	end := strings.LastIndex(input, "}")
	if start != -1 && end != -1 && end > start {
		return input[start : end+1]
	}

	return strings.TrimSpace(input)
}

func StringPtr(s string) *string {
	return &s
}

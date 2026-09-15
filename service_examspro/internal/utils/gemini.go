package utils

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type GeminiProvider struct{}

func (g *GeminiProvider) GenerateTutorResponse(ctx context.Context, query string, history []map[string]string, weakTopics []string, syllabusContext string, examName string) (string, error) {
	apiKey := GetRandomAPIKey(GetSettingWithFallback("gemini_api_key", "GEMINI_API_KEY"))
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY is not set")
	}

	geminiModel := GetSettingWithFallback("gemini_model", "GEMINI_MODEL")
	if geminiModel == "" {
		geminiModel = "gemini-2.5-flash"
	}

	examContext := examName
	if examContext == "" {
		examContext = "Nigerian examinations"
	}

	systemPrompt := fmt.Sprintf(`
      You are "ResultPRO Study Assistant", an expert AI tutor for students preparing for %s.
      
      CONTEXT:
      - Student's Weak Topics: %v
      %s
      
      GUIDELINES:
      1. Be concise, encouraging, and highly academic but accessible.
      2. Focus strictly on the relevant syllabus for %s. 
      3. Use local context (e.g., mention Naira instead of Dollars if giving math examples) where applicable.
      4. If the student asks about a weak topic, give them extra attention and a mini-quiz question to test them.
      5. Format using Markdown.
      6. If the user query is irrelevant to education or exams, politely redirect them to study.
    `, examContext, weakTopics, syllabusContext, examContext)

	fullPrompt := fmt.Sprintf("%s\n\nUser Query: %s", systemPrompt, query)

	return g.callGeminiREST(ctx, apiKey, geminiModel, fullPrompt, history)
}

func (g *GeminiProvider) ValidateTheoryAnswer(ctx context.Context, questionBody string, referenceAnswer *string, userAnswer string, examName string) (bool, string, error) {
	apiKey := GetRandomAPIKey(GetSettingWithFallback("gemini_api_key", "GEMINI_API_KEY"))
	if apiKey == "" {
		return false, "", fmt.Errorf("GEMINI_API_KEY is not set")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return false, "", err
	}
	defer client.Close()

	geminiModel := GetSettingWithFallback("gemini_model", "GEMINI_MODEL")
	if geminiModel == "" {
		geminiModel = "gemini-2.5-flash"
	}
	model := client.GenerativeModel(geminiModel)

	ref := "No specific reference answer provided. Use your general knowledge."
	if referenceAnswer != nil {
		ref = *referenceAnswer
	}

	examContext := examName
	if examContext == "" {
		examContext = "Nigerian"
	}

	prompt := fmt.Sprintf(`
      You are an expert %s examiner. 
      Evaluate the student's answer based on the question and the reference model answer.
      
      QUESTION: %s
      REFERENCE MODEL ANSWER: %s
      STUDENT'S ANSWER: %s
      
      TASK:
      1. Determine if the student's answer is correct, partially correct, or incorrect. 
      2. If it covers the main points, mark it as correct.
      3. Provide a very brief feedback/explanation (max 50 words).
      
      OUTPUT FORMAT (JSON):
      {
        "isCorrect": boolean,
        "feedback": "string"
      }
      
      Respond ONLY with the JSON.
    `, examContext, questionBody, ref, userAnswer)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return false, "", err
	}

	if len(resp.Candidates) == 0 {
		return false, "", fmt.Errorf("no candidates returned")
	}

	part := resp.Candidates[0].Content.Parts[0]
	if text, ok := part.(genai.Text); ok {
		var result struct {
			IsCorrect bool   `json:"isCorrect"`
			Feedback  string `json:"feedback"`
		}
		
		cleanJSON := ExtractJSON(string(text))
		
		if err := json.Unmarshal([]byte(cleanJSON), &result); err != nil {
			return false, "", fmt.Errorf("failed to parse AI response: %v, raw text: %s", err, string(text))
		}
		return result.IsCorrect, result.Feedback, nil
	}

	return false, "", fmt.Errorf("unexpected AI response")
}

func (g *GeminiProvider) GenerateExplanation(ctx context.Context, question string, options []string, correctOption string, examName string) (string, error) {
	apiKey := GetRandomAPIKey(GetSettingWithFallback("gemini_api_key", "GEMINI_API_KEY"))
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY is not set")
	}
	
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return "", err
	}
	defer client.Close()

	geminiModel := GetSettingWithFallback("gemini_model", "GEMINI_MODEL")
	if geminiModel == "" {
		geminiModel = "gemini-2.5-flash"
	}
	model := client.GenerativeModel(geminiModel)

	examContext := examName
	if examContext == "" {
		examContext = "Nigerian"
	}

	prompt := fmt.Sprintf(`
      As an expert %s tutor, provide a clear, concise step-by-step explanation for this question.
      Question: %s
      Options: %v
      Correct Answer: %s
      
      The explanation should be friendly, highly accurate, and easy for a student preparing for %s to understand. 
      Use Markdown formatting. Keep it under 150 words.
    `, examContext, question, options, correctOption, examContext)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) == 0 {
		return "", fmt.Errorf("no candidates returned")
	}

	part := resp.Candidates[0].Content.Parts[0]
	if text, ok := part.(genai.Text); ok {
		return string(text), nil
	}

	return "", nil
}

func (g *GeminiProvider) GenerateTopicLessonNote(ctx context.Context, topicName string, syllabusContent *string, examName string) (string, error) {
	apiKey := GetRandomAPIKey(GetSettingWithFallback("gemini_api_key", "GEMINI_API_KEY"))
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY is not set")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return "", err
	}
	defer client.Close()

	geminiModel := GetSettingWithFallback("gemini_model", "GEMINI_MODEL")
	if geminiModel == "" {
		geminiModel = "gemini-2.5-flash"
	}
	model := client.GenerativeModel(geminiModel)

	syllabus := "No official syllabus detail available."
	if syllabusContent != nil {
		syllabus = *syllabusContent
	}

	prompt := fmt.Sprintf(`
      You are "ResultPRO Study Assistant", an expert tutor for the %s examination.
      
      TASK: Create a comprehensive, easy-to-read Lesson Note for the topic: "%s".
      
      SYLLABUS CONTEXT:
      %s
      
      STRUCTURE:
      1. Introduction: Hook the student and explain why this topic is important for the %s exam.
      2. Key Concepts: Break down the main points into clear, bulleted sub-sections.
      3. Practical Examples: Provide real-life examples strictly relevant to the %s exam.
      4. Summary: A quick wrap-up of what they should remember.
      5. "ResultPRO Tip": A short exam strategy related to this topic.
      
      GUIDELINES:
      - Use professional but accessible Markdown.
      - Use bold text for key terms.
      - Keep it academic, accurate, and highly structured.
      - If the exam is ICAN or a professional certification, ensure the tone, vocabulary, and depth of complexity reflect advanced professional standards.
      - Length: Approximately 400-800 words.
    `, examName, topicName, syllabus, examName, examName)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) == 0 {
		return "", fmt.Errorf("no candidates returned")
	}

	part := resp.Candidates[0].Content.Parts[0]
	if text, ok := part.(genai.Text); ok {
		return string(text), nil
	}

	return "", fmt.Errorf("unexpected response type")
}

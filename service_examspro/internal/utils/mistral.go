package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type MistralProvider struct{}

type mistralMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type mistralRequest struct {
	Model    string           `json:"model"`
	Messages []mistralMessage `json:"messages"`
}

type mistralResponse struct {
	Choices []struct {
		Message mistralMessage `json:"message"`
	} `json:"choices"`
}

func (m *MistralProvider) callMistral(ctx context.Context, messages []mistralMessage) (string, error) {
	apiKey := GetSettingWithFallback("mistral_api_key", "MISTRAL_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("MISTRAL_API_KEY is not set")
	}

	model := GetSettingWithFallback("mistral_model", "MISTRAL_MODEL")
	if model == "" {
		model = "mistral-small-latest"
	}

	reqBody := mistralRequest{
		Model:    model,
		Messages: messages,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.mistral.ai/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("mistral api error: %s - %s", resp.Status, string(body))
	}

	var mResp mistralResponse
	if err := json.NewDecoder(resp.Body).Decode(&mResp); err != nil {
		return "", err
	}

	if len(mResp.Choices) == 0 {
		return "", fmt.Errorf("no response from mistral")
	}

	return mResp.Choices[0].Message.Content, nil
}

func (m *MistralProvider) GenerateTutorResponse(ctx context.Context, query string, history []map[string]string, weakTopics []string, syllabusContext string) (string, error) {
	systemPrompt := fmt.Sprintf(`
      You are "ResultPRO Study Assistant", an expert AI tutor for Nigerian students preparing for JAMB and WAEC.
      
      CONTEXT:
      - Student's Weak Topics: %v
      %s
      
      GUIDELINES:
      1. Be concise, encouraging, and highly academic but accessible.
      2. Focus strictly on the Nigerian Secondary School syllabus (WAEC/JAMB). 
      3. Use local context (e.g., mention Naira instead of Dollars if giving math examples).
      4. If the student asks about a weak topic, give them extra attention and a mini-quiz question to test them.
      5. Format using Markdown.
      6. If the user query is irrelevant to education or exams, politely redirect them to study.
    `, weakTopics, syllabusContext)

	messages := []mistralMessage{
		{Role: "system", Content: systemPrompt},
	}

	for _, h := range history {
		role := "user"
		if h["role"] != "user" {
			role = "assistant"
		}
		messages = append(messages, mistralMessage{Role: role, Content: h["content"]})
	}

	messages = append(messages, mistralMessage{Role: "user", Content: query})

	return m.callMistral(ctx, messages)
}

func (m *MistralProvider) ValidateTheoryAnswer(ctx context.Context, questionBody string, referenceAnswer *string, userAnswer string) (bool, string, error) {
	ref := "No specific reference answer provided. Use your general knowledge."
	if referenceAnswer != nil {
		ref = *referenceAnswer
	}

	prompt := fmt.Sprintf(`
      You are an expert JAMB/WAEC examiner. 
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
    `, questionBody, ref, userAnswer)

	messages := []mistralMessage{
		{Role: "user", Content: prompt},
	}

	resp, err := m.callMistral(ctx, messages)
	if err != nil {
		return false, "", err
	}

	var result struct {
		IsCorrect bool   `json:"isCorrect"`
		Feedback  string `json:"feedback"`
	}

	cleanJSON := ExtractJSON(resp)

	if err := json.Unmarshal([]byte(cleanJSON), &result); err != nil {
		return false, "", fmt.Errorf("failed to parse AI response: %v", err)
	}

	return result.IsCorrect, result.Feedback, nil
}

func (m *MistralProvider) GenerateExplanation(ctx context.Context, question string, options []string, correctOption string) (string, error) {
	prompt := fmt.Sprintf(`
      As an expert JAMB and WAEC tutor, provide a clear, concise step-by-step explanation for this question.
      Question: %s
      Options: %v
      Correct Answer: %s
      
      The explanation should be friendly and easy for a Nigerian high school student to understand. 
      Use Markdown formatting. Keep it under 150 words.
    `, question, options, correctOption)

	messages := []mistralMessage{
		{Role: "user", Content: prompt},
	}

	return m.callMistral(ctx, messages)
}

func (m *MistralProvider) GenerateTopicLessonNote(ctx context.Context, topicName string, syllabusContent *string) (string, error) {
	syllabus := "No official syllabus detail available."
	if syllabusContent != nil {
		syllabus = *syllabusContent
	}

	prompt := fmt.Sprintf(`
      You are "ResultPRO Study Assistant", an expert WAEC and JAMB tutor.
      
      TASK: Create a comprehensive, easy-to-read Lesson Note for the topic: "%s".
      
      SYLLABUS CONTEXT:
      %s
      
      STRUCTURE:
      1. Introduction: Hook the student and explain why this topic is important for JAMB/WAEC.
      2. Key Concepts: Break down the main points into clear, bulleted sub-sections.
      3. Practical Examples: Provide real-life examples related to the Nigerian context.
      4. Summary: A quick wrap-up of what they should remember.
      5. "ResultPRO Tip": A short exam strategy related to this topic.
      
      GUIDELINES:
      - Use professional but accessible Markdown.
      - Use bold text for key terms.
      - Keep it academic, accurate, and highly structured.
      - Length: Approximately 400-600 words.
    `, topicName, syllabus)

	messages := []mistralMessage{
		{Role: "user", Content: prompt},
	}

	return m.callMistral(ctx, messages)
}

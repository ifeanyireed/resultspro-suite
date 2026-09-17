package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
)

type GeminiRequest struct {
	Contents []GeminiContent `json:"contents"`
	SystemInstruction *GeminiContent `json:"system_instruction,omitempty"`
}

type GeminiContent struct {
	Role  string        `json:"role,omitempty"`
	Parts []GeminiPart  `json:"parts"`
}

type GeminiPart struct {
	Text string `json:"text"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func HandleAIResponse(sessionID, userMessage string) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		sendAIMessage(sessionID, "I'm the automated assistant, but my AI module is currently offline. I've left a message for our human support team, and they will get back to you as soon as they are online!")
		return
	}

	// Fetch all published KB articles to use as context
	var articles []KBArticle
	db.GormDB.Where("status = ?", "published").Find(&articles)

	contextText := "You are a helpful customer support agent for ResultsPRO Suite. Answer the user's questions based on the following Knowledge Base articles. If the answer is not in the knowledge base, be polite and tell them you don't know, but human support will follow up shortly.\n\n--- KNOWLEDGE BASE ---\n"
	for _, art := range articles {
		contextText += fmt.Sprintf("Title: %s\nContent: %s\n\n", art.Title, art.Content)
	}

	// Fetch recent chat history for context
	var history []ChatHistoryRecord
	db.GormDB.Where("session_id = ?", sessionID).Order("created_at DESC").Limit(10).Find(&history)

	var contents []GeminiContent
	
	// Add history (reversed because we fetched DESC)
	for i := len(history) - 1; i >= 0; i-- {
		msg := history[i]
		role := "user"
		if msg.Sender != "Guest" {
			role = "model"
		}
		contents = append(contents, GeminiContent{
			Role: role,
			Parts: []GeminiPart{{Text: msg.Message}},
		})
	}
	
	// If history is empty or doesn't include the current message (due to race condition), add the current message manually
	if len(contents) == 0 || contents[len(contents)-1].Parts[0].Text != userMessage {
		contents = append(contents, GeminiContent{
			Role: "user",
			Parts: []GeminiPart{{Text: userMessage}},
		})
	}

	reqBody := GeminiRequest{
		Contents: contents,
		SystemInstruction: &GeminiContent{
			Parts: []GeminiPart{{Text: contextText}},
		},
	}

	jsonData, _ := json.Marshal(reqBody)
	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil || resp.StatusCode != 200 {
	    if resp != nil {
	        bodyBytes, _ := ioutil.ReadAll(resp.Body)
	        log.Println("Gemini error:", string(bodyBytes))
	    }
		sendAIMessage(sessionID, "I'm having a little trouble connecting to my brain right now. I've left a message for our support team to follow up with you!")
		return
	}
	defer resp.Body.Close()

	var geminiResp GeminiResponse
	if err := json.NewDecoder(resp.Body).Decode(&geminiResp); err != nil {
		sendAIMessage(sessionID, "I'm having trouble processing that. A human will be with you shortly!")
		return
	}

	if len(geminiResp.Candidates) > 0 && len(geminiResp.Candidates[0].Content.Parts) > 0 {
		aiReply := geminiResp.Candidates[0].Content.Parts[0].Text
		sendAIMessage(sessionID, aiReply)
	}
}

func sendAIMessage(sessionID, text string) {
	chatMsg := ChatMessage{
		Type:      "message",
		ID:        uuid.New().String(),
		SessionID: sessionID,
		Sender:    "Support AI",
		Text:      text,
		Timestamp: time.Now(),
	}

	// Save to DB
	db.GormDB.Exec(
		"INSERT INTO support_live_chats (id, session_id, sender, message, created_at) VALUES (?, ?, ?, ?, ?)",
		chatMsg.ID, chatMsg.SessionID, chatMsg.Sender, chatMsg.Text, chatMsg.Timestamp,
	)

	payload, _ := json.Marshal(chatMsg)
	Hub.broadcast <- payload
}

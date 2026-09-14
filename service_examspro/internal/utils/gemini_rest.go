package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func (g *GeminiProvider) callGeminiREST(ctx context.Context, apiKey, modelName, prompt string, history []map[string]string) (string, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", modelName, apiKey)
	
	type Part struct {
		Text string `json:"text"`
	}
	type Content struct {
		Role  string `json:"role"`
		Parts []Part `json:"parts"`
	}
	
	var contents []Content
	for _, h := range history {
		role := "user"
		if h["role"] != "user" {
			role = "model"
		}
		contents = append(contents, Content{
			Role:  role,
			Parts: []Part{{Text: h["content"]}},
		})
	}
	contents = append(contents, Content{
		Role:  "user",
		Parts: []Part{{Text: prompt}},
	})
	
	reqBody := map[string]interface{}{
		"contents": contents,
	}
	
	jsonData, _ := json.Marshal(reqBody)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	
	bodyBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("gemini api error: %s - %s", resp.Status, string(bodyBytes))
	}
	
	var gResp struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}
	
	if err := json.Unmarshal(bodyBytes, &gResp); err != nil {
		return "", fmt.Errorf("JSON decode error: %v, raw response: %s", err, string(bodyBytes))
	}
	
	if len(gResp.Candidates) == 0 || len(gResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no response from gemini")
	}
	
	return gResp.Candidates[0].Content.Parts[0].Text, nil
}

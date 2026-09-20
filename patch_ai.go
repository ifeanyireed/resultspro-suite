package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	content, _ := os.ReadFile("service_coursespro/handlers/ai.go")
	str := string(content)

	oldReq := `type GenerateQuizReq struct {
	Content string json:"content" binding:"required"
}`
	// Replacing literal with actual file content since sed didn't show tags fully inside json struct due to shell escape.
    // Let's just use string replacement in go to be exact.
    
}

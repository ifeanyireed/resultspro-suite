package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
)

func UploadFile(file *multipart.FileHeader, folder string) (string, error) {
	if folder == "" {
		folder = "uploads"
	}

	f, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer f.Close()

	uploadDir := filepath.Join("public", folder)
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return "", fmt.Errorf("failed to create upload directory: %v", err)
	}

	filename := file.Filename
	filePath := filepath.Join(uploadDir, filename)

	out, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %v", err)
	}
	defer out.Close()

	if _, err := io.Copy(out, f); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	// Return a relative URL
	url := fmt.Sprintf("/%s/%s", folder, filename)
	return url, nil
}

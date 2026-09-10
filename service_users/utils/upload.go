package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
)

func UploadFile(file multipart.File, header *multipart.FileHeader, folder string) (string, error) {
	if folder == "" {
		folder = "uploads"
	}

	uploadDir := filepath.Join(".", folder)
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return "", fmt.Errorf("failed to create upload directory: %v", err)
	}

	filename := header.Filename
	filePath := filepath.Join(uploadDir, filename)

	out, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %v", err)
	}
	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	// Return a relative URL
	url := fmt.Sprintf("/%s/%s", folder, filename)
	return url, nil
}

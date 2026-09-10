package utils

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
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

	cloudinaryURL := os.Getenv("CLOUDINARY_URL")
	if cloudinaryURL == "" {
		cloudinaryURL = "cloudinary://914619779136733:Ke9yYpcXrl0uD0_7GhVj76elkx0@qsdwzejd"
	}

	cld, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		return "", fmt.Errorf("failed to initialize cloudinary: %v", err)
	}

	ctx := context.Background()
	resp, err := cld.Upload.Upload(ctx, f, uploader.UploadParams{
		Folder: folder,
	})
	if err != nil {
		return "", fmt.Errorf("cloudinary upload error: %v", err)
	}

	return resp.SecureURL, nil
}

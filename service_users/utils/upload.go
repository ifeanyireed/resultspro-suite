package utils

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadFile(file multipart.File, header *multipart.FileHeader, folder string) (string, error) {
	if folder == "" {
		folder = "uploads"
	}

	cloudinaryURL := os.Getenv("CLOUDINARY_URL")
	if cloudinaryURL == "" {
		cloudinaryURL = "cloudinary://914619779136733:Ke9yYpcXrl0uD0_7GhVj76elkx0@qsdwzejd"
	}

	cld, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		return "", fmt.Errorf("failed to initialize cloudinary: %v", err)
	}

	ctx := context.Background()
	resp, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: folder,
	})
	if err != nil {
		return "", fmt.Errorf("cloudinary upload error: %v", err)
	}

	return resp.SecureURL, nil
}

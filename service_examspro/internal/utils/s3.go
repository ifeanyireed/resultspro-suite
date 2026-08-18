package utils

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func UploadToS3(file *multipart.FileHeader, folder string) (string, error) {
	bucket := os.Getenv("AWS_S3_BUCKET")
	region := os.Getenv("AWS_REGION")
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")

	if bucket == "" || region == "" || accessKey == "" || secretKey == "" {
		return "", fmt.Errorf("AWS credentials or bucket name not configured")
	}

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	)
	if err != nil {
		return "", fmt.Errorf("failed to load AWS config: %v", err)
	}

	client := s3.NewFromConfig(cfg)

	f, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer f.Close()

	if folder == "" {
		folder = "uploads"
	}
	key := fmt.Sprintf("%s/%s", folder, file.Filename)

	_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(key),
		Body:        f,
		ContentType: aws.String(file.Header.Get("Content-Type")),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to S3: %v", err)
	}

	url := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", bucket, region, key)
	return url, nil
}

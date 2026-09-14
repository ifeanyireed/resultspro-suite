package utils

import (
	"os"
	"strings"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
)

// GetSettingWithFallback retrieves a setting from the database.
// GetSettingWithFallback checks the environment variable first (for easy .env overrides).
// If not found, it falls back to the database.
func GetSettingWithFallback(settingID, envKey string) string {
	if envVal := os.Getenv(envKey); envVal != "" {
		return strings.Trim(envVal, `"'`)
	}

	var setting models.SystemSetting
	err := database.DB.Where("id = ?", settingID).First(&setting).Error
	if err == nil && setting.Value != "" {
		return strings.Trim(setting.Value, `"'`)
	}

	return ""
}

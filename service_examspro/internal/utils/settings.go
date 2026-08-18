package utils

import (
	"os"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
)

// GetSettingWithFallback retrieves a setting from the database.
// If the setting is empty or not found, it falls back to an environment variable.
func GetSettingWithFallback(settingID, envKey string) string {
	var setting models.SystemSetting
	err := database.DB.Where("id = ?", settingID).First(&setting).Error
	if err == nil && setting.Value != "" {
		return setting.Value
	}

	return os.Getenv(envKey)
}

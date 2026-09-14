package utils

import (
	"math/rand"
	"os"
	"strings"
	"time"

	"exams-resultspro-backend/internal/database"
	"exams-resultspro-backend/internal/models"
)

// GetSettingWithFallback retrieves a setting from the database.
// It prioritizes the database setting, allowing dynamic updates.
// If not found in the database, it falls back to the environment variable.
func GetSettingWithFallback(settingID, envKey string) string {
	var setting models.SystemSetting
	err := database.DB.Where("id = ?", settingID).First(&setting).Error
	if err == nil && setting.Value != "" {
		return strings.Trim(setting.Value, `"'`)
	}

	if envVal := os.Getenv(envKey); envVal != "" {
		return strings.Trim(envVal, `"'`)
	}

	return ""
}

func GetRandomAPIKey(keyString string) string {
	if keyString == "" {
		return ""
	}
	keys := strings.Split(keyString, ",")
	var validKeys []string
	for _, k := range keys {
		trimmed := strings.TrimSpace(k)
		if trimmed != "" {
			validKeys = append(validKeys, trimmed)
		}
	}
	if len(validKeys) == 0 {
		return ""
	}
	rand.Seed(time.Now().UnixNano())
	return validKeys[rand.Intn(len(validKeys))]
}

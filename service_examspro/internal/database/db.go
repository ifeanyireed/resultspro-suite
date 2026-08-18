package database

import (
	"log"
	"os"

	"exams-resultspro-backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Printf("GORM MySQL connect warning: %v", err)
		return
	}

	// Auto-migrate models
	err = db.AutoMigrate(
		&models.User{},
		&models.CoinTransaction{},
		&models.Referral{},
		&models.Exam{},
		&models.Subject{},
		&models.Topic{},
		&models.Question{},
		&models.QuestionOption{},
		&models.UserAnswer{},
		&models.Battle{},
		&models.BattleParticipant{},
		&models.BattleQuestion{},
		&models.StudySession{},
		&models.ChatMessage{},
		&models.Report{},
		&models.CoinPack{},
		&models.Purchase{},
		&models.Withdrawal{},
		&models.LiveGameRoom{},
		&models.LiveGameParticipant{},
		&models.LiveRoomChatMessage{},
		&models.SystemSetting{},
		&models.Tournament{},
		&models.TournamentParticipant{},
		&models.Notification{},
		&models.NotificationLog{},
		&models.NotificationCampaign{},
		&models.PopupNotification{},
		&models.BlogPost{},
		&models.BlogCategory{},
		&models.BlogComment{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = db
	log.Println("Database connected successfully")

	SeedSystemSettings(db)
}

func SeedSystemSettings(db *gorm.DB) {
	defaults := []models.SystemSetting{
		{ID: "base_mcq_reward", Value: "1", Type: "number", SettingGroup: "Economy", Label: "Base MCQ Reward", Desc: "Coins awarded for answering a question correctly"},
		{ID: "ai_deep_dive_cost", Value: "3", Type: "number", SettingGroup: "Economy", Label: "AI Deep Dive Cost", Desc: "Coins required for a detailed AI explanation"},
		{ID: "min_battle_stake", Value: "10", Type: "number", SettingGroup: "Economy", Label: "Min. Battle Stake", Desc: "Minimum coins to join a battle"},
		{ID: "referral_bonus", Value: "25", Type: "number", SettingGroup: "Economy", Label: "Referral Bonus", Desc: "Bonus coins for the referrer"},
		{ID: "signup_bonus", Value: "50", Type: "number", SettingGroup: "Economy", Label: "Signup Bonus", Desc: "Starting coins for new users"},
		{ID: "daily_login_reward", Value: "5", Type: "number", SettingGroup: "Economy", Label: "Daily Login Reward", Desc: "Coins granted for the first login of the day"},
		{ID: "battle_platform_fee_percent", Value: "10", Type: "number", SettingGroup: "Economy", Label: "Battle Platform Fee (%)", Desc: "Percentage deducted from the total pot in battles"},
		{ID: "withdrawal_min_coins", Value: "1000", Type: "number", SettingGroup: "Economy", Label: "Min. Withdrawal (Coins)", Desc: "Minimum coins required to request a payout"},
		{ID: "coin_to_ngn_rate", Value: "10", Type: "number", SettingGroup: "Economy", Label: "Coin Exchange Rate (NGN)", Desc: "How much 1 coin is worth in Naira for withdrawals"},
		{ID: "streak_bonus_multiplier", Value: "2", Type: "number", SettingGroup: "Economy", Label: "Streak Multiplier", Desc: "Bonus multiplier for answering 5+ questions correctly in a row"},
		{ID: "subject_unlock_default", Value: "100", Type: "number", SettingGroup: "Economy", Label: "Default Subject Unlock", Desc: "Default cost to unlock a subject if not specified"},
		{ID: "premium_monthly_coins", Value: "500", Type: "number", SettingGroup: "Economy", Label: "Premium Monthly Coins", Desc: "Monthly coin stipend for premium members"},

		{ID: "battle_mode_enabled", Value: "true", Type: "boolean", SettingGroup: "Features", Label: "Battle Mode", Desc: "Enable real-time synchronous battles"},
		{ID: "live_games_enabled", Value: "true", Type: "boolean", SettingGroup: "Features", Label: "Live Games", Desc: "Enable admin-hosted live championship rooms"},
		{ID: "ai_assistant_enabled", Value: "true", Type: "boolean", SettingGroup: "Features", Label: "AI Study Assistant", Desc: "Enable Claude-powered chat tutor"},
		{ID: "auto_approve_comments", Value: "false", Type: "boolean", SettingGroup: "Features", Label: "Auto-Approve Comments", Desc: "Automatically approve blog comments"},
		{ID: "maintenance_mode", Value: "false", Type: "boolean", SettingGroup: "Features", Label: "Maintenance Mode", Desc: "Restrict app access to admins only"},
		{ID: "public_leaderboard", Value: "true", Type: "boolean", SettingGroup: "Features", Label: "Public Leaderboard", Desc: "Allow users to see global rankings"},
		{ID: "global_announcement", Value: `["Welcome to ResultsPRO!", "Ace Your Exams with AI-powered prep.", "Master your subjects through gamified practice.", "Free to use as long as you keep answering correctly."]`, Type: "string", SettingGroup: "Features", Label: "Hero Text Messages", Desc: "JSON list of messages displayed in the hero section animation"},
		{ID: "announcement_interval", Value: "5", Type: "number", SettingGroup: "Features", Label: "Hero Animation Interval (s)", Desc: "Time in seconds between message changes in the hero section"},
		
		{ID: "rate_limit", Value: "1000", Type: "number", SettingGroup: "Security", Label: "Rate Limiting", Desc: "Max requests per minute per IP"},
		{ID: "token_expiry", Value: "24", Type: "number", SettingGroup: "Security", Label: "Token Expiry (Hours)", Desc: "Duration before user session expires"},
		{ID: "api_secret_key", Value: "resultspro_secret_key_2026", Type: "string", SettingGroup: "Security", Label: "API Secret Key", Desc: "Global secret key for internal service authentication"},
		{ID: "gemini_api_key", Value: "", Type: "string", SettingGroup: "Security", Label: "Gemini API Key", Desc: "Google Gemini AI API Key (Overrides .env if set)"},
		{ID: "mistral_api_key", Value: "", Type: "string", SettingGroup: "Security", Label: "Mistral API Key", Desc: "Mistral AI API Key (Overrides .env if set)"},
		{ID: "mistral_model", Value: "mistral-small-latest", Type: "string", SettingGroup: "Security", Label: "Mistral Model", Desc: "Mistral model to use (e.g., mistral-small-latest, pixtral-12b-2409)"},
		{ID: "ai_provider", Value: "gemini", Type: "string", SettingGroup: "Security", Label: "Active AI Provider", Desc: "Choose the active AI provider: 'gemini' or 'mistral'"},
		
		{ID: "battle_cleanup_timeout", Value: "10", Type: "number", SettingGroup: "Features", Label: "Battle Cleanup (Mins)", Desc: "Unused/waiting battle rooms will be dropped after this many minutes"},
	}

	for _, s := range defaults {
		var existing models.SystemSetting
		if err := db.Where("id = ?", s.ID).First(&existing).Error; err != nil {
			db.Create(&s)
		}
	}
	log.Println("System settings synchronized successfully")
}

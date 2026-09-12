with open('service_examspro/internal/api/handlers/payment.go', 'r') as f:
    content = f.read()

target = """		// Handle Referral Conversion
		if txType == "PLAN_PURCHASE" {
			var referral models.Referral
			// If this user was referred, and the referral is still 'pending'
			if err := tx.Where("referee_id = ? AND status = ?", purchase.UserID, "pending").First(&referral).Error; err == nil {
			
				// Fetch Referral Settings
				var coinRewardSetting models.SystemSetting
				var fiatPercentSetting models.SystemSetting
				rewardCoins := 50
				fiatPercent := 10
				if tx.Where("id = ?", "referral_coin_reward").First(&coinRewardSetting).Error == nil {
					fmt.Sscanf(coinRewardSetting.Value, "%d", &rewardCoins)
				}
				if tx.Where("id = ?", "referral_fiat_percent").First(&fiatPercentSetting).Error == nil {
					fmt.Sscanf(fiatPercentSetting.Value, "%d", &fiatPercent)
				}
				rewardFiat := (purchase.AmountNgn * fiatPercent) / 100

				// 1. Update the referral status, coins_awarded and fiat_awarded
				if err := tx.Model(&referral).Updates(map[string]interface{}{
					"status":        "converted",
					"coins_awarded": rewardCoins,
					"fiat_awarded":  rewardFiat,
				}).Error; err != nil {
					log.Printf("Failed to update referral: %v", err)
				}

				// 2. Award coins to the referrer
				if rewardCoins > 0 {
					if err := tx.Model(&models.User{}).Where("id = ?", referral.ReferrerID).
						Update("coin_balance", gorm.Expr("coin_balance + ?", rewardCoins)).Error; err == nil {
					
						// 3. Create a coin transaction for the referrer
						desc := "Referral Bonus"
						refTx := models.CoinTransaction{
							ID:          uuid.New().String(),
							UserID:      referral.ReferrerID,
							Amount:      rewardCoins,
							Type:        "REFERRAL_BONUS",
							Description: &desc,
							ReferenceID: &referral.ID,
						}
						tx.Create(&refTx)
					}
				}
			}
		}"""

replacement = """		// Handle Referral Conversion (Fiat only, for first purchase)
		if txType == "PLAN_PURCHASE" || txType == "COIN_PACK_PURCHASE" {
			var referral models.Referral
			if err := tx.Where("referee_id = ? AND fiat_awarded = 0", purchase.UserID).First(&referral).Error; err == nil {
			
				// Fetch Referral Settings
				var fiatPercentSetting models.SystemSetting
				fiatPercent := 10
				if tx.Where("id = ?", "referral_fiat_percent").First(&fiatPercentSetting).Error == nil {
					fmt.Sscanf(fiatPercentSetting.Value, "%d", &fiatPercent)
				}
				rewardFiat := (purchase.AmountNgn * fiatPercent) / 100

				if err := tx.Model(&referral).Updates(map[string]interface{}{
					"status":       "converted",
					"fiat_awarded": rewardFiat,
				}).Error; err != nil {
					log.Printf("Failed to update referral: %v", err)
				}
			}
		}"""

if target in content:
    with open('service_examspro/internal/api/handlers/payment.go', 'w') as f:
        f.write(content.replace(target, replacement))
    print("Patched successfully")
else:
    print("Target block not found")

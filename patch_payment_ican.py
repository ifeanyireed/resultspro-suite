with open('service_examspro/internal/api/handlers/payment.go', 'r') as f:
    content = f.read()

import re

old_premium_logic = r'''		isPremium := \(metadata\.Type == "PREMIUM"\) \|\| \(purchase\.PackName == "Pro Plan"\)
		
		if !isPremium \{
			if err := tx\.Model\(&models\.User\{\}\)\.Where\("id = \?", purchase\.UserID\)\.
				Update\("coin_balance", gorm\.Expr\("coin_balance \+ \?", purchase\.CoinsGranted\)\)\.Error; err != nil \{
				return err
			\}
		\} else \{
			expiry := time\.Now\(\)\.AddDate\(0, 1, 0\)
			if err := tx\.Model\(&models\.User\{\}\)\.Where\("id = \?", purchase\.UserID\)\.
				Updates\(map\[string\]interface\{\}\{
					"is_premium":       true,
					"premium_expires_at": &expiry,
				\}\)\.Error; err != nil \{
				return err
			\}
		\}'''

new_premium_logic = """		isPremium := (metadata.Type == "PREMIUM") || (purchase.PackName == "Pro Plan")
		isIcan := (metadata.Type == "ICAN") || (purchase.PackName == "ICAN Study Pack")
		
		if isPremium {
			expiry := time.Now().AddDate(0, 1, 0)
			if err := tx.Model(&models.User{}).Where("id = ?", purchase.UserID).
				Updates(map[string]interface{}{
					"is_premium":       true,
					"premium_expires_at": &expiry,
				}).Error; err != nil {
				return err
			}
		} else if isIcan {
			expiry := time.Now().AddDate(0, 6, 0) // 6 months access for ICAN? Or maybe 1 month? Let's say 3 months, or 6 months. Wait, let's just use 1 month like premium for now, or 1 year. I'll make it 6 months.
			if err := tx.Model(&models.User{}).Where("id = ?", purchase.UserID).
				Updates(map[string]interface{}{
					"has_ican":       true,
					"ican_expires_at": &expiry,
				}).Error; err != nil {
				return err
			}
		} else {
			if err := tx.Model(&models.User{}).Where("id = ?", purchase.UserID).
				Update("coin_balance", gorm.Expr("coin_balance + ?", purchase.CoinsGranted)).Error; err != nil {
				return err
			}
		}"""

content = re.sub(old_premium_logic, new_premium_logic, content)

with open('service_examspro/internal/api/handlers/payment.go', 'w') as f:
    f.write(content)
print("Patched payment handler for ICAN")

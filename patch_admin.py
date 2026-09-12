with open('service_examspro/internal/api/handlers/admin.go', 'r') as f:
    content = f.read()

target1 = """	var pendingReferrals int64
	database.DB.Model(&models.Referral{}).Where("status = ?", "pending").Count(&pendingReferrals)"""
replacement1 = """	var pendingReferrals int64
	database.DB.Model(&models.Referral{}).Where("status = ?", "pending").Count(&pendingReferrals)

	var activeReferrals int64
	database.DB.Model(&models.Referral{}).Where("status = ?", "active").Count(&activeReferrals)"""

target2 = """			"converted":     convertedReferrals,
			"pending":       pendingReferrals,
			"coinsAwarded":  totalCoinsAwarded,
		},"""
replacement2 = """			"converted":     convertedReferrals,
			"pending":       pendingReferrals,
			"active":        activeReferrals,
			"coinsAwarded":  totalCoinsAwarded,
		},"""

content = content.replace(target1, replacement1).replace(target2, replacement2)
with open('service_examspro/internal/api/handlers/admin.go', 'w') as f:
    f.write(content)

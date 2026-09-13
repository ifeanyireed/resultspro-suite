const fs = require('fs');
const path = 'service_users/handlers/auth.go';
let content = fs.readFileSync(path, 'utf8');

// 1. Add TenantSlug to input struct
content = content.replace(
  "ReferralCode string `json:\"referral_code\"` // Added referral_code",
  "ReferralCode string `json:\"referral_code\"` // Added referral_code\n\t\tTenantSlug   string `json:\"tenant_slug\"`\n\t\tTenantID     string `json:\"tenant_id\"`"
);

// 2. Add Tenant Assignment after user creation
const tenantAssignment = `
	// Assign tenant role if requested
	if input.TenantSlug != "" || input.TenantID != "" {
		tenantID := input.TenantID
		if tenantID == "" && input.TenantSlug != "" {
			db.DB.QueryRow("SELECT id FROM tenants WHERE slug = ?", input.TenantSlug).Scan(&tenantID)
		}
		
		if tenantID != "" {
			_, err = db.DB.Exec("INSERT INTO user_tenant_roles (id, user_id, tenant_id, role, status, created_at, updated_at) VALUES (?, ?, ?, 'student', 'active', ?, ?)",
				uuid.New().String(), userID, tenantID, now.UTC().Format("2006-01-02 15:04:05"), now.UTC().Format("2006-01-02 15:04:05"))
			if err != nil {
				log.Printf("Failed to assign tenant role: %v", err)
			}
		}
	}

	// Create a record in referrals table if a referrer exists`;

content = content.replace("	// Create a record in referrals table if a referrer exists", tenantAssignment);

fs.writeFileSync(path, content);

const fs = require('fs');
const path = 'service_users/handlers/auth.go';
let content = fs.readFileSync(path, 'utf8');

// Replace the user query to include global is_admin and role
content = content.replace(
  'err := db.DB.QueryRow("SELECT id, email, password_hash, full_name, avatar_url, account_status, COALESCE(mfa_enabled, false) FROM users WHERE email = ?", email).\n\t\tScan(&user.ID, &user.Email, &user.PasswordHash, &user.FullName, &user.AvatarURL, &user.AccountStatus, &user.MFAEnabled)',
  `var isGlobalAdmin bool
	var globalRole sql.NullString
	err := db.DB.QueryRow("SELECT id, email, password_hash, full_name, avatar_url, account_status, COALESCE(mfa_enabled, false), COALESCE(is_admin, false), role FROM users WHERE email = ?", email).
		Scan(&user.ID, &user.Email, &user.PasswordHash, &user.FullName, &user.AvatarURL, &user.AccountStatus, &user.MFAEnabled, &isGlobalAdmin, &globalRole)`
);

// Append the global role to the roles array and set hasTenantAccess
content = content.replace(
  'if input.TenantID != "" && !hasTenantAccess {',
  `if globalRole.Valid && globalRole.String != "" {
		roles = append(roles, globalRole.String)
		if globalRole.String == "platform-admin" || globalRole.String == "superadmin" {
			hasTenantAccess = true
		}
	}
	if isGlobalAdmin {
		hasTenantAccess = true
	}

	if input.TenantID != "" && !hasTenantAccess {`
);

fs.writeFileSync(path, content);

package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// HandleCreateTenant registers a new organization/tenant
func HandleCreateTenant(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		ID                string `json:"id"`
		Name              string `json:"name"`
		Slug              string `json:"slug"`
		TenantCode        string `json:"tenant_code"`
		ShortName         string `json:"short_name"`
		Motto             string `json:"motto"`
		ContactEmail      string `json:"contact_email"`
		ContactPhone      string `json:"contact_phone"`
		ContactPersonName string `json:"contact_person_name"`
		FullAddress       string `json:"full_address"`
		State             string `json:"state"`
		LGA               string `json:"lga"`
		AgentID           string `json:"agent_id"` // referred_by_agent_id
		SubscriptionTier  string `json:"subscription_tier"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if input.Name == "" || input.Slug == "" {
		utils.JSONError(w, http.StatusBadRequest, "Name and slug are required")
		return
	}

	tenantID := input.ID
	if tenantID == "" {
		tenantID = uuid.New().String()
	}

	tier := input.SubscriptionTier
	if tier == "" {
		tier = "FREE"
	}

	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `
		INSERT INTO tenants (id, name, slug, tenant_code, short_name, motto, contact_email, contact_phone, contact_person_name, full_address, state, lga, status, verification_status, referred_by_agent_id, subscription_tier, created_at, updated_at) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 'PENDING_VERIFICATION', ?, ?, ?, ?)`

	_, err := db.DB.Exec(query,
		tenantID,
		input.Name,
		input.Slug,
		sql.NullString{String: input.TenantCode, Valid: input.TenantCode != ""},
		sql.NullString{String: input.ShortName, Valid: input.ShortName != ""},
		sql.NullString{String: input.Motto, Valid: input.Motto != ""},
		sql.NullString{String: input.ContactEmail, Valid: input.ContactEmail != ""},
		sql.NullString{String: input.ContactPhone, Valid: input.ContactPhone != ""},
		sql.NullString{String: input.ContactPersonName, Valid: input.ContactPersonName != ""},
		sql.NullString{String: input.FullAddress, Valid: input.FullAddress != ""},
		sql.NullString{String: input.State, Valid: input.State != ""},
		sql.NullString{String: input.LGA, Valid: input.LGA != ""},
		sql.NullString{String: input.AgentID, Valid: input.AgentID != ""},
		tier,
		now,
		now,
	)

	if err != nil {
		log.Printf("Error creating tenant: %v", err)
		utils.JSONError(w, http.StatusConflict, "Tenant with this name or slug already exists")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":      tenantID,
		"name":    input.Name,
		"slug":    input.Slug,
		"message": "Tenant registered successfully",
	})
}

// HandleGetTenant retrieves a single tenant by ID or slug
func HandleGetTenant(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	identifier := parts[len(parts)-1]

	var s models.Tenant
	var tenantCode, shortName, motto, logoURL, logoEmoji, primaryColor, secondaryColor, accentColor sql.NullString
	var contactEmail, contactPhone, contactPerson, fullAddress, state, lga, agentID, subTier, subExpires, settings sql.NullString

	query := `
		SELECT id, name, slug, tenant_code, short_name, motto, logo_url, logo_emoji, primary_color, secondary_color, accent_color, contact_email, contact_phone, contact_person_name, full_address, state, lga, status, verification_status, referred_by_agent_id, subscription_tier, subscription_expires_at, settings, created_at, updated_at 
		FROM tenants WHERE id = ? OR slug = ?`

	err := db.DB.QueryRow(query, identifier, identifier).Scan(
		&s.ID, &s.Name, &s.Slug, &tenantCode, &shortName, &motto, &logoURL, &logoEmoji, &primaryColor, &secondaryColor, &accentColor,
		&contactEmail, &contactPhone, &contactPerson, &fullAddress, &state, &lga, &s.Status, &s.VerificationStatus, &agentID,
		&subTier, &subExpires, &settings, &s.CreatedAt, &s.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		utils.JSONError(w, http.StatusNotFound, "Tenant not found")
		return
	} else if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	if tenantCode.Valid {
		s.TenantCode = tenantCode.String
	}
	if shortName.Valid {
		s.ShortName = shortName.String
	}
	if motto.Valid {
		s.Motto = motto.String
	}
	if logoURL.Valid {
		s.LogoURL = logoURL.String
	}
	if logoEmoji.Valid {
		s.LogoEmoji = logoEmoji.String
	}
	if primaryColor.Valid {
		s.PrimaryColor = primaryColor.String
	}
	if secondaryColor.Valid {
		s.SecondaryColor = secondaryColor.String
	}
	if accentColor.Valid {
		s.AccentColor = accentColor.String
	}
	if contactEmail.Valid {
		s.ContactEmail = contactEmail.String
	}
	if contactPhone.Valid {
		s.ContactPhone = contactPhone.String
	}
	if contactPerson.Valid {
		s.ContactPersonName = contactPerson.String
	}
	if fullAddress.Valid {
		s.FullAddress = fullAddress.String
	}
	if state.Valid {
		s.State = state.String
	}
	if lga.Valid {
		s.LGA = lga.String
	}
	if agentID.Valid {
		s.ReferredByAgentID = agentID.String
	}
	if subTier.Valid {
		s.SubscriptionTier = subTier.String
	}
	if settings.Valid {
		s.Settings = settings.String
	}
	if subExpires.Valid {
		t, _ := time.Parse("2006-01-02 15:04:05", subExpires.String)
		s.SubscriptionExpiresAt = &t
	}

	utils.JSONResponse(w, http.StatusOK, s)
}

// HandleVerifyTenant updates the verification status of a tenant
func HandleVerifyTenant(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch && r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	parts := strings.Split(r.URL.Path, "/")
	tenantID := ""
	for i, part := range parts {
		if part == "tenant" || part == "tenants" {
			if i+1 < len(parts) {
				tenantID = parts[i+1]
				break
			}
		}
	}

	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant ID is required")
		return
	}

	var input struct {
		Status string `json:"status"` // VERIFIED, REJECTED
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.Status == "" {
		utils.JSONError(w, http.StatusBadRequest, "Status is required (VERIFIED, REJECTED)")
		return
	}

	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	_, err := db.DB.Exec("UPDATE tenants SET verification_status = ?, status = 'ACTIVE', updated_at = ? WHERE id = ?", input.Status, now, tenantID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{
		"tenant_id":           tenantID,
		"verification_status": input.Status,
		"message":             "Tenant verification updated successfully",
	})
}

// HandleGetTenantHierarchy retrieves the full academic structure (classes, sections, subjects)
func HandleGetTenantHierarchy(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	tenantID := ""
	for i, part := range parts {
		if (part == "tenant" || part == "tenants") && i+1 < len(parts) {
			tenantID = parts[i+1]
			break
		}
	}

	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant ID is required")
		return
	}

	type SectionData struct {
		ID         string `json:"id"`
		Name       string `json:"name"`
		RoomNumber string `json:"room_number"`
	}
	type ClassData struct {
		ID       string        `json:"id"`
		Name     string        `json:"name"`
		Level    int           `json:"level"`
		Sections []SectionData `json:"sections"`
	}
	type SubjectData struct {
		ID   string `json:"id"`
		Name string `json:"name"`
		Code string `json:"code"`
	}
	type HierarchyResponse struct {
		TenantID string        `json:"tenant_id"`
		Classes  []ClassData   `json:"classes"`
		Subjects []SubjectData `json:"subjects"`
	}

	response := HierarchyResponse{TenantID: tenantID, Classes: []ClassData{}, Subjects: []SubjectData{}}

	// Fetch subjects
	subRows, err := db.DB.Query("SELECT id, name, code FROM subjects WHERE tenant_id = ? ORDER BY name ASC", tenantID)
	if err == nil {
		defer subRows.Close()
		for subRows.Next() {
			var sub SubjectData
			var code sql.NullString
			if err := subRows.Scan(&sub.ID, &sub.Name, &code); err == nil {
				if code.Valid {
					sub.Code = code.String
				}
				response.Subjects = append(response.Subjects, sub)
			}
		}
	}

	// Fetch classes
	classRows, err := db.DB.Query("SELECT id, name, level FROM classes WHERE tenant_id = ? ORDER BY level ASC, name ASC", tenantID)
	if err == nil {
		defer classRows.Close()
		for classRows.Next() {
			var cls ClassData
			var level sql.NullInt64
			if err := classRows.Scan(&cls.ID, &cls.Name, &level); err == nil {
				if level.Valid {
					cls.Level = int(level.Int64)
				}
				cls.Sections = []SectionData{}

				secRows, secErr := db.DB.Query("SELECT id, name, room_number FROM sections WHERE class_id = ? ORDER BY name ASC", cls.ID)
				if secErr == nil {
					for secRows.Next() {
						var sec SectionData
						var room sql.NullString
						if err := secRows.Scan(&sec.ID, &sec.Name, &room); err == nil {
							if room.Valid {
								sec.RoomNumber = room.String
							}
							cls.Sections = append(cls.Sections, sec)
						}
					}
					secRows.Close()
				}
				response.Classes = append(response.Classes, cls)
			}
		}
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// HandleGetTenantBranding returns the branding and layout configuration for TenantHub
func HandleGetTenantBranding(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	tenantID := ""
	for i, part := range parts {
		if (part == "tenant" || part == "tenants") && i+1 < len(parts) {
			tenantID = parts[i+1]
			break
		}
	}

	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant ID is required")
		return
	}

	var name, slug, primaryColor, secondaryColor, accentColor, logoURL, logoEmoji, motto, contactEmail, contactPhone, contactPerson, fullAddress, settings sql.NullString
	err := db.DB.QueryRow("SELECT name, slug, primary_color, secondary_color, accent_color, logo_url, logo_emoji, motto, contact_email, contact_phone, contact_person_name, full_address, settings FROM tenants WHERE id = ? OR slug = ?", tenantID, tenantID).
		Scan(&name, &slug, &primaryColor, &secondaryColor, &accentColor, &logoURL, &logoEmoji, &motto, &contactEmail, &contactPhone, &contactPerson, &fullAddress, &settings)

	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Tenant not found")
		return
	}

	response := map[string]interface{}{
		"branding": map[string]interface{}{
			"name":            name.String,
			"slug":            slug.String,
			"logo_url":        logoURL.String,
			"logo_emoji":      logoEmoji.String,
			"primary_color":   primaryColor.String,
			"secondary_color": secondaryColor.String,
			"accent_color":    accentColor.String,
			"motto":           motto.String,
		},
		"content": map[string]interface{}{
			"contact": map[string]interface{}{
				"email":          contactEmail.String,
				"phone":          contactPhone.String,
				"contact_person": contactPerson.String,
				"address":        fullAddress.String,
			},
		},
	}

	if settings.Valid && settings.String != "" {
		var settingsContent map[string]interface{}
		if err := json.Unmarshal([]byte(settings.String), &settingsContent); err == nil {
			for k, v := range settingsContent {
				response["content"].(map[string]interface{})[k] = v
			}
		}
	}

	content := response["content"].(map[string]interface{})
	if _, ok := content["home"]; !ok {
		content["home"] = map[string]interface{}{
			"hero_title":    "Welcome to " + name.String,
			"hero_subtitle": "Excellence in education and character development.",
		}
	}

	utils.JSONResponse(w, http.StatusOK, response)
}

// HandleUpdateTenantBranding updates colors, logos, and custom UI skinning settings
func HandleUpdateTenantBranding(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodPatch && r.Method != http.MethodPut {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	parts := strings.Split(r.URL.Path, "/")
	tenantID := ""
	for i, part := range parts {
		if (part == "tenant" || part == "tenants") && i+1 < len(parts) {
			tenantID = parts[i+1]
			break
		}
	}

	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant ID is required")
		return
	}

	var input map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON input")
		return
	}

	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	if branding, ok := input["branding"].(map[string]interface{}); ok {
		if primary, ok := branding["primary_color"].(string); ok {
			db.DB.Exec("UPDATE tenants SET primary_color = ?, updated_at = ? WHERE id = ?", primary, now, tenantID)
		}
		if secondary, ok := branding["secondary_color"].(string); ok {
			db.DB.Exec("UPDATE tenants SET secondary_color = ?, updated_at = ? WHERE id = ?", secondary, now, tenantID)
		}
		if accent, ok := branding["accent_color"].(string); ok {
			db.DB.Exec("UPDATE tenants SET accent_color = ?, updated_at = ? WHERE id = ?", accent, now, tenantID)
		}
		if logo, ok := branding["logo_url"].(string); ok {
			db.DB.Exec("UPDATE tenants SET logo_url = ?, updated_at = ? WHERE id = ?", logo, now, tenantID)
		}
		if emoji, ok := branding["logo_emoji"].(string); ok {
			db.DB.Exec("UPDATE tenants SET logo_emoji = ?, updated_at = ? WHERE id = ?", emoji, now, tenantID)
		}
		if motto, ok := branding["motto"].(string); ok {
			db.DB.Exec("UPDATE tenants SET motto = ?, updated_at = ? WHERE id = ?", motto, now, tenantID)
		}
	}

	if content, ok := input["content"].(map[string]interface{}); ok {
		if contact, ok := content["contact"].(map[string]interface{}); ok {
			if email, ok := contact["email"].(string); ok {
				db.DB.Exec("UPDATE tenants SET contact_email = ?, updated_at = ? WHERE id = ?", email, now, tenantID)
			}
			if phone, ok := contact["phone"].(string); ok {
				db.DB.Exec("UPDATE tenants SET contact_phone = ?, updated_at = ? WHERE id = ?", phone, now, tenantID)
			}
			if person, ok := contact["contact_person"].(string); ok {
				db.DB.Exec("UPDATE tenants SET contact_person_name = ?, updated_at = ? WHERE id = ?", person, now, tenantID)
			}
			if address, ok := contact["address"].(string); ok {
				db.DB.Exec("UPDATE tenants SET full_address = ?, updated_at = ? WHERE id = ?", address, now, tenantID)
			}
		}

		contentJSON, _ := json.Marshal(content)
		db.DB.Exec("UPDATE tenants SET settings = ?, updated_at = ? WHERE id = ?", string(contentJSON), now, tenantID)
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Branding and content updated successfully"})
}

// HandleListTenants returns a paginated/filtered list of tenants
func HandleListTenants(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, name, slug, status, verification_status, state, lga, subscription_tier, created_at FROM tenants ORDER BY created_at DESC LIMIT 200")
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	type TenantSummary struct {
		ID                 string    `json:"id"`
		Name               string    `json:"name"`
		Slug               string    `json:"slug"`
		Status             string    `json:"status"`
		VerificationStatus string    `json:"verification_status"`
		State              string    `json:"state,omitempty"`
		LGA                string    `json:"lga,omitempty"`
		SubscriptionTier   string    `json:"subscription_tier"`
		CreatedAt          time.Time `json:"created_at"`
	}

	tenants := []TenantSummary{}
	for rows.Next() {
		var s TenantSummary
		var state, lga, tier sql.NullString
		if err := rows.Scan(&s.ID, &s.Name, &s.Slug, &s.Status, &s.VerificationStatus, &state, &lga, &tier, &s.CreatedAt); err == nil {
			if state.Valid {
				s.State = state.String
			}
			if lga.Valid {
				s.LGA = lga.String
			}
			if tier.Valid {
				s.SubscriptionTier = tier.String
			}
			tenants = append(tenants, s)
		}
	}

	utils.JSONResponse(w, http.StatusOK, tenants)
}

// HandleAssignTenantRole assigns a user to a tenant with a specific role
func HandleAssignTenantRole(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		UserID   string `json:"user_id"`
		TenantID string `json:"tenant_id"`
		Role     string `json:"role"` // student, teacher, parent, tenant-admin, super-admin, agent
		Status   string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.UserID == "" || input.TenantID == "" || input.Role == "" {
		utils.JSONError(w, http.StatusBadRequest, "user_id, tenant_id, and role are required")
		return
	}

	status := input.Status
	if status == "" {
		status = "active"
	}

	id := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `
		INSERT INTO user_tenant_roles (id, user_id, tenant_id, role, status, created_at, updated_at) 
		VALUES (?, ?, ?, ?, ?, ?, ?) 
		ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = VALUES(updated_at)`

	_, err := db.DB.Exec(query, id, input.UserID, input.TenantID, strings.ToLower(input.Role), status, now, now)
	if err != nil {
		log.Printf("Assign role error: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to assign role")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Role assigned successfully"})
}

// HandleGetTenantRoles lists users and their roles for a tenant
func HandleGetTenantRoles(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	tenantID := ""
	for i, part := range parts {
		if (part == "tenants" || part == "tenant") && i+1 < len(parts) {
			tenantID = parts[i+1]
			break
		}
	}

	roleFilter := r.URL.Query().Get("role")

	query := `
		SELECT r.id, r.user_id, u.email, u.full_name, r.role, r.status, r.created_at
		FROM user_tenant_roles r
		JOIN users u ON r.user_id = u.id
		WHERE r.tenant_id = ?`

	args := []interface{}{tenantID}
	if roleFilter != "" {
		query += " AND r.role = ?"
		args = append(args, roleFilter)
	}

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	type RoleUser struct {
		ID        string    `json:"id"`
		UserID    string    `json:"user_id"`
		Email     string    `json:"email"`
		FullName  string    `json:"full_name"`
		Role      string    `json:"role"`
		Status    string    `json:"status"`
		CreatedAt time.Time `json:"created_at"`
	}

	results := []RoleUser{}
	for rows.Next() {
		var ru RoleUser
		var fullName sql.NullString
		if err := rows.Scan(&ru.ID, &ru.UserID, &ru.Email, &fullName, &ru.Role, &ru.Status, &ru.CreatedAt); err == nil {
			if fullName.Valid {
				ru.FullName = fullName.String
			}
			results = append(results, ru)
		}
	}

	utils.JSONResponse(w, http.StatusOK, results)
}

// HandleRemoveTenantRole deletes a specific role link
func HandleRemoveTenantRole(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	parts := strings.Split(r.URL.Path, "/")
	roleID := parts[len(parts)-1]

	_, err := db.DB.Exec("DELETE FROM user_tenant_roles WHERE id = ?", roleID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to delete role")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Role removed successfully"})
}

// HandleResolveTenant resolves a tenant by its default_subdomain or custom_domain
func HandleResolveTenant(w http.ResponseWriter, r *http.Request) {
	domain := r.URL.Query().Get("domain")
	if domain == "" {
		utils.JSONError(w, http.StatusBadRequest, "Domain is required")
		return
	}

	var t models.Tenant
	var tenantCode, shortName, motto, logoURL, logoEmoji, primaryColor, secondaryColor, accentColor sql.NullString
	var enabledModules, settings sql.NullString

	query := `
		SELECT id, name, slug, default_subdomain, custom_domain, tenant_code, short_name, motto, logo_url, logo_emoji, primary_color, secondary_color, accent_color, enabled_modules, settings 
		FROM tenants WHERE default_subdomain = ? OR custom_domain = ?`

	err := db.DB.QueryRow(query, domain, domain).Scan(
		&t.ID, &t.Name, &t.Slug, &t.DefaultSubdomain, &t.CustomDomain, &tenantCode, &shortName, &motto, &logoURL, &logoEmoji, &primaryColor, &secondaryColor, &accentColor,
		&enabledModules, &settings,
	)

	if err == sql.ErrNoRows {
		utils.JSONError(w, http.StatusNotFound, "Tenant not found")
		return
	} else if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	if tenantCode.Valid { t.TenantCode = tenantCode.String }
	if shortName.Valid { t.ShortName = shortName.String }
	if motto.Valid { t.Motto = motto.String }
	if logoURL.Valid { t.LogoURL = logoURL.String }
	if logoEmoji.Valid { t.LogoEmoji = logoEmoji.String }
	if primaryColor.Valid { t.PrimaryColor = primaryColor.String }
	if secondaryColor.Valid { t.SecondaryColor = secondaryColor.String }
	if accentColor.Valid { t.AccentColor = accentColor.String }
	if enabledModules.Valid { t.EnabledModules = enabledModules.String }
	if settings.Valid { t.Settings = settings.String }

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"tenant": t,
	})
}

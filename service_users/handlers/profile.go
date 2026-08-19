package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// HandleGetProfile is the Universal Handshake endpoint.
// It resolves a User ID into their full identity, institutional roles, subscriptions, dependents, enrollments, and teaching assignments.
func HandleGetProfile(w http.ResponseWriter, r *http.Request) {
	userId := strings.TrimPrefix(r.URL.Path, "/intelligence/profile/")
	if userId == r.URL.Path {
		userId = strings.TrimPrefix(r.URL.Path, "/api/v1/users/")
		userId = strings.TrimSuffix(userId, "/profile")
	}

	userId = strings.TrimSpace(userId)
	if userId == "" {
		utils.JSONError(w, http.StatusBadRequest, "User ID is required")
		return
	}

	profile := models.AcademicProfile{
		UserID:        userId,
		Roles:         []models.RoleDetail{},
		Subscriptions: []models.UserSubscription{},
		Dependents:    []models.DependentDetail{},
		Enrollment:    []models.EnrollmentDetail{},
		Teaching:      []models.TeachingDetail{},
	}

	// 1. Fetch User Identity details
	var fullName, email, avatar, phone, status sql.NullString
	err := db.DB.QueryRow("SELECT full_name, email, avatar_url, phone, account_status FROM users WHERE id = ?", userId).
		Scan(&fullName, &email, &avatar, &phone, &status)
	if err == nil {
		if fullName.Valid {
			profile.FullName = fullName.String
		}
		if email.Valid {
			profile.Email = email.String
		}
		if avatar.Valid {
			profile.AvatarURL = avatar.String
		}
		if phone.Valid {
			profile.Phone = phone.String
		}
		if status.Valid {
			profile.AccountStatus = status.String
		}
	}

	// 2. Query Roles & Tenant Subscriptions
	roleRows, err := db.DB.Query(`
		SELECT r.tenant_id, s.name, s.slug, s.subscription_tier, s.subscription_expires_at, r.role, r.status 
		FROM user_tenant_roles r
		JOIN tenants s ON r.tenant_id = s.id
		WHERE r.user_id = ?`, userId)
	if err != nil {
		log.Printf("Error querying roles for user %s: %v", userId, err)
	} else {
		defer roleRows.Close()
		for roleRows.Next() {
			var rd models.RoleDetail
			var subTier, subExpires sql.NullString
			if err := roleRows.Scan(&rd.TenantID, &rd.TenantName, &rd.TenantSlug, &subTier, &subExpires, &rd.Role, &rd.Status); err == nil {
				if subTier.Valid {
					rd.SubscriptionTier = subTier.String
				}
				if subExpires.Valid {
					t, _ := time.Parse("2006-01-02 15:04:05", subExpires.String)
					rd.SubscriptionExpiresAt = &t
				}
				profile.Roles = append(profile.Roles, rd)
			}
		}
	}

	// 3. Query Personal / User Subscriptions (Family/Agent)
	subRows, err := db.DB.Query(`
		SELECT id, user_id, type, tier, status, expires_at, created_at, updated_at
		FROM user_subscriptions
		WHERE user_id = ?`, userId)
	if err == nil {
		defer subRows.Close()
		for subRows.Next() {
			var us models.UserSubscription
			var expires sql.NullString
			if err := subRows.Scan(&us.ID, &us.UserID, &us.Type, &us.Tier, &us.Status, &expires, &us.CreatedAt, &us.UpdatedAt); err == nil {
				if expires.Valid {
					t, _ := time.Parse("2006-01-02 15:04:05", expires.String)
					us.ExpiresAt = &t
				}
				profile.Subscriptions = append(profile.Subscriptions, us)
			}
		}
	}

	// 4. Query Dependents (If user is a Parent/Guardian)
	depRows, err := db.DB.Query(`
		SELECT fr.child_user_id, fr.relationship_type, u.full_name, c.name as class_name, s.id as tenant_id
		FROM family_relationships fr
		LEFT JOIN users u ON fr.child_user_id = u.id
		LEFT JOIN enrollments e ON fr.child_user_id = e.student_id AND e.status = 'active'
		LEFT JOIN sections sec ON e.section_id = sec.id
		LEFT JOIN classes c ON sec.class_id = c.id
		LEFT JOIN tenants s ON c.tenant_id = s.id
		WHERE fr.parent_user_id = ?`, userId)
	if err == nil {
		defer depRows.Close()
		for depRows.Next() {
			var dd models.DependentDetail
			var childName, className, tenantID sql.NullString
			if err := depRows.Scan(&dd.UserID, &dd.Relationship, &childName, &className, &tenantID); err == nil {
				if childName.Valid {
					dd.FullName = childName.String
				}
				if className.Valid {
					dd.ClassName = className.String
				}
				if tenantID.Valid {
					dd.TenantID = tenantID.String
				}
				profile.Dependents = append(profile.Dependents, dd)
			}
		}
	}

	// 5. Query Active Enrollments (If user is a Student)
	enRows, err := db.DB.Query(`
		SELECT s.id, s.name, c.id, c.name, sec.id, sec.name, sess.id, sess.name
		FROM enrollments e
		JOIN sections sec ON e.section_id = sec.id
		JOIN classes c ON sec.class_id = c.id
		JOIN academic_sessions sess ON e.session_id = sess.id
		JOIN tenants s ON c.tenant_id = s.id
		WHERE e.student_id = ? AND e.status = 'active'`, userId)
	if err == nil {
		defer enRows.Close()
		for enRows.Next() {
			var ed models.EnrollmentDetail
			if err := enRows.Scan(&ed.TenantID, &ed.TenantName, &ed.ClassID, &ed.ClassName, &ed.SectionID, &ed.SectionName, &ed.SessionID, &ed.SessionName); err == nil {
				profile.Enrollment = append(profile.Enrollment, ed)
			}
		}
	}

	// 6. Query Teaching Assignments (If user is a Teacher)
	teachRows, err := db.DB.Query(`
		SELECT s.id, s.name, c.id, c.name, sec.id, sec.name, sub.id, sub.name, t.id, t.name
		FROM assignments a
		JOIN sections sec ON a.section_id = sec.id
		JOIN classes c ON sec.class_id = c.id
		JOIN subjects sub ON a.subject_id = sub.id
		JOIN terms t ON a.term_id = t.id
		JOIN tenants s ON c.tenant_id = s.id
		WHERE a.teacher_id = ?`, userId)
	if err == nil {
		defer teachRows.Close()
		for teachRows.Next() {
			var td models.TeachingDetail
			if err := teachRows.Scan(&td.TenantID, &td.TenantName, &td.ClassID, &td.ClassName, &td.SectionID, &td.SectionName, &td.SubjectID, &td.SubjectName, &td.TermID, &td.TermName); err == nil {
				profile.Teaching = append(profile.Teaching, td)
			}
		}
	}

	utils.JSONResponse(w, http.StatusOK, profile)
}

// HandleGetBulkProfiles retrieves lightweight academic context for an array of user IDs
func HandleGetBulkProfiles(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req struct {
		UserIDs []string `json:"user_ids"`
		IDs     []string `json:"ids"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	targetIDs := req.UserIDs
	if len(targetIDs) == 0 {
		targetIDs = req.IDs
	}

	if len(targetIDs) == 0 {
		utils.JSONError(w, http.StatusBadRequest, "user_ids or ids array cannot be empty")
		return
	}

	placeholders := make([]string, len(targetIDs))
	args := make([]interface{}, len(targetIDs))
	for i, id := range targetIDs {
		placeholders[i] = "?"
		args[i] = id
	}

	inClause := strings.Join(placeholders, ",")

	query := `
		SELECT u.id, u.full_name, u.email, s.name, r.role
		FROM users u
		LEFT JOIN user_tenant_roles r ON u.id = r.user_id
		LEFT JOIN tenants s ON r.tenant_id = s.id
		WHERE u.id IN (` + inClause + `)`

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		log.Printf("Bulk profile query error: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	profiles := make(map[string]models.BulkProfileContext)
	for rows.Next() {
		var userID string
		var fullName, email, tenantName, role sql.NullString
		if err := rows.Scan(&userID, &fullName, &email, &tenantName, &role); err == nil {
			ctx := models.BulkProfileContext{
				UserID:     userID,
				FullName:   fullName.String,
				Email:      email.String,
				TenantName: tenantName.String,
				Role:       role.String,
			}
			profiles[userID] = ctx
		}
	}

	// Enrich student class names
	enrollQuery := `
		SELECT e.student_id, c.name
		FROM enrollments e
		JOIN sections sec ON e.section_id = sec.id
		JOIN classes c ON sec.class_id = c.id
		WHERE e.status = 'active' AND e.student_id IN (` + inClause + `)`

	enrollRows, err := db.DB.Query(enrollQuery, args...)
	if err == nil {
		defer enrollRows.Close()
		for enrollRows.Next() {
			var studentId, className string
			if err := enrollRows.Scan(&studentId, &className); err == nil {
				if profile, exists := profiles[studentId]; exists {
					profile.ClassName = className
					profiles[studentId] = profile
				}
			}
		}
	}

	utils.JSONResponse(w, http.StatusOK, profiles)
}

// HandleGetUserDetail retrieves the raw user entity
func HandleGetUserDetail(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	userID := parts[len(parts)-1]

	var u models.User
	var passwordHash, googleID, microsoftID, fullName, avatarURL, phone, sex, address, mfaSecret sql.NullString
	var dob sql.NullString

	err := db.DB.QueryRow(`
		SELECT id, email, password_hash, google_id, microsoft_id, auth_provider, full_name, avatar_url, phone, sex, date_of_birth, address, account_status, mfa_enabled, mfa_secret, created_at, updated_at
		FROM users WHERE id = ?`, userID).Scan(
		&u.ID, &u.Email, &passwordHash, &googleID, &microsoftID, &u.AuthProvider, &fullName, &avatarURL, &phone, &sex, &dob, &address, &u.AccountStatus, &u.MFAEnabled, &mfaSecret, &u.CreatedAt, &u.UpdatedAt)

	if err == sql.ErrNoRows {
		utils.JSONError(w, http.StatusNotFound, "User not found")
		return
	} else if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	if googleID.Valid {
		u.GoogleID = &googleID.String
	}
	if microsoftID.Valid {
		u.MicrosoftID = &microsoftID.String
	}
	if fullName.Valid {
		u.FullName = &fullName.String
	}
	if avatarURL.Valid {
		u.AvatarURL = &avatarURL.String
	}
	if phone.Valid {
		u.Phone = &phone.String
	}
	if sex.Valid {
		u.Sex = &sex.String
	}
	if address.Valid {
		u.Address = &address.String
	}
	if dob.Valid {
		t, _ := time.Parse("2006-01-02 15:04:05", dob.String)
		u.DateOfBirth = &t
	}

	utils.JSONResponse(w, http.StatusOK, u)
}

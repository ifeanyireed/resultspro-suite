package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

func getPuzzleproEngineURL() string {
	u := os.Getenv("PUZZLEPRO_ENGINE_URL")
	if u == "" {
		u = os.Getenv("NEXT_PUBLIC_GAME_ENGINE_URL")
	}
	return strings.TrimRight(u, "/")
}

// ============================================================================
// 1. IDENTITY & AUTHENTICATION
// ============================================================================

type playerHandshakeRequest struct {
	Username  string `json:"username"`
	Role      string `json:"role"`
	GroupName string `json:"group_name"`
	GroupCode string `json:"group_code"`
	Avatar    string `json:"avatar"`
	InitialXP int    `json:"xp"`
}

func HandlePlayerHandshake(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req playerHandshakeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid payload")
		return
	}

	if req.Username == "" {
		req.Username = fmt.Sprintf("Player_%d", time.Now().Unix()%10000)
	}
	if req.Role == "" {
		req.Role = "student"
	}
	if req.GroupCode == "" {
		req.GroupCode = "784912"
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	// 1. Resolve or create group
	var groupID int
	var orgID sql.NullString
	err := db.DB.QueryRowContext(ctx, "SELECT id, organisation_id FROM puzzle_groups WHERE code = $1 LIMIT 1", req.GroupCode).Scan(&groupID, &orgID)
	if err != nil {
		if req.GroupName == "" {
			req.GroupName = "Default Class"
		}
		_ = db.DB.QueryRowContext(ctx, "INSERT INTO puzzle_groups (name, code, assigned_world_id) VALUES ($1, $2, 1) RETURNING id", req.GroupName, req.GroupCode).Scan(&groupID)
	}

	// 2. Resolve or create player user
	var user models.PuzzleUser
	var gID sql.NullInt64
	var oID sql.NullString
	var code sql.NullString

	err = db.DB.QueryRowContext(ctx, `
		SELECT id, username, access_code, role, organisation_id, group_id, avatar, assigned_world_id, total_xp, total_stars
		FROM puzzle_users WHERE username = $1 LIMIT 1
	`, req.Username).Scan(
		&user.ID, &user.Username, &code, &user.Role, &oID, &gID, &user.Avatar, &user.AssignedWorldID, &user.TotalXP, &user.TotalStars,
	)

	if err == sql.ErrNoRows {
		studentCode := fmt.Sprintf("%08d", rand.Intn(100000000))
		avatar := req.Avatar
		if avatar == "" {
			avatar = "/images/character1.jpg"
		}
		var newID int
		err = db.DB.QueryRowContext(ctx, `
			INSERT INTO puzzle_users (username, access_code, role, organisation_id, group_id, avatar, assigned_world_id, total_xp, total_stars)
			VALUES ($1, $2, $3, $4, $5, $6, 1, $7, 0)
			RETURNING id
		`, req.Username, studentCode, req.Role, orgID.String, groupID, avatar, req.InitialXP).Scan(&newID)

		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create player")
			return
		}

		user.ID = newID
		user.Username = req.Username
		user.AccessCode = studentCode
		user.Role = req.Role
		user.OrganisationID = orgID.String
		user.GroupID = &groupID
		user.Avatar = avatar
		user.AssignedWorldID = 1
		user.TotalXP = req.InitialXP
	} else if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database query error")
		return
	} else {
		user.AccessCode = code.String
		user.OrganisationID = oID.String
		if gID.Valid {
			gid := int(gID.Int64)
			user.GroupID = &gid
		}
	}

	token, _ := utils.GeneratePuzzleToken(user.ID, user.Username, user.Role, user.AccessCode)

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"token":   token,
		"user": map[string]interface{}{
			"id":                user.ID,
			"username":          user.Username,
			"role":              user.Role,
			"access_code":       user.AccessCode,
			"group_id":          user.GroupID,
			"organisation_id":   user.OrganisationID,
			"avatar":            user.Avatar,
			"assigned_world_id": user.AssignedWorldID,
			"total_xp":          user.TotalXP,
			"total_stars":       user.TotalStars,
		},
		"group": map[string]interface{}{
			"id":   groupID,
			"code": req.GroupCode,
		},
	})
}

func HandlePlayerCodeLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Code) == "" {
		utils.JSONError(w, http.StatusBadRequest, "Access code is required")
		return
	}

	code := strings.TrimSpace(req.Code)
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	// 1. Check if it matches a School / Organisation Token
	var org models.PuzzleOrganisation
	err := db.DB.QueryRowContext(ctx, `
		SELECT id, name, domain, contact_email, contact_phone, logo_url, token, google_ads_enabled, type
		FROM puzzle_organisations WHERE token = $1 OR id = $1 LIMIT 1
	`, code).Scan(&org.ID, &org.Name, &org.Domain, &org.ContactEmail, &org.ContactPhone, &org.LogoURL, &org.Token, &org.GoogleAdsEnabled, &org.Type)

	if err == nil {
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"type":    "organisation",
			"organisation": map[string]interface{}{
				"id":                 org.ID,
				"name":               org.Name,
				"domain":             org.Domain,
				"contact_email":      org.ContactEmail,
				"contact_phone":      org.ContactPhone,
				"logo_url":           org.LogoURL,
				"token":              org.Token,
				"google_ads_enabled": org.GoogleAdsEnabled,
				"type":               org.Type,
			},
		})
		return
	}

	// 2. Check if it matches a Student Access Code
	var user models.PuzzleUser
	var gID sql.NullInt64
	var oID sql.NullString
	var accCode sql.NullString

	err = db.DB.QueryRowContext(ctx, `
		SELECT id, username, access_code, role, organisation_id, group_id, avatar, assigned_world_id, total_xp, total_stars
		FROM puzzle_users WHERE access_code = $1 LIMIT 1
	`, code).Scan(
		&user.ID, &user.Username, &accCode, &user.Role, &oID, &gID, &user.Avatar, &user.AssignedWorldID, &user.TotalXP, &user.TotalStars,
	)

	if err == nil {
		user.AccessCode = accCode.String
		user.OrganisationID = oID.String
		if gID.Valid {
			gid := int(gID.Int64)
			user.GroupID = &gid
		}

		token, _ := utils.GeneratePuzzleToken(user.ID, user.Username, user.Role, user.AccessCode)
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"type":    "student",
			"token":   token,
			"user": map[string]interface{}{
				"id":                user.ID,
				"username":          user.Username,
				"role":              user.Role,
				"access_code":       user.AccessCode,
				"organisation_id":   user.OrganisationID,
				"group_id":          user.GroupID,
				"avatar":            user.Avatar,
				"assigned_world_id": user.AssignedWorldID,
				"total_xp":          user.TotalXP,
				"total_stars":       user.TotalStars,
			},
		})
		return
	}

	utils.JSONError(w, http.StatusUnauthorized, "Invalid access code. Please check your card or school slip.")
}

func HandlePlayerVerifySession(w http.ResponseWriter, r *http.Request) {
	tokenStr := r.URL.Query().Get("token")
	codeStr := r.URL.Query().Get("code")

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	if tokenStr != "" {
		claims, err := utils.VerifyPuzzleToken(tokenStr)
		if err == nil && claims != nil {
			var user models.PuzzleUser
			var gID sql.NullInt64
			var oID sql.NullString
			var accCode sql.NullString

			err = db.DB.QueryRowContext(ctx, `
				SELECT id, username, access_code, role, organisation_id, group_id, avatar, assigned_world_id, total_xp, total_stars
				FROM puzzle_users WHERE id = $1 LIMIT 1
			`, claims.UserID).Scan(
				&user.ID, &user.Username, &accCode, &user.Role, &oID, &gID, &user.Avatar, &user.AssignedWorldID, &user.TotalXP, &user.TotalStars,
			)

			if err == nil {
				user.AccessCode = accCode.String
				user.OrganisationID = oID.String
				if gID.Valid {
					gid := int(gID.Int64)
					user.GroupID = &gid
				}

				utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
					"valid":   true,
					"type":    "student",
					"user_id": user.ID,
					"user":    user,
				})
				return
			}
		}
	}

	if codeStr != "" {
		var org models.PuzzleOrganisation
		err := db.DB.QueryRowContext(ctx, `
			SELECT id, name, domain, contact_email, contact_phone, logo_url, token, google_ads_enabled, type
			FROM puzzle_organisations WHERE token = $1 OR id = $1 LIMIT 1
		`, codeStr).Scan(&org.ID, &org.Name, &org.Domain, &org.ContactEmail, &org.ContactPhone, &org.LogoURL, &org.Token, &org.GoogleAdsEnabled, &org.Type)

		if err == nil {
			utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
				"valid":        true,
				"type":         "organisation",
				"organisation": org,
			})
			return
		}
	}

	utils.JSONResponse(w, http.StatusUnauthorized, map[string]interface{}{
		"valid": false,
		"error": "Session token or code expired",
	})
}

// ============================================================================
// 2. ORGANISATIONS & TENANTS
// ============================================================================

func HandlePlayerOrganisations(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 6*time.Second)
	defer cancel()

	switch r.Method {
	case http.MethodGet:
		typeFilter := r.URL.Query().Get("type")
		idFilter := r.URL.Query().Get("id")

		query := `SELECT id, name, domain, contact_email, contact_phone, logo_url, token, google_ads_enabled, type, created_at FROM puzzle_organisations`
		var args []interface{}
		var conditions []string

		if typeFilter != "" {
			conditions = append(conditions, fmt.Sprintf("type = $%d", len(args)+1))
			args = append(args, typeFilter)
		}
		if idFilter != "" {
			conditions = append(conditions, fmt.Sprintf("id = $%d", len(args)+1))
			args = append(args, idFilter)
		}
		if len(conditions) > 0 {
			query += " WHERE " + strings.Join(conditions, " AND ")
		}
		query += " ORDER BY created_at DESC"

		rows, err := db.DB.QueryContext(ctx, query, args...)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Query error")
			return
		}
		defer rows.Close()

		var orgs []models.PuzzleOrganisation
		for rows.Next() {
			var o models.PuzzleOrganisation
			_ = rows.Scan(&o.ID, &o.Name, &o.Domain, &o.ContactEmail, &o.ContactPhone, &o.LogoURL, &o.Token, &o.GoogleAdsEnabled, &o.Type, &o.CreatedAt)

			// Count active students
			_ = db.DB.QueryRowContext(ctx, "SELECT COUNT(*) FROM puzzle_users WHERE organisation_id = $1", o.ID).Scan(&o.ActiveStudents)

			// Get group names
			gRows, err := db.DB.QueryContext(ctx, "SELECT name FROM puzzle_groups WHERE organisation_id = $1", o.ID)
			if err == nil {
				for gRows.Next() {
					var gName string
					if err := gRows.Scan(&gName); err == nil {
						o.Groups = append(o.Groups, gName)
					}
				}
				gRows.Close()
			}

			// Get centres
			cRows, err := db.DB.QueryContext(ctx, "SELECT id, organisation_id, name, location, code, created_at FROM puzzle_centres WHERE organisation_id = $1", o.ID)
			if err == nil {
				for cRows.Next() {
					var c models.PuzzleCentre
					if err := cRows.Scan(&c.ID, &c.OrganisationID, &c.Name, &c.Location, &c.Code, &c.CreatedAt); err == nil {
						o.Centres = append(o.Centres, c)
					}
				}
				cRows.Close()
			}

			orgs = append(orgs, o)
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":       true,
			"organisations": orgs,
		})

	case http.MethodPost, http.MethodPut:
		var org models.PuzzleOrganisation
		if err := json.NewDecoder(r.Body).Decode(&org); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		isNew := false
		if org.ID == "" {
			org.ID = fmt.Sprintf("org_%d", time.Now().Unix()%1000000)
			isNew = true
		}
		if org.Token == "" {
			org.Token = fmt.Sprintf("TOKEN_%s_%d", strings.ToUpper(strings.ReplaceAll(org.Name, " ", "")[:min(4, len(org.Name))]), rand.Intn(9000)+1000)
		}
		if org.Password == "" {
			org.Password = "school123"
		}
		if org.Type == "" {
			org.Type = "school"
		}

		_, err := db.DB.ExecContext(ctx, `
			INSERT INTO puzzle_organisations (id, name, domain, contact_email, contact_phone, password, logo_url, token, google_ads_enabled, type)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			ON CONFLICT (id) DO UPDATE SET
				name = EXCLUDED.name,
				domain = EXCLUDED.domain,
				contact_email = EXCLUDED.contact_email,
				contact_phone = EXCLUDED.contact_phone,
				logo_url = EXCLUDED.logo_url,
				google_ads_enabled = EXCLUDED.google_ads_enabled,
				type = EXCLUDED.type
		`, org.ID, org.Name, org.Domain, org.ContactEmail, org.ContactPhone, org.Password, org.LogoURL, org.Token, org.GoogleAdsEnabled, org.Type)

		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to save organisation")
			return
		}

		if isNew && org.ContactEmail != "" {
			signedEmbedToken, _ := utils.GenerateSignedEmbedToken(org.ID, 0)
			utils.DefaultPuzzleMailer.SendWelcomeEmail(org.ContactEmail, org.Name, org.Type, org.Password, signedEmbedToken)
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":      true,
			"organisation": org,
		})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			utils.JSONError(w, http.StatusBadRequest, "Missing organisation id")
			return
		}
		_, err := db.DB.ExecContext(ctx, "DELETE FROM puzzle_organisations WHERE id = $1", id)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete organisation")
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
		})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func HandlePlayerToggleGoogleAds(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		ID               string `json:"id"`
		GoogleAdsEnabled bool   `json:"google_ads_enabled"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ID == "" {
		utils.JSONError(w, http.StatusBadRequest, "id is required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()
	_, err := db.DB.ExecContext(ctx, "UPDATE puzzle_organisations SET google_ads_enabled = $1 WHERE id = $2", req.GoogleAdsEnabled, req.ID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database update error")
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true})
}

func HandlePlayerUpdateProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		ID           string `json:"id"`
		Name         string `json:"name"`
		Domain       string `json:"domain"`
		ContactEmail string `json:"contact_email"`
		ContactPhone string `json:"contact_phone"`
		LogoURL      string `json:"logo_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ID == "" {
		utils.JSONError(w, http.StatusBadRequest, "id is required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()
	_, err := db.DB.ExecContext(ctx, `
		UPDATE puzzle_organisations 
		SET name = $1, domain = $2, contact_email = $3, contact_phone = $4, logo_url = $5
		WHERE id = $6
	`, req.Name, req.Domain, req.ContactEmail, req.ContactPhone, req.LogoURL, req.ID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database update error")
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true})
}

func HandlePlayerUpdatePassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		ID          string `json:"id"`
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ID == "" || req.NewPassword == "" {
		utils.JSONError(w, http.StatusBadRequest, "id and new_password are required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var existingPassword string
	err := db.DB.QueryRowContext(ctx, "SELECT password FROM puzzle_organisations WHERE id = $1", req.ID).Scan(&existingPassword)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Organisation not found")
		return
	}
	if req.OldPassword != "" && existingPassword != "" && existingPassword != req.OldPassword {
		utils.JSONError(w, http.StatusUnauthorized, "Current password does not match")
		return
	}

	_, err = db.DB.ExecContext(ctx, "UPDATE puzzle_organisations SET password = $1 WHERE id = $2", req.NewPassword, req.ID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database update error")
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true})
}

// ============================================================================
// 3. CENTRES & GROUPS
// ============================================================================

func HandlePlayerCentres(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	switch r.Method {
	case http.MethodGet:
		orgID := r.URL.Query().Get("organisation_id")
		query := `SELECT id, organisation_id, name, location, code, created_at FROM puzzle_centres`
		var args []interface{}
		if orgID != "" {
			query += " WHERE organisation_id = $1"
			args = append(args, orgID)
		}
		query += " ORDER BY id ASC"

		rows, err := db.DB.QueryContext(ctx, query, args...)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Query error")
			return
		}
		defer rows.Close()

		var centres []models.PuzzleCentre
		for rows.Next() {
			var c models.PuzzleCentre
			_ = rows.Scan(&c.ID, &c.OrganisationID, &c.Name, &c.Location, &c.Code, &c.CreatedAt)
			centres = append(centres, c)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "centres": centres})

	case http.MethodPost, http.MethodPut:
		var c models.PuzzleCentre
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid payload")
			return
		}
		if c.ID > 0 {
			_, err := db.DB.ExecContext(ctx, `
				UPDATE puzzle_centres SET name = $1, location = $2, code = $3 WHERE id = $4
			`, c.Name, c.Location, c.Code, c.ID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Update error")
				return
			}
		} else {
			err := db.DB.QueryRowContext(ctx, `
				INSERT INTO puzzle_centres (organisation_id, name, location, code)
				VALUES ($1, $2, $3, $4) RETURNING id
			`, c.OrganisationID, c.Name, c.Location, c.Code).Scan(&c.ID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Insert error")
				return
			}
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "centre": c})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		_, err := db.DB.ExecContext(ctx, "DELETE FROM puzzle_centres WHERE id = $1", id)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Delete error")
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func HandlePlayerGroups(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	switch r.Method {
	case http.MethodGet:
		orgID := r.URL.Query().Get("organisation_id")
		centreID := r.URL.Query().Get("centre_id")

		query := `
			SELECT g.id, g.organisation_id, g.centre_id, COALESCE(c.name, ''), g.name, g.code, g.assigned_world_id, g.created_at
			FROM puzzle_groups g
			LEFT JOIN puzzle_centres c ON c.id = g.centre_id
		`
		var args []interface{}
		var conds []string
		if orgID != "" {
			conds = append(conds, fmt.Sprintf("g.organisation_id = $%d", len(args)+1))
			args = append(args, orgID)
		}
		if centreID != "" {
			conds = append(conds, fmt.Sprintf("g.centre_id = $%d", len(args)+1))
			args = append(args, centreID)
		}
		if len(conds) > 0 {
			query += " WHERE " + strings.Join(conds, " AND ")
		}
		query += " ORDER BY g.id ASC"

		rows, err := db.DB.QueryContext(ctx, query, args...)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Query error")
			return
		}
		defer rows.Close()

		var groups []models.PuzzleGroup
		for rows.Next() {
			var g models.PuzzleGroup
			var cID sql.NullInt64
			_ = rows.Scan(&g.ID, &g.OrganisationID, &cID, &g.CentreName, &g.Name, &g.Code, &g.AssignedWorldID, &g.CreatedAt)
			if cID.Valid {
				cid := int(cID.Int64)
				g.CentreID = &cid
			}
			groups = append(groups, g)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "groups": groups})

	case http.MethodPost, http.MethodPut:
		var g models.PuzzleGroup
		if err := json.NewDecoder(r.Body).Decode(&g); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid payload")
			return
		}
		if g.Code == "" {
			g.Code = fmt.Sprintf("%06d", rand.Intn(900000)+100000)
		}
		if g.AssignedWorldID <= 0 {
			g.AssignedWorldID = 1
		}

		if g.ID > 0 {
			_, err := db.DB.ExecContext(ctx, `
				UPDATE puzzle_groups SET name = $1, code = $2, centre_id = $3, assigned_world_id = $4 WHERE id = $5
			`, g.Name, g.Code, g.CentreID, g.AssignedWorldID, g.ID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Update error")
				return
			}
		} else {
			err := db.DB.QueryRowContext(ctx, `
				INSERT INTO puzzle_groups (organisation_id, centre_id, name, code, assigned_world_id)
				VALUES ($1, $2, $3, $4, $5) RETURNING id
			`, g.OrganisationID, g.CentreID, g.Name, g.Code, g.AssignedWorldID).Scan(&g.ID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Insert error")
				return
			}
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "group": g})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func HandlePlayerGroupStudents(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	search := r.URL.Query().Get("search")
	if code == "" {
		utils.JSONError(w, http.StatusBadRequest, "code parameter is required")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var groupID int
	var groupName string
	var orgID sql.NullString
	var centreName sql.NullString
	var orgName sql.NullString

	err := db.DB.QueryRowContext(ctx, `
		SELECT g.id, g.name, g.organisation_id, c.name, o.name
		FROM puzzle_groups g
		LEFT JOIN puzzle_centres c ON c.id = g.centre_id
		LEFT JOIN puzzle_organisations o ON o.id = g.organisation_id
		WHERE g.code = $1 LIMIT 1
	`, code).Scan(&groupID, &groupName, &orgID, &centreName, &orgName)

	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Group not found for this access code")
		return
	}

	query := `
		SELECT id, username, access_code, avatar, total_xp
		FROM puzzle_users WHERE group_id = $1
	`
	args := []interface{}{groupID}
	if search != "" {
		query += " AND (username ILIKE $2 OR access_code ILIKE $2)"
		args = append(args, "%"+search+"%")
	}
	query += " ORDER BY username ASC"

	rows, err := db.DB.QueryContext(ctx, query, args...)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error querying students")
		return
	}
	defer rows.Close()

	var students []map[string]interface{}
	for rows.Next() {
		var id int
		var username, accessCode, avatar string
		var totalXP int
		if err := rows.Scan(&id, &username, &accessCode, &avatar, &totalXP); err == nil {
			students = append(students, map[string]interface{}{
				"id":           fmt.Sprintf("usr_%d", id),
				"name":         username,
				"student_code": accessCode,
				"avatar":       avatar,
				"total_xp":     totalXP,
			})
		}
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"group": map[string]interface{}{
			"id":          groupID,
			"name":        groupName,
			"code":        code,
			"centre_name": centreName.String,
			"school_name": orgName.String,
		},
		"students": students,
	})
}

// ============================================================================
// 4. USERS & STUDENTS (PUZZLE PLAYERS)
// ============================================================================

func HandlePlayerUsersAdmin(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	switch r.Method {
	case http.MethodGet:
		orgID := r.URL.Query().Get("organisation_id")
		groupID := r.URL.Query().Get("group_id")

		query := `
			SELECT u.id, u.username, u.access_code, u.role, u.organisation_id, COALESCE(o.name, ''),
			       u.group_id, COALESCE(g.name, ''), u.avatar, u.assigned_world_id, u.total_xp, u.total_stars, u.created_at
			FROM puzzle_users u
			LEFT JOIN puzzle_organisations o ON o.id = u.organisation_id
			LEFT JOIN puzzle_groups g ON g.id = u.group_id
		`
		var args []interface{}
		var conds []string
		if orgID != "" && orgID != "ALL" {
			conds = append(conds, fmt.Sprintf("u.organisation_id = $%d", len(args)+1))
			args = append(args, orgID)
		}
		if groupID != "" {
			conds = append(conds, fmt.Sprintf("u.group_id = $%d", len(args)+1))
			args = append(args, groupID)
		}
		if len(conds) > 0 {
			query += " WHERE " + strings.Join(conds, " AND ")
		}
		query += " ORDER BY u.id ASC"

		rows, err := db.DB.QueryContext(ctx, query, args...)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Query error")
			return
		}
		defer rows.Close()

		var users []models.PuzzleUser
		for rows.Next() {
			var u models.PuzzleUser
			var gID sql.NullInt64
			var oID sql.NullString
			var accCode sql.NullString
			_ = rows.Scan(
				&u.ID, &u.Username, &accCode, &u.Role, &oID, &u.OrganisationName,
				&gID, &u.GroupName, &u.Avatar, &u.AssignedWorldID, &u.TotalXP, &u.TotalStars, &u.CreatedAt,
			)
			u.AccessCode = accCode.String
			u.OrganisationID = oID.String
			if gID.Valid {
				gid := int(gID.Int64)
				u.GroupID = &gid
			}
			users = append(users, u)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "users": users})

	case http.MethodPost, http.MethodPut:
		var u models.PuzzleUser
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid payload")
			return
		}
		if u.AccessCode == "" {
			u.AccessCode = fmt.Sprintf("%08d", rand.Intn(100000000))
		}
		if u.Role == "" {
			u.Role = "student"
		}
		if u.Avatar == "" {
			u.Avatar = "/images/character1.jpg"
		}
		if u.AssignedWorldID <= 0 {
			u.AssignedWorldID = 1
		}

		if u.ID > 0 {
			_, err := db.DB.ExecContext(ctx, `
				UPDATE puzzle_users SET username = $1, access_code = $2, role = $3, organisation_id = $4, group_id = $5, avatar = $6, assigned_world_id = $7
				WHERE id = $8
			`, u.Username, u.AccessCode, u.Role, u.OrganisationID, u.GroupID, u.Avatar, u.AssignedWorldID, u.ID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Update error")
				return
			}
		} else {
			err := db.DB.QueryRowContext(ctx, `
				INSERT INTO puzzle_users (username, access_code, role, organisation_id, group_id, avatar, assigned_world_id, total_xp, total_stars)
				VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0) RETURNING id
			`, u.Username, u.AccessCode, u.Role, u.OrganisationID, u.GroupID, u.Avatar, u.AssignedWorldID).Scan(&u.ID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Insert error")
				return
			}
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "user": u})

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		id, _ := strconv.Atoi(idStr)
		if id > 0 {
			_, _ = db.DB.ExecContext(ctx, "DELETE FROM puzzle_users WHERE id = $1", id)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func HandlePlayerAssignWorld(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		UserID  int `json:"user_id"`
		GroupID int `json:"group_id"`
		WorldID int `json:"world_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.WorldID <= 0 {
		utils.JSONError(w, http.StatusBadRequest, "world_id is required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	if req.UserID > 0 {
		_, _ = db.DB.ExecContext(ctx, "UPDATE puzzle_users SET assigned_world_id = $1 WHERE id = $2", req.WorldID, req.UserID)
	}
	if req.GroupID > 0 {
		_, _ = db.DB.ExecContext(ctx, "UPDATE puzzle_groups SET assigned_world_id = $1 WHERE id = $2", req.WorldID, req.GroupID)
		_, _ = db.DB.ExecContext(ctx, "UPDATE puzzle_users SET assigned_world_id = $1 WHERE group_id = $2", req.WorldID, req.GroupID)
	}
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true})
}

func HandlePlayerBatchSaveUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		OrganisationID string              `json:"organisation_id"`
		GroupID        int                 `json:"group_id"`
		Users          []models.PuzzleUser `json:"users"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid payload")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	var createdUsers []models.PuzzleUser
	for _, u := range req.Users {
		if u.Username == "" {
			continue
		}
		if u.AccessCode == "" {
			u.AccessCode = fmt.Sprintf("%08d", rand.Intn(100000000))
		}
		if u.Role == "" {
			u.Role = "student"
		}
		if u.Avatar == "" {
			u.Avatar = "/images/character1.jpg"
		}
		if u.AssignedWorldID <= 0 {
			u.AssignedWorldID = 1
		}
		orgID := u.OrganisationID
		if orgID == "" {
			orgID = req.OrganisationID
		}
		var gID *int = u.GroupID
		if gID == nil && req.GroupID > 0 {
			gID = &req.GroupID
		}

		var id int
		err := db.DB.QueryRowContext(ctx, `
			INSERT INTO puzzle_users (username, access_code, role, organisation_id, group_id, avatar, assigned_world_id, total_xp, total_stars)
			VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0)
			ON CONFLICT (username) DO UPDATE SET access_code = EXCLUDED.access_code, avatar = EXCLUDED.avatar
			RETURNING id
		`, u.Username, u.AccessCode, u.Role, orgID, gID, u.Avatar, u.AssignedWorldID).Scan(&id)

		if err == nil {
			u.ID = id
			u.OrganisationID = orgID
			u.GroupID = gID
			createdUsers = append(createdUsers, u)
		}
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"users":   createdUsers,
	})
}

// ============================================================================
// 5. BILLING & SUBSCRIPTIONS
// ============================================================================

func HandlePlayerSubscriptions(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.QueryContext(ctx, `
			SELECT id, organisation_id, organisation_name, user_email, plan_name, status, seats, price, renewal_date, created_at
			FROM puzzle_subscriptions ORDER BY created_at DESC
		`)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Query error")
			return
		}
		defer rows.Close()

		var subs []models.PuzzleSubscription
		for rows.Next() {
			var s models.PuzzleSubscription
			_ = rows.Scan(&s.ID, &s.OrganisationID, &s.OrganisationName, &s.UserEmail, &s.PlanName, &s.Status, &s.Seats, &s.Price, &s.RenewalDate, &s.CreatedAt)
			subs = append(subs, s)
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "subscriptions": subs})

	case http.MethodPost, http.MethodPut:
		var s models.PuzzleSubscription
		if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid payload")
			return
		}
		if s.ID == "" {
			s.ID = fmt.Sprintf("sub_%d", time.Now().Unix()%1000000)
		}
		if s.Status == "" {
			s.Status = "active"
		}
		if s.Price == "" {
			s.Price = "$299/mo"
		}
		if s.RenewalDate == "" {
			s.RenewalDate = "2027-01-01"
		}

		_, err := db.DB.ExecContext(ctx, `
			INSERT INTO puzzle_subscriptions (id, organisation_id, organisation_name, user_email, plan_name, status, seats, price, renewal_date)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			ON CONFLICT (id) DO UPDATE SET
				plan_name = EXCLUDED.plan_name,
				status = EXCLUDED.status,
				seats = EXCLUDED.seats,
				price = EXCLUDED.price,
				renewal_date = EXCLUDED.renewal_date
		`, s.ID, s.OrganisationID, s.OrganisationName, s.UserEmail, s.PlanName, s.Status, s.Seats, s.Price, s.RenewalDate)

		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to save subscription")
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "subscription": s})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// ============================================================================
// 6. VERIFICATION, PASSWORDS & EMBED TOKENS
// ============================================================================

func HandlePlayerSendVerification(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Email) == "" {
		utils.JSONError(w, http.StatusBadRequest, "email is required")
		return
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))
	code := fmt.Sprintf("%06d", rand.Intn(900000)+100000)
	expiresAt := time.Now().Add(15 * time.Minute)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	_, err := db.DB.ExecContext(ctx, `
		INSERT INTO puzzle_verification_codes (email, code, type, expires_at)
		VALUES ($1, $2, 'email_verification', $3)
	`, email, code, expiresAt)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to store code")
		return
	}

	utils.DefaultPuzzleMailer.SendVerificationCodeEmail(email, code)
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Verification code dispatched",
	})
}

func HandlePlayerVerifyEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Email string `json:"email"`
		Code  string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" || req.Code == "" {
		utils.JSONError(w, http.StatusBadRequest, "email and code are required")
		return
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))
	code := strings.TrimSpace(req.Code)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var id int
	err := db.DB.QueryRowContext(ctx, `
		SELECT id FROM puzzle_verification_codes
		WHERE email = $1 AND code = $2 AND type = 'email_verification' AND used = FALSE AND expires_at > NOW()
		ORDER BY id DESC LIMIT 1
	`, email, code).Scan(&id)

	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid or expired verification code")
		return
	}

	_, _ = db.DB.ExecContext(ctx, "UPDATE puzzle_verification_codes SET used = TRUE WHERE id = $1", id)
	_, _ = db.DB.ExecContext(ctx, "UPDATE puzzle_organisations SET email_verified = TRUE WHERE contact_email = $1", email)

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Email verified successfully",
	})
}

func HandlePlayerForgotPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Email) == "" {
		utils.JSONError(w, http.StatusBadRequest, "email is required")
		return
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))
	code := fmt.Sprintf("%06d", rand.Intn(900000)+100000)
	expiresAt := time.Now().Add(15 * time.Minute)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	_, err := db.DB.ExecContext(ctx, `
		INSERT INTO puzzle_verification_codes (email, code, type, expires_at)
		VALUES ($1, $2, 'password_reset', $3)
	`, email, code, expiresAt)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to store reset code")
		return
	}

	utils.DefaultPuzzleMailer.SendPasswordResetEmail(email, code)
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Password reset code dispatched",
	})
}

func HandlePlayerResetPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Email       string `json:"email"`
		Code        string `json:"code"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" || req.Code == "" || req.NewPassword == "" {
		utils.JSONError(w, http.StatusBadRequest, "email, code, and new_password are required")
		return
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))
	code := strings.TrimSpace(req.Code)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var id int
	err := db.DB.QueryRowContext(ctx, `
		SELECT id FROM puzzle_verification_codes
		WHERE email = $1 AND code = $2 AND type = 'password_reset' AND used = FALSE AND expires_at > NOW()
		ORDER BY id DESC LIMIT 1
	`, email, code).Scan(&id)

	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid or expired reset code")
		return
	}

	_, _ = db.DB.ExecContext(ctx, "UPDATE puzzle_verification_codes SET used = TRUE WHERE id = $1", id)
	_, _ = db.DB.ExecContext(ctx, "UPDATE puzzle_organisations SET password = $1 WHERE contact_email = $2", req.NewPassword, email)

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Password reset successful",
	})
}

func HandlePlayerVerifyEmbedToken(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	payload, err := utils.VerifySignedEmbedToken(token)
	if err != nil {
		utils.JSONResponse(w, http.StatusUnauthorized, map[string]interface{}{
			"valid": false,
			"error": err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var org models.PuzzleOrganisation
	err = db.DB.QueryRowContext(ctx, `
		SELECT id, name, domain, contact_email, contact_phone, logo_url, token, google_ads_enabled, type
		FROM puzzle_organisations WHERE id = $1 LIMIT 1
	`, payload.OrgID).Scan(&org.ID, &org.Name, &org.Domain, &org.ContactEmail, &org.ContactPhone, &org.LogoURL, &org.Token, &org.GoogleAdsEnabled, &org.Type)

	if err != nil {
		utils.JSONResponse(w, http.StatusNotFound, map[string]interface{}{
			"valid": false,
			"error": "Organisation not found for this embed token",
		})
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"valid":        true,
		"organisation": org,
	})
}

func HandlePlayerGenerateEmbedToken(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		OrgID    string `json:"org_id"`
		Duration int    `json:"duration_days"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.OrgID == "" {
		utils.JSONError(w, http.StatusBadRequest, "org_id is required")
		return
	}
	duration := time.Duration(req.Duration) * 24 * time.Hour
	token, err := utils.GenerateSignedEmbedToken(req.OrgID, duration)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed generating embed token")
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"token":   token,
	})
}

func HandlePlayerSendEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		To      string `json:"to"`
		Subject string `json:"subject"`
		HTML    string `json:"html"`
		Text    string `json:"text"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.To == "" {
		utils.JSONError(w, http.StatusBadRequest, "to and subject required")
		return
	}
	err := utils.DefaultPuzzleMailer.SendEmail(req.To, req.Subject, req.HTML, req.Text)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true})
}

func HandlePlayerSendContactForm(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
		Category string `json:"category"`
		Message  string `json:"message"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" || req.Email == "" || req.Message == "" {
		utils.JSONError(w, http.StatusBadRequest, "name, email, and message are required")
		return
	}
	err := utils.DefaultPuzzleMailer.SendContactMessageEmail(req.Name, req.Email, req.Phone, req.Category, req.Message)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to deliver message")
		return
	}
	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Message sent successfully",
	})
}

// ============================================================================
// 7. GAMEPLAY PROGRESSION PROXIES (FORWARD TO service_puzzlepro)
// ============================================================================

func HandlePlayerProgressionProxy(w http.ResponseWriter, r *http.Request) {
	engineBase := getPuzzleproEngineURL()
	targetURL, err := url.Parse(engineBase + r.URL.RequestURI())
	if err != nil {
		utils.JSONError(w, http.StatusBadGateway, "Invalid engine target URL")
		return
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = targetURL.Host
		req.URL.Scheme = targetURL.Scheme
		req.URL.Host = targetURL.Host
		req.URL.Path = targetURL.Path
	}

	proxy.ErrorHandler = func(w http.ResponseWriter, req *http.Request, err error) {
		log.Printf("⚠️ [service_users -> service_puzzlepro proxy error]: %v", err)
		utils.JSONError(w, http.StatusBadGateway, "service_puzzlepro unavailable")
	}

	proxy.ServeHTTP(w, r)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

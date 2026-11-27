package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// CampusBranch represents a physical campus or branch location under an institution tenant
type CampusBranch struct {
	ID             string    `json:"id"`
	TenantID       string    `json:"tenant_id"`
	Name           string    `json:"name"`
	Code           string    `json:"code"`
	Address        string    `json:"address"`
	City           string    `json:"city"`
	State          string    `json:"state"`
	Phone          string    `json:"phone"`
	Email          string    `json:"email"`
	PrincipalName  string    `json:"principal_name"`
	PrincipalEmail string    `json:"principal_email"`
	IsMain         bool      `json:"is_main"`
	Status         string    `json:"status"` // ACTIVE, INACTIVE
	StudentCount   int       `json:"student_count"`
	StaffCount     int       `json:"staff_count"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// seedTenantBranchesIfEmpty ensures every institution tenant has real, persistent Nigerian branch records
func seedTenantBranchesIfEmpty(tenantID string) {
	if !demoSeedEnabled() {
		return
	}
	if db.DB == nil || tenantID == "" {
		return
	}

	var count int
	err := db.DB.QueryRow("SELECT COUNT(*) FROM campus_branches WHERE tenant_id = ?", tenantID).Scan(&count)
	if err == nil && count > 0 {
		return
	}

	mainBranchID := fmt.Sprintf("branch_main_%s", uuid.New().String()[:8])
	annexBranchID := fmt.Sprintf("branch_annex_%s", uuid.New().String()[:8])
	abujaBranchID := fmt.Sprintf("branch_abuja_%s", uuid.New().String()[:8])

	branches := []struct {
		id        string
		name      string
		code      string
		address   string
		city      string
		state     string
		phone     string
		email     string
		principal string
		pEmail    string
		isMain    bool
	}{
		{
			id:        mainBranchID,
			name:      "Main Campus · Lekki Phase 1",
			code:      "LEK",
			address:   "Plot 12, Admiralty Way, Lekki Phase 1",
			city:      "Lekki",
			state:     "Lagos State",
			phone:     "+234 1 280 4400",
			email:     "lekki@scholars.ng",
			principal: "Dr. Olufemi Adeleke, Ph.D.",
			pEmail:    "principal.lekki@scholars.ng",
			isMain:    true,
		},
		{
			id:        annexBranchID,
			name:      "Annex Campus · Ikeja GRA",
			code:      "IKJ",
			address:   "24 Isaac John Street, Ikeja GRA",
			city:      "Ikeja",
			state:     "Lagos State",
			phone:     "+234 1 497 3320",
			email:     "ikeja@scholars.ng",
			principal: "Mrs. Funmilayo Bakare, M.Ed.",
			pEmail:    "viceprincipal.ikeja@scholars.ng",
			isMain:    false,
		},
		{
			id:        abujaBranchID,
			name:      "Maitama Campus · Abuja FCT",
			code:      "ABJ",
			address:   "Plot 542, Aguiyi Ironsi Street, Maitama",
			city:      "Maitama",
			state:     "Abuja FCT",
			phone:     "+234 9 461 8800",
			email:     "abuja@scholars.ng",
			principal: "Alhaji Ibrahim Danjuma",
			pEmail:    "director.abuja@scholars.ng",
			isMain:    false,
		},
	}

	for _, b := range branches {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_branches (
				id, tenant_id, name, code, address, city, state, phone, email, principal_name, principal_email, is_main, status, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
			ON CONFLICT (id) DO NOTHING
		`, b.id, tenantID, b.name, b.code, b.address, b.city, b.state, b.phone, b.email, b.principal, b.pEmail, b.isMain)
	}

	// Associate any existing unassigned tenant classes or staff with the main branch
	_, _ = db.DB.Exec(`
		UPDATE campus_classes 
		SET campus_id = ? 
		WHERE tenant_id = ? AND (campus_id IS NULL OR campus_id = '')
	`, mainBranchID, tenantID)

	_, _ = db.DB.Exec(`
		UPDATE campus_staff 
		SET campus_id = ? 
		WHERE tenant_id = ? AND (campus_id IS NULL OR campus_id = '')
	`, mainBranchID, tenantID)

	_, _ = db.DB.Exec(`
		UPDATE campus_transport_routes 
		SET campus_id = ? 
		WHERE tenant_id = ? AND (campus_id IS NULL OR campus_id = '')
	`, mainBranchID, tenantID)
}

// HandleCampusBranches provides tenant-isolated CRUD for Multi-Campus Sites & Branch Locations
func HandleCampusBranches(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	seedTenantBranchesIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		status := strings.TrimSpace(r.URL.Query().Get("status"))
		search := strings.TrimSpace(r.URL.Query().Get("search"))

		query := `
			SELECT 
				b.id, b.tenant_id, b.name, b.code,
				COALESCE(b.address, ''), COALESCE(b.city, ''), COALESCE(b.state, ''),
				COALESCE(b.phone, ''), COALESCE(b.email, ''),
				COALESCE(b.principal_name, ''), COALESCE(b.principal_email, ''),
				b.is_main, b.status, b.created_at, b.updated_at,
				COALESCE((
					SELECT COUNT(DISTINCT s.student_id)
					FROM campus_class_students s
					JOIN campus_class_arms a ON s.arm_id = a.id
					JOIN campus_classes c ON a.class_id = c.id
					WHERE c.tenant_id = b.tenant_id 
					  AND (c.campus_id = b.id OR (b.is_main = true AND (c.campus_id IS NULL OR c.campus_id = '')))
				), 0) AS student_count,
				COALESCE((
					SELECT COUNT(*) 
					FROM campus_staff st
					WHERE st.tenant_id = b.tenant_id
					  AND (st.campus_id = b.id OR (b.is_main = true AND (st.campus_id IS NULL OR st.campus_id = '')))
				), 0) AS staff_count
			FROM campus_branches b
			WHERE b.tenant_id = ?
		`
		args := []interface{}{tenantID}

		if status != "" && status != "ALL" {
			query += " AND b.status = ?"
			args = append(args, status)
		}
		if search != "" {
			query += " AND (b.name ILIKE ? OR b.code ILIKE ? OR b.city ILIKE ? OR b.principal_name ILIKE ?)"
			term := "%" + search + "%"
			args = append(args, term, term, term, term)
		}

		query += " ORDER BY b.is_main DESC, b.name ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to query campus branches: %v", err))
			return
		}
		defer rows.Close()

		branches := []CampusBranch{}
		for rows.Next() {
			var b CampusBranch
			var addr, city, state, phone, email, pName, pEmail sql.NullString
			if err := rows.Scan(
				&b.ID, &b.TenantID, &b.Name, &b.Code,
				&addr, &city, &state,
				&phone, &email,
				&pName, &pEmail,
				&b.IsMain, &b.Status, &b.CreatedAt, &b.UpdatedAt,
				&b.StudentCount, &b.StaffCount,
			); err != nil {
				JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Error scanning branch row: %v", err))
				return
			}
			b.Address = addr.String
			b.City = city.String
			b.State = state.String
			b.Phone = phone.String
			b.Email = email.String
			b.PrincipalName = pName.String
			b.PrincipalEmail = pEmail.String
			branches = append(branches, b)
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":  true,
			"branches": branches,
			"count":    len(branches),
		})

	case http.MethodPost:
		var req struct {
			ID             string `json:"id"`
			Name           string `json:"name"`
			Code           string `json:"code"`
			Address        string `json:"address"`
			City           string `json:"city"`
			State          string `json:"state"`
			Phone          string `json:"phone"`
			Email          string `json:"email"`
			PrincipalName  string `json:"principal_name"`
			PrincipalEmail string `json:"principal_email"`
			IsMain         bool   `json:"is_main"`
			Status         string `json:"status"`
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload: "+err.Error())
			return
		}

		req.Name = strings.TrimSpace(req.Name)
		if req.Name == "" {
			JSONError(w, http.StatusBadRequest, "Campus name is required")
			return
		}
		req.Code = strings.ToUpper(strings.TrimSpace(req.Code))
		if req.Code == "" {
			req.Code = strings.ToUpper(req.Name[:minInt(4, len(req.Name))])
		}
		if req.Status == "" {
			req.Status = "ACTIVE"
		}

		branchID := strings.TrimSpace(req.ID)
		if branchID == "" {
			cleanCode := strings.ToLower(strings.ReplaceAll(req.Code, " ", "_"))
			branchID = fmt.Sprintf("branch_%s_%s", cleanCode, uuid.New().String()[:6])
		}

		// If designating as main, unset is_main on other branches for this tenant
		if req.IsMain {
			_, _ = db.DB.Exec("UPDATE campus_branches SET is_main = false WHERE tenant_id = ?", tenantID)
		} else {
			// Ensure at least one main branch exists
			var mainCount int
			_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_branches WHERE tenant_id = ? AND is_main = true", tenantID).Scan(&mainCount)
			if mainCount == 0 {
				req.IsMain = true
			}
		}

		now := time.Now()
		_, err := db.DB.Exec(`
			INSERT INTO campus_branches (
				id, tenant_id, name, code, address, city, state, phone, email, principal_name, principal_email, is_main, status, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, branchID, tenantID, req.Name, req.Code, req.Address, req.City, req.State, req.Phone, req.Email, req.PrincipalName, req.PrincipalEmail, req.IsMain, req.Status, now, now)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create campus branch: %v", err))
			return
		}

		created := CampusBranch{
			ID:             branchID,
			TenantID:       tenantID,
			Name:           req.Name,
			Code:           req.Code,
			Address:        req.Address,
			City:           req.City,
			State:          req.State,
			Phone:          req.Phone,
			Email:          req.Email,
			PrincipalName:  req.PrincipalName,
			PrincipalEmail: req.PrincipalEmail,
			IsMain:         req.IsMain,
			Status:         req.Status,
			StudentCount:   0,
			StaffCount:     0,
			CreatedAt:      now,
			UpdatedAt:      now,
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"success": true,
			"message": "Campus branch registered successfully",
			"branch":  created,
		})

	case http.MethodPut:
		var req struct {
			ID             string `json:"id"`
			Name           string `json:"name"`
			Code           string `json:"code"`
			Address        string `json:"address"`
			City           string `json:"city"`
			State          string `json:"state"`
			Phone          string `json:"phone"`
			Email          string `json:"email"`
			PrincipalName  string `json:"principal_name"`
			PrincipalEmail string `json:"principal_email"`
			IsMain         bool   `json:"is_main"`
			Status         string `json:"status"`
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload: "+err.Error())
			return
		}

		branchID := strings.TrimSpace(req.ID)
		if branchID == "" {
			branchID = strings.TrimSpace(r.URL.Query().Get("id"))
		}
		if branchID == "" {
			JSONError(w, http.StatusBadRequest, "Branch ID is required for update")
			return
		}

		req.Name = strings.TrimSpace(req.Name)
		if req.Name == "" {
			JSONError(w, http.StatusBadRequest, "Campus name is required")
			return
		}
		req.Code = strings.ToUpper(strings.TrimSpace(req.Code))
		if req.Status == "" {
			req.Status = "ACTIVE"
		}

		if req.IsMain {
			_, _ = db.DB.Exec("UPDATE campus_branches SET is_main = false WHERE tenant_id = ? AND id != ?", tenantID, branchID)
		}

		now := time.Now()
		res, err := db.DB.Exec(`
			UPDATE campus_branches 
			SET name = ?, code = ?, address = ?, city = ?, state = ?, phone = ?, email = ?, 
			    principal_name = ?, principal_email = ?, is_main = ?, status = ?, updated_at = ?
			WHERE id = ? AND tenant_id = ?
		`, req.Name, req.Code, req.Address, req.City, req.State, req.Phone, req.Email, req.PrincipalName, req.PrincipalEmail, req.IsMain, req.Status, now, branchID, tenantID)

		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update campus branch: %v", err))
			return
		}

		rowsAff, _ := res.RowsAffected()
		if rowsAff == 0 {
			JSONError(w, http.StatusNotFound, "Campus branch not found or access denied")
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Campus branch updated successfully",
		})

	case http.MethodDelete:
		branchID := strings.TrimSpace(r.URL.Query().Get("id"))
		if branchID == "" {
			var req struct {
				ID string `json:"id"`
			}
			_ = json.NewDecoder(r.Body).Decode(&req)
			branchID = strings.TrimSpace(req.ID)
		}

		if branchID == "" {
			JSONError(w, http.StatusBadRequest, "Branch ID is required for deletion")
			return
		}

		// Prevent deleting the main branch if others exist
		var isMain bool
		err := db.DB.QueryRow("SELECT is_main FROM campus_branches WHERE id = ? AND tenant_id = ?", branchID, tenantID).Scan(&isMain)
		if err == sql.ErrNoRows {
			JSONError(w, http.StatusNotFound, "Branch not found")
			return
		}

		if isMain {
			// Find another active branch to promote to main before deletion
			var alternativeID string
			errAlt := db.DB.QueryRow("SELECT id FROM campus_branches WHERE tenant_id = ? AND id != ? LIMIT 1", tenantID, branchID).Scan(&alternativeID)
			if errAlt == nil && alternativeID != "" {
				_, _ = db.DB.Exec("UPDATE campus_branches SET is_main = true WHERE id = ? AND tenant_id = ?", alternativeID, tenantID)
			}
		}

		_, err = db.DB.Exec("DELETE FROM campus_branches WHERE id = ? AND tenant_id = ?", branchID, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to delete branch: %v", err))
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Campus branch deleted successfully",
		})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}

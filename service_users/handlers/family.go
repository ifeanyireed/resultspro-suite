package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

// HandleVerifyRelation verifies whether a parent-child relationship exists and is authorized
func HandleVerifyRelation(w http.ResponseWriter, r *http.Request) {
	parent := r.URL.Query().Get("parent")
	child := r.URL.Query().Get("child")
	if parent == "" || child == "" {
		utils.JSONError(w, http.StatusBadRequest, "parent and child parameters are required")
		return
	}

	var relationship string
	err := db.DB.QueryRow("SELECT relationship_type FROM family_relationships WHERE parent_user_id = ? AND child_user_id = ?", parent, child).
		Scan(&relationship)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
				"authorized": false,
			})
			return
		}
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"authorized":   true,
		"relationship": relationship,
	})
}

// HandleCreateFamilyRelationship establishes a link between a parent and a child
func HandleCreateFamilyRelationship(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		ParentUserID       string `json:"parent_user_id"`
		ChildUserID        string `json:"child_user_id"`
		RelationshipType   string `json:"relationship_type"` // father, mother, guardian, sponsor
		IsEmergencyContact bool   `json:"is_emergency_contact"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ParentUserID == "" || input.ChildUserID == "" {
		utils.JSONError(w, http.StatusBadRequest, "parent_user_id and child_user_id are required")
		return
	}

	relType := input.RelationshipType
	if relType == "" {
		relType = "guardian"
	}

	id := uuid.New().String()
	now := time.Now().UTC().Format("2006-01-02 15:04:05")

	query := `
		INSERT INTO family_relationships (id, parent_user_id, child_user_id, relationship_type, is_emergency_contact, created_at, updated_at) 
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE relationship_type = VALUES(relationship_type), is_emergency_contact = VALUES(is_emergency_contact), updated_at = VALUES(updated_at)`

	_, err := db.DB.Exec(query, id, input.ParentUserID, input.ChildUserID, relType, input.IsEmergencyContact, now, now)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create family relationship")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id":           id,
		"relationship": relType,
		"message":      "Family relationship created successfully",
	})
}

// HandleGetParentChildren retrieves all children linked to a parent
func HandleGetParentChildren(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	parentID := ""
	for i, part := range parts {
		if (part == "parents" || part == "parent") && i+1 < len(parts) {
			parentID = parts[i+1]
			break
		}
	}

	if parentID == "" {
		parentID = r.URL.Query().Get("parent_id")
	}

	query := `
		SELECT fr.id, fr.child_user_id, u.full_name, u.email, u.avatar_url, fr.relationship_type, fr.is_emergency_contact, c.name as class_name, s.name as school_name
		FROM family_relationships fr
		JOIN users u ON fr.child_user_id = u.id
		LEFT JOIN enrollments e ON fr.child_user_id = e.student_id AND e.status = 'active'
		LEFT JOIN sections sec ON e.section_id = sec.id
		LEFT JOIN classes c ON sec.class_id = c.id
		LEFT JOIN schools s ON c.school_id = s.id
		WHERE fr.parent_user_id = ?`

	rows, err := db.DB.Query(query, parentID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	type ChildProfile struct {
		RelationshipID     string `json:"relationship_id"`
		ChildUserID        string `json:"child_user_id"`
		FullName           string `json:"full_name"`
		Email              string `json:"email"`
		AvatarURL          string `json:"avatar_url"`
		RelationshipType   string `json:"relationship_type"`
		IsEmergencyContact bool   `json:"is_emergency_contact"`
		ClassName          string `json:"class_name,omitempty"`
		SchoolName         string `json:"school_name,omitempty"`
	}

	children := []ChildProfile{}
	for rows.Next() {
		var cp ChildProfile
		var fullName, avatar, className, schoolName sql.NullString
		if err := rows.Scan(&cp.RelationshipID, &cp.ChildUserID, &fullName, &cp.Email, &avatar, &cp.RelationshipType, &cp.IsEmergencyContact, &className, &schoolName); err == nil {
			if fullName.Valid {
				cp.FullName = fullName.String
			}
			if avatar.Valid {
				cp.AvatarURL = avatar.String
			}
			if className.Valid {
				cp.ClassName = className.String
			}
			if schoolName.Valid {
				cp.SchoolName = schoolName.String
			}
			children = append(children, cp)
		}
	}

	utils.JSONResponse(w, http.StatusOK, children)
}

// HandleGetClassParents returns contact information for all parents of students in a specific section
func HandleGetClassParents(w http.ResponseWriter, r *http.Request) {
	sectionID := r.URL.Query().Get("section_id")
	if sectionID == "" {
		sectionID = r.URL.Query().Get("sectionId")
	}

	if sectionID == "" {
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"message": "Class parents query endpoint (pass ?section_id=...)",
			"parents": []interface{}{},
		})
		return
	}

	query := `
		SELECT DISTINCT p.id, p.full_name, p.email, p.phone, s.full_name as student_name, fr.relationship_type
		FROM enrollments e
		JOIN users s ON e.student_id = s.id
		JOIN family_relationships fr ON s.id = fr.child_user_id
		JOIN users p ON fr.parent_user_id = p.id
		WHERE e.section_id = ? AND e.status = 'active'`

	rows, err := db.DB.Query(query, sectionID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	type ParentContact struct {
		ParentID         string `json:"parent_id"`
		ParentName       string `json:"parent_name"`
		Email            string `json:"email"`
		Phone            string `json:"phone"`
		StudentName      string `json:"student_name"`
		RelationshipType string `json:"relationship_type"`
	}

	parents := []ParentContact{}
	for rows.Next() {
		var pc ParentContact
		var pName, phone, sName sql.NullString
		if err := rows.Scan(&pc.ParentID, &pName, &pc.Email, &phone, &sName, &pc.RelationshipType); err == nil {
			if pName.Valid {
				pc.ParentName = pName.String
			}
			if phone.Valid {
				pc.Phone = phone.String
			}
			if sName.Valid {
				pc.StudentName = sName.String
			}
			parents = append(parents, pc)
		}
	}

	utils.JSONResponse(w, http.StatusOK, parents)
}

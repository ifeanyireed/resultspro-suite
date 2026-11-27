package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// getCampusProBaseURL returns the configured service_campuspro base URL.
func getCampusProBaseURL() string {
	for _, key := range []string{"CAMPUSPRO_SERVICE_URL", "CAMPUSPRO_URL", "NEXT_PUBLIC_CAMPUSPRO_API"} {
		if v := strings.TrimRight(strings.TrimSpace(os.Getenv(key)), "/"); v != "" {
			return v
		}
	}
	return "http://localhost:7008"
}

// resolveRequestTenantID extracts the tenant identifier from the Gin context, headers, or query params.
func resolveRequestTenantID(c *gin.Context) string {
	if c == nil {
		return ""
	}
	if tid, ok := c.Get("tenant_id"); ok {
		if s, ok := tid.(string); ok && strings.TrimSpace(s) != "" {
			return strings.TrimSpace(s)
		}
	}
	for _, h := range []string{"X-Tenant-ID", "x-tenant-id", "X-Tenant-Slug", "X-Tenant-Domain"} {
		if v := strings.TrimSpace(c.GetHeader(h)); v != "" {
			return v
		}
	}
	for _, q := range []string{"tenant_id", "tenant"} {
		if v := strings.TrimSpace(c.Query(q)); v != "" {
			return v
		}
	}
	return ""
}

// campusProRequest performs an authenticated, tenant-scoped HTTP call to service_campuspro.
func campusProRequest(c *gin.Context, method, path string, query url.Values, body interface{}, out interface{}) (int, error) {
	base := getCampusProBaseURL()
	fullURL := base + path
	if len(query) > 0 {
		fullURL += "?" + query.Encode()
	}

	var bodyReader io.Reader
	if body != nil {
		raw, err := json.Marshal(body)
		if err != nil {
			return 0, err
		}
		bodyReader = bytes.NewReader(raw)
	}

	req, err := http.NewRequest(method, fullURL, bodyReader)
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	if c != nil {
		if auth := c.GetHeader("Authorization"); auth != "" {
			req.Header.Set("Authorization", auth)
		}
		tenantID := resolveRequestTenantID(c)
		if tenantID != "" {
			req.Header.Set("X-Tenant-ID", tenantID)
			req.Header.Set("X-Tenant-Slug", tenantID)
		}
	}

	client := &http.Client{Timeout: 8 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return resp.StatusCode, err
	}

	if resp.StatusCode >= 400 {
		return resp.StatusCode, fmt.Errorf("campuspro %s %s returned %d: %s", method, path, resp.StatusCode, string(respBytes))
	}

	if out != nil && len(respBytes) > 0 {
		if err := json.Unmarshal(respBytes, out); err != nil {
			return resp.StatusCode, err
		}
	}
	return resp.StatusCode, nil
}

// CampusSubjectItem mirrors service_campuspro's SubjectRecord JSON contract.
type CampusSubjectItem struct {
	ID             string `json:"id"`
	TenantID       string `json:"tenant_id"`
	Code           string `json:"code"`
	Title          string `json:"title"`
	Department     string `json:"department"`
	Category       string `json:"category"`
	Curriculum     string `json:"curriculum"`
	LevelCategory  string `json:"level_category"`
	PeriodsPerWeek int    `json:"periods_per_week"`
	CAWeight       int    `json:"ca_weight"`
	ExamWeight     int    `json:"exam_weight"`
	PassMark       int    `json:"pass_mark"`
	Status         string `json:"status"`
	Description    string `json:"description"`
	TutorsCount    int    `json:"tutors_count"`
	ArmsCount      int    `json:"arms_count"`
}

// CampusStudentItem mirrors service_campuspro's StudentRecord JSON contract.
type CampusStudentItem struct {
	ID              string `json:"id"`
	TenantID        string `json:"tenant_id"`
	ClassArmID      string `json:"class_arm_id"`
	ClassArmName    string `json:"class_arm_name"`
	AdmissionNumber string `json:"admission_number"`
	FullName        string `json:"full_name"`
	Gender          string `json:"gender"`
	BoardingType    string `json:"boarding_type"`
	GuardianName    string `json:"guardian_name"`
	GuardianPhone   string `json:"guardian_phone"`
	Status          string `json:"status"`
}

// fetchCampusSubjects queries GET /api/v1/campus/subjects on service_campuspro.
func fetchCampusSubjects(c *gin.Context) ([]CampusSubjectItem, error) {
	q := url.Values{}
	if tid := resolveRequestTenantID(c); tid != "" {
		q.Set("tenant_id", tid)
	}
	var resp struct {
		Subjects []CampusSubjectItem `json:"subjects"`
	}
	if _, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/subjects", q, nil, &resp); err != nil {
		return nil, err
	}
	return resp.Subjects, nil
}

// fetchCampusStudents queries GET /api/v1/campus/classes/arms/students on service_campuspro.
func fetchCampusStudents(c *gin.Context) ([]CampusStudentItem, error) {
	q := url.Values{}
	if tid := resolveRequestTenantID(c); tid != "" {
		q.Set("tenant_id", tid)
	}
	if c != nil {
		if armID := strings.TrimSpace(c.Query("class_arm_id")); armID != "" {
			q.Set("class_arm_id", armID)
		}
	}
	var resp struct {
		Students []CampusStudentItem `json:"students"`
	}
	if _, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/classes/arms/students", q, nil, &resp); err != nil {
		return nil, err
	}
	return resp.Students, nil
}

// fetchCampusLinkedWards queries GET /api/v1/campus/parents on service_campuspro
// and filters linked wards for the authenticated parent (by user_id or email).
func fetchCampusLinkedWards(c *gin.Context) ([]LinkedWardProfile, error) {
	q := url.Values{}
	if tid := resolveRequestTenantID(c); tid != "" {
		q.Set("tenant_id", tid)
	}
	parentEmail := ""
	if c != nil {
		if em, ok := c.Get("user_email"); ok {
			if s, ok := em.(string); ok {
				parentEmail = strings.TrimSpace(s)
			}
		}
		if parentEmail == "" {
			parentEmail = strings.TrimSpace(c.Query("parent_email"))
		}
	}
	if parentEmail != "" {
		q.Set("search", parentEmail)
	}

	var resp struct {
		Parents []struct {
			ID          string `json:"id"`
			FullName    string `json:"full_name"`
			Email       string `json:"email"`
			LinkedWards []struct {
				ID              string `json:"id"`
				ParentID        string `json:"parent_id"`
				StudentID       string `json:"student_id"`
				StudentName     string `json:"student_name"`
				AdmissionNumber string `json:"admission_number"`
				ClassArmName    string `json:"class_arm_name"`
			} `json:"linked_wards"`
		} `json:"parents"`
	}
	if _, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/parents", q, nil, &resp); err != nil {
		return nil, err
	}

	parentID := ""
	if c != nil {
		if uid, ok := c.Get("user_id"); ok {
			if s, ok := uid.(string); ok {
				parentID = strings.TrimSpace(s)
			}
		}
		if parentID == "" {
			parentID = strings.TrimSpace(c.Query("parent_id"))
		}
	}

	wards := make([]LinkedWardProfile, 0)
	seen := make(map[string]bool)
	for _, p := range resp.Parents {
		if parentID != "" && p.ID != parentID && parentEmail != "" && !strings.EqualFold(p.Email, parentEmail) {
			continue
		}
		for _, w := range p.LinkedWards {
			if w.StudentID == "" || seen[w.StudentID] {
				continue
			}
			seen[w.StudentID] = true
			wards = append(wards, LinkedWardProfile{
				StudentID:       w.StudentID,
				FullName:        w.StudentName,
				AdmissionNumber: w.AdmissionNumber,
				ClassCode:       normalizeClassCodeFromArm(w.ClassArmName),
				ClassLabel:      w.ClassArmName,
				Campus:          resolveRequestTenantID(c),
			})
		}
	}
	return wards, nil
}

func normalizeClassCodeFromArm(armName string) string {
	lower := strings.ToLower(strings.TrimSpace(armName))
	switch {
	case strings.Contains(lower, "jss 1") || strings.Contains(lower, "jss1") || strings.Contains(lower, "js1"):
		return "jss-1"
	case strings.Contains(lower, "jss 2") || strings.Contains(lower, "jss2") || strings.Contains(lower, "js2"):
		return "jss-2"
	case strings.Contains(lower, "jss 3") || strings.Contains(lower, "jss3") || strings.Contains(lower, "js3"):
		return "jss-3"
	case strings.Contains(lower, "sss 1") || strings.Contains(lower, "ss 1") || strings.Contains(lower, "ss1"):
		return "sss-1"
	case strings.Contains(lower, "sss 2") || strings.Contains(lower, "ss 2") || strings.Contains(lower, "ss2"):
		return "sss-2"
	case strings.Contains(lower, "sss 3") || strings.Contains(lower, "ss 3") || strings.Contains(lower, "ss3"):
		return "sss-3"
	case strings.Contains(lower, "primary 4") || strings.Contains(lower, "pri 4"):
		return "primary-4"
	case strings.Contains(lower, "primary 5") || strings.Contains(lower, "pri 5"):
		return "primary-5"
	case strings.Contains(lower, "primary 6") || strings.Contains(lower, "pri 6"):
		return "primary-6"
	default:
		return lower
	}
}

// ProxyCampusClasses forwards class and arm queries to service_campuspro (/api/v1/campus/classes).
// Route: GET /api/campus/classes (and GET /api/classes)
func (h *Handler) ProxyCampusClasses(c *gin.Context) {
	q := c.Request.URL.Query()
	if tid := resolveRequestTenantID(c); tid != "" && q.Get("tenant_id") == "" {
		q.Set("tenant_id", tid)
	}
	var out map[string]interface{}
	status, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/classes", q, nil, &out)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "Failed to fetch classes from service_campuspro: " + err.Error(),
			"classes": []interface{}{},
			"status":  status,
		})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ProxyCampusStudents forwards student roster queries to service_campuspro (/api/v1/campus/classes/arms/students).
// Route: GET /api/campus/students
func (h *Handler) ProxyCampusStudents(c *gin.Context) {
	q := c.Request.URL.Query()
	if tid := resolveRequestTenantID(c); tid != "" && q.Get("tenant_id") == "" {
		q.Set("tenant_id", tid)
	}
	var out map[string]interface{}
	status, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/classes/arms/students", q, nil, &out)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":    "Failed to fetch student roster from service_campuspro: " + err.Error(),
			"students": []interface{}{},
			"status":   status,
		})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ProxyCampusParentWards forwards parent ward queries to service_campuspro (/api/v1/campus/parents).
// Route: GET /api/campus/parent/wards
func (h *Handler) ProxyCampusParentWards(c *gin.Context) {
	wards, err := fetchCampusLinkedWards(c)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":        "Failed to fetch linked wards from service_campuspro: " + err.Error(),
			"linked_wards": []LinkedWardProfile{},
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"linked_wards":     wards,
		"system_of_record": "service_campuspro",
	})
}

// ProxyCampusOfficialScores forwards official exam score queries to service_campuspro (/api/v1/campus/exam-scores/official).
// Route: GET /api/campus/exam-scores/official
func (h *Handler) ProxyCampusOfficialScores(c *gin.Context) {
	q := c.Request.URL.Query()
	if tid := resolveRequestTenantID(c); tid != "" && q.Get("tenant_id") == "" {
		q.Set("tenant_id", tid)
	}
	var out map[string]interface{}
	status, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/exam-scores/official", q, nil, &out)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":           "Failed to fetch official exam scores from service_campuspro: " + err.Error(),
			"official_scores": []interface{}{},
			"status":          status,
		})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ProxyCampusBranches forwards campus branch/school queries to service_campuspro (/api/v1/campus/branches).
// Route: GET /api/campus/branches
func (h *Handler) ProxyCampusBranches(c *gin.Context) {
	q := c.Request.URL.Query()
	if tid := resolveRequestTenantID(c); tid != "" && q.Get("tenant_id") == "" {
		q.Set("tenant_id", tid)
	}
	var out map[string]interface{}
	status, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/branches", q, nil, &out)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":    "Failed to fetch campus branches from service_campuspro: " + err.Error(),
			"branches": []interface{}{},
			"status":   status,
		})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ProxyCampusStaff forwards staff & faculty queries to service_campuspro (/api/v1/campus/staff).
// Route: GET /api/campus/staff
func (h *Handler) ProxyCampusStaff(c *gin.Context) {
	q := c.Request.URL.Query()
	if tid := resolveRequestTenantID(c); tid != "" && q.Get("tenant_id") == "" {
		q.Set("tenant_id", tid)
	}
	var out map[string]interface{}
	status, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/staff", q, nil, &out)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":  "Failed to fetch staff from service_campuspro: " + err.Error(),
			"staff":  []interface{}{},
			"status": status,
		})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ProxyCampusNotices forwards school circulars & announcements to service_campuspro (/api/v1/campus/notices).
// Route: GET /api/campus/notices (and GET /api/notifications)
func (h *Handler) ProxyCampusNotices(c *gin.Context) {
	q := c.Request.URL.Query()
	if tid := resolveRequestTenantID(c); tid != "" && q.Get("tenant_id") == "" {
		q.Set("tenant_id", tid)
	}
	var out map[string]interface{}
	status, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/notices", q, nil, &out)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "Failed to fetch notices from service_campuspro: " + err.Error(),
			"notices": []interface{}{},
			"status":  status,
		})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ProxyCampusSummary forwards executive summary queries to service_campuspro (/api/v1/campus/summary).
// Route: GET /api/campus/summary
func (h *Handler) ProxyCampusSummary(c *gin.Context) {
	q := c.Request.URL.Query()
	if tid := resolveRequestTenantID(c); tid != "" && q.Get("tenant_id") == "" {
		q.Set("tenant_id", tid)
	}
	var out map[string]interface{}
	status, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/summary", q, nil, &out)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":  "Failed to fetch campus summary from service_campuspro: " + err.Error(),
			"status": status,
		})
		return
	}
	c.JSON(http.StatusOK, out)
}

// ProxyCampusUsersDirectory aggregates students, staff, and parents from service_campuspro
// so user directory screens render 100% live CampusPRO user records.
// Route: GET /api/campus/users
func (h *Handler) ProxyCampusUsersDirectory(c *gin.Context) {
	q := url.Values{}
	tenantID := resolveRequestTenantID(c)
	if tenantID != "" {
		q.Set("tenant_id", tenantID)
	}

	users := make([]gin.H, 0)

	// 1. Students from /api/v1/campus/classes/arms/students
	students, _ := fetchCampusStudents(c)
	for _, s := range students {
		status := s.Status
		if status == "" {
			status = "Active"
		}
		users = append(users, gin.H{
			"id":               s.ID,
			"fullName":         s.FullName,
			"full_name":        s.FullName,
			"email":            s.AdmissionNumber,
			"admission_number": s.AdmissionNumber,
			"role":             "Student",
			"school":           s.TenantID,
			"class_arm_name":   s.ClassArmName,
			"status":           status,
		})
	}

	// 2. Staff from /api/v1/campus/staff
	var staffResp struct {
		Staff []struct {
			ID         string `json:"id"`
			TenantID   string `json:"tenant_id"`
			StaffID    string `json:"staff_id"`
			FullName   string `json:"full_name"`
			Email      string `json:"email"`
			RoleTitle  string `json:"role_title"`
			Department string `json:"department"`
			Status     string `json:"status"`
		} `json:"staff"`
	}
	if _, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/staff", q, nil, &staffResp); err == nil {
		for _, st := range staffResp.Staff {
			role := st.RoleTitle
			if role == "" {
				role = "Teacher"
			}
			status := st.Status
			if status == "" {
				status = "Active"
			}
			users = append(users, gin.H{
				"id":         st.ID,
				"fullName":   st.FullName,
				"full_name":  st.FullName,
				"email":      st.Email,
				"staff_id":   st.StaffID,
				"role":       role,
				"department": st.Department,
				"school":     st.TenantID,
				"status":     status,
			})
		}
	}

	// 3. Parents from /api/v1/campus/parents
	var parentResp struct {
		Parents []struct {
			ID       string `json:"id"`
			TenantID string `json:"tenant_id"`
			FullName string `json:"full_name"`
			Email    string `json:"email"`
			Phone    string `json:"phone"`
			Status   string `json:"status"`
		} `json:"parents"`
	}
	if _, err := campusProRequest(c, http.MethodGet, "/api/v1/campus/parents", q, nil, &parentResp); err == nil {
		for _, p := range parentResp.Parents {
			status := p.Status
			if status == "" {
				status = "Active"
			}
			users = append(users, gin.H{
				"id":        p.ID,
				"fullName":  p.FullName,
				"full_name": p.FullName,
				"email":     p.Email,
				"phone":     p.Phone,
				"role":      "Parent",
				"school":    p.TenantID,
				"status":    status,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"users":            users,
		"total":            len(users),
		"system_of_record": "service_campuspro",
	})
}

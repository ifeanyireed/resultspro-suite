package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"service_classroompro/db"
)

func setupOfflineTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	db.InitRedis()
	h := NewHandler()
	r := gin.New()
	api := r.Group("/api")
	{
		api.GET("/content/manifests", h.GetContentManifests)
		api.GET("/content/packages/:packageId", h.GetContentPackage)
		api.GET("/content/versions/:contentId", h.GetLessonVersions)
		api.POST("/content/publish", h.PublishLessonContent)
		api.POST("/sync/push", h.PushOfflineSync)
		api.GET("/sync/status", h.GetOfflineSyncStatus)
	}
	return r
}

// §17.1 & §17.2: Curriculum Hierarchy, Lesson Metadata, Content Validation, and Versioning Tests
func TestContentManifestsAndValidation(t *testing.T) {
	r := setupOfflineTestRouter()

	// 1. Query Primary 4 -> Mathematics -> First Term manifest
	req, _ := http.NewRequest("GET", "/api/content/manifests?class_code=primary-4&subject_id=mathematics&term=first-term", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK for manifest query, got %d: %s", w.Code, w.Body.String())
	}

	var manifestResp struct {
		Curriculum string         `json:"curriculum"`
		Packages   []PackageEntry `json:"packages"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &manifestResp); err != nil {
		t.Fatalf("Failed to decode manifest response: %v", err)
	}
	if manifestResp.Curriculum != "NERDC" || len(manifestResp.Packages) != 1 {
		t.Fatalf("Expected 1 NERDC Primary 4 Math First Term package, got %d", len(manifestResp.Packages))
	}

	// 2. Reject invalid Markdown missing frontmatter
	invalidPayload := map[string]interface{}{
		"content_id":    "nerdc-pri4-math-t1-w01",
		"class_code":    "primary-4",
		"subject_id":    "mathematics",
		"term":          "first-term",
		"week":          1,
		"topic":         "Whole Numbers",
		"markdown_body": "Plain text without YAML frontmatter or heading",
	}
	bodyBytes, _ := json.Marshal(invalidPayload)
	reqInvalid, _ := http.NewRequest("POST", "/api/content/publish", bytes.NewReader(bodyBytes))
	reqInvalid.Header.Set("Content-Type", "application/json")
	wInvalid := httptest.NewRecorder()
	r.ServeHTTP(wInvalid, reqInvalid)

	if wInvalid.Code != http.StatusUnprocessableEntity {
		t.Fatalf("Expected 422 Unprocessable Entity for missing frontmatter, got %d", wInvalid.Code)
	}

	// 3. Reject raw video upload references (.mp4) — enforce Linked YouTube Video Policy
	rawVideoPayload := map[string]interface{}{
		"content_id":    "nerdc-pri4-math-t1-w01",
		"class_code":    "primary-4",
		"subject_id":    "mathematics",
		"term":          "first-term",
		"week":          1,
		"topic":         "Whole Numbers",
		"markdown_body": "---\ncurriculum: NERDC\n---\n# Week 1\nWatch raw video upload at https://example.com/upload.mp4",
	}
	rawVideoBytes, _ := json.Marshal(rawVideoPayload)
	reqVideo, _ := http.NewRequest("POST", "/api/content/publish", bytes.NewReader(rawVideoBytes))
	reqVideo.Header.Set("Content-Type", "application/json")
	wVideo := httptest.NewRecorder()
	r.ServeHTTP(wVideo, reqVideo)

	if wVideo.Code != http.StatusUnprocessableEntity {
		t.Fatalf("Expected 422 for prohibited .mp4 raw video upload reference, got %d", wVideo.Code)
	}

	// 4. Reject unregistered Cloudinary asset reference
	brokenAssetPayload := map[string]interface{}{
		"content_id":    "nerdc-pri4-math-t1-w01",
		"class_code":    "primary-4",
		"subject_id":    "mathematics",
		"term":          "first-term",
		"week":          1,
		"topic":         "Whole Numbers",
		"markdown_body": "---\ncurriculum: NERDC\n---\n# Week 1\n![Broken](asset://cld-nonexistent-99999)",
	}
	brokenBytes, _ := json.Marshal(brokenAssetPayload)
	reqBroken, _ := http.NewRequest("POST", "/api/content/publish", bytes.NewReader(brokenBytes))
	reqBroken.Header.Set("Content-Type", "application/json")
	wBroken := httptest.NewRecorder()
	r.ServeHTTP(wBroken, reqBroken)

	if wBroken.Code != http.StatusUnprocessableEntity {
		t.Fatalf("Expected 422 for broken asset reference, got %d", wBroken.Code)
	}
}

// §17.4: Redis Namespace Isolation Tests
func TestRedisNamespaceIsolation(t *testing.T) {
	db.InitRedis()
	ctx := context.Background()

	expectedPrefixes := map[string]string{
		"curriculum":    "classroom:curriculum:",
		"lessons":       "classroom:lessons:",
		"sync":          "classroom:sync:",
		"assessments":   "classroom:assessments:",
		"notifications": "classroom:notifications:",
	}

	for ns, prefix := range expectedPrefixes {
		key := db.GlobalRedis.BuildNamespaceKey(ns, "pri4-math")
		if !strings.HasPrefix(key, prefix) {
			t.Fatalf("Expected Redis key '%s' to start with '%s'", key, prefix)
		}
		if err := db.GlobalRedis.Set(ctx, key, "isolated-val", 60); err != nil {
			t.Fatalf("Failed to write to Redis namespace %s: %v", ns, err)
		}
		got, ok := db.GlobalRedis.Get(ctx, key)
		if !ok || got != "isolated-val" {
			t.Fatalf("Expected isolated value from %s, got '%s'", key, got)
		}
	}
}

// §17.5 & §17.6: Complete 14-Step End-to-End Primary 4 -> Mathematics -> First Term Offline & Sync Verification
func TestEndToEndPrimary4MathematicsFirstTermScenario(t *testing.T) {
	r := setupOfflineTestRouter()

	// Step 1-4: Select Primary 4 -> Mathematics -> First Term and download package
	reqPkg, _ := http.NewRequest("GET", "/api/content/packages/pkg-nerdc-pri4-math-t1", nil)
	wPkg := httptest.NewRecorder()
	r.ServeHTTP(wPkg, reqPkg)

	if wPkg.Code != http.StatusOK {
		t.Fatalf("Failed to download Primary 4 Mathematics First Term package: %d", wPkg.Code)
	}

	var pkgResp struct {
		Package PackageEntry `json:"package"`
	}
	if err := json.Unmarshal(wPkg.Body.Bytes(), &pkgResp); err != nil {
		t.Fatalf("Failed to unmarshal package payload: %v", err)
	}

	if len(pkgResp.Package.Lessons) < 2 {
		t.Fatalf("Expected at least 2 portable Markdown lessons in Primary 4 Math First Term, got %d", len(pkgResp.Package.Lessons))
	}

	week1 := pkgResp.Package.Lessons[0]
	if week1.ContentID != "nerdc-pri4-math-t1-w01" {
		t.Fatalf("Unexpected Week 1 content_id: %s", week1.ContentID)
	}
	// Verify portable Markdown content and resolved Cloudinary asset URLs are included for offline caching
	if !strings.Contains(week1.MarkdownContent, "asset://cld-pri4-math-place-value-chart") {
		t.Fatalf("Expected Week 1 Markdown to contain portable asset:// identifier")
	}
	if !strings.Contains(week1.ResolvedMarkdown, "https://res.cloudinary.com/") {
		t.Fatalf("Expected ResolvedMarkdown to resolve asset:// identifier to Cloudinary delivery URL")
	}

	// Step 5-9: Student studies offline, completes Week 1 lesson & submits offline quiz attempt, then reconnects
	syncPayload := map[string]interface{}{
		"student_id": "student-pri4-chidinma",
		"device_id":  "web-pwa-indexeddb",
		"operations": []map[string]interface{}{
			{
				"operation_id":     "op-e2e-quiz-pri4-math-w01-001",
				"operation_type":   "QUIZ_ATTEMPT",
				"entity_id":        "quiz-nerdc-pri4-math-t1-w01",
				"client_timestamp": 1732590000000,
				"payload": map[string]interface{}{
					"score":     100,
					"max_score": 100,
					"answers":   map[string]int{"q1": 1, "q2": 1, "q3": 1},
				},
			},
			{
				"operation_id":     "op-e2e-prog-pri4-math-w01-001",
				"operation_type":   "LESSON_PROGRESS",
				"entity_id":        "nerdc-pri4-math-t1-w01",
				"client_timestamp": 1732590005000,
				"payload": map[string]interface{}{
					"completion_pct": 100,
					"completed":      true,
				},
			},
		},
	}

	syncBytes, _ := json.Marshal(syncPayload)
	reqSync, _ := http.NewRequest("POST", "/api/sync/push", bytes.NewReader(syncBytes))
	reqSync.Header.Set("Content-Type", "application/json")
	wSync := httptest.NewRecorder()
	r.ServeHTTP(wSync, reqSync)

	if wSync.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK on /api/sync/push, got %d: %s", wSync.Code, wSync.Body.String())
	}

	// Verify idempotency: re-sending the exact same operation_id must return DUPLICATE_IGNORED without duplicating records
	reqDup, _ := http.NewRequest("POST", "/api/sync/push", bytes.NewReader(syncBytes))
	reqDup.Header.Set("Content-Type", "application/json")
	wDup := httptest.NewRecorder()
	r.ServeHTTP(wDup, reqDup)
	if !strings.Contains(wDup.Body.String(), "DUPLICATE_IGNORED") {
		t.Fatalf("Expected idempotent retry to return DUPLICATE_IGNORED, got: %s", wDup.Body.String())
	}

	// Verify conflict resolution: sending an older timestamp with lower completion_pct (30%) must NOT downgrade 100% mastery
	stalePayload := map[string]interface{}{
		"student_id": "student-pri4-chidinma",
		"device_id":  "mobile-sqlite-old",
		"operations": []map[string]interface{}{
			{
				"operation_id":     "op-e2e-prog-pri4-math-w01-stale",
				"operation_type":   "LESSON_PROGRESS",
				"entity_id":        "nerdc-pri4-math-t1-w01",
				"client_timestamp": 1732580000000, // older timestamp
				"payload": map[string]interface{}{
					"completion_pct": 30,
					"completed":      false,
				},
			},
		},
	}
	staleBytes, _ := json.Marshal(stalePayload)
	reqStale, _ := http.NewRequest("POST", "/api/sync/push", bytes.NewReader(staleBytes))
	reqStale.Header.Set("Content-Type", "application/json")
	wStale := httptest.NewRecorder()
	r.ServeHTTP(wStale, reqStale)

	if !strings.Contains(wStale.Body.String(), "CONFLICT_RESOLVED_NEWER_EXISTS") {
		t.Fatalf("Expected stale progress update to return CONFLICT_RESOLVED_NEWER_EXISTS, got: %s", wStale.Body.String())
	}

	// Step 10-12: Verify synchronized status on the backend
	reqStatus, _ := http.NewRequest("GET", "/api/sync/status?student_id=student-pri4-chidinma", nil)
	wStatus := httptest.NewRecorder()
	r.ServeHTTP(wStatus, reqStatus)

	if wStatus.Code != http.StatusOK || !strings.Contains(wStatus.Body.String(), "quiz-nerdc-pri4-math-t1-w01") {
		t.Fatalf("Expected synchronized quiz attempt in /api/sync/status, got: %s", wStatus.Body.String())
	}

	// Step 13-14: Publish a new version (v2) of Week 1 lesson and confirm incremental version bump in manifest
	publishUpdate := map[string]interface{}{
		"content_id":    "nerdc-pri4-math-t1-w01",
		"class_code":    "primary-4",
		"subject_id":    "mathematics",
		"term":          "first-term",
		"week":          1,
		"topic":         "Whole Numbers",
		"subtopic":      "Counting, Reading, and Place Value up to 1,000,000 (Revised v2)",
		"markdown_body": "---\ncurriculum: NERDC\ncontent_id: nerdc-pri4-math-t1-w01\n---\n# Week 1 (v2): Whole Numbers up to One Million\n\nAdded Naira Budget bonus exercise!\n\n![Seven-Column Nigerian Place Value Abacus](asset://cld-math-pri4-place-value-abacus)",
		"assets":        []string{"asset://cld-math-pri4-place-value-abacus"},
		"youtube_id":    "dQw4w9WgXcQ",
	}
	pubBytes, _ := json.Marshal(publishUpdate)
	reqPub, _ := http.NewRequest("POST", "/api/content/publish", bytes.NewReader(pubBytes))
	reqPub.Header.Set("Content-Type", "application/json")
	wPub := httptest.NewRecorder()
	r.ServeHTTP(wPub, reqPub)

	if wPub.Code != http.StatusCreated {
		t.Fatalf("Expected 201 Created when publishing v2 lesson update, got %d: %s", wPub.Code, wPub.Body.String())
	}

	// Verify manifest now reports incremented lesson version (v2) and package version (v3)
	reqManifestAfter, _ := http.NewRequest("GET", "/api/content/manifests?class_code=primary-4&subject_id=mathematics&term=first-term", nil)
	wManifestAfter := httptest.NewRecorder()
	r.ServeHTTP(wManifestAfter, reqManifestAfter)

	var afterResp struct {
		Packages []PackageEntry `json:"packages"`
	}
	_ = json.Unmarshal(wManifestAfter.Body.Bytes(), &afterResp)
	if len(afterResp.Packages) == 0 || afterResp.Packages[0].Lessons[0].Version < 2 {
		t.Fatalf("Expected incremental version bump to v2 for nerdc-pri4-math-t1-w01 after publish")
	}
}

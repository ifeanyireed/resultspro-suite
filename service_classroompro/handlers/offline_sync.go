package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_classroompro/db"
	"service_classroompro/models"
)

// NERDCManifestFile represents the top-level content-manifests/nerdc-manifest.json schema
type NERDCManifestFile struct {
	ManifestVersion     string                    `json:"manifest_version"`
	GeneratedAt         string                    `json:"generated_at"`
	Curriculum          string                    `json:"curriculum"`
	CloudinaryDelivery  map[string]string         `json:"cloudinary_delivery"`
	AssetRegistry       map[string]AssetMetaEntry `json:"asset_registry"`
	Packages            []PackageEntry            `json:"packages"`
}

type AssetMetaEntry struct {
	PublicID    string `json:"public_id"`
	DeliveryURL string `json:"delivery_url"`
	ThumbnailURL string `json:"thumbnail_url"`
	Format      string `json:"format"`
	Alt         string `json:"alt"`
	SizeBytes   int64  `json:"size_bytes"`
}

type PackageEntry struct {
	PackageID      string              `json:"package_id"`
	Curriculum     string              `json:"curriculum"`
	EducationLevel string              `json:"education_level"`
	ClassCode      string              `json:"class_code"`
	ClassLabel     string              `json:"class_label"`
	SubjectID      string              `json:"subject_id"`
	SubjectName    string              `json:"subject_name"`
	Term           string              `json:"term"`
	TermLabel      string              `json:"term_label"`
	PackageVersion int                 `json:"package_version"`
	SizeBytes      int64               `json:"size_bytes"`
	ChecksumSHA256 string              `json:"checksum_sha256"`
	UpdatedAt      string              `json:"updated_at"`
	Lessons        []LessonEntry       `json:"lessons"`
	Quizzes        []OfflineQuizEntry  `json:"quizzes"`
	Flashcards     []OfflineCardEntry  `json:"flashcards"`
}

type LessonEntry struct {
	ContentID       string            `json:"content_id"`
	Week            int               `json:"week"`
	Topic           string            `json:"topic"`
	Subtopic        string            `json:"subtopic"`
	Version         int               `json:"version"`
	Status          string            `json:"status"`
	Path            string            `json:"path"`
	ChecksumSHA256  string            `json:"checksum_sha256"`
	Assets          []string          `json:"assets"`
	ResolvedAssets  map[string]string `json:"resolved_assets,omitempty"`
	YoutubeID       string            `json:"youtube_id"`
	YoutubeURL      string            `json:"youtube_url"`
	EstimatedMin    int               `json:"estimated_minutes"`
	MarkdownContent string            `json:"markdown_content,omitempty"`
	ResolvedMarkdown string           `json:"resolved_markdown,omitempty"`
}

type OfflineQuizEntry struct {
	ID          string                   `json:"id"`
	TopicID     string                   `json:"topic_id"`
	Title       string                   `json:"title"`
	DurationMin int                      `json:"duration_min"`
	Questions   []map[string]interface{} `json:"questions"`
}

type OfflineCardEntry struct {
	ID      string `json:"id"`
	TopicID string `json:"topic_id"`
	Front   string `json:"front"`
	Back    string `json:"back"`
	Hint    string `json:"hint"`
}

// In-memory state fallback for tests & environments without active PostgreSQL DSN
var (
	offlineMu           sync.RWMutex
	publishedVersions   = make(map[string][]models.LessonVersion)
	syncedOperations    = make(map[string]models.OfflineSyncOperation)
	studentProgressMem  = make(map[string]models.StudentLessonProgress)
	quizAttemptsMem     = make([]models.QuizAttempt, 0)
	assetSchemeRegex    = regexp.MustCompile(`asset://[a-zA-Z0-9_-]+`)
)

// resolveClassroomContentDir finds the portable classroom-content/ directory relative to working directory
func resolveClassroomContentDir() string {
	candidates := []string{
		"../classroom-content",
		"../../classroom-content",
		"./classroom-content",
		"/Volumes/ReedBreedCC/resultspro-suite/classroom-content",
	}
	for _, c := range candidates {
		if info, err := os.Stat(c); err == nil && info.IsDir() {
			return c
		}
	}
	return "../classroom-content"
}

func loadNERDCManifest() (*NERDCManifestFile, error) {
	baseDir := resolveClassroomContentDir()
	manifestPath := filepath.Join(baseDir, "content-manifests", "nerdc-manifest.json")
	raw, err := os.ReadFile(manifestPath)
	if err != nil {
		return nil, err
	}
	var m NERDCManifestFile
	if err := json.Unmarshal(raw, &m); err != nil {
		return nil, err
	}

	// Merge any runtime-published version overrides so incremental update checks immediately see bumped versions
	offlineMu.RLock()
	defer offlineMu.RUnlock()
	for pIdx := range m.Packages {
		pkg := &m.Packages[pIdx]
		maxVerDelta := 0
		for lIdx := range pkg.Lessons {
			lesson := &pkg.Lessons[lIdx]
			if versions, ok := publishedVersions[lesson.ContentID]; ok && len(versions) > 0 {
				latest := versions[len(versions)-1]
				if latest.Version > lesson.Version {
					maxVerDelta += (latest.Version - lesson.Version)
					lesson.Version = latest.Version
					lesson.ChecksumSHA256 = latest.ChecksumSHA256
				}
			}
		}
		if maxVerDelta > 0 {
			pkg.PackageVersion += maxVerDelta
		}
	}

	return &m, nil
}

// GetContentManifests serves the NERDC curriculum package manifests for selective offline download
// Route: GET /api/content/manifests
func (h *Handler) GetContentManifests(c *gin.Context) {
	classFilter := strings.TrimSpace(c.Query("class_code"))
	subjectFilter := strings.TrimSpace(c.Query("subject_id"))
	termFilter := strings.TrimSpace(c.Query("term"))

	cacheKey := ""
	if db.GlobalRedis != nil {
		cacheKey = db.GlobalRedis.BuildNamespaceKey("curriculum", fmt.Sprintf("manifests:%s:%s:%s", classFilter, subjectFilter, termFilter))
		var cached gin.H
		if db.GlobalRedis.GetJSON(c.Request.Context(), cacheKey, &cached) {
			c.JSON(http.StatusOK, cached)
			return
		}
	}

	manifest, err := loadNERDCManifest()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load NERDC content manifest: " + err.Error()})
		return
	}

	filtered := make([]PackageEntry, 0, len(manifest.Packages))
	seenPkg := make(map[string]bool)
	for _, pkg := range manifest.Packages {
		if classFilter != "" && !strings.EqualFold(pkg.ClassCode, classFilter) {
			continue
		}
		if subjectFilter != "" && !strings.EqualFold(pkg.SubjectID, subjectFilter) {
			continue
		}
		if termFilter != "" && !strings.EqualFold(pkg.Term, termFilter) {
			continue
		}
		seenPkg[pkg.PackageID] = true
		filtered = append(filtered, pkg)
	}

	// Merge any creator-published Study Packs from studyPacksStore into /api/content/manifests
	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	for packID, bundle := range studyPackBundles {
		if seenPkg[packID] {
			continue
		}
		if classFilter != "" && !strings.EqualFold(bundle.ClassCode, classFilter) {
			continue
		}
		if subjectFilter != "" && !strings.EqualFold(bundle.SubjectID, subjectFilter) {
			continue
		}
		if termFilter != "" && !strings.EqualFold(bundle.Term, termFilter) {
			continue
		}
		filtered = append(filtered, PackageEntry{
			PackageID:      bundle.PackID,
			Curriculum:     bundle.Curriculum,
			EducationLevel: bundle.EducationLevel,
			ClassCode:      bundle.ClassCode,
			ClassLabel:     bundle.ClassLabel,
			SubjectID:      bundle.SubjectID,
			SubjectName:    bundle.SubjectName,
			Term:           bundle.Term,
			TermLabel:      bundle.TermLabel,
			PackageVersion: bundle.PackVersion,
			SizeBytes:      bundle.SizeBytes,
			ChecksumSHA256: bundle.ChecksumSHA256,
			UpdatedAt:      bundle.UpdatedAt,
			Lessons:        bundle.Lessons,
			Quizzes:        bundle.Quizzes,
			Flashcards:     bundle.Flashcards,
		})
	}
	packsMu.RUnlock()

	studentID := resolveCurrentStudentID(c)
	revokedPackIDs := GetRevokedPackIDsForStudent(studentID)

	resp := gin.H{
		"manifest_version":    manifest.ManifestVersion,
		"curriculum":          manifest.Curriculum,
		"generated_at":        manifest.GeneratedAt,
		"cloudinary_delivery": manifest.CloudinaryDelivery,
		"asset_registry":      manifest.AssetRegistry,
		"packages":            filtered,
		"revoked_pack_ids":    revokedPackIDs,
	}

	if db.GlobalRedis != nil && cacheKey != "" {
		_ = db.GlobalRedis.SetJSON(c.Request.Context(), cacheKey, resp, 300)
	}

	c.JSON(http.StatusOK, resp)
}

// GetContentPackage serves a full offline curriculum package (Markdown lessons, resolved Cloudinary URLs, quizzes, flashcards, videos, exams, badges, and linked YouTube video IDs)
// Route: GET /api/content/packages/:packageId
func (h *Handler) GetContentPackage(c *gin.Context) {
	packageID := strings.TrimSpace(c.Param("packageId"))
	EnsureSampleStudyPacksSeeded()

	// 1. Check if packageId is a Study Pack in studyPacksStore (with CanAccessPack entitlement gate)
	studentID := resolveCurrentStudentID(c)
	packsMu.RLock()
	studyPack, isStudyPack := studyPacksStore[packageID]
	studyBundle, hasBundle := studyPackBundles[packageID]
	packsMu.RUnlock()

	if isStudyPack && hasBundle {
		allowed, reason, _ := CanAccessPack(studentID, studyPack)
		if !allowed {
			c.JSON(http.StatusForbidden, gin.H{
				"error":         "Study pack access denied: " + reason,
				"access_reason": reason,
				"pack_id":       packageID,
			})
			return
		}
		// Resolve asset:// references inside studyBundle lessons and merge any runtime-published version overrides
		manifest, _ := loadNERDCManifest()
		offlineMu.RLock()
		for i := range studyBundle.Lessons {
			lesson := &studyBundle.Lessons[i]
			if versions, ok := publishedVersions[lesson.ContentID]; ok && len(versions) > 0 {
				latest := versions[len(versions)-1]
				if latest.MarkdownBody != "" {
					lesson.MarkdownContent = latest.MarkdownBody
				}
				if latest.Version > lesson.Version {
					studyBundle.PackVersion += (latest.Version - lesson.Version)
					studyBundle.PackageVersion = studyBundle.PackVersion
					lesson.Version = latest.Version
				}
				lesson.ChecksumSHA256 = latest.ChecksumSHA256
			}
		}
		offlineMu.RUnlock()

		for i := range studyBundle.Lessons {
			lesson := &studyBundle.Lessons[i]
			resolvedMap := make(map[string]string)
			resolvedMd := lesson.MarkdownContent
			if manifest != nil {
				for _, assetRef := range lesson.Assets {
					if meta, ok := manifest.AssetRegistry[assetRef]; ok {
						resolvedMap[assetRef] = meta.DeliveryURL
						resolvedMd = strings.ReplaceAll(resolvedMd, assetRef, meta.DeliveryURL)
					}
				}
			}
			lesson.ResolvedAssets = resolvedMap
			lesson.ResolvedMarkdown = resolvedMd
		}
		var reg map[string]AssetMetaEntry
		if manifest != nil {
			reg = manifest.AssetRegistry
		}
		c.JSON(http.StatusOK, gin.H{
			"package":        studyBundle,
			"asset_registry": reg,
			"downloaded_at":  time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	manifest, err := loadNERDCManifest()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load manifest"})
		return
	}

	baseDir := resolveClassroomContentDir()
	var targetPkg *PackageEntry
	for i := range manifest.Packages {
		if manifest.Packages[i].PackageID == packageID {
			cp := manifest.Packages[i]
			targetPkg = &cp
			break
		}
	}

	if targetPkg == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Content package not found: " + packageID})
		return
	}

	// Hydrate each lesson's portable Markdown content from disk (or runtime published version) and resolve asset:// references
	for i := range targetPkg.Lessons {
		lesson := &targetPkg.Lessons[i]
		mdPath := filepath.Join(baseDir, filepath.FromSlash(lesson.Path))
		rawBytes, readErr := os.ReadFile(mdPath)
		mdText := ""
		if readErr == nil {
			mdText = string(rawBytes)
		}

		// Check if there is a newer published version in memory or DB
		offlineMu.RLock()
		if versions, ok := publishedVersions[lesson.ContentID]; ok && len(versions) > 0 {
			latest := versions[len(versions)-1]
			if latest.MarkdownBody != "" {
				mdText = latest.MarkdownBody
			}
			lesson.Version = latest.Version
			lesson.ChecksumSHA256 = latest.ChecksumSHA256
		}
		offlineMu.RUnlock()

		lesson.MarkdownContent = mdText
		resolvedMap := make(map[string]string)
		resolvedMd := mdText
		for _, assetRef := range lesson.Assets {
			if meta, ok := manifest.AssetRegistry[assetRef]; ok {
				resolvedMap[assetRef] = meta.DeliveryURL
				resolvedMd = strings.ReplaceAll(resolvedMd, assetRef, meta.DeliveryURL)
			}
		}
		lesson.ResolvedAssets = resolvedMap
		lesson.ResolvedMarkdown = resolvedMd
	}

	// Cache package payload in Redis under classroom:lessons:{packageId}
	if db.GlobalRedis != nil {
		nsKey := db.GlobalRedis.BuildNamespaceKey("lessons", "package:"+packageID)
		_ = db.GlobalRedis.SetJSON(c.Request.Context(), nsKey, targetPkg, 300)
	}

	c.JSON(http.StatusOK, gin.H{
		"package":        targetPkg,
		"asset_registry": manifest.AssetRegistry,
		"downloaded_at":  time.Now().UTC().Format(time.RFC3339),
	})
}

// PublishLessonContent validates portable Markdown frontmatter, resolves asset:// Cloudinary references, increments version, and publishes
// Route: POST /api/content/publish
func (h *Handler) PublishLessonContent(c *gin.Context) {
	var input struct {
		ContentID    string   `json:"content_id" binding:"required"`
		Curriculum   string   `json:"curriculum"`
		ClassCode    string   `json:"class_code" binding:"required"`
		SubjectID    string   `json:"subject_id" binding:"required"`
		Term         string   `json:"term" binding:"required"`
		Week         int      `json:"week" binding:"required"`
		Topic        string   `json:"topic" binding:"required"`
		Subtopic     string   `json:"subtopic"`
		MarkdownBody string   `json:"markdown_body" binding:"required"`
		Assets       []string `json:"assets"`
		YoutubeID    string   `json:"youtube_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid publication payload: " + err.Error()})
		return
	}

	// 1. Validate portable Markdown structure (must contain YAML frontmatter "---" and at least one heading)
	trimmed := strings.TrimSpace(input.MarkdownBody)
	if !strings.HasPrefix(trimmed, "---") || !strings.Contains(trimmed, "# ") {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": "Markdown validation failed: lesson must include YAML frontmatter (---) and a top-level Markdown heading (# ).",
		})
		return
	}

	// 2. Enforce linked YouTube video rule: forbid raw video file paths (.mp4, .mov, .webm)
	lowerBody := strings.ToLower(trimmed)
	if strings.Contains(lowerBody, ".mp4") || strings.Contains(lowerBody, ".mov") || strings.Contains(lowerBody, ".webm") {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": "Video policy violation: raw video uploads (.mp4/.mov/.webm) are prohibited. Use linked YouTube video IDs only.",
		})
		return
	}

	// 3. Validate all asset:// references in Markdown body against the AssetRegistry or valid asset://cld-* scheme
	manifest, _ := loadNERDCManifest()
	foundAssets := assetSchemeRegex.FindAllString(trimmed, -1)
	allAssets := append([]string{}, input.Assets...)
	for _, fa := range foundAssets {
		exists := false
		for _, a := range allAssets {
			if a == fa {
				exists = true
				break
			}
		}
		if !exists {
			allAssets = append(allAssets, fa)
		}
	}

	for _, assetRef := range allAssets {
		if !strings.HasPrefix(assetRef, "asset://cld-") {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"error": fmt.Sprintf("Invalid asset reference '%s': must use portable Cloudinary identifier format 'asset://cld-*'", assetRef),
			})
			return
		}
		if manifest != nil {
			if _, ok := manifest.AssetRegistry[assetRef]; !ok && !strings.HasPrefix(assetRef, "asset://cld-custom-") {
				c.JSON(http.StatusUnprocessableEntity, gin.H{
					"error": fmt.Sprintf("Unregistered Cloudinary asset identifier '%s' not found in asset registry", assetRef),
				})
				return
			}
		}
	}

	// 4. Determine next version number
	nextVersion := 1
	if manifest != nil {
		for _, pkg := range manifest.Packages {
			for _, l := range pkg.Lessons {
				if l.ContentID == input.ContentID && l.Version >= nextVersion {
					nextVersion = l.Version + 1
				}
			}
		}
	}

	offlineMu.Lock()
	if existing, ok := publishedVersions[input.ContentID]; ok && len(existing) > 0 {
		lastVer := existing[len(existing)-1].Version
		if lastVer >= nextVersion {
			nextVersion = lastVer + 1
		}
	}

	hash := sha256.Sum256([]byte(trimmed))
	checksum := "sha256:" + hex.EncodeToString(hash[:16])
	assetsBytes, _ := json.Marshal(allAssets)

	curriculum := input.Curriculum
	if curriculum == "" {
		curriculum = "NERDC"
	}

	publisher := "teacher-demo-1"
	if uid, ok := c.Get("user_id"); ok {
		if s, ok := uid.(string); ok && s != "" {
			publisher = s
		}
	}

	lv := models.LessonVersion{
		ID:             uuid.New().String(),
		ContentID:      input.ContentID,
		Curriculum:     curriculum,
		ClassCode:      input.ClassCode,
		SubjectID:      input.SubjectID,
		Term:           input.Term,
		Week:           input.Week,
		Topic:          input.Topic,
		Subtopic:       input.Subtopic,
		Version:        nextVersion,
		Status:         "published",
		MarkdownBody:   trimmed,
		ChecksumSHA256: checksum,
		AssetsJSON:     string(assetsBytes),
		YoutubeID:      input.YoutubeID,
		PublishedBy:    publisher,
		PublishedAt:    time.Now().UTC(),
	}

	publishedVersions[input.ContentID] = append(publishedVersions[input.ContentID], lv)
	offlineMu.Unlock()

	if db.DB != nil {
		_ = db.DB.Create(&lv).Error
	}

	// Invalidate Redis curriculum and lesson caches
	if db.GlobalRedis != nil {
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildNamespaceKey("curriculum", "manifests:::"))
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildNamespaceKey("curriculum", fmt.Sprintf("manifests:%s:%s:%s", input.ClassCode, input.SubjectID, input.Term)))
		_ = db.GlobalRedis.Delete(c.Request.Context(), db.GlobalRedis.BuildNamespaceKey("curriculum", fmt.Sprintf("manifests:%s::", input.ClassCode)))
		_ = db.GlobalRedis.SetJSON(c.Request.Context(), db.GlobalRedis.BuildNamespaceKey("lessons", input.ContentID), lv, 600)
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":        "Lesson content validated and published",
		"lesson_version": lv,
	})
}

// GetLessonVersions returns the publication history for a stable content_id
// Route: GET /api/content/versions/:contentId
func (h *Handler) GetLessonVersions(c *gin.Context) {
	contentID := strings.TrimSpace(c.Param("contentId"))
	offlineMu.RLock()
	history := append([]models.LessonVersion{}, publishedVersions[contentID]...)
	offlineMu.RUnlock()

	if len(history) == 0 {
		// Seed initial version from NERDC manifest if present
		if manifest, err := loadNERDCManifest(); err == nil {
			for _, pkg := range manifest.Packages {
				for _, l := range pkg.Lessons {
					if l.ContentID == contentID {
						assetsJSON, _ := json.Marshal(l.Assets)
						history = append(history, models.LessonVersion{
							ID:             "ver-init-" + contentID,
							ContentID:      l.ContentID,
							Curriculum:     pkg.Curriculum,
							ClassCode:      pkg.ClassCode,
							SubjectID:      pkg.SubjectID,
							Term:           pkg.Term,
							Week:           l.Week,
							Topic:          l.Topic,
							Subtopic:       l.Subtopic,
							Version:        l.Version,
							Status:         l.Status,
							MarkdownPath:   l.Path,
							ChecksumSHA256: l.ChecksumSHA256,
							AssetsJSON:     string(assetsJSON),
							YoutubeID:      l.YoutubeID,
							PublishedBy:    "system-nerdc",
							PublishedAt:    time.Now().Add(-24 * time.Hour).UTC(),
						})
					}
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"content_id": contentID,
		"versions":   history,
	})
}

// SyncOperationInput represents a single offline student operation queued in IndexedDB / SQLite
type SyncOperationInput struct {
	OperationID     string                 `json:"operation_id" binding:"required"`
	OperationType   string                 `json:"operation_type" binding:"required"` // QUIZ_ATTEMPT, LESSON_PROGRESS, BOOKMARK
	EntityID        string                 `json:"entity_id" binding:"required"`
	ClientTimestamp int64                  `json:"client_timestamp" binding:"required"`
	Payload         map[string]interface{} `json:"payload" binding:"required"`
}

// PushOfflineSync processes a batch of offline student operations idempotently with timestamp conflict resolution
// Route: POST /api/sync/push
func (h *Handler) PushOfflineSync(c *gin.Context) {
	var req struct {
		StudentID  string               `json:"student_id"`
		DeviceID   string               `json:"device_id"`
		Operations []SyncOperationInput `json:"operations" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sync payload: " + err.Error()})
		return
	}

	studentID := strings.TrimSpace(req.StudentID)
	if studentID == "" {
		if uid, ok := c.Get("user_id"); ok {
			if s, ok := uid.(string); ok && s != "" {
				studentID = s
			}
		}
	}
	if studentID == "" {
		studentID = "student-demo-1"
	}

	tenantID := "global"
	if tid, ok := c.Get("tenant_id"); ok {
		if s, ok := tid.(string); ok && s != "" {
			tenantID = s
		}
	}

	type OpResult struct {
		OperationID string `json:"operation_id"`
		Status      string `json:"status"` // SYNCHRONIZED, DUPLICATE_IGNORED, CONFLICT_RESOLVED_NEWER_EXISTS
		EntityID    string `json:"entity_id"`
		Message     string `json:"message"`
	}

	results := make([]OpResult, 0, len(req.Operations))

	offlineMu.Lock()
	defer offlineMu.Unlock()

	for _, op := range req.Operations {
		// 1. Idempotency check: has this operation_id already been processed?
		if existing, exists := syncedOperations[op.OperationID]; exists {
			results = append(results, OpResult{
				OperationID: op.OperationID,
				Status:      "DUPLICATE_IGNORED",
				EntityID:    existing.EntityID,
				Message:     "Operation already synchronized previously; idempotent acknowledgment returned",
			})
			continue
		}

		if db.DB != nil {
			var dbExisting models.OfflineSyncOperation
			if err := db.DB.Where("operation_id = ?", op.OperationID).First(&dbExisting).Error; err == nil && dbExisting.OperationID != "" {
				syncedOperations[op.OperationID] = dbExisting
				results = append(results, OpResult{
					OperationID: op.OperationID,
					Status:      "DUPLICATE_IGNORED",
					EntityID:    dbExisting.EntityID,
					Message:     "Operation already synchronized in DB; idempotent acknowledgment returned",
				})
				continue
			}
		}

		payloadBytes, _ := json.Marshal(op.Payload)
		opStatus := "SYNCHRONIZED"
		opMessage := "Operation synchronized and persisted"

		switch strings.ToUpper(op.OperationType) {
		case "QUIZ_ATTEMPT", "EXAM_ATTEMPT":
			score, _ := toFloat64(op.Payload["score"])
			maxScore, _ := toFloat64(op.Payload["max_score"])
			if maxScore <= 0 {
				maxScore = 100
			}
			answersBytes, _ := json.Marshal(op.Payload["answers"])
			attempt := models.QuizAttempt{
				ID:        op.OperationID,
				TenantID:  tenantID,
				QuizID:    op.EntityID,
				StudentID: studentID,
				Score:     score,
				MaxScore:  maxScore,
				Answers:   string(answersBytes),
				CreatedAt: time.UnixMilli(op.ClientTimestamp).UTC(),
			}
			quizAttemptsMem = append(quizAttemptsMem, attempt)
			if db.DB != nil {
				_ = db.DB.Create(&attempt).Error
			}

		case "BADGE_EARNED":
			packID, _ := op.Payload["pack_id"].(string)
			xpAwarded := int(toFloat64Default(op.Payload["xp_awarded"], 250))
			packsMu.Lock()
			existingBadges := studentBadgesMem[studentID]
			alreadyEarned := false
			for _, eb := range existingBadges {
				if eb.BadgeID == op.EntityID {
					alreadyEarned = true
					break
				}
			}
			if !alreadyEarned {
				newBadge := models.StudentPackBadge{
					ID:            op.OperationID,
					StudentID:     studentID,
					PackID:        packID,
					BadgeID:       op.EntityID,
					XPAwarded:     xpAwarded,
					EarnedOffline: true,
					AwardedAt:     time.UnixMilli(op.ClientTimestamp).UTC(),
				}
				studentBadgesMem[studentID] = append(existingBadges, newBadge)
				if db.DB != nil {
					_ = db.DB.Save(&newBadge).Error
				}
			}
			packsMu.Unlock()

		case "LESSON_PROGRESS":
			progressKey := studentID + ":" + op.EntityID
			completionPct := int(toFloat64Default(op.Payload["completion_pct"], 100))
			completed, _ := op.Payload["completed"].(bool)
			if completionPct >= 100 {
				completed = true
			}

			// Conflict resolution: never allow an older offline event or lower completion percentage to overwrite higher mastery
			if current, exists := studentProgressMem[progressKey]; exists {
				if op.ClientTimestamp < current.ClientTimestamp {
					opStatus = "CONFLICT_RESOLVED_NEWER_EXISTS"
					opMessage = "Server holds a newer progress timestamp; preserved highest mastery state"
				} else {
					if current.CompletionPct > completionPct {
						completionPct = current.CompletionPct
					}
					if current.Completed {
						completed = true
					}
					current.CompletionPct = completionPct
					current.Completed = completed
					current.ClientTimestamp = op.ClientTimestamp
					current.UpdatedAt = time.Now().UTC()
					studentProgressMem[progressKey] = current
				}
			} else {
				prog := models.StudentLessonProgress{
					ID:              uuid.New().String(),
					TenantID:        tenantID,
					StudentID:       studentID,
					ContentID:       op.EntityID,
					CompletionPct:   completionPct,
					Completed:       completed,
					ClientTimestamp: op.ClientTimestamp,
					UpdatedAt:       time.Now().UTC(),
				}
				studentProgressMem[progressKey] = prog
				if db.DB != nil {
					_ = db.DB.Save(&prog).Error
				}
			}

		case "BOOKMARK":
			title, _ := op.Payload["title"].(string)
			itemType, _ := op.Payload["item_type"].(string)
			if itemType == "" {
				itemType = "NOTE"
			}
			bm := models.Bookmark{
				ID:        op.OperationID,
				TenantID:  tenantID,
				UserID:    studentID,
				ItemType:  itemType,
				ItemID:    op.EntityID,
				Title:     title,
				CreatedAt: time.UnixMilli(op.ClientTimestamp).UTC(),
			}
			if db.DB != nil {
				_ = db.DB.Save(&bm).Error
			}
		}

		record := models.OfflineSyncOperation{
			OperationID:     op.OperationID,
			TenantID:        tenantID,
			StudentID:       studentID,
			OperationType:   strings.ToUpper(op.OperationType),
			EntityID:        op.EntityID,
			PayloadJSON:     string(payloadBytes),
			ClientTimestamp: op.ClientTimestamp,
			Status:          opStatus,
			SyncedAt:        time.Now().UTC(),
		}
		syncedOperations[op.OperationID] = record
		if db.DB != nil {
			_ = db.DB.Create(&record).Error
		}

		results = append(results, OpResult{
			OperationID: op.OperationID,
			Status:      opStatus,
			EntityID:    op.EntityID,
			Message:     opMessage,
		})
	}

	// Update Redis sync checkpoint under classroom:sync:{studentID}
	checkpoint := gin.H{
		"student_id":       studentID,
		"last_synced_at":   time.Now().UTC().Format(time.RFC3339),
		"processed_count":  len(results),
		"results":          results,
	}
	if db.GlobalRedis != nil {
		syncKey := db.GlobalRedis.BuildNamespaceKey("sync", "checkpoint:"+studentID)
		_ = db.GlobalRedis.SetJSON(c.Request.Context(), syncKey, checkpoint, 3600)
	}

	c.JSON(http.StatusOK, checkpoint)
}

// GetOfflineSyncStatus returns the student's synchronized quiz attempts, lesson progress, and sync operation history
// Route: GET /api/sync/status
func (h *Handler) GetOfflineSyncStatus(c *gin.Context) {
	studentID := strings.TrimSpace(c.Query("student_id"))
	if studentID == "" {
		if uid, ok := c.Get("user_id"); ok {
			if s, ok := uid.(string); ok && s != "" {
				studentID = s
			}
		}
	}
	if studentID == "" {
		studentID = "student-demo-1"
	}

	offlineMu.RLock()
	ops := make([]models.OfflineSyncOperation, 0)
	for _, op := range syncedOperations {
		if op.StudentID == studentID {
			ops = append(ops, op)
		}
	}
	progressList := make([]models.StudentLessonProgress, 0)
	for _, prog := range studentProgressMem {
		if prog.StudentID == studentID {
			progressList = append(progressList, prog)
		}
	}
	attempts := make([]models.QuizAttempt, 0)
	for _, att := range quizAttemptsMem {
		if att.StudentID == studentID {
			attempts = append(attempts, att)
		}
	}
	offlineMu.RUnlock()

	revokedPackIDs := GetRevokedPackIDsForStudent(studentID)

	c.JSON(http.StatusOK, gin.H{
		"student_id":        studentID,
		"synced_operations": ops,
		"lesson_progress":   progressList,
		"quiz_attempts":     attempts,
		"revoked_pack_ids":  revokedPackIDs,
		"server_time":       time.Now().UTC().Format(time.RFC3339),
	})
}

func toFloat64(v interface{}) (float64, bool) {
	switch n := v.(type) {
	case float64:
		return n, true
	case float32:
		return float64(n), true
	case int:
		return float64(n), true
	case int64:
		return float64(n), true
	default:
		return 0, false
	}
}

func toFloat64Default(v interface{}, def float64) float64 {
	if f, ok := toFloat64(v); ok {
		return f
	}
	return def
}

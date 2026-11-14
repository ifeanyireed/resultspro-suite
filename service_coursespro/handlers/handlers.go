package handlers

import (
	"context"
	"log"
	"service_coursespro/db"
)

// Handler is the core struct that binds all handler methods across multiple files
type Handler struct{}

// NewHandler initializes a new Handler
func NewHandler() *Handler {
	return &Handler{}
}

// InvalidateProgramCache purges program lists and outline caches for a tenant
func (h *Handler) InvalidateProgramCache(ctx context.Context, tenantID, programID string) {
	if db.GlobalRedis == nil || tenantID == "" {
		return
	}
	// Program list and stats cache
	listKey := db.GlobalRedis.BuildKey("courses", tenantID, "programs", "list")
	_ = db.GlobalRedis.Delete(ctx, listKey)

	// Specific program outline / stages cache if programID is provided
	if programID != "" {
		detailKey := db.GlobalRedis.BuildKey("courses", tenantID, "program", programID)
		stagesKey := db.GlobalRedis.BuildKey("courses", tenantID, "program", programID+":stages")
		treeKey := db.GlobalRedis.BuildKey("courses", tenantID, "program", programID+":tree")
		_ = db.GlobalRedis.Delete(ctx, detailKey)
		_ = db.GlobalRedis.Delete(ctx, stagesKey)
		_ = db.GlobalRedis.Delete(ctx, treeKey)
	}
	log.Printf("🧹 [service_coursespro] Invalidated program cache for tenant=%s, program=%s", tenantID, programID)
}

// InvalidateCohortCache purges cohort lists, details, and metadata caches for a tenant
func (h *Handler) InvalidateCohortCache(ctx context.Context, tenantID, cohortID, slug string) {
	if db.GlobalRedis == nil || tenantID == "" {
		return
	}
	// Active cohort listings and metadata
	activeKey := db.GlobalRedis.BuildKey("courses", tenantID, "cohorts", "active")
	publicListKey := db.GlobalRedis.BuildKey("courses", tenantID, "cohorts", "public")
	adminListKey := db.GlobalRedis.BuildKey("courses", tenantID, "cohorts", "admin_list")
	statsKey := db.GlobalRedis.BuildKey("courses", tenantID, "cohorts", "stats")

	_ = db.GlobalRedis.Delete(ctx, activeKey)
	_ = db.GlobalRedis.Delete(ctx, publicListKey)
	_ = db.GlobalRedis.Delete(ctx, adminListKey)
	_ = db.GlobalRedis.Delete(ctx, statsKey)

	// Cohort specific caches (detail & curriculum tree)
	if cohortID != "" {
		detailKey := db.GlobalRedis.BuildKey("courses", tenantID, "cohort", cohortID)
		treeKey := db.GlobalRedis.BuildKey("courses", tenantID, "cohort", cohortID+":tree")
		_ = db.GlobalRedis.Delete(ctx, detailKey)
		_ = db.GlobalRedis.Delete(ctx, treeKey)
	}
	if slug != "" {
		slugKey := db.GlobalRedis.BuildKey("courses", tenantID, "cohort", slug)
		_ = db.GlobalRedis.Delete(ctx, slugKey)
	}
	log.Printf("🧹 [service_coursespro] Invalidated cohort cache for tenant=%s, cohort=%s", tenantID, cohortID)
}

package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetCohortJourney(c *gin.Context) {
	cohortID := c.Param("id")
	var stages []models.JourneyStage
	db.WithTenant(c).Where("cohort_id = ?", cohortID).Order("stage_number ASC").Find(&stages)

	var stageIDs []string
	for _, s := range stages {
		stageIDs = append(stageIDs, s.ID)
	}

	var modules []models.JourneyModule
	if len(stageIDs) > 0 {
		db.WithTenant(c).Where("stage_id IN ?", stageIDs).Order("order_index ASC").Find(&modules)
	}

	c.JSON(http.StatusOK, gin.H{"stages": stages, "modules": modules})
}

func (h *Handler) UpdateModuleProgress(c *gin.Context) {
	moduleID := c.Param("id")
	userID, _ := c.Get("user_id")

	var input struct {
		Completed        bool   `json:"completed"`
		ReflectionAnswer string `json:"reflection_answer"`
		QuizScore        int    `json:"quiz_score"`
		QuizPassed       bool   `json:"quiz_passed"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var progress models.ModuleProgress
	err := db.WithTenant(c).Where("user_id = ? AND module_id = ?", userID.(string), moduleID).First(&progress).Error

	now := time.Now()
	if err != nil {
		tenantID, _ := c.Get("tenant_id")
		progress = models.ModuleProgress{
			TenantID:         tenantID.(string),
			ID:               uuid.New().String(),
			UserID:           userID.(string),
			ModuleID:         moduleID,
			Completed:        input.Completed,
			ReflectionAnswer: input.ReflectionAnswer,
			QuizScore:        input.QuizScore,
			QuizPassed:       input.QuizPassed,
			CompletedAt:      &now,
			UpdatedAt:        now,
		}
		db.WithTenant(c).Create(&progress)
	} else {
		progress.Completed = input.Completed
		progress.ReflectionAnswer = input.ReflectionAnswer
		progress.QuizScore = input.QuizScore
		progress.QuizPassed = input.QuizPassed
		progress.UpdatedAt = now
		db.WithTenant(c).Save(&progress)
	}

	if input.Completed {
		db.WithTenant(c).Model(&models.Enrollment{}).
			Where("user_id = ?", userID.(string)).
			Update("current_xp", db.WithTenant(c).Raw("current_xp + ?", 100))
	}

	c.JSON(http.StatusOK, gin.H{"progress": progress})
}

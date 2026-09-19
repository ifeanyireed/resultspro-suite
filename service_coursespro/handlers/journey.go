package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"service_coursespro/db"
	"service_coursespro/models"
)

func (h *Handler) GetCohortJourney(c *gin.Context) {
	cohortID := c.Param("id")

	var cohort models.Cohort
	if err := db.WithTenant(c).Where("id = ?", cohortID).First(&cohort).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cohort not found"})
		return
	}

	var stages []models.JourneyStage
	if cohort.ProgramID != nil {
		db.WithTenant(c).Where("program_id = ?", *cohort.ProgramID).Order("stage_number ASC").Find(&stages)
	}

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
	tenantID, _ := c.Get("tenant_id")

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
			Update("current_xp", gorm.Expr("current_xp + ?", 100))
	}

	c.JSON(http.StatusOK, gin.H{"progress": progress})
}

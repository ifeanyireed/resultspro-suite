package handlers

import (
	"encoding/json"
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

	var progresses []models.ModuleProgress
	userID, _ := c.Get("user_id")
	if len(stageIDs) > 0 && userID != nil {
		db.WithTenant(c).Where("user_id = ? AND module_id IN ?", userID.(string), stageIDs).Find(&progresses)
	}

	var schedules map[string]interface{}
	if cohort.ModuleSchedulesJSON != "" {
		json.Unmarshal([]byte(cohort.ModuleSchedulesJSON), &schedules)
	}
	
	// Default to cohort end date if schedules not mapped for stage
	var globalEnd string
	if !cohort.EndDate.IsZero() {
		globalEnd = cohort.EndDate.Format(time.RFC3339)
	}

	c.JSON(http.StatusOK, gin.H{"stages": stages, "modules": modules, "progress": progresses, "schedules": schedules, "cohort_end_date": globalEnd})
}

func (h *Handler) UpdateModuleProgress(c *gin.Context) {
	moduleID := c.Param("id")
	userID, _ := c.Get("user_id")
	tenantID, _ := c.Get("tenant_id")

	var input struct {
		Completed        bool   `json:"completed"`
		LastActiveIndex  int    `json:"last_active_index"`
		CompletedItems   string `json:"completed_items"`
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
	wasCompleted := false
	addedXP := 0
	if err != nil {
		progress = models.ModuleProgress{
			TenantID:         tenantID.(string),
			ID:               uuid.New().String(),
			UserID:           userID.(string),
			ModuleID:         moduleID,
			Completed:        input.Completed,
			LastActiveIndex:  input.LastActiveIndex,
			CompletedItems:   input.CompletedItems,
			ReflectionAnswer: input.ReflectionAnswer,
			QuizScore:        input.QuizScore,
			QuizPassed:       input.QuizPassed,
			CompletedAt:      &now,
			UpdatedAt:        now,
		}
		if input.CompletedItems != "" && input.CompletedItems != "[]" {
			var newComp []int
			if json.Unmarshal([]byte(input.CompletedItems), &newComp) == nil {
				addedXP = len(newComp) * 10
			}
		}
		db.WithTenant(c).Create(&progress)
	} else {
		wasCompleted = progress.Completed
		
		if input.CompletedItems != "" {
			var newComp []int
			var oldComp []int
			json.Unmarshal([]byte(input.CompletedItems), &newComp)
			if progress.CompletedItems != "" {
				json.Unmarshal([]byte(progress.CompletedItems), &oldComp)
			}
			if len(newComp) > len(oldComp) {
				addedXP = (len(newComp) - len(oldComp)) * 10
			}
			progress.CompletedItems = input.CompletedItems
		}
		
		progress.Completed = input.Completed
		progress.LastActiveIndex = input.LastActiveIndex
		progress.ReflectionAnswer = input.ReflectionAnswer
		progress.QuizScore = input.QuizScore
		progress.QuizPassed = input.QuizPassed
		progress.UpdatedAt = now
		if input.Completed && !wasCompleted {
			progress.CompletedAt = &now
		}
		db.WithTenant(c).Save(&progress)
	}

	isValid := true
	var enrollment models.Enrollment
	db.WithTenant(c).Where("user_id = ?", userID.(string)).First(&enrollment)
	
	if enrollment.CohortID != "" {
		var cohort models.Cohort
		if db.WithTenant(c).Where("id = ?", enrollment.CohortID).First(&cohort).Error == nil {
			if cohort.EndDate.IsZero() == false && now.After(cohort.EndDate) {
				isValid = false
			}
			if cohort.ModuleSchedulesJSON != "" {
				var schedules map[string]map[string]interface{}
				if json.Unmarshal([]byte(cohort.ModuleSchedulesJSON), &schedules) == nil {
					if sched, ok := schedules[moduleID]; ok {
						if endStr, ok := sched["end_date"].(string); ok && endStr != "" {
							if endT, err := time.Parse(time.RFC3339, endStr); err == nil {
								if now.After(endT) {
									isValid = false
								}
							}
						}
					}
				}
			}
		}
	}

	if isValid && addedXP > 0 {
		db.WithTenant(c).Model(&models.Enrollment{}).
			Where("user_id = ?", userID.(string)).
			Updates(map[string]interface{}{
				"current_xp": gorm.Expr("current_xp + ?", addedXP),
			})
	}

	if input.Completed && !wasCompleted {
		updates := map[string]interface{}{
			"current_stage_number": gorm.Expr("current_stage_number + ?", 1),
		}
		if isValid {
			updates["current_xp"] = gorm.Expr("current_xp + ?", 100)
		}
		db.WithTenant(c).Model(&models.Enrollment{}).
			Where("user_id = ?", userID.(string)).
			Updates(updates)
	}

	c.JSON(http.StatusOK, gin.H{"progress": progress, "is_valid": isValid})
}

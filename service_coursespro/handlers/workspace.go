package handlers

import (
	"net/http"
	"service_coursespro/db"
	"service_coursespro/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetWorkspaceTasks fetches tasks and injects comment & attachment counts
func (h *Handler) GetWorkspaceTasks(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")

	var tasks []models.WorkspaceTask
	if err := db.WithTenant(c).Where("tenant_id = ? AND user_id = ?", tenantID, userID).Order("created_at DESC").Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	// Fetch counts
	for i := range tasks {
		var commentCount int64
		db.WithTenant(c).Model(&models.WorkspaceComment{}).Where("task_id = ?", tasks[i].ID).Count(&commentCount)
		tasks[i].CommentCount = commentCount

		var attachmentCount int64
		db.WithTenant(c).Model(&models.WorkspaceAttachment{}).Where("task_id = ?", tasks[i].ID).Count(&attachmentCount)
		tasks[i].AttachmentCount = attachmentCount
	}

	c.JSON(http.StatusOK, gin.H{"tasks": tasks})
}

// CreateWorkspaceTask creates a new task
func (h *Handler) CreateWorkspaceTask(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")

	var input struct {
		Title  string `json:"title" binding:"required"`
		Tags   string `json:"tags"` // JSON array string
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Status == "" {
		input.Status = "To Do"
	}
	if input.Tags == "" {
		input.Tags = "[]"
	}

	task := models.WorkspaceTask{
		ID:        uuid.New().String(),
		TenantID:  tenantID.(string),
		UserID:    userID.(string),
		Title:     input.Title,
		Status:    input.Status,
		Tags:      input.Tags,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := db.WithTenant(c).Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"task": task})
}

// UpdateWorkspaceTaskStatus updates the status (column) of a task
func (h *Handler) UpdateWorkspaceTaskStatus(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")
	taskID := c.Param("id")

	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var task models.WorkspaceTask
	if err := db.WithTenant(c).Where("id = ? AND tenant_id = ? AND user_id = ?", taskID, tenantID, userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	task.Status = input.Status
	task.UpdatedAt = time.Now()

	if err := db.WithTenant(c).Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"task": task})
}

// DeleteWorkspaceTask deletes a task
func (h *Handler) DeleteWorkspaceTask(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")
	userID, _ := c.Get("user_id")
	taskID := c.Param("id")

	if err := db.WithTenant(c).Where("id = ? AND tenant_id = ? AND user_id = ?", taskID, tenantID, userID).Delete(&models.WorkspaceTask{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
}

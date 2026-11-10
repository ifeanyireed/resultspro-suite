package handlers

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_coursespro/db"
	"service_coursespro/models"
)

type CreateStudentInput struct {
	FullName      string `json:"full_name" binding:"required"`
	Email         string `json:"email" binding:"required,email"`
	CohortID      string `json:"cohort_id"`
	PaymentStatus string `json:"payment_status"` // PAID, PENDING, UNENROLLED
	PlanType      string `json:"plan_type"`      // UPFRONT, MONTHLY, FREE
}

// AdminCreateStudent creates a new student user, adds them to the tenant, and optionally enrolls them in a cohort
func (h *Handler) AdminCreateStudent(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists || tenantID == nil || tenantID.(string) == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Tenant missing from context"})
		return
	}
	tid := tenantID.(string)

	var input CreateStudentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fullName := strings.TrimSpace(input.FullName)
	email := strings.ToLower(strings.TrimSpace(input.Email))

	if fullName == "" || email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Full name and email are required"})
		return
	}

	paymentStatus := strings.ToUpper(strings.TrimSpace(input.PaymentStatus))
	if paymentStatus == "" {
		paymentStatus = "PAID"
	}

	planType := strings.ToUpper(strings.TrimSpace(input.PlanType))
	billingCycle := "one-time"

	now := time.Now()

	// 1. Check if user exists in the users table
	var user struct {
		ID       string
		Email    string
		FullName string
	}
	err := db.DB.Table("users").Where("LOWER(email) = ?", email).First(&user).Error
	userID := user.ID

	if err != nil || userID == "" {
		// Provision new user record
		userID = uuid.New().String()
		newUser := map[string]interface{}{
			"id":             userID,
			"email":          email,
			"full_name":      fullName,
			"name":           fullName,
			"role":           "STUDENT",
			"tenant_id":      tid,
			"auth_provider":  "email",
			"account_status": "active",
			"created_at":     now,
			"updated_at":     now,
		}
		if insertErr := db.DB.Table("users").Create(&newUser).Error; insertErr != nil {
			log.Printf("[AdminCreateStudent] Failed to insert user: %v", insertErr)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user record", "details": insertErr.Error()})
			return
		}
	}

	// 2. Ensure user has 'student' role in user_tenant_roles table
	var existingRole struct {
		ID string
	}
	err = db.DB.Table("user_tenant_roles").
		Where("user_id = ? AND tenant_id = ? AND role = 'student'", userID, tid).
		First(&existingRole).Error

	if err != nil || existingRole.ID == "" {
		roleID := uuid.New().String()
		newRole := map[string]interface{}{
			"id":         roleID,
			"user_id":    userID,
			"tenant_id":  tid,
			"role":       "student",
			"status":     "active",
			"created_at": now,
			"updated_at": now,
		}
		if roleErr := db.DB.Table("user_tenant_roles").Create(&newRole).Error; roleErr != nil {
			log.Printf("[AdminCreateStudent] Warning: failed to insert user_tenant_roles: %v", roleErr)
		}
	}

	// 3. If cohort_id is provided, create enrollment in crs_enrollments
	var enrollment *models.Enrollment
	if input.CohortID != "" && input.CohortID != "all" {
		// Inspect cohort to determine plan type if not explicitly set
		var cohort models.Cohort
		if err := db.WithTenant(c).Where("id = ?", input.CohortID).First(&cohort).Error; err == nil {
			if cohort.Price <= 0 {
				if planType == "" {
					planType = "FREE"
				}
				billingCycle = "free"
			}
		}

		if planType == "" {
			planType = "UPFRONT"
		}

		var existingEnrollment models.Enrollment
		if err := db.WithTenant(c).Where("user_id = ? AND cohort_id = ?", userID, input.CohortID).First(&existingEnrollment).Error; err == nil {
			enrollment = &existingEnrollment
		} else {
			newEnrollment := models.Enrollment{
				ID:                 uuid.New().String(),
				TenantID:           tid,
				UserID:             userID,
				CohortID:           input.CohortID,
				Status:             "ACTIVE",
				PaymentStatus:      paymentStatus,
				PlanType:           planType,
				BillingCycle:       billingCycle,
				CurrentStageNumber: 1,
				CurrentXP:          0,
				StreakDays:         0,
				EnrolledAt:         now,
				UpdatedAt:          now,
			}
			if enrollErr := db.WithTenant(c).Create(&newEnrollment).Error; enrollErr != nil {
				log.Printf("[AdminCreateStudent] Failed to create enrollment: %v", enrollErr)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "User created but failed to enroll into cohort", "details": enrollErr.Error()})
				return
			}
			enrollment = &newEnrollment
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Student added successfully",
		"user_id":    userID,
		"enrollment": enrollment,
		"student": gin.H{
			"id":             userID,
			"full_name":      fullName,
			"email":          email,
			"cohort_id":      input.CohortID,
			"payment_status": paymentStatus,
			"plan_type":      planType,
		},
	})
}

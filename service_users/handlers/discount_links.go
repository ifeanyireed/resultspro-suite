package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

func HandleGetDiscountLinks(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var links []models.DiscountLink
	if err := db.GormDB.Order("created_at desc").Find(&links).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to fetch discount links")
		return
	}

	utils.JSONResponse(w, http.StatusOK, links)
}

func HandleCreateDiscountLink(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input models.DiscountLink
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	input.ID = uuid.New().String()
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()
	if input.Code == "" {
		input.Code = uuid.New().String()[:8] // Basic random string if not provided
	}

	if err := db.GormDB.Create(&input).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create discount link")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, input)
}

func HandleToggleDiscountLink(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	id := r.PathValue("id")
	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Missing link ID")
		return
	}

	var link models.DiscountLink
	if err := db.GormDB.Where("id = ?", id).First(&link).Error; err != nil {
		utils.JSONError(w, http.StatusNotFound, "Link not found")
		return
	}

	link.IsActive = !link.IsActive
	if err := db.GormDB.Save(&link).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update link")
		return
	}

	utils.JSONResponse(w, http.StatusOK, link)
}

func HandleDeleteDiscountLink(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	id := r.PathValue("id")
	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Missing link ID")
		return
	}

	if err := db.GormDB.Where("id = ?", id).Delete(&models.DiscountLink{}).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to delete link")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Deleted successfully"})
}

func HandleRedeemDiscountLink(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, err := utils.GetUserIDFromRequest(r)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var input struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}

	// Find the link
	var link models.DiscountLink
	if err := db.GormDB.Where("code = ? AND is_active = ?", input.Code, true).First(&link).Error; err != nil {
		utils.JSONError(w, http.StatusNotFound, "Invalid or inactive discount code")
		return
	}

	// Check expiration
	if link.ExpiresAt != nil && link.ExpiresAt.Before(time.Now()) {
		utils.JSONError(w, http.StatusBadRequest, "This link has expired")
		return
	}

	// Check max uses
	if link.MaxUses > 0 && link.Uses >= link.MaxUses {
		utils.JSONError(w, http.StatusBadRequest, "This link has reached its maximum usage limit")
		return
	}

	// Fetch user to check email
	var user models.User
	if err := db.GormDB.Where("id = ?", userID).First(&user).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "User not found")
		return
	}

	// Check Pre-assigned Emails
	if link.PreAssignedEmails != "" {
		allowed := false
		emails := strings.Split(link.PreAssignedEmails, ",")
		for _, e := range emails {
			if strings.TrimSpace(strings.ToLower(e)) == strings.ToLower(user.Email) {
				allowed = true
				break
			}
		}
		if !allowed {
			utils.JSONError(w, http.StatusForbidden, "This discount link is not authorized for your email address")
			return
		}
	}

	// Fetch Plan
	var plan models.Plan
	if err := db.GormDB.Where("id = ?", link.PlanID).First(&plan).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "The plan associated with this link no longer exists")
		return
	}

	// 100% discount means they just get the plan for free immediately.
	// If it's less than 100%, we would return the plan data for them to checkout with Paystack.
	// But based on the instruction "upgraded to the plan and validity set on the link",
	// it acts as a direct entitlement link.
	
	// Create Subscription
	expiresAt := time.Now().AddDate(0, 0, link.ValidityDays)
	if link.ValidityDays == 0 {
		// Infinite
		expiresAt = time.Now().AddDate(100, 0, 0)
	}

	// If Examspro ICAN:
	if plan.Category == "ICAN" || plan.AppModule == "examspro" {
		user.HasIcan = true
		user.IcanExpiresAt = &expiresAt
		
		accessLevel := "PREMIUM"
		if plan.AccessLevel != "" {
			accessLevel = plan.AccessLevel
		}
		user.IcanPlan = &accessLevel
		
		if err := db.GormDB.Save(&user).Error; err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to upgrade ICAN account")
			return
		}
	} else {
		// General Sub
		sub := models.UserSubscription{
			ID:        uuid.New().String(),
			UserID:    user.ID,
			Type:      plan.AppModule,
			Tier:      plan.AccessLevel,
			Status:    "ACTIVE",
			ExpiresAt: &expiresAt,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		if err := db.GormDB.Create(&sub).Error; err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to create subscription")
			return
		}
	}

	// Increment Uses
	link.Uses += 1
	db.GormDB.Save(&link)

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"message": "Successfully upgraded!",
		"plan":    plan.Name,
		"expires": expiresAt,
		"redirect_url": plan.RedirectURL,
	})
}

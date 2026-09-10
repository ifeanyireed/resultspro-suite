package handlers

import (
	"encoding/json"
	"net/http"
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

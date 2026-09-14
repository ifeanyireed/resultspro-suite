package handlers

import (
	"net/http"

	"service_users.resultspro.ng/utils"
)

// HandleUploadFile handles generic file uploads to Cloudinary and returns the URL
func HandleUploadFile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Verify token first
	_, err := utils.GetUserIDFromRequest(r)
	if err != nil {
		utils.JSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	err = r.ParseMultipartForm(10 << 20) // 10 MB limit
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "File too large")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "No file provided")
		return
	}
	defer file.Close()

	folder := r.FormValue("folder")
	if folder == "" {
		folder = "uploads/misc"
	}

	url, err := utils.UploadFile(file, header, folder)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to upload file")
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"url":     url,
	})
}

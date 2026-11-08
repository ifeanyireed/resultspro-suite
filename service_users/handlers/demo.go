package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/models"
	"service_users.resultspro.ng/utils"
)

// EnsureDemoSchema creates or auto-migrates the demo_bookings table
func EnsureDemoSchema() {
	if db.GormDB != nil {
		_ = db.GormDB.AutoMigrate(&models.DemoBooking{})
	}
}

type DemoBookingRequest struct {
	ReferenceCode     string   `json:"referenceCode"`
	OrganizationType  string   `json:"organizationType"`
	PainPoints        []string `json:"painPoints"`
	StudentCount      string   `json:"studentCount"`
	CampusCount       string   `json:"campusCount"`
	Infrastructure    string   `json:"infrastructure"`
	MigrationNeed     string   `json:"migrationNeed"`
	Timeline          string   `json:"timeline"`
	SelectedSolutions []string `json:"selectedSolutions"`
	DemoFormat        string   `json:"demoFormat"`
	PreferredDate     string   `json:"preferredDate"`
	PreferredTime     string   `json:"preferredTime"`
	FullName          string   `json:"fullName"`
	Email             string   `json:"email"`
	Phone             string   `json:"phone"`
	InstitutionName   string   `json:"institutionName"`
	Role              string   `json:"role"`
	Notes             string   `json:"notes"`
}

// HandlePublicDemoBooking registers an enterprise demo booking, saves to DB, creates support ticket, and emails admins
func HandlePublicDemoBooking(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	EnsureDemoSchema()

	var req DemoBookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload: "+err.Error())
		return
	}

	// Validate required fields
	req.FullName = strings.TrimSpace(req.FullName)
	req.Email = strings.TrimSpace(req.Email)
	req.Phone = strings.TrimSpace(req.Phone)
	req.InstitutionName = strings.TrimSpace(req.InstitutionName)

	if req.FullName == "" || req.Email == "" || req.Phone == "" || req.InstitutionName == "" {
		utils.JSONError(w, http.StatusBadRequest, "Full name, email, phone number, and institution name are required.")
		return
	}

	// Generate reference code if not provided
	refCode := req.ReferenceCode
	if refCode == "" {
		refCode = fmt.Sprintf("DEMO-RP-%d", 1000+int(time.Now().UnixNano()%9000))
	}

	painPointsStr := strings.Join(req.PainPoints, ", ")
	solutionsStr := strings.Join(req.SelectedSolutions, ", ")

	now := time.Now().UTC()
	bookingID := "demo_" + uuid.New().String()[:12]

	booking := models.DemoBooking{
		ID:                bookingID,
		ReferenceCode:     refCode,
		OrganizationType:  req.OrganizationType,
		PainPoints:        painPointsStr,
		StudentCount:      req.StudentCount,
		CampusCount:       req.CampusCount,
		Infrastructure:    req.Infrastructure,
		MigrationNeed:     req.MigrationNeed,
		Timeline:          req.Timeline,
		SelectedSolutions: solutionsStr,
		DemoFormat:        req.DemoFormat,
		PreferredDate:     req.PreferredDate,
		PreferredTime:     req.PreferredTime,
		FullName:          req.FullName,
		Email:             req.Email,
		Phone:             req.Phone,
		InstitutionName:   req.InstitutionName,
		Role:              req.Role,
		Notes:             req.Notes,
		Status:            "NEW",
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	if err := db.GormDB.Create(&booking).Error; err != nil {
		log.Printf("⚠️ [DemoBooking] Error saving booking to DB: %v", err)
	}

	// Also create a high-priority support ticket so it shows up on the Support Desk queue
	ticketID := "tkt_" + uuid.New().String()[:12]
	ticketSubject := fmt.Sprintf("🎯 New Enterprise Demo: %s (%s)", req.InstitutionName, req.FullName)
	ticketMessage := fmt.Sprintf(`Ref: %s
Institution: %s
Contact: %s (%s)
Email: %s | Phone: %s
SME Type: %s
Scale: %s students, %s campuses
Infrastructure: %s (Migration: %s)
Timeline: %s
Requested Modules: %s
Key Pain Points: %s
Preferred Slot: %s at %s (%s)
Notes: %s`,
		refCode, req.InstitutionName, req.FullName, req.Role, req.Email, req.Phone,
		req.OrganizationType, req.StudentCount, req.CampusCount, req.Infrastructure, req.MigrationNeed,
		req.Timeline, solutionsStr, painPointsStr, req.PreferredDate, req.PreferredTime, req.DemoFormat, req.Notes)

	_ = db.GormDB.Exec(`
		INSERT INTO support_tickets (id, user_id, assigned_to, subject, category, message, status, priority, app_module, created_at, updated_at) 
		VALUES (?, NULL, NULL, ?, 'DEMO_REQUEST', ?, 'open', 'high', 'DEMO', ?, ?)`,
		ticketID, ticketSubject, ticketMessage, now, now)

	// Async non-blocking email dispatch to administrators and lead confirmation
	go dispatchDemoEmails(booking, req.PainPoints, req.SelectedSolutions)

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":       true,
		"message":       "Demo booking request registered successfully",
		"referenceCode": refCode,
		"booking_id":    bookingID,
		"booking":       booking,
	})
}

// dispatchDemoEmails sends notification to ifeanyireed@gmail.com, resultsprong@gmail.com and lead confirmation
func dispatchDemoEmails(b models.DemoBooking, painPoints []string, solutions []string) {
	adminRecipients := []string{"ifeanyireed@gmail.com", "resultsprong@gmail.com"}
	if custom := os.Getenv("ADMIN_NOTIFICATION_EMAILS"); custom != "" {
		for _, addr := range strings.Split(custom, ",") {
			addr = strings.TrimSpace(addr)
			if addr != "" && !contains(adminRecipients, addr) {
				adminRecipients = append(adminRecipients, addr)
			}
		}
	}

	adminSubject := fmt.Sprintf("🎯 [ResultsPRO Demo Request] %s — %s (%s)", b.ReferenceCode, b.InstitutionName, b.FullName)

	// Clean formatted badges for HTML email
	var painPointsHtml strings.Builder
	for _, p := range painPoints {
		painPointsHtml.WriteString(fmt.Sprintf(`<span style="display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 2px;">%s</span> `, p))
	}

	var solutionsHtml strings.Builder
	for _, s := range solutions {
		solutionsHtml.WriteString(fmt.Sprintf(`<span style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin: 2px; border: 1px solid #fde68a;">%s</span> `, s))
	}

	cleanPhone := strings.ReplaceAll(strings.ReplaceAll(b.Phone, " ", ""), "-", "")
	if strings.HasPrefix(cleanPhone, "0") {
		cleanPhone = "234" + cleanPhone[1:]
	} else if strings.HasPrefix(cleanPhone, "+") {
		cleanPhone = cleanPhone[1:]
	}
	whatsappUrl := fmt.Sprintf("https://wa.me/%s?text=%s", cleanPhone, fmt.Sprintf("Hello %s, this is the ResultsPRO team regarding your scheduled demo (%s) for %s.", b.FullName, b.ReferenceCode, b.InstitutionName))

	adminHtml := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>New Demo Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
	<div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
		
		<!-- Header Banner -->
		<div style="background-color: #0D1060; padding: 32px 24px; text-align: center; color: #ffffff;">
			<div style="display: inline-block; background-color: #FBBC04; color: #0D1060; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 9999px; margin-bottom: 12px;">
				New Inbound Demo Lead
			</div>
			<h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
				%s
			</h1>
			<p style="margin: 6px 0 0 0; font-size: 14px; color: #cbd5e1;">
				Reference ID: <strong style="color: #FBBC04; font-family: monospace;">%s</strong>
			</p>
		</div>

		<!-- Body Content -->
		<div style="padding: 24px;">

			<!-- Primary Schedule Box -->
			<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
				<h3 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; color: #166534; font-weight: 800; letter-spacing: 0.5px;">
					📅 Preferred Demo Slot & Format
				</h3>
				<p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">
					%s at %s
				</p>
				<p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">
					Format: <strong>%s</strong>
				</p>
			</div>

			<!-- Lead Contact Card -->
			<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
				<h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.5px;">
					👤 Key Decision Maker Profile
				</h3>
				<table style="width: 100%%; font-size: 14px; border-collapse: collapse;">
					<tr>
						<td style="padding: 6px 0; color: #64748b; width: 140px;">Contact Name:</td>
						<td style="padding: 6px 0; font-weight: 700; color: #0f172a;">%s</td>
					</tr>
					<tr>
						<td style="padding: 6px 0; color: #64748b;">Designation / Role:</td>
						<td style="padding: 6px 0; font-weight: 600; color: #0f172a;">%s</td>
					</tr>
					<tr>
						<td style="padding: 6px 0; color: #64748b;">Email Address:</td>
						<td style="padding: 6px 0;"><a href="mailto:%s" style="color: #0D1060; font-weight: 600; text-decoration: underline;">%s</a></td>
					</tr>
					<tr>
						<td style="padding: 6px 0; color: #64748b;">Phone / WhatsApp:</td>
						<td style="padding: 6px 0;"><a href="%s" style="color: #16a34a; font-weight: 700; text-decoration: none;">%s (Open Chat &rarr;)</a></td>
					</tr>
				</table>
			</div>

			<!-- Institution Architecture & Scale -->
			<div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
				<h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.5px;">
					🏛️ Institution Profile & Scale
				</h3>
				<table style="width: 100%%; font-size: 13px; border-collapse: collapse;">
					<tr>
						<td style="padding: 5px 0; color: #64748b; width: 140px;">Institution Type:</td>
						<td style="padding: 5px 0; font-weight: 600; color: #0f172a;">%s</td>
					</tr>
					<tr>
						<td style="padding: 5px 0; color: #64748b;">Student Population:</td>
						<td style="padding: 5px 0; font-weight: 600; color: #0f172a;">%s</td>
					</tr>
					<tr>
						<td style="padding: 5px 0; color: #64748b;">Campuses:</td>
						<td style="padding: 5px 0; font-weight: 600; color: #0f172a;">%s</td>
					</tr>
					<tr>
						<td style="padding: 5px 0; color: #64748b;">Infrastructure Reality:</td>
						<td style="padding: 5px 0; font-weight: 600; color: #0f172a;">%s</td>
					</tr>
					<tr>
						<td style="padding: 5px 0; color: #64748b;">Legacy Migration:</td>
						<td style="padding: 5px 0; font-weight: 600; color: #0f172a;">%s</td>
					</tr>
					<tr>
						<td style="padding: 5px 0; color: #64748b;">Adoption Timeline:</td>
						<td style="padding: 5px 0; font-weight: 600; color: #0f172a;">%s</td>
					</tr>
				</table>
			</div>

			<!-- Solutions Selected -->
			<div style="margin-bottom: 20px;">
				<h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 800;">
					🚀 Modules to Demonstrate:
				</h4>
				<div>%s</div>
			</div>

			<!-- Core Pain Points -->
			<div style="margin-bottom: 24px;">
				<h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 800;">
					⚠️ Key Pain Points Tagged:
				</h4>
				<div>%s</div>
			</div>

			%s

			<!-- Action CTA Buttons -->
			<div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
				<a href="https://admin.resultspro.ng/demos" style="display: inline-block; background-color: #0D1060; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-right: 8px;">
					View in Admin Dashboard &rarr;
				</a>
				<a href="%s" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px;">
					WhatsApp Lead &rarr;
				</a>
			</div>
		</div>

		<!-- Footer -->
		<div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
			ResultsPRO Suite Inbound Pipeline Telemetry • Dispatched automatically to ifeanyireed@gmail.com and resultsprong@gmail.com
		</div>
	</div>
</body>
</html>
`,
		b.InstitutionName,
		b.ReferenceCode,
		b.PreferredDate, b.PreferredTime, b.DemoFormat,
		b.FullName, b.Role, b.Email, b.Email, whatsappUrl, b.Phone,
		b.OrganizationType, b.StudentCount, b.CampusCount, b.Infrastructure, b.MigrationNeed, b.Timeline,
		solutionsHtml.String(),
		painPointsHtml.String(),
		formatNotesHtml(b.Notes),
		whatsappUrl)

	adminText := fmt.Sprintf(`NEW ENTERPRISE DEMO REQUEST: %s
Reference: %s
Institution: %s
Contact: %s (%s)
Email: %s | Phone: %s
Schedule: %s at %s (%s)
SME Type: %s | Students: %s | Campuses: %s
Infrastructure: %s (Migration: %s) | Timeline: %s
Modules to Demo: %s
Key Pain Points: %s
Notes: %s
Admin Link: https://admin.resultspro.ng/demos`,
		b.InstitutionName, b.ReferenceCode, b.InstitutionName, b.FullName, b.Role,
		b.Email, b.Phone, b.PreferredDate, b.PreferredTime, b.DemoFormat,
		b.OrganizationType, b.StudentCount, b.CampusCount, b.Infrastructure, b.MigrationNeed, b.Timeline,
		b.SelectedSolutions, b.PainPoints, b.Notes)

	for _, recipient := range adminRecipients {
		if err := utils.SendEmail(recipient, adminSubject, adminHtml, adminText, "ResultsPRO Inbound Lead"); err != nil {
			log.Printf("⚠️ [DemoBooking] Failed sending admin notification to %s: %v", recipient, err)
		} else {
			log.Printf("📧 [DemoBooking] Successfully notified admin %s of demo request for %s", recipient, b.InstitutionName)
		}
	}
}

func formatNotesHtml(notes string) string {
	if strings.TrimSpace(notes) == "" {
		return ""
	}
	return fmt.Sprintf(`
		<div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 14px; margin-bottom: 24px;">
			<h4 style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; color: #b45309; font-weight: 800;">
				📝 Additional Notes from Lead:
			</h4>
			<p style="margin: 0; font-size: 13px; color: #78350f; line-height: 1.5; white-space: pre-wrap;">%s</p>
		</div>`, notes)
}

func contains(arr []string, val string) bool {
	for _, v := range arr {
		if strings.EqualFold(v, val) {
			return true
		}
	}
	return false
}

// HandleAdminDemoBookings returns all demo bookings for the admin app
func HandleAdminDemoBookings(w http.ResponseWriter, r *http.Request) {
	EnsureDemoSchema()

	if r.Method != http.MethodGet {
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var bookings []models.DemoBooking
	if err := db.GormDB.Order("created_at desc").Find(&bookings).Error; err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to load demo bookings: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusOK, bookings)
}

// HandleAdminDemoBookingSubroutes handles status updates and management of individual demo bookings
func HandleAdminDemoBookingSubroutes(w http.ResponseWriter, r *http.Request) {
	EnsureDemoSchema()

	id := strings.TrimPrefix(r.URL.Path, "/api/v1/admin/demo-bookings/")
	id = strings.TrimSuffix(id, "/")

	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Booking ID required")
		return
	}

	if r.Method == http.MethodPut || r.Method == http.MethodPatch {
		var input struct {
			Status     string `json:"status"`
			AdminNotes string `json:"admin_notes"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid request body")
			return
		}

		updates := map[string]interface{}{
			"updated_at": time.Now().UTC(),
		}
		if input.Status != "" {
			updates["status"] = input.Status
		}
		if input.AdminNotes != "" {
			updates["admin_notes"] = input.AdminNotes
		}

		if err := db.GormDB.Model(&models.DemoBooking{}).Where("id = ? OR reference_code = ?", id, id).Updates(updates).Error; err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to update demo booking: "+err.Error())
			return
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Demo booking status updated successfully",
		})
		return
	}

	if r.Method == http.MethodDelete {
		if err := db.GormDB.Where("id = ? OR reference_code = ?", id, id).Delete(&models.DemoBooking{}).Error; err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete demo booking")
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true})
		return
	}

	utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
}

package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

// CampusInventoryItemRecord represents a storekeeping item SKU
type CampusInventoryItemRecord struct {
	ID               string     `json:"id"`
	TenantID         string     `json:"tenant_id"`
	SKU              string     `json:"sku"`
	ItemName         string     `json:"item_name"`
	Category         string     `json:"category"`
	Unit             string     `json:"unit"`
	QuantityInStock  int        `json:"quantity_in_stock"`
	ReorderLevel     int        `json:"reorder_level"`
	UnitCost         float64    `json:"unit_cost"`
	TotalValue       float64    `json:"total_value"`
	Location         string     `json:"location"`
	SupplierName     string     `json:"supplier_name"`
	Status           string     `json:"status"` // 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'
	LastRestockedAt  *time.Time `json:"last_restocked_at,omitempty"`
	LastDispatchedAt *time.Time `json:"last_dispatched_at,omitempty"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
}

// CampusStockMovementRecord represents an immutable stock ledger audit entry
type CampusStockMovementRecord struct {
	ID            string    `json:"id"`
	TenantID      string    `json:"tenant_id"`
	ItemID        string    `json:"item_id"`
	ItemName      string    `json:"item_name"`
	SKU           string    `json:"sku"`
	MovementType  string    `json:"movement_type"` // 'STOCK_IN', 'DISPATCH', 'RETURN', 'AUDIT_ADJUSTMENT'
	Quantity      int       `json:"quantity"`
	BalanceAfter  int       `json:"balance_after"`
	Department    string    `json:"department"`
	RecipientName string    `json:"recipient_name"`
	AuthorizedBy  string    `json:"authorized_by"`
	ReferencePO   string    `json:"reference_po"`
	MovementDate  string    `json:"movement_date"`
	Notes         string    `json:"notes"`
	CreatedAt     time.Time `json:"created_at"`
}

// CampusProcurementRecord represents a formal purchase requisition
type CampusProcurementRecord struct {
	ID            string    `json:"id"`
	TenantID      string    `json:"tenant_id"`
	PONumber      string    `json:"po_number"`
	Title         string    `json:"title"`
	Department    string    `json:"department"`
	RequestedBy   string    `json:"requested_by"`
	VendorName    string    `json:"vendor_name"`
	ItemsSummary  string    `json:"items_summary"`
	TotalAmount   float64   `json:"total_amount"`
	Priority      string    `json:"priority"` // 'URGENT', 'HIGH', 'NORMAL', 'LOW'
	Status        string    `json:"status"`   // 'PENDING_APPROVAL', 'APPROVED', 'ORDERED', 'RECEIVED', 'REJECTED'
	ApprovedBy    string    `json:"approved_by"`
	ApprovalNotes string    `json:"approval_notes"`
	NeededByDate  string    `json:"needed_by_date"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// CampusVendorRecord represents an institutional approved supplier
type CampusVendorRecord struct {
	ID            string    `json:"id"`
	TenantID      string    `json:"tenant_id"`
	VendorName    string    `json:"vendor_name"`
	Category      string    `json:"category"`
	ContactPerson string    `json:"contact_person"`
	Phone         string    `json:"phone"`
	Email         string    `json:"email"`
	Address       string    `json:"address"`
	PaymentTerms  string    `json:"payment_terms"`
	Status        string    `json:"status"`
	Rating        float64   `json:"rating"`
	CreatedAt     time.Time `json:"created_at"`
}

// CampusInventorySummary provides high-level storekeeping metrics
type CampusInventorySummary struct {
	TotalSKUs        int     `json:"total_skus"`
	TotalValuation   float64 `json:"total_valuation"`
	LowStockCount    int     `json:"low_stock_count"`
	OutOfStockCount  int     `json:"out_of_stock_count"`
	PendingPOsCount  int     `json:"pending_pos_count"`
	ApprovedPOsCount int     `json:"approved_pos_count"`
	TotalPOsValue    float64 `json:"total_pos_value"`
	VendorsCount     int     `json:"vendors_count"`
}

// HandleCampusProcurement handles tenant-aware inventory and procurement operations
func HandleCampusProcurement(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		getCampusInventory(w, r, tenantID)
	case http.MethodPost:
		postCampusInventory(w, r, tenantID)
	case http.MethodPut, http.MethodPatch:
		putCampusInventory(w, r, tenantID)
	case http.MethodDelete:
		deleteCampusInventory(w, r, tenantID)
	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func getCampusInventory(w http.ResponseWriter, r *http.Request, tenantID string) {
	searchQuery := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("search")))
	categoryFilter := strings.TrimSpace(r.URL.Query().Get("category"))
	statusFilter := strings.ToUpper(strings.TrimSpace(r.URL.Query().Get("status")))

	// 1. Fetch Store Items
	itemsQuery := `
		SELECT id, tenant_id, COALESCE(sku, ''), item_name, COALESCE(category, 'General'),
		       COALESCE(unit, 'Units'), COALESCE(quantity_in_stock, current_stock, 0),
		       COALESCE(reorder_level, reorder_threshold, 5),
		       COALESCE(unit_cost, unit_price, 0),
		       COALESCE(location, 'Central Campus Store'), COALESCE(supplier_name, ''),
		       COALESCE(status, 'IN_STOCK'), last_restocked_at, last_dispatched_at,
		       created_at, updated_at
		FROM campus_inventory_items
		WHERE tenant_id = ?
	`
	itemArgs := []interface{}{tenantID}

	if categoryFilter != "" && categoryFilter != "ALL" && categoryFilter != "All Categories" {
		itemsQuery += " AND category = ?"
		itemArgs = append(itemArgs, categoryFilter)
	}
	if statusFilter != "" && statusFilter != "ALL" {
		itemsQuery += " AND status = ?"
		itemArgs = append(itemArgs, statusFilter)
	}
	if searchQuery != "" {
		itemsQuery += " AND (LOWER(item_name) LIKE ? OR LOWER(sku) LIKE ? OR LOWER(supplier_name) LIKE ? OR LOWER(location) LIKE ?)"
		pat := "%" + searchQuery + "%"
		itemArgs = append(itemArgs, pat, pat, pat, pat)
	}
	itemsQuery += " ORDER BY item_name ASC"

	iRows, err := db.DB.Query(itemsQuery, itemArgs...)
	items := []CampusInventoryItemRecord{}
	var totalValuation float64
	var lowStockCount, outOfStockCount int

	if err == nil && iRows != nil {
		defer iRows.Close()
		for iRows.Next() {
			var it CampusInventoryItemRecord
			if err := iRows.Scan(
				&it.ID, &it.TenantID, &it.SKU, &it.ItemName, &it.Category,
				&it.Unit, &it.QuantityInStock, &it.ReorderLevel,
				&it.UnitCost, &it.Location, &it.SupplierName,
				&it.Status, &it.LastRestockedAt, &it.LastDispatchedAt,
				&it.CreatedAt, &it.UpdatedAt,
			); err == nil {
				// Recalculate status dynamically to guarantee precision
				if it.QuantityInStock <= 0 {
					it.Status = "OUT_OF_STOCK"
					outOfStockCount++
				} else if it.QuantityInStock <= it.ReorderLevel {
					it.Status = "LOW_STOCK"
					lowStockCount++
				} else {
					it.Status = "IN_STOCK"
				}
				it.TotalValue = float64(it.QuantityInStock) * it.UnitCost
				totalValuation += it.TotalValue
				items = append(items, it)
			}
		}
	}

	// 2. Fetch Stock Movements
	movements := []CampusStockMovementRecord{}
	mRows, err := db.DB.Query(`
		SELECT id, tenant_id, item_id, item_name, COALESCE(sku, ''), movement_type,
		       quantity, balance_after, COALESCE(department, ''), COALESCE(recipient_name, ''),
		       COALESCE(authorized_by, 'Store Manager'), COALESCE(reference_po, ''),
		       movement_date, COALESCE(notes, ''), created_at
		FROM campus_inventory_movements
		WHERE tenant_id = ?
		ORDER BY created_at DESC
		LIMIT 100
	`, tenantID)
	if err == nil && mRows != nil {
		defer mRows.Close()
		for mRows.Next() {
			var m CampusStockMovementRecord
			if err := mRows.Scan(
				&m.ID, &m.TenantID, &m.ItemID, &m.ItemName, &m.SKU, &m.MovementType,
				&m.Quantity, &m.BalanceAfter, &m.Department, &m.RecipientName,
				&m.AuthorizedBy, &m.ReferencePO, &m.MovementDate, &m.Notes, &m.CreatedAt,
			); err == nil {
				movements = append(movements, m)
			}
		}
	}

	// 3. Fetch Procurement Requisitions (POs)
	pos := []CampusProcurementRecord{}
	pRows, err := db.DB.Query(`
		SELECT id, tenant_id, COALESCE(po_number, ''), COALESCE(title, ''), department,
		       requested_by, COALESCE(vendor_name, ''), items_summary,
		       COALESCE(total_amount, estimated_cost, 0),
		       COALESCE(priority, 'NORMAL'), COALESCE(status, 'PENDING_APPROVAL'),
		       COALESCE(approved_by, ''), COALESCE(approval_notes, ''),
		       COALESCE(needed_by_date, ''), created_at, updated_at
		FROM campus_procurement_requests
		WHERE tenant_id = ?
		ORDER BY created_at DESC
	`, tenantID)
	var pendingPOsCount, approvedPOsCount int
	var totalPOsValue float64
	if err == nil && pRows != nil {
		defer pRows.Close()
		for pRows.Next() {
			var po CampusProcurementRecord
			if err := pRows.Scan(
				&po.ID, &po.TenantID, &po.PONumber, &po.Title, &po.Department,
				&po.RequestedBy, &po.VendorName, &po.ItemsSummary,
				&po.TotalAmount, &po.Priority, &po.Status,
				&po.ApprovedBy, &po.ApprovalNotes, &po.NeededByDate,
				&po.CreatedAt, &po.UpdatedAt,
			); err == nil {
				if po.Status == "PENDING_APPROVAL" {
					pendingPOsCount++
				} else if po.Status == "APPROVED" || po.Status == "ORDERED" {
					approvedPOsCount++
				}
				totalPOsValue += po.TotalAmount
				pos = append(pos, po)
			}
		}
	}

	// 4. Fetch Approved Vendors
	vendors := []CampusVendorRecord{}
	vRows, err := db.DB.Query(`
		SELECT id, tenant_id, vendor_name, COALESCE(category, 'General Supplies'),
		       COALESCE(contact_person, ''), COALESCE(phone, ''), COALESCE(email, ''),
		       COALESCE(address, ''), COALESCE(payment_terms, 'Net 30'),
		       COALESCE(status, 'ACTIVE'), COALESCE(rating, 4.5), created_at
		FROM campus_inventory_vendors
		WHERE tenant_id = ?
		ORDER BY vendor_name ASC
	`, tenantID)
	if err == nil && vRows != nil {
		defer vRows.Close()
		for vRows.Next() {
			var v CampusVendorRecord
			if err := vRows.Scan(
				&v.ID, &v.TenantID, &v.VendorName, &v.Category,
				&v.ContactPerson, &v.Phone, &v.Email,
				&v.Address, &v.PaymentTerms, &v.Status, &v.Rating, &v.CreatedAt,
			); err == nil {
				vendors = append(vendors, v)
			}
		}
	}

	// 5. Canonical Institutional Departments
	departments := []string{
		"Science & Robotics Lab",
		"Chemistry Laboratory",
		"Physics Laboratory",
		"Biology & Agriculture Lab",
		"ICT & Computer Hub",
		"Examination & Academic Committee",
		"Bursary & Administration",
		"Sports & Physical Education",
		"Hostel & Boarding House",
		"Health Bay & School Clinic",
		"Library & Resource Center",
		"Facility Management & Maintenance",
	}

	summary := CampusInventorySummary{
		TotalSKUs:        len(items),
		TotalValuation:   totalValuation,
		LowStockCount:    lowStockCount,
		OutOfStockCount:  outOfStockCount,
		PendingPOsCount:  pendingPOsCount,
		ApprovedPOsCount: approvedPOsCount,
		TotalPOsValue:    totalPOsValue,
		VendorsCount:     len(vendors),
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":              true,
		"tenant_id":            tenantID,
		"summary":              summary,
		"inventory":            items,
		"movements":            movements,
		"procurement_requests": pos,
		"vendors":              vendors,
		"departments":          departments,
	})
}

func postCampusInventory(w http.ResponseWriter, r *http.Request, tenantID string) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	action, _ := body["action"].(string)
	recordType, _ := body["record_type"].(string)

	switch {
	case action == "stock_movement" || action == "dispatch" || action == "restock":
		handleStockMovement(w, tenantID, body)

	case action == "create_procurement" || recordType == "procurement":
		createProcurementRequest(w, tenantID, body)

	case action == "add_vendor" || recordType == "vendor":
		createVendorRecord(w, tenantID, body)

	default: // Add/Update Store SKU Item
		saveInventoryItemRecord(w, tenantID, body)
	}
}

func saveInventoryItemRecord(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	id, _ := body["id"].(string)
	if id == "" {
		id = "inv-" + uuid.New().String()
	}

	name, _ := body["item_name"].(string)
	if name == "" {
		utils.JSONError(w, http.StatusBadRequest, "Item name is required")
		return
	}

	sku, _ := body["sku"].(string)
	if sku == "" {
		sku = fmt.Sprintf("SKU-%s", strings.ToUpper(uuid.New().String()[:6]))
	}

	category, _ := body["category"].(string)
	if category == "" {
		category = "General Supplies"
	}
	unit, _ := body["unit"].(string)
	if unit == "" {
		unit = "Units"
	}

	qty := 0
	if q, ok := body["quantity_in_stock"].(float64); ok {
		qty = int(q)
	}
	reorder := 5
	if r, ok := body["reorder_level"].(float64); ok {
		reorder = int(r)
	}
	unitCost, _ := body["unit_cost"].(float64)
	location, _ := body["location"].(string)
	if location == "" {
		location = "Central Campus Store"
	}
	supplier, _ := body["supplier_name"].(string)

	status := "IN_STOCK"
	if qty <= 0 {
		status = "OUT_OF_STOCK"
	} else if qty <= reorder {
		status = "LOW_STOCK"
	}

	query := `
		INSERT INTO campus_inventory_items (
			id, tenant_id, sku, item_name, category, unit, quantity_in_stock, current_stock,
			reorder_level, reorder_threshold, unit_cost, unit_price, location, supplier_name,
			status, last_restocked_at, updated_at
		) VALUES (
			?, ?, ?, ?, ?, ?, ?, ?,
			?, ?, ?, ?, ?, ?,
			?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
		)
		ON CONFLICT (id) DO UPDATE SET
			sku = EXCLUDED.sku,
			item_name = EXCLUDED.item_name,
			category = EXCLUDED.category,
			unit = EXCLUDED.unit,
			quantity_in_stock = EXCLUDED.quantity_in_stock,
			current_stock = EXCLUDED.quantity_in_stock,
			reorder_level = EXCLUDED.reorder_level,
			reorder_threshold = EXCLUDED.reorder_level,
			unit_cost = EXCLUDED.unit_cost,
			unit_price = EXCLUDED.unit_cost,
			location = EXCLUDED.location,
			supplier_name = EXCLUDED.supplier_name,
			status = EXCLUDED.status,
			updated_at = CURRENT_TIMESTAMP
	`
	_, err := db.DB.Exec(query,
		id, tenantID, sku, name, category, unit, qty, qty,
		reorder, reorder, unitCost, unitCost, location, supplier,
		status,
	)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to save store item: "+err.Error())
		return
	}

	// If initial stock was supplied, record first movement ledger entry
	if qty > 0 {
		movementID := uuid.New().String()
		_, _ = db.DB.Exec(`
			INSERT INTO campus_inventory_movements (
				id, tenant_id, item_id, item_name, sku, movement_type,
				quantity, balance_after, department, recipient_name, authorized_by,
				movement_date, notes
			) VALUES (?, ?, ?, ?, ?, 'STOCK_IN', ?, ?, 'Central Campus Store', 'Store Inflow', 'Store Manager', ?, 'Initial inventory stock register')
		`, movementID, tenantID, id, name, sku, qty, qty, time.Now().Format("2006-01-02"))
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"id":      id,
		"sku":     sku,
		"message": "Inventory item registered successfully in database",
	})
}

func handleStockMovement(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	itemID, _ := body["item_id"].(string)
	if itemID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Item ID is required")
		return
	}

	movementType, _ := body["movement_type"].(string)
	if movementType == "" {
		movementType = "DISPATCH"
	}

	qty := 0
	if q, ok := body["quantity"].(float64); ok {
		qty = int(q)
	}
	if qty <= 0 {
		utils.JSONError(w, http.StatusBadRequest, "Movement quantity must be greater than zero")
		return
	}

	// 1. Fetch current item stock
	var itemName, sku, status string
	var currentStock, reorderLevel int
	err := db.DB.QueryRow(`
		SELECT item_name, COALESCE(sku, ''), COALESCE(quantity_in_stock, 0), COALESCE(reorder_level, 5), COALESCE(status, 'IN_STOCK')
		FROM campus_inventory_items
		WHERE id = ? AND tenant_id = ?
	`, itemID, tenantID).Scan(&itemName, &sku, &currentStock, &reorderLevel, &status)
	if err != nil {
		utils.JSONError(w, http.StatusNotFound, "Store item not found in database for this tenant")
		return
	}

	var newBal int
	if movementType == "DISPATCH" || movementType == "STOCK_OUT" {
		if qty > currentStock {
			utils.JSONError(w, http.StatusBadRequest, fmt.Sprintf("Cannot dispatch %d units; only %d available in store", qty, currentStock))
			return
		}
		newBal = currentStock - qty
	} else { // STOCK_IN / RESTOCK
		newBal = currentStock + qty
	}

	// Update Status
	newStatus := "IN_STOCK"
	if newBal <= 0 {
		newStatus = "OUT_OF_STOCK"
	} else if newBal <= reorderLevel {
		newStatus = "LOW_STOCK"
	}

	// 2. Update Item in Store Table
	timeColumn := "last_dispatched_at"
	if movementType == "STOCK_IN" {
		timeColumn = "last_restocked_at"
	}
	updateQuery := fmt.Sprintf(`
		UPDATE campus_inventory_items
		SET quantity_in_stock = ?, current_stock = ?, status = ?, %s = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
		WHERE id = ? AND tenant_id = ?
	`, timeColumn)
	_, err = db.DB.Exec(updateQuery, newBal, newBal, newStatus, itemID, tenantID)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to update item stock: "+err.Error())
		return
	}

	// 3. Insert Immutable Movement Audit Record
	movementID := uuid.New().String()
	department, _ := body["department"].(string)
	recipient, _ := body["recipient_name"].(string)
	authorizedBy, _ := body["authorized_by"].(string)
	if authorizedBy == "" {
		authorizedBy = "Store Manager"
	}
	refPO, _ := body["reference_po"].(string)
	notes, _ := body["notes"].(string)
	moveDate, _ := body["movement_date"].(string)
	if moveDate == "" {
		moveDate = time.Now().Format("2006-01-02")
	}

	_, err = db.DB.Exec(`
		INSERT INTO campus_inventory_movements (
			id, tenant_id, item_id, item_name, sku, movement_type,
			quantity, balance_after, department, recipient_name, authorized_by,
			reference_po, movement_date, notes
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, movementID, tenantID, itemID, itemName, sku, movementType,
		qty, newBal, department, recipient, authorizedBy,
		refPO, moveDate, notes,
	)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to log movement audit ledger: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":       true,
		"movement_id":   movementID,
		"item_id":       itemID,
		"movement_type": movementType,
		"quantity":      qty,
		"new_balance":   newBal,
		"status":        newStatus,
		"message":       fmt.Sprintf("%s of %d units of %s logged successfully (New stock: %d)", movementType, qty, itemName, newBal),
	})
}

func createProcurementRequest(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	id := uuid.New().String()
	poNumber := fmt.Sprintf("PO-%d-%s", time.Now().Year(), strings.ToUpper(id[:4]))

	department, _ := body["department"].(string)
	if department == "" {
		department = "Sciences Department"
	}
	requestedBy, _ := body["requested_by"].(string)
	if requestedBy == "" {
		utils.JSONError(w, http.StatusBadRequest, "Requested by name is required")
		return
	}

	vendor, _ := body["vendor_name"].(string)
	itemsSummary, _ := body["items_summary"].(string)
	title, _ := body["title"].(string)
	if title == "" {
		title = itemsSummary
	}
	if itemsSummary == "" {
		itemsSummary = title
	}

	totalAmount, _ := body["total_amount"].(float64)
	if totalAmount == 0 {
		if est, ok := body["estimated_cost"].(float64); ok {
			totalAmount = est
		}
	}

	priority, _ := body["priority"].(string)
	if priority == "" {
		priority = "NORMAL"
	}
	neededByDate, _ := body["needed_by_date"].(string)

	query := `
		INSERT INTO campus_procurement_requests (
			id, tenant_id, po_number, title, department, requested_by, vendor_name,
			items_summary, total_amount, estimated_cost, priority, status, needed_by_date
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL', ?)
	`
	_, err := db.DB.Exec(query,
		id, tenantID, poNumber, title, department, requestedBy, vendor,
		itemsSummary, totalAmount, totalAmount, priority, neededByDate,
	)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to submit procurement request: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"success":   true,
		"id":        id,
		"po_number": poNumber,
		"message":   "Purchase order requisition submitted for approval",
	})
}

func createVendorRecord(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	id := uuid.New().String()
	vendorName, _ := body["vendor_name"].(string)
	if vendorName == "" {
		utils.JSONError(w, http.StatusBadRequest, "Vendor name is required")
		return
	}

	category, _ := body["category"].(string)
	contactPerson, _ := body["contact_person"].(string)
	phone, _ := body["phone"].(string)
	email, _ := body["email"].(string)
	address, _ := body["address"].(string)
	terms, _ := body["payment_terms"].(string)
	if terms == "" {
		terms = "Net 30"
	}

	query := `
		INSERT INTO campus_inventory_vendors (
			id, tenant_id, vendor_name, category, contact_person, phone, email,
			address, payment_terms, status, rating
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 4.8)
	`
	_, err := db.DB.Exec(query,
		id, tenantID, vendorName, category, contactPerson, phone, email, address, terms,
	)
	if err != nil {
		utils.JSONError(w, http.StatusInternalServerError, "Failed to register vendor: "+err.Error())
		return
	}

	utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"id":      id,
		"message": "Vendor registered in institutional directory",
	})
}

func putCampusInventory(w http.ResponseWriter, r *http.Request, tenantID string) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	recordID, _ := body["id"].(string)
	if recordID == "" {
		recordID, _ = body["po_id"].(string)
	}
	if recordID == "" {
		recordID, _ = body["item_id"].(string)
	}
	if recordID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Record ID is required")
		return
	}

	// 1. Handle PO Status Changes (Approve, Order, Fulfill, Reject)
	if status, ok := body["status"].(string); ok && status != "" {
		approvedBy, _ := body["approved_by"].(string)
		if approvedBy == "" {
			approvedBy = "Super Admin"
		}
		notes, _ := body["approval_notes"].(string)

		_, err := db.DB.Exec(`
			UPDATE campus_procurement_requests
			SET status = ?, approved_by = ?, approval_notes = COALESCE(NULLIF(?, ''), approval_notes), updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, status, approvedBy, notes, recordID, tenantID)
		if err == nil {
			utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
				"success": true,
				"message": fmt.Sprintf("Purchase order status updated to %s", status),
			})
			return
		}
	}

	// 2. Handle Item Quantity or Cost Direct Edits
	if q, ok := body["quantity_in_stock"].(float64); ok {
		qty := int(q)
		_, _ = db.DB.Exec(`
			UPDATE campus_inventory_items
			SET quantity_in_stock = ?, current_stock = ?,
			    status = CASE WHEN ? <= 0 THEN 'OUT_OF_STOCK' WHEN ? <= reorder_level THEN 'LOW_STOCK' ELSE 'IN_STOCK' END,
			    updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, qty, qty, qty, qty, recordID, tenantID)

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Store stock level updated"})
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "No changes performed"})
}

func deleteCampusInventory(w http.ResponseWriter, r *http.Request, tenantID string) {
	id := strings.TrimSpace(r.URL.Query().Get("id"))
	if id == "" {
		utils.JSONError(w, http.StatusBadRequest, "Record ID is required")
		return
	}
	recordType := strings.TrimSpace(r.URL.Query().Get("type"))

	switch recordType {
	case "procurement", "po":
		_, err := db.DB.Exec("DELETE FROM campus_procurement_requests WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete procurement request: "+err.Error())
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Purchase order request deleted"})

	case "movement":
		_, err := db.DB.Exec("DELETE FROM campus_inventory_movements WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete movement entry: "+err.Error())
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Stock movement entry removed"})

	case "vendor":
		_, err := db.DB.Exec("DELETE FROM campus_inventory_vendors WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete vendor: "+err.Error())
			return
		}
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Vendor removed from directory"})

	default: // Store Item SKU
		_, err := db.DB.Exec("DELETE FROM campus_inventory_items WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete inventory item: "+err.Error())
			return
		}
		// Also clean up movement history for this item
		_, _ = db.DB.Exec("DELETE FROM campus_inventory_movements WHERE item_id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Store item and associated audit history removed"})
	}
}

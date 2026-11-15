package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// CampusFeeStructureRecord represents an institutional fee schedule
type CampusFeeStructureRecord struct {
	ID               string    `json:"id"`
	TenantID         string    `json:"tenant_id"`
	Title            string    `json:"title"`
	Category         string    `json:"category"`
	ClassLevel       string    `json:"class_level"`
	TermName         string    `json:"term_name"`
	Term             string    `json:"term"`
	Session          string    `json:"session"`
	Amount           float64   `json:"amount"`
	TuitionFee       float64   `json:"tuition_fee"`
	DevelopmentLevy  float64   `json:"development_levy"`
	ICTStemFee       float64   `json:"ict_stem_fee"`
	ExamMaterialsFee float64   `json:"exam_materials_fee"`
	TotalDue         float64   `json:"total_due"`
	IsMandatory      bool      `json:"is_mandatory"`
	DueDate          string    `json:"due_date"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// CampusStudentInvoiceRecord represents a student fee billing invoice
type CampusStudentInvoiceRecord struct {
	ID               string     `json:"id"`
	TenantID         string     `json:"tenant_id"`
	InvoiceNo        string     `json:"invoice_no"`
	StudentID        string     `json:"student_id"`
	AdmissionNumber  string     `json:"admission_number"`
	StudentName      string     `json:"student_name"`
	ClassID          string     `json:"class_id"`
	ClassName        string     `json:"class_name"`
	ArmID            string     `json:"arm_id"`
	ArmName          string     `json:"arm_name"`
	TermName         string     `json:"term_name"`
	Term             string     `json:"term"`
	Session          string     `json:"session"`
	TuitionFee       float64    `json:"tuition_fee"`
	DevelopmentLevy  float64    `json:"development_levy"`
	ICTStemFee       float64    `json:"ict_stem_fee"`
	ExamMaterialsFee float64    `json:"exam_materials_fee"`
	OtherCharges     float64    `json:"other_charges"`
	DiscountAmount   float64    `json:"discount_amount"`
	TotalBilled      float64    `json:"total_billed"`
	AmountPaid       float64    `json:"amount_paid"`
	BalanceDue       float64    `json:"balance_due"`
	Status           string     `json:"status"` // 'PAID', 'PARTIAL', 'UNPAID', 'OVERDUE'
	PaymentMethod    string     `json:"payment_method"`
	PaymentReference string     `json:"payment_reference"`
	DueDate          string     `json:"due_date"`
	ParentName       string     `json:"parent_name"`
	ParentPhone      string     `json:"parent_phone"`
	PaidAt           *time.Time `json:"paid_at,omitempty"`
	LastPaymentAt    *time.Time `json:"last_payment_at,omitempty"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
}

// CampusFeePaymentRecord represents an immutable transaction ledger entry
type CampusFeePaymentRecord struct {
	ID              string    `json:"id"`
	TenantID        string    `json:"tenant_id"`
	InvoiceID       string    `json:"invoice_id"`
	StudentID       string    `json:"student_id"`
	StudentName     string    `json:"student_name"`
	AdmissionNumber string    `json:"admission_number"`
	ClassName       string    `json:"class_name"`
	Amount          float64   `json:"amount"`
	PaymentMethod   string    `json:"payment_method"` // 'Paystack DVA', 'Bank Transfer', 'POS', 'Cash'
	Reference       string    `json:"reference"`
	ReceiptNo       string    `json:"receipt_no"`
	PaidBy          string    `json:"paid_by"`
	RecordedBy      string    `json:"recorded_by"`
	PaymentDate     string    `json:"payment_date"`
	Status          string    `json:"status"`
	Notes           string    `json:"notes"`
	CreatedAt       time.Time `json:"created_at"`
}

// CampusFinancialSummary provides executive bursary health metrics
type CampusFinancialSummary struct {
	TotalCollected       float64 `json:"total_collected"`
	TotalBilled          float64 `json:"total_billed"`
	TotalOutstanding     float64 `json:"total_outstanding"`
	CollectionRate       int     `json:"collection_rate"`
	InvoicesCount        int     `json:"invoices_count"`
	ClearedCount         int     `json:"cleared_count"`
	PendingCount         int     `json:"pending_count"`
	CriticalDebtorsCount int     `json:"critical_debtors_count"`
	StructuresCount      int     `json:"structures_count"`
	PaymentsCount        int     `json:"payments_count"`
}

// HandleCampusFees handles tenant-aware bursary operations on the single shared database
func HandleCampusFees(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantOperationalDataIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		getCampusFinancials(w, r, tenantID)
	case http.MethodPost:
		postCampusFinancials(w, r, tenantID)
	case http.MethodPut, http.MethodPatch:
		putCampusFinancials(w, r, tenantID)
	case http.MethodDelete:
		deleteCampusFinancials(w, r, tenantID)
	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func getCampusFinancials(w http.ResponseWriter, r *http.Request, tenantID string) {
	tab := r.URL.Query().Get("tab")
	search := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("search")))
	className := strings.TrimSpace(r.URL.Query().Get("class_name"))
	statusFilter := strings.ToUpper(strings.TrimSpace(r.URL.Query().Get("status")))
	termFilter := strings.TrimSpace(r.URL.Query().Get("term"))

	// 1. Fetch Fee Structures
	structures := []CampusFeeStructureRecord{}
	sQuery := `
		SELECT id, tenant_id, COALESCE(title, ''), COALESCE(category, 'TUITION'), COALESCE(class_level, 'All Levels'),
		       COALESCE(term_name, 'First Term'), COALESCE(term, 'First Term'), COALESCE(session, '2026/2027'),
		       COALESCE(amount, 0), COALESCE(tuition_fee, 0), COALESCE(development_levy, 0), COALESCE(ict_stem_fee, 0),
		       COALESCE(exam_materials_fee, 0), COALESCE(total_due, 0), COALESCE(is_mandatory, true),
		       COALESCE(due_date, ''), COALESCE(created_at, CURRENT_TIMESTAMP), COALESCE(updated_at, CURRENT_TIMESTAMP)
		FROM campus_fee_structures
		WHERE tenant_id = ?
		ORDER BY created_at DESC
	`
	sRows, err := db.DB.Query(sQuery, tenantID)
	if err == nil && sRows != nil {
		defer sRows.Close()
		for sRows.Next() {
			var s CampusFeeStructureRecord
			if err := sRows.Scan(
				&s.ID, &s.TenantID, &s.Title, &s.Category, &s.ClassLevel,
				&s.TermName, &s.Term, &s.Session,
				&s.Amount, &s.TuitionFee, &s.DevelopmentLevy, &s.ICTStemFee,
				&s.ExamMaterialsFee, &s.TotalDue, &s.IsMandatory,
				&s.DueDate, &s.CreatedAt, &s.UpdatedAt,
			); err == nil {
				if s.TotalDue == 0 && s.Amount > 0 {
					s.TotalDue = s.Amount
				}
				if s.Amount == 0 && s.TotalDue > 0 {
					s.Amount = s.TotalDue
				}
				if s.TuitionFee == 0 && s.Amount > 0 && s.DevelopmentLevy == 0 && s.ICTStemFee == 0 && s.ExamMaterialsFee == 0 {
					s.TuitionFee = s.Amount
				}
				structures = append(structures, s)
			}
		}
	}

	// 2. Fetch Student Invoices with dynamic filters
	invoices := []CampusStudentInvoiceRecord{}
	iQuery := `
		SELECT id, tenant_id, COALESCE(invoice_no, ''), COALESCE(student_id, ''), COALESCE(admission_number, ''),
		       student_name, COALESCE(class_id, ''), class_name, COALESCE(arm_id, ''), COALESCE(arm_name, ''),
		       COALESCE(term_name, 'First Term'), COALESCE(term, 'First Term'), COALESCE(session, '2026/2027'),
		       COALESCE(tuition_fee, 0), COALESCE(development_levy, 0), COALESCE(ict_stem_fee, 0),
		       COALESCE(exam_materials_fee, 0), COALESCE(other_charges, 0), COALESCE(discount_amount, 0),
		       COALESCE(total_billed, total_amount, 0), COALESCE(amount_paid, 0),
		       COALESCE(balance_due, balance, 0), COALESCE(status, 'UNPAID'),
		       COALESCE(payment_method, 'Pending'), COALESCE(payment_reference, ''), COALESCE(due_date, ''),
		       COALESCE(parent_name, ''), COALESCE(parent_phone, ''),
		       paid_at, last_payment_at, COALESCE(created_at, CURRENT_TIMESTAMP), COALESCE(updated_at, CURRENT_TIMESTAMP)
		FROM campus_student_invoices
		WHERE tenant_id = ?
	`
	iArgs := []interface{}{tenantID}

	if statusFilter != "" && statusFilter != "ALL" {
		iQuery += " AND status = ?"
		iArgs = append(iArgs, statusFilter)
	}
	if className != "" && className != "ALL" {
		iQuery += " AND (class_name = ? OR arm_name = ?)"
		iArgs = append(iArgs, className, className)
	}
	if termFilter != "" && termFilter != "ALL" {
		iQuery += " AND (term_name = ? OR term = ?)"
		iArgs = append(iArgs, termFilter, termFilter)
	}
	if search != "" {
		iQuery += " AND (LOWER(student_name) LIKE ? OR LOWER(invoice_no) LIKE ? OR LOWER(admission_number) LIKE ?)"
		pattern := "%" + search + "%"
		iArgs = append(iArgs, pattern, pattern, pattern)
	}

	iQuery += " ORDER BY created_at DESC"

	iRows, err := db.DB.Query(iQuery, iArgs...)
	if err == nil && iRows != nil {
		defer iRows.Close()
		for iRows.Next() {
			var inv CampusStudentInvoiceRecord
			if err := iRows.Scan(
				&inv.ID, &inv.TenantID, &inv.InvoiceNo, &inv.StudentID, &inv.AdmissionNumber,
				&inv.StudentName, &inv.ClassID, &inv.ClassName, &inv.ArmID, &inv.ArmName,
				&inv.TermName, &inv.Term, &inv.Session,
				&inv.TuitionFee, &inv.DevelopmentLevy, &inv.ICTStemFee,
				&inv.ExamMaterialsFee, &inv.OtherCharges, &inv.DiscountAmount,
				&inv.TotalBilled, &inv.AmountPaid,
				&inv.BalanceDue, &inv.Status,
				&inv.PaymentMethod, &inv.PaymentReference, &inv.DueDate,
				&inv.ParentName, &inv.ParentPhone,
				&inv.PaidAt, &inv.LastPaymentAt, &inv.CreatedAt, &inv.UpdatedAt,
			); err == nil {
				invoices = append(invoices, inv)
			}
		}
	}

	// 3. Fetch Payment Transaction Ledger
	payments := []CampusFeePaymentRecord{}
	pQuery := `
		SELECT id, tenant_id, invoice_id, COALESCE(student_id, ''), student_name, COALESCE(admission_number, ''),
		       class_name, amount, COALESCE(payment_method, 'Paystack DVA'), reference, receipt_no,
		       COALESCE(paid_by, ''), COALESCE(recorded_by, 'Bursary Admin'), payment_date,
		       COALESCE(status, 'CONFIRMED'), COALESCE(notes, ''), COALESCE(created_at, CURRENT_TIMESTAMP)
		FROM campus_fee_payments
		WHERE tenant_id = ?
		ORDER BY created_at DESC
	`
	pRows, err := db.DB.Query(pQuery, tenantID)
	if err == nil && pRows != nil {
		defer pRows.Close()
		for pRows.Next() {
			var p CampusFeePaymentRecord
			if err := pRows.Scan(
				&p.ID, &p.TenantID, &p.InvoiceID, &p.StudentID, &p.StudentName, &p.AdmissionNumber,
				&p.ClassName, &p.Amount, &p.PaymentMethod, &p.Reference, &p.ReceiptNo,
				&p.PaidBy, &p.RecordedBy, &p.PaymentDate,
				&p.Status, &p.Notes, &p.CreatedAt,
			); err == nil {
				payments = append(payments, p)
			}
		}
	}

	// 4. Compute Live Summary Metrics from All Invoices for this Tenant
	var summary CampusFinancialSummary
	_ = db.DB.QueryRow(`
		SELECT 
			COALESCE(SUM(amount_paid), 0),
			COALESCE(SUM(total_billed), 0),
			COALESCE(SUM(balance_due), 0),
			COUNT(*),
			COALESCE(SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN status != 'PAID' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN balance_due >= 100000 THEN 1 ELSE 0 END), 0)
		FROM campus_student_invoices
		WHERE tenant_id = ?
	`, tenantID).Scan(
		&summary.TotalCollected,
		&summary.TotalBilled,
		&summary.TotalOutstanding,
		&summary.InvoicesCount,
		&summary.ClearedCount,
		&summary.PendingCount,
		&summary.CriticalDebtorsCount,
	)

	if summary.TotalBilled > 0 {
		summary.CollectionRate = int(summary.TotalCollected / summary.TotalBilled * 100)
	} else {
		summary.CollectionRate = 100
	}
	summary.StructuresCount = len(structures)
	summary.PaymentsCount = len(payments)

	// 5. Debtors with Aging & Contact Details
	debtors := []map[string]interface{}{}
	for _, inv := range invoices {
		if inv.BalanceDue > 0 {
			agingCategory := "Current (0-30 Days)"
			if inv.DueDate != "" {
				if dueT, err := time.Parse("2006-01-02", inv.DueDate); err == nil {
					diffDays := int(time.Since(dueT).Hours() / 24)
					if diffDays > 60 {
						agingCategory = "Critical Overdue (60+ Days)"
					} else if diffDays > 30 {
						agingCategory = "Overdue (31-60 Days)"
					}
				}
			}
			debtors = append(debtors, map[string]interface{}{
				"invoice_id":       inv.ID,
				"invoice_no":       inv.InvoiceNo,
				"student_id":       inv.StudentID,
				"student_name":     inv.StudentName,
				"admission_number": inv.AdmissionNumber,
				"class_name":       inv.ClassName,
				"total_billed":     inv.TotalBilled,
				"amount_paid":      inv.AmountPaid,
				"balance_due":      inv.BalanceDue,
				"status":           inv.Status,
				"due_date":         inv.DueDate,
				"aging_category":   agingCategory,
				"parent_name":      inv.ParentName,
				"parent_phone":     inv.ParentPhone,
			})
		}
	}

	// 6. Fetch Metadata for Dropdowns (Enrolled students and class arms)
	classArms := []map[string]interface{}{}
	armRows, _ := db.DB.Query(`
		SELECT a.id, a.name, c.name, COALESCE(a.enrolled_students, 0)
		FROM campus_class_arms a
		LEFT JOIN campus_classes c ON a.class_id = c.id
		WHERE a.tenant_id = ?
		ORDER BY c.level_order ASC, a.name ASC
	`, tenantID)
	if armRows != nil {
		defer armRows.Close()
		for armRows.Next() {
			var armID, armName, clsName string
			var enrolled int
			if err := armRows.Scan(&armID, &armName, &clsName, &enrolled); err == nil {
				classArms = append(classArms, map[string]interface{}{
					"arm_id":     armID,
					"arm_name":   armName,
					"class_name": clsName,
					"enrolled":   enrolled,
				})
			}
		}
	}

	students := []map[string]interface{}{}
	stuRows, _ := db.DB.Query(`
		SELECT s.student_id, s.student_name, COALESCE(s.admission_number, ''),
		       s.arm_id, COALESCE(a.name, ''), COALESCE(c.name, '')
		FROM campus_class_students s
		LEFT JOIN campus_class_arms a ON s.arm_id = a.id
		LEFT JOIN campus_classes c ON a.class_id = c.id
		WHERE s.tenant_id = ?
		ORDER BY s.student_name ASC
		LIMIT 200
	`, tenantID)
	if stuRows != nil {
		defer stuRows.Close()
		for stuRows.Next() {
			var sid, sname, adm, aid, aname, cname string
			if err := stuRows.Scan(&sid, &sname, &adm, &aid, &aname, &cname); err == nil {
				students = append(students, map[string]interface{}{
					"student_id":       sid,
					"student_name":     sname,
					"admission_number": adm,
					"arm_id":           aid,
					"arm_name":         aname,
					"class_name":       cname,
				})
			}
		}
	}

	response := map[string]interface{}{
		"success":        true,
		"tenant_id":      tenantID,
		"summary":        summary,
		"fee_structures": structures,
		"invoices":       invoices,
		"payments":       payments,
		"debtors":        debtors,
		"class_arms":     classArms,
		"students":       students,
		"tab":            tab,
	}

	JSONResponse(w, http.StatusOK, response)
}

func postCampusFinancials(w http.ResponseWriter, r *http.Request, tenantID string) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	action, _ := body["action"].(string)
	recordType, _ := body["record_type"].(string)

	switch {
	case action == "record_payment":
		recordFeePaymentTransaction(w, tenantID, body)

	case action == "bulk_generate_invoices":
		bulkGenerateStudentInvoices(w, tenantID, body)

	case action == "create_structure" || recordType == "structure" || (action == "" && recordType != "invoice"):
		saveFeeStructureRecord(w, tenantID, body)

	default: // Default is create single invoice
		saveSingleStudentInvoice(w, tenantID, body)
	}
}

func saveFeeStructureRecord(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	id, _ := body["id"].(string)
	if id == "" {
		id = "fee-" + uuid.New().String()
	}

	title, _ := body["title"].(string)
	if title == "" {
		title = "Tuition & Institutional Levy"
	}
	category, _ := body["category"].(string)
	if category == "" {
		category = "TUITION"
	}
	classLevel, _ := body["class_level"].(string)
	if classLevel == "" {
		classLevel = "All Levels"
	}
	termName, _ := body["term_name"].(string)
	if termName == "" {
		termName = "First Term"
	}
	session, _ := body["session"].(string)
	if session == "" {
		session = "2026/2027"
	}

	tuitionFee, _ := body["tuition_fee"].(float64)
	devLevy, _ := body["development_levy"].(float64)
	ictFee, _ := body["ict_stem_fee"].(float64)
	examFee, _ := body["exam_materials_fee"].(float64)

	totalDue, _ := body["total_due"].(float64)
	if totalDue == 0 {
		totalDue = tuitionFee + devLevy + ictFee + examFee
	}
	if totalDue == 0 {
		if amt, ok := body["amount"].(float64); ok && amt > 0 {
			totalDue = amt
			tuitionFee = amt
		}
	}

	isMandatory := true
	if m, ok := body["is_mandatory"].(bool); ok {
		isMandatory = m
	}
	dueDate, _ := body["due_date"].(string)

	query := `
		INSERT INTO campus_fee_structures (
			id, tenant_id, title, category, class_level, term_name, term, session,
			amount, tuition_fee, development_levy, ict_stem_fee, exam_materials_fee,
			total_due, is_mandatory, due_date, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT (id) DO UPDATE SET
			title = EXCLUDED.title,
			category = EXCLUDED.category,
			class_level = EXCLUDED.class_level,
			term_name = EXCLUDED.term_name,
			term = EXCLUDED.term,
			session = EXCLUDED.session,
			amount = EXCLUDED.amount,
			tuition_fee = EXCLUDED.tuition_fee,
			development_levy = EXCLUDED.development_levy,
			ict_stem_fee = EXCLUDED.ict_stem_fee,
			exam_materials_fee = EXCLUDED.exam_materials_fee,
			total_due = EXCLUDED.total_due,
			is_mandatory = EXCLUDED.is_mandatory,
			due_date = EXCLUDED.due_date,
			updated_at = CURRENT_TIMESTAMP
	`
	_, err := db.DB.Exec(query,
		id, tenantID, title, category, classLevel, termName, termName, session,
		totalDue, tuitionFee, devLevy, ictFee, examFee,
		totalDue, isMandatory, dueDate,
	)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to save fee structure: "+err.Error())
		return
	}

	JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"id":      id,
		"message": "Fee structure saved successfully",
	})
}

func saveSingleStudentInvoice(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	id := uuid.New().String()
	invNo := fmt.Sprintf("INV-%d-%s", time.Now().Year(), strings.ToUpper(id[:4]))

	studentID, _ := body["student_id"].(string)
	admissionNumber, _ := body["admission_number"].(string)
	studentName, _ := body["student_name"].(string)
	if studentName == "" {
		JSONError(w, http.StatusBadRequest, "Student name is required")
		return
	}

	classID, _ := body["class_id"].(string)
	className, _ := body["class_name"].(string)
	if className == "" {
		className = "General"
	}
	armID, _ := body["arm_id"].(string)
	armName, _ := body["arm_name"].(string)

	termName, _ := body["term_name"].(string)
	if termName == "" {
		termName = "First Term"
	}
	session, _ := body["session"].(string)
	if session == "" {
		session = "2026/2027"
	}

	tuitionFee, _ := body["tuition_fee"].(float64)
	devLevy, _ := body["development_levy"].(float64)
	ictFee, _ := body["ict_stem_fee"].(float64)
	examFee, _ := body["exam_materials_fee"].(float64)
	otherCharges, _ := body["other_charges"].(float64)
	discountAmount, _ := body["discount_amount"].(float64)

	totalBilled, _ := body["total_billed"].(float64)
	if totalBilled == 0 {
		totalBilled = (tuitionFee + devLevy + ictFee + examFee + otherCharges) - discountAmount
	}

	initialDeposit, _ := body["amount_paid"].(float64)
	balanceDue := totalBilled - initialDeposit
	status := "UNPAID"
	if balanceDue <= 0 && totalBilled > 0 {
		status = "PAID"
		balanceDue = 0
	} else if initialDeposit > 0 {
		status = "PARTIAL"
	}

	paymentMethod, _ := body["payment_method"].(string)
	if paymentMethod == "" {
		paymentMethod = "Paystack DVA"
	}
	paymentRef, _ := body["payment_reference"].(string)
	dueDate, _ := body["due_date"].(string)
	parentName, _ := body["parent_name"].(string)
	parentPhone, _ := body["parent_phone"].(string)

	query := `
		INSERT INTO campus_student_invoices (
			id, tenant_id, invoice_no, student_id, admission_number, student_name,
			class_id, class_name, arm_id, arm_name, term_name, term, session,
			tuition_fee, development_levy, ict_stem_fee, exam_materials_fee,
			other_charges, discount_amount, total_billed, total_amount,
			amount_paid, balance_due, balance, status, payment_method,
			payment_reference, due_date, parent_name, parent_phone,
			last_payment_at, created_at, updated_at
		) VALUES (
			?, ?, ?, ?, ?, ?,
			?, ?, ?, ?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?, ?,
			?, ?, ?, ?,
			CASE WHEN ? > 0 THEN CURRENT_TIMESTAMP ELSE NULL END,
			CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
		)
	`
	_, err := db.DB.Exec(query,
		id, tenantID, invNo, studentID, admissionNumber, studentName,
		classID, className, armID, armName, termName, termName, session,
		tuitionFee, devLevy, ictFee, examFee,
		otherCharges, discountAmount, totalBilled, totalBilled,
		initialDeposit, balanceDue, balanceDue, status, paymentMethod,
		paymentRef, dueDate, parentName, parentPhone,
		initialDeposit,
	)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to create invoice: "+err.Error())
		return
	}

	// If initial deposit was made, automatically record the payment transaction ledger entry
	if initialDeposit > 0 {
		receiptNo := fmt.Sprintf("REC-%d-%s", time.Now().Year(), strings.ToUpper(id[:4]))
		payRef := paymentRef
		if payRef == "" {
			payRef = "INIT-DEP-" + strings.ToUpper(id[:6])
		}
		_, _ = db.DB.Exec(`
			INSERT INTO campus_fee_payments (
				id, tenant_id, invoice_id, student_id, student_name, admission_number,
				class_name, amount, payment_method, reference, receipt_no,
				paid_by, recorded_by, payment_date, status, notes
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Bursary Admin', ?, 'CONFIRMED', 'Initial deposit at invoice issuance')
		`, uuid.New().String(), tenantID, id, studentID, studentName, admissionNumber,
			className, initialDeposit, paymentMethod, payRef, receiptNo,
			parentName, time.Now().Format("2006-01-02"),
		)
	}

	JSONResponse(w, http.StatusCreated, map[string]interface{}{
		"success":    true,
		"id":         id,
		"invoice_no": invNo,
		"message":    "Student fee invoice issued successfully",
	})
}

func recordFeePaymentTransaction(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	invoiceID, _ := body["invoice_id"].(string)
	if invoiceID == "" {
		JSONError(w, http.StatusBadRequest, "Invoice ID is required")
		return
	}

	amount, _ := body["amount"].(float64)
	if amount <= 0 {
		JSONError(w, http.StatusBadRequest, "Payment amount must be greater than zero")
		return
	}

	paymentMethod, _ := body["payment_method"].(string)
	if paymentMethod == "" {
		paymentMethod = "Paystack DVA"
	}
	reference, _ := body["reference"].(string)
	if reference == "" {
		reference = fmt.Sprintf("PAY-%d-%s", time.Now().Unix(), strings.ToUpper(uuid.New().String()[:5]))
	}
	paidBy, _ := body["paid_by"].(string)
	notes, _ := body["notes"].(string)
	paymentDate, _ := body["payment_date"].(string)
	if paymentDate == "" {
		paymentDate = time.Now().Format("2006-01-02")
	}

	// 1. Fetch current invoice record
	var currentBilled, currentPaid, currentBal float64
	var studentID, studentName, admissionNumber, className string
	err := db.DB.QueryRow(`
		SELECT COALESCE(total_billed, total_amount, 0), COALESCE(amount_paid, 0), COALESCE(balance_due, balance, 0),
		       COALESCE(student_id, ''), student_name, COALESCE(admission_number, ''), class_name
		FROM campus_student_invoices
		WHERE id = ? AND tenant_id = ?
	`, invoiceID, tenantID).Scan(
		&currentBilled, &currentPaid, &currentBal,
		&studentID, &studentName, &admissionNumber, &className,
	)
	if err != nil {
		JSONError(w, http.StatusNotFound, "Student invoice not found for this tenant")
		return
	}

	// 2. Compute updated balances
	newPaid := currentPaid + amount
	newBal := currentBilled - newPaid
	status := "PARTIAL"
	if newBal <= 0 {
		newBal = 0
		status = "PAID"
	}

	// 3. Generate Official Receipt Number
	paymentID := uuid.New().String()
	receiptNo := fmt.Sprintf("REC-%d-%s", time.Now().Year(), strings.ToUpper(paymentID[:6]))

	// 4. Update Invoice Record
	_, err = db.DB.Exec(`
		UPDATE campus_student_invoices
		SET amount_paid = ?, balance_due = ?, balance = ?, status = ?,
		    payment_method = ?, payment_reference = ?,
		    last_payment_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
		WHERE id = ? AND tenant_id = ?
	`, newPaid, newBal, newBal, status, paymentMethod, reference, invoiceID, tenantID)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to update invoice balances: "+err.Error())
		return
	}

	// 5. Insert Immutable Payment Transaction Record
	_, err = db.DB.Exec(`
		INSERT INTO campus_fee_payments (
			id, tenant_id, invoice_id, student_id, student_name, admission_number,
			class_name, amount, payment_method, reference, receipt_no,
			paid_by, recorded_by, payment_date, status, notes, created_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Bursary Admin', ?, 'CONFIRMED', ?, CURRENT_TIMESTAMP)
	`, paymentID, tenantID, invoiceID, studentID, studentName, admissionNumber,
		className, amount, paymentMethod, reference, receiptNo,
		paidBy, paymentDate, notes,
	)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to record payment transaction: "+err.Error())
		return
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":        true,
		"receipt_no":     receiptNo,
		"payment_id":     paymentID,
		"invoice_id":     invoiceID,
		"amount_paid":    amount,
		"new_total_paid": newPaid,
		"balance_due":    newBal,
		"status":         status,
		"message":        fmt.Sprintf("Payment of ₦%.2f recorded successfully (Receipt %s)", amount, receiptNo),
	})
}

func bulkGenerateStudentInvoices(w http.ResponseWriter, tenantID string, body map[string]interface{}) {
	armID, _ := body["arm_id"].(string)
	structureID, _ := body["fee_structure_id"].(string)
	termName, _ := body["term_name"].(string)
	if termName == "" {
		termName = "First Term"
	}
	session, _ := body["session"].(string)
	if session == "" {
		session = "2026/2027"
	}
	dueDate, _ := body["due_date"].(string)

	if armID == "" {
		JSONError(w, http.StatusBadRequest, "Target class arm is required")
		return
	}
	if structureID == "" {
		JSONError(w, http.StatusBadRequest, "Billing fee structure template is required")
		return
	}

	// 1. Fetch Fee Structure Template
	var title string
	var tuition, dev, ict, exam, total float64
	err := db.DB.QueryRow(`
		SELECT COALESCE(title, 'Tuition'), COALESCE(tuition_fee, amount, 0),
		       COALESCE(development_levy, 0), COALESCE(ict_stem_fee, 0),
		       COALESCE(exam_materials_fee, 0), COALESCE(total_due, amount, 0)
		FROM campus_fee_structures
		WHERE id = ? AND tenant_id = ?
	`, structureID, tenantID).Scan(&title, &tuition, &dev, &ict, &exam, &total)
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Selected fee structure was not found")
		return
	}
	if total == 0 {
		total = tuition + dev + ict + exam
	}

	// 2. Fetch Arm & Class Details
	var armName, classID, className string
	_ = db.DB.QueryRow(`
		SELECT a.name, COALESCE(a.class_id, ''), COALESCE(c.name, '')
		FROM campus_class_arms a
		LEFT JOIN campus_classes c ON a.class_id = c.id
		WHERE a.id = ? AND a.tenant_id = ?
	`, armID, tenantID).Scan(&armName, &classID, &className)

	// 3. Fetch Enrolled Students in this arm
	rows, err := db.DB.Query(`
		SELECT student_id, student_name, COALESCE(admission_number, '')
		FROM campus_class_students
		WHERE arm_id = ? AND tenant_id = ?
	`, armID, tenantID)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to read students in arm: "+err.Error())
		return
	}
	defer rows.Close()

	generatedCount := 0
	skippedCount := 0

	for rows.Next() {
		var sid, sname, adm string
		if err := rows.Scan(&sid, &sname, &adm); err == nil {
			// Check if invoice already exists for this student + term
			var existingID string
			_ = db.DB.QueryRow(`
				SELECT id FROM campus_student_invoices
				WHERE tenant_id = ? AND student_name = ? AND term_name = ? AND session = ?
			`, tenantID, sname, termName, session).Scan(&existingID)

			if existingID != "" {
				skippedCount++
				continue
			}

			newInvID := uuid.New().String()
			invNo := fmt.Sprintf("INV-%d-%s", time.Now().Year(), strings.ToUpper(newInvID[:4]))

			_, insertErr := db.DB.Exec(`
				INSERT INTO campus_student_invoices (
					id, tenant_id, invoice_no, student_id, admission_number, student_name,
					class_id, class_name, arm_id, arm_name, term_name, term, session,
					tuition_fee, development_levy, ict_stem_fee, exam_materials_fee,
					total_billed, total_amount, amount_paid, balance_due, balance,
					status, payment_method, due_date, created_at, updated_at
				) VALUES (
					?, ?, ?, ?, ?, ?,
					?, ?, ?, ?, ?, ?, ?,
					?, ?, ?, ?,
					?, ?, 0, ?, ?,
					'UNPAID', 'Pending', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
				)
			`, newInvID, tenantID, invNo, sid, adm, sname,
				classID, className, armID, armName, termName, termName, session,
				tuition, dev, ict, exam,
				total, total, total, total,
				dueDate,
			)
			if insertErr == nil {
				generatedCount++
			}
		}
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success":         true,
		"generated_count": generatedCount,
		"skipped_count":   skippedCount,
		"message":         fmt.Sprintf("Successfully generated %d invoices for %s (%d skipped as already billed)", generatedCount, armName, skippedCount),
	})
}

func putCampusFinancials(w http.ResponseWriter, r *http.Request, tenantID string) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	invoiceID, _ := body["id"].(string)
	if invoiceID == "" {
		invoiceID, _ = body["invoice_id"].(string)
	}
	if invoiceID == "" {
		JSONError(w, http.StatusBadRequest, "Invoice ID is required")
		return
	}

	// If amount_paid is sent, recalculate balance
	if amtPaid, ok := body["amount_paid"].(float64); ok {
		var totalBilled float64
		_ = db.DB.QueryRow("SELECT COALESCE(total_billed, total_amount, 0) FROM campus_student_invoices WHERE id = ? AND tenant_id = ?", invoiceID, tenantID).Scan(&totalBilled)

		bal := totalBilled - amtPaid
		status := "PARTIAL"
		if bal <= 0 {
			bal = 0
			status = "PAID"
		} else if amtPaid <= 0 {
			status = "UNPAID"
		}

		method, _ := body["payment_method"].(string)
		_, err := db.DB.Exec(`
			UPDATE campus_student_invoices
			SET amount_paid = ?, balance_due = ?, balance = ?, status = ?,
			    payment_method = COALESCE(NULLIF(?, ''), payment_method),
			    last_payment_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?
		`, amtPaid, bal, bal, status, method, invoiceID, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to update invoice: "+err.Error())
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Invoice updated successfully"})
		return
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "No changes performed"})
}

func deleteCampusFinancials(w http.ResponseWriter, r *http.Request, tenantID string) {
	id := r.URL.Query().Get("id")
	if id == "" {
		JSONError(w, http.StatusBadRequest, "Record ID is required")
		return
	}
	recordType := r.URL.Query().Get("type")

	switch recordType {
	case "structure":
		_, err := db.DB.Exec("DELETE FROM campus_fee_structures WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to delete fee structure: "+err.Error())
			return
		}
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Fee structure deleted"})

	case "payment":
		// Deleting a payment rolls back invoice amount_paid
		var invID string
		var payAmt float64
		_ = db.DB.QueryRow("SELECT invoice_id, amount FROM campus_fee_payments WHERE id = ? AND tenant_id = ?", id, tenantID).Scan(&invID, &payAmt)

		_, _ = db.DB.Exec("DELETE FROM campus_fee_payments WHERE id = ? AND tenant_id = ?", id, tenantID)
		if invID != "" && payAmt > 0 {
			_, _ = db.DB.Exec(`
				UPDATE campus_student_invoices
				SET amount_paid = GREATEST(0, amount_paid - ?),
				    balance_due = balance_due + ?,
				    balance = balance + ?,
				    status = CASE WHEN (amount_paid - ?) <= 0 THEN 'UNPAID' ELSE 'PARTIAL' END,
				    updated_at = CURRENT_TIMESTAMP
				WHERE id = ? AND tenant_id = ?
			`, payAmt, payAmt, payAmt, payAmt, invID, tenantID)
		}
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Payment transaction deleted and ledger adjusted"})

	default: // invoice
		_, err := db.DB.Exec("DELETE FROM campus_student_invoices WHERE id = ? AND tenant_id = ?", id, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to delete invoice: "+err.Error())
			return
		}
		// Also clean up associated payment ledger entries
		_, _ = db.DB.Exec("DELETE FROM campus_fee_payments WHERE invoice_id = ? AND tenant_id = ?", id, tenantID)
		JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Invoice and related payments deleted"})
	}
}

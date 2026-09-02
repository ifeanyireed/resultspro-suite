package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dsn := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	if envDsn := os.Getenv("DATABASE_URL"); envDsn != "" {
		dsn = envDsn
	}
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Println("Error connecting:", err)
		return
	}
	defer db.Close()

	// Insert Plans
	plans := []struct {
		ID           string
		Name         string
		Monthly      float64
		Annual       float64
		MaxStudents  int
		MaxTeachers  int
		MaxResults   int
		Storage      int
		Features     string
	}{
		{"plan-1", "Free", 0, 0, 100, 15, 100, 2, `["Basic report cards", "15 Teachers", "Free ExamsPRO"]`},
		{"plan-2", "Starter", 15000, 144000, 500, 50, 500, 15, `["Standard CBT", "Scratch card PIN access", "50 Teachers"]`},
		{"plan-3", "Pro", 35000, 336000, 2000, 300, 2000, 50, `["SMS Notifications", "Advanced Analytics", "TutorsPRO integration"]`},
		{"plan-4", "Enterprise", 80000, 768000, 999999, 999999, 999999, 500, `["Custom Domain", "White-labeling", "Dedicated Account Manager"]`},
	}

	for _, p := range plans {
		_, err := db.Exec(`
			INSERT IGNORE INTO plans (id, name, monthly_price, annual_price, max_students, max_teachers, max_results_per_term, storage_gb, features, is_active)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true)
		`, p.ID, p.Name, p.Monthly, p.Annual, p.MaxStudents, p.MaxTeachers, p.MaxResults, p.Storage, p.Features)
		if err != nil {
			fmt.Println("Error inserting plan:", err)
		}
	}

	// Insert Dummy Invoices
	invoices := []struct {
		ID       string
		TenantID string
		PlanID   string
		PlanName string
		InvoiceN string
		Amount   float64
		Status   string
		Cycle    string
	}{
		{"inv-1", "tenant-1", "plan-3", "Pro", "INV-2026-001", 336000, "PAID", "ANNUAL"},
		{"inv-2", "tenant-2", "plan-4", "Enterprise", "INV-2026-002", 768000, "PENDING", "ANNUAL"},
	}

	for _, inv := range invoices {
		_, err := db.Exec(`
			INSERT IGNORE INTO invoices (id, tenant_id, plan_id, plan_name, invoice_number, amount, status, billing_cycle, due_date, created_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), NOW())
		`, inv.ID, inv.TenantID, inv.PlanID, inv.PlanName, inv.InvoiceN, inv.Amount, inv.Status, inv.Cycle)
		if err != nil {
			fmt.Println("Error inserting invoice:", err)
		}
	}

	fmt.Println("Database seeded with plans and invoices!")
}

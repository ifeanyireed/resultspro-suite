package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dbUrl := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dbUrl)
	if err != nil { log.Fatal(err) }
	defer db.Close()

	// Check if any subject exists for exam_id >= 6 where deleted_at IS NULL
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM nat_exams_subjects WHERE exam_id >= 6 AND deleted_at IS NULL").Scan(&count)
	fmt.Printf("Active Post UTME subjects: %d\n", count)

	err = db.QueryRow("SELECT COUNT(*) FROM nat_exams_subjects WHERE exam_id >= 6 AND deleted_at IS NOT NULL").Scan(&count)
	fmt.Printf("Soft-deleted Post UTME subjects: %d\n", count)
}

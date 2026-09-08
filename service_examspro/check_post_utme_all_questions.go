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

	var count int
	err = db.QueryRow(`
		SELECT COUNT(q.id) 
		FROM nat_exams_questions q
		JOIN nat_exams_topics t ON q.topic_id = t.id
		JOIN nat_exams_subjects s ON t.subject_id = s.id
		WHERE s.exam_id >= 6 AND s.exam_id <= 19
	`).Scan(&count)
	if err != nil { log.Fatal(err) }
	
	fmt.Printf("Total questions for Post UTME exams (including deleted): %d\n", count)
	
	var subjectCount int
	db.QueryRow("SELECT COUNT(*) FROM nat_exams_subjects WHERE exam_id >= 6 AND exam_id <= 19").Scan(&subjectCount)
	fmt.Printf("Total subjects for Post UTME exams (including deleted): %d\n", subjectCount)

	var activeSubjectCount int
	db.QueryRow("SELECT COUNT(*) FROM nat_exams_subjects WHERE exam_id >= 6 AND exam_id <= 19 AND deleted_at IS NULL").Scan(&activeSubjectCount)
	fmt.Printf("Active subjects for Post UTME exams: %d\n", activeSubjectCount)
}

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

	// Check if active Post UTME subjects have questions
	var questionCount int
	err = db.QueryRow(`
		SELECT COUNT(q.id) 
		FROM nat_exams_questions q
		JOIN nat_exams_topics t ON q.topic_id = t.id
		JOIN nat_exams_subjects s ON t.subject_id = s.id
		WHERE s.exam_id >= 6 
		AND q.deleted_at IS NULL 
		AND t.deleted_at IS NULL 
		AND s.deleted_at IS NULL
	`).Scan(&questionCount)
	fmt.Printf("Active questions for Post UTME exams: %d\n", questionCount)
}

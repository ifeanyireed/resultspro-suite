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
	rows, err := db.Query(`
		SELECT s.exam_id, t.id, t.name, COUNT(q.id) 
		FROM nat_exams_questions q
		JOIN nat_exams_topics t ON q.topic_id = t.id
		JOIN nat_exams_subjects s ON t.subject_id = s.id
		WHERE s.exam_id >= 6 
		AND q.deleted_at IS NULL 
		AND t.deleted_at IS NULL 
		AND s.deleted_at IS NULL
		GROUP BY s.exam_id, t.id, t.name
	`)
	if err != nil { log.Fatal(err) }
	defer rows.Close()
	
	fmt.Println("Topic IDs with questions:")
	for rows.Next() {
	    var examID, topicID, count int
	    var name string
	    rows.Scan(&examID, &topicID, &name, &count)
	    fmt.Printf("Exam: %d, Topic: %d (%s) - %d questions\n", examID, topicID, name, count)
	}
}

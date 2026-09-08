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

	rows, err := db.Query("SELECT id, name, category, deleted_at FROM nat_exams_exams ORDER BY id")
	if err != nil { log.Fatal(err) }
	defer rows.Close()
	
	for rows.Next() {
	    var id int
	    var name, category string
		var deletedAt sql.NullString
	    rows.Scan(&id, &name, &category, &deletedAt)
	    fmt.Printf("ID: %d, Name: %s, Category: %s, Deleted: %v\n", id, name, category, deletedAt.Valid)
	}
}

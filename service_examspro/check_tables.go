package main

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dbUrl := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dbUrl)
	if err != nil { panic(err) }
	defer db.Close()

	rows, err := db.Query("SHOW TABLES")
	if err != nil { panic(err) }
	for rows.Next() {
		var table string
		rows.Scan(&table)
		fmt.Println(table)
	}
}

package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, secret_key FROM apps")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer rows.Close()

	fmt.Println("Apps:")
	for rows.Next() {
		var id, secret string
		rows.Scan(&id, &secret)
		fmt.Printf("- %s: %s\n", id, secret)
	}
}

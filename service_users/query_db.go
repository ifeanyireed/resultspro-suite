package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "postgresql://neondb_owner:npg_PlmqORh64gNG@ep-steep-bar-ayq6g77r-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	var defaultSubdomain sql.NullString
    var customDomain sql.NullString
	err = db.QueryRow("SELECT default_subdomain, custom_domain FROM tenants WHERE slug = 'skillupacademy'").Scan(&defaultSubdomain, &customDomain)
	if err != nil {
		log.Fatal(err)
	}
    fmt.Printf("Default Subdomain: %s, Custom Domain: %s\n", defaultSubdomain.String, customDomain.String)
}

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

    rows, err := db.Query("SELECT id, name, tenant_id FROM nat_exams_exams LIMIT 5")
	if err != nil { log.Fatal(err) }
	defer rows.Close()

	for rows.Next() {
		var id int
		var name string
		var tenantID sql.NullString
		if err := rows.Scan(&id, &name, &tenantID); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("Exam: %d - %s (Tenant: %v)\n", id, name, tenantID.String)
	}
}

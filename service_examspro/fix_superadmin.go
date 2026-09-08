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

    res, err := db.Exec("UPDATE users SET role = 'ADMIN' WHERE email = 'superadmin@resultspro.ng'")
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		affected, _ := res.RowsAffected()
		fmt.Printf("Updated %d rows. Superadmin is now ADMIN!\n", affected)
	}
}

package main
import (
	"database/sql"
	"fmt"
	"os"
	_ "github.com/lib/pq"
)
func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil { panic(err) }
	
	var id, email string
	err = db.QueryRow("SELECT id, email FROM users WHERE email ILIKE '%student%'").Scan(&id, &email)
	if err != nil {
	    fmt.Println("Error:", err)
	} else {
	    fmt.Println("Found:", id, email)
	}
}

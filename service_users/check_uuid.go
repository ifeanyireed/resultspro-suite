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
	
	var email string
	err = db.QueryRow("SELECT email FROM users WHERE id = '111efa7d-e12d-4ed1-9902-d341c6826b50'").Scan(&email)
	if err != nil {
	    fmt.Println("Error:", err)
	} else {
	    fmt.Println("Found Email:", email)
	}
}

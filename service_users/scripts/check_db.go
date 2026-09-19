package main
import (
	"database/sql"
	"fmt"
	"os"
	_ "github.com/lib/pq"
)
func main() {
	db, _ := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	var id, email, pass string
	err := db.QueryRow("SELECT id, email, password_hash FROM users WHERE email = 'admin@resultspro.ng'").Scan(&id, &email, &pass)
	fmt.Println(id, email, pass, err)
}

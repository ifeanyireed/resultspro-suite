package main
import (
	"database/sql"
	"fmt"
	"os"
	_ "github.com/lib/pq"
)
func main() {
	db, _ := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	ids := []string{"bfb51c68-ccb0-401f-b58f-27fd41c6a856", "8d3a7776-5d21-4f1e-9a6d-e4c1d63e9f02", "2db093ed-bdc9-47c4-b71c-66869f0f1ea7", "111efa7d-e12d-4ed1-9902-d341c6826b50", "dac38ffd-866f-47ab-8ac4-ecf6ea520ba8", "999efa7d-e12d-4ed1-9902-d341c6826b99"}
	for _, id := range ids {
		var email string
		db.QueryRow("SELECT email FROM users WHERE id = $1", id).Scan(&email)
		fmt.Printf("ID %s -> Email: %s\n", id, email)
	}
}

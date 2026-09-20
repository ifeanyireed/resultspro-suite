package main
import (
	"database/sql"
	"fmt"
	"os"
	"time"
	_ "github.com/lib/pq"
)
func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil { panic(err) }
	
	// Query user ID
	var id string
	err = db.QueryRow("SELECT id FROM users WHERE email = 'student@resultspro.ng'").Scan(&id)
	if err != nil { fmt.Println("User not found:", err); return }
	
	// Insert into user_apps
	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	_, err = db.Exec("INSERT INTO user_apps (user_id, app_id, last_login_at) VALUES ($1, 'tutorspro', $2) ON CONFLICT DO NOTHING", id, now)
	if err != nil {
	    // ON CONFLICT DO NOTHING might fail if no unique constraint or if postgres syntax is different.
		fmt.Println("Insert apps Error:", err)
		// Try without conflict
		_, err = db.Exec("INSERT INTO user_apps (user_id, app_id, last_login_at) VALUES ($1, 'tutorspro', $2)", id, now)
		if err != nil {
		    fmt.Println("Fallback Insert apps Error:", err)
		}
	} else {
	    fmt.Println("Successfully added tutorspro to user_apps for student@resultspro.ng")
	}
}

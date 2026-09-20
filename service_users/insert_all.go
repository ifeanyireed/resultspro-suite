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
	
	emails := []string{
	    "student@resultspro.ng",
	    "parent@resultspro.ng",
	    "teacher@resultspro.ng",
	    "admin@resultspro.ng",
	    "superadmin@resultspro.ng",
	}
	
	now := time.Now().UTC().Format("2006-01-02 15:04:05")
	for _, email := range emails {
	    var id string
	    err = db.QueryRow("SELECT id FROM users WHERE email = $1", email).Scan(&id)
	    if err != nil { fmt.Println("User not found:", email); continue }
	    
	    _, err = db.Exec("INSERT INTO user_apps (user_id, app_id, last_login_at) VALUES ($1, 'tutorspro', $2) ON CONFLICT DO NOTHING", id, now)
	    if err != nil {
	        _, _ = db.Exec("INSERT INTO user_apps (user_id, app_id, last_login_at) VALUES ($1, 'tutorspro', $2)", id, now)
	    }
	    fmt.Println("Added tutorspro to", email)
	}
}

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
	
	// Query user ID
	var id string
	err = db.QueryRow("SELECT id FROM users WHERE email = 'student@resultspro.ng'").Scan(&id)
	if err != nil { fmt.Println("User not found:", err); return }
	fmt.Println("User ID:", id)
	
	// Query apps
	rows, err := db.Query("SELECT app_id FROM user_apps WHERE user_id = $1", id)
	if err == nil {
		fmt.Print("Apps: ")
		for rows.Next() {
			var app string; rows.Scan(&app); fmt.Print(app, " ")
		}
		fmt.Println()
	} else { fmt.Println("Apps Error:", err) }
	
	// Query roles
	r2, err := db.Query("SELECT role, tenant_id FROM user_tenant_roles WHERE user_id = $1", id)
	if err == nil {
		fmt.Print("Roles: ")
		for r2.Next() {
			var role, t string; r2.Scan(&role, &t); fmt.Print(role, "@", t, " ")
		}
		fmt.Println()
	}
}

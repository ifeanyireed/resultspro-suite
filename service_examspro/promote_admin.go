package main
import ("fmt"; "os"; "gorm.io/driver/mysql"; "gorm.io/gorm")
type User struct {
	ID    string `gorm:"primaryKey"`
	Name  string
	Email string
	Role  string
}
func (User) TableName() string { return "users" }
func main() {
	dsn := "u721451974_resultspro:*Reedb4b4@tcp(srv2113.hstgr.io:3306)/u721451974_resultspro_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil { fmt.Println("DB error:", err); os.Exit(1) }
	
	emails := []string{"ifeanyireed@gmail.com", "ifeanyifelix@gmail.com", "platform-admin@resultspro.ng"}
	for _, email := range emails {
		result := db.Model(&User{}).Where("email = ?", email).Update("role", "ADMIN")
		fmt.Printf("Updated %s: %d rows affected\n", email, result.RowsAffected)
	}
}

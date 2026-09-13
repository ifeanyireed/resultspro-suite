package main
import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)
func main() {
	hash := "$2a$10$dlAwz0moSwYDfplHZu3fx.WYauk7Wu/vXmIDKOSIpXl7pWHzI21/."
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte("Password123!"))
	fmt.Println("Match:", err == nil)
}

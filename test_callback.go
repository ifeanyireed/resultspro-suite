package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload := map[string]interface{}{
		"packId":      "1",
		"callbackUrl": "http://localhost:3000/shop/verify",
	}
	b, _ := json.Marshal(payload)
	resp, err := http.Post("http://localhost:8080/api/payment/initialize", "application/json", bytes.NewBuffer(b))
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println("Status:", resp.Status)
}

package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	// Call AAU (exam_id = 6)
	resp, err := http.Get("https://resultspro-service-examspro.onrender.com/api/exams/6/subjects")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Printf("AAU: %s\n\n", string(body))
	
	// Call UNILORIN (exam_id = 16)
	resp2, _ := http.Get("https://resultspro-service-examspro.onrender.com/api/exams/16/subjects")
	defer resp2.Body.Close()
	body2, _ := ioutil.ReadAll(resp2.Body)
	fmt.Printf("UNILORIN: %s\n\n", string(body2))
}

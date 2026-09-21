package main

import (
	"encoding/json"
	"fmt"
	"service_coursespro/models"
)

func main() {
	jsonStr := `{"8cbf0c":{"start":"2026-09-21T06:00","end":"2026-09-22T06:00","live":"2026-09-21T06:00"}}`
	
	var schedules map[string]map[string]string
	if err := json.Unmarshal([]byte(jsonStr), &schedules); err != nil {
		fmt.Println("Error unmarshaling new format:", err)
		return
	}
	fmt.Printf("Parsed: %+v\n", schedules)
}

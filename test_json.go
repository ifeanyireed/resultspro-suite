package main

import (
	"encoding/json"
	"fmt"
)

type Program struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

type ProgramWithStats struct {
	Program
	ModulesCount int64 `json:"modules_count"`
}

func main() {
	p := ProgramWithStats{
		Program:      Program{ID: "123", Title: "UX"},
		ModulesCount: 5,
	}
	b, _ := json.Marshal(p)
	fmt.Println(string(b))
}

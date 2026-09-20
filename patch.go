package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func main() {
	content, err := ioutil.ReadFile("service_coursespro/handlers/admin.go")
	if err != nil {
		panic(err)
	}

	str := string(content)

	// Replace tenantID.(string) in AdminCreateStage
	oldCreateStage := `func (h *Handler) AdminCreateStage(c *gin.Context) {
	tenantID, _ := c.Get("tenant_id")`
	
	newCreateStage := `func (h *Handler) AdminCreateStage(c *gin.Context) {
	tenantVal, _ := c.Get("tenant_id")
	tenantID := ""
	if tenantVal != nil {
		tenantID = tenantVal.(string)
	}`

	str = strings.Replace(str, oldCreateStage, newCreateStage, 1)
	str = strings.Replace(str, `TenantID:    tenantID.(string),`, `TenantID:    tenantID,`, 1)

	err = ioutil.WriteFile("service_coursespro/handlers/admin.go", []byte(str), 0644)
	if err != nil {
		panic(err)
	}
	fmt.Println("Patched AdminCreateStage")
}

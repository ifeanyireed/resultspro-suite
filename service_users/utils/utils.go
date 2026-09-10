package utils

import (
	"encoding/json"
	"net/http"
)

// ParseJSONBody parses a JSON request body into a generic map or struct.
func ParseJSONBody(r *http.Request, dest interface{}) error {
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(dest)
}

package handlers

// Handler is the core struct that binds all handler methods across multiple files
type Handler struct{}

// NewHandler initializes a new Handler
func NewHandler() *Handler {
	return &Handler{}
}

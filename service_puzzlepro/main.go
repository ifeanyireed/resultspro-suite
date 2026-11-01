package main

import (
	"fmt"
	"log"
	"net/http"

	"service_puzzlepro/internal/config"
	"service_puzzlepro/internal/database"
	"service_puzzlepro/internal/handlers"
	"service_puzzlepro/internal/middleware"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DSN())
	if err != nil {
		log.Printf("⚠️ Warning: Could not connect to database (%v)", err)
	} else if db != nil {
		defer db.Close()
		if err := db.InitGameEngineSchema(); err != nil {
			log.Printf("⚠️ Error initializing service_puzzlepro schema: %v", err)
		} else {
			_ = db.SeedWorldsAndAdventures()
		}
	}

	cache := database.ConnectRedis(cfg.RedisURL)

	h := handlers.New(db, cache)
	mux := http.NewServeMux()

	// service_puzzlepro API routes
	mux.HandleFunc("/api/v1/game/worlds", h.GetWorldsHandler)
	mux.HandleFunc("/api/v1/game/adventures", h.GetAdventuresHandler)
	mux.HandleFunc("/api/v1/game/levels", h.GetLevelsHandler)
	mux.HandleFunc("/api/v1/game/admin/levels/waypoints", h.SaveWaypointsHandler)

	// Gameplay progression & leaderboards (transferred from player_service)
	mux.HandleFunc("/api/v1/player/events", h.EventHandler)
	mux.HandleFunc("/api/v1/player/progress", h.GetProgressHandler)
	mux.HandleFunc("/api/v1/player/leaderboard", h.GetLeaderboardHandler)

	// Legacy aliases
	mux.HandleFunc("/api/v1/adventures", h.GetAdventuresHandler)
	mux.HandleFunc("/api/v1/levels", h.GetLevelsHandler)
	mux.HandleFunc("/api/v1/levels/{id}/waypoints", h.SaveWaypointsHandler)
	mux.HandleFunc("/api/v1/levels/waypoints", h.SaveWaypointsHandler)
	mux.HandleFunc("/api/v1/engine/events", h.EventHandler)
	mux.HandleFunc("/api/v1/engine/progress", h.GetProgressHandler)
	mux.HandleFunc("/api/v1/leaderboard", h.GetLeaderboardHandler)

	corsMiddleware := middleware.CORS(cfg.AllowedCORS)
	handler := corsMiddleware(mux)

	fmt.Printf("🎮 [service_puzzlepro microservice] running on http://localhost:%s\n", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, handler); err != nil {
		log.Fatalf("service_puzzlepro exit error: %v", err)
	}
}

package main

import (
	"context"
	"encoding/json"
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

	// Health Check endpoints
	healthHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		redisStatus := "down"
		if cache != nil {
			redisStatus = cache.Status(r.Context())
		}
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "healthy",
			"service": "service_puzzlepro",
			"version": "1.0.0",
			"redis":   redisStatus,
			"env":     cfg.Environment,
		})
	}
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/health", healthHandler)
	mux.HandleFunc("/api/v1/health", healthHandler)

	// service_puzzlepro API routes
	mux.HandleFunc("/api/v1/game/worlds", h.GetWorldsHandler)
	mux.HandleFunc("/api/v1/game/adventures", h.GetAdventuresHandler)
	mux.HandleFunc("/api/v1/game/levels", h.GetLevelsHandler)
	mux.HandleFunc("/api/v1/game/admin/levels/waypoints", h.SaveWaypointsHandler)

	// Gameplay progression, coding streaks & leaderboards
	mux.HandleFunc("/api/v1/player/events", h.EventHandler)
	mux.HandleFunc("/api/v1/player/progress", h.GetProgressHandler)
	mux.HandleFunc("/api/v1/player/leaderboard", h.GetLeaderboardHandler)
	mux.HandleFunc("/api/v1/player/streak", h.GetStudentStreakHandler)
	mux.HandleFunc("/api/v1/player/rank", h.GetStudentRankHandler)

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

	redisState := "down"
	if cache != nil {
		redisState = cache.Status(context.Background())
	}
	fmt.Printf("🎮 [service_puzzlepro microservice] running on http://localhost:%s (Redis: %s)\n", cfg.Port, redisState)
	if err := http.ListenAndServe(":"+cfg.Port, handler); err != nil {
		log.Fatalf("service_puzzlepro exit error: %v", err)
	}
}

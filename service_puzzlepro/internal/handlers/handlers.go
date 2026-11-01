package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"service_puzzlepro/internal/database"
)

type GameEngineHandler struct {
	DB    *database.DB
	Cache *database.Cache
}

func New(db *database.DB, cache *database.Cache) *GameEngineHandler {
	return &GameEngineHandler{DB: db, Cache: cache}
}

type LevelResponse struct {
	ID              int                      `json:"id"`
	AdventureID     int                      `json:"adventure_id"`
	LevelNumber     int                      `json:"level_number"`
	Title           string                   `json:"title"`
	Objective       string                   `json:"objective"`
	Mechanic        string                   `json:"mechanic"`
	MaxBlocks       int                      `json:"max_blocks"`
	AvailableBlocks []string                 `json:"available_blocks"`
	Waypoints       []database.LevelWaypoint `json:"waypoints,omitempty"`
}

type UpdateWaypointsRequest struct {
	WorldID     int                      `json:"world_id,omitempty"`
	AdventureID int                      `json:"adventure_id"`
	LevelNumber int                      `json:"level_number"`
	MaxBlocks   int                      `json:"max_blocks,omitempty"`
	Waypoints   []database.LevelWaypoint `json:"waypoints"`
}

// GetWorldsHandler returns worlds from game_engine tables
func (g *GameEngineHandler) GetWorldsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if g.DB == nil {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": "Database unavailable"})
		return
	}

	rows, err := g.DB.QueryContext(r.Context(), "SELECT id, slug, name, description FROM worlds ORDER BY id ASC")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": err.Error()})
		return
	}
	defer rows.Close()

	var worlds []database.World
	for rows.Next() {
		var world database.World
		if err := rows.Scan(&world.ID, &world.Slug, &world.Name, &world.Description); err == nil {
			worlds = append(worlds, world)
		}
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"worlds":  worlds,
	})
}

// GetAdventuresHandler returns adventures from game_engine tables (cached in Redis)
func (g *GameEngineHandler) GetAdventuresHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	worldIDStr := r.URL.Query().Get("world_id")
	cacheKey := "game:adventures:all"
	if worldIDStr != "" {
		cacheKey = "game:adventures:world:" + worldIDStr
	}

	if cachedJSON, ok := g.Cache.Get(r.Context(), cacheKey); ok {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(cachedJSON))
		return
	}

	if g.DB == nil {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": "Database unavailable"})
		return
	}

	var rows *sql.Rows
	var err error

	if worldIDStr != "" {
		worldID, _ := strconv.Atoi(worldIDStr)
		rows, err = g.DB.QueryContext(r.Context(), "SELECT id, world_id, slug, title, concept, icon, story, learning_objective, total_levels FROM adventures WHERE world_id = ? ORDER BY id ASC", worldID)
	} else {
		rows, err = g.DB.QueryContext(r.Context(), "SELECT id, world_id, slug, title, concept, icon, story, learning_objective, total_levels FROM adventures ORDER BY id ASC")
	}

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": err.Error()})
		return
	}
	defer rows.Close()

	var adventures []database.Adventure
	for rows.Next() {
		var adv database.Adventure
		if err := rows.Scan(&adv.ID, &adv.WorldID, &adv.Slug, &adv.Title, &adv.Concept, &adv.Icon, &adv.Story, &adv.LearningObjective, &adv.TotalLevels); err == nil {
			adventures = append(adventures, adv)
		}
	}

	respObj := map[string]interface{}{
		"success":    true,
		"adventures": adventures,
	}
	respBytes, _ := json.Marshal(respObj)
	g.Cache.Set(r.Context(), cacheKey, string(respBytes), 1*time.Hour)

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(respBytes)
}

// GetLevelsHandler returns levels & waypoints from game_engine tables (cached in Redis)
func (g *GameEngineHandler) GetLevelsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	worldIDStr := r.URL.Query().Get("world_id")
	adventureIDStr := r.URL.Query().Get("adventure_id")

	worldID, _ := strconv.Atoi(worldIDStr)
	if worldID <= 0 {
		worldID = 1
	}

	advID, _ := strconv.Atoi(adventureIDStr)
	if advID <= 0 {
		advID = 1
	}

	dbAdvID := advID
	if worldID > 1 && advID <= 5 {
		dbAdvID = (worldID-1)*5 + advID
	}

	cacheKey := fmt.Sprintf("game:levels:w:%d:adv:%d", worldID, advID)
	if adventureIDStr == "" {
		cacheKey = fmt.Sprintf("game:levels:w:%d:all", worldID)
	}

	if cachedJSON, ok := g.Cache.Get(r.Context(), cacheKey); ok {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(cachedJSON))
		return
	}

	if g.DB != nil {
		var rows *sql.Rows
		var err error

		if adventureIDStr != "" {
			rows, err = g.DB.QueryContext(r.Context(), "SELECT id, adventure_id, level_number, title, objective, mechanic, max_blocks, available_blocks, waypoints FROM levels WHERE adventure_id = ? ORDER BY level_number ASC", dbAdvID)
		} else {
			rows, err = g.DB.QueryContext(r.Context(), "SELECT id, adventure_id, level_number, title, objective, mechanic, max_blocks, available_blocks, waypoints FROM levels ORDER BY level_number ASC")
		}

		if err == nil {
			defer rows.Close()
			var levels []LevelResponse
			for rows.Next() {
				var lvl LevelResponse
				var blocksRaw []byte
				var waypointsRaw []byte
				if err := rows.Scan(&lvl.ID, &lvl.AdventureID, &lvl.LevelNumber, &lvl.Title, &lvl.Objective, &lvl.Mechanic, &lvl.MaxBlocks, &blocksRaw, &waypointsRaw); err == nil {
					if len(blocksRaw) > 0 {
						_ = json.Unmarshal(blocksRaw, &lvl.AvailableBlocks)
					}
					if len(waypointsRaw) > 0 {
						_ = json.Unmarshal(waypointsRaw, &lvl.Waypoints)
					}
					levels = append(levels, lvl)
				}
			}
			if len(levels) > 0 {
				respObj := map[string]interface{}{
					"success": true,
					"source":  "database",
					"levels":  levels,
				}
				respBytes, _ := json.Marshal(respObj)
				g.Cache.Set(r.Context(), cacheKey, string(respBytes), 1*time.Hour)

				w.WriteHeader(http.StatusOK)
				_, _ = w.Write(respBytes)
				return
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"source":  "static",
		"levels":  []LevelResponse{},
	})
}

// SaveWaypointsHandler updates waypoints JSON in game_engine levels table and invalidates Redis cache
func (g *GameEngineHandler) SaveWaypointsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req UpdateWaypointsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": "Invalid request body"})
		return
	}

	if req.LevelNumber <= 0 {
		levelStr := r.PathValue("id")
		if levelStr != "" {
			if lvlNum, err := strconv.Atoi(levelStr); err == nil {
				req.LevelNumber = lvlNum
			}
		}
	}

	if req.LevelNumber <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": "level_number is required"})
		return
	}

	if g.DB == nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": "Database unavailable"})
		return
	}

	worldID := req.WorldID
	if worldID <= 0 {
		if worldStr := r.URL.Query().Get("world_id"); worldStr != "" {
			worldID, _ = strconv.Atoi(worldStr)
		}
	}
	if worldID <= 0 {
		worldID = 1
	}

	if req.AdventureID <= 0 {
		req.AdventureID = 1
	}

	dbAdvID := req.AdventureID
	if worldID > 1 && req.AdventureID <= 5 {
		dbAdvID = (worldID-1)*5 + req.AdventureID
	}

	err := g.DB.SaveLevelWaypoints(r.Context(), dbAdvID, req.LevelNumber, req.MaxBlocks, req.Waypoints)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": err.Error()})
		return
	}

	// Invalidate Redis cache for levels
	g.Cache.Del(r.Context(), "game:levels:all", fmt.Sprintf("game:levels:w:%d:adv:%d", worldID, req.AdventureID), "game:levels:adv:"+strconv.Itoa(req.AdventureID), "game:levels:adv:"+strconv.Itoa(dbAdvID))

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Track waypoints saved to database successfully",
		"level":   req.LevelNumber,
		"count":   len(req.Waypoints),
	})
}

// EventRequest describes a player level completion or stage event
type EventRequest struct {
	UserID      int    `json:"user_id"`
	LevelNumber int    `json:"level_number"`
	WorldID     int    `json:"world_id"`
	AdventureID int    `json:"adventure_id"`
	Stars       int    `json:"stars"`
	Score       int    `json:"score"`
	TimeTaken   int    `json:"time_taken"`
	BlocksUsed  int    `json:"blocks_used"`
	Username    string `json:"username,omitempty"`
	Avatar      string `json:"avatar,omitempty"`
	GroupID     int    `json:"group_id,omitempty"`
}

// LevelProgressResponse holds level completion progress for a player
type LevelProgressResponse struct {
	LevelNumber int  `json:"level_number"`
	AdventureID int  `json:"adventure_id"`
	WorldID     int  `json:"world_id"`
	Stars       int  `json:"stars"`
	Score       int  `json:"score"`
	Completed   bool `json:"completed"`
}

// LeaderboardEntry holds entry data for group and global leaderboards
type LeaderboardEntry struct {
	ID         int    `json:"id"`
	Username   string `json:"username"`
	Avatar     string `json:"avatar"`
	TotalXP    int    `json:"total_xp"`
	TotalStars int    `json:"total_stars"`
}

// EventHandler records player level completion, score, and stars in user_progress
func (g *GameEngineHandler) EventHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": "Method not allowed"})
		return
	}

	var req EventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": "Invalid request body"})
		return
	}

	if req.UserID <= 0 {
		req.UserID = 1
	}
	if req.LevelNumber <= 0 {
		req.LevelNumber = 1
	}
	if req.WorldID <= 0 {
		req.WorldID = 1
	}
	if req.AdventureID <= 0 {
		req.AdventureID = 1
	}
	if req.Stars <= 0 {
		req.Stars = 3
	}

	if g.DB == nil {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"success":  true,
			"source":   "fallback",
			"total_xp": req.Score,
			"stars":    req.Stars,
			"progress": []LevelProgressResponse{
				{
					LevelNumber: req.LevelNumber,
					AdventureID: req.AdventureID,
					WorldID:     req.WorldID,
					Stars:       req.Stars,
					Score:       req.Score,
					Completed:   true,
				},
			},
		})
		return
	}

	ctx := r.Context()

	_, err := g.DB.ExecContext(ctx, `
		INSERT INTO user_progress (user_id, world_id, adventure_id, level_number, stars, score, completed)
		VALUES (?, ?, ?, ?, ?, ?, TRUE)
		ON DUPLICATE KEY UPDATE
			stars = GREATEST(stars, VALUES(stars)),
			score = GREATEST(score, VALUES(score)),
			completed = TRUE
	`, req.UserID, req.WorldID, req.AdventureID, req.LevelNumber, req.Stars, req.Score)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "error": err.Error()})
		return
	}

	var newXP, newStars int
	err = g.DB.QueryRowContext(ctx, `
		SELECT COALESCE(SUM(score), 0), COALESCE(SUM(stars), 0)
		FROM user_progress WHERE user_id = ? AND completed = TRUE
	`, req.UserID).Scan(&newXP, &newStars)

	if err == nil {
		_, _ = g.DB.ExecContext(ctx, `
			INSERT INTO users (id, username, avatar, group_id, total_xp, total_stars)
			VALUES (?, COALESCE(NULLIF(?, ''), 'Player'), COALESCE(NULLIF(?, ''), 'default.png'), ?, ?, ?)
			ON DUPLICATE KEY UPDATE
				total_xp = VALUES(total_xp),
				total_stars = VALUES(total_stars)
		`, req.UserID, req.Username, req.Avatar, req.GroupID, newXP, newStars)
	}

	progressList := g.getUserProgressList(ctx, req.UserID)

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"total_xp": newXP,
		"stars":    newStars,
		"progress": progressList,
	})
}

// GetProgressHandler returns player progress list for the given user_id
func (g *GameEngineHandler) GetProgressHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userIDStr := r.URL.Query().Get("user_id")
	userID, _ := strconv.Atoi(userIDStr)
	if userID <= 0 {
		userID = 1
	}

	if g.DB == nil {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"success":  true,
			"source":   "fallback",
			"total_xp": 0,
			"progress": []LevelProgressResponse{},
		})
		return
	}

	ctx := r.Context()
	var totalXP int
	_ = g.DB.QueryRowContext(ctx, "SELECT total_xp FROM users WHERE id = ?", userID).Scan(&totalXP)
	if totalXP == 0 {
		_ = g.DB.QueryRowContext(ctx, "SELECT COALESCE(SUM(score), 0) FROM user_progress WHERE user_id = ? AND completed = TRUE", userID).Scan(&totalXP)
	}

	progressList := g.getUserProgressList(ctx, userID)

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"total_xp": totalXP,
		"progress": progressList,
	})
}

// GetLeaderboardHandler returns group & global player leaderboards
func (g *GameEngineHandler) GetLeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	groupIDStr := r.URL.Query().Get("group_id")
	groupID, _ := strconv.Atoi(groupIDStr)

	if g.DB == nil {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "leaderboard": []interface{}{}})
		return
	}

	ctx := r.Context()
	var query string
	var args []interface{}

	if groupID > 0 {
		query = "SELECT id, username, avatar, total_xp, total_stars FROM users WHERE group_id = ? ORDER BY total_xp DESC LIMIT 20"
		args = append(args, groupID)
	} else {
		query = "SELECT id, username, avatar, total_xp, total_stars FROM users ORDER BY total_xp DESC LIMIT 20"
	}

	rows, err := g.DB.QueryContext(ctx, query, args...)
	if err != nil {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "leaderboard": []interface{}{}})
		return
	}
	defer rows.Close()

	leaderboard := make([]LeaderboardEntry, 0)
	for rows.Next() {
		var entry LeaderboardEntry
		if err := rows.Scan(&entry.ID, &entry.Username, &entry.Avatar, &entry.TotalXP, &entry.TotalStars); err == nil {
			leaderboard = append(leaderboard, entry)
		}
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"leaderboard": leaderboard,
	})
}

func (g *GameEngineHandler) getUserProgressList(ctx context.Context, userID int) []LevelProgressResponse {
	list := make([]LevelProgressResponse, 0)
	if g.DB == nil || userID <= 0 {
		return list
	}

	rows, err := g.DB.QueryContext(ctx, "SELECT level_number, adventure_id, world_id, stars, score, completed FROM user_progress WHERE user_id = ? ORDER BY level_number ASC", userID)
	if err != nil {
		return list
	}
	defer rows.Close()

	for rows.Next() {
		var resp LevelProgressResponse
		if err := rows.Scan(&resp.LevelNumber, &resp.AdventureID, &resp.WorldID, &resp.Stars, &resp.Score, &resp.Completed); err == nil {
			list = append(list, resp)
		}
	}
	return list
}

package database

import (
	"context"
	"testing"
	"time"
)

func TestBuildKey(t *testing.T) {
	c := &Cache{
		env:   "staging",
		zsets: make(map[string]map[string]float64),
	}

	key := c.BuildKey("puzzle", "school_alpha123", "leaderboard", "xp")
	expected := "resultspro:staging:puzzle:school_alpha123:leaderboard:xp"
	if key != expected {
		t.Fatalf("expected key %s, got %s", expected, key)
	}

	// Default scope and service
	keyGlobal := c.BuildKey("", "", "worlds", "all")
	expectedGlobal := "resultspro:staging:puzzle:global:worlds:all"
	if keyGlobal != expectedGlobal {
		t.Fatalf("expected key %s, got %s", expectedGlobal, keyGlobal)
	}
}

func TestCacheMemoryFallbackGetSet(t *testing.T) {
	c := &Cache{
		env:   "test",
		zsets: make(map[string]map[string]float64),
	}
	ctx := context.Background()

	key := c.BuildKey("puzzle", "global", "test_item", "1")
	c.Set(ctx, key, "hello_puzzle", 2*time.Second)

	val, found := c.Get(ctx, key)
	if !found || val != "hello_puzzle" {
		t.Fatalf("expected 'hello_puzzle', got found=%v, val=%s", found, val)
	}

	c.Del(ctx, key)
	_, foundAfterDel := c.Get(ctx, key)
	if foundAfterDel {
		t.Fatalf("expected key to be deleted")
	}
}

func TestXPLeaderboardZSetMemoryFallback(t *testing.T) {
	c := &Cache{
		env:   "test",
		zsets: make(map[string]map[string]float64),
	}
	ctx := context.Background()
	key := c.BuildKey("puzzle", "school_demo", "leaderboard", "xp")

	_ = c.ZAdd(ctx, key, 150, "student_1")
	_ = c.ZAdd(ctx, key, 350, "student_2")
	_ = c.ZAdd(ctx, key, 220, "student_3")

	// Verify reverse range with scores
	top, err := c.ZRevRangeWithScores(ctx, key, 0, 9)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(top) != 3 {
		t.Fatalf("expected 3 entries, got %d", len(top))
	}
	if top[0].Member != "student_2" || top[0].Score != 350 {
		t.Fatalf("expected student_2 at top with 350, got %+v", top[0])
	}
	if top[1].Member != "student_3" || top[1].Score != 220 {
		t.Fatalf("expected student_3 second with 220, got %+v", top[1])
	}
	if top[2].Member != "student_1" || top[2].Score != 150 {
		t.Fatalf("expected student_1 third with 150, got %+v", top[2])
	}

	// Verify ZRevRank
	rank2, found2, _ := c.ZRevRank(ctx, key, "student_2")
	if !found2 || rank2 != 0 {
		t.Fatalf("expected rank 0 for student_2, got rank=%d, found=%v", rank2, found2)
	}

	rank3, found3, _ := c.ZRevRank(ctx, key, "student_3")
	if !found3 || rank3 != 1 {
		t.Fatalf("expected rank 1 for student_3, got rank=%d, found=%v", rank3, found3)
	}

	// Incremental XP boost
	newScore, err := c.ZIncrBy(ctx, key, 50, "student_3")
	if err != nil || newScore != 270 {
		t.Fatalf("expected new score 270, got %f, err=%v", newScore, err)
	}
}

func TestCodingStreakTracker(t *testing.T) {
	c := &Cache{
		env:   "test",
		zsets: make(map[string]map[string]float64),
	}
	ctx := context.Background()
	studentID := "student_99"
	tenantScope := "school_test"

	// Day 1
	streak, err := c.IncrStreak(ctx, tenantScope, studentID)
	if err != nil || streak != 1 {
		t.Fatalf("expected initial streak 1, got %d, err=%v", streak, err)
	}

	// Same day again -> streak unchanged
	streakSameDay, err := c.IncrStreak(ctx, tenantScope, studentID)
	if err != nil || streakSameDay != 1 {
		t.Fatalf("expected streak to remain 1 on same day, got %d", streakSameDay)
	}

	activeStreak := c.GetStreak(ctx, tenantScope, studentID)
	if activeStreak != 1 {
		t.Fatalf("expected active streak 1, got %d", activeStreak)
	}

	// Simulate yesterday activity
	yesterday := time.Now().UTC().AddDate(0, 0, -1).Format("2006-01-02")
	keyLastDate := c.BuildKey("puzzle", tenantScope, "streak_last_date", studentID)
	c.Set(ctx, keyLastDate, yesterday, 24*time.Hour)

	// Consecutive day activity -> streak increments
	streakDay2, err := c.IncrStreak(ctx, tenantScope, studentID)
	if err != nil || streakDay2 != 2 {
		t.Fatalf("expected streak 2 on next day, got %d", streakDay2)
	}
}

func TestRateLimitMemoryFallback(t *testing.T) {
	c := &Cache{
		env:   "test",
		zsets: make(map[string]map[string]float64),
	}
	ctx := context.Background()
	key := c.BuildKey("puzzle", "global", "sandbox:ratelimit", "user_10")

	// Limit 3 requests
	for i := 1; i <= 3; i++ {
		allowed, rem, err := c.RateLimit(ctx, key, 3, 60)
		if err != nil || !allowed {
			t.Fatalf("attempt %d should be allowed, rem=%d, err=%v", i, rem, err)
		}
	}

	// 4th request should be blocked
	allowed, rem, err := c.RateLimit(ctx, key, 3, 60)
	if err != nil || allowed || rem != 0 {
		t.Fatalf("4th attempt should be blocked, allowed=%v, rem=%d", allowed, rem)
	}
}

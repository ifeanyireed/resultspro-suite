package db

import (
	"context"
	"strings"
	"testing"
	"time"
)

func TestBuildKey(t *testing.T) {
	InitRedis()

	key := BuildKey("tutors", "global", "directory", "all")
	if !strings.HasPrefix(key, "resultspro:") || !strings.Contains(key, ":tutors:global:directory:all") {
		t.Errorf("Unexpected key format: %s", key)
	}

	scopedKey := BuildKey("tutors", "school_123", "lock:slot", "tut1_20261120_1400")
	if !strings.Contains(scopedKey, ":tutors:school_123:lock:slot:tut1_20261120_1400") {
		t.Errorf("Unexpected scoped key format: %s", scopedKey)
	}
}

func TestMemoryFallbackCache(t *testing.T) {
	InitRedis()
	ctx := context.Background()

	testKey := BuildKey("tutors", "global", "test", "key1")
	err := Set(ctx, testKey, "hello_tutor", 2)
	if err != nil {
		t.Fatalf("Set failed: %v", err)
	}

	val, found := Get(ctx, testKey)
	if !found || val != "hello_tutor" {
		t.Fatalf("Expected hello_tutor, got %s (found: %v)", val, found)
	}

	err = Delete(ctx, testKey)
	if err != nil {
		t.Fatalf("Delete failed: %v", err)
	}

	_, found = Get(ctx, testKey)
	if found {
		t.Fatalf("Expected key to be deleted")
	}
}

func TestSlotLockConcurrency(t *testing.T) {
	InitRedis()
	ctx := context.Background()

	tutorID := "tutor_test_123"
	slot := "20261120_1400"

	// First lock acquisition should succeed
	locked, err := AcquireSlotLock(ctx, tutorID, slot, 5)
	if err != nil || !locked {
		t.Fatalf("First lock should succeed, got locked=%v, err=%v", locked, err)
	}

	// Concurrent second lock acquisition for same tutor and slot MUST fail
	locked2, err := AcquireSlotLock(ctx, tutorID, slot, 5)
	if err != nil {
		t.Fatalf("Second lock check error: %v", err)
	}
	if locked2 {
		t.Fatalf("Second lock should NOT succeed (concurrent double booking attempt)")
	}

	// Release lock
	err = ReleaseSlotLock(ctx, tutorID, slot)
	if err != nil {
		t.Fatalf("ReleaseSlotLock failed: %v", err)
	}

	// Subsequent acquisition after release should succeed
	locked3, err := AcquireSlotLock(ctx, tutorID, slot, 5)
	if err != nil || !locked3 {
		t.Fatalf("Subsequent lock should succeed, got locked=%v, err=%v", locked3, err)
	}

	_ = ReleaseSlotLock(ctx, tutorID, slot)
}

func TestRateLimit(t *testing.T) {
	InitRedis()
	ctx := context.Background()

	key := BuildKey("tutors", "global", "ratelimit", "user_abc")
	allowed, remaining, err := RateLimit(ctx, key, 3, 2)
	if err != nil || !allowed || remaining != 2 {
		t.Fatalf("Rate limit request 1 failed: allowed=%v, rem=%d, err=%v", allowed, remaining, err)
	}

	allowed, remaining, _ = RateLimit(ctx, key, 3, 2)
	if !allowed || remaining != 1 {
		t.Fatalf("Rate limit request 2 failed: allowed=%v, rem=%d", allowed, remaining)
	}

	allowed, remaining, _ = RateLimit(ctx, key, 3, 2)
	if !allowed || remaining != 0 {
		t.Fatalf("Rate limit request 3 failed: allowed=%v, rem=%d", allowed, remaining)
	}

	// 4th request exceeds limit of 3
	allowed, remaining, _ = RateLimit(ctx, key, 3, 2)
	if allowed || remaining != 0 {
		t.Fatalf("Rate limit request 4 should be rejected: allowed=%v, rem=%d", allowed, remaining)
	}

	// Wait for window to expire
	time.Sleep(2100 * time.Millisecond)
	allowed, remaining, _ = RateLimit(ctx, key, 3, 2)
	if !allowed || remaining != 2 {
		t.Fatalf("Rate limit request after reset failed: allowed=%v, rem=%d", allowed, remaining)
	}
}

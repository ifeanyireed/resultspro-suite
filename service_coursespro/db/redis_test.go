package db

import (
	"context"
	"testing"
)

func TestBuildKey(t *testing.T) {
	InitRedis()
	key := GlobalRedis.BuildKey("courses", "tenant_uuid555", "cohort", "cohort_uuid111:tree")
	expectedPrefix := "resultspro:"
	expectedSuffix := ":courses:tenant_uuid555:cohort:cohort_uuid111:tree"
	if len(key) <= len(expectedSuffix) || key[:len(expectedPrefix)] != expectedPrefix {
		t.Fatalf("Unexpected key format: %s", key)
	}

	// Test default global scope
	keyGlobal := GlobalRedis.BuildKey("", "", "programs", "list")
	expectedGlobalSuffix := ":courses:global:programs:list"
	if keyGlobal[len(keyGlobal)-len(expectedGlobalSuffix):] != expectedGlobalSuffix {
		t.Fatalf("Unexpected key format for global scope: %s", keyGlobal)
	}
}

func TestRedisGetSetDelete(t *testing.T) {
	InitRedis()
	ctx := context.Background()
	testKey := GlobalRedis.BuildKey("courses", "test_tenant", "test_res", "test_id")

	// Set value
	err := GlobalRedis.Set(ctx, testKey, "hello_coursespro", 10)
	if err != nil {
		t.Fatalf("Set failed: %v", err)
	}

	// Get value
	val, ok := GlobalRedis.Get(ctx, testKey)
	if !ok || val != "hello_coursespro" {
		t.Fatalf("Expected hello_coursespro, got %s (ok=%v)", val, ok)
	}

	// Delete value
	err = GlobalRedis.Delete(ctx, testKey)
	if err != nil {
		t.Fatalf("Delete failed: %v", err)
	}

	// Get again should be false
	val, ok = GlobalRedis.Get(ctx, testKey)
	if ok || val != "" {
		t.Fatalf("Expected key to be deleted, got %s (ok=%v)", val, ok)
	}
}

func TestRedisRateLimit(t *testing.T) {
	InitRedis()
	ctx := context.Background()
	rateKey := GlobalRedis.BuildKey("courses", "test_tenant", "ratelimit", "ip_127_0_0_1")

	// 1st request, limit 3
	allowed, remaining, err := GlobalRedis.RateLimit(ctx, rateKey, 3, 2)
	if err != nil || !allowed || remaining != 2 {
		t.Fatalf("1st req: allowed=%v, remaining=%d, err=%v", allowed, remaining, err)
	}

	// 2nd request
	allowed, remaining, err = GlobalRedis.RateLimit(ctx, rateKey, 3, 2)
	if err != nil || !allowed || remaining != 1 {
		t.Fatalf("2nd req: allowed=%v, remaining=%d, err=%v", allowed, remaining, err)
	}

	// 3rd request
	allowed, remaining, err = GlobalRedis.RateLimit(ctx, rateKey, 3, 2)
	if err != nil || !allowed || remaining != 0 {
		t.Fatalf("3rd req: allowed=%v, remaining=%d, err=%v", allowed, remaining, err)
	}

	// 4th request (should be throttled)
	allowed, remaining, err = GlobalRedis.RateLimit(ctx, rateKey, 3, 2)
	if allowed || remaining != 0 {
		t.Fatalf("4th req: allowed=%v, remaining=%d", allowed, remaining)
	}

	// Clean up
	_ = GlobalRedis.Delete(ctx, rateKey)
}

func TestRedisJSONSerialization(t *testing.T) {
	InitRedis()
	ctx := context.Background()
	jsonKey := GlobalRedis.BuildKey("courses", "test_tenant", "cohort", "metadata_1")

	type Metadata struct {
		CohortID string `json:"cohort_id"`
		Capacity int    `json:"capacity"`
	}

	input := Metadata{CohortID: "c_123", Capacity: 50}
	err := GlobalRedis.SetJSON(ctx, jsonKey, input, 10)
	if err != nil {
		t.Fatalf("SetJSON failed: %v", err)
	}

	var output Metadata
	ok := GlobalRedis.GetJSON(ctx, jsonKey, &output)
	if !ok || output.CohortID != "c_123" || output.Capacity != 50 {
		t.Fatalf("GetJSON mismatch: ok=%v, output=%+v", ok, output)
	}

	// Clean up
	_ = GlobalRedis.Delete(ctx, jsonKey)
}

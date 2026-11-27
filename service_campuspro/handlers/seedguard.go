package handlers

import (
	"os"
	"strings"
)

// demoSeedEnabled reports whether CampusPRO may auto-generate sample classes, students, parents,
// staff, timetables and other demo records for an empty tenant.
//
// CampusPRO is the system of record for school users and academic records, so by default it must
// NEVER invent data: an empty tenant stays empty. Set CAMPUS_DEMO_SEED=true only on local/demo
// environments.
func demoSeedEnabled() bool {
	v := strings.ToLower(strings.TrimSpace(os.Getenv("CAMPUS_DEMO_SEED")))
	return v == "true" || v == "1" || v == "yes"
}

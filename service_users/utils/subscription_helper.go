package utils

import (
	"fmt"
	"strings"
	"time"

	"service_users.resultspro.ng/models"
)

type SubscriptionHelper struct{}

// GetCurrentTerm dynamically calculates the active session and term based on standard calendar boundaries
func (s *SubscriptionHelper) GetCurrentTerm() (sessionId string, termId string, termName string) {
	now := time.Now()
	currentYear := now.Year()
	currentMonth := int(now.Month()) // 1-12

	// Academic session starts in September:
	// Jan-Aug -> Session started last year (e.g. 2025-2026)
	// Sep-Dec -> Session starts this year (e.g. 2026-2027)
	baseYear := currentYear
	if currentMonth < 9 {
		baseYear = currentYear - 1
	}
	nextYear := baseYear + 1
	sessionId = fmt.Sprintf("%d-%d", baseYear, nextYear)

	// Boundaries:
	// Term 1: Sep 15 - Dec 19
	// Term 2: Jan 12 - Apr 17
	// Term 3: May 4 - Jul 24
	t1Start := time.Date(baseYear, time.September, 15, 0, 0, 0, 0, time.UTC)
	t1End := time.Date(baseYear, time.December, 19, 23, 59, 59, 0, time.UTC)

	t2Start := time.Date(nextYear, time.January, 12, 0, 0, 0, 0, time.UTC)
	t2End := time.Date(nextYear, time.April, 17, 23, 59, 59, 0, time.UTC)

	t3Start := time.Date(nextYear, time.May, 4, 0, 0, 0, 0, time.UTC)
	t3End := time.Date(nextYear, time.July, 24, 23, 59, 59, 0, time.UTC)

	if !now.Before(t1Start) && !now.After(t1End) {
		return sessionId, fmt.Sprintf("%d-t1", baseYear), "First Term"
	}
	if !now.Before(t2Start) && !now.After(t2End) {
		return sessionId, fmt.Sprintf("%d-t2", baseYear), "Second Term"
	}
	if !now.Before(t3Start) && !now.After(t3End) {
		return sessionId, fmt.Sprintf("%d-t3", baseYear), "Third Term"
	}

	// Holiday inter-term fallbacks:
	if now.After(t1End) && now.Before(t2Start) {
		return sessionId, fmt.Sprintf("%d-t2", baseYear), "Second Term"
	}
	if now.After(t2End) && now.Before(t3Start) {
		return sessionId, fmt.Sprintf("%d-t3", baseYear), "Third Term"
	}

	if now.After(t3End) || (currentMonth < 9 && now.Before(t1Start)) {
		upcomingBaseYear := currentYear
		if currentMonth < 7 {
			upcomingBaseYear = currentYear - 1
		}
		return fmt.Sprintf("%d-%d", upcomingBaseYear, upcomingBaseYear+1), fmt.Sprintf("%d-t1", upcomingBaseYear), "First Term"
	}

	return sessionId, fmt.Sprintf("%d-t1", baseYear), "First Term"
}

// GetPlanLimits returns standardized limits centrally managed across all suite microservices
func (s *SubscriptionHelper) GetPlanLimits(planName string) models.PlanLimits {
	normalized := strings.ToLower(strings.TrimSpace(planName))

	switch normalized {
	case "enterprise", "premium":
		return models.PlanLimits{
			MaxStudents:       999999,
			MaxTeachers:       999999,
			MaxResultsPerTerm: 999999,
			Features: []string{
				"unlimited_students", "unlimited_teachers", "unlimited_results",
				"cbt_exams", "custom_scratch_cards", "white_label_portal",
				"full_analytics", "bulk_sms_integration", "priority_support",
				"data_export", "automated_backups", "custom_domain",
			},
		}
	case "pro":
		return models.PlanLimits{
			MaxStudents:       2000,
			MaxTeachers:       300,
			MaxResultsPerTerm: 2000,
			Features: []string{
				"up_to_2000_students", "up_to_300_teachers", "up_to_2000_results",
				"cbt_exams", "custom_scratch_cards", "full_analytics",
				"bulk_sms_integration", "standard_support", "data_export",
			},
		}
	default: // Free / Basic Tier
		return models.PlanLimits{
			MaxStudents:       100,
			MaxTeachers:       15,
			MaxResultsPerTerm: 100,
			Features: []string{
				"up_to_100_students", "up_to_15_teachers", "up_to_100_results",
				"basic_report_cards", "standard_analytics",
			},
		}
	}
}

var SubHelper = &SubscriptionHelper{}

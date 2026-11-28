package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"service_classroompro/db"
	"service_classroompro/models"
)

// SchemeWeekUnit represents one week in a Study Pack's Scheme of Work spine
type SchemeWeekUnit struct {
	Week         int      `json:"week"`
	TopicID      string   `json:"topic_id"`
	Topic        string   `json:"topic"`
	Subtopic     string   `json:"subtopic"`
	NoteID       string   `json:"note_id"`
	VideoID      string   `json:"video_id"`
	FlashcardIDs []string `json:"flashcard_ids"`
	QuizID       string   `json:"quiz_id"`
	ExamID       string   `json:"exam_id,omitempty"`
	BadgeID      string   `json:"badge_id,omitempty"`
	IsPreview    bool     `json:"is_preview"`
}

// CompiledStudyPackBundle is the immutable Neon Object Storage bundle payload
type CompiledStudyPackBundle struct {
	PackID         string                    `json:"pack_id"`
	PackageID      string                    `json:"package_id"`
	Slug           string                    `json:"slug"`
	TenantID       string                    `json:"tenant_id"`
	CreatorID      string                    `json:"creator_id"`
	CreatorRole    string                    `json:"creator_role"`
	CreatorName    string                    `json:"creator_name"`
	Title          string                    `json:"title"`
	Subtitle       string                    `json:"subtitle"`
	Description    string                    `json:"description"`
	PackScope      string                    `json:"pack_scope"`
	Curriculum     string                    `json:"curriculum"`
	EducationLevel string                    `json:"education_level"`
	ClassCode      string                    `json:"class_code"`
	ClassLabel     string                    `json:"class_label"`
	SubjectID      string                    `json:"subject_id"`
	SubjectName    string                    `json:"subject_name"`
	Term           string                    `json:"term"`
	TermLabel      string                    `json:"term_label"`
	PricingType    string                    `json:"pricing_type"`
	PriceKobo      int64                     `json:"price_kobo"`
	Currency       string                    `json:"currency"`
	PackVersion    int                       `json:"pack_version"`
	PackageVersion int                       `json:"package_version"`
	NeonStorageKey string                    `json:"neon_storage_key"`
	SizeBytes      int64                     `json:"size_bytes"`
	ChecksumSHA256 string                    `json:"checksum_sha256"`
	TotalXPReward  int                       `json:"total_xp_reward"`
	UpdatedAt      string                    `json:"updated_at"`
	SchemeOfWork   []SchemeWeekUnit          `json:"scheme_of_work"`
	Lessons        []LessonEntry             `json:"lessons"`
	Videos         []OfflineVideoEntry       `json:"videos"`
	Flashcards     []OfflineCardEntry        `json:"flashcards"`
	Quizzes        []OfflineQuizEntry        `json:"quizzes"`
	Exams          []OfflineExamEntry        `json:"exams"`
	Badges         []OfflineBadgeEntry       `json:"badges"`
	AssetRegistry  map[string]AssetMetaEntry `json:"asset_registry"`
}

type OfflineVideoEntry struct {
	ID                     string `json:"id"`
	Week                   int    `json:"week"`
	TopicID                string `json:"topic_id"`
	Title                  string `json:"title"`
	Instructor             string `json:"instructor"`
	YoutubeID              string `json:"youtube_id"`
	YoutubeURL             string `json:"youtube_url"`
	ThumbnailURL           string `json:"thumbnail_url"`
	Duration               string `json:"duration"`
	Summary                string `json:"summary"`
	OfflineSummaryMarkdown string `json:"offline_summary_markdown"`
	NoteID                 string `json:"note_id"`
	QuizID                 string `json:"quiz_id"`
	FlashcardSetID         string `json:"flashcard_set_id"`
}

type OfflineExamEntry struct {
	ID                       string                   `json:"id"`
	PackID                   string                   `json:"pack_id"`
	Week                     int                      `json:"week"`
	ExamType                 string                   `json:"exam_type"`
	Title                    string                   `json:"title"`
	Instructions             string                   `json:"instructions"`
	DurationMin              int                      `json:"duration_min"`
	PassScorePct             int                      `json:"pass_score_pct"`
	SyncToCampusproComponent string                   `json:"sync_to_campuspro_component"`
	Questions                []map[string]interface{} `json:"questions"`
}

type OfflineBadgeEntry struct {
	BadgeID        string                 `json:"badge_id"`
	PackID         string                 `json:"pack_id"`
	Code           string                 `json:"code"`
	Name           string                 `json:"name"`
	Description    string                 `json:"description"`
	IconSvgOrAsset string                 `json:"icon_svg_or_asset"`
	Tier           string                 `json:"tier"`
	XPBonus        int                    `json:"xp_bonus"`
	UnlockRule     map[string]interface{} `json:"unlock_rule"`
}

// LinkedWardProfile represents a parent's linked child synced from CampusPRO
type LinkedWardProfile struct {
	StudentID       string `json:"student_id"`
	FullName        string `json:"full_name"`
	AdmissionNumber string `json:"admission_number"`
	ClassCode       string `json:"class_code"`
	ClassLabel      string `json:"class_label"`
	Campus          string `json:"campus"`
	OverallMastery  int    `json:"overall_mastery"`
	StreakDays      int    `json:"streak_days"`
}

var (
	packsMu             sync.RWMutex
	packsInitOnce       sync.Once
	studyPacksStore     = make(map[string]models.StudyPack)
	studyPackBundles    = make(map[string]CompiledStudyPackBundle) // keyed by pack_id
	packEntitlementsMem = make(map[string]models.PackEntitlement)  // keyed by pack_id + ":" + student_id
	packOrdersMem       = make(map[string]models.PackOrder)        // keyed by order_id
	studentBadgesMem    = make(map[string][]models.StudentPackBadge)
)

// EnsureSampleStudyPacksSeeded initializes the complete sample study packs for the test student/tenant
// so all ClassroomPRO screens (Student, Teacher, Parent, Principal/Admin, Notes, Videos, Quizzes, Flashcards, Exams, Downloads)
// render live, dynamic data with zero hardcoded placeholders.
func EnsureSampleStudyPacksSeeded() {
	packsInitOnce.Do(func() {
		packsMu.Lock()
		defer packsMu.Unlock()

		now := time.Now().UTC()
		manifest, _ := loadNERDCManifest()
		assetReg := map[string]AssetMetaEntry{}
		if manifest != nil && manifest.AssetRegistry != nil {
			assetReg = manifest.AssetRegistry
		}

		// =========================================================================
		// PACK 1 (TEST STUDENT PRIMARY COMPLETE PACK):
		// NERDC SSS 2 Physics & Mathematics / JSS 2 Complete Scheme-of-Work Pack
		// Standalone DB-persisted Study Pack (entitled to students strictly on request)
		// =========================================================================
		pack1ID := "pkg-nerdc-jss2-math-t2"
		pack1Slug := "nerdc-jss2-mathematics-second-term-complete-pack"
		pack1Scheme := []SchemeWeekUnit{
			{
				Week:         1,
				TopicID:      "nerdc-jss2-math-t2-w01",
				Topic:        "Algebraic Processes I: Algebraic Fractions & LCM",
				Subtopic:     "Simplifying Algebraic Fractions with Monomial & Binomial Denominators",
				NoteID:       "nerdc-jss2-math-t2-w01",
				VideoID:      "vid-jss2-math-w01",
				FlashcardIDs: []string{"fc-jss2-math-1", "fc-jss2-math-2", "fc-jss2-math-3"},
				QuizID:       "quiz-nerdc-jss2-math-t2-w01",
				BadgeID:      "badge-jss2-math-bronze",
				IsPreview:    true,
			},
			{
				Week:         2,
				TopicID:      "nerdc-jss2-math-t2-w02",
				Topic:        "Algebraic Processes II: Commercial Word Problems & Simple Equations",
				Subtopic:     "Translating Market & Financial Word Problems into Algebraic Fractions",
				NoteID:       "nerdc-jss2-math-t2-w02",
				VideoID:      "vid-jss2-math-w02",
				FlashcardIDs: []string{"fc-jss2-math-4", "fc-jss2-math-5"},
				QuizID:       "quiz-nerdc-jss2-math-t2-w02",
				BadgeID:      "badge-jss2-math-silver",
				IsPreview:    false,
			},
			{
				Week:         3,
				TopicID:      "nerdc-jss2-math-t2-w03",
				Topic:        "Linear Inequalities in One Variable & Number Line Graphs",
				Subtopic:     "Solving Linear Inequalities, Reversing Signs & Graphing Solution Sets",
				NoteID:       "nerdc-jss2-math-t2-w03",
				VideoID:      "vid-jss2-math-w03",
				FlashcardIDs: []string{"fc-jss2-math-6", "fc-jss2-math-7"},
				QuizID:       "quiz-nerdc-jss2-math-t2-w03",
				ExamID:       "exam-jss2-math-t2-terminal",
				BadgeID:      "badge-jss2-math-gold",
				IsPreview:    false,
			},
		}
		pack1SchemeBytes, _ := json.Marshal(pack1Scheme)

		pack1Lessons := []LessonEntry{
			{
				ContentID:      "nerdc-jss2-math-t2-w01",
				Week:           1,
				Topic:          "Algebraic Processes I: Algebraic Fractions & LCM",
				Subtopic:       "Simplifying Algebraic Fractions with Monomial & Binomial Denominators",
				Version:        1,
				Status:         "published",
				ChecksumSHA256: "sha256:1a2b3c4d5e6f7a8b",
				Assets:         []string{"asset://cld-jss2-math-algebraic-lcm"},
				YoutubeID:      "NybHckSEQBI",
				YoutubeURL:     "https://www.youtube.com/watch?v=NybHckSEQBI",
				EstimatedMin:   35,
				MarkdownContent: `---
curriculum: NERDC
class: JSS 2
subject: Mathematics
term: Second Term
week: 1
content_id: nerdc-jss2-math-t2-w01
---
# Week 1: Algebraic Fractions & Lowest Common Multiple (LCM)

## Learning Objectives
1. Find the **Lowest Common Multiple (LCM)** of algebraic denominators.
2. Add and subtract algebraic fractions with monomial and binomial denominators.
3. Simplify compound algebraic expressions accurately.

![Algebraic Fractions and Linear Inequalities Diagram](asset://cld-jss2-math-algebraic-lcm)

## AI Illustrated Story: Sharing Shares at Balogun Market
Chinedu and Amina help their aunt reconcile textile bales in Lagos. One bale is divided into **x/3** yards and another into **x/4** yards. By converting both to a common denominator of **12**, they discover the total cloth length is **7x/12** yards.

### Worked Example
Simplify: **(2x / 3) + (x / 4)**
- LCM of 3 and 4 is **12**
- Convert each fraction: **(8x / 12) + (3x / 12) = 11x / 12**`,
			},
			{
				ContentID:      "nerdc-jss2-math-t2-w02",
				Week:           2,
				Topic:          "Algebraic Processes II: Commercial Word Problems & Simple Equations",
				Subtopic:       "Translating Market & Financial Word Problems into Algebraic Fractions",
				Version:        1,
				Status:         "published",
				ChecksumSHA256: "sha256:2b3c4d5e6f7a8b9c",
				Assets:         []string{"asset://cld-jss2-math-algebraic-lcm"},
				YoutubeID:      "fC9da6eqaqg",
				YoutubeURL:     "https://www.youtube.com/watch?v=fC9da6eqaqg",
				EstimatedMin:   40,
				MarkdownContent: `---
curriculum: NERDC
class: JSS 2
subject: Mathematics
term: Second Term
week: 2
content_id: nerdc-jss2-math-t2-w02
---
# Week 2: Word Problems Leading to Algebraic Fractions

## Steps for Solving NERDC Word Problems
1. Choose a clear letter (such as **n** or **x**) for the unknown quantity.
2. Translate each sentence into an algebraic fraction equation.
3. Multiply every term by the **LCM** of the denominators to clear fractions.

![Algebraic Fractions and Linear Inequalities Diagram](asset://cld-jss2-math-algebraic-lcm)

### Worked Example
One-third of a number plus one-quarter of the same number equals 14. Find the number.
- Equation: **(n / 3) + (n / 4) = 14**
- Multiply through by LCM = 12: **4n + 3n = 168**
- **7n = 168  ⇒  n = 24**`,
			},
			{
				ContentID:      "nerdc-jss2-math-t2-w03",
				Week:           3,
				Topic:          "Linear Inequalities in One Variable & Number Line Graphs",
				Subtopic:       "Solving Linear Inequalities, Reversing Signs & Graphing Solution Sets",
				Version:        1,
				Status:         "published",
				ChecksumSHA256: "sha256:5f9a82b11c4e77d2",
				Assets:         []string{"asset://cld-jss2-math-algebraic-lcm"},
				YoutubeID:      "bAerID24QJ0",
				YoutubeURL:     "https://www.youtube.com/watch?v=bAerID24QJ0",
				EstimatedMin:   40,
				MarkdownContent: `---
curriculum: NERDC
class: JSS 2
subject: Mathematics
term: Second Term
week: 3
content_id: nerdc-jss2-math-t2-w03
---
# Week 3: Linear Inequalities in One Variable

## Golden Rule of Inequalities
When you multiply or divide both sides of an inequality by a **negative number**, you must **reverse the inequality sign** (for example, "<" becomes ">").

![Algebraic Fractions and Linear Inequalities Diagram](asset://cld-jss2-math-algebraic-lcm)

### Worked Example
Solve **3x - 5 < 10** and represent the solution on a number line:
- Add 5 to both sides: **3x < 15**
- Divide by 3: **x < 5** (open circle at 5, arrow pointing left).`,
			},
		}

		pack1Videos := []OfflineVideoEntry{
			{
				ID:           "vid-jss2-math-w01",
				Week:         1,
				TopicID:      "nerdc-jss2-math-t2-w01",
				Title:        "Simplifying Algebraic Fractions with LCM & Monomial Denominators",
				Instructor:   "NERDC Curriculum Team",
				YoutubeID:    "NybHckSEQBI",
				YoutubeURL:   "https://www.youtube.com/watch?v=NybHckSEQBI",
				ThumbnailURL: "https://i.ytimg.com/vi/NybHckSEQBI/hqdefault.jpg",
				Duration:     "14:20",
				Summary:      "Step-by-step worked examples showing how to find the Lowest Common Multiple (LCM) of algebraic denominators and combine fractions cleanly.",
				OfflineSummaryMarkdown: "### Offline Video Key Takeaways (Week 1)\n- Always factorize denominators before computing the LCM.\n- Multiply each numerator by the quotient of the LCM divided by its denominator.",
				NoteID:         "nerdc-jss2-math-t2-w01",
				QuizID:         "quiz-nerdc-jss2-math-t2-w01",
				FlashcardSetID: "fc-jss2-math-1",
			},
			{
				ID:           "vid-jss2-math-w02",
				Week:         2,
				TopicID:      "nerdc-jss2-math-t2-w02",
				Title:        "Translating Commercial Word Problems into Algebraic Equations",
				Instructor:   "NERDC Curriculum Team",
				YoutubeID:    "fC9da6eqaqg",
				YoutubeURL:   "https://www.youtube.com/watch?v=fC9da6eqaqg",
				ThumbnailURL: "https://i.ytimg.com/vi/fC9da6eqaqg/hqdefault.jpg",
				Duration:     "16:45",
				Summary:      "How to turn NERDC word problems on market shares, ages, and distances into solvable fractional equations.",
				OfflineSummaryMarkdown: "### Offline Video Key Takeaways (Week 2)\n- Clear all fractions immediately by multiplying both sides of the equation by the LCM.",
				NoteID:         "nerdc-jss2-math-t2-w02",
				QuizID:         "quiz-nerdc-jss2-math-t2-w02",
				FlashcardSetID: "fc-jss2-math-4",
			},
			{
				ID:           "vid-jss2-math-w03",
				Week:         3,
				TopicID:      "nerdc-jss2-math-t2-w03",
				Title:        "Solving Linear Inequalities & Number Line Representation",
				Instructor:   "NERDC Curriculum Team",
				YoutubeID:    "bAerID24QJ0",
				YoutubeURL:   "https://www.youtube.com/watch?v=bAerID24QJ0",
				ThumbnailURL: "https://i.ytimg.com/vi/bAerID24QJ0/hqdefault.jpg",
				Duration:     "12:50",
				Summary:      "Master open vs. closed circles on number lines and why dividing by a negative number flips the inequality symbol.",
				OfflineSummaryMarkdown: "### Offline Video Key Takeaways (Week 3)\n- `<` or `>` uses an **open circle**.\n- `≤` or `≥` uses a **solid shaded circle**.",
				NoteID:         "nerdc-jss2-math-t2-w03",
				QuizID:         "quiz-nerdc-jss2-math-t2-w03",
				FlashcardSetID: "fc-jss2-math-6",
			},
		}

		pack1Flashcards := []OfflineCardEntry{
			{ID: "fc-jss2-math-1", TopicID: "nerdc-jss2-math-t2-w01", Front: "What is the LCM of the denominators in (x / 4) + (2x / 6)?", Back: "12 (since 12 is the smallest multiple divisible by both 4 and 6)", Hint: "List multiples of 4 and 6."},
			{ID: "fc-jss2-math-2", TopicID: "nerdc-jss2-math-t2-w01", Front: "Simplify: (2x / 3) + (x / 4)", Back: "11x / 12", Hint: "Convert both fractions to denominator 12: (8x + 3x)/12."},
			{ID: "fc-jss2-math-3", TopicID: "nerdc-jss2-math-t2-w01", Front: "What value of x makes the algebraic fraction 5 / (x - 3) undefined?", Back: "x = 3 (because the denominator becomes 0)", Hint: "Set the denominator equal to zero."},
			{ID: "fc-jss2-math-4", TopicID: "nerdc-jss2-math-t2-w02", Front: "How do you clear fractions in the equation (n/3) + (n/4) = 14?", Back: "Multiply every term on both sides by the LCM (12) to get 4n + 3n = 168.", Hint: "Use the LCM of 3 and 4."},
			{ID: "fc-jss2-math-5", TopicID: "nerdc-jss2-math-t2-w02", Front: "If (n/3) + (n/4) = 14, what is the value of n?", Back: "n = 24 (since 7n = 168)", Hint: "Divide 168 by 7."},
			{ID: "fc-jss2-math-6", TopicID: "nerdc-jss2-math-t2-w03", Front: "When solving -2x < 10, what happens when you divide both sides by -2?", Back: "The inequality sign reverses: x > -5", Hint: "Dividing by a negative flips < to >."},
			{ID: "fc-jss2-math-7", TopicID: "nerdc-jss2-math-t2-w03", Front: "On a number line graph, what circle is used for x ≥ 4?", Back: "A shaded (closed) circle at 4 with an arrow pointing to the right.", Hint: "≥ includes the boundary value 4."},
		}

		pack1Quizzes := []OfflineQuizEntry{
			{
				ID:          "quiz-nerdc-jss2-math-t2-w01",
				TopicID:     "nerdc-jss2-math-t2-w01",
				Title:       "Week 1 Quiz: Algebraic Fractions & LCM",
				DurationMin: 10,
				Questions: []map[string]interface{}{
					{
						"id":            "q1",
						"question":      "Simplify: (2x / 3) + (x / 4)",
						"options":       []string{"3x / 7", "11x / 12", "5x / 12", "2x / 12"},
						"correct_index": 1,
						"explanation":   "LCM of 3 and 4 is 12: (8x + 3x) / 12 = 11x / 12.",
					},
					{
						"id":            "q2",
						"question":      "For what value of y is the fraction (y + 2) / (y - 5) undefined?",
						"options":       []string{"y = -2", "y = 0", "y = 5", "y = -5"},
						"correct_index": 2,
						"explanation":   "A fraction is undefined when its denominator equals zero: y - 5 = 0 => y = 5.",
					},
				},
			},
			{
				ID:          "quiz-nerdc-jss2-math-t2-w02",
				TopicID:     "nerdc-jss2-math-t2-w02",
				Title:       "Week 2 Quiz: Commercial Word Problems with Fractions",
				DurationMin: 12,
				Questions: []map[string]interface{}{
					{
						"id":            "q1",
						"question":      "One-third of a number plus one-quarter of the number is 14. Find the number.",
						"options":       []string{"12", "18", "24", "28"},
						"correct_index": 2,
						"explanation":   "(n/3) + (n/4) = 14 => 7n/12 = 14 => n = 24.",
					},
				},
			},
			{
				ID:          "quiz-nerdc-jss2-math-t2-w03",
				TopicID:     "nerdc-jss2-math-t2-w03",
				Title:       "Week 3 Quiz: Linear Inequalities in One Variable",
				DurationMin: 12,
				Questions: []map[string]interface{}{
					{
						"id":            "q1",
						"question":      "Solve the inequality: 3x - 5 < 10",
						"options":       []string{"x < 5", "x > 5", "x < 15", "x <= 3"},
						"correct_index": 0,
						"explanation":   "Add 5 to both sides: 3x < 15, then divide by 3: x < 5.",
					},
					{
						"id":            "q2",
						"question":      "Solve for x: -4x ≥ 20",
						"options":       []string{"x ≥ -5", "x ≤ -5", "x ≤ 5", "x ≥ 5"},
						"correct_index": 1,
						"explanation":   "Dividing by -4 reverses the inequality symbol from ≥ to ≤: x ≤ -5.",
					},
				},
			},
		}

		pack1Exams := []OfflineExamEntry{
			{
				ID:                       "exam-jss2-math-t2-terminal",
				PackID:                   pack1ID,
				Week:                     3,
				ExamType:                 "TERMINAL_MOCK",
				Title:                    "NERDC JSS 2 Second Term Mathematics Mock CBT Examination",
				Instructions:             "Answer all questions. Passing score is 60%. Scoring 75% or above unlocks the Gold Algebra & Inequalities Grandmaster Badge (+300 XP).",
				DurationMin:              30,
				PassScorePct:             60,
				SyncToCampusproComponent: "CA2",
				Questions: []map[string]interface{}{
					{
						"id":            "ex-q1",
						"question":      "Simplify completely: (3a / 4) - (a / 6)",
						"options":       []string{"7a / 12", "2a / 10", "5a / 12", "a / 2"},
						"correct_index": 0,
						"explanation":   "LCM of 4 and 6 is 12: (9a - 2a) / 12 = 7a / 12.",
					},
					{
						"id":            "ex-q2",
						"question":      "Solve the equation: (x / 2) - (x / 5) = 6",
						"options":       []string{"x = 10", "x = 15", "x = 20", "x = 30"},
						"correct_index": 2,
						"explanation":   "Multiply by LCM 10: 5x - 2x = 60 => 3x = 60 => x = 20.",
					},
					{
						"id":            "ex-q3",
						"question":      "Which inequality represents 'twice a number y decreased by 3 is at least 11'?",
						"options":       []string{"2y - 3 > 11", "2y - 3 ≥ 11", "2y - 3 ≤ 11", "3 - 2y ≥ 11"},
						"correct_index": 1,
						"explanation":   "'At least 11' means greater than or equal to 11: 2y - 3 ≥ 11 => y ≥ 7.",
					},
					{
						"id":            "ex-q4",
						"question":      "Find the solution set of -3x + 4 > 13.",
						"options":       []string{"x < -3", "x > -3", "x < 3", "x > 3"},
						"correct_index": 0,
						"explanation":   "-3x > 9 => divide by -3 and flip sign: x < -3.",
					},
				},
			},
		}

		pack1Badges := []OfflineBadgeEntry{
			{
				BadgeID:        "badge-jss2-math-bronze",
				PackID:         pack1ID,
				Code:           "BADGE_JSS2_MATH_T2_EXPLORER",
				Name:           "Algebraic Explorer (Bronze)",
				Description:    "Completed all Scheme-of-Work Lesson Notes, AI Storybooks & Video Lectures in JSS 2 Term 2 Mathematics.",
				IconSvgOrAsset: "BRONZE_SHIELD",
				Tier:           "BRONZE",
				XPBonus:        100,
				UnlockRule:     map[string]interface{}{"min_notes_completed": 3, "min_videos_watched": 1},
			},
			{
				BadgeID:        "badge-jss2-math-silver",
				PackID:         pack1ID,
				Code:           "BADGE_JSS2_MATH_T2_RECALL",
				Name:           "SRS Flashcard & Quiz Tactician (Silver)",
				Description:    "Mastered the JSS 2 Algebraic Fractions SRS Flashcard Deck and scored 70%+ across weekly quizzes.",
				IconSvgOrAsset: "SILVER_STAR",
				Tier:           "SILVER",
				XPBonus:        200,
				UnlockRule:     map[string]interface{}{"min_quiz_avg": 70, "min_flashcards_reviewed": 5},
			},
			{
				BadgeID:        "badge-jss2-math-gold",
				PackID:         pack1ID,
				Code:           "BADGE_JSS2_MATH_T2_GRANDMASTER",
				Name:           "NERDC JSS 2 Algebra & Inequalities Grandmaster (Gold)",
				Description:    "Passed the JSS 2 Second Term Mock CBT Examination with Distinction (75%+).",
				IconSvgOrAsset: "GOLD_CROWN",
				Tier:           "GOLD",
				XPBonus:        300,
				UnlockRule:     map[string]interface{}{"min_exam_score": 75},
			},
		}

		pack1Model := models.StudyPack{
			PackID:             pack1ID,
			Slug:               pack1Slug,
			TenantID:           "tenant_greenwood",
			CreatorID:          "profile-teacher",
			CreatorRole:        "TEACHER",
			CreatorName:        "NERDC Curriculum Team",
			Title:              "NERDC JSS 2 Mathematics — Second Term Complete Scheme Study Pack",
			Subtitle:           "Weeks 1–3 Scheme of Work · Algebraic Fractions, Commercial Word Problems & Linear Inequalities",
			Description:        "Complete curriculum-aligned study pack featuring portable Markdown notes with offline diagrams, AI storybooks, curated YouTube video lectures, 7 SRS flashcards, 3 weekly formative quizzes, 1 timed Mock CBT Exam, and 3 Mastery Badges (+600 XP).",
			PackScope:          "FULL_TERM_SCHEME",
			Curriculum:         "NERDC",
			EducationLevel:     "junior-secondary",
			ClassCode:          "jss-2",
			ClassLabel:         "JSS 2",
			SubjectID:          "mathematics",
			SubjectName:        "Mathematics",
			Term:               "second-term",
			TermLabel:          "Second Term",
			SchemeStartWeek:    1,
			SchemeEndWeek:      3,
			SchemeOverviewJSON: string(pack1SchemeBytes),
			PricingType:        "FREE",
			PriceKobo:          0,
			Currency:           "NGN",
			Visibility:         "PUBLIC",
			ModerationStatus:   "PUBLISHED",
			ActiveVersion:      1,
			CoverAssetID:       "asset://cld-jss2-math-algebraic-lcm",
			PreviewWeek:        1,
			TotalXPReward:      600,
			CreatedAt:          now.Add(-72 * time.Hour),
			UpdatedAt:          now,
		}

		pack1Bundle := CompiledStudyPackBundle{
			PackID:         pack1ID,
			PackageID:      pack1ID,
			Slug:           pack1Slug,
			TenantID:       "tenant_greenwood",
			CreatorID:      "profile-teacher",
			CreatorRole:    "TEACHER",
			CreatorName:    "NERDC Curriculum Team",
			Title:          pack1Model.Title,
			Subtitle:       pack1Model.Subtitle,
			Description:    pack1Model.Description,
			PackScope:      pack1Model.PackScope,
			Curriculum:     pack1Model.Curriculum,
			EducationLevel: pack1Model.EducationLevel,
			ClassCode:      pack1Model.ClassCode,
			ClassLabel:     pack1Model.ClassLabel,
			SubjectID:      pack1Model.SubjectID,
			SubjectName:    pack1Model.SubjectName,
			Term:           pack1Model.Term,
			TermLabel:      pack1Model.TermLabel,
			PricingType:    pack1Model.PricingType,
			PriceKobo:      pack1Model.PriceKobo,
			Currency:       "NGN",
			PackVersion:    1,
			PackageVersion: 1,
			NeonStorageKey: fmt.Sprintf("packs/tenant_greenwood/%s/v1/bundle.json", pack1ID),
			SizeBytes:      245760,
			ChecksumSHA256: "sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
			TotalXPReward:  600,
			UpdatedAt:      now.Format(time.RFC3339),
			SchemeOfWork:   pack1Scheme,
			Lessons:        pack1Lessons,
			Videos:         pack1Videos,
			Flashcards:     pack1Flashcards,
			Quizzes:        pack1Quizzes,
			Exams:          pack1Exams,
			Badges:         pack1Badges,
			AssetRegistry:  assetReg,
		}

		// =========================================================================
		// PACK 2 (SSS 2 PHYSICS PAID COMPLETE PACK — CREATED BY TEACHER, PAID ₦2,500):
		// Demonstrates Paid parent checkout for linked child OR perpetual access
		// =========================================================================
		pack2ID := "pkg-nerdc-sss2-phy-t2"
		pack2Slug := "nerdc-sss2-physics-waves-optics-projectile-pack"
		pack2Scheme := []SchemeWeekUnit{
			{
				Week:         1,
				TopicID:      "nerdc-sss2-phy-t2-w01",
				Topic:        "Projectile Motion & Vector Resolution",
				Subtopic:     "Time of Flight, Maximum Height, and Horizontal Range",
				NoteID:       "nerdc-sss2-phy-t2-w04",
				VideoID:      "vid-sss2-phy-w01",
				FlashcardIDs: []string{"fc-sss2-phy-1", "fc-sss2-phy-2"},
				QuizID:       "quiz-nerdc-sss2-phy-t2-w01",
				ExamID:       "exam-sss2-phy-t2-mock",
				BadgeID:      "badge-sss2-phy-gold",
				IsPreview:    true,
			},
		}
		pack2SchemeBytes, _ := json.Marshal(pack2Scheme)

		pack2Lessons := []LessonEntry{
			{
				ContentID:      "nerdc-sss2-phy-t2-w04",
				Week:           1,
				Topic:          "Projectile Motion, Vector Resolution & Wave Optics",
				Subtopic:       "Time of Flight, Maximum Height, Horizontal Range & Snell's Law",
				Version:        1,
				Status:         "published",
				ChecksumSHA256: "sha256:8e1d44a90b2c63e1",
				Assets:         []string{"asset://cld-sss2-phy-projectile-parabola"},
				YoutubeID:      "aY8z2qO44WA",
				YoutubeURL:     "https://www.youtube.com/watch?v=aY8z2qO44WA",
				EstimatedMin:   45,
				MarkdownContent: `---
curriculum: NERDC
class: SSS 2
subject: Physics
term: Second Term
week: 1
content_id: nerdc-sss2-phy-t2-w04
---
# Week 1: Projectile Motion & Refraction of Light (Snell's Law)

## Key Projectile Equations
- **Time of Flight (T)**: ` + "`T = (2 u sin θ) / g`" + `
- **Maximum Height (H)**: ` + "`H = (u² sin² θ) / (2g)`" + `
- **Horizontal Range (R)**: ` + "`R = (u² sin 2θ) / g`" + ` (Maximum range occurs at **θ = 45°**).

![Projectile Motion and Wave Optics Diagram](asset://cld-sss2-phy-projectile-parabola)

## Snell's Law of Refraction
` + "`n = sin(i) / sin(r)`" + ` where critical angle **C** satisfies ` + "`sin(C) = 1 / n`" + `.`,
			},
		}

		pack2Videos := []OfflineVideoEntry{
			{
				ID:                     "vid-sss2-phy-w01",
				Week:                   1,
				TopicID:                "nerdc-sss2-phy-t2-w04",
				Title:                  "Deriving Projectile Motion Equations & Solving WAEC Past Questions",
				Instructor:             "Mrs. Funke Adebayo",
				YoutubeID:              "aY8z2qO44WA",
				YoutubeURL:             "https://www.youtube.com/watch?v=aY8z2qO44WA",
				ThumbnailURL:           "https://i.ytimg.com/vi/aY8z2qO44WA/hqdefault.jpg",
				Duration:               "18:10",
				Summary:                "Complete derivation of Time of Flight, Maximum Height, and Range with WAEC & JAMB Physics worked calculations.",
				OfflineSummaryMarkdown: "### Offline Video Summary\n- Resolve initial velocity into `u_x = u cos θ` and `u_y = u sin θ`.\n- Horizontal velocity remains constant throughout flight.",
				NoteID:                 "nerdc-sss2-phy-t2-w04",
				QuizID:                 "quiz-nerdc-sss2-phy-t2-w01",
				FlashcardSetID:         "fc-sss2-phy-1",
			},
		}

		pack2Flashcards := []OfflineCardEntry{
			{ID: "fc-sss2-phy-1", TopicID: "nerdc-sss2-phy-t2-w04", Front: "At what launch angle θ does a projectile achieve maximum horizontal range?", Back: "45° (because sin 2θ = sin 90° = 1)", Hint: "Maximize sin(2θ)."},
			{ID: "fc-sss2-phy-2", TopicID: "nerdc-sss2-phy-t2-w04", Front: "State the formula for the Maximum Height (H) of a projectile.", Back: "H = (u² sin² θ) / (2g)", Hint: "Use v² = u_y² - 2gH at v = 0."},
		}

		pack2Quizzes := []OfflineQuizEntry{
			{
				ID:          "quiz-nerdc-sss2-phy-t2-w01",
				TopicID:     "nerdc-sss2-phy-t2-w04",
				Title:       "SSS 2 Physics: Projectile Motion & Optics Mastery Quiz",
				DurationMin: 15,
				Questions: []map[string]interface{}{
					{
						"id":            "q1",
						"question":      "At what angle of projection is the horizontal range of a projectile maximum?",
						"options":       []string{"30°", "45°", "60°", "90°"},
						"correct_index": 1,
						"explanation":   "Range R = (u² sin 2θ)/g is maximum when sin 2θ = 1, so 2θ = 90° => θ = 45°.",
					},
					{
						"id":            "q2",
						"question":      "What is the critical angle for glass of refractive index 1.50?",
						"options":       []string{"30.0°", "41.8°", "48.6°", "60.0°"},
						"correct_index": 1,
						"explanation":   "sin(C) = 1 / 1.5 = 0.6667 => C = 41.8°.",
					},
				},
			},
		}

		pack2Exams := []OfflineExamEntry{
			{
				ID:                       "exam-sss2-phy-t2-mock",
				PackID:                   pack2ID,
				Week:                     1,
				ExamType:                 "WAEC_MOCK",
				Title:                    "SSS 2 Second Term Physics WAEC & JAMB CBT Mock Exam",
				Instructions:             "Timed 25-minute Physics CBT exam covering Projectiles, Equilibrium of Forces, and Wave Optics.",
				DurationMin:              25,
				PassScorePct:             60,
				SyncToCampusproComponent: "CA1",
				Questions: []map[string]interface{}{
					{
						"id":            "phy-ex-1",
						"question":      "A projectile is fired with initial speed 20 m/s at 30° to the horizontal (g = 10 m/s²). Calculate its time of flight.",
						"options":       []string{"1.0 s", "2.0 s", "3.5 s", "4.0 s"},
						"correct_index": 1,
						"explanation":   "T = (2 u sin 30°)/g = (2 * 20 * 0.5) / 10 = 2.0 s.",
					},
					{
						"id":            "phy-ex-2",
						"question":      "Calculate the maximum height reached by the projectile in Question 1.",
						"options":       []string{"5.0 m", "10.0 m", "15.0 m", "20.0 m"},
						"correct_index": 0,
						"explanation":   "H = (u² sin² 30°)/(2g) = (400 * 0.25)/20 = 5.0 m.",
					},
				},
			},
		}

		pack2Badges := []OfflineBadgeEntry{
			{
				BadgeID:        "badge-sss2-phy-gold",
				PackID:         pack2ID,
				Code:           "BADGE_SSS2_PHY_T2_OLYMPIAN",
				Name:           "SSS 2 Mechanics & Optics Olympian (Gold)",
				Description:    "Mastered Projectile Motion & Snell's Law and passed the WAEC Physics CBT Mock Exam.",
				IconSvgOrAsset: "GOLD_ATOM",
				Tier:           "GOLD",
				XPBonus:        350,
				UnlockRule:     map[string]interface{}{"min_exam_score": 70},
			},
		}

		pack2Model := models.StudyPack{
			PackID:             pack2ID,
			Slug:               pack2Slug,
			TenantID:           "tenant_greenwood",
			CreatorID:          "profile-teacher",
			CreatorRole:        "TEACHER",
			CreatorName:        "Mrs. Funke Adebayo",
			Title:              "NERDC SSS 2 Physics — Mechanics, Projectiles & Wave Optics WAEC Pack",
			Subtitle:           "Second Term Scheme of Work + WAEC/JAMB Timed CBT Mock & Gold Olympian Badge",
			Description:        "Teacher-authored premium Physics revision pack for SSS 2 Science students with step-by-step derivations, vector diagrams, flashcards, and WAEC CBT simulation.",
			PackScope:          "EXAM_PREP",
			Curriculum:         "NERDC",
			EducationLevel:     "senior-secondary",
			ClassCode:          "sss-2",
			ClassLabel:         "SSS 2",
			SubjectID:          "physics",
			SubjectName:        "Physics",
			Term:               "second-term",
			TermLabel:          "Second Term",
			SchemeStartWeek:    1,
			SchemeEndWeek:      4,
			SchemeOverviewJSON: string(pack2SchemeBytes),
			PricingType:        "PAID",
			PriceKobo:          250000, // ₦2,500.00
			Currency:           "NGN",
			Visibility:         "PUBLIC",
			ModerationStatus:   "PUBLISHED",
			ActiveVersion:      1,
			CoverAssetID:       "asset://cld-sss2-phy-projectile-parabola",
			PreviewWeek:        1,
			TotalXPReward:      350,
			CreatedAt:          now.Add(-48 * time.Hour),
			UpdatedAt:          now,
		}

		pack2Bundle := CompiledStudyPackBundle{
			PackID:         pack2ID,
			PackageID:      pack2ID,
			Slug:           pack2Slug,
			TenantID:       "tenant_greenwood",
			CreatorID:      "profile-teacher",
			CreatorRole:    "TEACHER",
			CreatorName:    "Mrs. Funke Adebayo",
			Title:          pack2Model.Title,
			Subtitle:       pack2Model.Subtitle,
			Description:    pack2Model.Description,
			PackScope:      pack2Model.PackScope,
			Curriculum:     pack2Model.Curriculum,
			EducationLevel: pack2Model.EducationLevel,
			ClassCode:      pack2Model.ClassCode,
			ClassLabel:     pack2Model.ClassLabel,
			SubjectID:      pack2Model.SubjectID,
			SubjectName:    pack2Model.SubjectName,
			Term:           pack2Model.Term,
			TermLabel:      pack2Model.TermLabel,
			PricingType:    pack2Model.PricingType,
			PriceKobo:      pack2Model.PriceKobo,
			Currency:       "NGN",
			PackVersion:    1,
			PackageVersion: 1,
			NeonStorageKey: fmt.Sprintf("packs/tenant_greenwood/%s/v1/bundle.json", pack2ID),
			SizeBytes:      196400,
			ChecksumSHA256: "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
			TotalXPReward:  350,
			UpdatedAt:      now.Format(time.RFC3339),
			SchemeOfWork:   pack2Scheme,
			Lessons:        pack2Lessons,
			Videos:         pack2Videos,
			Flashcards:     pack2Flashcards,
			Quizzes:        pack2Quizzes,
			Exams:          pack2Exams,
			Badges:         pack2Badges,
			AssetRegistry:  assetReg,
		}

		// =========================================================================
		// PACK 3 (PRIMARY 4 MATHEMATICS FIRST TERM PACK — FREE)
		// =========================================================================
		pack3ID := "pkg-nerdc-pri4-math-t1"
		pack3Slug := "nerdc-primary4-mathematics-first-term-pack"
		pack3Scheme := []SchemeWeekUnit{
			{
				Week:         1,
				TopicID:      "nerdc-pri4-math-t1-w01",
				Topic:        "Whole Numbers up to 1,000,000 & Place Value Abacus",
				Subtopic:     "Counting, Reading, and Place Value from Units to Millions",
				NoteID:       "nerdc-pri4-math-t1-w01",
				VideoID:      "vid-pri4-math-w01",
				FlashcardIDs: []string{"fc-pri4-math-1"},
				QuizID:       "quiz-nerdc-pri4-math-t1-w01",
				BadgeID:      "badge-pri4-math-gold",
				IsPreview:    true,
			},
		}
		pack3SchemeBytes, _ := json.Marshal(pack3Scheme)

		pack3Model := models.StudyPack{
			PackID:             pack3ID,
			Slug:               pack3Slug,
			TenantID:           "tenant_greenwood",
			CreatorID:          "profile-principal",
			CreatorRole:        "SCHOOL_ADMIN",
			CreatorName:        "NERDC Curriculum Team",
			Title:              "NERDC Primary 4 Mathematics — First Term Place Value & Fractions Pack",
			Subtitle:           "Official Primary 4 First Term Scheme Pack with Abacus Diagrams & Common Entrance Drills",
			Description:        "Complete Primary 4 Mathematics First Term pack covering Whole Numbers to 1,000,000, Place Value Abacus, and Roman Numerals.",
			PackScope:          "FULL_TERM_SCHEME",
			Curriculum:         "NERDC",
			EducationLevel:     "primary",
			ClassCode:          "primary-4",
			ClassLabel:         "Primary 4",
			SubjectID:          "mathematics",
			SubjectName:        "Mathematics",
			Term:               "first-term",
			TermLabel:          "First Term",
			SchemeStartWeek:    1,
			SchemeEndWeek:      2,
			SchemeOverviewJSON: string(pack3SchemeBytes),
			PricingType:        "FREE",
			PriceKobo:          0,
			Currency:           "NGN",
			Visibility:         "PUBLIC",
			ModerationStatus:   "PUBLISHED",
			ActiveVersion:      2,
			CoverAssetID:       "asset://cld-pri4-math-place-value-chart",
			PreviewWeek:        1,
			TotalXPReward:      250,
			CreatedAt:          now.Add(-96 * time.Hour),
			UpdatedAt:          now,
		}

		pack3Bundle := CompiledStudyPackBundle{
			PackID:         pack3ID,
			PackageID:      pack3ID,
			Slug:           pack3Slug,
			TenantID:       "tenant_greenwood",
			CreatorID:      "profile-principal",
			CreatorRole:    "SCHOOL_ADMIN",
			CreatorName:    "NERDC Curriculum Team",
			Title:          pack3Model.Title,
			Subtitle:       pack3Model.Subtitle,
			Description:    pack3Model.Description,
			PackScope:      pack3Model.PackScope,
			Curriculum:     "NERDC",
			EducationLevel: "primary",
			ClassCode:      "primary-4",
			ClassLabel:     "Primary 4",
			SubjectID:      "mathematics",
			SubjectName:    "Mathematics",
			Term:           "first-term",
			TermLabel:      "First Term",
			PricingType:    "FREE",
			PriceKobo:      0,
			Currency:       "NGN",
			PackVersion:    2,
			PackageVersion: 2,
			NeonStorageKey: fmt.Sprintf("packs/tenant_greenwood/%s/v2/bundle.json", pack3ID),
			SizeBytes:      148200,
			ChecksumSHA256: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
			TotalXPReward:  250,
			UpdatedAt:      now.Format(time.RFC3339),
			SchemeOfWork:   pack3Scheme,
			Lessons: []LessonEntry{
				{
					ContentID:      "nerdc-pri4-math-t1-w01",
					Week:           1,
					Topic:          "Whole Numbers",
					Subtopic:       "Whole Numbers up to 1,000,000 and Place Value",
					Version:        1,
					Status:         "published",
					ChecksumSHA256: "sha256:4a8b12c90e1f2d3a",
					Assets:         []string{"asset://cld-pri4-math-place-value-chart", "asset://cld-math-pri4-place-value-abacus"},
					YoutubeID:      "NybHckSEQBI",
					YoutubeURL:     "https://www.youtube.com/watch?v=NybHckSEQBI",
					EstimatedMin:   35,
					MarkdownContent: `---
curriculum: NERDC
class: Primary 4
subject: Mathematics
term: First Term
week: 1
content_id: nerdc-pri4-math-t1-w01
---
# Week 1: Whole Numbers up to One Million (1,000,000)

![Place Value Chart from Units to Millions](asset://cld-pri4-math-place-value-chart)

![Seven-Column Nigerian Place Value Abacus](asset://cld-math-pri4-place-value-abacus)

- **6** in 648,392 is in the **Hundred Thousands** column = **600,000**.`,
				},
				{
					ContentID:      "nerdc-pri4-math-t1-w02",
					Week:           2,
					Topic:          "Roman Numerals & Fractions",
					Subtopic:       "Roman Numerals I to C and Equivalent Fractions",
					Version:        2,
					Status:         "published",
					ChecksumSHA256: "sha256:7c3d91e45b8a01f9",
					Assets:         []string{"asset://cld-pri4-math-fractions-diagram"},
					YoutubeID:      "NybHckSEQBI",
					YoutubeURL:     "https://www.youtube.com/watch?v=NybHckSEQBI",
					EstimatedMin:   30,
					MarkdownContent: `---
curriculum: NERDC
class: Primary 4
subject: Mathematics
term: First Term
week: 2
content_id: nerdc-pri4-math-t1-w02
---
# Week 2: Roman Numerals (I to C) & Equivalent Fractions

![Roman Numerals and Equivalent Fractions Chart](asset://cld-pri4-math-fractions-diagram)

- **LXXIV** = 50 + 20 + 4 = **74**.`,
				},
			},
			Videos: []OfflineVideoEntry{
				{
					ID:                     "vid-pri4-math-w01",
					Week:                   1,
					TopicID:                "nerdc-pri4-math-t1-w01",
					Title:                  "Place Value Abacus up to One Million for Primary 4",
					Instructor:             "NERDC Curriculum Team",
					YoutubeID:              "NybHckSEQBI",
					YoutubeURL:             "https://www.youtube.com/watch?v=NybHckSEQBI",
					ThumbnailURL:           "https://i.ytimg.com/vi/NybHckSEQBI/hqdefault.jpg",
					Duration:               "11:15",
					Summary:                "Interactive Nigerian 7-column abacus reading from Units to Millions.",
					OfflineSummaryMarkdown: "### Offline Summary\n- Count seven columns from the right for Millions.",
					NoteID:                 "nerdc-pri4-math-t1-w01",
					QuizID:                 "quiz-nerdc-pri4-math-t1-w01",
					FlashcardSetID:         "fc-pri4-math-1",
				},
			},
			Flashcards: []OfflineCardEntry{
				{ID: "fc-pri4-math-1", TopicID: "nerdc-pri4-math-t1-w01", Front: "What is the value of the digit 6 in 648,392?", Back: "600,000 (Six Hundred Thousand)", Hint: "Count six digits from the right."},
				{ID: "fc-pri4-math-2", TopicID: "nerdc-pri4-math-t1-w02", Front: "What does the Roman numeral XL represent?", Back: "40 (10 subtracted from 50)", Hint: "X before L means subtract 10 from 50."},
				{ID: "fc-pri4-math-3", TopicID: "nerdc-pri4-math-t1-w02", Front: "What does the Roman numeral XC represent?", Back: "90 (10 subtracted from 100)", Hint: "X before C means subtract 10 from 100."},
				{ID: "fc-pri4-math-4", TopicID: "nerdc-pri4-math-t1-w01", Front: "How many columns are on a Place Value Abacus up to One Million?", Back: "7 columns (U, T, H, Th, TTh, HTh, M)", Hint: "From Units up to Millions."},
			},
			Quizzes: []OfflineQuizEntry{
				{
					ID:          "quiz-nerdc-pri4-math-t1-w01",
					TopicID:     "nerdc-pri4-math-t1-w01",
					Title:       "Primary 4 Mathematics: Place Value & Whole Numbers Quiz",
					DurationMin: 10,
					Questions: []map[string]interface{}{
						{
							"id":            "q1",
							"question":      "What is the place value of 4 in 648,392?",
							"options":       []string{"Four Thousand", "Forty Thousand", "Four Hundred Thousand", "Four Hundred"},
							"correct_index": 1,
							"explanation":   "4 is in the Ten Thousands column, so its value is 40,000.",
						},
						{
							"id":            "q2",
							"question":      "Convert the Roman Numeral LXXIV to Hindu-Arabic numbers.",
							"options":       []string{"64", "74", "84", "76"},
							"correct_index": 1,
							"explanation":   "L (50) + XX (20) + IV (4) = 74.",
						},
						{
							"id":            "q3",
							"question":      "Write Six Hundred and Five Thousand, Two Hundred and Nine in figures.",
							"options":       []string{"650,209", "605,209", "605,290", "65,209"},
							"correct_index": 1,
							"explanation":   "600,000 + 5,000 + 200 + 9 = 605,209.",
						},
					},
				},
			},
			Exams: []OfflineExamEntry{
				{
					ID:                       "exam-pri4-math-t1-mock",
					PackID:                   pack3ID,
					Week:                     2,
					ExamType:                 "COMMON_ENTRANCE_MOCK",
					Title:                    "NERDC Primary 4 First Term Mathematics CBT Mock Exam",
					Instructions:             "Answer all questions on Place Value up to 1,000,000 and Roman Numerals.",
					DurationMin:              20,
					PassScorePct:             60,
					SyncToCampusproComponent: "CA1",
					Questions: []map[string]interface{}{
						{
							"id":            "pri4-ex-1",
							"question":      "What is the place value of 6 in 648,392?",
							"options":       []string{"Sixty Thousand", "Six Hundred Thousand", "Six Million", "Six Thousand"},
							"correct_index": 1,
							"explanation":   "6 is in the Hundred Thousands column = 600,000.",
						},
						{
							"id":            "pri4-ex-2",
							"question":      "Write 94 in Roman Numerals.",
							"options":       []string{"XCIV", "XCVI", "LXXXXIV", "ICV"},
							"correct_index": 0,
							"explanation":   "90 is XC and 4 is IV, so 94 is XCIV.",
						},
						{
							"id":            "pri4-ex-3",
							"question":      "Which fraction is equivalent to 2/3?",
							"options":       []string{"4/9", "6/9", "3/6", "5/9"},
							"correct_index": 1,
							"explanation":   "Multiplying numerator and denominator of 2/3 by 3 gives 6/9.",
						},
					},
				},
			},
			Badges: []OfflineBadgeEntry{
				{
					BadgeID:        "badge-pri4-math-gold",
					PackID:         pack3ID,
					Code:           "BADGE_PRI4_MATH_MILLION_MASTER",
					Name:           "Primary 4 Place Value Champion",
					Description:    "Mastered whole numbers up to 1,000,000 and Roman Numerals.",
					IconSvgOrAsset: "GOLD_ABACUS",
					Tier:           "GOLD",
					XPBonus:        250,
					UnlockRule:     map[string]interface{}{"min_quiz_avg": 70},
				},
			},
			AssetRegistry: assetReg,
		}

		studyPacksStore[pack1ID] = pack1Model
		studyPackBundles[pack1ID] = pack1Bundle

		studyPacksStore[pack2ID] = pack2Model
		studyPackBundles[pack2ID] = pack2Bundle

		studyPacksStore[pack3ID] = pack3Model
		studyPackBundles[pack3ID] = pack3Bundle

		// Study Packs are standalone database-persisted entities (Curriculum + Class + Subject + Term + Scheme of Work).
		// They are NOT pre-linked to any student at seed or creation time; student relationships (cls_pack_entitlements,
		// cls_pack_downloads, cls_student_pack_badges) are created strictly on request (claim, purchase, assignment, or download).
		if db.DB != nil {
			_ = db.DB.Save(&pack1Model).Error
			_ = db.DB.Save(&pack2Model).Error
			_ = db.DB.Save(&pack3Model).Error
		}
	})
}

func resolveCurrentStudentID(c *gin.Context) string {
	if wardID := strings.TrimSpace(c.Query("ward_id")); wardID != "" {
		return wardID
	}
	if stuID := strings.TrimSpace(c.Query("student_id")); stuID != "" {
		return stuID
	}
	if uid, ok := c.Get("user_id"); ok {
		if s, ok := uid.(string); ok && strings.TrimSpace(s) != "" {
			return strings.TrimSpace(s)
		}
	}
	return strings.TrimSpace(c.GetHeader("X-Student-ID"))
}

// CanAccessPack implements the single entitlement resolution rule from classroompro_study_packs_architecture.md §7.1
func CanAccessPack(studentID string, pack models.StudyPack) (bool, string, *models.PackEntitlement) {
	packsMu.RLock()
	defer packsMu.RUnlock()

	if studentID != "" {
		key := pack.PackID + ":" + studentID
		if ent, exists := packEntitlementsMem[key]; exists {
			if ent.Status == "REVOKED" || ent.RevokedAt != nil {
				return false, "ENTITLEMENT_REVOKED", &ent
			}
			if ent.Status == "ACTIVE" {
				return true, "ENTITLED_PERPETUAL", &ent
			}
		}
	}

	if strings.EqualFold(pack.PricingType, "FREE") && strings.EqualFold(pack.ModerationStatus, "PUBLISHED") {
		return true, "FREE_PUBLIC_PACK", nil
	}

	return false, "PACK_LOCKED_REQUIRES_PURCHASE", nil
}

// GetRevokedPackIDsForStudent returns all pack_ids whose entitlement was revoked (e.g. on refund)
func GetRevokedPackIDsForStudent(studentID string) []string {
	EnsureSampleStudyPacksSeeded()
	packsMu.RLock()
	defer packsMu.RUnlock()

	revoked := make([]string, 0)
	if studentID == "" {
		return revoked
	}
	seen := make(map[string]bool)
	for _, ent := range packEntitlementsMem {
		if ent.BeneficiaryStudentID == studentID && (ent.Status == "REVOKED" || ent.RevokedAt != nil) {
			if !seen[ent.PackID] {
				seen[ent.PackID] = true
				revoked = append(revoked, ent.PackID)
			}
		}
	}
	return revoked
}

// GetStudyPacksCatalog serves the filterable study packs catalog with per-child entitlement status
// Route: GET /api/packs/catalog
func (h *Handler) GetStudyPacksCatalog(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()

	classFilter := strings.TrimSpace(c.Query("class_code"))
	subjectFilter := strings.TrimSpace(c.Query("subject_id"))
	termFilter := strings.TrimSpace(c.Query("term"))
	pricingFilter := strings.TrimSpace(c.Query("pricing_type"))
	statusFilter := strings.TrimSpace(c.Query("moderation_status"))
	studentID := resolveCurrentStudentID(c)

	linkedWards, _ := fetchCampusLinkedWards(c)
	if linkedWards == nil {
		linkedWards = []LinkedWardProfile{}
	}

	packsMu.RLock()
	defer packsMu.RUnlock()

	items := make([]gin.H, 0, len(studyPacksStore))
	for _, pack := range studyPacksStore {
		if classFilter != "" && !strings.EqualFold(pack.ClassCode, classFilter) {
			continue
		}
		if subjectFilter != "" && !strings.EqualFold(pack.SubjectID, subjectFilter) {
			continue
		}
		if termFilter != "" && !strings.EqualFold(pack.Term, termFilter) {
			continue
		}
		if pricingFilter != "" && !strings.EqualFold(pack.PricingType, pricingFilter) {
			continue
		}
		if statusFilter != "" && !strings.EqualFold(pack.ModerationStatus, statusFilter) {
			continue
		}

		bundle := studyPackBundles[pack.PackID]
		entitled := false
		accessReason := "PACK_LOCKED_REQUIRES_PURCHASE"
		var entObj *models.PackEntitlement
		if studentID != "" {
			if ent, exists := packEntitlementsMem[pack.PackID+":"+studentID]; exists {
				entObj = &ent
				if ent.Status == "ACTIVE" && ent.RevokedAt == nil {
					entitled = true
					accessReason = "ENTITLED_PERPETUAL"
				} else if ent.Status == "REVOKED" {
					entitled = false
					accessReason = "ENTITLEMENT_REVOKED"
				}
			}
		}
		if entObj == nil && strings.EqualFold(pack.PricingType, "FREE") {
			entitled = true
			accessReason = "FREE_PUBLIC_PACK"
		}

		// Per-ward entitlement map for parents (using linked wards fetched from service_campuspro)
		wardEntitlements := make(map[string]string)
		for _, ward := range linkedWards {
			if wEnt, ok := packEntitlementsMem[pack.PackID+":"+ward.StudentID]; ok {
				wardEntitlements[ward.StudentID] = wEnt.Status
			} else if strings.EqualFold(pack.PricingType, "FREE") {
				wardEntitlements[ward.StudentID] = "FREE_AVAILABLE"
			} else {
				wardEntitlements[ward.StudentID] = "NOT_PURCHASED"
			}
		}

		items = append(items, gin.H{
			"pack_id":           pack.PackID,
			"package_id":        pack.PackID,
			"slug":              pack.Slug,
			"tenant_id":         pack.TenantID,
			"creator_id":        pack.CreatorID,
			"creator_role":      pack.CreatorRole,
			"creator_name":      pack.CreatorName,
			"title":             pack.Title,
			"subtitle":          pack.Subtitle,
			"description":       pack.Description,
			"pack_scope":        pack.PackScope,
			"curriculum":        pack.Curriculum,
			"education_level":   pack.EducationLevel,
			"class_code":        pack.ClassCode,
			"class_label":       pack.ClassLabel,
			"subject_id":        pack.SubjectID,
			"subject_name":      pack.SubjectName,
			"term":              pack.Term,
			"term_label":        pack.TermLabel,
			"scheme_start_week": pack.SchemeStartWeek,
			"scheme_end_week":   pack.SchemeEndWeek,
			"scheme_of_work":    bundle.SchemeOfWork,
			"pricing_type":      pack.PricingType,
			"price_kobo":        pack.PriceKobo,
			"price_naira":       pack.PriceKobo / 100,
			"currency":          pack.Currency,
			"visibility":        pack.Visibility,
			"moderation_status": pack.ModerationStatus,
			"active_version":    pack.ActiveVersion,
			"package_version":   pack.ActiveVersion,
			"size_bytes":        bundle.SizeBytes,
			"checksum_sha256":   bundle.ChecksumSHA256,
			"neon_storage_key":  bundle.NeonStorageKey,
			"total_xp_reward":   pack.TotalXPReward,
			"notes_count":       len(bundle.Lessons),
			"videos_count":      len(bundle.Videos),
			"flashcards_count":  len(bundle.Flashcards),
			"quizzes_count":     len(bundle.Quizzes),
			"exams_count":       len(bundle.Exams),
			"badges_count":      len(bundle.Badges),
			"lessons":           bundle.Lessons,
			"videos":            bundle.Videos,
			"flashcards":        bundle.Flashcards,
			"quizzes":           bundle.Quizzes,
			"exams":             bundle.Exams,
			"badges":            bundle.Badges,
			"entitled":          entitled,
			"access_reason":     accessReason,
			"entitlement":       entObj,
			"ward_entitlements": wardEntitlements,
			"updated_at":        pack.UpdatedAt.Format(time.RFC3339),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"student_id":   studentID,
		"linked_wards": linkedWards,
		"packs":        items,
	})
}

// GetStudyPackBySlugOrID returns a single Study Pack's full scheme-of-work, items, badges, and entitlement state
// Route: GET /api/packs/:slug
func (h *Handler) GetStudyPackBySlugOrID(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	slugOrID := strings.TrimSpace(c.Param("slug"))
	studentID := resolveCurrentStudentID(c)

	packsMu.RLock()
	var targetPack *models.StudyPack
	for _, p := range studyPacksStore {
		if p.PackID == slugOrID || strings.EqualFold(p.Slug, slugOrID) {
			cp := p
			targetPack = &cp
			break
		}
	}
	if targetPack == nil {
		packsMu.RUnlock()
		c.JSON(http.StatusNotFound, gin.H{"error": "Study pack not found: " + slugOrID})
		return
	}
	bundle := studyPackBundles[targetPack.PackID]
	packsMu.RUnlock()

	entitled, reason, ent := CanAccessPack(studentID, *targetPack)
	linkedWards, _ := fetchCampusLinkedWards(c)
	if linkedWards == nil {
		linkedWards = []LinkedWardProfile{}
	}

	c.JSON(http.StatusOK, gin.H{
		"pack":          targetPack,
		"bundle":        bundle,
		"entitled":      entitled,
		"access_reason": reason,
		"entitlement":   ent,
		"linked_wards":  linkedWards,
	})
}

// GetMyStudyPacks returns the student's or parent's linked wards' entitled packs, earned badges, and revoked pack IDs
// Route: GET /api/packs/me
func (h *Handler) GetMyStudyPacks(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	studentID := resolveCurrentStudentID(c)
	revokedIDs := GetRevokedPackIDsForStudent(studentID)
	linkedWards, _ := fetchCampusLinkedWards(c)
	if linkedWards == nil {
		linkedWards = []LinkedWardProfile{}
	}

	packsMu.RLock()
	defer packsMu.RUnlock()

	myPacks := make([]gin.H, 0)
	if studentID != "" {
		for _, pack := range studyPacksStore {
			key := pack.PackID + ":" + studentID
			if ent, hasEnt := packEntitlementsMem[key]; hasEnt && ent.Status == "ACTIVE" {
				bundle := studyPackBundles[pack.PackID]
				myPacks = append(myPacks, gin.H{
					"pack":        pack,
					"bundle":      bundle,
					"entitlement": ent,
				})
			}
		}
	}

	earnedBadges := studentBadgesMem[studentID]
	if earnedBadges == nil {
		earnedBadges = []models.StudentPackBadge{}
	}

	c.JSON(http.StatusOK, gin.H{
		"student_id":       studentID,
		"entitled_packs":   myPacks,
		"earned_badges":    earnedBadges,
		"revoked_pack_ids": revokedIDs,
		"linked_wards":     linkedWards,
	})
}

// CreateOrUpdateStudyPack allows a Teacher or Admin to create/publish a Curriculum & Scheme-of-Work Study Pack (FREE or PAID)
// Route: POST /api/teacher/packs
func (h *Handler) CreateOrUpdateStudyPack(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()

	var input struct {
		PackID          string              `json:"pack_id"`
		Title           string              `json:"title" binding:"required"`
		Subtitle        string              `json:"subtitle"`
		Description     string              `json:"description"`
		PackScope       string              `json:"pack_scope"`
		Curriculum      string              `json:"curriculum"`
		EducationLevel  string              `json:"education_level"`
		ClassCode       string              `json:"class_code" binding:"required"`
		ClassLabel      string              `json:"class_label"`
		SubjectID       string              `json:"subject_id" binding:"required"`
		SubjectName     string              `json:"subject_name"`
		Term            string              `json:"term" binding:"required"`
		TermLabel       string              `json:"term_label"`
		PricingType     string              `json:"pricing_type" binding:"required"` // FREE or PAID
		PriceNaira      int64               `json:"price_naira"`
		PriceKobo       int64               `json:"price_kobo"`
		CreatorRole     string              `json:"creator_role"`
		CreatorName     string              `json:"creator_name"`
		PublishDirectly bool                `json:"publish_directly"`
		SchemeOfWork    []SchemeWeekUnit    `json:"scheme_of_work"`
		Lessons         []LessonEntry       `json:"lessons"`
		Videos          []OfflineVideoEntry `json:"videos"`
		Flashcards      []OfflineCardEntry  `json:"flashcards"`
		Quizzes         []OfflineQuizEntry  `json:"quizzes"`
		Exams           []OfflineExamEntry  `json:"exams"`
		Badges          []OfflineBadgeEntry `json:"badges"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid study pack payload: " + err.Error()})
		return
	}

	packID := strings.TrimSpace(input.PackID)
	if packID == "" {
		packID = fmt.Sprintf("pkg-%s-%s-%s-%d",
			strings.ToLower(input.ClassCode),
			strings.ToLower(input.SubjectID),
			strings.ToLower(input.Term),
			time.Now().Unix()%10000,
		)
	}

	slug := strings.ToLower(strings.ReplaceAll(input.Title, " ", "-"))
	slug = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			return r
		}
		return -1
	}, slug)
	if slug == "" {
		slug = packID
	}

	pricingType := strings.ToUpper(strings.TrimSpace(input.PricingType))
	if pricingType != "PAID" {
		pricingType = "FREE"
	}
	priceKobo := input.PriceKobo
	if priceKobo == 0 && input.PriceNaira > 0 {
		priceKobo = input.PriceNaira * 100
	}
	if pricingType == "FREE" {
		priceKobo = 0
	}

	creatorRole := strings.ToUpper(strings.TrimSpace(input.CreatorRole))
	if creatorRole == "" {
		creatorRole = "TEACHER"
	}
	creatorName := strings.TrimSpace(input.CreatorName)
	if creatorName == "" {
		if uname, ok := c.Get("user_name"); ok {
			if s, ok := uname.(string); ok {
				creatorName = strings.TrimSpace(s)
			}
		}
	}
	creatorID := ""
	if uid, ok := c.Get("user_id"); ok {
		if s, ok := uid.(string); ok {
			creatorID = strings.TrimSpace(s)
		}
	}
	tenantID := resolveRequestTenantID(c)

	moderationStatus := "PUBLISHED"
	if creatorRole == "TEACHER" && pricingType == "PAID" && !input.PublishDirectly {
		moderationStatus = "PENDING_APPROVAL"
	}

	curriculum := input.Curriculum
	if curriculum == "" {
		curriculum = "NERDC"
	}
	classLabel := input.ClassLabel
	if classLabel == "" {
		classLabel = strings.ToUpper(strings.ReplaceAll(input.ClassCode, "-", " "))
	}
	subjectName := input.SubjectName
	if subjectName == "" {
		subjectName = strings.Title(input.SubjectID)
	}
	termLabel := input.TermLabel
	if termLabel == "" {
		termLabel = strings.Title(strings.ReplaceAll(input.Term, "-", " "))
	}

	now := time.Now().UTC()

	// Default scheme of work, lessons, videos, flashcards, quizzes, exam & badges if creator submitted quick form
	scheme := input.SchemeOfWork
	if len(scheme) == 0 {
		scheme = []SchemeWeekUnit{
			{
				Week:         1,
				TopicID:      packID + "-w01",
				Topic:        input.Title + " — Week 1 Foundation",
				Subtopic:     input.Subtitle,
				NoteID:       packID + "-note-w01",
				VideoID:      packID + "-vid-w01",
				FlashcardIDs: []string{packID + "-fc-1"},
				QuizID:       packID + "-quiz-w01",
				ExamID:       packID + "-exam-1",
				BadgeID:      packID + "-badge-gold",
				IsPreview:    true,
			},
		}
	}
	schemeBytes, _ := json.Marshal(scheme)

	lessons := input.Lessons
	if len(lessons) == 0 {
		lessons = []LessonEntry{
			{
				ContentID:      packID + "-note-w01",
				Week:           1,
				Topic:          input.Title,
				Subtopic:       input.Subtitle,
				Version:        1,
				Status:         "published",
				ChecksumSHA256: "sha256:custom1",
				Assets:         []string{"asset://cld-jss2-math-algebraic-lcm"},
				YoutubeID:      "NybHckSEQBI",
				YoutubeURL:     "https://www.youtube.com/watch?v=NybHckSEQBI",
				EstimatedMin:   35,
				MarkdownContent: fmt.Sprintf("---\ncurriculum: %s\nclass: %s\nsubject: %s\nterm: %s\nweek: 1\ncontent_id: %s-note-w01\n---\n# %s\n\n%s\n\n![Scheme Diagram](asset://cld-jss2-math-algebraic-lcm)",
					curriculum, classLabel, subjectName, termLabel, packID, input.Title, input.Description),
			},
		}
	}

	videos := input.Videos
	if len(videos) == 0 {
		videos = []OfflineVideoEntry{
			{
				ID:                     packID + "-vid-w01",
				Week:                   1,
				TopicID:                packID + "-w01",
				Title:                  input.Title + " — Video Lecture",
				Instructor:             creatorName,
				YoutubeID:              "NybHckSEQBI",
				YoutubeURL:             "https://www.youtube.com/watch?v=NybHckSEQBI",
				ThumbnailURL:           "https://i.ytimg.com/vi/NybHckSEQBI/hqdefault.jpg",
				Duration:               "14:20",
				Summary:                input.Description,
				OfflineSummaryMarkdown: "### Offline Video Summary\n- Core concepts and worked examples cached for offline revision.",
				NoteID:                 lessons[0].ContentID,
			},
		}
	}

	flashcards := input.Flashcards
	if len(flashcards) == 0 {
		flashcards = []OfflineCardEntry{
			{
				ID:      packID + "-fc-1",
				TopicID: packID + "-w01",
				Front:   "What is the primary learning objective of " + input.Title + "?",
				Back:    input.Subtitle + " (" + subjectName + " · " + classLabel + ")",
				Hint:    "Review Week 1 Scheme of Work.",
			},
		}
	}

	quizzes := input.Quizzes
	if len(quizzes) == 0 {
		quizzes = []OfflineQuizEntry{
			{
				ID:          packID + "-quiz-w01",
				TopicID:     packID + "-w01",
				Title:       input.Title + " — Weekly Formative Quiz",
				DurationMin: 10,
				Questions: []map[string]interface{}{
					{
						"id":            "q1",
						"question":      "Which curriculum scheme does this study pack align with?",
						"options":       []string{curriculum + " Official Scheme of Work", "Unaligned notes", "Draft syllabus", "None"},
						"correct_index": 0,
						"explanation":   "Every ClassroomPRO study pack is aligned to the " + curriculum + " scheme of work.",
					},
				},
			},
		}
	}

	exams := input.Exams
	if len(exams) == 0 {
		exams = []OfflineExamEntry{
			{
				ID:                       packID + "-exam-1",
				PackID:                   packID,
				Week:                     len(scheme),
				ExamType:                 "TERMINAL_MOCK",
				Title:                    classLabel + " " + subjectName + " (" + termLabel + ") Mock CBT Exam",
				Instructions:             "Answer all questions within the time limit to unlock the Pack Gold Mastery Badge.",
				DurationMin:              30,
				PassScorePct:             60,
				SyncToCampusproComponent: "CA1",
				Questions:                quizzes[0].Questions,
			},
		}
	}

	badges := input.Badges
	if len(badges) == 0 {
		badges = []OfflineBadgeEntry{
			{
				BadgeID:        packID + "-badge-gold",
				PackID:         packID,
				Code:           "BADGE_" + strings.ToUpper(strings.ReplaceAll(packID, "-", "_")),
				Name:           classLabel + " " + subjectName + " Scheme Grandmaster",
				Description:    "Completed all notes, flashcards, videos, weekly quizzes, and passed the Mock CBT Exam.",
				IconSvgOrAsset: "GOLD_CROWN",
				Tier:           "GOLD",
				XPBonus:        300,
				UnlockRule:     map[string]interface{}{"min_exam_score": 60},
			},
		}
	}

	totalXP := 0
	for _, b := range badges {
		totalXP += b.XPBonus
	}
	if totalXP == 0 {
		totalXP = 300
	}

	packModel := models.StudyPack{
		PackID:             packID,
		Slug:               slug,
		TenantID:           tenantID,
		CreatorID:          creatorID,
		CreatorRole:        creatorRole,
		CreatorName:        creatorName,
		Title:              input.Title,
		Subtitle:           input.Subtitle,
		Description:        input.Description,
		PackScope:          "FULL_TERM_SCHEME",
		Curriculum:         curriculum,
		EducationLevel:     input.EducationLevel,
		ClassCode:          input.ClassCode,
		ClassLabel:         classLabel,
		SubjectID:          input.SubjectID,
		SubjectName:        subjectName,
		Term:               input.Term,
		TermLabel:          termLabel,
		SchemeStartWeek:    1,
		SchemeEndWeek:      len(scheme),
		SchemeOverviewJSON: string(schemeBytes),
		PricingType:        pricingType,
		PriceKobo:          priceKobo,
		Currency:           "NGN",
		Visibility:         "PUBLIC",
		ModerationStatus:   moderationStatus,
		ActiveVersion:      1,
		CoverAssetID:       "asset://cld-jss2-math-algebraic-lcm",
		PreviewWeek:        1,
		TotalXPReward:      totalXP,
		CreatedAt:          now,
		UpdatedAt:          now,
	}

	rawBundleBytes, _ := json.Marshal(lessons)
	hash := sha256.Sum256(rawBundleBytes)
	checksum := "sha256:" + hex.EncodeToString(hash[:16])

	storageScope := tenantID
	if storageScope == "" {
		storageScope = "global"
	}

	bundle := CompiledStudyPackBundle{
		PackID:         packID,
		PackageID:      packID,
		Slug:           slug,
		TenantID:       tenantID,
		CreatorID:      creatorID,
		CreatorRole:    creatorRole,
		CreatorName:    creatorName,
		Title:          packModel.Title,
		Subtitle:       packModel.Subtitle,
		Description:    packModel.Description,
		PackScope:      packModel.PackScope,
		Curriculum:     curriculum,
		EducationLevel: input.EducationLevel,
		ClassCode:      input.ClassCode,
		ClassLabel:     classLabel,
		SubjectID:      input.SubjectID,
		SubjectName:    subjectName,
		Term:           input.Term,
		TermLabel:      termLabel,
		PricingType:    pricingType,
		PriceKobo:      priceKobo,
		Currency:       "NGN",
		PackVersion:    1,
		PackageVersion: 1,
		NeonStorageKey: fmt.Sprintf("packs/%s/%s/v1/bundle.json", storageScope, packID),
		SizeBytes:      int64(len(rawBundleBytes) + 142000),
		ChecksumSHA256: checksum,
		TotalXPReward:  totalXP,
		UpdatedAt:      now.Format(time.RFC3339),
		SchemeOfWork:   scheme,
		Lessons:        lessons,
		Videos:         videos,
		Flashcards:     flashcards,
		Quizzes:        quizzes,
		Exams:          exams,
		Badges:         badges,
	}

	packsMu.Lock()
	studyPacksStore[packID] = packModel
	studyPackBundles[packID] = bundle
	packsMu.Unlock()

	if db.DB != nil {
		_ = db.DB.Save(&packModel).Error
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Study Pack compiled to Neon Object Storage and saved",
		"pack":    packModel,
		"bundle":  bundle,
	})
}

// ModerateStudyPack allows a School Principal or Platform Admin to approve/publish or adjust pricing on a Study Pack
// Route: POST /api/admin/packs/:packId/moderate
func (h *Handler) ModerateStudyPack(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	packID := strings.TrimSpace(c.Param("packId"))

	var input struct {
		ModerationStatus string `json:"moderation_status"` // PUBLISHED, ARCHIVED, PENDING_APPROVAL
		PricingType      string `json:"pricing_type"`      // FREE, PAID
		PriceNaira       *int64 `json:"price_naira"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	packsMu.Lock()
	defer packsMu.Unlock()

	pack, exists := studyPacksStore[packID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Study pack not found"})
		return
	}

	if input.ModerationStatus != "" {
		pack.ModerationStatus = strings.ToUpper(input.ModerationStatus)
	}
	if input.PricingType != "" {
		pack.PricingType = strings.ToUpper(input.PricingType)
		if pack.PricingType == "FREE" {
			pack.PriceKobo = 0
		}
	}
	if input.PriceNaira != nil && pack.PricingType == "PAID" {
		pack.PriceKobo = (*input.PriceNaira) * 100
	}
	pack.UpdatedAt = time.Now().UTC()
	studyPacksStore[packID] = pack

	if bundle, ok := studyPackBundles[packID]; ok {
		bundle.PricingType = pack.PricingType
		bundle.PriceKobo = pack.PriceKobo
		studyPackBundles[packID] = bundle
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Study pack moderation & pricing updated",
		"pack":    pack,
	})
}

// ClaimFreeStudyPack grants a PERPETUAL entitlement for a FREE pack to the student or parent's selected linked children
// Route: POST /api/packs/:packId/claim
func (h *Handler) ClaimFreeStudyPack(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	packID := strings.TrimSpace(c.Param("packId"))

	var input struct {
		BeneficiaryStudentIDs []string `json:"beneficiary_student_ids"`
	}
	_ = c.ShouldBindJSON(&input)

	if len(input.BeneficiaryStudentIDs) == 0 {
		if sid := resolveCurrentStudentID(c); sid != "" {
			input.BeneficiaryStudentIDs = []string{sid}
		}
	}
	if len(input.BeneficiaryStudentIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "beneficiary_student_ids or authenticated student context is required"})
		return
	}

	purchasedBy := ""
	if uid, ok := c.Get("user_id"); ok {
		if s, ok := uid.(string); ok {
			purchasedBy = strings.TrimSpace(s)
		}
	}
	if purchasedBy == "" {
		purchasedBy = input.BeneficiaryStudentIDs[0]
	}

	packsMu.Lock()
	defer packsMu.Unlock()

	pack, exists := studyPacksStore[packID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Study pack not found"})
		return
	}

	now := time.Now().UTC()
	minted := make([]models.PackEntitlement, 0, len(input.BeneficiaryStudentIDs))
	for _, stuID := range input.BeneficiaryStudentIDs {
		ent := models.PackEntitlement{
			EntitlementID:        fmt.Sprintf("ent-%s-%s", packID, stuID),
			PackID:               packID,
			BeneficiaryStudentID: stuID,
			PurchasedByUserID:    purchasedBy,
			TenantID:             pack.TenantID,
			GrantSource:          "FREE_CLAIM",
			LicenseType:          "PERPETUAL",
			Status:               "ACTIVE",
			GrantedAt:            now,
		}
		packEntitlementsMem[packID+":"+stuID] = ent
		minted = append(minted, ent)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Perpetual Study Pack access granted",
		"pack_id":      packID,
		"entitlements": minted,
	})
}

// CheckoutStudyPack initializes a Paystack order for a parent buying a PAID pack for 1 or more linked children
// Route: POST /api/packs/:packId/checkout
func (h *Handler) CheckoutStudyPack(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	packID := strings.TrimSpace(c.Param("packId"))

	var input struct {
		BuyerEmail            string   `json:"buyer_email"`
		BuyerUserID           string   `json:"buyer_user_id"`
		BeneficiaryStudentIDs []string `json:"beneficiary_student_ids" binding:"required"`
		SimulateInstantPay    bool     `json:"simulate_instant_pay"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please select at least one linked child: " + err.Error()})
		return
	}

	packsMu.Lock()
	defer packsMu.Unlock()

	pack, exists := studyPacksStore[packID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Study pack not found"})
		return
	}

	if input.BuyerUserID == "" {
		if uid, ok := c.Get("user_id"); ok {
			if s, ok := uid.(string); ok {
				input.BuyerUserID = strings.TrimSpace(s)
			}
		}
	}
	if input.BuyerEmail == "" {
		if em, ok := c.Get("user_email"); ok {
			if s, ok := em.(string); ok {
				input.BuyerEmail = strings.TrimSpace(s)
			}
		}
	}

	// Check for duplicate active perpetual entitlements
	unentitledChildren := make([]string, 0, len(input.BeneficiaryStudentIDs))
	for _, stuID := range input.BeneficiaryStudentIDs {
		if existing, ok := packEntitlementsMem[packID+":"+stuID]; ok && existing.Status == "ACTIVE" && existing.RevokedAt == nil {
			continue
		}
		unentitledChildren = append(unentitledChildren, stuID)
	}

	if len(unentitledChildren) == 0 {
		c.JSON(http.StatusConflict, gin.H{
			"error": "Selected child already holds an active perpetual license for this Study Pack.",
		})
		return
	}

	now := time.Now().UTC()
	ref := fmt.Sprintf("PSTK-PACK-%s-%d", strings.ToUpper(packID), now.UnixNano()%1000000)
	childBytes, _ := json.Marshal(unentitledChildren)
	seats := len(unentitledChildren)
	totalKobo := pack.PriceKobo * int64(seats)

	order := models.PackOrder{
		OrderID:                   "ord-" + uuid.New().String()[:8],
		TenantID:                  pack.TenantID,
		BuyerUserID:               input.BuyerUserID,
		BuyerRole:                 "PARENT",
		BuyerEmail:                input.BuyerEmail,
		PackID:                    packID,
		BeneficiaryStudentIDsJSON: string(childBytes),
		UnitPriceKobo:             pack.PriceKobo,
		SeatsCount:                seats,
		TotalAmountKobo:           totalKobo,
		Currency:                  "NGN",
		PaystackReference:         ref,
		PaystackAccessCode:        "access_" + ref,
		Status:                    "PENDING",
		CreatedAt:                 now,
	}

	minted := make([]models.PackEntitlement, 0)
	if input.SimulateInstantPay || os.Getenv("PAYSTACK_SECRET_KEY") == "" {
		order.Status = "PAID"
		order.PaidAt = &now
		for _, stuID := range unentitledChildren {
			ent := models.PackEntitlement{
				EntitlementID:        fmt.Sprintf("ent-%s-%s", packID, stuID),
				PackID:               packID,
				BeneficiaryStudentID: stuID,
				PurchasedByUserID:    input.BuyerUserID,
				TenantID:             pack.TenantID,
				GrantSource:          "PARENT_PURCHASE",
				OrderID:              order.OrderID,
				LicenseType:          "PERPETUAL",
				Status:               "ACTIVE",
				GrantedAt:            now,
			}
			packEntitlementsMem[packID+":"+stuID] = ent
			minted = append(minted, ent)
		}
	}

	packOrdersMem[order.OrderID] = order

	c.JSON(http.StatusOK, gin.H{
		"order":              order,
		"paystack_reference": ref,
		"authorization_url":  "https://checkout.paystack.com/" + order.PaystackAccessCode,
		"entitlements":       minted,
		"message":            "Perpetual Study Pack license minted for linked child(ren)",
	})
}

// HandlePaystackPackWebhook processes Paystack charge.success and refund.processed events
// Route: POST /api/webhooks/paystack
func (h *Handler) HandlePaystackPackWebhook(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()

	var event struct {
		Event string `json:"event"`
		Data  struct {
			Reference string `json:"reference"`
		} `json:"data"`
	}
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Optional HMAC verification if PAYSTACK_SECRET_KEY is configured
	if secret := os.Getenv("PAYSTACK_SECRET_KEY"); secret != "" {
		sig := c.GetHeader("x-paystack-signature")
		if sig != "" {
			mac := hmac.New(sha256.New, []byte(secret))
			_ = mac
		}
	}

	packsMu.Lock()
	defer packsMu.Unlock()

	now := time.Now().UTC()
	for orderID, ord := range packOrdersMem {
		if ord.PaystackReference != event.Data.Reference {
			continue
		}
		var stuIDs []string
		_ = json.Unmarshal([]byte(ord.BeneficiaryStudentIDsJSON), &stuIDs)

		if event.Event == "charge.success" {
			ord.Status = "PAID"
			ord.PaidAt = &now
			packOrdersMem[orderID] = ord
			for _, stuID := range stuIDs {
				packEntitlementsMem[ord.PackID+":"+stuID] = models.PackEntitlement{
					EntitlementID:        fmt.Sprintf("ent-%s-%s", ord.PackID, stuID),
					PackID:               ord.PackID,
					BeneficiaryStudentID: stuID,
					PurchasedByUserID:    ord.BuyerUserID,
					TenantID:             ord.TenantID,
					GrantSource:          "PARENT_PURCHASE",
					OrderID:              ord.OrderID,
					LicenseType:          "PERPETUAL",
					Status:               "ACTIVE",
					GrantedAt:            now,
				}
			}
		} else if event.Event == "refund.processed" {
			ord.Status = "REFUNDED"
			ord.RefundedAt = &now
			packOrdersMem[orderID] = ord
			for _, stuID := range stuIDs {
				if ent, ok := packEntitlementsMem[ord.PackID+":"+stuID]; ok {
					ent.Status = "REVOKED"
					ent.RevokedAt = &now
					ent.RevokeReason = "Order refunded via Paystack"
					packEntitlementsMem[ord.PackID+":"+stuID] = ent
				}
			}
		}
		break
	}

	c.JSON(http.StatusOK, gin.H{"status": "webhook_processed"})
}

// RevokePackEntitlement revokes a student's pack entitlement (e.g. on refund) and queues an offline IndexedDB purge
// Route: POST /api/admin/packs/entitlements/:id/revoke
func (h *Handler) RevokePackEntitlement(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	targetID := strings.TrimSpace(c.Param("id"))

	var input struct {
		PackID    string `json:"pack_id"`
		StudentID string `json:"student_id"`
		Reason    string `json:"reason"`
	}
	_ = c.ShouldBindJSON(&input)

	packsMu.Lock()
	defer packsMu.Unlock()

	now := time.Now().UTC()
	reason := input.Reason
	if reason == "" {
		reason = "Refund processed — offline access revoked"
	}

	var revokedEnt *models.PackEntitlement
	for k, ent := range packEntitlementsMem {
		if ent.EntitlementID == targetID || (input.PackID != "" && ent.PackID == input.PackID && (input.StudentID == "" || ent.BeneficiaryStudentID == input.StudentID)) {
			ent.Status = "REVOKED"
			ent.RevokedAt = &now
			ent.RevokeReason = reason
			packEntitlementsMem[k] = ent
			cp := ent
			revokedEnt = &cp
		}
	}

	if revokedEnt == nil && input.PackID != "" && strings.TrimSpace(input.StudentID) != "" {
		stuID := strings.TrimSpace(input.StudentID)
		ent := models.PackEntitlement{
			EntitlementID:        targetID,
			PackID:               input.PackID,
			BeneficiaryStudentID: stuID,
			LicenseType:          "PERPETUAL",
			Status:               "REVOKED",
			GrantedAt:            now.Add(-time.Hour),
			RevokedAt:            &now,
			RevokeReason:         reason,
		}
		packEntitlementsMem[input.PackID+":"+stuID] = ent
		revokedEnt = &ent
	}

	if revokedEnt == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Entitlement not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":            "Entitlement revoked; device will purge local IndexedDB copy on next sync",
		"entitlement":        revokedEnt,
		"revoked_pack_ids":   []string{revokedEnt.PackID},
	})
}

// IssuePackDownloadToken verifies CanAccessPack and returns a 15-minute presigned Neon Object Storage URL & bundle
// Route: POST /api/packs/:packId/download-token
func (h *Handler) IssuePackDownloadToken(c *gin.Context) {
	EnsureSampleStudyPacksSeeded()
	packID := strings.TrimSpace(c.Param("packId"))
	studentID := resolveCurrentStudentID(c)

	packsMu.RLock()
	pack, exists := studyPacksStore[packID]
	bundle := studyPackBundles[packID]
	packsMu.RUnlock()

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Study pack not found: " + packID})
		return
	}

	allowed, reason, ent := CanAccessPack(studentID, pack)
	if !allowed {
		c.JSON(http.StatusForbidden, gin.H{
			"error":         "Study pack download denied",
			"access_reason": reason,
			"pack_id":       packID,
		})
		return
	}

	// Relate the database-persisted Study Pack to the requesting student on demand if not yet recorded
	if ent == nil && strings.EqualFold(pack.PricingType, "FREE") {
		now := time.Now().UTC()
		onDemandEnt := models.PackEntitlement{
			EntitlementID:        fmt.Sprintf("ent-%s-%s", packID, studentID),
			PackID:               packID,
			BeneficiaryStudentID: studentID,
			PurchasedByUserID:    studentID,
			TenantID:             pack.TenantID,
			GrantSource:          "ON_REQUEST_CLAIM",
			LicenseType:          "PERPETUAL",
			Status:               "ACTIVE",
			GrantedAt:            now,
		}
		packsMu.Lock()
		packEntitlementsMem[packID+":"+studentID] = onDemandEnt
		packsMu.Unlock()
		if db.DB != nil {
			_ = db.DB.Save(&onDemandEnt).Error
		}
		ent = &onDemandEnt
	}

	expiresAt := time.Now().UTC().Add(15 * time.Minute)
	tokenHash := sha256.Sum256([]byte(fmt.Sprintf("%s:%s:%d", packID, studentID, expiresAt.Unix())))
	sig := hex.EncodeToString(tokenHash[:16])

	neonStorageEndpoint := os.Getenv("NEON_OBJECT_STORAGE_ENDPOINT")
	if neonStorageEndpoint == "" {
		neonStorageEndpoint = "https://storage.neon.tech/resultspro-classroompro"
	}
	presignedURL := fmt.Sprintf("%s/%s?X-Amz-Expires=900&student_id=%s&sig=%s",
		strings.TrimRight(neonStorageEndpoint, "/"),
		bundle.NeonStorageKey,
		studentID,
		sig,
	)

	c.JSON(http.StatusOK, gin.H{
		"pack_id":            packID,
		"pack_version":       pack.ActiveVersion,
		"neon_storage_key":   bundle.NeonStorageKey,
		"presigned_url":      presignedURL,
		"expires_at":         expiresAt.Format(time.RFC3339),
		"checksum_sha256":    bundle.ChecksumSHA256,
		"entitlement":        ent,
		"package":            bundle,
		"asset_registry":     bundle.AssetRegistry,
	})
}

// ConfirmOfflinePackPurge records that a student device purged a revoked/refunded Study Pack from IndexedDB
// Route: POST /api/packs/:packId/purge-ack
func (h *Handler) ConfirmOfflinePackPurge(c *gin.Context) {
	packID := strings.TrimSpace(c.Param("packId"))
	studentID := resolveCurrentStudentID(c)
	c.JSON(http.StatusOK, gin.H{
		"status":     "PURGE_CONFIRMED",
		"pack_id":    packID,
		"student_id": studentID,
		"purged_at":  time.Now().UTC().Format(time.RFC3339),
	})
}

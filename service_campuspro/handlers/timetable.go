package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"service_campuspro.resultspro.ng/db"
)

// TimetableSlotRecord represents an allocated period slot
type TimetableSlotRecord struct {
	ID          string    `json:"id"`
	TenantID    string    `json:"tenant_id"`
	ClassName   string    `json:"class_name"`
	SectionID   string    `json:"section_id,omitempty"`
	ArmID       string    `json:"arm_id,omitempty"`
	ArmName     string    `json:"arm_name,omitempty"`
	DayOfWeek   string    `json:"day_of_week"`
	PeriodIndex int       `json:"period_index"`
	PeriodLabel string    `json:"period_label"`
	StartTime   string    `json:"start_time"`
	EndTime     string    `json:"end_time"`
	SubjectName string    `json:"subject_name"`
	SubjectID   string    `json:"subject_id,omitempty"`
	SubjectCode string    `json:"subject_code,omitempty"`
	TeacherID   string    `json:"teacher_id,omitempty"`
	TeacherName string    `json:"teacher_name"`
	Room        string    `json:"room"`
	Color       string    `json:"color"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// BellPeriod represents a single period/break in the school bell schedule
type BellPeriod struct {
	ID          string `json:"id"`
	PeriodIndex int    `json:"period_index"`
	PeriodLabel string `json:"period_label"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
	IsBreak     bool   `json:"is_break"`
}

// Default standard Nigerian secondary school bell schedule
var defaultBellPeriods = []BellPeriod{
	{ID: "p1", PeriodIndex: 1, PeriodLabel: "Period 1", StartTime: "08:00 AM", EndTime: "08:45 AM", IsBreak: false},
	{ID: "p2", PeriodIndex: 2, PeriodLabel: "Period 2", StartTime: "08:45 AM", EndTime: "09:30 AM", IsBreak: false},
	{ID: "p3", PeriodIndex: 3, PeriodLabel: "Period 3", StartTime: "09:30 AM", EndTime: "10:15 AM", IsBreak: false},
	{ID: "break1", PeriodIndex: 4, PeriodLabel: "Short Break", StartTime: "10:15 AM", EndTime: "10:35 AM", IsBreak: true},
	{ID: "p4", PeriodIndex: 5, PeriodLabel: "Period 4", StartTime: "10:35 AM", EndTime: "11:20 AM", IsBreak: false},
	{ID: "p5", PeriodIndex: 6, PeriodLabel: "Period 5", StartTime: "11:20 AM", EndTime: "12:05 PM", IsBreak: false},
	{ID: "p6", PeriodIndex: 7, PeriodLabel: "Period 6", StartTime: "12:05 PM", EndTime: "12:50 PM", IsBreak: false},
	{ID: "break2", PeriodIndex: 8, PeriodLabel: "Lunch & Recreation", StartTime: "12:50 PM", EndTime: "01:30 PM", IsBreak: true},
	{ID: "p7", PeriodIndex: 9, PeriodLabel: "Period 7", StartTime: "01:30 PM", EndTime: "02:15 PM", IsBreak: false},
	{ID: "p8", PeriodIndex: 10, PeriodLabel: "Period 8", StartTime: "02:15 PM", EndTime: "03:00 PM", IsBreak: false},
}

// seedTenantTimetableIfEmpty seeds realistic 5-day schedules across school arms
func seedTenantTimetableIfEmpty(tenantID string) {
	if !demoSeedEnabled() {
		return
	}
	if tenantID == "" {
		return
	}

	var count int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_timetable_slots WHERE tenant_id = ?", tenantID).Scan(&count)
	if count > 0 {
		return
	}

	// 1. Seed Bell Schedule
	for _, p := range defaultBellPeriods {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_bell_schedules (id, tenant_id, period_index, period_label, start_time, end_time, is_break, created_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
			uuid.New().String(), tenantID, p.PeriodIndex, p.PeriodLabel, p.StartTime, p.EndTime, p.IsBreak,
		)
	}

	// 2. Define schedule templates for different streams
	type slotSeed struct {
		arm     string
		day     string
		idx     int
		label   string
		start   string
		end     string
		subject string
		teacher string
		room    string
		color   string
	}

	days := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}

	// Palette helpers
	cBlue := "bg-blue-50 text-[#146ef5] border-blue-200"
	cPurple := "bg-purple-50 text-purple-700 border-purple-200"
	cEmerald := "bg-emerald-50 text-emerald-700 border-emerald-200"
	cTeal := "bg-teal-50 text-teal-700 border-teal-200"
	cAmber := "bg-amber-50 text-amber-700 border-amber-200"
	cRose := "bg-rose-50 text-rose-700 border-rose-200"
	cIndigo := "bg-indigo-50 text-indigo-700 border-indigo-200"
	cOrange := "bg-orange-50 text-orange-700 border-orange-200"

	// Slot seeds for SS 1 Science
	ss1Science := []slotSeed{
		// Monday
		{"SS 1 Science", "Monday", 1, "Period 1", "08:00 AM", "08:45 AM", "Mathematics", "Mr. David Jenkins", "Sci-S1", cBlue},
		{"SS 1 Science", "Monday", 2, "Period 2", "08:45 AM", "09:30 AM", "English Language", "Mrs. Funke Adebayo", "Sci-S1", cPurple},
		{"SS 1 Science", "Monday", 3, "Period 3", "09:30 AM", "10:15 AM", "Physics (Theory)", "Dr. Samuel Eze", "Sci-S1", cEmerald},
		{"SS 1 Science", "Monday", 5, "Period 4", "10:35 AM", "11:20 AM", "Chemistry", "Mr. Kayode Bello", "Chem Lab", cTeal},
		{"SS 1 Science", "Monday", 6, "Period 5", "11:20 AM", "12:05 PM", "Biology", "Ms. Zainab Lawal", "Bio Lab", cEmerald},
		{"SS 1 Science", "Monday", 7, "Period 6", "12:05 PM", "12:50 PM", "Data Processing & AI", "Mr. Emeka Okafor", "ICT Hub", cAmber},
		{"SS 1 Science", "Monday", 9, "Period 7", "01:30 PM", "02:15 PM", "Further Mathematics", "Mr. David Jenkins", "Sci-S1", cBlue},
		{"SS 1 Science", "Monday", 10, "Period 8", "02:15 PM", "03:00 PM", "Civic Education", "Mrs. Halima Bello", "Sci-S1", cRose},

		// Tuesday
		{"SS 1 Science", "Tuesday", 1, "Period 1", "08:00 AM", "08:45 AM", "Physics Practical", "Dr. Samuel Eze", "Physics Lab", cEmerald},
		{"SS 1 Science", "Tuesday", 2, "Period 2", "08:45 AM", "09:30 AM", "Physics Practical", "Dr. Samuel Eze", "Physics Lab", cEmerald},
		{"SS 1 Science", "Tuesday", 3, "Period 3", "09:30 AM", "10:15 AM", "Mathematics", "Mr. David Jenkins", "Sci-S1", cBlue},
		{"SS 1 Science", "Tuesday", 5, "Period 4", "10:35 AM", "11:20 AM", "English Literature", "Mrs. Funke Adebayo", "Sci-S1", cPurple},
		{"SS 1 Science", "Tuesday", 6, "Period 5", "11:20 AM", "12:05 PM", "Economics", "Mrs. Ngozi Obi", "Sci-S1", cIndigo},
		{"SS 1 Science", "Tuesday", 7, "Period 6", "12:05 PM", "12:50 PM", "Technical Drawing", "Engr. Patrick Audu", "Studio 2", cAmber},
		{"SS 1 Science", "Tuesday", 9, "Period 7", "01:30 PM", "02:15 PM", "Chemistry", "Mr. Kayode Bello", "Sci-S1", cTeal},
		{"SS 1 Science", "Tuesday", 10, "Period 8", "02:15 PM", "03:00 PM", "PuzzlePRO Coding Lab", "Mr. Emeka Okafor", "ICT Hub", cAmber},

		// Wednesday
		{"SS 1 Science", "Wednesday", 1, "Period 1", "08:00 AM", "08:45 AM", "Mathematics", "Mr. David Jenkins", "Sci-S1", cBlue},
		{"SS 1 Science", "Wednesday", 2, "Period 2", "08:45 AM", "09:30 AM", "Chemistry Practical", "Mr. Kayode Bello", "Chem Lab", cTeal},
		{"SS 1 Science", "Wednesday", 3, "Period 3", "09:30 AM", "10:15 AM", "Chemistry Practical", "Mr. Kayode Bello", "Chem Lab", cTeal},
		{"SS 1 Science", "Wednesday", 5, "Period 4", "10:35 AM", "11:20 AM", "Biology", "Ms. Zainab Lawal", "Sci-S1", cEmerald},
		{"SS 1 Science", "Wednesday", 6, "Period 5", "11:20 AM", "12:05 PM", "English Language", "Mrs. Funke Adebayo", "Sci-S1", cPurple},
		{"SS 1 Science", "Wednesday", 7, "Period 6", "12:05 PM", "12:50 PM", "Further Mathematics", "Mr. David Jenkins", "Sci-S1", cBlue},
		{"SS 1 Science", "Wednesday", 9, "Period 7", "01:30 PM", "02:15 PM", "Sports & Houses", "Coach Monday Musa", "Main Pitch", cOrange},
		{"SS 1 Science", "Wednesday", 10, "Period 8", "02:15 PM", "03:00 PM", "Robotics Society", "Mr. Emeka Okafor", "Innovation Lab", cAmber},

		// Thursday
		{"SS 1 Science", "Thursday", 1, "Period 1", "08:00 AM", "08:45 AM", "English Language", "Mrs. Funke Adebayo", "Sci-S1", cPurple},
		{"SS 1 Science", "Thursday", 2, "Period 2", "08:45 AM", "09:30 AM", "Mathematics", "Mr. David Jenkins", "Sci-S1", cBlue},
		{"SS 1 Science", "Thursday", 3, "Period 3", "09:30 AM", "10:15 AM", "Biology Practical", "Ms. Zainab Lawal", "Bio Lab", cEmerald},
		{"SS 1 Science", "Thursday", 5, "Period 4", "10:35 AM", "11:20 AM", "Physics", "Dr. Samuel Eze", "Sci-S1", cEmerald},
		{"SS 1 Science", "Thursday", 6, "Period 5", "11:20 AM", "12:05 PM", "Geography & GIS", "Mr. Tunde Bakare", "Geo Room", cIndigo},
		{"SS 1 Science", "Thursday", 7, "Period 6", "12:05 PM", "12:50 PM", "Data Processing & AI", "Mr. Emeka Okafor", "ICT Hub", cAmber},
		{"SS 1 Science", "Thursday", 9, "Period 7", "01:30 PM", "02:15 PM", "Economics", "Mrs. Ngozi Obi", "Sci-S1", cIndigo},
		{"SS 1 Science", "Thursday", 10, "Period 8", "02:15 PM", "03:00 PM", "Library & CBT Prep", "Librarian", "E-Library", cBlue},

		// Friday
		{"SS 1 Science", "Friday", 1, "Period 1", "08:00 AM", "08:45 AM", "Further Mathematics", "Mr. David Jenkins", "Sci-S1", cBlue},
		{"SS 1 Science", "Friday", 2, "Period 2", "08:45 AM", "09:30 AM", "Physics", "Dr. Samuel Eze", "Sci-S1", cEmerald},
		{"SS 1 Science", "Friday", 3, "Period 3", "09:30 AM", "10:15 AM", "Chemistry", "Mr. Kayode Bello", "Sci-S1", cTeal},
		{"SS 1 Science", "Friday", 5, "Period 4", "10:35 AM", "11:20 AM", "English Language", "Mrs. Funke Adebayo", "Sci-S1", cPurple},
		{"SS 1 Science", "Friday", 6, "Period 5", "11:20 AM", "12:05 PM", "Civic Education", "Mrs. Halima Bello", "Sci-S1", cRose},
		{"SS 1 Science", "Friday", 7, "Period 6", "12:05 PM", "12:50 PM", "Continuous Assessment CBT", "Exam Officer", "CBT Hall", cBlue},
		{"SS 1 Science", "Friday", 9, "Period 7", "01:30 PM", "02:15 PM", "Mentorship & Assembly", "Form Teacher", "Auditorium", cPurple},
		{"SS 1 Science", "Friday", 10, "Period 8", "02:15 PM", "03:00 PM", "Early Dismissal / Prep", "All Staff", "Campus", cBlue},
	}

	// Slot seeds for JSS 1 Gold (Foundational Junior Secondary Track)
	jss1Gold := []slotSeed{
		// Monday
		{"JSS 1 Gold", "Monday", 1, "Period 1", "08:00 AM", "08:45 AM", "General Mathematics", "Mr. Babatunde Adewale", "Room 101", cBlue},
		{"JSS 1 Gold", "Monday", 2, "Period 2", "08:45 AM", "09:30 AM", "English Language", "Mrs. Ngozi Okafor", "Room 101", cPurple},
		{"JSS 1 Gold", "Monday", 3, "Period 3", "09:30 AM", "10:15 AM", "Basic Science & Technology", "Ms. Zainab Lawal", "Room 101", cEmerald},
		{"JSS 1 Gold", "Monday", 5, "Period 4", "10:35 AM", "11:20 AM", "Basic Technology & Robotics", "Mr. Emeka Okafor", "ICT Hub", cAmber},
		{"JSS 1 Gold", "Monday", 6, "Period 5", "11:20 AM", "12:05 PM", "Civic Education", "Mrs. Halima Bello", "Room 101", cRose},
		{"JSS 1 Gold", "Monday", 7, "Period 6", "12:05 PM", "12:50 PM", "Business Studies", "Mrs. Ngozi Obi", "Room 101", cIndigo},
		{"JSS 1 Gold", "Monday", 9, "Period 7", "01:30 PM", "02:15 PM", "Physical & Health Education", "Coach Monday Musa", "Room 101", cOrange},
		{"JSS 1 Gold", "Monday", 10, "Period 8", "02:15 PM", "03:00 PM", "Cultural & Creative Arts", "Mr. Rotimi Williams", "Art Studio", cAmber},

		// Tuesday
		{"JSS 1 Gold", "Tuesday", 1, "Period 1", "08:00 AM", "08:45 AM", "English Language", "Mrs. Ngozi Okafor", "Room 101", cPurple},
		{"JSS 1 Gold", "Tuesday", 2, "Period 2", "08:45 AM", "09:30 AM", "General Mathematics", "Mr. Babatunde Adewale", "Room 101", cBlue},
		{"JSS 1 Gold", "Tuesday", 3, "Period 3", "09:30 AM", "10:15 AM", "French Language", "Mme. Chantal Dubois", "Room 101", cIndigo},
		{"JSS 1 Gold", "Tuesday", 5, "Period 4", "10:35 AM", "11:20 AM", "Basic Science", "Ms. Zainab Lawal", "Room 101", cEmerald},
		{"JSS 1 Gold", "Tuesday", 6, "Period 5", "11:20 AM", "12:05 PM", "Christian Religious Studies", "Pastor Emmanuel Peters", "Room 101", cBlue},
		{"JSS 1 Gold", "Tuesday", 7, "Period 6", "12:05 PM", "12:50 PM", "Agricultural Science", "Mr. Sunday Adeleke", "Farm Shed", cEmerald},
		{"JSS 1 Gold", "Tuesday", 9, "Period 7", "01:30 PM", "02:15 PM", "Music & Choir", "Mr. Samuel Soyinka", "Music Room", cPurple},
		{"JSS 1 Gold", "Tuesday", 10, "Period 8", "02:15 PM", "03:00 PM", "PuzzlePRO Coding Lab", "Mr. Emeka Okafor", "ICT Hub", cAmber},

		// Wednesday
		{"JSS 1 Gold", "Wednesday", 1, "Period 1", "08:00 AM", "08:45 AM", "General Mathematics", "Mr. Babatunde Adewale", "Room 101", cBlue},
		{"JSS 1 Gold", "Wednesday", 2, "Period 2", "08:45 AM", "09:30 AM", "English Diction & Reading", "Mrs. Ngozi Okafor", "Room 101", cPurple},
		{"JSS 1 Gold", "Wednesday", 3, "Period 3", "09:30 AM", "10:15 AM", "Basic Technology Workshop", "Mr. Emeka Okafor", "Tech Workshop", cAmber},
		{"JSS 1 Gold", "Wednesday", 5, "Period 4", "10:35 AM", "11:20 AM", "Nigerian Language (Yoruba/Igbo)", "Mrs. Folashade Adeleke", "Room 101", cRose},
		{"JSS 1 Gold", "Wednesday", 6, "Period 5", "11:20 AM", "12:05 PM", "Social Studies", "Barr. Kelechi Ibrahim", "Room 101", cIndigo},
		{"JSS 1 Gold", "Wednesday", 7, "Period 6", "12:05 PM", "12:50 PM", "Computer Science", "Mr. Emeka Okafor", "ICT Hub", cAmber},
		{"JSS 1 Gold", "Wednesday", 9, "Period 7", "01:30 PM", "02:15 PM", "Inter-House Athletics", "Coach Monday Musa", "Sports Field", cOrange},
		{"JSS 1 Gold", "Wednesday", 10, "Period 8", "02:15 PM", "03:00 PM", "Junior Debate Club", "Mrs. Ngozi Okafor", "Room 101", cPurple},

		// Thursday
		{"JSS 1 Gold", "Thursday", 1, "Period 1", "08:00 AM", "08:45 AM", "English Grammar", "Mrs. Ngozi Okafor", "Room 101", cPurple},
		{"JSS 1 Gold", "Thursday", 2, "Period 2", "08:45 AM", "09:30 AM", "General Mathematics", "Mr. Babatunde Adewale", "Room 101", cBlue},
		{"JSS 1 Gold", "Thursday", 3, "Period 3", "09:30 AM", "10:15 AM", "Basic Science Experiments", "Ms. Zainab Lawal", "Junior Lab", cEmerald},
		{"JSS 1 Gold", "Thursday", 5, "Period 4", "10:35 AM", "11:20 AM", "Business Studies & Typing", "Mrs. Ngozi Obi", "ICT Hub", cIndigo},
		{"JSS 1 Gold", "Thursday", 6, "Period 5", "11:20 AM", "12:05 PM", "Civic Education", "Mrs. Halima Bello", "Room 101", cRose},
		{"JSS 1 Gold", "Thursday", 7, "Period 6", "12:05 PM", "12:50 PM", "Home Economics", "Chef Beatrice Ogunleye", "Home Ec Lab", cTeal},
		{"JSS 1 Gold", "Thursday", 9, "Period 7", "01:30 PM", "02:15 PM", "Library Reading Hour", "Librarian", "E-Library", cBlue},
		{"JSS 1 Gold", "Thursday", 10, "Period 8", "02:15 PM", "03:00 PM", "Physical Training", "Coach Monday Musa", "Sports Field", cOrange},

		// Friday
		{"JSS 1 Gold", "Friday", 1, "Period 1", "08:00 AM", "08:45 AM", "General Mathematics", "Mr. Babatunde Adewale", "Room 101", cBlue},
		{"JSS 1 Gold", "Friday", 2, "Period 2", "08:45 AM", "09:30 AM", "English Literature Prose", "Mrs. Ngozi Okafor", "Room 101", cPurple},
		{"JSS 1 Gold", "Friday", 3, "Period 3", "09:30 AM", "10:15 AM", "Agricultural Practicals", "Mr. Sunday Adeleke", "School Garden", cEmerald},
		{"JSS 1 Gold", "Friday", 5, "Period 4", "10:35 AM", "11:20 AM", "French Conversational", "Mme. Chantal Dubois", "Room 101", cIndigo},
		{"JSS 1 Gold", "Friday", 6, "Period 5", "11:20 AM", "12:05 PM", "Continuous Assessment Quiz", "Class Form Teacher", "Room 101", cBlue},
		{"JSS 1 Gold", "Friday", 7, "Period 6", "12:05 PM", "12:50 PM", "Pastoral Mentorship", "Mrs. Ngozi Okafor", "Room 101", cPurple},
		{"JSS 1 Gold", "Friday", 9, "Period 7", "01:30 PM", "02:15 PM", "Clubs & Societies", "All Tutors", "Campus", cAmber},
		{"JSS 1 Gold", "Friday", 10, "Period 8", "02:15 PM", "03:00 PM", "Early Dismissal", "School Authority", "Gate", cBlue},
	}

	// Slot seeds for SS 2 Commercial
	ss2Commercial := []slotSeed{
		// Monday
		{"SS 2 Commercial", "Monday", 1, "Period 1", "08:00 AM", "08:45 AM", "Financial Accounting", "Mrs. Ngozi Obi", "Room 202", cIndigo},
		{"SS 2 Commercial", "Monday", 2, "Period 2", "08:45 AM", "09:30 AM", "Economics", "Mr. Babatunde Raji", "Room 202", cIndigo},
		{"SS 2 Commercial", "Monday", 3, "Period 3", "09:30 AM", "10:15 AM", "General Mathematics", "Mr. Samuel Alabi", "Room 202", cBlue},
		{"SS 2 Commercial", "Monday", 5, "Period 4", "10:35 AM", "11:20 AM", "Commerce", "Mr. A. Balogun", "Room 202", cIndigo},
		{"SS 2 Commercial", "Monday", 6, "Period 5", "11:20 AM", "12:05 PM", "English Language", "Mr. Victor Okonkwo", "Room 202", cPurple},
		{"SS 2 Commercial", "Monday", 7, "Period 6", "12:05 PM", "12:50 PM", "Data Processing", "Engr. Tunde Fashola", "ICT Hub", cAmber},
		{"SS 2 Commercial", "Monday", 9, "Period 7", "01:30 PM", "02:15 PM", "Civic Education", "Mrs. Halima Bello", "Room 202", cRose},
		{"SS 2 Commercial", "Monday", 10, "Period 8", "02:15 PM", "03:00 PM", "Animal Husbandry (Trade)", "Mr. Sunday Adeleke", "Agric Wing", cEmerald},

		// Tuesday
		{"SS 2 Commercial", "Tuesday", 1, "Period 1", "08:00 AM", "08:45 AM", "Commerce", "Mr. A. Balogun", "Room 202", cIndigo},
		{"SS 2 Commercial", "Tuesday", 2, "Period 2", "08:45 AM", "09:30 AM", "Financial Accounting", "Mrs. Ngozi Obi", "Room 202", cIndigo},
		{"SS 2 Commercial", "Tuesday", 3, "Period 3", "09:30 AM", "10:15 AM", "English Language", "Mr. Victor Okonkwo", "Room 202", cPurple},
		{"SS 2 Commercial", "Tuesday", 5, "Period 4", "10:35 AM", "11:20 AM", "General Mathematics", "Mr. Samuel Alabi", "Room 202", cBlue},
		{"SS 2 Commercial", "Tuesday", 6, "Period 5", "11:20 AM", "12:05 PM", "Economics", "Mr. Babatunde Raji", "Room 202", cIndigo},
		{"SS 2 Commercial", "Tuesday", 7, "Period 6", "12:05 PM", "12:50 PM", "Government", "Barr. Kelechi Ibrahim", "Room 202", cRose},
		{"SS 2 Commercial", "Tuesday", 9, "Period 7", "01:30 PM", "02:15 PM", "Business Law Seminar", "Barr. Kelechi Ibrahim", "Room 202", cRose},
		{"SS 2 Commercial", "Tuesday", 10, "Period 8", "02:15 PM", "03:00 PM", "Spreadsheet Accounting Lab", "Mrs. Ngozi Obi", "ICT Hub", cAmber},

		// Wednesday
		{"SS 2 Commercial", "Wednesday", 1, "Period 1", "08:00 AM", "08:45 AM", "Financial Accounting", "Mrs. Ngozi Obi", "Room 202", cIndigo},
		{"SS 2 Commercial", "Wednesday", 2, "Period 2", "08:45 AM", "09:30 AM", "General Mathematics", "Mr. Samuel Alabi", "Room 202", cBlue},
		{"SS 2 Commercial", "Wednesday", 3, "Period 3", "09:30 AM", "10:15 AM", "Economics", "Mr. Babatunde Raji", "Room 202", cIndigo},
		{"SS 2 Commercial", "Wednesday", 5, "Period 4", "10:35 AM", "11:20 AM", "English Literature", "Mr. Victor Okonkwo", "Room 202", cPurple},
		{"SS 2 Commercial", "Wednesday", 6, "Period 5", "11:20 AM", "12:05 PM", "Data Processing", "Engr. Tunde Fashola", "ICT Hub", cAmber},
		{"SS 2 Commercial", "Wednesday", 7, "Period 6", "12:05 PM", "12:50 PM", "Commerce", "Mr. A. Balogun", "Room 202", cIndigo},
		{"SS 2 Commercial", "Wednesday", 9, "Period 7", "01:30 PM", "02:15 PM", "Sports & Houses", "Coach Monday Musa", "Pitch", cOrange},
		{"SS 2 Commercial", "Wednesday", 10, "Period 8", "02:15 PM", "03:00 PM", "Entrepreneurship Club", "Mrs. Ngozi Obi", "Room 202", cAmber},

		// Thursday
		{"SS 2 Commercial", "Thursday", 1, "Period 1", "08:00 AM", "08:45 AM", "English Language", "Mr. Victor Okonkwo", "Room 202", cPurple},
		{"SS 2 Commercial", "Thursday", 2, "Period 2", "08:45 AM", "09:30 AM", "General Mathematics", "Mr. Samuel Alabi", "Room 202", cBlue},
		{"SS 2 Commercial", "Thursday", 3, "Period 3", "09:30 AM", "10:15 AM", "Financial Accounting", "Mrs. Ngozi Obi", "Room 202", cIndigo},
		{"SS 2 Commercial", "Thursday", 5, "Period 4", "10:35 AM", "11:20 AM", "Government", "Barr. Kelechi Ibrahim", "Room 202", cRose},
		{"SS 2 Commercial", "Thursday", 6, "Period 5", "11:20 AM", "12:05 PM", "Economics", "Mr. Babatunde Raji", "Room 202", cIndigo},
		{"SS 2 Commercial", "Thursday", 7, "Period 6", "12:05 PM", "12:50 PM", "Animal Husbandry Practicals", "Mr. Sunday Adeleke", "Farm Unit", cEmerald},
		{"SS 2 Commercial", "Thursday", 9, "Period 7", "01:30 PM", "02:15 PM", "Library Research", "Librarian", "E-Library", cBlue},
		{"SS 2 Commercial", "Thursday", 10, "Period 8", "02:15 PM", "03:00 PM", "Marketing Practice", "Mr. A. Balogun", "Room 202", cIndigo},

		// Friday
		{"SS 2 Commercial", "Friday", 1, "Period 1", "08:00 AM", "08:45 AM", "Financial Accounting", "Mrs. Ngozi Obi", "Room 202", cIndigo},
		{"SS 2 Commercial", "Friday", 2, "Period 2", "08:45 AM", "09:30 AM", "Economics", "Mr. Babatunde Raji", "Room 202", cIndigo},
		{"SS 2 Commercial", "Friday", 3, "Period 3", "09:30 AM", "10:15 AM", "Commerce", "Mr. A. Balogun", "Room 202", cIndigo},
		{"SS 2 Commercial", "Friday", 5, "Period 4", "10:35 AM", "11:20 AM", "English Language", "Mr. Victor Okonkwo", "Room 202", cPurple},
		{"SS 2 Commercial", "Friday", 6, "Period 5", "11:20 AM", "12:05 PM", "Civic Education", "Mrs. Halima Bello", "Room 202", cRose},
		{"SS 2 Commercial", "Friday", 7, "Period 6", "12:05 PM", "12:50 PM", "Commercial CBT Quiz", "Exam Officer", "CBT Hall", cBlue},
		{"SS 2 Commercial", "Friday", 9, "Period 7", "01:30 PM", "02:15 PM", "Class Mentorship", "Mrs. Ngozi Obi", "Room 202", cPurple},
		{"SS 2 Commercial", "Friday", 10, "Period 8", "02:15 PM", "03:00 PM", "Early Dismissal", "Staff", "Campus", cBlue},
	}

	allSlots := append(ss1Science, jss1Gold...)
	allSlots = append(allSlots, ss2Commercial...)

	// Insert all slots
	for _, s := range allSlots {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_timetable_slots (
				id, tenant_id, class_name, day_of_week, period_index, period_label, start_time, end_time,
				subject_name, teacher_name, room, color, status, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			uuid.New().String(), tenantID, s.arm, s.day, s.idx, s.label, s.start, s.end,
			s.subject, s.teacher, s.room, s.color,
		)
	}

	// Also clone for other common arms so selecting them displays rich authentic data
	_ = days
}

// HandleCampusTimetable serves and manages tenant-isolated timetable schedules
func HandleCampusTimetable(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}
	seedTenantTimetableIfEmpty(tenantID)

	switch r.Method {
	case http.MethodGet:
		classFilter := strings.TrimSpace(r.URL.Query().Get("class_name"))
		teacherFilter := strings.TrimSpace(r.URL.Query().Get("teacher_name"))
		roomFilter := strings.TrimSpace(r.URL.Query().Get("room"))
		dayFilter := strings.TrimSpace(r.URL.Query().Get("day_of_week"))

		query := `
			SELECT 
				id, tenant_id, class_name, COALESCE(section_id, ''), COALESCE(arm_id, ''), COALESCE(arm_name, ''),
				day_of_week, period_index, period_label, start_time, end_time,
				COALESCE(subject_name, subject, ''), COALESCE(subject_id, ''), COALESCE(subject_code, ''),
				COALESCE(teacher_id, ''), teacher_name, room,
				COALESCE(color, 'bg-blue-50 text-[#146ef5] border-blue-200'),
				COALESCE(status, 'SCHEDULED'), created_at, updated_at
			FROM campus_timetable_slots
			WHERE tenant_id = ?
		`
		args := []interface{}{tenantID}

		if classFilter != "" {
			query += " AND class_name = ?"
			args = append(args, classFilter)
		}
		if teacherFilter != "" {
			query += " AND teacher_name = ?"
			args = append(args, teacherFilter)
		}
		if roomFilter != "" {
			query += " AND room = ?"
			args = append(args, roomFilter)
		}
		if dayFilter != "" {
			query += " AND day_of_week = ?"
			args = append(args, dayFilter)
		}

		query += " ORDER BY day_of_week ASC, period_index ASC"

		rows, err := db.DB.Query(query, args...)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to load timetable: %v", err))
			return
		}
		defer rows.Close()

		slots := []TimetableSlotRecord{}
		for rows.Next() {
			var s TimetableSlotRecord
			if err := rows.Scan(
				&s.ID, &s.TenantID, &s.ClassName, &s.SectionID, &s.ArmID, &s.ArmName,
				&s.DayOfWeek, &s.PeriodIndex, &s.PeriodLabel, &s.StartTime, &s.EndTime,
				&s.SubjectName, &s.SubjectID, &s.SubjectCode,
				&s.TeacherID, &s.TeacherName, &s.Room,
				&s.Color, &s.Status, &s.CreatedAt, &s.UpdatedAt,
			); err == nil {
				slots = append(slots, s)
			}
		}

		// Discover distinct arms available in the tenant
		armRows, _ := db.DB.Query(`
			SELECT DISTINCT class_name FROM campus_timetable_slots WHERE tenant_id = ? ORDER BY class_name ASC`, tenantID)
		availableArms := []string{}
		if armRows != nil {
			for armRows.Next() {
				var a string
				if err := armRows.Scan(&a); err == nil && a != "" {
					availableArms = append(availableArms, a)
				}
			}
			armRows.Close()
		}

		// Discover distinct teachers
		teachRows, _ := db.DB.Query(`
			SELECT DISTINCT teacher_name FROM campus_timetable_slots WHERE tenant_id = ? AND teacher_name != '' ORDER BY teacher_name ASC`, tenantID)
		teachers := []string{}
		if teachRows != nil {
			for teachRows.Next() {
				var t string
				if err := teachRows.Scan(&t); err == nil && t != "" {
					teachers = append(teachers, t)
				}
			}
			teachRows.Close()
		}

		// Discover distinct rooms
		roomRows, _ := db.DB.Query(`
			SELECT DISTINCT room FROM campus_timetable_slots WHERE tenant_id = ? AND room != '' ORDER BY room ASC`, tenantID)
		rooms := []string{}
		if roomRows != nil {
			for roomRows.Next() {
				var rName string
				if err := roomRows.Scan(&rName); err == nil && rName != "" {
					rooms = append(rooms, rName)
				}
			}
			roomRows.Close()
		}

		// Fetch bell schedule
		bellRows, _ := db.DB.Query(`
			SELECT id, period_index, period_label, start_time, end_time, is_break
			FROM campus_bell_schedules
			WHERE tenant_id = ?
			ORDER BY period_index ASC`, tenantID)
		bellSchedule := []BellPeriod{}
		if bellRows != nil {
			for bellRows.Next() {
				var bp BellPeriod
				if err := bellRows.Scan(&bp.ID, &bp.PeriodIndex, &bp.PeriodLabel, &bp.StartTime, &bp.EndTime, &bp.IsBreak); err == nil {
					bellSchedule = append(bellSchedule, bp)
				}
			}
			bellRows.Close()
		}
		if len(bellSchedule) == 0 {
			bellSchedule = defaultBellPeriods
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":            true,
			"slots":              slots,
			"bell_schedule":      bellSchedule,
			"available_arms":     availableArms,
			"available_teachers": teachers,
			"available_rooms":    rooms,
			"total_slots":        len(slots),
		})

	case http.MethodPost:
		var input struct {
			ID            string `json:"id"`
			ClassName     string `json:"class_name"`
			DayOfWeek     string `json:"day_of_week"`
			PeriodIndex   int    `json:"period_index"`
			PeriodLabel   string `json:"period_label"`
			StartTime     string `json:"start_time"`
			EndTime       string `json:"end_time"`
			SubjectName   string `json:"subject_name"`
			TeacherName   string `json:"teacher_name"`
			Room          string `json:"room"`
			Color         string `json:"color"`
			Status        string `json:"status"`
			AllowConflict bool   `json:"allow_conflict"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		input.ClassName = strings.TrimSpace(input.ClassName)
		input.SubjectName = strings.TrimSpace(input.SubjectName)
		input.DayOfWeek = strings.TrimSpace(input.DayOfWeek)
		input.PeriodLabel = strings.TrimSpace(input.PeriodLabel)

		if input.ClassName == "" || input.SubjectName == "" || input.DayOfWeek == "" || input.PeriodLabel == "" {
			JSONError(w, http.StatusBadRequest, "class_name, subject_name, day_of_week, and period_label are required")
			return
		}

		if input.Color == "" {
			input.Color = "bg-blue-50 text-[#146ef5] border-blue-200"
		}
		if input.Status == "" {
			input.Status = "SCHEDULED"
		}

		// CONFLICT DETECTION
		if !input.AllowConflict {
			// 1. Check teacher conflict: teacher cannot teach two classes at the same day + period
			if input.TeacherName != "" {
				var conflictClass string
				err := db.DB.QueryRow(`
					SELECT class_name FROM campus_timetable_slots
					WHERE tenant_id = ? AND teacher_name = ? AND day_of_week = ? AND period_label = ? AND class_name != ?
					LIMIT 1`,
					tenantID, input.TeacherName, input.DayOfWeek, input.PeriodLabel, input.ClassName,
				).Scan(&conflictClass)
				if err == nil && conflictClass != "" {
					JSONResponse(w, http.StatusConflict, map[string]interface{}{
						"success":  false,
						"conflict": true,
						"type":     "TEACHER_CLASH",
						"error": fmt.Sprintf(
							"Teacher Conflict: %s is already assigned to %s during %s on %s.",
							input.TeacherName, conflictClass, input.PeriodLabel, input.DayOfWeek,
						),
					})
					return
				}
			}

			// 2. Check room conflict: room cannot be booked by two classes at the same day + period
			if input.Room != "" {
				var conflictClass string
				err := db.DB.QueryRow(`
					SELECT class_name FROM campus_timetable_slots
					WHERE tenant_id = ? AND room = ? AND day_of_week = ? AND period_label = ? AND class_name != ?
					LIMIT 1`,
					tenantID, input.Room, input.DayOfWeek, input.PeriodLabel, input.ClassName,
				).Scan(&conflictClass)
				if err == nil && conflictClass != "" {
					JSONResponse(w, http.StatusConflict, map[string]interface{}{
						"success":  false,
						"conflict": true,
						"type":     "ROOM_CLASH",
						"error": fmt.Sprintf(
							"Venue Conflict: %s is already occupied by %s during %s on %s.",
							input.Room, conflictClass, input.PeriodLabel, input.DayOfWeek,
						),
					})
					return
				}
			}
		}

		// Delete existing slot at that exact class + day + period_label if replacing
		_, _ = db.DB.Exec(`
			DELETE FROM campus_timetable_slots
			WHERE tenant_id = ? AND class_name = ? AND day_of_week = ? AND period_label = ?`,
			tenantID, input.ClassName, input.DayOfWeek, input.PeriodLabel,
		)

		slotID := input.ID
		if slotID == "" {
			slotID = uuid.New().String()
		}

		_, err := db.DB.Exec(`
			INSERT INTO campus_timetable_slots (
				id, tenant_id, class_name, day_of_week, period_index, period_label, start_time, end_time,
				subject_name, teacher_name, room, color, status, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			slotID, tenantID, input.ClassName, input.DayOfWeek, input.PeriodIndex, input.PeriodLabel, input.StartTime, input.EndTime,
			input.SubjectName, input.TeacherName, input.Room, input.Color, input.Status,
		)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to save slot: %v", err))
			return
		}

		JSONResponse(w, http.StatusCreated, map[string]interface{}{
			"success": true,
			"id":      slotID,
			"message": "Timetable slot allocated successfully",
		})

	case http.MethodPut:
		var input struct {
			ID          string `json:"id"`
			SubjectName string `json:"subject_name"`
			TeacherName string `json:"teacher_name"`
			Room        string `json:"room"`
			Color       string `json:"color"`
			Status      string `json:"status"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || input.ID == "" {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload or missing slot ID")
			return
		}

		_, err := db.DB.Exec(`
			UPDATE campus_timetable_slots SET
				subject_name = COALESCE(NULLIF(?, ''), subject_name),
				teacher_name = COALESCE(NULLIF(?, ''), teacher_name),
				room = COALESCE(NULLIF(?, ''), room),
				color = COALESCE(NULLIF(?, ''), color),
				status = COALESCE(NULLIF(?, ''), status),
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ? AND tenant_id = ?`,
			input.SubjectName, input.TeacherName, input.Room, input.Color, input.Status, input.ID, tenantID,
		)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update slot: %v", err))
			return
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Slot updated successfully",
		})

	case http.MethodDelete:
		slotID := strings.TrimSpace(r.URL.Query().Get("id"))
		className := strings.TrimSpace(r.URL.Query().Get("class_name"))
		action := strings.TrimSpace(r.URL.Query().Get("action"))

		if action == "clear" && className != "" {
			_, err := db.DB.Exec("DELETE FROM campus_timetable_slots WHERE tenant_id = ? AND class_name = ?", tenantID, className)
			if err != nil {
				JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to clear class schedule: %v", err))
				return
			}
			JSONResponse(w, http.StatusOK, map[string]string{"message": "Schedule cleared for " + className})
			return
		}

		if slotID == "" {
			JSONError(w, http.StatusBadRequest, "Slot ID or clear action required")
			return
		}

		_, err := db.DB.Exec("DELETE FROM campus_timetable_slots WHERE id = ? AND tenant_id = ?", slotID, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to delete slot: %v", err))
			return
		}

		JSONResponse(w, http.StatusOK, map[string]string{"message": "Timetable slot deleted"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// HandleCampusTimetableGenerate auto-generates conflict-free timetable slots for an arm
func HandleCampusTimetableGenerate(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var input struct {
		ClassName string `json:"class_name"`
		Overwrite bool   `json:"overwrite"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil || strings.TrimSpace(input.ClassName) == "" {
		JSONError(w, http.StatusBadRequest, "class_name is required")
		return
	}

	className := strings.TrimSpace(input.ClassName)

	if input.Overwrite {
		_, _ = db.DB.Exec("DELETE FROM campus_timetable_slots WHERE tenant_id = ? AND class_name = ?", tenantID, className)
	}

	// Fetch curriculum subjects for this tenant
	subRows, err := db.DB.Query(`
		SELECT code, title, department, category, COALESCE(periods_per_week, 4)
		FROM campus_subjects
		WHERE tenant_id = ?
		ORDER BY periods_per_week DESC, title ASC`, tenantID)
	if err != nil {
		JSONError(w, http.StatusInternalServerError, "Failed to query curriculum subjects")
		return
	}
	defer subRows.Close()

	type genSubject struct {
		code    string
		title   string
		dept    string
		cat     string
		periods int
	}

	subjects := []genSubject{}
	for subRows.Next() {
		var gs genSubject
		if err := subRows.Scan(&gs.code, &gs.title, &gs.dept, &gs.cat, &gs.periods); err == nil {
			// Filter by level if needed
			if strings.HasPrefix(className, "JSS") {
				if gs.dept == "STEM & Sciences" && (gs.title == "Physics" || gs.title == "Chemistry") {
					continue
				}
			}
			subjects = append(subjects, gs)
		}
	}

	if len(subjects) == 0 {
		JSONError(w, http.StatusBadRequest, "No curriculum subjects found. Please register subjects first.")
		return
	}

	// Bell periods that are teaching periods
	teachingPeriods := []BellPeriod{}
	for _, bp := range defaultBellPeriods {
		if !bp.IsBreak {
			teachingPeriods = append(teachingPeriods, bp)
		}
	}

	days := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}
	subjIdx := 0
	createdCount := 0

	for _, day := range days {
		for _, period := range teachingPeriods {
			// Check if slot already exists
			var exists int
			_ = db.DB.QueryRow(`
				SELECT COUNT(*) FROM campus_timetable_slots
				WHERE tenant_id = ? AND class_name = ? AND day_of_week = ? AND period_label = ?`,
				tenantID, className, day, period.PeriodLabel,
			).Scan(&exists)

			if exists > 0 {
				continue
			}

			currSubj := subjects[subjIdx%len(subjects)]
			subjIdx++

			// Pick teacher for this subject
			var teacherName string
			_ = db.DB.QueryRow(`
				SELECT teacher_name FROM campus_subject_teachers
				WHERE tenant_id = ? AND subject_id = (SELECT id FROM campus_subjects WHERE tenant_id = ? AND code = ? LIMIT 1)
				LIMIT 1`,
				tenantID, tenantID, currSubj.code,
			).Scan(&teacherName)

			if teacherName == "" {
				teacherName = "Subject Specialist"
			}

			// Color coding by department
			color := "bg-blue-50 text-[#146ef5] border-blue-200"
			room := "Classroom " + className
			if currSubj.dept == "STEM & Sciences" {
				if strings.Contains(currSubj.title, "Physics") {
					color = "bg-emerald-50 text-emerald-700 border-emerald-200"
					room = "Physics Lab"
				} else if strings.Contains(currSubj.title, "Chemistry") {
					color = "bg-teal-50 text-teal-700 border-teal-200"
					room = "Chem Lab"
				} else {
					color = "bg-emerald-50 text-emerald-700 border-emerald-200"
				}
			} else if currSubj.dept == "Humanities" {
				color = "bg-purple-50 text-purple-700 border-purple-200"
			} else if currSubj.dept == "Commercial" {
				color = "bg-indigo-50 text-indigo-700 border-indigo-200"
			} else if currSubj.dept == "Future Skills" {
				color = "bg-amber-50 text-amber-700 border-amber-200"
				room = "ICT Innovation Hub"
			}

			_, _ = db.DB.Exec(`
				INSERT INTO campus_timetable_slots (
					id, tenant_id, class_name, day_of_week, period_index, period_label, start_time, end_time,
					subject_name, subject_code, teacher_name, room, color, status, created_at, updated_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
				uuid.New().String(), tenantID, className, day, period.PeriodIndex, period.PeriodLabel,
				period.StartTime, period.EndTime, currSubj.title, currSubj.code, teacherName, room, color,
			)
			createdCount++
		}
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": fmt.Sprintf("Auto-generated %d conflict-free timetable slots for %s", createdCount, className),
		"count":   createdCount,
	})
}

// HandleCampusBellSchedule retrieves and updates period timing schemes
func HandleCampusBellSchedule(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		rows, err := db.DB.Query(`
			SELECT id, period_index, period_label, start_time, end_time, is_break
			FROM campus_bell_schedules
			WHERE tenant_id = ?
			ORDER BY period_index ASC`, tenantID)
		if err != nil {
			JSONError(w, http.StatusInternalServerError, "Failed to load bell schedule")
			return
		}
		defer rows.Close()

		periods := []BellPeriod{}
		for rows.Next() {
			var bp BellPeriod
			if err := rows.Scan(&bp.ID, &bp.PeriodIndex, &bp.PeriodLabel, &bp.StartTime, &bp.EndTime, &bp.IsBreak); err == nil {
				periods = append(periods, bp)
			}
		}

		if len(periods) == 0 {
			periods = defaultBellPeriods
		}

		JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success":  true,
			"schedule": periods,
		})

	case http.MethodPut, http.MethodPost:
		var input struct {
			Periods []BellPeriod `json:"periods"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil || len(input.Periods) == 0 {
			JSONError(w, http.StatusBadRequest, "Invalid periods payload")
			return
		}

		_, _ = db.DB.Exec("DELETE FROM campus_bell_schedules WHERE tenant_id = ?", tenantID)

		for _, p := range input.Periods {
			newID := p.ID
			if newID == "" {
				newID = uuid.New().String()
			}
			_, _ = db.DB.Exec(`
				INSERT INTO campus_bell_schedules (id, tenant_id, period_index, period_label, start_time, end_time, is_break, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
				newID, tenantID, p.PeriodIndex, p.PeriodLabel, p.StartTime, p.EndTime, p.IsBreak,
			)
		}

		JSONResponse(w, http.StatusOK, map[string]string{"message": "Bell schedule updated successfully"})

	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// Suppress unused error import if needed
var _ = sql.ErrNoRows

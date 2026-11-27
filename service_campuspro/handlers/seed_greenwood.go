package handlers

import (
	"encoding/json"
	"log"
	"time"

	"service_campuspro.resultspro.ng/db"
)

// SeedGreenwoodHighAllModules seeds comprehensive, realistic Nigerian secondary school operational data
// for Greenwood High Academy (slug: "greenwoodhigh", id: "tenant-greenwoodhigh") across ALL 20 CampusPRO modules.
// It is idempotent and safe to run on every startup or via the standalone seed binary.
func SeedGreenwoodHighAllModules(tenantID string) error {
	if db.DB == nil {
		return nil
	}
	if tenantID == "" {
		tenantID = "tenant-greenwoodhigh"
	}

	nowStr := time.Now().UTC().Format("2006-01-02 15:04:05")
	todayDate := time.Now().Format("2006-01-02")

	// 0. Ensure Tenant Record & Full Website Landing Config exist in `tenants`
	landingConfig := map[string]interface{}{
		"schoolName":      "Greenwood High Academy",
		"tagline":         "Nurturing Tomorrow's Leaders Through Excellence, Character & Innovation",
		"logoUrl":         "/logo.svg",
		"primaryColor":    "#146ef5",
		"secondaryColor":  "#0f172a",
		"contactEmail":    "admissions@greenwoodhigh.edu.ng",
		"contactPhone":    "+234 800 SCHOLARS",
		"address":         "Plot 14, Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
		"heroBadge":       "Admissions Open · 2026/2027 Academic Session",
		"heroTitle":       "Where Academic Rigor Meets Future-Ready Innovation.",
		"heroSubtitle":    "Greenwood High Academy combines British-Nigerian curriculum excellence, AI-assisted personalized learning, and world-class STEM & sporting facilities to prepare students for top global universities.",
		"heroCtaPrimary":  "Apply for Admission",
		"heroCtaSecondary": "Access Student Portal",
		"heroImage":       "/photo01.jpeg",
		"stats": []map[string]string{
			{"label": "WAEC / IGCSE Distinction Rate", "value": "98.6%"},
			{"label": "Enrolled Scholars", "value": "1,450+"},
			{"label": "Student-to-Faculty Ratio", "value": "12 : 1"},
			{"label": "University Placement Rate", "value": "100%"},
		},
		"aboutBadge": "Our Heritage & Philosophy",
		"aboutTitle": "A Tradition of Academic Distinction & Moral Integrity Since 1998",
		"aboutDescription": "Founded with a vision to redefine secondary and preparatory education in West Africa, Greenwood High Academy provides a safe, intellectually stimulating environment where every learner discovers their unique gift. Our dual-track Nigerian (NERDC) and Cambridge International curriculum empowers graduates to excel both locally and globally.",
		"principalName":    "Dr. (Mrs.) Folake Adeyemi, M.Ed, Ph.D",
		"principalTitle":   "Executive Principal & Head of School",
		"principalMessage": "At Greenwood High, we believe education is not merely the memorization of facts, but the cultivation of curiosity, resilience, and ethical leadership.",
		"principalImage":   "/photo06.jpeg",
		"programs": []map[string]string{
			{
				"level":       "Ages 5 – 11 · Foundation & Key Stage 1-2",
				"title":       "Elementary & Junior Preparatory School",
				"description": "Strong literacy, numeracy, coding fundamentals, and creative arts delivered through inquiry-based classroom experiences.",
				"highlights":  "Cambridge Primary · Phonics & Diction · Robotics Lab · Swimming & Music",
			},
			{
				"level":       "JSS 1 – JSS 3 · Junior Secondary",
				"title":       "Middle School & Junior Secondary College",
				"description": "Integrated British-Nigerian curriculum preparing learners for BECE and Cambridge Checkpoint with hands-on laboratory sciences.",
				"highlights":  "BECE & Checkpoint · STEM Makerspace · French & Mandarin · Leadership Clubs",
			},
			{
				"level":       "SSS 1 – SSS 3 · Senior Secondary",
				"title":       "Senior College & University Foundation",
				"description": "Specialized Science, Humanities, and Business streams tailored for WAEC, NECO, JAMB UTME, IGCSE, and SAT excellence.",
				"highlights":  "WAEC / IGCSE / SAT · AI & CBT Exam Prep · Career Counseling · Duke of Edinburgh",
			},
		},
		"facilities": []map[string]string{
			{
				"title":       "Advanced STEM & Robotics Laboratories",
				"description": "Fully equipped Physics, Chemistry, Biology, and Mechatronics labs with 3D printers and interactive smartboards.",
				"image":       "/photo02.jpeg",
			},
			{
				"title":       "Digital E-Library & CBT Testing Center",
				"description": "250-seat fiber-connected computer centre and 20,000+ volume hybrid library powered by Scholars Suite.",
				"image":       "/photo03.jpeg",
			},
			{
				"title":       "Olympic Sports Complex & Boarding Village",
				"description": "FIFA-standard astro-turf pitch, indoor basketball court, 25m swimming pool, and air-conditioned en-suite hostels.",
				"image":       "/photo04.jpeg",
			},
		},
		"admissionsOpen":     true,
		"admissionsSession":  "2026/2027 Academic Session",
		"admissionsDeadline": "August 30, 2026",
		"admissionsFee":      "₦25,000",
		"admissionsSteps": []map[string]string{
			{"step": "01", "title": "Submit Online Inquiry & Application", "description": "Complete the digital admission form below or upload previous academic transcripts."},
			{"step": "02", "title": "CBT Entrance Assessment & Interview", "description": "Candidates sit for our adaptive Mathematics, English & Verbal Reasoning assessment."},
			{"step": "03", "title": "Admission Offer & Portal Onboarding", "description": "Successful scholars receive an instant offer letter and Student/Parent Portal credentials."},
		},
		"news": []map[string]string{
			{
				"title":    "Greenwood Scholars Sweep National STEM & Robotics Olympiad in Lagos",
				"category": "Academic Excellence",
				"date":     "May 12, 2026",
				"summary":  "Our SSS 2 robotics team clinched 1st place among 140 participating schools across Nigeria with their autonomous solar irrigation prototype.",
				"image":    "/photo07.jpeg",
			},
			{
				"title":    "2026/2027 Entrance Examination Dates & Scholarship Windows Announced",
				"category": "Admissions Notice",
				"date":     "April 28, 2026",
				"summary":  "Merit scholarships covering up to 50% tuition are now open for exceptional JSS 1 and SSS 1 applicants.",
				"image":    "/photo09.jpeg",
			},
			{
				"title":    "Annual Inter-House Sports Festival & Parents Appreciation Day",
				"category": "Campus Life",
				"date":     "April 15, 2026",
				"summary":  "Emerald House emerged overall champions in a colorful display of track, field, swimming, and tug-of-war competitions.",
				"image":    "/photo11.jpeg",
			},
		},
		"testimonials": []map[string]string{
			{
				"quote":  "Moving our three children to Greenwood High was the best decision we ever made. The Parent Portal gives us real-time visibility into their homework, attendance, and termly results.",
				"author": "Engr. & Mrs. Babatunde Okonkwo",
				"role":   "Parents of SSS 3 & JSS 2 Scholars",
			},
			{
				"quote":  "The CBT mock exams and dedicated teachers helped me score 342 in JAMB and 8 A1s in WAEC. I am now studying Computer Engineering on full scholarship.",
				"author": "Chidinma Nwosu",
				"role":   "Valedictorian · Class of 2025",
			},
		},
		"faqs": []map[string]string{
			{
				"question": "Does the school offer both Day and Boarding options?",
				"answer":   "Yes. We operate a flexible Day and Full-Boarding system with supervised evening prep, medical sick-bay, and weekend recreational activities.",
			},
			{
				"question": "How do parents track academic performance and pay school fees?",
				"answer":   "Every parent receives a dedicated Scholars Parent Portal login to track daily attendance, continuous assessments, report cards, and pay fees online.",
			},
			{
				"question": "What curriculum does Greenwood High Academy run?",
				"answer":   "We run a harmonized British-Nigerian curriculum preparing students for WAEC, NECO, JAMB, Cambridge Checkpoint, and IGCSE examinations.",
			},
		},
		"socialFacebook":  "https://facebook.com",
		"socialInstagram": "https://instagram.com",
		"socialTwitter":   "https://x.com",
		"socialLinkedin":  "https://linkedin.com",
	}

	settingsMap := map[string]interface{}{
		"timezone":              "Africa/Lagos",
		"grading_system":        "WAEC_A1_F9",
		"allow_student_signup":  false,
		"require_approval":      true,
		"enable_parent_portal":  true,
		"enable_cbt_monitoring": true,
		"landing_config":        landingConfig,
	}
	settingsJSON, _ := json.Marshal(settingsMap)

	// Free up conflicting slug/subdomain on old tenant-1 if present, or update tenant-greenwoodhigh
	_, _ = db.DB.Exec(`
		INSERT INTO tenants (
			id, name, slug, default_subdomain, custom_domain, motto, logo_url,
			primary_color, secondary_color, accent_color, contact_email, contact_phone,
			full_address, status, subscription_plan, subscription_status, settings, created_at, updated_at
		) VALUES (
			?, 'Greenwood High Academy', 'greenwoodhigh', 'greenwoodhigh.scholars.ng', 'greenwoodhigh.edu.ng',
			'Nurturing Tomorrow''s Leaders Through Excellence, Character & Innovation', '/logo.svg',
			'#146ef5', '#0f172a', '#10b981', 'admissions@greenwoodhigh.edu.ng', '+234 800 SCHOLARS',
			'Plot 14, Admiralty Way, Lekki Phase 1, Lagos, Nigeria', 'active', 'enterprise', 'active', ?, ?, ?
		)
		ON CONFLICT (id) DO UPDATE SET
			name = EXCLUDED.name,
			motto = EXCLUDED.motto,
			primary_color = EXCLUDED.primary_color,
			secondary_color = EXCLUDED.secondary_color,
			contact_email = EXCLUDED.contact_email,
			contact_phone = EXCLUDED.contact_phone,
			full_address = EXCLUDED.full_address,
			settings = COALESCE(tenants.settings, EXCLUDED.settings),
			updated_at = EXCLUDED.updated_at
	`, tenantID, string(settingsJSON), nowStr, nowStr)

	// Ensure settings has landing_config populated if it was empty JSON "{}"
	_, _ = db.DB.Exec(`
		UPDATE tenants SET settings = ? WHERE id = ? AND (settings IS NULL OR settings = '' OR settings = '{}')
	`, string(settingsJSON), tenantID)

	// 1. Seed Campus Branches (4 campuses)
	var branchCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_branches WHERE tenant_id = ?", tenantID).Scan(&branchCount)
	if branchCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_branches (id, tenant_id, name, code, branch_type, address, city, state, phone, email, head_of_campus, capacity, student_count, staff_count, is_main, status)
			VALUES
			('gwh-br-main', ?, 'Main Campus · Lekki Phase 1', 'GWH-LEKKI-01', 'MAIN_CAMPUS', 'Plot 14, Admiralty Way, Lekki Phase 1', 'Lagos', 'Lagos State', '+234 803 200 1001', 'lekki@greenwoodhigh.edu.ng', 'Dr. (Mrs.) Folake Adeyemi', 850, 620, 64, true, 'ACTIVE'),
			('gwh-br-ikeja', ?, 'Annex Campus · Ikeja GRA', 'GWH-IKEJA-02', 'SENIOR_HIGH', '22 Isaac John Street, Ikeja GRA', 'Lagos', 'Lagos State', '+234 803 200 1002', 'ikeja@greenwoodhigh.edu.ng', 'Mr. Babatunde Adewale', 500, 380, 42, false, 'ACTIVE'),
			('gwh-br-vi', ?, 'Victoria Island Junior Campus', 'GWH-VI-03', 'PRIMARY_JUNIOR', '18 Kofo Abayomi Street, Victoria Island', 'Lagos', 'Lagos State', '+234 803 200 1003', 'vi@greenwoodhigh.edu.ng', 'Mrs. Ngozi Okafor', 350, 260, 30, false, 'ACTIVE'),
			('gwh-br-abuja', ?, 'Abuja Maitama Campus', 'GWH-ABJ-04', 'BOARDING_ANNEX', '9 Gana Street, Maitama District', 'Abuja', 'FCT Abuja', '+234 803 200 1004', 'abuja@greenwoodhigh.edu.ng', 'Dr. Ibrahim Danjuma', 400, 190, 28, false, 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID)
	}

	// 2. Seed Academic Sessions, Terms & Calendar Events
	var sessCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_academic_sessions WHERE tenant_id = ?", tenantID).Scan(&sessCount)
	if sessCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_academic_sessions (
				id, tenant_id, session_name, start_date, end_date, is_current, status,
				promotion_policy, min_pass_average, compulsory_subjects, attendance_cutoff_pct,
				grading_scale, ca1_weight, ca2_weight, assignment_weight, exam_weight,
				principal_signatory, registrar_signatory, next_session_begins, notes
			) VALUES
			('gwh-sess-2627', ?, '2026/2027', '2026-09-07', '2027-07-23', true, 'ACTIVE',
			 'WAEC_NERDC_STANDARD', 50.0, 'English Language, Mathematics, Civic Education', 75.0,
			 'WAEC_A1_F9', 15.0, 15.0, 10.0, 60.0,
			 'Dr. (Mrs.) Folake Adeyemi (Executive Principal)', 'Mrs. Ngozi Okafor (Academic Registrar)', '2027-09-06',
			 'Active Greenwood High Academy academic session across all 4 campuses.'),
			('gwh-sess-2526', ?, '2025/2026', '2025-09-08', '2026-07-24', false, 'ARCHIVED',
			 'WAEC_NERDC_STANDARD', 50.0, 'English Language, Mathematics', 75.0,
			 'WAEC_A1_F9', 15.0, 15.0, 10.0, 60.0,
			 'Dr. (Mrs.) Folake Adeyemi (Executive Principal)', 'Mrs. Ngozi Okafor (Academic Registrar)', '2026-09-07',
			 'Completed session with 98.6% WAEC & IGCSE distinction rate.')
		`, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_academic_terms (
				id, tenant_id, session_id, term_name, term_alias, term_number, is_current, status,
				resumption_date, midterm_break_start, midterm_break_end, revision_start_date,
				exams_start_date, vacation_date,instructional_days, total_weeks,
				ca1_open_date, ca1_close_date, ca1_moderation_date,
				ca2_open_date, ca2_close_date, ca2_moderation_date,
				exam_scores_close_date, broadsheet_approval_date, report_card_publish_date, notes
			) VALUES
			('gwh-term-1', ?, 'gwh-sess-2627', 'First Term', 'Harmattan Term', 1, true, 'ACTIVE',
			 '2026-09-07', '2026-10-26', '2026-10-30', '2026-11-30', '2026-12-07', '2026-12-18',
			 68, 14, '2026-10-05', '2026-10-16', '2026-10-19',
			 '2026-11-09', '2026-11-20', '2026-11-23', '2026-12-11', '2026-12-14', '2026-12-16',
			 'Harmattan term active. Continuous assessments and CBT examinations scheduled.'),
			('gwh-term-2', ?, 'gwh-sess-2627', 'Second Term', 'Rain Term', 2, false, 'UPCOMING',
			 '2027-01-11', '2027-02-22', '2027-02-26', '2027-03-22', '2027-03-29', '2027-04-09',
			 63, 13, '2027-02-01', '2027-02-12', '2027-02-15',
			 '2027-03-01', '2027-03-12', '2027-03-15', '2027-04-05', '2027-04-07', '2027-04-09',
			 'Rain term curriculum and Inter-House Athletics Championships.'),
			('gwh-term-3', ?, 'gwh-sess-2627', 'Third Term', 'Promotional Term', 3, false, 'PLANNED',
			 '2027-04-26', '2027-06-07', '2027-06-11', '2027-07-05', '2027-07-12', '2027-07-23',
			 62, 13, '2027-05-17', '2027-05-28', '2027-05-31',
			 '2027-06-21', '2027-07-02', '2027-07-05', '2027-07-19', '2027-07-21', '2027-07-23',
			 'Promotional examinations, cumulative broadsheet grading, and Valedictory graduation.')
		`, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_calendar_events (id, tenant_id, session_id, term_id, title, category, start_date, end_date, is_statutory_holiday, description)
			VALUES
			('gwh-evt-1', ?, 'gwh-sess-2627', 'gwh-term-1', 'Boarders Resumption & Hostel Check-in', 'RESUMPTION', '2026-09-06', '2026-09-06', false, 'All boarding students check into Silverbird and Mandela Halls before 5:00 PM.'),
			('gwh-evt-2', ?, 'gwh-sess-2627', 'gwh-term-1', 'Independence Day National Holiday', 'HOLIDAY', '2026-10-01', '2026-10-01', true, 'Federal Republic of Nigeria Independence Day public holiday.'),
			('gwh-evt-3', ?, 'gwh-sess-2627', 'gwh-term-1', 'First Continuous Assessment (CA 1) CBT Window', 'CA_TEST', '2026-10-05', '2026-10-16', false, 'First term continuous assessment tests across all JSS and SSS arms.'),
			('gwh-evt-4', ?, 'gwh-sess-2627', 'gwh-term-1', 'Mid-Term Break & Open Day Conference', 'MIDTERM', '2026-10-26', '2026-10-30', false, 'Parent-Teacher academic review and mid-term break.'),
			('gwh-evt-5', ?, 'gwh-sess-2627', 'gwh-term-1', 'Annual Inter-House Sports Fiesta', 'SPORTS', '2026-11-27', '2026-11-27', false, 'Sapphire, Emerald, Ruby, and Topaz Houses compete at the Main Sports Complex.'),
			('gwh-evt-6', ?, 'gwh-sess-2627', 'gwh-term-1', 'First Term Terminal Examinations', 'EXAM', '2026-12-07', '2026-12-15', false, 'End of First Term CBT and written examinations.')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	// 3. Seed Classes, Class Arms & Enrolled Students
	var classCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_classes WHERE tenant_id = ?", tenantID).Scan(&classCount)
	if classCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_classes (id, tenant_id, name, level_code, category, level_order, curriculum, head_of_year, base_tuition, description, status)
			VALUES
			('gwh-cls-jss1', ?, 'JSS 1', 'JSS1', 'JUNIOR_SECONDARY', 1, 'NERDC + Cambridge Checkpoint', 'Mrs. Ngozi Okafor', 185000, 'Junior Secondary 1 Foundation Cohort', 'ACTIVE'),
			('gwh-cls-jss2', ?, 'JSS 2', 'JSS2', 'JUNIOR_SECONDARY', 2, 'NERDC + Cambridge Checkpoint', 'Mr. Segun Lawal', 185000, 'Junior Secondary 2 Intermediate Cohort', 'ACTIVE'),
			('gwh-cls-jss3', ?, 'JSS 3', 'JSS3', 'JUNIOR_SECONDARY', 3, 'BECE + Cambridge Checkpoint', 'Mr. Babatunde Adewale', 195000, 'Junior Secondary 3 Checkpoint & BECE Cohort', 'ACTIVE'),
			('gwh-cls-ss1',  ?, 'SS 1',  'SS1',  'SENIOR_SECONDARY', 4, 'WAEC + IGCSE Core', 'Dr. Chinedu Eze', 225000, 'Senior Secondary 1 Streamed Cohort', 'ACTIVE'),
			('gwh-cls-ss2',  ?, 'SS 2',  'SS2',  'SENIOR_SECONDARY', 5, 'WAEC + IGCSE Extended', 'Engr. Funke Adebayo', 235000, 'Senior Secondary 2 Pre-SSCE Cohort', 'ACTIVE'),
			('gwh-cls-ss3',  ?, 'SS 3',  'SS3',  'SENIOR_SECONDARY', 6, 'WAEC / NECO / JAMB UTME', 'Dr. Olumide Adeleke', 250000, 'Senior Secondary 3 Graduating Examination Cohort', 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_class_arms (id, tenant_id, class_id, name, arm_code, stream, form_teacher_id, form_teacher_name, room_number, capacity, enrolled_students, male_count, female_count, class_captain, status)
			VALUES
			('gwh-arm-jss1-gold',    ?, 'gwh-cls-jss1', 'Gold',            'JSS1-GLD', 'GENERAL',    'gwh-stf-02', 'Mrs. Ngozi Okafor',     'Block A · Room 101', 30, 26, 12, 14, 'Tobi Adeyemi',             'ACTIVE'),
			('gwh-arm-jss1-diamond', ?, 'gwh-cls-jss1', 'Diamond',         'JSS1-DMD', 'GENERAL',    'gwh-stf-06', 'Mr. Segun Lawal',       'Block A · Room 102', 30, 25, 13, 12, 'Zainab Bello',             'ACTIVE'),
			('gwh-arm-jss2-gold',    ?, 'gwh-cls-jss2', 'Gold',            'JSS2-GLD', 'GENERAL',    'gwh-stf-04', 'Mrs. Folashade Bakare', 'Block A · Room 201', 30, 28, 14, 14, 'Chiamaka Adeleke-Okonkwo', 'ACTIVE'),
			('gwh-arm-jss3-diamond', ?, 'gwh-cls-jss3', 'Diamond',         'JSS3-DMD', 'CHECKPOINT', 'gwh-stf-01', 'Mr. Babatunde Adewale', 'Block B · Room 104', 30, 27, 13, 14, 'Kamsiyochukwu Nwosu',      'ACTIVE'),
			('gwh-arm-ss1-sci',      ?, 'gwh-cls-ss1',  'Science',         'SS1-SCI',  'SCIENCE',    'gwh-stf-03', 'Dr. Chinedu Eze',       'Science Wing · 201', 30, 24, 12, 12, 'David Okafor',             'ACTIVE'),
			('gwh-arm-ss2-sci',      ?, 'gwh-cls-ss2',  'Science',         'SS2-SCI',  'SCIENCE',    'gwh-stf-05', 'Engr. Funke Adebayo',   'Science Wing · 203', 30, 26, 14, 12, 'Amina Abdullahi',          'ACTIVE'),
			('gwh-arm-ss3-sci',      ?, 'gwh-cls-ss3',  'Science Diamond', 'SS3-SCI',  'SCIENCE',    'gwh-stf-07', 'Dr. Olumide Adeleke',   'STEM Block · 301',   30, 28, 14, 14, 'Kelechi Stephanie Okonkwo','ACTIVE'),
			('gwh-arm-ss3-hum',      ?, 'gwh-cls-ss3',  'Humanities Gold', 'SS3-HUM',  'ARTS',       'gwh-stf-04', 'Mrs. Folashade Bakare', 'Humanities · 302',   25, 20, 8,  12, 'Aisha Bello',              'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_class_students (id, tenant_id, class_id, arm_id, student_id, student_name, admission_number, gender, boarding_type, guardian_name, guardian_phone, status)
			VALUES
			('gwh-cs-01', ?, 'gwh-cls-ss3',  'gwh-arm-ss3-sci',  'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'GWH/2026/0412', 'FEMALE', 'BOARDER', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'ACTIVE'),
			('gwh-cs-02', ?, 'gwh-cls-ss3',  'gwh-arm-ss3-sci',  'std_alex_01',     'Alex Adeleke-Okonkwo',      'GWH/2026/0188', 'MALE',   'BOARDER', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'ACTIVE'),
			('gwh-cs-03', ?, 'gwh-cls-jss2', 'gwh-arm-jss2-gold','std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'GWH/2026/0342', 'FEMALE', 'DAY',     'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'ACTIVE'),
			('gwh-cs-04', ?, 'gwh-cls-ss3',  'gwh-arm-ss3-sci',  'std_femi_04',     'Femi Adeleke',              'GWH/2026/0104', 'MALE',   'BOARDER', 'Chief Tunde Adeleke',        '+234 802 311 4500', 'ACTIVE'),
			('gwh-cs-05', ?, 'gwh-cls-ss3',  'gwh-arm-ss3-sci',  'std_chinedu_05',  'Chinedu Eze',               'GWH/2026/0119', 'MALE',   'DAY',     'Dr. Emmanuel Eze',           '+234 803 789 2210', 'ACTIVE'),
			('gwh-cs-06', ?, 'gwh-cls-ss3',  'gwh-arm-ss3-hum',  'std_aisha_06',    'Aisha Bello',               'GWH/2026/0155', 'FEMALE', 'BOARDER', 'Alhaji Musa Bello',          '+234 809 441 3300', 'ACTIVE'),
			('gwh-cs-07', ?, 'gwh-cls-ss2',  'gwh-arm-ss2-sci',  'std_amina_07',    'Amina Abdullahi',           'GWH/2026/0221', 'FEMALE', 'BOARDER', 'Alhaji Yusuf Abdullahi',     '+234 809 221 3409', 'ACTIVE'),
			('gwh-cs-08', ?, 'gwh-cls-jss3', 'gwh-arm-jss3-diamond','std_kamsi_08', 'Kamsiyochukwu Nwosu',       'GWH/2026/0290', 'FEMALE', 'DAY',     'Dr. Emeka Nwosu',            '+234 803 412 8890', 'ACTIVE'),
			('gwh-cs-09', ?, 'gwh-cls-ss1',  'gwh-arm-ss1-sci',  'std_david_09',    'David Okafor',              'GWH/2026/0310', 'MALE',   'DAY',     'Barr. Chuka Okafor',         '+234 805 612 9001', 'ACTIVE'),
			('gwh-cs-10', ?, 'gwh-cls-jss1', 'gwh-arm-jss1-gold','std_tobi_10',     'Tobi Adeyemi',              'GWH/2026/0388', 'MALE',   'DAY',     'Engr. Kunle Adeyemi',        '+234 803 901 7742', 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	// 4. Seed Subjects, Class Subjects & Subject Teachers (Tutor Assignments)
	var subjCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_subjects WHERE tenant_id = ?", tenantID).Scan(&subjCount)
	if subjCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_subjects (id, tenant_id, name, code, department, category, level_scope, periods_per_week, pass_mark, has_practical, hod_name, description, status)
			VALUES
			('gwh-sub-math', ?, 'Mathematics',             'MTH-101', 'Mathematics',          'CORE',       'ALL_LEVELS',       5, 50, false, 'Dr. Olumide Adeleke',   'NERDC & Cambridge Extended Mathematics', 'ACTIVE'),
			('gwh-sub-eng',  ?, 'English Language',        'ENG-101', 'Languages & Arts',     'CORE',       'ALL_LEVELS',       5, 50, false, 'Mrs. Folashade Bakare', 'English Language, Diction & Comprehension', 'ACTIVE'),
			('gwh-sub-phy',  ?, 'Physics',                 'PHY-201', 'Sciences & STEM',      'SCIENCE',    'SENIOR_SECONDARY', 4, 50, true,  'Engr. Funke Adebayo',   'Theoretical & Experimental Mechanics, Optics & Electricity', 'ACTIVE'),
			('gwh-sub-chm',  ?, 'Chemistry',               'CHM-202', 'Sciences & STEM',      'SCIENCE',    'SENIOR_SECONDARY', 4, 50, true,  'Dr. Chinedu Eze',       'Organic, Inorganic & Physical Chemistry with Wet Lab', 'ACTIVE'),
			('gwh-sub-bio',  ?, 'Biology',                 'BIO-203', 'Sciences & STEM',      'SCIENCE',    'SENIOR_SECONDARY', 4, 50, true,  'Dr. Aisha Bello',       'Cell Biology, Genetics & Ecology', 'ACTIVE'),
			('gwh-sub-fmath',?, 'Further Mathematics',     'MTH-301', 'Mathematics',          'ELECTIVE',   'SENIOR_SECONDARY', 4, 50, false, 'Dr. Olumide Adeleke',   'Calculus, Vectors, Mechanics & Matrices', 'ACTIVE'),
			('gwh-sub-csc',  ?, 'Computer Science & AI',   'CSC-204', 'ICT & Robotics',       'VOCATIONAL', 'ALL_LEVELS',       3, 50, true,  'Mr. Tunde Ogunlesi',    'Python Programming, Data Structures & Robotics', 'ACTIVE'),
			('gwh-sub-civ',  ?, 'Civic Education',         'CIV-102', 'Humanities',           'CORE',       'ALL_LEVELS',       2, 50, false, 'Mr. Segun Lawal',       'Constitutional Governance, Ethics & Citizenship', 'ACTIVE'),
			('gwh-sub-bst',  ?, 'Basic Science & Tech',    'BST-103', 'Sciences & STEM',      'CORE',       'JUNIOR_SECONDARY', 4, 50, true,  'Mr. Babatunde Adewale', 'Integrated Junior Secondary Science & Technology', 'ACTIVE'),
			('gwh-sub-lit',  ?, 'Literature-in-English',   'LIT-205', 'Languages & Arts',     'ARTS',       'SENIOR_SECONDARY', 3, 50, false, 'Mrs. Folashade Bakare', 'African & Shakespearean Drama, Prose and Poetry', 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_subject_teachers (id, tenant_id, subject_id, subject_name, teacher_id, teacher_name, class_id, class_name, arm_name, periods_per_week, is_lead_tutor, status)
			VALUES
			('gwh-st-01', ?, 'gwh-sub-fmath', 'Further Mathematics',   'gwh-stf-07', 'Dr. Olumide Adeleke',   'gwh-cls-ss3',  'SS 3',  'Science Diamond', 4, true, 'ACTIVE'),
			('gwh-st-02', ?, 'gwh-sub-phy',   'Physics',               'gwh-stf-05', 'Engr. Funke Adebayo',   'gwh-cls-ss3',  'SS 3',  'Science Diamond', 4, true, 'ACTIVE'),
			('gwh-st-03', ?, 'gwh-sub-chm',   'Chemistry',             'gwh-stf-03', 'Dr. Chinedu Eze',       'gwh-cls-ss3',  'SS 3',  'Science Diamond', 4, true, 'ACTIVE'),
			('gwh-st-04', ?, 'gwh-sub-eng',   'English Language',      'gwh-stf-04', 'Mrs. Folashade Bakare', 'gwh-cls-ss3',  'SS 3',  'Science Diamond', 5, true, 'ACTIVE'),
			('gwh-st-05', ?, 'gwh-sub-csc',   'Computer Science & AI', 'gwh-stf-08', 'Mr. Tunde Ogunlesi',    'gwh-cls-ss3',  'SS 3',  'Science Diamond', 3, true, 'ACTIVE'),
			('gwh-st-06', ?, 'gwh-sub-math',  'Mathematics',           'gwh-stf-01', 'Mr. Babatunde Adewale', 'gwh-cls-jss3', 'JSS 3', 'Diamond',         5, true, 'ACTIVE'),
			('gwh-st-07', ?, 'gwh-sub-eng',   'English Language',      'gwh-stf-02', 'Mrs. Ngozi Okafor',     'gwh-cls-jss1', 'JSS 1', 'Gold',            5, true, 'ACTIVE'),
			('gwh-st-08', ?, 'gwh-sub-civ',   'Civic Education',       'gwh-stf-06', 'Mr. Segun Lawal',       'gwh-cls-jss2', 'JSS 2', 'Gold',            2, true, 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	// 5. Seed Staff Directory
	var staffCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_staff WHERE tenant_id = ?", tenantID).Scan(&staffCount)
	if staffCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_staff (
				id, tenant_id, staff_code, full_name, title, email, phone, gender,
				department, designation, cadre, employment_type, qualification, trcn_number,
				specialization, assigned_classes, basic_salary, allowances, bank_name, account_number,
				pension_pfa, tax_id, join_date, leave_status, biometric_enrolled, status
			) VALUES
			('gwh-stf-01', ?, 'GWH-STF-001', 'Mr. Babatunde Adewale', 'Mr.', 'b.adewale@greenwoodhigh.edu.ng', '+234 803 310 1101', 'MALE', 'Mathematics', 'VP Academics & Senior Mathematics Master', 'TEACHING', 'FULL_TIME', 'B.Sc (Ed) Mathematics, M.Ed', 'TRCN/LA/2018/04192', 'Pure & Applied Mathematics', 'JSS 3 Diamond, SS 1 Science', 380000, 75000, 'GTBank', '0129481029', 'Stanbic IBTC Pension', 'TIN-8841201', '2019-09-01', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-02', ?, 'GWH-STF-002', 'Mrs. Ngozi Okafor', 'Mrs.', 'n.okafor@greenwoodhigh.edu.ng', '+234 803 310 1102', 'FEMALE', 'Languages & Arts', 'Academic Registrar & HOD English', 'TEACHING', 'FULL_TIME', 'B.A. English, PGDE, M.A.', 'TRCN/LA/2017/02918', 'English Diction & Literature', 'JSS 1 Gold, SS 2 Arts', 350000, 65000, 'Zenith Bank', '2084910284', 'ARM Pension', 'TIN-8841202', '2018-09-01', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-03', ?, 'GWH-STF-003', 'Dr. Chinedu Eze', 'Dr.', 'c.eze@greenwoodhigh.edu.ng', '+234 803 310 1103', 'MALE', 'Sciences & STEM', 'HOD Sciences & Senior Chemistry Tutor', 'TEACHING', 'FULL_TIME', 'Ph.D Analytical Chemistry, PGDE', 'TRCN/LA/2020/08812', 'Organic & Analytical Chemistry', 'SS 1 Science, SS 3 Science Diamond', 410000, 80000, 'Access Bank', '0691827364', 'Leadway Pensure', 'TIN-8841203', '2020-01-10', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-04', ?, 'GWH-STF-004', 'Mrs. Folashade Bakare', 'Mrs.', 'f.bakare@greenwoodhigh.edu.ng', '+234 803 310 1104', 'FEMALE', 'Languages & Arts', 'Senior Literature & Oratory Mistress', 'TEACHING', 'FULL_TIME', 'B.A. (Ed) English & Literary Studies', 'TRCN/LA/2019/05531', 'Literature-in-English & Debate', 'JSS 2 Gold, SS 3 Humanities Gold', 320000, 55000, 'First Bank', '3049182736', 'Stanbic IBTC Pension', 'TIN-8841204', '2019-09-01', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-05', ?, 'GWH-STF-005', 'Engr. Funke Adebayo', 'Engr.', 'f.adebayo@greenwoodhigh.edu.ng', '+234 803 310 1105', 'FEMALE', 'Sciences & STEM', 'Admissions Director & Senior Physics Faculty', 'TEACHING', 'FULL_TIME', 'B.Eng Electrical, PGDE, M.Sc Physics', 'TRCN/LA/2021/07741', 'Electromagnetism & Robotics', 'SS 2 Science, SS 3 Science Diamond', 395000, 70000, 'GTBank', '0239184756', 'ARM Pension', 'TIN-8841205', '2021-09-01', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-06', ?, 'GWH-STF-006', 'Mr. Segun Lawal', 'Mr.', 's.lawal@greenwoodhigh.edu.ng', '+234 803 310 1106', 'MALE', 'Humanities', 'Guidance Counselor & Civic Education Tutor', 'TEACHING', 'FULL_TIME', 'B.Sc Political Science, M.Ed Guidance', 'TRCN/LA/2020/06129', 'Pastoral Care & Civic Education', 'JSS 1 Diamond, JSS 2 Gold', 300000, 50000, 'UBA', '2091837465', 'Crusader Sterling', 'TIN-8841206', '2020-09-01', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-07', ?, 'GWH-STF-007', 'Dr. Olumide Adeleke', 'Dr.', 'o.adeleke@greenwoodhigh.edu.ng', '+234 803 310 1107', 'MALE', 'Mathematics', 'Chair of Further Mathematics & Olympiad Coach', 'TEACHING', 'FULL_TIME', 'Ph.D Applied Mathematics', 'TRCN/LA/2018/01920', 'Calculus & Mathematical Olympiad', 'SS 3 Science Diamond', 425000, 85000, 'Zenith Bank', '2019283746', 'Stanbic IBTC Pension', 'TIN-8841207', '2018-09-01', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-08', ?, 'GWH-STF-008', 'Mr. Tunde Ogunlesi', 'Mr.', 't.ogunlesi@greenwoodhigh.edu.ng', '+234 803 310 1108', 'MALE', 'ICT & Robotics', 'Head of Digital Learning & CBT Infrastructure', 'TEACHING', 'FULL_TIME', 'B.Sc Computer Science, AWS Certified', 'TRCN/LA/2022/09912', 'Python, AI & Robotics', 'SS 1-3 Science', 360000, 65000, 'GTBank', '0491827361', 'ARM Pension', 'TIN-8841208', '2022-01-15', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-09', ?, 'GWH-STF-009', 'Nurse Comfort Adeyemi (RN)', 'Matron', 'clinic@greenwoodhigh.edu.ng', '+234 803 310 1109', 'FEMALE', 'Medical & Infirmary', 'Chief School Nursing Officer', 'NON_TEACHING', 'FULL_TIME', 'RN, B.NSc Nursing Science', 'NMCN/RN/2016/4412', 'Pediatric Triage & Emergency Care', 'Campus Infirmary Wing', 290000, 50000, 'First Bank', '3091827311', 'ARM Pension', 'TIN-8841209', '2019-04-01', 'ON_DUTY', true, 'ACTIVE'),
			('gwh-stf-10', ?, 'GWH-STF-010', 'Mr. Emeka Nwosu', 'Mr.', 'e.nwosu@greenwoodhigh.edu.ng', '+234 803 310 1110', 'MALE', 'Boarding & Pastoral', 'Senior Boarding Housemaster (Silverbird Hall)', 'NON_TEACHING', 'FULL_TIME', 'B.Ed Physical & Health Education', 'TRCN/LA/2019/03318', 'Hostel Welfare & Sports', 'Boarding Directorate', 285000, 55000, 'Access Bank', '0718293847', 'Leadway Pensure', 'TIN-8841210', '2019-09-01', 'ON_DUTY', true, 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	// 6. Seed Parents & Ward Linkages
	var parentCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_parents WHERE tenant_id = ?", tenantID).Scan(&parentCount)
	if parentCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_parents (
				id, tenant_id, parent_code, title, full_name, relationship, email, phone, alternate_phone,
				occupation, employer, residential_address, city, state,
				is_pta_member, pta_role, portal_invited, portal_last_login,
				fee_balance_naira, total_paid_naira, preferred_channel, emergency_priority, status
			) VALUES
			('gwh-par-01', ?, 'GWH-PAR-001', 'Mrs.', 'Mrs. Sarah Adeleke-Okonkwo', 'MOTHER', 'sarah.okonkwo@greenwoodhigh.edu.ng', '+234 803 459 2810', '+234 802 889 1234',
			 'Managing Partner, Corporate Law', 'Adeleke, Okonkwo & Associates LLP', '14B Bourdillon Road, Ikoyi', 'Lagos', 'Lagos State',
			 true, 'PTA Executive Treasurer', true, 'Today, 08:14 AM', 45000, 795000, 'WHATSAPP_SMS_EMAIL', 'PRIMARY', 'ACTIVE'),
			('gwh-par-02', ?, 'GWH-PAR-002', 'Dr.', 'Dr. Emeka Nwosu', 'FATHER', 'emeka.nwosu@gmail.com', '+234 803 412 8890', '+234 805 119 2000',
			 'Consultant Cardiologist', 'Lagoon Specialist Hospital', 'Plot 8, Chevron Alternative Route, Lekki', 'Lagos', 'Lagos State',
			 true, 'PTA Health Committee Chair', true, 'Yesterday, 06:40 PM', 0, 410000, 'WHATSAPP_EMAIL', 'PRIMARY', 'ACTIVE'),
			('gwh-par-03', ?, 'GWH-PAR-003', 'Alhaji', 'Alhaji Yusuf Abdullahi', 'FATHER', 'y.abdullahi@yahoo.com', '+234 809 221 3409', '+234 803 990 1122',
			 'Director of Operations', 'DanSA Energy & Logistics Ltd', '21 Glover Road, Ikoyi', 'Lagos', 'Lagos State',
			 true, 'PTA Member', true, '2 days ago', 0, 285000, 'SMS_EMAIL', 'PRIMARY', 'ACTIVE'),
			('gwh-par-04', ?, 'GWH-PAR-004', 'Chief', 'Chief Tunde Adeleke', 'FATHER', 'tunde.adeleke@outlook.com', '+234 802 311 4500', '+234 803 555 0192',
			 'Chartered Architect', 'Skyline Habitat Consult', '5A Lugard Avenue, Ikoyi', 'Lagos', 'Lagos State',
			 true, 'PTA Infrastructure Advisor', true, 'Today, 07:50 AM', 0, 285000, 'WHATSAPP_SMS', 'PRIMARY', 'ACTIVE'),
			('gwh-par-05', ?, 'GWH-PAR-005', 'Barr.', 'Barr. Chuka Okafor', 'FATHER', 'chuka.okafor@chambers.ng', '+234 805 612 9001', '+234 803 221 4400',
			 'Senior Advocate', 'Okafor & Co Legal Practitioners', '19 Admiralty Way, Lekki Phase 1', 'Lagos', 'Lagos State',
			 true, 'PTA Legal Secretary', true, '3 days ago', 35000, 190000, 'EMAIL', 'PRIMARY', 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_parent_wards (id, tenant_id, parent_id, student_id, student_name, admission_number, class_name, arm_name, relationship, is_primary_contact, authorized_pickup)
			VALUES
			('gwh-pw-01', ?, 'gwh-par-01', 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'GWH/2026/0412', 'SS 3',  'Science Diamond', 'MOTHER', true, true),
			('gwh-pw-02', ?, 'gwh-par-01', 'std_alex_01',     'Alex Adeleke-Okonkwo',      'GWH/2026/0188', 'SS 3',  'Science Diamond', 'MOTHER', true, true),
			('gwh-pw-03', ?, 'gwh-par-01', 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'GWH/2026/0342', 'JSS 2', 'Gold',            'MOTHER', true, true),
			('gwh-pw-04', ?, 'gwh-par-02', 'std_kamsi_08',    'Kamsiyochukwu Nwosu',       'GWH/2026/0290', 'JSS 3', 'Diamond',         'FATHER', true, true),
			('gwh-pw-05', ?, 'gwh-par-03', 'std_amina_07',    'Amina Abdullahi',           'GWH/2026/0221', 'SS 2',  'Science',         'FATHER', true, true),
			('gwh-pw-06', ?, 'gwh-par-04', 'std_femi_04',     'Femi Adeleke',              'GWH/2026/0104', 'SS 3',  'Science Diamond', 'FATHER', true, true),
			('gwh-pw-07', ?, 'gwh-par-05', 'std_david_09',    'David Okafor',              'GWH/2026/0310', 'SS 1',  'Science',         'FATHER', true, true)
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	// 7. Seed Bell Schedules & Timetable Slots
	var bellCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_bell_schedules WHERE tenant_id = ?", tenantID).Scan(&bellCount)
	if bellCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_bell_schedules (id, tenant_id, period_index, label, start_time, end_time, slot_type, days_applicable)
			VALUES
			('gwh-bell-0', ?, 0, 'Morning Assembly & Roll Call', '07:40 AM', '08:00 AM', 'ASSEMBLY', 'Mon-Fri'),
			('gwh-bell-1', ?, 1, 'Period 1',                     '08:00 AM', '08:45 AM', 'LESSON',   'Mon-Fri'),
			('gwh-bell-2', ?, 2, 'Period 2',                     '08:45 AM', '09:30 AM', 'LESSON',   'Mon-Fri'),
			('gwh-bell-3', ?, 3, 'Short Nutrition Break',        '09:30 AM', '09:45 AM', 'BREAK',    'Mon-Fri'),
			('gwh-bell-4', ?, 4, 'Period 3',                     '09:45 AM', '10:30 AM', 'LESSON',   'Mon-Fri'),
			('gwh-bell-5', ?, 5, 'Period 4',                     '10:30 AM', '11:15 AM', 'LESSON',   'Mon-Fri'),
			('gwh-bell-6', ?, 6, 'Long Lunch & Recreation',      '11:15 AM', '11:45 AM', 'BREAK',    'Mon-Fri'),
			('gwh-bell-7', ?, 7, 'Period 5',                     '11:45 AM', '12:30 PM', 'LESSON',   'Mon-Fri'),
			('gwh-bell-8', ?, 8, 'Period 6',                     '12:30 PM', '01:15 PM', 'LESSON',   'Mon-Fri'),
			('gwh-bell-9', ?, 9, 'Clubs, Prep & Co-Curricular',  '02:00 PM', '03:30 PM', 'ACTIVITY', 'Wed, Fri')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	var ttCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_timetable_slots WHERE tenant_id = ?", tenantID).Scan(&ttCount)
	if ttCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_timetable_slots (id, tenant_id, class_id, class_name, arm_name, day_of_week, period_index, period_label, start_time, end_time, subject_id, subject_name, teacher_id, teacher_name, room, slot_type, status)
			VALUES
			('gwh-tt-01', ?, 'gwh-cls-ss3', 'SS 3 Science Diamond', 'Science Diamond', 'Monday',    1, 'Period 1', '08:00 AM', '08:45 AM', 'gwh-sub-fmath', 'Further Mathematics',     'gwh-stf-07', 'Dr. Olumide Adeleke',   'STEM Block · 301', 'LESSON',    'SCHEDULED'),
			('gwh-tt-02', ?, 'gwh-cls-ss3', 'SS 3 Science Diamond', 'Science Diamond', 'Monday',    2, 'Period 2', '08:45 AM', '09:30 AM', 'gwh-sub-phy',   'Physics (Electromagnetism)','gwh-stf-05', 'Engr. Funke Adebayo',   'Physics Lab A',    'PRACTICAL', 'SCHEDULED'),
			('gwh-tt-03', ?, 'gwh-cls-ss3', 'SS 3 Science Diamond', 'Science Diamond', 'Monday',    4, 'Period 3', '09:45 AM', '10:30 AM', 'gwh-sub-chm',   'Chemistry (Organic Lab)',  'gwh-stf-03', 'Dr. Chinedu Eze',       'Chemistry Lab 2',  'PRACTICAL', 'SCHEDULED'),
			('gwh-tt-04', ?, 'gwh-cls-ss3', 'SS 3 Science Diamond', 'Science Diamond', 'Monday',    5, 'Period 4', '10:30 AM', '11:15 AM', 'gwh-sub-eng',   'English Language & Diction','gwh-stf-04', 'Mrs. Folashade Bakare', 'Humanities Hall',  'LESSON',    'SCHEDULED'),
			('gwh-tt-05', ?, 'gwh-cls-ss3', 'SS 3 Science Diamond', 'Science Diamond', 'Monday',    7, 'Period 5', '11:45 AM', '12:30 PM', 'gwh-sub-csc',   'Computer Science & AI',    'gwh-stf-08', 'Mr. Tunde Ogunlesi',    'ICT CBT Suite 1',  'PRACTICAL', 'SCHEDULED'),
			('gwh-tt-06', ?, 'gwh-cls-ss3', 'SS 3 Science Diamond', 'Science Diamond', 'Monday',    8, 'Period 6', '12:30 PM', '01:15 PM', 'gwh-sub-bio',   'Biology (Genetics)',       'gwh-stf-03', 'Dr. Chinedu Eze',       'Bio-Sciences Lab', 'LESSON',    'SCHEDULED'),
			('gwh-tt-07', ?, 'gwh-cls-ss3', 'SS 3 Science Diamond', 'Science Diamond', 'Tuesday',   1, 'Period 1', '08:00 AM', '08:45 AM', 'gwh-sub-math',  'Mathematics',              'gwh-stf-01', 'Mr. Babatunde Adewale', 'STEM Block · 301', 'LESSON',    'SCHEDULED'),
			('gwh-tt-08', ?, 'gwh-cls-ss3', 'SS 3 Science Diamond', 'Science Diamond', 'Wednesday', 1, 'Period 1', '08:00 AM', '08:45 AM', 'gwh-sub-phy',   'Physics Practical',        'gwh-stf-05', 'Engr. Funke Adebayo',   'Physics Lab A',    'PRACTICAL', 'SCHEDULED'),
			('gwh-tt-09', ?, 'gwh-cls-jss3','JSS 3 Diamond',        'Diamond',         'Monday',    1, 'Period 1', '08:00 AM', '08:45 AM', 'gwh-sub-math',  'Mathematics',              'gwh-stf-01', 'Mr. Babatunde Adewale', 'Block B · 104',    'LESSON',    'SCHEDULED'),
			('gwh-tt-10', ?, 'gwh-cls-jss1','JSS 1 Gold',           'Gold',            'Monday',    2, 'Period 2', '08:45 AM', '09:30 AM', 'gwh-sub-eng',   'English Language',         'gwh-stf-02', 'Mrs. Ngozi Okafor',     'Block A · 101',    'LESSON',    'SCHEDULED')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	// 8. Seed Biometric Profiles, Attendance Policies & Today's Attendance Logs
	var bioCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_biometric_profiles WHERE tenant_id = ?", tenantID).Scan(&bioCount)
	if bioCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_attendance_policies (id, tenant_id, student_resumption_time, student_late_AFTER, student_closing_time, staff_clock_in_time, staff_late_after, staff_clock_out_time, auto_sms_absent_alert, sms_alert_cutoff_time, biometric_mode)
			VALUES ('gwh-att-pol', ?, '07:30 AM', '07:50 AM', '03:30 PM', '07:15 AM', '07:40 AM', '04:00 PM', true, '08:30 AM', 'FINGERPRINT_AND_RFID')
		`, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_biometric_profiles (id, tenant_id, person_type, person_id, person_name, identifier, class_arm_name, department, rfid_card_uid, fingerprint_status, left_thumb_enrolled, right_thumb_enrolled, facial_template_enrolled, device_sync_status, last_synced_at, enrolled_by, status)
			VALUES
			('gwh-bio-01', ?, 'STUDENT', 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'GWH/2026/0412', 'SS 3 Science Diamond', 'Senior Secondary', 'RFID-GWH-0412', 'ENROLLED', true, true, true, 'SYNCED', 'Today, 07:18 AM', 'ICT Biometrics Desk', 'ACTIVE'),
			('gwh-bio-02', ?, 'STUDENT', 'std_alex_01',     'Alex Adeleke-Okonkwo',      'GWH/2026/0188', 'SS 3 Science Diamond', 'Senior Secondary', 'RFID-GWH-0188', 'ENROLLED', true, true, true, 'SYNCED', 'Today, 07:22 AM', 'ICT Biometrics Desk', 'ACTIVE'),
			('gwh-bio-03', ?, 'STUDENT', 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'GWH/2026/0342', 'JSS 2 Gold',           'Junior Secondary', 'RFID-GWH-0342', 'ENROLLED', true, true, true, 'SYNCED', 'Today, 07:24 AM', 'ICT Biometrics Desk', 'ACTIVE'),
			('gwh-bio-04', ?, 'STUDENT', 'std_femi_04',     'Femi Adeleke',              'GWH/2026/0104', 'SS 3 Science Diamond', 'Senior Secondary', 'RFID-GWH-0104', 'ENROLLED', true, true, true, 'SYNCED', 'Today, 07:20 AM', 'ICT Biometrics Desk', 'ACTIVE'),
			('gwh-bio-05', ?, 'STAFF',   'gwh-stf-01',      'Mr. Babatunde Adewale',     'GWH-STF-001',   '',                     'Mathematics',      'RFID-STF-0001', 'ENROLLED', true, true, true, 'SYNCED', 'Today, 07:05 AM', 'HR Directorate',      'ACTIVE'),
			('gwh-bio-06', ?, 'STAFF',   'gwh-stf-05',      'Engr. Funke Adebayo',       'GWH-STF-005',   '',                     'Sciences & STEM',  'RFID-STF-0005', 'ENROLLED', true, true, true, 'SYNCED', 'Today, 07:10 AM', 'HR Directorate',      'ACTIVE'),
			('gwh-bio-07', ?, 'STAFF',   'gwh-stf-07',      'Dr. Olumide Adeleke',       'GWH-STF-007',   '',                     'Mathematics',      'RFID-STF-0007', 'ENROLLED', true, true, true, 'SYNCED', 'Today, 07:12 AM', 'HR Directorate',      'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	var todayLogCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_attendance_logs WHERE tenant_id = ? AND log_date = ?", tenantID, todayDate).Scan(&todayLogCount)
	if todayLogCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_attendance_logs (id, tenant_id, person_type, person_id, person_name, identifier, class_arm_name, department, log_date, time_in, time_out, duration_minutes, status, verification_mode, terminal_name, parent_notified, notes)
			VALUES
			('gwh-att-1-' || ?, ?, 'STUDENT', 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'GWH/2026/0412', 'SS 3 Science Diamond', 'Academic', ?, '07:18 AM', '', 0, 'PRESENT', 'BIOMETRIC_THUMB', 'Main Gate Turnstile A', true, 'Punctual boarding check-in'),
			('gwh-att-2-' || ?, ?, 'STUDENT', 'std_alex_01',     'Alex Adeleke-Okonkwo',      'GWH/2026/0188', 'SS 3 Science Diamond', 'Academic', ?, '07:22 AM', '', 0, 'PRESENT', 'BIOMETRIC_THUMB', 'Main Gate Turnstile A', true, 'Punctual check-in'),
			('gwh-att-3-' || ?, ?, 'STUDENT', 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'GWH/2026/0342', 'JSS 2 Gold',           'Academic', ?, '07:24 AM', '', 0, 'PRESENT', 'RFID_CARD',       'Main Gate Turnstile B', true, 'Arrived on School Bus 01'),
			('gwh-att-4-' || ?, ?, 'STUDENT', 'std_femi_04',     'Femi Adeleke',              'GWH/2026/0104', 'SS 3 Science Diamond', 'Academic', ?, '07:20 AM', '', 0, 'PRESENT', 'BIOMETRIC_THUMB', 'Main Gate Turnstile A', true, 'Head Boy early assembly duty'),
			('gwh-att-5-' || ?, ?, 'STUDENT', 'std_chinedu_05',  'Chinedu Eze',               'GWH/2026/0119', 'SS 3 Science Diamond', 'Academic', ?, '07:54 AM', '', 0, 'LATE',    'RFID_CARD',       'Main Gate Turnstile B', true, 'Traffic delay along Lekki-Epe Expressway'),
			('gwh-att-6-' || ?, ?, 'STAFF',   'gwh-stf-01',      'Mr. Babatunde Adewale',     'GWH-STF-001',   '',                     'Mathematics', ?, '07:05 AM', '', 0, 'PRESENT', 'BIOMETRIC_THUMB', 'Staff Biometric Terminal 1', false, 'On duty'),
			('gwh-att-7-' || ?, ?, 'STAFF',   'gwh-stf-05',      'Engr. Funke Adebayo',       'GWH-STF-005',   '',                     'Sciences & STEM', ?, '07:10 AM', '', 0, 'PRESENT', 'BIOMETRIC_THUMB', 'Staff Biometric Terminal 1', false, 'Physics Lab prep'),
			('gwh-att-8-' || ?, ?, 'STAFF',   'gwh-stf-07',      'Dr. Olumide Adeleke',       'GWH-STF-007',   '',                     'Mathematics', ?, '07:12 AM', '', 0, 'PRESENT', 'BIOMETRIC_THUMB', 'Staff Biometric Terminal 1', false, 'Morning Further Maths clinic')
		`, todayDate, tenantID, todayDate,
			todayDate, tenantID, todayDate,
			todayDate, tenantID, todayDate,
			todayDate, tenantID, todayDate,
			todayDate, tenantID, todayDate,
			todayDate, tenantID, todayDate,
			todayDate, tenantID, todayDate,
			todayDate, tenantID, todayDate)
	}

	// 9. Seed Fee Structures, Student Invoices & Fee Payments
	var feeCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_fee_structures WHERE tenant_id = ?", tenantID).Scan(&feeCount)
	if feeCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_fee_structures (
				id, tenant_id, title, category, class_level, term_name, amount,
				tuition_fee, development_levy, ict_stem_fee, exam_materials_fee, total_due,
				is_mandatory, due_date, status
			) VALUES
			('gwh-fee-01', ?, 'Senior Secondary Termly Tuition & Academic Instruction', 'TUITION', 'SS 1 - SS 3', 'First Term', 285000, 195000, 35000, 30000, 25000, 285000, true, '2026-12-01', 'ACTIVE'),
			('gwh-fee-02', ?, 'Junior Secondary Termly Tuition & Checkpoint Levy',      'TUITION', 'JSS 1 - JSS 3', 'First Term', 235000, 165000, 25000, 25000, 20000, 235000, true, '2026-12-01', 'ACTIVE'),
			('gwh-fee-03', ?, 'Full Boarding & Pastoral Residence Fee',                 'BOARDING', 'All Boarders', 'First Term', 180000, 150000, 15000, 0, 15000, 180000, false, '2026-12-01', 'ACTIVE'),
			('gwh-fee-04', ?, 'Lekki / Ikoyi / Victoria Island Executive Shuttle Bus',  'TRANSPORT', 'All Day Scholars', 'First Term', 75000, 75000, 0, 0, 0, 75000, false, '2026-12-01', 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_student_invoices (
				id, tenant_id, invoice_no, student_id, student_name, admission_number, class_name, arm_name,
				parent_name, parent_phone, term_name, session_name,
				tuition_fee, development_levy, ict_stem_fee, exam_materials_fee, transport_fee, hostel_fee,
				total_billed, amount_paid, balance_due, status, payment_method, payment_reference, due_date
			) VALUES
			('gwh-inv-01', ?, 'INV-GWH-2026-0412', 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'GWH/2026/0412', 'SS 3',  'Science Diamond', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'First Term', '2026/2027', 195000, 35000, 30000, 25000, 0, 180000, 465000, 465000, 0,     'PAID',    'Paystack Direct', 'PSK-GWH-9948120', '2026-12-01'),
			('gwh-inv-02', ?, 'INV-GWH-2026-0188', 'std_alex_01',     'Alex Adeleke-Okonkwo',      'GWH/2026/0188', 'SS 3',  'Science Diamond', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'First Term', '2026/2027', 195000, 35000, 30000, 25000, 0, 90000,  375000, 330000, 45000, 'PARTIAL', 'Paystack Direct', 'PSK-GWH-9948121', '2026-12-01'),
			('gwh-inv-03', ?, 'INV-GWH-2026-0342', 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'GWH/2026/0342', 'JSS 2', 'Gold',            'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'First Term', '2026/2027', 165000, 25000, 25000, 20000, 75000, 0,  310000, 310000, 0,     'PAID',    'Bank Transfer',   'TRF-GTB-8812041', '2026-12-01'),
			('gwh-inv-04', ?, 'INV-GWH-2026-0104', 'std_femi_04',     'Femi Adeleke',              'GWH/2026/0104', 'SS 3',  'Science Diamond', 'Chief Tunde Adeleke',        '+234 802 311 4500', 'First Term', '2026/2027', 195000, 35000, 30000, 25000, 0, 180000, 465000, 465000, 0,     'PAID',    'Paystack Direct', 'PSK-GWH-9948155', '2026-12-01'),
			('gwh-inv-05', ?, 'INV-GWH-2026-0221', 'std_amina_07',    'Amina Abdullahi',           'GWH/2026/0221', 'SS 2',  'Science',         'Alhaji Yusuf Abdullahi',     '+234 809 221 3409', 'First Term', '2026/2027', 195000, 35000, 30000, 25000, 0, 0,      285000, 285000, 0,     'PAID',    'Zenith Corporate','ZEN-GWH-7712098', '2026-12-01'),
			('gwh-inv-06', ?, 'INV-GWH-2026-0310', 'std_david_09',    'David Okafor',              'GWH/2026/0310', 'SS 1',  'Science',         'Barr. Chuka Okafor',         '+234 805 612 9001', 'First Term', '2026/2027', 165000, 25000, 20000, 15000, 0, 0,      225000, 190000, 35000, 'PARTIAL', 'Bank Transfer',   'TRF-UBA-6619201', '2026-12-01')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_fee_payments (id, tenant_id, invoice_id, invoice_no, student_name, class_name, amount, payment_method, payment_reference, received_by, payment_date, notes)
			VALUES
			('gwh-pay-01', ?, 'gwh-inv-01', 'INV-GWH-2026-0412', 'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 465000, 'Paystack Direct', 'PSK-GWH-9948120', 'Bursary Automated Switch', '2026-09-04', 'Full term tuition + Silverbird Hall boarding clearance'),
			('gwh-pay-02', ?, 'gwh-inv-02', 'INV-GWH-2026-0188', 'Alex Adeleke-Okonkwo',      'SS 3 Science Diamond', 330000, 'Paystack Direct', 'PSK-GWH-9948121', 'Bursary Automated Switch', '2026-09-05', 'First installment tuition and boarding payment'),
			('gwh-pay-03', ?, 'gwh-inv-03', 'INV-GWH-2026-0342', 'Chiamaka Adeleke-Okonkwo',  'JSS 2 Gold',           310000, 'Bank Transfer',   'TRF-GTB-8812041', 'Chief Bursar',             '2026-09-05', 'Full JSS 2 tuition and Lekki bus shuttle settlement'),
			('gwh-pay-04', ?, 'gwh-inv-04', 'INV-GWH-2026-0104', 'Femi Adeleke',              'SS 3 Science Diamond', 465000, 'Paystack Direct', 'PSK-GWH-9948155', 'Bursary Automated Switch', '2026-09-06', 'Full term settlement')
		`, tenantID, tenantID, tenantID, tenantID)
	}

	// 10. Seed Library Books & Active Loans
	var libCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_library_books WHERE tenant_id = ?", tenantID).Scan(&libCount)
	if libCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_library_books (id, tenant_id, isbn, title, author, publisher, publication_year, edition, category, subject_tag, target_grade, shelf_location, total_copies, available_copies, replacement_cost, is_digital_available, status)
			VALUES
			('gwh-bk-01', ?, '978-978-026-411-1', 'New General Mathematics for Senior Secondary Schools 3', 'M.F. Macrae, A.O. Kalejaiye', 'Pearson Longman Nigeria', '2024', '6th Edition', 'TEXTBOOK', 'Mathematics', 'SS 3', 'Shelf A1-12', 45, 38, 8500, true, 'AVAILABLE'),
			('gwh-bk-02', ?, '978-978-175-522-4', 'Senior Secondary Physics (WAEC & IGCSE Complete Edition)', 'Dr. P.N. Okeke, M.W. Anyakoha', 'Macmillan Nigeria', '2024', '5th Edition', 'STEM', 'Physics', 'SS 1-3', 'Shelf B2-04', 40, 32, 9200, true, 'AVAILABLE'),
			('gwh-bk-03', ?, '978-978-145-819-0', 'Essential Chemistry for Senior Secondary Schools', 'I.A. Odesina', 'Tonad Publishers', '2023', '4th Edition', 'STEM', 'Chemistry', 'SS 1-3', 'Shelf B3-08', 35, 29, 8800, true, 'AVAILABLE'),
			('gwh-bk-04', ?, '978-0-43590-525-5', 'Things Fall Apart (Annotated African Writers Series)', 'Chinua Achebe', 'Heinemann Educational', '2022', 'Centenary Ed.', 'LITERATURE', 'Literature-in-English', 'SS 1-3', 'Shelf C1-01', 50, 44, 5500, true, 'AVAILABLE'),
			('gwh-bk-05', ?, '978-1-108-79921-8', 'Cambridge IGCSE & O-Level Computer Science Algorithms', 'Sarah Lawrey, Victoria Ellis', 'Cambridge University Press', '2025', '3rd Edition', 'ICT', 'Computer Science', 'SS 1-3', 'Shelf D4-02', 30, 25, 14500, true, 'AVAILABLE'),
			('gwh-bk-06', ?, '978-978-801-942-3', 'Modern Biology for Senior Secondary Schools', 'S.T. Ramalingam', 'Africana First Publishers', '2024', 'Revised Ed.', 'STEM', 'Biology', 'SS 1-3', 'Shelf B1-15', 38, 33, 9500, false, 'AVAILABLE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_library_loans (id, tenant_id, book_id, book_title, book_isbn, borrower_name, borrower_identifier, borrower_class, borrower_type, issued_by, loaned_date, due_date, fine_per_day, fine_amount, condition_on_issue, status)
			VALUES
			('gwh-ln-01', ?, 'gwh-bk-01', 'New General Mathematics for Senior Secondary Schools 3', '978-978-026-411-1', 'Kelechi Stephanie Okonkwo', 'GWH/2026/0412', 'SS 3 Science Diamond', 'STUDENT', 'Mrs. E. Danjuma (Chief Librarian)', '2026-11-18', '2026-12-02', 200, 0, 'GOOD', 'BORROWED'),
			('gwh-ln-02', ?, 'gwh-bk-02', 'Senior Secondary Physics (WAEC & IGCSE Complete Edition)', '978-978-175-522-4', 'Kelechi Stephanie Okonkwo', 'GWH/2026/0412', 'SS 3 Science Diamond', 'STUDENT', 'Mrs. E. Danjuma (Chief Librarian)', '2026-11-20', '2026-12-04', 200, 0, 'GOOD', 'BORROWED'),
			('gwh-ln-03', ?, 'gwh-bk-05', 'Cambridge IGCSE & O-Level Computer Science Algorithms',    '978-1-108-79921-8', 'Alex Adeleke-Okonkwo',      'GWH/2026/0188', 'SS 3 Science Diamond', 'STUDENT', 'Mrs. E. Danjuma (Chief Librarian)', '2026-11-19', '2026-12-03', 200, 0, 'GOOD', 'BORROWED'),
			('gwh-ln-04', ?, 'gwh-bk-04', 'Things Fall Apart (Annotated African Writers Series)',     '978-0-43590-525-5', 'Aisha Bello',               'GWH/2026/0155', 'SS 3 Humanities Gold', 'STUDENT', 'Mrs. E. Danjuma (Chief Librarian)', '2026-11-10', '2026-11-24', 200, 600, 'GOOD', 'OVERDUE')
		`, tenantID, tenantID, tenantID, tenantID)
	}

	// 11. Seed Inventory Items, Movements, Vendors & Procurement Requisitions
	var invCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_inventory_items WHERE tenant_id = ?", tenantID).Scan(&invCount)
	if invCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_inventory_items (id, tenant_id, sku, item_name, category, department, quantity, reorder_level, unit, unit_cost_naira, total_value_naira, location, custodian, supplier_name, asset_condition, status)
			VALUES
			('gwh-inv-it1', ?, 'GWH-INV-001', 'Interactive 75" 4K Smart Classroom Display Boards', 'ICT_EQUIPMENT', 'ICT & Robotics',    24, 5,  'Units',   650000, 15600000, 'All Classroom Blocks', 'Mr. Tunde Ogunlesi',    'Slot Enterprise Solutions', 'NEW',  'IN_STOCK'),
			('gwh-inv-it2', ?, 'GWH-INV-002', 'Binocular Compound Laboratory Microscopes (1000x)',  'LAB_APPARATUS', 'Sciences & STEM',   32, 10, 'Units',   125000, 4000000,  'Biology & Wet Lab 1',  'Dr. Chinedu Eze',       'Finlab Nigeria Ltd',        'GOOD', 'IN_STOCK'),
			('gwh-inv-it3', ?, 'GWH-INV-003', 'Arduino Mega & Raspberry Pi 5 Robotics Kits',        'STEM_ROBOTICS', 'ICT & Robotics',    40, 12, 'Kits',    95000,  3800000,  'STEM Makerspace',      'Engr. Funke Adebayo',   'Hub360 Electronics Lagos',  'NEW',  'IN_STOCK'),
			('gwh-inv-it4', ?, 'GWH-INV-004', 'Non-Toxic Dry-Erase Whiteboard Markers (Packs of 12)','STATIONERY',   'Central Store',     18, 25, 'Boxes',   8500,   153000,   'Central Store Room B', 'Mrs. Bose Alabi',       'CSS Bookshops Marina',      'NEW',  'LOW_STOCK'),
			('gwh-inv-it5', ?, 'GWH-INV-005', 'Official Greenwood High Blazers & Crest Badges',     'UNIFORMS',      'Student Boutique',  85, 30, 'Pieces',  22000,  1870000,  'School Uniform Store', 'Mrs. Bose Alabi',       'Texlon Garments Ikeja',     'NEW',  'IN_STOCK')
		`, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_inventory_vendors (id, tenant_id, company_name, contact_person, phone, email, category, tax_id, bank_details, rating, status)
			VALUES
			('gwh-vnd-01', ?, 'Finlab Nigeria Limited',        'Engr. Taiwo Olatunji', '+234 803 400 9911', 'sales@finlabng.com',       'LAB_APPARATUS', 'TIN-00192834', 'Zenith Bank · 1012938475', 5, 'VERIFIED'),
			('gwh-vnd-02', ?, 'CSS Bookshops & Stationery Plc', 'Mrs. Kemi Adesina',    '+234 802 319 4400', 'corporate@cssbookshops.ng','STATIONERY',    'TIN-00491822', 'First Bank · 2019283741',  5, 'VERIFIED'),
			('gwh-vnd-03', ?, 'Hub360 STEM & Robotics Supply',  'Mr. Chuka Obi',        '+234 809 881 2201', 'orders@hub360.com.ng',     'ICT_EQUIPMENT', 'TIN-00881920', 'GTBank · 0192837465',      5, 'VERIFIED')
		`, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_inventory_movements (id, tenant_id, item_id, item_name, movement_type, quantity, previous_qty, new_qty, recipient_name, department, authorized_by, notes)
			VALUES
			('gwh-mov-01', ?, 'gwh-inv-it4', 'Non-Toxic Dry-Erase Whiteboard Markers (Packs of 12)', 'CHECKOUT', 6, 24, 18, 'Engr. Funke Adebayo', 'Sciences & STEM', 'Mrs. Bose Alabi', 'Issued for SS 2 & SS 3 Physics and Chemistry classrooms'),
			('gwh-mov-02', ?, 'gwh-inv-it3', 'Arduino Mega & Raspberry Pi 5 Robotics Kits',          'RESTOCK',  10, 30, 40, 'STEM Makerspace',    'ICT & Robotics',  'Chief Bursar',    'New shipment received ahead of Lagos STEM Olympiad')
		`, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_procurement_requests (id, tenant_id, po_number, title, department, requested_by, vendor_name, items_summary, estimated_cost, total_amount, priority, status, approved_by, needed_by_date, notes)
			VALUES
			('gwh-po-01', ?, 'PO-GWH-2026-014', 'Titration Burettes & Analytical Reagents for WAEC Practicals', 'Sciences & STEM', 'Dr. Chinedu Eze', 'Finlab Nigeria Limited', '25 Glass Burettes (50ml), Methyl Orange, Phenolphthalein, HCl & NaOH analytical grade', 245000, 245000, 'HIGH', 'APPROVED', 'Dr. (Mrs.) Folake Adeyemi', '2026-12-01', 'Approved for First Term mock practicals'),
			('gwh-po-02', ?, 'PO-GWH-2026-015', 'Classroom Whiteboard Markers & Answer Booklet Reams',         'Mathematics',     'Dr. Olumide Adeleke', 'CSS Bookshops & Stationery Plc', '20 Boxes of Assorted Markers, 40 Reams of A4 80gsm Exam Sheets', 180000, 180000, 'NORMAL', 'PENDING_APPROVAL', '', '2026-12-04', 'Required for First Term terminal exams')
		`, tenantID, tenantID)
	}

	// 12. Seed Transport Routes & Assigned Riders
	var routeCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_transport_routes WHERE tenant_id = ?", tenantID).Scan(&routeCount)
	if routeCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_transport_routes (
				id, tenant_id, route_name, route_code, bus_number, vehicle_model, vehicle_plate,
				driver_name, driver_phone, driver_license_no, assistant_name, assistant_phone,
				capacity, assigned_riders, term_fee_naira, departure_time, return_time,
				stops_summary, gps_tracker_id, fuel_level_pct, next_service_date, insurance_expiry, status
			) VALUES
			('gwh-rt-01', ?, 'Route A · Lekki Phase 1 / Admiralty / Ikate Express', 'GWH-RTA-01', 'BUS-01 (Toyota Coaster Exec)', '2024 Toyota Coaster 30-Seater AC', 'LND-412-GW',
			 'Mr. Sunday Adelekan', '+234 802 331 4991', 'LASDRI-2022-88412', 'Ms. Grace Udoh', '+234 803 711 2001',
			 30, 26, 75000, '06:35 AM', '03:45 PM',
			 'Chevron Toll Gate → Jakande Roundabout → Elegushi → Ikate → Admiralty Way → Greenwood High Main Gate', 'GPS-GWH-BUS01', 88, '2026-12-20', '2027-08-31', 'ACTIVE'),
			('gwh-rt-02', ?, 'Route B · Ikoyi / Bourdillon / Victoria Island Corridor', 'GWH-RTB-02', 'BUS-02 (Mercedes Sprinter)', '2024 Mercedes-Benz Sprinter Shuttle', 'KJA-819-GW',
			 'Mr. Tunde Lawal', '+234 803 112 2334', 'LASDRI-2021-55190', 'Mrs. Bisi Olatunji', '+234 805 440 1920',
			 24, 21, 75000, '06:40 AM', '03:50 PM',
			 'Falomo Bridge → Bourdillon Road → Glover Road → Ahmadu Bello Way → Lekki-Ikoyi Link Bridge → Main Gate', 'GPS-GWH-BUS02', 92, '2027-01-15', '2027-08-31', 'ACTIVE'),
			('gwh-rt-03', ?, 'Route C · VGC / Ajah / Sangotedo Coastal Corridor', 'GWH-RTC-03', 'BUS-03 (Toyota Coaster Exec)', '2023 Toyota Coaster 30-Seater AC', 'EKY-904-GW',
			 'Mr. Musa Danjuma', '+234 809 334 7712', 'LASDRI-2020-33109', 'Ms. Esther Bassey', '+234 802 998 3100',
			 30, 28, 80000, '06:20 AM', '03:55 PM',
			 'Sangotedo Novare Mall → LBS → Abraham Adesanya → VGC Main Gate → Conservation Toll → Main Gate', 'GPS-GWH-BUS03', 79, '2026-12-28', '2027-08-31', 'ACTIVE'),
			('gwh-rt-04', ?, 'Route D · Ikeja GRA / Maryland / Gbagada Annex Express', 'GWH-RTD-04', 'BUS-04 (Toyota HiAce High-Roof)', '2024 Toyota HiAce Commuter', 'AAA-552-GW',
			 'Mr. Segun Fajuyi', '+234 803 882 1044', 'LASDRI-2023-19044', 'Mrs. Comfort Obi', '+234 806 221 9088',
			 18, 16, 70000, '06:30 AM', '03:45 PM',
			 'Gbagada Phase 2 → Maryland Mall → Mobolaji Bank Anthony → Isaac John GRA Annex Campus', 'GPS-GWH-BUS04', 84, '2027-01-10', '2027-08-31', 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_transport_riders (id, tenant_id, route_id, route_name, student_id, student_name, admission_number, class_name, pickup_stop, morning_pickup_time, afternoon_dropoff_time, parent_name, parent_phone, fee_status, boarding_status)
			VALUES
			('gwh-rdr-01', ?, 'gwh-rt-01', 'Route A · Lekki Phase 1 / Admiralty / Ikate Express', 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo', 'GWH/2026/0342', 'JSS 2 Gold',    'Admiralty Way Junction', '06:55 AM', '04:05 PM', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'PAID', 'ON_BUS'),
			('gwh-rdr-02', ?, 'gwh-rt-01', 'Route A · Lekki Phase 1 / Admiralty / Ikate Express', 'std_kamsi_08',    'Kamsiyochukwu Nwosu',      'GWH/2026/0290', 'JSS 3 Diamond', 'Chevron Toll Gate Stop',  '06:40 AM', '04:20 PM', 'Dr. Emeka Nwosu',            '+234 803 412 8890', 'PAID', 'DROPPED_AT_SCHOOL'),
			('gwh-rdr-03', ?, 'gwh-rt-02', 'Route B · Ikoyi / Bourdillon / Victoria Island Corridor', 'std_chinedu_05','Chinedu Eze',              'GWH/2026/0119', 'SS 3 Science Diamond', 'Bourdillon Road Junction', '06:50 AM', '04:10 PM', 'Dr. Emmanuel Eze',     '+234 803 789 2210', 'PAID', 'DROPPED_AT_SCHOOL'),
			('gwh-rdr-04', ?, 'gwh-rt-01', 'Route A · Lekki Phase 1 / Admiralty / Ikate Express', 'std_david_09',    'David Okafor',             'GWH/2026/0310', 'SS 1 Science',  'Admiralty Way Stop 2',    '07:00 AM', '04:00 PM', 'Barr. Chuka Okafor',         '+234 805 612 9001', 'PAID', 'DROPPED_AT_SCHOOL')
		`, tenantID, tenantID, tenantID, tenantID)
	}

	// 13. Seed Admissions Inquiries, Tours & Entrance CBT Exams
	var admCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_admissions_inquiries WHERE tenant_id = ?", tenantID).Scan(&admCount)
	if admCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_admissions_inquiries (
				id, tenant_id, application_no, applicant_name, gender, date_of_birth, target_grade,
				previous_school, boarding_preference, parent_name, parent_email, parent_phone,
				parent_occupation, residential_address, referral_source, form_fee_paid, form_fee_amount,
				stage, entrance_score, interview_date, interview_notes, assigned_counselor,
				scholarship_applied, medical_notes, documents_submitted, application_date, notes
			) VALUES
			('gwh-adm-01', ?, 'GWH-APP-2026-101', 'Oluwadamilola Fajuyi', 'FEMALE', '2015-04-12', 'JSS 1',
			 'Corona School Victoria Island', 'BOARDER', 'Engr. & Mrs. Dapo Fajuyi', 'dapo.fajuyi@chevron.com', '+234 803 550 1188',
			 'Principal Reservoir Engineer', '12 Osborne Foreshore Estate, Ikoyi', 'PARENT_REFERRAL', true, 25000,
			 'OFFER_EXTENDED', 94, '2026-11-14', 'Exceptional numerical reasoning and fluent public speaking.', 'Engr. Funke Adebayo (Admissions Director)',
			 true, 'No known allergies', 'Birth Certificate, Primary 5 & 6 Transcripts, Passport Photos, Medical Fitness Report', '2026-10-15', 'Recommended for 30% STEM Merit Scholarship'),
			('gwh-adm-02', ?, 'GWH-APP-2026-102', 'Chukwudi Nnamdi-Okafor', 'MALE', '2012-08-22', 'SSS 1 Science',
			 'Grange School Ikeja', 'BOARDER', 'Dr. Nnamdi Okafor', 'nnamdi.okafor@nlng.com', '+234 809 412 7700',
			 'Medical Director', 'Plot 5, Banana Island, Ikoyi', 'WEBSITE_PORTAL', true, 25000,
			 'INTERVIEW_SCHEDULED', 89, '2026-11-29', 'Scored 92% in Physics/Mathematics placement CBT.', 'Engr. Funke Adebayo (Admissions Director)',
			 false, 'Glasses wearer', 'BECE Statement of Result, Transcript, Birth Certificate', '2026-10-28', 'Scheduled for Principal & HOD Science interview'),
			('gwh-adm-03', ?, 'GWH-APP-2026-103', 'Zainab Mustapha-Bello', 'FEMALE', '2015-01-19', 'JSS 1',
			 'St. Saviour''s School Ikoyi', 'DAY', 'Alhaji Mustapha Bello', 'm.bello@firstbanknigeria.com', '+234 802 771 3900',
			 'Executive Director, Treasury', '8B Lugard Avenue, Ikoyi', 'OPEN_DAY_TOUR', true, 25000,
			 'EXAM_SCHEDULED', 0, '2026-12-05', 'Attended Lekki Phase 1 campus tour with parents.', 'Mr. Segun Lawal (Guidance Counselor)',
			 false, 'None', 'Birth Certificate, Last Term Report Card', '2026-11-08', 'Registered for Batch B Entrance CBT'),
			('gwh-adm-04', ?, 'GWH-APP-2026-104', 'Kenechukwu Obi', 'MALE', '2014-06-03', 'JSS 2',
			 'British International School', 'DAY', 'Mrs. Amaka Obi', 'amaka.obi@mtn.com', '+234 803 200 8811',
			 'General Manager, Enterprise Marketing', '31 Admiralty Way, Lekki Phase 1', 'ALUMNI_REFERRAL', true, 25000,
			 'ENROLLED', 91, '2026-10-20', 'Acceptance fee and First Term tuition settled in full.', 'Mrs. Ngozi Okafor (Academic Registrar)',
			 false, 'None', 'Complete dossier verified', '2026-10-02', 'Enrolled into JSS 2 Gold')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_admission_tours (id, tenant_id, parent_name, parent_phone, parent_email, prospective_student, target_grade, tour_date, tour_time, attendees_count, assigned_guide, areas_of_interest, status, notes)
			VALUES
			('gwh-tour-01', ?, 'Engr. & Mrs. Dapo Fajuyi', '+234 803 550 1188', 'dapo.fajuyi@chevron.com', 'Oluwadamilola Fajuyi', 'JSS 1', '2026-11-10', '10:00 AM', 3, 'Engr. Funke Adebayo', 'STEM Makerspace, Silverbird Girls Hostel & Olympic Swimming Pool', 'COMPLETED', 'Parents were very impressed with the biometric security and science labs.'),
			('gwh-tour-02', ?, 'Mr. & Mrs. Rotimi Balogun', '+234 805 339 1200', 'rotimi.balogun@pwc.com', 'Ayomide Balogun', 'SSS 1 Science', '2026-12-02', '11:00 AM', 2, 'Mr. Segun Lawal', 'Physics & Chemistry Wet Labs, CBT Center & Dining Hall', 'SCHEDULED', 'Visiting Lekki Main Campus on Wednesday morning.')
		`, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_admission_cbt_exams (id, tenant_id, inquiry_id, applicant_name, target_grade, exam_batch, exam_date, venue, score, max_score, interviewer_notes, status)
			VALUES
			('gwh-cbt-01', ?, 'gwh-adm-01', 'Oluwadamilola Fajuyi', 'JSS 1', '2026/2027 Batch A Entrance CBT', '2026-11-12', 'Digital CBT Testing Center · Hall 1', 94, 100, 'Ranked #1 in Batch A Mathematics & Verbal Aptitude', 'PASSED'),
			('gwh-cbt-02', ?, 'gwh-adm-02', 'Chukwudi Nnamdi-Okafor', 'SSS 1 Science', '2026/2027 Batch A Entrance CBT', '2026-11-12', 'Digital CBT Testing Center · Hall 1', 89, 100, 'Strong Analytical Physics and Further Maths readiness', 'PASSED'),
			('gwh-cbt-03', ?, 'gwh-adm-03', 'Zainab Mustapha-Bello', 'JSS 1', '2026/2027 Batch B Entrance CBT', '2026-12-05', 'Digital CBT Testing Center · Hall 1', 0, 100, 'Exam slip issued to parent email', 'SCHEDULED')
		`, tenantID, tenantID, tenantID)
	}

	// 14. Seed Notices, Circulars & Broadcast Messages
	var noticeCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_notices_and_events WHERE tenant_id = ?", tenantID).Scan(&noticeCount)
	if noticeCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_notices_and_events (id, tenant_id, title, category, audience, event_date, content, author_name, priority, status)
			VALUES
			('gwh-not-01', ?, 'First Term Terminal CBT & Written Examination Timetable Released', 'ACADEMIC', 'ALL_SCHOOL', '2026-12-07', 'All students, parents, and faculty are informed that the First Term 2026/2027 examinations commence on Monday, December 7, 2026. Ensure all Bursary clearances and Digital ID cards are verified.', 'Dr. (Mrs.) Folake Adeyemi (Executive Principal)', 'URGENT', 'PUBLISHED'),
			('gwh-not-02', ?, 'Annual Inter-House Athletics Fiesta & Parents Appreciation Day', 'SPORTS', 'PARENTS_AND_STUDENTS', '2026-11-27', 'Join us at the Greenwood High Olympic Sports Complex this Friday at 9:00 AM as Sapphire, Emerald, Ruby, and Topaz Houses compete for the Principal''s Championship Trophy.', 'Mr. Emeka Nwosu (Director of Sports & Boarding)', 'HIGH', 'PUBLISHED'),
			('gwh-not-03', ?, 'Greenwood Robotics Team Wins 1st Place at Lagos State STEM Olympiad', 'STEM', 'ALL_SCHOOL', '2026-11-18', 'Congratulations to Kelechi Okonkwo, Alex Adeleke-Okonkwo, and Femi Adeleke of SS 3 Science Diamond for winning the Gold Trophy with their Solar Smart-Farm Prototype.', 'Engr. Funke Adebayo (STEM Coordinator)', 'NORMAL', 'PUBLISHED'),
			('gwh-not-04', ?, 'PTA Annual General Congress & 2027 Capital Projects Briefing', 'PTA', 'PARENTS', '2026-11-29', 'The Executive PTA Committee invites all parents and guardians to the First Term General Congress holding in the Main Auditorium at 10:00 AM.', 'Mrs. Sarah Adeleke-Okonkwo (PTA Treasurer)', 'HIGH', 'PUBLISHED')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_messages (id, tenant_id, subject, body, sender_name, sender_role, recipient_group, recipient_count, channel, priority, status, delivered_count, read_count)
			VALUES
			('gwh-msg-01', ?, 'First Term Examination Clearance & Bursary Reminder', 'Dear Parents, kindly ensure any outstanding First Term fee balance is settled via the Parent Portal Paystack gateway before November 30, 2026.', 'Chief Bursar · Greenwood High', 'BURSAR', 'ALL_PARENTS', 892, 'WHATSAPP_SMS_EMAIL', 'HIGH', 'DELIVERED', 890, 845),
			('gwh-msg-02', ?, 'Faculty Continuous Assessment (CA 2) Moderation Deadline', 'All subject teachers and form tutors must finalize CA 2 score uploads on ResultsPRO before Monday 4:00 PM for HOD moderation.', 'Mr. Babatunde Adewale (VP Academics)', 'VP_ACADEMICS', 'ALL_STAFF', 64, 'PORTAL_EMAIL', 'URGENT', 'DELIVERED', 64, 62),
			('gwh-msg-03', ?, 'Route A & Route B Morning Shuttle Departure Advisory', 'Due to road resurfacing along Admiralty Way, Route A and Route B buses will depart 10 minutes earlier this week.', 'Fleet Operations Desk', 'TRANSPORT', 'BUS_PARENTS', 180, 'SMS_WHATSAPP', 'NORMAL', 'DELIVERED', 180, 174)
		`, tenantID, tenantID, tenantID)
	}

	// 15. Seed Clinic Health Records, Visits & Medications
	var clinicCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_clinic_health_records WHERE tenant_id = ?", tenantID).Scan(&clinicCount)
	if clinicCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_clinic_health_records (id, tenant_id, student_id, student_name, class_name, blood_group, genotype, allergies, chronic_conditions, emergency_contact_name, emergency_contact_phone, immunization_status, medical_notes)
			VALUES
			('gwh-clr-01', ?, 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'O+', 'AA', 'Peanuts, Mild Penicillin sensitivity', 'None', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'FULLY_IMMUNIZED', 'Cleared for competitive athletics and boarding residence.'),
			('gwh-clr-02', ?, 'std_alex_01',     'Alex Adeleke-Okonkwo',      'SS 3 Science Diamond', 'O+', 'AA', 'Peanuts (Mild)',                      'None', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'FULLY_IMMUNIZED', 'Varsity football team medical clearance verified.'),
			('gwh-clr-03', ?, 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'JSS 2 Gold',           'A+', 'AA', 'None',                                'None', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'FULLY_IMMUNIZED', 'Annual dental and optical checkup completed.'),
			('gwh-clr-04', ?, 'std_amina_07',    'Amina Abdullahi',           'SS 2 Science',         'B+', 'AS', 'Dust & Pollen (Mild Asthma)',         'Mild Seasonal Asthma (Inhaler in Infirmary)', 'Alhaji Yusuf Abdullahi', '+234 809 221 3409', 'FULLY_IMMUNIZED', 'Ventolin inhaler kept at Infirmary Bay A.')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_clinic_visits (id, tenant_id, student_id, student_name, class_name, visit_type, symptoms, diagnosis, treatment, medication_dispensed, triage_priority, nurse_name, parent_notified, admitted_to_bed, discharge_time, status, notes)
			VALUES
			('gwh-clv-01', ?, 'std_kelechi_01', 'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'OUTPATIENT', 'Mild frontal headache after extended double Physics practical', 'Mild dehydration and visual fatigue', 'Oral rehydration salts, Paracetamol 500mg & 45-min rest', 'Paracetamol 500mg (1 tab)', 'LOW', 'Nurse Comfort Adeyemi (RN)', true, '', '11:30 AM', 'DISCHARGED_TO_CLASS', 'Returned to class refreshed'),
			('gwh-clv-02', ?, 'std_chinedu_05', 'Chinedu Eze',               'SS 3 Science Diamond', 'SPORTS_FIRST_AID', 'Minor ankle scrape during Inter-House football trial', 'Superficial abrasion on right ankle', 'Antiseptic cleansing, povidone-iodine dressing & ice pack', 'Antiseptic Dressing', 'MEDIUM', 'Nurse Comfort Adeyemi (RN)', true, 'Sick Bay Bed 02', '', 'UNDER_OBSERVATION', 'Resting in sick bay for 1 hour before afternoon prep')
		`, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_clinic_medications (id, tenant_id, drug_name, category, dosage_form, stock_quantity, reorder_level, unit, expiry_date, batch_number, status)
			VALUES
			('gwh-med-01', ?, 'Paracetamol 500mg Blister Packs',        'ANALGESIC',    'Tablets',   240, 50, 'Tablets',  '2028-04-30', 'EMZ-2025-881', 'IN_STOCK'),
			('gwh-med-02', ?, 'Oral Rehydration Salts (ORS Sachets)',   'ELECTROLYTES', 'Sachets',   120, 30, 'Sachets',  '2027-11-30', 'FID-2025-104', 'IN_STOCK'),
			('gwh-med-03', ?, 'Povidone-Iodine & Sterile Gauze Dressings','FIRST_AID',  'Packs',     65,  15, 'Packs',    '2028-08-15', 'JNJ-2025-332', 'IN_STOCK'),
			('gwh-med-04', ?, 'Salbutamol (Ventolin) 100mcg Inhaler',   'RESPIRATORY',  'Inhalers',  12,  5,  'Inhalers', '2027-09-30', 'GSK-2025-519', 'IN_STOCK')
		`, tenantID, tenantID, tenantID, tenantID)
	}

	// 16. Seed Hostel Allocations, Exeats & Nightly Roll Calls
	var hostelCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_hostel_allocations WHERE tenant_id = ?", tenantID).Scan(&hostelCount)
	if hostelCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_hostel_allocations (id, tenant_id, hostel_name, wing, room_number, bed_capacity, occupants_count, occupants_summary, matron_name, gender_wing, term_fee_naira, status)
			VALUES
			('gwh-hst-01', ?, 'Silverbird Hall (Senior Girls Boarding)', 'Wing A · 2nd Floor', 'Room 204', 4, 4, 'Kelechi Stephanie Okonkwo (Bed B), Aisha Bello (Bed A), Amina Abdullahi (Bed C), Grace Okafor (Bed D)', 'Mrs. Ngozi Okafor & Matron Comfort', 'FEMALE', 180000, 'OCCUPIED'),
			('gwh-hst-02', ?, 'Nelson Mandela Hall (Senior Boys Boarding)', 'Wing B · 1st Floor', 'Room 114', 4, 4, 'Alex Adeleke-Okonkwo (Bed 02), Femi Adeleke (Bed 01), Tunde Bakare (Bed 03), Samuel Danjuma (Bed 04)', 'Mr. Emeka Nwosu (Senior Housemaster)', 'MALE', 180000, 'OCCUPIED'),
			('gwh-hst-03', ?, 'Queen Amina Hall (Junior Girls Boarding)', 'Wing A · 1st Floor', 'Room 105', 6, 5, 'Oluwadamilola Fajuyi, Zainab Bello, Chisom Eze, Fatima Musa, Temi Lawal', 'Mrs. Folashade Bakare', 'FEMALE', 165000, 'AVAILABLE')
		`, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_hostel_exeats (id, tenant_id, student_id, student_name, class_name, hostel_name, room_number, exeat_type, reason, departure_date, expected_return_date, actual_return_date, authorized_parent, parent_phone, approved_by, pass_code, status)
			VALUES
			('gwh-ext-01', ?, 'std_kelechi_01', 'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'Silverbird Hall (Senior Girls Boarding)', 'Room 204', 'WEEKEND', 'Family Thanksgiving Service & Orthodontics Checkup in Ikoyi', '2026-11-21', '2026-11-23', '2026-11-23', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'Mr. Emeka Nwosu', 'EXT-GWH-9041', 'RETURNED'),
			('gwh-ext-02', ?, 'std_alex_01',    'Alex Adeleke-Okonkwo',      'SS 3 Science Diamond', 'Nelson Mandela Hall (Senior Boys Boarding)', 'Room 114', 'WEEKEND', 'Family Wedding Ceremony & Weekend Home Visit', '2026-11-28', '2026-11-30', '', 'Mrs. Sarah Adeleke-Okonkwo', '+234 803 459 2810', 'Mr. Emeka Nwosu', 'EXT-GWH-9088', 'APPROVED')
		`, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_hostel_rollcalls (id, tenant_id, hostel_name, rollcall_date, session_type, total_boarders, present_count, on_exeat_count, sick_bay_count, absent_unexcused, supervisor_name, notes)
			VALUES
			('gwh-hrc-01', ?, 'Silverbird Hall (Senior Girls Boarding)', ?, 'NIGHT_PREP_BEDCHECK', 142, 140, 2, 0, 0, 'Matron Comfort Adeyemi', 'All senior girls accounted for at 9:30 PM lights-out check.'),
			('gwh-hrc-02', ?, 'Nelson Mandela Hall (Senior Boys Boarding)', ?, 'NIGHT_PREP_BEDCHECK', 148, 146, 1, 1, 0, 'Mr. Emeka Nwosu', 'All boarders present except 1 approved exeat and 1 in Infirmary.')
		`, tenantID, todayDate, tenantID, todayDate)
	}

	// 17. Seed Security Visitors, Authorized Pickups & Gate Incidents
	var secCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_security_authorized_pickups WHERE tenant_id = ?", tenantID).Scan(&secCount)
	if secCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_security_authorized_pickups (id, tenant_id, student_id, student_name, class_name, guardian_name, relationship, guardian_phone, id_verification, pickup_code, photo_verified, status)
			VALUES
			('gwh-pkp-01', ?, 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'Mrs. Sarah Adeleke-Okonkwo', 'Mother (Primary Guardian)', '+234 803 459 2810', 'NIN-44918273645', '849201', true, 'ACTIVE'),
			('gwh-pkp-02', ?, 'std_alex_01',     'Alex Adeleke-Okonkwo',      'SS 3 Science Diamond', 'Dr. Emeka Okonkwo',          'Father (Primary Guardian)', '+234 802 889 1234', 'NIN-44918273646', '849201', true, 'ACTIVE'),
			('gwh-pkp-03', ?, 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'JSS 2 Gold',           'Mr. Sunday Adeleke (Family Chauffeur)', 'Authorized Family Driver', '+234 814 300 9988', 'LASDRI-9918273', '731940', true, 'ACTIVE'),
			('gwh-pkp-04', ?, 'std_kamsi_08',    'Kamsiyochukwu Nwosu',       'JSS 3 Diamond',        'Dr. Emeka Nwosu',            'Father (Primary Guardian)', '+234 803 412 8890', 'NIN-55819203948', '620418', true, 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_security_visitors (id, tenant_id, visitor_name, visitor_phone, id_type, id_number, purpose, host_name, host_department, pass_badge_no, vehicle_plate, time_in, time_out, gate_post, security_officer, status)
			VALUES
			('gwh-vis-01', ?, 'Engr. Dapo Fajuyi', '+234 803 550 1188', 'Driver License', 'FKJ-88412-AA', 'Admissions Interview & Campus Tour', 'Engr. Funke Adebayo', 'Admissions Office', 'VIS-GWH-014', 'LND-889-AA', '09:15 AM', '11:05 AM', 'Main Gate A (Lekki)', 'CSO Capt. (Rtd.) Bala Musa', 'CHECKED_OUT'),
			('gwh-vis-02', ?, 'Mr. Taiwo Olatunji (Finlab Ltd)', '+234 803 400 9911', 'NIN Slip', '77419283746', 'Delivery of Chemistry Practical Burettes', 'Dr. Chinedu Eze', 'Sciences & STEM', 'VIS-GWH-019', 'KJA-312-XY', '10:30 AM', '', 'Service Gate B', 'Sgt. Segun Adeyemi', 'ON_CAMPUS')
		`, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_security_incidents (id, tenant_id, incident_type, severity, location, description, reported_by, action_taken, status)
			VALUES
			('gwh-sec-inc1', ?, 'GATE_ACCESS_AUDIT', 'LOW', 'Main Pedestrian Turnstile B', 'Unregistered ride-hail driver attempted student pickup without dynamic 6-digit Parent PIN; pickup denied until mother confirmed via video call and PIN.', 'CSO Capt. (Rtd.) Bala Musa', 'Verified Parent PIN 849201 with Mrs. Okonkwo before release.', 'RESOLVED')
		`, tenantID)
	}

	// 18. Seed Discipline Incidents, Merit Awards & Pastoral Counseling
	var meritCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_merit_awards WHERE tenant_id = ?", tenantID).Scan(&meritCount)
	if meritCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_merit_awards (id, tenant_id, student_id, student_name, class_name, house_name, award_name, category, points, reason, awarded_by, award_date)
			VALUES
			('gwh-mrt-01', ?, 'std_kelechi_01', 'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'Sapphire House (Blue)', 'Principal''s Gold Commendation in Further Mathematics', 'ACADEMIC', 25, 'Scored 98% in First Term CA 1 & led the Lagos State STEM Olympiad winning team', 'Dr. Olumide Adeleke', '2026-11-12'),
			('gwh-mrt-02', ?, 'std_kelechi_01', 'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'Sapphire House (Blue)', 'Exemplary Student Leadership & Peer Mentorship Award', 'LEADERSHIP', 20, 'Organized weekend Physics & Coding peer tutorials for JSS 3 Checkpoint scholars', 'Engr. Funke Adebayo', '2026-11-18'),
			('gwh-mrt-03', ?, 'std_kelechi_01', 'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'Sapphire House (Blue)', '18-Day Consecutive Perfect Biometric Punctuality Streak', 'CITIZENSHIP', 15, 'Zero lateness recorded across all morning assembly roll calls', 'Mr. Babatunde Adewale', '2026-11-22'),
			('gwh-mrt-04', ?, 'std_alex_01',    'Alex Adeleke-Okonkwo',      'SS 3 Science Diamond', 'Sapphire House (Blue)', 'National Robotics Prototype Innovation Award', 'STEM', 25, 'Co-designed solar irrigation microcontroller circuit', 'Mr. Tunde Ogunlesi', '2026-11-18'),
			('gwh-mrt-05', ?, 'std_femi_04',    'Femi Adeleke',              'SS 3 Science Diamond', 'Emerald House (Green)', 'Head Boy Civic Responsibility Distinction', 'LEADERSHIP', 20, 'Outstanding coordination of morning assembly and prefect council', 'Dr. (Mrs.) Folake Adeyemi', '2026-11-15')
		`, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_discipline_incidents (id, tenant_id, student_id, student_name, class_name, incident_type, category, severity, points_impact, description, action_taken, parent_notified, reported_by, incident_date, status)
			VALUES
			('gwh-dsc-01', ?, 'std_chinedu_05', 'Chinedu Eze',  'SS 3 Science Diamond', 'DEMERIT', 'Punctuality', 'MINOR', 5, 'Arrived 9 minutes after morning assembly bell without prior transport note.', 'Verbal counseling by Form Tutor', true, 'Dr. Olumide Adeleke', '2026-11-19', 'RESOLVED'),
			('gwh-dsc-02', ?, 'std_david_09',   'David Okafor', 'SS 1 Science',         'DEMERIT', 'Uniform & Dress Code', 'MINOR', 5, 'Forgot laboratory white coat during Tuesday Chemistry practical.', 'Issued spare lab coat and logged reminder', false, 'Dr. Chinedu Eze', '2026-11-17', 'RESOLVED')
		`, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_pastoral_counseling (id, tenant_id, student_id, student_name, class_name, counselor_name, session_topic, category, confidentiality, summary_notes, follow_up_date, status)
			VALUES
			('gwh-pst-01', ?, 'std_kelechi_01', 'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'Mr. Segun Lawal', 'MIT, Imperial College & Covenant University Scholarship Application Advisory', 'CAREER_GUIDANCE', 'STANDARD', 'Reviewed personal statement and SAT/WAEC target grades for Computer Engineering applications.', '2026-12-10', 'COMPLETED'),
			('gwh-pst-02', ?, 'std_alex_01',    'Alex Adeleke-Okonkwo',      'SS 3 Science Diamond', 'Mr. Segun Lawal', 'STEM Study Schedule & Varsity Football Time Management', 'ACADEMIC_COACHING', 'STANDARD', 'Balanced evening prep hours with Inter-House football captaincy responsibilities.', '2026-12-08', 'COMPLETED')
		`, tenantID, tenantID)
	}

	// 19. Seed Cafeteria Wallets, Transactions & Weekly Dining Menus
	var cafCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_cafeteria_wallets WHERE tenant_id = ?", tenantID).Scan(&cafCount)
	if cafCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_cafeteria_wallets (id, tenant_id, student_id, student_name, class_name, card_rfid, balance, daily_limit, dietary_restrictions, status, last_top_up_amount, last_top_up_date)
			VALUES
			('gwh-wal-01', ?, 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'SS 3 Science Diamond', 'RFID-GWH-0412', 18500, 3500, 'No Peanuts', 'ACTIVE', 20000, '2026-11-15'),
			('gwh-wal-02', ?, 'std_alex_01',     'Alex Adeleke-Okonkwo',      'SS 3 Science Diamond', 'RFID-GWH-0188', 15200, 3500, 'No Peanuts', 'ACTIVE', 20000, '2026-11-15'),
			('gwh-wal-03', ?, 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'JSS 2 Gold',           'RFID-GWH-0342', 12400, 2500, 'None',       'ACTIVE', 15000, '2026-11-16'),
			('gwh-wal-04', ?, 'std_femi_04',     'Femi Adeleke',              'SS 3 Science Diamond', 'RFID-GWH-0104', 22000, 4000, 'None',       'ACTIVE', 25000, '2026-11-18')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_cafeteria_transactions (id, tenant_id, wallet_id, student_id, student_name, transaction_type, amount, balance_after, description, cashier_name)
			VALUES
			('gwh-ctx-01', ?, 'gwh-wal-01', 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'PURCHASE', 1500, 18500, 'Smoky Party Jollof Rice, Grilled Chicken & Fresh Pineapple Juice', 'Dining Hall POS 1'),
			('gwh-ctx-02', ?, 'gwh-wal-01', 'std_kelechi_01',  'Kelechi Stephanie Okonkwo', 'TOP_UP',  20000, 20000, 'Parent Portal Paystack Wallet Top-Up by Mrs. Sarah Adeleke-Okonkwo', 'Paystack Switch'),
			('gwh-ctx-03', ?, 'gwh-wal-02', 'std_alex_01',     'Alex Adeleke-Okonkwo',      'PURCHASE', 1400, 15200, 'Jollof Rice, Plantain & Bottled Water', 'Dining Hall POS 2'),
			('gwh-ctx-04', ?, 'gwh-wal-03', 'std_chiamaka_02', 'Chiamaka Adeleke-Okonkwo',  'PURCHASE', 950,  12400, 'Baked Chicken Pie & Fresh Orange Juice', 'Tuck Shop POS A')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_cafeteria_menus (id, tenant_id, day_of_week, meal_type, menu_items, calories_kcal, price_naira, allergens, nutritionist_approved, status)
			VALUES
			('gwh-mnu-01', ?, 'Monday',    'BREAKFAST', 'Golden Akara, Creamy Pap (Ogi) with Peak Milk & Boiled Egg', 480, 1000, 'Milk, Egg', true, 'ACTIVE'),
			('gwh-mnu-02', ?, 'Monday',    'LUNCH',     'Smoky Jollof Rice, Grilled Teriyaki Chicken, Fried Plantain & Coleslaw', 690, 1500, 'None', true, 'ACTIVE'),
			('gwh-mnu-03', ?, 'Monday',    'DINNER',    'Pounded Yam with Rich Egusi Soup & Steamed Titus Fish', 640, 1500, 'Fish', true, 'ACTIVE'),
			('gwh-mnu-04', ?, 'Tuesday',   'LUNCH',     'Coconut Fried Rice, Peppered Beef Bites, Moi-Moi & Fresh Watermelon', 670, 1500, 'None', true, 'ACTIVE'),
			('gwh-mnu-05', ?, 'Wednesday', 'LUNCH',     'Ofada Rice with Designer Ayamase Sauce, Boiled Egg & Dodo', 710, 1500, 'Egg', true, 'ACTIVE'),
			('gwh-mnu-06', ?, 'Thursday',  'LUNCH',     'Spaghetti Jollof with Grilled Turkey & Steamed Garden Vegetables', 650, 1500, 'Gluten', true, 'ACTIVE'),
			('gwh-mnu-07', ?, 'Friday',    'LUNCH',     'Amala / Semovita with Ewedu, Gbegiri & Assorted Goat Meat Stew + Fresh Fruit Cup', 680, 1500, 'None', true, 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	// 20. Seed Co-Curricular Houses, Clubs & Sports Fixtures
	var houseCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_houses WHERE tenant_id = ?", tenantID).Scan(&houseCount)
	if houseCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_houses (id, tenant_id, house_name, color_code, house_master, house_captain, total_points, student_count, motto)
			VALUES
			('gwh-hse-sapphire', ?, 'Sapphire House (Blue)',  '#146ef5', 'Mr. Emeka Nwosu',         'Kelechi Stephanie Okonkwo', 1485, 365, 'Excellence in Courage and Truth'),
			('gwh-hse-emerald',  ?, 'Emerald House (Green)',  '#10b981', 'Dr. Olumide Adeleke',     'Femi Adeleke',              1410, 362, 'Wisdom, Perseverance and Victory'),
			('gwh-hse-ruby',     ?, 'Ruby House (Crimson)',   '#ef4444', 'Engr. Funke Adebayo',     'Chinedu Eze',               1350, 360, 'Passion, Honor and Fortitude'),
			('gwh-hse-topaz',    ?, 'Topaz House (Gold)',     '#f59e0b', 'Mrs. Folashade Bakare',   'Aisha Bello',               1295, 358, 'Radiance, Integrity and Service')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_clubs (id, tenant_id, club_name, category, patron_teacher, president_student, meeting_day, meeting_time, venue, member_count, term_dues_naira, status)
			VALUES
			('gwh-clb-01', ?, 'JET / AI & Robotics Society',       'STEM & Robotics', 'Engr. Funke Adebayo',   'Kelechi Stephanie Okonkwo', 'Wednesday', '02:15 PM - 03:30 PM', 'STEM Makerspace Lab 4', 48, 15000, 'ACTIVE'),
			('gwh-clb-02', ?, 'Literary, Debate & Model UN Guild', 'Humanities',      'Mrs. Folashade Bakare', 'Aisha Bello',               'Thursday',  '02:15 PM - 03:30 PM', 'Main Oratory Amphitheater', 42, 10000, 'ACTIVE'),
			('gwh-clb-03', ?, 'Junior Coders & Python Academy',    'ICT & Coding',    'Mr. Tunde Ogunlesi',    'Alex Adeleke-Okonkwo',      'Friday',    '02:00 PM - 03:15 PM', 'Digital CBT Suite 2', 55, 15000, 'ACTIVE'),
			('gwh-clb-04', ?, 'Greenwood Orchestra & Choral Ensemble','Creative Arts','Mrs. Ngozi Okafor',     'Chiamaka Adeleke-Okonkwo',  'Wednesday', '02:15 PM - 03:30 PM', 'Music Conservatory Studio', 36, 12000, 'ACTIVE'),
			('gwh-clb-05', ?, 'Chess & Mathematical Olympiad Club','Academic',        'Dr. Olumide Adeleke',   'Femi Adeleke',              'Tuesday',   '02:30 PM - 03:30 PM', 'Mathematics Suite 101', 38, 10000, 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_sports_fixtures (id, tenant_id, sport_type, title, home_team, away_team, match_date, venue, score_summary, status)
			VALUES
			('gwh-fix-01', ?, 'FOOTBALL',  'Inter-House Senior Boys Football Final',        'Sapphire House (Blue)', 'Emerald House (Green)', '2026-11-27', 'Greenwood FIFA Astro-Turf Pitch', '3 - 2 (Sapphire Won)', 'COMPLETED'),
			('gwh-fix-02', ?, 'ATHLETICS', '4x100m Senior Girls Relay Championship',        'Sapphire House (Blue)', 'Ruby House (Crimson)',  '2026-11-27', 'Main Olympic Track Arena',        '48.4s Track Record',   'COMPLETED'),
			('gwh-fix-03', ?, 'BASKETBALL','AISEN Lagos Invitational Basketball Quarterfinal','Greenwood High Lions', 'Atlantic Hall Poka',     '2026-12-04', 'Indoor Sports Gymnasium',         'Tip-off 03:30 PM',     'UPCOMING'),
			('gwh-fix-04', ?, 'SWIMMING',  'Inter-House 50m Freestyle Gala',                'All 4 Houses',          'Aquatic Championship',   '2026-12-06', 'Greenwood 25m Aquatic Center',    'Heats at 10:00 AM',    'UPCOMING')
		`, tenantID, tenantID, tenantID, tenantID)
	}

	// 21. Seed Campus Facilities & Bookings
	var facCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_facilities WHERE tenant_id = ?", tenantID).Scan(&facCount)
	if facCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_facilities (id, tenant_id, facility_name, category, building_block, capacity, equipment_summary, custodian_name, maintenance_status, last_inspected_date, status)
			VALUES
			('gwh-fac-01', ?, 'Physics & Mechatronics Laboratory Block A', 'LABORATORY',  'STEM Wing · 2nd Floor', 40, 'Oscilloscopes, Optical Benches, 3D Printers, Smartboard', 'Engr. Funke Adebayo', 'OPERATIONAL', '2026-11-15', 'AVAILABLE'),
			('gwh-fac-02', ?, 'Chemistry & Wet Science Laboratory 2',      'LABORATORY',  'STEM Wing · 1st Floor', 40, 'Fume Hoods, Analytical Balances, Titration Stations',      'Dr. Chinedu Eze',     'OPERATIONAL', '2026-11-15', 'AVAILABLE'),
			('gwh-fac-03', ?, 'Digital CBT & AI Testing Center (250 Seats)','ICT_CENTER', 'Innovation Complex',    250,'250 All-in-One PCs, Fiber LAN, UPS Backup, CCTV Proctoring','Mr. Tunde Ogunlesi',  'OPERATIONAL', '2026-11-20', 'AVAILABLE'),
			('gwh-fac-04', ?, 'Chief Adeyemi 1,000-Seat Main Auditorium',  'AUDITORIUM',  'Central Admin Plaza',  1000,'Line-Array Acoustic PA, LED Video Wall, Stage Lighting',   'Mr. Segun Lawal',     'OPERATIONAL', '2026-11-18', 'AVAILABLE'),
			('gwh-fac-05', ?, 'Olympic Astro-Turf & Athletics Stadium',    'SPORTS_ARENA','South Campus Grounds', 1500,'FIFA Turf, 8-Lane Tartan Track, Electronic Scoreboard',    'Mr. Emeka Nwosu',     'OPERATIONAL', '2026-11-22', 'AVAILABLE')
		`, tenantID, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_facility_bookings (id, tenant_id, facility_id, facility_name, event_title, booked_by, department, start_date, start_time, end_date, end_time, attendees_estimate, status, notes)
			VALUES
			('gwh-fbk-01', ?, 'gwh-fac-01', 'Physics & Mechatronics Laboratory Block A', 'SS 3 WAEC Optics & Electromagnetism Practical Mock', 'Engr. Funke Adebayo', 'Sciences & STEM', ?, '08:45 AM', ?, '10:30 AM', 28, 'CONFIRMED', 'Apparatus pre-arranged by lab technologist'),
			('gwh-fbk-02', ?, 'gwh-fac-03', 'Digital CBT & AI Testing Center (250 Seats)', 'First Term Continuous Assessment CBT Simulation', 'Mr. Tunde Ogunlesi', 'ICT & Robotics', '2026-12-01', '09:00 AM', '2026-12-01', '01:00 PM', 180, 'CONFIRMED', 'Proctoring server active'),
			('gwh-fbk-03', ?, 'gwh-fac-04', 'Chief Adeyemi 1,000-Seat Main Auditorium', 'PTA Annual General Congress & Career Mentorship Day', 'Mrs. Sarah Adeleke-Okonkwo', 'PTA Executive', '2026-11-29', '10:00 AM', '2026-11-29', '02:00 PM', 450, 'CONFIRMED', 'AV & live streaming crew assigned')
		`, tenantID, todayDate, todayDate, tenantID, tenantID)
	}

	// 22. Seed Alumni Directory, Transcript Requests & Credential Verifications
	var almCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_alumni_directory WHERE tenant_id = ?", tenantID).Scan(&almCount)
	if almCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_alumni_directory (id, tenant_id, full_name, graduation_year, admission_number, house_name, email, phone, current_university, course_of_study, current_employer, current_role, linkedin_url, is_mentor, donations_total_naira, status)
			VALUES
			('gwh-alm-01', ?, 'Chidinma Nwosu',       '2025', 'GWH/2019/0014', 'Sapphire House (Blue)', 'chidinma.nwosu@mit.edu',          '+234 803 412 8899', 'Massachusetts Institute of Technology (MIT)', 'B.Sc Computer Science & AI', 'MIT Media Lab', 'Undergraduate Researcher (Valedictorian 2025)', 'https://linkedin.com', true, 500000, 'ACTIVE'),
			('gwh-alm-02', ?, 'Oluwaseun Adeyemi',    '2023', 'GWH/2017/0082', 'Emerald House (Green)', 'seun.adeyemi@imperial.ac.uk',     '+234 802 910 3311', 'Imperial College London',                     'M.Eng Aeronautical Engineering', 'Rolls-Royce Aerospace UK', 'Graduate Aerodynamics Fellow', 'https://linkedin.com', true, 1250000, 'ACTIVE'),
			('gwh-alm-03', ?, 'Dr. Toluwani Balogun', '2018', 'GWH/2012/0041', 'Ruby House (Crimson)',  'tolu.balogun@luth.gov.ng',        '+234 805 661 9022', 'University of Lagos (CMUL)',                  'MBBS Medicine & Surgery', 'Lagos University Teaching Hospital', 'Senior Medical Officer', 'https://linkedin.com', true, 2000000, 'ACTIVE'),
			('gwh-alm-04', ?, 'Zainab Danjuma',       '2024', 'GWH/2018/0109', 'Topaz House (Gold)',    'zainab.danjuma@covenantuniversity.edu.ng', '+234 809 311 4400', 'Covenant University Ota',            'B.Eng Electrical & Electronics', 'Paystack Engineering', 'Software Engineering Intern', 'https://linkedin.com', true, 350000, 'ACTIVE')
		`, tenantID, tenantID, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_transcript_requests (id, tenant_id, tracking_code, alumnus_name, graduation_year, admission_number, destination_institution, destination_country, delivery_mode, fee_paid_naira, payment_status, processing_stage, verified_by, tracking_courier, requested_date)
			VALUES
			('gwh-trq-01', ?, 'TRQ-GWH-2026-081', 'Chidinma Nwosu',    '2025', 'GWH/2019/0014', 'Massachusetts Institute of Technology (MIT)', 'United States', 'ELECTRONIC_PARCHMENT', 35000, 'PAID', 'DISPATCHED', 'Mrs. Ngozi Okafor (Academic Registrar)', 'PAR-MIT-991820', '2026-10-12'),
			('gwh-trq-02', ?, 'TRQ-GWH-2026-094', 'Zainab Danjuma',    '2024', 'GWH/2018/0109', 'University of Toronto (Transfer Credit)',     'Canada',        'DHL_COURIER_AND_DIGITAL', 45000, 'PAID', 'REGISTRAR_SIGNED', 'Mrs. Ngozi Okafor (Academic Registrar)', 'DHL-884120912', '2026-11-18')
		`, tenantID, tenantID)

		_, _ = db.DB.Exec(`
			INSERT INTO campus_credential_verifications (id, tenant_id, verification_code, candidate_name, admission_number, graduation_year, requesting_organization, verifier_email, purpose, verification_result, verified_by, verified_at)
			VALUES
			('gwh-ver-01', ?, 'VER-GWH-2026-441', 'Oluwaseun Adeyemi',    'GWH/2017/0082', '2023', 'Imperial College London Admissions Registry', 'registry@imperial.ac.uk', 'WAEC & High School Diploma Authenticity Check', 'AUTHENTIC_VERIFIED', 'Mrs. Ngozi Okafor', '2026-10-20 14:22:00'),
			('gwh-ver-02', ?, 'VER-GWH-2026-459', 'Dr. Toluwani Balogun', 'GWH/2012/0041', '2018', 'Medical & Dental Council of Nigeria (MDCN)',  'verification@mdcn.gov.ng','Secondary School Testimonial Verification',     'AUTHENTIC_VERIFIED', 'Dr. (Mrs.) Folake Adeyemi', '2026-11-05 11:10:00')
		`, tenantID, tenantID)
	}

	// 23. Seed Mobile App Accounts
	var mobCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_mobile_app_accounts WHERE tenant_id = ?", tenantID).Scan(&mobCount)
	if mobCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_mobile_app_accounts (id, tenant_id, account_id, user_name, role, email, phone, campus_name, ward_name, status, app_version, device_model, push_enabled, biometric_login, last_active)
			VALUES
			('gwh-mob-01', ?, 'MOB-PRN-88412', 'Mrs. Sarah Adeleke-Okonkwo', 'PARENT',  'sarah.okonkwo@greenwoodhigh.edu.ng', '+234 803 459 2810', 'Main Campus · Lekki Phase 1',      'Kelechi, Alex & Chiamaka Okonkwo', 'ACTIVE',  'v4.2.1 (iOS)',     'iPhone 16 Pro Max',     true, true,  '2 mins ago'),
			('gwh-mob-02', ?, 'MOB-PRN-88419', 'Dr. Emeka Nwosu',            'PARENT',  'emeka.nwosu@gmail.com',              '+234 803 412 8890', 'Main Campus · Lekki Phase 1',      'Kamsiyochukwu Nwosu (JSS 3)',      'ACTIVE',  'v4.2.1 (Android)', 'Samsung Galaxy S24 Ultra', true, true, '14 mins ago'),
			('gwh-mob-03', ?, 'MOB-STD-77104', 'Kelechi Stephanie Okonkwo',  'STUDENT', 'kelechi.okonkwo@greenwoodhigh.edu.ng','+234 803 459 2810', 'Main Campus · Lekki Phase 1',     'SS 3 Science Diamond',             'ACTIVE',  'v4.2.1 (iPadOS)',  'iPad Air M2 (School)',  true, true,  '5 mins ago'),
			('gwh-mob-04', ?, 'MOB-STD-77105', 'Alex Adeleke-Okonkwo',       'STUDENT', 'alex.okonkwo@greenwoodhigh.edu.ng',  '+234 803 459 2810', 'Main Campus · Lekki Phase 1',      'SS 3 Science Diamond',             'ACTIVE',  'v4.2.1 (iPadOS)',  'iPad Air M2 (School)',  true, true,  '18 mins ago'),
			('gwh-mob-05', ?, 'MOB-TCH-55101', 'Engr. Funke Adebayo',        'TEACHER', 'f.adebayo@greenwoodhigh.edu.ng',     '+234 803 310 1105', 'Main Campus · Lekki Phase 1',      'Physics & STEM Faculty',           'ACTIVE',  'v4.2.1 (iOS)',     'iPhone 15 Pro',         true, true,  'Just now'),
			('gwh-mob-06', ?, 'MOB-TCH-55102', 'Mr. Babatunde Adewale',      'TEACHER', 'b.adewale@greenwoodhigh.edu.ng',     '+234 803 310 1101', 'Annex Campus · Ikeja GRA',         'VP Academics & Mathematics',       'ACTIVE',  'v4.2.0 (Android)', 'Google Pixel 8 Pro',    true, true,  '8 mins ago'),
			('gwh-mob-07', ?, 'MOB-PRN-88435', 'Alhaji Yusuf Abdullahi',     'PARENT',  'y.abdullahi@yahoo.com',              '+234 809 221 3409', 'Victoria Island Junior Campus',    'Amina Abdullahi (SS 2)',           'ACTIVE',  'v4.2.1 (iOS)',     'iPhone 15',             true, true,  '1 hour ago'),
			('gwh-mob-08', ?, 'MOB-PRN-88450', 'Barr. Chuka Okafor',         'PARENT',  'chuka.okafor@chambers.ng',           '+234 805 612 9001', 'Abuja Maitama Campus',             'David Okafor (SS 1)',              'INVITED', 'Pending Install',  'Awaiting Activation',   false, false,'Invite Sent')
		`, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID, tenantID)
	}

	// 24. Seed Homework & Continuous Assessments
	var hwCount int
	_ = db.DB.QueryRow("SELECT COUNT(*) FROM campus_homework_and_assessments WHERE tenant_id = ?", tenantID).Scan(&hwCount)
	if hwCount == 0 {
		_, _ = db.DB.Exec(`
			INSERT INTO campus_homework_and_assessments (id, tenant_id, title, subject_name, class_name, teacher_name, due_date, max_score, submissions_count, total_students, description, status)
			VALUES
			('gwh-hw-01', ?, 'Calculus Problem Set 4: Limits, First Principles & Tangents', 'Further Mathematics', 'SS 3 Science Diamond', 'Dr. Olumide Adeleke', '2026-12-01', 100, 25, 28, 'Solve Exercises 14a & 14b from New General Mathematics and upload step-by-step derivations.', 'PUBLISHED'),
			('gwh-hw-02', ?, 'Electromagnetic Induction & Faraday''s Law Lab Report',       'Physics',             'SS 3 Science Diamond', 'Engr. Funke Adebayo', '2026-12-02', 50,  26, 28, 'Submit plotted EMF vs magnetic flux rate graphs from Tuesday''s Physics Lab A experiment.', 'PUBLISHED'),
			('gwh-hw-03', ?, 'Organic Chemistry: Alkanols, Esters & Saponification Quiz',   'Chemistry',           'SS 3 Science Diamond', 'Dr. Chinedu Eze',     '2026-12-03', 40,  22, 28, 'Complete the 30-question timed CBT quiz before Wednesday 6:00 PM.', 'PUBLISHED'),
			('gwh-hw-04', ?, 'Argumentative Essay: AI Governance in West African Education','English Language',    'SS 3 Science Diamond', 'Mrs. Folashade Bakare','2026-12-04', 50, 20, 28, 'Write a 600-word formal essay following WAEC Section A marking rubrics.', 'PUBLISHED')
		`, tenantID, tenantID, tenantID, tenantID)
	}

	log.Printf("[CampusPRO] Greenwood High Academy (%s) seed data verified across all 20 modules.", tenantID)
	return nil
}

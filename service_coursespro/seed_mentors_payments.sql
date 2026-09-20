-- 3. Assign Mentors to the Cohort
INSERT INTO crs_cohort_mentors (tenant_id, cohort_id, user_id, role)
VALUES
('skillupacademy', 'cohort_fall_2026', 'usr_mentor_001', 'LEAD_MENTOR'),
('skillupacademy', 'cohort_fall_2026', 'usr_mentor_002', 'MENTOR'),
('skillupacademy', 'cohort_fall_2026', 'usr_mentor_003', 'MENTOR'),
('skillupacademy', 'cohort_fall_2026', 'usr_mentor_004', 'MENTOR')
ON CONFLICT DO NOTHING;

-- 4. Insert Pending Project Submissions (to reflect pending_reviews stats)
INSERT INTO crs_project_submissions (id, tenant_id, cohort_id, stage_number, user_id, project_title, status, mentor_id)
VALUES
('sub_001', 'skillupacademy', 'cohort_fall_2026', 1, 'usr_student_01', 'Personal Portfolio', 'MENTOR_REVIEW', 'usr_mentor_001'),
('sub_002', 'skillupacademy', 'cohort_fall_2026', 1, 'usr_student_02', 'Calculator App', 'MENTOR_REVIEW', 'usr_mentor_001'),
('sub_003', 'skillupacademy', 'cohort_fall_2026', 2, 'usr_student_03', 'Weather API Dashboard', 'MENTOR_REVIEW', 'usr_mentor_001'),
('sub_004', 'skillupacademy', 'cohort_fall_2026', 2, 'usr_student_04', 'E-commerce Backend', 'MENTOR_REVIEW', 'usr_mentor_002'),
('sub_005', 'skillupacademy', 'cohort_fall_2026', 3, 'usr_student_05', 'Design System Figma', 'MENTOR_REVIEW', 'usr_mentor_003'),
('sub_006', 'skillupacademy', 'cohort_fall_2026', 3, 'usr_student_06', 'Wireframes v1', 'MENTOR_REVIEW', 'usr_mentor_003'),
('sub_007', 'skillupacademy', 'cohort_fall_2026', 3, 'usr_student_07', 'Usability Test Report', 'MENTOR_REVIEW', 'usr_mentor_003'),
('sub_008', 'skillupacademy', 'cohort_fall_2026', 3, 'usr_student_08', 'User Journey Maps', 'MENTOR_REVIEW', 'usr_mentor_003'),
('sub_009', 'skillupacademy', 'cohort_fall_2026', 3, 'usr_student_09', 'Prototyping Task', 'MENTOR_REVIEW', 'usr_mentor_003')
ON CONFLICT DO NOTHING;

-- Duplicate the seeded data for all existing tenant IDs found in crs_programs or crs_cohorts

DO $$ 
DECLARE 
    t_id VARCHAR;
BEGIN 
    FOR t_id IN (SELECT DISTINCT tenant_id FROM crs_programs UNION SELECT DISTINCT tenant_id FROM crs_cohorts) LOOP 
        IF t_id != 'skillupacademy' THEN 

            -- 1. Insert Cohort
            INSERT INTO crs_cohorts (id, tenant_id, program_id, slug, title, subtitle, description, status, created_at, updated_at)
            VALUES (
                'cohort_fall_2026_' || t_id,
                t_id,
                (SELECT id FROM crs_programs WHERE tenant_id = t_id LIMIT 1),
                'fall-2026-' || t_id,
                'Fall Cohort 2026',
                'The premier autumn batch',
                'Intensive bootcamp cohort.',
                'ACTIVE',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ) ON CONFLICT DO NOTHING;

            -- 2. Insert Mentors
            INSERT INTO crs_mentor_profiles (user_id, tenant_id, full_name, avatar_url, specialization, total_reviews, pending_reviews, avg_rating)
            VALUES 
            ('usr_mentor_001_' || t_id, t_id, 'Alice Johnson', 'https://i.pravatar.cc/150?u=alice', 'Frontend Development', 45, 3, 4.9),
            ('usr_mentor_002_' || t_id, t_id, 'Bob Smith', 'https://i.pravatar.cc/150?u=bob', 'Backend Architecture', 120, 1, 4.8),
            ('usr_mentor_003_' || t_id, t_id, 'Charlie Davis', 'https://i.pravatar.cc/150?u=charlie', 'UX/UI Design', 30, 5, 4.7),
            ('usr_mentor_004_' || t_id, t_id, 'Diana Prince', 'https://i.pravatar.cc/150?u=diana', 'Cloud Infrastructure', 80, 0, 5.0)
            ON CONFLICT (user_id) DO NOTHING;

            -- 3. Assign Mentors to the Cohort
            INSERT INTO crs_cohort_mentors (tenant_id, cohort_id, user_id, role)
            VALUES
            (t_id, 'cohort_fall_2026_' || t_id, 'usr_mentor_001_' || t_id, 'LEAD_MENTOR'),
            (t_id, 'cohort_fall_2026_' || t_id, 'usr_mentor_002_' || t_id, 'MENTOR'),
            (t_id, 'cohort_fall_2026_' || t_id, 'usr_mentor_003_' || t_id, 'MENTOR'),
            (t_id, 'cohort_fall_2026_' || t_id, 'usr_mentor_004_' || t_id, 'MENTOR')
            ON CONFLICT DO NOTHING;

            -- 4. Insert Pending Project Submissions
            INSERT INTO crs_project_submissions (id, tenant_id, cohort_id, stage_number, user_id, project_title, status, mentor_id)
            VALUES
            ('sub_001_' || t_id, t_id, 'cohort_fall_2026_' || t_id, 1, 'usr_student_01_' || t_id, 'Personal Portfolio', 'MENTOR_REVIEW', 'usr_mentor_001_' || t_id),
            ('sub_002_' || t_id, t_id, 'cohort_fall_2026_' || t_id, 1, 'usr_student_02_' || t_id, 'Calculator App', 'MENTOR_REVIEW', 'usr_mentor_001_' || t_id),
            ('sub_003_' || t_id, t_id, 'cohort_fall_2026_' || t_id, 2, 'usr_student_03_' || t_id, 'Weather API Dashboard', 'MENTOR_REVIEW', 'usr_mentor_001_' || t_id),
            ('sub_004_' || t_id, t_id, 'cohort_fall_2026_' || t_id, 2, 'usr_student_04_' || t_id, 'E-commerce Backend', 'MENTOR_REVIEW', 'usr_mentor_002_' || t_id)
            ON CONFLICT DO NOTHING;

            -- 5. Insert Transactions for Payments Dashboard
            INSERT INTO crs_transactions (id, tenant_id, user_id, cohort_id, amount, currency, gateway, reference, status, created_at, updated_at)
            VALUES
            ('txn_001_' || t_id, t_id, 'usr_student_01_' || t_id, 'cohort_fall_2026_' || t_id, 50000.00, 'NGN', 'paystack', 'REF_PAY_1001_' || t_id, 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP),
            ('txn_002_' || t_id, t_id, 'usr_student_02_' || t_id, 'cohort_fall_2026_' || t_id, 50000.00, 'NGN', 'paystack', 'REF_PAY_1002_' || t_id, 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP),
            ('txn_003_' || t_id, t_id, 'usr_student_03_' || t_id, 'cohort_fall_2026_' || t_id, 50000.00, 'NGN', 'paystack', 'REF_PAY_1003_' || t_id, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP),
            ('txn_004_' || t_id, t_id, 'usr_student_04_' || t_id, 'cohort_fall_2026_' || t_id, 50000.00, 'NGN', 'stripe', 'REF_PAY_1004_' || t_id, 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP)
            ON CONFLICT DO NOTHING;

        END IF;
    END LOOP;
END $$;

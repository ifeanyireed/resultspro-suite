-- =====================================================================
-- CoursesPRO Microservice Schema (PostgreSQL)
-- Microservice: service_coursespro
-- =====================================================================

DROP TABLE IF EXISTS crs_ai_jobs CASCADE;
DROP TABLE IF EXISTS crs_quiz_questions CASCADE;
DROP TABLE IF EXISTS crs_quizzes CASCADE;
DROP TABLE IF EXISTS crs_public_portfolios CASCADE;
DROP TABLE IF EXISTS crs_presence_sessions CASCADE;
DROP TABLE IF EXISTS crs_peer_pairings CASCADE;
DROP TABLE IF EXISTS crs_project_submissions CASCADE;
DROP TABLE IF EXISTS crs_module_progress CASCADE;
DROP TABLE IF EXISTS crs_journey_modules CASCADE;
DROP TABLE IF EXISTS crs_journey_stages CASCADE;
DROP TABLE IF EXISTS crs_enrollments CASCADE;
DROP TABLE IF EXISTS crs_cohorts CASCADE;
DROP TABLE IF EXISTS crs_programs CASCADE;

-- 0. Programs (Curriculum Templates)
CREATE TABLE IF NOT EXISTS crs_programs (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_weeks INTEGER DEFAULT 12,
    base_price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_programs_tenant ON crs_programs(tenant_id);

-- 1. Cohorts (Now linked to programs)
CREATE TABLE IF NOT EXISTS crs_cohorts (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    program_id VARCHAR(64) REFERENCES crs_programs(id) ON DELETE SET NULL,
    slug VARCHAR(128) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    duration_weeks INTEGER DEFAULT 12,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    capacity INTEGER DEFAULT 50,
    enrolled_count INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'NGN',
    lead_mentor_id VARCHAR(64),
    status VARCHAR(32) DEFAULT 'ENROLLING',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cohorts_tenant ON crs_cohorts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_mentor ON crs_cohorts(lead_mentor_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_program ON crs_cohorts(program_id);

CREATE TABLE IF NOT EXISTS crs_cohort_mentors (
    cohort_id VARCHAR(64) REFERENCES crs_cohorts(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    role VARCHAR(32) DEFAULT 'MENTOR',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cohort_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_cohort_mentors_user ON crs_cohort_mentors(user_id);


-- 2. Enrollments
CREATE TABLE IF NOT EXISTS crs_enrollments (
    id VARCHAR(64) PRIMARY KEY,
    cohort_id VARCHAR(64) NOT NULL REFERENCES crs_cohorts(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    plan_type VARCHAR(32) DEFAULT 'STANDARD',
    payment_status VARCHAR(32) DEFAULT 'PAID',
    subscription_id VARCHAR(128),
    billing_cycle VARCHAR(32) DEFAULT 'one-time',
    next_billing_date TIMESTAMPTZ,
    last_payment_failed BOOLEAN DEFAULT FALSE,
    current_stage_number INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active_date TIMESTAMPTZ,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_enrollments_cohort ON crs_enrollments(cohort_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON crs_enrollments(user_id);

-- 2.5 Transactions
CREATE TABLE IF NOT EXISTS crs_transactions (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    cohort_id VARCHAR(64) REFERENCES crs_cohorts(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    gateway VARCHAR(32) DEFAULT 'paystack',
    reference VARCHAR(128) UNIQUE NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant ON crs_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON crs_transactions(user_id);

-- 3. Journey Stages (Now linked to programs, not cohorts directly)
CREATE TABLE IF NOT EXISTS crs_journey_stages (
    id VARCHAR(64) PRIMARY KEY,
    program_id VARCHAR(64) NOT NULL REFERENCES crs_programs(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_stages_program ON crs_journey_stages(program_id);

-- 4. Journey Modules
CREATE TABLE IF NOT EXISTS crs_journey_modules (
    id VARCHAR(64) PRIMARY KEY,
    stage_id VARCHAR(64) NOT NULL REFERENCES crs_journey_stages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration_text VARCHAR(64) DEFAULT '45 mins',
    description TEXT,
    readings_count INTEGER DEFAULT 3,
    has_quiz BOOLEAN DEFAULT TRUE,
    has_challenge BOOLEAN DEFAULT TRUE,
    video_url VARCHAR(512),
    content_markdown TEXT,
    ai_summary TEXT,
    reflection_prompts TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_modules_stage ON crs_journey_modules(stage_id);

-- 5. Module Progress
CREATE TABLE IF NOT EXISTS crs_module_progress (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    module_id VARCHAR(64) NOT NULL REFERENCES crs_journey_modules(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    reflection_answer TEXT,
    quiz_score INTEGER DEFAULT 0,
    quiz_passed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_progress_user ON crs_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_module ON crs_module_progress(module_id);

-- 6. Project Submissions
CREATE TABLE IF NOT EXISTS crs_project_submissions (
    id VARCHAR(64) PRIMARY KEY,
    cohort_id VARCHAR(64) NOT NULL REFERENCES crs_cohorts(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    repo_url VARCHAR(512),
    figma_url VARCHAR(512),
    live_demo_url VARCHAR(512),
    notes TEXT,
    status VARCHAR(32) DEFAULT 'MENTOR_REVIEW',
    mentor_id VARCHAR(64),
    mentor_rating FLOAT DEFAULT 0,
    mentor_feedback TEXT,
    video_review_url VARCHAR(512),
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_submissions_cohort ON crs_project_submissions(cohort_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON crs_project_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mentor ON crs_project_submissions(mentor_id);

-- 7. Peer Pairings
CREATE TABLE IF NOT EXISTS crs_peer_pairings (
    id VARCHAR(64) PRIMARY KEY,
    cohort_id VARCHAR(64) NOT NULL REFERENCES crs_cohorts(id) ON DELETE CASCADE,
    student_a_id VARCHAR(64) NOT NULL,
    student_b_id VARCHAR(64) NOT NULL,
    sprint_number INTEGER DEFAULT 1,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    shared_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pairings_cohort ON crs_peer_pairings(cohort_id);
CREATE INDEX IF NOT EXISTS idx_pairings_sa ON crs_peer_pairings(student_a_id);
CREATE INDEX IF NOT EXISTS idx_pairings_sb ON crs_peer_pairings(student_b_id);

-- 8. Presence Sessions
CREATE TABLE IF NOT EXISTS crs_presence_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    room_name VARCHAR(128) DEFAULT 'Sprint Room Alpha',
    activity VARCHAR(64) DEFAULT 'Coding',
    is_active BOOLEAN DEFAULT TRUE,
    last_heartbeat TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_presence_user ON crs_presence_sessions(user_id);

-- 9. Public Portfolios
CREATE TABLE IF NOT EXISTS crs_public_portfolios (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    username VARCHAR(64) NOT NULL UNIQUE,
    headline VARCHAR(255),
    bio TEXT,
    case_studies_json TEXT,
    mentor_endorsement TEXT,
    is_available_for_hire BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_portfolios_tenant ON crs_public_portfolios(tenant_id);

-- 10. Quizzes (AI Generated or Manual)
CREATE TABLE IF NOT EXISTS crs_quizzes (
    id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL REFERENCES crs_journey_modules(id) ON DELETE CASCADE,
    title VARCHAR(255),
    generated_by_ai BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_quizzes_module ON crs_quizzes(module_id);

-- 11. Quiz Questions
CREATE TABLE IF NOT EXISTS crs_quiz_questions (
    id VARCHAR(64) PRIMARY KEY,
    quiz_id VARCHAR(64) NOT NULL REFERENCES crs_quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options_json JSONB NOT NULL,
    correct_index INTEGER NOT NULL,
    explanation TEXT,
    bloom_level VARCHAR(64),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON crs_quiz_questions(quiz_id);

-- 12. AI Jobs
CREATE TABLE IF NOT EXISTS crs_ai_jobs (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    job_type VARCHAR(64) NOT NULL, -- e.g., 'quiz_gen', 'rubric_gen'
    input_ref VARCHAR(255),
    output_ref VARCHAR(255),
    status VARCHAR(32) DEFAULT 'PENDING',
    result_json JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_tenant ON crs_ai_jobs(tenant_id);

-- 13. Mentor Profiles
CREATE TABLE IF NOT EXISTS crs_mentor_profiles (
    user_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(512),
    specialization VARCHAR(255),
    total_reviews INTEGER DEFAULT 0,
    pending_reviews INTEGER DEFAULT 0,
    avg_rating FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_tenant ON crs_mentor_profiles(tenant_id);

-- =====================================================================
-- CoursesPRO Microservice Schema
-- Microservice: service_coursespro
-- =====================================================================

-- 1. Cohorts
CREATE TABLE IF NOT EXISTS crs_cohorts (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    slug VARCHAR(128) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    duration_weeks INT DEFAULT 12,
    start_date DATETIME(3),
    end_date DATETIME(3),
    capacity INT DEFAULT 50,
    enrolled_count INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'NGN',
    lead_mentor_id VARCHAR(64),
    status VARCHAR(32) DEFAULT 'ENROLLING',
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_cohorts_tenant (tenant_id),
    INDEX idx_cohorts_mentor (lead_mentor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Enrollments
CREATE TABLE IF NOT EXISTS crs_enrollments (
    id VARCHAR(64) PRIMARY KEY,
    cohort_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    plan_type VARCHAR(32) DEFAULT 'STANDARD',
    payment_status VARCHAR(32) DEFAULT 'PAID',
    current_stage_number INT DEFAULT 1,
    current_xp INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_active_date DATETIME(3),
    status VARCHAR(32) DEFAULT 'ACTIVE',
    enrolled_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_enrollments_cohort (cohort_id),
    INDEX idx_enrollments_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Journey Stages
CREATE TABLE IF NOT EXISTS crs_journey_stages (
    id VARCHAR(64) PRIMARY KEY,
    cohort_id VARCHAR(64),
    stage_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    order_index INT DEFAULT 0,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_stages_cohort (cohort_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Journey Modules
CREATE TABLE IF NOT EXISTS crs_journey_modules (
    id VARCHAR(64) PRIMARY KEY,
    stage_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration_text VARCHAR(64) DEFAULT '45 mins',
    description TEXT,
    readings_count INT DEFAULT 3,
    has_quiz BOOLEAN DEFAULT TRUE,
    has_challenge BOOLEAN DEFAULT TRUE,
    video_url VARCHAR(512),
    content_markdown LONGTEXT,
    ai_summary TEXT,
    reflection_prompts TEXT,
    order_index INT DEFAULT 0,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_modules_stage (stage_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Module Progress
CREATE TABLE IF NOT EXISTS crs_module_progress (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    module_id VARCHAR(64) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    reflection_answer TEXT,
    quiz_score INT DEFAULT 0,
    quiz_passed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_progress_user (user_id),
    INDEX idx_progress_module (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Project Submissions
CREATE TABLE IF NOT EXISTS crs_project_submissions (
    id VARCHAR(64) PRIMARY KEY,
    cohort_id VARCHAR(64) NOT NULL,
    stage_number INT NOT NULL,
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
    submitted_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    reviewed_at DATETIME(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_submissions_cohort (cohort_id),
    INDEX idx_submissions_user (user_id),
    INDEX idx_submissions_mentor (mentor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Peer Pairings
CREATE TABLE IF NOT EXISTS crs_peer_pairings (
    id VARCHAR(64) PRIMARY KEY,
    cohort_id VARCHAR(64) NOT NULL,
    student_a_id VARCHAR(64) NOT NULL,
    student_b_id VARCHAR(64) NOT NULL,
    sprint_number INT DEFAULT 1,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    shared_notes TEXT,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_pairings_cohort (cohort_id),
    INDEX idx_pairings_sa (student_a_id),
    INDEX idx_pairings_sb (student_b_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Presence Sessions
CREATE TABLE IF NOT EXISTS crs_presence_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    room_name VARCHAR(128) DEFAULT 'Sprint Room Alpha',
    activity VARCHAR(64) DEFAULT 'Coding',
    is_active BOOLEAN DEFAULT TRUE,
    last_heartbeat DATETIME(3),
    INDEX idx_presence_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Public Portfolios
CREATE TABLE IF NOT EXISTS crs_public_portfolios (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    username VARCHAR(64) NOT NULL UNIQUE,
    headline VARCHAR(255),
    bio TEXT,
    case_studies_json LONGTEXT,
    mentor_endorsement TEXT,
    is_available_for_hire BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_portfolios_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

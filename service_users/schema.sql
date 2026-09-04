-- =====================================================================
-- ResultsPRO Suite: Unified Users, Identity, Academics & Subscriptions Schema
-- Microservice: service_users
-- =====================================================================

-- 1. Identity: Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(191) PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash TEXT,
    google_id VARCHAR(191) UNIQUE,
    microsoft_id VARCHAR(191) UNIQUE,
    auth_provider VARCHAR(191) NOT NULL DEFAULT 'local', -- local, google, microsoft, mixed
    full_name VARCHAR(191),
    avatar_url TEXT,
    phone VARCHAR(191),
    sex VARCHAR(191),
    date_of_birth DATETIME(3),
    address TEXT,
    account_status VARCHAR(191) DEFAULT 'unverified', -- unverified, active, suspended, deactivated
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret TEXT,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_user_email (email),
    INDEX idx_user_status (account_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Identity: Verification Tokens (OTPs & Password Resets)
CREATE TABLE IF NOT EXISTS verification_tokens (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    token_hash VARCHAR(191) NOT NULL,
    type VARCHAR(191) NOT NULL, -- email_verify, password_reset
    expires_at DATETIME(3) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_verif_token_hash (token_hash),
    CONSTRAINT fk_verif_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Security: Applications (Server-to-Server App Registry)
CREATE TABLE IF NOT EXISTS apps (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    secret_key VARCHAR(191) NOT NULL,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Identity: Refresh Tokens (Session Management)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    token_hash VARCHAR(191) NOT NULL,
    device_info TEXT,
    expires_at DATETIME(3) NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_refresh_token_hash (token_hash),
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Academics: Curriculums
CREATE TABLE IF NOT EXISTS curriculums (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    country VARCHAR(191) DEFAULT 'Nigeria',
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Institutions: Tenants / Organizations
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(191) PRIMARY KEY,
    type VARCHAR(191) DEFAULT 'SCHOOL', -- SCHOOL, FAMILY, CORPORATE
    name VARCHAR(191) UNIQUE NOT NULL,
    slug VARCHAR(191) UNIQUE NOT NULL,
    default_subdomain VARCHAR(191) UNIQUE NOT NULL,
    custom_domain VARCHAR(191) UNIQUE,
    tenant_code VARCHAR(191) UNIQUE,
    short_name VARCHAR(191),
    motto TEXT,
    logo_url TEXT,
    logo_emoji VARCHAR(191),
    primary_color VARCHAR(191),
    secondary_color VARCHAR(191),
    accent_color VARCHAR(191),
    contact_email VARCHAR(191),
    contact_phone VARCHAR(191),
    contact_person_name VARCHAR(191),
    full_address TEXT,
    state VARCHAR(191),
    lga VARCHAR(191),
    status VARCHAR(191) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED
    verification_status VARCHAR(191) DEFAULT 'PENDING_VERIFICATION', -- PENDING_VERIFICATION, VERIFIED, REJECTED
    referred_by_agent_id VARCHAR(191), -- user_id of referring agent
    subscription_tier VARCHAR(191) DEFAULT 'FREE', -- FREE, BASIC, PRO, ENTERPRISE
    subscription_expires_at DATETIME(3),
    enabled_modules TEXT, -- JSON array
    settings TEXT, -- JSON layout & theme config for TenantHub white-labeling
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_tenant_slug (slug),
    INDEX idx_tenant_domain (default_subdomain),
    INDEX idx_tenant_custom_domain (custom_domain),
    INDEX idx_tenant_verification (verification_status),
    INDEX idx_tenant_agent (referred_by_agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Subscriptions: Personal Subscriptions (Family & Agent)
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    type VARCHAR(191) NOT NULL, -- FAMILY, AGENT
    tier VARCHAR(191) DEFAULT 'BASIC', -- BASIC, PRO, PREMIUM
    status VARCHAR(191) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED
    expires_at DATETIME(3),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY user_sub_unique (user_id, type),
    CONSTRAINT fk_user_sub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Institutional Relationships: User Tenant Roles
CREATE TABLE IF NOT EXISTS user_tenant_roles (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    tenant_id VARCHAR(191) NOT NULL,
    role VARCHAR(191) NOT NULL, -- student, teacher, parent, tenant-admin, super-admin, agent, platform-admin
    status VARCHAR(191) DEFAULT 'active', -- active, suspended, graduated, transferred
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY user_tenant_role_unique (user_id, tenant_id, role),
    INDEX idx_role_tenant (tenant_id, role),
    CONSTRAINT fk_usr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_usr_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Academics: Academic Sessions
CREATE TABLE IF NOT EXISTS academic_sessions (
    id VARCHAR(191) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL, -- e.g. "2025/2026"
    start_date DATETIME(3),
    end_date DATETIME(3),
    is_current BOOLEAN DEFAULT FALSE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_session_tenant (tenant_id, is_current),
    CONSTRAINT fk_acad_session_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Academics: Terms
CREATE TABLE IF NOT EXISTS terms (
    id VARCHAR(191) PRIMARY KEY,
    session_id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL, -- e.g. "First Term", "Second Term", "Third Term"
    is_current BOOLEAN DEFAULT FALSE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_term_session (session_id, is_current),
    CONSTRAINT fk_term_session FOREIGN KEY (session_id) REFERENCES academic_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Academics: Classes
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(191) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    curriculum_id VARCHAR(191),
    name VARCHAR(191) NOT NULL, -- e.g. "Grade 10", "SS1", "JSS1"
    level INT DEFAULT 1,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_class_tenant (tenant_id, level),
    CONSTRAINT fk_class_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_class_curriculum FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Academics: Sections / Arms
CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(191) PRIMARY KEY,
    class_id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL, -- e.g. "10A", "Gold", "Diamond"
    room_number VARCHAR(191),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_section_class (class_id),
    CONSTRAINT fk_section_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Academics: Subjects
CREATE TABLE IF NOT EXISTS usr_subjects (
    id VARCHAR(191) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL, -- e.g. "Mathematics"
    code VARCHAR(191), -- e.g. "MTH101"
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_subject_tenant (tenant_id),
    CONSTRAINT fk_subject_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Academics: Syllabus Weeks
CREATE TABLE IF NOT EXISTS syllabus_weeks (
    id VARCHAR(191) PRIMARY KEY,
    subject_id VARCHAR(191) NOT NULL,
    week_number INT NOT NULL,
    term INT DEFAULT 1,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_syllabus_subject (subject_id, term, week_number),
    CONSTRAINT fk_syllabus_week_subject FOREIGN KEY (subject_id) REFERENCES usr_subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Academics: Syllabus Topics
CREATE TABLE IF NOT EXISTS usr_topics (
    id VARCHAR(191) PRIMARY KEY,
    syllabus_week_id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL,
    description TEXT,
    `order` INT DEFAULT 0,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_topic_syllabus_week FOREIGN KEY (syllabus_week_id) REFERENCES syllabus_weeks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Academics: Exam Bodies & National Exams
CREATE TABLE IF NOT EXISTS exam_bodies (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS national_exams (
    id VARCHAR(191) PRIMARY KEY,
    exam_body_id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL,
    CONSTRAINT fk_national_exam_body FOREIGN KEY (exam_body_id) REFERENCES exam_bodies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS areas_of_concentration (
    id VARCHAR(191) PRIMARY KEY,
    national_exam_id VARCHAR(191) NOT NULL,
    subject_name VARCHAR(191) NOT NULL,
    syllabus_data TEXT, -- JSON topic outlines
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_aoc_national_exam FOREIGN KEY (national_exam_id) REFERENCES national_exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Academics: Teaching Assignments
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(191) PRIMARY KEY,
    section_id VARCHAR(191) NOT NULL,
    subject_id VARCHAR(191) NOT NULL,
    teacher_id VARCHAR(191) NOT NULL,
    term_id VARCHAR(191) NOT NULL,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_assignment_teacher (teacher_id),
    INDEX idx_assignment_section (section_id),
    CONSTRAINT fk_assignment_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_subject FOREIGN KEY (subject_id) REFERENCES usr_subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_term FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Academics: Student Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(191) PRIMARY KEY,
    student_id VARCHAR(191) NOT NULL,
    section_id VARCHAR(191) NOT NULL,
    session_id VARCHAR(191) NOT NULL,
    status VARCHAR(191) DEFAULT 'active', -- active, transferred, graduated, suspended
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_enrollment_student (student_id),
    INDEX idx_enrollment_section (section_id),
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_session FOREIGN KEY (session_id) REFERENCES academic_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Family Relationships (Parent - Student)
CREATE TABLE IF NOT EXISTS family_relationships (
    id VARCHAR(191) PRIMARY KEY,
    parent_user_id VARCHAR(191) NOT NULL,
    child_user_id VARCHAR(191) NOT NULL,
    relationship_type VARCHAR(191) DEFAULT 'guardian', -- father, mother, guardian, sponsor
    is_emergency_contact BOOLEAN DEFAULT FALSE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY family_rel_unique (parent_user_id, child_user_id),
    INDEX idx_family_parent (parent_user_id),
    INDEX idx_family_child (child_user_id),
    CONSTRAINT fk_fam_parent FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fam_child FOREIGN KEY (child_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Learning Ecosystem: Resource Links
CREATE TABLE IF NOT EXISTS resource_links (
    id VARCHAR(191) PRIMARY KEY,
    topic_id VARCHAR(191) NOT NULL,
    app_id VARCHAR(191) NOT NULL, -- ClassroomPRO, ExamsPRO, TutorsPRO
    resource_type VARCHAR(191) NOT NULL, -- flashcard, note, quiz, video
    external_id VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    url TEXT,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_resource_topic (topic_id),
    CONSTRAINT fk_resource_topic FOREIGN KEY (topic_id) REFERENCES usr_topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Learning Ecosystem: Student Progress
CREATE TABLE IF NOT EXISTS student_progress (
    id VARCHAR(191) PRIMARY KEY,
    student_id VARCHAR(191) NOT NULL,
    topic_id VARCHAR(191) NOT NULL,
    status VARCHAR(191) DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED
    score FLOAT DEFAULT 0.0,
    completed_at DATETIME(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY student_topic_unique (student_id, topic_id),
    INDEX idx_student_prog (student_id),
    CONSTRAINT fk_prog_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_prog_topic FOREIGN KEY (topic_id) REFERENCES usr_topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Analytics: Engagement Metrics
CREATE TABLE IF NOT EXISTS engagement_metrics (
    id VARCHAR(191) PRIMARY KEY,
    student_id VARCHAR(191) NOT NULL,
    tenant_id VARCHAR(191) NOT NULL,
    type VARCHAR(191) NOT NULL, -- login, study_time, quiz_attempt
    value FLOAT NOT NULL,
    metadata TEXT,
    date DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_engagement_student (student_id, tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. Agent Network: Commissions & Earnings
CREATE TABLE IF NOT EXISTS agent_commissions (
    agent_id VARCHAR(191) PRIMARY KEY,
    default_rate FLOAT DEFAULT 10.0, -- Percentage (e.g. 10.0%)
    bank_name VARCHAR(191),
    account_number VARCHAR(191),
    account_name VARCHAR(191),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_agent_comm_user FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS agent_earnings (
    id VARCHAR(191) PRIMARY KEY,
    agent_id VARCHAR(191) NOT NULL,
    tenant_id VARCHAR(191) NOT NULL,
    amount FLOAT NOT NULL,
    source_type VARCHAR(191) NOT NULL, -- SCRATCH_CARD, TUITION, SUBSCRIPTION
    source_id VARCHAR(191),
    status VARCHAR(191) DEFAULT 'EARNED', -- EARNED, PAID
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_agent_earning_agent (agent_id),
    CONSTRAINT fk_earning_agent FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_earning_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payout_requests (
    id VARCHAR(191) PRIMARY KEY,
    agent_id VARCHAR(191) NOT NULL,
    amount FLOAT NOT NULL,
    status VARCHAR(191) DEFAULT 'PENDING', -- PENDING, APPROVED, PAID, REJECTED
    processed_at DATETIME(3),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_payout_agent (agent_id),
    CONSTRAINT fk_payout_agent FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. Billing & Subscription Plans
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(191) NOT NULL, -- Free, Pro, Enterprise
    monthly_price FLOAT DEFAULT 0.0,
    annual_price FLOAT DEFAULT 0.0,
    currency VARCHAR(10) DEFAULT 'NGN',
    max_students INT DEFAULT 100,
    max_teachers INT DEFAULT 15,
    max_results_per_term INT DEFAULT 100,
    storage_gb INT DEFAULT 2,
    features TEXT, -- JSON array
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 25. Billing Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(191) PRIMARY KEY,
    tenant_id VARCHAR(191) NOT NULL,
    plan_id VARCHAR(191) NOT NULL,
    plan_name VARCHAR(191) NOT NULL,
    invoice_number VARCHAR(191) UNIQUE NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    status VARCHAR(191) DEFAULT 'PENDING', -- PENDING, PAID, FAILED, CANCELLED
    billing_cycle VARCHAR(191) DEFAULT 'TERMLY', -- MONTHLY, TERMLY, ANNUAL
    due_date DATETIME(3) NOT NULL,
    paid_at DATETIME(3),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_invoice_tenant (tenant_id),
    CONSTRAINT fk_invoice_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 26. Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(191) PRIMARY KEY,
    invoice_id VARCHAR(191) NOT NULL,
    tenant_id VARCHAR(191) NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    payment_method VARCHAR(191) NOT NULL, -- PAYSTACK, STRIPE, FLUTTERWAVE, BANK_TRANSFER
    reference VARCHAR(191) UNIQUE NOT NULL,
    status VARCHAR(191) DEFAULT 'PENDING', -- PENDING, SUCCESSFUL, FAILED
    paid_at DATETIME(3),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_payment_invoice (invoice_id),
    CONSTRAINT fk_pay_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 27. Agent Dashboard Additions (Schema Updates)
-- Add Monthly Target to Agent Commissions (For the 'Target Progress' widget)
ALTER TABLE agent_commissions 
ADD COLUMN monthly_target FLOAT DEFAULT 1000000.00;

-- Create Agent Activities Table (For the 'Recent Activity' widget)
CREATE TABLE IF NOT EXISTS agent_activities (
    id VARCHAR(191) PRIMARY KEY,
    agent_id VARCHAR(191) NOT NULL,
    activity_type VARCHAR(191) NOT NULL, -- BOUNTY_CREDITED, LEAD_ADDED, PIN_PURCHASED
    title VARCHAR(191) NOT NULL,
    description TEXT,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_agent_activity (agent_id),
    CONSTRAINT fk_agent_act_user FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Agent Reminders Table (For the 'Reminders' widget)
CREATE TABLE IF NOT EXISTS agent_reminders (
    id VARCHAR(191) PRIMARY KEY,
    agent_id VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    time_window VARCHAR(191), -- e.g. "02.00 pm - 04.00 pm"
    is_completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_agent_rem_user FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- ClassroomPRO Microservice Schema
-- Microservice: service_classroompro
-- =====================================================================

-- 1. Study Notes
CREATE TABLE IF NOT EXISTS cls_notes (
    id VARCHAR(191) PRIMARY KEY,
    school_id VARCHAR(191),
    subject_id VARCHAR(191) NOT NULL,
    topic_id VARCHAR(191),
    teacher_id VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_notes_school (school_id),
    INDEX idx_notes_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Quizzes
CREATE TABLE IF NOT EXISTS cls_quizzes (
    id VARCHAR(191) PRIMARY KEY,
    school_id VARCHAR(191),
    subject_id VARCHAR(191) NOT NULL,
    topic_id VARCHAR(191),
    teacher_id VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions TEXT NOT NULL, -- JSON array of questions
    duration_min INT DEFAULT 0,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_quizzes_school (school_id),
    INDEX idx_quizzes_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Quiz Attempts
CREATE TABLE IF NOT EXISTS cls_quiz_attempts (
    id VARCHAR(191) PRIMARY KEY,
    quiz_id VARCHAR(191) NOT NULL,
    student_id VARCHAR(191) NOT NULL,
    score FLOAT DEFAULT 0,
    max_score FLOAT DEFAULT 0,
    answers TEXT NOT NULL, -- JSON responses
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_quiz_attempts_student (student_id),
    INDEX idx_quiz_attempts_quiz (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Flashcards (SRS System)
CREATE TABLE IF NOT EXISTS cls_flashcards (
    id VARCHAR(191) PRIMARY KEY,
    subject_id VARCHAR(191) NOT NULL,
    topic_id VARCHAR(191),
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    hint VARCHAR(255),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_flashcards_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Flashcard Progress (Leitner System Tracking)
CREATE TABLE IF NOT EXISTS cls_flashcard_progress (
    id VARCHAR(191) PRIMARY KEY,
    student_id VARCHAR(191) NOT NULL,
    card_id VARCHAR(191) NOT NULL,
    box INT DEFAULT 1,
    next_review DATETIME(3),
    ease_factor FLOAT DEFAULT 2.5,
    repetitions INT DEFAULT 0,
    interval_days INT DEFAULT 1,
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY idx_student_card (student_id, card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bookmarks (Saved Notes, Quizzes, Flashcards)
CREATE TABLE IF NOT EXISTS cls_bookmarks (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- NOTE, QUIZ, FLASHCARD
    item_id VARCHAR(191) NOT NULL,
    title VARCHAR(255),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_bookmarks_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Gamification Profiles (Points, Levels, Streaks)
CREATE TABLE IF NOT EXISTS cls_gamification_profiles (
    user_id VARCHAR(191) PRIMARY KEY,
    points INT DEFAULT 0,
    level INT DEFAULT 1,
    streak_days INT DEFAULT 0,
    last_active_at DATETIME(3),
    badges TEXT, -- JSON array of earned badges
    INDEX idx_gamification_points (points)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Study Sessions (Activity Logs for Gamification)
CREATE TABLE IF NOT EXISTS cls_study_sessions (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    subject_id VARCHAR(191),
    duration_seconds INT DEFAULT 0,
    activity VARCHAR(50) NOT NULL, -- FLASHCARDS, NOTES, QUIZ
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_study_sessions_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. Linked YouTube Video Lessons (Strictly Linked YouTube IDs/URLs Only - Zero Raw Video Uploads)
CREATE TABLE IF NOT EXISTS cls_video_lessons (
    id VARCHAR(191) PRIMARY KEY,
    tenant_id VARCHAR(64),
    school_id VARCHAR(191),
    subject_id VARCHAR(191) NOT NULL,
    topic_id VARCHAR(191),
    teacher_id VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    youtube_id VARCHAR(64) NOT NULL,
    youtube_url VARCHAR(512) NOT NULL,
    duration VARCHAR(32),
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. NERDC Curriculum Hierarchy Topics
CREATE TABLE IF NOT EXISTS cls_curriculum_topics (
    id VARCHAR(191) PRIMARY KEY,
    tenant_id VARCHAR(64),
    curriculum VARCHAR(64) NOT NULL DEFAULT 'NERDC',
    education_level VARCHAR(64) NOT NULL,
    class_code VARCHAR(64) NOT NULL,
    subject_id VARCHAR(64) NOT NULL,
    subject_name VARCHAR(191) NOT NULL,
    term VARCHAR(64) NOT NULL,
    week INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    subtopic VARCHAR(255),
    content_id VARCHAR(128) NOT NULL,
    active_version INT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Portable Markdown Lesson Versions & Asset References
CREATE TABLE IF NOT EXISTS cls_lesson_versions (
    id VARCHAR(191) PRIMARY KEY,
    content_id VARCHAR(128) NOT NULL,
    curriculum VARCHAR(64) NOT NULL DEFAULT 'NERDC',
    class_code VARCHAR(64) NOT NULL,
    subject_id VARCHAR(64) NOT NULL,
    term VARCHAR(64) NOT NULL,
    week INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    subtopic VARCHAR(255),
    version INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL DEFAULT 'published',
    markdown_path VARCHAR(512),
    markdown_body TEXT,
    checksum_sha256 VARCHAR(128),
    assets_json TEXT,
    youtube_id VARCHAR(64),
    published_by VARCHAR(191),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Offline Package Manifests
CREATE TABLE IF NOT EXISTS cls_package_manifests (
    package_id VARCHAR(191) PRIMARY KEY,
    curriculum VARCHAR(64) NOT NULL DEFAULT 'NERDC',
    education_level VARCHAR(64) NOT NULL,
    class_code VARCHAR(64) NOT NULL,
    class_label VARCHAR(128) NOT NULL,
    subject_id VARCHAR(64) NOT NULL,
    subject_name VARCHAR(191) NOT NULL,
    term VARCHAR(64) NOT NULL,
    term_label VARCHAR(128) NOT NULL,
    package_version INT NOT NULL DEFAULT 1,
    size_bytes BIGINT DEFAULT 0,
    checksum_sha256 VARCHAR(128),
    manifest_json TEXT NOT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Idempotent Offline Sync Operations Log
CREATE TABLE IF NOT EXISTS cls_offline_sync_ops (
    operation_id VARCHAR(128) PRIMARY KEY,
    tenant_id VARCHAR(64),
    student_id VARCHAR(128) NOT NULL,
    operation_type VARCHAR(64) NOT NULL, -- QUIZ_ATTEMPT, LESSON_PROGRESS, BOOKMARK
    entity_id VARCHAR(128) NOT NULL,
    payload_json TEXT NOT NULL,
    client_timestamp BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'SYNCHRONIZED',
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Student Lesson Progress (Conflict-Resolved Mastery State)
CREATE TABLE IF NOT EXISTS cls_student_lesson_progress (
    id VARCHAR(191) PRIMARY KEY,
    tenant_id VARCHAR(64),
    student_id VARCHAR(128) NOT NULL,
    content_id VARCHAR(128) NOT NULL,
    completion_pct INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_scroll_pos INT DEFAULT 0,
    client_timestamp BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, content_id)
);

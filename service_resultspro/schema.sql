-- =====================================================================
-- ResultsPRO Microservice: Results, Assessments & Scratch Cards Schema
-- Microservice: service_resultspro
-- =====================================================================

-- 1. Results Instances (Academic Sessions / Terms for Results Processing)
CREATE TABLE IF NOT EXISTS res_instances (
    id VARCHAR(191) PRIMARY KEY,
    school_id VARCHAR(191) NOT NULL,
    session_id VARCHAR(191) NOT NULL,
    session_name VARCHAR(191) NOT NULL,
    term_id VARCHAR(191) NOT NULL,
    term_name VARCHAR(191) NOT NULL,
    status VARCHAR(191) DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    exam_config TEXT, -- JSON array of test components (e.g. CAT1, CAT2, Exam)
    total_possible_score FLOAT DEFAULT 100.0,
    published_at DATETIME(3),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_inst_school (school_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Student Results & Score Records
CREATE TABLE IF NOT EXISTS res_student_results (
    id VARCHAR(191) PRIMARY KEY,
    instance_id VARCHAR(191) NOT NULL,
    student_id VARCHAR(191) NOT NULL,
    student_name VARCHAR(191) NOT NULL,
    section_id VARCHAR(191) NOT NULL,
    section_name VARCHAR(191) NOT NULL,
    scores_json TEXT NOT NULL, -- JSON array of SubjectScore objects
    total_score FLOAT DEFAULT 0.0,
    average_score FLOAT DEFAULT 0.0,
    gpa FLOAT DEFAULT 0.0,
    position INT DEFAULT 0,
    total_in_class INT DEFAULT 0,
    principal_comment TEXT,
    teacher_comment TEXT,
    affective_domain TEXT, -- JSON ratings (Punctuality, Neatness, Honesty, etc.)
    psychomotor_domain TEXT, -- JSON ratings (Handwriting, Sports, Games, etc.)
    attendance_days INT DEFAULT 0,
    total_days INT DEFAULT 0,
    status VARCHAR(191) DEFAULT 'PENDING', -- PENDING, APPROVED, PUBLISHED
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY uniq_student_instance (instance_id, student_id),
    INDEX idx_sr_instance (instance_id),
    INDEX idx_sr_student (student_id),
    CONSTRAINT fk_sr_instance FOREIGN KEY (instance_id) REFERENCES res_instances(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Scratch Card Batches
CREATE TABLE IF NOT EXISTS res_scratch_card_batches (
    id VARCHAR(191) PRIMARY KEY,
    school_id VARCHAR(191),
    batch_number VARCHAR(191) UNIQUE NOT NULL,
    total_cards INT NOT NULL,
    used_cards INT DEFAULT 0,
    unit_cost FLOAT DEFAULT 0.0,
    total_cost FLOAT DEFAULT 0.0,
    status VARCHAR(191) DEFAULT 'GENERATED', -- GENERATED, ASSIGNED, COMPLETED
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_batch_school (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Scratch Cards (Crypto Pin Hashes)
CREATE TABLE IF NOT EXISTS res_scratch_cards (
    id VARCHAR(191) PRIMARY KEY,
    batch_id VARCHAR(191) NOT NULL,
    school_id VARCHAR(191),
    serial_number VARCHAR(191) UNIQUE NOT NULL,
    pin_hash VARCHAR(191) NOT NULL,
    usage_count INT DEFAULT 0,
    max_usages INT DEFAULT 5,
    status VARCHAR(191) DEFAULT 'ACTIVE', -- ACTIVE, USED, REVOKED
    expires_at DATETIME(3),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_card_serial (serial_number),
    INDEX idx_card_batch (batch_id),
    CONSTRAINT fk_card_batch FOREIGN KEY (batch_id) REFERENCES res_scratch_card_batches(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Scratch Card Usages & Audit Log
CREATE TABLE IF NOT EXISTS res_scratch_card_usages (
    id VARCHAR(191) PRIMARY KEY,
    card_id VARCHAR(191) NOT NULL,
    student_id VARCHAR(191) NOT NULL,
    result_id VARCHAR(191) NOT NULL,
    accessed_by VARCHAR(191),
    accessed_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_usage_card (card_id),
    INDEX idx_usage_student (student_id),
    CONSTRAINT fk_usage_card FOREIGN KEY (card_id) REFERENCES res_scratch_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_usage_result FOREIGN KEY (result_id) REFERENCES res_student_results(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

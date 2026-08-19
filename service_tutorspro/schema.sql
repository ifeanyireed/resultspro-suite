-- =====================================================================
-- TutorsPRO Microservice Schema
-- Microservice: service_tutorspro
-- =====================================================================

-- 1. Tutor Profiles
CREATE TABLE IF NOT EXISTS tut_profiles (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    headline VARCHAR(255),
    bio TEXT,
    subjects TEXT, -- JSON array of subjects
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'NGN',
    rating FLOAT DEFAULT 5.0,
    total_reviews INT DEFAULT 0,
    total_lessons INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    video_intro_url VARCHAR(255),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY idx_tutor_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Availability Slots
CREATE TABLE IF NOT EXISTS tut_availability_slots (
    id VARCHAR(191) PRIMARY KEY,
    tutor_id VARCHAR(191) NOT NULL,
    day_of_week INT NOT NULL, -- 0=Sunday, 6=Saturday
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_slots_tutor (tutor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bookings
CREATE TABLE IF NOT EXISTS tut_bookings (
    id VARCHAR(191) PRIMARY KEY,
    tutor_id VARCHAR(191) NOT NULL,
    student_id VARCHAR(191) NOT NULL,
    parent_id VARCHAR(191),
    subject VARCHAR(255) NOT NULL,
    scheduled_date DATETIME(3) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    status VARCHAR(50) DEFAULT 'PENDING',
    meeting_url VARCHAR(255),
    notes TEXT,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_bookings_tutor (tutor_id),
    INDEX idx_bookings_student (student_id),
    INDEX idx_bookings_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tutor Reviews
CREATE TABLE IF NOT EXISTS tut_reviews (
    id VARCHAR(191) PRIMARY KEY,
    tutor_id VARCHAR(191) NOT NULL,
    student_id VARCHAR(191) NOT NULL,
    parent_id VARCHAR(191),
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_reviews_tutor (tutor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tutor Payout Requests
CREATE TABLE IF NOT EXISTS tut_payout_requests (
    id VARCHAR(191) PRIMARY KEY,
    tutor_id VARCHAR(191) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    processed_at DATETIME(3),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_payouts_tutor (tutor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

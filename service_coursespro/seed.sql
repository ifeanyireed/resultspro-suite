-- Seed Data for BuilderOS Phase 1 (Authoring & Schema)

-- 1. Create a dummy Tenant ID (or use a known one if available, using 'tenant_seed_1' for now)
-- 2. Insert Program
INSERT INTO crs_programs (id, tenant_id, title, description, duration_weeks, base_price, created_at, updated_at) 
VALUES (
    'prog_fullstack_mastery_001', 
    'tenant_seed_1', 
    'Fullstack Mastery', 
    'A comprehensive journey from zero to fullstack engineering.', 
    12, 
    0, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- 3. Insert Journey Stages
INSERT INTO crs_journey_stages (id, program_id, stage_number, title, subtitle, description, order_index, created_at) VALUES 
('stage_001', 'prog_fullstack_mastery_001', 1, 'Foundational Knowledge', 'The building blocks of the web', 'Learn HTML, CSS, and basic JavaScript to build static sites.', 1, CURRENT_TIMESTAMP),
('stage_002', 'prog_fullstack_mastery_001', 2, 'Practical Application', 'React & State Management', 'Master component-driven architecture using React and Tailwind.', 2, CURRENT_TIMESTAMP),
('stage_003', 'prog_fullstack_mastery_001', 3, 'Backend Integration', 'APIs & Databases', 'Connect your frontend to a Go/Node backend and Postgres database.', 3, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 4. Insert Journey Modules
INSERT INTO crs_journey_modules (id, stage_id, title, duration_text, description, readings_count, has_quiz, has_challenge, video_url, content_markdown, order_index, created_at) VALUES 
-- Stage 1 Modules
('mod_001', 'stage_001', 'Semantic HTML5', '45 mins', 'Structuring the web', 2, true, false, NULL, '# Semantic HTML\n\nLearn to use `<article>`, `<section>`, and `<nav>` properly.', 1, CURRENT_TIMESTAMP),
('mod_002', 'stage_001', 'Modern CSS Layouts', '60 mins', 'Flexbox & Grid', 3, true, true, NULL, '# Flexbox\n\n`display: flex;` changes everything.', 2, CURRENT_TIMESTAMP),

-- Stage 2 Modules
('mod_003', 'stage_002', 'Thinking in React', '90 mins', 'Components and Props', 4, true, true, NULL, '# React Basics\n\nEverything is a component.', 1, CURRENT_TIMESTAMP),
('mod_004', 'stage_002', 'State & Effects', '90 mins', 'useState and useEffect', 3, true, true, NULL, '# Hooks\n\nManage local state safely.', 2, CURRENT_TIMESTAMP),

-- Stage 3 Modules
('mod_005', 'stage_003', 'RESTful Design', '45 mins', 'Designing APIs', 2, true, false, NULL, '# REST\n\nGET, POST, PUT, DELETE.', 1, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 5. Insert Quiz for Module 1
INSERT INTO crs_quizzes (id, module_id, title, generated_by_ai, created_at, updated_at) VALUES 
('quiz_001', 'mod_001', 'HTML5 Knowledge Check', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 6. Insert Quiz Questions
INSERT INTO crs_quiz_questions (id, quiz_id, question, options_json, correct_index, explanation, bloom_level, order_index, created_at) VALUES 
('qq_001', 'quiz_001', 'Which tag is used for the main navigation block?', '["<nav>", "<header>", "<main>", "<menu>"]', 0, 'The <nav> element represents a section of a page whose purpose is to provide navigation links.', 'Knowledge', 1, CURRENT_TIMESTAMP),
('qq_002', 'quiz_001', 'Is <section> a generic container?', '["Yes, just like a <div>", "No, it represents a thematic grouping of content", "Only for headers", "Only for footers"]', 1, 'Unlike a <div>, a <section> implies the content inside is thematically related.', 'Comprehension', 2, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

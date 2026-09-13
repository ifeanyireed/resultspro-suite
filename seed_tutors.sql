INSERT INTO users (id, email, password_hash, auth_provider, name, full_name, account_status, avatar_url, role, created_at, updated_at)
VALUES 
  ('f7c75b8e-5b12-4f3b-a50d-45db379fcbb1', 'tutor1@example.com', '$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i', 'local', 'Dr. Sarah Johnson', 'Dr. Sarah Johnson', 'active', 'https://i.pravatar.cc/150?u=sarah', 'TUTOR', NOW(), NOW()),
  ('a6b32b9c-2b6d-4f7f-b88a-23ef6f7f6a91', 'tutor2@example.com', '$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i', 'local', 'Prof. Michael Adebayo', 'Prof. Michael Adebayo', 'active', 'https://i.pravatar.cc/150?u=michael', 'TUTOR', NOW(), NOW()),
  ('9c5f8e7d-3d4a-4d2c-8a9d-5b8b8a8b8c8d', 'tutor3@example.com', '$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i', 'local', 'Engr. Fatima Bello', 'Engr. Fatima Bello', 'active', 'https://i.pravatar.cc/150?u=fatima', 'TUTOR', NOW(), NOW()),
  ('8b4d7c6e-2c3b-4c1d-9b8e-4a7a7b7c7d7e', 'tutor4@example.com', '$2a$14$1zhGRoc.lxuxyO/9X27HpuUTq06m5p2pb69PgYa0UWksEJWT7kS8i', 'local', 'Mr. John Smith', 'Mr. John Smith', 'active', 'https://i.pravatar.cc/150?u=john', 'TUTOR', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO tut_profiles (id, user_id, headline, bio, subjects, hourly_rate, currency, rating, total_reviews, is_verified, is_available, created_at, updated_at)
VALUES 
  ('tut-1', 'f7c75b8e-5b12-4f3b-a50d-45db379fcbb1', 'PhD in Mathematics', 'Passionate about making math easy and fun for everyone. 10+ years of experience.', '["Mathematics", "Further Math", "Physics"]', 15000, 'NGN', 4.9, 124, true, true, NOW(), NOW()),
  ('tut-2', 'a6b32b9c-2b6d-4f7f-b88a-23ef6f7f6a91', 'Senior Science Educator', 'Expert in Chemistry and Biology. Helping students ace WAEC and JAMB since 2010.', '["Chemistry", "Biology"]', 12000, 'NGN', 4.8, 89, true, true, NOW(), NOW()),
  ('tut-3', '9c5f8e7d-3d4a-4d2c-8a9d-5b8b8a8b8c8d', 'Software Engineer & Coding Instructor', 'I teach Python, JavaScript, and Computer Science fundamentals for beginners and advanced students.', '["Computer Science", "Coding", "Physics"]', 20000, 'NGN', 5.0, 210, true, true, NOW(), NOW()),
  ('tut-4', '8b4d7c6e-2c3b-4c1d-9b8e-4a7a7b7c7d7e', 'English & Literature Expert', 'Improve your essay writing, reading comprehension, and grammar with personalized lessons.', '["English Language", "Literature in English"]', 10000, 'NGN', 4.7, 56, true, true, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

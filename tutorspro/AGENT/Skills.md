# TutorsPRO Backend Development Skills

This document serves as the core knowledge base for developing and restructuring the TutorsPRO backend, based on the proven architecture of ClassroomPRO.

## 1. Architectural Principles

### Centralized Identity & Distributed Authorization
- **Source of Identity:** `auth.resultspro.ng` is the master for `email`, `full_name`, `avatar_url`, and `account_status`.
- **Local Authorization:** TutorsPRO is the master for its own roles (`SUPERADMIN`, `PLATFORM_ADMIN`, `SCHOOL_ADMIN`, `TUTOR`, `PARENT`, `STUDENT`) and platform-specific affiliations (School/Class/Tutor-Student links).
- **Dual Update Pattern:** Profile updates must be proxied to Central Auth first. Success there triggers a local database mirror update.

### Data Modeling (Prisma + Go)
- **Generator:** Use `steebchen/prisma-client-go`.
- **Datasource:** SQLite for local development/MVP, Migratable to PostgreSQL.
- **Snake Case Mandate:** All JSON keys in API payloads and database-mirrored identity fields MUST use `snake_case`.

## 2. Core User Roles & Permissions

| Role | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | Infrastructure | Global system health, feature flags, audit logs, master permissions. |
| **Platform Admin** | Operations | User management, tutor verification, payment ops, dispute resolution. |
| **School Admin** | Multi-tenant | Managing school-specific teachers, students, branding, and subscriptions. |
| **Tutor** | Teaching | Creating lessons, quizzes, flashcards; managing calendar and earnings. |
| **Student** | Learning | Accessing assigned content, taking quizzes, tracking progress, gamification (XP). |
| **Parent** | Monitoring | Linking to children, viewing progress reports, managing billing. |

## 3. Content Visibility Model

1. **Public:** SEO-indexed landing pages, tutor directory, blog posts, sample notes.
2. **Authenticated:** Standard dashboard access, messages, personal settings.
3. **Restricted (School/Tutor):** Content assigned specifically to a class or a student-tutor pair.

## 4. API & Security Standards

### JWT Middleware
- Stateless authentication.
- Payload contains `id` and `role`.
- `RequireRole(roles ...string)` middleware for route protection.

### External Service Integration
- **Headers:** `X-App-ID` and `X-App-Secret` for service-to-service calls.
- **Avatar Management:** AWS S3 for storage. Publicly readable via Bucket Policy, not ACLs.

### Pagination Pattern
- State: `currentPage`, `itemsPerPage`.
- Logic: `useMemo` for slicing, dynamic footer with smart ellipsis.

## 5. Implementation Patterns

### User Profile Merge
When fetching user data, merge local database fields (`role`, `school_id`) with Central Auth identity fields (`full_name`, `avatar_url`) before returning to the frontend.

### MFA (TOTP)
- Central Auth provides `otpauth://` URI.
- Frontend generates QR code or uses `api.qrserver.com`.
- Intercept login if `mfa_required: true`.

# TutorsPRO Backend Implementation Requirements

Each step in the `AGENT/Steps.md` must pass these verification checks before proceeding.

## Step 1-2: Setup Verification
- [ ] `backend/go.mod` exists and contains correct module name.
- [ ] `backend/prisma/schema.prisma` is initialized and configured with `datasource` and `generator`.

## Step 3-5: Schema & Client Verification
- [ ] `schema.prisma` contains `User` model with `id` (string), `role` (enum/string), and relations to `School`/`Class`.
- [ ] `go run github.com/steebchen/prisma-client-go generate` completes without errors.
- [ ] `backend/prisma/dev.db` exists and reflects the current schema (use `sqlite3` or Prisma Studio to verify).

## Step 6-7: Core Logic Verification
- [ ] `FetchUserProfile` successfully retrieves identity data from `auth.resultspro.ng` using a test ID.
- [ ] `RequireRole("SUPERADMIN")` middleware returns `403 Forbidden` for a user with `STUDENT` role.
- [ ] JWT tokens are correctly decoded and their payloads are accessible in the request context.

## Step 8-10: Handler Verification
- [ ] `GET /api/auth/me` returns a merged object containing BOTH local role data and central identity data (full name, avatar).
- [ ] `POST /api/tutor/notes` saves a note to the database and associates it with the correct `tutorId`.
- [ ] `GET /api/student/dashboard` returns a list of assigned notes/quizzes for the authenticated student.

## Step 12: Granular Integration Verification
- [ ] Every route listed in `slugs.md` has been visited.
- [ ] **Element Audit:** Every single hardcoded array, object, string, or boolean on the page has been identified and replaced with a dynamic fetch from the database (via Prisma/Go).
- [ ] Hardcoded mock data in `frontend/src/app` has been completely removed from the file.
- [ ] Role-based access (RBAC) is enforced both at the API level (403 check) and UI level (RoleGate).
- [ ] Database state in `dev.db` accurately populates the corresponding UI components.

## Step 13-14: System Audit
- [ ] Backend compiles successfully with `go build`.
- [ ] No hardcoded arrays or objects remain in dashboard views (all data is sourced from Go/Prisma/SQLite).


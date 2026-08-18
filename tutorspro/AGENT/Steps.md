# TutorsPRO Backend Restructuring Steps

Follow these steps sequentially to build and restructure the Go backend for the TutorsPRO platform.

## Phase 1: Environment & Project Setup
1. **Go Workspace Initialization:**
   - Navigate to `backend/`.
   - Initialize Go modules if not done (`go mod init tutorspro/backend`).
2. **Prisma Setup:**
   - Install Prisma CLI: `npm install prisma --save-dev`.
   - Initialize Prisma: `npx prisma init`.
   - Configure `schema.prisma` to use `sqlite` (or `postgresql` if production-ready).
   - Add `generator db { provider = "go run github.com/steebchen/prisma-client-go" }`.

## Phase 2: Schema Definition & DB Generation
3. **Draft Core Models:**
   - Define `User`, `School`, `Class`, `Subject`, `Note`, `Quiz`, `Flashcard`.
   - Ensure the `User` model matches the Central Auth `id` and includes local `role`.
4. **Generate Client:**
   - Run `go run github.com/steebchen/prisma-client-go generate`.
5. **Database Migration:**
   - Run `npx prisma db push` to sync the schema with the local SQLite database.

## Phase 3: Core Logic & Middleware
6. **Authentication & Identity Integration:**
   - Create `backend/lib/auth/central.go` to handle communication with `auth.resultspro.ng`.
   - Implement `FetchUserProfile` and `FetchUserProfiles` (batch).
7. **RBAC Middleware:**
   - Implement `RequireRole` middleware in `backend/middleware/auth.go`.
   - Ensure it validates JWT and checks local `User` role from DB.

## Phase 4: Domain Handlers Implementation
8. **Auth Handlers:**
   - Implement `/api/auth/login`, `/api/auth/me` (merging local & central data).
9. **Tutor & Content Handlers:**
   - Implement CRUD for `/api/tutor/notes`, `/api/tutor/quizzes`, `/api/tutor/flashcards`.
10. **Student & Progress Handlers:**
    - Implement `/api/student/dashboard`, `/api/student/progress`.

## Phase 5: Granular Frontend Integration (slugs.md Roadmap)
11. **Integration Logic Setup:**
    - Configure Axios/Fetch in `frontend/lib/api.ts` to attach JWT from `useAuthStore`.
    - Implement a global `RoleGate` component to enforce RBAC on the client side.
12. **Iterative Page Replacement:**
    - Use `slugs.md` as a checklist. For every route, perform the following:
        - **Research:** Identify the hardcoded state/mock data in the `page.tsx` or `Client` component.
        - **Backend:** Create the corresponding Prisma query and Go handler if not already present.
        - **Frontend:** Replace `useState` initializers or mock arrays with `useEffect` fetches from the Go API.
    - **Batch 1: Public & Auth (Routes in Public section):** Ensure `/`, `/about`, `/login`, etc., are dynamic.
    - **Batch 2: Student & Parent Dashboards:** Focus on XP, bookings, and child-linking data.
    - **Batch 3: Tutor & School Admin:** Implement complex management views for classes, earnings, and students.
    - **Batch 4: Operations & Infrastructure:** Integrate platform and super-admin analytics/health metrics.

## Phase 6: Verification & Testing
13. **Unit & Integration Testing:**
    - Write tests for RBAC middleware and Auth merging logic.
    - Verify that a `STUDENT` token cannot access `/platform-admin/*` routes.
14. **Final System Audit:**
    - Perform a manual "walkthrough" of every role's dashboard.
    - Confirm all hardcoded mocks in `slugs.md` have been replaced by real fetches from `dev.db`.


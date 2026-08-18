# SchoolHub Backend Restructuring Steps

Follow these steps sequentially to build and restructure the Go backend for the SchoolHub platform.

## Phase 1: Environment & Project Setup
1. **Go Workspace Initialization:**
   - Initialize Go modules in \`backend/\` (\`go mod init schoolhub/backend\`).
2. **Prisma Setup:**
   - Configure \`schema.prisma\` for SQLite multi-tenancy.
   - Define core \`School\` (Tenant) and \`User\` (Lightweight identity) models.

## Phase 2: Schema Definition & DB Generation
3. **Draft Domain Models:**
   - Implement models for \`Admissions\`, \`Finances\`, \`Transport\`, and \`Communications\` (per blueprint).
   - Ensure \`User\` model aligns with Central Auth \`id\`.
4. **Generate Client & Push Schema:**
   - Run Prisma client generation and sync with local \`dev.db\`.

## Phase 3: Identity & Multi-tenant Core
5. **Central Auth Integration:**
   - Implement \`lib/auth/central.go\` for communication with \`auth.schoolhub.ng\`.
6. **Tenant & RBAC Middleware:**
   - Implement middleware to resolve \`school_id\` from headers and enforce \`RequireRole\`.

## Phase 4: Domain Handlers (Control Plane)
7. **Admissions & Lead Handlers:**
   - Implement CRM endpoints: \`/api/admin/admissions/inquiries\`, \`/api/admin/admissions/tours\`.
8. **Student & Parent Dashboard API:**
   - Implement aggregated dashboard endpoints that pull from specialist service APIs.
9. **Admin & Pulse Handlers:**
   - Implement institutional health metrics for \`/api/admin/pulse\`.

## Phase 5: Granular Next.js Integration
10. **Frontend API Client:**
    - Configure Axios in \`src/lib/api.ts\` to handle JWT and tenant headers.
11. **Iterative Route Replacement (slugs.md):**
    - **Batch 1: Public Marketing:** Replace mock content in \`/\`, \`/about\`, \`/admissions\` with dynamic tenant data.
    - **Batch 2: Student & Parent Portals:** Connect dashboards, results, and learning feeds.
    - **Batch 3: Teacher & Admin Dashboards:** Implement management views for classes, fees, and transport.
    - **Batch 4: Principal Pulse:** Finalize leadership analytics and cross-campus reporting.

## Phase 6: Verification & System Audit
12. **RBAC & Security Audit:**
    - Verify role boundaries (e.g., Parent cannot see Principal Pulse).
13. **Final Walkthrough:**
    - Confirm all hardcoded mocks in \`src/app\` have been replaced by real fetches.

## Phase 7: Documentation & API Validation
14. **API Documentation:**
    - Create \`API.md\` in the project root.
    - Document every endpoint, including request/response examples and auth scopes.
15. **End-to-End API Validation:**
    - Perform \`curl\` tests for all documented endpoints using valid/invalid tokens.
    - Empirically confirm RBAC and tenant isolation via CLI.

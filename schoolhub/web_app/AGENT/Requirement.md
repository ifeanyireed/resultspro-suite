# SchoolHub Backend Implementation Requirements

Each step in \`AGENT/Steps.md\` must pass these verification checks before proceeding.

## Step 1-4: Setup & Schema Verification
- [ ] \`backend/go.mod\` exists with module name \`schoolhub/backend\`.
- [ ] \`schema.prisma\` contains a \`School\` model (tenant) and \`User\` model with role-based fields.
- [ ] Prisma client is successfully generated and \`dev.db\` matches the schema.

## Step 5-6: Core Identity & Tenant Verification
- [ ] \`FetchUserProfile\` correctly proxies to \`auth.schoolhub.ng\`.
- [ ] Middleware correctly identifies \`school_id\` from the request (host header or school slug).
- [ ] \`RequireRole("PRINCIPAL")\` returns \`403 Forbidden\` for users with \`TEACHER\` or \`STUDENT\` roles.

## Step 7-9: Handler & Logic Verification
- [ ] \`GET /api/admin/pulse\` returns institutional health metrics (enrollment, performance, etc.).
- [ ] \`POST /api/admissions/inquiry\` successfully saves a lead and associates it with the correct school.
- [ ] \`GET /api/student/dashboard\` returns an aggregated view of assignments, results, and future skills.

## Step 11: Granular Route Verification (slugs.md)
- [ ] **Marketing Audit:** \`/\` and \`/about\` pull their hero content, colors, and logos from the \`School\` model.
- [ ] **Portal Audit:** No hardcoded arrays remain in \`src/app/(portal)\` views.
- [ ] **RBAC Enforcement:** UI components are wrapped in \`RoleGate\` or equivalent, matching API restrictions.

## Step 12-13: System Integrity
- [ ] Backend compiles without errors (\`go build\`).
- [ ] All sensitive identity data is fetched from Central Auth; no emails/names stored in local SQLite.

## Step 14-15: Documentation & Validation
- [ ] \`API.md\` exists and covers 100% of implemented endpoints.
- [ ] Every endpoint has been verified with at least one successful \`curl\` request.
- [ ] 403 Forbidden scenarios for RBAC have been empirically confirmed via \`curl\`.

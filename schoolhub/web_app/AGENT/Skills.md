# SchoolHub Backend Development Skills

This document serves as the core knowledge base for developing and restructuring the SchoolHub backend, based on the proven architecture of ClassroomPRO and the SchoolHub white-label vision.

## 1. Architectural Principles

### White-Label Multi-Tenancy
- **Tenant Resolution:** Identify schools by \`Host\` header or \`school_slug\`.
- **Branding Logic:** Fetch \`brand_profile\` (colors, fonts, logos) dynamically based on the tenant.
- **Service Aggregation:** SchoolHub acts as a control plane, calling specialist APIs (ResultsPRO, ExamsPRO, ScholarsNG) and aggregating data into a unified branded experience.

### Centralized Identity & Distributed Authorization
- **Source of Identity:** \`auth.schoolhub.ng\` is the master for \`email\`, \`full_name\`, \`avatar_url\`, and \`account_status\`.
- **Local Authorization:** SchoolHub manages platform-specific roles and affiliations (e.g., Student-Parent links, Teacher-Class assignments).
- **Dual Update Pattern:** Proxy profile updates to Central Auth first; update local mirrors only on success.

### Data Modeling (Prisma + Go)
- **Generator:** Use \`steebchen/prisma-client-go\`.
- **Datasource:** SQLite for local MVP, migrating to PostgreSQL for production.
- **Snake Case Mandate:** All JSON keys in API payloads MUST use \`snake_case\`.

## 2. Core User Roles & Permissions

| Role | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | Platform | Global health, feature flags, tenant management, billing. |
| **Principal** | School | Pulse dashboard (enrollment, performance, revenue), academic audits. |
| **Admin** | Operations | Fees, transport, library, hostel, procurement, staff management. |
| **Admissions** | CRM | Lead capture, tour booking, application processing, pipeline management. |
| **Teacher** | Learning | Class management, assignment grading, assessment creation. |
| **Student** | Learning | Accessing lessons, homework, exams, results, future skills. |
| **Parent** | Monitoring | Tracking child progress, billing/payments, teacher communication. |

## 3. API & Security Standards

### JWT Middleware
- Stateless authentication with claims for \`id\`, \`role\`, and \`school_id\`.
- \`RequireRole(roles ...string)\` middleware for granular route protection.

### External Service Integration
- Use \`X-App-ID\` and \`X-App-Secret\` for secure service-to-service calls.
- Standardize on AWS S3 for media storage with bucket-policy-based public access.

## 4. Implementation Patterns

### Dashboard Aggregation
Combine data from multiple specialist services (e.g., attendance from ClassroomPRO, results from ResultsPRO) into a single role-specific dashboard response.

### MFA & Security
- Integrate Central Auth's TOTP/MFA flows.
- Intercept login if \`mfa_required: true\`.

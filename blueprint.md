Sure. Let me word that cleanly for an agent. Here it is Instruction for mapping the result pro ecosystem applications and Scholars dot NG relationship for an agent to describe the relationships you've just outlined, covering the six products, their front doors, shared identity and billing, tenancy boundaries, and role based experiences for school admins, teachers, parents and students, across the Result Pro family, not one monolith. So, keep each front door, then define how identity, subscriptions, tenancy, and navigation connect. The goal is clean, modular, and safe, not merged into one thing. Don't change code yet, just map the architecture and the gaps first.

# Agent Instruction: ResultPro Ecosystem & Scholars.ng Application Relationship Mapping

**Objective:** Analyse and document the architectural, functional, tenancy, identity, billing, and user-experience relationships across the ResultPro family of applications.

The goal is to establish a clear architecture for how the applications operate independently while sharing infrastructure, identity, subscriptions, and selected user experiences through **Scholars.ng**.

This is an architecture-mapping exercise. Do not start rewriting applications, modifying databases, or changing existing implementations. First understand what exists, map the relationships, identify gaps, and produce an architectural recommendation.

---

## 1. Overview of the ResultPro Ecosystem

ResultPro is a family of education technology products designed to serve individual educators, students, parents, schools, and educational institutions.

The ecosystem consists of six applications:

| Application | Primary Function | Multi-Tenant |
|---|---|---|
| Tutors Pro | Tutor discovery, booking, teaching and assessment | Yes |
| Results Pro | School results processing and gradebook generation | Yes |
| Classroom Pro | Curriculum-aligned learning resources, tests and quizzes | Yes |
| Puzzle Pro | Interactive coding education for children | Yes |
| Courses Pro | Learning Management System (LMS) for independent educators | No school tenancy requirement |
| Exams Pro | National, international and professional examination preparation | No |

Each application must retain its own dedicated front door.

However, four applications will also be accessible through a shared educational platform called **Scholars.ng**.

---

## 2. Scholars.ng: The Unified Education Platform & Multi-Tenant Shell

Scholars.ng is the evolution of the existing School Hub concept.

It operates as a dual-purpose platform:
1. **ScholarsNG Product Landing & Commercial Gateway (The Apex Front Door)**: The dedicated public marketing page at `scholars.ng` that clearly presents the digital campus operating system, outlines product offers across the specialist sub-apps, and details transparent subscription tiers (Free, Starter, Pro, Enterprise).
2. **Multi-Tenant Shell Project & Tenant Workspaces**: A wildcard-enabled multi-tenant engine (`*.scholars.ng` and custom domains) that automatically routes each school to its own branded tenant workspace, deploying public admissions sites, administrative control centers, and role-based portals with modular entitlement gating.

Its primary purpose is to bring together:

1. Tutors Pro
2. Results Pro
3. Classroom Pro
4. Puzzle Pro

Scholars.ng is not intended to replace these applications.

Instead, it provides a unified environment through which users can access them.

### White-label architecture

Scholars.ng must support independent school environments via wildcard subdomains and custom domains.

For example:

- `laurelacademy.scholars.ng`
- `greenfield.scholars.ng`
- `brightfuture.scholars.ng`
- `portal.greenfieldacademy.com` (Custom Domain)

Each school receives its own environment, branding, configuration, subscriptions and authorised users.

The tenant's subscribed applications determine which modules become available within its Scholars.ng environment.

The same architecture should support family-based environments where appropriate.

### Important distinction

Scholars.ng is both:

- A commercial product with its own landing page and clear pricing.
- A multi-tenant shell project that resolves subdomains/custom domains into isolated tenant workspaces.
- A platform through which individual products can be discovered and accessed.

It must not become a requirement for every user to subscribe to the entire ecosystem.

---

## 3. Independent Application Front Doors

All six applications must remain independently accessible.

The following distinction is important.

### Applications integrated into Scholars.ng

**Tutors Pro**

An online tutoring marketplace and teaching platform.

It should support:
- Tutor registration and profiles.
- Tutor discovery and booking.
- Online and physical tutoring arrangements.
- Structured teaching sessions.
- Curriculum-aligned lesson delivery.
- Simulations and interactive exercises.
- Practice questions and assessments.
- Student performance tracking.
- Parent reporting.
- Tutor performance monitoring.

The objective is to make online tutoring sufficiently structured, measurable and accountable to compete with, and potentially outperform, conventional offline tutoring experiences.

**Results Pro**

A school results management application.

Its primary workflow involves uploading school marksheets containing student, class, subject and assessment information.

The application automatically processes the information and generates gradebooks and results reports.

Within Scholars.ng, school administrators and authorised teachers should access Results Pro according to their permissions.

**Classroom Pro**

A curriculum-aligned learning application.

It should provide:
- National curriculum-aligned content, particularly NERDC.
- Class notes.
- Learning materials.
- Quizzes and tests.
- Curriculum-based assessments.
- Learning resources for students and teachers.

Within Scholars.ng, schools should be able to provide these resources to their teachers and students.

**Puzzle Pro**

An interactive coding education platform for children.

It currently contains approximately 636 coding exercises using puzzles, monkeys and mazes to teach:

- HTML
- CSS
- Python
- JavaScript

It should be accessible independently and through Scholars.ng.

Schools and families should be able to provide children with access based on their subscriptions and permissions.

### Applications operating independently

**Courses Pro**

Courses Pro is an independent Learning Management System.

It is designed for educators who want to:

- Create and organise online courses.
- Manage students.
- Structure learning programmes.
- Accept payments.
- Deliver educational content.

Courses Pro is not primarily designed for school tenancy or institutional school management.

It should remain independently deployable and maintain its own product experience.

**Exams Pro**

Exams Pro provides preparation resources for national, international and professional examinations, including:

- WAEC
- NECO
- JAMB
- IJCEE
- IGCSE
- ICAN

Exams Pro is primarily an individual-user product.

Users register, select the examinations they are preparing for and access examination preparation resources.

Its monetisation model is based on purchasing coins when their existing balance runs out, rather than school or family subscriptions.

It does not require the school/family tenancy architecture used by the other four applications.

---

## 4. Central Identity and Billing Architecture

The ResultPro ecosystem already has a dedicated central microservice responsible for identity and billing.

This service must be treated as an existing foundational component.

Do not introduce another independent identity or billing system without a compelling architectural reason.

The central service is responsible for:

- User identity.
- Authentication.
- Account management.
- Billing.
- Subscription management.
- Product access entitlements.
- Cross-application account relationships.

### Unified identity

A user should maintain the same identity across the ResultPro ecosystem.

For example:

A teacher registers on Tutors Pro.

Later, the teacher decides to use Puzzle Pro to teach coding.

The teacher should not need to create another account.

The same identity should allow access to both applications.

Similarly, a school administrator using Scholars.ng should be able to access all subscribed modules without creating separate accounts for each application.

### Subscription relationships

The billing architecture should support:

- Individual product subscriptions.
- Multiple product subscriptions.
- School subscriptions.
- Family subscriptions.
- Bundled subscriptions.
- Discounts for users subscribing to multiple products.
- Product-specific entitlements.

Exams Pro must retain its coin-based purchase model.

Courses Pro must retain the flexibility required by independent educators and their course monetisation arrangements.

The agent must document how these existing and proposed billing arrangements interact with the central billing service.

---

## 5. Multi-Tenancy Architecture

The ResultPro ecosystem uses a shared PostgreSQL database architecture rather than requiring a separately deployed database for every school.

This is a deliberate architectural decision.

Unlike certain enterprise ERP deployments, the school applications do not currently justify the operational overhead of dedicated database deployments for every tenant.

### Tenant types

The architecture must accommodate:

1. Schools.
2. Families.

Every tenant-scoped record must be associated with the appropriate tenant.

For example:

- School ID.
- Family ID.
- User ID.
- Class ID.
- Student ID.
- Subscription ID.

The exact relationships should be determined from the existing database schema.

### Tenant-aware applications

The following applications must respect the tenancy model when accessed through Scholars.ng:

| Application | Tenant Scope |
|---|---|
| Tutors Pro | School / Family |
| Results Pro | School |
| Classroom Pro | School / Family |
| Puzzle Pro | School / Family |

The agent must investigate whether each application already implements these relationships and identify any missing tenant associations.

### Applications outside this tenancy model

**Exams Pro**

Does not require school/family tenancy.

Its core relationship is:

User → Examination Preparation → Coin Balance → Purchases.

**Courses Pro**

Operates as an independent LMS.

Its core relationship is:

Educator → Courses → Students → Enrolments → Payments.

Do not force either application into the Scholars.ng school/family tenancy model.

---

## 6. Role-Based Experience Within Scholars.ng

Scholars.ng must provide different experiences depending on the user's role.

The principal roles are:

### A. School Owner / Administrator

The administrator should have an overview of the entire institution.

This includes:

- School-wide performance.
- Student performance across classes.
- Teacher performance.
- Class performance.
- Application usage.
- Subscription information.
- Institutional analytics.

For users managing multiple schools, the architecture should support consolidated reporting across their authorised institutions.

### B. Teachers

Teachers should access tools relevant to their assigned classes and responsibilities.

Depending on their permissions and subscriptions, this includes:

- Classroom Pro learning resources.
- Results Pro assessment and grading tools.
- Tutors Pro teaching tools.
- Puzzle Pro coding exercises.

Teachers should be able to assess students, manage learning activities and monitor performance across their assigned classes.

### C. Parents

Parents should primarily have a reporting and monitoring experience.

They should be able to:

- View their children's academic performance.
- Receive assessment reports.
- Track learning progress.
- Receive notifications.
- Monitor tutoring activities.
- Access relevant learning information.

Parents should not automatically receive administrative or teacher-level permissions.

### D. Students

Students should have the most interactive learning experience.

Depending on the applications enabled for their school or family, they should be able to:

- Access learning materials.
- Complete quizzes and assessments.
- Participate in tutoring sessions.
- Practise coding.
- Access assignments.
- View their learning progress.

The agent should map the permissions and data access required by each role.

---

## 7. Navigation and Application Structure

Scholars.ng should use a shared application shell.

The proposed interface consists of:

**Left Sidebar:**
- Dashboard.
- Tutors Pro.
- Results Pro.
- Classroom Pro.
- Puzzle Pro.
- Other administrative sections where applicable.

Each application appears as a distinct navigation item.

When a user enters an application, its internal functions should appear as horizontal tabs or secondary navigation.

For example:

Results Pro:
- Overview.
- Students.
- Classes.
- Subjects.
- Assessments.
- Gradebooks.
- Reports.

The exact sub-navigation should follow the existing standalone application capabilities.

### Critical navigation rule

Only applications the user is authorised to access should appear in their navigation.

The interface must respect:

- Tenant configuration.
- Product subscriptions.
- User roles.
- Individual permissions.
- Application entitlements.

A school that subscribes to Results Pro and Classroom Pro should not see Tutors Pro and Puzzle Pro as active modules unless those applications are also enabled.

---

## 8. Architecture Relationship Diagram

Map the ecosystem using the following conceptual structure:

```mermaid
flowchart TB
    RP[ResultPro Ecosystem]

    RP --> ID[Central Identity & Billing Service]
    RP --> DB[(Shared PostgreSQL Infrastructure)]

    RP --> SCH[Scholars.ng]
    
    SCH --> TEN[School / Family Tenant Resolution]
    TEN --> ROLE[Role-Based Access Control]
    
    ROLE --> OWNER[School Admin / Owner]
    ROLE --> TEACHER[Teacher]
    ROLE --> PARENT[Parent]
    ROLE --> STUDENT[Student]

    SCH --> TP[Tutors Pro]
    SCH --> RES[Results Pro]
    SCH --> CL[Classroom Pro]
    SCH --> PUZ[Puzzle Pro]

    RP --> EX[Exams Pro]
    RP --> CP[Courses Pro]

    TP --> ID
    RES --> ID
    CL --> ID
    PUZ --> ID
    EX --> ID
    CP --> ID

    TP --> DB
    RES --> DB
    CL --> DB
    PUZ --> DB
```

This is a conceptual relationship diagram, not confirmation of the current implementation. Verify actual database and service connections before documenting them as implemented.

---

## 9. What the Agent Must Investigate

Before recommending implementation changes, inspect the existing codebase and architecture.

Specifically:

**A. Application independence**
- Identify each application's frontend and backend.
- Identify its existing deployment configuration.
- Confirm that each application can operate through its own front door.
- Identify shared components and dependencies.

**B. Identity and billing**
- Locate the central identity and billing microservice.
- Map how each application authenticates users.
- Identify how product entitlements are checked.
- Document how subscriptions and coin purchases are handled.

**C. Tenancy**
- Inspect the PostgreSQL schema.
- Identify existing tenant tables and relationships.
- Verify tenant ID propagation.
- Check whether queries enforce tenant isolation.
- Identify any potential cross-tenant data leakage.
- Check whether family tenancy is already supported.

**D. Scholars.ng**
- Identify the existing School Hub implementation.
- Determine how it currently loads applications.
- Identify what is required to support independent school subdomains.
- Map tenant resolution from the hostname.
- Determine how tenant subscriptions control application availability.

**E. Permissions**
- Map the school owner, teacher, parent and student roles.
- Identify existing role-based access controls.
- Identify permissions that need to be introduced or refined.

---

## 10. Required Deliverables

Produce the following documents:

1. **Ecosystem Architecture Map:** A complete diagram showing the relationships between all six applications, Scholars.ng, identity, billing and database infrastructure.

2. **Application Relationship Matrix:** A table identifying which applications are standalone, which integrate with Scholars.ng, which are multi-tenant and their billing models.

3. **Identity and Billing Flow:** A diagram showing how one user identity works across multiple applications and how product entitlements are enforced.

4. **Tenant Architecture:** A diagram showing how schools and families are resolved, how tenant IDs propagate and how data isolation is maintained.

5. **Role and Permission Matrix:** A detailed breakdown of what school administrators, teachers, parents and students can access within each application.

6. **Navigation Architecture:** A proposed Scholars.ng interface structure showing the application sidebar, individual application navigation and role-specific dashboards.

7. **Existing Architecture Gap Analysis:** A comparison of the intended architecture against the actual implementation, identifying what already works, what is missing and what needs modification.

8. **Implementation Roadmap:** A prioritised sequence of changes required to achieve the intended architecture.

---

## 11. Important Architectural Constraints

The following principles must guide all recommendations:

1. Do not merge the six applications into one monolithic application.

2. Preserve independent front doors for all six products.

3. Scholars.ng should provide a unified experience for Tutors Pro, Results Pro, Classroom Pro and Puzzle Pro.

4. Maintain the existing central identity and billing microservice.

5. Do not introduce unnecessary identity duplication.

6. Maintain the shared PostgreSQL architecture for the school/family applications unless a demonstrable technical requirement justifies a change.

7. Enforce strict tenant isolation at the backend, not merely through frontend navigation.

8. Do not force Exams Pro into the school/family tenancy model.

9. Do not force Courses Pro into the Scholars.ng institutional architecture.

10. Support individual users who subscribe to multiple applications without requiring them to belong to a school.

11. Preserve existing application functionality and APIs wherever possible.

12. Do not implement architectural changes before completing the investigation and documenting the findings.

---

## 12. ScholarsNG Product Landing Page, Offers & Pricing Specification

ScholarsNG must feature a dedicated, high-converting product landing page deployed at the platform apex domain (`scholars.ng`, `www.scholars.ng`, or `localhost:3004` when no tenant subdomain is present). This page represents the commercial front door for the ScholarsNG product, communicating its value proposition, specialist app integrations, and transparent pricing.

### 12.1 Core Product Positioning
- **Hero Title**: The Operating System for Modern African & Global Schools.
- **Tagline**: Transform your institution into a mobile-first digital campus. Eliminate fragmented tools, lost receipts, and manual report processing by integrating results processing, curriculum learning, 1-on-1 tutoring, and future-skills coding into one branded environment.
- **Primary CTAs**:
  - `Deploy Your School Portal` (Launches multi-step onboarding wizard).
  - `Find Your School / Sign In` (School directory lookup / access code entry).
  - `Explore Live Demo` (Interactive sandbox).
  - `View Pricing & Plans`.

### 12.2 Product Offers & Integrated Specialist Apps
The landing page must clearly explain the four specialist products integrated into the ScholarsNG shell:

| Specialist Offer | Value Proposition for the School | Key Capabilities |
| :--- | :--- | :--- |
| **ResultsPRO Engine** | Flawless Continuous Assessment & Gradebook Automation | Instant marks upload, automated psychomotor evaluations, position-in-class rankings, broadsheets, tamper-proof scratch cards, and branded PDF report cards. |
| **ClassroomPRO LMS** | NERDC Curriculum-Aligned Offline-First Learning | Lesson notes, teacher handouts, formative quizzes, Spaced Repetition (SRS) study flashcards, zero-data offline home study sync. |
| **TutorsPRO Marketplace** | Structured 1-on-1 Academic Support | Vetted expert instructors, calendar booking, curriculum lesson delivery, parent progress monitoring, and targeted student remediation. |
| **PuzzlePRO Academy** | Gamified Coding & Computational Thinking | 636 interactive puzzle adventures teaching HTML, CSS, JavaScript, and Python with visual Blockly scaffolding and game mechanics. |

### 12.3 Role-Based Digital Campus Experience
The landing page must illustrate the distinct portals provided within each school's workspace:
- **School Owners & Administrators**: Institutional health KPI pulse, automated fee billing, staff payroll, admission funnel tracking, and teacher-class assignments.
- **Teachers**: Marksheet entry, attendance tracking, lesson handouts, formative quiz dispatch, and student subject performance charts.
- **Parents**: Real-time academic report cards, attendance alerts, tuition payment verification, teacher messaging, and child progress feeds.
- **Students**: Interactive lesson review, quiz tests, coding adventures, study streaks, and personal gradebook tracking.

### 12.4 Transparent Subscription Tiers & Pricing Model
The pricing section must directly reflect the centralized plan limits defined in `service_users` (`seed_plans.go`):

| Plan Tier | Price | Capacity | Included Features & Entitlements | CTA |
| :--- | :--- | :--- | :--- | :--- |
| **FREE** | ₦0 / forever | Up to 100 Students & 15 Teachers | ScholarsNG Mobile Apps, ResultsPRO (Basic Marks Entry & Cards), ExamsPRO (Free Practice CBT), 2GB Cloud Storage. | `Get Started Free` |
| **STARTER** | ₦15,000 / month | Up to 500 Students & 50 Teachers | ScholarsNG Mobile Apps, ResultsPRO (Full Gradebooks & PDF Reports), ExamsPRO (Standard CBT), ClassroomPRO LMS, 15GB Cloud Storage. | `Start with Starter` |
| **PRO** *(Popular)* | ₦35,000 / month | Up to 2,000 Students & 300 Teachers | ScholarsNG Mobile Apps, ResultsPRO & ExamsPRO, ClassroomPRO LMS, PuzzlePRO Coding Academy, 50GB Cloud Storage. | `Upgrade to Pro` |
| **ENTERPRISE** | ₦80,000 / month | Unlimited Students & Teachers | All Suite Products Enabled, Custom Domain Integration (`portal.yourschool.com`), Full White-Label Branding, Dedicated Account Manager, 500GB Cloud Storage. | `Contact Sales` |

---

## 13. ScholarsNG Multi-Tenant Shell Architecture: Wildcard Subdomains & Custom Domain Workspaces

ScholarsNG uses a **multi-tenant shell architecture** that dynamically routes requests based on the HTTP `Host` header. This enables zero-configuration wildcard subdomain integration (`*.scholars.ng`) and seamless custom domain onboarding (`portal.greenfieldacademy.com`).

### 13.1 Request Lifecycle & Routing Pipeline

```mermaid
flowchart TD
    REQ["Incoming HTTP Request"] --> MW["Next.js Edge Middleware (middleware.ts)"]
    MW --> EXTRACT["Extract Host Header (strip port)"]
    EXTRACT --> CHECK{"Domain Type"}

    CHECK -- "Root / Apex Domain<br>(scholars.ng, www, localhost)" --> APEX["Render ScholarsNG Product Landing Page<br>(src/app/(platform)/...)"]
    
    CHECK -- "Wildcard Subdomain<br>(e.g. greenfield.scholars.ng)" --> SUBDOMAIN["Extract Tenant Slug ('greenfield')"]
    CHECK -- "Custom Domain<br>(e.g. portal.greenfield.com)" --> CUSTOM["Query by Full Custom Domain"]

    SUBDOMAIN --> RESOLVE["Resolve Tenant Metadata via service_users<br>GET /api/public/tenant/resolve?domain=..."]
    CUSTOM --> RESOLVE

    RESOLVE --> FOUND{"Tenant Found?"}
    FOUND -- No --> NOTFOUND["Render Custom Tenant Not Found Page"]
    FOUND -- Yes --> INJECT["Inject Request Headers<br>x-tenant-slug, x-tenant-id, x-tenant-name"]
    INJECT --> REWRITE["Next.js Internal Route Rewrite<br>Rewrite to /[tenant]/... (Tenant Workspace)"]
    
    REWRITE --> WORKSPACE["Render Branded Tenant Workspace<br>- Dynamic Theme (--primary, --accent)<br>- School Public Website<br>- Role-Based Portal (Admin, Teacher, Parent, Student)<br>- Gated Module Access (hasModule)"]
```

### 13.2 Next.js Shell Middleware Specification
The shell middleware (`scholars_ng/web_app/src/middleware.ts`) must enforce:
1. **Definitive Host Resolution**: Always extract domain from `req.headers.get('host')`.
2. **Platform Domain Matching**: Read `process.env.NEXT_PUBLIC_PLATFORM_DOMAIN` (defaulting to `scholars.ng` or `localhost:3004`). If `hostname === platformDomain || hostname === 'www.' + platformDomain || hostname === 'localhost'`, serve the **Product Landing Page** without rewriting.
3. **Tenant Slug Extraction**:
   - For subdomains (`greenfield.scholars.ng` or `greenfield.localhost:3004`): slug is `hostname.split('.')[0]`.
   - For custom domains (`portal.greenfieldacademy.com`): slug is the full domain.
4. **Header Propagation**: Pass `x-tenant-slug` and `x-tenant-domain` to Server Components.
5. **Path Rewriting**: Rewrite `url.pathname === '/'` $\rightarrow$ `/${tenantSlug}` and `url.pathname === '/admin/pulse'` $\rightarrow$ `/${tenantSlug}/admin/pulse`.

### 13.3 Tenant Workspace Capabilities
When a request is rewritten into the Tenant Workspace (`[tenant]`):
1. **Dynamic Theme & Brand Skinning**:
   - Injects tenant's `--primary`, `--secondary`, and `--accent` colors into CSS variables.
   - Loads tenant's `logo_url` and favicon dynamically in metadata.
2. **Public School Front Door**:
   - Displays the school's public website, history, admissions application form, school calendar, and contact information.
3. **Role-Based Single Sign-On Portals**:
   - `/[tenant]/admin`: Supervised control center for administrators.
   - `/[tenant]/teacher`: Classroom management and assessment gradebook.
   - `/[tenant]/parent`: Academic results, attendance alerts, and tuition payments.
   - `/[tenant]/student`: LMS handouts, formative tests, and coding games.
4. **Subscription Entitlement Enforcement (`hasModule`)**:
   - The shell verifies `tenant.enabled_modules` JSON array before rendering navigation links or pages.
   - If a tenant only subscribes to ResultsPRO and ClassroomPRO, TutorsPRO and PuzzlePRO tabs are automatically hidden from navigation and subroutes return 403 Forbidden.

### 13.4 Wildcard & Custom Domain Infrastructure
- **DNS Wildcard Record**: `*.scholars.ng` CNAME $\rightarrow$ `cname.vercel-dns.com` (or Cloudflare load balancer). This allows any newly registered school slug to resolve immediately without DNS intervention.
- **Custom Domain Provisioning**:
  - School creates CNAME `portal.myschool.edu.ng` $\rightarrow$ `cname.scholars.ng`.
  - Admin dashboard verifies domain mapping via `service_users` (`tenants.custom_domain`).
  - Automatic SSL certificates issued via Vercel / Let's Encrypt wildcard proxy.

---

## 14. Assessment of `scholars_ng/` Codebase & Implementation Roadmap

An inspection of the current `scholars_ng/` directory reveals the following current state and technical gaps:

### 14.1 Existing Strengths
- **Comprehensive Portal Views**: `scholars_ng/web_app/src/app/(portal)/` already contains rich dashboards for Admin (`admin/`), Teachers (`teacher/`), Parents (`parent/`), and Students (`student/`).
- **Tenant Context Structure**: `scholars_ng/web_app/src/components/TenantProvider.tsx` provides clean TypeScript types (`Tenant`) and a functional `hasModule` helper for feature gating.
- **Flutter Mobile App**: `scholars_ng/mobile_app/` contains a modular Flutter app with clean Clean Architecture feature folders (`admin`, `auth`, `onboarding`, `parent`, `profile`, `splash`, `student`, `teacher`).

### 14.2 Technical Gaps to Resolve
1. **Missing ScholarsNG Product Landing Page**: The current `scholars_ng/web_app/src/app/page.tsx` is an outdated demo for "My School Academy", not a commercial product page for ScholarsNG.
2. **Missing Edge Middleware**: `scholars_ng/web_app/src/proxy.ts` exists as an orphaned helper but is not configured as `middleware.ts` in the root of `web_app/`.
3. **Hardcoded Domain in Layout**: `layout.tsx` hardcodes `reedbreed.resultspro.ng` whenever `localhost` is encountered, which breaks local multi-tenant testing and prevents loading the product landing page on localhost.
4. **Missing Route Separation**: No clear separation between `(platform)` (for ScholarsNG marketing & pricing) and `[tenant]` (for tenant workspaces).

### 14.3 Implementation Roadmap
- [ ] **Phase 1: Shell Middleware**: Move and enhance `proxy.ts` to `scholars_ng/web_app/src/middleware.ts`. Support apex detection, wildcard subdomains, and custom domains.
- [ ] **Phase 2: Product Landing Page**: Build a modern, high-converting product landing page in `scholars_ng/web_app/src/app/(platform)/page.tsx` featuring the 4 specialist apps, role previews, and the 4 pricing tiers.
- [ ] **Phase 3: Tenant Workspace Restructuring**: Organize tenant workspaces under `/[tenant]` with dynamic branding resolution from `service_users` without hardcoded fallbacks.
- [ ] **Phase 4: Entitlement Hardening**: Connect `hasModule` checks to all sidebar navigation items and route guards across ResultsPRO, ClassroomPRO, TutorsPRO, and PuzzlePRO.

---

### Final Instruction to the Agent

Think of ResultPro as an ecosystem of independent but interconnected educational products.

**Scholars.ng is the institutional and family-facing integration layer, not the owner of every application's functionality.**

Each application must retain its product identity, dedicated entry point and independent functionality.

The central identity and billing service provides continuity across the ecosystem, while tenant-aware applications enforce the appropriate school or family boundaries.

The ultimate objective is to build a modular educational technology infrastructure that can serve individual learners, tutors, families, individual educators and large school networks without forcing all of them into the same product experience.

**First deliver the architecture documentation and gap analysis. Do not modify the codebase until the proposed architecture has been reviewed and approved.**
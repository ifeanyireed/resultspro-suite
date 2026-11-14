# RESULTSPRO & SCHOLARS.NG — REDIS INFRASTRUCTURE AUDIT, ARCHITECTURE AND IMPLEMENTATION ACROSS ALL MICROSERVICES & MULTI-TENANT WORKSPACES

## 1. Project objective

Conduct a comprehensive technical audit of the **ResultsPro Ecosystem** and **Scholars.ng** existing infrastructure and implement a properly structured Redis integration across all seven Go microservices and the Next.js multi-tenant shells.

The objective is not simply to install Redis or add caching to a few API endpoints.

The objective is to establish a reliable, high-performance, secure, and maintainable Redis infrastructure that supports ResultsPro's multi-tenant school architecture and high-traffic educational workloads (broadsheet processing, tamper-proof scratch card verification, CBT exam delivery, curriculum caching, and real-time leaderboards) without compromising school tenant isolation, data consistency, or authoritative financial and academic records in Neon Postgres.

The assignment has three stages:

1. **Audit the existing architecture** and identify where Redis is needed across all seven backend services and frontend shells.
2. **Produce a detailed implementation plan** and resolve outstanding architectural questions (namespaces, invalidation, fail-open vs. fail-closed security).
3. **Implement, integrate, and test Redis** across the approved microservices using Go client libraries and Upstash serverless infrastructure.

> [!IMPORTANT]
> **Begin with the audit. Do not start changing production code before completing the audit and presenting the proposed implementation plan.**

---

## 2. Existing architectural context

The following verified information guides the audit:

- **Seven Dedicated Go Microservices**:
  1. `service_users`: Central identity, authentication, JWT verification, tenant resolution, role-based access control (RBAC), subscription entitlement enforcement, and Brevo transactional SMTP.
  2. `service_resultspro`: Assessment scores entry, continuous assessment (CA), termly broadsheets generation, gradebook calculation, tamper-proof scratch cards generation & validation, and official PDF report cards.
  3. `service_classroompro`: NERDC curriculum-aligned offline-first lesson notes, formative assessments, spaced-repetition flashcards, and academic syllabus tracking.
  4. `service_coursespro`: LMS program builder, cohort management, mentor dispatch & earnings, assignment grading, and case study showcases.
  5. `service_examspro`: Computer-Based Testing (CBT) engine, national exam question pools (WAEC, JAMB UTME, NECO, BECE), live tournament matchmaking, head-to-head battle-mode CBT, and anti-cheat telemetry.
  6. `service_tutorspro`: 1-on-1 vetted curriculum tutoring marketplace, calendar availability, booking requests, interactive whiteboard session handoffs, and hourly tutor disbursements.
  7. `service_puzzlepro`: 636 gamified algorithmic coding adventures across 5 progressive worlds, Blockly/JavaScript execution telemetry, and school-wide STEM XP leaderboards.
- **Frontend Architecture & Multi-Tenant Shell**:
  - `scholars_ng/web_app`: Wildcard multi-tenant engine (`*.scholars.ng` and custom school domains) routing to branded school workspaces with role-based portals for School Owners/Admins, Teachers, Parents, and Students.
  - `landing_page`: Apex commercial gateway at `resultspro.ng` and `scholars.ng`.
  - Dedicated front doors: `resultspro`, `classroompro`, `coursespro`, `examspro`, `tutorspro`, `puzzlepro`, and `admin`.
- **Neon Serverless Postgres is the Authoritative Database**:
  - All permanent business, academic, financial, and user records reside in Neon Postgres.
  - Neon connection pooling (`DATABASE_URL` with pooled endpoints) is already configured.
  - Most database tables enforce strict tenant separation via `tenant_id` (or `school_id`).
- **Strict Multi-Tenant Separation is Mandatory**:
  - Educational institutions (K-12 schools, tertiary institutions, tutoring centers) operate on shared application infrastructure.
  - Data leakage between schools, student score cross-contamination, or cross-tenant cache access constitutes a critical security breach.
- **Target Redis Infrastructure**:
  - One shared **Upstash Redis** instance connected to all seven microservices and the Next.js edge proxies, rather than seven disconnected Redis instances.
  - Low-latency HTTP/REST (via `@upstash/redis`) for Next.js Edge/Middleware, and TCP connection pooling (via `github.com/redis/go-redis/v9`) for Go backend microservices.
  - Each service must have its own Redis namespace and strictly governed access patterns.
  - Redis acts as an acceleration, ephemeral state, and concurrency-control layer—it must never duplicate the entire Neon database or store authoritative academic records.

---

## 3. Stage One: Comprehensive infrastructure audit

Before implementation, inspect all seven Go microservices and the Next.js shell applications.

For each service, document:

- Service name, port, and core business responsibility.
- Repository path and deployment target (Render container / Vercel Serverless).
- Go version, routing framework (standard library `net/http`, Gorilla Mux, Chi, or Gin), and ORM (`gorm.io/gorm` with `gorm.io/driver/postgres` and `lib/pq`).
- Existing API routes, middleware stacks, and CORS policies.
- Authentication and authorisation mechanisms (Bearer JWT extraction, claims parsing, signature verification).
- How school/tenant identity is resolved (hostname, custom domain, subdomain, path parameter, or JWT claim).
- How school tenant permissions and subscription tier limits (Free, Starter, Pro, Enterprise) are enforced.
- Existing Neon connection configuration, connection pooling limits, and query timeouts.
- Database query patterns, high-frequency read endpoints, and write-heavy paths.
- Existing in-memory caches, sync primitives, or sync maps (if any).
- Background workers, goroutine pools, cron tickers, and scheduled jobs.
- External API calls (Brevo SMTP on Port 465, Cloudinary image upload, Paystack webhook processing).
- Current environment variables and secrets management.
- Existing performance bottlenecks and candidate Redis use cases.

### 3.1 Audit tenant isolation

This is the most critical requirement of the ResultsPro ecosystem.

Inspect the complete request lifecycle across both frontend proxies and backend services:

```mermaid
flowchart LR
    A[Client Request] --> B[Next.js Middleware / Custom Domain Resolve]
    B --> C[Service Authentication & JWT Claims]
    C --> D[School Tenant Membership & Role Validation]
    D --> E[Subscription Tier Entitlement Check]
    E --> F[Redis Cache Lookup with Tenant Namespace]
    F -->|Cache Hit| G[Sanitized API Response]
    F -->|Cache Miss| H[Authoritative Neon Postgres Query]
    H --> I[Populate Redis with Tenant Context & TTL]
    I --> G
```

1. **User Authentication**: Validate how JWTs are signed and how user claims are extracted.
2. **Tenant Identification**: Ensure tenant identity is determined server-side from authenticated claims or verified domain resolution (`service_users/api/public/tenant/resolve`), **never** trusted directly from raw client-supplied headers or JSON bodies.
3. **Role & Entitlement Verification**: Verify how `user_tenant_roles` and subscription plans (`SubscriptionHelper.ts` / `seed_plans.go`) are checked.
4. **Cache Key Generation**: Ensure every school-scoped cache operation incorporates the validated `tenant_id`.
5. **Cross-Tenant Leakage Check**: Verify that school A cannot view school B's broadsheet, report card, student roster, or scratch card batches.
6. **Cache Invalidation Boundaries**: Ensure that invalidating student grades or class configurations for School A never purges or affects School B's cached records.
7. **Document all vulnerabilities**: Identify any endpoint where cross-tenant cache contamination could occur and specify mandatory safeguards.

### 3.2 Audit current database usage

Inspect existing Neon Postgres interactions across all seven services.

Identify:

- **Broadsheet & Grade Aggregations (`service_resultspro`)**: Termly calculations combining CA scores, exam marks, position ranking, and GPA calculations across hundreds of students per class.
- **Scratch Card Lookups (`service_resultspro`)**: High-frequency read queries validating serial numbers and PIN hashes during peak result checking periods.
- **Curriculum & Notes Retrieval (`service_classroompro`)**: Repetitive queries fetching identical NERDC curriculum handouts and note structures for thousands of enrolled students.
- **CBT Question Pool Queries (`service_examspro`)**: Dynamic selection of WAEC/JAMB/NECO past questions by subject, year, topic, and difficulty during live exam sessions.
- **LMS Program & Cohort Structures (`service_coursespro`)**: Multi-module syllabi, video lesson trees, and assignment rubrics.
- **Tutor Availability & Booking Slots (`service_tutorspro`)**: Calendar slot lookups and concurrent booking requests.
- **STEM Leaderboard Aggregations (`service_puzzlepro`)**: High-volume XP sorting across thousands of student coding exercises.
- **Tenant Domain & Profile Lookups (`service_users`)**: Repeated lookups resolving subdomains, custom domains, and school branding logos on every page load.
- **Data Requiring Strong Consistency**: Student final exam scores, scratch card redemption statuses, financial ledger transactions, and tutor payout balances—**these must never be cached with stale write-back semantics**.

---

## 4. Stage Two: Redis architecture

### 4.1 Proposed infrastructure

Implement one unified, production-grade **Upstash Redis** instance serving all seven Go microservices and Next.js frontend edge proxies.

```mermaid
flowchart TD
    subgraph Clients["Frontend Applications (Vercel)"]
        F1["scholars_ng/web_app (Edge Middleware)"]
        F2["admin & Specialized Frontends"]
    end

    subgraph Microservices["Backend Go Microservices (Render / Vercel)"]
        S1["service_users"]
        S2["service_resultspro"]
        S3["service_classroompro"]
        S4["service_coursespro"]
        S5["service_examspro"]
        S6["service_tutorspro"]
        S7["service_puzzlepro"]
    end

    subgraph RedisLayer["Shared Upstash Redis (Encrypted TLS)"]
        R1[("Namespace: users:*")]
        R2[("Namespace: results:*")]
        R3[("Namespace: classroom:*")]
        R4[("Namespace: courses:*")]
        R5[("Namespace: exams:*")]
        R6[("Namespace: tutors:*")]
        R7[("Namespace: puzzle:*")]
    end

    subgraph DatabaseLayer["Authoritative Storage"]
        DB[(Neon Serverless Postgres)]
    end

    F1 -->|HTTP REST / Edge| RedisLayer
    Microservices -->|TCP Connection Pool / go-redis| RedisLayer
    Microservices -->|SQL Pooled Queries| DB
```

- **Connection Methods**:
  - **Go Microservices**: Connect via TLS TCP connection pooling using `github.com/redis/go-redis/v9` with automatic reconnect, ping health checks, and connection timeouts.
  - **Next.js Edge & Middleware**: Connect via HTTPS REST using `@upstash/redis` to eliminate cold-start connection overhead in serverless/edge environments.
- **Authoritative Source of Truth**:
  - Neon Postgres remains the permanent database.
  - Redis acts purely as an ephemeral performance accelerator, atomic counter, distributed lock provider, and rate limiter.

### 4.2 Redis namespaces

A strict, standardized key naming convention is enforced across all seven microservices:

```
resultspro:{env}:{service}:{tenant_scope}:{resource}:{identifier}
```

Where:
- `{env}`: `dev`, `staging`, or `prod`.
- `{service}`: `users`, `results`, `classroom`, `courses`, `exams`, `tutors`, or `puzzle`.
- `{tenant_scope}`: Either `global` (for cross-tenant public assets) or `school_{tenant_id}` / `tenant_{tenant_id}`.
- `{resource}`: The entity type (e.g., `session`, `broadsheet`, `scratchcard`, `note`, `cohort`, `cbt_timer`, `xp_leaderboard`).
- `{identifier}`: Specific entity UUID, hash, or composite slug.

#### Concrete Namespace Examples:
- **`service_users`**:
  - `resultspro:prod:users:global:domain:oakcreek.scholars.ng` -> Cached tenant metadata (ID, branding, active subscription).
  - `resultspro:prod:users:tenant_uuid123:session:user_uuid456` -> Active session claims & role permissions.
  - `resultspro:prod:users:global:ratelimit:login:ip_102_89_32_1` -> Sliding-window login attempt counter.
- **`service_resultspro`**:
  - `resultspro:prod:results:school_uuid123:broadsheet:class_ss3a:term_2` -> Cached termly broadsheet JSON payload.
  - `resultspro:prod:results:school_uuid123:scratchcard:attempt:pin_hash789` -> Failed PIN attempt counter (rate limit).
  - `resultspro:prod:results:school_uuid123:report_card:student_uuid999:term_2` -> Pre-rendered report card summary.
- **`service_classroompro`**:
  - `resultspro:prod:classroom:global:curriculum:nerdc:ss2:physics` -> NERDC standardized curriculum topics.
  - `resultspro:prod:classroom:school_uuid123:note:note_uuid888` -> School teacher's published lesson handout.
- **`service_coursespro`**:
  - `resultspro:prod:courses:tenant_uuid555:cohort:cohort_uuid111:tree` -> Full curriculum module hierarchy.
  - `resultspro:prod:courses:tenant_uuid555:mentor:availability:mentor_uuid222` -> Real-time mentor session slots.
- **`service_examspro`**:
  - `resultspro:prod:exams:global:pool:jamb_utme:2024:math` -> Pre-indexed CBT question pool.
  - `resultspro:prod:exams:session:session_uuid333:timer` -> Server-authoritative remaining exam time in seconds.
  - `resultspro:prod:exams:live:battle:room_uuid444:state` -> Real-time battle mode scores & countdown.
- **`service_tutorspro`**:
  - `resultspro:prod:tutors:global:tutor:profile:tutor_uuid777` -> Vetted tutor public credentials & bio.
  - `resultspro:prod:tutors:tenant_uuid123:lock:slot:tutor_uuid777_20261120_1400` -> Distributed lock for booking slot (TTL: 10 mins).
- **`service_puzzlepro`**:
  - `resultspro:prod:puzzle:school_uuid123:leaderboard:xp` -> Sorted Set (`ZREVRANGE`) of student coding XP.
  - `resultspro:prod:puzzle:student:student_uuid888:streak` -> Current coding adventure streak count.

### 4.3 Tenant isolation requirements

Every school-specific cache key must incorporate the authenticated school `tenant_id`:

1. **Server-Side Validation**: Resolve tenant identity strictly from authenticated JWT claims or verified custom domain lookup (`service_users`). Never trust client headers like `X-Tenant-ID` without verifying that the authenticated user belongs to that tenant in Neon Postgres.
2. **Prevent Cache Collisions**: Two schools with identically named classes (e.g., "JSS 1A") must never collide because their keys incorporate distinct `school_{tenant_id}` prefixes.
3. **Tenant-Scoped Invalidation**: When an administrator updates school settings or marks entry, the invalidation pattern must strictly target keys matching `resultspro:{env}:{service}:school_{tenant_id}:*`. Invalidation must never sweep global keys or other schools' keys.
4. **Credential Security**: Upstash Redis tokens and connection strings must remain strictly backend server-side environment variables. Never prefix Redis environment variables with `NEXT_PUBLIC_` or bundle them into client JavaScript.
5. **Multi-Role Testing**: Verify that Students, Teachers, Parents, School Admins, and Super-Admins only read and write within their authorized tenancy boundaries.

### 4.4 Shared Redis integration library

To prevent divergence across the seven Go microservices, introduce a shared Go internal package (`pkg/redis` or `internal/cache`):

```go
package cache

import (
    "context"
    "time"
    "github.com/redis/go-redis/v9"
)

type Client struct {
    rdb     *redis.Client
    env     string
    service string
}

func NewClient(redisURL, env, service string) (*Client, error)
func (c *Client) Key(tenantScope, resource, identifier string) string
func (c *Client) Get(ctx context.Context, key string, dest interface{}) error
func (c *Client) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error
func (c *Client) Delete(ctx context.Context, key string) error
func (c *Client) DeletePattern(ctx context.Context, pattern string) error
func (c *Client) AcquireLock(ctx context.Context, key string, ttl time.Duration) (bool, error)
func (c *Client) ReleaseLock(ctx context.Context, key string) error
func (c *Client) RateLimit(ctx context.Context, key string, limit int, window time.Duration) (bool, int, error)
```

For Next.js edge proxies and frontend middleware, maintain a lightweight matching helper in `lib/redis.ts` utilizing `@upstash/redis`.

---

## 5. Stage Three: Identify and implement Redis use cases

Every proposed Redis use case must be documented with an explicit rationale, TTL, invalidation trigger, and Neon fallback strategy.

### 5.1 Application and API caching

| Resource | Service | Neon Query / Source | TTL | Invalidation Trigger | Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tenant Domain Metadata** | `service_users` | `SELECT * FROM tenants WHERE slug = ? OR custom_domain = ?` | 24 Hours | Tenant settings update, logo update, plan upgrade | Fallback to Neon query |
| **Term Broadsheets** | `service_resultspro` | Multi-table joins across `assessments`, `scores`, `students`, `classes` | 1 Hour | Any score edit, grade approval, continuous assessment submission | Fallback to Neon aggregation |
| **Report Card Summary** | `service_resultspro` | Aggregated term scores, psychomotor ratings, teacher remarks | 2 Hours | Teacher edits remark or amends score | Fallback to Neon report generation |
| **NERDC Curriculum Topics** | `service_classroompro` | `SELECT * FROM syllabuses WHERE grade = ? AND subject = ?` | 7 Days | Admin publishes updated curriculum version | Fallback to Neon |
| **Published Lesson Notes** | `service_classroompro` | `SELECT * FROM lesson_notes WHERE id = ? AND status = 'published'` | 12 Hours | Teacher edits lesson handout | Fallback to Neon |
| **LMS Course Outline Tree** | `service_coursespro` | Course modules, video units, milestone rubrics | 6 Hours | Mentor or Admin edits course structure | Fallback to Neon |
| **CBT Question Bank Pools** | `service_examspro` | Indexed questions by exam type (JAMB/WAEC), year, topic | 24 Hours | Question review, error correction, syllabus patch | Fallback to Neon |
| **Tutor Public Profile** | `service_tutorspro` | `SELECT * FROM tutors JOIN users ... WHERE verified = true` | 4 Hours | Tutor edits profile bio, subjects, or pricing | Fallback to Neon |

### 5.2 Authentication, permissions, and subscriptions

- **JWT Revocation / Blacklist**: When a user logs out, changes passwords, or is suspended, publish the token ID (`jti`) into Redis with a TTL equal to the token's remaining validity:
  - Key: `resultspro:prod:users:global:token_blacklist:{jti}`
  - TTL: Token expiration delta (e.g., 2 hours).
- **Tenant Membership & Role Cache**: Avoid checking `user_tenant_roles` table on every single HTTP request:
  - Key: `resultspro:prod:users:tenant_{tenant_id}:roles:{user_id}`
  - TTL: 30 Minutes.
  - Invalidation: Role assignment change, user removal, permission change.
- **Subscription Tier Limit Enforcement (`SubscriptionHelper.ts`)**:
  - Cache the tenant's current plan entitlements (e.g. Student limit: 100 on Starter, 500 on Pro; Feature flags: CBT, Whiteboard, Scratch Cards):
  - Key: `resultspro:prod:users:tenant_{tenant_id}:subscription:limits`
  - TTL: 2 Hours.
  - Invalidation: Webhook receipt from Paystack for plan upgrade/renewal or admin tier override.

### 5.3 Rate limiting & anti-abuse

- **Scratch Card Brute-Force Prevention (`service_resultspro`)**:
  - *Risk*: Malicious actors scripting PIN guesses to view unearned report cards.
  - *Redis Pattern*: Atomic increment with sliding window:
    - Key: `resultspro:prod:results:school_{tenant_id}:scratchcard:rate:{ip_or_user}`
    - Limit: 5 failed PIN attempts per 15 minutes.
    - Exceeded Action: Lock PIN verification for that IP/device; emit security audit event.
    - **Fail-Closed**: If Redis is offline during scratch-card PIN verification, enforce strict conservative limits or temporarily require CAPTCHA fallback.
- **Login Brute-Force Prevention (`service_users`)**:
  - Limit: 5 failed password attempts per 5 minutes per email/IP.
  - Key: `resultspro:prod:users:global:ratelimit:login:{email_hash}`
- **CBT Answer Submission Throttling (`service_examspro`)**:
  - Limit: Maximum 2 answer patch submissions per second per student to prevent automated bot flooding during live exams.

### 5.4 Temporary operational data & distributed locks

- **CBT Active Session Timers (`service_examspro`)**:
  - During timed exams (e.g. 120-minute JAMB mock), the authoritative remaining time must reside in Redis with an atomic decrement or timestamp comparison.
  - Prevents students from pausing browser JavaScript timers or altering client-side clocks.
  - Key: `resultspro:prod:exams:session:{exam_session_id}:timer`
  - Persistence: On final exam submission or timer expiry, the completed exam status and timestamps are committed to Neon Postgres.
- **Tutor Booking Slot Mutex (`service_tutorspro`)**:
  - When a parent begins checkout for a tutor's 4:00 PM Thursday slot, acquire a distributed lock (`SET NX EX 600`):
  - Key: `resultspro:prod:tutors:tenant_{tenant_id}:lock:slot:{tutor_id}_{slot_timestamp}`
  - Prevents double-booking if two parents click "Book Slot" at the same instant.
- **OTP & Email Verification States (`service_users`)**:
  - Temporary 6-digit verification codes for parent onboarding and password resets:
  - Key: `resultspro:prod:users:global:otp:{purpose}:{identifier}`
  - TTL: 10 Minutes (Strict).

### 5.5 Real-time leaderboards & interactive operations

- **PuzzlePRO Algorithmic XP Leaderboards (`service_puzzlepro`)**:
  - Use Redis Sorted Sets (`ZADD`, `ZINCRBY`, `ZREVRANGE`):
  - Keys:
    - School Leaderboard: `resultspro:prod:puzzle:school_{tenant_id}:leaderboard:xp`
    - Class Leaderboard: `resultspro:prod:puzzle:school_{tenant_id}:class_{class_id}:leaderboard:xp`
  - High performance: Instant retrieval of Top 10 coders and individual student ranks (`ZREVRANK`) without performing heavy SQL sorting across thousands of progress rows.
- **ExamsPRO Live CBT Battle Mode (`service_examspro`)**:
  - Real-time head-to-head match state, live scores, and current question indices for student contestants:
  - Key: `resultspro:prod:exams:live:battle:{match_id}:state`
  - TTL: 1 Hour (cleared upon match conclusion).

### 5.6 Background jobs & asynchronous coordination

- **Broadsheet PDF Compilation Queue (`service_resultspro`)**:
  - Generating broadsheet PDFs for 2,000 students requires heavy CPU and headless browser rendering.
  - Queue job requests in Redis (`LPUSH` / `BRPOP` or Redis Streams) processed by dedicated worker goroutines:
  - Key: `resultspro:prod:results:queue:pdf_generation`
- **Batch Email Dispatch Throttling (`service_users`)**:
  - Rate-limit outgoing Brevo transactional emails (welcome emails, term report alerts) to stay within provider quota limits (Port 465 SSL/TLS).

---

## 6. Cache consistency and invalidation

A cache is only useful if its data can be trusted. Stale grades, incorrect student positions, or cached outdated subscription permissions will erode institutional trust.

### Invalidation Rules:
1. **Write-Through / After-Commit Invalidation**:
   - Cache invalidation **must** execute only after the Neon Postgres database transaction commits successfully.
   - If a database transaction rolls back, the cache must not be touched.
2. **Event-Driven Cache Eviction**:
   - *Grade Entry*: When a teacher inputs or modifies an assessment score, immediately evict:
     - `resultspro:prod:results:school_{tenant_id}:broadsheet:{class_id}:{term_id}`
     - `resultspro:prod:results:school_{tenant_id}:report_card:{student_id}:{term_id}`
   - *Student Enrollment*: When a student is transferred or added to a class, evict the class roster cache.
   - *Plan Upgrade*: When Paystack confirms a subscription payment, evict the tenant's entitlement and limit cache.
3. **Cache Stampede Prevention**:
   - For high-demand keys (e.g. school broadsheets on release day), implement mutex locks or random TTL jitter (`TTL ± 10%`) to prevent thousands of simultaneous Neon queries when a key expires.
4. **Consistency Guarantees**:
   - Financial ledger entries, scratch card status transitions (`active -> redeemed`), and final official examination submissions must read from and write directly to Neon Postgres.

---

## 7. Failure handling and resilience

Redis must never become a single point of failure that halts the entire ResultsPro suite.

### Fail-Open vs. Fail-Closed Policy Matrix:

| Operation Type | Failure Mode | Behavior When Redis is Unavailable | Rationale |
| :--- | :--- | :--- | :--- |
| **API Read Caches** (Broadsheets, Notes, Curriculum) | **Fail-Open** | Fall back to direct Neon Postgres query. Log warning. | Ensures students, teachers, and parents can still view learning materials and results. |
| **Scratch Card Verification** | **Fail-Closed** | Reject rapid automated verification; require CAPTCHA or return temporary service retry alert. | Protects school revenue; prevents brute-forcing scratch card PINs during an outage. |
| **Authentication & RBAC** | **Fail-Open** | Fall back to validating JWT cryptographic signature and querying Neon `user_tenant_roles`. | Legitimate users must not be locked out of school portals due to cache downtime. |
| **CBT Live Exam Timer** | **Fail-Open** | Revert to Neon session start timestamp + allotted duration calculation. | Prevents students taking live exams from having their exams aborted mid-test. |
| **Tutor Booking Lock** | **Fail-Closed** | Prevent slot booking until lock can be guaranteed in Neon with database row-level locking (`SELECT FOR UPDATE`). | Eliminates double-booking of human tutors. |
| **XP Leaderboard** | **Fail-Open** | Return last-known database totals or empty leaderboard with retry indicator. | Non-critical gamification telemetry; core coding exercises continue functioning. |

---

## 8. Upstash configuration and deployment

### Deployment Architecture:
1. **One Unified Upstash Redis Resource**:
   - Connected via secure TLS (`rediss://...`) across all Vercel deployments and Render Go backend containers.
   - Distinct database index or environment prefixes (`dev:`, `staging:`, `prod:`).
2. **Environment Variables**:
   - For Go Microservices:
     - `REDIS_URL`: Full TLS connection string (e.g., `rediss://default:xxxx@xxxx.upstash.io:6379`).
     - `REDIS_MAX_RETRIES`: `3`.
     - `REDIS_DIAL_TIMEOUT`: `3s`.
     - `REDIS_READ_TIMEOUT`: `2s`.
     - `REDIS_WRITE_TIMEOUT`: `2s`.
   - For Next.js Edge & Middleware:
     - `UPSTASH_REDIS_REST_URL`: HTTPS endpoint URL.
     - `UPSTASH_REDIS_REST_TOKEN`: Secure bearer token.
3. **Environment Segregation**:
   - Production services must never connect to Development or Staging Redis databases.
   - Development test suites must run against local Redis containers (`redis:7-alpine`) or dedicated Upstash dev databases.
4. **Secret Protection**:
   - Redis credentials must never be committed to Git or exposed via frontend environment variables.

---

## 9. Monitoring and observability

Implement structured logging and metrics to confirm that Redis delivers measurable performance enhancements across the suite:

- **Metrics to Track**:
  - Cache Hit Ratio (`Hits / (Hits + Misses)`): Target > 85% for curriculum and broadsheet reads.
  - Redis Command Latency: Target < 15ms for Upstash REST / < 5ms for TCP.
  - Fallback-to-Neon Count: Alert when fallback rate exceeds 2% over a 5-minute window.
  - Active CBT Timers and WebSocket Connections.
  - Rate-limit triggers (especially on scratch card PIN verification).
- **Security & Privacy Safeguards**:
  - Never log raw scratch card PINs, user passwords, JWT tokens, or unencrypted student personally identifiable information (PII) in cache diagnostic logs.
- **Health Check Endpoints**:
  - Each microservice `/health` endpoint must report Redis connectivity status (`ok`, `degraded`, or `down`) without exposing internal connection strings.

---

## 10. Service-by-service implementation matrix

| Microservice | Primary Language & Runtime | Audit Findings & High-Load Paths | Approved Redis Use Cases | Files & Modules to Update | Required Verification Tests |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`service_users`** | Go 1.26<br>GORM + pq | Repeated tenant domain lookups (`/api/public/tenant/resolve`), JWT role checking, login attempts. | 1. Custom domain & tenant slug cache.<br>2. Session & role membership cache.<br>3. Login rate limiter.<br>4. Plan subscription limits cache. | `main.go`<br>`middleware/auth.go`<br>`handlers/tenant.go`<br>`utils/redis.go` | Tenant resolution benchmark, role invalidation test, login rate-limit test. |
| **`service_resultspro`** | Go<br>GORM + pq | Intensive broadsheet aggregation queries, heavy scratch card verification spikes at term end. | 1. Broadsheet summary cache.<br>2. Scratch card PIN rate limiter.<br>3. Report card summary cache.<br>4. Broadsheet PDF worker queue. | `handlers/results.go`<br>`handlers/scratchcards.go`<br>`services/broadsheet.go`<br>`db/redis.go` | Scratch card brute-force simulation, broadsheet cache invalidation on mark entry. |
| **`service_classroompro`** | Go<br>GORM + pq | Repetitive queries for NERDC curriculum topics, static syllabus outlines, published notes. | 1. NERDC syllabus cache.<br>2. Published lesson note cache.<br>3. Flashcard deck metadata cache. | `handlers/notes.go`<br>`handlers/syllabus.go`<br>`handlers/flashcards.go` | Note update cache-purge test, syllabus hit/miss ratio test. |
| **`service_coursespro`** | Go<br>GORM + Gorilla WS | Multi-unit course builder queries, mentor booking checks, cohort enrollment counts. | 1. Course curriculum tree cache.<br>2. Mentor session availability cache.<br>3. Active cohort enrollment counters. | `handlers/cohorts.go`<br>`handlers/programs.go`<br>`middleware/tenant.go` | Curriculum edit invalidation test, cohort seat race condition test. |
| **`service_examspro`** | Go<br>cmd/internal | WAEC/JAMB question pool queries, live CBT timer management, head-to-head battle mode. | 1. Indexed CBT question pool cache.<br>2. Server-authoritative exam timer.<br>3. Live battle mode room state. | `internal/cbt/timer.go`<br>`internal/questions/pool.go`<br>`internal/battle/room.go` | Client clock manipulation test, question pool memory footprint test. |
| **`service_tutorspro`** | Go<br>GORM + pq | Frequent tutor profile views, calendar slot queries, concurrent booking attempts. | 1. Verified tutor profile cache.<br>2. Distributed slot booking lock (`SET NX`).<br>3. Temporary whiteboard session tokens. | `handlers/bookings.go`<br>`handlers/tutors.go`<br>`db/redis.go` | Concurrent double-booking test (2 concurrent requests for 1 slot). |
| **`service_puzzlepro`** | Go<br>cmd/internal | High-volume coding exercise XP submissions, school STEM leaderboards. | 1. School & class XP Sorted Sets (`ZADD`).<br>2. Daily coding streak counters.<br>3. Sandbox execution rate limiting. | `internal/leaderboard/xp.go`<br>`internal/streak/counter.go`<br>`main.go` | 1,000 concurrent XP increment benchmark, rank retrieval latency test. |
| **`scholars_ng/web_app`** | Next.js 16<br>App Router (Edge) | Multi-tenant school domain routing, role-based dashboard shell entitlement checks. | 1. Edge tenant custom domain cache.<br>2. Edge API route rate limiting.<br>3. Tenant branding asset cache. | `src/proxy.ts`<br>`src/middleware.ts`<br>`src/lib/redis.ts` | Edge cold-start benchmark, custom domain routing test. |

---

## 11. Testing and acceptance criteria

The Redis implementation will only be considered ready for staging and production rollout when all of the following criteria are validated:

### 11.1 Infrastructure & connectivity tests
- All seven Go microservices and Next.js edge proxies establish secure TLS connections to Upstash Redis.
- Zero Redis credentials or raw connection strings are exposed in client-side bundles or repository commits.
- Connection failures degrade gracefully according to the fail-open/fail-closed policy without crashing containers.

### 11.2 Multi-tenant isolation tests
- **Zero Cross-Tenant Leakage**:
  - Test School Alpha (`school_id: 111`) and School Beta (`school_id: 222`).
  - School Alpha cannot read, write, or invalidate School Beta's broadsheet or scratch card caches.
  - Modifying `tenant_id` in request headers or body fails server-side validation and cannot access foreign tenant cache keys.
- **Tenant Key Scope Validation**: All keys written by school-specific handlers must verify presence of `school_{tenant_id}` in key path.

### 11.3 Cache correctness & invalidation tests
- **Cache-Aside Lifecycle**: Verify Cache Miss -> Neon Query -> Cache Write -> Cache Hit on subsequent request.
- **Invalidation on Write**: Confirm that updating student grades, editing lesson notes, or updating tenant plans immediately purges corresponding cached keys.
- **TTL Expiration**: Ensure expired keys fall back cleanly to Neon without errors.

### 11.4 Concurrency & security tests
- **Scratch Card Brute-Force Test**: Script 10 rapid incorrect PIN attempts; confirm Redis rate-limiter locks the client and protects the scratch card batch.
- **Tutor Double-Booking Mutex Test**: Issue two identical booking requests simultaneously; confirm exactly one succeeds and the other receives a locked slot error.
- **CBT Exam Timer Integrity Test**: Simulate client network disconnection and reconnection; confirm remaining time accurately reflects server-authoritative Redis timer.

### 11.5 Performance benchmarks
- Document before-and-after response times for:
  - Broadsheet retrieval: Target **< 150ms** (down from > 1,800ms SQL aggregation).
  - Tenant domain resolution: Target **< 20ms** (down from 250ms).
  - PuzzlePRO XP leaderboard retrieval: Target **< 15ms** (down from 350ms).

---

## 12. Rollout strategy

The rollout follows six structured phases:

```mermaid
flowchart TD
    P1[Phase 1: Audit & Architectural Sign-Off] --> P2[Phase 2: Upstash Provisioning & Shared Go Package]
    P2 --> P3[Phase 3: Pilot Integration - service_users & scholars_ng]
    P3 --> P4[Phase 4: High-Value Educational Caching - service_resultspro & service_classroompro]
    P4 --> P5[Phase 5: Real-Time & Concurrency - service_examspro, tutorspro, puzzlepro, coursespro]
    P5 --> P6[Phase 6: Multi-Tenant Validation & Production Rollout]
```

1. **Phase 1 — Audit & Architectural Sign-Off**:
   - Inspect existing Go codebase, verify route tables, and confirm approved Redis use cases.
2. **Phase 2 — Upstash Provisioning & Shared Go Package**:
   - Provision Upstash Redis instance; implement `internal/cache` Go module and `src/lib/redis.ts` helper.
3. **Phase 3 — Pilot Integration (`service_users` & `scholars_ng`)**:
   - Deploy tenant domain resolution and session/role caching. Measure edge routing latency reduction.
4. **Phase 4 — High-Value Educational Caching (`service_resultspro` & `service_classroompro`)**:
   - Implement broadsheet caching, scratch card rate limiting, and NERDC syllabus caching.
5. **Phase 5 — Real-Time & Concurrency (`service_examspro`, `service_tutorspro`, `service_puzzlepro`, `service_coursespro`)**:
   - Implement CBT exam timers, tutor booking locks, and algorithmic XP sorted sets.
6. **Phase 6 — Multi-Tenant Validation & Production Rollout**:
   - Execute full tenant-isolation regression tests, verify zero cross-school contamination, and deploy to production.

---

## 13. Non-negotiable engineering principles

1. **Neon Remains the Source of Truth**: All permanent academic, student, financial, and institution records belong in Neon Postgres. Redis is an ephemeral acceleration and operational synchronization layer.
2. **Mandatory School Tenancy Isolation**: Every tenant-scoped cache operation must enforce authenticated server-side `tenant_id` context. Cross-tenant cache access is strictly forbidden.
3. **Fail-Safe Design**: Read cache failures must never crash applications or deny users access to their portals. Security rate limits and financial mutexes must fail safely.
4. **Explicit TTLs on All Keys**: No key shall be written to Redis without an explicit Time-To-Live, preventing memory bloat and stale data accumulation.
5. **Zero Credential Exposure**: Redis connection strings and REST tokens must never be accessible to frontend clients or checked into source control.
6. **Test-Backed Rollout**: No caching layer will be deployed to production without automated tests validating tenant boundaries, invalidation triggers, and performance improvements.

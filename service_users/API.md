# API Reference: `service_users`

The unified API is accessible at `http://localhost:7000` (or `https://users.resultspro.ng`, `https://auth.resultspro.ng`, `https://acad.resultspro.ng`).

---

## 1. Identity & Central Authentication

### `POST /auth/signup` (or `/api/v1/auth/signup`)
Registers a new user account and dispatches an OTP verification email.
```json
// Request
{
  "email": "teacher@greenwoodhigh.edu.ng",
  "password": "SecurePassword123!",
  "full_name": "Mr. Adeniyi",
  "phone": "+2348012345678",
  "sex": "male",
  "date_of_birth": "1988-05-14",
  "address": "123 Academic Way"
}

// Response (201 Created)
{
  "message": "User created. Please check your email for the verification code.",
  "user_id": "2db093ed-bdc9-47c4-b71c-66869f0f1ea7",
  "email": "teacher@greenwoodhigh.edu.ng"
}
```

### `POST /auth/login` (or `/api/v1/auth/login`)
Authenticates users via email and password.
```json
// Request
{
  "email": "teacher@greenwoodhigh.edu.ng",
  "password": "SecurePassword123!"
}

// Response (200 OK)
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "7a8b9c...",
  "user": {
    "id": "2db093ed-bdc9-47c4-b71c-66869f0f1ea7",
    "email": "teacher@greenwoodhigh.edu.ng",
    "full_name": "Mr. Adeniyi",
    "account_status": "active"
  }
}
```

### `POST /auth/introspect` (or `/api/v1/auth/introspect`)
Validates a user's session token on behalf of a sub-application.
* **Headers**: `X-App-ID: your-app-id`, `X-App-Secret: your-secret`
```json
// Request
{
  "token": "eyJhbGciOi..."
}

// Response (200 OK)
{
  "active": true,
  "user": {
    "id": "111efa7d-e12d-4ed1-9902-d341c6826b50",
    "email": "student@example.com",
    "full_name": "Jane Doe",
    "account_status": "active"
  }
}
```

### `POST /auth/refresh` (or `/api/v1/auth/refresh`)
Generates a new access token using a valid refresh token.

### `POST /auth/logout` & `POST /auth/logout-all`
Revokes single or all active refresh tokens for the user.

### Account Management
- `POST /auth/verify-email`: `{ "token": "123456" }`
- `POST /auth/forgot-password`: `{ "email": "user@example.com", "redirect_url": "..." }`
- `POST /auth/reset-password`: `{ "token": "...", "new_password": "..." }`
- `PATCH /auth/update-profile`: `{ "full_name": "...", "phone": "...", "avatar_url": "..." }`
- `POST /auth/change-password`: `{ "old_password": "...", "new_password": "..." }`
- `POST /auth/change-email`: `{ "new_email": "..." }`

### Multi-Factor Authentication (MFA)
- `POST /auth/mfa/setup`: Generates TOTP secret and QR URL.
- `POST /auth/mfa/verify`: Activates MFA with code validation.
- `POST /auth/mfa/disable`: Deactivates MFA.
- `POST /auth/mfa/challenge`: Completes login step 2.

---

## 2. Universal Handshake & Profiles

### `GET /intelligence/profile/{userId}` (or `/api/v1/users/{userId}/profile`)
Resolves full user ecosystem context.
```json
// Response (200 OK)
{
  "user_id": "111efa7d-e12d-4ed1-9902-d341c6826b50",
  "email": "student@example.com",
  "full_name": "Jane Doe",
  "account_status": "active",
  "roles": [
    {
      "tenant_id": "tenant-1",
      "tenant_name": "Greenwood High",
      "tenant_slug": "greenwood-high",
      "subscription_tier": "PRO",
      "role": "student",
      "status": "active"
    }
  ],
  "enrollment": [
    {
      "tenant_id": "tenant-1",
      "class_name": "Grade 10 (SS1)",
      "section_name": "10A (Science)",
      "session_name": "2025/2026"
    }
  ]
}
```

### `POST /intelligence/profiles/bulk` (or `/api/v1/users/profiles/bulk`)
Lightweight context for leaderboards in examsPRO and result sheets in ResultPRO.
```json
// Request
{
  "user_ids": ["uuid-1", "uuid-2"]
}

// Response (200 OK)
{
  "uuid-1": {
    "user_id": "uuid-1",
    "full_name": "Jane Doe",
    "tenant_name": "Greenwood High",
    "class_name": "Grade 10",
    "role": "student"
  }
}
```

---

## 3. Organizations & Tenants

- `POST /api/v1/tenants` (or `/intelligence/tenant/create`): Register tenant.
- `GET /api/v1/tenants/{tenantId}`: Fetch tenant details.
- `PATCH /api/v1/tenants/{tenantId}/verify`: Update verification status (`VERIFIED`, `REJECTED`).
- `GET /intelligence/tenant/{tenantId}/hierarchy`: Get classes, sections, and subjects.
- `GET /intelligence/tenant/{tenantId}/branding`: Get TenantHub branding and custom theme settings.
- `POST /intelligence/tenant/{tenantId}/branding`: Update branding and contact information.
- `POST /api/v1/tenants/{tenantId}/roles`: Assign role to user (`student`, `teacher`, `parent`, `tenant-admin`).

---

## 4. Family Relationships

- `GET /intelligence/verify-relation?parent={parentId}&child={studentId}`: Validates parental authorization.
- `POST /api/v1/family/relationships`: Create parent-child link.
- `GET /api/v1/family/parents/{parentId}/children`: List children for parent dashboard.
- `GET /intelligence/class/parents?section_id={sectionId}`: Contact list for class parents.

---

## 5. Academics Graph Engine

- `GET /api/v1/tenants/{tenantId}/sessions` & `POST /api/v1/tenants/{tenantId}/sessions`: Academic sessions.
- `GET /api/v1/sessions/{sessionId}/terms` & `POST /api/v1/sessions/{sessionId}/terms`: Academic terms.
- `GET /api/v1/tenants/{tenantId}/classes` & `POST /api/v1/tenants/{tenantId}/classes`: Classes.
- `GET /api/v1/classes/{classId}/sections` & `POST /api/v1/classes/{classId}/sections`: Sections.
- `GET /api/v1/tenants/{tenantId}/subjects` & `POST /api/v1/tenants/{tenantId}/subjects`: Subjects.
- `GET /intelligence/student/{studentId}/subjects`: Active subjects enrolled by a student.
- `GET /intelligence/curriculum` & `POST /api/v1/curriculums`: National curriculums.
- `GET /intelligence/syllabus/tenant/{subjectId}`: Weekly syllabus topics.
- `POST /api/v1/syllabus/tenant/{subjectId}`: Add syllabus week & topics.
- `POST /api/v1/enrollments`: Enroll student into a class section & session.
- `POST /api/v1/assignments`: Assign teacher to section + subject + term.

---

## 6. Subscriptions Management

- `PATCH /intelligence/subscription` (or `POST /api/v1/subscriptions`): Update Tenant or User subscription.
- `GET /api/v1/subscriptions/tenant/{tenantId}`: Returns active plan, limits, and real-time usage quotas.
- `GET /api/v1/subscriptions/limits?tenant_id={id}&resource={students|teachers|results}`: Quick limit checker.

---

## 7. Agent Network

- `GET /intelligence/agent/{agentId}/portfolio`: List referred tenants and verification status.
- `GET /api/v1/agents/{agentId}/commissions`: Commission rate and earnings ledger.
- `POST /api/v1/agents/{agentId}/payout`: Request payout withdrawal.

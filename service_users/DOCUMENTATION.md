# Sub-App Integration Guide for `service_users`

This document details how downstream applications in the **ResultsPRO Suite** (`ResultPRO`, `ClassroomPRO`, `examsPRO`, `TutorsPRO`, `SchoolHub`, `SchoolHubApp`, `resultspro_ng`) interact with `service_users`.

---

## 1. Zero-PII & Central Identity Mandate

Sub-applications must **never** store user passwords, first/last names, or emails in their local databases.
- Sub-apps store only the Central `user_id` (`UUID`) as an immutable foreign reference.
- Name, avatar, and email are hydrated dynamically via `/auth/introspect` or `/intelligence/profile/{userId}`.

---

## 2. Token Verification (Authentication Middleware)

In your sub-app middleware (e.g. `auth.middleware.ts`):

```typescript
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const token = authHeader.substring(7);
  
  // Call service_users introspection endpoint
  const response = await fetch('http://localhost:7000/auth/introspect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-ID': process.env.SERVICE_USERS_APP_ID,
      'X-App-Secret': process.env.SERVICE_USERS_APP_SECRET
    },
    body: JSON.stringify({ token })
  });

  const data = await response.json();
  if (!data.active) {
    return res.status(401).json({ error: 'Session expired or invalid', reason: data.reason });
  }

  if (data.user?.account_status === 'suspended') {
    return res.status(403).json({ error: 'Account suspended' });
  }

  req.user = data.user;
  next();
}
```

---

## 3. Sub-App Specific Workflows

### 📊 ResultPRO (Assessments & Gradebooks)
- **Profile Context**: Fetches student class and subjects via `GET /intelligence/student/{studentId}/subjects`.
- **Parent Access**: Protects student report card downloads with `GET /intelligence/verify-relation?parent={parentId}&child={studentId}`.
- **Subscriptions**: Verifies results processing limits via `GET /api/v1/subscriptions/limits?school_id={id}&resource=results`.

### 📚 ClassroomPRO (LMS & Study Materials)
- **Classroom Roster**: Fetches class hierarchy and students via `/intelligence/school/{schoolId}/hierarchy`.
- **Syllabus Sync**: Pulls official curriculum topics from `/intelligence/syllabus/school/{subjectId}` to anchor study notes and lesson plans.
- **Resource Linking**: Registers quizzes and study flashcards to syllabus topics via `POST /api/v1/resources/link`.

### ⚡ examsPRO (CBT Engine & Gamification)
- **Enrollment Check**: Verifies student enrollment status before granting access to exam halls.
- **Leaderboards**: Decorates leaderboard user rankings without N+1 queries using `POST /intelligence/profiles/bulk`.

### 👨‍🏫 TutorsPRO (Private Tutoring Marketplace)
- **Expertise Validation**: Validates tutor expertise against standardized subjects in `service_users`.
- **Guardian Verification**: Confirms parent relationship before booking tutoring appointments for a student.

### 🏫 SchoolHub & SchoolHubApp (Parent Portal & White-Label App)
- **Dynamic Skinning**: Skins UI on-the-fly using branding data from `GET /intelligence/school/{schoolId}/branding` (motto, logo, colors, and custom hero content).
- **Parent Dashboards**: Fetches all linked children for a parent via `GET /api/v1/family/parents/{parentId}/children`.

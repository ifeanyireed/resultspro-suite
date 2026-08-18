# Application Slugs & Routes

This file contains a comprehensive list of all the frontend routes and slugs implemented in the ResultsPRO Exams project.

## Student Interface

### Authentication & Onboarding
- `/` - Home Page
- `/login` - User Login
- `/signup` - User Registration
- `/onboarding` - Welcome/Onboarding Flow
- `/splash` - Splash Screen

### Personal & Dashboard
- `/dashboard` - Main Dashboard
- `/profile` - User Profile
- `/settings` - Application Settings
- `/notifications` - Notifications Center
- `/achievements` - User Achievements
- `/analytics` - Personal Study Analytics
- `/archive` - Saved Questions & History
- `/referral` - Referral Program (Give 25, Get 25)

### Learning & Examination
- `/practice` - Exam Selection Lobby
- `/practice/[examId]` - Subject Selection for a specific Exam
- `/practice/[examId]/[subjectId]` - Topic Selection & Session Entry
- `/quiz` - Active Quiz Session Interface
- `/quiz/explanation` - AI-powered detailed explanations
- `/quiz/result` - Session Results & Feedback
- `/study-assistant` - AI Study Assistant Interface

### Competitive & Social
- `/battle-mode` - 1v1 Battle Selection Lobby
- `/battle-mode/matchmaking` - Matchmaking Interface
- `/battle-mode/screen` - Active 1v1 Battle Session
- `/battle-mode/result` - Battle Outcome & ELO Updates
- `/live` - Live Synchronous Game Lobby (Multiplayer)
- `/live/[roomId]` - Room Waiting Area
- `/live/[roomId]/play` - Synchronous Gameplay Interface
- `/live/[roomId]/result` - Live Game Results Summary
- `/spectate` - Global Spectator Lobby
- `/spectate/[roomId]` - Spectating a Live Session
- `/spectate/[roomId]/result` - Game Summary (Spectator View)
- `/leaderboard` - Competitive Rankings (ELO, Coins, Streaks)
- `/tournament` - Tournament Hub

### Commerce
- `/shop` - Coin Store & Premium Plans

---

## Administrative Interface (Protected)

- `/admin/login` - Admin Authentication
- `/admin/dashboard` - Platform Overview & KPIs
- `/admin/analytics` - System-wide Growth Analytics
- `/admin/users` - User Management List
- `/admin/users/[userId]` - Detailed User Profile Control
- `/admin/questions` - Question Database Management
- `/admin/questions/new` - Question Creator
- `/admin/subjects` - Subject, Exam, and Topic Hierarchy
- `/admin/transactions` - Platform Transaction & Coin Logs
- `/admin/referrals` - Referral Program Analytics
- `/admin/battles` - Battle Monitoring & Logs
- `/admin/moderation` - Moderation Queue
- `/admin/settings` - Global Platform Configuration

### Live Game Management
- `/admin/live/setup` - Live Room Creation & Scheduling
- `/admin/live/control/[roomId]` - Live Room Controller (Push Questions, Start Match)
- `/admin/live/analytics/[roomId]` - Real-time Participant Analytics
- `/admin/live/summary/[roomId]` - Post-game Performance Summary

---

## Test Accounts (RBAC)

Seed accounts (Password: `password123`):

| Role | Email | Purpose |
| :--- | :--- | :--- |
| **ADMIN** | `admin@resultspro.ng` | Full platform control & User management |
| **MODERATOR** | `moderator@resultspro.ng` | Content curation & Question management |
| **STUDENT** | `student@resultspro.ng` | Standard practice, battles, and live games |

---

## AI Features & Question Management Walkthrough

### 1. Mass Question Seeding
Initial questions have been seeded for:
- **JAMB/UTME:** Physics (Optics)
- **WAEC:** Mathematics (Algebra)
- **SAT:** English Reading

### 2. Admin Question Management Flow
Authorized admins/moderators can manage questions via the following flow:

#### A. Viewing & Bulk AI Generation
1. Navigate to `/admin/questions`.
2. The system fetches real-time data from the SQLite database.
3. For questions missing explanations, a **"Generate AI"** button (Sparkles icon) is available.
4. Clicking it calls the Gemini API to produce a high-quality pedagogical explanation, which is then saved to the database.

#### B. AI-Assisted Creation
1. Navigate to `/admin/questions/new`.
2. Select the Exam, Subject, and Topic from the metadata sidebar.
3. Type a rough draft of your question in the "Question Body" area.
4. Click **"AI Assist"**.
5. The Gemini API will:
   - Refine the question text for clarity.
   - Generate 4 plausible MCQ options (A-D).
   - Identify the correct option.
   - Write a comprehensive step-by-step explanation.
6. Review the generated content, make manual adjustments if needed, and click **"Publish Question"**.

#### C. CSV Bulk Upload
1. Navigate to `/admin/questions`.
2. Click **"Bulk Import"**.
3. Select a `.csv` file with the following columns:
   - `topicId`: The ID of the topic (get these from /admin/subjects).
   - `bodyText`: The question text.
   - `difficulty`: `easy`, `medium`, or `hard`.
   - `optionA`, `optionB`, `optionC`, `optionD`: The text for each option.
   - `correctOption`: The letter of the correct option (`A`, `B`, `C`, or `D`).
   - `explanation`: (Optional) Pre-written explanation.
4. The system will process all rows in a single database transaction.

### 3. Gemini API Configuration
The system uses `gemini-1.5-flash` for high-speed, engaging educational content.
- **Service File:** `backend/src/utils/gemini.ts`
- **Prompt Logic:** Specifically tuned to behave as an expert ResultsPRO tutor.

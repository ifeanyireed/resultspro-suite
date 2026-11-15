# CampusPRO Master Webinar & Institutional Operations Manual
**Document Reference:** `coursespro/campuspro_webinar.md`  
**Edition:** 2026 Enterprise Release (Institutional ERP & Campus Operating System)  
**Target Platform:** ResultsPRO Suite · Scholars Portal · CampusPRO Go Engine (`service_campuspro`)  
**Scope:** Complete 4-Pillar Operations Manual (Teacher, Student, Administrator, Parent)  
**Primary Portal URLs:**
* **Admin Command Center:** [`/admin/campus-os`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/admin/campus-os)
* **Parent Command Portal:** [`/parent/campus-os`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/parent/campus-os/page.tsx)
* **Teacher Workspace:** [`/teacher/campus-os`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/teacher/campus-os/page.tsx)
* **Student Operations Hub:** [`/student/campus-os`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/student/campus-os/page.tsx)

---
# 🧑‍🏫 PART 1: TEACHER PORTAL & CAMPUS OPERATIONS GUIDE

---

## 🎬 Webinar Masterclass Overview

### Objective
This webinar guide trains educators, form tutors, subject specialists, and academic coordinators on how to leverage the **Teacher Portal** to eliminate manual paperwork, automate student roll call registers, track homework problem sets, manage student welfare/discipline, and coordinate with campus infrastructure in real-time.

### Target Personas
* **Classroom Form Tutors:** Responsible for daily morning roll calls, pupil pastoral tracking, exeat verifications, and clinic referrals.
* **Subject Specialists (STEM, Arts, Commercials):** Responsible for timetable pacing, laboratory bookings, homework distribution, and Continuous Assessment (CA) grading.
* **Head of Departments (HoDs) & Senior Masters:** Responsible for faculty biometric punctuality, curriculum supervision, and inter-departmental notices.

---

## 🧭 Section 1: Navigation Architecture & Global Context

The Teacher Portal is organized into a clean 3-tier enterprise hierarchy accessible from the portal sidebar ([`PortalSidebar.tsx`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/components/PortalSidebar/PortalSidebar.tsx)):

```
┌─────────────────────────────────────────────────────────────────┐
│                     TEACHER PORTAL SIDEBAR                      │
├─────────────────────────────────────────────────────────────────┤
│  [1] DASHBOARD                                                  │
│      └─ Overview             -> /teacher/dashboard              │
│                                                                 │
│  [2] MODULAR SUITE                                              │
│      ├─ ClassroomPRO         -> /teacher/classroom              │
│      ├─ TutorsPRO            -> /teacher/tutors                 │
│      ├─ PuzzlePRO            -> /admin/puzzlepro                │
│      └─ ResultsPRO           -> /admin/results                  │
│                                                                 │
│  [3] OPERATIONS                                                  │
│      └─ CampusPRO            -> /teacher/campus-os              │
└─────────────────────────────────────────────────────────────────┘
```

### Multi-Campus & Institutional Context
* **Tenant Isolation:** Every action is strictly scoped to the educator's active school tenant (`tenant_id`), guaranteeing zero data leakage across institutions on the shared database.
* **Branch Switcher:** If an institution operates multiple campus sites (e.g., Lekki Main Campus, Ikeja Annex), teachers can filter class arms, venues, and timetables via the top-bar campus dropdown.

---

## 🖥️ Section 2: The Teacher Command Dashboard (`/teacher/dashboard`)

The dashboard at [`/teacher/dashboard`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/teacher/dashboard/page.tsx) serves as the primary morning cockpit for educators.

```
+---------------------------------------------------------------------------------------------------------+
| FACULTY ACADEMIC COMMAND  Mr. Ifeanyi Felix · Senior STEM Faculty      [Term: Active]  [↻ Refresh]     |
+---------------------------------------------------------------------------------------------------------+
| [ Assigned Classes: 3 ] | [ Learners: 107 ] | [ Pending Grading: 18 ] | [ Today's Attendance: 94.6% ]   |
+---------------------------------------------------------------------------------------------------------+
| [⚡ Biometric Action: CLOCKED IN at 07:48 AM via Turnstile Gate A - Punctual Status: ON TIME]           |
+---------------------------------------------------------------------------------------------------------+
| [Tabs: [Overview] | [Modular Suite] | [CampusPRO] ]                                                     |
|                                                                                                         |
|   OVERVIEW TAB:                                                                                         |
|   ┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐     |
|   │ Today's Bell Schedule (Timetable)            │ │ Homework & CA Queue                          │     |
|   │ • P1: 08:00 AM - Physics (SS3 Science B)     │ │ • SSS 3 Newton's Laws (Due: Tomorrow)        │     |
|   │ • P2: 08:50 AM - Physics Lab Practical       │ │ • JSS 1 Intro to Energy (31/35 graded)       │     |
|   │ • P3: 10:10 AM - Further Mathematics         │ │ [+ Assign Homework Modal]                    │     |
|   └──────────────────────────────────────────────┘ └──────────────────────────────────────────────┘     |
|   ┌─────────────────────────────────────────────────────────────────────────────────────────────┐       |
|   │ Official Campus Circulars & Administrative Advisories                                       │       |
|   │ • Principal Notice: Mid-Term Cognitive Assessment Broadsheet Submission Deadlines           │       |
|   └─────────────────────────────────────────────────────────────────────────────────────────────┘       |
+---------------------------------------------------------------------------------------------------------+
```

### Key Interactive Features
1. **Faculty Biometric Punctuality Bar:**
   * Displays the teacher's physical gate turnstile or mobile check-in time.
   * If not clocked in, educators click **"Clock In Now"** to record an authenticated check-in timestamp (`/v1/campus/attendance/clock`).
2. **KPI Telemetry Cards:**
   * **Assigned Classes:** Count of active arms where the teacher is form master or subject tutor.
   * **Learners Taught:** Total aggregated roster count.
   * **Pending Homework Submissions:** Real-time count of student homework submissions awaiting review.
   * **Today's Attendance:** Aggregated percentage of learners present across assigned classrooms.
3. **Modular Suite Tabs:**
   * Access to **ClassroomPRO** (lesson plans, stream), **TutorsPRO** (remedial 1:1 sessions), **PuzzlePRO** (STEM coding challenges), and **ResultsPRO** (continuous assessment score entry).
4. **CampusPRO Quick Launcher:**
   * Direct button: **"Launch Full CampusPRO Workspace →"** taking the educator to `/teacher/campus-os`.

---

## 🏫 Section 3: The Dedicated CampusPRO Workspace (`/teacher/campus-os`)

The full operations desk at [`/teacher/campus-os`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/teacher/campus-os/page.tsx) provides 9 dedicated modules specifically designed for daily classroom operations.

---

### Module 1: Classroom Roll Call Register (`subtab=rollcall`)
*The electronic attendance register replacing paper ledger books.*

```
+---------------------------------------------------------------------------------------------------------+
| CLASSROOM ROLL CALL ATTENDANCE REGISTER                                                                  |
| Class Arm: [ SSS 3 · Science B (38 pupils) ▼ ]   Date: [ 2026-11-15 📅 ]                                 |
|                                                                                                         |
| Bulk Set: [ ✓ All Present ]  [ ✕ All Absent ]         [ ✓ Register Saved ]  [ Save & Submit Register ]  |
+---------------------------------------------------------------------------------------------------------+
| #  | Student Name        | Admission No.  | Gender | Status Toggle                   | Pastoral Notes   |
|----+---------------------+----------------+--------+---------------------------------+------------------|
| 1  | Mustapha Bello      | ADM-2026-001   | MALE   | [PRESENT] [LATE] [ABSENT] [EXC] |                  |
| 2  | Somtochukwu Eze     | ADM-2026-002   | MALE   | [PRESENT] [LATE] [ABSENT] [EXC] |                  |
| 3  | Blessing Okoli      | ADM-2026-003   | FEMALE | [PRESENT] [LATE] [ABSENT] [EXC] | Excused - Clinic |
| 4  | Ibrahim Yakubu      | ADM-2026-004   | MALE   | [PRESENT] [LATE] [ABSENT] [EXC] | 08:35 AM bus     |
+---------------------------------------------------------------------------------------------------------+
```

#### Step-by-Step Narration Guide:
1. **Select Class Arm & Date:** Select the class arm from the dropdown (defaults to your assigned form class) and choose the attendance date (defaults to today).
2. **Instant Roster Population:** The system queries `/v1/campus/attendance/rollcall` and immediately populates all enrolled students with their gender, admission number, and existing log status.
3. **One-Click Bulk Actions:** If the majority of students are in class, click **"✓ All Present"** to mark everyone present in a single click, then manually toggle the few who are late, absent, or excused.
4. **Four Distinct Status Toggles:**
   * **`PRESENT` (Green):** Learner seated on time in class.
   * **`LATE` (Amber):** Learner arrived after the official morning cutoff (records arrival timestamp).
   * **`ABSENT` (Red):** Learner unverified; flags truant alert in the school management records.
   * **`EXCUSED` (Indigo):** Authorized absence (approved leave, sports representation, external competition).
5. **Pastoral & Medical Notes:** Type any relevant note in the rightmost text box (e.g., *"Admitted to sick bay"* or *"Authorized by Vice Principal"*).
6. **Submit & Persist:** Click **"Save & Submit Register"**. The system batch-persists all entries to `campus_attendance_logs` with verification mode `ROLL_CALL` and updates parental and institutional dashboards.

---

### Module 2: Bell Schedule & Timetable (`subtab=timetable`)
*Synchronized daily teaching periods and room allocations.*

* **Visual Grid:** Shows Period Number, Day of the Week, Exact Time Slot (e.g. `08:00 AM - 08:50 AM`), Subject, Assigned Class Arm, and Room/Venue (e.g., `Physics Lab Block A`).
* **Conflict Prevention:** Generated directly by the institutional timetable engine; prevents double-booking of teachers and rooms.

---

### Module 3: Homework & Continuous Assessments (`subtab=homework`)
*Publish problem sets, set deadlines, and monitor student turn-in rates.*

* **Active Assignments Table:** Displays assignment title, subject, target class, submission counters (e.g., `28/35 Submissions`), max score, and publication status.
* **"Assign Homework" Modal:**
  1. Click the **"+ Assign Homework"** button.
  2. Fill in: **Title** (e.g., *Newton's Laws Problem Set 1*), **Subject**, **Target Class**, **Due Date**, **Max Score** (default 100), and **Instructions/Description**.
  3. Click **"Publish to Class"**. The homework is immediately posted to student portals via `/v1/campus/homework`.

---

### Module 4: Student Discipline, Merits & Demerits (`subtab=discipline`)
*Pastoral tracking for behavioral infractions and character commendations.*

```
+---------------------------------------------------------------------------------------------------------+
| PASTORAL CARE, DEMERITS & COMMENDATIONS                                                                  |
| [+ Report Infraction (Demerit)]  [★ Award Commendation (Merit)]                                         |
+---------------------------------------------------------------------------------------------------------+
| Student Name   | Class | Category            | Severity / Points   | Description   | Reported By        |
|----------------+-------+---------------------+---------------------+---------------+--------------------|
| Daniel Ojo     | SS 3  | Lateness & Uniform  | MINOR (-5 pts)      | Late to class | Mr. Ifeanyi Felix  |
| Chioma Chukwuma| SS 3  | STEM Innovation     | MERIT (+20 pts)     | Robotics Win  | Senior Form Master |
+---------------------------------------------------------------------------------------------------------+
```

#### Step-by-Step Narration Guide:
1. **Reporting an Infraction (Demerit):**
   * Click **"Report Infraction"**.
   * Enter the student's name and class.
   * Select Category (e.g., *Lateness & Truancy*, *Uniform Violation*, *Classroom Disturbance*).
   * Choose Severity:
     * **Minor:** -5 points
     * **Moderate:** -10 points
     * **Severe:** -20 points (triggers administrative alert)
   * Write a clear narrative description and click **"Submit to Pastoral Registry"**.
2. **Awarding a Commendation (Merit):**
   * Click **"Award Merit"**.
   * Enter the student's name, award title (e.g., *Peer Tutoring Excellence*, *Science Exhibition Winner*), and merit points (+10, +20).
   * Submits directly to the institutional gamification and conduct scorebook.

---

### Module 5: Clinic / Sick Bay Referrals (`subtab=clinic`)
*Safeguarding student health with seamless clinic hand-offs.*

* **Infirmary Monitor Table:** Real-time visibility into students from your classes currently admitted in the clinic (Symptoms, Nurse on duty, Bed Number, and Time Admitted).
* **"Send Pupil to Sick Bay" Workflow:**
  1. When a pupil falls ill during class, click **"Send Pupil to Sick Bay"**.
  2. Fill in the student's name, class, observed symptoms (e.g., *Severe abdominal pain, fever*), and **Triage Urgency**:
     * **`LOW`:** Mild discomfort, headache.
     * **`MEDIUM`:** High fever, vomiting, asthma symptoms.
     * **`EMERGENCY`:** Acute trauma, fainting, severe injury.
  3. Click **"Dispatch to Sick Bay"**. The school nurse receives the incoming referral instantly, ensuring the student is logged and not marked truant.

---

### Module 6: Science Labs & Venue Bookings (`subtab=facilities`)
*Reserve specialized campus infrastructure for practicals and exams.*

* **Supported Facilities:** Physics Lab, Chemistry & Wet Science Lab, ICT CBT Testing Hall, School Main Auditorium, Sports Complex.
* **Reservation Flow:**
  1. Click **"Reserve Lab / Venue"**.
  2. Select the venue and enter the **Practical Session Title** (e.g., *SS3 Optics & Refraction Practical*).
  3. Set Date, Start Time, End Time, and estimated student count.
  4. Click **"Confirm Reservation"**. Automatically locks the venue slot to prevent scheduling clashes.

---

### Module 7: Boarder Hostel & Exeat Verification (`subtab=hostel`)
*Form tutor oversight for boarding pupils.*

* **Exeat Slips:** View authorized weekend, medical, or emergency exeat passes.
* **Security Passcodes:** Cross-check student exeat passcodes (`EXT-XXXXXX`) against the physical gate terminal to verify departure and return deadlines.

---

### Module 8: Curriculum Library References (`subtab=library`)
*Textbook catalog and syllabus pacing references.*

* Search by subject, author, or curriculum topic.
* View available physical shelf copies and reserve class reading sets for classroom research blocks.

---

### Module 9: Campus Circulars & Messaging (`subtab=messaging`)
*Official administrative communications hub.*

* Read high-priority directives, academic term calendars, and inspection schedules issued by the Principal's Office.
* Filter by channel (Staff Broadcast, Academic Advisory, Emergency Alert).

---

### Module 10: Teaching Supplies & Store Requisitions
*Procure classroom consumables, laboratory reagents, and stationery.*

* Review submitted Purchase Order (PO) requisitions, priority flags, and fulfillment status from central procurement.
* Track needed-by dates and delivery confirmations without leaving the faculty desk.

---

### Module 11: Co-Curricular Houses & Student Clubs
*Oversee school houses and student extracurricular activities.*

* **House Masters:** Monitor inter-house sports points, total student membership, and house mottos (e.g., Blue Diamond House, Emerald Falcon House).
* **Club Patrons:** Supervise meeting schedules, assigned club venues (e.g., Robotics Club in ICT Hall, Literary & Debating Society in Library), and attendance rosters.

---

### Module 12: Faculty Campus Duty Roster
*Staff weekly supervision protocol across campus.*

* View assigned duty rotations: Morning Assembly & Gate Protocol, Dining Hall & Lunchtime Prep, Evening Study Hall Supervision.
* Timestamps and venue confirmations synchronized with administrative operations.

---

## 🎙️ Section 4: Live Webinar Script & Host Talking Points

### Slide 1: Welcome & Value Proposition (00:00 - 05:00)
> **Host Narration:**  
> *"Good morning, esteemed colleagues, school leaders, and educators. Today, we are excited to unveil the newly upgraded Teacher Portal on ResultsPro and Scholars.ng. As teachers, you spend an average of 45 minutes every single day filling out paper registers, writing clinic chits, compiling homework scores, and walking down corridors to book science labs. Today, all of that changes. Everything you need to teach, mark, manage, and safeguard your students is now accessible in one persistent, real-time command center."*

### Slide 2: Morning Routine & Biometric Check-In (05:00 - 10:00)
> **Host Narration:**  
> *"When you arrive at school in the morning, your first stop is the Teacher Dashboard at `/teacher/dashboard`. In the top banner, your attendance status is automatically synchronized from the physical turnstile gates. If you are operating on a mobile device, one click on 'Clock In Now' timestamps your check-in. Below, your four live KPI cards tell you immediately how many arms you teach today, your total learners, and any pending homework submissions waiting for your marks."*

### Slide 3: The Electronic Class Roll Call (10:00 - 20:00)
> **Host Narration:**  
> *(Live Demo Screen: Navigate to `/teacher/campus-os?subtab=rollcall`)*  
> *"Now let's look at the morning register. Gone are the days of paper attendance booklets that get misplaced. Simply select your class arm—for example, SSS 3 Science B. Immediately, all 38 students appear with their official admission numbers. If everyone is seated, click 'All Present'. If Master Mustapha arrived at 8:35 AM, simply toggle him to 'Late'. If Blessing is at the clinic, toggle 'Excused' and type 'Sick bay' in the notes. Hit 'Save & Submit Register'—and instantly, parents, the principal, and your institutional records are completely up to date."*

### Slide 4: Student Welfare, Demerits & Clinic Hand-off (20:00 - 30:00)
> **Host Narration:**  
> *(Live Demo Screen: `/teacher/campus-os?subtab=discipline` & `?subtab=clinic`)*  
> *"What happens when a student exhibits exemplary character or commits an infraction? Under 'Merits & Demerits', you can record commendations for robotics competitions or log demerits for uniform infractions. More importantly, when a learner falls sick during a double period, you don't send them with a scrap of paper. You open the 'Sick Bay' tab, click 'Send Pupil to Sick Bay', select Emergency or Medium urgency, and dispatch. The school nurse sees the student incoming on her clinic tablet, and you can see which bed they are resting in without leaving your classroom."*

### Slide 5: Lab Bookings & Homework Distribution (30:00 - 40:00)
> **Host Narration:**  
> *(Live Demo Screen: `/teacher/campus-os?subtab=facilities` & `?subtab=homework`)*  
> *"Need to conduct a titration experiment in the Chemistry Lab? Under 'Lab & Venues', book the laboratory for Wednesday Period 3. The system locks the room so no other teacher double-books it. Finally, distribute continuous assessment problem sets under 'Homework & CA'. Learners receive the assignment on their student portal, submit digitally, and you grade with full rubric support."*

### Slide 6: Q&A & Wrap-Up (40:00 - 45:00)
> **Host Narration:**  
> *"Thank you for your dedication to academic excellence. With CampusPRO, teaching becomes frictionless, institutional governance becomes airtight, and every learner's potential is tracked and nurtured. Let us now take your questions."*

---

## ❓ Section 5: Teacher Frequently Asked Questions (FAQ)

### Q1: What happens if I make a mistake on the attendance register after submitting?
**Answer:** Simply re-open the class arm on the same date, change the status of the specific learner (e.g. from `ABSENT` to `LATE`), and click **"Save & Submit Register"**. The system performs an idempotent upsert in the database without creating duplicate entries.

### Q2: Does marking a student "Excused" penalize their attendance score?
**Answer:** No. The system calculates institutional attendance percentage based on present days versus expected days. An `EXCUSED` status does not negatively impact the student's term punctuality rating.

### Q3: How do parents receive homework notifications?
**Answer:** When you click **"Publish to Class"** in the Homework Manager, the problem set is dispatched to the Student Portal and mirrored on the Parent Command Dashboard (`/parent/dashboard`) under their child's academic feed.

### Q4: Can subject teachers access class arms they don't own as form teachers?
**Answer:** Yes. The dropdown lists all class arms assigned to your teaching load. Form masters have primary roll call responsibility, while subject teachers can view rosters and assign subject homework.

### Q5: Is data saved if my internet connection drops during roll call?
**Answer:** The interface maintains your active selections locally in the browser state until you regain connection and click **"Save & Submit Register"**.


---

# 🎓 PART 2: STUDENT PORTAL & CAMPUS OPERATIONS GUIDE

**Target Personas:**
* **Senior Secondary Students (SS1–SS3 / Grades 10–12):** Focused on terminal examination clearance, WAEC/JAMB syllabus pacing, continuous assessments, broadsheets, and prefect leadership.
* **Junior Secondary Learners (JSS1–JSS3 / Grades 7–9):** Focused on daily bell schedule adherence, homework submissions, coding clubs, and sports house competitions.
* **Boarding Students (Hostel Residents):** Utilizing digital exeat applications, roll-call verification, dining hall menus, and sick-bay referrals.
* **Day Transit Students:** Tracking assigned bus fleet corridors, morning pickup times, and driver contacts.

---

## 🧭 Section 6: Student Navigation Architecture & Global Context

The Student Portal eliminates loose screens and adopts the standardized 3-tier institutional hierarchy in the sidebar ([`PortalSidebar.tsx`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/components/PortalSidebar/PortalSidebar.tsx#L45-L52)):

```
┌─────────────────────────────────────────────────────────────────┐
│                     STUDENT PORTAL SIDEBAR                      │
├─────────────────────────────────────────────────────────────────┤
│  [1] DASHBOARD                                                  │
│      └─ Overview             -> /student/dashboard              │
│                                                                 │
│  [2] MODULAR SUITE                                              │
│      ├─ ClassroomPRO         -> /student/classroom              │
│      ├─ TutorsPRO            -> /student/tutors                 │
│      ├─ PuzzlePRO            -> /student/future-skills          │
│      └─ ResultsPRO           -> /student/results                │
│                                                                 │
│  [3] OPERATIONS                                                  │
│      └─ CampusPRO            -> /student/campus-os              │
└─────────────────────────────────────────────────────────────────┘
```

### Institutional Tenancy & Identity Context
* **Single-Tenant Isolation:** Every student record is verified by `tenant_id` at the database layer. No student can view rosters, notices, or broadsheets from other institutions.
* **Persistent Postgres Queries:** All telemetry is served dynamically from PostgreSQL via [`service_campuspro/handlers/student_dashboard.go`](file:///Volumes/ReedBreedCC/resultspro-suite/service_campuspro/handlers/student_dashboard.go) with zero client-side mock fallbacks.
* **Student Identity Card Context:** The top navigation tracks student admission number, class arm, house affiliation (e.g., *Sapphire House*), and active term (`2026/2027 · First Term`).

---

## 🖥️ Section 7: The Student Pulse Dashboard (`/student/dashboard`)

The student dashboard at [`/student/dashboard`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/components/Dashboard/StudentDashboard.tsx) mirrors the executive **Principal Pulse** design language, structured with a sticky 3-pillar horizontal navigation bar:

```
+---------------------------------------------------------------------------------------------------------+
| STUDENT PULSE  Kelechi Stephanie Okonkwo · Senior Secondary 3 (Science Diamond)   [Join Next Class ▶]   |
| Welcome back, Kelechi · Main Campus · Lekki Phase 1 · 2026/2027 (First Term)       [CampusPRO Desk 🏛]   |
+---------------------------------------------------------------------------------------------------------+
| [Pillar Tabs: [Overview] | [Modular Suite (4 Engines)] | [CampusPRO (Operations)] ]                      |
|                                                                                                         |
|   TOP 4 HERO KPI CARDS:                                                                                 |
|   ┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────┐ ┌──────────────────────┐  |
|   │ Academic Average (Hero)   │ │ Biometric Attendance      │ │ Coursework   │ │ Learning Time        │  |
|   │ 92.4%                     │ │ 97.4%                     │ │ 88.5%        │ │ 14.5h                │  |
|   │ [▲ GPA 3.84 · +4.2% Growth]│ │ [✓ 18-Day On-Time Streak] │ │ [2 Pending]  │ │ [Top 5% in Level]    │  |
|   └───────────────────────────┘ └───────────────────────────┘ └──────────────┘ └──────────────────────┘  |
|                                                                                                         |
|   12-COLUMN ACADEMIC & LOGISTICS GRID:                                                                  |
|   ┌────────────────────────────────────────────────────────┐ ┌────────────────────────────────────────┐ |
|   │ Today's Bell Schedule (Timetable)                      │ │ Recent Reports & Feedback              │ |
|   │ • P1: Further Mathematics [DONE]                       │ │ • Mathematics Homework Graded: A (94%) │ |
|   │ • P2: Physics Lab A (Electromagnetism) [LIVE NOW]      │ │ • Biometric Gate Check-In: 07:18 AM    │ |
|   │ • P3: Chemistry (Organic Compounds) [UPCOMING]         │ │ • Physics Virtual Lab Completed        │ |
|   ├────────────────────────────────────────────────────────┤ ├────────────────────────────────────────┤ |
|   │ Syllabus Coverage Progress Arc                         │ │ Focus Study Timer Photo Card           │ |
|   │ [======= 78% Milestone Syllabus Completed =======]     │ │ [ 01:24:08 ]                           │ |
|   ├────────────────────────────────────────────────────────┤ │ [ ⏸ Pause ]  [ ⏹ Stop ]               │ |
|   │ Modular Suite Launchpad                                │ └────────────────────────────────────────┘ |
|   │ [ClassroomPRO] [TutorsPRO] [PuzzlePRO] [ResultsPRO]    │                                            |
|   └────────────────────────────────────────────────────────┘                                            |
+---------------------------------------------------------------------------------------------------------+
```

### Pillar 1: Overview Tab
1. **Academic Average Hero Card (Dark Gradient):** Displays cumulative average grade (`92.4%`), term GPA badge (`3.84`), term-over-term growth indicator (`+4.2%`), and a direct link to the verified ResultsPRO broadsheet.
2. **Biometric Attendance Card:** Displays overall attendance rate (`97.4%`) and consecutive on-time punctuality streak (`18-Day Streak`).
3. **Coursework Completion Card:** Tracks assignment submission rate (`88.5%`) with alert count for pending assignments.
4. **Learning Time Card:** Tracks weekly focused study hours (`14.5h`) and class percentile ranking (`Top 5% in Level`).
5. **Today's Classes:** Real-time period schedule with visual indicators for the current active period, completed periods, and upcoming classrooms with room venues and teacher names.
6. **Syllabus Coverage Arc:** Progress gauge visualizing curriculum milestone completion.
7. **Modular Suite Launchpad:** Quick-entry tiles for ClassroomPRO (28 lesson notes), TutorsPRO (42 vetted tutors), PuzzlePRO (Python track, 7 badges), and ResultsPRO.
8. **Focus Study Timer:** Built-in interactive study session timer with play, pause, and stop controls.

### Pillar 2: Modular Suite (4 Specialist Engines)
Subtabs embedded directly inside the dashboard:
* **ClassroomPRO Subtab:** Review active lesson notes, Spaced Repetition (SRS) flashcards, and practice quiz countdowns.
* **TutorsPRO Subtab:** Check upcoming 1-on-1 private tutoring sessions (e.g., *English Diction with Mrs. Folashade*) with a one-click **"Join Room"** button.
* **PuzzlePRO Subtab:** View current algorithmic track (*Python Algorithms & Robotics Logic*), earned badges (`7 Badges`), and grade leaderboard standing (`#3 in Grade 12`).
* **ResultsPRO Subtab:** Review published term grades, cumulative GPA, best subject (*Mathematics 95%*), and official terminal broadsheet verification status.

### Pillar 3: CampusPRO (Operations Snapshot)
* **Today's Biometric Log:** Clock-in time (`07:18 AM`), gate terminal (`Main Turnstile Gate A`), and presence confirmation.
* **Transport Fleet Corridor:** Assigned bus route (*Route A · Lekki/Ikate*), pickup station, and morning departure schedule.
* **Library Loans:** Active book loan count and next due date countdown.
* **Deep Link:** Direct button to open the full **CampusPRO Operations Workspace** at `/student/campus-os`.

---

## 🏛️ Section 8: The Dedicated Campus Operations Hub (`/student/campus-os`)

The operations desk at [`/student/campus-os`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/student/campus-os/page.tsx) provides a full **13-module operational suite** for student logistics, welfare, and campus administration.

```
+---------------------------------------------------------------------------------------------------------+
| CAMPUSPRO OPERATIONS  Kelechi Stephanie Okonkwo · ID: SCH/2026/0412  [Sapphire House] [SS 3 Diamond]    |
| [+ Apply Exeat]  [🛠 Report Issue]  [❤ Sick Bay]  [↻ Refresh]  [← Overview]                             |
+---------------------------------------------------------------------------------------------------------+
| Subtabs:                                                                                                |
| [1. Timetable]  [2. Biometrics]  [3. Meal Wallet]  [4. Clubs/Sports]  [5. Merits]   [6. Fees/Bursary]   |
| [7. Bus Fleet]  [8. Library]     [9. Boarding]     [10. Clinic]       [11. Council] [12. Virtual ID]    |
| [13. Circulars]                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

---

### Module 1: Bell Schedule & Timetable (`subtab=timetable`)
* **Daily Period Breakdown:** 8 standardized Nigerian curriculum periods per day with subject, teacher, room/lab location, and time duration.
* **Live Status Badges:** Visual tags indicating `COMPLETED` (past periods), `ACTIVE` (current class), and `UPCOMING` (future classes).
* **Day-of-Week Switcher:** Filter schedule between `Mon`, `Tue`, `Wed`, `Thu`, and `Fri`.

### Module 2: Biometric Attendance & Gate Logs (`subtab=attendance`)
* **Live Gate Telemetry:** Confirms today's gate clock-in timestamp (`07:18 AM`) via optical turnstiles.
* **Punctuality Metrics:** Real-time attendance rate (`97.4%`) and consecutive on-time streak (`18 Days`).
* **7-Day Biometric Audit Table:** Full chronological log showing Date, Time-In, Time-Out, Terminal Gate (e.g. *Main Gate Turnstile A*), and Status (`PRESENT`, `LATE`, `EXCUSED`).

### Module 3: Cashless Meal Wallet & Dining Hall (`subtab=cafeteria`)
* **Live Wallet Card:** Balance display (`₦18,500`), student RFID card token (`RFID-SCH-0412`), and daily spending limit (`₦3,500.00`).
* **Today's 3-Course Dining Menu:**
  * **Breakfast (07:00 AM):** Pancake Stack with Honey Syrup, Boiled Eggs & Hot Chocolate.
  * **Lunch (01:00 PM):** Smoky Jollof Rice with Roasted Chicken & Diced Fried Plantain.
  * **Dinner (06:30 PM):** Pounded Yam with Egusi Soup & Steamed Fish.
* **Allergen Warnings:** Real-time dietary advisory (`Eggs, Gluten, Milk`).
* **Cashless Transaction Ledger:** Real-time log of canteen and tuck-shop POS swipes showing amount deducted, remaining balance, and item description.

### Module 4: Co-Curricular, Clubs & Sports (`subtab=cocurricular`)
* **Inter-House Championship:** House affiliation banner (**Sapphire House · Blue**), total house points (`1,240 Pts`), house master name (*Mr. Emeka Nwosu*), and personal points contribution (`+45 Pts`).
* **Enrolled Clubs & Societies Matrix:**
  * *JET / STEM Robotics Club:* Patron Engr. Funke Adebayo · Wednesdays 03:45 PM · STEM Lab Room 4.
  * *Debate & Literary Society:* Patron Mrs. Folashade Bakare · Thursdays 03:45 PM · Main Speech Hall.
  * *Junior Coders & AI Guild:* Patron Mr. Tunde Ogunlesi · Fridays 02:30 PM · ICT Suite 2.
* **Upcoming Sports Fixtures:** Inter-house football matches, athletics meets, and inter-school STEM Olympiads.

### Module 5: Pastoral Care, Merits & Demerits (`subtab=discipline`)
* **Conduct Rating:** Official citizenship grade (**Grade A · Exemplary Citizenship**).
* **Merits Earned:** Commendation point total (`+60 Pts`) across academic, leadership, and competition categories.
* **Merits Log Table:** Itemized award entries detailing Award Name (*Academic Distinction in Further Maths*), Points (`+25`), Reason, and Awarding Authority (*Dr. Olumide Adeleke*).
* **Behavioral Slate:** Official verification badge certifying zero disciplinary demerits.

### Module 6: Bursary, School Fees & Invoices (`subtab=financials`)
* **Exam Clearance Card:** Visual clearance card confirming **PAID IN FULL · Cleared for Exams**.
* **Clearance Verification Code:** Unique bursary validation token (`BURSARY-CLR-2026-OKW`) required for term examination hall admission.
* **Ledger Breakdown:** Total Billed (`₦285,000`), Amount Paid (`₦285,000`), Balance Due (`₦0.00`).
* **Itemized Fee Schedule:** Tuition, Science Laboratory levy, STEM/ICT platform fee, and examination dossiers.

### Module 7: School Bus Fleet & Transit (`subtab=transport`)
* **Route Corridor:** Transit route name (*Route A · Lekki / Ikate Corridor*) and assigned vehicle model (*BUS-01 Toyota Coaster Exec*).
* **Timetable:** Morning pickup stop (*Admiralty Way Junction*), scheduled pickup time (`06:45 AM`), and afternoon return departure (`03:45 PM`).
* **Driver & Attendant Contacts:** Driver name (*Mr. Sunday Adeleke*), bus attendant name (*Ms. Grace Udoh*), and direct click-to-call phone link.
* **GPS Status:** Real-time fleet tracking indicator (`EN_ROUTE` / `PARKED_ON_CAMPUS`).

### Module 8: Library Catalog & Book Reservations (`subtab=library`)
* **Borrowed Books List:** Active textbook loans (*Essential Mathematics*, *Principles of Modern Physics*), loan status (`BORROWED`), and return due dates.
* **Searchable Library Catalog:** Search field filtering by title, author, and curriculum subject.
* **One-Click Reservation:** Click **"Reserve"** to place a hold on available shelf copies for 48-hour pickup.

### Module 9: Boarding Hall & Digital Exeats (`subtab=hostel`)
* **Dormitory Allocation:** Boarding hall name (*Silverbird Hall · Senior Wing*), Room Number (*Room 204*), Bed Allocation (*Bed B*), and Housemaster contact.
* **Exeat Passes History:** Chronological log of submitted leave applications with departure date, return date, reason, approval status (`APPROVED` / `PENDING`), and digital pass code (`EXT-XXXX`).
* **Direct Exeat Application:** Trigger to open the Digital Exeat application modal.

### Module 10: Health Bay & Campus Clinic (`subtab=clinic`)
* **Medical Profile:** Blood group (`O+`), genotype (`AA`), certified academic fitness status, and 24/7 infirmary emergency hotline (`+234 803 449 8899`).
* **Allergy Alert Banner:** Active allergy warnings (*Peanuts, Mild Penicillin sensitivity*).
* **Consultation Logs:** Past sick-bay visits, observed symptoms, nurse diagnosis, administered treatment, and attending nurse name.
* **Active Medications:** Prescription schedule and dosage instructions (*Multivitamin Complex · 1 Tablet daily*).

### Module 11: Prefect Council & Student Leadership (`subtab=leadership`)
* **Student Leadership Office:** Student's official leadership appointment (*Class Captain & STEM Ambassador*).
* **Prefect Council Directory:** Contact channels and student leaders for Head Boy, Head Girl, Sports Prefect, Health & Sanitation Prefect, and Library Prefect.

### Module 12: Virtual Digital Student ID Card (`subtab=idcard`)
* **Front & Back Virtual Badge:** Institutional card with school crest, student photo avatar, full name, admission number, class, arm, house affiliation, and academic session.
* **Scannable Barcode & QR Token:** Digital barcode (`SCH-0412`) recognized by campus library scanners, cafeteria POS terminals, and turnstile gates.

### Module 13: Official Circulars & Notices (`subtab=notices`)
* **Categorized Memos:** Filter circulars by `ACADEMIC`, `SPORTS`, `EVENT`, and `ADMINISTRATIVE`.
* **Institutional Advisories:** Official notices signed by the Principal's Office and academic committees.

---

## ⚡ Section 9: Interactive Self-Service Desks (How-To Step-by-Step Guide)

Students can execute 4 critical institutional actions directly from their portal without walking to administrative offices:

```
┌─────────────────────────────────────────────────────────────────┐
│                 STUDENT SELF-SERVICE ACTIONS                    │
├─────────────────────────────────────────────────────────────────┤
│  [1] Apply for Digital Exeat Pass    -> POST /student/exeat     │
│  [2] Report Campus Facility Issue    -> POST /facility-report   │
│  [3] Book Sick-Bay Consultation      -> POST /clinic-appointment│
│  [4] Reserve Library Book            -> POST /library-reserve   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Action 1: Applying for a Digital Exeat Pass (Boarders)
1. In the top action bar of `/student/campus-os`, click **"Apply Exeat"** (or use the button inside the *Boarding & Exeats* subtab).
2. The **Apply for Digital Exeat Pass** modal opens:
   * **Exeat Type:** Select from dropdown:
     * *Weekend Exeat:* Standard Friday afternoon to Sunday evening leave.
     * *Medical Exeat:* Hospital, specialist clinic, or dental consultation.
     * *Term Break / Holiday:* End-of-term or mid-term authorized departure.
     * *Emergency Leave:* Urgent family bereavement or emergency.
   * **Reason for Leave:** Type a detailed explanation (e.g., *Family Thanksgiving service and dental appointment*).
   * **Departure Date & Expected Return Date:** Select departure and return dates from the date pickers.
   * **Authorizing Parent Details:** Enter parent/guardian name (e.g., *Chief & Mrs. Adeleke*) and verified phone number (`+234 803 449 8899`).
3. Click **"Submit Application"**.
4. **Behind the Scenes:** The request is posted to `POST /api/v1/campus/student/exeat`, persists into `campus_hostel_exeats`, generates a unique pass code (`EXT-2026-XXXX`), and routes immediately to the Housemaster's portal for approval.
5. The student can monitor approval status directly on their exeat table.

---

### Action 2: Reporting a Campus Facility Maintenance Issue
1. In the top action bar, click **"Report Issue"**.
2. The **Report Campus Facility Issue** modal opens:
   * **Affected Facility / Asset:** Enter the damaged item (e.g., *Science Lab 3 Tap Leak*, *Classroom 3A Ceiling Fan*, *Senior Dorm B Window Latch*).
   * **Specific Location:** Provide the exact room or block (e.g., *Second Floor Wing B, Room 204*).
   * **Description of Issue:** Detail what is broken or malfunctioning.
   * **Urgency Level:**
     * *Normal Maintenance:* Routine fix (within 48 hours).
     * *Urgent:* Needs attention today (affects learning or comfort).
     * *Emergency:* Safety hazard, active flooding, or electrical spark.
3. Click **"Log Maintenance Ticket"**.
4. **Behind the Scenes:** The request is dispatched to `POST /api/v1/campus/student/facility-report`, logged into `campus_facility_bookings`, and alerted to the school maintenance engineering crew.

---

### Action 3: Requesting a Sick-Bay Medical Visit
1. In the top action bar, click **"Sick Bay"** (or inside the *Health Bay* subtab click *+ Request Visit*).
2. The **Request Sick-Bay Medical Visit** modal opens:
   * **Symptoms Experienced:** Describe the ailment (e.g., *Severe migraine, fever, dizzy spells, asthmatic wheezing*).
   * **Urgency Level:**
     * *Standard Check-in during break:* Non-urgent consultation.
     * *Severe Discomfort:* Immediate consultation during class.
     * *Emergency:* Severe trauma, inability to walk, or acute allergic reaction (triggers urgent nurse escort).
3. Click **"Book Consultation"**.
4. **Behind the Scenes:** The ticket is posted to `POST /api/v1/campus/student/clinic-appointment`, creating a triage record in `campus_clinic_visits` on the school nurse's dashboard.

---

### Action 4: Searching & Reserving a Library Textbook
1. Navigate to the **Library & Catalog** subtab (`subtab=library`).
2. Scroll to the **Search & Reserve Library Books** catalog browser.
3. In the search bar, type the book title, author, or subject (e.g., *Physics Breithaupt*, *General Mathematics*, *Things Fall Apart*).
4. Review the matching results, aisle shelf location, and number of available copies.
5. Click the blue **"Reserve"** button.
6. **Behind the Scenes:** The reservation is submitted to `POST /api/v1/campus/student/library-reserve`, recorded in `campus_library_loans` with status `RESERVED`, and held at the circulation desk for 48 hours.

---

## 🎙️ Section 10: Live Student Orientation Webinar Script & Narration Guide

### Slide 1: Welcome to Your Student Command Hub (00:00 - 05:00)
> **Host Narration:**  
> *"Good morning, Scholars! Welcome to the new academic term on ResultsPro and Scholars.ng. As modern students, you shouldn't have to carry five paper notebooks just to know your class schedule, wait in line at the bursary to verify exam clearance, or scramble for clinic chits when you feel unwell. Today, we are unveiling your personal Student Command Hub at `/student/dashboard` and `/student/campus-os`. From this single screen on your phone, tablet, or laptop, you control your classes, your timetable, your meal wallet, and your school life."*

### Slide 2: Conquering Daily Classes & Bell Schedule (05:00 - 12:00)
> **Host Narration:**  
> *(Live Demo Screen: `/student/dashboard`)*  
> *"When you start your day, look at your top 4 KPI cards. Your Academic Average shows your cumulative grade and GPA growth. Beside it, your Biometric Attendance card shows your turnstile check-in time and tracks your consecutive on-time streak. Under 'Today's Bell Schedule', you see all 6 to 8 periods scheduled for today. Notice the green 'LIVE NOW' badge on Physics Lab A? That means your lab session is in progress, and your teacher is waiting. Need to revise? Your Modular Suite launchpad gives you 1-click access to ClassroomPRO notes, TutorsPRO sessions, and Python coding tracks on PuzzlePRO."*

### Slide 3: Cashless Campus Living & Meal Wallet (12:00 - 20:00)
> **Host Narration:**  
> *(Live Demo Screen: `/student/campus-os?subtab=cafeteria` & `?subtab=transport`)*  
> *"Now let's explore CampusPRO at `/student/campus-os`. Lost your tuck shop cash? You don't need physical cash on campus anymore. Under 'Meal Wallet', your biometric student card holds your cafeteria balance. You can see today's breakfast, lunch, and dinner menus with all allergen warnings, and see every sandwich or juice you bought in your transaction ledger. Taking the school bus? The 'Bus Fleet' tab tells you your exact pickup stop, driver's name, bus number, and gives you a direct click-to-call button to reach your driver if you are delayed."*

### Slide 4: Boarding Exeat Passes & Health Safeguarding (20:00 - 30:00)
> **Host Narration:**  
> *(Live Demo Screen: Clicking 'Apply Exeat' modal on `/student/campus-os`)*  
> *"To all our boarding students: no more hunting for housemasters with crumpled paper exeat forms! Click 'Apply Exeat' right from your top bar. Select Weekend or Medical leave, enter your departure and return dates, type your parent's phone number, and hit submit. Your housemaster approves it digitally on their portal. When approved, you receive an official exeat pass code like EXT-2026-9041 that gate security scans on your phone screen. And if you ever fall ill in class, click 'Sick Bay' to alert the duty nurse before walking down to the clinic."*

### Slide 5: Examination Clearance & Virtual Student ID (30:00 - 35:00)
> **Host Narration:**  
> *(Live Demo Screen: `/student/campus-os?subtab=financials` & `?subtab=idcard`)*  
> *"Before exams begin, every student must have bursary clearance. Click 'Fees & Bursary' to view your verified clearance badge and clearance verification code—no paper receipts needed. Finally, click 'Digital ID Card' to view your official school ID complete with your photo, house colors, and digital barcode token. With CampusPRO, you are fully equipped to excel."*

---

## ❓ Section 11: Student Frequently Asked Questions (FAQ)

### Q1: How do I top up my cafeteria meal wallet?
**Answer:** Parents can top up your meal card instantly through the Parent Command Dashboard (`/parent/dashboard`) or via dedicated Paystack virtual bank account transfer linked to your admission number. Funds reflect on your portal within 60 seconds.

### Q2: What should I do if my digital exeat pass still shows "PENDING" on departure day?
**Answer:** Check the exeat table under the *Boarding & Exeats* subtab. If pending, remind your Housemaster or Matron during morning roll call. Once approved, the status turns green (`APPROVED`) and reveals your gate checkout passcode (`EXT-XXXX`).

### Q3: How do I prove bursary clearance on examination day?
**Answer:** Open `/student/campus-os?subtab=financials`. Your screen displays the green **"CLEARED FOR EXAMS"** badge along with your unique alphanumeric code (`BURSARY-CLR-2026-OKW`). Exam hall invigilators cross-reference this code against their master broadsheet.

### Q4: Can I borrow physical textbooks if I have an overdue library book?
**Answer:** The library system flags overdue books with fine calculations. You must return overdue copies to the circulation desk before reserving additional titles.

### Q5: Will my conduct rating improve if I earn merit awards?
**Answer:** Yes. Commendation merits awarded by teachers and the principal (+10 to +25 points) directly contribute to your overall conduct scorebook, house championship standings, and eligibility for prefect council appointments.


---

# 🏛️ PART 3: ADMINISTRATOR & EXECUTIVE COMMAND PORTAL (`/admin/campus-os`)

---

## 🎬 Section 1: Administrator Overview & Governance Philosophy
The **Administrator Command Portal** serves as the central institutional nervous system for School Proprietors, Board of Trustees, Principals, Vice-Principals, Bursars, Registrars, and Head of Operations.

CampusPRO enforces strict **tenant isolation (`WHERE tenant_id = ?`)**, meaning that campus administrators have comprehensive visibility and governance over their specific school site without any risk of cross-institutional data leakage.

### Administrative Target Personas
* **School Proprietors & Board Members:** Executive telemetry, term revenue reconciliation, gross fee collections, debtor aging, and regulatory compliance.
* **Principals & Vice-Principals (Academics / Administration):** Staff punctuality compliance, teacher timetable allocations, pastoral discipline oversight, examination broadsheets, and facility bookings.
* **Bursars & Finance Officers:** Term tuition tariffs, discount and scholarship waivers, Paystack/Flutterwave automated reconciliation, cafeteria disbursements, and store inventory procurement.
* **Matrons & Health Officers:** Clinic admissions, pharmaceutical stock levels, boarder allergies, and emergency medical notifications.
* **Housemasters & Hostel Wardens:** Hall bed allocations, room condition inspections, and digital exeat clearances.
* **Chief Security Marshalls:** Biometric gate turnstile operation, afternoon pickup verification tokens, and visitor management.

---

## 🧭 Section 2: Administrator Navigation Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PORTAL NAVIGATION                     │
├─────────────────────────────────────────────────────────────────┤
│  [1] DASHBOARD                                                  │
│      ├─ Executive Pulse      -> /admin/pulse                    │
│      └─ Website CMS          -> /admin/website                  │
│                                                                 │
│  [2] MODULAR SUITE                                              │
│      ├─ ClassroomPRO         -> /admin/classrooms               │
│      ├─ TutorsPRO            -> /admin/tutors                   │
│      ├─ PuzzlePRO            -> /admin/puzzlepro                │
│      └─ ResultsPRO           -> /admin/results                  │
│                                                                 │
│  [3] OPERATIONS (CampusPRO)                                      │
│      ├─ Operations Hub       -> /admin/campus-os                │
│      ├─ Admission & Intake   -> /admin/campus-os/admission      │
│      ├─ Students Directory   -> /admin/campus-os/students       │
│      ├─ Staff & HRMS         -> /admin/campus-os/staff          │
│      ├─ Academic Calendar    -> /admin/campus-os/academic       │
│      ├─ Timetable Engine     -> /admin/campus-os/timetable      │
│      ├─ Biometric Attendance -> /admin/campus-os/attendance     │
│      ├─ Bursary & Financials -> /admin/campus-os/financials     │
│      ├─ Discipline & Merits  -> /admin/campus-os/discipline     │
│      ├─ Clinic & Sick Bay    -> /admin/campus-os/clinic         │
│      ├─ Hostel & Boarding    -> /admin/campus-os/hostel         │
│      ├─ Transportation & GPS -> /admin/campus-os/transportation │
│      ├─ Library & Media      -> /admin/campus-os/library        │
│      ├─ Store & Procurement  -> /admin/campus-os/inventory      │
│      ├─ Facilities & Venues  -> /admin/campus-os/facilities     │
│      ├─ Security & Visitors  -> /admin/campus-os/security       │
│      ├─ Parent CRM           -> /admin/campus-os/parents        │
│      ├─ Alumni & Transcripts -> /admin/campus-os/alumni         │
│      ├─ Messaging & SMS      -> /admin/campus-os/messaging      │
│      └─ Houses & Clubs       -> /admin/campus-os/co-curricular  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Section 3: The 20 Operational Admin Modules Detailed

### 1. Admissions & Enrollment Funnel (`/admin/campus-os/admission`)
* **Core Function:** End-to-end recruitment pipeline from online inquiries to digital clearance.
* **How to Use:**
  1. Open `/admin/campus-os/admission` to view the candidate pipeline Kanban board.
  2. Filter applicants by grade (e.g. *Creche*, *Primary 1*, *JSS 1*, *SSS 1*).
  3. Schedule CBT entrance examinations directly through the ResultsPRO testing integration.
  4. Generate and email official PDF Admission Letters containing the student's unique admission number and first-term billing schedule.

### 2. Students Master Directory (`/admin/campus-os/students`)
* **Core Function:** Comprehensive biographical, academic arm, and parental linkage database.
* **How to Use:**
  1. Access the student register with multi-criteria search (Name, Admission No, Arm, House).
  2. Click any learner to inspect their profile: passport photo, blood group, genotype, allergy alerts, bus route, and hostel bed assignment.
  3. Enroll new pupils individually or execute bulk CSV import with automated validation.

### 3. Staff & Faculty HRMS (`/admin/campus-os/staff`)
* **Core Function:** Faculty records, biometric turnstile punctuality logs, subject allocations, and payroll records.
* **How to Use:**
  1. Review live morning staff clock-ins from the school gate turnstiles (Punctual vs Late Arrival vs Absent).
  2. Allocate teaching subjects and class arms (e.g., *Mr. Felix* -> *Physics* -> *SSS 3 Diamond*).
  3. Process casual, maternity, and study leave requests submitted by faculty members.

### 4. Academic Sessions & Term Calendar (`/admin/campus-os/academic`)
* **Core Function:** Session governance, term bounds (First, Second, Third Term), mid-term assessments, and vacation dates.
* **How to Use:**
  1. Define session dates (e.g. *2026/2027 Academic Session*).
  2. Configure term resumption, midterm break, and terminal examination dates.
  3. Mark national public holidays to ensure attendance calculations accurately reflect official school days.

### 5. Automated Timetable & Bell Schedule (`/admin/campus-os/timetable`)
* **Core Function:** Collision-free automated scheduling across teachers, classrooms, and specialized laboratories.
* **How to Use:**
  1. Configure period duration (e.g., 40-minute periods, 20-minute morning break, 45-minute lunch break).
  2. Click **Generate Collision-Free Schedule** to run the constraint solver.
  3. Resolve any manual room or teacher conflicts, then click **Publish Schedule** to make it immediately visible to teachers and students.

### 6. Biometric Attendance & Punctuality Engine (`/admin/campus-os/attendance`)
* **Core Function:** Sub-second hardware synchronization with Hikvision, ZKTeco, and Suprema gate turnstiles.
* **How to Use:**
  1. View live turnstile feeds across all campus gates (Terminal A, Terminal B, Boarding House Gates).
  2. Monitor real-time punctuality percentages (e.g., 94.8% on-time arrival rate).
  3. Enable automated SMS dispatch to notify parents of unexcused absences at 07:45 AM daily.

### 7. Bursary, Tuition Fees & Financials (`/admin/campus-os/financials`)
* **Core Function:** Tuition invoicing, automated billing schedules, Paystack/Flutterwave gateway reconciliation, and debtor management.
* **How to Use:**
  1. Define term fee structures by class level: Tuition, Boarding Levy, STEM Lab Practical Fees, ICT Infrastructure Levy, and Books.
  2. Apply approved sibling discounts or scholarship fee adjustments.
  3. View real-time bank settlement balances and send 1-click SMS/Email fee reminders to debtors.

### 8. Continuous Assessment (CA) & Examinations (`/admin/campus-os/results`)
* **Core Function:** Grading policies, CA broadsheets, score verification, and digital report card generation.
* **How to Use:**
  1. Lock or unlock score entry windows for teachers.
  2. Review cumulative broadsheets (30% First CA + 30% Second CA + 40% Terminal Examination).
  3. Endorse report cards with the Principal's digital signature and publish them directly to parent and student portals.

### 9. Discipline, Merits & Pastoral Care (`/admin/campus-os/discipline`)
* **Core Function:** Incident documentation, demerits, detention scheduling, and pastoral counseling referrals.
* **How to Use:**
  1. Review infractions logged by teachers across categories (Truancy, Bullying, Uniform Violation, Class Disruption).
  2. Assign detention periods and track completion.
  3. Award commendation merit points for outstanding academic or civic behavior.

### 10. Health & Clinic / Sick Bay (`/admin/campus-os/clinic`)
* **Core Function:** Infirmary admissions, nurse triage, pharmaceutical inventory, and emergency parent dispatch.
* **How to Use:**
  1. School Matron logs admitted pupils with vital signs (Temperature, Pulse, Blood Pressure).
  2. Administer prescribed medications from approved pharmaceutical stock.
  3. Automatic SMS alerts notify parents immediately if an admission exceeds 2 hours or requires hospital referral.

### 11. Hostel & Boarding Operations (`/admin/campus-os/hostel`)
* **Core Function:** Dormitory room management, bed allocations, room inspections, and exeat authorizations.
* **How to Use:**
  1. Assign boarding students to halls (Nelson Mandela Hall, Queen Amina Hall) and specific bed spaces.
  2. Review exeat requests submitted by parents or boarders.
  3. Approve exeat passes with digital Housemaster stamps, which automatically notify gate security marshalls.

### 12. Transportation, Fleet & Bus GPS (`/admin/campus-os/transportation`)
* **Core Function:** Bus routes, driver licensing, vehicle telemetry, and student transit allocations.
* **How to Use:**
  1. Create transport corridors (e.g., *Route 4: Lekki-Ikoyi Expressway*).
  2. Assign drivers and route wardens with verified phone numbers.
  3. Monitor morning and afternoon run completion logs and bus maintenance schedules.

### 13. Library & Media Centre (`/admin/campus-os/library`)
* **Core Function:** Book cataloging, ISBN barcode generation, lending registers, and overdue fine tracking.
* **How to Use:**
  1. Catalogue curriculum textbooks, reference encyclopedias, and literature novels.
  2. Issue books to students by scanning student ID cards.
  3. Monitor overdue loans and process return clearances before end-of-term examinations.

### 14. Procurement, Stores & Asset Inventory (`/admin/campus-os/inventory`)
* **Core Function:** Warehouse stock, classroom supplies, teacher requisitions, and purchase orders.
* **How to Use:**
  1. Track stock SKUs (whiteboard markers, exam answer booklets, lab reagents, sports equipment).
  2. Review teaching supply requisitions submitted by classroom teachers.
  3. Issue official purchase orders (POs) and record vendor deliveries.

### 15. Facilities & Venue Reservations (`/admin/campus-os/facilities`)
* **Core Function:** Booking centralized infrastructure (Science Labs, CBT Hall, Auditorium, Sports Pitch).
* **How to Use:**
  1. Review reservation calendars to prevent double-booking of specialized venues.
  2. Approve teacher laboratory booking requests for curriculum practical sessions.
  3. Log facility maintenance trouble-tickets and assign campus technicians.

### 16. Security, Gate Pass & Child Safeguarding (`/admin/campus-os/security`)
* **Core Function:** Campus access control, visitor QR badging, and afternoon dismissal authorization.
* **How to Use:**
  1. Security officers issue digital visitor badges with photo capture.
  2. At after-school dismissal, gate officers verify the parent's dynamic 6-digit pickup PIN or digital QR code before releasing any child.
  3. Log incident reports for unauthorized entry attempts.

### 17. Parent & Guardian CRM (`/admin/campus-os/parents`)
* **Core Function:** Parent directory, PTA roster, contact verification, and communication logs.
* **How to Use:**
  1. View verified parents and link multiple wards to a single guardian account.
  2. Track PTA levy contributions and meeting attendance.
  3. Verify email and phone number deliverability to guarantee emergency contact readiness.

### 18. Alumni Relations & Credential Verification (`/admin/campus-os/alumni`)
* **Core Function:** Graduate registry, digital transcript generation, and cryptographic certificate verification.
* **How to Use:**
  1. Maintain graduate cohorts, graduation dates, and post-secondary destinations.
  2. Generate official academic transcripts complete with tamper-proof QR verification codes.
  3. Process international university and credential evaluation verification requests.

### 19. Messaging Hub, SMS & Broadcast Circulars (`/admin/campus-os/messaging`)
* **Core Function:** School-wide circulars, emergency announcements, and targeted notifications.
* **How to Use:**
  1. Compose announcements with multi-channel dispatch: SMS, Email, In-Portal, and Mobile Push.
  2. Filter audience: *All School*, *Boarding Parents Only*, *SSS 3 Exam Cohort*, or *Teaching Staff*.
  3. Track message delivery rates, read receipts, and SMS gateway credit balances.

### 20. Co-Curricular, Houses & Sports System (`/admin/campus-os/co-curricular`)
* **Core Function:** Inter-house sports championship, house points ledger, and student club coordination.
* **How to Use:**
  1. Manage school house rosters (Red, Blue, Yellow, Green House) and House Masters.
  2. Record inter-house sports and academic competition points.
  3. Monitor student club memberships (JET Club, Debate Society, Press Club, Robotics).

---

# 👨‍👩‍👧‍👦 PART 4: PARENT & GUARDIAN COMMAND PORTAL (`/parent/campus-os`)

---

## 🎬 Section 1: Parent Experience & Values
The **Parent Command Portal** eliminates the frustration of uninformative report slips, uncertain child transit, manual bursary lines, and lost paper communications. Designed to run flawlessly on both mobile smartphones and desktop browsers, it gives parents complete 360-degree transparency over their child's academic development, physical safety, health records, and institutional expenses.

### Key Parent Benefits
* **Zero Guesswork Attendance:** Instant visibility into gate turnstile clock-in times and period attendance.
* **Seamless Multi-Ward Switching:** Single login to manage children in different classes without repeated logins.
* **Frictionless Fee Settlement:** Direct integration with Paystack and Flutterwave with instant PDF receipt downloads.
* **Transit Peace of Mind:** Live school bus route tracking and direct click-to-call links for bus drivers.
* **Child Safeguarding Assurance:** Dynamic 6-digit gate PINs and QR tokens ensure children are only released to authorized guardians.
* **Cashless Campus Safety:** Instant tuck shop wallet top-ups ensure pupils never need to carry physical cash to school.

---

## 🧭 Section 2: Parent Navigation & Multi-Ward Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PARENT PORTAL NAVIGATION                    │
├─────────────────────────────────────────────────────────────────┤
│  [TOP BAR] Ward Switcher: [ Alex (SSS 3) ] [ Chiamaka (JSS 2) ] │
├─────────────────────────────────────────────────────────────────┤
│  OPERATIONAL SUBTABS:                                           │
│  ├─ 💳 Bursary & Fees       -> /parent/campus-os?subtab=bursary │
│  ├─ ⏱️ Gate & Roll Call     -> /parent/campus-os?subtab=attend  │
│  ├─ 🚌 Bus GPS Corridor     -> /parent/campus-os?subtab=trans   │
│  ├─ 🛡️ Child Safeguarding   -> /parent/campus-os?subtab=sec     │
│  ├─ 🩺 Infirmary & Clinic   -> /parent/campus-os?subtab=clinic  │
│  ├─ 🏢 Hostel & Exeats      -> /parent/campus-os?subtab=hostel  │
│  ├─ 🥪 Tuck Shop Wallet     -> /parent/campus-os?subtab=cafe    │
│  └─ 📢 Campus Circulars     -> /parent/campus-os?subtab=notices │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Section 3: The 8 Core Parent Operations Detailed

### 1. Bursary & Fee Settlement (`subtab=bursary`)
* **What Parents See:**
  * Top KPI cards displaying *Total Term Billing*, *Total Amount Paid*, and *Outstanding Balance*.
  * Itemized breakdown of all fee components: Tuition, Boarding Upkeep, STEM Practical Levy, and ICT CBT Infrastructure.
  * Verified payment history with 1-click **Download Receipt** links.
* **How to Pay Fees Online:**
  1. Click **Make Instant Payment** on the Bursary tab.
  2. Select the specific fee category (or choose *Full Outstanding Balance*).
  3. Enter payment amount (minimum ₦1,000).
  4. Click **Pay Securely via Paystack**.
  5. Complete authorization using your preferred method (Debit Card, Bank Transfer, or USSD).
  6. Upon completion, the school bursary records update instantly, your outstanding balance updates to ₦0, and an official PDF receipt is generated.

### 2. Biometric Gate Attendance & Punctuality (`subtab=attendance`)
* **What Parents See:**
  * Today's turnstile gate-in time (e.g. *07:28 AM* at *Main Gate Terminal B*).
  * Punctuality rating confirming whether the child entered before the 07:45 AM policy cutoff.
  * Delivery status of the automated morning arrival notification SMS.
  * 5-day historical gate attendance ledger cross-referenced with the Form Teacher's period roll call.

### 3. School Bus GPS Corridor & Transit Safety (`subtab=transport`)
* **What Parents See:**
  * Assigned bus fleet number (e.g. *Bus 08 Toyota Coaster*) and vehicle license plate number.
  * Driver's name, road safety certification status, and a direct click-to-call link (`Call Driver`).
  * Assigned pickup and drop-off stop with morning and afternoon departure times.
  * Route progress checkpoints (e.g. *Stop 1: Toll Gate 06:30 AM*, *Stop 2: Admiralty Way 06:45 AM*, *Arrived Campus 07:25 AM*).

### 4. Child Safeguarding & Dynamic Pickup Security PIN (`subtab=security`)
* **What Parents See:**
  * A dynamic **6-Digit Gate PIN** and cryptographic **QR Token** generated specifically for your child.
  * Authorized pickup delegate whitelist (Primary Parent, Secondary Guardian, Family Chauffeur).
* **How Dismissal Works:**
  * When picking up your child after school, present the 6-digit code or QR badge to the security officer at the gate.
  * The officer scans the code against the security terminal. Once verified, the gate turnstile releases the pupil safely.

### 5. Infirmary & Clinic Health Records (`subtab=clinic`)
* **What Parents See:**
  * Critical health badges showing Blood Group (e.g. *O+*), Genotype (e.g. *AA*), and registered allergies (e.g. *Peanuts, Penicillin*).
  * Name and telephone extension of the active registered nurse on call in the infirmary.
  * Chronological log of all clinic visits detailing date, reported symptoms, triage priority, administered medications, and discharge status.

### 6. Boarding Hostel & Digital Exeat Pass Requests (`subtab=hostel`)
* **What Parents See:**
  * Boarder dormitory hall (e.g. *Nelson Mandela Hall*), room number, and bed bunk assignment.
  * Active Housemaster contact details.
  * History of previous exeat passes and clearances.
* **How to Request an Exeat Pass:**
  1. Click the blue **Request Digital Exeat** button.
  2. Select exeat category: *Weekend Family Pass*, *Medical Specialist Appointment*, or *Special Academic Exeat*.
  3. Enter departure date, expected return date, destination address, and emergency contact phone number.
  4. Click **Submit Exeat Request**.
  5. The request transmits instantly to the Housemaster's portal for digital approval. Once approved, the gate clearance token activates automatically.

### 7. Cashless Tuck Shop & Cafeteria Wallet (`subtab=cafeteria`)
* **What Parents See:**
  * Live cashless balance on your child's smart ID card.
  * Configured daily spending limit (e.g. *₦2,500/day*) to encourage responsible budgeting.
  * Dietary and kitchen allergy alert tags.
  * Itemized purchase ledger showing exact food items bought and remaining balance.
* **How to Top Up the Meal Wallet:**
  1. Click **Top-Up Wallet**.
  2. Choose a quick top-up amount (₦5,000, ₦10,000, ₦20,000) or enter a custom sum.
  3. Authorize payment securely via card.
  4. The funds reflect immediately on your child's student ID card with zero delay.

### 8. Official Campus Circulars & Bulletins (`subtab=notices`)
* **What Parents See:**
  * Official executive memorandums published by the Principal, Vice-Principals, and PTA Secretariat.
  * Color-coded priority badges (*URGENT*, *PTA MEETING*, *GENERAL*).
  * Timely notifications regarding terminal examinations, midterm breaks, and campus events.

---

# 🎙️ PART 5: WEBINAR PRESENTATION SCRIPT & DEMONSTRATION RUN-SHEET

---

## 🎬 Master 60-Minute Presentation Schedule

| Segment | Timestamp | Topic & Focus Area | Presenter Demo Screen |
| :--- | :--- | :--- | :--- |
| **Intro** | 00:00 – 08:00 | The Institutional ERP Revolution & System Architecture | Slide Deck & Architecture Diagram |
| **Segment 1** | 08:00 – 22:00 | **Administrator Portal Live Walkthrough:** The 20 Modules | Live Demo: `/admin/campus-os` |
| **Segment 2** | 22:00 – 35:00 | **Faculty Workspace Live Walkthrough:** Roll Call, Labs & Marks | Live Demo: `/teacher/campus-os` |
| **Segment 3** | 35:00 – 48:00 | **Parent Operations Portal Live Walkthrough:** Fees, GPS, Exeat | Live Demo: `/parent/campus-os` |
| **Segment 4** | 48:00 – 55:00 | Security, Turnstile Hardware Integration & Zero Fallbacks | Live Demo: Biometric Hardware Stream |
| **Segment 5** | 55:00 – 60:00 | Institutional Onboarding, Q&A & Executive Closing | Presenter Camera & Onboarding Steps |

---

## 🗣️ Live Presenter Talk Tracks & Stage Directions

### Opening Remarks (00:00 - 08:00)
> **Presenter:**  
> *"Good day, distinguished School Proprietors, Board Members, Principals, Educators, and Parents. Welcome to the master presentation of CampusPRO — the unified institutional operating system built by ResultsPRO.*
>
> *For too long, running an educational institution has meant tolerating friction: bursary revenue leaks due to slow payment reconciliation, biometric delay at school gates, paper exeat forms that get misplaced, and fragmented communication between teachers and parents.*
>
> *CampusPRO solves this by providing a unified, multi-tenant cloud platform powered by a Go microservice engine and Neon PostgreSQL. Every single database query is tenant-isolated with zero cross-talk, zero fallbacks, and sub-millisecond local processing."*

### Administrator Portal Demo Track (08:00 - 22:00)
> **Presenter:** *(Screen Share: `/admin/campus-os`)*  
> *"Let us step into the Administrator Command Center. Look at the left navigation: all 20 modules of campus life are unified in one place.*
>
> *Under Biometric Attendance, notice that when hundreds of pupils arrive in the morning, our turnstiles scan face and fingerprint profiles in less than 200 milliseconds. Parents receive automated SMS arrival alerts instantly.*
>
> *Under Bursary & Financials, notice that billing is automated by grade level. Payments made by parents reconcile automatically via Paystack with zero manual ledger entry, completely eliminating revenue leakage."*

### Parent Portal Demo Track (35:00 - 48:00)
> **Presenter:** *(Screen Share: `/parent/campus-os`)*  
> *"Now let us experience the portal through the eyes of a parent. Mrs. Sarah Okonkwo has two children: Alex in SS3 and Chiamaka in JSS2.*
>
> *Watch how easily she switches between them on the top bar. With one click, the fees, attendance, bus route, and tuck shop wallet re-scope to Alex or Chiamaka.*
>
> *Look at Child Safeguarding. Notice this dynamic 6-digit PIN: 849201. When picking up a child from school, the gate security marshall must verify this dynamic code before the child is released. This is modern, uncompromising child protection."*

---

## ❓ Master Frequently Asked Questions (FAQ)

### Q1: How does CampusPRO guarantee data privacy between different schools?
**Answer:** CampusPRO enforces strict multi-tenancy at both the application layer and database layer. Every incoming request resolves the school's unique tenant context (`X-Tenant-Domain` and `X-Tenant-ID`), and all database queries enforce `WHERE tenant_id = ?`. One school can never see or access another school's student, staff, or financial data.

### Q2: What happens if our school has existing biometric turnstile hardware?
**Answer:** CampusPRO integrates natively with standard biometric hardware brands including Hikvision, ZKTeco, Suprema, and Dahua via REST API and WebSocket webhooks. If your school does not have turnstile hardware, teachers and gate officers can use the built-in software QR scanner on any standard tablet or smartphone.

### Q3: How do parents receive receipts after paying tuition fees?
**Answer:** When a parent pays fees online via Paystack or bank transfer on `/parent/campus-os`, the payment is verified instantly. The bursary ledger updates in real-time, and a stamped official PDF receipt is immediately available for download directly on the parent's screen.

### Q4: Can parents request exeat passes on weekends?
**Answer:** Yes. Parents can submit exeat requests 24/7 through `/parent/campus-os?subtab=hostel`. The request routes immediately to the assigned Housemaster's console, and once approved, activates the student's gate clearance pass automatically.

---
*Authored by the ResultsPRO Engineering & Educational Product Design Team.*

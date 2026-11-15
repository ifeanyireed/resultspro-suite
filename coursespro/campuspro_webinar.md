# CampusPRO Webinar & Training Masterclass: Teacher's Portal Guide
**Document:** Institutional Educator Enablement Manual & Live Webinar Narration Guide  
**Module Target:** ResultsPro & Scholars.ng Teacher Command Center & CampusPRO Suite  
**Version:** 3.0.0 (November 2026 Edition)  
**Primary URLs:**
* **Teacher Command Dashboard:** [`/teacher/dashboard`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/teacher/dashboard/page.tsx)
* **Dedicated CampusPRO Workspace:** [`/teacher/campus-os`](file:///Volumes/ReedBreedCC/resultspro-suite/scholars_ng/web_app/src/app/(portal)/teacher/campus-os/page.tsx)
* **Go CampusPRO Engine:** [`service_campuspro`](file:///Volumes/ReedBreedCC/resultspro-suite/service_campuspro/handlers/teacher_dashboard.go)

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

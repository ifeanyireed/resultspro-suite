# SchoolHub Page Slugs

Based on the Screen Inventory and Information Architecture defined in the blueprint, the following routes (slugs) are required.

## Public Marketing Pages (White-Label Site)
These pages are accessible to visitors and focused on conversion.

| Page | Slug | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Main landing page with hero, mission, and CTAs. |
| **About** | `/about` | School history, leadership, and values. |
| **Academics** | `/academics` | Curriculum, subjects, and teaching approach. |
| **Future Skills** | `/future-skills` | ScholarsNG pathways, coding, and AI robotics. |
| **Student Life** | `/student-life` | Clubs, sports, and campus culture. |
| **Admissions Home** | `/admissions` | Overview of the enrollment process. |
| **Inquiry** | `/admissions/inquiry` | Lead capture form for prospective parents. |
| **Tour Booking** | `/admissions/tour` | Schedule a campus visit. |
| **Application** | `/admissions/apply` | Full admission application portal. |
| **News & Events** | `/news` | Announcements and school gallery. |
| **Contact** | `/contact` | Locations, maps, and branch-specific info. |

## Authenticated Portal Pages
These pages require a login and are role-aware (Parent, Student, Teacher, Admin).

| Page | Slug | Description |
| :--- | :--- | :--- |
| **Universal Dashboard** | `/dashboard` | Fallback/default entry point. |
| **Student Dashboard** | `/student/dashboard` | Student-specific command center. |
| **Teacher Dashboard** | `/teacher/dashboard` | Teacher-specific command center. |
| **Parent Dashboard** | `/parent/dashboard` | Parent-specific children overview. |
| **Principal Pulse** | `/admin/pulse` | Institutional health and leadership analytics. |
| **Admissions CRM** | `/admin/admissions` | Lead management for staff (AdmissionsPRO). |

## Role-Specific Sidebar Navigation
These pages are mapped to the distinct dashboards and ecosystem integrations for each user role.

### 🎓 Student Sidebar
| Page | Slug | Description |
| :--- | :--- | :--- |
| **Home** | `/student/dashboard` | Main command center & overview. |
| **Classroom** | `/student/classroom` | Daily lessons and participation snapshot. |
| **Timetable** | `/student/timetable` | Visual weekly class schedule. |
| **Homework** | `/student/homework` | Task board (To Do, On Review, Completed). |
| **Learning Library** | `/student/learning` | Curated resources and lesson notes. |
| **My Exams** | `/student/exams` | Practice exams and mock test hub. |
| **Practice Progress** | `/student/exams/progress` | Readiness and improvement analytics. |
| **Academic Results** | `/student/results` | Official term reports and grade overview. |
| **Results Analytics** | `/student/results/analytics` | Deep performance patterns and trends. |
| **Tutor Hub** | `/student/tutors` | Session management and assigned tutors. |
| **Online Lessons** | `/student/tutors/lessons` | Active lesson links and session history. |
| **Future Skills** | `/student/future-skills` | Coding and AI robotics pathway. |
| **Skills Progress** | `/student/future-skills/progress` | Mastery breakdown and skill badges. |

### 🍎 Teacher Sidebar
| Page | Slug | Description |
| :--- | :--- | :--- |
| **Home** | `/teacher/dashboard` | Classes today, pending grading, attendance. |
| **Classroom** | `/teacher/classroom` | Class management and lesson progress. |
| **My Classes** | `/teacher/classes` | Daily/weekly timetable and student rosters. |
| **Homework** | `/teacher/homework` | Assign, track, and review student homework. |
| **Practice Insights** | `/teacher/exams` | Class-wide practice performance analytics. |
| **Tutor Schedule** | `/teacher/tutors` | Online session and tutoring management. |
| **Assessments** | `/teacher/assessments` | Quiz creation and grading hub. |
| **Tasks** | `/teacher/tasks` | Personal task manager (Lesson plans, meetings). |

### 👨‍👩‍👧 Parent Sidebar
| Page | Slug | Description |
| :--- | :--- | :--- |
| **Home** | `/parent/dashboard` | Children overview and engagement stats. |
| **Classroom** | `/parent/classroom` | Daily child activity and engagement alerts. |
| **Exam Insights** | `/parent/exams` | Child's exam readiness and practice scores. |
| **Results Analytics** | `/parent/results` | Deep dive into child's academic performance. |
| **Academic Reports** | `/parent/reports` | Detailed progress and goals for each child. |
| **Tutor Booking** | `/parent/tutors` | Manage tutoring support for children. |
| **Future Skills** | `/parent/future-skills` | Track child's digital skills progression. |
| **Payments** | `/payments` | Fee management and history. |
| **Messages** | `/communications` | School newsletters and teacher updates. |
| **Events Calendar** | `/parent/events` | PTA meetings, sports days, and deadlines. |

### 🏛️ Principal / Admin Sidebar
| Page | Slug | Description |
| :--- | :--- | :--- |
| **Pulse** | `/admin/pulse` | Institutional health and enrollment trends. |
| **Results Center** | `/admin/results` | School-wide academic overview and audits. |
| **Insights Hub** | `/admin/insights` | Consolidated ecosystem oversight screen. |
| **Class Timetable**| `/admin/timetable` | Master schedule management for all grades. |
| **Fees** | `/admin/fees` | Invoice generation, receipts, and fee tracking. |
| **Enrollment** | `/admin/enrollment` | Student capacity and trend analysis. |
| **Transport** | `/admin/transport` | Vehicle management, routes, and schedules. |
| **Procurement** | `/admin/procurement` | Inventory, supply orders, and vendor management. |
| **Library** | `/admin/library` | Book cataloging, issuance, and return tracking. |
| **Hostel** | `/admin/hostel` | Room allocations, boarding, and facility management. |
| **Performance** | `/admin/performance` | Departmental excellence metrics. |
| **Operations** | `/admin/operations` | Critical incident logs and operational milestones. |

### 🤝 Admissions Sidebar
| Page | Slug | Description |
| :--- | :--- | :--- |
| **CRM Home** | `/admin/admissions` | Pipeline summary and lead conversion. |
| **Inquiries** | `/admin/admissions/inquiries` | Prospective family database. |
| **Applications** | `/admin/admissions/applications` | Review and manage full enrollment forms. |
| **Pipeline** | `/admin/admissions/pipeline` | Funnel analysis and conversion analytics. |
| **Tours & Events** | `/admin/admissions/tours` | Prospective family visit scheduling. |

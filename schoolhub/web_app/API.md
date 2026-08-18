# SchoolHub API Documentation

Base URL: `http://localhost:8080/api`

## Authentication
All protected routes require a JWT token passed in the `Authorization` header as `Bearer <token>`.
Tenant context is injected via a `X-School-Slug` header or derived from the host.

## Public Routes (`/api/*`)
*No Auth Required (Tenant Aware)*
*   `GET /tenant/info` - Public branding and content
*   `POST /admissions/inquiry` - Submit public inquiry form
*   `POST /admissions/tour` - Book public tour
*   `POST /admissions/apply` - Submit student application

## Student Portal (`/api/student/*`)
*Role Required: STUDENT*
*   `GET /dashboard` - Dashboard Overview
*   `GET /classroom` - Assigned Classes & Syllabi
*   `GET /timetable` - Visual Weekly Class Schedule
*   `GET /homework` - Task Board & Assignments
*   `GET /learning` - Learning Library Resources
*   `GET /exams` - Practice Exam Hub
*   `GET /exams/progress` - Readiness Analytics
*   `GET /results` - Official Term Results
*   `GET /results/analytics` - Performance Patterns
*   `GET /tutors` - Tutor Session Management
*   `GET /tutors/lessons` - Online Lesson Links
*   `GET /future-skills` - Coding & AI Pathway
*   `GET /future-skills/progress` - Mastery Breakdown

## Parent Portal (`/api/parent/*`)
*Role Required: PARENT*
*   `GET /dashboard` - Children Overview & Engagement
*   `GET /classroom` - Children's Daily Activity
*   `GET /exams` - Exam Readiness & Practice
*   `GET /results` - Academic Performance Analytics
*   `GET /reports` - End-of-term Reports
*   `GET /tutors` - Tutor Booking & Management
*   `GET /future-skills` - Digital Skills Progress
*   `GET /payments` - Fee Management & Invoices
*   `GET /communications` - Newsletters & Messages
*   `GET /events` - Events Calendar & Holidays

## Teacher Portal (`/api/teacher/*`)
*Role Required: TEACHER*
*   `GET /dashboard` - Classes, Grading & Attendance
*   `GET /classroom` - Class Management View
*   `GET /classes` - Assigned Class Rosters
*   `GET /homework` - Assignment Management
*   `GET /exams` - Class-wide Practice Insights
*   `GET /tutors` - Tutoring Schedule
*   `GET /assessments` - Quiz & Grading Hub
*   `GET /tasks` - Personal Task Management

## Admissions CRM (`/api/admin/admissions/*`)
*Role Required: ADMISSIONS, ADMIN, PRINCIPAL*
*   `GET /inquiries` - Prospective Family Database
*   `GET /applications` - Student Application Records
*   `GET /pipeline` - Funnel & Conversion Analytics
*   `GET /tours` - Visit Scheduling

## Admin & Principal Portal (`/api/admin/*`)
*Role Required: PRINCIPAL, SUPER_ADMIN*
*   `GET /pulse` - Institutional Health Overview (KPIs)
*   `GET /results` - School-wide Academic Audit
*   `GET /insights` - Ecosystem Oversight Hub
*   `GET /timetable` - Master Schedule Management
*   `GET /fees` - Institutional Revenue Tracking
*   `GET /enrollment` - Population & Capacity Analytics
*   `GET /transport` - Fleet & Route Management
*   `GET /procurement` - Inventory & Supply Orders
*   `GET /library` - Book Resource Management
*   `GET /hostel` - Boarding & Accommodation
*   `GET /performance` - Departmental Excellence
*   `GET /operations` - System Health & Incidents

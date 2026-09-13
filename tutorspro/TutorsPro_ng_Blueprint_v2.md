  

**TutorsPro.ng**

Comprehensive Product Blueprint

_Online tutoring platform for students, parents, tutors, schools, and global learners_

  

  

  

Revised Blueprint · May 2026

  

**Purpose**

This document defines the product direction, screen map with detailed descriptions and route slugs, user flows, monetisation model, financial assumptions, go-to-market strategy, system architecture, and data schema for TutorsPro.ng. This revision introduces an expanded six-role screen inventory with a clear split between Platform Admin (operational) and Super-Admin (infrastructure) responsibilities.

  

_Prepared for internal planning, product design, fundraising, and engineering execution._

**1\. Executive Summary**

  

  

TutorsPro.ng is a dedicated online tutoring platform designed for one-to-one teaching, small-group tutoring, school-led live classes, and cross-border tutoring delivery.

  

The platform serves six distinct audiences: students, parents, tutors, school administrators, platform operations staff, and infrastructure-level super-admins. Each role has a purpose-built workspace that avoids clutter and keeps every user focused on the actions most relevant to them.

  

The product is built as a modular system so that live tutoring, recorded content, assessments, progress reporting, and school SaaS management can all work together without forcing every customer into the same workflow.

  

The core business goal is to create a trusted learning and teaching marketplace that scales from Nigeria to a global audience while still supporting local pricing, local currency payments, and school-based multi-tenant deployments.

**2\. Product Vision, Goals, and Principles**

  

  

**Vision**

To become the most trusted and flexible tutoring operating system for African learners and a global talent-backed tutoring network for schools and families.

**Product Goals**

*   **Make online tutoring easy to start, easy to schedule, and easy to monitor.**
*   **Provide a delightful student experience that includes live learning, practice, feedback, and motivational progress tracking.**
*   **Give tutors a complete workspace for planning, teaching, reviewing, and earning.**
*   **Give parents transparent visibility into progress, attendance, and results.**
*   **Give schools a multi-tenant SaaS option to onboard their own teachers and run tutoring services under their own brand or in white-label mode.**

**Product Principles**

*   **Mobile-first by default.**
*   **Low-bandwidth friendly with graceful fallback modes.**
*   **Role-based experiences instead of one cluttered dashboard.**
*   **Simple onboarding with fast time-to-first-value.**
*   **Built-in feedback loops for students, parents, tutors, and schools.**
*   **Modular architecture so new products can be added without rebuilding the core.**
*   **Clear operational split between Platform Admin (people and product operations) and Super-Admin (infrastructure and security).**

**3\. Primary User Personas**

  

  

**Persona**

**Needs**

**Success Looks Like**

**Key Product Surface**

**Student**

Access lessons, get help, practice, and see progress

More confidence, better results, higher completion

Student app, classroom, games, quizzes, progress

**Parent**

Monitor performance, attendance, and value for money

Trust, transparency, and visible improvement

Parent portal, reports, alerts, billing

**Tutor**

Teach smoothly, plan lessons, manage earnings

Better lesson delivery, good reviews, steady income

Tutor dashboard, calendar, classroom, earnings

**School Admin**

Manage teachers, classes, students, and subscriptions

School-wide control and added revenue

School SaaS admin portal

**Platform Admin**

Vet users, handle disputes, monitor growth

Stable operations and quality control

Platform admin console

**Super-Admin**

Manage infrastructure, configs, security, and system health

Zero downtime, full auditability, and safe releases

Super-admin console

**4\. Core Product Modules**

  

  

**Identity and Access Management:** User signup, login, password reset, two-factor auth, roles, permissions, and consent management.

  

**Tutor Marketplace and Administration:** Tutor onboarding, KYC/document review, profiles, ratings, availability, payouts, and performance tracking.

  

**Student Learning Environment:** Booking, class joining, homework, notes, quizzes, flashcards, games, and post-class review.

  

**Parent Portal:** Child selection, attendance, progress dashboard, assignments, teacher feedback, billing, and notifications.

  

**School SaaS Suite:** School-level admin, teacher management, class setup, school branding, billing, and reporting.

  

**Live Classroom Engine:** Video, audio, whiteboard, screen share, chat, polls, breakout rooms, and lesson controls.

  

**Assessment and Analytics:** Rubrics, scoring, mastery tracking, certificates, and learning insights.

  

**Payments and Wallet:** Subscriptions, invoices, one-off bookings, payouts, refunds, coupons, and multi-currency support.

  

**Notifications and Communication:** Email, SMS, WhatsApp, push alerts, class reminders, progress updates, and system notices.

  

**Content and Resource Library:** Notes, handouts, recordings, templates, flashcards, games, and downloadable materials.

  

**Platform Operations (Admin Layer):** User management, tutor verification, dispute resolution, content moderation, and support ticket management.

  

**Infrastructure and Security (Super-Admin Layer):** System health monitoring, feature flags, database management, API integrations, audit logs, and global permissions.

**5\. Screen Inventory and User Interface Map**

  

  

The screen inventory below covers all user-facing and admin-facing screens across six roles. Each entry includes a route slug and a functional description of what the screen does and why it exists. The total screen count represents the full first scalable version of the platform.

  

  **PUBLIC / MARKETING SCREENS  (8 screens)**

  

**#**

**Screen Name**

**Route / Slug**

**Description**

**1**

**Home**

/

Marketing landing page with hero CTA, featured tutors, subject cards, testimonials, and sign-up prompts. The primary conversion surface for new visitors.

**2**

**About / How It Works**

/(public)/about

Explains the platform model, the booking process, tutor vetting standards, and the student-parent-tutor relationship in an accessible narrative format.

**3**

**Tutor Directory**

/(public)/tutors

Publicly browsable listing of approved tutors with filters for subject, level, price range, availability, and language. Drives tutor discovery and booking intent.

**4**

**Pricing**

/(public)/pricing

Individual and group session pricing tiers, one-time booking rates, and bundle options. Includes a comparison table and FAQ callouts to reduce friction.

**5**

**School Plans**

/(public)/schools

Dedicated school-facing pricing and feature page covering the multi-tenant SaaS model, teacher seat limits, branding options, and white-label add-ons.

**6**

**FAQ**

/(public)/faq

Categorised answers to common questions from students, parents, tutors, and schools. Reduces support load and builds confidence before sign-up.

**7**

**Contact Us**

/(public)/contact

Contact form with routing for general enquiries, tutor applications, school partnerships, and press. Includes social links and support hours.

**8**

**Blog / Resources**

/blog

Published articles, study guides, exam tips, and platform updates. Supports SEO, audience trust, and organic traffic growth.

  

  **STUDENT SCREENS  (17 screens)**

  

**#**

**Screen Name**

**Route / Slug**

**Description**

**1**

**Student Signup**

/signup

Multi-step registration flow collecting name, email, grade, subjects of interest, and learning goal. Supports phone-number and Google OAuth sign-up.

**2**

**Student Login**

/login

Standard email/password and OAuth login screen with password reset link and session persistence options.

**3**

**Student Onboarding**

/onboarding

Post-signup guided flow where the student selects their primary subjects, sets a weekly learning goal, and optionally books their first session. Drives first-class completion.

**4**

**Student Dashboard**

/student/dashboard

Central home for logged-in students. Shows upcoming classes, recent activity, XP progress, quick-access to study tools, and personalised tutor recommendations.

**5**

**Find a Tutor**

/student/find-tutor

Interactive search and filter interface for browsing available tutors by subject, price, rating, availability, and teaching style. Includes tutor profile previews and a smart-match option.

**6**

**Book a Session**

/student/bookings

Step-by-step booking flow: select tutor, pick time slot, confirm session type (1-on-1 or group), and complete payment. Integrates with the student wallet and external payment gateways.

**7**

**Upcoming Classes**

/student/classes

Chronological list of confirmed upcoming sessions with class details, tutor info, join button, and countdown timer. Includes rescheduling and cancellation options.

**8**

**Live Classroom**

/student/classroom

Full in-session experience with video, audio, chat, collaborative whiteboard, screen sharing, polls, and breakout rooms. Optimised for low-bandwidth with fallback modes.

**9**

**Assignments**

/student/assignments

List of outstanding and completed homework items from tutors with deadlines, file attachments, submission form, and tutor feedback view.

**10**

**Quizzes**

/student/quizzes

Subject-aligned MCQ and short-answer quiz bank. Tracks scores over time, shows correct answers, and generates a mastery heat map by topic.

**11**

**Flashcards**

/student/flashcards

Spaced-repetition flashcard sets organised by subject and topic. Students can flip, self-rate, and track recall confidence. Tutor-generated and student-created decks both supported.

**12**

**Games Hub**

/student/games

Gamified learning activities including subject quizzes, speed rounds, and word challenges. Earns XP and unlocks badges. Designed to drive daily engagement through play.

**13**

**Progress Reports**

/student/progress

Visual summary of session attendance, quiz scores, assignment completion, and mastery by subject over selected time periods. Shareable with parents.

**14**

**Certificates**

/student/certificates

Digital achievement certificates earned by completing courses, passing assessments, or reaching milestones. Downloadable and shareable.

**15**

**Messages**

/student/messages

In-platform messaging with tutors. Supports text, file attachments, and session links. Keeps all learning-related communication inside the platform.

**16**

**Wallet / Payments**

/student/wallet

Shows wallet balance, top-up options, transaction history, and auto-renew settings. Supports Paystack, Flutterwave, and Stripe for deposits.

**17**

**Settings**

/student/settings

Account preferences including profile details, notification preferences, linked parent account, password, and connected devices.

  

  **PARENT SCREENS  (9 screens)**

  

**#**

**Screen Name**

**Route / Slug**

**Description**

**1**

**Parent Login**

/parent/login

Separate login portal for parents with email/password authentication and password recovery. Keeps the parent workspace isolated from the student experience.

**2**

**Child Linking / Invite Code**

/parent/children

Interface for linking one or more child accounts using a unique invite code. Parents can manage multiple children from a single account.

**3**

**Parent Dashboard**

/parent/dashboard

Overview of all linked children's activity: recent sessions, upcoming classes, assignment status, quiz scores, and tutor notes at a glance.

**4**

**Attendance and Lesson History**

/parent/history

Full log of past sessions for each child: date, tutor, subject, duration, attendance status, and post-class notes or recordings.

**5**

**Progress Analytics**

/parent/progress

Graphical progress view for each child showing learning trends, subject mastery, class completion rate, and tutor ratings over time.

**6**

**Tutor Feedback**

/parent/feedback

Read and submit feedback on tutors. Parents can rate sessions, flag concerns, and submit written comments that feed into the tutor quality system.

**7**

**Notifications**

/parent/notifications

Centralised alert inbox showing class reminders, milestone achievements, missed sessions, assignment submissions, and billing events.

**8**

**Billing**

/parent/billing

Payment history, active subscription or booking credits, invoice downloads, and card management. Parents may pay on behalf of their children from here.

**9**

**Support Center**

/parent/support

Help desk with categorised FAQs, a ticket submission form, and live chat access for billing disputes, class issues, and account queries.

  

  **TUTOR SCREENS  (13 screens)**

  

**#**

**Screen Name**

**Route / Slug**

**Description**

**1**

**Tutor Signup / Onboarding**

/tutor/onboarding

Multi-step onboarding flow covering personal details, subject expertise, qualification uploads, sample lesson submission, availability preferences, and policy acceptance. Gates access until admin verification is complete.

**2**

**Profile and Verification**

/tutor/profile

Public-facing tutor profile editor: bio, photo, subject tags, hourly rate, teaching style, languages, and verification badge. Also shows review summary and booking metrics.

**3**

**Calendar and Availability**

/tutor/calendar

Weekly calendar view where tutors set available time slots, block personal time, and manage recurring availability windows. Syncs with bookings automatically.

**4**

**Class Requests**

/tutor/requests

Inbox of incoming booking requests from students or schools with student details, subject, preferred time, and session type. Tutors can accept, decline, or counter-propose.

**5**

**Teaching Dashboard**

/tutor/dashboard

Central hub for the tutor's working day: today's classes, pending requests, unread messages, recent reviews, earnings snapshot, and quick-action shortcuts.

**6**

**Lesson Planner**

/tutor/planner

Structured lesson planning tool where tutors outline objectives, attach notes and resources, set quiz or assignment tasks, and mark a lesson as ready before the session.

**7**

**Live Classroom**

/tutor/classroom

Tutor-controlled session view with host-level controls: admit/remove students, mute, spotlight, screen share, collaborative whiteboard, polls, and class timer. Mirrors the student classroom on the host side.

**8**

**Whiteboard**

/tutor/whiteboard

Standalone infinite whiteboard tool with drawing tools, shapes, text, image upload, and real-time collaboration. Can be used inside a session or prepared in advance.

**9**

**Resources**

/tutor/resources

Personal resource library for uploading, organising, and sharing lesson materials such as PDFs, slides, handouts, and videos. Reusable across multiple sessions.

**10**

**Student Progress View**

/tutor/student-progress

Per-student view of quiz scores, assignment completion, attendance, session history, and mastery level. Helps tutors personalise follow-up and adapt lesson difficulty.

**11**

**Earnings**

/tutor/earnings

Earnings dashboard showing total earned, pending, and paid amounts broken down by session, month, and student. Includes commission deductions and platform fee transparency.

**12**

**Payouts**

/tutor/payouts

Payout request interface with bank account or mobile money details, payout history, minimum threshold settings, and scheduled disbursement tracking.

**13**

**Reviews**

/tutor/reviews

Display of student and parent reviews received, with breakdown by rating category. Tutors can view comments, flag disputes, and track their rating trend over time.

  

  **SCHOOL ADMIN SCREENS  (10 screens)**

  

**#**

**Screen Name**

**Route / Slug**

**Description**

**1**

**School Registration**

/school/signup

School sign-up flow collecting institution name, contact details, school type, estimated student and teacher count, and preferred plan. Creates an isolated tenant on submission.

**2**

**School Dashboard**

/school/dashboard

Admin overview of all active classes, teacher and student counts, upcoming sessions, recent usage activity, and key platform metrics for the school tenant.

**3**

**Teacher Onboarding**

/school/teachers

Interface for inviting and managing teachers within the school tenant. Admins can send invite links, assign subjects, set permission levels, and monitor onboarding completion.

**4**

**Class Creation**

/school/classes

Tool for setting up new live or async classes including subject, assigned teacher, student group, schedule, session format, and resource attachments.

**5**

**Student Import**

/school/students

Bulk student upload via CSV or manual entry form. Maps students to classes, generates student access credentials, and sends invite notifications automatically.

**6**

**Subscription Management**

/school/subscription

Plan overview, billing cycle, seat counts, add-on services, and renewal controls. Admins can upgrade, downgrade, or cancel and view invoice history.

**7**

**Branding Settings**

/school/branding

White-label customisation panel for uploading a school logo, setting brand colours, and configuring the student-facing school name and domain prefix.

**8**

**Reports**

/school/reports

Downloadable session, attendance, and performance reports across the school tenant. Filterable by class, teacher, date range, and subject.

**9**

**Usage Analytics**

/school/analytics

Data dashboard showing class hours delivered, active student counts, teacher utilisation, quiz completion rates, and engagement trends within the school tenant.

**10**

**School Notifications**

/school/notifications

Admin notification centre for system alerts, subscription renewal reminders, teacher activity updates, and platform announcements relevant to the school.

  

  **PLATFORM ADMIN SCREENS  (7 screens)**

  

Platform Admins handle all people and product operations: user vetting, tutor verification, disputes, payments, and content moderation. They do not have access to infrastructure controls.

  

**#**

**Screen Name**

**Route / Slug**

**Description**

**1**

**Platform Admin Dashboard**

/platform-admin/dashboard

Operational command centre for the admin team: active user counts, new registrations, pending tutor verifications, open disputes, flagged content, and revenue snapshot for the current period.

**2**

**User Management**

/platform-admin/users

Search, filter, and manage all user accounts across students, parents, schools, and tutors. Actions include view, edit, suspend, reactivate, and impersonate for support purposes.

**3**

**Tutor Verification Queue**

/platform-admin/tutor-verification

Review queue for submitted tutor applications. Admins can inspect qualification documents, watch sample lesson recordings, approve or reject with notes, and trigger re-submission requests.

**4**

**Payment Operations and Billing**

/platform-admin/payments

Full visibility into platform transactions: charges, refunds, payout disbursements, failed payments, and reconciliation status. Supports manual adjustments and dispute crediting.

**5**

**Dispute Resolution**

/platform-admin/disputes

Case management tool for student-tutor conflicts, refund requests, and quality complaints. Admins can view session logs, read messages, issue rulings, and close cases.

**6**

**Content Moderation**

/platform-admin/moderation

Review queue for flagged messages, uploaded files, tutor resources, and student-submitted content. Admins can approve, remove, or escalate items to legal or compliance.

**7**

**Support Ticket Management**

/platform-admin/support

Unified helpdesk view of all inbound support tickets from students, parents, tutors, and schools. Includes assignment, priority tagging, SLA tracking, and resolution notes.

  

  **SUPER-ADMIN SCREENS  (8 screens)**

  

Super-Admins manage the underlying infrastructure of the platform: server health, database operations, feature releases, external integrations, and security audit trails. This role is strictly separated from Platform Admin to enforce least-privilege access at the system level.

  

**#**

**Screen Name**

**Route / Slug**

**Description**

**1**

**Super-Admin Dashboard**

/super-admin/dashboard

Executive-level infrastructure overview: system uptime, API response times, active connections, background job status, error rates, and resource usage across all services.

**2**

**System Health and Monitoring**

/super-admin/health

Real-time service health panel showing server metrics, database connection pool status, queue depths, memory and CPU usage, and alert thresholds. Integrates with uptime monitoring tools.

**3**

**Feature Flags and Configurations**

/super-admin/feature-flags

Toggle features on or off globally or per user segment without a deployment. Manages rollout percentages, A/B test variants, and emergency kill switches for new functionality.

**4**

**Database and Storage Management**

/super-admin/infrastructure

Overview of database instances, storage buckets, backup schedules, and data retention policies. Provides manual migration triggers and storage usage breakdowns by tenant.

**5**

**API Keys and External Integrations**

/super-admin/integrations

Registry of all third-party API credentials and integration statuses: payment gateways, video providers, SMS/email services, and OAuth providers. Supports key rotation and health testing.

**6**

**Audit Logs and Security Trails**

/super-admin/audit-logs

Immutable, searchable log of all sensitive actions across the platform: user role changes, data exports, admin logins, payment adjustments, and configuration edits. Filterable by actor, action, and entity.

**7**

**Global Roles and Permissions**

/super-admin/permissions

Master role and permission editor for defining what each user role can see and do across the platform. Supports custom role creation and permission inheritance rules.

**8**

**System-wide Analytics**

/super-admin/analytics

Aggregate platform analytics across all tenants and user types: total sessions delivered, revenue trends, user growth curves, geographic distribution, and cohort retention metrics.

  

**Role**

**Screen Count**

**Public / Marketing**

**8**

**Student**

**17**

**Parent**

**9**

**Tutor**

**13**

**School Admin**

**10**

**Platform Admin**

**7**

**Super-Admin**

**8**

**Total**

**72**

**6\. Key User Flows**

  

  

**Student Booking Flow**

*   **Land on marketing site or receive referral link.**
*   **Sign up and complete subject and goal onboarding.**
*   **Search or get matched with a tutor.**
*   **Select a time slot and complete payment from wallet or direct charge.**
*   **Join the live classroom at the scheduled time.**
*   **Receive post-class summary, assignments, and a progress update.**

**Parent Supervision Flow**

*   **Parent creates a separate account and links one or more children via invite code.**
*   **Views the parent dashboard showing all children's upcoming and recent sessions.**
*   **Receives automated notifications after classes, assessments, and milestones.**
*   **Reviews progress analytics and tutor feedback reports.**
*   **Approves recurring payments or tops up the student wallet.**

**Tutor Teaching Flow**

*   **Tutor completes multi-step onboarding and submits verification documents.**
*   **Admin approves tutor and profile becomes discoverable in the directory.**
*   **Tutor sets weekly availability in the calendar.**
*   **Receives and accepts booking requests.**
*   **Prepares lesson plan and uploads materials in the lesson planner.**
*   **Runs the live class with full whiteboard and media controls.**
*   **Post-class rubric scores are logged, review is requested, and payout is queued.**

**School Onboarding Flow**

*   **School admin registers the institution and selects a subscription plan.**
*   **Adds school details and configures branding settings.**
*   **Invites teachers via the teacher onboarding screen.**
*   **Creates class groups and assigns teachers to subjects.**
*   **Bulk-imports students via CSV upload.**
*   **Monitors usage, attendance, and reports through the school analytics dashboard.**

**7\. Interactive Live Class Experience**

  

  

**Warm-Up:** A quick poll, question, or mini-game to capture student attention immediately when the session opens.

  

**Teaching Block:** Tutor introduces the topic using slides, whiteboard, short video, or live explanation with students following along.

  

**Practice Block:** Students solve problems, drag items, answer prompts, or collaborate on the shared whiteboard in real time.

  

**Feedback Block:** Tutor gives corrections, rubric marks, and encouragement. Parents receive a notification that the session is in progress.

  

**Wrap-Up Block:** Platform auto-generates recap notes, homework items, flashcards, and a class progress summary for the student.

  

**Follow-Up Block:** Parents and students receive automated post-class notifications. Tutor sees class analytics and queued review request.

**8\. Tutor Administration and Review System**

  

  

*   **Onboarding includes identity checks, qualification review, subject tagging, sample lesson review, and policy acceptance.**
*   **Tutor profiles display skills, teaching style, experience, ratings, subject expertise, languages, and available time slots.**
*   **The review system captures student ratings, parent feedback, punctuality, clarity, engagement, lesson completion, and complaint history.**
*   **Platform admins can approve, suspend, shadow-ban, or retrain tutors based on performance indicators.**
*   **Tutor analytics cover booked hours, completed sessions, revenue earned, repeat bookings, student satisfaction, and refund rate.**

**9\. Parent Portal Requirements**

  

  

*   **Separate parent login from the student account to protect student privacy.**
*   **Connect one parent to one or more children using the invite code system.**
*   **See schedules, completed classes, missed classes, grades, comments, and assignments in a unified view.**
*   **Receive alerts when a child misses a class, performs below average, or earns a milestone.**
*   **View payment history, plan renewal status, and tutor remarks.**
*   **Message tutors or support without entering the student workspace.**

**10\. School SaaS Model and Multi-Tenant Architecture**

  

  

*   **Each school has a dedicated tenant with isolated data, user permissions, branding, and reports.**
*   **School admins onboard teachers, assign classes, upload student lists, and monitor usage from within their own workspace.**
*   **Schools choose from internal classes, after-school tutoring, exam prep, or a blended delivery model.**
*   **White-label and semi-white-label options are available for larger institutions requiring custom domains and branding.**
*   **Billing supports monthly subscriptions, annual contracts, and add-on services such as extra storage, more teacher seats, or premium reporting.**

**11\. Monetisation Model**

  

  

**1\. One-to-One Tutoring Fees:** Students pay for individual sessions or session bundles at tutor-set rates.

  

**2\. School Subscriptions:** Schools pay monthly or yearly for access to teacher tools, class management, and reporting.

  

**3\. Marketplace Commission:** The platform takes a percentage from all booked tutoring sessions processed on the platform.

  

**4\. Premium Analytics:** Advanced progress reports and insight dashboards for schools and parents sold as an upgrade tier.

  

**5\. Course Packs and Bootcamps:** Exam prep, holiday classes, and intensive revision camps sold as bundled programmes.

  

**6\. Tutor Verification and Featured Placement:** Optional paid boosts for tutors who want higher visibility in the directory.

  

**7\. White-Label Implementation:** Setup and custom branding fees for larger institutions requiring full white-label deployment.

**12\. Financial Projection Framework**

  

  

The figures below are illustrative planning assumptions only. They should be replaced with live pricing, actual conversion rates, and real operating costs during execution.

  

**Average individual tutoring revenue per active student:** ₦20,000 per month

  

**Average school SaaS revenue per school:** ₦180,000 per month

  

**Marketplace commission on gross tutoring volume:** 20%

  

**Year**

**Active Students**

**Schools**

**Tutors**

**Est. Revenue**

**Illustrative Note**

**Year 1**

**300**

**10**

**60**

**₦97.2m**

**Validation year; focus on product-market fit and retention**

**Year 2**

**900**

**35**

**180**

**₦309.6m**

**Expansion year; stronger school sales and referrals**

**Year 3**

**2,000**

**80**

**400**

**₦700.8m**

**Scale year; optimise unit economics and school contracts**

  

**Suggested Financial Tracking Metrics**

*   **Customer acquisition cost (CAC)**
*   **Lifetime value (LTV)**
*   **Monthly recurring revenue (MRR)**
*   **Gross margin**
*   **Tutor utilisation rate**
*   **Trial-to-paid conversion**
*   **Repeat booking rate**
*   **School churn rate**
*   **Refund rate**
*   **Class completion rate**

**13\. Go-to-Market Strategy**

  

  

*   **Start with a narrow beachhead: one-to-one tutoring for core exam subjects and high-demand school grades.**
*   **Use referral loops for parents, students, and tutors to drive organic growth.**
*   **Pilot with a small number of schools to create testimonials, case studies, and operational proof.**
*   **Use WhatsApp, Instagram, TikTok, and school community outreach for early user acquisition.**
*   **Offer a freemium or low-friction trial to reduce initial resistance.**
*   **Package results-focused messaging for parents: progress, confidence, grades, and accountability.**
*   **Build a school sales pitch around teacher productivity, added revenue, and a modern digital classroom.**
*   **Expand internationally by enabling dual-currency payments and global tutor recruitment.**

**14\. Recommended Technology Architecture**

  

  

**Frontend:** React / Next.js with TypeScript, responsive UI, component library, and role-based routing.

  

**Backend:** Node.js with NestJS or equivalent structured framework, REST/GraphQL APIs, and background job processing.

  

**Database:** PostgreSQL for core relational data; Redis for caching and real-time coordination.

  

**Real-Time Collaboration:** WebSockets, collaborative state sync, shared whiteboard engine, and live presence indicators.

  

**Video Classroom:** Embedded via an API-first provider such as Daily, Twilio Video, or equivalent with fallback audio-only mode.

  

**Storage:** Object storage for recordings, images, documents, and lesson assets with CDN delivery.

  

**Payments:** Multi-currency gateway support (Paystack, Flutterwave, Stripe), invoices, subscriptions, and payout workflows.

  

**Messaging:** Email, SMS, push notifications, and WhatsApp integration via provider APIs.

  

**Analytics:** Event tracking, dashboards, funnel analytics, session logs, and full audit trails.

  

**Security:** Role-based access control, encryption at rest and in transit, content moderation tools, and audit logging. Strict separation between Platform Admin and Super-Admin privilege levels.

**15\. Data Model / Schema Blueprint**

  

  

**Entity**

**Key Fields**

**Purpose**

**users**

id, name, email, phone, password\_hash, role, status

Base authentication and identity table

**student\_profiles**

user\_id, grade, subjects, learning\_goals, parent\_id

Student-specific data

**parent\_profiles**

user\_id, preferred\_contact, billing\_preferences

Parent-specific data

**tutor\_profiles**

user\_id, bio, subjects, verification\_status, payout\_details

Tutor-specific data

**school\_profiles**

id, name, tenant\_id, branding, plan

School account and tenant data

**classes**

id, tutor\_id, school\_id, mode, schedule, status

Live or scheduled learning sessions

**enrollments**

class\_id, student\_id, status, attendance

Who is in which class

**bookings**

student\_id, tutor\_id, class\_id, start\_time, payment\_status

One-to-one and group bookings

**lesson\_notes**

class\_id, content, attachments, created\_by

Teaching materials and summaries

**quizzes**

id, class\_id, title, question\_count, score\_rules

Assessments and practice tests

**quiz\_attempts**

quiz\_id, student\_id, score, time\_spent, answers

Assessment results

**flashcards**

topic\_id, prompt, answer, difficulty

Revision content

**games**

template\_type, topic\_id, payload, score\_rules

Gamified learning modules

**rubrics**

class\_id, criteria, scoring\_scale

Teacher scoring and post-class analysis

**reviews**

reviewer\_id, tutor\_id, rating, comments, status

Quality control and trust

**payments**

payer\_id, amount, currency, method, status

Billing and settlement

**payouts**

tutor\_id, amount, currency, status

Tutor earnings and disbursement

**notifications**

user\_id, type, payload, read\_at

Alerts and messages

**audit\_logs**

actor\_id, action, entity\_type, entity\_id, timestamp

Traceability and compliance

**feature\_flags**

key, value, scope, updated\_by, updated\_at

System-wide feature toggle registry

**16\. Analytics, Reporting, and KPIs**

  

  

*   **Student activation rate**
*   **Session attendance rate**
*   **Homework completion rate**
*   **Average tutor rating**
*   **Parent satisfaction score**
*   **Tutor retention rate**
*   **School renewal rate**
*   **Revenue per user**
*   **Lesson completion rate**
*   **Time to first class**

**17\. Risks and Mitigation**

  

  

**Low User Engagement:** Use gamification, short learning cycles, reminders, and visible progress indicators.

  

**Tutor Quality Inconsistency:** Use verification, rubrics, reviews, and performance-based approval workflows.

  

**Payment Friction:** Support local and international payment methods, retry logic, and wallet-based pre-payment.

  

**Connectivity Issues:** Design low-bandwidth modes, downloadable resources, and mobile-first screens with offline fallbacks.

  

**School Adoption Resistance:** Offer pilot pricing, case studies, onboarding support, and ROI-focused messaging.

  

**Admin Privilege Abuse:** Strict role separation between Platform Admin and Super-Admin with full audit trail coverage on all sensitive actions.

  

**Platform Sprawl:** Keep TutorsPro focused and modular with clear product boundaries and feature flag controls for gradual rollouts.

**18\. Suggested Build Roadmap**

  

  

**Phase 1 — MVP:** Accounts, tutor profiles, bookings, live classroom, payments, parent view, tutor dashboard, and basic Platform Admin panel.

  

**Phase 2 — Retention Layer:** Quizzes, flashcards, class notes, ratings, notifications, progress reports, and recap emails.

  

**Phase 3 — School SaaS:** Multi-tenant school workspace, teacher onboarding, class management, branding, and school billing.

  

**Phase 4 — Scale and Intelligence:** Super-Admin infrastructure console, feature flags, recommendation engine, AI-assisted lesson support, advanced analytics, and dual-currency expansion.

**19\. Conclusion**

  

  

TutorsPro.ng should be built as a focused tutoring platform with strong lesson delivery, visible progress, and role-specific experiences. The winning edge is not just live tutoring — it is the combination of trust, feedback, parent visibility, tutor operations, and school-ready SaaS architecture.

  

The revised screen inventory formalises 72 screens across six distinct roles, with a clear operational boundary between Platform Admin staff (who manage users, tutors, disputes, and content) and Super-Admins (who manage the underlying infrastructure, security, and release controls).

  

If the core experience is excellent, the platform can grow from a local tutoring marketplace into a regional and global tutoring infrastructure.

  

  

  

_TutorsPro.ng · Confidential · May 2026_
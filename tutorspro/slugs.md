# TutorsPro.ng Page Slugs (Revised Blueprint v2)

This document lists the routes for the TutorsPro.ng platform as defined in the revised product blueprint (May 2026). The platform features 72 screens across six distinct roles.

## Public / Marketing Screens (8 screens)
- **Home**: `/` - Marketing landing page with hero CTA, featured tutors, and sign-up prompts.
- **About / How It Works**: `/about` - Explains the platform model and vetting standards.
- **Tutor Directory**: `/tutors` - Publicly browsable listing of approved tutors with filters.
- **Pricing**: `/pricing` - Session pricing tiers, bundle options, and comparison table.
- **School Plans**: `/schools` - School-facing pricing for the multi-tenant SaaS model.
- **FAQ**: `/faq` - Categorized answers to common questions for all users.
- **Contact Us**: `/contact` - Contact form for general inquiries and partnerships.
- **Blog / Resources**: `/blog` - Articles, study guides, and platform updates.

## Student Screens (17 screens)
- **Student Signup**: `/signup` - Multi-step registration (Email, Google OAuth).
- **Student Login**: `/login` - Standard login with session persistence.
- **Student Onboarding**: `/onboarding` - Guided flow to set subjects and learning goals.
- **Student Dashboard**: `/student/dashboard` - Home for upcoming classes, XP progress, and recommendations.
- **Find a Tutor**: `/student/find-tutor` - Interactive search/filter for discovery.
- **Book a Session**: `/student/bookings` - Step-by-step booking and payment flow.
- **Upcoming Classes**: `/student/classes` - Chronological list of confirmed sessions with join buttons.
- **Live Classroom**: `/student/classroom` - Full in-session collaborative experience.
- **Assignments**: `/student/assignments` - Homework list, submission form, and feedback view.
- **Quizzes**: `/student/quizzes` - Subject-aligned MCQ/short-answer quiz bank.
- **Flashcards**: `/student/flashcards` - Spaced-repetition card sets.
- **Games Hub**: `/student/games` - Gamified learning activities and challenges.
- **Progress Reports**: `/student/progress` - Visual summary of attendance and mastery.
- **Certificates**: `/student/certificates` - Digital achievement certificates for download/sharing.
- **Messages**: `/student/messages` - In-platform messaging with tutors.
- **Wallet / Payments**: `/student/wallet` - Balance, top-up, and transaction history.
- **Settings**: `/student/settings` - Account and notification preferences.

## Parent Screens (9 screens)
- **Parent Login**: `/parent/login` - Isolated parent login portal.
- **Child Linking / Invite Code**: `/parent/children` - Link multiple child accounts.
- **Parent Dashboard**: `/parent/dashboard` - Overview of all linked children's activity.
- **Attendance and Lesson History**: `/parent/history` - Full log of past sessions and recordings.
- **Progress Analytics**: `/parent/progress` - Graphical progress trends and subject mastery.
- **Tutor Feedback**: `/parent/feedback` - Rate sessions and submit tutor reviews.
- **Notifications**: `/parent/notifications` - Alert inbox for reminders and billing events.
- **Billing**: `/parent/billing` - Payment history and subscription management.
- **Support Center**: `/parent/support` - Help desk and ticket submission.

## Tutor Screens (13 screens)
- **Tutor Signup / Onboarding**: `/tutor/onboarding` - Multi-step application and verification flow.
- **Profile and Verification**: `/tutor/profile` - Public profile editor and review summary.
- **Calendar and Availability**: `/tutor/calendar` - Manage available slots and personal time.
- **Class Requests**: `/tutor/requests` - Inbox for incoming booking requests.
- **Teaching Dashboard**: `/tutor/dashboard` - Daily hub for classes and earnings snapshot.
- **Lesson Planner**: `/tutor/planner` - Tool to outline objectives and attach resources.
- **Live Classroom**: `/tutor/classroom` - Host-side session view with host controls.
- **Whiteboard**: `/tutor/whiteboard` - Standalone collaborative drawing tool.
- **Resources**: `/tutor/resources` - Personal library for lesson materials.
- **Student Progress View**: `/tutor/student-progress` - Individual student performance tracking.
- **Earnings**: `/tutor/earnings` - Detailed earnings breakdown and commission tracking.
- **Payouts**: `/tutor/payouts` - Request disbursements and view payout history.
- **Reviews**: `/tutor/reviews` - Display of received ratings and feedback.

## School Admin Screens (10 screens)
- **School Registration**: `/school/signup` - Multi-tenant school sign-up.
- **School Dashboard**: `/school/dashboard` - Overview of tenant classes and activity.
- **Teacher Onboarding**: `/school/teachers` - Invite and manage school-assigned teachers.
- **Class Creation**: `/school/classes` - Set up classes, teachers, and student groups.
- **Student Import**: `/school/students` - Bulk CSV import and credential generation.
- **Subscription Management**: `/school/subscription` - Manage school plan and teacher seats.
- **Branding Settings**: `/school/branding` - White-label logo and color customization.
- **Reports**: `/school/reports` - Downloadable attendance and performance reports.
- **Usage Analytics**: `/school/analytics` - Data dashboard for engagement trends.
- **School Notifications**: `/school/notifications` - Admin center for tenant-level alerts.

## Platform Admin Screens (7 screens - Operations)
- **Platform Admin Dashboard**: `/platform-admin/dashboard` - Operational command center.
- **User Management**: `/platform-admin/users` - Manage all user accounts across roles.
- **Tutor Verification Queue**: `/platform-admin/tutor-verification` - Review application documents/recordings.
- **Payment Operations and Billing**: `/platform-admin/payments` - Transaction visibility, refunds, and payouts.
- **Dispute Resolution**: `/platform-admin/disputes` - Case management for student-tutor conflicts.
- **Content Moderation**: `/platform-admin/moderation` - Review flagged content and resources.
- **Support Ticket Management**: `/platform-admin/support` - Unified helpdesk for all user support tickets.

## Super-Admin Screens (8 screens - Infrastructure)
- **Super-Admin Dashboard**: `/super-admin/dashboard` - Infrastructure uptime and resource overview.
- **System Health and Monitoring**: `/super-admin/health` - Real-time service health and server metrics.
- **Feature Flags and Configurations**: `/super-admin/feature-flags` - Global and per-segment feature toggles.
- **Database and Storage Management**: `/super-admin/infrastructure` - DB instances, storage buckets, and migrations.
- **API Keys and External Integrations**: `/super-admin/integrations` - Registry of 3rd-party API credentials.
- **Audit Logs and Security Trails**: `/super-admin/audit-logs` - Immutable logs of all sensitive actions.
- **Global Roles and Permissions**: `/super-admin/permissions` - Master permission editor and role definition.
- **System-wide Analytics**: `/super-admin/analytics` - Aggregate analytics across all tenants.

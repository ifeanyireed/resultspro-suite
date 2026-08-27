# CoursesPRO (BuilderOS) Slugs

This file documents the routing slugs and dynamic paths used across the CoursesPRO (BuilderOS) application, based on the Product Blueprint IA.

## Public Pages (`src/app/`)
- `/` - Landing Page
- `/cohorts` - Browse Open Cohorts
- `/enterprise` - CoursesPRO for Enterprise
- `/pricing` - Pricing & Plans
- `/apply` - Become an Instructor / Mentor Application

## Authentication
- `/login` - User Login (SSO/Credentials)
- `/signup` - Student Registration

## Internal Dashboard (`/(app)/`)
The left navigation forms the spine of the product, with the following 14 core modules:

- `/dashboard` - Main Overview / Analytics
- `/dashboard/journey` - The Learning Journey (Foundational Knowledge -> Demo Day)
- `/dashboard/projects` - Project Management & Submissions
- `/dashboard/workspace` - Kanban Workspace for Tasks
- `/dashboard/classroom` - Live Classroom / Video Sessions
- `/dashboard/peers` - Peer Networking & Presence
- `/dashboard/mentors` - Mentor Directory & Booking
- `/dashboard/messages` - Direct Messaging
- `/dashboard/leaderboard` - Cohort Leaderboard & XP
- `/dashboard/achievements` - Badges & Certificates
- `/dashboard/calendar` - Schedule & Live Events
- `/dashboard/resources` - Shared Content & Links
- `/dashboard/portfolio` - Published Work (Demo Day Output)
- `/dashboard/settings` - Account & Billing Preferences

## Dynamic Routes
- `/dashboard/journey/[moduleId]` - View a specific module in the journey
- `/dashboard/projects/[projectId]` - Details and submission flow for a specific project
- `/dashboard/portfolio/[publicSlug]` - A student's public-facing portfolio

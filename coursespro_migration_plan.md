# CoursesPRO Migration & Stabilization Plan

This document details the step-by-step strategy to align `coursespro` (our cohort-based learning OS) with our new modular architecture and localization standards.

## 1. Asset Localization (Avatars & Course Imagery)
* **Objective:** Eliminate reliance on external CDNs (`unsplash.com`) to guarantee instant load times and circumvent rate limiting.
* **Action:** 
  * `coursespro` currently relies heavily on `images.unsplash.com` for dynamic user avatars (mentors and peers) and course thumbnails across its entire mock database (`src/lib/data.ts`) and pages (e.g., `classroom/page.tsx`, `leaderboard/page.tsx`).
  * We will execute a bulk replacement of all Unsplash URLs with our static `/avatars/characterX.jpg` assets for users, and import local, high-quality course thumbnails into the `public/images/` directory.

## 2. Decoupling & UI Alignment
* **Objective:** Ensure the internal dashboard is completely immune to Tailwind v4 class overriding and design system conflicts.
* **Action:** 
  * `coursespro` employs a very robust `flex h-screen` layout (`src/app/layout.tsx`) that naturally avoids the `fixed` navbar overlap bugs we saw in ExamsPRO.
  * However, we will audit `Sidebar.tsx` and the internal cohort dashboards (`classroom`, `journey`, `projects`) to ensure all interactive elements (buttons, active states) utilize the new, strict local utility classes rather than inheriting generic Shadcn variables (`bg-primary`) that might clash with its unique brand colors.

## 3. Modular Architecture Preparation
* **Objective:** Align the app's routing structure with the rest of the ecosystem.
* **Action:** 
  * Currently, `coursespro` lacks an explicit authentication gate or `login` page in its routing tree.
  * We will prepare the necessary middleware and implement the standard `SharedLoginPage` architecture (or wire it to the global ResultsPRO SSO) so users experience a unified, branded login flow when attempting to access their cohorts.
  * We will also verify that no hidden administrative logic exists within the `mentor` or `dashboard` routes; if any platform-level administration tools are discovered, they will be ported directly to the centralized `admin` suite (`admin/src/app/(dashboard)/coursespro/`).

## 4. School Admin Centralization
* **Objective:** Unify all school administrative tools into the centralized `schoolhub` application.
* **Action:** Extract any "School Admin" screens, dashboards, or logic currently residing in this app (if any). Migrate these components directly into the `/school/*` dashboard route within `schoolhub/web_app`. This ensures school administrators have a single "MODULAR SUITE CONTROLS" command center in `schoolhub` rather than fragmented experiences across four different apps.

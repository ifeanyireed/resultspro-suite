# SchoolHub Migration & Centralization Plan

This plan outlines the steps required to align the `schoolhub` application with our modern standards, with a specific focus on establishing it as the ultimate centralized portal for all School Admin operations across the entire ecosystem.

## 1. Centralize the School Admin Dashboards
* **Objective:** Unify all fragmented school administrative tools into a single, cohesive hub.
* **Action:** 
  * We will construct a new, robust `MODULAR SUITE CONTROLS` environment specifically for School Administrators at the `/school/*` route within `schoolhub/web_app/src/app/school/`.
  * We will extract the isolated School Admin dashboards currently residing in `resultspro`, `tutorspro`, `classroompro`, and `coursespro`.
  * All these external school admin screens will be ported into this unified `schoolhub` dashboard, giving school administrators a single command center to manage results, tutors, classrooms, and cohorts without switching apps.

## 2. Decouple Shared Dependencies
* **Objective:** Ensure the Next.js `web_app` builds seamlessly without relying on deprecated shared packages.
* **Action:** Scan the `schoolhub/web_app` package and import trees to verify no ties to `@resultspro/design-system` remain. Any essential UI cards, auth layouts, or sidebars will be inlined directly into `schoolhub/web_app/src/components/`.

## 3. UI Alignment & Tailwind v4
* **Objective:** Enforce consistent brand styling and prevent CSS overrides.
* **Action:** Audit the internal portal components (`src/app/(portal)`) and swap out any Shadcn components that rely on default `bg-primary` utility classes with strict, branded HTML `<button>` tags to bypass Tailwind v4 collisions.

## 4. Asset Localization
* **Objective:** Eliminate external CDNs (like `pravatar.cc` or `unsplash.com`) to guarantee instant load times and circumvent rate limits.
* **Action:** Update all teacher and student profile pages, leaderboards, and dashboard headers to reference our centralized, static local assets (`/avatars/characterX.jpg`) instead of external APIs.

## 5. Auth Flow & Layout Integrity
* **Objective:** Synchronize the login experience and prevent fixed layout overlap bugs.
* **Action:** 
  * Align the school portal login aesthetic with the unified `SharedLoginPage` standard.
  * Audit the top and bottom navigation bars in the web app. Ensure we rely on `sticky top-0` or robust `flex h-screen` models rather than `fixed` elements to prevent content overlap on public-facing marketing pages.

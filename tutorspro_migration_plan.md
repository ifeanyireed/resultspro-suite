# TutorsPRO Migration & Stabilization Plan

This document details the step-by-step strategy to align `tutorspro` with our new modular suite architecture, ensuring its complex multi-role environment remains secure, performant, and perfectly on-brand.

## 1. Massive Legacy Admin Extraction
* **Objective:** Securely centralize top-tier platform controls and reduce the attack surface of the public Next.js app.
* **Action:** 
  * `tutorspro` currently houses extensive administrative logic directly in its routing tree (`src/app/super-admin/` and `src/app/platform-admin/`).
  * We will execute a full extraction of these directories (including `audit-logs`, `infrastructure`, `tutor-verification`, and `disputes`).
  * These routes will be safely ported into the unified `admin` modular suite under `admin/src/app/(dashboard)/tutorspro/` with segmented RBAC (Role-Based Access Control) tabs for Super Admins and Platform Admins.

## 2. Decoupling & UI Alignment
* **Objective:** Prevent build-time collisions and standardize the visual interface across its 6 roles (Parent, Student, Tutor, School, etc.).
* **Action:** 
  * Verify that no residual ties to `@resultspro/design-system` exist in the layouts.
  * Audit `src/components/layout/` to ensure all Shadcn `<Button>` tags and structural cards are resilient to Tailwind v4 class overriding (e.g., swapping `bg-primary` for strict local utility classes).

## 3. Advanced Asset Localization
* **Objective:** Eliminate external CDNs for imagery to improve performance and circumvent API rate limits.
* **Action:** 
  * `tutorspro` currently relies heavily on `https://i.pravatar.cc` in its core files (`page.tsx` and `AdminHeader.tsx`) for generating dynamic avatars. We will write a utility to replace this logic with our centralized, static `/avatars/characterX.jpg` assets.
  * We will scan the `blog/` module (e.g., `BlogPostClient.tsx`) to remove hardcoded fallback images relying on `images.unsplash.com`. These will be swapped for our high-quality, localized educational photography stored securely in the `public/` directory.

## 4. Layout Integrity & Navigation
* **Objective:** Ensure flawless scrolling and component layering across all viewport sizes.
* **Action:** 
  * While `Navbar.tsx` utilizes `sticky top-0` (which naturally avoids the `fixed` overlap bug fixed in ExamsPRO), we will rigorously test the mobile navigation (`fixed bottom-0`) to ensure it injects proper padding-bottom into the main layout so it doesn't obscure the footer.
  * Validate that the Hero elements on `page.tsx` cleanly slip beneath the blurred sticky header on scroll.

## 5. Authentication Flow Synchronization
* **Objective:** Maintain its advanced OAuth logic while standardizing its aesthetic.
* **Action:** 
  * Review `tutorspro/src/app/login/page.tsx`. It correctly implements Google and Microsoft MSAL integrations. 
  * We will retain this advanced logic but synchronize its HTML/CSS structure to flawlessly mirror the polished `SharedLoginPage` standard we established in the rest of the ecosystem (including custom brand titles and synchronized loading animations).

## 6. School Admin Centralization
* **Objective:** Unify all school administrative tools into the centralized `schoolhub` application.
* **Action:** Extract any "School Admin" screens (`src/app/school`), dashboards, or logic currently residing in this app. Migrate these components directly into the `/school/*` dashboard route within `schoolhub/web_app`. This ensures school administrators have a single "MODULAR SUITE CONTROLS" command center in `schoolhub` rather than fragmented experiences across four different apps.

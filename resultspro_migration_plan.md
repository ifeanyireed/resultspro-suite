# ResultsPRO Migration & Stabilization Plan

This plan outlines the steps required to align the main `resultspro` application with the new architectural standards, UI polish, and unified command center structure we applied across the suite.

## 1. Audit & Decouple Shared Dependencies
* **Objective:** Ensure the Vite/React SPA builds cleanly without missing packages.
* **Action:** While `resultspro` doesn't currently utilize `@resultspro/design-system` in `package.json`, we will audit all cross-workspace imports (e.g., UI elements, layouts) to ensure no implicit circular dependencies exist. Any shared components will be inlined directly into `resultspro/src/components/ui/`.

## 2. Admin & Super-Admin Migration
* **Objective:** Centralize all platform administration into the unified `admin` Next.js modular suite.
* **Action:** 
  * Sweep `resultspro/src/pages/super-admin/` and `resultspro/src/components/SuperAdminLayout.tsx`. 
  * Port these administrative panels and logic completely out of the public/school-facing `resultspro` app and into the secure `admin/src/app/(dashboard)/resultspro/` environment.
  * Update routing and authentication gates to reflect this separation of concerns.

## 3. Dashboard UI & Tailwind v4 Alignment
* **Objective:** Standardize visual identity and resolve CSS class collisions.
* **Action:** Audit `SchoolAdminLayout.tsx`, `TeacherDashboardLayout.tsx`, and `ParentDashboardLayout.tsx`. We will replace any misbehaving Shadcn `<Button>` components with raw, styled `<button>` tags to bypass `bg-primary` conflicts, ensuring they reflect the correct ResultsPRO brand colors across all user roles.

## 4. Asset Localization (Imagery & Icons)
* **Objective:** Ensure all visual assets load instantly and securely without relying on third-party CDNs.
* **Action:** 
  * Audit `resultspro/src/pages/Landing.tsx` and `resultspro/src/components/Hero.tsx` for stock photography. Replace external images with localized high-quality photography from the `public/` folder.
  * Ensure any avatars generated in the School/Teacher/Parent dashboards utilize local assets (`/avatars/characterX.jpg`) or reliable internal endpoints rather than external rate-limited services.

## 5. Public Layout & Navigation Integrity
* **Objective:** Prevent UI overlaps and ensure smooth scrolling on public-facing marketing pages.
* **Action:** Review `resultspro/src/components/Navigation.tsx`. If it uses a `fixed` position header similar to the early ExamsPRO layout, we will inject a global CSS spacer (e.g., `pt-[72px]`) or swap it to `sticky top-0` to ensure content on `Landing.tsx`, `About.tsx`, and `Pricing.tsx` is never obscured behind the navbar.

## 6. Authentication Standardization
* **Objective:** Unify the login experience across all microservices.
* **Action:** Audit `resultspro/src/pages/auth/`. While the Vite app uses client-side routing, we will align the aesthetic of the login pages to perfectly match the `SharedLoginPage` standard (custom brand titles, dark aesthetic) we established in the rest of the ecosystem.

## 7. School Admin Centralization
* **Objective:** Unify all school administrative tools into the centralized `schoolhub` application.
* **Action:** Extract any "School Admin" screens (`src/pages/school-admin` and `SchoolAdminLayout.tsx`), dashboards, or logic currently residing in this app. Migrate these components directly into the `/school/*` dashboard route within `schoolhub/web_app`. This ensures school administrators have a single "MODULAR SUITE CONTROLS" command center in `schoolhub` rather than fragmented experiences across four different apps.

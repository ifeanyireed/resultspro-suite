# ClassroomPRO Migration & Stabilization Plan

This plan outlines the steps required to apply the same architectural stability, UI polish, and asset localization to `classroompro` that was successfully implemented in `examspro`.

## 1. Audit & Decouple Shared Dependencies
* **Objective:** Prevent Next.js Turbopack build failures and ensure UI independence.
* **Action:** Scan `classroompro/package.json` and imports for any remaining hooks into `@resultspro/design-system`. If found, we will manually extract and inline critical components (e.g., `SharedLoginPage`, `Cards`, `DashboardLayout`) directly into `classroompro/src/components/` to guarantee build stability.

## 2. Dashboard UI & Settings Alignment
* **Objective:** Maintain brand consistency and prevent CSS overrides.
* **Action:** Audit `classroompro/src/app/dashboard` and its settings modules for Tailwind v4 collisions (e.g., Shadcn's default `bg-primary` overriding custom colors). We will swap problematic Shadcn components with raw HTML elements (`<button>`) styled precisely to ClassroomPRO's primary color palette.

## 3. Asset Localization (Avatars & Imagery)
* **Objective:** Eliminate reliance on rate-limited external CDNs and localize the app's visual identity.
* **Action:** 
  * Scan `ProfileModal.tsx`, dashboard headers, and class rosters for external avatar services (like `pravatar.cc`). Point them to the centralized, high-speed static assets (`/avatars/characterX.jpg`).
  * If the landing page (`classroompro/src/app/page.tsx`) or marketing sections utilize stock placeholder images, replace them with high-quality local photography of Nigerian students/classrooms (similar to the Pexels integrations applied to ExamsPRO).

## 4. Public Layout Integrity
* **Objective:** Ensure flawless scrolling and component layering across all viewport sizes.
* **Action:** 
  * `classroompro`'s `Navbar.tsx` utilizes `sticky top-0` (which naturally avoids the `fixed` overlap bug fixed in ExamsPRO), but we will audit the mobile navigation (`fixed bottom-0`) to ensure it injects proper padding-bottom into the main layout so it doesn't obscure footer content.
  * Adjust the landing page Hero section to ensure it blends cleanly beneath the sticky navbar.

## 5. Legacy Code & Admin Purge
* **Objective:** Keep the user-facing application lightweight and secure.
* **Action:** Sweep the `classroompro/src/app/` directory for any stray `admin`, `moderation`, or `control` routes. If found, we will securely archive them, remove them from the Next.js router, and port their logic over to the unified `admin` modular suite under `admin/src/app/(dashboard)/classroompro/`.

## 6. Authentication Flow Synchronization
* **Objective:** Standardize the authentication aesthetic while preserving advanced features.
* **Action:** Review `classroompro/src/app/login/page.tsx`. While it possesses a unique dark-themed UI with Google/Microsoft OAuth and 2FA, we will verify that its login handlers (`handleEmailLogin`, `handleMfaVerify`) are strictly wired to production APIs (`api.post`) and not mocking requests. We will align its typography and structural flow to closely match the updated `SharedLoginPage` standard.

## 7. School Admin Centralization
* **Objective:** Unify all school administrative tools into the centralized `schoolhub` application.
* **Action:** Extract any "School Admin" screens, dashboards, or logic currently residing in this app. Migrate these components directly into the `/school/*` dashboard route within `schoolhub/web_app`. This ensures school administrators have a single "MODULAR SUITE CONTROLS" command center in `schoolhub` rather than fragmented experiences across four different apps.

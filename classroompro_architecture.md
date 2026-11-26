MASTER AGENT INSTRUCTION: CLASSROOM PRO ARCHITECTURE AUDIT & IMPLEMENTATION

1. OBJECTIVE

Conduct a comprehensive architectural audit of the existing Results Pro Suite monorepo and implement the infrastructure, content management, content delivery, and offline-first capabilities required for Classroom Pro.

Classroom Pro is a curriculum-aligned learning management platform built around the Nigerian Educational Research and Development Council (NERDC) curriculum.

The platform will support:

* Primary 1–6.
* Junior Secondary School 1–3.
* Senior Secondary School 1–3.
* Multiple subjects per class.
* Terms, schemes of work and weekly lesson plans.
* Rich educational notes containing text, images, diagrams, AI storybooks and illustrations.
* Curriculum-aligned educational video lessons (curated & linked YouTube educational videos mapped to weekly topics — zero raw video file uploads).
* Spaced-repetition flashcards (SRS).
* Exercises, quizzes and CBT assessments (with traceable teacher score-approval sync to CampusPRO).
* Student, teacher, parent and principal curriculum-oversight experiences.
* Web and mobile applications.
* Offline-first learning.

IMPORTANT: This is an existing project. Do not assume that any component is missing simply because it is not mentioned here. Audit the existing implementation before making changes.

Your responsibility is to identify what already exists, reuse it where appropriate, and implement only what is missing or incomplete.

Do not rebuild existing working infrastructure unnecessarily.

⸻

2. UNDERSTAND THE EXISTING MONOREPO

Results Pro Suite is the central monorepo housing multiple education applications, frontend projects and backend microservices.

Other applications in the 5-product school-focused suite include:

* **CampusPRO** (`scholars_ng/web_app` & `service_campuspro`): The foundational School Operations & Academic ERP System of Record (Multi-Campus Setup, Academic Sessions & Terms, Classes & Arms, Subject Definitions & Teacher Allocations, Manage Teachers, Manage Students, Manage Parents & Wards, Attendance, Fees/Billing, and **All Messaging & Circulars**).
* **ClassroomPRO** (`classroompro` & `service_classroompro`): The NERDC Digital Learning & Formative Assessment Hub (Markdown Lesson Notes, AI Storybooks, **Educational Video Lessons**, Spaced-Repetition Flashcards, Practice Quizzes/CBT, Multi-Year Attempt History, Topic-Level Learning-Gap Analytics, and Teacher Score Approval Sync to CampusPRO).
* **ResultsPRO** (`resultspro` & `service_resultspro`): The AI Assessment & Result Intelligence Engine (Handwritten Marksheet OCR & Voice Score Entry reconciled against CampusPRO rosters, Pre-Publication AI Result Auditor, Deterministic Broadsheet & Report Card Engine, AI Teacher/Principal Remarks, Multi-Campus Performance Intelligence, AI Results-Processing Officer Copilot, and Parent AI Result Interpreter that triggers 1-click ClassroomPRO Remedial Packs).
* **TutorsPRO** (`tutorspro` & `service_tutorspro`): 1-on-1 Vetted Tutor Discovery, Session Booking & Scheduling, Live Video Classroom & Interactive Whiteboard, and Tutor Payouts.
* **PuzzlePRO** (`puzzlepro` & `service_puzzlepro`): Blockly Visual Coding Studio, 636 Gamified Coding & Robotics Adventures (Worlds 1–6), Cohort World Assignment (consuming CampusPRO classes read-only), and XP Leaderboards.

The applications may have independent frontends and backend services while sharing foundational infrastructure.

Before implementation:

1. Inspect the complete repository structure.
2. Identify all frontend applications.
3. Identify all backend microservices.
4. Identify shared packages and libraries.
5. Inspect the existing PostgreSQL configuration and database architecture.
6. Inspect Redis configuration and existing usage.
7. Identify authentication and identity services.
8. Identify billing, subscription and tenant-management services.
9. Identify existing file storage and image management.
10. Inspect deployment configuration and environment variables.
11. Identify existing mobile applications and their frameworks.
12. Inspect existing API conventions, database migration patterns and testing infrastructure.

Produce an initial audit report showing:

Area	Existing implementation	Gap	Required action
PostgreSQL	Audit	Audit	Reuse or extend
Redis	Audit	Audit	Reuse or extend
Classroom backend	Audit	Audit	Complete missing functionality
Markdown content	Audit	Audit	Implement if missing
Cloudinary	Audit	Audit	Integrate if missing
Web offline support	Audit	Audit	Implement if missing
Mobile offline support	Audit	Audit	Implement if missing
Content synchronization	Audit	Audit	Implement if missing

Do not stop after producing the report. Proceed with implementation unless a critical architectural decision, destructive migration or unavailable credential requires approval.

⸻

3. DATABASE ARCHITECTURE

The existing Results Pro Suite uses a shared PostgreSQL database across its microservices.

Preserve this architecture.

Do not introduce another PostgreSQL instance solely for Classroom Pro.

First inspect whether the existing services use separate schemas, shared schemas, tenant identifiers or another established isolation convention.

Follow the existing database ownership and migration conventions.

Classroom Pro must have appropriately isolated data structures for:

* Shared NERDC Master Curriculum Hierarchy (Level -> Grade `Primary 1–6 / JSS 1–3 / SSS 1–3` -> Subject -> Term -> Week -> Topic). *(Note: School-specific academic sessions/terms, classes/arms, subject allocations, teacher directories, and student enrolments are owned exclusively by **CampusPRO** and consumed read-only by ClassroomPRO).*
* Schemes of work & weekly topics.
* Learning objectives.
* Markdown Lessons & AI Storybooks.
* **Video Lessons** (linked YouTube video IDs/URLs, duration, transcript/summary, and topic association — no direct video file uploads).
* Spaced-Repetition Flashcard Decks & review queues.
* Lesson metadata & lesson assets.
* Content versions & content publication records.
* Assignments & remedial revision packs (including packs triggered from **ResultsPRO** report card diagnostics).
* Student topic mastery & multi-year attempt history.
* Bookmarks.
* Quiz attempts & formative assessment submissions.
* **Traceable Score-Approval Sync Records** (`classroompro_assessment_id` linking teacher-approved official CA scores pushed into **CampusPRO's Official Exam Score Ledger**).
* Offline synchronization records.

Use relational PostgreSQL tables for structured application data.

Do not store large images or binary files in PostgreSQL.

Where structured educational content needs flexible representation, JSONB may be used for suitable content metadata or assessment structures.

Do not duplicate the entire shared curriculum for every school tenant.

Shared curriculum content should be reusable across schools. School-specific assignments, schedules, teacher-created materials and student progress must remain appropriately tenant-scoped.

Implement appropriate:

* Foreign keys.
* Indexes.
* Unique constraints.
* Tenant isolation.
* Data validation.
* Migration scripts.
* Audit fields.
* Access control.

Never bypass existing identity or tenant-isolation mechanisms.

⸻

4. MARKDOWN-BASED EDUCATIONAL CONTENT

A central architectural requirement is that Classroom Pro lesson notes should be authored and maintained as Markdown files.

Do not convert the entire lesson library into database text fields simply because PostgreSQL is available.

Markdown is the primary authoring and source format for educational notes.

Create or extend a content repository following a logical structure similar to:

classroom-content/

* curriculum/
    * nerdc/
        * primary/
            * primary-1/
            * primary-2/
            * primary-3/
            * primary-4/
            * primary-5/
            * primary-6/
        * junior-secondary/
            * jss-1/
            * jss-2/
            * jss-3/
        * senior-secondary/
            * sss-1/
            * sss-2/
            * sss-3/
* subjects/
* lesson-assets/
* assessments/
* content-manifests/

Organise content by:

* Curriculum.
* Academic level.
* Class.
* Subject.
* Term.
* Week.
* Topic.
* Lesson.

Example:

primary/
primary-4/
mathematics/
first-term/
week-01.md
week-02.md
week-03.md

Markdown lessons should support:

* Headings.
* Paragraphs.
* Ordered and unordered lists.
* Tables.
* Images.
* Diagrams.
* Mathematical notation.
* Code blocks where appropriate.
* Learning objectives.
* Examples.
* Exercises.
* Further reading.
* Teacher guidance where applicable.

Establish a consistent Markdown content specification.

Use stable content IDs rather than relying exclusively on filenames or directory paths.

A lesson should have metadata identifying its:

* Content ID.
* Curriculum.
* Class.
* Subject.
* Term.
* Week.
* Topic.
* Version.
* Publication status.
* Last modification time.
* Associated assets.

PostgreSQL should maintain the searchable metadata, relationships, publication status and content versions.

The actual Markdown files should remain independently portable.

⸻

5. CONTENT MANAGEMENT AND PUBLISHING

Audit the existing administrative interfaces.

Implement the necessary Classroom Pro content-management workflow if it does not already exist.

Authorised academic content administrators and teachers should be able to:

1. Manage the shared NERDC curriculum structure (while school-specific classes, subjects, terms, teachers, and students are managed in **CampusPRO** and synced read-only).
2. Define schemes of work and organise weekly topics mapped to CampusPRO subjects.
3. Create or import Markdown lessons and AI storybooks.
4. Link curated **YouTube Video Lessons** (with YouTube URL/ID, duration, transcript/key takeaways, and topic mapping — no raw video uploads).
5. Create Spaced-Repetition (SRS) Flashcard decks and AI-moderated CBT Quizzes.
6. Attach images, videos, and other learning assets.
7. Preview rendered lessons and video lectures.
8. Edit and revise content.
9. Submit content for review.
10. Approve or reject content.
11. Publish approved content.
12. Unpublish content when necessary.
13. View content versions and restore an earlier published version.
14. **Approve & Push Official Assessment Scores to CampusPRO**: Review student quiz/CBT attempts and explicitly push approved Continuous Assessment (CA) scores to **CampusPRO's Official Exam Score Ledger** (for **ResultsPRO** broadsheet consolidation) while retaining multi-year attempt telemetry in ClassroomPRO.

Support bulk content import from prepared Markdown files and organised content packages.

If GitHub is already integrated or suitable for the development workflow, use it for source control and content review.

However, do not make the production mobile or web application depend on GitHub as its primary content delivery service.

Published content should be available through an appropriate production content-delivery mechanism.

Implement a publishing pipeline that:

1. Validates Markdown.
2. Validates lesson metadata.
3. Checks referenced assets.
4. Generates a versioned content manifest.
5. Publishes approved content.
6. Makes published content available to the application through an API or CDN.
7. Records the published version in PostgreSQL.

Only approved and published content should be available to ordinary students.

⸻

6. IMAGE MANAGEMENT — CLOUDINARY

Use the existing Cloudinary account and integration if available.

Do not create duplicate Cloudinary configurations unnecessarily.

All educational images, illustrations and diagrams should be managed through Cloudinary.

Implement:

* Image uploads.
* Image metadata.
* Asset identification.
* Image optimisation.
* Responsive image delivery.
* Appropriate image transformations.
* Asset association with lessons.
* Validation of image references.
* Image replacement and version management where required.

Markdown lessons should reference stable asset identifiers or a controlled asset manifest rather than relying on fragile manually copied URLs.

The publishing process should resolve these identifiers into appropriate delivery URLs.

IMPORTANT:

Images required for offline learning must be downloaded to the device and stored locally.

Do not assume that Cloudinary URLs will remain accessible when the student is offline.

⸻

7. CONTENT DELIVERY AND CDN

Implement a production content-delivery strategy for published Markdown lessons.

Prefer a suitable object-storage and CDN arrangement compatible with the existing infrastructure.

The delivery system should support:

* Versioned lesson files.
* Content manifests.
* Bulk lesson downloads.
* Individual lesson retrieval.
* Cache-friendly delivery.
* Incremental updates.
* Content integrity verification.

PostgreSQL remains the authoritative source for curriculum metadata, publication records and content versions.

The published Markdown files should be efficiently distributed without requiring every student to retrieve the entire curriculum from PostgreSQL.

Do not introduce unnecessary infrastructure if an existing storage or CDN service already fulfils these requirements.

⸻

8. REDIS INTEGRATION

Redis is already part of the shared Results Pro Suite infrastructure.

Reuse the existing Redis deployment where appropriate.

Do not provision another Redis server without first establishing a technical reason.

Classroom Pro may use Redis for:

* Frequently accessed curriculum metadata.
* API response caching.
* Temporary assessment sessions.
* Synchronization job queues.
* Background content-processing jobs.
* Notification queues.
* Other appropriate short-lived application data.

Establish separate namespaces for Classroom Pro.

Example:

classroom:curriculum:*
classroom:lessons:*
classroom:sync:*
classroom:assessments:*
classroom:notifications:*

Do not interfere with existing Results Pro Redis keys or queues.

Use appropriate expiration policies and cache invalidation.

PostgreSQL remains the authoritative source for permanent student records, assessment submissions and learning progress.

Do not treat Redis as permanent storage.

⸻

9. WEB APPLICATION — PROGRESSIVE WEB APP AND OFFLINE SUPPORT

Classroom Pro web must support offline learning.

Implement Progressive Web App functionality.

The implementation should include:

A. Service Worker

Create and register a Service Worker that handles:

* Application shell caching.
* Static resource caching.
* Appropriate network request interception.
* Offline fallback behaviour.
* Cache versioning.
* Cache invalidation.
* Updates to previously cached application resources.

The Service Worker must not become a substitute for the application API or the local database.

B. Cache Storage

Use browser Cache Storage for suitable resources, including:

* Application shell.
* CSS and JavaScript bundles.
* Fonts.
* Static icons.
* Other appropriate static resources.
* Selected image and content responses.

Implement sensible caching strategies.

For example:

* Application shell: cache-first with versioned updates.
* Static assets: cache-first with revalidation where appropriate.
* Published lesson files: cache-first or stale-while-revalidate.
* Dynamic API responses: network-first where suitable.

Do not cache sensitive responses indiscriminately.

C. IndexedDB

Use IndexedDB as the structured local database for the web application.

It should support:

* Downloaded lesson metadata.
* Downloaded lesson content.
* Downloaded subject information.
* Downloaded schemes of work.
* Downloaded quizzes.
* Offline assessment attempts.
* Student progress.
* Bookmarks.
* Pending synchronization operations.
* Content versions.

Use an appropriate IndexedDB abstraction or existing project library if one is already established.

D. PWA installation

Configure:

* Web app manifest.
* Application name.
* Icons.
* Display mode.
* Theme colours.
* Appropriate offline entry point.
* Service Worker registration.

Ensure the application works over HTTPS in production.

⸻

10. MOBILE APPLICATION — SQLITE AND LOCAL STORAGE

Audit the existing Classroom Pro mobile application before choosing an implementation library.

If the application is built with Flutter, use a suitable Flutter-compatible SQLite solution rather than introducing a web-only database library.

Implement SQLite as the mobile application’s local structured database.

It should store:

* Downloaded lesson metadata.
* Downloaded Markdown content or its rendered representation.
* Subject and class information.
* Schemes of work.
* Quizzes and exercises.
* Offline assessment attempts.
* Student progress.
* Bookmarks.
* Pending synchronization operations.
* Downloaded content versions.

Use the device’s local file storage for:

* Images.
* Diagrams.
* Downloaded documents.
* Other binary educational resources.

Do not attempt to store large image binaries inside SQLite.

The mobile app must support:

1. Downloading selected classes.
2. Downloading selected subjects.
3. Downloading an academic term.
4. Downloading individual topics or lessons.
5. Reading downloaded content offline.
6. Completing supported exercises offline.
7. Saving progress offline.
8. Synchronizing when connectivity returns.
9. Removing downloaded content when requested.
10. Showing storage usage and download status.

⸻

11. OFFLINE DOWNLOAD MANAGEMENT

Implement a consistent offline download manager.

Students should not have to download the entire curriculum.

Allow selective downloads by:

* Class.
* Subject.
* Academic term.
* Week.
* Topic.
* Individual lesson.

For each downloadable package, maintain a manifest containing:

* Package ID.
* Class.
* Subject.
* Term.
* Included lesson IDs.
* Content versions.
* Asset references.
* File sizes where available.
* Package version.
* Integrity checksums.
* Publication timestamp.

Provide download progress and failure recovery.

Support interrupted downloads and retry mechanisms.

Avoid downloading unchanged resources repeatedly.

⸻

12. SYNCHRONIZATION ENGINE

This is a critical component.

Build a reliable synchronization mechanism shared conceptually across web and mobile.

Do not require the web and mobile applications to use the same local database technology.

They must, however, use compatible content structures, API contracts and synchronization rules.

The synchronization engine should support:

Download synchronization

* Retrieve published content manifests.
* Compare local and server versions.
* Identify new lessons.
* Identify modified lessons.
* Download only changed resources.
* Remove or invalidate withdrawn content appropriately.
* Verify downloads before marking them complete.

Upload synchronization

When a student completes an activity offline:

* Store the activity locally.
* Assign a stable operation ID.
* Maintain its pending synchronization status.
* Retry safely when connectivity returns.
* Submit it to the backend.
* Record the confirmed server response.
* Mark the local operation as synchronized.

Conflict handling

Implement clear conflict-resolution rules.

For example:

* Published curriculum content is server-authoritative.
* Student progress should not be overwritten by stale local data.
* Quiz submissions must be idempotent.
* Duplicate submissions must be prevented.
* Concurrent updates should be reconciled using appropriate timestamps, versions and operation IDs.

Do not assume that a successful HTTP request means an operation has been permanently saved.

Only mark an operation synchronized after receiving and validating a confirmed server response.

Synchronization status

Provide useful statuses such as:

* Downloaded.
* Pending synchronization.
* Synchronizing.
* Synchronized.
* Failed.
* Update available.

The user should be able to see when their learning activities have successfully synchronized.

⸻

13. CONTENT VERSIONING

Implement version management across the content lifecycle.

Every published lesson should have a stable ID and version.

When a lesson is updated:

1. Preserve its stable ID.
2. Generate or record a new version.
3. Update the publication manifest.
4. Make the new version available to connected devices.
5. Allow offline devices to continue using their last valid downloaded version.
6. Download the update when connectivity returns.

Do not force students to redownload entire subjects when only one lesson changes.

Support rollback to previously published content.

⸻

14. SHARED ARCHITECTURE AND REUSABILITY

The Results Pro Suite monorepo contains several applications.

Where appropriate, create reusable packages for:

* Offline storage abstractions.
* Synchronization contracts.
* API clients.
* Shared content types.
* Content manifest validation.
* Authentication.
* Shared UI components.

Do not force unrelated applications to depend on Classroom Pro-specific functionality.

For example, a reusable offline package may support Classroom Pro and other products that need offline functionality, while allowing each product to configure its own data stores and caching policies.

Preserve the existing architectural boundaries.

A monorepo does not mean a monolithic runtime.

Microservices and applications should remain independently deployable where the existing architecture requires this.

⸻

15. SECURITY AND MULTI-TENANCY

Security is mandatory.

Verify that:

* Students can only access authorised content.
* Teachers can only manage their permitted classes.
* Schools cannot access another school’s private records.
* Shared curriculum content is distinguishable from school-specific content.
* Downloaded private data is appropriately protected.
* Authentication expiry is handled correctly.
* Sensitive API responses are not accidentally cached.
* Synchronization requests are authenticated.
* Offline submissions are validated by the server.
* File uploads are validated.
* Content publishing is restricted to authorised roles.

Offline access must not bypass server-side permissions.

Where a user’s permissions change, implement appropriate revalidation and invalidation rules when the device reconnects.

⸻

16. USER INTERFACE REQUIREMENTS

Audit existing screens before creating new ones.

Avoid duplicate screens and duplicate functionality.

Implement missing functionality using the established Classroom Pro design system.

Academic & curriculum administration (Zero-Duplication with CampusPRO)

Provide appropriate interfaces for:

* NERDC curriculum & scheme of work oversight *(School-level Manage Teachers, Manage Students, Manage Classes, Manage Subjects, Manage Terms, Billing, and All Messaging live exclusively in **CampusPRO**)*.
* Weekly lesson management.
* Markdown lesson & AI storybook authoring or import.
* **Educational Video Lesson authoring & publishing**.
* Spaced-repetition flashcard & AI-moderated quiz authoring.
* Image, video and asset management.
* Content preview, review, publishing & version history.
* **Topic Mastery & Traceable Score Sync to CampusPRO**.

Student experience

Provide appropriate interfaces for:

* Synced class & subject library (from CampusPRO enrolment).
* Schemes of work & weekly topics.
* Lesson note & AI storybook reading.
* **Video Lessons library & interactive video player**.
* Images and diagrams.
* Spaced-repetition flashcards.
* Practice quizzes & mock CBT exams.
* Bookmarks.
* Topic-level learning progress & **ResultsPRO-triggered Remedial Revision Packs**.
* Unified offline download manager & synchronization status.

Offline experience

The application should clearly communicate:

* Whether the student is online or offline.
* Which subjects have been downloaded.
* Which lessons are available offline.
* Whether updates are available.
* Whether progress is pending synchronization.
* Whether synchronization has succeeded or failed.

Do not create a separate duplicate offline learning interface. The existing learning interface should continue working with local data when offline.

⸻

17. TESTING AND ACCEPTANCE CRITERIA

Do not consider the work complete merely because the application builds.

Test actual behaviour.

Backend tests

* Curriculum CRUD.
* Lesson metadata CRUD.
* Content publication.
* Content versioning.
* Asset validation.
* Tenant isolation.
* API authentication.
* Redis namespace isolation.
* Synchronization endpoints.
* Duplicate submission prevention.

Web tests

* PWA installation.
* Service Worker registration.
* Application shell availability offline.
* Lesson downloads.
* Offline lesson reading.
* IndexedDB persistence.
* Quiz attempts offline.
* Progress persistence.
* Reconnection and synchronization.
* Cache updates.
* Storage failure handling.

Mobile tests

* SQLite persistence.
* Lesson downloads.
* Local image storage.
* Offline lesson reading.
* Offline quiz attempts.
* Application restart while offline.
* Reconnection.
* Synchronization.
* Interrupted download recovery.

Critical end-to-end scenario

Demonstrate this complete scenario:

1. A student logs into Classroom Pro while online.
2. The student selects Primary 4.
3. The student selects Mathematics.
4. The student downloads First Term.
5. The application downloads all relevant published lesson files and images.
6. The student disconnects from the internet.
7. The student closes and reopens the application.
8. The student accesses downloaded lessons.
9. The student completes a supported quiz.
10. The application saves progress locally.
11. The student reconnects to the internet.
12. The application synchronizes the quiz attempt and progress.
13. The backend confirms successful persistence.
14. The application updates the local synchronization status.

Repeat the scenario on web and mobile.

Also test an updated lesson to demonstrate incremental content delivery rather than full package downloads.

⸻

18. IMPLEMENTATION RULES

Follow these rules throughout the project:

1. Audit before modifying.
2. Reuse existing infrastructure.
3. Do not duplicate PostgreSQL or Redis deployments unnecessarily.
4. Do not break existing Results Pro Suite applications.
5. Do not create duplicate screens.
6. Do not introduce unnecessary dependencies.
7. Follow existing naming conventions and architectural patterns.
8. Use proper database migrations.
9. Preserve backward compatibility where possible.
10. Never hardcode production credentials.
11. Do not silently change existing environment configuration.
12. Do not claim that offline functionality works without testing it.
13. Do not replace existing working implementations merely to match this document.
14. Document architectural decisions.
15. Run existing regression tests after significant changes.

If a destructive change, unavailable external credential, unresolved security concern or major architectural decision prevents safe implementation, explain the blocker and continue with independent work.

⸻

19. REQUIRED DELIVERABLES

At completion, provide:

A. Architecture audit report

What existed before implementation, what was missing and what was changed.

B. Implementation report

A list of completed features, grouped by backend, web, mobile, storage and synchronization.

C. Database report

All new or modified tables, relationships, migrations and indexes.

D. Infrastructure report

How PostgreSQL, Redis, Cloudinary, content storage and CDN are configured or reused.

E. Offline functionality report

Evidence of tested web and mobile offline behaviour.

F. API documentation

New and modified endpoints, authentication requirements and request/response structures.

G. Deployment instructions

Required environment variables, migrations, build steps and deployment dependencies.

H. Outstanding work

Clearly distinguish:

* Completed and tested.
* Implemented but not fully tested.
* Partially implemented.
* Blocked by credentials or external dependencies.
* Not implemented.

I. Demonstration

Provide a working demonstration of the complete offline learning and synchronization scenario.

⸻

20. FINAL DIRECTIVE

This assignment is not simply to add SQLite, IndexedDB or a Service Worker.

The objective is to deliver a cohesive, production-ready, offline-first Classroom Pro content architecture that fits naturally into the existing Results Pro Suite monorepo.

The final architecture should follow these principles:

* PostgreSQL: Central persistent database and source of truth for structured application records.
* Redis: Shared backend caching and background-processing infrastructure.
* Markdown: Source format for educational lesson notes.
* GitHub: Optional content source control and review workflow.
* Cloudinary: Educational image and illustration management.
* Object storage/CDN: Published content distribution and bulk downloads.
* SQLite: Mobile local database.
* IndexedDB: Web local database.
* Service Worker: Web application offline functionality and request caching.
* Cache Storage: Browser caching of application resources and suitable content.
* Synchronization engine: Reliable transfer of content and student activity between local devices and backend services.

Preserve the existing monorepo architecture and shared PostgreSQL model.

Start with the audit, proceed to implementation, test the complete workflow, and provide evidence of what actually works.

Do not finish with recommendations alone. Implement the missing functionality.
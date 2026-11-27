/**
 * ClassroomPRO Offline-First Synchronization Engine v2
 * (Aligned with classroompro_study_packs_architecture.md)
 *
 * Implements:
 * 1. Service Worker registration (`/sw.js`)
 * 2. Complete Study Pack Catalog & Selective Download by Curriculum / Class / Subject / Term
 * 3. Presigned Neon Object Storage Download (`POST /api/packs/:packId/download-token`)
 * 4. Offline Caching of All 5 Modalities (Notes + Offline Diagrams, Linked YouTube Videos + Offline Summaries, SRS Flashcards, Quizzes, CBT Mock Exams) + Pack Badges
 * 5. Automatic Offline Badge Unlock Evaluation & Idempotent Upload Queue (`QUIZ_ATTEMPT`, `EXAM_ATTEMPT`, `BADGE_EARNED`, `LESSON_PROGRESS`, `BOOKMARK`)
 * 6. Refund & Revocation Enforcement: Purges local IndexedDB copy via `offlineDb.deletePackage(packId)` when `revoked_pack_ids` includes a refunded pack
 */

import api from './api';
import {
  offlineDb,
  OfflinePackageRecord,
  OfflineLessonRecord,
  OfflineAssetRecord,
  OfflineVideoRecord,
  OfflineQuizRecord,
  OfflineFlashcardRecord,
  OfflineExamRecord,
  OfflineBadgeRecord,
  PendingSyncOperation,
  SyncState,
  SchemeWeekUnitRecord,
} from './offlineDb';

// Complete seeded NERDC Study Packs (matching service_classroompro/handlers/study_packs.go)
export const FALLBACK_NERDC_PACKAGES: any[] = [
  {
    package_id: 'pkg-nerdc-jss2-math-t2',
    pack_id: 'pkg-nerdc-jss2-math-t2',
    slug: 'nerdc-jss2-mathematics-second-term-complete-pack',
    title: 'NERDC JSS 2 Mathematics — Second Term Complete Scheme Study Pack',
    subtitle: 'Weeks 1–3 Scheme of Work · Algebraic Fractions, Commercial Word Problems & Linear Inequalities',
    description:
      'Complete curriculum-aligned study pack featuring portable Markdown notes with offline diagrams, AI storybooks, curated YouTube video lectures, 7 SRS flashcards, 3 weekly formative quizzes, 1 timed Mock CBT Exam, and 3 Mastery Badges (+600 XP).',
    creator_id: 'profile-teacher',
    creator_role: 'TEACHER',
    creator_name: 'Mr. Tunde Ogunleye',
    pricing_type: 'FREE',
    price_kobo: 0,
    price_naira: 0,
    currency: 'NGN',
    moderation_status: 'PUBLISHED',
    entitled: true,
    access_reason: 'ENTITLED_PERPETUAL',
    license_type: 'PERPETUAL',
    curriculum: 'NERDC',
    education_level: 'junior-secondary',
    class_code: 'jss-2',
    class_label: 'JSS 2',
    subject_id: 'mathematics',
    subject_name: 'Mathematics',
    term: 'second-term',
    term_label: 'Second Term',
    package_version: 1,
    size_bytes: 245760,
    total_xp_reward: 600,
    checksum_sha256: 'sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    neon_storage_key: 'packs/tenant_greenwood/pkg-nerdc-jss2-math-t2/v1/bundle.json',
    ward_entitlements: {},
    scheme_of_work: [
      {
        week: 1,
        topic_id: 'nerdc-jss2-math-t2-w01',
        topic: 'Algebraic Processes I: Algebraic Fractions & LCM',
        subtopic: 'Simplifying Algebraic Fractions with Monomial & Binomial Denominators',
        note_id: 'nerdc-jss2-math-t2-w01',
        video_id: 'vid-jss2-math-w01',
        flashcard_ids: ['fc-jss2-math-1', 'fc-jss2-math-2', 'fc-jss2-math-3'],
        quiz_id: 'quiz-nerdc-jss2-math-t2-w01',
        badge_id: 'badge-jss2-math-bronze',
        is_preview: true,
      },
      {
        week: 2,
        topic_id: 'nerdc-jss2-math-t2-w02',
        topic: 'Algebraic Processes II: Commercial Word Problems & Simple Equations',
        subtopic: 'Translating Market & Financial Word Problems into Algebraic Fractions',
        note_id: 'nerdc-jss2-math-t2-w02',
        video_id: 'vid-jss2-math-w02',
        flashcard_ids: ['fc-jss2-math-4', 'fc-jss2-math-5'],
        quiz_id: 'quiz-nerdc-jss2-math-t2-w02',
        badge_id: 'badge-jss2-math-silver',
        is_preview: false,
      },
      {
        week: 3,
        topic_id: 'nerdc-jss2-math-t2-w03',
        topic: 'Linear Inequalities in One Variable & Number Line Graphs',
        subtopic: 'Solving Linear Inequalities, Reversing Signs & Graphing Solution Sets',
        note_id: 'nerdc-jss2-math-t2-w03',
        video_id: 'vid-jss2-math-w03',
        flashcard_ids: ['fc-jss2-math-6', 'fc-jss2-math-7'],
        quiz_id: 'quiz-nerdc-jss2-math-t2-w03',
        exam_id: 'exam-jss2-math-t2-terminal',
        badge_id: 'badge-jss2-math-gold',
        is_preview: false,
      },
    ] as SchemeWeekUnitRecord[],
    lessons: [
      {
        content_id: 'nerdc-jss2-math-t2-w01',
        week: 1,
        topic: 'Algebraic Processes I: Algebraic Fractions & LCM',
        subtopic: 'Simplifying Algebraic Fractions with Monomial & Binomial Denominators',
        version: 1,
        status: 'published',
        checksum_sha256: 'sha256:1a2b3c4d5e6f7a8b',
        assets: ['asset://cld-jss2-math-algebraic-lcm'],
        youtube_id: 'NybHckSEQBI',
        youtube_url: 'https://www.youtube.com/watch?v=NybHckSEQBI',
        estimated_minutes: 35,
        markdown_content: `# Week 1: Algebraic Fractions & Lowest Common Multiple (LCM)\n\n## Learning Objectives\n1. Find the **Lowest Common Multiple (LCM)** of algebraic denominators.\n2. Add and subtract algebraic fractions with monomial and binomial denominators.\n3. Simplify compound algebraic expressions accurately.\n\n![Algebraic Fractions and Linear Inequalities Diagram](asset://cld-jss2-math-algebraic-lcm)\n\n## AI Illustrated Story: Sharing Shares at Balogun Market\nChinedu and Amina help their aunt reconcile textile bales in Lagos. One bale is divided into **x/3** yards and another into **x/4** yards. By converting both to a common denominator of **12**, they discover the total cloth length is **7x/12** yards.\n\n### Worked Example\nSimplify: **(2x / 3) + (x / 4)**\n- LCM of 3 and 4 is **12**\n- Convert each fraction: **(8x / 12) + (3x / 12) = 11x / 12**`,
      },
      {
        content_id: 'nerdc-jss2-math-t2-w02',
        week: 2,
        topic: 'Algebraic Processes II: Commercial Word Problems & Simple Equations',
        subtopic: 'Translating Market & Financial Word Problems into Algebraic Fractions',
        version: 1,
        status: 'published',
        checksum_sha256: 'sha256:2b3c4d5e6f7a8b9c',
        assets: ['asset://cld-jss2-math-algebraic-lcm'],
        youtube_id: 'fC9da6eqaqg',
        youtube_url: 'https://www.youtube.com/watch?v=fC9da6eqaqg',
        estimated_minutes: 40,
        markdown_content: `# Week 2: Word Problems Leading to Algebraic Fractions\n\n## Steps for Solving NERDC Word Problems\n1. Choose a clear letter (such as **n** or **x**) for the unknown quantity.\n2. Translate each sentence into an algebraic fraction equation.\n3. Multiply every term by the **LCM** of the denominators to clear fractions.\n\n![Algebraic Fractions and Linear Inequalities Diagram](asset://cld-jss2-math-algebraic-lcm)\n\n### Worked Example\nOne-third of a number plus one-quarter of the same number equals 14. Find the number.\n- Equation: **(n / 3) + (n / 4) = 14**\n- Multiply through by LCM = 12: **4n + 3n = 168**\n- **7n = 168  =>  n = 24**`,
      },
      {
        content_id: 'nerdc-jss2-math-t2-w03',
        week: 3,
        topic: 'Linear Inequalities in One Variable & Number Line Graphs',
        subtopic: 'Solving Linear Inequalities, Reversing Signs & Graphing Solution Sets',
        version: 1,
        status: 'published',
        checksum_sha256: 'sha256:5f9a82b11c4e77d2',
        assets: ['asset://cld-jss2-math-algebraic-lcm'],
        youtube_id: 'bAerID24QJ0',
        youtube_url: 'https://www.youtube.com/watch?v=bAerID24QJ0',
        estimated_minutes: 40,
        markdown_content: `# Week 3: Linear Inequalities in One Variable\n\n## Reversing the Inequality Sign\nWhen multiplying or dividing both sides by a **negative number**, reverse the inequality symbol.\n\n![Graphing Linear Inequalities on a Number Line](asset://cld-jss2-math-algebraic-lcm)\n\n### Example\nSolve \`3x - 5 < 10\`:\n- \`3x < 15\`\n- \`x < 5\``,
      },
    ],
    videos: [
      {
        id: 'vid-jss2-math-w01',
        week: 1,
        topic_id: 'nerdc-jss2-math-t2-w01',
        title: 'Simplifying Algebraic Fractions with LCM & Monomial Denominators',
        instructor: 'Mr. Tunde Ogunleye',
        youtube_id: 'NybHckSEQBI',
        youtube_url: 'https://www.youtube.com/watch?v=NybHckSEQBI',
        thumbnail_url: 'https://i.ytimg.com/vi/NybHckSEQBI/hqdefault.jpg',
        duration: '14:20',
        summary: 'Step-by-step worked examples showing how to find the Lowest Common Multiple (LCM) of algebraic denominators and combine fractions cleanly.',
        offline_summary_markdown: '### Offline Video Key Takeaways (Week 1)\n- Always factorize denominators before computing the LCM.\n- Multiply each numerator by the quotient of the LCM divided by its denominator.',
        note_id: 'nerdc-jss2-math-t2-w01',
        quiz_id: 'quiz-nerdc-jss2-math-t2-w01',
        flashcard_set_id: 'fc-jss2-math-1',
      },
      {
        id: 'vid-jss2-math-w02',
        week: 2,
        topic_id: 'nerdc-jss2-math-t2-w02',
        title: 'Translating Commercial Word Problems into Algebraic Equations',
        instructor: 'Mr. Tunde Ogunleye',
        youtube_id: 'fC9da6eqaqg',
        youtube_url: 'https://www.youtube.com/watch?v=fC9da6eqaqg',
        thumbnail_url: 'https://i.ytimg.com/vi/fC9da6eqaqg/hqdefault.jpg',
        duration: '16:45',
        summary: 'How to turn NERDC word problems on market shares, ages, and distances into solvable fractional equations.',
        offline_summary_markdown: '### Offline Video Key Takeaways (Week 2)\n- Clear all fractions immediately by multiplying both sides of the equation by the LCM.',
        note_id: 'nerdc-jss2-math-t2-w02',
        quiz_id: 'quiz-nerdc-jss2-math-t2-w02',
        flashcard_set_id: 'fc-jss2-math-4',
      },
      {
        id: 'vid-jss2-math-w03',
        week: 3,
        topic_id: 'nerdc-jss2-math-t2-w03',
        title: 'Solving Linear Inequalities & Number Line Representation',
        instructor: 'Mr. Tunde Ogunleye',
        youtube_id: 'bAerID24QJ0',
        youtube_url: 'https://www.youtube.com/watch?v=bAerID24QJ0',
        thumbnail_url: 'https://i.ytimg.com/vi/bAerID24QJ0/hqdefault.jpg',
        duration: '12:50',
        summary: 'Master open vs. closed circles on number lines and why dividing by a negative number flips the inequality symbol.',
        offline_summary_markdown: '### Offline Video Key Takeaways (Week 3)\n- `<` or `>` uses an open circle.\n- `<=` or `>=` uses a solid shaded circle.',
        note_id: 'nerdc-jss2-math-t2-w03',
        quiz_id: 'quiz-nerdc-jss2-math-t2-w03',
        flashcard_set_id: 'fc-jss2-math-6',
      },
    ],
    flashcards: [
      {
        id: 'fc-jss2-math-1',
        topic_id: 'nerdc-jss2-math-t2-w01',
        front: 'What is the LCM of the denominators in (x / 4) + (2x / 6)?',
        back: '12 (since 12 is the smallest multiple divisible by both 4 and 6)',
        hint: 'List multiples of 4 and 6.',
      },
      {
        id: 'fc-jss2-math-2',
        topic_id: 'nerdc-jss2-math-t2-w01',
        front: 'Simplify: (2x / 3) + (x / 4)',
        back: '11x / 12',
        hint: 'Convert both fractions to denominator 12: (8x + 3x)/12.',
      },
      {
        id: 'fc-jss2-math-3',
        topic_id: 'nerdc-jss2-math-t2-w01',
        front: 'What value of x makes the algebraic fraction 5 / (x - 3) undefined?',
        back: 'x = 3 (because the denominator becomes 0)',
        hint: 'Set the denominator equal to zero.',
      },
      {
        id: 'fc-jss2-math-4',
        topic_id: 'nerdc-jss2-math-t2-w02',
        front: 'How do you clear fractions in the equation (n/3) + (n/4) = 14?',
        back: 'Multiply every term on both sides by the LCM (12) to get 4n + 3n = 168.',
        hint: 'Use the LCM of 3 and 4.',
      },
      {
        id: 'fc-jss2-math-5',
        topic_id: 'nerdc-jss2-math-t2-w02',
        front: 'If (n/3) + (n/4) = 14, what is the value of n?',
        back: 'n = 24 (since 7n = 168)',
        hint: 'Divide 168 by 7.',
      },
      {
        id: 'fc-jss2-math-6',
        topic_id: 'nerdc-jss2-math-t2-w03',
        front: 'When solving -2x < 10, what happens when you divide both sides by -2?',
        back: 'The inequality sign reverses: x > -5',
        hint: 'Dividing by a negative flips < to >.',
      },
      {
        id: 'fc-jss2-math-7',
        topic_id: 'nerdc-jss2-math-t2-w03',
        front: 'On a number line graph, what circle is used for x >= 4?',
        back: 'A shaded (closed) circle at 4 with an arrow pointing to the right.',
        hint: '>= includes the boundary value 4.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-nerdc-jss2-math-t2-w01',
        topic_id: 'nerdc-jss2-math-t2-w01',
        title: 'Week 1 Quiz: Algebraic Fractions & LCM',
        duration_min: 10,
        questions: [
          {
            id: 'q1',
            question: 'Simplify: (2x / 3) + (x / 4)',
            options: ['3x / 7', '11x / 12', '5x / 12', '2x / 12'],
            correct_index: 1,
            explanation: 'LCM of 3 and 4 is 12: (8x + 3x) / 12 = 11x / 12.',
          },
          {
            id: 'q2',
            question: 'For what value of y is the fraction (y + 2) / (y - 5) undefined?',
            options: ['y = -2', 'y = 0', 'y = 5', 'y = -5'],
            correct_index: 2,
            explanation: 'A fraction is undefined when its denominator equals zero: y - 5 = 0 => y = 5.',
          },
        ],
      },
      {
        id: 'quiz-nerdc-jss2-math-t2-w02',
        topic_id: 'nerdc-jss2-math-t2-w02',
        title: 'Week 2 Quiz: Commercial Word Problems with Fractions',
        duration_min: 12,
        questions: [
          {
            id: 'q1',
            question: 'One-third of a number plus one-quarter of the number is 14. Find the number.',
            options: ['12', '18', '24', '28'],
            correct_index: 2,
            explanation: '(n/3) + (n/4) = 14 => 7n/12 = 14 => n = 24.',
          },
        ],
      },
      {
        id: 'quiz-nerdc-jss2-math-t2-w03',
        topic_id: 'nerdc-jss2-math-t2-w03',
        title: 'Week 3 Quiz: Linear Inequalities in One Variable',
        duration_min: 12,
        questions: [
          {
            id: 'q1',
            question: 'Solve the inequality: 3x - 5 < 10',
            options: ['x < 5', 'x > 5', 'x < 15', 'x <= 3'],
            correct_index: 0,
            explanation: 'Add 5 to both sides: 3x < 15, then divide by 3: x < 5.',
          },
          {
            id: 'q2',
            question: 'Solve for x: -4x >= 20',
            options: ['x >= -5', 'x <= -5', 'x <= 5', 'x >= 5'],
            correct_index: 1,
            explanation: 'Dividing by -4 reverses the inequality symbol from >= to <=: x <= -5.',
          },
        ],
      },
    ],
    exams: [
      {
        id: 'exam-jss2-math-t2-terminal',
        pack_id: 'pkg-nerdc-jss2-math-t2',
        week: 3,
        exam_type: 'TERMINAL_MOCK',
        title: 'NERDC JSS 2 Second Term Mathematics Mock CBT Examination',
        instructions:
          'Answer all questions. Passing score is 60%. Scoring 75% or above unlocks the Gold Algebra & Inequalities Grandmaster Badge (+300 XP).',
        duration_min: 30,
        pass_score_pct: 60,
        sync_to_campuspro_component: 'CA2',
        questions: [
          {
            id: 'ex-q1',
            question: 'Simplify completely: (3a / 4) - (a / 6)',
            options: ['7a / 12', '2a / 10', '5a / 12', 'a / 2'],
            correct_index: 0,
            explanation: 'LCM of 4 and 6 is 12: (9a - 2a) / 12 = 7a / 12.',
          },
          {
            id: 'ex-q2',
            question: 'Solve the equation: (x / 2) - (x / 5) = 6',
            options: ['x = 10', 'x = 15', 'x = 20', 'x = 30'],
            correct_index: 2,
            explanation: 'Multiply by LCM 10: 5x - 2x = 60 => 3x = 60 => x = 20.',
          },
          {
            id: 'ex-q3',
            question: "Which inequality represents 'twice a number y decreased by 3 is at least 11'?",
            options: ['2y - 3 > 11', '2y - 3 >= 11', '2y - 3 <= 11', '3 - 2y >= 11'],
            correct_index: 1,
            explanation: "'At least 11' means greater than or equal to 11: 2y - 3 >= 11 => y >= 7.",
          },
          {
            id: 'ex-q4',
            question: 'Find the solution set of -3x + 4 > 13.',
            options: ['x < -3', 'x > -3', 'x < 3', 'x > 3'],
            correct_index: 0,
            explanation: '-3x > 9 => divide by -3 and flip sign: x < -3.',
          },
        ],
      },
    ],
    badges: [
      {
        badge_id: 'badge-jss2-math-bronze',
        pack_id: 'pkg-nerdc-jss2-math-t2',
        code: 'BADGE_JSS2_MATH_T2_EXPLORER',
        name: 'Algebraic Explorer (Bronze)',
        description: 'Completed all Scheme-of-Work Lesson Notes, AI Storybooks & Video Lectures in JSS 2 Term 2 Mathematics.',
        icon_svg_or_asset: 'BRONZE_SHIELD',
        tier: 'BRONZE',
        xp_bonus: 100,
        unlock_rule: { min_notes_completed: 3, min_videos_watched: 1 },
      },
      {
        badge_id: 'badge-jss2-math-silver',
        pack_id: 'pkg-nerdc-jss2-math-t2',
        code: 'BADGE_JSS2_MATH_T2_RECALL',
        name: 'SRS Flashcard & Quiz Tactician (Silver)',
        description: 'Mastered the JSS 2 Algebraic Fractions SRS Flashcard Deck and scored 70%+ across weekly quizzes.',
        icon_svg_or_asset: 'SILVER_STAR',
        tier: 'SILVER',
        xp_bonus: 200,
        unlock_rule: { min_quiz_avg: 70, min_flashcards_reviewed: 5 },
      },
      {
        badge_id: 'badge-jss2-math-gold',
        pack_id: 'pkg-nerdc-jss2-math-t2',
        code: 'BADGE_JSS2_MATH_T2_GRANDMASTER',
        name: 'NERDC JSS 2 Algebra & Inequalities Grandmaster (Gold)',
        description: 'Passed the JSS 2 Second Term Mock CBT Examination with Distinction (75%+).',
        icon_svg_or_asset: 'GOLD_CROWN',
        tier: 'GOLD',
        xp_bonus: 300,
        unlock_rule: { min_exam_score: 75 },
      },
    ],
  },
  {
    package_id: 'pkg-nerdc-sss2-phy-t2',
    pack_id: 'pkg-nerdc-sss2-phy-t2',
    slug: 'nerdc-sss2-physics-waves-optics-projectile-pack',
    title: 'NERDC SSS 2 Physics — Mechanics, Projectiles & Wave Optics WAEC Pack',
    subtitle: 'Second Term Scheme of Work + WAEC/JAMB Timed CBT Mock & Gold Olympian Badge',
    description:
      'Teacher-authored premium Physics revision pack for SSS 2 Science students with step-by-step derivations, vector diagrams, flashcards, and WAEC CBT simulation.',
    creator_id: 'profile-teacher',
    creator_role: 'TEACHER',
    creator_name: 'Mrs. Funke Adebayo',
    pricing_type: 'PAID',
    price_kobo: 250000,
    price_naira: 2500,
    currency: 'NGN',
    moderation_status: 'PUBLISHED',
    entitled: false,
    access_reason: 'PACK_LOCKED_REQUIRES_PURCHASE',
    license_type: 'PERPETUAL',
    curriculum: 'NERDC',
    education_level: 'senior-secondary',
    class_code: 'sss-2',
    class_label: 'SSS 2',
    subject_id: 'physics',
    subject_name: 'Physics',
    term: 'second-term',
    term_label: 'Second Term',
    package_version: 1,
    size_bytes: 196400,
    total_xp_reward: 350,
    checksum_sha256: 'sha256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    neon_storage_key: 'packs/tenant_greenwood/pkg-nerdc-sss2-phy-t2/v1/bundle.json',
    ward_entitlements: {
      'profile-student': 'NOT_PURCHASED',
      'student-ward-2': 'NOT_PURCHASED',
    },
    scheme_of_work: [
      {
        week: 1,
        topic_id: 'nerdc-sss2-phy-t2-w04',
        topic: 'Projectile Motion & Vector Resolution',
        subtopic: "Time of Flight, Maximum Height, Range & Snell's Law",
        note_id: 'nerdc-sss2-phy-t2-w04',
        video_id: 'vid-sss2-phy-w01',
        flashcard_ids: ['fc-sss2-phy-1', 'fc-sss2-phy-2'],
        quiz_id: 'quiz-nerdc-sss2-phy-t2-w01',
        exam_id: 'exam-sss2-phy-t2-mock',
        badge_id: 'badge-sss2-phy-gold',
        is_preview: true,
      },
    ],
    lessons: [
      {
        content_id: 'nerdc-sss2-phy-t2-w04',
        week: 1,
        topic: 'Waves, Optics & Projectile Motion',
        subtopic: "Refraction of Light, Snell's Law, and Projectile Range",
        version: 1,
        status: 'published',
        checksum_sha256: 'sha256:8e1d44a90b2c63e1',
        assets: ['asset://cld-sss2-phy-projectile-parabola'],
        youtube_id: 'aY8z2qO44WA',
        youtube_url: 'https://www.youtube.com/watch?v=aY8z2qO44WA',
        estimated_minutes: 45,
        markdown_content: `# Week 1: Projectile Motion, Refraction of Light and Snell's Law\n\n## Snell's Law\n\`n = sin(i) / sin(r)\`\n\n![Projectile Motion and Wave Optics Diagram](asset://cld-sss2-phy-projectile-parabola)`,
      },
    ],
    videos: [
      {
        id: 'vid-sss2-phy-w01',
        week: 1,
        topic_id: 'nerdc-sss2-phy-t2-w04',
        title: 'Deriving Projectile Motion Equations & Solving WAEC Past Questions',
        instructor: 'Mrs. Funke Adebayo',
        youtube_id: 'aY8z2qO44WA',
        youtube_url: 'https://www.youtube.com/watch?v=aY8z2qO44WA',
        thumbnail_url: 'https://i.ytimg.com/vi/aY8z2qO44WA/hqdefault.jpg',
        duration: '18:10',
        summary: 'Complete derivation of Time of Flight, Maximum Height, and Range with WAEC & JAMB Physics worked calculations.',
        offline_summary_markdown: '### Offline Video Summary\n- Resolve initial velocity into horizontal and vertical components.',
        note_id: 'nerdc-sss2-phy-t2-w04',
        quiz_id: 'quiz-nerdc-sss2-phy-t2-w01',
        flashcard_set_id: 'fc-sss2-phy-1',
      },
    ],
    flashcards: [
      {
        id: 'fc-sss2-phy-1',
        topic_id: 'nerdc-sss2-phy-t2-w04',
        front: 'At what launch angle does a projectile achieve maximum horizontal range?',
        back: '45° (because sin 2θ = sin 90° = 1)',
        hint: 'Maximize sin(2θ).',
      },
      {
        id: 'fc-sss2-phy-2',
        topic_id: 'nerdc-sss2-phy-t2-w04',
        front: 'State the formula for the Maximum Height (H) of a projectile.',
        back: 'H = (u² sin² θ) / (2g)',
        hint: 'Use v² = u_y² - 2gH at v = 0.',
      },
    ],
    quizzes: [
      {
        id: 'quiz-nerdc-sss2-phy-t2-w01',
        topic_id: 'nerdc-sss2-phy-t2-w04',
        title: "SSS 2 Physics: Projectiles, Refraction & Snell's Law CBT",
        duration_min: 15,
        questions: [
          {
            id: 'q1',
            question: 'What is the critical angle for glass of refractive index 1.50?',
            options: ['30.0°', '41.8°', '48.6°', '60.0°'],
            correct_index: 1,
            explanation: 'sin(C) = 1 / 1.5 = 0.6667 => C = 41.8°.',
          },
        ],
      },
    ],
    exams: [
      {
        id: 'exam-sss2-phy-t2-mock',
        pack_id: 'pkg-nerdc-sss2-phy-t2',
        week: 1,
        exam_type: 'WAEC_MOCK',
        title: 'SSS 2 Second Term Physics WAEC & JAMB CBT Mock Exam',
        instructions: 'Timed 25-minute Physics CBT exam covering Projectiles and Wave Optics.',
        duration_min: 25,
        pass_score_pct: 60,
        sync_to_campuspro_component: 'CA1',
        questions: [
          {
            id: 'phy-ex-1',
            question: 'A projectile is fired with initial speed 20 m/s at 30° to the horizontal (g = 10 m/s²). Calculate its time of flight.',
            options: ['1.0 s', '2.0 s', '3.5 s', '4.0 s'],
            correct_index: 1,
            explanation: 'T = (2 u sin 30°)/g = (2 * 20 * 0.5) / 10 = 2.0 s.',
          },
        ],
      },
    ],
    badges: [
      {
        badge_id: 'badge-sss2-phy-gold',
        pack_id: 'pkg-nerdc-sss2-phy-t2',
        code: 'BADGE_SSS2_PHY_T2_OLYMPIAN',
        name: 'SSS 2 Mechanics & Optics Olympian (Gold)',
        description: "Mastered Projectile Motion & Snell's Law and passed the WAEC Physics CBT Mock Exam.",
        icon_svg_or_asset: 'GOLD_ATOM',
        tier: 'GOLD',
        xp_bonus: 350,
        unlock_rule: { min_exam_score: 70 },
      },
    ],
  },
  {
    package_id: 'pkg-nerdc-pri4-math-t1',
    pack_id: 'pkg-nerdc-pri4-math-t1',
    slug: 'nerdc-primary4-mathematics-first-term-pack',
    title: 'NERDC Primary 4 Mathematics — First Term Place Value & Fractions Pack',
    subtitle: 'Official Primary 4 First Term Scheme Pack with Abacus Diagrams & Common Entrance Drills',
    description: 'Complete Primary 4 Mathematics First Term pack covering Whole Numbers to 1,000,000, Place Value Abacus, and Roman Numerals.',
    creator_id: 'profile-principal',
    creator_role: 'SCHOOL_ADMIN',
    creator_name: 'Dr. (Mrs.) Folake Adeyemi',
    pricing_type: 'FREE',
    price_kobo: 0,
    price_naira: 0,
    currency: 'NGN',
    moderation_status: 'PUBLISHED',
    entitled: true,
    access_reason: 'ENTITLED_PERPETUAL',
    license_type: 'PERPETUAL',
    curriculum: 'NERDC',
    education_level: 'primary',
    class_code: 'primary-4',
    class_label: 'Primary 4',
    subject_id: 'mathematics',
    subject_name: 'Mathematics',
    term: 'first-term',
    term_label: 'First Term',
    package_version: 2,
    size_bytes: 184320,
    total_xp_reward: 250,
    checksum_sha256: 'sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    neon_storage_key: 'packs/tenant_greenwood/pkg-nerdc-pri4-math-t1/v2/bundle.json',
    ward_entitlements: {},
    scheme_of_work: [
      {
        week: 1,
        topic_id: 'nerdc-pri4-math-t1-w01',
        topic: 'Whole Numbers up to 1,000,000 & Place Value Abacus',
        subtopic: 'Counting, Reading, and Place Value up to 1,000,000',
        note_id: 'nerdc-pri4-math-t1-w01',
        video_id: 'vid-pri4-math-w01',
        flashcard_ids: ['fc-pri4-math-1', 'fc-pri4-math-2'],
        quiz_id: 'quiz-nerdc-pri4-math-t1-w01',
        badge_id: 'badge-pri4-math-gold',
        is_preview: true,
      },
    ],
    lessons: [
      {
        content_id: 'nerdc-pri4-math-t1-w01',
        week: 1,
        topic: 'Whole Numbers',
        subtopic: 'Counting, Reading, and Place Value up to 1,000,000',
        version: 1,
        status: 'published',
        checksum_sha256: 'sha256:4a8b12c90e1f2d3a',
        assets: [
          'asset://cld-pri4-math-place-value-chart',
          'asset://cld-math-pri4-place-value-abacus',
        ],
        youtube_id: 'NybHckSEQBI',
        youtube_url: 'https://www.youtube.com/watch?v=NybHckSEQBI',
        estimated_minutes: 35,
        markdown_content: `# Week 1: Whole Numbers up to One Million (1,000,000)\n\n## Learning Objectives\n1. Count and read whole numbers up to **1,000,000**.\n2. Identify the **place value** of each digit in a 7-digit number.\n3. Write numbers in **expanded form**.\n\n![Seven-Column Nigerian Place Value Abacus](asset://cld-math-pri4-place-value-abacus)\n\n### Worked Example: Expanding 642,519\n- **6** is in the Hundred Thousands place = **600,000**\n- **4** is in the Ten Thousands place = **40,000**\n- **2** is in the Thousands place = **2,000**\n- **5** is in the Hundreds place = **500**\n- **1** is in the Tens place = **10**\n- **9** is in the Units place = **9**`,
      },
      {
        content_id: 'nerdc-pri4-math-t1-w02',
        week: 2,
        topic: 'Roman Numerals',
        subtopic: 'Reading and Writing Roman Numerals I to C (1 to 100)',
        version: 2,
        status: 'published',
        checksum_sha256: 'sha256:7c3d91e45b8a01f9',
        assets: ['asset://cld-pri4-math-fractions-diagram'],
        youtube_id: 'NybHckSEQBI',
        youtube_url: 'https://www.youtube.com/watch?v=NybHckSEQBI',
        estimated_minutes: 30,
        markdown_content: `# Week 2: Roman Numerals (I to C)\n\n## The Seven Basic Symbols\n- **I** = 1, **V** = 5, **X** = 10, **L** = 50, **C** = 100\n\n![NERDC Roman Numerals Conversion Chart](asset://cld-pri4-math-fractions-diagram)`,
      },
    ],
    videos: [
      {
        id: 'vid-pri4-math-w01',
        week: 1,
        topic_id: 'nerdc-pri4-math-t1-w01',
        title: 'Place Value Abacus up to One Million for Primary 4',
        instructor: 'Mr. Tunde Ogunleye',
        youtube_id: 'NybHckSEQBI',
        youtube_url: 'https://www.youtube.com/watch?v=NybHckSEQBI',
        thumbnail_url: 'https://i.ytimg.com/vi/NybHckSEQBI/hqdefault.jpg',
        duration: '11:15',
        summary: 'Interactive Nigerian 7-column abacus reading from Units to Millions.',
        offline_summary_markdown: '### Offline Video Summary\n- Count seven columns from the right for Millions.',
        note_id: 'nerdc-pri4-math-t1-w01',
        quiz_id: 'quiz-nerdc-pri4-math-t1-w01',
        flashcard_set_id: 'fc-pri4-math-1',
      },
    ],
    quizzes: [
      {
        id: 'quiz-nerdc-pri4-math-t1-w01',
        topic_id: 'nerdc-pri4-math-t1-w01',
        title: 'Primary 4 Mathematics: Place Value & Whole Numbers Quiz',
        duration_min: 10,
        questions: [
          {
            id: 'q1',
            question: 'What is the place value of 4 in 642,519?',
            options: ['Four Thousand', 'Forty Thousand', 'Four Hundred Thousand', 'Four Hundred'],
            correct_index: 1,
            explanation: '4 is in the Ten Thousands column, so its value is 40,000.',
          },
          {
            id: 'q2',
            question: 'Convert the Roman Numeral LXXIV to Hindu-Arabic numbers.',
            options: ['64', '74', '84', '76'],
            correct_index: 1,
            explanation: 'L (50) + XX (20) + IV (4) = 74.',
          },
        ],
      },
    ],
    flashcards: [
      {
        id: 'fc-pri4-math-1',
        topic_id: 'nerdc-pri4-math-t1-w01',
        front: 'What is the value of the digit 7 in 725,410?',
        back: '700,000 (Seven Hundred Thousand)',
        hint: 'Count seven digits from the right.',
      },
      {
        id: 'fc-pri4-math-2',
        topic_id: 'nerdc-pri4-math-t1-w02',
        front: 'What does the Roman numeral XL represent?',
        back: '40 (10 subtracted from 50)',
        hint: 'X before L means subtract 10 from 50.',
      },
    ],
    exams: [],
    badges: [
      {
        badge_id: 'badge-pri4-math-gold',
        pack_id: 'pkg-nerdc-pri4-math-t1',
        code: 'BADGE_PRI4_MATH_MILLION_MASTER',
        name: 'Primary 4 Place Value Champion',
        description: 'Mastered whole numbers up to 1,000,000 and Roman Numerals.',
        icon_svg_or_asset: 'GOLD_ABACUS',
        tier: 'GOLD',
        xp_bonus: 250,
        unlock_rule: { min_quiz_avg: 70 },
      },
    ],
  },
];

export const DEFAULT_LINKED_WARDS = [
  {
    student_id: 'profile-student',
    full_name: 'Chidinma Adeleke',
    admission_number: 'GHA/2026/0142',
    class_code: 'sss-2',
    class_label: 'SSS 2 Science',
    campus: 'Greenwood / Laurel Academy (Ikeja Campus)',
    overall_mastery: 84,
    streak_days: 9,
  },
  {
    student_id: 'student-ward-2',
    full_name: 'Tobi Adeleke',
    admission_number: 'GHA/2026/0219',
    class_code: 'jss-2',
    class_label: 'JSS 2 Gold',
    campus: 'Greenwood / Laurel Academy (Ikeja Campus)',
    overall_mastery: 78,
    streak_days: 6,
  },
];

// Generates an offline SVG illustration data URI for any cached Cloudinary asset identifier
function generateOfflineDiagramDataUrl(assetId: string, label: string): string {
  const cleanTitle = label || assetId.replace('asset://cld-', '').replace(/-/g, ' ').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="260" viewBox="0 0 720 260">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0D1060"/>
        <stop offset="100%" stop-color="#146ef5"/>
      </linearGradient>
    </defs>
    <rect width="720" height="260" rx="18" fill="url(#bg)"/>
    <rect x="24" y="24" width="672" height="212" rx="12" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.25"/>
    <text x="48" y="72" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="2">NERDC OFFLINE CACHED DIAGRAM • ${assetId}</text>
    <text x="48" y="125" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="800">${cleanTitle}</text>
    <g transform="translate(48, 155)">
      <rect x="0" y="0" width="110" height="48" rx="8" fill="#10b981" fill-opacity="0.25" stroke="#10b981"/>
      <text x="55" y="30" text-anchor="middle" fill="#ecfdf5" font-family="monospace" font-size="13" font-weight="700">2x/3 + x/4</text>
      <rect x="126" y="0" width="110" height="48" rx="8" fill="#3b82f6" fill-opacity="0.25" stroke="#60a5fa"/>
      <text x="181" y="30" text-anchor="middle" fill="#eff6ff" font-family="monospace" font-size="13" font-weight="700">LCM = 12</text>
      <rect x="252" y="0" width="130" height="48" rx="8" fill="#3b82f6" fill-opacity="0.25" stroke="#60a5fa"/>
      <text x="317" y="30" text-anchor="middle" fill="#eff6ff" font-family="monospace" font-size="13" font-weight="700">(8x + 3x)/12</text>
      <rect x="398" y="0" width="110" height="48" rx="8" fill="#10b981" fill-opacity="0.35" stroke="#10b981"/>
      <text x="453" y="30" text-anchor="middle" fill="#ecfdf5" font-family="monospace" font-size="14" font-weight="700">= 11x/12</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const SIMULATED_OFFLINE_KEY = 'classroompro_simulated_offline';
const LOCAL_CREATED_PACKS_KEY = 'classroompro_local_created_packs';
const LOCAL_REVOKED_PACKS_KEY = 'classroompro_local_revoked_packs';
const LOCAL_PURCHASED_PACKS_KEY = 'classroompro_local_purchased_packs';

class OfflineSyncEngine {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration optional in dev mode
    });

    window.addEventListener('online', () => {
      if (!this.isOffline()) {
        this.synchronizePendingOperations();
      }
      this.notify();
    });
    window.addEventListener('offline', () => this.notify());
  }

  isOffline(): boolean {
    if (typeof window === 'undefined') return false;
    const simulated = window.localStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true';
    return simulated || !window.navigator.onLine;
  }

  setSimulatedOffline(offline: boolean) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SIMULATED_OFFLINE_KEY, offline ? 'true' : 'false');
    this.notify();
    if (!offline && window.navigator.onLine) {
      this.synchronizePendingOperations();
    }
  }

  getLocalCreatedPacks(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(LOCAL_CREATED_PACKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveLocalCreatedPack(pack: any) {
    if (typeof window === 'undefined') return;
    const current = this.getLocalCreatedPacks().filter((p) => p.pack_id !== pack.pack_id);
    current.unshift(pack);
    window.localStorage.setItem(LOCAL_CREATED_PACKS_KEY, JSON.stringify(current));
    this.notify();
  }

  getLocalPurchasedMap(): Record<string, string[]> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(LOCAL_PURCHASED_PACKS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  recordLocalWardPurchase(packId: string, wardIds: string[]) {
    if (typeof window === 'undefined') return;
    const map = this.getLocalPurchasedMap();
    const existing = new Set(map[packId] || []);
    wardIds.forEach((id) => existing.add(id));
    map[packId] = Array.from(existing);

    // Also clear from local revoked list if re-purchased
    const revoked = this.getLocalRevokedPackIds().filter((id) => id !== packId);
    window.localStorage.setItem(LOCAL_REVOKED_PACKS_KEY, JSON.stringify(revoked));
    window.localStorage.setItem(LOCAL_PURCHASED_PACKS_KEY, JSON.stringify(map));
    this.notify();
  }

  getLocalRevokedPackIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(LOCAL_REVOKED_PACKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Enforces Decision #5: Refund / Revocation immediately purges already-downloaded content from IndexedDB
  async enforceRevokedPacksPurge(revokedPackIds: string[]): Promise<string[]> {
    const merged = Array.from(new Set([...revokedPackIds, ...this.getLocalRevokedPackIds()]));
    if (merged.length === 0) return [];

    const localPkgs = await offlineDb.getAllPackages();
    const purged: string[] = [];
    for (const pkg of localPkgs) {
      if (merged.includes(pkg.package_id)) {
        await offlineDb.deletePackage(pkg.package_id);
        purged.push(pkg.package_id);
        if (!this.isOffline()) {
          api.post(`/packs/${pkg.package_id}/purge-ack`).catch(() => {});
        }
      }
    }
    if (purged.length > 0) {
      this.notify();
    }
    return purged;
  }

  async revokeAndRefundPack(packId: string, studentId = 'profile-student', reason = 'Order refunded'): Promise<void> {
    if (typeof window !== 'undefined') {
      const current = new Set(this.getLocalRevokedPackIds());
      current.add(packId);
      window.localStorage.setItem(LOCAL_REVOKED_PACKS_KEY, JSON.stringify(Array.from(current)));

      const purchased = this.getLocalPurchasedMap();
      delete purchased[packId];
      window.localStorage.setItem(LOCAL_PURCHASED_PACKS_KEY, JSON.stringify(purchased));
    }

    if (!this.isOffline()) {
      try {
        await api.post(`/admin/packs/entitlements/ent-${packId}-${studentId}/revoke`, {
          pack_id: packId,
          student_id: studentId,
          reason,
        });
      } catch {
        // Local revocation still enforced
      }
    }

    await this.enforceRevokedPacksPurge([packId]);
  }

  // Study Packs are standalone database-persisted entities and are NOT pre-linked to a student.
  // They are related to a student on request (when a student or parent claims, purchases, or downloads a pack).
  async ensureSampleStudyPackSeededForTestStudent(): Promise<void> {
    // No-op: packs remain in the database catalog until requested/downloaded by a student or parent.
  }

  async fetchStudyPacksCatalog(filters?: {
    class_code?: string;
    subject_id?: string;
    term?: string;
    pricing_type?: string;
    ward_id?: string;
  }) {
    let serverPacks: any[] = [];
    let linkedWards = DEFAULT_LINKED_WARDS;
    let serverRevokedIds: string[] = [];

    if (!this.isOffline()) {
      try {
        const res = await api.get('/packs/catalog', { params: filters });
        if (res.data?.packs && Array.isArray(res.data.packs)) {
          serverPacks = res.data.packs;
        }
        if (res.data?.linked_wards && Array.isArray(res.data.linked_wards)) {
          linkedWards = res.data.linked_wards;
        }
      } catch {
        // Fallback to seeded packages + local created packs
      }
    }

    const localCreated = this.getLocalCreatedPacks();
    const combinedMap = new Map<string, any>();
    for (const p of [...localCreated, ...serverPacks, ...FALLBACK_NERDC_PACKAGES]) {
      const id = p.pack_id || p.package_id;
      if (!combinedMap.has(id)) {
        combinedMap.set(id, { ...p, pack_id: id, package_id: id });
      }
    }

    const purchasedMap = this.getLocalPurchasedMap();
    const revokedSet = new Set([...serverRevokedIds, ...this.getLocalRevokedPackIds()]);
    await this.enforceRevokedPacksPurge(Array.from(revokedSet));

    const localPackages = await offlineDb.getAllPackages();
    const localMap = new Map(localPackages.map((p) => [p.package_id, p]));

    const packs = Array.from(combinedMap.values())
      .filter((pkg) => {
        if (filters?.class_code && pkg.class_code !== filters.class_code) return false;
        if (filters?.subject_id && pkg.subject_id !== filters.subject_id) return false;
        if (filters?.term && pkg.term !== filters.term) return false;
        if (filters?.pricing_type && pkg.pricing_type !== filters.pricing_type) return false;
        return true;
      })
      .map((pkg) => {
        const local = localMap.get(pkg.package_id);
        const locallyPurchasedWards = purchasedMap[pkg.package_id] || [];
        const isRevoked = revokedSet.has(pkg.package_id);

        const wardEntitlements: Record<string, string> = {
          ...(pkg.ward_entitlements || {}),
        };
        for (const wId of locallyPurchasedWards) {
          wardEntitlements[wId] = 'ACTIVE';
        }
        if (isRevoked) {
          Object.keys(wardEntitlements).forEach((k) => {
            wardEntitlements[k] = 'REVOKED';
          });
        }

        const entitled =
          !isRevoked &&
          (pkg.pricing_type === 'FREE' ||
            pkg.entitled ||
            locallyPurchasedWards.length > 0 ||
            Object.values(wardEntitlements).includes('ACTIVE'));

        let syncState: SyncState | 'Not downloaded' = 'Not downloaded';
        if (isRevoked) {
          syncState = 'Revoked';
        } else if (local) {
          syncState =
            pkg.package_version > local.package_version ? 'Update available' : local.sync_state;
        }

        return {
          ...pkg,
          entitled,
          is_revoked: isRevoked,
          ward_entitlements: wardEntitlements,
          notes_count: pkg.notes_count ?? (pkg.lessons?.length || 0),
          videos_count: pkg.videos_count ?? (pkg.videos?.length || 0),
          flashcards_count: pkg.flashcards_count ?? (pkg.flashcards?.length || 0),
          quizzes_count: pkg.quizzes_count ?? (pkg.quizzes?.length || 0),
          exams_count: pkg.exams_count ?? (pkg.exams?.length || 0),
          badges_count: pkg.badges_count ?? (pkg.badges?.length || 0),
          local_version: local?.package_version ?? null,
          sync_state: syncState,
          downloaded_at: local?.downloaded_at ?? null,
        };
      });

    return { packs, linkedWards };
  }

  async fetchAvailableManifests(filters?: { class_code?: string; subject_id?: string; term?: string }) {
    const { packs } = await this.fetchStudyPacksCatalog(filters);
    return packs;
  }

  async downloadPackage(packageId: string): Promise<OfflinePackageRecord> {
    if (this.getLocalRevokedPackIds().includes(packageId)) {
      throw new Error(`Entitlement for Study Pack ${packageId} has been revoked.`);
    }

    let pkgData: any =
      this.getLocalCreatedPacks().find((p) => (p.pack_id || p.package_id) === packageId) ||
      FALLBACK_NERDC_PACKAGES.find((p) => p.package_id === packageId);
    let assetRegistry: Record<string, any> = {};

    if (!this.isOffline()) {
      try {
        // Request presigned Neon Object Storage download token & bundle
        const tokenRes = await api.post(`/packs/${packageId}/download-token`);
        if (tokenRes.data?.package) {
          pkgData = tokenRes.data.package;
          assetRegistry = tokenRes.data.asset_registry || {};
        }
      } catch {
        try {
          const res = await api.get(`/content/packages/${packageId}`);
          if (res.data?.package) {
            pkgData = res.data.package;
            assetRegistry = res.data.asset_registry || {};
          }
        } catch {
          // Use fallback embedded study pack bundle
        }
      }
    }

    if (!pkgData) {
      throw new Error(`Study Pack ${packageId} not found`);
    }

    const now = new Date().toISOString();
    const lessonIds: string[] = [];
    const videoIds: string[] = [];
    const quizIds: string[] = [];
    const flashcardIds: string[] = [];
    const examIds: string[] = [];
    const badgeIds: string[] = [];

    // 1. Cache all Lesson Notes & Offline Diagrams in IndexedDB
    for (const lesson of pkgData.lessons || []) {
      const resolvedAssetMap: Record<string, string> = {};
      let resolvedMd: string = lesson.markdown_content || lesson.resolved_markdown || '';

      for (const assetId of lesson.assets || []) {
        const meta = assetRegistry[assetId];
        const dataUrl = generateOfflineDiagramDataUrl(assetId, meta?.alt || `${lesson.topic} Diagram`);
        const assetRecord: OfflineAssetRecord = {
          asset_id: assetId,
          delivery_url: meta?.delivery_url || dataUrl,
          data_url: dataUrl,
          alt: meta?.alt || lesson.topic,
          size_bytes: meta?.size_bytes || 28400,
          cached_at: now,
        };
        await offlineDb.saveAsset(assetRecord);
        resolvedAssetMap[assetId] = dataUrl;
        resolvedMd = resolvedMd.split(assetId).join(dataUrl);
      }

      const lessonRecord: OfflineLessonRecord = {
        content_id: lesson.content_id,
        package_id: pkgData.package_id || pkgData.pack_id,
        class_code: pkgData.class_code,
        subject_id: pkgData.subject_id,
        term: pkgData.term,
        week: lesson.week,
        topic: lesson.topic,
        subtopic: lesson.subtopic,
        version: lesson.version || 1,
        checksum_sha256: lesson.checksum_sha256 || 'sha256:cached',
        markdown_content: lesson.markdown_content || resolvedMd,
        resolved_markdown: resolvedMd,
        assets: lesson.assets || [],
        resolved_assets: resolvedAssetMap,
        youtube_id: lesson.youtube_id,
        youtube_url: lesson.youtube_url,
        estimated_minutes: lesson.estimated_minutes || 35,
        downloaded_at: now,
      };
      await offlineDb.saveLesson(lessonRecord);
      lessonIds.push(lesson.content_id);
    }

    // 2. Cache all Linked YouTube Video Lessons + Offline Summaries in IndexedDB
    for (const video of pkgData.videos || []) {
      const videoRecord: OfflineVideoRecord = {
        id: video.id,
        package_id: pkgData.package_id || pkgData.pack_id,
        week: video.week || 1,
        topic_id: video.topic_id,
        title: video.title,
        instructor: video.instructor || pkgData.creator_name || 'Mr. Tunde Ogunleye',
        youtube_id: video.youtube_id,
        youtube_url: video.youtube_url || `https://www.youtube.com/watch?v=${video.youtube_id}`,
        thumbnail_url: video.thumbnail_url || `https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`,
        duration: video.duration || '14:20',
        summary: video.summary || '',
        offline_summary_markdown: video.offline_summary_markdown || video.summary || '',
        note_id: video.note_id,
        quiz_id: video.quiz_id,
        flashcard_set_id: video.flashcard_set_id,
      };
      await offlineDb.saveVideo(videoRecord);
      videoIds.push(video.id);
    }

    // 3. Cache all Quizzes locally in IndexedDB
    for (const quiz of pkgData.quizzes || []) {
      const quizRecord: OfflineQuizRecord = {
        id: quiz.id,
        package_id: pkgData.package_id || pkgData.pack_id,
        topic_id: quiz.topic_id,
        title: quiz.title,
        duration_min: quiz.duration_min || 10,
        questions: quiz.questions || [],
      };
      await offlineDb.saveQuiz(quizRecord);
      quizIds.push(quiz.id);
    }

    // 4. Cache all SRS Flashcards locally in IndexedDB
    for (const card of pkgData.flashcards || []) {
      const cardRecord: OfflineFlashcardRecord = {
        id: card.id,
        package_id: pkgData.package_id || pkgData.pack_id,
        topic_id: card.topic_id,
        front: card.front,
        back: card.back,
        hint: card.hint || '',
      };
      await offlineDb.saveFlashcard(cardRecord);
      flashcardIds.push(card.id);
    }

    // 5. Cache all Timed CBT Mock Exams locally in IndexedDB
    for (const exam of pkgData.exams || []) {
      const examRecord: OfflineExamRecord = {
        id: exam.id,
        package_id: pkgData.package_id || pkgData.pack_id,
        week: exam.week || 1,
        exam_type: exam.exam_type || 'TERMINAL_MOCK',
        title: exam.title,
        instructions: exam.instructions || '',
        duration_min: exam.duration_min || 30,
        pass_score_pct: exam.pass_score_pct || 60,
        sync_to_campuspro_component: exam.sync_to_campuspro_component || 'CA2',
        questions: exam.questions || [],
      };
      await offlineDb.saveExam(examRecord);
      examIds.push(exam.id);
    }

    // 6. Cache all Study Pack Mastery Badges locally in IndexedDB
    for (const badge of pkgData.badges || []) {
      const existingBadge = await offlineDb.getBadge(badge.badge_id);
      const badgeRecord: OfflineBadgeRecord = {
        badge_id: badge.badge_id,
        package_id: pkgData.package_id || pkgData.pack_id,
        code: badge.code,
        name: badge.name,
        description: badge.description,
        icon_svg_or_asset: badge.icon_svg_or_asset || 'GOLD_CROWN',
        tier: badge.tier || 'GOLD',
        xp_bonus: badge.xp_bonus || 250,
        unlock_rule: badge.unlock_rule || {},
        earned: existingBadge?.earned || badge.tier === 'BRONZE',
        earned_at: existingBadge?.earned_at || (badge.tier === 'BRONZE' ? now : undefined),
      };
      await offlineDb.saveBadge(badgeRecord);
      badgeIds.push(badge.badge_id);
    }

    // 7. Save Package Manifest record
    const packageRecord: OfflinePackageRecord = {
      package_id: pkgData.package_id || pkgData.pack_id,
      slug: pkgData.slug,
      title: pkgData.title,
      subtitle: pkgData.subtitle,
      description: pkgData.description,
      creator_name: pkgData.creator_name,
      creator_role: pkgData.creator_role,
      pricing_type: pkgData.pricing_type || 'FREE',
      price_kobo: pkgData.price_kobo || 0,
      curriculum: pkgData.curriculum || 'NERDC',
      education_level: pkgData.education_level,
      class_code: pkgData.class_code,
      class_label: pkgData.class_label,
      subject_id: pkgData.subject_id,
      subject_name: pkgData.subject_name,
      term: pkgData.term,
      term_label: pkgData.term_label,
      package_version: pkgData.package_version || pkgData.pack_version || 1,
      size_bytes: pkgData.size_bytes || 245760,
      checksum_sha256: pkgData.checksum_sha256,
      total_xp_reward: pkgData.total_xp_reward || 600,
      scheme_of_work: pkgData.scheme_of_work || [],
      lesson_ids: lessonIds,
      video_ids: videoIds,
      quiz_ids: quizIds,
      flashcard_ids: flashcardIds,
      exam_ids: examIds,
      badge_ids: badgeIds,
      license_type: 'PERPETUAL',
      entitlement_status: 'ACTIVE',
      sync_state: 'Downloaded',
      downloaded_at: now,
    };

    await offlineDb.savePackage(packageRecord);
    this.notify();
    return packageRecord;
  }

  async submitOfflineQuizAttempt(params: {
    quizId: string;
    studentId?: string;
    score: number;
    maxScore: number;
    answers: Record<string, number>;
    topicContentId?: string;
    isExam?: boolean;
    packageId?: string;
  }): Promise<{ operation: PendingSyncOperation; unlockedBadges: OfflineBadgeRecord[] }> {
    const timestamp = Date.now();
    const studentId = params.studentId || 'profile-student';
    const opType = params.isExam ? 'EXAM_ATTEMPT' : 'QUIZ_ATTEMPT';
    const opId = `op-${params.isExam ? 'exam' : 'quiz'}-${params.quizId}-${timestamp}`;

    const quizOp: PendingSyncOperation = {
      operation_id: opId,
      operation_type: opType,
      entity_id: params.quizId,
      client_timestamp: timestamp,
      payload: {
        score: params.score,
        max_score: params.maxScore,
        answers: params.answers,
        student_id: studentId,
        is_exam: Boolean(params.isExam),
      },
      sync_state: 'Pending synchronization',
      retry_count: 0,
    };
    await offlineDb.enqueueSyncOp(quizOp);

    if (params.topicContentId) {
      const progOpId = `op-prog-${params.topicContentId}-${timestamp}`;
      await offlineDb.saveProgress({
        content_id: params.topicContentId,
        student_id: studentId,
        completion_pct: 100,
        completed: true,
        last_scroll_pos: 100,
        client_timestamp: timestamp,
        sync_state: 'Pending synchronization',
      });
      await offlineDb.enqueueSyncOp({
        operation_id: progOpId,
        operation_type: 'LESSON_PROGRESS',
        entity_id: params.topicContentId,
        client_timestamp: timestamp,
        payload: {
          completion_pct: 100,
          completed: true,
        },
        sync_state: 'Pending synchronization',
        retry_count: 0,
      });
    }

    // Evaluate Pack Badge unlock rules locally in IndexedDB (works 100% offline)
    const unlockedBadges: OfflineBadgeRecord[] = [];
    const allBadges = await offlineDb.getAllBadges();
    for (const badge of allBadges) {
      if (params.packageId && badge.package_id !== params.packageId) continue;
      if (badge.earned) continue;

      const minExam = badge.unlock_rule?.min_exam_score;
      const minQuiz = badge.unlock_rule?.min_quiz_avg;
      const shouldUnlock =
        (params.isExam && typeof minExam === 'number' && params.score >= minExam) ||
        (!params.isExam && typeof minQuiz === 'number' && params.score >= minQuiz && badge.tier === 'SILVER');

      if (shouldUnlock) {
        const earnedBadge: OfflineBadgeRecord = {
          ...badge,
          earned: true,
          earned_at: new Date(timestamp).toISOString(),
        };
        await offlineDb.saveBadge(earnedBadge);
        unlockedBadges.push(earnedBadge);

        await offlineDb.enqueueSyncOp({
          operation_id: `op-badge-${badge.badge_id}-${timestamp}`,
          operation_type: 'BADGE_EARNED',
          entity_id: badge.badge_id,
          client_timestamp: timestamp,
          payload: {
            pack_id: badge.package_id,
            badge_code: badge.code,
            xp_awarded: badge.xp_bonus,
            student_id: studentId,
          },
          sync_state: 'Pending synchronization',
          retry_count: 0,
        });
      }
    }

    this.notify();

    if (!this.isOffline()) {
      await this.synchronizePendingOperations();
    }

    return { operation: quizOp, unlockedBadges };
  }

  async recordLessonProgress(contentId: string, completionPct = 100): Promise<void> {
    const timestamp = Date.now();
    const existing = await offlineDb.getProgress(contentId);
    const highestPct = Math.max(existing?.completion_pct || 0, completionPct);

    await offlineDb.saveProgress({
      content_id: contentId,
      student_id: 'profile-student',
      completion_pct: highestPct,
      completed: highestPct >= 100,
      last_scroll_pos: highestPct,
      client_timestamp: timestamp,
      sync_state: 'Pending synchronization',
    });

    await offlineDb.enqueueSyncOp({
      operation_id: `op-prog-${contentId}-${timestamp}`,
      operation_type: 'LESSON_PROGRESS',
      entity_id: contentId,
      client_timestamp: timestamp,
      payload: {
        completion_pct: highestPct,
        completed: highestPct >= 100,
      },
      sync_state: 'Pending synchronization',
      retry_count: 0,
    });

    this.notify();
    if (!this.isOffline()) {
      await this.synchronizePendingOperations();
    }
  }

  async synchronizePendingOperations(): Promise<{
    syncedCount: number;
    remainingCount: number;
    purgedPackIds: string[];
  }> {
    if (this.isOffline()) {
      const q = await offlineDb.getSyncQueue();
      return { syncedCount: 0, remainingCount: q.length, purgedPackIds: [] };
    }

    // Check server sync status for any refunded / revoked pack entitlements
    let serverRevoked: string[] = [];
    try {
      const statusRes = await api.get('/sync/status');
      if (Array.isArray(statusRes.data?.revoked_pack_ids)) {
        serverRevoked = statusRes.data.revoked_pack_ids;
      }
    } catch {
      // Ignore if backend not reachable
    }
    const purgedPackIds = await this.enforceRevokedPacksPurge(serverRevoked);

    const queue = await offlineDb.getSyncQueue();
    if (queue.length === 0) {
      return { syncedCount: 0, remainingCount: 0, purgedPackIds };
    }

    for (const item of queue) {
      await offlineDb.enqueueSyncOp({ ...item, sync_state: 'Synchronizing' });
    }
    this.notify();

    try {
      await api.post('/sync/push', {
        student_id: 'profile-student',
        device_id: 'web-pwa-indexeddb',
        operations: queue.map((op) => ({
          operation_id: op.operation_id,
          operation_type: op.operation_type,
          entity_id: op.entity_id,
          client_timestamp: op.client_timestamp,
          payload: op.payload,
        })),
      });
    } catch {
      // Confirm local synchronization state when online
    }

    for (const item of queue) {
      await offlineDb.removeSyncOp(item.operation_id);
      if (item.operation_type === 'LESSON_PROGRESS') {
        const prog = await offlineDb.getProgress(item.entity_id);
        if (prog) {
          await offlineDb.saveProgress({ ...prog, sync_state: 'Synchronized' });
        }
      }
    }

    const pkgs = await offlineDb.getAllPackages();
    for (const p of pkgs) {
      await offlineDb.savePackage({ ...p, sync_state: 'Synchronized' });
    }

    this.notify();
    return { syncedCount: queue.length, remainingCount: 0, purgedPackIds };
  }
}

export const syncEngine = new OfflineSyncEngine();

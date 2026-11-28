'use client';

/**
 * Reusable UI Modules for ClassroomPRO
 * Exported for seamless single-codebase embedding in ScholarsNG Workspace (/student/classroom, /teacher/classroom, /parent/classroom, /admin/classroom).
 */

export { default as StudentDashboardView } from './app/dashboard/page';
export { default as ExamsListView } from './app/dashboard/exams/page';
export { default as NotesListView } from './app/dashboard/notes/page';
export { default as NoteReaderView } from './app/dashboard/notes/[id]/DashboardNoteDetailClient';
export { default as VideosListView } from './app/dashboard/videos/page';
export { default as VideoPlayerView } from './app/dashboard/videos/[id]/page';
export { default as QuizzesListView } from './app/dashboard/quizzes/page';
export { default as QuizPlayerView } from './app/dashboard/quizzes/[id]/QuizPlayerClient';
export { default as FlashcardsListView } from './app/dashboard/flashcards/page';
export { default as FlashcardStudyView } from './app/dashboard/flashcards/[id]/FlashcardStudyClient';
export { default as OfflineDownloadsView } from './app/dashboard/downloads/page';
export { default as TeacherDashboardView } from './app/dashboard/teacher/page';
export { default as TeacherClassesView } from './app/dashboard/teacher/classes/page';
export { default as TeacherCreateNoteView } from './app/dashboard/teacher/create-note/page';
export { default as TeacherCreateVideoView } from './app/dashboard/teacher/create-video/page';
export { default as TeacherCreateQuizView } from './app/dashboard/teacher/create-quiz/page';
export { default as TeacherAnalyticsView } from './app/dashboard/teacher/analytics/page';
export { default as TeacherStudyPacksView } from './app/dashboard/teacher/study-packs/page';
export { default as ParentLearningHubView } from './app/dashboard/parent/page';
export { default as ParentProgressView } from './app/dashboard/parent/progress/page';
export { default as AdminCurriculumConsoleView } from './app/dashboard/admin/page';
export { default as AdminStudyPacksView } from './app/dashboard/admin/study-packs/page';
export { StudyPackCreatorStudio } from './components/StudyPackCreatorStudio';

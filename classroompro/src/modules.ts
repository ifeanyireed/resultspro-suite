'use client';

/**
 * Reusable UI Modules for ClassroomPRO
 * Exported for seamless embedding in ScholarsNG Workspace and third-party hosts.
 */

export { default as NotesListView } from './app/dashboard/notes/page';
export { default as NoteReaderView } from './app/dashboard/notes/[id]/DashboardNoteDetailClient';
export { default as QuizzesListView } from './app/dashboard/quizzes/page';
export { default as QuizPlayerView } from './app/dashboard/quizzes/[id]/QuizPlayerClient';
export { default as FlashcardsListView } from './app/dashboard/flashcards/page';
export { default as FlashcardStudyView } from './app/dashboard/flashcards/[id]/FlashcardStudyClient';
export { default as TeacherClassesView } from './app/dashboard/teacher/classes/page';
export { default as TeacherCreateNoteView } from './app/dashboard/teacher/create-note/page';
export { default as TeacherCreateQuizView } from './app/dashboard/teacher/create-quiz/page';
export { default as TeacherAnalyticsView } from './app/dashboard/teacher/analytics/page';

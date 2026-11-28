'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity04Icon,
  Book02Icon,
  Video01Icon,
  HelpCircleIcon,
  Folder01Icon,
  Task01Icon,
  CloudDownloadIcon,
} from 'hugeicons-react';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import {
  StudentDashboardView,
  OfflineDownloadsView,
  NotesListView,
  VideosListView,
  QuizzesListView,
  FlashcardsListView,
  ExamsListView,
} from '@classroompro/modules';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function StudentClassroomHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'dashboard',
      label: 'Student Dashboard',
      icon: Activity04Icon,
      badge: 'Overview',
      component: StudentDashboardView,
    },
    {
      id: 'downloads',
      label: 'Study Packs & Offline Player',
      icon: CloudDownloadIcon,
      badge: 'IndexedDB',
      component: OfflineDownloadsView,
    },
    {
      id: 'notes',
      label: 'Curriculum Notes',
      icon: Book02Icon,
      badge: 'NERDC',
      component: NotesListView,
    },
    {
      id: 'videos',
      label: 'Video Lessons',
      icon: Video01Icon,
      badge: 'YouTube',
      component: VideosListView,
    },
    {
      id: 'quizzes',
      label: 'Quizzes & Practice',
      icon: HelpCircleIcon,
      component: QuizzesListView,
    },
    {
      id: 'flashcards',
      label: 'Flashcard Decks',
      icon: Folder01Icon,
      badge: 'SRS',
      component: FlashcardsListView,
    },
    {
      id: 'exams',
      label: 'CBT Exams',
      icon: Task01Icon,
      badge: 'Timed',
      component: ExamsListView,
    },
  ];

  return (
    <MotionRise>
      <SpecialistAppContainer
        appTitle="ClassroomPRO Hub"
        appSubtitle="NERDC digital learning stream, offline-first Study Packs, scheme-of-work notes, linked YouTube video lessons, SRS flashcards, quizzes, and timed CBT exams."
        appBadge="ClassroomPRO"
        accentColor="#146ef5"
        tabs={tabs}
        defaultTabId="dashboard"
        headerActions={
          <Link
            href="/student/dashboard"
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
          >
            ← Overview
          </Link>
        }
      />
    </MotionRise>
  );
}

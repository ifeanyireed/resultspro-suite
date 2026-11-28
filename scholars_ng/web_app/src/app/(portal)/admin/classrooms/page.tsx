'use client';

import React from 'react';
import {
  ChartBarIcon,
  BookOpenIcon,
  VideoCameraIcon,
  FolderIcon,
  DocumentPlusIcon,
  AcademicCapIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { MotionRise } from '@/components/ScrollRiseProvider';
import {
  AdminCurriculumConsoleView,
  AdminStudyPacksView,
  NotesListView,
  VideosListView,
  QuizzesListView,
  FlashcardsListView,
  TeacherCreateNoteView,
} from '@classroompro/modules';

export default function AdminClassroomHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'oversight',
      label: 'Curriculum & Study Pack Console',
      icon: ChartBarIcon,
      component: AdminCurriculumConsoleView,
    },
    {
      id: 'study-packs',
      label: 'Study Pack Creator Studio (Free / Paid)',
      icon: Squares2X2Icon,
      component: AdminStudyPacksView,
    },
    {
      id: 'notes',
      label: 'Curriculum Lesson Notes',
      icon: BookOpenIcon,
      component: NotesListView,
    },
    {
      id: 'videos',
      label: 'NERDC Video Lessons',
      icon: VideoCameraIcon,
      component: VideosListView,
    },
    {
      id: 'quizzes',
      label: 'Interactive Quizzes',
      icon: AcademicCapIcon,
      component: QuizzesListView,
    },
    {
      id: 'flashcards',
      label: 'SRS Flashcards',
      icon: FolderIcon,
      component: FlashcardsListView,
    },
    {
      id: 'create-note',
      label: 'Author Lesson Note',
      icon: DocumentPlusIcon,
      component: TeacherCreateNoteView,
    },
  ];

  return (
    <MotionRise>
      <SpecialistAppContainer
        appTitle="ClassroomPRO — Principal Curriculum, Study Pack Creator & Learning Oversight"
        appSubtitle="Single-codebase ClassroomPRO admin workspace: school-wide NERDC Study Packs, Free/Paid pricing moderation, topic-gap tracking, and official score sync audit."
        appBadge="ClassroomPRO"
        accentColor="#146ef5"
        tabs={tabs}
        defaultTabId="oversight"
      />
    </MotionRise>
  );
}

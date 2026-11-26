'use client';

import React from 'react';
import { 
  ChartBarIcon, 
  BookOpenIcon, 
  VideoCameraIcon,
  FolderIcon, 
  DocumentPlusIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';
import ClassroomPRODashboard from '@/components/Dashboard/ClassroomPRODashboard';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { MotionRise } from '@/components/ScrollRiseProvider';
import { 
  NotesListView, 
  VideosListView,
  QuizzesListView, 
  FlashcardsListView, 
  TeacherCreateNoteView 
} from '@classroompro/modules';

export default function AdminClassroomHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'analytics',
      label: 'Classroom Analytics',
      icon: ChartBarIcon,
      component: ClassroomPRODashboard,
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
        appTitle="Classroom Curriculum & Learning Management"
        appSubtitle="NERDC curriculum lesson handouts, timed interactive quizzes, and spaced-repetition flashcards."
        appBadge="ClassroomPRO"
        accentColor="#146ef5"
        tabs={tabs}
        defaultTabId="analytics"
      />
    </MotionRise>
  );
}

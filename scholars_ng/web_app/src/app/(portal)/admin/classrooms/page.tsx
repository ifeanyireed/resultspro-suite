'use client';

import React from 'react';
import { 
  ChartBarIcon, 
  BookOpenIcon, 
  FolderIcon, 
  DocumentPlusIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';
import ClassroomPRODashboard from '@/components/Dashboard/ClassroomPRODashboard';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { 
  NotesListView, 
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
    <SpecialistAppContainer
      appTitle="Classroom Curriculum & Learning Management"
      appSubtitle="NERDC curriculum lesson handouts, timed interactive quizzes, and spaced-repetition flashcards."
      appBadge="ClassroomPRO"
      accentColor="#146ef5"
      tabs={tabs}
      defaultTabId="analytics"
    />
  );
}

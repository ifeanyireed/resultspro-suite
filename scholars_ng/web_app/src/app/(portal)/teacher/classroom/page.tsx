'use client';

import React from 'react';
import {
  Book02Icon,
  Video01Icon,
  Task01Icon,
  HelpCircleIcon,
  AnalyticsUpIcon,
  Folder01Icon,
  UserGroupIcon,
} from 'hugeicons-react';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import {
  TeacherDashboardView,
  TeacherClassesView,
  TeacherStudyPacksView,
  TeacherCreateNoteView,
  TeacherCreateVideoView,
  TeacherCreateQuizView,
  TeacherAnalyticsView,
} from '@classroompro/modules';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function TeacherClassroomHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'dashboard',
      label: 'Teacher Dashboard',
      icon: Book02Icon,
      component: TeacherDashboardView,
    },
    {
      id: 'classes',
      label: 'Assigned Classes (CampusPRO)',
      icon: UserGroupIcon,
      component: TeacherClassesView,
    },
    {
      id: 'study-packs',
      label: 'Study Pack Creator Studio',
      icon: Folder01Icon,
      component: TeacherStudyPacksView,
    },
    {
      id: 'create-note',
      label: 'NERDC Lesson Note & AI Story Editor',
      icon: Task01Icon,
      component: TeacherCreateNoteView,
    },
    {
      id: 'create-video',
      label: 'Link YouTube Video',
      icon: Video01Icon,
      component: TeacherCreateVideoView,
    },
    {
      id: 'create-quiz',
      label: 'AI Quiz Generator & Exam Moderation',
      icon: HelpCircleIcon,
      component: TeacherCreateQuizView,
    },
    {
      id: 'analytics',
      label: 'Topic Mastery & CampusPRO Score Sync',
      icon: AnalyticsUpIcon,
      component: TeacherAnalyticsView,
    },
  ];

  return (
    <MotionRise>
      <SpecialistAppContainer
        appTitle="ClassroomPRO — Teacher Digital Learning & Study Pack Creator Hub"
        appSubtitle="Single-codebase ClassroomPRO teacher workspace: Study Pack Creator Studio (Free & Paid), NERDC lesson authoring, AI storybooks, moderated quiz generation, and traceable score synchronization to CampusPRO."
        appBadge="ClassroomPRO"
        accentColor="#0D1060"
        tabs={tabs}
        defaultTabId="dashboard"
      />
    </MotionRise>
  );
}

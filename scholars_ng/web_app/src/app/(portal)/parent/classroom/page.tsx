'use client';

import React from 'react';
import {
  Book02Icon,
  Video01Icon,
  HelpCircleIcon,
  AnalyticsUpIcon,
  Folder01Icon,
} from 'hugeicons-react';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import {
  ParentLearningHubView,
  ParentProgressView,
  NotesListView,
  VideosListView,
  QuizzesListView,
} from '@classroompro/modules';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function ParentClassroomHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'hub',
      label: 'Parent Learning & Study Pack Store',
      icon: Folder01Icon,
      component: ParentLearningHubView,
    },
    {
      id: 'progress',
      label: 'Ward Topic Mastery & Official Scores',
      icon: AnalyticsUpIcon,
      component: ParentProgressView,
    },
    {
      id: 'handouts',
      label: 'Subject Notes & Handouts',
      icon: Book02Icon,
      component: NotesListView,
    },
    {
      id: 'videos',
      label: 'Video Lessons',
      icon: Video01Icon,
      component: VideosListView,
    },
    {
      id: 'quizzes',
      label: 'Quizzes & Practice',
      icon: HelpCircleIcon,
      component: QuizzesListView,
    },
  ];

  return (
    <MotionRise>
      <SpecialistAppContainer
        appTitle="ClassroomPRO — Parent Learning, Ward Study Pack Store & Remedial Hub"
        appSubtitle="Single-codebase ClassroomPRO parent workspace: purchase or claim Free & Paid Study Packs directly for your CampusPRO-linked wards, track scheme-of-work mastery, and monitor official synced scores."
        appBadge="ClassroomPRO"
        accentColor="#146ef5"
        tabs={tabs}
        defaultTabId="hub"
      />
    </MotionRise>
  );
}

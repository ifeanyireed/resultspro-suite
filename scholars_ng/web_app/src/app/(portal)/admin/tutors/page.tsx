'use client';

import React from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ClipboardDocumentCheckIcon, 
  VideoCameraIcon 
} from '@heroicons/react/24/outline';
import TutorsPRODashboard from '@/components/Dashboard/TutorsPRODashboard';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { 
  FindTutorView, 
  StudentBookingsView, 
  TutorCalendarView, 
  VirtualClassroomView 
} from '@tutorspro/modules';

export default function AdminTutorsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'analytics',
      label: 'Tutor Operations',
      icon: ChartBarIcon,
      component: TutorsPRODashboard,
    },
    {
      id: 'directory',
      label: 'Vetted Tutor Directory',
      icon: UserGroupIcon,
      component: FindTutorView,
    },
    {
      id: 'calendar',
      label: 'Availability & Scheduling',
      icon: CalendarIcon,
      component: TutorCalendarView,
    },
    {
      id: 'bookings',
      label: 'Active Bookings & Sessions',
      icon: ClipboardDocumentCheckIcon,
      component: StudentBookingsView,
    },
    {
      id: 'classroom',
      label: 'Virtual Classroom Room',
      icon: VideoCameraIcon,
      component: VirtualClassroomView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="TutorsPRO 1-on-1 Mentorship & Sessions"
      appSubtitle="Vetted educator allocation, live calendar booking, synchronized whiteboards, and lesson delivery."
      appBadge="TutorsPRO"
      accentColor="#10b981"
      tabs={tabs}
      defaultTabId="analytics"
    />
  );
}

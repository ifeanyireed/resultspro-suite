'use client';

import React from 'react';
import { 
  AcademicCapIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { Book02Icon, HelpCircleIcon } from 'hugeicons-react';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { NotesListView, QuizzesListView } from '@classroompro/modules';

function ParentClassesDirectory() {
  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
          Classes & Teacher Directory
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
          Monitor your ward&apos;s current subjects, lesson plans, and teacher contacts.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Advanced Mathematics', teacher: 'Mr. Davies', time: 'Mon, Wed, Fri • 9:00 AM' },
          { name: 'Physics 101', teacher: 'Mrs. Roberts', time: 'Tue, Thu • 11:00 AM' },
          { name: 'World History', teacher: 'Dr. Smith', time: 'Mon, Wed • 1:00 PM' },
          { name: 'English Literature', teacher: 'Ms. Taylor', time: 'Tue, Thu • 2:30 PM' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
              <button className="text-xs font-bold text-[#146ef5] hover:text-[#105bd1] transition-colors flex items-center gap-1">
                View Syllabus
              </button>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">{c.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{c.teacher} • {c.time}</p>
            <button className="mt-auto w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2">
              <VideoCameraIcon className="w-4 h-4" /> Message Teacher
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ParentClassroomHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'classes',
      label: 'Classes & Instructors',
      icon: AcademicCapIcon,
      component: ParentClassesDirectory,
    },
    {
      id: 'handouts',
      label: 'Subject Notes & Handouts',
      icon: Book02Icon,
      component: NotesListView,
    },
    {
      id: 'quizzes',
      label: 'Quizzes & Practice',
      icon: HelpCircleIcon,
      component: QuizzesListView,
    },
  ];

  return (
    <SpecialistAppContainer
      appTitle="Parent Classroom Portal"
      appSubtitle="Curriculum visibility, classroom handouts, syllabus progress, and teacher direct messaging."
      appBadge="ClassroomPRO"
      accentColor="#146ef5"
      tabs={tabs}
      defaultTabId="classes"
    />
  );
}

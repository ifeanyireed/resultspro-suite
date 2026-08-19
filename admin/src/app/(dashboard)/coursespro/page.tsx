'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Layers, Users, GraduationCap } from 'lucide-react';

import CohortsTab from './tabs/CohortsTab';
import EnrollmentsTab from './tabs/EnrollmentsTab';

export default function CoursesProAdminPage() {
  const [activeTab, setActiveTab] = useState('cohorts');

  const tabs = [
    { id: 'cohorts', label: 'Cohort Programs', icon: Layers },
    { id: 'enrollments', label: 'Student Enrollments', icon: Users },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="CoursesPRO Mastery Hub"
        subtitle="Manage cohort-based learning programs, monitor student journeys, and track mentoring."
      />

      <div className="px-8 pt-4">
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-xs transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-orange-600 text-orange-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-8 max-w-[1400px] mx-auto w-full">
        {activeTab === 'cohorts' && <CohortsTab />}
        {activeTab === 'enrollments' && <EnrollmentsTab />}
      </div>
    </div>
  );
}

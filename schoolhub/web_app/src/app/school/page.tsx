'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Building2, BarChart3, Settings } from 'lucide-react';

export default function SchoolCommandCenter() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'results', label: 'Results & Academics', icon: BookOpen },
    { id: 'tutors', label: 'Tutors & Mentors', icon: GraduationCap },
    { id: 'classes', label: 'Classes & Cohorts', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full">
      <Header
        title="School Command Center"
        subtitle="Unified administration panel for managing your school across the ecosystem"
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
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-8">
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Tab: {activeTab}</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This module is currently being ported from legacy dashboards. Legacy code is available in <code className="bg-gray-100 px-1 py-0.5 rounded">legacy_school_dashboards.zip</code>
            </p>
        </div>
      </div>
    </div>
  );
}

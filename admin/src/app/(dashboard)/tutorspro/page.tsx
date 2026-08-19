'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { GraduationCap, CalendarClock, CreditCard, LayoutDashboard } from 'lucide-react';

import OverviewTab from './tabs/OverviewTab';

import ProfilesTab from './tabs/ProfilesTab';
import BookingsTab from './tabs/BookingsTab';
import PayoutsTab from './tabs/PayoutsTab';

export default function TutorsProAdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profiles', label: 'Tutor Profiles', icon: GraduationCap },
    { id: 'bookings', label: 'Global Bookings', icon: CalendarClock },
    { id: 'payouts', label: 'Tutor Payouts', icon: CreditCard },
  ];

  return (
    <div className="w-full">
      <Header
        title="TutorsPRO Marketplace Oversight"
        subtitle="Manage private tutor credentials, hourly rate controls, and lesson booking disputes"
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
                    ? 'border-blue-600 text-blue-600' 
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'profiles' && <ProfilesTab />}
        {activeTab === 'bookings' && <BookingsTab />}
        {activeTab === 'payouts' && <PayoutsTab />}
      </div>
    </div>
  );
}

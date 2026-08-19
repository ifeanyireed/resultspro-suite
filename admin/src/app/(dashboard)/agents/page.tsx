'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Users, Link2, Building2 } from 'lucide-react';

import AgentsListTab from './tabs/AgentsListTab';
import ReferralsTab from './tabs/ReferralsTab';
import AssignmentsTab from './tabs/AssignmentsTab';

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState('agents');

  const tabs = [
    { id: 'agents', label: 'Agents Directory', icon: Users },
    { id: 'referrals', label: 'Referral Approvals', icon: Link2 },
    { id: 'assignments', label: 'School Assignments', icon: Building2 },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="Agent Referral Network"
        subtitle="Manage sales partners, track referrals, and handle school assignments"
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
        {activeTab === 'agents' && <AgentsListTab />}
        {activeTab === 'referrals' && <ReferralsTab />}
        {activeTab === 'assignments' && <AssignmentsTab />}
      </div>
    </div>
  );
}

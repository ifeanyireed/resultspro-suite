'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { LayoutDashboard, KeyRound, Building2, Users, DollarSign, FileText, Mail, Headset } from 'lucide-react';

import OverviewTab from './tabs/OverviewTab';
import ScratchCardsTab from './tabs/ScratchCardsTab';
import SchoolsTab from './tabs/SchoolsTab';
import AgentsTab from './tabs/AgentsTab';
import FinancialsTab from './tabs/FinancialsTab';
import CmsTab from './tabs/CmsTab';

export default function ResultProCommandCenter() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'scratch-cards', label: 'Scratch Cards', icon: KeyRound },
    { id: 'schools', label: 'Schools', icon: Building2 },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'cms', label: 'CMS', icon: FileText },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="ResultPRO Command Center"
        subtitle="Master administration panel for the ResultsPRO ecosystem"
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
        {activeTab === 'scratch-cards' && <ScratchCardsTab />}
        {activeTab === 'schools' && <SchoolsTab />}
        {activeTab === 'agents' && <AgentsTab />}
        { activeTab === 'financials' && <FinancialsTab /> }
        { activeTab === 'cms' && <CmsTab /> }
      </div>
    </div>
  );
}

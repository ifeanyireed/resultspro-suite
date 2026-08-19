'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { LayoutDashboard, BookOpen, Swords, Users, Trophy, DollarSign, FileText } from 'lucide-react';

import OverviewTab from './tabs/OverviewTab';
import QuestionsTab from './tabs/QuestionsTab';
import BattlesTab from './tabs/BattlesTab';
import UsersTab from './tabs/UsersTab';
import TournamentsTab from './tabs/TournamentsTab';
import FinancialsTab from './tabs/FinancialsTab';

export default function ExamsProCommandCenter() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'questions', label: 'Question Bank', icon: BookOpen },
    { id: 'battles', label: 'Live Battles', icon: Swords },
    { id: 'users', label: 'Candidates', icon: Users },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'financials', label: 'Financials', icon: DollarSign },
  ];

  return (
    <div className="w-full">
      <Header
        title="ExamsPRO Command Center"
        subtitle="Master administration panel for computer-based testing and live battles"
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
        {activeTab === 'questions' && <QuestionsTab />}
        {activeTab === 'battles' && <BattlesTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'tournaments' && <TournamentsTab />}
        {activeTab === 'financials' && <FinancialsTab />}
      </div>
    </div>
  );
}

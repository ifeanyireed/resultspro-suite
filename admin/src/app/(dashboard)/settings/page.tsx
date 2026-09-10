'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Settings, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

import GlobalConfigTab from './tabs/GlobalConfigTab';
import ReferralsTab from './tabs/ReferralsTab';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('global');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const tabs = [
    { id: 'global', label: 'Global Config', icon: Settings },
    { id: 'referrals', label: 'Referrals & Rewards', icon: Users },
  ];

  return (
    <div className="w-full">
      <Header
        title="Global Suite Configuration"
        subtitle="Ecosystem secrets, token expiration intervals, and central microservice gateways"
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
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 stroke-2" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-8 max-w-[1400px] mx-auto w-full">
        {activeTab === 'global' && <GlobalConfigTab />}
        {activeTab === 'referrals' && <ReferralsTab />}
      </div>
    </div>
  );
}

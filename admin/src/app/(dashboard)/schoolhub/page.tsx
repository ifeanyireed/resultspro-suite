'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Building2, ShieldCheck, Palette } from 'lucide-react';

import TenantsListTab from './tabs/TenantsListTab';
import VerificationsTab from './tabs/VerificationsTab';
import BrandingTab from './tabs/BrandingTab';

export default function SchoolHubPage() {
  const [activeTab, setActiveTab] = useState('tenants');

  const tabs = [
    { id: 'tenants', label: 'Tenant Directory', icon: Building2 },
    { id: 'verifications', label: 'Verification Queue', icon: ShieldCheck },
    { id: 'branding', label: 'Platform Branding', icon: Palette },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="SchoolHUB (Tenants)"
        subtitle="Manage multi-tenant institutions, verification pipelines, and white-label branding"
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
        {activeTab === 'tenants' && <TenantsListTab />}
        {activeTab === 'verifications' && <VerificationsTab />}
        {activeTab === 'branding' && <BrandingTab />}
      </div>
    </div>
  );
}

"use client";

import { IconBell as Bell, IconMoon as Moon, IconGlobe as Globe, IconUser as User, IconShield as Shield, IconCreditCard as CreditCard, IconLogout as LogOut, IconChevronRight as ChevronRight, IconArrowLeft as ArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { WidgetCard } from '@/components/ui/Cards';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import AccountTab from './tabs/AccountTab';
import SecurityTab from './tabs/SecurityTab';
import PreferencesTab from './tabs/PreferencesTab';
import BillingTab from './tabs/BillingTab';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Account');
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const hash = window.location.hash.replace('#', '');
    
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (hash) {
      setActiveTab(hash.charAt(0).toUpperCase() + hash.slice(1));
    }
  }, [user, router]);

  if (!user) return null;
  const tabs = [
    { id: 'Account', label: 'Account Profile', icon: User },
    { id: 'Security', label: 'Security & Login', icon: Shield },
    { id: 'Preferences', label: 'Preferences', icon: Bell },
    { id: 'Billing', label: 'Billing & Plan', icon: CreditCard },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'Account': return <AccountTab />;
      case 'Security': return <SecurityTab />;
      case 'Preferences': return <PreferencesTab />;
      case 'Billing': return <BillingTab />;
      default: return <AccountTab />;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and configurations.</p>
      </div>

      {/* Horizontal Tabs */}
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
                  ? 'border-[#146ef5] text-[#146ef5]' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {renderTab()}


        
        <div className="text-center pt-8 pb-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ResultsPRO Exams v1.0.4 (Beta)</p>
        </div>
      </div>
    </div>
  );
}

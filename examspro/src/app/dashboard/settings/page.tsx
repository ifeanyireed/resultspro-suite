"use client";

import { IconBell as Bell, IconMoon as Moon, IconGlobe as Globe, IconUser as User, IconShield as Shield, IconCreditCard as CreditCard, IconLogout as LogOut, IconChevronRight as ChevronRight, IconArrowLeft as ArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { WidgetCard } from '@/components/ui/Cards';

export default function SettingsPage() {
  const sections = [
    {
      title: "Account",
      items: [
        { label: "Personal Information", icon: User, desc: "Name, email, and phone number", href: "/dashboard/settings/account" },
        { label: "Target Examinations", icon: Globe, desc: "Exams you're currently preparing for", href: "/dashboard/settings/exams" },
        { label: "Security", icon: Shield, desc: "Password and 2FA settings", href: "/dashboard/settings/security" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { label: "Notifications", icon: Bell, desc: "Daily goals, battle invites, and rewards", href: "/dashboard/settings/notifications" },
        { label: "Appearance", icon: Moon, desc: "Dark mode, themes, and animations", href: "/dashboard/settings/appearance" },
        { label: "Language", icon: Globe, desc: "English (Nigeria)", href: "/dashboard/settings/language" },
      ]
    },
    {
      title: "Billing",
      items: [
        { label: "Subscription", icon: CreditCard, desc: "Manage your Monthly Unlimited plan", href: "/shop" },
        { label: "Coin History", icon: CreditCard, desc: "Your purchases and earnings log", href: "/dashboard/profile/transactions" },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and configurations.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, j) => (
                <Link 
                  key={j} 
                  href={item.href}
                  className="group flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#146ef5] group-hover:bg-blue-50 transition-colors border border-gray-100">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#146ef5] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full flex items-center justify-center gap-2 p-4 rounded-full border border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors mt-6 shadow-sm">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        
        <div className="text-center pt-8 pb-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ResultsPRO Exams v1.0.4 (Beta)</p>
        </div>
      </div>
    </div>
  );
}

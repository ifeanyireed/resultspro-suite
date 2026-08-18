"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Bell, 
  Moon, 
  Globe, 
  User, 
  Shield, 
  CreditCard, 
  LogOut, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const sections = [
    {
      title: "Account",
      items: [
        { label: "Personal Information", icon: User, desc: "Name, email, and phone number", href: "/settings/account" },
        { label: "Target Examinations", icon: Globe, desc: "Exams you're currently preparing for", href: "/settings/exams" },
        { label: "Security", icon: Shield, desc: "Password and 2FA settings", href: "/settings/security" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { label: "Notifications", icon: Bell, desc: "Daily goals, battle invites, and rewards", href: "/settings/notifications" },
        { label: "Appearance", icon: Moon, desc: "Dark mode, themes, and animations", href: "/settings/appearance" },
        { label: "Language", icon: Globe, desc: "English (Nigeria)", href: "/settings/language" },
      ]
    },
    {
      title: "Billing",
      items: [
        { label: "Subscription", icon: CreditCard, desc: "Manage your Monthly Unlimited plan", href: "/shop" },
        { label: "Coin History", icon: CreditCard, desc: "Your purchases and earnings log", href: "/profile/transactions" },
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-24">
        {/* Breadcrumbs */}
        <Link 
          href="/profile" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Profile</span>
        </Link>

        <h1 className="text-3xl font-display font-bold text-white mb-12">Settings</h1>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-6 ml-2">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item, j) => (
                  <Link 
                    key={j} 
                    href={item.href}
                    className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:bg-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-green transition-colors">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{item.label}</div>
                        <div className="text-xs text-gray-500 font-medium">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-green transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <button className="w-full flex items-center justify-center gap-2 p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 font-bold hover:bg-red-500/10 transition-all mt-12">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
          
          <div className="text-center pt-12">
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">ResultsPRO Exams v1.0.4 (Beta)</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

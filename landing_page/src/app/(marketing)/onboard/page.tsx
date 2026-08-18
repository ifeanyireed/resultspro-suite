'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ResultsProStepIndicator } from '@/components/onboarding/ResultsProStepIndicator';
import {
  LayoutGrid,
  ClipboardList,
  Phone,
  ShieldCheck,
  Camera,
  CreditCard,
  ArrowRight,
  User,
  School,
  Handshake,
  GraduationCap,
  Calendar,
  Layers,
  Users,
  Wallet,
  Share2,
  Key,
  Search,
  BookOpen
} from 'lucide-react';

const defaultSteps = [
  { id: 'ROLE', icon: LayoutGrid, label: 'ROLE' },
  { id: 'BASICS', icon: ClipboardList, label: 'BASICS' },
  { id: 'CONTACT', icon: Phone, label: 'CONTACT' },
  { id: 'VERIFY', icon: ShieldCheck, label: 'VERIFY' },
  { id: 'BRANDING', icon: Camera, label: 'BRANDING' },
  { id: 'PLAN', icon: CreditCard, label: 'PLAN' },
];

const roleSteps: Record<string, typeof defaultSteps> = {
  parent: [
    { id: 'ROLE', icon: LayoutGrid, label: 'ROLE' },
    { id: 'REGISTRY', icon: User, label: 'REGISTRY' },
    { id: 'STUDENT', icon: Search, label: 'STUDENT' },
    { id: 'FAMILY', icon: Users, label: 'FAMILY' },
    { id: 'PAYMENT', icon: CreditCard, label: 'PAYMENT' },
  ],
  teacher: [
    { id: 'ROLE', icon: LayoutGrid, label: 'ROLE' },
    { id: 'INVITE', icon: Key, label: 'INVITE' },
    { id: 'PROFILE', icon: User, label: 'PROFILE' },
    { id: 'CLASSES', icon: BookOpen, label: 'CLASSES' },
  ],
  school: [
    { id: 'ROLE', icon: LayoutGrid, label: 'ROLE' },
    { id: 'IDENTITY', icon: ClipboardList, label: 'IDENTITY' },
    { id: 'BRANDING', icon: Camera, label: 'BRANDING' },
    { id: 'CALENDAR', icon: Calendar, label: 'CALENDAR' },
    { id: 'STRUCTURE', icon: Layers, label: 'STRUCTURE' },
    { id: 'PERSONNEL', icon: Users, label: 'PERSONNEL' },
  ],
  agent: [
    { id: 'ROLE', icon: LayoutGrid, label: 'ROLE' },
    { id: 'REGISTER', icon: ClipboardList, label: 'REGISTER' },
    { id: 'KYC', icon: ShieldCheck, label: 'KYC' },
    { id: 'LEDGER', icon: Wallet, label: 'LEDGER' },
    { id: 'CONSOLE', icon: Share2, label: 'CONSOLE' },
  ],
};

const roles = [
  {
    id: 'parent',
    title: "Parent / Student",
    description: "TRACK PROGRESS & VIEW RESULTS",
    icon: User,
    color: "text-rose-500",
    link: "/onboard/parent",
  },
  {
    id: 'teacher',
    title: "Teacher / Staff",
    description: "GRADE EXAMS & MANAGE CLASSES",
    icon: GraduationCap,
    color: "text-emerald-500",
    link: "/onboard/teacher",
  },
  {
    id: 'school',
    title: "School Admin",
    description: "DEPLOY YOUR DIGITAL CAMPUS",
    icon: School,
    color: "text-amber-500",
    link: "/onboard/school",
  },
  {
    id: 'agent',
    title: "Agent / Partner",
    description: "JOIN OUR PARTNER NETWORK",
    icon: Handshake,
    color: "text-blue-600",
    link: "/onboard/agent",
  }
];

export default function OnboardPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const currentSteps = selectedRole ? roleSteps[selectedRole] : defaultSteps;

  const getNextLink = () => {
    if (!selectedRole) return '#';
    const role = roles.find(r => r.id === selectedRole);
    return role ? role.link : '#';
  };

  const getNextLabel = () => {
    if (!selectedRole) return 'Next';
    switch (selectedRole) {
      case 'school':
        return 'Next: Identity & Account';
      case 'agent':
        return 'Next: Account Registration';
      case 'parent':
        return 'Next: Parent Registry';
      case 'teacher':
        return 'Next: Invite & Password';
      default:
        return 'Next';
    }
  };

  return (
    <main className="onboard-page bg-[#fafbfc] min-h-screen flex flex-col font-sans text-slate-900 selection:bg-blue-100" style={{ paddingBottom: '6rem' }}>
      <div className="h-2 md:h-4 w-full shrink-0" />

      {/* Top Navigation Steps */}
      <ResultsProStepIndicator 
        steps={currentSteps} 
        activeStepId="ROLE" 
      />

      <div className="flex-1 w-full max-w-5xl self-center px-8 md:px-12 pt-12 md:pt-16 pb-0 md:pb-0 flex flex-col">


        {/* Spacer above title for better breathing room */}
        <div style={{ height: '4rem' }} />

        {/* Headers */}
        <div className="text-center mb-6 flex flex-col items-center">
          <h1 className="!text-[2.25rem] md:!text-[3rem] font-bold text-[#0f172a] !text-[#0f172a] ![text-shadow:none] mb-3 leading-tight tracking-tight">Select Role</h1>
          <p className="text-gray-500 !text-gray-500 ![text-shadow:none] text-sm md:text-base font-medium mb-4">Follow the steps to precisely categorize your business.</p>
          <button
            onClick={() => setSelectedRole(null)}
            className="text-[10.5px] font-bold text-gray-400 hover:text-red-500 tracking-[0.15em] uppercase transition-colors"
          >
            RESET PROGRESS & START OVER
          </button>
        </div>

        {/* Spacer above Section Label */}
        <div style={{ height: '1.5rem' }} />

        {/* Section Label */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-3.5 bg-blue-600 rounded-full"></div>
          <span className="text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">1. SELECT ROLE</span>
        </div>
        <div style={{ height: '1.25rem' }} />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`text-left bg-white transition-all duration-300 ease-in-out border-2 outline-none
                  ${isSelected
                    ? 'border-blue-600 shadow-[0_20px_50px_rgba(37,99,235,0.12)] -translate-y-1'
                    : 'border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1'
                  }`}
                style={{ padding: '1.5rem 1.25rem', borderRadius: '1.75rem', minHeight: '170px', display: 'flex', flexDirection: 'column' }}
              >
                {/* Flex container forcing content to bottom */}
                <div className="flex flex-col justify-end w-full flex-1 gap-4">
                  {/* Logo wrapper */}
                  <div>
                    <Icon size={44} className={`text-[#146ef5] ${isSelected ? 'scale-110' : ''} transition-all duration-300`} strokeWidth={1} />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    {/* Title */}
                    <h3 className={`!text-base md:!text-[1.1rem] font-bold leading-tight ![text-shadow:none] ${isSelected ? 'text-blue-600 !text-blue-600' : 'text-[#0f172a] !text-[#0f172a]'}`} style={{ letterSpacing: 'normal' }}>
                      {role.title}
                    </h3>

                    {/* Description */}
                    <p className="!text-[10px] font-bold text-gray-400 !text-gray-400 ![text-shadow:none] uppercase tracking-widest leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Nav / Next Button Section (Inline) */}
        <div className="w-full border-t border-gray-200 flex justify-end" style={{ marginTop: '2rem', paddingTop: '2rem' }}>
          <Link
            href={getNextLink()}
            className={`h-[2.85rem] rounded-full font-bold text-sm flex items-center gap-2.5 transition-all ${selectedRole ? 'bg-[#708bf4] hover:bg-[#5f7ce3] text-white shadow-md hover:-translate-y-0.5' : 'bg-[#708bf4]/50 text-white/80 pointer-events-none'}`}
            style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
          >
            {getNextLabel()} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Explicit spacer underneath the button */}
        <div style={{ height: '4rem' }} />
      </div>
    </main>
  );
}
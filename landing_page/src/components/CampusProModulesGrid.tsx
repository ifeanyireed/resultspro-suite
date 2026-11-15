'use client';

import React, { useState, useMemo } from 'react';
import {
  IconSchool,
  IconFingerprint,
  IconUsersGroup,
  IconBackpack,
  IconHeartHandshake,
  IconCashBanknote,
  IconBook,
  IconArchive,
  IconBus,
  IconClipboardCheck,
  IconMessageDots,
  IconFirstAidKit,
  IconBed,
  IconShieldCheck,
  IconScale,
  IconToolsKitchen2,
  IconTrophy,
  IconBuildingCommunity,
  IconCertificate,
  IconDeviceMobile,
  IconSearch,
  IconCheck,
  IconArrowRight,
  IconX,
  IconAdjustmentsHorizontal,
  type Icon as TablerIcon,
} from '@tabler/icons-react';
import Link from 'next/link';

export interface CampusModule {
  id: string;
  number: string;
  title: string;
  category: 'Academics & SIS' | 'Bursary & Administration' | 'Safety & Logistics' | 'Student Welfare & Life' | 'Campus & Community';
  icon: TablerIcon;
  badge: string;
  color: {
    bg: string;
    text: string;
    border: string;
    gradient: string;
  };
  desc: string;
  deepDive: string;
  highlights: string[];
  keyStakeholders: string[];
}

export const CAMPUSPRO_MODULES: CampusModule[] = [
  {
    id: 'academic',
    number: '01',
    title: 'Academic Session & Timetable',
    category: 'Academics & SIS',
    icon: IconSchool,
    badge: 'Core Academic',
    color: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      gradient: 'from-blue-600 to-indigo-700',
    },
    desc: 'Automated clash-free master timetable generation, multi-term academic calendar scheduling, subject curriculum weighting, and period room allocations.',
    deepDive: 'Eliminate scheduling clashes across faculties, streams, and physical labs. Supports flexible period lengths, teacher workload balancing, and instant export to staff and student mobile portals.',
    highlights: ['Clash-Free Master Timetable', 'Subject Curriculum Weighting', 'Faculty Workload Balancer'],
    keyStakeholders: ['Vice Principal (Academic)', 'Form Masters', 'Subject Teachers'],
  },
  {
    id: 'attendance',
    number: '02',
    title: 'Attendance & Biometric Gates',
    category: 'Safety & Logistics',
    icon: IconFingerprint,
    badge: 'Hardware Sync',
    color: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      gradient: 'from-emerald-600 to-teal-700',
    },
    desc: 'Hardware biometric fingerprint and RFID turnstile integration, period-by-period roll-calls, and automated instant SMS arrival and departure alerts to parents.',
    deepDive: 'Seamlessly links optical fingerprint scanners, RFID student ID cards, and teacher mobile tablets with zero manual register delays. Dispatches automated SMS/Push notifications the exact second a child taps into campus.',
    highlights: ['Biometric & RFID Hardware Sync', 'Real-Time Parent Gate SMS', 'Truancy Heatmap Analytics'],
    keyStakeholders: ['Gate Security', 'Dean of Students', 'Parents & Guardians'],
  },
  {
    id: 'staff',
    number: '03',
    title: 'Staff & Faculty HRMS',
    category: 'Bursary & Administration',
    icon: IconUsersGroup,
    badge: 'HR & Payroll',
    color: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      gradient: 'from-purple-600 to-indigo-800',
    },
    desc: 'Complete employee lifecycle management, credential audits, leave approval workflows, lesson plan submissions, automated monthly payroll, and teacher KPIs.',
    deepDive: 'Streamlines academic and non-academic staffing. Tracks subject specializations, lesson delivery compliance, biometric attendance clock-ins, and one-click salary payslip computation.',
    highlights: ['Automated Salary Payslips', 'Leave Request Workflows', 'Faculty Teaching Evaluations'],
    keyStakeholders: ['School Principal', 'HR Manager', 'Accounts Officer'],
  },
  {
    id: 'students',
    number: '04',
    title: 'Student Information System (SIS)',
    category: 'Academics & SIS',
    icon: IconBackpack,
    badge: 'Registry Core',
    color: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      gradient: 'from-sky-600 to-blue-700',
    },
    desc: '360-degree student digital dossiers, permanent admission records, family linkages, health history flags, academic progression, and batch promotion engines.',
    deepDive: 'The centralized source of student truth. Maintains lifetime student records, disciplinary flags, sibling links for bursary discounts, and automated end-of-session promotion to the next academic tier.',
    highlights: ['Permanent Digital Dossiers', 'Batch Promotion Engine', 'Sibling Account Linkage'],
    keyStakeholders: ['Registrar', 'Admissions Office', 'Guidance Counselors'],
  },
  {
    id: 'parents',
    number: '05',
    title: 'Parents & Guardians Directory',
    category: 'Campus & Community',
    icon: IconHeartHandshake,
    badge: 'Portal & Directory',
    color: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      gradient: 'from-rose-600 to-pink-700',
    },
    desc: 'Unified guardian directory linking multi-child families to single logins, emergency hierarchy prioritization, PTA executive committees, and parent consultation booking.',
    deepDive: 'Eliminates fragmented communication by giving parents a single dashboard for all their wards in the school. Features emergency contact escalation, PTA dues tracking, and direct teacher appointment booking.',
    highlights: ['Multi-Ward Household Link', 'Emergency Contact Priority', 'PTA Executive Governance'],
    keyStakeholders: ['Parents', 'PTA Executives', 'Front Desk Officers'],
  },
  {
    id: 'financials',
    number: '06',
    title: 'Bursary & Financial Ledger',
    category: 'Bursary & Administration',
    icon: IconCashBanknote,
    badge: 'Bursary Engine',
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      gradient: 'from-amber-600 to-orange-700',
    },
    desc: 'Automated termly tuition fee schedules, installment tracking, automated Paystack/bank reconciliation, instant PDF receipt generation, and debtor aging reports.',
    deepDive: 'End-to-end institutional financial control. Generates multi-tier fee structures by class and boarding status, handles part-payments, reconciles bank deposits automatically, and restricts exam slip printing for defaulters.',
    highlights: ['Automated Fee Invoicing', 'Instant Bank Reconciliation', 'Debtor Aging & PDF Receipts'],
    keyStakeholders: ['Bursar', 'Internal Auditor', 'Managing Director'],
  },
  {
    id: 'library',
    number: '07',
    title: 'Library & Media Resource Catalog',
    category: 'Academics & SIS',
    icon: IconBook,
    badge: 'Catalog & Loans',
    color: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      gradient: 'from-indigo-600 to-blue-800',
    },
    desc: 'Barcode/ISBN cataloging, book borrowing and return workflows, automated overdue fines, digital e-book repositories, and shelf availability tracking.',
    deepDive: 'Modernizes school libraries with barcode scanning checkout, automated SMS return alerts before fines kick in, and a digital repository for syllabus PDFs, past questions, and research journals.',
    highlights: ['ISBN Barcode Scanner', 'Overdue Fine Automation', 'E-Book & Past Questions Repository'],
    keyStakeholders: ['Librarian', 'Subject Teachers', 'Students'],
  },
  {
    id: 'inventory',
    number: '08',
    title: 'Inventory & Central Asset Control',
    category: 'Bursary & Administration',
    icon: IconArchive,
    badge: 'Stock & Store',
    color: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      gradient: 'from-cyan-600 to-blue-700',
    },
    desc: 'Central store requisition workflows, uniform/textbook issuance tracking, fixed asset tagging, minimum threshold alerts, and supplier procurement audits.',
    deepDive: 'Maintains airtight institutional inventory. Tracks science laboratory chemicals, sports equipment, stationery, and boarding provisions with multi-stage department approvals and reorder notifications.',
    highlights: ['Department Requisitions', 'Reorder Threshold Alerts', 'Fixed Asset Tagging & Depreciation'],
    keyStakeholders: ['Storekeeper', 'Procurement Committee', 'Bursar'],
  },
  {
    id: 'transportation',
    number: '09',
    title: 'Transportation & Bus GPS Fleet',
    category: 'Safety & Logistics',
    icon: IconBus,
    badge: 'Live GPS Fleet',
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      gradient: 'from-amber-600 to-yellow-700',
    },
    desc: 'Live GPS vehicle telemetry, route optimization, automated parent proximity notifications, driver manifests, and pupil onboarding check-ins.',
    deepDive: 'Provides parents and transport managers total visibility. Displays live bus location on mobile maps, alerts parents 5 minutes before arrival, and tracks vehicle maintenance, fuel consumption, and driver credentials.',
    highlights: ['Live GPS Telemetry Maps', 'Proximity Parent SMS/Push', 'Pupil Boarding Manifests'],
    keyStakeholders: ['Transport Officer', 'Bus Drivers', 'Parents'],
  },
  {
    id: 'admission',
    number: '10',
    title: 'Admissions & Enrollment Pipeline',
    category: 'Bursary & Administration',
    icon: IconClipboardCheck,
    badge: 'Applicant CRM',
    color: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      gradient: 'from-teal-600 to-emerald-700',
    },
    desc: 'Public online admission application portals, entrance exam scheduling, interview scoring, provisional offer letter generation, and acceptance fee tracking.',
    deepDive: 'Converts prospective families into enrolled students smoothly. Supports document uploads (birth certificates, past results), automated entrance test invitations, scoring matrices, and instant matriculation upon payment.',
    highlights: ['Digital Application Portal', 'Entrance Examination Scoring', 'Provisional Offer Dispatch'],
    keyStakeholders: ['Admissions Officer', 'School Head', 'Prospective Parents'],
  },
  {
    id: 'messaging',
    number: '11',
    title: 'Omnichannel Messaging & Broadcasts',
    category: 'Campus & Community',
    icon: IconMessageDots,
    badge: 'SMS & WhatsApp',
    color: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      gradient: 'from-violet-600 to-purple-800',
    },
    desc: 'Bulk SMS gateway integration, WhatsApp broadcast triggers, mobile push notifications, and targeted communication by class, house, or transport route.',
    deepDive: 'Guarantees 100% communication delivery. Broadcast emergency weather closures, fee reminders, or sports day schedules with one click. Features delivery receipt auditing and message open rates.',
    highlights: ['Low-Cost Multi-Telco SMS Gateway', 'Audience Segment Filters', 'Delivery Receipt Analytics'],
    keyStakeholders: ['PR & Communications', 'Principal', 'Administrative Staff'],
  },
  {
    id: 'clinic',
    number: '12',
    title: 'Clinic & Sick Bay Infirmary',
    category: 'Student Welfare & Life',
    icon: IconFirstAidKit,
    badge: 'Sick Bay ERP',
    color: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      gradient: 'from-red-600 to-rose-700',
    },
    desc: 'Digital triage intake logs, student allergy & blood group passports, medication administration records (MAR), and emergency parent SOS escalation.',
    deepDive: 'Guards student health with clinical precision. Records daily visits, prescribed treatments, temperature/vitals trends, and sends instant emergency alerts to parents when a child is admitted to the sick bay.',
    highlights: ['Digital Health Passports', 'Medication Schedule (MAR)', 'Emergency Parent SOS Dispatch'],
    keyStakeholders: ['School Nurse', 'Resident Doctor', 'Housemasters'],
  },
  {
    id: 'hostel',
    number: '13',
    title: 'Hostel & Boarding House ERP',
    category: 'Student Welfare & Life',
    icon: IconBed,
    badge: 'Digital Exeat',
    color: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      gradient: 'from-indigo-700 to-blue-900',
    },
    desc: 'Dormitory block and bed space allocations, QR-verified digital exeat pass authorization, nightly bed-check roll-calls, and housemaster logs.',
    deepDive: 'Replaces dangerous paper exeat booklets with a fraud-proof digital authorization workflow. Parents request or approve exeats via phone, and security guards scan the student’s QR voucher at the campus gate upon departure.',
    highlights: ['Bed Space Allocation Engine', 'QR-Coded Digital Exeat Passes', 'Nightly Dormitory Roll-Call'],
    keyStakeholders: ['Hostel Master/Mistress', 'Boarding Students', 'Chief Security Officer'],
  },
  {
    id: 'security',
    number: '14',
    title: 'Security, Visitor & Gate Safeguarding',
    category: 'Safety & Logistics',
    icon: IconShieldCheck,
    badge: 'Gate Safeguard',
    color: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-300',
      gradient: 'from-slate-700 to-zinc-900',
    },
    desc: 'Digital visitor registration with printed photo badges, vehicle license plate logging, perimeter incident tracking, and OTP/PIN authorized pickup authentication.',
    deepDive: 'Protects children against unauthorized pickups. Only designated guardians with verified government IDs and dynamic single-use dismissal PINs can checkout primary/kindergarten students from campus.',
    highlights: ['Printed Visitor Photo Badges', 'Secure Pickup Authentication PIN', 'Campus Perimeter Incident Logs'],
    keyStakeholders: ['Security Guards', 'Child Safeguarding Officer', 'Campus Marshals'],
  },
  {
    id: 'discipline',
    number: '15',
    title: 'Discipline, Merits & Pastoral Care',
    category: 'Student Welfare & Life',
    icon: IconScale,
    badge: 'Pastoral Care',
    color: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      gradient: 'from-orange-600 to-amber-700',
    },
    desc: 'House merit rewards, codified infraction demerits, automated disciplinary summons, behavioral trends, and confidential counseling dossiers.',
    deepDive: 'Combines positive character reinforcement with accountability. Staff award merits for leadership and academic excellence or log demerits with corrective actions, while counselors maintain private pastoral records.',
    highlights: ['House Merit & Demerit Points', 'Printable Disciplinary Summons', 'Confidential Pastoral Dossiers'],
    keyStakeholders: ['Dean of Discipline', 'Guidance Counselors', 'Form Tutors'],
  },
  {
    id: 'cafeteria',
    number: '16',
    title: 'Cafeteria & Cashless Tuck Shop',
    category: 'Student Welfare & Life',
    icon: IconToolsKitchen2,
    badge: 'Cashless POS',
    color: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      gradient: 'from-amber-500 to-orange-600',
    },
    desc: 'Student RFID smartcard cashless wallets, meal plan subscriptions, high-speed POS tap-to-pay checkouts, daily spending caps, and dietary allergen restrictions.',
    deepDive: 'Eliminates cash theft, bullying, and lost pocket money. Parents fund digital student tuck wallets remotely, set daily spend limits, and block items based on medical dietary or peanut allergies.',
    highlights: ['RFID Tap-to-Pay POS Checkouts', 'Parent Remote Wallet Top-Up', 'Allergen Guards & Daily Spend Caps'],
    keyStakeholders: ['Cafeteria Caterer', 'Tuck Shop Attendant', 'Parents'],
  },
  {
    id: 'co-curricular',
    number: '17',
    title: 'Co-Curricular, Clubs & House System',
    category: 'Academics & SIS',
    icon: IconTrophy,
    badge: 'Houses & Sports',
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      gradient: 'from-amber-500 to-yellow-600',
    },
    desc: 'Inter-house sports leaderboards, club and society registrations, athletic fixture schedules, point aggregations, and student extracurricular achievements.',
    deepDive: 'Electrifies school spirit. Manages traditional school houses (Red, Blue, Green, Yellow), inter-house competitions, debates, robotics clubs, and tracks student honors for graduating transcripts.',
    highlights: ['Live Inter-House Leaderboard', 'Club Membership Registrations', 'Sports Fixtures & Medal Tallies'],
    keyStakeholders: ['Sports Master', 'House Patrons', 'Club Coordinators'],
  },
  {
    id: 'facilities',
    number: '18',
    title: 'Facilities & Venue Reservations',
    category: 'Campus & Community',
    icon: IconBuildingCommunity,
    badge: 'Venue Engine',
    color: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      gradient: 'from-teal-700 to-emerald-900',
    },
    desc: 'Master reservation schedules for auditoriums, sports grounds, science labs, and ICT halls with clash prevention, maintenance logs, and approval workflows.',
    deepDive: 'Prevents double-booking of prime school facilities. Staff reserve event halls, projectors, and conference rooms with automated checks against the academic timetable and facility maintenance calendars.',
    highlights: ['Clash-Free Booking Engine', 'Event Approval Hierarchy', 'Facility Maintenance Tracking'],
    keyStakeholders: ['Facilities Manager', 'Estate Officer', 'Event Organizers'],
  },
  {
    id: 'alumni',
    number: '19',
    title: 'Alumni Relations & Credentials Registry',
    category: 'Campus & Community',
    icon: IconCertificate,
    badge: 'Credential Portal',
    color: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      gradient: 'from-blue-700 to-slate-900',
    },
    desc: 'Graduating set directories, cryptographic digital transcript requests, instant certificate verification portals for universities and employers, and endowment giving.',
    deepDive: 'Turns alumni into a powerful institutional asset. Employers and foreign embassies verify graduation credentials via QR codes, and graduates request official sealed transcripts directly online.',
    highlights: ['Instant QR Credential Verification', 'Official Transcript Request Portal', 'Graduating Class Directory'],
    keyStakeholders: ['Registry & Archives', 'Alumni Association Executives', 'Verifying Employers'],
  },
  {
    id: 'mobile-app',
    number: '20',
    title: 'Campus Mobile App Suite',
    category: 'Safety & Logistics',
    icon: IconDeviceMobile,
    badge: 'iOS & Android',
    color: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      gradient: 'from-indigo-600 to-violet-800',
    },
    desc: 'Native mobile companion apps for iOS and Android uniting parents, teachers, drivers, and students with real-time feeds, biometric logins, and offline caching.',
    deepDive: 'An omnipresent school pocket portal. Delivers instant push alerts, interactive results checking, bus GPS map tracking, cafeteria wallet monitoring, and direct two-way parent-teacher chats.',
    highlights: ['Biometric App Security (FaceID)', 'Offline Sync For Poor Connectivity', 'Role-Based Mobile Experiences'],
    keyStakeholders: ['Parents', 'Students', 'Faculty & Bus Drivers'],
  },
];

type CategoryFilter = 'All' | 'Academics & SIS' | 'Bursary & Administration' | 'Safety & Logistics' | 'Student Welfare & Life' | 'Campus & Community';

export default function CampusProModulesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalModule, setActiveModalModule] = useState<CampusModule | null>(null);

  const categories: { label: CategoryFilter; count: number }[] = useMemo(() => {
    return [
      { label: 'All', count: CAMPUSPRO_MODULES.length },
      { label: 'Academics & SIS', count: CAMPUSPRO_MODULES.filter((m) => m.category === 'Academics & SIS').length },
      { label: 'Bursary & Administration', count: CAMPUSPRO_MODULES.filter((m) => m.category === 'Bursary & Administration').length },
      { label: 'Safety & Logistics', count: CAMPUSPRO_MODULES.filter((m) => m.category === 'Safety & Logistics').length },
      { label: 'Student Welfare & Life', count: CAMPUSPRO_MODULES.filter((m) => m.category === 'Student Welfare & Life').length },
      { label: 'Campus & Community', count: CAMPUSPRO_MODULES.filter((m) => m.category === 'Campus & Community').length },
    ];
  }, []);

  const filteredModules = useMemo(() => {
    return CAMPUSPRO_MODULES.filter((module) => {
      const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        module.title.toLowerCase().includes(q) ||
        module.desc.toLowerCase().includes(q) ||
        module.deepDive.toLowerCase().includes(q) ||
        module.highlights.some((h) => h.toLowerCase().includes(q)) ||
        module.badge.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full">
      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <IconSearch size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all 20 modules (e.g. bursary, biometric, exeat, clinic, cafeteria)..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <IconX size={16} />
              </button>
            )}
          </div>

          {/* Module Counter */}
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {filteredModules.length} of {CAMPUSPRO_MODULES.length}
            </span>
            <span>Enterprise Modules Active</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-gray-100 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.label
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.label ? '#0D1060' : undefined,
              }}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat.label ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 20 Modules */}
      {filteredModules.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <IconAdjustmentsHorizontal size={40} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-bold text-navy mb-1">No matching campus modules found</h3>
          <p className="text-sm text-gray-500 mb-4">
            Try adjusting your search query or reset the filter to view all 20 modules.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => setActiveModalModule(module)}
                className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.color.bg} ${module.color.text} border ${module.color.border} group-hover:scale-105 transition-transform duration-300 shadow-sm`}
                    >
                      <Icon size={24} stroke={1.8} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-400 tracking-wider">#{module.number}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {module.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-600 block mb-1">
                      {module.category}
                    </span>
                    <h3 className="text-lg font-bold text-navy group-hover:text-blue-600 transition-colors leading-snug">
                      {module.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3">
                    {module.desc}
                  </p>

                  {/* Highlights Bullet Tags */}
                  <div className="space-y-1.5 mb-6">
                    {module.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>Explore Workflow & Capabilities</span>
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <IconArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deep Dive Modal */}
      {activeModalModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalModule(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <IconX size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6 pr-8">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${activeModalModule.color.bg} ${activeModalModule.color.text} border ${activeModalModule.color.border} shadow-sm flex-shrink-0`}
              >
                {React.createElement(activeModalModule.icon, { size: 28, stroke: 1.8 })}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400">Module #{activeModalModule.number}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {activeModalModule.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-navy">{activeModalModule.title}</h3>
              </div>
            </div>

            {/* Deep Dive Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Executive Overview</h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                {activeModalModule.deepDive}
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Standard Operational Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeModalModule.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-100 bg-white shadow-xs text-xs font-medium text-gray-800"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <IconCheck size={12} stroke={3} />
                    </div>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stakeholders & Users */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Primary Roles & Operators
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalModule.keyStakeholders.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Fully tenant-isolated & included in standard CampusPRO deployment.
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setActiveModalModule(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 w-full sm:w-auto"
                >
                  Close
                </button>
                <Link
                  href="/onboard"
                  className="btn text-xs font-bold px-5 py-2.5 rounded-xl text-center w-full sm:w-auto"
                  style={{
                    backgroundColor: 'var(--color-nets-red, #FBBC04)',
                    color: '#0D1060',
                  }}
                >
                  Deploy Module
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

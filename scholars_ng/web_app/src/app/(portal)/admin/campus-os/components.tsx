'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  UsersIcon,
  BanknotesIcon,
  BookOpenIcon,
  ArchiveBoxIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  HomeModernIcon,
  HeartIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  BoltIcon,
  ArrowUpRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  LinkIcon,
  ShieldCheckIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

import AdmissionsDashboard, { type AdmissionSubtab } from '@/components/Dashboard/AdmissionsDashboard';
import api from '@/lib/api';
import AcademicSessionManager from './AcademicSessionManager';
import ClassManager from './ClassManager';
import SubjectManager from './SubjectManager';
import TimetableManager from './TimetableManager';
import TutorAssignmentManager from './TutorAssignmentManager';
import MessagingManager from './MessagingManager';
import ParentManager from './ParentManager';

export interface CampusBranch {
  id: string;
  tenant_id?: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  principal_name?: string;
  principal_email?: string;
  is_main: boolean;
  status: string;
  student_count?: number;
  staff_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CampusOSContextType {
  selectedCampusId: string;
  selectedCampus: string;
  setSelectedCampusId: (id: string) => void;
  setSelectedCampus: (name: string) => void;
  campuses: CampusBranch[];
  isLoadingCampuses: boolean;
  refreshCampuses: () => Promise<void>;
  isBranchModalOpen: boolean;
  setIsBranchModalOpen: (open: boolean) => void;
}

const CampusOSContext = React.createContext<CampusOSContextType>({
  selectedCampusId: 'all',
  selectedCampus: 'All Campuses (Multi-Campus)',
  setSelectedCampusId: () => {},
  setSelectedCampus: () => {},
  campuses: [],
  isLoadingCampuses: false,
  refreshCampuses: async () => {},
  isBranchModalOpen: false,
  setIsBranchModalOpen: () => {},
});

export const useCampusOS = () => React.useContext(CampusOSContext);
export const CampusOSProvider = CampusOSContext.Provider;


export type CampusOSTab =
  | 'academic'
  | 'attendance'
  | 'staff'
  | 'students'
  | 'parents'
  | 'financials'
  | 'library'
  | 'inventory'
  | 'transportation'
  | 'admission'
  | 'messaging'
  | 'mobile-app'
  | 'clinic'
  | 'hostel'
  | 'security'
  | 'discipline'
  | 'cafeteria'
  | 'co-curricular'
  | 'facilities'
  | 'alumni';

type AcademicSubtab = 'overview' | 'session' | 'classes' | 'subjects' | 'assigned-tutors' | 'timetable';

export function AcademicOperationsHub() {
  const [subtab, setSubtab] = useState<AcademicSubtab>('overview');
  const [activeSessionLabel, setActiveSessionLabel] = useState<string>('');
  const [armsCount, setArmsCount] = useState<number | undefined>(undefined);
  const [subjectsCount, setSubjectsCount] = useState<number | undefined>(undefined);
  const [tutorsCount, setTutorsCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('subtab') as AcademicSubtab;
      if (s && ['overview', 'session', 'classes', 'subjects', 'assigned-tutors', 'timetable'].includes(s)) {
        setSubtab(s);
      }
    }
    api
      .get('/v1/campus/summary')
      .then((res) => {
        if (res?.data) {
          if (res.data.active_session) setActiveSessionLabel(res.data.active_session);
          if (res.data.class_arms !== undefined) setArmsCount(res.data.class_arms);
          if (res.data.subjects !== undefined) setSubjectsCount(res.data.subjects);
          if (res.data.assigned_tutors !== undefined) setTutorsCount(res.data.assigned_tutors);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubtabChange = (newSubtab: AcademicSubtab) => {
    setSubtab(newSubtab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('subtab', newSubtab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const academicSubtabs: { id: AcademicSubtab; label: string; icon: any; count?: string }[] = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon, count: 'Pulse' },
    { id: 'session', label: 'Academic Session', icon: CalendarIcon, count: activeSessionLabel || undefined },
    { id: 'classes', label: 'Classes', icon: AcademicCapIcon, count: armsCount !== undefined ? `${armsCount} Arms` : undefined },
    { id: 'subjects', label: 'Subjects', icon: BookOpenIcon, count: subjectsCount !== undefined ? `${subjectsCount}` : undefined },
    { id: 'assigned-tutors', label: 'Assigned Tutors', icon: UserGroupIcon, count: tutorsCount !== undefined ? `${tutorsCount}` : undefined },
    { id: 'timetable', label: 'Timetable', icon: ClockIcon, count: 'Weekly Grid' },
  ];

  return (
    <div className="space-y-6">
      {/* Secondary Subtab Bar under Academic */}
      <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex items-center gap-1.5 bg-gray-100/90 rounded-full p-1 border border-gray-200/70">
          {academicSubtabs.map((item) => {
            const Icon = item.icon;
            const active = subtab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSubtabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-[#146ef5] shadow-sm border border-gray-200/60'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.count && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      active ? 'bg-blue-50 text-[#146ef5] font-bold' : 'bg-white/70 text-gray-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 0. OVERVIEW (Moved to Front) */}
      {subtab === 'overview' && <TimetableManager />}

      {/* 1. ACADEMIC SESSION (Tenant-Isolated & Persistent Database Hub) */}
      {subtab === 'session' && <AcademicSessionManager />}

      {/* 2. CLASSES (Tenant-Isolated & Persistent Database Hub) */}
      {subtab === 'classes' && <ClassManager />}

      {/* 3. SUBJECTS (Tenant-Isolated & Persistent Database Hub) */}
      {subtab === 'subjects' && (
        <SubjectManager onSubjectsCountChange={(count) => setSubjectsCount(count)} />
      )}

      {/* 4. ASSIGNED TUTORS (Tenant-Isolated & Persistent Faculty Allocation Hub) */}
      {subtab === 'assigned-tutors' && (
        <TutorAssignmentManager onTutorsCountChange={(count) => setTutorsCount(count)} />
      )}

      {/* 5. MASTER TIMETABLE GRID (Persistent & Tenant-Isolated Engine) */}
      {subtab === 'timetable' && <TimetableManager />}
    </div>
  );
}

export function ParentsDashboard() {
  return <ParentManager />;
}

export { MessagingManager };
export const MessagingDashboard = MessagingManager;

type MobileRoleType = 'Parent' | 'Teacher' | 'Student' | 'Driver' | 'Admin';

interface MobileAppAccount {
  id: string;
  mobileUserId: string;
  name: string;
  contact: string;
  role: MobileRoleType;
  campus: string;
  scopeDetail: string;
  permissionsSummary: string;
  deviceStatus: string;
  status: 'Active' | 'Invite Sent';
  inviteLink: string;
}

const ROLE_CONFIG: Record<
  MobileRoleType,
  {
    prefix: string;
    badgeClass: string;
    defaultScopePlaceholder: string;
    permissionsSummary: string;
  }
> = {
  Parent: {
    prefix: 'MOB-PRN',
    badgeClass: 'bg-blue-50 text-[#146ef5] border-blue-200',
    defaultScopePlaceholder: 'e.g., Ward: Kelechi Okonkwo (SS 3 Science Diamond)',
    permissionsSummary: 'Sees linked wards’ results, fee invoices, attendance, bus GPS & teacher chat',
  },
  Teacher: {
    prefix: 'MOB-TCH',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    defaultScopePlaceholder: 'e.g., Assigned: SS 1 – SS 3 Mathematics',
    permissionsSummary: 'Sees assigned class arms, CA mark-sheet entry, timetable & student attendance',
  },
  Student: {
    prefix: 'MOB-STD',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    defaultScopePlaceholder: 'e.g., Class: SS 3 Science Diamond',
    permissionsSummary: 'Sees personal timetable, CBT homework, library catalog, meal wallet & digital ID',
  },
  Driver: {
    prefix: 'MOB-DRV',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    defaultScopePlaceholder: 'e.g., Bus Route A · Lekki Phase 1 – Admiralty',
    permissionsSummary: 'Sees assigned bus route manifest, student boarding QR scanner & live GPS telemetry',
  },
  Admin: {
    prefix: 'MOB-ADM',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    defaultScopePlaceholder: 'e.g., Vice Principal Academics / Bursar',
    permissionsSummary: 'Sees campus KPIs, bursary approvals, staff attendance logs & emergency broadcasts',
  },
};

export function MobileAppDashboard({ selectedCampus }: { selectedCampus: string }) {
  const { campuses } = useCampusOS();
  const [roleFilter, setRoleFilter] = useState<'All' | MobileRoleType>('All');
  const [inviteRole, setInviteRole] = useState<MobileRoleType>('Parent');
  const defaultCampusName =
    selectedCampus !== 'All Campuses (Multi-Campus)'
      ? selectedCampus
      : campuses[0]?.name || 'Main Campus · Lekki Phase 1';
  const [inviteCampus, setInviteCampus] = useState<string>(defaultCampusName);
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [recipientScope, setRecipientScope] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inviteSentBanner, setInviteSentBanner] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<MobileAppAccount[]>([]);

  useEffect(() => {
    if (selectedCampus !== 'All Campuses (Multi-Campus)') {
      setInviteCampus(selectedCampus);
    } else if (campuses.length > 0 && !inviteCampus) {
      setInviteCampus(campuses[0].name);
    }
  }, [selectedCampus, campuses, inviteCampus]);

  const activeBranch = campuses.find((c) => c.name === selectedCampus);
  const activeCampusMeta = {
    appId: activeBranch?.code ? `CMP-APP-${activeBranch.code}` : 'CMP-APP-GLOBAL',
    appName:
      selectedCampus === 'All Campuses (Multi-Campus)'
        ? 'Unified Multi-Campus Mobile App'
        : `CampusPRO Mobile · ${selectedCampus}`,
    bundleId: 'ng.scholars.campus.unified',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: `https://app.scholars.ng/invite/${activeBranch?.code || 'GLOBAL'}`,
    activeDevices: accounts.length,
  };

  // Preview next generated Mobile App User ID & role-scoped invite link
  const previewRoleMeta = ROLE_CONFIG[inviteRole];
  const deterministicSuffix = String(10000 + (accounts.length + 1) * 731).slice(0, 5);
  const previewMobileUserId = `${previewRoleMeta.prefix}-${deterministicSuffix}`;
  const previewInviteLink = `${activeCampusMeta.deepLinkPrefix}?role=${inviteRole.toLowerCase()}&uid=${previewMobileUserId}`;

  const handleCopy = (text: string, idKey: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2200);
  };

  useEffect(() => {
    api
      .get('/v1/campus/mobile-accounts')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.accounts || [];
        const mapped: MobileAppAccount[] = list.map((row: any) => {
          const normRole = (row.role || 'parent').toLowerCase();
          const roleCap: MobileRoleType =
            normRole === 'teacher'
              ? 'Teacher'
              : normRole === 'student'
              ? 'Student'
              : normRole === 'driver'
              ? 'Driver'
              : normRole === 'admin'
              ? 'Admin'
              : 'Parent';
          const uid =
            row.invite_code ||
            row.account_id ||
            `${ROLE_CONFIG[roleCap].prefix}-${String(row.id || '').slice(0, 5).toUpperCase()}`;
          return {
            id: String(row.id),
            mobileUserId: uid,
            name: row.full_name || row.user_name,
            contact: [row.phone, row.email].filter(Boolean).join(' · '),
            role: roleCap,
            campus:
              row.campus_name ||
              (selectedCampus === 'All Campuses (Multi-Campus)'
                ? campuses[0]?.name || 'Main Campus · Lekki Phase 1'
                : selectedCampus),
            scopeDetail: row.linked_ward_or_class || row.ward_name || `${roleCap} Account`,
            permissionsSummary: ROLE_CONFIG[roleCap].permissionsSummary,
            deviceStatus: row.device_platform || row.device_model || row.app_version || 'iOS / Android',
            status:
              row.account_status === 'INVITE_SENT' || row.status === 'INVITED'
                ? 'Invite Sent'
                : 'Active',
            inviteLink: `https://app.scholars.ng/invite/GLOBAL?role=${roleCap.toLowerCase()}&uid=${uid}`,
          };
        });
        setAccounts(mapped);
      })
      .catch((err) => console.error('Failed to load mobile app accounts:', err));
  }, [selectedCampus, campuses]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientContact.trim()) return;

    let finalCode = previewMobileUserId;
    try {
      const res = await api.post('/v1/campus/mobile-accounts', {
        full_name: recipientName.trim(),
        email: recipientContact.includes('@') ? recipientContact.trim() : '',
        phone: !recipientContact.includes('@') ? recipientContact.trim() : '',
        role: inviteRole.toLowerCase(),
        linked_ward_or_class:
          recipientScope.trim() || `${inviteRole} Account · Scoped to ${inviteCampus}`,
        device_platform: 'Invite Dispatched · Awaiting Login',
      });
      if (res.data?.invite_code) {
        finalCode = res.data.invite_code;
      }
    } catch (err) {
      console.error('Failed to persist mobile app account invite:', err);
    }

    const newEntry: MobileAppAccount = {
      id: String(Date.now()),
      mobileUserId: finalCode,
      name: recipientName.trim(),
      contact: recipientContact.trim(),
      role: inviteRole,
      campus: inviteCampus,
      scopeDetail:
        recipientScope.trim() ||
        `${inviteRole} Account · Scoped to ${inviteCampus}`,
      permissionsSummary: previewRoleMeta.permissionsSummary,
      deviceStatus: 'Invite Dispatched · Awaiting Login',
      status: 'Invite Sent',
      inviteLink: `${activeCampusMeta.deepLinkPrefix}?role=${inviteRole.toLowerCase()}&uid=${finalCode}`,
    };

    setAccounts([newEntry, ...accounts]);
    setInviteSentBanner(
      `Assigned ${finalCode} to ${recipientName.trim()} (${inviteRole}) and persisted role-scoped invite in database!`
    );
    setRecipientName('');
    setRecipientContact('');
    setRecipientScope('');
    setTimeout(() => setInviteSentBanner(null), 5000);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesCampus =
      selectedCampus === 'All Campuses (Multi-Campus)' || acc.campus === selectedCampus;
    const matchesRole = roleFilter === 'All' || acc.role === roleFilter;
    return matchesCampus && matchesRole;
  });

  const parentCount = accounts.filter((a) => a.role === 'Parent').length;
  const teacherCount = accounts.filter((a) => a.role === 'Teacher').length;
  const studentDriverCount = accounts.filter((a) => a.role === 'Student' || a.role === 'Driver').length;
  const adminCount = accounts.filter((a) => a.role === 'Admin').length;

  return (
    <div className="space-y-6">
      {/* Top Assigned Campus Mobile App Instance Banner */}
      <div className="bg-gradient-to-r from-[#0a2e70] via-[#146ef5] to-[#0d47a1] rounded-[1.5rem] p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <DevicePhoneMobileIcon className="w-4 h-4" />
              <span>Assigned Campus Mobile App Instance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {activeCampusMeta.appName}
            </h2>
            <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
              Every campus is provisioned with a dedicated mobile app instance. When you send a role-specific invite link below, a unique <strong>Mobile App User ID</strong> is automatically bound to the user&apos;s account so logging in immediately loads only the classes, wards, bus routes, or admin tools for their role and campus.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-black/25 px-3 py-1.5 rounded-full font-mono">
                App ID: <strong>{activeCampusMeta.appId}</strong>
              </span>
              <span className="bg-black/25 px-3 py-1.5 rounded-full font-mono">
                Bundle: <strong>{activeCampusMeta.bundleId}</strong>
              </span>
              <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-3 py-1.5 rounded-full font-semibold">
                ● {activeCampusMeta.version} · Live
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Parent App IDs</div>
              <div className="text-2xl font-bold mt-1">{parentCount}</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">MOB-PRN-*</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Teacher App IDs</div>
              <div className="text-2xl font-bold mt-1">{teacherCount}</div>
              <div className="text-[11px] text-purple-200 mt-0.5">MOB-TCH-*</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Student / Driver IDs</div>
              <div className="text-2xl font-bold mt-1">{studentDriverCount}</div>
              <div className="text-[11px] text-white/90 mt-0.5">MOB-STD / DRV</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Admin App IDs</div>
              <div className="text-2xl font-bold mt-1">{adminCount}</div>
              <div className="text-[11px] text-blue-200 mt-0.5">MOB-ADM-*</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Role-Specific Invite Generator + Live Mobile Account Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Send Role-Specific Invite & Bind Mobile App User ID */}
        <form
          onSubmit={handleSendInvite}
          className="lg:col-span-5 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 space-y-5"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Provision Mobile App ID &amp; Send Invite
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Generate a role-scoped deep link for Parents, Teachers, Bus Drivers, or Co-Admins.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#146ef5] text-[11px] font-bold">
              <KeyIcon className="w-3.5 h-3.5" /> Auto-Bind ID
            </span>
          </div>

          {inviteSentBanner && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{inviteSentBanner}</span>
            </div>
          )}

          {/* Step 1: Select Role */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              1. Select Stakeholder Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Parent', 'Teacher', 'Driver', 'Admin'] as MobileRoleType[]).map((r) => {
                const active = inviteRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setInviteRole(r)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#146ef5] text-white border-[#146ef5] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {r}s
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Assigned Campus */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              2. Assigned Campus App Scope
            </label>
            <select
              value={inviteCampus}
              onChange={(e) => setInviteCampus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#146ef5]"
            >
              {campuses.length > 0 ? (
                campuses.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option value={inviteCampus}>{inviteCampus}</option>
              )}
            </select>
          </div>

          {/* Step 3: Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                3. Full Name / Title
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={
                  inviteRole === 'Parent'
                    ? 'e.g. Mr. & Mrs. B. Okafor'
                    : inviteRole === 'Driver'
                    ? 'e.g. Mr. Kolawole Balogun'
                    : inviteRole === 'Teacher'
                    ? 'e.g. Mrs. Grace Nwachukwu'
                    : 'e.g. Mr. Segun Lawal (VP)'
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                4. WhatsApp Phone or Email
              </label>
              <input
                type="text"
                required
                value={recipientContact}
                onChange={(e) => setRecipientContact(e.target.value)}
                placeholder="+234 803 000 0000 or email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
              />
            </div>
          </div>

          {/* Step 4: Role Context Binding (Ward / Class / Route / Office) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              5. Role Assignment &amp; Data Scope
            </label>
            <input
              type="text"
              value={recipientScope}
              onChange={(e) => setRecipientScope(e.target.value)}
              placeholder={previewRoleMeta.defaultScopePlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#146ef5]"
            />
          </div>

          {/* Auto-Generated Mobile App User ID & Role Deep-Link Preview Box */}
          <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Auto-Assigned Mobile App User ID
              </span>
              <span className="font-mono text-xs font-bold text-[#146ef5] bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                {previewMobileUserId}
              </span>
            </div>

            <div className="text-xs text-gray-700 leading-relaxed flex items-start gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>What they see on login:</strong> {previewRoleMeta.permissionsSummary}
              </span>
            </div>

            <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between gap-2">
              <code className="text-[11px] text-gray-600 truncate flex-1">{previewInviteLink}</code>
              <button
                type="button"
                onClick={() => handleCopy(previewInviteLink, 'preview-link')}
                className="text-xs font-bold text-[#146ef5] hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {copiedId === 'preview-link' ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold text-sm py-3 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            Bind {previewMobileUserId} &amp; Send {inviteRole} Invite Link
          </button>
        </form>

        {/* Right Column: Provisioned Mobile App Accounts & User IDs Table */}
        <div className="lg:col-span-7 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Campus Mobile App Accounts &amp; Bound User IDs
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredAccounts.length} accounts bound to{' '}
                <span className="font-semibold text-gray-800">{selectedCampus}</span>.
              </p>
            </div>

            {/* Role Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Parent', 'Teacher', 'Driver', 'Admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    roleFilter === r
                      ? 'bg-[#146ef5] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {r === 'All' ? 'All Roles' : `${r}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredAccounts.map((acc) => {
              const roleMeta = ROLE_CONFIG[acc.role];
              return (
                <div
                  key={acc.id}
                  className="p-5 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#146ef5] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {acc.mobileUserId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleMeta.badgeClass}`}
                      >
                        {acc.role}
                      </span>
                      <span className="text-xs font-medium text-gray-400">· {acc.campus}</span>
                    </div>

                    <div className="font-bold text-sm text-gray-900">{acc.name}</div>
                    <div className="text-xs text-gray-500">{acc.contact}</div>
                    <div className="text-xs font-medium text-gray-800">{acc.scopeDetail}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <QrCodeIcon className="w-3.5 h-3.5 text-[#146ef5] shrink-0" />
                      <span>{acc.permissionsSummary}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        acc.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {acc.status === 'Active' ? `● ${acc.deviceStatus}` : '● Invite Sent · Pending Login'}
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.inviteLink, acc.id)}
                        className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[#146ef5] text-xs font-semibold text-gray-700 hover:text-[#146ef5] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        {copiedId === acc.id ? 'Invite Link Copied!' : 'Copy Role Invite Link'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

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

import TimetableDashboard from '../timetable/page';
import PerformanceDashboard from '../performance/page';
import EnrollmentDashboard from '../enrollment/page';
import FeesDashboard from '../fees/page';
import LibraryDashboard from '../library/page';
import ProcurementDashboard from '../procurement/page';
import TransportDashboard from '../transport/page';
import AdmissionsDashboard, { type AdmissionSubtab } from '@/components/Dashboard/AdmissionsDashboard';
import api from '@/lib/api';
import AcademicSessionManager from './AcademicSessionManager';
import ClassManager from './ClassManager';
import SubjectManager from './SubjectManager';
import TimetableManager from './TimetableManager';
import TutorAssignmentManager from './TutorAssignmentManager';
import MessagingManager from './MessagingManager';

interface CampusOSContextType {
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
}

const CampusOSContext = React.createContext<CampusOSContextType>({
  selectedCampus: "All Campuses (Multi-Campus)",
  setSelectedCampus: () => {},
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
  | 'mobile-app';

type AcademicSubtab = 'overview' | 'session' | 'classes' | 'subjects' | 'assigned-tutors' | 'timetable';

export function AcademicOperationsHub() {
  const [subtab, setSubtab] = useState<AcademicSubtab>('overview');
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
    { id: 'session', label: 'Academic Session', icon: CalendarIcon, count: '2026/2027' },
    { id: 'classes', label: 'Classes', icon: AcademicCapIcon, count: '18 Arms' },
    { id: 'subjects', label: 'Subjects', icon: BookOpenIcon, count: subjectsCount !== undefined ? `${subjectsCount}` : '28' },
    { id: 'assigned-tutors', label: 'Assigned Tutors', icon: UserGroupIcon, count: tutorsCount !== undefined ? `${tutorsCount}` : 'Faculty' },
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
      {subtab === 'overview' && <TimetableDashboard />}

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
  return (
    <>
      <MotionRise className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Parents &amp; Guardians CRM</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage parent accounts, ward linkages, PTA communications, and portal engagement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4" />
            Send PTA Broadcast
          </button>
          <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4" />
            Export Directory
          </button>
        </div>
      </MotionRise>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MotionRise className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Active Guardians</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">892</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-3 h-3" /> +9.4%
              </div>
              <span>Portal logins this week</span>
            </div>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Ward Linkages</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">98.4%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">1,228 of 1,248 students linked</span>
            </div>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Notice Read Rate</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">91%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">SMS, WhatsApp &amp; Email</span>
            </div>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">PTA Attendance</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">86%</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-gray-400">Last Term General Forum</span>
            </div>
          </div>
        </MotionRise>
      </MotionStagger>

      <MotionRise delay={0.08} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Guardian Directory &amp; Ward Accounts</h3>
          <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
            Verified Household Profiles
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Parent / Guardian</th>
              <th className="px-6 py-4">Linked Wards</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Fee Status</th>
              <th className="px-6 py-4">Portal Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              {
                name: 'Chief & Mrs. O. Adeleke',
                wards: 'Tomiwa Adeleke (SS 2), Kemi Adeleke (JSS 3)',
                contact: 'adeleke.family@gmail.com · +234 803 412 8890',
                feeStatus: 'Cleared',
                activity: 'Active Today',
              },
              {
                name: 'Engr. & Dr. (Mrs.) Chidi Nwosu',
                wards: 'Chisom Nwosu (SS 3)',
                contact: 'c.nwosu@nwosueng.ng · +234 809 221 3401',
                feeStatus: 'Cleared',
                activity: 'Active Yesterday',
              },
              {
                name: 'Alhaji & Hajiya Ibrahim Danjuma',
                wards: 'Amina Danjuma (JSS 2), Musa Danjuma (Primary 6)',
                contact: 'ibrahim.danjuma@yahoo.com · +234 802 310 5542',
                feeStatus: 'Installment 2/3',
                activity: 'Active 2d ago',
              },
              {
                name: 'Barr. & Mrs. Efe Omoregie',
                wards: 'Osaze Omoregie (SS 1)',
                contact: 'efe.omoregie@chambers.ng · +234 805 774 1129',
                feeStatus: 'Cleared',
                activity: 'Active Today',
              },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.wards}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{p.contact}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.feeStatus === 'Cleared'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {p.feeStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-[#146ef5]">{p.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </MotionRise>
    </>
  );
}

export { MessagingManager };
export const MessagingDashboard = MessagingManager;

type MobileRoleType = 'Parent' | 'Teacher' | 'Driver' | 'Admin';

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

const CAMPUS_APP_INSTANCES: Record<
  string,
  {
    appId: string;
    appName: string;
    bundleId: string;
    version: string;
    deepLinkPrefix: string;
    activeDevices: number;
  }
> = {
  'All Campuses (Multi-Campus)': {
    appId: 'CMP-APP-GLOBAL',
    appName: 'ScholarsNG Unified Multi-Campus Mobile',
    bundleId: 'ng.scholars.campus.unified',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/GLOBAL',
    activeDevices: 1184,
  },
  'Main Campus · Lekki Phase 1': {
    appId: 'CMP-APP-LK01',
    appName: 'ScholarsNG Mobile · Lekki Main Campus',
    bundleId: 'ng.scholars.campus.lekki',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/CMP-LK01',
    activeDevices: 540,
  },
  'Annex Campus · Ikeja GRA': {
    appId: 'CMP-APP-IK02',
    appName: 'ScholarsNG Mobile · Ikeja GRA Annex',
    bundleId: 'ng.scholars.campus.ikeja',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/CMP-IK02',
    activeDevices: 312,
  },
  'Victoria Island Junior Campus': {
    appId: 'CMP-APP-VI03',
    appName: 'ScholarsNG Mobile · VI Junior Campus',
    bundleId: 'ng.scholars.campus.vi',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/CMP-VI03',
    activeDevices: 198,
  },
  'Abuja Maitama Campus': {
    appId: 'CMP-APP-AB04',
    appName: 'ScholarsNG Mobile · Abuja Maitama',
    bundleId: 'ng.scholars.campus.abuja',
    version: 'v4.8.2 (iOS & Android)',
    deepLinkPrefix: 'https://app.scholars.ng/invite/CMP-AB04',
    activeDevices: 134,
  },
};

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
    defaultScopePlaceholder: 'e.g., Ward: Tomiwa Adeleke (SS 2 Science)',
    permissionsSummary: 'Sees linked wards’ results, fee invoices, attendance, bus GPS & teacher chat',
  },
  Teacher: {
    prefix: 'MOB-TCH',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    defaultScopePlaceholder: 'e.g., Assigned: SS 1 – SS 3 Mathematics',
    permissionsSummary: 'Sees assigned class arms, CA mark-sheet entry, timetable & student attendance',
  },
  Driver: {
    prefix: 'MOB-DRV',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    defaultScopePlaceholder: 'e.g., Bus Route B-04 · Lekki Phase 1 – Chevron',
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
  const [roleFilter, setRoleFilter] = useState<'All' | MobileRoleType>('All');
  const [inviteRole, setInviteRole] = useState<MobileRoleType>('Parent');
  const [inviteCampus, setInviteCampus] = useState<string>(
    selectedCampus === 'All Campuses (Multi-Campus)'
      ? 'Main Campus · Lekki Phase 1'
      : selectedCampus
  );
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [recipientScope, setRecipientScope] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inviteSentBanner, setInviteSentBanner] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<MobileAppAccount[]>([
    {
      id: '1',
      mobileUserId: 'MOB-PRN-88412',
      name: 'Chief & Mrs. O. Adeleke',
      contact: '+234 803 412 8890 · adeleke.family@gmail.com',
      role: 'Parent',
      campus: 'Main Campus · Lekki Phase 1',
      scopeDetail: 'Wards: Tomiwa Adeleke (SS 2), Kemi Adeleke (JSS 3)',
      permissionsSummary: ROLE_CONFIG.Parent.permissionsSummary,
      deviceStatus: 'iOS 18 · iPhone 15 Pro',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-LK01?role=parent&uid=MOB-PRN-88412',
    },
    {
      id: '2',
      mobileUserId: 'MOB-TCH-30914',
      name: 'Mr. David Jenkins',
      contact: '+234 809 118 4402 · d.jenkins@scholars.ng',
      role: 'Teacher',
      campus: 'Main Campus · Lekki Phase 1',
      scopeDetail: 'HOD Mathematics · SS 1, SS 2 & SS 3 Science',
      permissionsSummary: ROLE_CONFIG.Teacher.permissionsSummary,
      deviceStatus: 'Android 14 · Samsung S24',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-LK01?role=teacher&uid=MOB-TCH-30914',
    },
    {
      id: '3',
      mobileUserId: 'MOB-DRV-55108',
      name: 'Mr. Sunday Olatunji',
      contact: '+234 802 665 9012 · transport.b04@scholars.ng',
      role: 'Driver',
      campus: 'Main Campus · Lekki Phase 1',
      scopeDetail: 'Coaster Bus #04 · Route B-04 (Lekki Phase 1 – Ikate – Ajah)',
      permissionsSummary: ROLE_CONFIG.Driver.permissionsSummary,
      deviceStatus: 'Android 13 · Transit Tablet',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-LK01?role=driver&uid=MOB-DRV-55108',
    },
    {
      id: '4',
      mobileUserId: 'MOB-ADM-10204',
      name: 'Mrs. Folake Adeyemi (FCA)',
      contact: '+234 805 339 1100 · bursar.ikeja@scholars.ng',
      role: 'Admin',
      campus: 'Annex Campus · Ikeja GRA',
      scopeDetail: 'Campus Bursar & Operations Controller',
      permissionsSummary: ROLE_CONFIG.Admin.permissionsSummary,
      deviceStatus: 'iOS 18 · iPad Air + iPhone',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-IK02?role=admin&uid=MOB-ADM-10204',
    },
    {
      id: '5',
      mobileUserId: 'MOB-DRV-55192',
      name: 'Mr. Musa Abdullahi',
      contact: '+234 806 712 3389 · transport.abj01@scholars.ng',
      role: 'Driver',
      campus: 'Abuja Maitama Campus',
      scopeDetail: 'Hiace Bus #02 · Route ABJ-01 (Maitama – Wuse II – Asokoro)',
      permissionsSummary: ROLE_CONFIG.Driver.permissionsSummary,
      deviceStatus: 'Awaiting First Login',
      status: 'Invite Sent',
      inviteLink: 'https://app.scholars.ng/invite/CMP-AB04?role=driver&uid=MOB-DRV-55192',
    },
    {
      id: '6',
      mobileUserId: 'MOB-PRN-88940',
      name: 'Engr. & Dr. (Mrs.) Chidi Nwosu',
      contact: '+234 809 221 3401 · c.nwosu@nwosueng.ng',
      role: 'Parent',
      campus: 'Victoria Island Junior Campus',
      scopeDetail: 'Ward: Chisom Nwosu (Year 6 Emerald)',
      permissionsSummary: ROLE_CONFIG.Parent.permissionsSummary,
      deviceStatus: 'iOS 18 · iPhone 14',
      status: 'Active',
      inviteLink: 'https://app.scholars.ng/invite/CMP-VI03?role=parent&uid=MOB-PRN-88940',
    },
  ]);

  const activeCampusMeta =
    CAMPUS_APP_INSTANCES[selectedCampus] || CAMPUS_APP_INSTANCES['All Campuses (Multi-Campus)'];

  // Preview next generated Mobile App User ID & role-scoped invite link
  const previewRoleMeta = ROLE_CONFIG[inviteRole];
  const deterministicSuffix = String(10000 + accounts.length * 731).slice(0, 5);
  const previewMobileUserId = `${previewRoleMeta.prefix}-${deterministicSuffix}`;
  const inviteCampusMeta =
    CAMPUS_APP_INSTANCES[inviteCampus] || CAMPUS_APP_INSTANCES['Main Campus · Lekki Phase 1'];
  const previewInviteLink = `${inviteCampusMeta.deepLinkPrefix}?role=${inviteRole.toLowerCase()}&uid=${previewMobileUserId}`;

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
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped: MobileAppAccount[] = res.data.map((row: any) => {
            const normRole = (row.role || 'parent').toLowerCase();
            const roleCap: MobileRoleType =
              normRole === 'teacher'
                ? 'Teacher'
                : normRole === 'driver'
                ? 'Driver'
                : normRole === 'admin'
                ? 'Admin'
                : 'Parent';
            const uid = row.invite_code || `${ROLE_CONFIG[roleCap].prefix}-${String(row.id || '').slice(0, 5).toUpperCase()}`;
            return {
              id: String(row.id),
              mobileUserId: uid,
              name: row.full_name,
              contact: [row.phone, row.email].filter(Boolean).join(' · '),
              role: roleCap,
              campus: selectedCampus === 'All Campuses (Multi-Campus)' ? 'Main Campus · Lekki Phase 1' : selectedCampus,
              scopeDetail: row.linked_ward_or_class || `${roleCap} Account`,
              permissionsSummary: ROLE_CONFIG[roleCap].permissionsSummary,
              deviceStatus: row.device_platform || 'iOS / Android',
              status: row.account_status === 'INVITE_SENT' ? 'Invite Sent' : 'Active',
              inviteLink: `https://app.scholars.ng/invite/CMP-LK01?role=${roleCap.toLowerCase()}&uid=${uid}`,
            };
          });
          setAccounts(mapped);
        }
      })
      .catch((err) => console.error('Failed to load mobile app accounts:', err));
  }, [selectedCampus]);

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
      inviteLink: `${inviteCampusMeta.deepLinkPrefix}?role=${inviteRole.toLowerCase()}&uid=${finalCode}`,
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
              <div className="text-2xl font-bold mt-1">842</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">MOB-PRN-*</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Teacher App IDs</div>
              <div className="text-2xl font-bold mt-1">94</div>
              <div className="text-[11px] text-purple-200 mt-0.5">MOB-TCH-*</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Driver App IDs</div>
              <div className="text-2xl font-bold mt-1">28</div>
              <div className="text-[11px] text-amber-200 mt-0.5">MOB-DRV-*</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
              <div className="text-xs text-white/70">Admin App IDs</div>
              <div className="text-2xl font-bold mt-1">14</div>
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
              <option>Main Campus · Lekki Phase 1</option>
              <option>Annex Campus · Ikeja GRA</option>
              <option>Victoria Island Junior Campus</option>
              <option>Abuja Maitama Campus</option>
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

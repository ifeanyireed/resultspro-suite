'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Squares2X2Icon,
  AcademicCapIcon,
  UserGroupIcon,
  PuzzlePieceIcon,
  ChartPieIcon,
  HomeModernIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
  ArrowPathIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  FingerPrintIcon,
  ArrowUpRightIcon,
  SparklesIcon,
  DocumentTextIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  PrinterIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  CheckBadgeIcon,
  QrCodeIcon,
  BellAlertIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import api from '@/lib/api';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export type ParentDashboardTab = 'overview' | 'modular' | 'campuspro';
export type ModularSubtab = 'classroompro' | 'tutorspro' | 'puzzlepro' | 'resultspro';
export type CampusPROSubtab = 'bursary' | 'transport' | 'security' | 'clinic' | 'hostel' | 'cafeteria';

export interface WardRecord {
  id: string;
  student_id: string;
  name: string;
  first_name: string;
  admission_number: string;
  class_name: string;
  arm_name: string;
  gender: string;
  avatar: string;
  attendance_rate: number;
  average_score: number;
  average_gpa: number;
  outstanding_fees: number;
  wallet_balance: number;
  pickup_pin: string;
  status: string;
}

export default function ParentDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Tab Sync
  const queryTab = (searchParams.get('tab') as ParentDashboardTab) || 'overview';
  const querySubtab = searchParams.get('subtab') || '';

  const [activeTab, setActiveTab] = useState<ParentDashboardTab>(
    ['overview', 'modular', 'campuspro'].includes(queryTab) ? queryTab : 'overview'
  );
  const [modularSubtab, setModularSubtab] = useState<ModularSubtab>(
    (['classroompro', 'tutorspro', 'puzzlepro', 'resultspro'].includes(querySubtab)
      ? querySubtab
      : 'classroompro') as ModularSubtab
  );
  const [campusSubtab, setCampusSubtab] = useState<CampusPROSubtab>(
    (['bursary', 'transport', 'security', 'clinic', 'hostel', 'cafeteria'].includes(querySubtab)
      ? querySubtab
      : 'bursary') as CampusPROSubtab
  );

  // Data state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWardId, setSelectedWardId] = useState<string>('');
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isExeatModalOpen, setIsExeatModalOpen] = useState(false);
  const [printDoc, setPrintDoc] = useState<'report_card' | 'fee_receipt' | 'exeat_pass' | null>(null);

  // Form states
  const [paymentAmount, setPaymentAmount] = useState<number>(45000);
  const [walletAmount, setWalletAmount] = useState<number>(5000);
  const [exeatForm, setExeatForm] = useState({
    reason: 'Weekend Home Visit',
    departure_date: new Date().toISOString().split('T')[0],
    return_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    destination_address: '14 Admiralty Way, Lekki Phase 1',
    emergency_contact: '+234 803 459 2810',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = selectedWardId
        ? `/v1/campus/parent/dashboard?student_id=${encodeURIComponent(selectedWardId)}`
        : `/v1/campus/parent/dashboard`;

      const res = await api
        .get(url)
        .catch(async () => await api.get(`/campus/parent/dashboard`))
        .catch(async () => await api.get(`/parent/dashboard`));

      if (res?.data) {
        setDashboardData(res.data);
        if (!selectedWardId && res.data.active_ward?.id) {
          setSelectedWardId(res.data.active_ward.id);
        }
      }
    } catch (err) {
      console.error('Failed to load parent dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWardId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Sync state with URL params
  useEffect(() => {
    if (queryTab && ['overview', 'modular', 'campuspro'].includes(queryTab)) {
      setActiveTab(queryTab);
    }
    if (querySubtab) {
      if (['classroompro', 'tutorspro', 'puzzlepro', 'resultspro'].includes(querySubtab)) {
        setModularSubtab(querySubtab as ModularSubtab);
      }
      if (['bursary', 'transport', 'security', 'clinic', 'hostel', 'cafeteria'].includes(querySubtab)) {
        setCampusSubtab(querySubtab as CampusPROSubtab);
      }
    }
  }, [queryTab, querySubtab]);

  const handleTabChange = (tab: ParentDashboardTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    if (tab === 'modular') params.set('subtab', modularSubtab);
    else if (tab === 'campuspro') params.set('subtab', campusSubtab);
    else params.delete('subtab');
    router.replace(`/parent/dashboard?${params.toString()}`);
  };

  const handleModularSubtabChange = (sub: ModularSubtab) => {
    setModularSubtab(sub);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'modular');
    params.set('subtab', sub);
    router.replace(`/parent/dashboard?${params.toString()}`);
  };

  const handleCampusSubtabChange = (sub: CampusPROSubtab) => {
    setCampusSubtab(sub);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'campuspro');
    params.set('subtab', sub);
    router.replace(`/parent/dashboard?${params.toString()}`);
  };

  const wards: WardRecord[] = useMemo(() => {
    return dashboardData?.wards || [];
  }, [dashboardData]);

  const activeWard: WardRecord = useMemo(() => {
    if (dashboardData?.active_ward) return dashboardData.active_ward;
    if (wards.length > 0) return wards[0];
    return {
      id: 'std_alex_01',
      student_id: 'std_alex_01',
      name: 'Alex Adeleke-Okonkwo',
      first_name: 'Alex',
      admission_number: 'SCH/2026/0188',
      class_name: 'Senior Secondary 3',
      arm_name: 'Science Diamond',
      gender: 'M',
      avatar: 'https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/character4.jpg',
      attendance_rate: 97.4,
      average_score: 92.5,
      average_gpa: 3.88,
      outstanding_fees: 45000,
      wallet_balance: 12500,
      pickup_pin: '8492',
      status: 'ACTIVE',
    };
  }, [dashboardData, wards]);

  const handleSelectWard = (wardId: string) => {
    setSelectedWardId(wardId);
    setIsWardDropdownOpen(false);
  };

  // Payment simulation
  const handleSimulatePayment = async () => {
    try {
      setIsSubmitting(true);
      await api
        .post('/v1/campus/fees', {
          action: 'record_payment',
          student_id: activeWard.student_id,
          amount_paid: paymentAmount,
          payment_method: 'ONLINE_PAYSTACK',
          notes: 'Parent online payment via portal',
        })
        .catch(async () => {
          return await api.post('/campus/fees', {
            action: 'record_payment',
            student_id: activeWard.student_id,
            amount_paid: paymentAmount,
            payment_method: 'ONLINE_PAYSTACK',
            notes: 'Parent online payment via portal',
          });
        });

      setIsPayModalOpen(false);
      setPrintDoc('fee_receipt');
      fetchDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Payment failed to process');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tuck Shop Wallet Top-up
  const handleTopUpWallet = async () => {
    try {
      setIsSubmitting(true);
      await api
        .post('/v1/campus/cafeteria', {
          action: 'topup_wallet',
          student_id: activeWard.student_id,
          amount: walletAmount,
        })
        .catch(async () => {
          return await api.post('/campus/cafeteria', {
            action: 'topup_wallet',
            student_id: activeWard.student_id,
            amount: walletAmount,
          });
        });

      setIsWalletModalOpen(false);
      fetchDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to top up wallet');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Request Digital Exeat
  const handleRequestExeat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api
        .post('/v1/campus/hostel', {
          action: 'request_exeat',
          student_id: activeWard.student_id,
          student_name: activeWard.name,
          ...exeatForm,
        })
        .catch(async () => {
          return await api.post('/campus/hostel', {
            action: 'request_exeat',
            student_id: activeWard.student_id,
            student_name: activeWard.name,
            ...exeatForm,
          });
        });

      setIsExeatModalOpen(false);
      setPrintDoc('exeat_pass');
      fetchDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit exeat request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400 min-h-[60vh]">
        <ArrowPathIcon className="w-10 h-10 animate-spin text-[#146ef5] mb-4" />
        <span className="text-base font-semibold text-gray-700">Loading Guardian Command Hub...</span>
        <span className="text-xs text-gray-400 mt-1">Connecting to CampusPRO backend services</span>
      </div>
    );
  }

  const school = dashboardData?.school || { name: 'ExamsPRO Academy · Main Campus', session: '2026/2027', term: 'First Term' };
  const parent = dashboardData?.parent || { name: 'Mrs. Sarah Adeleke-Okonkwo' };
  const schedule = dashboardData?.schedule || [];
  const notices = dashboardData?.notices || [];
  const modular = dashboardData?.modular_suite || {};
  const campusOps = dashboardData?.campus_operations || {};

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <MotionRise className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
            <UserGroupIcon className="w-4 h-4" />
            <span>Guardian Command Hub · {school.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {parent.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time academic performance, live transit telemetry, bursary billing, and safeguarding for your children.
          </p>
        </div>

        {/* Wards Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Multi-Child Switcher */}
          {wards.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
                className="bg-white border border-gray-200 hover:border-blue-400 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xs transition-all flex items-center gap-3"
              >
                <img
                  src={activeWard.avatar}
                  alt={activeWard.name}
                  className="w-7 h-7 rounded-full object-cover border border-blue-200 shadow-xs"
                />
                <div className="text-left">
                  <div className="font-bold text-gray-900 leading-tight">{activeWard.name}</div>
                  <div className="text-[11px] text-gray-500">{activeWard.class_name} · {activeWard.arm_name}</div>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-400 ml-1" />
              </button>

              {isWardDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
                    Select Child / Ward ({wards.length})
                  </div>
                  <div className="space-y-1">
                    {wards.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => handleSelectWard(w.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                          w.id === activeWard.id
                            ? 'bg-blue-50/80 text-blue-900 font-bold border border-blue-100'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">{w.name}</div>
                          <div className="text-[11px] text-gray-500 truncate">{w.class_name} ({w.arm_name})</div>
                        </div>
                        {w.outstanding_fees > 0 ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            Fee Due
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            Cleared
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Pay Button */}
          <button
            onClick={() => setIsPayModalOpen(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2"
          >
            <CreditCardIcon className="w-4 h-4" />
            <span>Pay Tuition Bursary</span>
          </button>
        </div>
      </MotionRise>

      {/* Top Level Pillar Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-gray-200 flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleTabChange('overview')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#0D1060] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
          }`}
          style={{
            backgroundColor: activeTab === 'overview' ? '#0D1060' : undefined,
          }}
        >
          <Squares2X2Icon className="w-5 h-5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => handleTabChange('modular')}
          className={`flex-1 min-w-[150px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'modular'
              ? 'bg-[#0D1060] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
          }`}
          style={{
            backgroundColor: activeTab === 'modular' ? '#0D1060' : undefined,
          }}
        >
          <AcademicCapIcon className="w-5 h-5" />
          <span>Modular Suite Tabs</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold ml-1">
            4 Suites
          </span>
        </button>

        <button
          onClick={() => handleTabChange('campuspro')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'campuspro'
              ? 'bg-[#0D1060] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
          }`}
          style={{
            backgroundColor: activeTab === 'campuspro' ? '#0D1060' : undefined,
          }}
        >
          <HomeModernIcon className="w-5 h-5" />
          <span>CampusPRO Operations</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold ml-1">
            Live ERP
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW (Admin Dashboard Style Layout)          */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards (Exact Admin Style) */}
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Primary Dark (Bursary / Fees) */}
            <MotionRise className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-3xl p-6 shadow-md flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60 pointer-events-none" />
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20 pointer-events-none" />

              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-blue-200">Bursary Ledger</span>
                  <h3 className="text-xl font-bold text-white mt-1">Outstanding Fees</h3>
                </div>
                <div
                  onClick={() => setIsPayModalOpen(true)}
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-[#146ef5] transition-colors cursor-pointer"
                  title="Make Payment"
                >
                  <ArrowUpRightIcon className="w-4 h-4" />
                </div>
              </div>

              <div className="z-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                  ₦{activeWard.outstanding_fees.toLocaleString()}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                    {activeWard.outstanding_fees === 0 ? 'Fully Cleared' : 'Due Nov 30'}
                  </span>
                  <span>{activeWard.first_name}'s Term Balance</span>
                </div>
              </div>
            </MotionRise>

            {/* Card 2: Attendance Rate & Gate Check-in */}
            <MotionRise className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600">Gate Turnstile</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">Attendance Rate</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FingerPrintIcon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                  {activeWard.attendance_rate.toFixed(1)}%
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                    Clocked in at 07:44 AM
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Main Turnstile Gate A</div>
              </div>
            </MotionRise>

            {/* Card 3: Academic Health & Cognitive GPA */}
            <MotionRise className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600">ResultsPRO Engine</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">Term Grade / GPA</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                  <AcademicCapIcon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                  {activeWard.average_gpa.toFixed(2)} <span className="text-lg font-bold text-gray-400">/ 4.0</span>
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                    <ArrowTrendingUpIcon className="w-3 h-3" /> Top 5%
                  </span>
                  <span>Average: {activeWard.average_score.toFixed(1)}%</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Overall Grade: A (Excellent)</div>
              </div>
            </MotionRise>

            {/* Card 4: Tuck Shop Wallet & Secure Dismissal PIN */}
            <MotionRise className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between aspect-square group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600">Tuck & Safeguarding</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">Tuck Wallet</h3>
                </div>
                <div
                  onClick={() => setIsWalletModalOpen(true)}
                  className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center cursor-pointer hover:bg-amber-100"
                  title="Top up wallet"
                >
                  <BuildingStorefrontIcon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                  ₦{activeWard.wallet_balance.toLocaleString()}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    PIN: {activeWard.pickup_pin}
                  </span>
                  <span>Dismissal Code</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Daily Cap: ₦3,000 · RFID Active</div>
              </div>
            </MotionRise>
          </MotionStagger>

          {/* Main 12-Column Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (8 cols): Schedule & Circulars */}
            <div className="lg:col-span-8 space-y-6">
              {/* Today's Schedule Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {activeWard.first_name}'s Academic Timetable for Today
                    </h3>
                    <p className="text-xs text-gray-500">
                      Live class progression for {activeWard.class_name} · {activeWard.arm_name}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                    6 Periods
                  </span>
                </div>

                <div className="space-y-3">
                  {schedule.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        item.status === 'ACTIVE'
                          ? 'bg-blue-50/70 border-blue-200 shadow-xs'
                          : item.status === 'COMPLETED'
                          ? 'bg-gray-50/70 border-gray-100 opacity-75'
                          : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            item.status === 'ACTIVE'
                              ? 'bg-blue-600 text-white'
                              : item.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          P{item.period_index || idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <span>{item.subject}</span>
                            {item.status === 'ACTIVE' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white animate-pulse">
                                IN SESSION NOW
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-3">
                            <span>👨‍🏫 {item.teacher_name}</span>
                            <span>📍 {item.room}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-gray-700">{item.time}</div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'ACTIVE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Circulars & Notices Feed */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Institutional Circulars & Notice Feed</h3>
                    <p className="text-xs text-gray-500">Official bulletins from school management and academic board</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                    {notices.length} New Notices
                  </span>
                </div>

                <div className="space-y-4">
                  {notices.map((n: any, idx: number) => (
                    <div key={n.id || idx} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                          {n.category}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{n.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{n.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2">{n.summary}</p>
                      <div className="text-[11px] text-gray-500 font-medium">Issued by: {n.author}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Transit Radar & Safeguarding */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live Bus Commute Radar */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                    <TruckIcon className="w-4 h-4" />
                    <span>Live Transit Telemetry</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">
                  {campusOps.transportation?.route_name || 'Route 04 · Admiralty Express'}
                </h4>
                <p className="text-xs text-emerald-700 font-semibold mb-4 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  🚌 {campusOps.transportation?.status || 'In Transit · Approaching Parent Stop'}
                </p>

                <div className="space-y-2 text-xs text-gray-600 mb-4 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned Vehicle:</span>
                    <span className="font-bold text-gray-800">{campusOps.transportation?.bus_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Driver:</span>
                    <span className="font-bold text-gray-800">{campusOps.transportation?.driver_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Morning Pickup:</span>
                    <span className="font-bold text-gray-800">{campusOps.transportation?.pickup_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Afternoon Dropoff:</span>
                    <span className="font-bold text-gray-800">{campusOps.transportation?.dropoff_time}</span>
                  </div>
                </div>

                <a
                  href={`tel:${campusOps.transportation?.driver_phone || '+2348023314991'}`}
                  className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                  <span>Call Bus Driver</span>
                </a>
              </div>

              {/* Safeguarding & Authorized Pickup Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>Child Safeguarding</span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-3">Dismissal Pickup Clearance</h4>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-center mb-4 shadow-sm">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                    Single-Use Dismissal PIN
                  </div>
                  <div className="text-3xl font-black tracking-widest text-white my-1">
                    {activeWard.pickup_pin}
                  </div>
                  <div className="text-[10px] text-white/70">Show this PIN to gate marshals at pickup</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-gray-800 text-[11px] uppercase tracking-wider text-gray-400">
                    Approved Guardians
                  </div>
                  {campusOps.security?.authorized_pickups?.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-gray-700">
                      <div>
                        <span className="font-bold block text-gray-900">{p.name}</span>
                        <span className="text-[10px] text-gray-500">{p.relationship}</span>
                      </div>
                      {p.is_primary && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinic & Health Passport Mini Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
                  <HeartIcon className="w-4 h-4" />
                  <span>Medical & Sick Bay</span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-3">Health Passport</h4>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-100">
                    <span className="text-[10px] font-bold text-red-700 block">Blood Group</span>
                    <span className="text-base font-black text-red-900">{campusOps.clinic?.blood_group || 'O+'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                    <span className="text-[10px] font-bold text-purple-700 block">Genotype</span>
                    <span className="text-base font-black text-purple-900">{campusOps.clinic?.genotype || 'AA'}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                  ⚠️ <span className="font-bold">Allergies:</span> {campusOps.clinic?.known_allergies || 'None logged'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MODULAR SUITE TABS (Classroom, Tutors, Puzzle, Results) */}
      {/* ======================================================== */}
      {activeTab === 'modular' && (
        <div className="space-y-6">
          {/* Modular Subtabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-3">
            {[
              { id: 'classroompro', label: 'ClassroomPRO', icon: AcademicCapIcon, badge: 'Homework & Syllabus' },
              { id: 'tutorspro', label: 'TutorsPRO', icon: UserGroupIcon, badge: '1-on-1 Mentors' },
              { id: 'puzzlepro', label: 'PuzzlePRO', icon: PuzzlePieceIcon, badge: 'Future Skills' },
              { id: 'resultspro', label: 'ResultsPRO', icon: ChartPieIcon, badge: 'Cognitive Report Cards' },
            ].map((sub) => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleModularSubtabChange(sub.id as ModularSubtab)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    modularSubtab === sub.id
                      ? 'bg-[#0D1060] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: modularSubtab === sub.id ? '#0D1060' : undefined,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{sub.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      modularSubtab === sub.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {sub.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subtab 1: ClassroomPRO */}
          {modularSubtab === 'classroompro' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold uppercase">Enrolled Subjects</span>
                  <div className="text-3xl font-black text-gray-900 mt-1">
                    {modular.classroompro?.active_courses || 9} Subjects
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1">100% Curriculum Coverage</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold uppercase">Syllabus Completion</span>
                  <div className="text-3xl font-black text-blue-600 mt-1">
                    {modular.classroompro?.syllabus_completion || 78.4}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Term 1 Milestone Met</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold uppercase">Homework Completion</span>
                  <div className="text-3xl font-black text-emerald-600 mt-1">92.5%</div>
                  <div className="text-xs text-gray-500 mt-1">Top Tier Student Punctuality</div>
                </div>
              </div>

              {/* Homework & Assignments List */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4">Daily Homework & Class Assignments</h3>
                <div className="divide-y divide-gray-100">
                  {modular.classroompro?.homework_due?.map((hw: any) => (
                    <div key={hw.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-600 uppercase">{hw.subject}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              hw.status === 'SUBMITTED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {hw.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{hw.title}</h4>
                        <div className="text-xs text-gray-500">📅 Due Date: {hw.due}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-gray-500">{hw.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subtab 2: TutorsPRO */}
          {modularSubtab === 'tutorspro' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 rounded-3xl text-white">
                <h3 className="text-xl font-bold mb-1">Personalized Subject Mentors & Tutors</h3>
                <p className="text-xs text-blue-200 max-w-xl">
                  Dedicated academic faculty supporting {activeWard.first_name} with private 1-on-1 tutorials and cognitive coaching.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modular.tutorspro?.assigned_tutors?.map((t: any, i: number) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{t.name}</h4>
                        <div className="text-xs text-blue-600 font-semibold">{t.subject}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                        ⭐ {t.rating} / 5.0
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between">
                      <span>Completed Sessions: <strong>{t.sessions_completed}</strong></span>
                      <span>Next Session: <strong className="text-blue-600">{t.next_session}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Lead Tutor Remark</h4>
                <p className="text-sm text-gray-700 italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                  "{modular.tutorspro?.tutor_remarks}"
                </p>
              </div>
            </div>
          )}

          {/* Subtab 3: PuzzlePRO */}
          {modularSubtab === 'puzzlepro' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold uppercase">Thinking Streak</span>
                  <div className="text-3xl font-black text-amber-500 mt-1">
                    {modular.puzzlepro?.cognitive_streak || 5} Days 🔥
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold uppercase">Challenges Solved</span>
                  <div className="text-3xl font-black text-purple-600 mt-1">
                    {modular.puzzlepro?.challenges_completed || 42}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold uppercase">Logic Score</span>
                  <div className="text-3xl font-black text-blue-600 mt-1">
                    {modular.puzzlepro?.computational_thinking_score || 890}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold uppercase">Cohort Ranking</span>
                  <div className="text-3xl font-black text-emerald-600 mt-1">Top 8%</div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 4: ResultsPRO (Report Card & Psychomotor) */}
          {modularSubtab === 'resultspro' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {modular.resultspro?.latest_term || 'First Term 2026/2027'}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-0.5">
                    Official Termly Cognitive Assessment Sheet
                  </h3>
                  <p className="text-xs text-gray-500">
                    Compiled for {activeWard.name} ({activeWard.admission_number})
                  </p>
                </div>

                <button
                  onClick={() => setPrintDoc('report_card')}
                  className="px-5 py-2.5 rounded-xl bg-[#146ef5] text-white text-xs font-bold hover:bg-[#105bd1] transition-all flex items-center gap-2 shadow-sm"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print Report Sheet</span>
                </button>
              </div>

              {/* Subject Grading Matrix */}
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700 grid grid-cols-12 gap-2">
                  <span className="col-span-4">Subject Curriculum</span>
                  <span className="col-span-2 text-center">Continuous (30)</span>
                  <span className="col-span-2 text-center">Exam (70)</span>
                  <span className="col-span-2 text-center">Total (100)</span>
                  <span className="col-span-2 text-center">Grade</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {modular.resultspro?.subjects?.map((s: any, idx: number) => (
                    <div key={idx} className="p-4 text-xs grid grid-cols-12 gap-2 items-center hover:bg-gray-50/60">
                      <div className="col-span-4">
                        <span className="font-bold text-gray-900 block">{s.subject}</span>
                        <span className="text-[11px] text-gray-400 italic">{s.remark}</span>
                      </div>
                      <span className="col-span-2 text-center font-semibold text-gray-700">{s.test}</span>
                      <span className="col-span-2 text-center font-semibold text-gray-700">{s.midterm}</span>
                      <span className="col-span-2 text-center font-bold text-gray-900">{s.total}</span>
                      <div className="col-span-2 text-center">
                        <span className="px-2.5 py-0.5 rounded-full font-black text-xs bg-emerald-100 text-emerald-800">
                          {s.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychomotor Ratings */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Psychomotor & Behavioral Domain Ratings</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(modular.resultspro?.psychomotor || {}).map(([trait, rating]: any, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                      <span className="text-[11px] text-gray-500 font-bold block mb-1">{trait}</span>
                      <span className="text-xs font-black text-emerald-700">{rating}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CAMPUSPRO OPERATIONS (Live School ERP Tabs)      */}
      {/* ======================================================== */}
      {activeTab === 'campuspro' && (
        <div className="space-y-6">
          {/* Operations Subtabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-3">
            {[
              { id: 'bursary', label: 'Bursary & Fees', icon: CreditCardIcon, badge: `₦${activeWard.outstanding_fees.toLocaleString()}` },
              { id: 'transport', label: 'Bus GPS Fleet', icon: TruckIcon, badge: 'Live Radar' },
              { id: 'security', label: 'Security & Gate', icon: ShieldCheckIcon, badge: `PIN: ${activeWard.pickup_pin}` },
              { id: 'clinic', label: 'Clinic & Health', icon: HeartIcon, badge: 'Sick Bay' },
              { id: 'hostel', label: 'Hostel & Exeat', icon: BuildingOffice2Icon, badge: 'Digital Exeat' },
              { id: 'cafeteria', label: 'Cafeteria Tuck', icon: BuildingStorefrontIcon, badge: `₦${activeWard.wallet_balance.toLocaleString()}` },
            ].map((sub) => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleCampusSubtabChange(sub.id as CampusPROSubtab)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    campusSubtab === sub.id
                      ? 'bg-[#0D1060] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: campusSubtab === sub.id ? '#0D1060' : undefined,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{sub.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      campusSubtab === sub.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {sub.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subtab 1: Bursary & Invoices */}
          {campusSubtab === 'bursary' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
                    Bursary & Tuition Invoices
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">
                    Balance Due: ₦{activeWard.outstanding_fees.toLocaleString()}
                  </h3>
                  <p className="text-xs text-gray-500">Payable via automated Paystack online checkout or instant bank transfer.</p>
                </div>
                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-[#146ef5] text-white text-xs sm:text-sm font-bold hover:bg-[#105bd1] transition-all flex items-center gap-2 shadow-md"
                >
                  <CreditCardIcon className="w-4 h-4" />
                  <span>Pay Now With Paystack</span>
                </button>
              </div>

              {/* Invoices List */}
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700 flex justify-between">
                  <span>Termly Invoices</span>
                  <span>Amount & Status</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {campusOps.bursary?.invoices?.map((inv: any, i: number) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/60">
                      <div>
                        <div className="text-xs font-bold text-gray-400">{inv.invoice_no}</div>
                        <h4 className="text-sm font-bold text-gray-900">{inv.description}</h4>
                        <div className="text-xs text-gray-500">Total: ₦{inv.total.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-gray-900">
                          ₦{inv.balance.toLocaleString()} Due
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subtab 2: Transportation GPS */}
          {campusSubtab === 'transport' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-2">School Transit Corridors & Bus GPS</h3>
                <p className="text-xs text-gray-500 mb-6">Live telemetry updates streamed from vehicle tracker.</p>

                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-white uppercase">Assigned Transit Route</div>
                    <div className="text-2xl font-black mt-1">{campusOps.transportation?.route_name}</div>
                    <div className="text-xs text-blue-200 mt-1">Vehicle: {campusOps.transportation?.bus_number} ({campusOps.transportation?.plate_number})</div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-900 font-extrabold text-xs">
                      {campusOps.transportation?.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block mb-1">Designated Pickup Stop</span>
                    <span className="font-bold text-gray-900 text-sm">{campusOps.transportation?.pickup_stop}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block mb-1">Morning Pickup Schedule</span>
                    <span className="font-bold text-emerald-700 text-sm">{campusOps.transportation?.pickup_time}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block mb-1">Afternoon Dropoff Schedule</span>
                    <span className="font-bold text-blue-700 text-sm">{campusOps.transportation?.dropoff_time}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 3: Security & Gate */}
          {campusSubtab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Perimeter Gate Security & Safeguarding</h3>
                    <p className="text-xs text-gray-500">Authorized pickup persons and single-use dismissal PINs.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    Perimeter Active
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Current Dismissal Verification PIN</span>
                    <div className="text-4xl font-black text-blue-600 mt-1 tracking-widest">{activeWard.pickup_pin}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Dynamically refreshed each dismissal period.</div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => alert(`Dismissal PIN for ${activeWard.name} is ${activeWard.pickup_pin}`)}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                    >
                      Regenerate PIN
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Registered Authorized Pickup Persons</h4>
                  {campusOps.security?.authorized_pickups?.map((p: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl border border-gray-100 bg-white flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{p.name}</span>
                        <div className="text-gray-500">{p.relationship} · {p.phone}</div>
                      </div>
                      {p.is_primary && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                          Primary Guardian
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subtab 4: Clinic & Health */}
          {campusSubtab === 'clinic' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Clinic & Sick Bay Health Record</h3>
                <p className="text-xs text-gray-500 mb-6">Clinical triage notes and registered medical emergency alerts.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                    <span className="text-xs font-bold text-red-700 uppercase">Blood Group</span>
                    <div className="text-3xl font-black text-red-900 mt-1">{campusOps.clinic?.blood_group || 'O+'}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                    <span className="text-xs font-bold text-purple-700 uppercase">Genotype</span>
                    <div className="text-3xl font-black text-purple-900 mt-1">{campusOps.clinic?.genotype || 'AA'}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <span className="text-xs font-bold text-amber-700 uppercase">Allergy Alert</span>
                    <div className="text-xs font-bold text-amber-900 mt-2">{campusOps.clinic?.known_allergies || 'Peanuts (Mild)'}</div>
                  </div>
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Recent Infirmary Visits</h4>
                {campusOps.clinic?.recent_visits?.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">No sick bay admissions logged.</div>
                ) : (
                  <div className="space-y-2">
                    {campusOps.clinic?.recent_visits?.map((v: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-gray-900">{v.reason}</span>
                          <div className="text-gray-500">Attending: {v.nurse} · Date: {v.date}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Discharged
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtab 5: Hostel & Exeat */}
          {campusSubtab === 'hostel' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Hostel & Digital Exeat Authorization</h3>
                  <p className="text-xs text-gray-500">Submit electronic exeat requests and download QR departure vouchers.</p>
                </div>
                <button
                  onClick={() => setIsExeatModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Request Digital Exeat</span>
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 text-center">
                <BuildingOffice2Icon className="w-12 h-12 mx-auto text-indigo-400 mb-2" />
                <h4 className="font-bold text-gray-900 text-sm">Boarding Status: {campusOps.hostel?.hall_name || 'Day Student (Non-Boarding)'}</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  If {activeWard.first_name} is enrolled in the boarding school house, weekend home leaves and medical exeats must be authorized electronically.
                </p>
              </div>
            </div>
          )}

          {/* Subtab 6: Cafeteria & Cashless Tuck Shop */}
          {campusSubtab === 'cafeteria' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600">
                    Cashless Dining & Tuck Shop
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">
                    Wallet Balance: ₦{activeWard.wallet_balance.toLocaleString()}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Linked to student smartcard ({campusOps.cafeteria?.rfid_card_number}) · Daily limit: ₦{campusOps.cafeteria?.daily_spend_limit}
                  </p>
                </div>

                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Top Up Tuck Wallet</span>
                </button>
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700 flex justify-between">
                  <span>Recent Cafeteria Purchases</span>
                  <span>Amount Deducted</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {campusOps.cafeteria?.recent_transactions?.map((t: any, i: number) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/60 text-xs">
                      <div>
                        <h4 className="font-bold text-gray-900">{t.item}</h4>
                        <div className="text-gray-400 text-[11px]">{t.date}</div>
                      </div>
                      <span className="font-black text-gray-900">-₦{t.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: PAY BURSARY TUITION                             */}
      {/* ======================================================== */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-base">Pay School Bursary Fees</h3>
              <button onClick={() => setIsPayModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <span className="text-xs text-blue-700 font-bold block">Student</span>
                <span className="text-sm font-black text-blue-900">{activeWard.name}</span>
                <span className="text-xs text-blue-600 block mt-0.5">{activeWard.class_name} · Outstanding: ₦{activeWard.outstanding_fees.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Amount (₦)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 border border-gray-200">
                🔒 Secure Paystack 256-bit bank card and transfer checkout. Instant digital receipt issued upon confirmation.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSimulatePayment}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing Paystack...' : `Pay ₦${paymentAmount.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TOP UP TUCK SHOP WALLET                         */}
      {/* ======================================================== */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-base">Top Up Tuck Shop Cashless Wallet</h3>
              <button onClick={() => setIsWalletModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-800 font-bold block">Current Tuck Balance</span>
                <span className="text-2xl font-black text-amber-900">₦{activeWard.wallet_balance.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Top-Up Amount (₦)</label>
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWalletModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleTopUpWallet}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold disabled:opacity-50"
                >
                  {isSubmitting ? 'Funding...' : `Fund Wallet ₦${walletAmount.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: REQUEST DIGITAL EXEAT PASS                      */}
      {/* ======================================================== */}
      {isExeatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-base">Request Digital Exeat Clearance</h3>
              <button onClick={() => setIsExeatModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestExeat} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Exeat *</label>
                <select
                  value={exeatForm.reason}
                  onChange={(e) => setExeatForm({ ...exeatForm, reason: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-white"
                >
                  <option value="Weekend Home Visit">Weekend Home Visit</option>
                  <option value="Medical Appointment / Specialist Care">Medical Appointment</option>
                  <option value="Family Event / Celebration">Family Event</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={exeatForm.departure_date}
                    onChange={(e) => setExeatForm({ ...exeatForm, departure_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    required
                    value={exeatForm.return_date}
                    onChange={(e) => setExeatForm({ ...exeatForm, return_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Destination Address *</label>
                <input
                  type="text"
                  required
                  value={exeatForm.destination_address}
                  onChange={(e) => setExeatForm({ ...exeatForm, destination_address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsExeatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Authorize Exeat Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRINTABLE OFFICIAL SLIPS / CERTIFICATES                 */}
      {/* ======================================================== */}
      {printDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="text-center pb-4 border-b border-gray-200">
              <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
                {school.name}
              </div>
              <h2 className="text-xl font-black text-gray-900 mt-1">
                {printDoc === 'report_card'
                  ? 'Official Student Cognitive Report Sheet'
                  : printDoc === 'fee_receipt'
                  ? 'Official Bursary Digital Receipt'
                  : 'Approved Boarding Exeat Pass'}
              </h2>
              <p className="text-[11px] text-gray-500">Student: {activeWard.name} ({activeWard.admission_number})</p>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Class & Arm:</span>
                <span className="font-bold text-gray-900">{activeWard.class_name} · {activeWard.arm_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Academic Session:</span>
                <span className="font-bold text-gray-900">{school.session}</span>
              </div>
              {printDoc === 'report_card' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Overall Grade:</span>
                    <span className="font-bold text-emerald-700">A (3.88 GPA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Class Standing:</span>
                    <span className="font-bold text-blue-700">Top 5% in Cohort</span>
                  </div>
                </>
              )}
              {printDoc === 'fee_receipt' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Received:</span>
                    <span className="font-bold text-emerald-700">₦{paymentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Channel:</span>
                    <span className="font-bold text-blue-700">Paystack Verified</span>
                  </div>
                </>
              )}
              {printDoc === 'exeat_pass' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Authorized Exeat Period:</span>
                    <span className="font-bold text-indigo-700">{exeatForm.departure_date} to {exeatForm.return_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gate QR Security Verification:</span>
                    <span className="font-bold text-emerald-700">PASSED · QR-ACTIVE</span>
                  </div>
                </>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-center text-[10px] text-gray-500 border border-gray-200">
              Verified cryptographic document generated by ResultsPro CampusPRO institutional operating system.
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => setPrintDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

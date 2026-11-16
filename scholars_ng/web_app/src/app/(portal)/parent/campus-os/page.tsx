'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BanknotesIcon,
  CalendarDaysIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  MegaphoneIcon,
  ArrowPathIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  UserIcon,
  PlusIcon,
  PhoneIcon,
  MapPinIcon,
  PrinterIcon,
  QrCodeIcon,
  FingerPrintIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export type ParentCampusSubtab =
  | 'bursary'
  | 'attendance'
  | 'transport'
  | 'security'
  | 'clinic'
  | 'hostel'
  | 'cafeteria'
  | 'notices';

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

function ParentCampusOSContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const querySubtab = (searchParams.get('subtab') as ParentCampusSubtab) || 'bursary';
  const queryWard = searchParams.get('ward') || '';

  const [activeTab, setActiveTab] = useState<ParentCampusSubtab>(querySubtab);
  const [selectedWardId, setSelectedWardId] = useState<string>(queryWard);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(185000);
  const [payCategory, setPayCategory] = useState<string>('Tuition & Academic Term');
  const [paying, setPaying] = useState(false);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState<number>(10000);
  const [fundingWallet, setFundingWallet] = useState(false);

  const [isExeatModalOpen, setIsExeatModalOpen] = useState(false);
  const [exeatType, setExeatType] = useState('WEEKEND');
  const [exeatReason, setExeatReason] = useState('');
  const [exeatDeparture, setExeatDeparture] = useState('');
  const [exeatReturn, setExeatReturn] = useState('');
  const [submittingExeat, setSubmittingExeat] = useState(false);

  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Fetch Parent Data
  const fetchParentData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/v1/campus/parent/dashboard');

      if (res?.data) {
        setDashboardData(res.data);
        if (res.data.wards && res.data.wards.length > 0 && !selectedWardId) {
          setSelectedWardId(res.data.wards[0].student_id || res.data.wards[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load parent campus operations:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to communicate with CampusPRO backend');
    } finally {
      setLoading(false);
    }
  }, [selectedWardId]);

  useEffect(() => {
    fetchParentData();
  }, [fetchParentData]);

  // Tab Sync with URL
  const handleTabChange = useCallback((tab: ParentCampusSubtab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('subtab', tab);
    if (selectedWardId) params.set('ward', selectedWardId);
    router.replace(`/parent/campus-os?${params.toString()}`);
  }, [router, selectedWardId]);

  const handleWardChange = useCallback((wardId: string) => {
    setSelectedWardId(wardId);
    const params = new URLSearchParams(window.location.search);
    params.set('ward', wardId);
    params.set('subtab', activeTab);
    router.replace(`/parent/campus-os?${params.toString()}`);
  }, [router, activeTab]);

  const wards: WardRecord[] = useMemo(() => dashboardData?.wards || [], [dashboardData]);
  const activeWard = useMemo(
    () => wards.find((w) => w.student_id === selectedWardId || w.id === selectedWardId) || wards[0],
    [wards, selectedWardId]
  );

  const parent = dashboardData?.parent || {
    name: 'Mrs. Sarah Adeleke-Okonkwo',
    phone: '+234 803 459 2810',
    email: 'sarah.okonkwo@example.com',
    campus_name: 'ExamsPRO Academy · Main Campus',
  };

  // Modal Actions
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    try {
      const payload = {
        student_id: activeWard?.student_id || activeWard?.id,
        student_name: activeWard?.name,
        amount: Number(payAmount),
        category: payCategory,
        channel: 'PAYSTACK_DIRECT',
      };
      await api.post('/v1/campus/fees', payload).catch(async () => {
        return await api.post('/campus/fees', payload);
      });
      setIsPayModalOpen(false);
      showToast(`Payment of ₦${payAmount.toLocaleString()} verified and credited successfully!`);
      fetchParentData();
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Payment settlement failed');
    } finally {
      setPaying(false);
    }
  };

  const handleTopupWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setFundingWallet(true);
    try {
      const payload = {
        action: 'topup',
        student_id: activeWard?.student_id || activeWard?.id,
        student_name: activeWard?.name,
        amount: Number(walletAmount),
        channel: 'CARD_TOKEN',
      };
      await api.post('/v1/campus/cafeteria', payload).catch(async () => {
        return await api.post('/campus/cafeteria', payload);
      });
      setIsWalletModalOpen(false);
      showToast(`Tuck shop wallet topped up with ₦${walletAmount.toLocaleString()}!`);
      fetchParentData();
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Wallet topup failed');
    } finally {
      setFundingWallet(false);
    }
  };

  const handleExeatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exeatReason.trim()) return;
    setSubmittingExeat(true);
    try {
      const payload = {
        action: 'parent_exeat_request',
        student_id: activeWard?.student_id || activeWard?.id,
        student_name: activeWard?.name,
        class_name: activeWard?.class_name,
        exeat_type: exeatType,
        reason: exeatReason,
        departure_date: exeatDeparture || new Date().toISOString().split('T')[0],
        expected_return_date: exeatReturn || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        authorized_parent: parent.name,
        parent_phone: parent.phone,
      };
      await api.post('/v1/campus/student/exeat', payload).catch(async () => {
        return await api.post('/campus/student/exeat', payload);
      });
      setIsExeatModalOpen(false);
      setExeatReason('');
      showToast('Digital exeat request submitted to Housemaster for gate clearance.');
      fetchParentData();
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Failed to submit exeat request');
    } finally {
      setSubmittingExeat(false);
    }
  };

  const subtabs: { id: ParentCampusSubtab; label: string; icon: any; badge?: string }[] = [
    { id: 'bursary', label: 'Bursary & Fees', icon: BanknotesIcon, badge: activeWard?.outstanding_fees ? `₦${(activeWard.outstanding_fees / 1000).toFixed(0)}k Due` : 'Clear' },
    { id: 'attendance', label: 'Gate & Roll Call', icon: FingerPrintIcon, badge: `${activeWard?.attendance_rate || 96}%` },
    { id: 'transport', label: 'Bus GPS Corridor', icon: TruckIcon, badge: 'Live Bus' },
    { id: 'security', label: 'Child Safeguarding', icon: ShieldCheckIcon, badge: `PIN: ${activeWard?.pickup_pin || '••••'}` },
    { id: 'clinic', label: 'Infirmary & Clinic', icon: HeartIcon, badge: `${dashboardData?.clinic?.length || 0} Logs` },
    { id: 'hostel', label: 'Hostel & Exeats', icon: BuildingOffice2Icon, badge: 'Boarding' },
    { id: 'cafeteria', label: 'Tuck Shop Wallet', icon: BuildingStorefrontIcon, badge: `₦${(activeWard?.wallet_balance || 0).toLocaleString()}` },
    { id: 'notices', label: 'Campus Circulars', icon: MegaphoneIcon, badge: `${dashboardData?.messages?.length || 0} New` },
  ];

  return (
    <div className="min-w-0 w-full max-w-full space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircleIcon className="w-5 h-5 text-white" />
          {successToast}
        </div>
      )}

      {/* Top Banner & Multi-Ward Switcher */}
      <MotionRise className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CampusPRO</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider border border-blue-200/80">
              <ShieldCheckIcon className="w-3.5 h-3.5" /> Parent Operations Console
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time child welfare, fee settlement, bus telemetry, and gate security monitoring for {parent.name}.
          </p>
        </div>

        {/* Multi-Ward Selector & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {wards.length > 0 && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-xs">
              <span className="text-xs font-bold text-gray-400 pl-2">Ward:</span>
              <div className="flex items-center gap-1">
                {wards.map((ward) => {
                  const isSelected = (ward.student_id || ward.id) === (activeWard?.student_id || activeWard?.id);
                  return (
                    <button
                      key={ward.student_id || ward.id}
                      onClick={() => handleWardChange(ward.student_id || ward.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#146ef5] text-white shadow-xs'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20 border border-white/30 flex items-center justify-center text-[10px]">
                        {ward.name.charAt(0)}
                      </div>
                      <span>{ward.name.split(' ')[0]}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {ward.class_name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={fetchParentData}
            disabled={loading}
            className="p-2.5 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-xs cursor-pointer"
            title="Refresh Operations"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-[#146ef5]' : ''}`} />
          </button>
        </div>
      </MotionRise>

      {/* Ward KPI Summary Card */}
      {activeWard && (
        <MotionRise delay={0.05} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Outstanding Fees</span>
              <BanknotesIcon className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₦{Number(activeWard.outstanding_fees || 0).toLocaleString()}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400">Term Balance</span>
              <button
                onClick={() => setIsPayModalOpen(true)}
                className="text-[11px] font-bold text-[#146ef5] hover:underline"
              >
                Pay Now →
              </button>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Biometric Attendance</span>
              <FingerPrintIcon className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeWard.attendance_rate || 96.4}%</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircleIcon className="w-3.5 h-3.5" /> Punctual & Present
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Tuck Shop Wallet</span>
              <CreditCardIcon className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₦{Number(activeWard.wallet_balance || 0).toLocaleString()}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400">Cashless Meal Card</span>
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="text-[11px] font-bold text-purple-600 hover:underline"
              >
                + Top-Up
              </button>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Authorized Pickup PIN</span>
              <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-mono font-bold tracking-widest text-[#146ef5]">
              {activeWard.pickup_pin || '849201'}
            </p>
            <p className="text-[11px] text-gray-400">Dynamic Gate Verification</p>
          </div>
        </MotionRise>
      )}

      {/* Operational Subtabs Navigation Bar */}
      <MotionRise delay={0.1} className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {subtabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#146ef5] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </MotionRise>

      {/* Subtab 1: Bursary & Invoices */}
      {activeTab === 'bursary' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Term Bursary & Tuition Invoices</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Automated breakdown of tuition, boarding levies, ICT infrastructure, and books.
                </p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(true)}
                className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <CreditCardIcon className="w-4 h-4" />
                Make Instant Payment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <span className="text-[11px] font-bold text-blue-700 uppercase">Total Term Billing</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">₦350,000</p>
                <p className="text-xs text-gray-500 mt-1">2026/2027 Academic Session · First Term</p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Total Settled</span>
                <p className="text-2xl font-bold text-emerald-700 mt-1">
                  ₦{(350000 - Number(activeWard?.outstanding_fees || 0)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Verified via Central Paystack Switch</p>
              </div>
              <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                <span className="text-[11px] font-bold text-amber-700 uppercase">Outstanding Balance</span>
                <p className="text-2xl font-bold text-amber-800 mt-1">
                  ₦{Number(activeWard?.outstanding_fees || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Due before midterm examination clearances</p>
              </div>
            </div>

            {/* Fee Items Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Itemized Fee Schedule</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Item Code</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">FEE-TUI-01</td>
                      <td className="py-3.5 px-4 font-medium">Senior Secondary Academic Tuition</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">Academic</span></td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">₦220,000</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">PART-PAID</span></td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#146ef5] hover:underline cursor-pointer">Download ↓</td>
                    </tr>
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">FEE-LAB-04</td>
                      <td className="py-3.5 px-4 font-medium">Physics & STEM Laboratory Practical Consumables</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">Laboratory</span></td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">₦45,000</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">PAID</span></td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#146ef5] hover:underline cursor-pointer">Download ↓</td>
                    </tr>
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">FEE-ICT-02</td>
                      <td className="py-3.5 px-4 font-medium">ClassroomPRO & CBT Exam Infrastructure Levy</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold">Technology</span></td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">₦35,000</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">PAID</span></td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#146ef5] hover:underline cursor-pointer">Download ↓</td>
                    </tr>
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">FEE-CLB-09</td>
                      <td className="py-3.5 px-4 font-medium">Sports & Co-Curricular House Dues</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">House Sports</span></td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">₦15,000</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">UNPAID</span></td>
                      <td className="py-3.5 px-4 text-right text-gray-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Subtab 2: Gate & Roll Call Attendance */}
      {activeTab === 'attendance' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Biometric Gate Logs & Daily Punctuality</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Synchronized with CampusPRO Turnstile Face/Fingerprint Terminals.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <CheckCircleIcon className="w-4 h-4" /> Live Turnstile Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Today's Morning Gate In</span>
                <p className="text-xl font-bold text-gray-900 mt-1">07:28 AM</p>
                <p className="text-[11px] text-emerald-600 font-semibold">✓ Punctual (Gate closes 07:45 AM)</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Terminal Location</span>
                <p className="text-xl font-bold text-gray-900 mt-1">Main Pedestrian Gate B</p>
                <p className="text-[11px] text-gray-500">Biometric Face Scanner #02</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">SMS Arrival Notification</span>
                <p className="text-xl font-bold text-emerald-700 mt-1">Delivered</p>
                <p className="text-[11px] text-gray-500">Sent to {parent.phone}</p>
              </div>
            </div>

            {/* Attendance History Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Recent 5-Day Gate Ledger</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Time In</th>
                      <th className="py-3 px-4">Time Out</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Gate Terminal</th>
                      <th className="py-3 px-4">Form Teacher Roll Call</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900">Today</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">07:28 AM</td>
                      <td className="py-3 px-4 font-mono text-gray-400">— In School</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">PRESENT</span></td>
                      <td className="py-3 px-4">Main Gate Terminal B</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">✓ Marked Present (Period 1)</td>
                    </tr>
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900">Yesterday</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">07:34 AM</td>
                      <td className="py-3 px-4 font-mono text-gray-600">04:15 PM</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">PRESENT</span></td>
                      <td className="py-3 px-4">Main Gate Terminal B</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">✓ Marked Present</td>
                    </tr>
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900">Wednesday</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-600">07:49 AM</td>
                      <td className="py-3 px-4 font-mono text-gray-600">04:10 PM</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">LATE (4 mins)</span></td>
                      <td className="py-3 px-4">Main Gate Terminal A</td>
                      <td className="py-3 px-4 font-semibold text-amber-600">Marked Late</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Subtab 3: Transport & Bus GPS Corridor */}
      {activeTab === 'transport' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">School Bus Route & Live Fleet Tracking</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Route assigned to {activeWard?.name} with live GPS beacon.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold">
                <TruckIcon className="w-4 h-4" /> Route 4 · Lekki-Ikoyi Expressway
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Assigned Bus</span>
                <p className="text-xl font-bold text-gray-900">Bus 08 (Toyota Coaster)</p>
                <p className="text-xs font-mono text-gray-600">Plate: KJA-482-XA</p>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Capacity: 32 Learners</span>
                  <span className="text-emerald-600 font-bold">AC Verified</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Driver & Route Warden</span>
                <p className="text-xl font-bold text-gray-900">Mr. Tunde Lawal</p>
                <p className="text-xs text-gray-600">Certified Driver · 8 Years Service</p>
                <div className="pt-2 border-t border-gray-200 flex items-center gap-2 text-xs">
                  <a
                    href="tel:+2348031122334"
                    className="text-[#146ef5] font-bold flex items-center gap-1 hover:underline"
                  >
                    <PhoneIcon className="w-3.5 h-3.5" /> Call Driver (+234 803 112 2334)
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Your Pickup & Drop Stop</span>
                <p className="text-xl font-bold text-gray-900">Admiralty Way Junction</p>
                <p className="text-xs text-gray-600">Morning Pickup: 06:45 AM · Afternoon Drop: 04:35 PM</p>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-bold">● Route Completed Morning Run</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Route Stops */}
            <div className="mt-6 p-4.5 rounded-xl border border-blue-100 bg-blue-50/40">
              <h4 className="text-xs font-bold text-blue-900 mb-2">Corridor Progress Checkpoints</h4>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600">
                <span className="font-semibold text-emerald-700">✓ Stop 1: Chevron Toll Gate (06:30 AM)</span>
                <span className="font-semibold text-emerald-700">✓ Stop 2: Admiralty Way (06:45 AM)</span>
                <span className="font-semibold text-emerald-700">✓ Stop 3: Falomo Bridge (07:05 AM)</span>
                <span className="font-semibold text-emerald-700">✓ Arrived Campus Gate (07:25 AM)</span>
              </div>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Subtab 4: Child Safeguarding & Security PIN */}
      {activeTab === 'security' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Child Safeguarding & Authorized Pickup</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Only guardians presenting this dynamic PIN or verified QR pass may pick up {activeWard?.name}.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <ShieldCheckIcon className="w-4 h-4" /> Gate Child Protection Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-6 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 flex flex-col items-center justify-center text-center space-y-3">
                <QrCodeIcon className="w-16 h-16 text-[#146ef5]" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dynamic Pickup Security Token</span>
                <p className="text-4xl font-mono font-extrabold tracking-widest text-gray-900">
                  {activeWard?.pickup_pin || '849201'}
                </p>
                <p className="text-xs text-gray-500 max-w-xs">
                  Present this code to the Security Marshall at Gate A or B during after-school dismissal.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Authorized Pickup Delegates</h4>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{parent.name} (Primary Parent)</p>
                      <p className="text-[11px] text-gray-500">Mother · {parent.phone}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">PRIMARY</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">Dr. Emeka Okonkwo</p>
                      <p className="text-[11px] text-gray-500">Father · +234 802 889 1234</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#146ef5] text-[10px] font-bold">AUTHORIZED</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">Miss Grace Bassey</p>
                      <p className="text-[11px] text-gray-500">Family Driver / Chauffeur · +234 814 300 9988</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">DELEGATE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Subtab 5: Infirmary & Clinic Health Records */}
      {activeTab === 'clinic' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Medical History & Clinic Visit Logs</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Maintained by School Matron and Campus Clinic Physician.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">Blood Group: O+</span>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold">Genotype: AA</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Active Allergies / Warnings</span>
                <p className="text-sm font-bold text-gray-900 mt-1">Peanuts & Penicillin</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Flagged in Dining Hall & Clinic</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Duty Nurse on Call</span>
                <p className="text-sm font-bold text-gray-900 mt-1">Nurse Folashade Adeleke (RN)</p>
                <p className="text-[11px] text-[#146ef5] font-semibold mt-0.5">Infirmary Wing A · Ext: 104</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Recent Health Status</span>
                <p className="text-sm font-bold text-emerald-700 mt-1">Fit & Active</p>
                <p className="text-[11px] text-gray-400 mt-0.5">No active clinic admissions</p>
              </div>
            </div>

            {/* Clinic Visits Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Clinic Visit History</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Symptoms / Reason</th>
                      <th className="py-3 px-4">Triage Priority</th>
                      <th className="py-3 px-4">Diagnosis & Care Given</th>
                      <th className="py-3 px-4">Attending Nurse</th>
                      <th className="py-3 px-4">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900">08 Nov 2026</td>
                      <td className="py-3 px-4">Mild Headache & Dehydration during Sports</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">LOW</span></td>
                      <td className="py-3 px-4 font-medium">Oral hydration therapy + 1 hr observation bed rest</td>
                      <td className="py-3 px-4">Nurse Folashade</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">DISCHARGED TO CLASS</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Subtab 6: Hostel & Exeat Passes */}
      {activeTab === 'hostel' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Boarding Hostel & Digital Exeat Authorizations</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Dormitory allocations and parent-approved exit clearances for boarders.
                </p>
              </div>
              <button
                onClick={() => setIsExeatModalOpen(true)}
                className="px-4 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <PlusIcon className="w-4 h-4" />
                Request Digital Exeat
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Dormitory Hall</span>
                <p className="text-xl font-bold text-gray-900 mt-1">Nelson Mandela Hall</p>
                <p className="text-xs text-gray-500 mt-0.5">Room 14 · Bed 02 (Top Bunk)</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Housemaster on Duty</span>
                <p className="text-xl font-bold text-gray-900 mt-1">Mr. Babatunde Alabi</p>
                <p className="text-xs text-gray-500 mt-0.5">Senior Housemaster · Block B</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Current Exeat Status</span>
                <p className="text-xl font-bold text-emerald-700 mt-1">In Residence</p>
                <p className="text-xs text-gray-500 mt-0.5">No active overnight passes</p>
              </div>
            </div>

            {/* Exeat History */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Exeat History</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Exeat ID</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Departure Date</th>
                      <th className="py-3 px-4">Expected Return</th>
                      <th className="py-3 px-4">Approval Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">EXT-2026-081</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">WEEKEND</span></td>
                      <td className="py-3 px-4 font-medium">Family Wedding Ceremony in Ikeja</td>
                      <td className="py-3 px-4">24 Oct 2026 (04:00 PM)</td>
                      <td className="py-3 px-4">26 Oct 2026 (06:00 PM)</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">COMPLETED & RETURNED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Subtab 7: Tuck Shop & Cafeteria Cashless Wallet */}
      {activeTab === 'cafeteria' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Cashless Tuck Shop & Cafeteria Wallet</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Meal plan allowance, daily spending limits, and itemized POS purchases.
                </p>
              </div>
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <PlusIcon className="w-4 h-4" />
                Top-Up Wallet
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50">
                <span className="text-[11px] font-bold text-purple-700 uppercase">Available Cashless Balance</span>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  ₦{Number(activeWard?.wallet_balance || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Card ID: POS-TUCK-{activeWard?.admission_number || '001'}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Daily Spending Limit</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">₦2,500 / Day</p>
                <p className="text-xs text-gray-500 mt-1">Configured by Parent</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Cafeteria Dietary Tag</span>
                <p className="text-2xl font-bold text-emerald-700 mt-1">Standard + No Nut</p>
                <p className="text-xs text-gray-500 mt-1">Kitchen POS Alert Active</p>
              </div>
            </div>

            {/* Consumption History */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Recent Cafeteria POS Ledger</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Terminal</th>
                      <th className="py-3 px-4">Items Purchased</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Balance After</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-medium text-gray-900">Today, 01:15 PM</td>
                      <td className="py-3 px-4">Tuck Shop POS 1</td>
                      <td className="py-3 px-4">Jollof Rice & Roasted Chicken + Fresh Orange Juice</td>
                      <td className="py-3 px-4 font-bold text-gray-900">₦1,400</td>
                      <td className="py-3 px-4 font-mono font-semibold text-gray-600">₦18,600</td>
                    </tr>
                    <tr className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-medium text-gray-900">Yesterday, 10:45 AM</td>
                      <td className="py-3 px-4">Cafeteria Pastry Stand</td>
                      <td className="py-3 px-4">Meat Pie & Maltina</td>
                      <td className="py-3 px-4 font-bold text-gray-900">₦950</td>
                      <td className="py-3 px-4 font-mono font-semibold text-gray-600">₦20,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Subtab 8: Campus Notices & Circulars */}
      {activeTab === 'notices' && (
        <MotionRise delay={0.15} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Official School Circulars & Notices</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Direct administrative communications from the Principal and Executive Board.
                </p>
              </div>
              <span className="text-xs font-bold text-[#146ef5]">2026/2027 Academic Year</span>
            </div>

            <div className="space-y-3.5 mt-5">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">URGENT</span>
                    <h4 className="text-xs font-bold text-gray-900">First Term Mid-Term Assessment Schedule & Portal Clearances</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Parents and guardians are reminded that the Mid-Term CBT assessments for SSS 1 to SSS 3 commence on Monday, 24th November 2026. Please verify fee clearances on the Bursary tab.
                  </p>
                  <p className="text-[11px] text-gray-400">Published by Office of the Principal · Yesterday</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">PTA MEETING</span>
                    <h4 className="text-xs font-bold text-gray-900">Annual General PTA Congress & Career Mentorship Day</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Join us this Saturday, 29th November at 10:00 AM in the Campus Main Auditorium. Virtual streaming will also be accessible.
                  </p>
                  <p className="text-[11px] text-gray-400">Published by PTA Secretariat · 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </MotionRise>
      )}

      {/* Paystack Bursary Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="text-base font-bold text-gray-900">Paystack Bursary Gateway</h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">Student Ward</label>
                <input
                  type="text"
                  disabled
                  value={`${activeWard?.name} (${activeWard?.class_name})`}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Fee Category</label>
                <select
                  value={payCategory}
                  onChange={(e) => setPayCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                >
                  <option value="Tuition & Academic Term">Tuition & Academic Term Fee</option>
                  <option value="Laboratory & Practical Consumables">Laboratory & Practical Consumables</option>
                  <option value="ICT & Computer Science Levy">ICT & Computer Science Levy</option>
                  <option value="Hostel & Boarding Upkeep">Hostel & Boarding Upkeep</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Payment Amount (₦)</label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-gray-800">₦{payAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-bold text-emerald-600">₦0.00 (Zero Fee)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={paying}
                className="w-full py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {paying ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CreditCardIcon className="w-4 h-4" />}
                {paying ? 'Authorizing Paystack Switch...' : `Pay ₦${payAmount.toLocaleString()} Securely`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Top-Up Modal */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <BuildingStorefrontIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-gray-900">Top-Up Tuck Shop Wallet</h3>
              </div>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTopupWallet} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">Student Ward</label>
                <input
                  type="text"
                  disabled
                  value={`${activeWard?.name} · Balance: ₦${Number(activeWard?.wallet_balance || 0).toLocaleString()}`}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Top-up Amount (₦)</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[5000, 10000, 20000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setWalletAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        walletAmount === amt
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(Number(e.target.value))}
                  className="w-full mt-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  placeholder="Or enter custom amount"
                />
              </div>

              <button
                type="submit"
                disabled={fundingWallet}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {fundingWallet ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
                {fundingWallet ? 'Funding Meal Account...' : `Credit ₦${walletAmount.toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital Exeat Request Modal */}
      {isExeatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <BuildingOffice2Icon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="text-base font-bold text-gray-900">Request Digital Boarder Exeat</h3>
              </div>
              <button
                onClick={() => setIsExeatModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExeatSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">Student Ward</label>
                <input
                  type="text"
                  disabled
                  value={`${activeWard?.name} (${activeWard?.class_name})`}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Exeat Type</label>
                <select
                  value={exeatType}
                  onChange={(e) => setExeatType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                >
                  <option value="WEEKEND">Weekend Family Pass</option>
                  <option value="MEDICAL">Medical Treatment / Specialist Visit</option>
                  <option value="SPECIAL">Special Academic / Event Exeat</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Reason & Destination</label>
                <textarea
                  required
                  rows={3}
                  value={exeatReason}
                  onChange={(e) => setExeatReason(e.target.value)}
                  placeholder="State purpose of departure, pickup guardian, and emergency location..."
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={exeatDeparture}
                    onChange={(e) => setExeatDeparture(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Expected Return</label>
                  <input
                    type="date"
                    required
                    value={exeatReturn}
                    onChange={(e) => setExeatReturn(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingExeat}
                className="w-full py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submittingExeat ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                {submittingExeat ? 'Submitting Authorization...' : 'Submit Exeat Request to Housemaster'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParentCampusOSPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
          <ArrowPathIcon className="w-4 h-4 animate-spin text-[#146ef5]" /> Loading Parent Campus Operations...
        </div>
      }
    >
      <ParentCampusOSContent />
    </Suspense>
  );
}

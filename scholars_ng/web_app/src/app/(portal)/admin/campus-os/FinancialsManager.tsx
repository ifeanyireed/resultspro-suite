'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PrinterIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BoltIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ClockIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftEllipsisIcon,
  ReceiptPercentIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

/**
 * Robust currency formatter for Nigerian Naira figures.
 * Safely guards against undefined, null, or non-numeric inputs.
 */
export const formatNaira = (val?: number | string | null): string => {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'number' ? val : Number(val);
  return isNaN(num) ? '0' : num.toLocaleString();
};

export interface FeeStructure {
  id: string;
  tenant_id: string;
  title: string;
  category: string;
  class_level: string;
  term_name: string;
  term?: string;
  session?: string;
  amount: number;
  tuition_fee?: number;
  development_levy?: number;
  ict_stem_fee?: number;
  exam_materials_fee?: number;
  total_due?: number;
  is_mandatory: boolean;
  due_date: string;
  created_at?: string;
}

export interface StudentInvoice {
  id: string;
  tenant_id: string;
  invoice_no: string;
  student_id: string;
  admission_number: string;
  student_name: string;
  class_id?: string;
  class_name: string;
  arm_id?: string;
  arm_name?: string;
  term_name: string;
  term?: string;
  session?: string;
  tuition_fee?: number;
  development_levy?: number;
  ict_stem_fee?: number;
  exam_materials_fee?: number;
  other_charges?: number;
  discount_amount?: number;
  total_billed: number;
  amount_paid: number;
  balance_due: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE' | string;
  payment_method: string;
  payment_reference?: string;
  due_date: string;
  parent_name?: string;
  parent_phone?: string;
  last_payment_at?: string;
  created_at?: string;
}

export interface FeePayment {
  id: string;
  tenant_id: string;
  invoice_id: string;
  student_id: string;
  student_name: string;
  admission_number: string;
  class_name: string;
  amount: number;
  payment_method: string;
  reference: string;
  receipt_no: string;
  paid_by: string;
  recorded_by: string;
  payment_date: string;
  status: string;
  notes?: string;
  created_at?: string;
}

export interface FinancialSummary {
  total_collected: number;
  total_billed: number;
  total_outstanding: number;
  collection_rate: number;
  invoices_count: number;
  cleared_count: number;
  pending_count: number;
  critical_debtors_count: number;
  structures_count: number;
  payments_count: number;
}

export interface EnrolledStudentMeta {
  student_id: string;
  student_name: string;
  admission_number: string;
  arm_id: string;
  arm_name: string;
  class_name: string;
}

export interface ClassArmMeta {
  arm_id: string;
  arm_name: string;
  class_name: string;
  enrolled: number;
}

type FinancialSubtab = 'overview' | 'structures' | 'invoices' | 'payments' | 'debtors';

export default function FinancialsManager() {
  const [subtab, setSubtab] = useState<FinancialSubtab>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Core Data
  const [summary, setSummary] = useState<FinancialSummary>({
    total_collected: 0,
    total_billed: 0,
    total_outstanding: 0,
    collection_rate: 100,
    invoices_count: 0,
    cleared_count: 0,
    pending_count: 0,
    critical_debtors_count: 0,
    structures_count: 0,
    payments_count: 0,
  });
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [debtors, setDebtors] = useState<any[]>([]);
  const [studentsMeta, setStudentsMeta] = useState<EnrolledStudentMeta[]>([]);
  const [classArmsMeta, setClassArmsMeta] = useState<ClassArmMeta[]>([]);

  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  // Modals
  const [showIssueInvoiceModal, setShowIssueInvoiceModal] = useState(false);
  const [showBulkBillModal, setShowBulkBillModal] = useState(false);
  const [showNewStructureModal, setShowNewStructureModal] = useState(false);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<StudentInvoice | null>(null);
  const [receiptModalPayment, setReceiptModalPayment] = useState<{ invoice: StudentInvoice; payment?: FeePayment; receiptNo: string } | null>(null);
  const [clearanceModalInvoice, setClearanceModalInvoice] = useState<StudentInvoice | null>(null);

  // Forms State
  const [newInvoice, setNewInvoice] = useState({
    student_id: '',
    admission_number: '',
    student_name: '',
    class_id: '',
    class_name: 'SS 2 Science',
    arm_id: '',
    arm_name: '',
    term_name: 'First Term',
    session: '2026/2027',
    tuition_fee: 180000,
    development_levy: 25000,
    ict_stem_fee: 15000,
    exam_materials_fee: 10000,
    other_charges: 0,
    discount_amount: 0,
    total_billed: 230000,
    amount_paid: 0,
    due_date: '2026-11-30',
    payment_method: 'Paystack DVA',
    parent_name: '',
    parent_phone: '',
  });

  const [bulkBillForm, setBulkBillForm] = useState({
    arm_id: '',
    fee_structure_id: '',
    term_name: 'First Term',
    session: '2026/2027',
    due_date: '2026-12-10',
  });

  const [newStructure, setNewStructure] = useState({
    title: '',
    category: 'TUITION',
    class_level: '',
    term_name: 'First Term',
    session: '2026/2027',
    tuition_fee: 200000,
    development_levy: 30000,
    ict_stem_fee: 20000,
    exam_materials_fee: 15000,
    total_due: 265000,
    is_mandatory: true,
    due_date: '2026-12-01',
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    payment_method: 'Paystack DVA',
    reference: '',
    paid_by: '',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Load Financials directly from Tenant-aware Database
  const loadFinancials = useCallback(async () => {
    setLoading(true);
    setErrorBanner(null);
    try {
      const qs = typeof window !== 'undefined' && window.location.search ? window.location.search : '';
      const res = await api.get(`/v1/campus/fees${qs}`).catch(async () => {
        return await api.get(`/campus/fees${qs}`);
      });
      const data = res.data;
      if (data) {
        if (data.summary) setSummary(data.summary);
        if (data.fee_structures && Array.isArray(data.fee_structures)) {
          // Normalize fee structure numbers so tuition_fee / total_due are never undefined
          const normalized = (data.fee_structures as FeeStructure[]).map((s) => ({
            ...s,
            tuition_fee: Number(s.tuition_fee ?? s.amount ?? 0),
            development_levy: Number(s.development_levy ?? 0),
            ict_stem_fee: Number(s.ict_stem_fee ?? 0),
            exam_materials_fee: Number(s.exam_materials_fee ?? 0),
            total_due: Number(s.total_due ?? s.amount ?? 0),
          }));
          setFeeStructures(normalized);
        }
        if (data.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices);
        if (data.payments && Array.isArray(data.payments)) setPayments(data.payments);
        if (data.debtors && Array.isArray(data.debtors)) setDebtors(data.debtors);
        if (data.students && Array.isArray(data.students)) setStudentsMeta(data.students);
        if (data.class_arms && Array.isArray(data.class_arms)) setClassArmsMeta(data.class_arms);
      }
    } catch (err: any) {
      console.error('Failed to load campus fees:', err);
      setErrorBanner(err?.response?.data?.error || 'Failed to load financial records from database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFinancials();
  }, [loadFinancials]);

  // Handle student selection in Issue Invoice Modal to auto-fill details
  const handleStudentSelect = (studentId: string) => {
    const found = studentsMeta.find((s) => s.student_id === studentId);
    if (found) {
      setNewInvoice((prev) => ({
        ...prev,
        student_id: found.student_id,
        student_name: found.student_name,
        admission_number: found.admission_number,
        arm_id: found.arm_id,
        arm_name: found.arm_name,
        class_name: found.class_name ? `${found.class_name} (${found.arm_name})` : found.arm_name,
      }));
    }
  };

  // Recalculate New Invoice Total
  const updateInvoiceTotal = (tuition: number, dev: number, ict: number, exam: number, other: number, discount: number) => {
    const total = (tuition + dev + ict + exam + other) - discount;
    setNewInvoice((prev) => ({
      ...prev,
      tuition_fee: tuition,
      development_levy: dev,
      ict_stem_fee: ict,
      exam_materials_fee: exam,
      other_charges: other,
      discount_amount: discount,
      total_billed: Math.max(0, total),
    }));
  };

  // Handle Issue Single Invoice Submission
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.student_name) {
      setErrorBanner('Student Name is required to issue invoice.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/v1/campus/fees', {
        action: 'create_invoice',
        record_type: 'invoice',
        ...newInvoice,
        total_billed: Number(newInvoice.total_billed),
        amount_paid: Number(newInvoice.amount_paid),
      });
      setShowIssueInvoiceModal(false);
      setSuccessBanner(`Invoice successfully issued for ${newInvoice.student_name}`);
      await loadFinancials();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to create student fee invoice.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Bulk Generation
  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkBillForm.arm_id || !bulkBillForm.fee_structure_id) {
      setErrorBanner('Please select both a target class arm and a fee tariff structure.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/v1/campus/fees', {
        action: 'bulk_generate_invoices',
        ...bulkBillForm,
      });
      setShowBulkBillModal(false);
      setSuccessBanner(res.data?.message || 'Bulk class invoices generated successfully.');
      await loadFinancials();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to generate bulk class invoices.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Fee Structure Creation
  const handleCreateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStructure.title || !newStructure.class_level) {
      setErrorBanner('Structure title and class level are required.');
      return;
    }
    setSaving(true);
    try {
      const total =
        Number(newStructure.tuition_fee) +
        Number(newStructure.development_levy) +
        Number(newStructure.ict_stem_fee) +
        Number(newStructure.exam_materials_fee);

      await api.post('/v1/campus/fees', {
        action: 'create_structure',
        record_type: 'structure',
        ...newStructure,
        total_due: total,
        amount: total,
      });
      setShowNewStructureModal(false);
      setSuccessBanner(`Fee Tariff Structure '${newStructure.title}' saved.`);
      await loadFinancials();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to save fee structure.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Recording Payment / Installment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;
    if (paymentForm.amount <= 0) {
      setErrorBanner('Payment amount must be greater than zero.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/v1/campus/fees', {
        action: 'record_payment',
        invoice_id: paymentModalInvoice.id,
        amount: Number(paymentForm.amount),
        payment_method: paymentForm.payment_method,
        reference: paymentForm.reference,
        paid_by: paymentForm.paid_by || paymentModalInvoice.parent_name || paymentModalInvoice.student_name,
        payment_date: paymentForm.payment_date,
        notes: paymentForm.notes,
      });

      const receiptNo = res.data?.receipt_no || `REC-${Date.now().toString().slice(-6)}`;
      setSuccessBanner(res.data?.message || 'Payment recorded successfully.');
      
      // Open Official Receipt Preview
      setReceiptModalPayment({
        invoice: {
          ...paymentModalInvoice,
          amount_paid: paymentModalInvoice.amount_paid + Number(paymentForm.amount),
          balance_due: Math.max(0, paymentModalInvoice.balance_due - Number(paymentForm.amount)),
        },
        receiptNo,
      });

      setPaymentModalInvoice(null);
      setPaymentForm({
        amount: 0,
        payment_method: 'Paystack DVA',
        reference: '',
        paid_by: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      await loadFinancials();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to record payment transaction.');
    } finally {
      setSaving(false);
    }
  };

  // Delete invoice or structure
  const handleDeleteInvoice = async (invId: string) => {
    if (!confirm('Are you sure you want to delete this invoice and associated payment records?')) return;
    try {
      await api.delete(`/v1/campus/fees?id=${encodeURIComponent(invId)}&type=invoice`);
      setSuccessBanner('Invoice deleted successfully.');
      await loadFinancials();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to delete invoice.');
    }
  };

  const handleDeleteStructure = async (structId: string) => {
    if (!confirm('Are you sure you want to delete this fee tariff structure?')) return;
    try {
      await api.delete(`/v1/campus/fees?id=${encodeURIComponent(structId)}&type=structure`);
      setSuccessBanner('Fee structure deleted successfully.');
      await loadFinancials();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to delete fee structure.');
    }
  };

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.admission_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchClass = classFilter === 'ALL' || inv.class_name.includes(classFilter) || (inv.arm_name && inv.arm_name.includes(classFilter));
      return matchSearch && matchStatus && matchClass;
    });
  }, [invoices, searchTerm, statusFilter, classFilter]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      return (
        p.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.receipt_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [payments, searchTerm]);

  // Subtab Config
  const subtabs: { id: FinancialSubtab; label: string; icon: any; count?: string }[] = [
    { id: 'overview', label: 'Overview & Pulse', icon: BanknotesIcon, count: 'Pulse' },
    { id: 'structures', label: 'Fee Structures', icon: CreditCardIcon, count: `${feeStructures.length}` },
    { id: 'invoices', label: 'Student Invoices', icon: DocumentTextIcon, count: `${invoices.length}` },
    { id: 'payments', label: 'Payment Ledger', icon: ReceiptPercentIcon, count: `${payments.length}` },
    { id: 'debtors', label: 'Debtors & Clearance', icon: ExclamationTriangleIcon, count: `${debtors.length}` },
  ];

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {errorBanner && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-rose-500 hover:text-rose-700">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-500 hover:text-emerald-700">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bursary Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Institutional Bursary &amp; Financials</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5] border border-blue-200">
              Tenant-Aware Postgres
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage tuition billing schedules, automated DVA settlements, installment payments, and exam clearance.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowIssueInvoiceModal(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Issue Student Invoice
          </button>
          <button
            onClick={() => setShowBulkBillModal(true)}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <DocumentDuplicateIcon className="w-4 h-4 text-[#146ef5]" />
            Bulk Class Billing
          </button>
          <button
            onClick={() => setShowNewStructureModal(true)}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCardIcon className="w-4 h-4 text-[#FBBC04]" />
            New Fee Tariff
          </button>
          <button
            onClick={loadFinancials}
            disabled={loading}
            className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm transition-all cursor-pointer"
            title="Refresh database records"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-[#146ef5]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Subtab Navigation Pill Bar */}
      <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex items-center gap-1.5 bg-gray-100/90 rounded-full p-1 border border-gray-200/70">
          {subtabs.map((tab) => {
            const Icon = tab.icon;
            const active = subtab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubtab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-[#146ef5] shadow-sm border border-gray-200/60'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      active ? 'bg-blue-50 text-[#146ef5] font-bold' : 'bg-white/70 text-gray-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: OVERVIEW & BURSARY HEALTH PULSE */}
      {subtab === 'overview' && (
        <div className="space-y-6">
          {/* Executive 4-Quadrant Metric Cards */}
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MotionRise className="bg-gradient-to-br from-[#146ef5] to-[#0D1060] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start z-10">
                <h3 className="text-xl font-normal text-white">Gross Collections</h3>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ArrowUpRightIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="z-10">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                  ₦{formatNaira(summary.total_collected)}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                    <ArrowTrendingUpIcon className="w-3 h-3 text-[#FBBC04]" /> {summary.collection_rate || 0}% Collected
                  </div>
                  <span>Verified Settlements</span>
                </div>
              </div>
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Total Billed</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                  <DocumentTextIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2">
                  ₦{formatNaira(summary.total_billed)}
                </h2>
                <div className="text-xs text-gray-500">Across {summary.invoices_count || 0} term invoices</div>
              </div>
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Outstanding Debt</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-rose-500">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-rose-600 mb-2">
                  ₦{formatNaira(summary.total_outstanding)}
                </h2>
                <div className="text-xs text-gray-500">
                  {summary.pending_count || 0} pending invoices ({summary.critical_debtors_count || 0} critical &gt; ₦100k)
                </div>
              </div>
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Active Tariffs</h3>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#146ef5]">
                  <CreditCardIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
                  {summary.structures_count || 0} Tiers
                </h2>
                <div className="text-xs text-gray-500">Junior, Senior &amp; STEM Packages</div>
              </div>
            </MotionRise>
          </MotionStagger>

          {/* Quick Shortcuts & Recent Settlement Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">Recent Bank &amp; DVA Settlements</h3>
                <button
                  onClick={() => setSubtab('payments')}
                  className="text-xs font-bold text-[#146ef5] hover:underline"
                >
                  View All ({payments.length}) →
                </button>
              </div>

              {payments.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  No payment settlements recorded in database yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {payments.slice(0, 5).map((pay) => (
                    <div key={pay.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          ₦
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-900">{pay.student_name}</div>
                          <div className="text-[10px] text-gray-500">
                            {pay.receipt_no} · {pay.payment_method} · {pay.class_name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-700">+₦{formatNaira(pay.amount)}</div>
                        <div className="text-[10px] text-gray-400">{pay.payment_date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bursary Action Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[1.5rem] p-6 text-white flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FBBC04] mb-3">
                  <ClipboardDocumentCheckIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Exam Clearance Protocol</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Generate stamped admit-to-exam cards for students who have fully cleared or satisfied institutional payment thresholds.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => setSubtab('debtors')}
                  className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  Review Defaulters &amp; Debtors
                </button>
                <button
                  onClick={() => setSubtab('invoices')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer"
                >
                  Browse Invoices Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FEE STRUCTURES & CLASS TARIFF SCHEDULES */}
      {subtab === 'structures' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Class Fee Schedules &amp; Levies</h3>
              <p className="text-xs text-gray-500">
                Configured termly billing templates partitioned by class tier.
              </p>
            </div>
            <button
              onClick={() => setShowNewStructureModal(true)}
              className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              Add Fee Schedule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeStructures.map((struct) => (
              <div
                key={struct.id}
                className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#146ef5] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {struct.category}
                      </span>
                      <h4 className="text-base font-bold text-gray-900 mt-2">{struct.title}</h4>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {struct.class_level} · {struct.term_name}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStructure(struct.id)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete Structure"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Breakdown lines */}
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Tuition Fee</span>
                      <span className="font-semibold text-gray-800">₦{formatNaira(struct.tuition_fee ?? struct.amount)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Development Levy</span>
                      <span className="font-semibold text-gray-800">₦{formatNaira(struct.development_levy)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>ICT / Coding STEM</span>
                      <span className="font-semibold text-gray-800">₦{formatNaira(struct.ict_stem_fee)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Exam Materials</span>
                      <span className="font-semibold text-gray-800">₦{formatNaira(struct.exam_materials_fee)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Total Package</div>
                    <div className="text-lg font-bold text-[#146ef5]">₦{formatNaira(struct.total_due ?? struct.amount)}</div>
                  </div>
                  {struct.due_date && (
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">Due Date</div>
                      <div className="text-xs font-semibold text-gray-700">{struct.due_date}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: STUDENT INVOICES LEDGER & BILLING */}
      {subtab === 'invoices' && (
        <div className="space-y-4">
          {/* Search & Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student name, invoice #, admission ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              {/* Status Selector */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">PAID</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="UNPAID">UNPAID</option>
              </select>

              {/* Class Filter */}
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Class Arms</option>
                {classArmsMeta.map((a) => (
                  <option key={a.arm_id} value={a.arm_name}>
                    {a.class_name} · {a.arm_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-semibold text-gray-500 self-end sm:self-auto">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Student &amp; Class</th>
                    <th className="px-6 py-4">Total Billed</th>
                    <th className="px-6 py-4">Amount Paid</th>
                    <th className="px-6 py-4">Balance Due</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        No student invoices found matching the current search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[#146ef5]">
                          {inv.invoice_no}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-sm text-gray-900">{inv.student_name}</div>
                          <div className="text-[11px] text-gray-500">
                            {inv.admission_number ? `${inv.admission_number} · ` : ''}{inv.class_name} · {inv.term_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ₦{formatNaira(inv.total_billed)}
                        </td>
                        <td className="px-6 py-4 font-medium text-emerald-700">
                          ₦{formatNaira(inv.amount_paid)}
                        </td>
                        <td className="px-6 py-4 font-medium text-rose-600">
                          ₦{formatNaira(inv.balance_due)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700'
                                : inv.status === 'PARTIAL'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {inv.status !== 'PAID' && (
                              <button
                                onClick={() => {
                                  setPaymentModalInvoice(inv);
                                  setPaymentForm((prev) => ({
                                    ...prev,
                                    amount: inv.balance_due,
                                    paid_by: inv.parent_name || inv.student_name,
                                  }));
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#146ef5] text-white font-bold hover:bg-[#105bd1] transition-all cursor-pointer"
                              >
                                Record Pay
                              </button>
                            )}

                            {inv.amount_paid > 0 && (
                              <button
                                onClick={() =>
                                  setReceiptModalPayment({
                                    invoice: inv,
                                    receiptNo: `REC-2026-${inv.invoice_no.split('-')[2] || '001'}`,
                                  })
                                }
                                className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                title="Print Official Receipt"
                              >
                                <PrinterIcon className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => setClearanceModalInvoice(inv)}
                              className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              title="Exam Clearance Pass"
                            >
                              <ClipboardDocumentCheckIcon className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteInvoice(inv.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                              title="Delete Invoice"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: PAYMENT TRANSACTION LEDGER */}
      {subtab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-sm">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search payer, receipt #, student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
              />
            </div>
            <div className="text-xs font-semibold text-gray-500">
              {filteredPayments.length} verified settlements in ledger
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Receipt #</th>
                  <th className="px-6 py-4">Student &amp; Class</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Reference / Teller</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No payment settlements recorded in database yet.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#146ef5]">
                        {pay.receipt_no}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{pay.student_name}</div>
                        <div className="text-[11px] text-gray-500">{pay.class_name}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-700">
                        ₦{formatNaira(pay.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5]">
                          {pay.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600">
                        {pay.reference || '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {pay.payment_date}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            const inv = invoices.find((i) => i.id === pay.invoice_id) || {
                              id: pay.invoice_id,
                              tenant_id: pay.tenant_id,
                              invoice_no: 'INV-RECORDED',
                              student_id: pay.student_id,
                              admission_number: pay.admission_number,
                              student_name: pay.student_name,
                              class_name: pay.class_name,
                              term_name: 'Current Term',
                              tuition_fee: pay.amount,
                              development_levy: 0,
                              ict_stem_fee: 0,
                              exam_materials_fee: 0,
                              other_charges: 0,
                              discount_amount: 0,
                              total_billed: pay.amount,
                              amount_paid: pay.amount,
                              balance_due: 0,
                              status: 'PAID',
                              payment_method: pay.payment_method,
                              due_date: pay.payment_date,
                            };
                            setReceiptModalPayment({
                              invoice: inv,
                              payment: pay,
                              receiptNo: pay.receipt_no,
                            });
                          }}
                          className="text-xs font-bold text-[#146ef5] hover:underline cursor-pointer"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 5: DEBTORS LEDGER & EXAM CLEARANCE RECOVERY */}
      {subtab === 'debtors' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900 font-medium">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>{debtors.length} students</strong> currently have outstanding tuition balances. Contact parents directly or generate exam clearance cards.
              </span>
            </div>
            <div className="font-bold text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-xl">
              Total Defaulters Debt: ₦{formatNaira(summary.total_outstanding)}
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Student &amp; Admission #</th>
                  <th className="px-6 py-4">Class Arm</th>
                  <th className="px-6 py-4">Total Billed</th>
                  <th className="px-6 py-4">Balance Owed</th>
                  <th className="px-6 py-4">Aging Risk</th>
                  <th className="px-6 py-4">Parent Phone Contact</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {debtors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Zero defaulters! All active invoices are fully settled.
                    </td>
                  </tr>
                ) : (
                  debtors.map((d: any) => (
                    <tr key={d.invoice_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{d.student_name}</div>
                        <div className="text-[11px] text-gray-500">{d.admission_number || d.invoice_no}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{d.class_name}</td>
                      <td className="px-6 py-4 text-gray-900">₦{formatNaira(d.total_billed)}</td>
                      <td className="px-6 py-4 font-bold text-rose-600">
                        ₦{formatNaira(d.balance_due)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            d.aging_category?.includes('Critical')
                              ? 'bg-rose-50 text-rose-700'
                              : d.aging_category?.includes('Overdue')
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {d.aging_category || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{d.parent_name || 'Guardian'}</div>
                        <div className="text-gray-500 font-mono text-[11px]">{d.parent_phone || '+234 800 000 0000'}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              const text = `Dear Parent, please be reminded of the outstanding tuition balance of ₦${formatNaira(
                                d.balance_due
                              )} for ${d.student_name} (${d.class_name}). Examination clearance begins shortly. Kindly settle via the school portal or bursary. Thank you.`;
                              navigator.clipboard.writeText(text);
                              alert('SMS / WhatsApp payment reminder copied to clipboard!');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-[11px] font-semibold transition-colors"
                            title="Copy reminder text"
                          >
                            Copy Reminder
                          </button>
                          <button
                            onClick={() => {
                              const inv = invoices.find((i) => i.id === d.invoice_id);
                              if (inv) setClearanceModalInvoice(inv);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#146ef5] text-white hover:bg-[#105bd1] text-[11px] font-semibold transition-colors"
                          >
                            Clearance Slip
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ISSUE SINGLE STUDENT INVOICE */}
      {showIssueInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Issue Student Fee Invoice</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Generate tenant-persisted billing with itemized charges.
                </p>
              </div>
              <button
                onClick={() => setShowIssueInvoiceModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 mt-4">
              {/* Student Picker from DB */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select Enrolled Student (From Database Roster)
                </label>
                <select
                  value={newInvoice.student_id}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                >
                  <option value="">-- Choose from Enrolled Students or enter below --</option>
                  {studentsMeta.map((s) => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.student_name} ({s.class_name} · {s.admission_number})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newInvoice.student_name}
                    onChange={(e) => setNewInvoice({ ...newInvoice, student_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    value={newInvoice.admission_number}
                    onChange={(e) => setNewInvoice({ ...newInvoice, admission_number: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Class Arm</label>
                  <input
                    type="text"
                    required
                    value={newInvoice.class_name}
                    onChange={(e) => setNewInvoice({ ...newInvoice, class_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Term</label>
                  <select
                    value={newInvoice.term_name}
                    onChange={(e) => setNewInvoice({ ...newInvoice, term_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    <option>First Term</option>
                    <option>Second Term</option>
                    <option>Third Term</option>
                  </select>
                </div>
              </div>

              {/* Itemized Fee Breakdown */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Itemized Tariff Breakdown (NGN)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Tuition</label>
                    <input
                      type="number"
                      value={newInvoice.tuition_fee}
                      onChange={(e) =>
                        updateInvoiceTotal(
                          Number(e.target.value),
                          newInvoice.development_levy,
                          newInvoice.ict_stem_fee,
                          newInvoice.exam_materials_fee,
                          newInvoice.other_charges,
                          newInvoice.discount_amount
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Development Levy</label>
                    <input
                      type="number"
                      value={newInvoice.development_levy}
                      onChange={(e) =>
                        updateInvoiceTotal(
                          newInvoice.tuition_fee,
                          Number(e.target.value),
                          newInvoice.ict_stem_fee,
                          newInvoice.exam_materials_fee,
                          newInvoice.other_charges,
                          newInvoice.discount_amount
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">ICT / Coding</label>
                    <input
                      type="number"
                      value={newInvoice.ict_stem_fee}
                      onChange={(e) =>
                        updateInvoiceTotal(
                          newInvoice.tuition_fee,
                          newInvoice.development_levy,
                          Number(e.target.value),
                          newInvoice.exam_materials_fee,
                          newInvoice.other_charges,
                          newInvoice.discount_amount
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Exams &amp; Lab</label>
                    <input
                      type="number"
                      value={newInvoice.exam_materials_fee}
                      onChange={(e) =>
                        updateInvoiceTotal(
                          newInvoice.tuition_fee,
                          newInvoice.development_levy,
                          newInvoice.ict_stem_fee,
                          Number(e.target.value),
                          newInvoice.other_charges,
                          newInvoice.discount_amount
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-xs font-bold text-gray-800">Total Billed Due:</span>
                  <span className="text-base font-bold text-[#146ef5]">
                    ₦{formatNaira(newInvoice.total_billed)}
                  </span>
                </div>
              </div>

              {/* Initial Deposit & Parent Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Deposit (₦)</label>
                  <input
                    type="number"
                    value={newInvoice.amount_paid}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount_paid: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={newInvoice.payment_method}
                    onChange={(e) => setNewInvoice({ ...newInvoice, payment_method: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    <option>Paystack DVA</option>
                    <option>Bank Transfer</option>
                    <option>POS Settlement</option>
                    <option>Cash at Bursary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Parent / Payer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Adekunle Adeleke"
                    value={newInvoice.parent_name}
                    onChange={(e) => setNewInvoice({ ...newInvoice, parent_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Parent Phone</label>
                  <input
                    type="text"
                    placeholder="+234 803 000 0000"
                    value={newInvoice.parent_phone}
                    onChange={(e) => setNewInvoice({ ...newInvoice, parent_phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowIssueInvoiceModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#146ef5] hover:bg-[#105bd1] transition-all shadow-sm shadow-[#146ef5]/20"
                >
                  {saving ? 'Issuing Invoice...' : 'Issue Invoice & Save to DB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK CLASS BILLING GENERATOR */}
      {showBulkBillModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Bulk Class Arm Invoicing</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Generate invoices for all enrolled pupils in a class in one click.
                </p>
              </div>
              <button
                onClick={() => setShowBulkBillModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkGenerate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Class Arm (From Database) *
                </label>
                <select
                  required
                  value={bulkBillForm.arm_id}
                  onChange={(e) => setBulkBillForm({ ...bulkBillForm, arm_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
                >
                  <option value="">-- Choose Class Arm --</option>
                  {classArmsMeta.map((a) => (
                    <option key={a.arm_id} value={a.arm_id}>
                      {a.class_name} · {a.arm_name} ({a.enrolled} enrolled students)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Apply Fee Tariff Schedule *
                </label>
                <select
                  required
                  value={bulkBillForm.fee_structure_id}
                  onChange={(e) => setBulkBillForm({ ...bulkBillForm, fee_structure_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
                >
                  <option value="">-- Choose Fee Tariff Template --</option>
                  {feeStructures.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} (₦{formatNaira(f.total_due ?? f.amount)} · {f.class_level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Term</label>
                  <select
                    value={bulkBillForm.term_name}
                    onChange={(e) => setBulkBillForm({ ...bulkBillForm, term_name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    <option>First Term</option>
                    <option>Second Term</option>
                    <option>Third Term</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={bulkBillForm.due_date}
                    onChange={(e) => setBulkBillForm({ ...bulkBillForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-xs text-[#0a2e70] leading-relaxed">
                ℹ️ The system checks the database to skip any student who has already been billed for this term, preventing accidental duplicate invoices.
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBulkBillModal(false)}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#146ef5] hover:bg-[#105bd1] transition-all shadow-sm"
                >
                  {saving ? 'Generating...' : 'Execute Bulk Billing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NEW FEE TARIFF STRUCTURE */}
      {showNewStructureModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">New Fee Tariff Structure</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Define tuition packages by grade/class level.
                </p>
              </div>
              <button
                onClick={() => setShowNewStructureModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStructure} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Structure Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Secondary Science & Lab Fee"
                  value={newStructure.title}
                  onChange={(e) => setNewStructure({ ...newStructure, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Class Level Tier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SS 1-3 Science"
                    value={newStructure.class_level}
                    onChange={(e) => setNewStructure({ ...newStructure, class_level: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newStructure.category}
                    onChange={(e) => setNewStructure({ ...newStructure, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    <option value="TUITION">TUITION</option>
                    <option value="ICT_LEVY">ICT / STEM LEVY</option>
                    <option value="BOARDING">BOARDING &amp; HOSTEL</option>
                    <option value="TRANSPORT">TRANSPORT SHUTTLE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tuition Fee (₦)</label>
                  <input
                    type="number"
                    value={newStructure.tuition_fee}
                    onChange={(e) => setNewStructure({ ...newStructure, tuition_fee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Development Levy (₦)</label>
                  <input
                    type="number"
                    value={newStructure.development_levy}
                    onChange={(e) => setNewStructure({ ...newStructure, development_levy: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ICT / Coding Practical (₦)</label>
                  <input
                    type="number"
                    value={newStructure.ict_stem_fee}
                    onChange={(e) => setNewStructure({ ...newStructure, ict_stem_fee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Exam &amp; Materials (₦)</label>
                  <input
                    type="number"
                    value={newStructure.exam_materials_fee}
                    onChange={(e) => setNewStructure({ ...newStructure, exam_materials_fee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewStructureModal(false)}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#146ef5] hover:bg-[#105bd1] transition-all shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Structure to DB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: RECORD PAYMENT / INSTALLMENT */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Record Fee Payment</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Record installment or settlement for {paymentModalInvoice.student_name}.
                </p>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 mt-4">
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice:</span>
                  <span className="font-mono font-bold text-[#146ef5]">{paymentModalInvoice.invoice_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Billed:</span>
                  <span className="font-semibold text-gray-900">₦{formatNaira(paymentModalInvoice.total_billed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Already Paid:</span>
                  <span className="font-semibold text-emerald-700">₦{formatNaira(paymentModalInvoice.amount_paid)}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-1 font-bold">
                  <span className="text-rose-700">Current Balance Due:</span>
                  <span className="text-rose-700">₦{formatNaira(paymentModalInvoice.balance_due)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Payment Amount to Record (NGN) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={paymentModalInvoice.balance_due}
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option>Paystack DVA</option>
                    <option>Bank Transfer</option>
                    <option>POS Settlement</option>
                    <option>Cash at Bursary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reference / Bank Teller #</label>
                <input
                  type="text"
                  placeholder="e.g. TR-PAY-98124 or Teller 004812"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Payer Name (Parent / Guardian)</label>
                <input
                  type="text"
                  value={paymentForm.paid_by}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paid_by: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20"
                >
                  {saving ? 'Processing...' : 'Confirm Settlement & Print Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PRINTABLE OFFICIAL BURSARY RECEIPT */}
      {receiptModalPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-gray-200 text-gray-900 print:m-0 print:p-4 print:shadow-none">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider mb-2">
                ResultsPRO Scholars Campus ERP
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900">
                Official Bursary Payment Receipt
              </h2>
              <div className="text-xs text-gray-500 mt-0.5">
                Receipt No: <strong className="font-mono text-[#146ef5]">{receiptModalPayment.receiptNo}</strong>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="py-4 space-y-3 text-xs border-b border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500 block">Student Name:</span>
                  <span className="font-bold text-gray-900">{receiptModalPayment.invoice.student_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Admission ID:</span>
                  <span className="font-mono font-semibold text-gray-800">
                    {receiptModalPayment.invoice.admission_number || 'ADM-2026-REG'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500 block">Class &amp; Arm:</span>
                  <span className="font-semibold text-gray-800">{receiptModalPayment.invoice.class_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Academic Term:</span>
                  <span className="font-semibold text-gray-800">{receiptModalPayment.invoice.term_name}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Billed:</span>
                  <span className="font-semibold">₦{formatNaira(receiptModalPayment.invoice.total_billed)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 text-sm">
                  <span>Amount Settled:</span>
                  <span>
                    ₦{formatNaira(receiptModalPayment.payment?.amount || receiptModalPayment.invoice.amount_paid)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-1">
                  <span>Outstanding Balance:</span>
                  <span className="font-bold text-rose-600">
                    ₦{formatNaira(receiptModalPayment.invoice.balance_due)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Channel: {receiptModalPayment.payment?.payment_method || receiptModalPayment.invoice.payment_method}</span>
                <span>Date: {receiptModalPayment.payment?.payment_date || new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>

            {/* Footer with verification stamp line */}
            <div className="pt-4 flex items-center justify-between text-[11px] text-gray-500">
              <div>
                <div>Authorized Signature: __________________</div>
                <div className="text-[10px] text-gray-400 mt-1">Institutional Bursary Desk</div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  VERIFIED SETTLEMENT
                </span>
              </div>
            </div>

            {/* Print Action Buttons */}
            <div className="flex items-center justify-end gap-2 mt-6 print:hidden">
              <button
                onClick={() => setReceiptModalPayment(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#146ef5] hover:bg-[#105bd1] flex items-center gap-1.5"
              >
                <PrinterIcon className="w-4 h-4" />
                Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: EXAM GATE CLEARANCE PASS */}
      {clearanceModalInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-gray-200 text-gray-900 print:m-0 print:p-4">
            <div className="text-center border-b border-gray-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#146ef5] text-xs font-bold uppercase tracking-wider mb-2">
                Examination Verification Pass
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900">
                1st Term 2026/2027 Exam Gate Card
              </h2>
            </div>

            <div className="py-4 space-y-3 text-xs border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Candidate:</span>
                <span className="font-bold text-gray-900 text-sm">{clearanceModalInvoice.student_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Class Arm:</span>
                <span className="font-semibold text-gray-800">{clearanceModalInvoice.class_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Admission No:</span>
                <span className="font-mono font-bold text-[#146ef5]">
                  {clearanceModalInvoice.admission_number || 'ADM-2026-REG'}
                </span>
              </div>

              <div className="p-3 rounded-xl border flex items-center justify-between mt-2 bg-emerald-50 border-emerald-200 text-emerald-800 font-bold">
                <span>Fee Clearance Status:</span>
                <span className="uppercase">{clearanceModalInvoice.status === 'PAID' ? 'CLEARED FOR EXAMS' : 'PROVISIONAL PASS'}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-[11px] text-gray-500">
              <div>Invigilator Signature: __________________</div>
              <div className="font-mono font-bold text-gray-400">#PASS-{clearanceModalInvoice.invoice_no}</div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 print:hidden">
              <button
                onClick={() => setClearanceModalInvoice(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#146ef5] hover:bg-[#105bd1] flex items-center gap-1.5"
              >
                <PrinterIcon className="w-4 h-4" />
                Print Admit Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

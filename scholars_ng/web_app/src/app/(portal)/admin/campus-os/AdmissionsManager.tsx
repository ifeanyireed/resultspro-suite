'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserGroupIcon,
  CalendarIcon,
  FolderOpenIcon,
  CheckCircleIcon,
  Squares2X2Icon,
  EnvelopeIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhoneIcon,
  DocumentCheckIcon,
  SparklesIcon,
  PlusIcon,
  ArrowPathIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowUpRightIcon,
  PrinterIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ClockIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

// ============================================================================
// DATA TYPES
// ============================================================================

export interface AdmissionInquiry {
  id: string;
  tenant_id: string;
  applicant_name: string;
  target_grade: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  stage: 'INQUIRY' | 'TOUR_SCHEDULED' | 'CBT_COMPLETED' | 'OFFER_ISSUED' | 'ENROLLED' | string;
  entrance_score: number;
  lead_source: string;
  tour_date?: string;
  tour_time?: string;
  cbt_date?: string;
  cbt_time?: string;
  cbt_venue?: string;
  offer_date?: string;
  acceptance_fee_status: 'PENDING' | 'PAID' | 'WAIVED' | string;
  notes?: string;
  assigned_counselor?: string;
  application_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdmissionTour {
  id: string;
  tenant_id: string;
  inquiry_id: string;
  applicant_name: string;
  parent_name: string;
  parent_phone: string;
  target_grade: string;
  tour_date: string;
  tour_time: string;
  guide_name: string;
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | string;
  created_at?: string;
}

export interface AdmissionCBTExam {
  id: string;
  tenant_id: string;
  inquiry_id: string;
  applicant_name: string;
  target_grade: string;
  exam_batch: string;
  exam_date: string;
  venue: string;
  score: number;
  max_score: number;
  interviewer_notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'ABSENT' | string;
  created_at?: string;
}

export interface AdmissionsSummary {
  total_inquiries: number;
  tours_scheduled: number;
  cbt_completed: number;
  offers_issued: number;
  enrolled_count: number;
  avg_cbt_score: number;
  conversion_rate: number;
}

export interface ClassArmMeta {
  arm_id: string;
  class_name: string;
  arm_name: string;
}

export type AdmissionSubtab = 'overview' | 'inquiries' | 'applications' | 'tours_cbt' | 'pipeline';

export const STAGE_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotColor: string }
> = {
  INQUIRY: {
    label: 'New Inquiry',
    badgeClass: 'bg-blue-50 text-[#146ef5] border-blue-200',
    dotColor: '#146ef5',
  },
  TOUR_SCHEDULED: {
    label: 'Tour Scheduled',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: '#f59e0b',
  },
  CBT_COMPLETED: {
    label: 'CBT Completed',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotColor: '#8b5cf6',
  },
  OFFER_ISSUED: {
    label: 'Offer Issued',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: '#10b981',
  },
  ENROLLED: {
    label: 'Enrolled & Paid',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    dotColor: '#0d9488',
  },
};

export default function AdmissionsManager({
  initialSubtab = 'overview',
}: {
  initialSubtab?: AdmissionSubtab;
}) {
  const [subtab, setSubtab] = useState<AdmissionSubtab>(initialSubtab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Core Data
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>([]);
  const [tours, setTours] = useState<AdmissionTour[]>([]);
  const [cbtExams, setCbtExams] = useState<AdmissionCBTExam[]>([]);
  const [classArms, setClassArms] = useState<ClassArmMeta[]>([]);
  const [gradesList, setGradesList] = useState<string[]>([]);
  const [counselorsList, setCounselorsList] = useState<string[]>([]);
  const [leadSourcesList, setLeadSourcesList] = useState<string[]>([]);
  const [summary, setSummary] = useState<AdmissionsSummary>({
    total_inquiries: 0,
    tours_scheduled: 0,
    cbt_completed: 0,
    offers_issued: 0,
    enrolled_count: 0,
    avg_cbt_score: 0,
    conversion_rate: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  // Modals
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState<AdmissionInquiry | null>(null);
  const [showCbtModal, setShowCbtModal] = useState<AdmissionInquiry | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState<AdmissionInquiry | null>(null);
  const [printOfferModal, setPrintOfferModal] = useState<AdmissionInquiry | null>(null);

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    applicant_name: '',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    target_grade: 'JSS 1',
    lead_source: 'School Website',
    assigned_counselor: 'Mrs. Funke Adebayo (Admissions Director)',
    notes: '',
  });

  // Tour Form State
  const [tourForm, setTourForm] = useState({
    tour_date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    tour_time: '10:00 AM',
    guide_name: 'Mrs. Funke Adebayo (Admissions Director)',
    notes: '',
  });

  // CBT Form State
  const [cbtForm, setCbtForm] = useState({
    exam_batch: 'Batch 2026-A',
    exam_date: new Date().toISOString().split('T')[0],
    venue: 'Campus STEM CBT Assessment Hall',
    score: 85,
    interviewer_notes: '',
  });

  // Enrollment Form State
  const [enrollForm, setEnrollForm] = useState({
    arm_id: '',
    gender: 'M',
  });

  // ============================================================================
  // DATA LOADING
  // ============================================================================
  const loadAdmissions = useCallback(async () => {
    setLoading(true);
    setErrorBanner(null);
    try {
      const res = await api.get('/v1/campus/admissions');
      const data = res.data;
      if (data) {
        if (data.summary) setSummary(data.summary);
        if (data.inquiries && Array.isArray(data.inquiries)) setInquiries(data.inquiries);
        if (data.tours && Array.isArray(data.tours)) setTours(data.tours);
        if (data.cbt_exams && Array.isArray(data.cbt_exams)) setCbtExams(data.cbt_exams);
        if (data.class_arms && Array.isArray(data.class_arms)) {
          setClassArms(data.class_arms);
          if (data.class_arms.length > 0) {
            setEnrollForm((prev) => ({ ...prev, arm_id: data.class_arms[0].arm_id }));
          }
        }
        if (data.grades && Array.isArray(data.grades)) setGradesList(data.grades);
        if (data.counselors && Array.isArray(data.counselors)) setCounselorsList(data.counselors);
        if (data.lead_sources && Array.isArray(data.lead_sources)) setLeadSourcesList(data.lead_sources);
      }
    } catch (err: any) {
      console.error('Failed to load admissions:', err);
      setErrorBanner(err?.response?.data?.error || 'Failed to connect to tenant admissions database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmissions();
  }, [loadAdmissions]);

  // ============================================================================
  // MUTATION HANDLERS
  // ============================================================================
  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.applicant_name.trim()) {
      setErrorBanner('Applicant full name is required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/v1/campus/admissions', {
        action: 'create_inquiry',
        ...inquiryForm,
      });
      setShowInquiryModal(false);
      setSuccessBanner(`Admissions inquiry for "${inquiryForm.applicant_name}" saved to database.`);
      setInquiryForm({
        applicant_name: '',
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        target_grade: 'JSS 1',
        lead_source: 'School Website',
        assigned_counselor: counselorsList[0] || 'Mrs. Funke Adebayo (Admissions Director)',
        notes: '',
      });
      await loadAdmissions();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to create inquiry.');
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (id: string, stage: string) => {
    try {
      await api.put('/v1/campus/admissions', { id, stage });
      setSuccessBanner(`Stage updated to ${stage.replace(/_/g, ' ')}`);
      await loadAdmissions();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to update stage.');
    }
  };

  const handleScheduleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTourModal) return;
    setSaving(true);
    try {
      const res = await api.post('/v1/campus/admissions', {
        action: 'schedule_tour',
        inquiry_id: showTourModal.id,
        ...tourForm,
      });
      setShowTourModal(null);
      setSuccessBanner(res.data?.message || 'Campus tour scheduled successfully.');
      await loadAdmissions();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to schedule tour.');
    } finally {
      setSaving(false);
    }
  };

  const handleRecordCBTSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCbtModal) return;
    setSaving(true);
    try {
      const res = await api.post('/v1/campus/admissions', {
        action: 'record_cbt',
        inquiry_id: showCbtModal.id,
        ...cbtForm,
        score: Number(cbtForm.score),
      });
      setShowCbtModal(null);
      setSuccessBanner(res.data?.message || 'Entrance CBT score logged.');
      await loadAdmissions();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to record CBT score.');
    } finally {
      setSaving(false);
    }
  };

  const handleIssueOfferAction = async (inquiry: AdmissionInquiry) => {
    try {
      const res = await api.post('/v1/campus/admissions', {
        action: 'issue_offer',
        inquiry_id: inquiry.id,
      });
      setSuccessBanner(res.data?.message || 'Provisional offer issued.');
      await loadAdmissions();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to issue offer.');
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEnrollModal) return;
    setSaving(true);
    try {
      const res = await api.post('/v1/campus/admissions', {
        action: 'enroll_student',
        inquiry_id: showEnrollModal.id,
        ...enrollForm,
      });
      setShowEnrollModal(null);
      setSuccessBanner(res.data?.message || 'Student enrolled successfully.');
      await loadAdmissions();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to enroll student.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove inquiry for "${name}"?`)) return;
    try {
      await api.delete(`/v1/campus/admissions?id=${id}`);
      setSuccessBanner(`Inquiry record for "${name}" deleted.`);
      await loadAdmissions();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to delete record.');
    }
  };

  // ============================================================================
  // FILTERED DATASET
  // ============================================================================
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesStage = stageFilter === 'ALL' || inq.stage === stageFilter;
      const matchesGrade = gradeFilter === 'ALL' || inq.target_grade === gradeFilter;
      const matchesSource = sourceFilter === 'ALL' || inq.lead_source === sourceFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        inq.applicant_name.toLowerCase().includes(q) ||
        inq.parent_name.toLowerCase().includes(q) ||
        inq.parent_email.toLowerCase().includes(q) ||
        inq.parent_phone.toLowerCase().includes(q) ||
        inq.target_grade.toLowerCase().includes(q);

      return matchesStage && matchesGrade && matchesSource && matchesSearch;
    });
  }, [inquiries, stageFilter, gradeFilter, sourceFilter, searchQuery]);

  const subtabsConfig: { id: AdmissionSubtab; label: string; icon: any; count?: number | string }[] = [
    { id: 'overview', label: 'Overview & Pulse', icon: Squares2X2Icon },
    { id: 'inquiries', label: 'Inquiries Directory', icon: EnvelopeIcon, count: summary.total_inquiries },
    {
      id: 'applications',
      label: 'Applications & Decisions',
      icon: FolderOpenIcon,
      count: summary.cbt_completed > 0 ? `${summary.cbt_completed} CBTs` : undefined,
    },
    { id: 'tours_cbt', label: 'Tours & CBT Center', icon: CalendarIcon, count: tours.length + cbtExams.length },
    { id: 'pipeline', label: 'Funnel Pipeline', icon: ChartBarIcon, count: 'Conversion' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Dynamic Alerts */}
      {errorBanner && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-rose-500 hover:text-rose-700">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-500 hover:text-emerald-700">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Admissions CRM & Enrollment</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5] border border-blue-200">
              Tenant-Aware Postgres
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage prospective family inquiries, campus tours, entrance CBT exams, provisional offers, and student enrollments.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowInquiryModal(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Record New Inquiry
          </button>
          <button
            onClick={loadAdmissions}
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
          {subtabsConfig.map((tab) => {
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
                {tab.count !== undefined && (
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

      {/* ==================================================================== */}
      {/* SUBTAB 1: OVERVIEW & PULSE */}
      {/* ==================================================================== */}
      {subtab === 'overview' && (
        <div className="space-y-6">
          {/* Executive 4-Quadrant Metric Cards */}
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MotionRise className="bg-gradient-to-br from-[#146ef5] to-[#0D1060] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start z-10">
                <h3 className="text-xl font-normal text-white">Funnel Inquiries</h3>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ArrowUpRightIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="z-10">
                <h2 className="text-5xl font-medium tracking-tight text-white mb-1">
                  {summary.total_inquiries}
                </h2>
                <p className="text-xs text-white/80">Active prospective family leads</p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Campus Visits</h3>
                <div className="w-8 h-8 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-600">
                  <CalendarIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-1">
                  {summary.tours_scheduled}
                </h2>
                <p className="text-xs text-gray-500">Tours &amp; family interviews booked</p>
              </div>
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">CBT Assessments</h3>
                <div className="w-8 h-8 rounded-full border border-purple-200 bg-purple-50 flex items-center justify-center text-purple-600">
                  <AcademicCapIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-5xl font-medium tracking-tight text-gray-900">
                    {summary.cbt_completed}
                  </h2>
                  {summary.avg_cbt_score > 0 && (
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      Avg: {Math.round(summary.avg_cbt_score)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Entrance test scripts completed</p>
              </div>
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Enrolled Students</h3>
                <div className="w-8 h-8 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-5xl font-medium tracking-tight text-emerald-600">
                    {summary.enrolled_count}
                  </h2>
                  <span className="text-xs font-semibold text-gray-500">
                    ({Math.round(summary.conversion_rate)}% conv)
                  </span>
                </div>
                <p className="text-xs text-gray-500">{summary.offers_issued} provisional offers issued</p>
              </div>
            </MotionRise>
          </MotionStagger>

          {/* Recent Inquiries Snippet & Stage Conversion Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Recent Admissions Progression</h3>
                  <p className="text-xs text-gray-500">Latest prospective students registered across grade levels</p>
                </div>
                <button
                  onClick={() => setSubtab('inquiries')}
                  className="text-xs font-semibold text-[#146ef5] hover:underline"
                >
                  View Full Directory →
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  <EnvelopeIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  No admission inquiries recorded in this tenant database yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {inquiries.slice(0, 6).map((inq) => {
                    const st = STAGE_CONFIG[inq.stage] || STAGE_CONFIG.INQUIRY;
                    return (
                      <div
                        key={inq.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors rounded-xl px-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center font-bold text-xs shrink-0">
                            {inq.applicant_name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-gray-900">{inq.applicant_name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeClass}`}>
                                {st.label}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              Target: <strong className="text-gray-700">{inq.target_grade}</strong> · Parent: {inq.parent_name} ({inq.parent_phone || inq.parent_email || 'No contact'})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {inq.entrance_score > 0 && (
                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                              CBT: {inq.entrance_score}%
                            </span>
                          )}
                          <select
                            value={inq.stage}
                            onChange={(e) => handleStageChange(inq.id, e.target.value)}
                            className="text-xs px-2.5 py-1 font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer"
                          >
                            <option value="INQUIRY">Inquiry</option>
                            <option value="TOUR_SCHEDULED">Tour Scheduled</option>
                            <option value="CBT_COMPLETED">CBT Completed</option>
                            <option value="OFFER_ISSUED">Offer Issued</option>
                            <option value="ENROLLED">Enrolled</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pipeline Intelligence Card */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="w-5 h-5 text-[#146ef5]" />
                  <h3 className="text-base font-bold text-gray-900">Enrollment Intelligence</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                    <span className="font-bold text-[#146ef5] uppercase tracking-wider text-[10px] block mb-1">
                      Inquiry Velocity
                    </span>
                    <p className="text-gray-700 leading-relaxed">
                      {summary.total_inquiries} applicants currently logged. Families participating in the physical campus tour convert to CBT assessment at over 80%.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs">
                    <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] block mb-1">
                      Provisional Offers
                    </span>
                    <p className="text-gray-700 leading-relaxed">
                      {summary.offers_issued} offer letters issued. Enrolled students are automatically provisioned in active class arms.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSubtab('pipeline')}
                className="mt-6 w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-all cursor-pointer text-center"
              >
                Inspect Conversion Pipeline →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 2: INQUIRIES DIRECTORY */}
      {/* ==================================================================== */}
      {subtab === 'inquiries' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search applicant, parent name, email, phone, or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                <option value="ALL">All Stages</option>
                <option value="INQUIRY">New Inquiry</option>
                <option value="TOUR_SCHEDULED">Tour Scheduled</option>
                <option value="CBT_COMPLETED">CBT Completed</option>
                <option value="OFFER_ISSUED">Offer Issued</option>
                <option value="ENROLLED">Enrolled</option>
              </select>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                <option value="ALL">All Grades</option>
                {gradesList.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                <option value="ALL">All Lead Sources</option>
                {leadSourcesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {(searchQuery || stageFilter !== 'ALL' || gradeFilter !== 'ALL' || sourceFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStageFilter('ALL');
                    setGradeFilter('ALL');
                    setSourceFilter('ALL');
                  }}
                  className="px-3 py-2 text-xs rounded-xl text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-700">
                Displaying {filteredInquiries.length} of {inquiries.length} prospective applicant records
              </span>
              <button
                onClick={() => setShowInquiryModal(true)}
                className="text-xs font-semibold text-[#146ef5] hover:underline flex items-center gap-1"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add New Inquiry
              </button>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="py-16 text-center">
                <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-gray-900">No Admission Records Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                  {inquiries.length === 0
                    ? 'No prospective family inquiries recorded in this tenant database yet.'
                    : 'No records match the active filters and search query.'}
                </p>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full shadow-sm hover:bg-[#105bd1] transition-all"
                >
                  Register First Inquiry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100 text-[10px]">
                      <th className="px-5 py-3.5">Applicant &amp; Grade</th>
                      <th className="px-5 py-3.5">Parent / Guardian</th>
                      <th className="px-5 py-3.5">Lead Source</th>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5">Assessment</th>
                      <th className="px-5 py-3.5">Stage</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInquiries.map((inq) => {
                      const st = STAGE_CONFIG[inq.stage] || STAGE_CONFIG.INQUIRY;
                      return (
                        <tr key={inq.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-sm text-gray-900">{inq.applicant_name}</div>
                            <span className="inline-block mt-0.5 text-[11px] font-semibold text-[#146ef5] bg-blue-50 px-2 py-0.5 rounded-full">
                              {inq.target_grade}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-medium text-gray-900">{inq.parent_name}</div>
                            <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                              {inq.parent_phone && (
                                <a href={`tel:${inq.parent_phone}`} className="hover:text-emerald-600 flex items-center gap-0.5">
                                  <PhoneIcon className="w-3 h-3" /> {inq.parent_phone}
                                </a>
                              )}
                              {inq.parent_email && (
                                <a href={`mailto:${inq.parent_email}`} className="hover:text-[#146ef5] flex items-center gap-0.5">
                                  <EnvelopeIcon className="w-3 h-3" /> {inq.parent_email}
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{inq.lead_source}</td>
                          <td className="px-5 py-4 text-gray-500 font-mono text-[11px]">
                            {inq.application_date || (inq.created_at ? inq.created_at.slice(0, 10) : '')}
                          </td>
                          <td className="px-5 py-4">
                            {inq.entrance_score > 0 ? (
                              <span className="font-bold text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                                {inq.entrance_score}% Score
                              </span>
                            ) : (
                              <button
                                onClick={() => setShowCbtModal(inq)}
                                className="text-[11px] font-semibold text-purple-600 hover:underline"
                              >
                                + Record CBT
                              </button>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${st.badgeClass}`}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.dotColor }} />
                              {st.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {inq.stage !== 'ENROLLED' && inq.stage !== 'OFFER_ISSUED' && (
                                <button
                                  onClick={() => setShowTourModal(inq)}
                                  className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-semibold text-[11px] transition-all"
                                  title="Schedule campus tour"
                                >
                                  Book Tour
                                </button>
                              )}
                              {inq.stage !== 'ENROLLED' && inq.stage !== 'OFFER_ISSUED' && (
                                <button
                                  onClick={() => handleIssueOfferAction(inq)}
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold text-[11px] transition-all"
                                  title="Issue admission offer letter"
                                >
                                  Issue Offer
                                </button>
                              )}
                              {inq.stage === 'OFFER_ISSUED' && (
                                <button
                                  onClick={() => setShowEnrollModal(inq)}
                                  className="px-2.5 py-1 bg-[#146ef5] text-white hover:bg-[#105bd1] rounded-lg font-semibold text-[11px] transition-all"
                                  title="Promote to active enrolled student"
                                >
                                  Enroll Student
                                </button>
                              )}
                              <button
                                onClick={() => setPrintOfferModal(inq)}
                                className="p-1.5 text-gray-500 hover:text-[#146ef5] hover:bg-blue-50 rounded-lg transition-all"
                                title="Print Provisional Admission Letter"
                              >
                                <PrinterIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id, inq.applicant_name)}
                                className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete inquiry"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 3: APPLICATIONS & DECISIONS */}
      {/* ==================================================================== */}
      {subtab === 'applications' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Application Decision Center</h3>
              <p className="text-xs text-gray-500">
                Review entrance CBT scripts, approve admission offers, and finalize student class arm placements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1.5 rounded-full">
                {summary.offers_issued} Offers Issued · {summary.enrolled_count} Enrolled
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100 text-[10px]">
                    <th className="px-5 py-3.5">Applicant &amp; Guardian</th>
                    <th className="px-5 py-3.5">Target Grade</th>
                    <th className="px-5 py-3.5">Entrance CBT</th>
                    <th className="px-5 py-3.5">Acceptance Fee</th>
                    <th className="px-5 py-3.5">Counselor</th>
                    <th className="px-5 py-3.5">Stage</th>
                    <th className="px-5 py-3.5 text-right">Decision Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inquiries.map((inq) => {
                    const st = STAGE_CONFIG[inq.stage] || STAGE_CONFIG.INQUIRY;
                    return (
                      <tr key={inq.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm text-gray-900">{inq.applicant_name}</div>
                          <div className="text-[11px] text-gray-500">{inq.parent_name} · {inq.parent_phone}</div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-800">{inq.target_grade}</td>
                        <td className="px-5 py-4">
                          {inq.entrance_score > 0 ? (
                            <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              {inq.entrance_score}%
                            </span>
                          ) : (
                            <button
                              onClick={() => setShowCbtModal(inq)}
                              className="text-[11px] font-semibold text-purple-600 hover:underline"
                            >
                              + Schedule CBT
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inq.acceptance_fee_status === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {inq.acceptance_fee_status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{inq.assigned_counselor || 'Admissions Desk'}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${st.badgeClass}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {inq.stage !== 'OFFER_ISSUED' && inq.stage !== 'ENROLLED' && (
                              <button
                                onClick={() => handleIssueOfferAction(inq)}
                                className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold text-[11px] transition-all"
                              >
                                Issue Offer
                              </button>
                            )}
                            {inq.stage === 'OFFER_ISSUED' && (
                              <button
                                onClick={() => setShowEnrollModal(inq)}
                                className="px-2.5 py-1 bg-[#146ef5] text-white hover:bg-[#105bd1] rounded-lg font-semibold text-[11px] transition-all"
                              >
                                Enroll as Student
                              </button>
                            )}
                            <button
                              onClick={() => setPrintOfferModal(inq)}
                              className="p-1.5 text-gray-500 hover:text-[#146ef5] hover:bg-blue-50 rounded-lg transition-all"
                              title="Print Offer Letter"
                            >
                              <PrinterIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 4: TOURS & CBT CENTER */}
      {/* ==================================================================== */}
      {subtab === 'tours_cbt' && (
        <div className="space-y-6">
          {/* Scheduled Tours Table */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Scheduled Physical Tours &amp; Family Visits</h3>
                <p className="text-xs text-gray-500">Prospective families booked for physical campus and boarding tour</p>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                {tours.length} Visits
              </span>
            </div>

            {tours.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No physical campus visits currently scheduled.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 font-semibold text-[10px]">
                      <th className="pb-3">Date &amp; Time</th>
                      <th className="pb-3">Applicant &amp; Grade</th>
                      <th className="pb-3">Parent Contact</th>
                      <th className="pb-3">Tour Guide</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tours.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/70">
                        <td className="py-3 font-semibold text-gray-900">
                          {t.tour_date} · {t.tour_time}
                        </td>
                        <td className="py-3">
                          <div className="font-semibold">{t.applicant_name}</div>
                          <div className="text-[11px] text-gray-500">{t.target_grade}</div>
                        </td>
                        <td className="py-3">
                          {t.parent_name} ({t.parent_phone})
                        </td>
                        <td className="py-3 text-gray-600">{t.guide_name}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Entrance CBT Assessment Records */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Entrance CBT Assessments &amp; Exam Batches</h3>
                <p className="text-xs text-gray-500">Standardized entrance test scores and examiner remarks</p>
              </div>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                {cbtExams.length} Test Takers
              </span>
            </div>

            {cbtExams.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No CBT entrance assessment records logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 font-semibold text-[10px]">
                      <th className="pb-3">Batch &amp; Date</th>
                      <th className="pb-3">Candidate</th>
                      <th className="pb-3">Target Grade</th>
                      <th className="pb-3">Venue</th>
                      <th className="pb-3">Score</th>
                      <th className="pb-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cbtExams.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/70">
                        <td className="py-3">
                          <span className="font-semibold text-gray-900">{c.exam_batch}</span>
                          <div className="text-[11px] text-gray-400">{c.exam_date}</div>
                        </td>
                        <td className="py-3 font-semibold text-gray-900">{c.applicant_name}</td>
                        <td className="py-3 text-gray-600">{c.target_grade}</td>
                        <td className="py-3 text-gray-600">{c.venue}</td>
                        <td className="py-3">
                          <span className="font-bold text-sm text-purple-700">{c.score}%</span>
                        </td>
                        <td className="py-3 text-gray-500 italic max-w-xs line-clamp-1">
                          {c.interviewer_notes || 'Score verified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 5: FUNNEL PIPELINE */}
      {/* ==================================================================== */}
      {subtab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Stage-by-Stage Enrollment Funnel</h3>
                <p className="text-xs text-gray-500">Live conversion progression across the 5 admissions milestones</p>
              </div>
              <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
                2026/2027 Academic Intake
              </span>
            </div>

            {/* Visual Funnel Milestones */}
            <div className="space-y-4">
              {[
                {
                  label: '1. Prospective Inquiries',
                  count: summary.total_inquiries,
                  pct: 100,
                  color: 'bg-[#146ef5]',
                },
                {
                  label: '2. Campus Tours & Family Interviews',
                  count: summary.tours_scheduled,
                  pct: summary.total_inquiries > 0 ? Math.round((summary.tours_scheduled / summary.total_inquiries) * 100) : 0,
                  color: 'bg-amber-500',
                },
                {
                  label: '3. Entrance CBT Assessment Completed',
                  count: summary.cbt_completed,
                  pct: summary.total_inquiries > 0 ? Math.round((summary.cbt_completed / summary.total_inquiries) * 100) : 0,
                  color: 'bg-purple-600',
                },
                {
                  label: '4. Provisional Admission Offers Issued',
                  count: summary.offers_issued,
                  pct: summary.total_inquiries > 0 ? Math.round((summary.offers_issued / summary.total_inquiries) * 100) : 0,
                  color: 'bg-emerald-500',
                },
                {
                  label: '5. Enrolled & Acceptance Fee Cleared',
                  count: summary.enrolled_count,
                  pct: summary.total_inquiries > 0 ? Math.round((summary.enrolled_count / summary.total_inquiries) * 100) : 0,
                  color: 'bg-teal-600',
                },
              ].map((step, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{step.label}</span>
                    <span className="font-bold text-gray-900">
                      {step.count} Applicants ({step.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-7 bg-gray-100 rounded-xl overflow-hidden p-1">
                    <div
                      className={`h-full ${step.color} rounded-lg transition-all duration-500`}
                      style={{ width: `${Math.max(step.pct, step.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: RECORD NEW ADMISSION INQUIRY */}
      {/* ==================================================================== */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Record Admission Inquiry</h3>
              <button onClick={() => setShowInquiryModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwadamilola Adebayo"
                  value={inquiryForm.applicant_name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, applicant_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Grade</label>
                  <select
                    value={inquiryForm.target_grade}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, target_grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {gradesList.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Lead Source</label>
                  <select
                    value={inquiryForm.lead_source}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, lead_source: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {leadSourcesList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  placeholder="e.g. Engr. & Mrs. Kunle Adebayo"
                  value={inquiryForm.parent_name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, parent_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Parent Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="+234 803 123 4567"
                    value={inquiryForm.parent_phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, parent_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    placeholder="parent@example.ng"
                    value={inquiryForm.parent_email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, parent_email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Counselor</label>
                <select
                  value={inquiryForm.assigned_counselor}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, assigned_counselor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  {counselorsList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Admissions Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inquired about STEM robotics program and hostel boarding facilities..."
                  value={inquiryForm.notes}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {saving ? 'Saving...' : 'Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: SCHEDULE CAMPUS TOUR */}
      {/* ==================================================================== */}
      {showTourModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Book Campus Visit</h3>
              <button onClick={() => setShowTourModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleTourSubmit} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 text-xs text-[#146ef5] font-semibold">
                Candidate: {showTourModal.applicant_name} ({showTourModal.target_grade})
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tour Date</label>
                  <input
                    type="date"
                    required
                    value={tourForm.tour_date}
                    onChange={(e) => setTourForm({ ...tourForm, tour_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={tourForm.tour_time}
                    onChange={(e) => setTourForm({ ...tourForm, tour_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Guide / Counselor</label>
                <input
                  type="text"
                  value={tourForm.guide_name}
                  onChange={(e) => setTourForm({ ...tourForm, guide_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Visit Objectives / Notes</label>
                <textarea
                  rows={2}
                  value={tourForm.notes}
                  onChange={(e) => setTourForm({ ...tourForm, notes: e.target.value })}
                  placeholder="e.g. Science lab inspection and boarding house tour"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowTourModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-[#105bd1]"
                >
                  {saving ? 'Scheduling...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: RECORD CBT ASSESSMENT SCORE */}
      {/* ==================================================================== */}
      {showCbtModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Record Entrance CBT Assessment</h3>
              <button onClick={() => setShowCbtModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordCBTSubmit} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-purple-50 text-xs text-purple-700 font-semibold">
                Applicant: {showCbtModal.applicant_name} ({showCbtModal.target_grade})
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">CBT Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={cbtForm.score}
                    onChange={(e) => setCbtForm({ ...cbtForm, score: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-purple-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={cbtForm.exam_date}
                    onChange={(e) => setCbtForm({ ...cbtForm, exam_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assessment Venue / Hall</label>
                <input
                  type="text"
                  value={cbtForm.venue}
                  onChange={(e) => setCbtForm({ ...cbtForm, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Interviewer Notes</label>
                <textarea
                  rows={2}
                  value={cbtForm.interviewer_notes}
                  onChange={(e) => setCbtForm({ ...cbtForm, interviewer_notes: e.target.value })}
                  placeholder="Candidate demonstrates high analytical aptitude in mathematics..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCbtModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  {saving ? 'Recording...' : 'Save CBT Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: ENROLL STUDENT INTO CLASS ARM */}
      {/* ==================================================================== */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Finalize Student Enrollment</h3>
              <button onClick={() => setShowEnrollModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="mt-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100 text-xs text-teal-800">
                Enrolling <strong className="font-bold">{showEnrollModal.applicant_name}</strong> into target grade{' '}
                <strong className="font-bold">{showEnrollModal.target_grade}</strong>. This creates a permanent active student record and links guardian profile.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Class Arm *</label>
                <select
                  required
                  value={enrollForm.arm_id}
                  onChange={(e) => setEnrollForm({ ...enrollForm, arm_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                >
                  {classArms.map((arm) => (
                    <option key={arm.arm_id} value={arm.arm_id}>
                      {arm.class_name} ({arm.arm_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Student Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEnrollForm({ ...enrollForm, gender: 'M' })}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      enrollForm.gender === 'M' ? 'bg-blue-50 text-[#146ef5] border-blue-300' : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnrollForm({ ...enrollForm, gender: 'F' })}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      enrollForm.gender === 'F' ? 'bg-pink-50 text-pink-700 border-pink-300' : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  {saving ? 'Enrolling...' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: PRINTABLE PROVISIONAL ADMISSION OFFER LETTER */}
      {/* ==================================================================== */}
      {printOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <PrinterIcon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="text-base font-bold text-gray-900">Provisional Admission Letter</h3>
              </div>
              <button onClick={() => setPrintOfferModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Official Letterhead Sheet */}
            <div className="my-6 p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-white space-y-5">
              <div className="text-center border-b border-gray-200 pb-5">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">SCHOLARS ACADEMY</h2>
                <p className="text-xs text-gray-500 mt-1">Excellence in STEM, Arts &amp; Character Education</p>
                <p className="text-[11px] text-gray-400">Office of the Registrar &amp; Admissions Directorate</p>
              </div>

              <div className="flex justify-between items-start text-xs text-gray-600 border-b border-gray-100 pb-3">
                <div>
                  <div>Ref: <strong className="font-mono text-gray-900">OFFER/2026/{printOfferModal.id.slice(0, 8).toUpperCase()}</strong></div>
                  <div>Date: {printOfferModal.offer_date || new Date().toISOString().split('T')[0]}</div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    PROVISIONAL OFFER
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-gray-800 leading-relaxed">
                <p>
                  Dear <strong className="text-gray-900">{printOfferModal.parent_name || 'Parent / Guardian'}</strong>,
                </p>

                <p>
                  Following the successful review of the admission application and performance in the entrance assessment (CBT Score:{' '}
                  <strong>{printOfferModal.entrance_score > 0 ? `${printOfferModal.entrance_score}%` : 'Satisfactory'}</strong>), the Admissions Committee is pleased to offer provisional admission to:
                </p>

                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-center">
                  <h4 className="text-base font-bold text-[#146ef5]">{printOfferModal.applicant_name}</h4>
                  <p className="text-xs text-gray-700 font-semibold mt-0.5">
                    Target Class: {printOfferModal.target_grade} · 2026/2027 Academic Session
                  </p>
                </div>

                <p>
                  To secure this placement, kindly complete the acceptance fee settlement and submit the student medical &amp; birth records to the admissions registry within 14 days of this notice.
                </p>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 text-[11px] text-gray-600">
                  <div className="font-bold text-gray-900">Bursary Settlement Account:</div>
                  <div>Bank: <strong>Zenith Bank PLC / Paystack Dedicated Virtual Account</strong></div>
                  <div>Account Name: <strong>Scholars Academy Institutional Operations</strong></div>
                  <div>Reference: <strong>{printOfferModal.applicant_name} ({printOfferModal.target_grade})</strong></div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-center text-[10px] text-gray-500">
                <div className="border-t border-gray-400 pt-1">
                  <strong>Mrs. Funke Adebayo</strong>
                  <div>Admissions Director</div>
                </div>
                <div className="border-t border-gray-400 pt-1">
                  <strong>Dr. Emeka Adeleke</strong>
                  <div>Principal / Head of School</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPrintOfferModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-[#105bd1] transition-all flex items-center gap-1.5"
              >
                <PrinterIcon className="w-4 h-4" />
                Print Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

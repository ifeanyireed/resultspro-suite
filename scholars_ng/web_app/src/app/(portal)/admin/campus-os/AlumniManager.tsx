'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  IdentificationIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  CalendarIcon,
  XMarkIcon,
  PrinterIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ClockIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export interface CampusAlumnus {
  id: string;
  tenant_id: string;
  student_name: string;
  graduation_year: string;
  class_set: string;
  email: string;
  phone: string;
  current_occupation: string;
  organization: string;
  university: string;
  city: string;
  country: string;
  linkedin_url: string;
  status: string;
  created_at: string;
}

export interface CampusTranscriptRequest {
  id: string;
  tenant_id: string;
  applicant_name: string;
  graduation_year: string;
  student_reg_no: string;
  destination_institution: string;
  destination_email: string;
  purpose: string;
  fee_status: string;
  processing_status: string;
  tracking_number: string;
  requested_date: string;
  dispatched_date: string;
  notes: string;
  created_at: string;
}

export interface CampusCredentialVerification {
  id: string;
  tenant_id: string;
  student_name: string;
  graduation_year: string;
  certificate_number: string;
  degree_type: string;
  grade_honors: string;
  verification_token: string;
  status: string;
  verified_at?: string;
}

export interface AlumniSummary {
  total_alumni: number;
  pending_transcripts: number;
  dispatched_transcripts: number;
  total_verified: number;
}

export type AlumniSubtab = 'overview' | 'directory' | 'transcripts' | 'verifications';

interface AlumniManagerProps {
  initialSubtab?: AlumniSubtab;
}

export default function AlumniManager({
  initialSubtab = 'overview',
}: AlumniManagerProps) {
  const [subtab, setSubtab] = useState<AlumniSubtab>(initialSubtab);
  const [summary, setSummary] = useState<AlumniSummary>({
    total_alumni: 0,
    pending_transcripts: 0,
    dispatched_transcripts: 0,
    total_verified: 0,
  });
  const [alumni, setAlumni] = useState<CampusAlumnus[]>([]);
  const [transcripts, setTranscripts] = useState<CampusTranscriptRequest[]>([]);
  const [verifications, setVerifications] = useState<CampusCredentialVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [printTranscript, setPrintTranscript] = useState<CampusTranscriptRequest | null>(null);

  // Form states
  const [alumniForm, setAlumniForm] = useState({
    student_name: '',
    graduation_year: '2023',
    class_set: 'Class of 2023 (Valiant Eagles)',
    email: '',
    phone: '',
    current_occupation: '',
    organization: '',
    university: '',
    city: 'Lagos',
    country: 'Nigeria',
    linkedin_url: '',
  });

  const [transcriptForm, setTranscriptForm] = useState({
    applicant_name: '',
    graduation_year: '2023',
    student_reg_no: '',
    destination_institution: '',
    destination_email: '',
    purpose: 'Postgraduate University Admission',
    fee_status: 'PAID',
    tracking_number: '',
    notes: 'Official academic transcript with sealed envelope',
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await api
        .get('/v1/campus/alumni')
        .catch(async () => await api.get('/campus/alumni'));

      if (res?.data) {
        if (res.data.summary) setSummary(res.data.summary);
        if (Array.isArray(res.data.alumni)) setAlumni(res.data.alumni);
        if (Array.isArray(res.data.transcripts)) setTranscripts(res.data.transcripts);
        if (Array.isArray(res.data.verifications)) setVerifications(res.data.verifications);
      }
    } catch (err: any) {
      console.error('Failed to load alumni data:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to connect to campus alumni service');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRegisterAlumnus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniForm.student_name.trim()) return;

    try {
      setIsSubmitting(true);
      await api
        .post('/v1/campus/alumni', {
          action: 'register_alumnus',
          ...alumniForm,
        })
        .catch(async () => {
          return await api.post('/campus/alumni', {
            action: 'register_alumnus',
            ...alumniForm,
          });
        });

      setIsAlumniModalOpen(false);
      setAlumniForm({
        student_name: '',
        graduation_year: '2023',
        class_set: 'Class of 2023 (Valiant Eagles)',
        email: '',
        phone: '',
        current_occupation: '',
        organization: '',
        university: '',
        city: 'Lagos',
        country: 'Nigeria',
        linkedin_url: '',
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to register alumnus');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestTranscript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcriptForm.applicant_name.trim() || !transcriptForm.destination_institution.trim()) return;

    try {
      setIsSubmitting(true);
      await api
        .post('/v1/campus/alumni', {
          action: 'request_transcript',
          ...transcriptForm,
        })
        .catch(async () => {
          return await api.post('/campus/alumni', {
            action: 'request_transcript',
            ...transcriptForm,
          });
        });

      setIsTranscriptModalOpen(false);
      setTranscriptForm({
        applicant_name: '',
        graduation_year: '2023',
        student_reg_no: '',
        destination_institution: '',
        destination_email: '',
        purpose: 'Postgraduate University Admission',
        fee_status: 'PAID',
        tracking_number: '',
        notes: 'Official academic transcript with sealed envelope',
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit transcript request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispatchTranscript = async (id: string) => {
    const tracking = prompt('Enter Courier / DHL Tracking Number (or Electronic Portal Ref):', 'DHL-NG-8891230');
    if (!tracking) return;

    try {
      await api
        .post('/v1/campus/alumni', {
          action: 'dispatch_transcript',
          id,
          tracking_number: tracking,
        })
        .catch(async () => {
          return await api.post('/campus/alumni', {
            action: 'dispatch_transcript',
            id,
            tracking_number: tracking,
          });
        });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to mark transcript as dispatched');
    }
  };

  const filteredAlumni = alumni.filter(
    (a) =>
      a.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.graduation_year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.class_set.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTranscripts = transcripts.filter(
    (t) =>
      t.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.student_reg_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination_institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#0D1060] via-[#146ef5] to-[#0D1060] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300 border border-white/20">
              <IdentificationIcon className="w-4 h-4" />
              <span>Institutional Legacy & Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Alumni Relations & Credentials Registry
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
              Maintain institutional connections with graduating sets, track career trajectories, process official academic transcript requests, and power instant cryptographic employer credential verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAlumniModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 shadow-sm"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Register Graduate</span>
            </button>
            <button
              onClick={() => setIsTranscriptModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <DocumentTextIcon className="w-4 h-4" />
              <span>Transcript Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <AcademicCapIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.total_alumni}</div>
            <div className="text-xs font-medium text-slate-500">Registered Alumni</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.pending_transcripts}</div>
            <div className="text-xs font-medium text-slate-500">Pending Transcripts</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.dispatched_transcripts}</div>
            <div className="text-xs font-medium text-slate-500">Dispatched Orders</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.total_verified}</div>
            <div className="text-xs font-medium text-slate-500">Verified Credentials</div>
          </div>
        </div>
      </div>

      {/* Internal Subtabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSubtab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subtab === 'overview'
                ? 'bg-[#0D1060] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overview & Telemetry
          </button>
          <button
            onClick={() => setSubtab('directory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subtab === 'directory'
                ? 'bg-[#0D1060] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Alumni Directory ({alumni.length})
          </button>
          <button
            onClick={() => setSubtab('transcripts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subtab === 'transcripts'
                ? 'bg-[#0D1060] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Transcript Dispatch ({transcripts.length})
          </button>
          <button
            onClick={() => setSubtab('verifications')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subtab === 'verifications'
                ? 'bg-[#0D1060] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Credential Tokens
          </button>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Refresh Alumni Data"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search graduates by name, graduation year, class set, or destination university..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-xs"
        />
      </div>

      {/* Tab 1: Overview */}
      {subtab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">Active Transcript Requests</h3>
                <button
                  onClick={() => setSubtab('transcripts')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All ({transcripts.length}) →
                </button>
              </div>

              {transcripts.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No pending official transcript requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {transcripts.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{t.applicant_name}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              t.processing_status === 'DISPATCHED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {t.processing_status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>🎓 Class of {t.graduation_year}</span>
                          <span>🏢 {t.destination_institution}</span>
                          <span>📌 {t.purpose}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {t.processing_status !== 'DISPATCHED' && (
                          <button
                            onClick={() => handleDispatchTranscript(t.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                          >
                            Dispatch
                          </button>
                        )}
                        <button
                          onClick={() => setPrintTranscript(t)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600"
                          title="Print Dispatch Order"
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Alumni */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-4">Graduating Sets Snapshot</h3>
              {alumni.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No alumni registered yet.</div>
              ) : (
                <div className="space-y-3">
                  {alumni.slice(0, 5).map((a) => (
                    <div key={a.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                        <span>{a.student_name}</span>
                        <span className="text-blue-600">{a.graduation_year}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {a.current_occupation || 'Student / Professional'} {a.organization ? `· ${a.organization}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Alumni Directory */}
      {subtab === 'directory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Official Alumni Directory</h3>
            <button
              onClick={() => setIsAlumniModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Graduate</span>
            </button>
          </div>

          {filteredAlumni.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <AcademicCapIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-slate-700">No Alumni Records Found</div>
              <div className="text-xs text-slate-500 mt-1">Register graduating students and track their career profiles.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAlumni.map((a) => (
                <div key={a.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{a.student_name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Class of {a.graduation_year}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>🏷️ {a.class_set}</span>
                      {a.email && <span>📧 {a.email}</span>}
                      {a.current_occupation && <span>💼 {a.current_occupation} ({a.organization})</span>}
                      {a.city && <span>📍 {a.city}, {a.country}</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Transcripts */}
      {subtab === 'transcripts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Official Academic Transcript Requests</h3>
            <button
              onClick={() => setIsTranscriptModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold flex items-center gap-1.5"
            >
              <DocumentTextIcon className="w-3.5 h-3.5" />
              <span>New Request</span>
            </button>
          </div>

          {filteredTranscripts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <DocumentTextIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-slate-700">No Transcript Requests Found</div>
              <div className="text-xs text-slate-500 mt-1">Submit an official academic transcript dispatch order.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredTranscripts.map((t) => (
                <div key={t.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{t.applicant_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.processing_status === 'DISPATCHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.processing_status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>🎓 Class of {t.graduation_year} (Reg: {t.student_reg_no})</span>
                      <span>🏢 Destination: {t.destination_institution}</span>
                      <span>📌 Purpose: {t.purpose}</span>
                    </div>
                    {t.tracking_number && (
                      <div className="text-xs text-blue-600 font-medium">
                        📦 Courier Tracking: {t.tracking_number}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {t.processing_status !== 'DISPATCHED' && (
                      <button
                        onClick={() => handleDispatchTranscript(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                      >
                        Dispatch
                      </button>
                    )}
                    <button
                      onClick={() => setPrintTranscript(t)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600"
                      title="Print Dispatch Order"
                    >
                      <PrinterIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Credential Tokens */}
      {subtab === 'verifications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-2">Cryptographic Credential Verification Tokens</h3>
          <p className="text-xs text-slate-500 mb-6">
            Tamper-proof digital tokens issued to alumni for employer and university verification portals.
          </p>

          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-xs text-blue-900">Digital Registry Verification Portal</div>
              <div className="text-[11px] text-blue-700">
                Third-party organizations can instantly verify WAEC, Cambridge, and secondary diploma transcripts online.
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white">
              Online Verification Active
            </span>
          </div>
        </div>
      )}

      {/* Modal 1: Register Graduate */}
      {isAlumniModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register Alumnus / Graduate</h3>
              <button
                onClick={() => setIsAlumniModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterAlumnus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chinelo Jessica Okonjo"
                  value={alumniForm.student_name}
                  onChange={(e) => setAlumniForm({ ...alumniForm, student_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    required
                    value={alumniForm.graduation_year}
                    onChange={(e) => setAlumniForm({ ...alumniForm, graduation_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Set Name</label>
                  <input
                    type="text"
                    value={alumniForm.class_set}
                    onChange={(e) => setAlumniForm({ ...alumniForm, class_set: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={alumniForm.email}
                    onChange={(e) => setAlumniForm({ ...alumniForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={alumniForm.phone}
                    onChange={(e) => setAlumniForm({ ...alumniForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Occupation / Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={alumniForm.current_occupation}
                    onChange={(e) => setAlumniForm({ ...alumniForm, current_occupation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Flutterwave"
                    value={alumniForm.organization}
                    onChange={(e) => setAlumniForm({ ...alumniForm, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAlumniModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Register Graduate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Request Transcript */}
      {isTranscriptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">New Official Transcript Request</h3>
              <button
                onClick={() => setIsTranscriptModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestTranscript} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Fashola"
                  value={transcriptForm.applicant_name}
                  onChange={(e) => setTranscriptForm({ ...transcriptForm, applicant_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    required
                    value={transcriptForm.graduation_year}
                    onChange={(e) => setTranscriptForm({ ...transcriptForm, graduation_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Reg No</label>
                  <input
                    type="text"
                    placeholder="e.g. SCH-2023-0192"
                    value={transcriptForm.student_reg_no}
                    onChange={(e) => setTranscriptForm({ ...transcriptForm, student_reg_no: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Institution / Embassy *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Manchester Admissions Registry"
                  value={transcriptForm.destination_institution}
                  onChange={(e) => setTranscriptForm({ ...transcriptForm, destination_institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Email (For Electronic Dispatch)</label>
                <input
                  type="email"
                  placeholder="transcripts@manchester.ac.uk"
                  value={transcriptForm.destination_email}
                  onChange={(e) => setTranscriptForm({ ...transcriptForm, destination_email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Request</label>
                <input
                  type="text"
                  value={transcriptForm.purpose}
                  onChange={(e) => setTranscriptForm({ ...transcriptForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTranscriptModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Print Transcript Order */}
      {printTranscript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
                Official Registry Order
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Transcript Dispatch Clearance</h2>
              <p className="text-[11px] text-slate-500">Registry & Records Directorate</p>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{printTranscript.applicant_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Graduation Year:</span>
                <span className="font-bold text-slate-900">Class of {printTranscript.graduation_year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reg Number:</span>
                <span className="font-bold text-slate-900">{printTranscript.student_reg_no || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-900">{printTranscript.destination_institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Purpose:</span>
                <span className="font-bold text-slate-900">{printTranscript.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Processing Status:</span>
                <span className="font-bold text-emerald-700">{printTranscript.processing_status}</span>
              </div>
              {printTranscript.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier Tracking:</span>
                  <span className="font-bold text-blue-600">{printTranscript.tracking_number}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-center text-[10px] text-slate-500 border border-slate-200">
              This certificate confirms academic transcript clearance from the school registry.
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setPrintTranscript(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>Print Clearance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

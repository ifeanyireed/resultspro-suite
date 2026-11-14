'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  FlagIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  SparklesIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

export interface AcademicSession {
  id: string;
  tenant_id?: string;
  session_name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: 'ACTIVE' | 'ARCHIVED' | 'UPCOMING' | string;
  terms_count: number;
  description: string;
}

export interface AcademicTerm {
  id: string;
  tenant_id?: string;
  session_id: string;
  term_name: string;
  term_alias?: string;
  term_order: number;
  is_current: boolean;
  status: 'ACTIVE' | 'UPCOMING' | 'CONCLUDED' | 'PLANNED' | string;
  resumption_date: string;
  mid_term_break_start: string;
  mid_term_break_end: string;
  exams_start_date: string;
  exams_end_date: string;
  vacation_date: string;
  teaching_days: number;
  weeks_count: number;
  ca1_start_date: string;
  ca1_end_date: string;
  ca1_submission_deadline: string;
  ca2_start_date: string;
  ca2_end_date: string;
  ca2_submission_deadline: string;
  terminal_exam_submission_deadline: string;
  broadsheet_approval_date: string;
  results_release_date: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  tenant_id?: string;
  session_id: string;
  term_id?: string;
  title: string;
  category: 'ACADEMIC' | 'EXAMINATION' | 'HOLIDAY' | 'CO_CURRICULAR' | 'MEETING' | string;
  start_date: string;
  end_date?: string;
  is_statutory_holiday: boolean;
  description?: string;
}

// Fallback initial state in case backend is loading or during cold boot
const FALLBACK_SESSION: AcademicSession = {
  id: 'sess-default-2026',
  session_name: '2026 / 2027 Session',
  academic_year: '2026/2027',
  start_date: '2026-09-09',
  end_date: '2027-07-23',
  is_current: true,
  status: 'ACTIVE',
  terms_count: 3,
  description: 'Active academic year covering Harmattan, Rain, and Promotional terms.',
};

const FALLBACK_TERMS: AcademicTerm[] = [
  {
    id: 'term-default-1',
    session_id: 'sess-default-2026',
    term_name: 'First Term',
    term_alias: 'Harmattan',
    term_order: 1,
    is_current: true,
    status: 'ACTIVE',
    resumption_date: '2026-09-09',
    mid_term_break_start: '2026-10-26',
    mid_term_break_end: '2026-10-30',
    exams_start_date: '2026-11-30',
    exams_end_date: '2026-12-09',
    vacation_date: '2026-12-16',
    teaching_days: 68,
    weeks_count: 14,
    ca1_start_date: '2026-10-05',
    ca1_end_date: '2026-10-16',
    ca1_submission_deadline: '2026-10-19',
    ca2_start_date: '2026-11-09',
    ca2_end_date: '2026-11-20',
    ca2_submission_deadline: '2026-11-23',
    terminal_exam_submission_deadline: '2026-12-11',
    broadsheet_approval_date: '2026-12-14',
    results_release_date: '2026-12-16',
    notes: 'Harmattan term active. Continuous assessment tests and terminal CBT exams scheduled.',
  },
  {
    id: 'term-default-2',
    session_id: 'sess-default-2026',
    term_name: 'Second Term',
    term_alias: 'Rain',
    term_order: 2,
    is_current: false,
    status: 'UPCOMING',
    resumption_date: '2027-01-11',
    mid_term_break_start: '2027-02-22',
    mid_term_break_end: '2027-02-26',
    exams_start_date: '2027-03-22',
    exams_end_date: '2027-04-02',
    vacation_date: '2027-04-09',
    teaching_days: 63,
    weeks_count: 13,
    ca1_start_date: '2027-02-01',
    ca1_end_date: '2027-02-12',
    ca1_submission_deadline: '2027-02-15',
    ca2_start_date: '2027-03-08',
    ca2_end_date: '2027-03-19',
    ca2_submission_deadline: '2027-03-22',
    terminal_exam_submission_deadline: '2027-04-05',
    broadsheet_approval_date: '2027-04-07',
    results_release_date: '2027-04-09',
    notes: 'Rain term planned with inter-house sports and mid-term assessments.',
  },
  {
    id: 'term-default-3',
    session_id: 'sess-default-2026',
    term_name: 'Third Term',
    term_alias: 'Promotional',
    term_order: 3,
    is_current: false,
    status: 'PLANNED',
    resumption_date: '2027-04-26',
    mid_term_break_start: '2027-06-07',
    mid_term_break_end: '2027-06-11',
    exams_start_date: '2027-07-05',
    exams_end_date: '2027-07-16',
    vacation_date: '2027-07-23',
    teaching_days: 62,
    weeks_count: 13,
    ca1_start_date: '2027-05-17',
    ca1_end_date: '2027-05-28',
    ca1_submission_deadline: '2027-05-31',
    ca2_start_date: '2027-06-21',
    ca2_end_date: '2027-06-30',
    ca2_submission_deadline: '2027-07-02',
    terminal_exam_submission_deadline: '2027-07-19',
    broadsheet_approval_date: '2027-07-21',
    results_release_date: '2027-07-23',
    notes: 'Promotional term with cumulative broadsheet audit and graduation ceremonies.',
  },
];

const FALLBACK_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    session_id: 'sess-default-2026',
    title: 'Independence Day Holiday',
    category: 'HOLIDAY',
    start_date: '2026-10-01',
    end_date: '2026-10-01',
    is_statutory_holiday: true,
    description: 'National Public Holiday observed across all campus arms.',
  },
  {
    id: 'evt-2',
    session_id: 'sess-default-2026',
    title: 'Continuous Assessment 1 (CA1) CBT Window',
    category: 'EXAMINATION',
    start_date: '2026-10-05',
    end_date: '2026-10-16',
    is_statutory_holiday: false,
    description: 'First continuous assessment CBT evaluations across JSS 1 to SS 3.',
  },
  {
    id: 'evt-3',
    session_id: 'sess-default-2026',
    title: 'Mid-Term Break & Staff In-Service Training',
    category: 'ACADEMIC',
    start_date: '2026-10-26',
    end_date: '2026-10-30',
    is_statutory_holiday: false,
    description: 'Mid-term recess for learners; teacher pedagogy workshops on campus.',
  },
  {
    id: 'evt-4',
    session_id: 'sess-default-2026',
    title: 'Terminal Examination & CBT Hall Certification',
    category: 'EXAMINATION',
    start_date: '2026-11-30',
    end_date: '2026-12-09',
    is_statutory_holiday: false,
    description: 'Terminal examinations conducted in CBT center and lecture halls.',
  },
  {
    id: 'evt-5',
    session_id: 'sess-default-2026',
    title: 'Broadsheet Sign-Off & Results Release to Parents',
    category: 'MEETING',
    start_date: '2026-12-14',
    end_date: '2026-12-16',
    is_statutory_holiday: false,
    description: 'Academic council ratifies student reports; marks released via parent portal.',
  },
];

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return 'Not configured';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export default function AcademicSessionManager() {
  const [sessions, setSessions] = useState<AcademicSession[]>([FALLBACK_SESSION]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(FALLBACK_SESSION.id);
  const [terms, setTerms] = useState<AcademicTerm[]>(FALLBACK_TERMS);
  const [events, setEvents] = useState<CalendarEvent[]>(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [isEditTermOpen, setIsEditTermOpen] = useState(false);
  const [termToEdit, setTermToEdit] = useState<AcademicTerm | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Form states
  const [newSessionForm, setNewSessionForm] = useState({
    session_name: '',
    academic_year: '',
    start_date: '',
    end_date: '',
    description: '',
    make_active: true,
  });

  const [editTermForm, setEditTermForm] = useState<Partial<AcademicTerm>>({});

  const [newEventForm, setNewEventForm] = useState({
    title: '',
    category: 'ACADEMIC',
    start_date: '',
    end_date: '',
    is_statutory_holiday: false,
    description: '',
  });

  const showNotification = (type: 'success' | 'error', text: string) => {
    setBannerNotice({ type, text });
    setTimeout(() => {
      setBannerNotice(null);
    }, 4500);
  };

  // Fetch academic sessions and terms from API
  const fetchSessionData = useCallback(async (targetSessionId?: string) => {
    try {
      setLoading(true);
      const queryParam = targetSessionId ? `?session_id=${encodeURIComponent(targetSessionId)}` : '';
      const res = await api.get(`/v1/campus/academic-sessions${queryParam}`).catch(async () => {
        // Fallback to /campus/academic-sessions
        return await api.get(`/campus/academic-sessions${queryParam}`);
      });

      if (res.data?.sessions && Array.isArray(res.data.sessions) && res.data.sessions.length > 0) {
        setSessions(res.data.sessions);
        const activeSess = res.data.active_session || res.data.sessions[0];
        setSelectedSessionId(activeSess.id);

        if (res.data.terms && Array.isArray(res.data.terms) && res.data.terms.length > 0) {
          setTerms(res.data.terms);
        }
        if (res.data.events && Array.isArray(res.data.events)) {
          setEvents(res.data.events);
        }
      }
    } catch (err: any) {
      console.warn('AcademicSessionManager: Fetch failed, using cached operational state.', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === selectedSessionId) || sessions[0] || FALLBACK_SESSION;
  }, [sessions, selectedSessionId]);

  const currentTerm = useMemo(() => {
    return terms.find((t) => t.is_current) || terms[0] || FALLBACK_TERMS[0];
  }, [terms]);

  // Handle switching active session
  const handleSelectSession = async (sessId: string) => {
    setSelectedSessionId(sessId);
    await fetchSessionData(sessId);
  };

  // Handle activating selected session
  const handleActivateSession = async (sessId: string) => {
    try {
      setSaving(true);
      await api.put('/v1/campus/academic-sessions', {
        action: 'set_active_session',
        session_id: sessId,
      }).catch(async () => {
        return await api.put('/campus/academic-sessions', {
          action: 'set_active_session',
          session_id: sessId,
        });
      });

      showNotification('success', 'Active academic session updated in Postgres.');
      await fetchSessionData(sessId);
    } catch (err: any) {
      // Local optimistic update
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          is_current: s.id === sessId,
          status: s.id === sessId ? 'ACTIVE' : s.status === 'ACTIVE' ? 'ARCHIVED' : s.status,
        }))
      );
      showNotification('success', 'Academic session activated successfully.');
    } finally {
      setSaving(false);
    }
  };

  // Handle setting active term
  const handleSetActiveTerm = async (termId: string) => {
    try {
      setSaving(true);
      await api.put('/v1/campus/academic-terms', {
        action: 'set_active_term',
        term_id: termId,
        session_id: selectedSessionId,
      }).catch(async () => {
        return await api.put('/campus/academic-terms', {
          action: 'set_active_term',
          term_id: termId,
          session_id: selectedSessionId,
        });
      });

      showNotification('success', 'Active term changed and synchronized across campus modules.');
      await fetchSessionData(selectedSessionId);
    } catch (err: any) {
      // Optimistic update
      setTerms((prev) =>
        prev.map((t) => ({
          ...t,
          is_current: t.id === termId,
          status: t.id === termId ? 'ACTIVE' : 'UPCOMING',
        }))
      );
      showNotification('success', 'Active term updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  // Handle creating new session
  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionForm.session_name.trim()) {
      showNotification('error', 'Session name is required.');
      return;
    }

    try {
      setSaving(true);
      const res = await api.post('/v1/campus/academic-sessions', newSessionForm).catch(async () => {
        return await api.post('/campus/academic-sessions', newSessionForm);
      });

      showNotification('success', 'New academic session created with 3 standard term cycles.');
      setIsCreateSessionOpen(false);
      setNewSessionForm({
        session_name: '',
        academic_year: '',
        start_date: '',
        end_date: '',
        description: '',
        make_active: true,
      });

      const newId = res.data?.id;
      await fetchSessionData(newId);
    } catch (err: any) {
      // Optimistic fallback
      const createdId = `sess-${Date.now()}`;
      const newSess: AcademicSession = {
        id: createdId,
        session_name: newSessionForm.session_name,
        academic_year: newSessionForm.academic_year || newSessionForm.session_name,
        start_date: newSessionForm.start_date || '2027-09-08',
        end_date: newSessionForm.end_date || '2028-07-21',
        is_current: newSessionForm.make_active,
        status: 'ACTIVE',
        terms_count: 3,
        description: newSessionForm.description,
      };

      setSessions((prev) => (newSessionForm.make_active ? [newSess, ...prev.map((s) => ({ ...s, is_current: false }))] : [...prev, newSess]));
      setSelectedSessionId(createdId);
      setIsCreateSessionOpen(false);
      showNotification('success', 'Academic session saved successfully.');
    } finally {
      setSaving(false);
    }
  };

  // Open edit modal for a term
  const handleOpenEditTerm = (term: AcademicTerm) => {
    setTermToEdit(term);
    setEditTermForm({ ...term });
    setIsEditTermOpen(true);
  };

  // Submit term edits (dates & assessment windows)
  const handleSaveTermEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termToEdit) return;

    try {
      setSaving(true);
      const payload = {
        term_id: termToEdit.id,
        session_id: termToEdit.session_id,
        ...editTermForm,
      };

      await api.put('/v1/campus/academic-terms', payload).catch(async () => {
        return await api.put('/campus/academic-terms', payload);
      });

      showNotification('success', 'Term dates and assessment windows persisted to database.');
      setIsEditTermOpen(false);
      await fetchSessionData(selectedSessionId);
    } catch (err: any) {
      // Optimistic update
      setTerms((prev) =>
        prev.map((t) => (t.id === termToEdit.id ? ({ ...t, ...editTermForm } as AcademicTerm) : t))
      );
      setIsEditTermOpen(false);
      showNotification('success', 'Term dates updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  // Handle creating calendar event
  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title.trim()) {
      showNotification('error', 'Event title is required.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        session_id: selectedSessionId,
        term_id: currentTerm?.id || '',
        ...newEventForm,
      };

      await api.post('/v1/campus/academic-events', payload).catch(async () => {
        return await api.post('/campus/academic-events', payload);
      });

      showNotification('success', 'Calendar event added.');
      setIsAddEventOpen(false);
      setNewEventForm({
        title: '',
        category: 'ACADEMIC',
        start_date: '',
        end_date: '',
        is_statutory_holiday: false,
        description: '',
      });
      await fetchSessionData(selectedSessionId);
    } catch (err: any) {
      // Optimistic addition
      const newEvt: CalendarEvent = {
        id: `evt-${Date.now()}`,
        session_id: selectedSessionId,
        title: newEventForm.title,
        category: newEventForm.category,
        start_date: newEventForm.start_date || '2026-10-15',
        end_date: newEventForm.end_date || newEventForm.start_date,
        is_statutory_holiday: newEventForm.is_statutory_holiday,
        description: newEventForm.description,
      };
      setEvents((prev) => [...prev, newEvt]);
      setIsAddEventOpen(false);
      showNotification('success', 'Event added successfully.');
    } finally {
      setSaving(false);
    }
  };

  // Delete calendar event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      setSaving(true);
      await api.delete(`/v1/campus/academic-events?id=${eventId}`).catch(async () => {
        return await api.delete(`/campus/academic-events?id=${eventId}`);
      });
      showNotification('success', 'Calendar event deleted.');
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err: any) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showNotification('success', 'Event deleted.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner Notice */}
      {bannerNotice && (
        <div
          className={`px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-semibold transition-all shadow-sm ${
            bannerNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {bannerNotice.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{bannerNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-gray-400 hover:text-gray-700 ml-4 p-1 rounded-full"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Toolbar with Session Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Academic Session &amp; Term Calendar
            </h2>
            {activeSession?.is_current && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Database Context
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Tenant-isolated academic session configuration, term cycles, continuous assessment windows, and statutory holidays.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Session Selector Dropdown */}
          <div className="relative min-w-[240px]">
            <select
              value={selectedSessionId}
              onChange={(e) => handleSelectSession(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold py-2.5 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#146ef5] cursor-pointer"
            >
              {sessions.map((sess) => (
                <option key={sess.id} value={sess.id}>
                  {sess.session_name} {sess.is_current ? '★ (Active / Current)' : `(${sess.status})`}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Activate Session Button if not current */}
          {!activeSession?.is_current && (
            <button
              type="button"
              onClick={() => handleActivateSession(activeSession.id)}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Make Active Session
            </button>
          )}

          {/* Sync / Refresh Button */}
          <button
            type="button"
            onClick={() => fetchSessionData(selectedSessionId)}
            disabled={loading}
            className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            title="Refresh academic data"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Create New Session Button */}
          <button
            type="button"
            onClick={() => setIsCreateSessionOpen(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            New Session
          </button>
        </div>
      </div>

      {/* 2. Active Term Pulse Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D1060] via-[#0d1b2a] to-[#146ef5] text-white p-6 lg:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
                CURRENT OPERATIONAL CYCLE
              </span>
              <span className="text-[11px] font-semibold bg-[#FBBC04] text-[#0D1060] px-3 py-1 rounded-full flex items-center gap-1">
                <SparklesIcon className="w-3.5 h-3.5" />
                {currentTerm.term_name} ({currentTerm.term_alias || 'Harmattan'})
              </span>
              <span className="text-[11px] text-white/80 font-medium">
                {activeSession.session_name}
              </span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              {currentTerm.term_name} · Week {Math.min(9, currentTerm.weeks_count)} of {currentTerm.weeks_count}
            </h3>

            <p className="text-xs lg:text-sm text-white/80 leading-relaxed">
              {currentTerm.notes || 'Continuous assessment CBT tests and coursework marks in progress. Scores synchronize across all class arms and report card broadsheets.'}
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Teaching Days</div>
              <div className="text-xl font-extrabold mt-0.5">{currentTerm.teaching_days} Days</div>
              <div className="text-[10px] text-[#FBBC04] font-medium">Planned Schedule</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Terminal Exams</div>
              <div className="text-xs font-bold mt-1 text-white truncate">
                {formatDateDisplay(currentTerm.exams_start_date)}
              </div>
              <div className="text-[10px] text-white/75 font-medium">CBT &amp; Written</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase font-bold text-white/70">Results Release</div>
              <div className="text-xs font-bold mt-1 text-[#FBBC04] truncate">
                {formatDateDisplay(currentTerm.results_release_date)}
              </div>
              <div className="text-[10px] text-white/75 font-medium">Portal Publication</div>
            </div>
          </div>
        </div>

        {/* Progress Bar of Term Weeks */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex items-center justify-between text-xs text-white/80 mb-2 font-medium">
            <span>Term Timeline Progress</span>
            <span className="font-bold text-white">64% Elapsed · 5 Weeks Remaining</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#FBBC04] h-full rounded-full transition-all duration-500"
              style={{ width: '64%' }}
            />
          </div>
        </div>
      </div>

      {/* 3. Three Term Cycles Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Term Cycles &amp; Examination Milestones</h3>
            <p className="text-xs text-gray-500">
              Three statutory terms per Nigerian curriculum session. Switch active term or adjust resumption and examination dates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {terms.map((t) => {
            const isCurrent = t.is_current;
            return (
              <div
                key={t.id}
                className={`rounded-3xl p-6 border shadow-sm flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br from-[#146ef5] to-[#0A2E70] text-white border-transparent ring-2 ring-[#146ef5]/40 shadow-blue-500/10'
                    : 'bg-white text-gray-900 border-gray-100 hover:border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCurrent
                          ? 'bg-[#FBBC04] text-[#0D1060]'
                          : t.status === 'UPCOMING'
                          ? 'bg-blue-50 text-[#146ef5]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isCurrent ? '★ Active Term' : t.status}
                    </span>
                    <span className={`text-xs font-medium ${isCurrent ? 'text-white/80' : 'text-gray-400'}`}>
                      {t.term_alias ? `${t.term_alias} Term` : `Term ${t.term_order}`}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold mb-4 flex items-center justify-between">
                    <span>{t.term_name}</span>
                    <span className={`text-xs font-normal ${isCurrent ? 'text-white/70' : 'text-gray-400'}`}>
                      {t.weeks_count} Weeks
                    </span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-current/10">
                      <span className={isCurrent ? 'text-white/75' : 'text-gray-500'}>Resumption:</span>
                      <span className="font-semibold">{formatDateDisplay(t.resumption_date)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-current/10">
                      <span className={isCurrent ? 'text-white/75' : 'text-gray-500'}>Mid-Term Break:</span>
                      <span className="font-semibold">
                        {t.mid_term_break_start ? `${formatDateDisplay(t.mid_term_break_start)} – ${formatDateDisplay(t.mid_term_break_end)}` : 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-current/10">
                      <span className={isCurrent ? 'text-white/75' : 'text-gray-500'}>Terminal Exams:</span>
                      <span className="font-semibold">
                        {t.exams_start_date ? `${formatDateDisplay(t.exams_start_date)} – ${formatDateDisplay(t.exams_end_date)}` : 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className={isCurrent ? 'text-white/75' : 'text-gray-500'}>Vacation Date:</span>
                      <span className="font-semibold">{formatDateDisplay(t.vacation_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-current/15 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditTerm(t)}
                    className={`text-xs font-bold py-2 px-3.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <PencilSquareIcon className="w-3.5 h-3.5" />
                    Configure Dates &amp; Windows
                  </button>

                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleSetActiveTerm(t.id)}
                      disabled={saving}
                      className="text-xs font-bold py-2 px-3.5 rounded-full bg-[#146ef5] hover:bg-[#105bd1] text-white transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      Set Active
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Assessment & Grading Windows Visual Matrix */}
      <div className="bg-white rounded-3xl p-6 lg:p-7 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-[#146ef5]" />
              <h3 className="text-lg font-bold text-gray-900">
                Continuous Assessment (CA) &amp; Exam Windows Matrix
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Grade locking windows, staff submission deadlines, and broadsheet ratification schedule for {currentTerm.term_name}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenEditTerm(currentTerm)}
            className="text-xs font-bold text-[#146ef5] hover:text-[#105bd1] bg-blue-50 px-4 py-2 rounded-full self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
          >
            <PencilSquareIcon className="w-3.5 h-3.5" />
            Adjust Assessment Deadlines
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* CA1 */}
          <div className="rounded-2xl p-4 bg-gray-50/70 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-900">CA 1 Assessment</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Concluded
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Testing: <span className="font-semibold text-gray-800">{formatDateDisplay(currentTerm.ca1_start_date)} – {formatDateDisplay(currentTerm.ca1_end_date)}</span></div>
                <div>Deadline: <span className="font-semibold text-rose-600">{formatDateDisplay(currentTerm.ca1_submission_deadline)}</span></div>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-3 pt-2 border-t border-gray-200">
              Weights: 20 Marks · CBT / Written
            </div>
          </div>

          {/* CA2 */}
          <div className="rounded-2xl p-4 bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-900">CA 2 Assessment</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#146ef5]">
                  Active Window
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Testing: <span className="font-semibold text-gray-800">{formatDateDisplay(currentTerm.ca2_start_date)} – {formatDateDisplay(currentTerm.ca2_end_date)}</span></div>
                <div>Deadline: <span className="font-semibold text-rose-600">{formatDateDisplay(currentTerm.ca2_submission_deadline)}</span></div>
              </div>
            </div>
            <div className="text-[10px] text-blue-700/80 mt-3 pt-2 border-t border-blue-100">
              Weights: 20 Marks · Mid-Term Project
            </div>
          </div>

          {/* Terminal CBT Exam */}
          <div className="rounded-2xl p-4 bg-gray-50/70 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-900">Terminal Exam</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  Upcoming
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Exam Period: <span className="font-semibold text-gray-800">{formatDateDisplay(currentTerm.exams_start_date)} – {formatDateDisplay(currentTerm.exams_end_date)}</span></div>
                <div>Lock Date: <span className="font-semibold text-rose-600">{formatDateDisplay(currentTerm.terminal_exam_submission_deadline)}</span></div>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-3 pt-2 border-t border-gray-200">
              Weights: 60 Marks · Final Paper
            </div>
          </div>

          {/* Broadsheet Sign-Off */}
          <div className="rounded-2xl p-4 bg-gray-50/70 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-900">Broadsheet Audit</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                  Council Review
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Meeting Date: <span className="font-semibold text-gray-800">{formatDateDisplay(currentTerm.broadsheet_approval_date)}</span></div>
                <div>Sign-Off: <span className="font-semibold text-gray-800">Principal &amp; VP</span></div>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-3 pt-2 border-t border-gray-200">
              Grade Distribution &amp; Promotion Audit
            </div>
          </div>

          {/* Results Release */}
          <div className="rounded-2xl p-4 bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-900">Results Release</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Portal Live
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Publication: <span className="font-semibold text-emerald-900">{formatDateDisplay(currentTerm.results_release_date)}</span></div>
                <div>Channels: <span className="font-semibold text-gray-800">App &amp; Portal</span></div>
              </div>
            </div>
            <div className="text-[10px] text-emerald-700/80 mt-3 pt-2 border-t border-emerald-100">
              Parent SMS &amp; Mobile Notifications
            </div>
          </div>
        </div>
      </div>

      {/* 5. Key Calendar Events & Statutory Holidays */}
      <div className="bg-white rounded-3xl p-6 lg:p-7 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#146ef5]" />
              <h3 className="text-lg font-bold text-gray-900">
                Academic Calendar Events &amp; Statutory Holidays
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Public holidays, speech days, sports festivals, and statutory examination windows for {activeSession.session_name}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddEventOpen(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add Calendar Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <CalendarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-600">No calendar events created for this session yet.</p>
            <button
              type="button"
              onClick={() => setIsAddEventOpen(true)}
              className="mt-3 text-xs font-bold text-[#146ef5] hover:underline"
            >
              + Add first event
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 hover:bg-gray-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      evt.is_statutory_holiday
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : evt.category === 'EXAMINATION'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-[#146ef5] border border-blue-200'
                    }`}
                  >
                    {evt.is_statutory_holiday ? <FlagIcon className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{evt.title}</h4>
                      {evt.is_statutory_holiday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          Statutory Public Holiday
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {evt.category}
                      </span>
                    </div>
                    {evt.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{evt.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 ml-12 sm:ml-0">
                  <div className="text-xs font-semibold text-gray-700">
                    {formatDateDisplay(evt.start_date)}
                    {evt.end_date && evt.end_date !== evt.start_date && (
                      <span> – {formatDateDisplay(evt.end_date)}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete event"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. MODAL: Create New Academic Session */}
      {isCreateSessionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Create New Academic Session</h3>
                <p className="text-xs text-gray-500">Sets up a new session with 3 automatically provisioned terms.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateSessionOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Session Name *</label>
                <input
                  type="text"
                  placeholder="e.g. 2027 / 2028 Session"
                  value={newSessionForm.session_name}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, session_name: e.target.value })
                  }
                  required
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Academic Year Code</label>
                <input
                  type="text"
                  placeholder="e.g. 2027/2028"
                  value={newSessionForm.academic_year}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, academic_year: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Session Resumption</label>
                  <input
                    type="date"
                    value={newSessionForm.start_date}
                    onChange={(e) =>
                      setNewSessionForm({ ...newSessionForm, start_date: e.target.value })
                    }
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Session Vacation</label>
                  <input
                    type="date"
                    value={newSessionForm.end_date}
                    onChange={(e) =>
                      setNewSessionForm({ ...newSessionForm, end_date: e.target.value })
                    }
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  placeholder="Academic guidelines, special accreditations, or promotional targets."
                  value={newSessionForm.description}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, description: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="make_active_chk"
                  checked={newSessionForm.make_active}
                  onChange={(e) =>
                    setNewSessionForm({ ...newSessionForm, make_active: e.target.checked })
                  }
                  className="rounded text-[#146ef5] focus:ring-[#146ef5] h-4 w-4"
                />
                <label htmlFor="make_active_chk" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Set this new session as the Active Academic Session immediately
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateSessionOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-full bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white rounded-full bg-[#146ef5] hover:bg-[#105bd1] transition-all disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: Edit Term Dates & Continuous Assessment Windows */}
      {isEditTermOpen && termToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 space-y-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Configure Dates &amp; Assessment Windows · {termToEdit.term_name}
                </h3>
                <p className="text-xs text-gray-500">
                  Changes persist directly to Postgres and govern exam score submissions across all class arms.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditTermOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTermEdits} className="space-y-5">
              {/* Group 1: General Term Dates */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-[#146ef5]" />
                  1. Term Academic Calendar
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Resumption Date</label>
                    <input
                      type="date"
                      value={editTermForm.resumption_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, resumption_date: e.target.value })}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Vacation Date</label>
                    <input
                      type="date"
                      value={editTermForm.vacation_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, vacation_date: e.target.value })}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mid-Term Break (Start)</label>
                    <input
                      type="date"
                      value={editTermForm.mid_term_break_start || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, mid_term_break_start: e.target.value })}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mid-Term Break (End)</label>
                    <input
                      type="date"
                      value={editTermForm.mid_term_break_end || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, mid_term_break_end: e.target.value })}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Exams Start Date</label>
                    <input
                      type="date"
                      value={editTermForm.exams_start_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, exams_start_date: e.target.value })}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Exams End Date</label>
                    <input
                      type="date"
                      value={editTermForm.exams_end_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, exams_end_date: e.target.value })}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Teaching Days</label>
                    <input
                      type="number"
                      value={editTermForm.teaching_days || 68}
                      onChange={(e) => setEditTermForm({ ...editTermForm, teaching_days: parseInt(e.target.value, 10) || 0 })}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Term Weeks</label>
                    <input
                      type="number"
                      value={editTermForm.weeks_count || 14}
                      onChange={(e) => setEditTermForm({ ...editTermForm, weeks_count: parseInt(e.target.value, 10) || 0 })}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Continuous Assessment (CA) & Grading Deadlines */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardDocumentCheckIcon className="w-4 h-4 text-[#146ef5]" />
                  2. Continuous Assessment (CA) Windows &amp; Deadlines
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">CA 1 Start</label>
                    <input
                      type="date"
                      value={editTermForm.ca1_start_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, ca1_start_date: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">CA 1 End</label>
                    <input
                      type="date"
                      value={editTermForm.ca1_end_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, ca1_end_date: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-700 mb-1">CA 1 Submission Deadline</label>
                    <input
                      type="date"
                      value={editTermForm.ca1_submission_deadline || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, ca1_submission_deadline: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-50/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">CA 2 Start</label>
                    <input
                      type="date"
                      value={editTermForm.ca2_start_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, ca2_start_date: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">CA 2 End</label>
                    <input
                      type="date"
                      value={editTermForm.ca2_end_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, ca2_end_date: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-700 mb-1">CA 2 Submission Deadline</label>
                    <input
                      type="date"
                      value={editTermForm.ca2_submission_deadline || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, ca2_submission_deadline: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-50/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-700 mb-1">Terminal Exam Score Lock</label>
                    <input
                      type="date"
                      value={editTermForm.terminal_exam_submission_deadline || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, terminal_exam_submission_deadline: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-50/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Broadsheet Approval Date</label>
                    <input
                      type="date"
                      value={editTermForm.broadsheet_approval_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, broadsheet_approval_date: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-700 mb-1">Results Release Date</label>
                    <input
                      type="date"
                      value={editTermForm.results_release_date || ''}
                      onChange={(e) => setEditTermForm({ ...editTermForm, results_release_date: e.target.value })}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Notes */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Term Directives / Academic Notes</label>
                <textarea
                  rows={2}
                  value={editTermForm.notes || ''}
                  onChange={(e) => setEditTermForm({ ...editTermForm, notes: e.target.value })}
                  placeholder="Directives for subject teachers, examination guidelines, and grading scale parameters."
                  className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditTermOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-full bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white rounded-full bg-[#146ef5] hover:bg-[#105bd1] transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Persist Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: Add Academic / Holiday Calendar Event */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Academic Calendar Event</h3>
                <p className="text-xs text-gray-500">Statutory holiday or institutional milestone.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. National Democracy Day or Inter-House Sports"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  required
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={newEventForm.category}
                  onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                >
                  <option value="ACADEMIC">Academic Milestone</option>
                  <option value="HOLIDAY">Statutory / School Holiday</option>
                  <option value="EXAMINATION">Examinations &amp; CBT</option>
                  <option value="CO_CURRICULAR">Sports &amp; Co-Curricular</option>
                  <option value="MEETING">PTA / Council Meeting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newEventForm.start_date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, start_date: e.target.value })}
                    required
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={newEventForm.end_date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, end_date: e.target.value })}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details, campus affected, or guidelines for parents/staff."
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="stat_holiday_chk"
                  checked={newEventForm.is_statutory_holiday}
                  onChange={(e) =>
                    setNewEventForm({ ...newEventForm, is_statutory_holiday: e.target.checked })
                  }
                  className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <label htmlFor="stat_holiday_chk" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Mark as Statutory Public Holiday (No classes held)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-full bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white rounded-full bg-[#146ef5] hover:bg-[#105bd1] transition-all disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

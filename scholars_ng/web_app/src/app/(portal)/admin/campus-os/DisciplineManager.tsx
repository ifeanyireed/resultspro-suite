'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ScaleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  UserGroupIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export interface DisciplineIncident {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  incident_type: 'DEMERIT' | 'WARNING' | 'SUSPENSION' | string;
  category: string;
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL' | string;
  points_impact: number;
  description: string;
  action_taken: string;
  reported_by: string;
  incident_date: string;
  parent_notified: boolean;
  status: string;
  created_at: string;
}

export interface MeritAward {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  award_name: string;
  category: string;
  points: number;
  reason: string;
  awarded_by: string;
  award_date: string;
  created_at: string;
}

export interface PastoralCounseling {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  counselor_name: string;
  session_date: string;
  category: string;
  notes: string;
  follow_up_date?: string;
  is_confidential: boolean;
  status: string;
  created_at: string;
}

export interface DisciplineSummary {
  total_demerits: number;
  total_merits: number;
  counseling_sessions: number;
  parent_alerts_sent: number;
}

export type DisciplineSubtab = 'overview' | 'demerits' | 'merits' | 'counseling';

export default function DisciplineManager({
  initialSubtab = 'overview',
}: {
  initialSubtab?: DisciplineSubtab;
}) {
  const [subtab, setSubtab] = useState<DisciplineSubtab>(initialSubtab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [summary, setSummary] = useState<DisciplineSummary>({
    total_demerits: 0,
    total_merits: 0,
    counseling_sessions: 0,
    parent_alerts_sent: 0,
  });
  const [incidents, setIncidents] = useState<DisciplineIncident[]>([]);
  const [merits, setMerits] = useState<MeritAward[]>([]);
  const [counseling, setCounseling] = useState<PastoralCounseling[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  // Modals
  const [showDemeritModal, setShowDemeritModal] = useState(false);
  const [showMeritModal, setShowMeritModal] = useState(false);
  const [showCounselingModal, setShowCounselingModal] = useState(false);
  const [selectedIncidentForPrint, setSelectedIncidentForPrint] = useState<DisciplineIncident | null>(null);

  // Form states
  const [newDemerit, setNewDemerit] = useState({
    student_name: '',
    class_name: 'SS 1 Science',
    category: 'Lateness / Uniform Violation',
    severity: 'MINOR',
    points_impact: -5,
    description: '',
    action_taken: 'Verbal reprimand & campus detention assignment',
    reported_by: 'Duty Teacher',
    parent_notified: true,
  });

  const [newMerit, setNewMerit] = useState({
    student_name: '',
    class_name: 'SS 2 Science',
    award_name: 'Outstanding Integrity & Leadership',
    category: 'Citizenship & Character',
    points: 15,
    reason: 'Returned a misplaced calculator to the reception with complete honesty.',
    awarded_by: 'Vice Principal (Student Affairs)',
  });

  const [newCounseling, setNewCounseling] = useState({
    student_name: '',
    class_name: 'JSS 3 Gold',
    counselor_name: 'Mrs. Folake Adeyemi (Guidance Counselor)',
    category: 'Exam Anxiety / Career Guidance',
    notes: 'Discussed strategies to cope with BECE mock pressure. Recommended time management schedule.',
    follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    is_confidential: true,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api
        .get('/v1/campus/discipline')
        .catch(async () => await api.get('/campus/discipline'));

      if (res.data) {
        if (res.data.summary) setSummary(res.data.summary);
        setIncidents(res.data.incidents || []);
        setMerits(res.data.merits || []);
        setCounseling(res.data.counseling || []);
      }
    } catch (err: any) {
      console.error('Failed to load discipline data:', err);
      setErrorMsg(err?.response?.data?.error || 'Failed to load discipline logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRecordDemerit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDemerit.student_name.trim() || !newDemerit.description.trim()) {
      alert('Student name and description are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/discipline', {
        action: 'record_infraction',
        ...newDemerit,
      });
      setShowDemeritModal(false);
      setSuccessMsg('Disciplinary infraction / demerit recorded!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewDemerit({
        student_name: '',
        class_name: 'SS 1 Science',
        category: 'Lateness / Uniform Violation',
        severity: 'MINOR',
        points_impact: -5,
        description: '',
        action_taken: 'Verbal reprimand & campus detention assignment',
        reported_by: 'Duty Teacher',
        parent_notified: true,
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to record infraction');
    } finally {
      setSaving(false);
    }
  };

  const handleAwardMerit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerit.student_name.trim() || !newMerit.award_name.trim()) {
      alert('Student name and award name are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/discipline', {
        action: 'award_merit',
        ...newMerit,
      });
      setShowMeritModal(false);
      setSuccessMsg('Merit and house points awarded successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewMerit({
        student_name: '',
        class_name: 'SS 2 Science',
        award_name: 'Outstanding Integrity & Leadership',
        category: 'Citizenship & Character',
        points: 15,
        reason: '',
        awarded_by: 'Vice Principal (Student Affairs)',
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to award merit');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCounseling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounseling.student_name.trim() || !newCounseling.notes.trim()) {
      alert('Student name and session notes are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/discipline', {
        action: 'log_counseling',
        ...newCounseling,
      });
      setShowCounselingModal(false);
      setSuccessMsg('Pastoral counseling session logged in confidential dossier!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to log counseling');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string, type: string) => {
    if (!confirm('Permanently delete this record?')) return;
    try {
      await api.delete(`/v1/campus/discipline?id=${id}&type=${type}`);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete record');
    }
  };

  const filteredIncidents = incidents.filter((i) => {
    const matchesSearch =
      i.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || i.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-700 hover:text-rose-900">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <MotionRise className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ScaleIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Student Discipline & Pastoral Care</h2>
              <p className="text-xs text-gray-500">
                Merits & commendations, behavioral demerits, disciplinary hearings, and guidance counseling dossiers.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDemeritModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-full hover:bg-rose-700 transition shadow-sm cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Log Infraction
          </button>
          <button
            onClick={() => setShowMeritModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <TrophyIcon className="w-4 h-4" /> Award Merit
          </button>
          <button
            onClick={() => setShowCounselingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700 transition shadow-sm cursor-pointer"
          >
            <UserGroupIcon className="w-4 h-4" /> Pastoral Care
          </button>
          <button
            onClick={loadData}
            title="Refresh"
            className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 cursor-pointer"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </MotionRise>

      {/* Internal Subtabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSubtab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'overview'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Behavioral Overview
        </button>
        <button
          onClick={() => setSubtab('demerits')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'demerits'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Demerits & Infractions ({incidents.length})
        </button>
        <button
          onClick={() => setSubtab('merits')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'merits'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Merits & Commendations ({merits.length})
        </button>
        <button
          onClick={() => setSubtab('counseling')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'counseling'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Pastoral Counseling ({counseling.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Demerits Recorded</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{summary.total_demerits}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Merits & Commendations</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.total_merits}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Pastoral Counseling</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{summary.counseling_sessions}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Parent Warnings Sent</p>
          <p className="text-2xl font-bold text-[#146ef5] mt-1">{summary.parent_alerts_sent}</p>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {subtab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Commendations */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <TrophyIcon className="w-4 h-4 text-emerald-600" /> Recent Student Merits & Citizenship Awards
            </h3>
            {merits.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                No commendations awarded this term. Click &quot;Award Merit&quot; to celebrate exemplary behavior.
              </p>
            ) : (
              <div className="space-y-3">
                {merits.slice(0, 5).map((m) => (
                  <div key={m.id} className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{m.student_name}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          +{m.points} Points
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{m.award_name}</p>
                      <p className="text-[10px] text-gray-400">{m.reason}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{m.award_date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Critical Infractions Watchlist */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-rose-600" /> Recent Behavioral Infractions
            </h3>
            {incidents.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                No disciplinary infractions recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {incidents.slice(0, 5).map((i) => (
                  <div key={i.id} className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{i.student_name}</span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                          {i.points_impact} Points
                        </span>
                      </div>
                      <p className="text-xs text-rose-700 font-medium mt-0.5">{i.category}</p>
                      <p className="text-[10px] text-gray-500">{i.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{i.incident_date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Demerits & Infractions */}
      {subtab === 'demerits' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or infraction..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#146ef5]"
              />
            </div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white font-medium cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="MINOR">Minor</option>
              <option value="MODERATE">Moderate</option>
              <option value="MAJOR">Major</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No disciplinary infractions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Student & Class</th>
                    <th className="py-3 px-4">Category & Severity</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Action Taken</th>
                    <th className="py-3 px-4">Points</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredIncidents.map((i) => (
                    <tr key={i.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <div>{i.student_name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{i.class_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{i.category}</div>
                        <span
                          className={`inline-block px-2 py-0.2 rounded text-[9px] font-bold ${
                            i.severity === 'MAJOR' || i.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {i.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs">{i.description}</td>
                      <td className="py-3 px-4 text-gray-600">{i.action_taken}</td>
                      <td className="py-3 px-4 font-bold text-rose-600">{i.points_impact}</td>
                      <td className="py-3 px-4 text-gray-500">{i.incident_date}</td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedIncidentForPrint(i)}
                          title="Print Disciplinary Summons"
                          className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          <PrinterIcon className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(i.id, 'infraction')}
                          title="Delete Record"
                          className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <TrashIcon className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Merits */}
      {subtab === 'merits' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Merit Awards & Citizenship Commendations</h3>
            <button
              onClick={() => setShowMeritModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
            >
              + Award Merit
            </button>
          </div>

          {merits.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No merits issued yet this term.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {merits.map((m) => (
                <div key={m.id} className="p-4 border border-gray-200 rounded-xl bg-emerald-50/20 relative">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-xs">{m.student_name}</h4>
                    <span className="font-bold text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      +{m.points} Points
                    </span>
                  </div>
                  <p className="text-[11px] text-[#146ef5] font-semibold mt-1">{m.award_name}</p>
                  <p className="text-[10px] text-gray-500">{m.category} · {m.class_name}</p>

                  <p className="mt-2 text-xs text-gray-600">{m.reason}</p>

                  <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
                    <span>Awarded by {m.awarded_by}</span>
                    <span>{m.award_date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Pastoral Counseling */}
      {subtab === 'counseling' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Confidential Pastoral Care & Counseling Dossiers</h3>
            <button
              onClick={() => setShowCounselingModal(true)}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700 transition cursor-pointer"
            >
              + Log Counseling Session
            </button>
          </div>

          {counseling.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No pastoral counseling sessions logged.
            </p>
          ) : (
            <div className="space-y-3">
              {counseling.map((c) => (
                <div key={c.id} className="p-4 border border-purple-100 rounded-xl bg-purple-50/20 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{c.student_name}</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">
                        {c.category}
                      </span>
                      {c.is_confidential && (
                        <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-bold">
                          Confidential
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 mt-1">{c.notes}</p>
                    <p className="text-[10px] text-gray-400">
                      Counselor: {c.counselor_name} · Session Date: {c.session_date} {c.follow_up_date ? `· Follow-up: ${c.follow_up_date}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRecord(c.id, 'counseling')}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Record Demerit */}
      {showDemeritModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Record Behavioral Infraction (Demerit)</h3>
              <button onClick={() => setShowDemeritModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordDemerit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newDemerit.student_name}
                  onChange={(e) => setNewDemerit({ ...newDemerit, student_name: e.target.value })}
                  placeholder="e.g. Tunde Balogun"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category</label>
                  <select
                    value={newDemerit.category}
                    onChange={(e) => setNewDemerit({ ...newDemerit, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="Lateness / Assembly Default">Lateness / Assembly Default</option>
                    <option value="Uniform / Grooming Violation">Uniform / Grooming Violation</option>
                    <option value="Disruptive Classroom Conduct">Disruptive Classroom Conduct</option>
                    <option value="Uncompleted Homework Default">Uncompleted Homework Default</option>
                    <option value="Bullying / Verbal Abuse">Bullying / Verbal Abuse</option>
                    <option value="Vandalism / Property Damage">Vandalism / Property Damage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Severity & Points</label>
                  <select
                    value={newDemerit.severity}
                    onChange={(e) => {
                      const sev = e.target.value;
                      const pts = sev === 'MINOR' ? -5 : sev === 'MODERATE' ? -10 : sev === 'MAJOR' ? -20 : -30;
                      setNewDemerit({ ...newDemerit, severity: sev, points_impact: pts });
                    }}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="MINOR">Minor (-5 pts)</option>
                    <option value="MODERATE">Moderate (-10 pts)</option>
                    <option value="MAJOR">Major (-20 pts)</option>
                    <option value="CRITICAL">Critical / Suspension (-30 pts)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Detailed Description of Incident *</label>
                <textarea
                  required
                  rows={2}
                  value={newDemerit.description}
                  onChange={(e) => setNewDemerit({ ...newDemerit, description: e.target.value })}
                  placeholder="e.g. Arrived 45 minutes late after the morning bell without an exeat or medical slip."
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Disciplinary Action Taken</label>
                <input
                  type="text"
                  value={newDemerit.action_taken}
                  onChange={(e) => setNewDemerit({ ...newDemerit, action_taken: e.target.value })}
                  placeholder="e.g. 1 hour library detention and litter pickup duty"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifyParentDiscipline"
                  checked={newDemerit.parent_notified}
                  onChange={(e) => setNewDemerit({ ...newDemerit, parent_notified: e.target.checked })}
                  className="rounded text-rose-600"
                />
                <label htmlFor="notifyParentDiscipline" className="text-gray-700">
                  Send parent warning notice via SMS/WhatsApp
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDemeritModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition cursor-pointer"
                >
                  {saving ? 'Recording...' : 'Record Demerit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Award Merit */}
      {showMeritModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Award Student Merit & House Points</h3>
              <button onClick={() => setShowMeritModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAwardMerit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMerit.student_name}
                  onChange={(e) => setNewMerit({ ...newMerit, student_name: e.target.value })}
                  placeholder="e.g. Stephanie Adebayo"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Commendation Title *</label>
                  <input
                    type="text"
                    required
                    value={newMerit.award_name}
                    onChange={(e) => setNewMerit({ ...newMerit, award_name: e.target.value })}
                    placeholder="e.g. Exemplary Integrity"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Merit Points (+)</label>
                  <input
                    type="number"
                    value={newMerit.points}
                    onChange={(e) => setNewMerit({ ...newMerit, points: parseInt(e.target.value) || 10 })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Citation / Reason *</label>
                <textarea
                  required
                  rows={2}
                  value={newMerit.reason}
                  onChange={(e) => setNewMerit({ ...newMerit, reason: e.target.value })}
                  placeholder="e.g. Assisted a fallen junior student and carried their books to the sick bay."
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMeritModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {saving ? 'Awarding...' : 'Award Merit Points'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Pastoral Counseling */}
      {showCounselingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Pastoral Counseling Session</h3>
              <button onClick={() => setShowCounselingModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCounseling} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCounseling.student_name}
                  onChange={(e) => setNewCounseling({ ...newCounseling, student_name: e.target.value })}
                  placeholder="e.g. David Okeke"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Counseling Category</label>
                  <select
                    value={newCounseling.category}
                    onChange={(e) => setNewCounseling({ ...newCounseling, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="Academic Anxiety / Test Stress">Academic Anxiety / Test Stress</option>
                    <option value="Peer Dynamics & Friendship">Peer Dynamics & Friendship</option>
                    <option value="Bereavement / Family Welfare">Bereavement / Family Welfare</option>
                    <option value="Career & Subject Selection">Career & Subject Selection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={newCounseling.follow_up_date}
                    onChange={(e) => setNewCounseling({ ...newCounseling, follow_up_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Counselor Confidential Observations & Action Plan *</label>
                <textarea
                  required
                  rows={3}
                  value={newCounseling.notes}
                  onChange={(e) => setNewCounseling({ ...newCounseling, notes: e.target.value })}
                  placeholder="Enter counseling observations..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCounselingModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition cursor-pointer"
                >
                  {saving ? 'Logging...' : 'Save Dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Print Disciplinary Summons */}
      {selectedIncidentForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Disciplinary Notice Voucher</h3>
              <button onClick={() => setSelectedIncidentForPrint(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border border-dashed border-rose-300 rounded-xl bg-rose-50/20 text-xs space-y-2">
              <div className="text-center pb-2 border-b border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 uppercase">Office of the Vice Principal · Disciplinary Committee</h4>
                <p className="text-[10px] text-gray-500">Official Notice of Behavioral Infraction & Sanction</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div><strong>Student:</strong> {selectedIncidentForPrint.student_name}</div>
                <div><strong>Class:</strong> {selectedIncidentForPrint.class_name}</div>
                <div><strong>Date:</strong> {selectedIncidentForPrint.incident_date}</div>
                <div><strong>Category:</strong> {selectedIncidentForPrint.category}</div>
              </div>
              <div className="pt-2">
                <div><strong>Infraction Detail:</strong> {selectedIncidentForPrint.description}</div>
                <div><strong>Assigned Sanction:</strong> {selectedIncidentForPrint.action_taken}</div>
                <div><strong>Points Deducted:</strong> {selectedIncidentForPrint.points_impact} Demerits</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setSelectedIncidentForPrint(null)}
                className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer text-xs"
              >
                <PrinterIcon className="w-4 h-4" /> Print Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

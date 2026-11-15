'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  HeartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  PrinterIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export interface ClinicVisit {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  visit_type: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  triage_priority: 'NORMAL' | 'URGENT' | 'EMERGENCY' | string;
  nurse_name: string;
  admitted_to_bed?: string;
  discharge_time?: string;
  parent_notified: boolean;
  notes?: string;
  created_at: string;
}

export interface HealthRecord {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  blood_group: string;
  genotype: string;
  allergies?: string;
  chronic_conditions?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  immunization_summary?: string;
  notes?: string;
  updated_at: string;
}

export interface ClinicMedication {
  id: string;
  tenant_id: string;
  visit_id?: string;
  student_id: string;
  student_name: string;
  medication_name: string;
  dosage: string;
  administered_by: string;
  administered_at: string;
  status: string;
  notes?: string;
  created_at: string;
}

export interface ClinicSummary {
  total_visits: number;
  admitted_to_bed: number;
  emergency_cases: number;
  parent_alerts_sent: number;
  active_health_records: number;
}

export type ClinicSubtab = 'overview' | 'visits' | 'passports' | 'medications';

export default function ClinicManager({
  initialSubtab = 'overview',
}: {
  initialSubtab?: ClinicSubtab;
}) {
  const [subtab, setSubtab] = useState<ClinicSubtab>(initialSubtab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [summary, setSummary] = useState<ClinicSummary>({
    total_visits: 0,
    admitted_to_bed: 0,
    emergency_cases: 0,
    parent_alerts_sent: 0,
    active_health_records: 0,
  });
  const [visits, setVisits] = useState<ClinicVisit[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [medications, setMedications] = useState<ClinicMedication[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [selectedVisitForPrint, setSelectedVisitForPrint] = useState<ClinicVisit | null>(null);

  // Form States
  const [newVisit, setNewVisit] = useState({
    student_name: '',
    class_name: 'JSS 1 Gold',
    visit_type: 'OUTPATIENT',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    triage_priority: 'NORMAL',
    nurse_name: 'Nurse Ngozi Okafor',
    admitted_to_bed: '',
    parent_notified: false,
    notes: '',
  });

  const [newHealthRecord, setNewHealthRecord] = useState({
    student_name: '',
    class_name: 'JSS 1 Gold',
    blood_group: 'O+',
    genotype: 'AA',
    allergies: 'None reported',
    chronic_conditions: 'None',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    immunization_summary: 'Fully Immunized (BCG, OPV, Pentavalent, Measles, Yellow Fever)',
    notes: '',
  });

  const [newMed, setNewMed] = useState({
    student_name: '',
    medication_name: 'Paracetamol 500mg',
    dosage: '1 tablet after food',
    administered_by: 'Nurse Ngozi Okafor',
    notes: '',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api
        .get('/v1/campus/clinic')
        .catch(async () => await api.get('/campus/clinic'));

      if (res.data) {
        if (res.data.summary) setSummary(res.data.summary);
        setVisits(res.data.visits || []);
        setHealthRecords(res.data.health_records || []);
        setMedications(res.data.medications || []);
      }
    } catch (err: any) {
      console.error('Failed to load clinic data:', err);
      setErrorMsg(err?.response?.data?.error || 'Failed to load clinic data. Check connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisit.student_name.trim() || !newVisit.symptoms.trim()) {
      alert('Student name and symptoms are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/clinic', {
        action: 'record_visit',
        ...newVisit,
      });
      setShowVisitModal(false);
      setSuccessMsg('Clinic consultation logged successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewVisit({
        student_name: '',
        class_name: 'JSS 1 Gold',
        visit_type: 'OUTPATIENT',
        symptoms: '',
        diagnosis: '',
        treatment: '',
        triage_priority: 'NORMAL',
        nurse_name: 'Nurse Ngozi Okafor',
        admitted_to_bed: '',
        parent_notified: false,
        notes: '',
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to record clinic visit');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateHealthRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHealthRecord.student_name.trim()) {
      alert('Student name is required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/clinic', {
        action: 'save_health_record',
        ...newHealthRecord,
      });
      setShowHealthModal(false);
      setSuccessMsg('Student Health Passport saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewHealthRecord({
        student_name: '',
        class_name: 'JSS 1 Gold',
        blood_group: 'O+',
        genotype: 'AA',
        allergies: 'None reported',
        chronic_conditions: 'None',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        immunization_summary: 'Fully Immunized (BCG, OPV, Pentavalent, Measles, Yellow Fever)',
        notes: '',
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to save health record');
    } finally {
      setSaving(false);
    }
  };

  const handleAdministerMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.student_name.trim() || !newMed.medication_name.trim()) {
      alert('Student name and medication name required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/clinic', {
        action: 'administer_medication',
        ...newMed,
      });
      setShowMedModal(false);
      setSuccessMsg('Medication recorded & administered!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to administer medication');
    } finally {
      setSaving(false);
    }
  };

  const handleDischarge = async (id: string) => {
    if (!confirm('Discharge this student from the infirmary bed?')) return;
    try {
      await api.put('/v1/campus/clinic', { id });
      setSuccessMsg('Student discharged successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to discharge student');
    }
  };

  const handleDeleteRecord = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to permanently delete this record?')) return;
    try {
      await api.delete(`/v1/campus/clinic?id=${id}&type=${type}`);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete record');
    }
  };

  const filteredVisits = visits.filter((v) => {
    const matchesSearch =
      v.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || v.triage_priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Notifications */}
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

      {/* Header & Subtab Bar */}
      <MotionRise className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <HeartIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Campus Clinic & Infirmary (Sick Bay)</h2>
              <p className="text-xs text-gray-500">
                Outpatient consultations, student health passports, medication administration, and bed admissions.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVisitModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition shadow-sm cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Log Consultation
          </button>
          <button
            onClick={() => setShowHealthModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <DocumentCheckIcon className="w-4 h-4" /> Health Passport
          </button>
          <button
            onClick={() => setShowMedModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700 transition shadow-sm cursor-pointer"
          >
            <ClockIcon className="w-4 h-4" /> Dispense Med
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
          Clinical Overview
        </button>
        <button
          onClick={() => setSubtab('visits')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'visits'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Visits & Triage ({visits.length})
        </button>
        <button
          onClick={() => setSubtab('passports')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'passports'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Health Passports ({healthRecords.length})
        </button>
        <button
          onClick={() => setSubtab('medications')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'medications'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Medications Log ({medications.length})
        </button>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Clinic Visits</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total_visits}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Infirmary Bed Patients</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{summary.admitted_to_bed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Emergency Triage</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{summary.emergency_cases}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Parent Alerts Sent</p>
          <p className="text-2xl font-bold text-[#146ef5] mt-1">{summary.parent_alerts_sent}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Health Passports</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.active_health_records}</p>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {subtab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Bed Admissions */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-amber-500" /> Active Infirmary Bed Admissions
              </h3>
              <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full font-bold">
                {visits.filter((v) => v.admitted_to_bed && !v.discharge_time).length} Occupied
              </span>
            </div>

            {visits.filter((v) => v.admitted_to_bed && !v.discharge_time).length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                All infirmary beds are currently vacant. No admitted patients.
              </p>
            ) : (
              <div className="space-y-3">
                {visits
                  .filter((v) => v.admitted_to_bed && !v.discharge_time)
                  .map((v) => (
                    <div key={v.id} className="p-3 bg-amber-50/40 border border-amber-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{v.student_name}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                            {v.admitted_to_bed}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Symptoms: {v.symptoms}</p>
                        <p className="text-[10px] text-gray-400">Attending: {v.nurse_name} · Admitted {v.created_at}</p>
                      </div>
                      <button
                        onClick={() => handleDischarge(v.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
                      >
                        Discharge
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Critical Allergies & Conditions Radar */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 text-rose-500" /> Chronic Conditions & Allergy Watchlist
              </h3>
              <span className="text-xs text-gray-400">{healthRecords.length} Passports</span>
            </div>

            {healthRecords.filter((h) => (h.allergies && h.allergies !== 'None reported') || (h.chronic_conditions && h.chronic_conditions !== 'None')).length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                No high-risk allergies or chronic conditions registered.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {healthRecords
                  .filter((h) => (h.allergies && h.allergies !== 'None reported') || (h.chronic_conditions && h.chronic_conditions !== 'None'))
                  .map((h) => (
                    <div key={h.id} className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{h.student_name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                            {h.blood_group} · {h.genotype}
                          </span>
                        </div>
                        <p className="text-xs text-rose-700 font-medium mt-0.5">
                          {h.allergies && h.allergies !== 'None reported' ? `Allergy: ${h.allergies}` : ''}
                          {h.chronic_conditions && h.chronic_conditions !== 'None' ? ` · Condition: ${h.chronic_conditions}` : ''}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-500">{h.emergency_contact_phone}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Visits & Triage */}
      {subtab === 'visits' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or symptoms..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#146ef5]"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-500">Triage:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white font-medium cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>

          {filteredVisits.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No clinic visits found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Student & Class</th>
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4">Symptoms & Diagnosis</th>
                    <th className="py-3 px-4">Triage Priority</th>
                    <th className="py-3 px-4">Treatment</th>
                    <th className="py-3 px-4">Bed Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVisits.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <div>{v.student_name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{v.class_name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{v.created_at}</td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-gray-800">{v.symptoms}</div>
                        <div className="text-gray-500 text-[11px]">{v.diagnosis || 'Under evaluation'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.triage_priority === 'EMERGENCY'
                              ? 'bg-rose-100 text-rose-700'
                              : v.triage_priority === 'URGENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-[#146ef5]'
                          }`}
                        >
                          {v.triage_priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs">{v.treatment || 'Observation'}</td>
                      <td className="py-3 px-4">
                        {v.admitted_to_bed ? (
                          v.discharge_time ? (
                            <span className="text-[10px] text-emerald-600 font-semibold">Discharged ({v.discharge_time})</span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                              {v.admitted_to_bed}
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400">Outpatient</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedVisitForPrint(v)}
                          title="Print Consultation Slip"
                          className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          <PrinterIcon className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(v.id, 'visit')}
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

      {/* Tab 3: Health Passports */}
      {subtab === 'passports' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Student Medical Passports & Emergency Registry</h3>
            <button
              onClick={() => setShowHealthModal(true)}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
            >
              + Add Passport
            </button>
          </div>

          {healthRecords.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No student health passports on file. Click &quot;Add Passport&quot; to register medical details.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthRecords.map((h) => (
                <div key={h.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/40 relative">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-xs">{h.student_name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#146ef5]">
                      {h.blood_group} · {h.genotype}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">{h.class_name}</p>

                  <div className="mt-3 text-[11px] space-y-1">
                    <p><strong className="text-gray-700">Allergies:</strong> <span className="text-rose-600">{h.allergies || 'None'}</span></p>
                    <p><strong className="text-gray-700">Chronic:</strong> {h.chronic_conditions || 'None'}</p>
                    <p><strong className="text-gray-700">Emergency:</strong> {h.emergency_contact_name} ({h.emergency_contact_phone})</p>
                    <p><strong className="text-gray-700">Immunization:</strong> {h.immunization_summary}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
                    <span>Updated {h.updated_at}</span>
                    <button
                      onClick={() => handleDeleteRecord(h.id, 'health')}
                      className="text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Medications */}
      {subtab === 'medications' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Medication Administration Records (MAR)</h3>
            <button
              onClick={() => setShowMedModal(true)}
              className="px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700 transition cursor-pointer"
            >
              + Dispense Medication
            </button>
          </div>

          {medications.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No medication administrations logged.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Medication & Dosage</th>
                    <th className="py-3 px-4">Administered By</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {medications.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">{m.student_name}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-purple-700">{m.medication_name}</span>
                        <div className="text-[10px] text-gray-400">{m.dosage}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{m.administered_by}</td>
                      <td className="py-3 px-4 text-gray-500">{m.administered_at || m.created_at}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{m.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Log Consultation */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Record Clinic Consultation</h3>
              <button onClick={() => setShowVisitModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateVisit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newVisit.student_name}
                  onChange={(e) => setNewVisit({ ...newVisit, student_name: e.target.value })}
                  placeholder="e.g. Ebuka Adeleke"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Class</label>
                  <input
                    type="text"
                    value={newVisit.class_name}
                    onChange={(e) => setNewVisit({ ...newVisit, class_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Triage Priority</label>
                  <select
                    value={newVisit.triage_priority}
                    onChange={(e) => setNewVisit({ ...newVisit, triage_priority: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="NORMAL">Normal (Mild)</option>
                    <option value="URGENT">Urgent (Fever / Sprain)</option>
                    <option value="EMERGENCY">Emergency (Severe / Referral)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Symptoms / Chief Complaints *</label>
                <textarea
                  required
                  rows={2}
                  value={newVisit.symptoms}
                  onChange={(e) => setNewVisit({ ...newVisit, symptoms: e.target.value })}
                  placeholder="e.g. High fever, headache, body chills since morning assembly"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Clinical Diagnosis</label>
                  <input
                    type="text"
                    value={newVisit.diagnosis}
                    onChange={(e) => setNewVisit({ ...newVisit, diagnosis: e.target.value })}
                    placeholder="e.g. Suspected Malaria"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Admit to Bed (Optional)</label>
                  <input
                    type="text"
                    value={newVisit.admitted_to_bed}
                    onChange={(e) => setNewVisit({ ...newVisit, admitted_to_bed: e.target.value })}
                    placeholder="e.g. Bed 02 (Ward A)"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Treatment / Prescription Given</label>
                <input
                  type="text"
                  value={newVisit.treatment}
                  onChange={(e) => setNewVisit({ ...newVisit, treatment: e.target.value })}
                  placeholder="e.g. Artemether tab, cold sponge, rest"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifyParent"
                  checked={newVisit.parent_notified}
                  onChange={(e) => setNewVisit({ ...newVisit, parent_notified: e.target.checked })}
                  className="rounded text-[#146ef5]"
                />
                <label htmlFor="notifyParent" className="text-gray-700">
                  Send instant notification to Parent / Guardian
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVisitModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer"
                >
                  {saving ? 'Logging...' : 'Save Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Health Passport */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Student Medical Passport</h3>
              <button onClick={() => setShowHealthModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateHealthRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newHealthRecord.student_name}
                  onChange={(e) => setNewHealthRecord({ ...newHealthRecord, student_name: e.target.value })}
                  placeholder="e.g. Chioma Nwosu"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Blood Group</label>
                  <select
                    value={newHealthRecord.blood_group}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, blood_group: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="O+">O+ (Positive)</option>
                    <option value="O-">O- (Negative)</option>
                    <option value="A+">A+ (Positive)</option>
                    <option value="A-">A- (Negative)</option>
                    <option value="B+">B+ (Positive)</option>
                    <option value="B-">B- (Negative)</option>
                    <option value="AB+">AB+ (Positive)</option>
                    <option value="AB-">AB- (Negative)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Genotype</label>
                  <select
                    value={newHealthRecord.genotype}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, genotype: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="AA">AA (Normal)</option>
                    <option value="AS">AS (Carrier)</option>
                    <option value="SS">SS (Sickle Cell)</option>
                    <option value="AC">AC</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Known Allergies (Drugs / Food / Nuts)</label>
                <input
                  type="text"
                  value={newHealthRecord.allergies}
                  onChange={(e) => setNewHealthRecord({ ...newHealthRecord, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Peanuts"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Chronic Conditions</label>
                <input
                  type="text"
                  value={newHealthRecord.chronic_conditions}
                  onChange={(e) => setNewHealthRecord({ ...newHealthRecord, chronic_conditions: e.target.value })}
                  placeholder="e.g. Asthma (Uses Salbutamol Inhaler)"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Emergency Contact Person</label>
                  <input
                    type="text"
                    value={newHealthRecord.emergency_contact_name}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, emergency_contact_name: e.target.value })}
                    placeholder="e.g. Dr. O. Nwosu (Father)"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={newHealthRecord.emergency_contact_phone}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, emergency_contact_phone: e.target.value })}
                    placeholder="+234 803 123 4567"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Immunization Summary</label>
                <input
                  type="text"
                  value={newHealthRecord.immunization_summary}
                  onChange={(e) => setNewHealthRecord({ ...newHealthRecord, immunization_summary: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHealthModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Health Passport'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Dispense Medication */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Dispense Medication (MAR)</h3>
              <button onClick={() => setShowMedModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdministerMedication} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={newMed.student_name}
                  onChange={(e) => setNewMed({ ...newMed, student_name: e.target.value })}
                  placeholder="e.g. Femi Alabi"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Medication Name *</label>
                <input
                  type="text"
                  required
                  value={newMed.medication_name}
                  onChange={(e) => setNewMed({ ...newMed, medication_name: e.target.value })}
                  placeholder="e.g. Paracetamol / Coartem"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Dosage & Instructions *</label>
                <input
                  type="text"
                  required
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  placeholder="e.g. 1 Tablet (500mg) stat with water"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMedModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition cursor-pointer"
                >
                  {saving ? 'Recording...' : 'Dispense & Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Print Medical Consultation Slip */}
      {selectedVisitForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Clinical Consultation Slip</h3>
              <button onClick={() => setSelectedVisitForPrint(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 space-y-2 text-xs">
              <div className="text-center pb-2 border-b border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 uppercase">Campus Health Service · Sick Bay</h4>
                <p className="text-[10px] text-gray-500">Official Clinical Outpatient & Treatment Voucher</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div><strong>Patient:</strong> {selectedVisitForPrint.student_name}</div>
                <div><strong>Class:</strong> {selectedVisitForPrint.class_name}</div>
                <div><strong>Date:</strong> {selectedVisitForPrint.created_at}</div>
                <div><strong>Triage:</strong> {selectedVisitForPrint.triage_priority}</div>
              </div>
              <div className="pt-2">
                <div><strong>Reported Symptoms:</strong> {selectedVisitForPrint.symptoms}</div>
                <div><strong>Diagnosis:</strong> {selectedVisitForPrint.diagnosis || 'None'}</div>
                <div><strong>Prescription/Treatment:</strong> {selectedVisitForPrint.treatment || 'Observation'}</div>
                <div><strong>Attending Nurse:</strong> {selectedVisitForPrint.nurse_name}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setSelectedVisitForPrint(null)}
                className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer text-xs"
              >
                <PrinterIcon className="w-4 h-4" /> Print Medical Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  HomeModernIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  PrinterIcon,
  XMarkIcon,
  TrashIcon,
  QrCodeIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export interface HostelAllocation {
  id: string;
  tenant_id: string;
  hostel_name: string;
  wing_or_floor: string;
  room_number: string;
  bed_label: string;
  capacity: number;
  occupants_count: number;
  student_name: string;
  class_name: string;
  matron_name: string;
  exeat_status: 'ON_CAMPUS' | 'WEEKEND_EXEAT' | 'MEDICAL_EXEAT' | string;
  status: 'OCCUPIED' | 'VACANT' | string;
  created_at: string;
}

export interface HostelExeat {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  hostel_name: string;
  room_number: string;
  exeat_type: 'WEEKEND' | 'MEDICAL' | 'FAMILY_EVENT' | 'EMERGENCY' | string;
  reason: string;
  departure_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  parent_name: string;
  parent_phone: string;
  parent_approval: string;
  matron_approval: string;
  principal_approval: string;
  status: 'PENDING' | 'APPROVED' | 'CHECKED_OUT' | 'CHECKED_IN' | string;
  security_checkout_at?: string;
  security_checkin_at?: string;
  pass_code: string;
  created_at: string;
}

export interface HostelRollcall {
  id: string;
  tenant_id: string;
  hostel_name: string;
  rollcall_date: string;
  total_students: number;
  present_count: number;
  absent_count: number;
  on_exeat_count: number;
  taken_by: string;
  notes?: string;
  created_at: string;
}

export interface HostelSummary {
  total_allocations: number;
  total_occupants: number;
  active_exeats: number;
  completed_rollcalls: number;
}

export type HostelSubtab = 'overview' | 'allocations' | 'exeats' | 'rollcalls';

export default function HostelManager({
  initialSubtab = 'overview',
}: {
  initialSubtab?: HostelSubtab;
}) {
  const [subtab, setSubtab] = useState<HostelSubtab>(initialSubtab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [summary, setSummary] = useState<HostelSummary>({
    total_allocations: 0,
    total_occupants: 0,
    active_exeats: 0,
    completed_rollcalls: 0,
  });
  const [allocations, setAllocations] = useState<HostelAllocation[]>([]);
  const [exeats, setExeats] = useState<HostelExeat[]>([]);
  const [rollcalls, setRollcalls] = useState<HostelRollcall[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [hostelFilter, setHostelFilter] = useState('ALL');

  // Modals
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [showExeatModal, setShowExeatModal] = useState(false);
  const [showRollcallModal, setShowRollcallModal] = useState(false);
  const [selectedExeatForPrint, setSelectedExeatForPrint] = useState<HostelExeat | null>(null);

  // Form states
  const [newAlloc, setNewAlloc] = useState({
    hostel_name: 'Queen Amina Hall (Girls)',
    wing_or_floor: 'First Floor · Wing A',
    room_number: 'Room 101',
    bed_label: 'Bed A',
    capacity: 4,
    occupants_count: 1,
    student_name: '',
    class_name: 'SS 1 Science',
    matron_name: 'Matron Comfort Eze',
    exeat_status: 'ON_CAMPUS',
  });

  const [newExeat, setNewExeat] = useState({
    student_name: '',
    class_name: 'SS 2 Science',
    hostel_name: 'Queen Amina Hall (Girls)',
    room_number: 'Room 104',
    exeat_type: 'WEEKEND',
    reason: '',
    departure_date: new Date().toISOString().split('T')[0],
    expected_return_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    parent_name: '',
    parent_phone: '',
  });

  const [newRollcall, setNewRollcall] = useState({
    hostel_name: 'Queen Amina Hall (Girls)',
    rollcall_date: new Date().toISOString().split('T')[0],
    total_students: 45,
    present_count: 42,
    absent_count: 0,
    on_exeat_count: 3,
    taken_by: 'Matron Comfort Eze',
    notes: 'All occupants accounted for. Exeat students confirmed departed.',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api
        .get('/v1/campus/hostel')
        .catch(async () => await api.get('/campus/hostel'));

      if (res.data) {
        if (res.data.summary) setSummary(res.data.summary);
        setAllocations(res.data.allocations || []);
        setExeats(res.data.exeats || []);
        setRollcalls(res.data.rollcalls || []);
      }
    } catch (err: any) {
      console.error('Failed to load hostel data:', err);
      setErrorMsg(err?.response?.data?.error || 'Failed to load boarding data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlloc.student_name.trim() || !newAlloc.room_number.trim()) {
      alert('Student name and room number are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/hostel', {
        action: 'allocate_bed',
        ...newAlloc,
      });
      setShowAllocModal(false);
      setSuccessMsg('Hostel bed space allocated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewAlloc({
        hostel_name: 'Queen Amina Hall (Girls)',
        wing_or_floor: 'First Floor · Wing A',
        room_number: 'Room 101',
        bed_label: 'Bed A',
        capacity: 4,
        occupants_count: 1,
        student_name: '',
        class_name: 'SS 1 Science',
        matron_name: 'Matron Comfort Eze',
        exeat_status: 'ON_CAMPUS',
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to allocate room');
    } finally {
      setSaving(false);
    }
  };

  const handleRequestExeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExeat.student_name.trim() || !newExeat.reason.trim()) {
      alert('Student name and reason are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/hostel', {
        action: 'request_exeat',
        ...newExeat,
      });
      setShowExeatModal(false);
      setSuccessMsg('Digital Exeat requested successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to submit exeat');
    } finally {
      setSaving(false);
    }
  };

  const handleApproveExeat = async (id: string, role: string) => {
    try {
      await api.post('/v1/campus/hostel', {
        action: 'approve_exeat',
        id,
        role,
      });
      setSuccessMsg(`Exeat approved by ${role}!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to approve exeat');
    }
  };

  const handleGateCheckout = async (id: string) => {
    try {
      await api.post('/v1/campus/hostel', { action: 'gate_checkout', id });
      setSuccessMsg('Student gate departure recorded!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed gate checkout');
    }
  };

  const handleGateCheckin = async (id: string) => {
    try {
      await api.post('/v1/campus/hostel', { action: 'gate_checkin', id });
      setSuccessMsg('Student hostel return checked in!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed gate checkin');
    }
  };

  const handleSaveRollcall = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/v1/campus/hostel', {
        action: 'record_rollcall',
        ...newRollcall,
      });
      setShowRollcallModal(false);
      setSuccessMsg('Nightly dormitory roll-call saved!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to save rollcall');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string, type: string) => {
    if (!confirm('Permanently remove this record?')) return;
    try {
      await api.delete(`/v1/campus/hostel?id=${id}&type=${type}`);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete record');
    }
  };

  const filteredAllocations = allocations.filter((a) => {
    const matchesSearch =
      a.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.hostel_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHostel = hostelFilter === 'ALL' || a.hostel_name === hostelFilter;
    return matchesSearch && matchesHostel;
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

      {/* Header */}
      <MotionRise className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#146ef5] flex items-center justify-center font-bold">
              <HomeModernIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hostel & Boarding House ERP</h2>
              <p className="text-xs text-gray-500">
                Dormitory room/bed allocation, digital exeat pass approvals, gate scans, and nightly roll-calls.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllocModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition shadow-sm cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Allocate Bed
          </button>
          <button
            onClick={() => setShowExeatModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-full hover:bg-amber-700 transition shadow-sm cursor-pointer"
          >
            <QrCodeIcon className="w-4 h-4" /> Issue Exeat Pass
          </button>
          <button
            onClick={() => setShowRollcallModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <DocumentCheckIcon className="w-4 h-4" /> Nightly Roll-Call
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
          Boarding Overview
        </button>
        <button
          onClick={() => setSubtab('allocations')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'allocations'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Room & Bed Allocations ({allocations.length})
        </button>
        <button
          onClick={() => setSubtab('exeats')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'exeats'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Digital Exeat Passes ({exeats.length})
        </button>
        <button
          onClick={() => setSubtab('rollcalls')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'rollcalls'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Dormitory Roll-Calls ({rollcalls.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Allocated Beds</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total_allocations}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Boarding Occupants</p>
          <p className="text-2xl font-bold text-[#146ef5] mt-1">{summary.total_occupants}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Active Exeat Passes</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{summary.active_exeats}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Roll-Calls Completed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.completed_rollcalls}</p>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {subtab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Exeats Pending Gate Departure / Return */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-amber-500" /> Students Currently on Exeat or Pending Departure
              </h3>
              <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full font-bold">
                {exeats.filter((e) => e.status === 'APPROVED' || e.status === 'CHECKED_OUT').length} Students
              </span>
            </div>

            {exeats.filter((e) => e.status === 'APPROVED' || e.status === 'CHECKED_OUT').length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                All boarding students are currently on campus. No active approved exeats.
              </p>
            ) : (
              <div className="space-y-3">
                {exeats
                  .filter((e) => e.status === 'APPROVED' || e.status === 'CHECKED_OUT')
                  .map((e) => (
                    <div key={e.id} className="p-3 bg-gray-50/60 border border-gray-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{e.student_name}</span>
                          <span className="text-[10px] bg-blue-100 text-[#146ef5] font-semibold px-2 py-0.5 rounded">
                            {e.pass_code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {e.exeat_type} Exeat · {e.reason}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Expected Return: {e.expected_return_date} · Guardian: {e.parent_phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {e.status === 'APPROVED' ? (
                          <button
                            onClick={() => handleGateCheckout(e.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-full hover:bg-amber-700 transition cursor-pointer"
                          >
                            <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" /> Gate Exit
                          </button>
                        ) : (
                          <button
                            onClick={() => handleGateCheckin(e.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
                          >
                            <ArrowLeftOnRectangleIcon className="w-3.5 h-3.5" /> Return In
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Hall Capacity Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Boarding Houses Capacity Status</h3>
            <div className="space-y-4">
              {['Queen Amina Hall (Girls)', 'Nelson Mandela Hall (Boys)', 'Mary Slessor Hall (Junior Girls)', 'Nnamdi Azikiwe Hall (Junior Boys)'].map((hall) => {
                const count = allocations.filter((a) => a.hostel_name === hall).length;
                const capacity = 60;
                const pct = Math.min(100, Math.round((count / capacity) * 100));
                return (
                  <div key={hall} className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-gray-800">{hall}</span>
                      <span className="text-gray-500 font-semibold">{count} / {capacity} Beds</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#146ef5] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Allocations */}
      {subtab === 'allocations' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, room or hall..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#146ef5]"
              />
            </div>
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white font-medium cursor-pointer"
            >
              <option value="ALL">All Boarding Halls</option>
              <option value="Queen Amina Hall (Girls)">Queen Amina Hall (Girls)</option>
              <option value="Nelson Mandela Hall (Boys)">Nelson Mandela Hall (Boys)</option>
              <option value="Mary Slessor Hall (Junior Girls)">Mary Slessor Hall (Junior Girls)</option>
              <option value="Nnamdi Azikiwe Hall (Junior Boys)">Nnamdi Azikiwe Hall (Junior Boys)</option>
            </select>
          </div>

          {filteredAllocations.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No hostel allocations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Student & Class</th>
                    <th className="py-3 px-4">Hall / House</th>
                    <th className="py-3 px-4">Wing / Room</th>
                    <th className="py-3 px-4">Bed Space</th>
                    <th className="py-3 px-4">Housemaster/Matron</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAllocations.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <div>{a.student_name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{a.class_name}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{a.hostel_name}</td>
                      <td className="py-3 px-4 text-gray-600">{a.room_number} ({a.wing_or_floor})</td>
                      <td className="py-3 px-4 font-bold text-[#146ef5]">{a.bed_label}</td>
                      <td className="py-3 px-4 text-gray-600">{a.matron_name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            a.exeat_status === 'ON_CAMPUS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {a.exeat_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteRecord(a.id, 'allocation')}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
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

      {/* Tab 3: Digital Exeat Passes */}
      {subtab === 'exeats' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Digital Exeat Passes & Departure Authorization</h3>
            <button
              onClick={() => setShowExeatModal(true)}
              className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-full hover:bg-amber-700 transition cursor-pointer"
            >
              + Issue New Exeat
            </button>
          </div>

          {exeats.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No exeat passes requested or issued.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Pass Code</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Type & Reason</th>
                    <th className="py-3 px-4">Departure & Return</th>
                    <th className="py-3 px-4">Approvals</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {exeats.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{e.pass_code}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <div>{e.student_name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{e.class_name} · {e.hostel_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">{e.exeat_type}</span>
                        <div className="text-[10px] text-gray-500">{e.reason}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div>Dep: {e.departure_date}</div>
                        <div className="text-[10px] text-gray-400">Exp Return: {e.expected_return_date}</div>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <div className="text-[10px]">
                          Matron: <span className={e.matron_approval === 'APPROVED' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{e.matron_approval}</span>
                        </div>
                        <div className="text-[10px]">
                          Principal: <span className={e.principal_approval === 'APPROVED' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{e.principal_approval}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            e.status === 'APPROVED'
                              ? 'bg-blue-100 text-[#146ef5]'
                              : e.status === 'CHECKED_OUT'
                              ? 'bg-amber-100 text-amber-800'
                              : e.status === 'CHECKED_IN'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {e.matron_approval !== 'APPROVED' && (
                          <button
                            onClick={() => handleApproveExeat(e.id, 'matron')}
                            className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
                          >
                            Matron Sign
                          </button>
                        )}
                        {e.principal_approval !== 'APPROVED' && (
                          <button
                            onClick={() => handleApproveExeat(e.id, 'principal')}
                            className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold hover:bg-blue-100 cursor-pointer"
                          >
                            Principal Sign
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedExeatForPrint(e)}
                          className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                          title="Print Digital Exeat Voucher"
                        >
                          <PrinterIcon className="w-4 h-4 inline" />
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

      {/* Tab 4: Rollcalls */}
      {subtab === 'rollcalls' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Nightly Dormitory Roll-Call Audit Logs</h3>
            <button
              onClick={() => setShowRollcallModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
            >
              + Record Roll-Call
            </button>
          </div>

          {rollcalls.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No dormitory roll-calls recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Hostel / House</th>
                    <th className="py-3 px-4">Total Capacity</th>
                    <th className="py-3 px-4">Present</th>
                    <th className="py-3 px-4">On Exeat</th>
                    <th className="py-3 px-4">Absent / Unaccounted</th>
                    <th className="py-3 px-4">Officer in Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rollcalls.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">{r.rollcall_date}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{r.hostel_name}</td>
                      <td className="py-3 px-4 text-gray-600">{r.total_students}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{r.present_count}</td>
                      <td className="py-3 px-4 text-amber-600 font-semibold">{r.on_exeat_count}</td>
                      <td className="py-3 px-4">
                        {r.absent_count > 0 ? (
                          <span className="font-bold text-rose-600">{r.absent_count} Missing</span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{r.taken_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Allocate Bed */}
      {showAllocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Allocate Hostel Room & Bed</h3>
              <button onClick={() => setShowAllocModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAllocate} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAlloc.student_name}
                  onChange={(e) => setNewAlloc({ ...newAlloc, student_name: e.target.value })}
                  placeholder="e.g. Somtochukwu Obi"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Hostel Hall</label>
                  <select
                    value={newAlloc.hostel_name}
                    onChange={(e) => setNewAlloc({ ...newAlloc, hostel_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="Queen Amina Hall (Girls)">Queen Amina Hall (Girls)</option>
                    <option value="Nelson Mandela Hall (Boys)">Nelson Mandela Hall (Boys)</option>
                    <option value="Mary Slessor Hall (Junior Girls)">Mary Slessor Hall (Junior Girls)</option>
                    <option value="Nnamdi Azikiwe Hall (Junior Boys)">Nnamdi Azikiwe Hall (Junior Boys)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Wing / Floor</label>
                  <input
                    type="text"
                    value={newAlloc.wing_or_floor}
                    onChange={(e) => setNewAlloc({ ...newAlloc, wing_or_floor: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={newAlloc.room_number}
                    onChange={(e) => setNewAlloc({ ...newAlloc, room_number: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Bed Label (Space) *</label>
                  <input
                    type="text"
                    required
                    value={newAlloc.bed_label}
                    onChange={(e) => setNewAlloc({ ...newAlloc, bed_label: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Assigned Housemaster / Matron</label>
                <input
                  type="text"
                  value={newAlloc.matron_name}
                  onChange={(e) => setNewAlloc({ ...newAlloc, matron_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllocModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer"
                >
                  {saving ? 'Allocating...' : 'Allocate Bed Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Issue Exeat */}
      {showExeatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Issue Digital Boarding Exeat Pass</h3>
              <button onClick={() => setShowExeatModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRequestExeat} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={newExeat.student_name}
                  onChange={(e) => setNewExeat({ ...newExeat, student_name: e.target.value })}
                  placeholder="e.g. Kemi Adeleke"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Exeat Category</label>
                  <select
                    value={newExeat.exeat_type}
                    onChange={(e) => setNewExeat({ ...newExeat, exeat_type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="WEEKEND">Weekend Exeat</option>
                    <option value="MEDICAL">Medical Exeat / Hospital</option>
                    <option value="FAMILY_EVENT">Family Function / Wedding</option>
                    <option value="EMERGENCY">Emergency Exeat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Hostel Hall</label>
                  <input
                    type="text"
                    value={newExeat.hostel_name}
                    onChange={(e) => setNewExeat({ ...newExeat, hostel_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Reason for Exeat *</label>
                <textarea
                  required
                  rows={2}
                  value={newExeat.reason}
                  onChange={(e) => setNewExeat({ ...newExeat, reason: e.target.value })}
                  placeholder="e.g. Sister's wedding in Abuja. Approved by parents via portal."
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={newExeat.departure_date}
                    onChange={(e) => setNewExeat({ ...newExeat, departure_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Expected Return Date *</label>
                  <input
                    type="date"
                    required
                    value={newExeat.expected_return_date}
                    onChange={(e) => setNewExeat({ ...newExeat, expected_return_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Parent/Guardian Name</label>
                  <input
                    type="text"
                    value={newExeat.parent_name}
                    onChange={(e) => setNewExeat({ ...newExeat, parent_name: e.target.value })}
                    placeholder="e.g. Chief Adeleke"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Parent Phone Number</label>
                  <input
                    type="text"
                    value={newExeat.parent_phone}
                    onChange={(e) => setNewExeat({ ...newExeat, parent_phone: e.target.value })}
                    placeholder="+234 802 331 4450"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExeatModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition cursor-pointer"
                >
                  {saving ? 'Generating...' : 'Issue Exeat Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Roll-Call Record */}
      {showRollcallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Record Nightly Dormitory Roll-Call</h3>
              <button onClick={() => setShowRollcallModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveRollcall} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Hostel Hall</label>
                <select
                  value={newRollcall.hostel_name}
                  onChange={(e) => setNewRollcall({ ...newRollcall, hostel_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                >
                  <option value="Queen Amina Hall (Girls)">Queen Amina Hall (Girls)</option>
                  <option value="Nelson Mandela Hall (Boys)">Nelson Mandela Hall (Boys)</option>
                  <option value="Mary Slessor Hall (Junior Girls)">Mary Slessor Hall (Junior Girls)</option>
                  <option value="Nnamdi Azikiwe Hall (Junior Boys)">Nnamdi Azikiwe Hall (Junior Boys)</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Present</label>
                  <input
                    type="number"
                    value={newRollcall.present_count}
                    onChange={(e) => setNewRollcall({ ...newRollcall, present_count: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">On Exeat</label>
                  <input
                    type="number"
                    value={newRollcall.on_exeat_count}
                    onChange={(e) => setNewRollcall({ ...newRollcall, on_exeat_count: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Absent</label>
                  <input
                    type="number"
                    value={newRollcall.absent_count}
                    onChange={(e) => setNewRollcall({ ...newRollcall, absent_count: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Officer in Charge</label>
                <input
                  type="text"
                  value={newRollcall.taken_by}
                  onChange={(e) => setNewRollcall({ ...newRollcall, taken_by: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Roll-Call Observations / Notes</label>
                <textarea
                  rows={2}
                  value={newRollcall.notes}
                  onChange={(e) => setNewRollcall({ ...newRollcall, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRollcallModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Submit Roll-Call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Print Exeat Slip with QR Code */}
      {selectedExeatForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Official Digital Exeat Gate Pass</h3>
              <button onClick={() => setSelectedExeatForPrint(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-amber-50/30 text-xs space-y-3">
              <div className="text-center border-b border-gray-200 pb-3">
                <h4 className="font-bold text-base text-gray-900 uppercase">Boarding House Digital Exeat Voucher</h4>
                <p className="text-[11px] text-gray-500 font-mono">CODE: {selectedExeatForPrint.pass_code}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div><strong>Student:</strong> {selectedExeatForPrint.student_name}</div>
                <div><strong>Class:</strong> {selectedExeatForPrint.class_name}</div>
                <div><strong>Hostel:</strong> {selectedExeatForPrint.hostel_name}</div>
                <div><strong>Exeat Type:</strong> {selectedExeatForPrint.exeat_type}</div>
                <div><strong>Departure:</strong> {selectedExeatForPrint.departure_date}</div>
                <div><strong>Expected Return:</strong> {selectedExeatForPrint.expected_return_date}</div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p><strong>Reason:</strong> {selectedExeatForPrint.reason}</p>
                <p className="mt-1"><strong>Parent Contact:</strong> {selectedExeatForPrint.parent_name} ({selectedExeatForPrint.parent_phone})</p>
              </div>
              <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-200">
                <span>Matron: {selectedExeatForPrint.matron_approval}</span>
                <span>Principal: {selectedExeatForPrint.principal_approval}</span>
                <span>Security Stamp: Verified</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setSelectedExeatForPrint(null)}
                className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer text-xs"
              >
                <PrinterIcon className="w-4 h-4" /> Print Exeat Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

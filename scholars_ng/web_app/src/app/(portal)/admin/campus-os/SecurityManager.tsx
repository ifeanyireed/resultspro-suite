'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  PrinterIcon,
  XMarkIcon,
  TrashIcon,
  UserPlusIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export interface SecurityVisitor {
  id: string;
  tenant_id: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_email?: string;
  id_type: string;
  id_number?: string;
  purpose: string;
  person_to_visit: string;
  badge_number: string;
  vehicle_plate?: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'ON_CAMPUS' | 'DEPARTED' | string;
  notes?: string;
  created_at: string;
}

export interface AuthorizedPickup {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  guardian_name: string;
  relationship: string;
  phone_number: string;
  id_card_number?: string;
  photo_url?: string;
  pin_code: string;
  status: 'ACTIVE' | 'REVOKED' | string;
  created_at: string;
}

export interface SecurityIncident {
  id: string;
  tenant_id: string;
  incident_date: string;
  title: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  description: string;
  reported_by: string;
  resolution_status: string;
  action_taken?: string;
  created_at: string;
}

export interface SecuritySummary {
  active_visitors: number;
  authorized_pickups: number;
  security_incidents: number;
  vehicles_logged: number;
}

export type SecuritySubtab = 'overview' | 'visitors' | 'pickups' | 'incidents';

export default function SecurityManager({
  initialSubtab = 'overview',
}: {
  initialSubtab?: SecuritySubtab;
}) {
  const [subtab, setSubtab] = useState<SecuritySubtab>(initialSubtab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [summary, setSummary] = useState<SecuritySummary>({
    active_visitors: 0,
    authorized_pickups: 0,
    security_incidents: 0,
    vehicles_logged: 0,
  });
  const [visitors, setVisitors] = useState<SecurityVisitor[]>([]);
  const [pickups, setPickups] = useState<AuthorizedPickup[]>([]);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedVisitorForPrint, setSelectedVisitorForPrint] = useState<SecurityVisitor | null>(null);

  // Form states
  const [newVisitor, setNewVisitor] = useState({
    visitor_name: '',
    visitor_phone: '',
    visitor_email: '',
    id_type: 'National ID / Driver License',
    id_number: '',
    purpose: 'Parent Inquiry / Consultation',
    person_to_visit: 'Principal',
    badge_number: '',
    vehicle_plate: '',
    notes: '',
  });

  const [newPickup, setNewPickup] = useState({
    student_name: '',
    class_name: 'JSS 1 Gold',
    guardian_name: '',
    relationship: 'Family Driver / Nanny',
    phone_number: '',
    id_card_number: '',
    photo_url: '',
    pin_code: '',
  });

  const [newIncident, setNewIncident] = useState({
    title: 'Perimeter Wall Inspection',
    category: 'PERIMETER_CHECK',
    severity: 'LOW',
    description: 'Routine morning security gate check. All perimeter lights and sensors operational.',
    reported_by: 'Gate Security Lead',
    action_taken: 'Logged and cleared in security logbook.',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api
        .get('/v1/campus/security')
        .catch(async () => await api.get('/campus/security'));

      if (res.data) {
        if (res.data.summary) setSummary(res.data.summary);
        setVisitors(res.data.visitors || []);
        setPickups(res.data.pickups || []);
        setIncidents(res.data.incidents || []);
      }
    } catch (err: any) {
      console.error('Failed to load security data:', err);
      setErrorMsg(err?.response?.data?.error || 'Failed to load security registry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckinVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitor.visitor_name.trim() || !newVisitor.visitor_phone.trim()) {
      alert('Visitor name and phone are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/security', {
        action: 'checkin_visitor',
        ...newVisitor,
      });
      setShowVisitorModal(false);
      setSuccessMsg('Visitor checked in and badge issued!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewVisitor({
        visitor_name: '',
        visitor_phone: '',
        visitor_email: '',
        id_type: 'National ID / Driver License',
        id_number: '',
        purpose: 'Parent Inquiry / Consultation',
        person_to_visit: 'Principal',
        badge_number: '',
        vehicle_plate: '',
        notes: '',
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to check-in visitor');
    } finally {
      setSaving(false);
    }
  };

  const handleRegisterPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPickup.student_name.trim() || !newPickup.guardian_name.trim()) {
      alert('Student name and guardian name are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/security', {
        action: 'register_pickup',
        ...newPickup,
      });
      setShowPickupModal(false);
      setSuccessMsg('Authorized pickup registered with verification PIN!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewPickup({
        student_name: '',
        class_name: 'JSS 1 Gold',
        guardian_name: '',
        relationship: 'Family Driver / Nanny',
        phone_number: '',
        id_card_number: '',
        photo_url: '',
        pin_code: '',
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to register pickup');
    } finally {
      setSaving(false);
    }
  };

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title.trim() || !newIncident.description.trim()) {
      alert('Incident title and description are required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/security', {
        action: 'report_incident',
        ...newIncident,
      });
      setShowIncidentModal(false);
      setSuccessMsg('Security incident report logged!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to log incident');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckoutVisitor = async (id: string) => {
    try {
      await api.post('/v1/campus/security', { action: 'checkout_visitor', id });
      setSuccessMsg('Visitor departure logged and badge returned!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to checkout visitor');
    }
  };

  const handleDeleteRecord = async (id: string, type: string) => {
    if (!confirm('Permanently delete this record?')) return;
    try {
      await api.delete(`/v1/campus/security?id=${id}&type=${type}`);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete record');
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.visitor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.badge_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.person_to_visit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
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
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Security, Gate Pass & Child Safeguarding</h2>
              <p className="text-xs text-gray-500">
                Visitor badge issuance, authorized dismissal pickup verification, vehicle logs, and perimeter safety audits.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVisitorModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition shadow-sm cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Check-In Visitor
          </button>
          <button
            onClick={() => setShowPickupModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <UserPlusIcon className="w-4 h-4" /> Authorized Pickup
          </button>
          <button
            onClick={() => setShowIncidentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-full hover:bg-rose-700 transition shadow-sm cursor-pointer"
          >
            <ExclamationTriangleIcon className="w-4 h-4" /> Log Incident
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
          Security Command
        </button>
        <button
          onClick={() => setSubtab('visitors')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'visitors'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Visitor Registry ({visitors.length})
        </button>
        <button
          onClick={() => setSubtab('pickups')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'pickups'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Child Dismissal Registry ({pickups.length})
        </button>
        <button
          onClick={() => setSubtab('incidents')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'incidents'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Perimeter Incidents ({incidents.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Visitors Currently on Campus</p>
          <p className="text-2xl font-bold text-[#146ef5] mt-1">{summary.active_visitors}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Authorized Pickups Enrolled</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.authorized_pickups}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Perimeter Safety Incidents</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{summary.security_incidents}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Gate Vehicles Logged</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{summary.vehicles_logged}</p>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {subtab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Visitors On-Campus */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#146ef5]" /> Visitors Currently Within School Premises
              </h3>
              <span className="text-xs bg-blue-50 text-[#146ef5] px-2.5 py-0.5 rounded-full font-bold">
                {visitors.filter((v) => v.status === 'ON_CAMPUS').length} On Campus
              </span>
            </div>

            {visitors.filter((v) => v.status === 'ON_CAMPUS').length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                All visitor badges returned. No external visitors currently on campus.
              </p>
            ) : (
              <div className="space-y-3">
                {visitors
                  .filter((v) => v.status === 'ON_CAMPUS')
                  .map((v) => (
                    <div key={v.id} className="p-3 bg-blue-50/40 border border-blue-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{v.visitor_name}</span>
                          <span className="text-[10px] bg-blue-100 text-[#146ef5] font-bold px-2 py-0.5 rounded">
                            {v.badge_number}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Visiting: {v.person_to_visit} · {v.purpose}</p>
                        <p className="text-[10px] text-gray-400">Entry: {v.check_in_time} {v.vehicle_plate ? `· Plate: ${v.vehicle_plate}` : ''}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedVisitorForPrint(v)}
                          title="Print Gate Pass"
                          className="p-1.5 text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCheckoutVisitor(v.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
                        >
                          <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" /> Departure
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Child Safeguarding Dismissal Roster */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <KeyIcon className="w-4 h-4 text-emerald-600" /> Child Pickup Verification Quick-Audit
            </h3>
            {pickups.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                No authorized pickup profiles registered. Click &quot;Authorized Pickup&quot; to enroll nannies or family drivers.
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {pickups.map((p) => (
                  <div key={p.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{p.student_name}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                          {p.class_name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Authorized: <strong>{p.guardian_name}</strong> ({p.relationship})
                      </p>
                      <p className="text-[10px] text-gray-400">Phone: {p.phone_number}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                        PIN: {p.pin_code}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Visitors Registry */}
      {subtab === 'visitors' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search visitor name or badge..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#146ef5]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white font-medium cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ON_CAMPUS">On Campus</option>
              <option value="DEPARTED">Departed</option>
            </select>
          </div>

          {filteredVisitors.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No visitor records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Badge</th>
                    <th className="py-3 px-4">Visitor & Phone</th>
                    <th className="py-3 px-4">Host / Department</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Vehicle Plate</th>
                    <th className="py-3 px-4">Time In / Out</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVisitors.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#146ef5]">{v.badge_number}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <div>{v.visitor_name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{v.visitor_phone}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{v.person_to_visit}</td>
                      <td className="py-3 px-4 text-gray-600">{v.purpose}</td>
                      <td className="py-3 px-4 text-gray-500 font-mono">{v.vehicle_plate || '—'}</td>
                      <td className="py-3 px-4 text-gray-500">
                        <div>In: {v.check_in_time}</div>
                        {v.check_out_time && <div className="text-[10px] text-gray-400">Out: {v.check_out_time}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'ON_CAMPUS'
                              ? 'bg-blue-100 text-[#146ef5]'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {v.status === 'ON_CAMPUS' && (
                          <button
                            onClick={() => handleCheckoutVisitor(v.id)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold hover:bg-emerald-100 cursor-pointer"
                          >
                            Exit
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedVisitorForPrint(v)}
                          title="Print Visitor Pass"
                          className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          <PrinterIcon className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(v.id, 'visitor')}
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

      {/* Tab 3: Authorized Pickups */}
      {subtab === 'pickups' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Authorized Student Pickup Registry</h3>
            <button
              onClick={() => setShowPickupModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
            >
              + Register Authorized Pickup
            </button>
          </div>

          {pickups.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No authorized pickup profiles registered.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pickups.map((p) => (
                <div key={p.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/40 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{p.guardian_name}</h4>
                      <p className="text-[10px] text-gray-500">{p.relationship}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      PIN: {p.pin_code}
                    </span>
                  </div>

                  <div className="mt-3 text-[11px] space-y-1">
                    <p><strong className="text-gray-700">Wards:</strong> {p.student_name} ({p.class_name})</p>
                    <p><strong className="text-gray-700">Phone:</strong> {p.phone_number}</p>
                    <p><strong className="text-gray-700">ID Ref:</strong> {p.id_card_number || 'Verified by Parent'}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
                    <span>Enrolled {p.created_at}</span>
                    <button
                      onClick={() => handleDeleteRecord(p.id, 'pickup')}
                      className="text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Incidents */}
      {subtab === 'incidents' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Security & Perimeter Incident Logs</h3>
            <button
              onClick={() => setShowIncidentModal(true)}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-full hover:bg-rose-700 transition cursor-pointer"
            >
              + Log Incident Report
            </button>
          </div>

          {incidents.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No security incidents recorded. Perimeter is secure.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Title & Category</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Reported By</th>
                    <th className="py-3 px-4">Resolution Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {incidents.map((i) => (
                    <tr key={i.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">{i.incident_date}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{i.title}</div>
                        <div className="text-[10px] text-gray-400">{i.category}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            i.severity === 'HIGH' || i.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {i.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs">{i.description}</td>
                      <td className="py-3 px-4 text-gray-600">{i.reported_by}</td>
                      <td className="py-3 px-4 text-gray-500">{i.action_taken || 'Resolved'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Check-in Visitor */}
      {showVisitorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Check-In Campus Visitor</h3>
              <button onClick={() => setShowVisitorModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCheckinVisitor} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newVisitor.visitor_name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitor_name: e.target.value })}
                  placeholder="e.g. Alh. Usman Danjuma"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newVisitor.visitor_phone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitor_phone: e.target.value })}
                    placeholder="+234 803 445 6789"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Vehicle License Plate</label>
                  <input
                    type="text"
                    value={newVisitor.vehicle_plate}
                    onChange={(e) => setNewVisitor({ ...newVisitor, vehicle_plate: e.target.value })}
                    placeholder="e.g. KSF-492-AA"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Person / Host to Visit *</label>
                  <input
                    type="text"
                    required
                    value={newVisitor.person_to_visit}
                    onChange={(e) => setNewVisitor({ ...newVisitor, person_to_visit: e.target.value })}
                    placeholder="e.g. Principal / Admissions Officer"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Visitor Badge Number</label>
                  <input
                    type="text"
                    value={newVisitor.badge_number}
                    onChange={(e) => setNewVisitor({ ...newVisitor, badge_number: e.target.value })}
                    placeholder="Leave blank for auto V-xxxx"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Purpose of Visit *</label>
                <input
                  type="text"
                  required
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  placeholder="e.g. Admissions Inquiry / Fee Payment / Maintenance"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVisitorModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer"
                >
                  {saving ? 'Checking in...' : 'Issue Badge & Check-In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Register Authorized Pickup */}
      {showPickupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Enroll Authorized Child Pickup</h3>
              <button onClick={() => setShowPickupModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegisterPickup} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newPickup.student_name}
                  onChange={(e) => setNewPickup({ ...newPickup, student_name: e.target.value })}
                  placeholder="e.g. Nicole Bassey"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Authorized Person Name *</label>
                  <input
                    type="text"
                    required
                    value={newPickup.guardian_name}
                    onChange={(e) => setNewPickup({ ...newPickup, guardian_name: e.target.value })}
                    placeholder="e.g. John Okon"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Relationship</label>
                  <input
                    type="text"
                    value={newPickup.relationship}
                    onChange={(e) => setNewPickup({ ...newPickup, relationship: e.target.value })}
                    placeholder="e.g. Family Driver / Aunt"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newPickup.phone_number}
                    onChange={(e) => setNewPickup({ ...newPickup, phone_number: e.target.value })}
                    placeholder="+234 802 111 2233"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Verification PIN Code (4 Digits)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newPickup.pin_code}
                    onChange={(e) => setNewPickup({ ...newPickup, pin_code: e.target.value })}
                    placeholder="e.g. 5821"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPickupModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {saving ? 'Enrolling...' : 'Enroll Pickup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Report Incident */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Log Security Incident</h3>
              <button onClick={() => setShowIncidentModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReportIncident} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Incident Title *</label>
                <input
                  type="text"
                  required
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  placeholder="e.g. Unauthorized Vehicle Attempt at Back Gate"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Severity</label>
                <select
                  value={newIncident.severity}
                  onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                >
                  <option value="LOW">Low (Routine Check)</option>
                  <option value="MEDIUM">Medium (Suspicious Activity)</option>
                  <option value="HIGH">High (Breach / Perimeter Alarm)</option>
                  <option value="CRITICAL">Critical (Immediate Escalation)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Action Taken</label>
                <input
                  type="text"
                  value={newIncident.action_taken}
                  onChange={(e) => setNewIncident({ ...newIncident, action_taken: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition cursor-pointer"
                >
                  {saving ? 'Logging...' : 'Log Security Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Print Visitor Pass */}
      {selectedVisitorForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-100 text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Visitor Campus Badge</h3>
              <button onClick={() => setSelectedVisitorForPrint(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-blue-50/20 text-xs space-y-2">
              <p className="font-bold text-gray-800 uppercase tracking-wider text-[10px]">Official Campus Visitor Pass</p>
              <div className="text-3xl font-mono font-black text-[#146ef5] py-2">{selectedVisitorForPrint.badge_number}</div>
              <p className="font-bold text-sm text-gray-900">{selectedVisitorForPrint.visitor_name}</p>
              <p className="text-gray-500 text-[11px]">Visiting: {selectedVisitorForPrint.person_to_visit}</p>
              <p className="text-gray-400 text-[10px]">In: {selectedVisitorForPrint.check_in_time} {selectedVisitorForPrint.vehicle_plate ? `· ${selectedVisitorForPrint.vehicle_plate}` : ''}</p>
              <p className="text-[10px] text-gray-400 border-t border-gray-200 pt-2">Please return badge to Security Gate on exit.</p>
            </div>
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer text-xs"
              >
                <PrinterIcon className="w-4 h-4" /> Print Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

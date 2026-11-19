'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import {
  fetchWebinarAttendees,
  dispatchWebinarCertificate,
  batchDispatchWebinarCertificates,
  updateAttendeeStatus,
  WebinarAttendee,
} from '@/lib/webinar-api';
import {
  Award,
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  RefreshCw,
  AlertCircle,
  Users,
  School,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Copy,
  Printer,
  X,
  MessageSquare,
  ChevronRight,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WebinarCertificatesPage() {
  const [attendees, setAttendees] = useState<WebinarAttendee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedAttendee, setSelectedAttendee] = useState<WebinarAttendee | null>(null);
  const [previewCertModal, setPreviewCertModal] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const certPrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAttendees();
  }, []);

  const loadAttendees = async () => {
    setLoading(true);
    try {
      const data = await fetchWebinarAttendees();
      setAttendees(data.registrations || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load webinar registrations');
    } finally {
      setLoading(false);
    }
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const total = attendees.length;
    const attended = attendees.filter(
      (a) => a.status === 'ATTENDED' || a.status === 'CERTIFICATE_DISPATCHED'
    ).length;
    const dispatched = attendees.filter(
      (a) => a.status === 'CERTIFICATE_DISPATCHED'
    ).length;
    const capacity = 150;
    const seatsLeft = Math.max(0, capacity - total);

    return { total, attended, dispatched, seatsLeft, capacity };
  }, [attendees]);

  // Unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = Array.from(new Set(attendees.map((a) => a.role))).filter(Boolean);
    return ['ALL', ...roles];
  }, [attendees]);

  // Filtered attendees
  const filteredAttendees = useMemo(() => {
    return attendees.filter((item) => {
      const matchesSearch =
        item.full_name.toLowerCase().includes(search.toLowerCase()) ||
        item.school_name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.toLowerCase().includes(search.toLowerCase()) ||
        (item.certificate_number &&
          item.certificate_number.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' || item.status === statusFilter;

      const matchesRole =
        roleFilter === 'ALL' || item.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [attendees, search, statusFilter, roleFilter]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredAttendees.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Status mutation handlers
  const handleToggleStatus = async (attendee: WebinarAttendee, newStatus: string) => {
    const ok = await updateAttendeeStatus(attendee.id, newStatus);
    if (ok) {
      toast.success(`Updated status to ${newStatus}`);
      setAttendees((prev) =>
        prev.map((a) => (a.id === attendee.id ? { ...a, status: newStatus } : a))
      );
      if (selectedAttendee && selectedAttendee.id === attendee.id) {
        setSelectedAttendee({ ...selectedAttendee, status: newStatus });
      }
    } else {
      toast.error('Failed to update status');
    }
  };

  // Single certificate dispatch
  const handleDispatchSingle = async (attendee: WebinarAttendee) => {
    setIsDispatching(true);
    const certNum =
      attendee.certificate_number ||
      `CERT-SSW-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const ok = await dispatchWebinarCertificate(
      attendee.id,
      certNum,
      `Certificate ${certNum} generated and dispatched on ${new Date().toLocaleDateString()}`
    );

    setIsDispatching(false);
    if (ok) {
      toast.success(`Certificate ${certNum} dispatched to ${attendee.full_name}!`);
      setAttendees((prev) =>
        prev.map((a) =>
          a.id === attendee.id
            ? {
                ...a,
                status: 'CERTIFICATE_DISPATCHED',
                certificate_number: certNum,
              }
            : a
        )
      );
      if (selectedAttendee && selectedAttendee.id === attendee.id) {
        setSelectedAttendee({
          ...selectedAttendee,
          status: 'CERTIFICATE_DISPATCHED',
          certificate_number: certNum,
        });
      }
    } else {
      toast.error('Failed to dispatch certificate');
    }
  };

  // Batch certificate dispatch
  const handleBatchDispatch = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one attendee');
      return;
    }
    setIsDispatching(true);
    const ok = await batchDispatchWebinarCertificates(selectedIds);
    setIsDispatching(false);
    if (ok) {
      toast.success(`Dispatched certificates to ${selectedIds.length} attendees!`);
      loadAttendees();
      setSelectedIds([]);
    } else {
      toast.error('Failed to batch dispatch certificates');
    }
  };

  // WhatsApp generator
  const getWhatsAppLink = (attendee: WebinarAttendee) => {
    const cleanPhone = attendee.phone.replace(/[^0-9]/g, '');
    const certInfo = attendee.certificate_number
      ? ` Your Official Certificate of Completion ID is *${attendee.certificate_number}*. You can verify it at https://resultspro.ng/verify`
      : '';
    const message = encodeURIComponent(
      `Hello ${attendee.full_name},\n\nThank you for participating in the *Smart School Masterclass Edition 01: Free & Easy EOT Results Processing* hosted by ResultsPro on Sunday, 29th November 2026.\n\n${certInfo}\n\nWe look forward to partnering with ${attendee.school_name} to streamline your examination synthesis!`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Export CSV
  const handleExportCSV = () => {
    if (attendees.length === 0) {
      toast.error('No registrations to export');
      return;
    }

    const headers = [
      'Registration ID',
      'Full Name',
      'Role',
      'School Name',
      'Location',
      'Email',
      'WhatsApp Phone',
      'Student Population',
      'Status',
      'Certificate ID',
      'Registered At',
    ];

    const rows = attendees.map((a) => [
      `"${a.id}"`,
      `"${a.full_name}"`,
      `"${a.role}"`,
      `"${a.school_name}"`,
      `"${a.state_location}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.estimated_students || ''}"`,
      `"${a.status}"`,
      `"${a.certificate_number || 'N/A'}"`,
      `"${a.registered_at}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Smart_School_Webinar_Roster_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Roster CSV downloaded successfully');
  };

  // Trigger Print for Certificate
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        title="Webinar & Certificate Dispatcher"
        subtitle="Manage masterclass registrations, verify attendance, and issue institutional certificates of professional competence"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Event Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1060] via-[#1A1FA8] to-[#121685] p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide text-amber-300 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                SMART SCHOOL MASTERCLASS · EDITION 01
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Free & Easy EOT Results Processing
              </h1>
              <p className="text-sm text-indigo-100/90 max-w-2xl leading-relaxed">
                Live interactive walkthrough showing Nigerian school proprietors, principals,
                and exam officers how to end calculation headaches, automate position rankings, and generate digital report cards in minutes.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/80 pt-2">
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Sunday, 29th November 2026
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-amber-400" />
                  05:00 PM – 06:00 PM WAT
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Institutional Certificate Accredited
                </span>
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
              <button
                onClick={handleBatchDispatch}
                disabled={isDispatching || selectedIds.length === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-md hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Award className="w-4 h-4" />
                Dispatch Selected ({selectedIds.length})
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/15 transition-all"
              >
                <Download className="w-4 h-4" />
                Export Roster CSV
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Registrations
                </p>
                <p className="text-3xl font-extrabold text-[#0D1060] mt-1">
                  {metrics.total}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Across 6 Nigerian Geopolitical Zones
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verified Attendees
                </p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">
                  {metrics.attended}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {metrics.total > 0
                    ? `${Math.round((metrics.attended / metrics.total) * 100)}% attendance rate`
                    : 'Awaiting session'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Certificates Dispatched
                </p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                  {metrics.dispatched}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Verifiable via ResultsPro Registry
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Available Seats
                </p>
                <p className="text-3xl font-extrabold text-[#1A1FA8] mt-1">
                  {metrics.seatsLeft}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Out of {metrics.capacity} Zoom capacity
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-[#1A1FA8]">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, school, email, phone, or cert ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1FA8]/20 focus:border-[#1A1FA8] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Role Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1A1FA8]/20"
                >
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>
                      {role === 'ALL' ? 'All Roles & Designations' : role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={loadAttendees}
                disabled={loading}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Refresh registrations"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {[
              { id: 'ALL', label: 'All Registrations', count: attendees.length },
              {
                id: 'ATTENDED',
                label: 'Attended (Ready for Certificate)',
                count: attendees.filter((a) => a.status === 'ATTENDED').length,
              },
              {
                id: 'CERTIFICATE_DISPATCHED',
                label: 'Certificate Dispatched',
                count: attendees.filter((a) => a.status === 'CERTIFICATE_DISPATCHED').length,
              },
              {
                id: 'REGISTERED',
                label: 'Registered Only',
                count: attendees.filter((a) => a.status === 'REGISTERED').length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-[#0D1060] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    statusFilter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Attendees Roster Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredAttendees.length > 0 &&
                        selectedIds.length === filteredAttendees.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#1A1FA8] focus:ring-[#1A1FA8]"
                    />
                  </th>
                  <th className="py-4 px-4">Participant & Role</th>
                  <th className="py-4 px-4">School & Location</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Status & Certificate ID</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="inline-flex items-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#1A1FA8]" />
                        Loading registered participants...
                      </div>
                    </td>
                  </tr>
                ) : filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">No participants found</p>
                        <p className="text-xs text-slate-500">
                          Try adjusting your search query or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map((attendee) => {
                    const isSelected = selectedIds.includes(attendee.id);

                    return (
                      <tr
                        key={attendee.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isSelected ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(attendee.id)}
                            className="rounded border-slate-300 text-[#1A1FA8] focus:ring-[#1A1FA8]"
                          />
                        </td>

                        {/* Name & Role */}
                        <td className="py-4 px-4">
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {attendee.full_name}
                            </span>
                            <span className="inline-block mt-0.5 text-xs text-[#1A1FA8] font-medium">
                              {attendee.role}
                            </span>
                            {attendee.pain_points && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 max-w-xs">
                                <span className="font-semibold text-slate-600">Pain:</span>{' '}
                                {attendee.pain_points}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* School & Location */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-800 text-xs block">
                              {attendee.school_name}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{attendee.state_location}</span>
                            </div>
                            {attendee.estimated_students && (
                              <span className="inline-block text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {attendee.estimated_students}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-4 px-4">
                          <div className="space-y-1 text-xs">
                            <a
                              href={`mailto:${attendee.email}`}
                              className="flex items-center gap-1.5 text-slate-600 hover:text-[#1A1FA8] transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[160px]">{attendee.email}</span>
                            </a>
                            <a
                              href={getWhatsAppLink(attendee)}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{attendee.phone}</span>
                            </a>
                          </div>
                        </td>

                        {/* Status & Certificate */}
                        <td className="py-4 px-4">
                          <div className="space-y-1.5">
                            {attendee.status === 'CERTIFICATE_DISPATCHED' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                <Award className="w-3.5 h-3.5 text-emerald-600" />
                                Dispatched
                              </span>
                            ) : attendee.status === 'ATTENDED' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                                Attended
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                Registered
                              </span>
                            )}

                            {attendee.certificate_number ? (
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 w-fit">
                                <span>{attendee.certificate_number}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(attendee.certificate_number || '');
                                    toast.success('Certificate ID copied');
                                  }}
                                  title="Copy certificate ID"
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Certificate Preview Button */}
                            <button
                              onClick={() => {
                                setSelectedAttendee(attendee);
                                setPreviewCertModal(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#1A1FA8] hover:bg-slate-100 transition-colors"
                              title="Preview Official Certificate"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* WhatsApp Direct Chat */}
                            <a
                              href={getWhatsAppLink(attendee)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Send WhatsApp Notification"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>

                            {/* Dispatch Certificate CTA */}
                            {attendee.status !== 'CERTIFICATE_DISPATCHED' ? (
                              <button
                                onClick={() => handleDispatchSingle(attendee)}
                                disabled={isDispatching}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0D1060] hover:bg-[#1A1FA8] text-white text-xs font-bold transition-all shadow-sm"
                              >
                                <Award className="w-3.5 h-3.5" />
                                Dispatch
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDispatchSingle(attendee)}
                                disabled={isDispatching}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
                                title="Re-issue and notify"
                              >
                                Re-issue
                              </button>
                            )}

                            {/* Status Quick Toggle */}
                            <select
                              value={attendee.status}
                              onChange={(e) => handleToggleStatus(attendee, e.target.value)}
                              className="text-[11px] font-medium border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 text-slate-700 focus:outline-none"
                            >
                              <option value="REGISTERED">Registered</option>
                              <option value="ATTENDED">Attended</option>
                              <option value="CERTIFICATE_DISPATCHED">Dispatched</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Official Certificate Modal */}
      {previewCertModal && selectedAttendee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1A1FA8]" />
                <h3 className="text-base font-bold text-slate-900">
                  Official Certificate of Professional Competence
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  Print / Save PDF
                </button>
                {selectedAttendee.status !== 'CERTIFICATE_DISPATCHED' && (
                  <button
                    onClick={() => handleDispatchSingle(selectedAttendee)}
                    disabled={isDispatching}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Confirm & Dispatch
                  </button>
                )}
                <a
                  href={getWhatsAppLink(selectedAttendee)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Send WhatsApp
                </a>
                <button
                  onClick={() => setPreviewCertModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Certificate Document Area */}
            <div className="p-6 sm:p-10 bg-[#FAF9F5] flex justify-center">
              <div
                ref={certPrintRef}
                className="w-full max-w-3xl bg-white rounded-xl shadow-lg border-8 border-[#0D1060] p-8 sm:p-12 relative overflow-hidden"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(26, 31, 168, 0.02) 0%, rgba(0, 0, 0, 0.04) 100%)',
                }}
              >
                {/* Guilloche Corner Accents */}
                <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-amber-500" />
                <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-amber-500" />
                <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-amber-500" />
                <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-amber-500" />

                {/* Inner Border */}
                <div className="border border-slate-200 p-6 sm:p-8 text-center space-y-6">
                  {/* Institutional Header */}
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-amber-600">
                      ResultsPro Academic Systems · ScholarsNG
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wider text-[#0D1060] uppercase">
                      Certificate of Completion
                    </h2>
                    <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">
                      Institutional Continuing Professional Development (CPD)
                    </p>
                  </div>

                  {/* Recipient Presentation */}
                  <div className="space-y-2 py-4">
                    <p className="text-xs text-slate-500 italic">
                      This is to certify that
                    </p>
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-[#0D1060] border-b-2 border-slate-300 pb-2 inline-block px-8 min-w-[280px]">
                      {selectedAttendee.full_name}
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {selectedAttendee.role} · {selectedAttendee.school_name}
                    </p>
                  </div>

                  {/* Statement of Accomplishment */}
                  <div className="max-w-xl mx-auto space-y-3">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      has successfully completed the comprehensive technical masterclass on
                    </p>
                    <p className="text-base sm:text-lg font-bold text-[#1A1FA8]">
                      Smart School Masterclass: Free & Easy EOT Results Processing
                    </p>
                    <p className="text-xs text-slate-500">
                      Demonstrating mastery in:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700 pt-1">
                      <div className="bg-slate-50 py-1.5 px-2 rounded border border-slate-200">
                        01 AI Assisted Data Entry
                      </div>
                      <div className="bg-slate-50 py-1.5 px-2 rounded border border-slate-200">
                        02 Affective & Psychomotor Domains
                      </div>
                      <div className="bg-slate-50 py-1.5 px-2 rounded border border-slate-200">
                        03 1-Click Broadsheet Synthesis
                      </div>
                      <div className="bg-slate-50 py-1.5 px-2 rounded border border-slate-200">
                        04 Digital Results & Scratch Cards
                      </div>
                    </div>
                  </div>

                  {/* Footer Signatures & Certificate Verification Seal */}
                  <div className="pt-8 grid grid-cols-3 items-end text-center gap-4 border-t border-slate-200">
                    {/* Left: Date & Location */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800">
                        29th November 2026
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase">
                        Date of Issue
                      </p>
                    </div>

                    {/* Center: Official Seal */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500 bg-amber-50/70 flex flex-col items-center justify-center p-1 text-center shadow-inner">
                        <Award className="w-6 h-6 text-amber-600 mb-0.5" />
                        <span className="text-[7px] font-black tracking-tighter text-[#0D1060] uppercase">
                          ResultsPro Verified
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 mt-1">
                        {selectedAttendee.certificate_number || 'PENDING DISPATCH'}
                      </span>
                    </div>

                    {/* Right: Signature */}
                    <div className="space-y-1">
                      <div className="font-serif italic text-base font-bold text-[#0D1060]">
                        Ifeanyi Felix
                      </div>
                      <div className="border-t border-slate-300 w-32 mx-auto pt-0.5">
                        <p className="text-[10px] font-bold text-slate-800 uppercase">
                          Lead Architect
                        </p>
                        <p className="text-[9px] text-slate-500">
                          ResultsPro & ScholarsNG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

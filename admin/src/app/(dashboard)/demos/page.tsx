'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { fetchDemoBookings, updateDemoBookingStatus } from '@/lib/api';
import {
  Calendar,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
  Sparkles,
  Layers,
  Wifi,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DemoBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [smeFilter, setSmeFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchDemoBookings();
      setBookings(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load demo bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const ok = await updateDemoBookingStatus(id, newStatus);
    if (ok) {
      toast.success(`Booking status changed to ${newStatus}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }));
      }
    } else {
      toast.error('Failed to update status');
    }
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const newLeads = bookings.filter((b) => (b.status || 'NEW').toUpperCase() === 'NEW').length;
    const virtual = bookings.filter((b) => (b.demo_format || '').toLowerCase().includes('virtual')).length;
    const onPrem = bookings.filter((b) => (b.demo_format || '').toLowerCase().includes('physical') || (b.demo_format || '').toLowerCase().includes('on-prem')).length;
    const completed = bookings.filter((b) => (b.status || '').toUpperCase() === 'COMPLETED').length;

    return { total, newLeads, virtual, onPrem, completed };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchName = (b.full_name || '').toLowerCase().includes(q);
        const matchInst = (b.institution_name || '').toLowerCase().includes(q);
        const matchEmail = (b.email || '').toLowerCase().includes(q);
        const matchRef = (b.reference_code || '').toLowerCase().includes(q);
        if (!matchName && !matchInst && !matchEmail && !matchRef) return false;
      }
      // Status
      if (statusFilter !== 'ALL' && (b.status || 'NEW').toUpperCase() !== statusFilter) {
        return false;
      }
      // SME
      if (smeFilter !== 'ALL' && !((b.organization_type || '').toLowerCase().includes(smeFilter.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [bookings, search, statusFilter, smeFilter]);

  const getStatusBadge = (status: string) => {
    const s = (status || 'NEW').toUpperCase();
    switch (s) {
      case 'NEW':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">New Lead</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">Contacted</span>;
      case 'SCHEDULED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-200">Scheduled</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Completed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="w-full">
      <Header
        title="Enterprise Demo Bookings"
        subtitle="Manage inbound institutional walkthroughs, SME complexity profiles, and demo scheduling"
      />

      <div className="px-1 sm:px-4 md:p-8 py-4 sm:py-6 space-y-6 w-full">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-slate-400">Total Inbound</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Registered requests</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-blue-600">Pending Action</span>
              <Clock3 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-extrabold text-blue-600">{stats.newLeads}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting walkthrough contact</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-purple-600">Virtual Demos</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-extrabold text-purple-600">{stats.virtual}</p>
            <p className="text-xs text-slate-500 mt-1">Google Meet / Zoom sessions</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-emerald-600">On-Premises</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600">{stats.onPrem}</p>
            <p className="text-xs text-slate-500 mt-1">Physical campus delegations</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by institution, lead name, email, or ref ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm border border-transparent focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={smeFilter}
              onChange={(e) => setSmeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All SME Types</option>
              <option value="K-12">K-12 Private Schools</option>
              <option value="Tertiary">Tertiary Institutions</option>
              <option value="Bootcamp">Bootcamps & Training</option>
              <option value="Government">Ministries & SUBEB</option>
              <option value="Tutoring">Tutoring Hubs</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] mb-3" />
            <p className="text-sm">Loading enterprise demo bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Demo Bookings Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No demo bookings match your search query or filters. New submissions from <code>/demo</code> will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b: any) => {
              const cleanPhone = (b.phone || '').replace(/[^0-9+]/g, '');
              const waNumber = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone.replace('+', '');
              const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${b.full_name}, this is the ResultsPRO team regarding your scheduled demo (${b.reference_code}) for ${b.institution_name}.`)}`;

              return (
                <div
                  key={b.id || b.reference_code}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0D1060] bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                        {b.reference_code}
                      </span>
                      {getStatusBadge(b.status)}
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                        {b.organization_type || 'K-12 School'}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-yellow-50 text-amber-800 border border-amber-200">
                        {b.student_count || '250–1000'} students
                      </span>
                    </div>

                    {/* Institution and Lead Title */}
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <span>{b.institution_name}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{b.full_name}</span>
                        <span>•</span>
                        <span>{b.role || 'Proprietor / Administrator'}</span>
                      </p>
                    </div>

                    {/* Schedule & Slot */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{b.preferred_date || 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{b.preferred_time || '10:00 AM WAT'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-slate-500">
                        <Wifi className="w-3.5 h-3.5 text-purple-600" />
                        <span>{b.demo_format || 'Virtual Screen-Share'}</span>
                      </div>
                    </div>

                    {/* Requested Modules */}
                    {b.selected_solutions && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Modules:</span>
                        {b.selected_solutions.split(',').map((sol: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200"
                          >
                            {sol.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Status:</span>
                      <select
                        value={(b.status || 'NEW').toUpperCase()}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none cursor-pointer hover:border-slate-300 shadow-xs"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition shadow-xs"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:${b.email}?subject=${encodeURIComponent(`ResultsPRO Executive Demo Confirmation: ${b.institution_name} (${b.reference_code})`)}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition shadow-xs"
                        title="Send Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </a>

                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold hover:bg-slate-200 transition shadow-xs"
                      >
                        <span>Blueprint</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Blueprint Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0D1060] bg-slate-100 px-2 py-0.5 rounded">
                    {selectedBooking.reference_code}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {selectedBooking.institution_name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Lead: {selectedBooking.full_name} ({selectedBooking.role})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Blueprint Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">SME Category</span>
                  <span className="font-bold text-slate-800">{selectedBooking.organization_type}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Scale & Campuses</span>
                  <span className="font-bold text-slate-800">{selectedBooking.student_count} • {selectedBooking.campus_count}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Infrastructure Reality</span>
                  <span className="font-bold text-slate-800">{selectedBooking.infrastructure}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Legacy Data Migration</span>
                  <span className="font-bold text-slate-800">{selectedBooking.migration_need}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Timeline</span>
                  <span className="font-bold text-slate-800">{selectedBooking.timeline}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Demo Format & Slot</span>
                  <span className="font-bold text-slate-800">{selectedBooking.preferred_date} at {selectedBooking.preferred_time} ({selectedBooking.demo_format})</span>
                </div>
              </div>

              {/* Tagged Pain Points */}
              {selectedBooking.pain_points && (
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Core Pain Points Tagged:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBooking.pain_points.split(',').map((p: string, idx: number) => (
                      <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
                        {p.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requested Modules */}
              {selectedBooking.selected_solutions && (
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Requested Solutions to Demo:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBooking.selected_solutions.split(',').map((s: string, idx: number) => (
                      <span key={idx} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lead Notes */}
              {selectedBooking.notes && (
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block mb-1">Lead Notes & Specific Requests:</span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                  <a href={`mailto:${selectedBooking.email}`} className="font-bold text-blue-600 underline">
                    {selectedBooking.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone / WhatsApp</span>
                  <span className="font-bold text-slate-800">{selectedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <select
                    value={(selectedBooking.status || 'NEW').toUpperCase()}
                    onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                    className="mt-0.5 text-xs font-bold px-2 py-1 rounded border border-slate-300 bg-white"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowUpRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}

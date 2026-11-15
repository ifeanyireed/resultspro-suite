'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  CalendarIcon,
  XMarkIcon,
  TrashIcon,
  PrinterIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export interface CampusFacility {
  id: string;
  tenant_id: string;
  name: string;
  facility_type: string;
  capacity: number;
  location: string;
  hourly_rate: number;
  equipment_available: string;
  status: string;
}

export interface CampusFacilityBooking {
  id: string;
  tenant_id: string;
  facility_id: string;
  facility_name: string;
  event_title: string;
  booked_by: string;
  department: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  attendees_estimate: number;
  status: string;
  notes: string;
  created_at: string;
}

export interface FacilitiesSummary {
  total_venues: number;
  active_bookings: number;
  confirmed_bookings: number;
  pending_approval: number;
}

export type FacilitiesSubtab = 'overview' | 'venues' | 'bookings' | 'equipment';

interface FacilitiesManagerProps {
  initialSubtab?: FacilitiesSubtab;
}

export default function FacilitiesManager({
  initialSubtab = 'overview',
}: FacilitiesManagerProps) {
  const [subtab, setSubtab] = useState<FacilitiesSubtab>(initialSubtab);
  const [summary, setSummary] = useState<FacilitiesSummary>({
    total_venues: 0,
    active_bookings: 0,
    confirmed_bookings: 0,
    pending_approval: 0,
  });
  const [facilities, setFacilities] = useState<CampusFacility[]>([]);
  const [bookings, setBookings] = useState<CampusFacilityBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [printBooking, setPrintBooking] = useState<CampusFacilityBooking | null>(null);

  // Form states
  const [facilityForm, setFacilityForm] = useState({
    name: '',
    facility_type: 'AUDITORIUM',
    capacity: 250,
    location: '',
    hourly_rate: 0,
    equipment_available: 'Projector, PA System, 4 Wireless Mics, Air Conditioning',
  });

  const [bookingForm, setBookingForm] = useState({
    facility_id: '',
    event_title: '',
    booked_by: '',
    department: 'Academics',
    start_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_date: new Date().toISOString().split('T')[0],
    end_time: '12:00',
    attendees_estimate: 150,
    notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await api
        .get('/v1/campus/facilities')
        .catch(async () => await api.get('/campus/facilities'));

      if (res?.data) {
        if (res.data.summary) setSummary(res.data.summary);
        if (Array.isArray(res.data.facilities)) setFacilities(res.data.facilities);
        if (Array.isArray(res.data.bookings)) setBookings(res.data.bookings);
      }
    } catch (err: any) {
      console.error('Failed to load facilities data:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to connect to campus facilities service');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.name.trim()) return;

    try {
      setIsSubmitting(true);
      await api
        .post('/v1/campus/facilities', {
          action: 'create_facility',
          ...facilityForm,
        })
        .catch(async () => {
          return await api.post('/campus/facilities', {
            action: 'create_facility',
            ...facilityForm,
          });
        });

      setIsFacilityModalOpen(false);
      setFacilityForm({
        name: '',
        facility_type: 'AUDITORIUM',
        capacity: 250,
        location: '',
        hourly_rate: 0,
        equipment_available: 'Projector, PA System, 4 Wireless Mics, Air Conditioning',
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create facility');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.facility_id || !bookingForm.event_title.trim()) return;

    const matchedFacility = facilities.find((f) => f.id === bookingForm.facility_id);
    const facilityName = matchedFacility ? matchedFacility.name : 'Campus Venue';

    try {
      setIsSubmitting(true);
      await api
        .post('/v1/campus/facilities', {
          action: 'book_facility',
          facility_name: facilityName,
          ...bookingForm,
        })
        .catch(async () => {
          return await api.post('/campus/facilities', {
            action: 'book_facility',
            facility_name: facilityName,
            ...bookingForm,
          });
        });

      setIsBookingModalOpen(false);
      setBookingForm({
        facility_id: '',
        event_title: '',
        booked_by: '',
        department: 'Academics',
        start_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_date: new Date().toISOString().split('T')[0],
        end_time: '12:00',
        attendees_estimate: 150,
        notes: '',
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to reserve facility');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveBooking = async (id: string) => {
    try {
      await api
        .post('/v1/campus/facilities', {
          action: 'approve_booking',
          id,
        })
        .catch(async () => {
          return await api.post('/campus/facilities', {
            action: 'approve_booking',
            id,
          });
        });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to approve booking');
    }
  };

  const filteredFacilities = facilities.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.facility_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.facility_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.booked_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#0D1060] via-[#146ef5] to-[#0D1060] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300 border border-white/20">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span>Campus Infrastructure & Venue Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Facilities & Venue Reservation Engine
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
              Coordinate auditoriums, sports arenas, digital laboratories, and seminar halls. Prevent double-booking conflicts, track audiovisual equipment, and issue official event clearance permits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsFacilityModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 shadow-sm"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Register Venue</span>
            </button>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Book Facility</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BuildingOfficeIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.total_venues}</div>
            <div className="text-xs font-medium text-slate-500">Total Venues & Halls</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.active_bookings}</div>
            <div className="text-xs font-medium text-slate-500">Total Bookings</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.confirmed_bookings}</div>
            <div className="text-xs font-medium text-slate-500">Confirmed Events</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{summary.pending_approval}</div>
            <div className="text-xs font-medium text-slate-500">Pending Approvals</div>
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
            onClick={() => setSubtab('venues')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subtab === 'venues'
                ? 'bg-[#0D1060] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Venues Directory ({facilities.length})
          </button>
          <button
            onClick={() => setSubtab('bookings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subtab === 'bookings'
                ? 'bg-[#0D1060] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Event Reservations ({bookings.length})
          </button>
          <button
            onClick={() => setSubtab('equipment')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subtab === 'equipment'
                ? 'bg-[#0D1060] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            AV & Resource Inventory
          </button>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Refresh Facilities"
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
          placeholder="Search venues, event titles, organizers, or departments..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-xs"
        />
      </div>

      {/* Tab 1: Overview & Telemetry */}
      {subtab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">Upcoming Event Reservations</h3>
                <button
                  onClick={() => setSubtab('bookings')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All ({bookings.length}) →
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No upcoming venue bookings scheduled.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{b.event_title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>📍 {b.facility_name}</span>
                          <span>🗓️ {b.start_date} ({b.start_time} - {b.end_time})</span>
                          <span>👤 {b.booked_by} ({b.department})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'PENDING' && (
                          <button
                            onClick={() => handleApproveBooking(b.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => setPrintBooking(b)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600"
                          title="Print Clearance Slip"
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Venue Capacities */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-4">Venue Capacity Breakdown</h3>
              {facilities.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No venues registered yet.</div>
              ) : (
                <div className="space-y-3">
                  {facilities.slice(0, 5).map((f) => (
                    <div key={f.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                        <span>{f.name}</span>
                        <span className="text-blue-600">{f.capacity} Seats</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">📍 {f.location} · {f.facility_type}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Venues Directory */}
      {subtab === 'venues' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">All Campus Venues & Halls</h3>
            <button
              onClick={() => setIsFacilityModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Facility</span>
            </button>
          </div>

          {filteredFacilities.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <BuildingOfficeIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-slate-700">No Facilities Found</div>
              <div className="text-xs text-slate-500 mt-1">Register school halls, labs, or sport grounds.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredFacilities.map((f) => (
                <div key={f.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{f.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {f.facility_type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>📍 {f.location}</span>
                      <span>👥 {f.capacity} Seating Capacity</span>
                      <span>💡 Equipment: {f.equipment_available}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                      {f.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Event Reservations */}
      {subtab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Facility Bookings & Reservations</h3>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold flex items-center gap-1.5"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-slate-700">No Reservations Found</div>
              <div className="text-xs text-slate-500 mt-1">Book an auditorium or seminar room for campus events.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <div key={b.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{b.event_title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>📍 {b.facility_name}</span>
                      <span>🗓️ {b.start_date} ({b.start_time} - {b.end_time})</span>
                      <span>👤 {b.booked_by} ({b.department})</span>
                      <span>👥 {b.attendees_estimate} Attendees</span>
                    </div>
                    {b.notes && <div className="text-xs text-slate-400 italic">Notes: {b.notes}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === 'PENDING' && (
                      <button
                        onClick={() => handleApproveBooking(b.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => setPrintBooking(b)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600"
                      title="Print Clearance Slip"
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

      {/* Tab 4: AV & Resource Inventory */}
      {subtab === 'equipment' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-2">Campus Audiovisual & Event Equipment</h3>
          <p className="text-xs text-slate-500 mb-6">
            Permanent and mobile event equipment assigned to campus facilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="font-bold text-sm text-slate-900 mb-1">📽️ Digital 4K Laser Projectors</div>
              <div className="text-xs text-slate-600">6 Units Active across Main Hall & Lecture Theatres</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="font-bold text-sm text-slate-900 mb-1">🎤 Wireless UHF Microphone Sets</div>
              <div className="text-xs text-slate-600">12 Channels with battery recharging stations</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="font-bold text-sm text-slate-900 mb-1">🔊 Line-Array PA Audio Towers</div>
              <div className="text-xs text-slate-600">Auditorium & Sports Ground Mobile Sound System</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Register Facility */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register Campus Venue / Facility</h3>
              <button
                onClick={() => setIsFacilityModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFacility} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue / Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nelson Mandela Memorial Hall"
                  value={facilityForm.name}
                  onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Facility Type</label>
                  <select
                    value={facilityForm.facility_type}
                    onChange={(e) => setFacilityForm({ ...facilityForm, facility_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="AUDITORIUM">Auditorium / Main Hall</option>
                    <option value="SPORTS_ARENA">Sports Ground / Arena</option>
                    <option value="LABORATORY">Science / Computer Lab</option>
                    <option value="CONFERENCE">Boardroom / Conference</option>
                    <option value="CLASSROOM">Special Lecture Theatre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={facilityForm.capacity}
                    onChange={(e) => setFacilityForm({ ...facilityForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Physical Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block C, Academic Quadrangle"
                  value={facilityForm.location}
                  onChange={(e) => setFacilityForm({ ...facilityForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available Equipment</label>
                <input
                  type="text"
                  placeholder="e.g. Projector, AC, Sound System, Whiteboard"
                  value={facilityForm.equipment_available}
                  onChange={(e) => setFacilityForm({ ...facilityForm, equipment_available: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFacilityModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Register Venue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: New Booking */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">New Facility Booking / Event Reservation</h3>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Venue *</label>
                <select
                  required
                  value={bookingForm.facility_id}
                  onChange={(e) => setBookingForm({ ...bookingForm, facility_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option value="">-- Choose Venue --</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.capacity} Seats, {f.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Inter-School Science Colloquium"
                  value={bookingForm.event_title}
                  onChange={(e) => setBookingForm({ ...bookingForm, event_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organized By (Staff / Club) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. K. Oladipo"
                    value={bookingForm.booked_by}
                    onChange={(e) => setBookingForm({ ...bookingForm, booked_by: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={bookingForm.department}
                    onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.start_date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, start_date: e.target.value, end_date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={bookingForm.start_time}
                      onChange={(e) => setBookingForm({ ...bookingForm, start_time: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={bookingForm.end_time}
                      onChange={(e) => setBookingForm({ ...bookingForm, end_time: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Attendees</label>
                <input
                  type="number"
                  value={bookingForm.attendees_estimate}
                  onChange={(e) => setBookingForm({ ...bookingForm, attendees_estimate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold disabled:opacity-50"
                >
                  {isSubmitting ? 'Reserving...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Print Clearance Pass */}
      {printBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
                Official Campus Clearance
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Facility Reservation Permit</h2>
              <p className="text-[11px] text-slate-500">Estate Management & Facilities Directorate</p>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Event Title:</span>
                <span className="font-bold text-slate-900">{printBooking.event_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Venue Allocated:</span>
                <span className="font-bold text-slate-900">{printBooking.facility_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Schedule:</span>
                <span className="font-bold text-slate-900">
                  {printBooking.start_date} ({printBooking.start_time} - {printBooking.end_time})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organizer:</span>
                <span className="font-bold text-slate-900">{printBooking.booked_by}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900">{printBooking.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Attendees:</span>
                <span className="font-bold text-slate-900">{printBooking.attendees_estimate} Estimated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700">{printBooking.status}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-center text-[10px] text-slate-500 border border-slate-200">
              This clearance permit must be presented to campus security marshals for hall access.
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setPrintBooking(null)}
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
